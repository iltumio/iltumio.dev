---
title: "How I managed multi-agent worktrees in a large Rust codebase"
date: "2026-08-27"
description: "Six problems that only show up when a big Rust repo meets ten agents in ten worktrees: snapshots, a shared target dir, its build lock, duplicated compilation, orphaned artifacts, and copy-on-write. One fix each."
---

I run agents in parallel. Each one gets a git worktree of the same Rust workspace, so they can build a different feature without stepping on each other's checkout. That part works.

Everything underneath it did not. On 2026-08-22 I went looking for why the machine felt slow and found ten worktrees of the same repo all building into **one** `target/` directory. 974 GB of artifacts that nothing ever collected. Roughly 1.2 TB written to the NVMe in six hours. "Parallel" agents that were quietly taking turns behind a lock.

That was not one bug, it was six, stacked in a way where each one hid the next:

1. The disk kept filling up, and deleting build output gave nothing back.
2. Ten worktrees were sharing a single `target/`, which broke builds in ways that looked like Cargo bugs.
3. Cargo's lock on that shared directory turned ten parallel agents into a queue.
4. Once each worktree had its own target dir, the same dependency graph was compiled and stored once per worktree.
5. Removing a worktree left hundreds of GB of build output behind.
6. Every rebuild was paying for copy-on-write, compression and checksums on files nobody wants checksummed.

The order matters, because I fixed them in roughly that order and each fix exposed the next problem.

## Not a big repo? Probably not worth it

If one checkout builds quickly and you only have a couple of agents in flight, stop here. This is machinery for a problem you do not have. These six failures need two ingredients before the setup earns its keep.

The first is a large Rust workspace. A crate-heavy project pulls in a dependency graph where `target/debug/deps` is tens of gigabytes before you have written anything, and most of those bytes are other people's code compiled for your feature set.

The second is parallelism by worktree. When you hand each agent its own worktree of the same repo, you multiply that target directory by the number of things you have in flight, and you multiply the build frequency too: an agent compiles far more often than I do, because compiling is how it checks its own work. Ten agents on ten features is ten full dependency graphs being rebuilt all day.

At that scale the filesystem stops being a detail. Mine is btrfs on LUKS, with the usual Arch subvolume layout:

```
UUID=...  /                     btrfs  rw,relatime,compress=zstd:3,ssd,space_cache=v2,subvol=/@
UUID=...  /home                 btrfs  rw,relatime,compress=zstd:3,ssd,space_cache=v2,subvol=/@home
UUID=...  /var/cache/pacman/pkg btrfs  ...,subvol=/@pkg
UUID=...  /var/log              btrfs  ...,subvol=/@log
```

snapper takes snapshots of `/` and keeps five, and `limine-snapper-sync` wires them into the boot menu. That's a good deal for a system directory. As you are about to see, it's a terrible deal for build output.

## Problem 1: I deleted 200 GB and got nothing back

The first symptom was the ordinary one. Free space kept shrinking, I deleted a couple of stale `target/` directories, and the number barely moved. Delete 200 GB, get back a few hundred megabytes.

**A snapshot is a reference.** If a snapshot still points at the extents behind those object files, unlinking them frees nothing. snapper was keeping five snapshots of `/`, so I was keeping five generations of object files I'll never link again. Build output is the worst possible thing to snapshot: it's large, it's rewritten constantly, and it's regenerable by definition. Nobody has ever rolled back a system snapshot to recover a `.rlib`.

There's a second, sneakier version of the same confusion. btrfs allocates space in chunks and doesn't give them back on its own, so deleting a huge target dir frees space *inside* chunks that are already allocated. `df` looks healthy while the allocator is running out of room to hand out. Right now mine reads 1.8 TiB total, 1.0 TiB allocated, 895 GiB used. 43% unallocated is the number that actually matters, and it's the one `df` doesn't show you.

### The fix: a subvolume that snapshots step over

