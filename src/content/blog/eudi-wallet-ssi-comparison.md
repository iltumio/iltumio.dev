---
title: "The EUDI Wallet Is Coming. But Is It Self-Sovereign?"
date: "2026-03-06"
description: "The EU Digital Identity Wallet launches this year. I compare its architecture against SSI principles and look at where it falls short."
---

By the end of 2026, every EU Member State must offer citizens a European Digital Identity Wallet. It's the most ambitious government-backed digital identity initiative ever attempted, and depending on who you ask, it's either a breakthrough for digital identity or a missed opportunity for true self-sovereignty.

I've been watching the EUDI Wallet take shape for a while now. Working daily with blockchain, zero-knowledge proofs, and self-sovereign identity gives me a particular lens on this. Some of the design choices are great. Others worry me.

## What Is the EUDI Wallet?

The EUDI Wallet is a government-approved mobile application mandated by eIDAS 2.0 (Regulation EU 2024/1183). Citizens, residents, and businesses can store verified digital credentials (national ID, driving license, diplomas, health insurance cards) and present them to public or private services, online or in person.

Three goals drive the initiative:

- **One wallet, all of Europe.** Cross-border interoperability by design. Your Italian driving license works in Germany without friction.
- **User consent.** You decide what to share and with whom.
- **Digital sovereignty.** Reducing EU dependence on non-European identity providers like Apple, Google, and Meta.

Every Member State must provide at least one certified wallet and recognize wallets issued by other states. The technical blueprint is the Architecture Reference Framework (ARF), now on version 2.8, which specifies credential formats (SD-JWT-VC), trust models (OpenID Connect Federation), and security requirements.

## A Quick SSI Refresher

Self-Sovereign Identity rests on a few core principles, originally articulated by Christopher Allen in 2016:

1. **Existence & Control.** The user exists independently of any authority and has ultimate control over their identity.
2. **Decentralization.** No central authority should be a single point of failure or control.
3. **Portability.** Identity should not be locked into a single provider or system.
4. **Interoperability.** Credentials should work across systems, borders, and contexts.
5. **Consent & Minimization.** Users choose what to disclose, and disclosure should be minimal.
6. **Persistence.** Identifiers should last as long as the user wishes.

SSI typically relies on Decentralized Identifiers (DIDs) for user-controlled identification and Verifiable Credentials (VCs) for digitally signed attestations. Trust is anchored in cryptographic proofs on a distributed ledger, not in certificate hierarchies controlled by a handful of authorities.

## Where EUDI Gets It Right

The EUDI Wallet advances several SSI-aligned principles, and these are worth acknowledging before getting into the criticism.

### Selective Disclosure

The ARF specifies SD-JWT-VC (Selective Disclosure JSON Web Token - Verifiable Credential) as the primary credential format. Users can present specific claims from a credential without revealing the entire document. Need to prove you're over 18? You can do that without exposing your birth date, name, or address.

Most government ID systems today are all-or-nothing. You hand over your full document or nothing at all. SD-JWT-VC changes that.

### User Consent

The wallet architecture puts explicit consent flows at the center of every interaction. Relying parties must declare exactly what attributes they're requesting and why. The user approves or denies. This is closer to SSI's consent principle than anything governments have built before.

### Cross-Border Interoperability

The Large Scale Pilots (POTENTIAL, EWC, DC4EU, NOBID) have tested cross-border scenarios with over 80 organizations. The POTENTIAL pilot ran from April 2023 to September 2025, testing six use cases across multiple countries. Their conclusion: cross-border interoperability works, but only with rigorously applied common standards.

Doing this at a continental scale is hard, and the progress here is real.

## Where EUDI Falls Short of Self-Sovereignty

Despite the user-centric language, the EUDI Wallet's architecture makes choices that diverge from SSI in fundamental ways. A paper by Sitouah, Bruschi, and De Cillis (IEEE, 2026) identifies three core issues clearly.

### 1. Centralized Trust Infrastructure

The EUDI Wallet relies on a Public Key Infrastructure (PKI) trust federation based on OpenID Connect Federation. Every participant (wallet providers, credential issuers, relying parties) must have an Entity Configuration verified through a trust chain that terminates at a government-controlled Trust Anchor.

In SSI, trust resolution is decentralized: you resolve a DID against a distributed ledger, and the credential's validity is cryptographically self-evident. In EUDI, if a single trust-mark status endpoint goes down, the entire verification chain breaks. The trust model is hierarchical by design, with governments at the top.

This is an explicit architectural decision. The EU prioritized legal certainty and regulatory control over decentralization. Understandable from a governance perspective, but at odds with SSI's decentralization principle.

### 2. Government Monopoly on Authentication

In the EUDI ecosystem, only government-issued Personal Identification Data (PIDs) can be legally used for authentication. No other identifiers are permitted for this purpose:

