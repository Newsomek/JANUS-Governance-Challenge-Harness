# JANUS Governance Challenge Harness v0.3.9

A dependency-free external architectural challenge harness for examining governance claims described in the **JANUS Orientation Edition 2026**.


## v0.3.9 fail-closed documentation-claim control candidate

Version 0.3.9 is a bounded response to the remaining V035-F05 documentation-audit finding from the independent v0.3.8 targeted test.

V035-F04 remains independently closed. V035-F05 remains partially closed pending independent retest.

The previous documentation audit attempted to infer acceptable and unacceptable release claims from expanding regular-expression patterns. Independent testing showed that this produced both missed affirmative claims and rejected legitimate disclaimers.

v0.3.9 replaces that approach for guarded release claims with explicit deterministic change control:

- current documentation surfaces are normalized before inspection, including Unicode compatibility normalization, default-ignorable and soft-hyphen removal, Markdown emphasis removal, HTML entity decoding, and HTML tag removal;
- claim units containing guarded governance concepts require an explicitly reviewed normalized allowlist entry;
- reviewed disclaimer units may be approved globally and remain valid across current release surfaces;
- an unreviewed guarded claim fails closed, regardless of whether it appears affirmative or negative;
- this mechanism is deterministic change control, not semantic understanding or a claim that arbitrary natural-language paraphrases can be classified correctly.

The policy is designed so that adding or changing a guarded governance claim requires deliberate review rather than another regular-expression exception.

Phase-1 validation controls:

- `tests/v0.3.9-regression.mjs`
- `tests/v0.3.9-doc-audit.mjs`
- `tests/v0.3.9-doc-claim-fixtures.mjs`
- `tests/v0.3.9-manifest-audit.mjs`

The v0.3.9 mutation suite will be rebound to this policy before the candidate is committed or deployed.

Current release gate:

- `tests/V0_3_9_RELEASE_GATE.md`

Independent closure of V035-F05 is **not** claimed. Version 1.0 remains blocked pending targeted V035-F05 closure and one final full independent zero-open-finding adversarial regression.
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

The exact compatible-prediction set is part of each authored scenario contract, is shown in the UI, and is included in exports with a written reason. These compatibility sets are harness interpretations, not JANUS vocabulary.

## Source-support vocabulary

- **DIRECTLY SUPPORTED** — the Orientation Edition states the principle in substantially the same domain and direction.
- **REASONABLE INFERENCE** — the conclusion follows plausibly from JANUS statements but is not itself directly stated.
- **EXTENDED / BY ANALOGY** — a JANUS principle stated for one domain is intentionally applied to another domain.
- **OPEN** — the Orientation Edition does not specify the mechanism or rule needed to resolve the point.

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

Replay is intentionally narrow. It is a **re-derivation from the static authored scenario contract**, not an independent JANUS runtime execution. At Run and Replay, the browser fetches the published JANUS source document and computes SHA-256 from the actual served bytes. Replay compares:

- encoded disposition;
- scenario-contract SHA-256;
- expected vs observed source-document SHA-256;
- bound code identity and served `app.js` SHA-256;
- the stored evidence-core SHA-256;
- the stored full-record snapshot SHA-256;
- a freshly re-derived authored evidence core.

A replay divergence disables ordinary evidence export until a subsequent Replay returns REPLAY CONSISTENT.
## Evidence export

Exports include run and export timestamps, harness version/build ID, the bound application code commit recorded in the deployed `build-info.json`, absolute source URL, expected and observed source hashes, contract hash, authored compatibility set/reason, scenario fields, event log, a freshly re-derived replay result, attributions, restrictions, and an explicit integrity-check map. GitHub `main` is optional corroboration only.

Before export the harness recomputes and checks: valid prediction membership, prediction/disposition labels, comparison code/label, current contract hash, live source-document bytes and hash, source consistency with the run, bound build identity and served `app.js`, event-log content, stored evidence-core hash, full stored-record snapshot hash, fresh authored-state hash, and a freshly re-derived replay result. A failed check refuses ordinary export. The mutable on-screen replay record is never trusted as export evidence. Client-side JSON remains unsigned and is not claimed to be tamper-proof.

The build manifest records SHA-256 hashes for every tracked release file except `build-info.json` itself, which cannot self-hash. This includes served UI assets, source material, tests, and preserved independent evidence. At runtime the harness directly enforces the manifest version/build ID and the served `app.js` hash; it separately verifies the JANUS source-document hash. Other manifest hashes are release provenance metadata and are intended for independent exact-artifact verification.
## Independent v0.1 test record

The v0.1 harness at commit `f8b2eb6284575d1670c748bee1868835bf7242eb` was independently exercised across all **36 scenario × prediction permutations** on the live public site. The test also covered replay, export, determinism, state isolation, source conformance, and tamper/edge behavior.