Build artifacts moved to `/.cargo-targets`, and that path is a btrfs subvolume nested inside `@`, not a plain directory:

```bash
sudo btrfs subvolume create /.cargo-targets
```

The trick is that **btrfs snapshots are not recursive**. When snapper snapshots `/`, a nested subvolume appears in the snapshot as an empty directory. No references are taken, so nothing is pinned, so a `rm -rf` of a 200 GB target dir actually returns 200 GB. I didn't have to configure an exclusion anywhere: the subvolume boundary *is* the exclusion, and it keeps working when I forget I set it up.

You can check whether a path is a subvolume root without root privileges, because a subvolume root always has inode 256:

```bash
$ stat -c %i /.cargo-targets
256
$ stat -c %i /.cargo-targets/targets   # a plain directory inside it
257
```

My kache store lives in there too (`/.cargo-targets/kache`), for the same reason. A content-addressed build cache is regenerable by definition; snapshotting it is pure cost.

## Problem 2: ten worktrees, one `target/`

With space accounted for honestly, the next question was why there was so much of it in one place. All ten worktrees were building into the main checkout's target directory, and I never configured that. Cargo did it for me.

Cargo walks *up* from wherever the build runs looking for `.cargo/config.toml`. My worktrees live inside the main checkout:

```
app-backend/                       ← main checkout, has .cargo/config.toml
├── .claude/worktrees/feat-search/ ← no config of its own
└── .worktrees/parser-rewrite/
```

A worktree without a config of its own finds the main checkout's, and silently builds into the main checkout's target dir. Nothing errors. Nothing warns.

During development that shows up as noise you blame on Cargo. Builds that should have been incremental start from scratch because another worktree just rebuilt the same crates with a different feature set. Test binaries that were there ten minutes ago are gone. An agent reports a compile error, you check out its branch yourself, and it builds fine. The directory grows the whole time, because ten trees are keeping near-duplicate copies of the same dependency graph in one place.

### The fix: give every worktree a config file of its own

That's a POSIX-sh script, `cargo-target-provision`:

```sh
# Repo identity: the shared .git is the same for every worktree of a repo.
common_dir=$(git -C "$root" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)
if [ -z "$common_dir" ]; then
    key=$(basename "$root")                       # not a git repo at all
else
    main_worktree=$(dirname "$common_dir")
    if [ "$(basename "$common_dir")" = ".git" ]; then
        repo=$(basename "$main_worktree")         # ordinary checkout
    else
        repo=$(basename "$common_dir" .git)       # bare, or --separate-git-dir
    fi
    toplevel=$(git -C "$root" rev-parse --show-toplevel 2>/dev/null || echo "$root")
    if [ "$toplevel" = "$main_worktree" ]; then wt=main; else wt=$(basename "$toplevel"); fi
    key="$repo/$wt"
fi

target="$BASE/$key/target"

printf '%s\n[build]\ntarget-dir = "%s"\n' "$MARKER" "$target" > "$root/.cargo/config.toml"
```

Everything ends up under `/.cargo-targets/targets/<repo>/<worktree>/target`. The main checkout is keyed `main`, which is its *role*, not its branch, so renaming a branch doesn't orphan 200 GB.

Four details in this design earned their place the hard way:

**Write a config file, not an environment variable.** `CARGO_TARGET_DIR` is the obvious answer and it's the wrong one. An exported variable is frozen into the shell that exported it. Agent sessions, editor build tasks, git hooks, and `just` recipes aren't that shell, and none of them re-run your `.bashrc`. A config file is read by Cargo from wherever the build actually runs, whoever started it. I verified the difference the only way that counts, from a login shell with both variables unset:

```
$ env -u CARGO_TARGET_DIR -u CARGO_TARGET_BASE_DIR bash -lc \
    'cargo metadata --no-deps --offline --format-version 1' | jq -r .target_directory
/.cargo-targets/targets/app-backend/feat-search/target
```

