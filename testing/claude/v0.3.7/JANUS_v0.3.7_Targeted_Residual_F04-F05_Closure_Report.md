# JANUS Governance Challenge Harness v0.3.7
## Targeted Residual F04/F05 Closure Report

**Date:** 2026-09-25 · **Tester:** Claude (independent) · **Scope:** V035-F04 and V035-F05 only
**Deployed target:** https://newsomek.github.io/JANUS-Governance-Challenge-Harness/
**Repository:** https://github.com/Newsomek/JANUS-Governance-Challenge-Harness (fresh clone, read-only; `git status` clean at end)
**Raw evidence:** `JANUS_v0.3.7_targeted_residual_closure_raw_evidence.txt`

**Method note.** The cloud sandbox's network proxy refuses `github.io`, so every deployed-artifact check (fetching, SHA-256 hashing, and all runtime Run/Replay/Export tests) ran inside the live GitHub Pages page in Chrome. Fetches used `cache: 'no-store'` plus a cache-busting query, and hashing used `crypto.subtle`. Mutation and doc-audit runs used the repository test harnesses, run on temporary copies. The deployed bytes and the repo bytes are hash-identical, and every mutation, placement and assertion was checked by hand, not taken from printed summaries. During the live test, `alert` was captured and clicks on download links were suppressed, so no files were written. The page was reloaded afterwards.

---

## IDENTITY GATE: PASS

| Check | Expected | Observed (live deployment) | Result |
|---|---|---|---|
| Version (HTML) | 0.3.7 | `<title>…v0.3.7`, "VERSION 0.3.7", `HARNESS_VERSION === '0.3.7'` | PASS |
| build-info `version` | 0.3.7 | 0.3.7 | PASS |
| Build ID | janus-governance-challenge-harness-v0.3.7 | janus-governance-challenge-harness-v0.3.7 | PASS |
| Bound code commit | 538b957498f5d3f6d0aba86a0b3128f6fb2f0816 | 538b957…6f0816 (build-info). Live Run: `bound_commit_verification = MATCH` | PASS |
| Release HEAD / main | 132cd076fefd7ceca130457d4c64953f09e1318a | Clone `HEAD = origin/main = 132cd07…318a`. Live Run: `deployment_head_observed = 132cd07…318a` | PASS |
| Deployed app.js SHA-256 | 036ba2cb…385eb87d | 036ba2cb3b78ed2c50fbef00d6c2ddbfc4191e4ed39742b71dcd9acc385eb87d | PASS |
| Deployed JANUS source SHA-256 | 21766f5d…8c374551fe4 | 21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4 | PASS |
| Authored scenario-block SHA-256 | 948536a1…b56488 | 948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488 (17,033 bytes, one trailing LF) | PASS |
| Manifest entries | 56, build-info.json excluded | 56 entries, not self-listed. All 56 re-fetched live: 56/56 match. Git-tracked files minus build-info = 56, none missing or extra | PASS |

The only change from 538b957 to 132cd07 is `build-info.json`, so the bound code is the deployed code.

---

## Findings

