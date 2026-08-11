---
title: "What Building an Email Client Taught Me"
date: "2026-03-27"
description: "Underestimated complexities, surprising lessons, and honest notes from building an email client from scratch."
---

In [part one](/blog/done-why-i-built-my-own-email-client), I explained why I built Done. In [part two](/blog/done-building-with-rust-graphrag-and-mcp), I walked through the technical architecture. This final post is about what I didn't expect: the lessons that only show up when you actually try to build something that seems simple on the surface.

## "It's Just a Gmail Wrapper"

I said this to a friend when I started. He laughed. He was right to.

The mental model of an email client is deceptively simple: fetch emails, show them in a list, let the user reply. Three API calls and some HTML. Anyone who's built CRUD apps might look at email and think it's the same thing with different data.

It's not. Email is one of the oldest, most complex, and most inconsistent protocols still in daily use. Building a client that feels good (not just one that works) means solving problems across networking, data modeling, NLP, UI performance, and distributed systems at the same time.

Here's what I underestimated, in order of how badly.

## 1. Email HTML Is a War Crime

I knew email HTML was bad. I didn't know it was _this_ bad.

Every email client generates different HTML. Outlook uses Word's rendering engine (yes, Microsoft Word) to generate HTML emails, which means you get `<table>` layouts, `mso-` prefixed CSS properties, and conditional comments like `<!--[if mso]>`. Gmail strips most CSS and rewrites class names. Apple Mail is relatively sane but adds its own quirks.

When Done receives an email, it needs to:

1. Parse the HTML safely (emails can contain malicious scripts)
2. Extract readable plain text for the RAG pipeline
3. Render the original HTML faithfully in the UI
4. Handle inline images, CID-referenced attachments, and base64-encoded content

I spent two weeks just on email parsing. The sanitization library I started with broke legitimate formatting in half the emails I tested. I ended up writing a custom parser that preserves visual structure while stripping anything executable. It's one of the least glamorous pieces of the codebase and one of the most critical.

## 2. Entity Resolution Is an Open Research Problem

The RAG extraction pipeline identifies entities in emails: people, companies, projects, dates. Identifying entities is the easy part. Resolving them is where it gets hard.

Consider these fragments from different emails:

- "Marco will send the updated contract"
- "Hi Manuel, as discussed with M. Rossi..."
- "marco.rossi@acme.com has shared a document"
- "The Acme team confirmed the timeline"

These all reference the same person. A human sees that instantly. An extraction pipeline sees four potentially different entities. Multiply that across thousands of emails with hundreds of contacts and you're facing a combinatorial matching problem.

My current approach uses a multi-signal scoring system:

- Email address matching (strongest signal)
- Name similarity (fuzzy matching with nickname awareness)
- Co-occurrence patterns (entities that frequently appear in the same threads)
- Organizational context (if two names share a company domain, they're more likely related)

It works well for about 90% of cases. The remaining 10% includes common first names across different organizations, people who change companies (and email addresses), and email aliases. I'm still iterating on this.

The lesson: any system that claims to "understand" unstructured text is actually solving a stack of ambiguity problems, each one deeper than the last.

## 3. Sync Is a Distributed Systems Problem

I covered the Gmail sync engine in the [technical post](/blog/done-building-with-rust-graphrag-and-mcp), but I want to emphasize something: email sync is distributed systems in disguise.

You have two sources of truth, the Gmail server and the local SurrealDB database, and they can diverge. Every operation (read, archive, label, delete) needs to be reflected in both places, and conflicts need resolution. Multi-account multiplies the problem. Each account is its own consistency domain with its own history ID, tokens, and rate limits.

This is the same class of problem that CRDTs, operational transforms, and distributed databases solve. Except Gmail's API isn't designed as a distributed system primitive. It's a request-response API with eventual consistency baked in at Google's end.

Things I learned the hard way:

- **Never trust timestamps for ordering.** Gmail's internal timestamps and the timestamps in email headers can disagree. Use Gmail's history IDs for ordering sync events.
- **Idempotency is everything.** Network failures during sync mean you'll replay operations. Every sync operation needs to be safe to apply twice.
- **Batch carefully.** Gmail's batch API has a 100-request limit per batch and different rate limits than individual requests. Optimizing batch composition is its own subproblem.
- **Test with real inboxes.** Synthetic test data doesn't capture the chaos of real-world email. Forwarded messages, bounced emails, calendar invites embedded in threads, mailing list digests: all edge cases that break assumptions.
- **Optimistic UI needs a real rollback path.** Archiving should feel instant. If Gmail rejects the change, the UI has to put the thread back without lying to the user.

## 4. "Fast Enough" Requires Constant Attention

An email client is an always-on application. Users notice latency in ways they don't notice in a web app they visit occasionally. If the thread list takes 200ms to update after archiving, it feels broken. If search takes more than a second, it feels slow.

Performance isn't a feature you add at the end. It's a constraint that shapes every architectural decision:

- Local queries need schemas designed for email access patterns. Filtering by label + account + date range + read status, sorted by date descending, has to stay fast at 50,000+ messages, including after body retention trims archived content.
- The knowledge graph can't block the UI. Triage, embedding, and graph jobs run on a background queue (apalis). The UI never waits for extraction. You can pause and resume that work from settings when the machine needs a break.
- Rendering email threads is surprisingly expensive. A thread with 30 messages, each with different HTML structures, inline images, and quoted text folding, needs virtualization and lazy loading to stay smooth.
- Memory matters. A user with 100,000 emails stored locally can't have all of them in memory. Done pages message bodies and can drop full HTML for old archived mail until you open them again.

Rust helps a lot here. The language forces you to think about ownership, allocation, and concurrency from the start. Problems that would show up as GC pauses or memory leaks in JavaScript surface as compile-time errors in Rust. The tradeoff is development speed. Everything takes longer to write.

## 5. The MCP Integration Changed How I Think About Apps

I built the MCP server as an experiment. It became the feature that changed my mental model of what an application should be.

Traditional app design assumes the user interacts through the app's UI. MCP breaks that assumption. Suddenly the app isn't only a visual interface. It's a data service that any intelligent agent can query and act on, with permissions and an activity log so you know who did what.

A few implications beyond email:

- Apps become tools, not destinations. Instead of switching to your email client to check something, your AI assistant queries it in context.
- Composition beats features. Instead of building every possible workflow into the email client, expose primitives (list threads, read, archive, label, snooze) and let agents compose them.
- The UI becomes optional for some flows. "Snooze that Acme thread until Monday" doesn't need a visual interface once an agent has the right tools.

I think the next generation of productivity software will look like this: a core data engine with a thin UI layer and a rich programmatic interface. The UI handles what humans do well (reading, browsing, composing). The programmatic interface handles what AI does well (searching, summarizing, scheduling, connecting dots).

Done isn't fully there yet. MCP today is strong on actions and read access. GraphRAG search still lives mainly in the app. Building the server still showed me the direction.

## 6. Scope Is the Hardest Problem

Every week I think of something else Done "should" do. Calendar integration. Contact management. Email templates. Undo send. Read receipts. Deeper CRM-style contact views.

Each feature is individually reasonable. Together, they represent years of work. The hardest engineering decision I make on Done isn't technical. It's deciding what _not_ to build.

My filter: does this feature help you get things done, or does it just make the client more "complete"? Multi-account support helped, so I built it, even though it doubled sync complexity. Body retention helped keep large inboxes usable. Custom email signatures don't. They're a box-checking feature.

This is harder than it sounds because every email client comparison article has a feature matrix, and every missing checkbox feels like a competitive disadvantage. But Done isn't trying to be a better Superhuman. It's trying to be a different kind of tool.

## What's Next

Done is past the "does it boot?" stage. I use it daily with multiple accounts, GraphRAG search in-app, and agents on MCP. Some things I'm still pushing on:

- **Improving entity resolution.** The ~90% accuracy rate needs to get to 98%+ for the knowledge graph to be truly reliable.
- **Smarter triage.** Heuristics and graph context already filter noise before the LLM. I want triage to learn from my behavior over time.
- **Richer MCP tools.** Read/archive/label/snooze are live. Next is exposing GraphRAG and graph queries so agents can answer "find unresolved threads with people I haven't replied to in over a week" without the UI.
- **Compose and send for agents.** Writing assistance already lives in the compose UI. Wiring safe, permissioned send paths into MCP is the careful step after that.

I'm not sure if Done will ever be a product other people use. It might stay as my personal tool. But the patterns I've learned (GraphRAG for relational data, MCP for app-as-service, Tauri for performant desktop apps, local-first storage with optional cloud LLMs) apply far beyond email.

## The Honest Summary

Building an email client from scratch was harder than I expected, took longer than I planned, and taught me more than I anticipated:

| What I Expected                       | What Actually Happened                             |
| ------------------------------------- | -------------------------------------------------- |
| Gmail API is straightforward          | Sync is a distributed systems problem              |
| Email parsing is boring but simple    | Email HTML is the worst HTML on the internet       |
| Entity extraction is a solved problem | Entity _resolution_ is an open research problem    |
| Performance can be optimized later    | Performance shapes architecture from day one       |
| MCP is a nice-to-have experiment      | MCP changed my mental model of what apps should be |
| Scope management is about discipline  | Scope management is the actual hard problem        |

If you're considering building a desktop app with Tauri, experimenting with GraphRAG, or integrating MCP into your tools, do it. Each of these is ready for real use. Just don't underestimate the domain you're applying them to.

Email seems simple. It isn't. But that's what makes it interesting.

---

## Series

1. [Why I Built My Own Email Client](/blog/done-why-i-built-my-own-email-client)
2. [Building Done: Rust, GraphRAG, and the Complexity You Don't See](/blog/done-building-with-rust-graphrag-and-mcp)
3. **This post:** lessons learned

---

_This is the final post in the Done series. If you're working on similar problems (email clients, GraphRAG, MCP integrations, or Tauri apps), I'd love to compare notes. Find me on [Twitter](https://x.com/iltumio) or [LinkedIn](https://linkedin.com/in/manuel-tumiati)._