**Never clobber a config the repo owns.** Some repos ship their own `.cargo/config.toml` with linker flags or a cross-compile target (four of mine do). The script checks for its own `# managed-by:` marker, and if the file is foreign it touches nothing, prints the path it *would* have used, and exits 3 so the caller can export the variable instead. Check the pre-2020 spelling too: a bare `.cargo/config` is still honoured by Cargo, and writing a `config.toml` next to one earns you a warning on every build and an ambiguity you won't enjoy debugging. If you do want those repos isolated on disk rather than per-shell, add `[build] target-dir` to their config **by hand and without the marker**, or the tool will decide the file is its own and rewrite your linker flags away.

**Clamp the upward walk to the worktree.** The provisioner is handed a project root; finding that root is the caller's job, and the obvious "walk up until you find `Cargo.toml`" loop reproduces the original bug. From inside a nested worktree it walks straight past that worktree's own `Cargo.toml` and lands on the main checkout's. The walk has to stop at `git rev-parse --show-toplevel`.

**Do not require git, or any particular repo.** Every `git` call in there has a fallback, and the key falls back to the directory's own name when there is no repository at all, so a downloaded crate or a scratch project still gets an isolated target dir instead of an error. When there *is* a repo, the common dir may end in `.git` rather than being named `.git` (a bare clone, or `--separate-git-dir`), so the repo name is taken with the suffix stripped. The script has no list of repos it knows about and no configuration file of its own; it derives everything from the path it was handed. That's what lets the same forty lines of shell serve every checkout on the machine.

## Problem 3: the agents were a queue, not a pool

The shared directory cost disk. It also cost the thing I was actually buying with all those worktrees.

Cargo takes an **exclusive lock on the target directory**: there's a `target/debug/.cargo-lock`, and a second `cargo build` waits on it. Ten agents pointed at one target dir aren't building in parallel, they're taking turns, and each turn invalidates the other's incremental state because the feature unification differs. You pay the disk cost of one shared directory *and* the wall-clock cost of a queue, which is the worst trade available.

This is the problem that hides best. Nothing fails. Every agent finishes eventually, so the only evidence is that ten agents don't feel ten times faster than one, and you put that down to the machine being busy. It was busy. It was busy waiting on itself.

Per-worktree target dirs fix this for free: separate directories, separate locks, ten builds actually running at once. But only if the config file is *there*, which brings up the real requirement.

### The fix, part two: provisioning has to happen without a shell

Provisioning is only useful if it happens without me remembering, and without a human being in the loop at all. There are two triggers, and they cover different worlds.

**On `cd`, per shell.** fish has a `PWD` event; bash has `PROMPT_COMMAND`. Both call the same script, and both do exactly two things a config file cannot: provision a checkout nobody has provisioned yet, and handle the exit-3 case by exporting `CARGO_TARGET_DIR` for repos whose config they must not touch.

Two caveats if you write the bash half. `PROMPT_COMMAND` may be an array (mine is; mise owns it here), so append, don't assign; and re-sourcing your rc file must not append twice:

```bash
if [[ -v PROMPT_COMMAND && ${PROMPT_COMMAND@a} == *a* ]]; then
    [[ " ${PROMPT_COMMAND[*]} " == *" __cargo_update_target_dir "* ]] ||
        PROMPT_COMMAND+=(__cargo_update_target_dir)
else
    case ";${PROMPT_COMMAND-};" in
        *";__cargo_update_target_dir;"*) ;;
        *) PROMPT_COMMAND="${PROMPT_COMMAND:+${PROMPT_COMMAND%;};}__cargo_update_target_dir" ;;
    esac
fi
```

`PROMPT_COMMAND` also fires on every prompt, not every `cd`, so the function's first act is to compare `$PWD` against the last one it saw and return if nothing moved.

