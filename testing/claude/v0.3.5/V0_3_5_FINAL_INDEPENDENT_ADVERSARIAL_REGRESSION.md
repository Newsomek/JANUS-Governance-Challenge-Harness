JANUS Governance Challenge Harness v0.3.5\
&#x20;FINAL INDEPENDENT ADVERSARIAL REGRESSION

Live testing ran in your Chrome tab against the deployed site. The local suites ran on a fresh clone of `e38b2f0`. I made no changes to the repository. Every in-page change was temporary and was either restored or cleared by reloading the page. I blocked real file downloads by capturing the export blobs in the page.

### 1. RELEASE IDENTITY

| Item               | Observed                                                                                                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version            | `0.3.5` (build-info, `HARNESS_VERSION`, page title)                                                                                                                                                                   |
| Build ID           | `janus-governance-challenge-harness-v0.3.5`                                                                                                                                                                           |
| Code commit        | `e0e6790e27e1a37858646f2f56411bd435bd5a63`                                                                                                                                                                            |
| Release HEAD       | `e38b2f00baa549d18fea4751f92b67b64f69e392`. This is `main`. Its parent is `e0e6790`. The only file that differs between the two is `build-info.json`. The live export recorded `deployment_parent_shas = [e0e6790…]`. |
| Source SHA         | `21766f5d…551fe4` (hashed from the served bytes, 50,354 bytes)                                                                                                                                                        |
| Scenario-block SHA | `948536a1…56488`. It matches when hashed as the bytes from `const scenarios = [` through `];` plus one LF. It is identical to `v0.3.1-reviewed`.                                                                      |
| Served app.js      | `5b8d47ac…23eb3`. The raw app.js at both `e0e6790` and `e38b2f0` gives the same hash.                                                                                                                                 |
| Manifest           | All 30 of 30 files match on the deployed site (checked live) and in the local clone. 11 tracked files are left out of the manifest (see F08).                                                                         |

**Result: PASS** on exact identity. F08 is recorded against the manifest.

### 2. LIVE FUNCTIONAL REGRESSION

- **Six authored scenarios:** 6/6 PASS. All six produce the expected dispositions.
- **Prediction permutations:** 36/36 PASS. Every comparison code, badge, label and event-log line matched the value I derived independently.
- **Replay:** 42/42 CONSISTENT (6 authored runs plus 36 permutations), 336/336 checks passed.
- **Export:** 42/42 PASS, 630/630 checks passed. Every contract hash matched `EXPECTED_CONTRACT_HASHES.json`.
- **Artifacts:** 42 expected, 42 actual (one each). No stale record carried over between runs, and there were no JS errors.
- **Side effect of heavy testing:** GitHub API rate-limiting (HTTP 403) during the matrix switched the GitHub `main` check to `UNAVAILABLE`. It caused no false failure.

### 3. ADVERSARIAL AREAS

- **A. Provenance: FAIL (F08 only).** Identity, hashes and the code-commit/release-HEAD separation are all exact.
- **B. Six scenarios: PASS.**
- **C. Permutations: PASS** (36/36).
- **D. State machine: FAIL (F03).** Triple-click Run makes 1 run. Triple-click Export makes 1 artifact. Run is locked out while Replay or Export is in flight. Replay and Export before a Run do nothing. Selection changes and Reset during the fetch phase are discarded correctly. The one failure is Export's final hashing phase.
- **E. Structural validation: PASS.** 29 malformed records all failed closed with bounded messages. There were 0 raw exceptions and 0 downloads.
- **F. Unicode, blank and duplicate cases: FAIL (F01, F02).** 30 equivalence variants were correctly refused, including all 8 prior cases plus WJ, BOM, SHY, EM/ideographic/narrow spaces, MVS, TAB/LF/LS, a leading space, tag space, FFA0/115F/1160 as suffixes, ZWJ, VS17, Khmer and a double space. Genuinely distinct strings were accepted. The failures are separators and U+007F.
- **G. Stored-run integrity: PASS.** 14 uncoordinated edits and 2 coordinated edits were all detected, and each failure notice names the failed checks.
- **H. Corroboration: PASS.**&#x20;
  - A bound-commit 404 is refused (confirmed against the real raw\.githubusercontent.com).
  - A bound-commit MISMATCH is refused.
  - Network errors and HTTP 403/500 give `UNAVAILABLE`, and the run proceeds.
  - Source and app.js mismatches are refused at Run, Replay and Export.
  - A mismatch on GitHub `main` is reported as MISMATCH without refusing. That is documented as optional.
