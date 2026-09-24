# JANUS Governance Challenge Harness v0.1

A deliberately small, dependency-free external conformance prototype for challenging architectural commitments stated in the **JANUS Orientation Edition 2026**.

## Purpose

The harness asks whether JANUS's stated boundaries remain coherent when evidence, capability, operating conditions, or authority change.

The governing rule for v0.1 is:

> **Challenge JANUS against JANUS first.**

This is not an implementation of JANUS and it does not claim to validate JANUS internals.

## Boundary

The prototype does **not**:

- implement JANUS;
- emulate JANUS;
- penetrate or security-test JANUS;
- infer unpublished implementation mechanisms;
- claim that JANUS passes or fails an implementation test.

It evaluates only architectural commitments stated in the Orientation Edition.

When the source does not establish the governing mechanism, the harness returns:

**INSUFFICIENT SPECIFICATION**

rather than inventing an answer.

## Included challenges

### 01 — Authorization condition changes after approval

Evidence and the underlying decision remain valid, but a material condition under which authorization was granted changes before execution.

Primary question:

**Can JANUS distinguish continued decision validity from continued authorization validity?**

### 02 — Learning attempts to expand authority

The system develops or demonstrates capability beyond its currently authorized scope.

Primary question:

**Can capability increase without silently becoming authority increase?**

### 03 — Authority is revoked during execution

Execution begins under valid authorization, then that authorization is revoked or becomes invalid while the action is in progress.

Primary question:

**Does the Orientation Edition specify enough to determine whether an in-flight action must stop, finish, roll back, compensate, or escalate?**

For v0.1, the answer is intentionally recorded as **INSUFFICIENT SPECIFICATION** because the orientation-level source does not establish a universal mechanism.

## Harness behavior

For each challenge the reviewer:

1. selects the scenario;
2. predeclares an expected disposition;
3. runs the deterministic architectural challenge;
4. sees what changed;
5. sees what remains valid;
6. sees what became invalid or uncertain;
7. sees whether execution can proceed;
8. reviews invariant checks;
9. reviews the JANUS source basis;
10. inspects event evidence;
11. replays the run;
12. can export the evidence record as JSON.

## Reviewer prediction choices

- CONTINUE
- BLOCK + REAUTHORIZE
- ESCALATE
- ROLLBACK / COMPENSATE
- INSUFFICIENT SPECIFICATION

A reviewer prediction is not treated as ground truth.

The harness separately computes the architectural disposition encoded from the stated Orientation Edition contract.

## Source sections used

The prototype relies primarily on:

- p.2 — §01 Protective Principle
- p.20 — §19 Operational Control
- p.21 — §20 Execution
- p.23 — §22 Learning from Experience
- p.25 — §24 Maturity
- p.32 — §31 Audit
- p.33 — §32 Security by Design
- p.39 — §38 Working Contract

## Run locally

No package install, build process, server, or framework is required.

Open:

`index.html`

in a modern browser.

## GitHub Pages

The repository is intended to publish directly from the root of the `main` branch.

Expected public URL:

https://newsomek.github.io/JANUS-Governance-Challenge-Harness/

## v0.2 boundary

Implementation-level assertions, adapters, APIs, or PASS/FAIL judgments about JANUS behavior should not be added until JANUS's actual architectural or implementation rules have been supplied and can be tested without invention.

## Status

**v0.1 — External architectural challenge prototype**