**On checkout, machine-wide. This is the one that matters for agents.** `git worktree add` runs the `post-checkout` hook, and a hook is a git process, not a shell: it fires for agents, editors and scripts that never source an rc file. A worktree an agent created at 3am gets its config before the first `cargo build` runs in it.

The first two versions of this were both wired *into the repo*, and both were wrong.

Version one had the shell hook write a `post-checkout` script into `.git/hooks` on entry, skipping the file if something already owned it. Which is precisely what happens in a repo using rusty-hook: rusty-hook generates that file, would regenerate over anything I put there anyway, and my hook installer quietly returned. Nothing was installed, nothing complained, and that repo ran that way until I found ten of its worktrees sharing one target dir.

Version two accepted defeat and routed through the generator: a `post-checkout` entry in the repo's `.rusty-hook.toml`, pointing at a script under `scripts/`. That works, and it's still wrong. It fires only in the repo that declares it, and every other Rust checkout on the machine goes back to sharing a target dir, which is the bug I set out to fix. It fires only when rusty-hook itself is installed and has written its shims, so a fresh clone or a missing `cargo install` means no provisioning and no error. And it commits a personal disk-layout preference into a shared repository, where it's noise for everyone who doesn't have my `/.cargo-targets` or my tools on PATH.

So provisioning left the repo entirely. It belongs to the machine, so it lives in a global hooks directory:

```bash
git config --global core.hooksPath ~/.config/git/hooks
```

**Do not do that without a delegation shim.** Setting `core.hooksPath` makes git ignore `.git/hooks` *entirely*, everywhere. rusty-hook, pre-commit, lefthook: all of them stop running, in every repo on the machine, and nothing tells you. So the global hook does its own work first and then hands over:

```sh
# The repository's own hooks dir. NOT `git rev-parse --git-path hooks`: with
# core.hooksPath set that resolves to *this* directory, and we would exec
# ourselves forever.
common=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)
local_hook="$common/hooks/$(basename "$0")"

# ... machine-level work here ...

# exec, not a call: the repo hook inherits our stdin untouched (pre-push and
# pre-receive read it) and its exit status becomes ours (pre-commit gates on it).
[ -x "$local_hook" ] && exec "$local_hook" "$@"
exit 0
```

One symlink per hook name points at that script. A few hook names are deliberately **not** symlinked, because for them an empty stub isn't neutral: `push-to-checkout` and `proc-receive` replace git's default behaviour by merely existing, `fsmonitor-watchman` speaks a protocol, and `reference-transaction` and `post-index-change` are called several times per ref update, so a global stub there taxes every fetch on the machine.

With that in place, rusty-hook and the repo are out of the loop in both directions. The repo's own `pre-commit` and `pre-push` checks still run, since they're exactly what the shim `exec`s into, and they never learn that anything ran before them. The provisioning no longer cares whether the repo uses rusty-hook, husky, lefthook or nothing at all, whether it has been `cargo install`ed today, or whether anyone remembered to commit a hooks config.

The price of running in *every* repo on the machine is that the machine-level half has to be timid, because `post-checkout` fires on every `git checkout` and must never break one:

- it returns immediately unless the worktree root has a `Cargo.toml`;
- it provisions on any checkout of a Rust root, but only looks for leftovers when git's third argument is `1`, meaning a branch checkout, which is what `git worktree add` produces, and never on a file checkout;
- it swallows every failure of the tools it calls, and never reads stdin, which belongs to whatever hook it's about to delegate to;
- if `cargo-target-provision` isn't on `PATH`, it does nothing at all.

That last one is the real safety property: on a repo it has never seen, in a language it doesn't care about, on a machine where the tools aren't installed, the global hook is indistinguishable from no hook. `GIT_HOOKS_SKIP=1` turns the machine half off while leaving delegation intact, and `GIT_HOOKS_DEBUG=1` prints what it decided and where it handed over.

Husky is the exception, incidentally: `husky install` writes `core.hooksPath` into the repo's *local* config, which outranks the global one. Those repos never reach the shim, and never needed it.