- **I. Output handling: PASS.** HTML payloads in all 13 authored fields created 0 elements and executed nothing. All text is rendered with `textContent`.
- **J. Export artifact: PASS.** All 43 keys are consistent. The snapshot hash can be recomputed offline. The stable core leaves out `checked_at`/`observed_at` and the corroboration fields.
- **K. Documentation and UI: FAIL** (F01 wording, F06, F07, F08, F09). The integrity-disclosure wording is otherwise consistent across the README, the UI, the export and its restrictions.
- **L. Local suites: PASS** (I ran them myself; results in section 4).
- **M. Mutation quality: FAIL (F04, F05).**

### 4. AUTOMATED SUITES

- **Behavioral regression:** PASS (I ran it; it reports 9 exports and 2 alerts).
- **Documentation audit:** PASS (I ran it).
- **Mutation target preflight:** 18/18 active.
- **Mutation regression:** 18/18 killed. I traced the specific assertion that kills each one. 17 are killed by the intended assertion. "Integrity disclosure weakened" is killed only by an assertion that checks for the mutant's exact text (F05).

### 5. SOURCE CONFORMANCE

- **SUPPORTED:** 42 (18 commitments, 18 section citations, 6 disposition rationales)
- **CONTRADICTED:** 0
- **INSUFFICIENTLY SUPPORTED:** 0

The source text contains none of: reauthorization, revocation, expiry, precedence, hierarchy, jurisdiction, rollback or compensation. "Escalation" appears only in §33 (escalation point) and in one application example. S05 and S06 are therefore correctly still INSUFFICIENT SPECIFICATION.

One non-actionable note: S02's "§29/§38" citation combines the error-grounding rule from §29 with the rule in §38 against unjustified transitions. The labeled inference stays within what those sections say.

### 6. FINDINGS

**V035-F01 · Low · Actionable: YES · Area F/K**

- **Reproduction:** On the live page, in `condition-change`, add a commitment that copies commitment 1 but replaces one space with U+2800, then call `validateScenarioContract`.
- **Expected:** Rejected as a duplicate.
- **Observed:**&#x20;
  - U+2800, U+3164, U+FFA0, U+115F and U+1160 used as word separators are ACCEPTED as distinct, for both commitments and sources.
  - A full Run → Replay CONSISTENT → Export PASS went through with a duplicate-looking source displayed.
  - The reverse also happens: `"Policy A⠀B"` (visible gap) and `"Policy AB"` (no gap) are rejected as duplicates, which is a false rejection.
- **Evidence:** Rendered widths: `A B` is 24.9px, `A⠀B` is 31.8px, `AB` is 21.3px. A screenshot shows the blank gaps. The cause is that `canonicalComparisonText` deletes these characters instead of turning them into spaces. The CHANGELOG claims that "visually equivalent commitments and sources are rejected."
- **Why it matters:** The duplicate check can be bypassed, and the CHANGELOG overclaims what the check does.
- **Fix:** Map blank-rendering fillers to a space before collapsing whitespace. Add tests where these characters appear inside the text, not just as suffixes. Reword the CHANGELOG to say "canonically equivalent."

**V035-F02 · Low · Actionable: YES · Area F**

- **Reproduction:** Set `rationale = "\u007F"`, or add a commitment equal to an existing one plus `\u007F`.
- **Expected:** Refused as blank text or as a duplicate.
- **Observed:**&#x20;
  - Both are accepted.
  - Live Run → Replay → Export PASS produced an empty "Why" section and 4 visually identical commitments.
  - Chrome draws U+007F as blank space. C0/C1 controls draw as visible boxes, so those are not a problem.
- **Fix:** Add U+007F to the list of stripped characters, or reject characters in the Cc category from authored text. Add a test for it.

**V035-F03 · Low · Actionable: YES · Area D**

- **Reproduction:** Run, then Export. Change the scenario, or click Reset, after the fetch phase finishes but before the download. I triggered this at the first hash after the token check.
- **Expected:** The export is discarded, and the invalidation notice stays on screen.
- **Observed:**&#x20;
  - 1 file downloads for the invalidated `evidence-change/block` run, marked PASS.
  - The export's success path then clears the "Scenario changed… invalidated" notice.
  - I reproduced this with both a scenario change and a Reset.
- **Evidence:** This window is about 102 ms of the roughly 140 ms export, so a person clicking could realistically hit it. `exportEvidenceCore` checks the token only once, before about 11 later awaited operations.
- **Fix:** Re-check `token`/`lastRun` right before building the blob, and do not clear the notice if the export has been superseded. Add a test for it.

**V035-F04 · Medium · Actionable: YES · Area L/M**

- **Reproduction:** Apply extra mutants to temporary copies of the files and run the v0.3.5 suites.
- **Expected:** The regressions that matter are killed.
- **Observed:** All of these SURVIVE:&#x20;
  - S05 disposition changed to ESCALATE
  - `EXPECTED_CONTRACT_HASHES` altered
  - source-hash mismatch accepted at Run
  - bound-commit MISMATCH downgraded to UNAVAILABLE
  - `record_integrity_match` or `stored_record_snapshot_integrity` forced true
  - invalidation on selection change removed
  - the Replay post-derive token check removed
  - the export `event_log` check forced true
  - whitespace collapse removed
