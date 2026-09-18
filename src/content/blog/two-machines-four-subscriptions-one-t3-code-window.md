---
title: "Two machines, four subscriptions, one T3 Code window"
date: "2026-09-18"
description: "How I split coding agents across two PCs on the same LAN: a laptop that drives, a box that works in the background, and Claude, Codex, Grok and DeepSeek each running where it makes sense. All in one T3 Code window."
---

I have two PCs on the same home network and four places to get a coding agent from: a Claude subscription, a ChatGPT subscription for Codex, Grok, and DeepSeek.

The expensive part of an agent isn't the model, which runs in someone else's datacenter. It's everything around it: the checkout, the builds, the test suites, the language servers, the Docker containers the agent spins up to check its own work. Run a few agents in parallel on a large Rust workspace and your laptop stops being a laptop. The fans spin up, the battery drains, and every keystroke in your editor competes with ten `cargo build`s.

So I moved that work off the laptop. [T3 Code](https://github.com/pingdotgg/t3code) runs on my laptop as the window I work in, but the heavy threads run on the other PC, a box on the same LAN whose hostname is literally `agents`. Both machines show up in the same sidebar. I start a long task on `agents`, and my laptop stays as idle as if nothing were happening.

## The split: one machine drives, one machine works

The two machines have different jobs.

**The laptop drives.** It runs the T3 Code desktop app, which is where I read diffs, answer questions and review PRs. It's also an environment of its own, with two providers enabled: Grok, through T3 Code's native Grok provider, and DeepSeek, through the OpenCode provider.

**`agents` works.** It sits at `192.168.1.143`, it doesn't sleep, and it holds the long-running stuff: the big repos, the worktrees and the build caches from [the previous post](/blog/how-i-managed-multi-agent-worktrees-in-a-large-rust-codebase). It runs the other two providers: Claude Code on a Claude Pro subscription, and Codex on a ChatGPT Pro subscription.

```
laptop (192.168.1.178)                  agents (192.168.1.143)
┌───────────────────────────┐           ┌───────────────────────────┐
│ T3 Code desktop (the UI)  │           │ t3 server (managed svc)   │
│                           │    SSH    │   127.0.0.1:3773          │
│ local environment         │◄─────────►│                           │
│   ├─ Grok  (native)       │  tunnel   │ remote environment        │
│   └─ DeepSeek (OpenCode)  │           │   ├─ Claude Code (Pro)    │
│                           │           │   └─ Codex (ChatGPT Pro)  │
└───────────────────────────┘           └───────────────────────────┘
```

## Environments: where a thread actually runs

The key word in T3 Code is **environment**. An environment is a T3 server with its own identity (a UUID in `~/.t3/userdata/environment-id`), its own settings, its own provider list, its own state database and its own worktrees. The desktop app is just a client, and it can connect to several environments at once. T3 Code doesn't treat "remote" as a special case of "local": a server on the same machine and a server at the other end of an SSH connection look exactly the same in the UI.

The consequence is what makes this setup worth having: **everything a thread does happens in the environment it belongs to.** The agent process, the subscription it's logged into, `git`, the checkout, the compiler, the tests, the containers: all of it runs on that machine. What crosses the network to the laptop is a stream of events: messages, tool calls, diffs, terminal output. That's text. Rendering it costs the laptop about as much as a chat app.

So when a Claude thread on `agents` spends forty minutes rebuilding a workspace and running the test suite over and over, the laptop pays none of it. No CPU, no RAM, no disk I/O, no battery. I can have a call, compile something of my own, or close the lid, and the agent's work doesn't slow down, and neither does mine.

## Background work that survives the laptop

Offloading the resources would only be half the benefit if the work stopped when the laptop did. It doesn't, because of how the remote server runs.

The laptop connects to `agents` over SSH. T3 Code installs a self-contained runtime on the remote machine and starts the server as a **managed service**, not as a child of my SSH session:

```
$ cat ~/.t3/userdata/server-runtime.json
{"version":1,"pid":17183,"port":3773,"origin":"http://127.0.0.1:3773","startedAt":"2026-09-18T16:51:44.546Z","serviceManaged":true}
```

`serviceManaged: true` means the server's lifetime is decoupled from the connection. The SSH tunnel is only how the laptop *watches* the work; it isn't what keeps the work alive. If I close the lid, take the laptop to another room, or it goes to sleep, the tunnel drops, but the server and every agent running under it keep going. When I open the laptop again, the client reconnects, the sidebar catches up, and the threads are where I left them, usually with more work done.

That changes how I hand out work. Before, starting a long task meant committing the laptop to it for the duration. Now I can start three or four threads on `agents` at the end of the day, answer their first questions, and close the laptop. The next morning I have diffs to review instead of a machine that ran hot all night on my desk.

The same origin shows the other half of the design: `127.0.0.1`. The server on `agents` only listens on loopback, and the laptop reaches it through SSH. A coding agent server is, by design, a thing that runs arbitrary commands as your user, and none of it is exposed on the LAN. The only port the network sees is `sshd`, with key-only auth, which was there already.

```
$ ss -tn | grep -E ':22 |:3773'
ESTAB  192.168.1.143:22     192.168.1.178:45026
ESTAB  127.0.0.1:51610      127.0.0.1:3773
```

## One subscription per provider, and where each one lives

Each environment has its own `settings.json` with its own provider instances. On `agents` only two are enabled:

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

The laptop is the mirror image: Grok and OpenCode enabled, Claude and Codex off.

T3 Code doesn't hold your credentials. It drives each provider's own CLI, which is logged in on the machine where it runs. On `agents` the provider check comes back as `Claude Pro Subscription` for Claude Code and `ChatGPT Pro 5x Subscription` for Codex. So "which subscription does this thread use?" has a simple answer: **the one logged in on the machine that runs the thread.** When I create a thread, picking an environment is also picking an account and a machine to spend resources on.

I split the providers this way for three reasons.

**The flat-rate subscriptions go on the machine that never sleeps.** Claude Pro and ChatGPT Pro are paid by the month, with usage windows that reset on their own. The value comes from keeping them busy, and background runs that span a lunch break or a night need a machine that stays awake. That's `agents`.

**The heavy work goes where the build caches are.** Claude and Codex get the long, multi-hour tasks in big repos, and those repos, their worktrees and hundreds of gigabytes of Rust target dirs live on `agents`. The laptop doesn't need a copy of any of it.

**Grok and DeepSeek handle quick, interactive tasks, so the laptop is fine for them.** I use them for quick questions, second opinions on a diff, small scripts and one-off refactors in whatever I have open locally. Those are tasks I'm watching anyway, they finish in minutes, and they never compete with the background runs on `agents` for CPU or disk. DeepSeek goes through OpenCode, the generic provider in T3 Code, which is the natural home for any model that doesn't have a dedicated integration.

## How I route work

In practice, routing a task is one decision when I create the thread: *am I going to sit and watch this?*

- **No.** It's long, it builds, it runs tests, or it touches a big repo. It goes to `agents` with Claude or Codex, and I come back to it when it asks for me or when it's done.
- **Yes.** It's short, conversational, or about something already open on my laptop. It stays local with Grok or DeepSeek.

The sidebar keeps both kinds of thread side by side, each labelled with its environment and provider, so I never have to remember which machine is doing what. The laptop stays responsive because the only thing it does for the background threads is display them. The box on the other side of the room does the work.