## Problem 4: isolation made every worktree rebuild the world

Per-worktree target dirs restored correctness and parallelism, but they also removed the only reuse Cargo had between those builds. A crate already present in `main/target` is invisible to `feat-search/target`. The second worktree starts from an empty directory and compiles `serde`, `tokio`, `axum` and the rest of the dependency graph again; with ten agents, ten isolated target dirs can mean ten copies of almost the same build.

Pointing every worktree back at one target dir would recover that reuse by giving up the isolation that fixed problems 2 and 3. The builds would be back behind one lock, with feature sets invalidating each other. The target dirs need to stay separate; the reusable compiler output needs to be shared somewhere else.

### The fix: share artifacts with kache, not the target dir

[kache](/blog/switching-from-sccache-to-kache) runs as a `RUSTC_WRAPPER` and keeps compiled artifacts in a content-addressed store. The first worktree compiles a given set of inputs. When another worktree asks for the same crate with the same compiler inputs, kache restores the artifact instead of invoking rustc again.

The restore is zero-copy on my btrfs filesystem: kache reflinks the cached blob into each worktree's target dir, and falls back to a hardlink on filesystems without reflink support. They are filesystem links rather than symbolic links, so Cargo still sees ordinary files at the paths it expects. Each worktree keeps its own directory and its own Cargo lock, while identical artifacts share physical storage underneath.

That closes both sides of the regression introduced by isolation: warm worktrees stop recompiling unchanged dependencies, and their separate target dirs stop consuming a full physical copy of every identical artifact. They still look large when measured independently with `du`; the saving shows up at the filesystem level.

## Problem 5: dead worktrees left 200 GB ghosts

The fix for problems 2 and 3 created two follow-on costs. kache handled the repeated builds, but it could not decide when an entire worktree-specific target dir was no longer needed.

Now that every worktree builds into its own directory outside the repo, `git worktree remove` deletes the checkout and nothing else. The target directory survives as an orphan that nothing will ever collect, and those are the big ones: a feature branch an agent worked on for a day can leave 200 GB behind, keyed to a worktree that no longer exists. Ten agents finishing ten features a week is a leak with a schedule.

### The fix: a tool that keeps checkouts and target dirs in step

`worktree-prune`:

```
$ worktree-prune --list
  NAME                        BRANCH                            STATE       DIRTY   TARGET
  app-backend                 main                              main        0       23.4 GiB
  docs-sweep                  docs/api-reference                pushed      0       607.8 MiB
  feat-search                 feat/search-substrate             pushed      0       65.0 GiB
  report-gaps                 analysis/report-gaps              local-only  3       250.9 GiB
  parser-rewrite              feat/parser-rewrite               pushed      1       182.5 GiB
  ...                         (8 more, nothing built in them yet)

  522.4 GiB across 13 worktrees
```

It's dry-run by default and refuses anything whose only copy is local: uncommitted changes, untracked files, or commits that are on no remote and no long-lived branch. That rule exists because agent worktrees are exactly where unpushed work hides. `--orphans` sweeps target dirs no worktree claims; `--stale` finds worktree directories git no longer registers.

The global `post-checkout` hook is already running at every checkout, so it's also where the leftovers get noticed: after provisioning, it asks `worktree-prune` to report what nothing claims any more. With `WORKTREE_PRUNE_AUTO=1` it sweeps the orphans instead of reporting them. Only orphans, never a checkout. A hook isn't allowed to be surprising.

`--stale` exists because of a failure I didn't predict. Any worktree where I had run the docker stack owned a root-created bind-mount directory (`docker/.mailpit-data`). `git worktree remove` deletes files until it hits a path it can't unlink, fails with `Permission denied`, and by then it has **already deregistered the worktree**. What's left is a directory git no longer knows about, holding a few hundred surviving files, still keyed to a 19 GiB target dir that `--orphans` alone wouldn't attribute to anything. So the tool checks for foreign-owned paths *before* invoking git, and finishes the job itself if git bails midway.