- **Why it matters:** Gate items 9 and 10 (scenario block unchanged, source hash unchanged) and several core integrity controls have no automated protection. The whole gate passes even when an authored disposition has been changed.
- **Fix:**&#x20;
  - Assert the scenario-block and source SHAs, and assert that contract hashes equal `EXPECTED_CONTRACT_HASHES`.
  - Assert the EXACT disposition in each scenario's canonical run.
  - Add tests for source and bound mismatches, uncoordinated snapshot edits, and invalidation.
  - Add mutation operators for each of these.

**V035-F05 · Low · Actionable: YES · Area M**

- **Observed:** The "integrity disclosure weakened" operator is killed only because the doc audit looks for the operator's exact replacement text (`!readme.includes('It is tamper-proof after export')`). All of these survive:&#x20;
  - deleting the DevTools sentence
  - rewording it into a different overclaim
  - changing "PASS is not a digital signature" to "PASS is a digital signature"
  - removing the About panel's "not a digital signature" wording
  - adding a Version 1.0 claim to the README
  - adding an independent-closure claim to the README
- **Fix:** Replace the mutant-specific checks with positive assertions on each disclosure sentence, plus general checks against V1.0 and closure claims.

**V035-F06 · Low · Actionable: YES · Area K**

- **Observed:** The superseded banner in `tests/V0_3_3_RELEASE_GATE.md` says "See `V0_3_4_RELEASE_GATE.md`", which is itself superseded. The v0.3.2 and v0.3.4 gates both point to V0_3_5. The doc audit only checks that the banner is present.
- **Fix:** Point it to `V0_3_5_RELEASE_GATE.md` and check the pointer in the audit.

**V035-F07 · Low · Actionable: YES · Area K**

- **Observed:**&#x20;
  - The CHANGELOG's v0.3.2 entry still says it "closes V031-NEW-07". That contradicts the v0.3.2 independent report (only partly closed) and the corrected v0.3.3 entry (closed in v0.3.3).
  - The CHANGELOG's v0.3.4 entry and the README's v0.3.4 section still say "closure is not claimed until…". Neither records that v0.3.4 was superseded after its smoke residuals. The v0.3.2 and v0.3.3 sections do record that they were not promoted.
- **Fix:** Annotate the v0.3.2 claim and mark v0.3.4 as superseded and not promoted.

**V035-F08 · Observation · Actionable: YES · Area A/K**

- **Observed:**&#x20;
  - `assets/images/stratosengine_cover.jpg` is served and shown twice in the live UI, but it is not in `build-info.json`.
  - `tests/V0_3_1_SMOKE_TEST.md` and the v0.1–v0.3 test evidence (6 files) are also served but not listed.
  - The README says the manifest records "SHA-256 hashes of the served files", and nothing documents how files are chosen for it.
- **Fix:** Add these files to the manifest, or document what the manifest covers and reword the README claim.

**V035-F09 · Observation · Actionable: YES · Area K/L**

- **Observed:** `V0_3_5_AUTOMATED_REGRESSION_RESULT.txt` leaves out the scenario-block SHA and source SHA lines that the v0.3.4 record included. The method for computing the block hash is not written down anywhere. I could only reproduce it by trying byte ranges; the one that matches is the block plus a trailing LF.
- **Fix:** Record both hashes and write down the exact method.

**Non-actionable observations**

- The GitHub `main` MISMATCH/UNAVAILABLE results are documented as optional corroboration.
- C0/C1 control characters render as visible boxes, so they are not a bypass.
- NFKC-only and homoglyph variants are accepted, which is correct under the stated NFC rule. The misleading wording is covered by F01.
- The contract hash leaves out the scenario `name`, but the authored core covers it.
- After a Run refusal, the page shows "No challenge has been run for this selection" even though evidence existed. The refusal banner is explicit, so it isn't misleading.
- A coordinated forgery that recomputes the client-side hashes is an inherent, disclosed limitation.

**Totals**

| Severity                    | Count |
| --------------------------- | ----- |
| Critical                    | 0     |
| High                        | 0     |
| Medium                      | 1     |
| Low                         | 6     |
| Actionable observations     | 2     |
| Non-actionable observations | 6     |

**TOTAL ACTIONABLE FINDINGS: 9**

### 7. FINAL GATE RESULT

FAIL — ACTIONABLE FINDINGS REMAIN

v0.3.5 FINAL INDEPENDENT REGRESSION FAILED.\
&#x20;DO NOT PROMOTE TO VERSION 1.0.