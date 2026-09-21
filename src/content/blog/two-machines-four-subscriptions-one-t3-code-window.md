---
title: "Two machines, four subscriptions, one T3 Code window"
date: "2026-09-18"
description: "I turned an underused mini PC into a machine that runs coding agents in the background: TypeScript and React work there, the Rust core stays on my main workstation, and T3 Code drives both from the same window."
---

I had a mini PC sitting around doing almost nothing. Decent performance, nothing exceptional: fine for a build, not the machine you want compiling a large Rust workspace. It ran a couple of services and spent the rest of its life idle.

It is now the machine that runs my coding agents in the background. It has its own hostname, `agents`, its own subscriptions, and its own copies of the repos where I don't mind waiting. My main workstation keeps the work that actually needs the hardware. And I drive both from a single [T3 Code](https://github.com/pingdotgg/t3code) window, where threads on the two machines sit side by side in the same sidebar.

The interesting part isn't the hardware, it's the split: **which work goes where, and why the boundary follows the workload rather than the machine.**

## Two machines, two kinds of work

My main workstation is the fast one, and it keeps the core: a large Rust workspace, with the worktrees, the build caches and the btrfs tuning I wrote about in [the previous post](/blog/how-i-managed-multi-agent-worktrees-in-a-large-rust-codebase). Rust compilation is exactly the workload that rewards a fast CPU and a fast NVMe, and it's the code where I want a compile-test loop that comes back in seconds, not minutes.

The mini PC gets the TypeScript and React work: frontends, API layers, small tools, the kind of task where the agent spends its time in `tsc`, a dev server, a test runner, a package install. Those run perfectly well on middling hardware. Nobody notices whether a Vite build takes eight seconds or eighteen when the whole thing is happening on a machine in the other room while you're doing something else.

```
main workstation (192.168.1.178)        agents, mini PC (192.168.1.143)
┌───────────────────────────┐           ┌───────────────────────────┐
│ T3 Code desktop (the UI)  │           │ t3 server (managed svc)   │
│                           │    SSH    │   127.0.0.1:3773          │
│ local environment         │◄─────────►│                           │
│   ├─ Grok  (native)       │  tunnel   │ remote environment        │
│   └─ DeepSeek (OpenCode)  │           │   ├─ Claude Code (Pro)    │
│                           │           │   └─ Codex (ChatGPT Pro)  │
│ Rust core, worktrees,     │           │ TypeScript / React repos  │
│ build caches              │           │ running in the background │
└───────────────────────────┘           └───────────────────────────┘
```

So the rule isn't "heavy work goes to the other machine". It's the opposite of what you'd expect from a spare box: **the machine with the weaker hardware runs the work that isn't hardware-bound, and it runs it in the background, where latency doesn't matter.** The fast machine keeps the loop I'm actually sitting in front of.

That doesn't mean I sit there watching the agent work. Even on my workstation, I start a thread and come back to it only when it needs me: a question to answer, a plan to approve, a diff to review. The rest of the time goes to everything else my job is made of. The difference between the two machines is how much they wait for each other. When an agent on the workstation does call me back, the build and test cycle I jump into answers in seconds, because the Rust core is where that cycle has to be fast.

## Environments: where a thread actually runs

The key word in T3 Code is **environment**. An environment is a T3 server with its own identity (a UUID in `~/.t3/userdata/environment-id`), its own settings, its own provider list, its own state database and its own worktrees. The desktop app is just a client, and it can connect to several environments at once. T3 Code doesn't treat "remote" as a special case of "local": a server on the same machine and a server at the other end of an SSH connection look exactly the same in the UI.

That's what makes the split practical: **everything a thread does happens in the environment it belongs to.** The agent process, the subscription it's logged into, `git`, the checkout, the compiler, the tests, the containers: all of it runs on that machine. What crosses the network is a stream of events: messages, tool calls, diffs, terminal output. Text, in other words. Rendering it costs my workstation about as much as a chat app.

So the React repos only exist on the mini PC, and their `node_modules`, dev servers and test runs stay there. The Rust workspace only exists on the workstation, along with the hundreds of gigabytes of build artifacts that come with it. Neither machine needs a copy of the other's work, and the agents on the mini PC never compete with my own compile loop for CPU or disk.

