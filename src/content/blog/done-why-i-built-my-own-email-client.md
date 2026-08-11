---
title: "Why I Built My Own Email Client"
date: "2026-03-25"
description: "Superhuman and Spark are great. But I wanted an email client that thinks the way I do. So I built Done."
---

I get around 150 emails a day. Not because I'm important. Because email is where work happens, whether you want it to or not. Feature requests from clients, contract PDFs, CI/CD notifications, newsletters I swore I'd read, and the occasional email that actually matters buried somewhere in the middle.

I've tried everything. Gmail's native client, Spark, Superhuman. They all share the same assumption: the way to fix email is to make it faster. Better keyboard shortcuts. Snappier UI. Split inboxes.

But speed isn't my problem. Knowing what to do next is my problem.

## The Superhuman Paradox

Superhuman is good software. The keyboard-first UX is fast. The design is clean. After months of using it, though, I realized something: Superhuman makes me faster at processing email. It doesn't make me better at _acting_ on it.

I'd fly through my inbox at 6 AM, hit Inbox Zero by 6:15, and then spend the rest of the morning trying to remember which email had the contract I needed to review, what the client's deadline was, and whether I'd already replied to that thread from last Tuesday.

Spark has a similar issue. Smart categorization helps with triage, but the categories are generic. "Newsletters" and "Notifications" are easy to sort. The hard part is the emails that require judgment, context, and follow-up. Those still sit in a pile labeled "Personal."

## What I Actually Need

I started writing down what I wished my email client could do:

1. **Understand context, not just keywords.** If I search for "the contract Marco sent about the new project," I want results even if none of those exact words appear in the email.
2. **Surface what matters.** Not by sender importance or read/unread status, but by understanding what's actionable and what's noise.
3. **Remember things I forget.** If a client mentioned a deadline three emails ago, I shouldn't have to dig for it.
4. **Work with my tools, not replace them.** My workflow already includes AI assistants, task managers, and calendars. My email client should plug into that ecosystem, not compete with it.
5. **Keep my data under my control.** Email is my business. I want it stored on my machine, not locked into someone else's cloud product. And when AI touches it, I want that to be my choice.

None of the existing clients checked all five boxes. Superhuman nails keyboard UX but has no real semantic understanding. Spark does some smart sorting but is cloud-dependent. Apple Mail is private but dumb. And Gmail is... Gmail.

## The Experiment

I'm a CTO who builds with Rust and blockchain for a living. I spend my days on cryptographic protocols, distributed systems, and zero-knowledge proofs. Building an email client wasn't on my roadmap.

But two technologies had been sitting in my "want to build something with this" list for months.

**GraphRAG** is retrieval-augmented generation backed by a knowledge graph instead of flat vector search. Microsoft Research published their approach in 2024, and the idea stuck with me. Instead of just embedding documents and doing similarity search, you build a graph of entities, relationships, and concepts. Retrieval gets richer because the system understands how things connect, not only how they look in vector space.

**MCP (Model Context Protocol)** is Anthropic's protocol for giving AI models access to external tools and data sources. Instead of the model hallucinating about your emails, it can actually read them, act on them, and operate through a structured interface.

An email client felt like a good proving ground for both. Emails are inherently relational: people, companies, projects, threads, attachments, dates, action items. That's a graph, not a flat list. And MCP meant I could make email a first-class tool for AI assistants rather than something you alt-tab away from.

## Done

So I started building Done. The name is the goal: an email client that helps you get things _done_, not just get through your inbox.

The stack is Tauri 2 with a SvelteKit frontend (Svelte 5) and a Rust backend. Emails sync from Gmail's API, including multi-account support, and live in a local SurrealDB database. A triage layer filters noise before the expensive work starts. The GraphRAG pipeline extracts entities and relationships into a local knowledge graph. Embeddings can run fully local. LLM extraction can run on Ollama on your machine or on cloud providers you configure. The whole thing also exposes a local MCP server so AI agents can read threads, archive, label, and snooze through a standard protocol.

The idea is simple. Your email client should understand your email the way you do: not as a list of messages sorted by date, but as a web of conversations, people, commitments, and context.

It's a working product I use daily. Rough around the edges in places, but it already does things no other email client can. Example: answering "what did I promise to deliver to the Acme team this month?" by traversing the knowledge graph instead of doing keyword search.

## This Series

This is the first post in a three-part series about building Done:

1. **This post:** why I built it and what I'm trying to solve
2. **[Building Done](/blog/done-building-with-rust-graphrag-and-mcp):** the technical deep dive into Tauri, GraphRAG, Gmail sync, and the extraction pipeline
3. **[Lessons learned](/blog/done-lessons-learned):** what surprised me, what I underestimated, and where this is going

If you've ever thought "I could build a better email client," I hope this series gives you a realistic picture of what that actually involves. It's harder than it looks.

## Coming Up

Next: [Building Done: Rust, GraphRAG, and the Complexity You Don't See](/blog/done-building-with-rust-graphrag-and-mcp). How the system actually works, why Gmail sync is a distributed systems problem, and what GraphRAG looks like on a local email graph.

---

_Building something interesting? Find me on [Twitter](https://x.com/iltumio) or [LinkedIn](https://linkedin.com/in/manuel-tumiati)._