| Finding | Original residual issue | Targeted tests performed | Evidence observed | Status | Residual risk / notes |
|---|---|---|---|---|---|
| **V035-F04** | The Export `event_log` mutation oracle was not behavioral. The `… === … \|\| true` bypass could survive because the old test only matched a source-code line. | **A.** Read the v0.3.7 F04 block in `tests/v0.3.7-regression.mjs` against the 8 required properties. **B.** Ran the exact `\|\| true` mutant three ways: (i) in the repo suite; (ii) in my own Node probe, with two different event_log tampers plus an untampered control; (iii) on the **live deployed page**, by replacing `exportEvidenceCore` with its own source plus `\|\| true`, then tampering and exporting, then restoring the original. **C/D.** Ran the preflight and the full suite. **E.** Printed the actual diff for all 45 operators (file, line, enclosing function) and recorded the assertion that killed each one. **F.** Checked the listed sensitive controls one by one. | **A:** all 8 properties are present. The test creates a valid Run, gets a CONSISTENT Replay, changes only `lastRun.event_log[0]`, recomputes `evidence_core_sha256` and `record_snapshot_sha256`, calls Export, asserts no download, and asserts that the refusal names `event_log`. **B (live):** unmutated code: `downloaded=0`, refusal says "(event_log, authored_state_integrity, replay_rederived_consistent)". Mutant: `downloaded=0`, refusal says "(authored_state_integrity, replay_rederived_consistent)". `event_log` is not named, so assertion #8 fails and the mutant is **killed at runtime**. Control exports still download (1). Node probe: same result for both tampers. **C:** 45/45 operators active. **D:** 45/45 killed, both in the unmodified suite and in my instrumented copy. **E:** every operator changes its intended line (for example, `\|\| true` changes `app.js:941` inside `exportEvidenceCore`). No operator is a no-op. Every kill comes from the assertion guarding that control. **F:** see the list below this table. | **CLOSED** | (1) The no-download assertion (#7) cannot tell this mutant apart, because `authored_state_integrity` and `replay_rederived_consistent` block Export on their own. The kill depends on #8, which checks the refusal reason. That is still runtime output, not source-text matching. (2) The S05 disposition mutant is killed first by the static scenario-block hash assertion, which is an intended authored-integrity guard. (3) The preflight only proves that each operator changes something. I did the target-location check by hand, and the suite doesn't automate it. |
| **V035-F05** | The doc audit relied on a few exact strings and files. Semantically equivalent overclaims passed, and README, CHANGELOG (current section), VERSION.txt and index.html were not checked consistently. | Wrote my own mutation harness that runs the repo's `v0.3.7-doc-audit.mjs` on temp copies, with insertions **mid-document and at the end of files**, not only prepended. **Required set:** all 11 listed mutations. **Disclaimer set:** 9 legitimate negative statements, covering all 5 listed phrases across README, index.html, VERSION.txt and the CHANGELOG v0.3.7 section. **Equivalence probe:** 6 more natural disclaimers and 10 more affirmative paraphrases, because F05's original defect was about semantically equivalent claims. Checked positive disclosures on the live README, index.html and app.js. | **Required 11/11 caught.** Each failed the audit with the correct surface named (R1–R11). **Listed disclaimers 9/9 pass.** **Positive disclosures present** on the live surfaces: unsigned; "PASS is not a digital signature or proof of authenticity"; page/DevTools control plus recomputed hashes; "accidental or uncoordinated" scope. The app.js export `integrity_scope` says the same. **But 3 natural disclaimers are wrongly rejected:** "Independent closure has not been confirmed.", "Independent closure is not yet complete.", "This release is not ready for Version 1.0." **And 9 of 10 affirmative paraphrases pass the audit:** "Tamperproof evidence export." / "Tamper‑proof" with U+2011 / **"Not signed, but tamper-proof evidence export."** (the negation mask hides the affirmative claim) / "Approved as Version 1.0." / "Promoted to Version 1.0." / "v1.0 approved." / "Version 1.0: approved." / "All nine V035 findings were independently closed." / "Closure was independently confirmed." Only "…are cryptographically authentic" was caught. | **PARTIALLY CLOSED** | Every enumerated mutation is fixed. The oracle is still pattern-list bound, which is the root issue F05 was about. Separately, README line 15 now claims that "semantically equivalent integrity/authenticity, Version 1.0, and independent-closure overclaims are rejected across current release surfaces," and the probes above show that is not true. That line is an unsupported release claim in its own right. Severity is **Low**: it affects only documentation and test-oracle quality, with no runtime exposure. |

**F04 sensitive-control kill check** (operator → the assertion that killed it):