## Background work that keeps running

Offloading the work would be half a benefit if it stopped whenever I stopped watching it. It doesn't, because of how the remote server runs.

The workstation connects to `agents` over SSH. T3 Code installs a self-contained runtime on the remote machine and starts the server as a **managed service**, not as a child of the SSH session:

```
$ cat ~/.t3/userdata/server-runtime.json
{"version":1,"pid":17183,"port":3773,"origin":"http://127.0.0.1:3773","startedAt":"2026-09-18T16:51:44.546Z","serviceManaged":true}
```

`serviceManaged: true` means the server's lifetime is decoupled from the connection. The SSH tunnel is only how I *watch* the work; it isn't what keeps the work alive. I can quit T3 Code, reboot my workstation, or walk away for the evening: the tunnel drops, and the agents on the mini PC carry on. When the client reconnects, the sidebar catches up and the threads are where I left them, usually with more work done.

That's what changes day to day. I start two or three threads on the mini PC in the morning, answer their first few questions, and then get on with the rest of my day. The frontend tasks make progress in a window I'm not looking at, and I come back to diffs to review instead of a queue of things I still have to start.

The same file shows the other half of the design: the origin is `127.0.0.1`. The server on the mini PC only listens on loopback, and the workstation reaches it through SSH. A coding agent server is, by design, a thing that runs arbitrary commands as your user, and none of it is exposed on the LAN. The only port the network sees is `sshd`, with key-only auth, which was there already.

```
$ ss -tn | grep -E ':22 |:3773'
ESTAB  192.168.1.143:22     192.168.1.178:45026
ESTAB  127.0.0.1:51610      127.0.0.1:3773
```

## One subscription per provider, and where each one lives

Each environment has its own `settings.json` with its own provider instances. On the mini PC only two are enabled:

```json
{
  "providers": {
    "cursor":   { "enabled": false },
    "grok":     { "enabled": false },
    "opencode": { "enabled": false }
  },
  "providerInstances": {
    "claudeAgent": {
      "driver": "claudeAgent",
      "enabled": true,
      "config": {
        "binaryPath": "/home/manuel/.local/share/mise/installs/claude/latest/claude"
      }
    },
    "codex": {
      "driver": "codex",
      "enabled": true,
      "config": {
        "binaryPath": "/home/manuel/.local/bin/codex"
      }
    }
  }
}
```

The workstation is the mirror image: Grok and OpenCode enabled, Claude and Codex off.

T3 Code doesn't hold your credentials. It drives each provider's own CLI, which is logged in on the machine where it runs. On the mini PC the provider check comes back as `Claude Pro Subscription` for Claude Code and `ChatGPT Pro 5x Subscription` for Codex. So "which subscription does this thread use?" has a simple answer: **the one logged in on the machine that runs the thread.** Picking an environment when I create a thread is also picking an account.

Splitting the four subscriptions across the two machines means they never queue behind each other. Claude and Codex are paid monthly, with usage windows that reset on their own, so they belong on the machine that's always on and always has something queued: the background runs on the mini PC keep them busy while I'm doing something else. Grok and DeepSeek stay on the workstation for shorter tasks: a quick question, a second opinion on a diff, a one-off refactor in whatever I have open. DeepSeek goes through OpenCode, the generic provider in T3 Code, which is the natural home for any model without a dedicated integration.

## One window for both

What ties it together is that none of this costs me a second interface. Without T3 Code, using a repurposed second machine means an SSH session, a terminal multiplexer, and a running mental map of which agent is doing what over there. In practice that friction is enough that the spare machine goes back to being idle.

Instead, both environments are in the same sidebar. A thread is labelled with its environment and its provider, so I can see at a glance that the React refactor is running on the mini PC under Claude and the Rust threads are local. Starting a thread on the other machine takes exactly one extra choice at creation time, reviewing its diff is the same UI as any local thread, and its terminal output is right there when a build fails.

The decision I make is just: *does this work need the fast machine?* If it touches the Rust core, it stays on the workstation, where the hardware pays off. If not, it goes to the mini PC and runs in the background. An idle machine turned into a second pair of hands, and I didn't have to change how I work to use it.
