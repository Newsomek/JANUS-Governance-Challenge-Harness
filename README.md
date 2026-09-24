# JANUS Governance Challenge Harness v0.2

A dependency-free external architectural challenge harness for examining governance claims described in the **JANUS Orientation Edition 2026**.

## Governing principle

> **Challenge JANUS against JANUS first.**

The harness tests JANUS against architectural commitments stated in its own Orientation Edition before introducing any external governance framework.

## Important boundary

This harness does **not**:

- implement JANUS;
- emulate JANUS;
- reproduce JANUS internal construction;
- validate JANUS implementation internals;
- conduct a penetration or security test against JANUS;
- infer unpublished mechanisms;
- claim that an orientation-level result proves actual JANUS runtime behavior.

Where the source does not provide enough information to derive a mechanism, the harness reports **INSUFFICIENT SPECIFICATION** rather than inventing JANUS behavior.

## Included adversarial challenges

1. Authorization condition changes after approval
2. Evidence changes after authorization
3. Authorization expires before execution
4. Learning attempts to expand authority
5. Two legitimate authorities conflict
6. Authority is revoked during execution

## Disposition vocabulary

- **CONTINUE** — proceed within the currently supported and authorized scope.
- **BLOCK** — do not proceed on the current basis; the next governance step is not determined by the label.
- **BLOCK + REAUTHORIZE** — do not proceed on the current authority state; if execution is still desired, obtain a new valid authorization state. “Reauthorize” is harness shorthand, not a JANUS term.
- **ESCALATE** — move the unresolved issue to an applicable human or policy authority.
- **ROLLBACK / COMPENSATE** — reverse or offset an action already in progress or completed, where such semantics exist.
- **INSUFFICIENT SPECIFICATION** — the Orientation Edition does not provide enough detail to derive the mechanism without invention.

Prediction comparison is not a score. It can be **EXACT MATCH**, **PARTIAL / COMPATIBLE**, or **DIFFERENT**.

## What each challenge records

For each scenario the harness records:

1. what changed;
2. what remains valid;
3. what became invalid or uncertain;
4. whether execution may proceed;
5. encoded source commitments and their support status;
6. rationale;
7. source basis;
8. the open JANUS question;
9. the evidence required to reconstruct the decision path.

## Replay

Replay is intentionally described narrowly. It is a **re-derivation from the static authored scenario contract**, not an independent JANUS runtime execution. It compares:

- encoded disposition;
- scenario-contract SHA-256;
- source-document SHA-256.

A replay divergence means the encoded contract or recorded evidence state changed between run and replay.

## Evidence export

Exports include:

- generation timestamp;
- harness version/build ID;
- source-document URL and SHA-256;
- scenario-contract SHA-256;
- scenario summary and perturbation;
- reviewer prediction and comparison classification;
- encoded disposition;
- cards, commitments, rationale, sources, open question, and evidence-required field;
- event log;
- replay result, if replay was performed;
- JANUS and harness attribution;
- non-claim restrictions.

Export performs internal consistency checks before producing JSON.

## Independent v0.1 test record

The v0.1 harness at commit `f8b2eb6284575d1670c748bee1868835bf7242eb` was independently exercised across all **36 scenario × prediction permutations** on the live public site. The test also covered replay, export, determinism, state isolation, source conformance, and tamper/edge behavior.

Preserved artifacts:

- `testing/claude/v0.1/JANUS_Harness_v0.1_Full-Matrix_Test_Report.md`
- `testing/claude/v0.1/JANUS_Harness_v0.1_raw_results.json`

The v0.1 report found 12 items: 1 High, 5 Medium, 4 Low, and 2 Observations. Version 0.2 incorporates the report's remediation recommendations while preserving the v0.1 record unchanged.

## Source document

The repository copy used for this review is:

`docs/JANUS_Orientation_Edition_2026_EN.docx`

Recorded SHA-256:

`21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`

The recorded hash identifies the exact repository copy used by the harness. The harness does not claim that document metadata proves original authorship or chain-of-custody.

## JANUS attribution

JANUS — including the system, concept, architecture, and underlying ideas examined by this harness — is the work of **Eryk Dubiel**.

LinkedIn:

https://www.linkedin.com/in/eryk-dubiel-1201a12b3/

This harness is an independent external governance challenge and is not an official JANUS artifact or an endorsement by Eryk Dubiel.

## Harness attribution

Created by **Kelly Newsome · Stratos Engine**.

Concept, experimental design, governance challenge structure, and product direction by Kelly Newsome. AI-assisted implementation.

## Public site

https://newsomek.github.io/JANUS-Governance-Challenge-Harness/

## Repository

https://github.com/Newsomek/JANUS-Governance-Challenge-Harness