Preserved artifacts:

- `testing/claude/v0.1/JANUS_Harness_v0.1_Full-Matrix_Test_Report.md`
- `testing/claude/v0.1/JANUS_Harness_v0.1_raw_results.json`

The v0.1 report found 12 items: 1 High, 5 Medium, 4 Low, and 2 Observations. Version 0.2 incorporates the report's remediation recommendations while preserving the v0.1 record unchanged.


## Independent v0.2 regression record

The v0.2 harness at commit `ba7b6e5b9335f395499f569f0df091962c69bb8f` was independently regression-tested across all 36 permutations plus determinism, state-isolation, race, tamper, replay, export, and source-conformance checks. The report found 9 v0.1 items fixed, 3 partly fixed, and 7 new findings. Version 0.3 is the bounded hardening response to those findings.

Preserved artifacts:

- `testing/claude/v0.2/JANUS_Harness_v0.2_Independent_Regression_Test_Report.md`
- `testing/claude/v0.2/JANUS_Harness_v0.2_raw_results.json`

## Independent v0.3 regression record

The v0.3 harness at commit `d79b0385c5b041772580121deaaf1531c8d4a845` underwent an independent regression and integrity test. The test found the architectural content source-conformant but identified a release-blocking evidence-core timestamp defect plus additional provenance/observability findings. Version 0.3.1 corrected that integrity architecture and preserved the complete v0.3 test evidence.

Preserved artifacts:

- `testing/claude/v0.3/JANUS_Harness_v0.3_Independent_Regression_Integrity_Test_Report.md`
- `testing/claude/v0.3/JANUS_Harness_v0.3_raw_results.json`
## Source document

The repository copy used for this review is:

`docs/JANUS_Orientation_Edition_2026_EN.docx`

Expected SHA-256:

`21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`

At Run, Replay, and Export, the browser fetches the public source document and computes SHA-256 from the served bytes. The expected hash identifies the repository copy used for the authored scenarios. The harness does not claim that document metadata proves original authorship or chain-of-custody.

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

## Bound-release integrity model

The current harness separates two different integrity questions:

1. **Stable authored evidence core** — scenario content, decision vocabulary, source hashes, bound harness code identity, attributions, restrictions and other stable fields. Per-fetch timestamps such as `checked_at` are deliberately excluded so an honest Replay can reproduce the same authored state.
2. **Stored record snapshot** — the complete Run-time record, including observation timestamps and provenance observations. Replay and Export recompute a snapshot hash over the stored record to detect accidental or uncoordinated later mutation. This client-side hash is not a tamper-proof control against a user who can alter page state and recompute client-side hashes.

The JANUS source document is fetched and SHA-256 hashed at Run, Replay and Export. The served `app.js` is also fetched and checked against `build-info.json`.

### Bound code provenance

The governed updater creates each bound release in two commits. The first commit contains the exact application code and preserved test evidence. The second adds `build-info.json`, which records the first commit as `code_commit` plus SHA-256 hashes of the served files. At runtime the harness verifies served `app.js` against that manifest. GitHub `main` is queried only as optional corroboration and is reported as `MATCH`, `MISMATCH`, or `UNAVAILABLE`; quota or network failure does not erase the bound code identity.

### Export integrity scope

`integrity_status: PASS` means the stable authored evidence core and the complete stored Run snapshot both verify, together with fresh source/code checks at Export. The exported JSON is an **unsigned client-side artifact**: PASS is not a digital signature or proof of authenticity, and it cannot protect against a user who controls the page/DevTools and coordinates edits with recomputed client-side hashes before or after export.

### Refusals

Source-hash mismatch, build-provenance mismatch, malformed scenario contract, invalid prediction, replay divergence, or export integrity failure are surfaced visibly and ordinary evidence export is refused.

## Required pre-review smoke test

Before any reviewed or Version 1.0 promotion tag, test each of the six scenarios on the deployed URL:

- Run succeeds;
- Replay reports `REPLAY CONSISTENT`;
- Export produces an evidence JSON with `integrity_status: PASS`;
- expected and observed JANUS source hashes match;
- served `app.js` matches the build manifest;
- the bound `harness_code_commit` is present.

Then rerun the independent full-matrix regression.

## Independent v0.3.1 test record

JANUS Governance Challenge Harness v0.3.1 underwent an independent regression, integrity, and release-candidate test against the deployed release.

Tested release HEAD:

`9dc291a5478668b9baae957797b5c799917d35f7`

Bound application code commit:

`a10722a087e740d183598125909319610ca4238f`

Results included:

- 6/6 deployed release smoke tests passed;
- 36/36 scenario × prediction permutations passed;
- 68/68 clean replays reported REPLAY CONSISTENT;
- 67/67 clean exports reported integrity PASS;
- 24/24 determinism runs passed;
- 9/9 race tests passed;
- 0 Critical, High, or Medium defects were identified;
- 0/18 source commitments were contradicted or insufficiently supported.

Independent test evidence:

`testing/claude/v0.3.1/JANUS_Harness_v0.3.1_Independent_Regression_Integrity_Release_Test_Report.md`

`testing/claude/v0.3.1/JANUS_Harness_v0.3.1_raw_results.json`

The remaining findings are Low-severity hardening and usability items tracked for a later release. The test evidence does not make this harness an official JANUS implementation or a validation of unpublished JANUS runtime behavior.

## v0.3.2 zero-known-defect hardening candidate

Version 0.3.2 was the first zero-open-finding candidate. Its independent adversarial regression found additional actionable hardening items, all preserved under `testing/claude/v0.3.2/`.

- strict scenario-contract enum, non-empty, and compatibility validation;
- null-safe scenario selection and guarded structural hashing;
- retry-safe Run refusal handling;
- no false stale-state notice before evidence exists;
- replay evidence is freshly re-derived at Export rather than copied from mutable UI state;
- build manifest version/build ID are checked against the running app;
- the declared bound commit is corroborated against its own `app.js` when the external raw source is available, while GitHub `main` remains optional corroboration;
- Export refusals are persistent in the page and fetch errors identify the affected resource;
- the historical v0.3.2 regression is preserved as `tests/v0.3.2-regression.mjs`; it is not a current-release gate;
- the build manifest lists hashes for independent release verification, while runtime enforcement is explicit about which resources are re-hashed (`app.js` and the JANUS source document).

Historical result: v0.3.2 underwent independent adversarial regression and produced additional findings; those results are preserved under `testing/claude/v0.3.2/`. That candidate was not promoted to Version 1.0.



## v0.3.3 bounded hardening candidate

Version 0.3.3 was a bounded hardening candidate. Its independent regression found six residual actionable items, preserved under `testing/claude/v0.3.3/`.

The automated regression output for this historical candidate is recorded in `tests/V0_3_3_AUTOMATED_REGRESSION_RESULT.txt`. Version 0.3.3 was not promoted to Version 1.0.


## Integrity limitations and offline verification

The harness and its exported JSON are unsigned client-side artifacts. A PASS result means the current page state was internally consistent with the live authored contract, source bytes, and bound code checks at export time. It is **not** proof against a user with browser console/devtools access, because such a user controls the same client-side state and code that performs the checks. The record snapshot hash is useful for detecting accidental or uncoordinated mutation, not malicious coordinated forgery.

For independent checking, compare an export's `contract_sha256` with the scenario entry in `docs/EXPECTED_CONTRACT_HASHES.json`, then verify that file and `app.js` against the hashes in the release `build-info.json` and the bound code commit.


## v0.3.4 bounded hardening candidate

Version 0.3.4 addressed the six findings from the independent v0.3.3 zero-open-finding regression: broader blank/invisible-text rejection and duplicate-commitment validation; unified Run/Replay/Export concurrency locking; explicit stored-record structural validation and refusal messages; behavioural and mutation regression coverage; corrected integrity-limit wording plus published expected contract hashes; and corrected release documentation.

The authored six-scenario content was unchanged. The deployed v0.3.4 smoke test found residual issues, so v0.3.4 was superseded and was not promoted to Version 1.0.


## v0.3.5 final residual hardening candidate

Version 0.3.5 was a bounded correction to the three residuals found by the deployed v0.3.4 smoke gate. Its deployed smoke gates passed, but the final independent adversarial regression found nine actionable findings. Those results are preserved under `testing/claude/v0.3.5/`. Version 0.3.5 was superseded and was not promoted to Version 1.0.

## v0.3.6 bounded hardening candidate

Version 0.3.6 addresses V035-F01 through V035-F09 without changing the six authored scenario contracts. It tightens canonical duplicate handling, closes the late Export invalidation window, expands behavioral and mutation protection around core integrity controls, corrects historical release documentation, and strengthens exact-artifact provenance requirements.

Current local release gates are:

- `node tests/v0.3.6-regression.mjs`
- `node tests/v0.3.6-doc-audit.mjs`
- `node tests/v0.3.6-mutation-regression.mjs`
- `node tests/v0.3.6-manifest-audit.mjs` (after the bound v0.3.6 manifest is generated)
- `tests/V0_3_6_RELEASE_GATE.md`

Independent closure is **not** claimed until a targeted V035-F01 through V035-F09 closure test passes with zero actionable findings and one final full independent zero-open-finding adversarial regression also passes.