The other thing worth building in: a leftover directory has to *prove* it belongs to the repo before anything offers to delete it. Worktrees often share a parent directory with unrelated clones, and "unregistered" isn't the same as "ours". A `.git` file pointing into this repo's common dir counts. A `.git` *directory* is an independent clone and is never a worktree. I found that one by pointing the tool at a test layout and watching it politely offer to delete a sibling repository.

## Problem 6: every rebuild paid for copy-on-write it didn't need

The last one was never about space. It was about why ten parallel builds made the whole machine feel sticky, including the parts that weren't compiling.

Rebuilding a crate rewrites the same object file over and over. On a copy-on-write filesystem, each rewrite allocates new extents instead of overwriting in place, `compress=zstd:3` compresses every one of them on the way down, checksums are computed for all of it, and dm-crypt sits underneath the whole thing. That's the worst-case workload for that stack: many small files, rewritten constantly, whose contents nobody cares about after the link step. Multiply it by ten agents that rebuild all day and you get the 1.2 TB of writes in six hours I started with.

### The fix: `nodatacow` on the build subvolume

```bash
sudo chattr +C /.cargo-targets
```

`nodatacow` means rewrites happen in place: no new extent per write, no compression, no checksums for those files. Losing checksums on build output is a trade I'll take every time. If an object file is corrupt, I delete the directory.

Two things about that command are worth knowing, because I got both wrong.

**It only applies to entries created afterwards.** `chattr +C` on a directory doesn't convert what's already inside; it sets the default for new entries. On my own machine, right now:

```
$ lsattr -d /.cargo-targets/targets/app-backend/{main,docs-sweep,parser-rewrite}/target
---------------C------ .../main/target
---------------------- .../docs-sweep/target
---------------------- .../parser-rewrite/target
```

`main` was created after I set the flag and inherited it. The others predate it and are still paying CoW and zstd on every rebuild. The flag isn't retroactive and there's no `chattr -R` that fixes it honestly. You delete the directory and let it be recreated, which is one more reason to have a pruning tool from problem 5. I'm doing exactly that as worktrees retire.

**`nodatacow` and snapshots don't compose.** If a snapshot references a nodatacow file, the next write to it still has to copy-on-write once, because the snapshot needs the old extent. So this fix only delivers what it promises on top of the fix for problem 1: dedicated subvolume first, then the flag.

## The result: thirteen worktrees, thirteen real build lanes

Thirteen worktrees, thirteen distinct target directories, no collisions, no queue. 522 GiB of build output on a subvolume that snapshots step over, plus one 94.5 GiB orphan I haven't swept yet.

A caveat on measurement: summing `du` across those directories gives about 1.4 TiB while the filesystem reports 895 GiB used, because [kache](/blog/switching-from-sccache-to-kache) reflinks identical artifacts across trees on btrfs (and uses hardlinks where reflinks are unavailable). A separate `du` invocation per directory counts each shared blob again. Trust `df` and `btrfs filesystem usage`, not the sum of your `du` calls.

I found these problems in the order above, but that's not the order to fix them in. From scratch: subvolume, then `chattr +C`, then per-worktree configs, then the global hook, kache, and only then the pruning tool. You want the thing that *creates* target dirs correctly before the thing that shares or deletes their artifacts, and all of them on a subvolume that already has the right flags, so nothing has to be recreated twice.

Two warnings to close on. If you already have a version of this wired into one repo (a `post-checkout` entry in a hooks config, a script under `scripts/`), delete it once the global hook is in place, rather than leaving two provisioners racing on the same `.cargo/config.toml`. And whatever you do, do not set a global `core.hooksPath` without the delegation shim. That one fails silently, in every repo you own, until the day a pre-commit hook you were relying on turns out not to have run for a month.