- event_log forced true → "Export refusal did not behaviorally name event_log."
- event_log `|| true` → same assertion, confirmed live
- late Export generation guard → "Late invalidated Export still produced an artifact."
- Replay post-derive token guard → "Replay race cleared invalidation notice."
- Export in-flight lock → "Rapid Export calls produced duplicate artifacts."
- stored record integrity → "Stored record snapshot tamper was not detected." / "Export refusal did not name stored_record_snapshot_integrity."
- source mismatch → "Source SHA mismatch was accepted at Run."
- bound commit mismatch → "Bound-commit app mismatch was accepted."
- S05 disposition → "Authored scenario-block SHA-256 changed."
- expected contract hash → "Contract hash mismatch for condition-change."
- expected source hash → "Run failed for condition-change."

---

## TARGETED RESIDUAL CLOSURE TOTALS

- **CLOSED:** 1 (V035-F04)
- **PARTIALLY CLOSED:** 1 (V035-F05)
- **OPEN:** 0
- **UNTESTABLE:** 0

**ACTIONABLE FINDINGS REMAINING:** 1 (V035-F05 residual)

---

## TARGETED RESIDUAL CLOSURE: FAIL — ACTIONABLE FINDINGS REMAIN

### Remaining actionable defects

**V035-F05-R1: false negatives on semantically equivalent overclaims (Low)**
To reproduce, insert any of the lines below before `## Governing principle` in `README.md` in a temp copy, then run `JANUS_TEST_ROOT=<copy> node tests/v0.3.7-doc-audit.mjs`. The result is `PASS` with exit code 0 for each line.
- `Not signed, but tamper-proof evidence export.` Cause: `withoutAllowedTamperNegations` strips any `not … tamper-proof` span of up to 100 characters, even when "not" governs a different word.
- `Tamperproof evidence export.` / `Tamper‑proof evidence export.` (U+2011). Cause: the pattern `tamper[- ]proof` only accepts an ASCII hyphen or a space.
- `Approved as Version 1.0.` / `Promoted to Version 1.0.` / `v1.0 approved.` / `Version 1.0: approved.`
- `All nine V035 findings were independently closed.` / `Closure was independently confirmed.`

**V035-F05-R2: false positives on legitimate disclaimers (Low)**
Same method. The audit **FAILS** on:
- `Independent closure has not been confirmed.` and `Independent closure is not yet complete.` Cause: only three exact disclaimer strings are stripped before `independent closure[^.\n]{0,50}(confirmed|complete…)` runs.
- `This release is not ready for Version 1.0.` Cause: `(ready|…)\s+(for\s+)?Version 1\.0` has no negation guard.

**V035-F05-R3: README overclaims audit coverage (Low)**
`README.md` line 15 says semantically equivalent overclaims "are rejected across current release surfaces." R1 shows that is not the case.

**Suggested bounded correction** (for the maintainer; I made no changes):
1. Match the tamper-proof term as `tamper[\s\-‐-―]?proof`.
2. Apply negation exemptions only when the negator directly governs the term or the verb, for example `not (claimed to be |considered |a |yet )?…` and `has not been|is not (yet )?`, instead of a 100-character window or three exact strings.
3. Add Version 1.0 forms: `promoted to`, `approved as`, `v1\.0`, and the `Version 1\.0:` separator.
4. Add an "independently closed/confirmed" pattern that doesn't depend on the literal `V035-F01 through V035-F09`.
5. Add R1 and R2 as mutation operators, including must-pass disclaimer fixtures.
6. Reword README line 15 to describe the pattern classes the audit actually covers.

### Out-of-scope observation (not scored)

The deployed v0.3.7 `index.html` (line 153) still says "Version 0.3.6 is a bounded hardening candidate … remains pending targeted closure …". This is stale current-release text on a UI surface. It is not an unsupported affirmative claim of the F05 types tested here, but the final full regression should pick it up.

**Version 1.0 is not recommended.** V035-F04 is independently closed. V035-F05 needs one more bounded correction and a retest of R1–R3 before the final full independent zero-open-finding adversarial regression against the exact deployed artifact.