- You cannot use a self-created DID as a primary identifier.
- Wallet providers can always identify you. Anonymization doesn't extend to them.
- Pseudonyms exist but remain traceable to your PID.

In SSI, the user creates their own identifiers. In EUDI, the government creates them for you and retains the ability to trace them. The user is _centric_ to the system, but not _sovereign_ over it. That distinction matters.

### 3. Registered Relying Parties Only

To verify credentials from the EUDI Wallet, relying parties must be registered within the trust federation. You can't just build an app and verify credentials freely. You need to be a recognized entity in the system.

SSI is permissionless by nature. Anyone should be able to verify a credential by checking its cryptographic proof. The EUDI model gates verification behind registration requirements, limiting use cases and innovation.

## The Credential Portability Problem

There's a fourth issue that doesn't get discussed enough: **credentials aren't portable** out of the EUDI ecosystem.

The Italian Wallet (IO app), one of the most advanced EUDI implementations, does not allow users to export their SD-JWT-VC credentials to a third-party wallet. Your credentials are locked inside the government-approved app. This directly contradicts SSI's portability principle.

The eIDAS 2.0 regulation does emphasize interoperability between Member States' solutions, which suggests export capabilities should eventually exist. But right now, your digital identity lives in a closed system.

## Bridging the Gap: What's Possible

This is where things get interesting for those of us building in this space.

Researchers are already exploring how to use EUDI credentials in SSI-compliant environments. The approach combines Trusted Execution Environments (TEEs) and Zero-Knowledge Proofs:

1. A user exports their SD-JWT-VC from the EUDI Wallet to an SSI-enabled wallet.
2. The SSI wallet verifies the credential inside a TEE (Intel SGX), validating the entire trust chain.
3. A ZK proof is generated that attests to the credential's validity without revealing the credential itself.
4. This proof is verified and anchored on-chain, making it permanently and independently verifiable.

The result: a credential originally issued under the EUDI's centralized trust model becomes usable in a fully decentralized, SSI-compliant context. The user gains actual self-sovereignty over a government-issued credential.

It's still early research, but it points to a future where EUDI and SSI aren't mutually exclusive. They could work as complementary layers.

## The Bigger Picture

The EUDI Wallet is not self-sovereign identity, and it was never trying to be. It's a **regulated, user-centric identity system** designed for legal certainty, government accountability, and continental scale.

But if you're building in the decentralized identity space, it helps to be precise about what it is and what it isn't:

|                          | SSI                          | EUDI Wallet                            |
| ------------------------ | ---------------------------- | -------------------------------------- |
| **Trust Model**          | Decentralized (DLT-anchored) | Hierarchical PKI (government-anchored) |
| **Identifiers**          | User-created DIDs            | Government-issued PIDs                 |
| **Credential Format**    | W3C VC, SD-JWT-VC            | SD-JWT-VC                              |
| **Selective Disclosure** | Yes                          | Yes                                    |
| **Verification**         | Permissionless               | Registered relying parties only        |
| **Portability**          | Full                         | Limited (ecosystem-locked)             |
| **Revocation**           | On-chain / status list       | Trust-mark status endpoints            |
| **Legal Recognition**    | Limited                      | Full EU-wide recognition               |
| **Scale**                | Fragmented                   | 27 Member States + 450M citizens       |

The EUDI Wallet will be the first contact most Europeans have with digital credentials. If 450 million people get comfortable presenting verifiable credentials from a wallet on their phone, the mental model is established. The step from "government-issued credential in a government wallet" to "self-issued credential in my own wallet" becomes much smaller.

## What This Means for Developers

If you're building in the identity space, the EUDI Wallet creates both constraints and opportunities:

- **Learn the ARF.** The Architecture Reference Framework is the spec that matters. Get familiar with SD-JWT-VC, OpenID4VCI, OpenID4VP, and the trust model.
- **Build bridges, not walls.** The most valuable work right now is enabling EUDI credentials to flow into decentralized contexts and vice versa.
- **Watch the pilots.** The Large Scale Pilots have produced real insights about interoperability challenges. Their findings will shape the final implementation.
- **Push for portability.** Credential export capabilities will determine whether the EUDI Wallet becomes a platform for innovation or a walled garden.

## Wrapping Up

The EUDI Wallet is a significant step forward for digital identity in Europe. It's standardized, cross-border, consent-based, and legally recognized. For most people, it will be a real improvement over scattered credentials and password-based authentication.

But _user-centric_ is not _self-sovereign_. The architecture chooses centralized trust over decentralization, legal accountability over permissionless verification, government control over user autonomy.

The question I keep coming back to: can we build the bridges that let government-issued credentials flow into truly self-sovereign contexts? Giving users the legal recognition of the EUDI system and the autonomy of SSI at the same time. That's what I want to work on.

---

_If you're interested in digital identity, SSI, or ZKPs, find me on [Twitter](https://x.com/iltumio) or [LinkedIn](https://linkedin.com/in/manuel-tumiati)._
