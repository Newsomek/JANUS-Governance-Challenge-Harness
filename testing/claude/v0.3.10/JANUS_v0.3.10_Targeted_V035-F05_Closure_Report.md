# JANUS Governance Challenge Harness v0.3.10 — Targeted V035-F05 Closure Test

**Result: V035-F05 — PARTIALLY CLOSED · Targeted closure gate: FAIL**

| Item | Value |
|---|---|
| Test date/time | 2026-09-25, 14:53–15:04 UTC (10:53–11:04 EDT) |
| Tester | Claude (Cowork). Configured model id `claude-opus-5-5`; the serving model may differ. |
| Environment | Anthropic cloud Linux sandbox (Node v22.22.2, git) for isolated repo probes. The live deployment was tested in the user's Chrome tab (Claude in Chrome) on the GitHub Pages origin. |
| Deployed URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ |
| Scope | Targeted retest of residual V035-F05, plus a V035-F04 non-regression check. **This is not the final full independent Version 1.0 regression.** |
| Raw evidence | `JANUS_v0.3.10_targeted_F05_closure_raw_evidence.txt` |

**Network constraint.** The sandbox egress proxy refused `newsomek.github.io` (HTTP 403 on CONNECT), so every check on the deployed artifact ran in the browser against the live origin, using `fetch` and `crypto.subtle` and by driving the page's own Run, Replay and Export buttons. `github.com` was reachable from the sandbox, so a read-only clone was used only for the supplied tests and the isolated mutation probes. Every mutation ran on a throwaway copy. The clone was verified clean afterwards: HEAD unchanged, no edits, commits, tags or pushes.

---

## 1. Artifact identity gate — PASS

All values below were observed on the **deployed** origin.

| Check | Expected | Observed | Result |
|---|---|---|---|
| Version | 0.3.10 | 0.3.10 (build-info, page title, header) | PASS |
| Build ID | janus-governance-challenge-harness-v0.3.10 | same | PASS |
| build-info `code_commit` | ac9ce2245edc770a54d2d007d92dc83c4d20b68f | same | PASS |
| build-info.json SHA-256 | 52d4c8a8…e36a3d | 52d4c8a815af1c8d99c7a63a4a167353b117f2ff5ad53a97c11b420f30e36a3d | PASS |
| Served app.js vs build-info | 98169cbb…41b361 | 98169cbb…41b361 | PASS |
| JANUS source (docx) | 21766f5d…551fe4 | 21766f5d…551fe4 | PASS |
| Authored scenario block (regression-suite slice method) | 948536a1…56488 | 948536a1…56488 | PASS |
| All 87 build-info-listed files served with matching SHA-256 | 87/87 | 87/87, 0 mismatches | PASS |
| Release HEAD | 999c53f973c85cea6992f677909ec8af0047aee7 | clone HEAD 999c53f9…; the clone's build-info bytes equal the deployed bytes | PASS |
| Six authored scenarios present and unchanged | 6 | 6 ids exercised; block hash and all 6 contract hashes match | PASS |

## 2. Behavioral non-regression — PASS (6/6)

Each scenario was taken through Run, Replay and Export on the live page. To avoid a file download, the export Blob was captured in memory. The export code path and its integrity checks were not modified.

| Scenario | Disposition | Replay | Export | integrity_status | version / build | bound commit | contract hash matches oracle |
|---|---|---|---|---|---|---|---|
| condition-change | BLOCK + REAUTHORIZE | CONSISTENT | yes | PASS | 0.3.10 / v0.3.10 | ac9ce224… (MATCH/MATCH) | 52a18511 ✔ |
| evidence-change | BLOCK | CONSISTENT | yes | PASS | 0.3.10 / v0.3.10 | ac9ce224… | 36bc7042 ✔ |
| authorization-expiry | BLOCK + REAUTHORIZE | CONSISTENT | yes | PASS | 0.3.10 / v0.3.10 | ac9ce224… | e7e29686 ✔ |
| learning-authority | BLOCK + REAUTHORIZE | CONSISTENT | yes | PASS | 0.3.10 / v0.3.10 | ac9ce224… | d783abf9 ✔ |
| conflicting-authorities | INSUFFICIENT SPECIFICATION | CONSISTENT | yes | PASS | 0.3.10 / v0.3.10 | ac9ce224… | 437615c4 ✔ |
| mid-execution-revocation | INSUFFICIENT SPECIFICATION | CONSISTENT | yes | PASS | 0.3.10 / v0.3.10 | ac9ce224… | 916a960c ✔ |

All 15 `integrity_checks` were true in every export, and no alerts fired.

## 3. V035-F04 — remains CLOSED

These probes ran on the live page. After a Run, the in-memory record was mutated and then Export and Replay were attempted.

| Probe | Export | Replay |
|---|---|---|
| Event-log entry text edited | refused: event_log, stored core, snapshot, replay | DIVERGENCE |
| Event-log entry appended | refused (same 4 checks) | DIVERGENCE |
| Event log reordered | refused (same 4 checks) | DIVERGENCE |
| Disposition flipped to CONTINUE | refused (core, snapshot, replay) | DIVERGENCE |
| Rationale edited with a claim | refused (core, snapshot, replay) | DIVERGENCE |
| Control (no mutation) | exported, PASS | CONSISTENT |

These results give no reproducible basis to reopen F04. Coordinated in-console forgery is outside F04's scope, and the page discloses that limit.

## 4. Supplied tests (evidence only)

The supplied tests ran in an isolated copy and all exited 0:

- `v0.3.10-regression` (9 canonical exports, 4 refusal alerts)
- `v0.3.10-doc-audit` (4 files, baseline `eaa04472…`)
- `v0.3.10-surface-fixtures`
- `v0.3.10-surface-mutation-regression` (5/5 killed)
- `v0.3.10-surface-review-proposal` (no changes)
- `v0.3.10-manifest-audit` (87/87)

The working tree was unchanged afterwards. These results were not treated as sufficient for closure.

## 5. Methods and independent probes

The tester wrote a separate Node harness, `probe.mjs` (full source in the raw evidence). For each probe it:

1. copies the clone fresh;
2. applies one mutation;
3. runs the relevant audits;
4. records the exit code and message.

For the class K probes it also performed the documented release-construction step: `git add` plus regeneration of `build-info.json`, which needs no approval. It then ran every v0.3.10 audit.

**Independent probe count: 308 valid probes.**

- 289 valid local probe executions. There were 292 runs; 3 were invalid no-ops caused by the tester's own regex and were re-run.
- 19 browser probes: 6 smoke scenarios, 6 F04 probes and 7 reachability checks.

| Class | Probes | Expected | Observed |
|---|---|---|---|
| A. Governed-file byte changes (14 ops × 4 files: wording, punctuation, whitespace, CRLF, final newline ±, tab, case, heading, wrap, inserted claim, deleted disclaimer, status flip, BOM) | 56 | FAIL | **56/56 FAIL** (3 no-ops re-run with valid mutations → FAIL) |
| B. Prior semantic-escape claims (14 claims × 4 files: "cannot be changed", "integrity guaranteed", "verified and validated", "secure", "Version One", "1.0 release", "GA", "residual findings resolved", "reviewers found nothing", "all closed", "F05 resolved", …) | 56 | FAIL | **56/56 FAIL** |
| C. Markup/encoding (emphasis, split words, tags, named/numeric entities, NBSP, soft hyphen, ZW chars, homoglyphs, hidden text, strikethrough negation, heading, attributes, comments, VS16, RTL override, in-place homoglyph, in-place NBSP) | 72 | FAIL | **72/72 FAIL** |
| D. Governed file-set changes (add LICENSE, remove, delete, rename, rename-in-manifest, `./` alias, duplicate, traversal, reformat, key reorder, manifest deleted, empty set, symlink to changed bytes) | 13 | FAIL | **13/13 FAIL** |
| D. Byte-identical replacement / symlink to identical bytes | 2 | PASS | PASS (correct: bytes unchanged) |
| D. *New* ungoverned files (RELEASE.md, 404.html, readme.md, index.htm) | 4 | — | **PASS (undetected)**, see R01 |
| E. Baseline binding (hash-only, constant-only, manifest+baseline, set inequality, reserialize, duplicate-key shadow, `JANUS_TEST_ROOT` on modified tree) | 7 | FAIL | **7/7 FAIL** |
| E. Hand re-baseline with no approval token, rebinding the audit constant (E-5, E-7, E-8) | 3 | — | **PASS**, see R02 |
| E. Uppercase-hex hash (same value) / `JANUS_TEST_ROOT` redirected to a pristine root | 2 | — | PASS (benign / test hook) |
| F. Self-approval (audit, proposal, full suite on a candidate; candidate embeds its own hash; approval without token) | 5 | FAIL, no baseline/manifest/constant change | **5/5 FAIL, nothing rewritten** |
| G. Review proposal read-only (clean, changed, add LICENSE, missing file, deleted file, malformed JSON, narrowed set) | 7 | no mutation | **7/7 no mutation** (whole-tree hash and git status identical) |
| H/I/J. Approval workflow (5 flows × 9 steps) | 45 | see below | as designed |
| K. Non-governed public surfaces (release gate, app.js UI ×3, styles.css inject/hide, new page, 404.html, docs JSON, historical report, new test report, STATUS.txt, build-info field, img title) | 14 | detect | **13/14 undetected by every audit** (K-14 failed only because the node sandbox has no DOM, a probe artifact), see R01 |
| M. Policy consistency (conservative rewording, identical rewrite, strengthened disclaimer; import/regex scan) | 3 + scan | changed fails, identical passes | as expected; v0.3.10 audit does not import the claim policy and has no content-word logic |

**Approval workflow (H-1 README claim, I-1 LICENSE addition, J-1 harmless typo fix).** All three flows behaved the same way:

1. The audit failed before approval.
2. Approval was refused with no token, with a wrong token, with no expected baseline SHA, and with a wrong expected baseline SHA. The baseline was unchanged after every refused attempt.
3. A valid approval rewrote the baseline, for example `eaa04472…` → `8f830481…`.
4. The audit still failed ("changed without explicit audit rebinding").
5. After the audit constant was rebound, the audit passed. For I-1, it passed with 5 files including LICENSE.
6. One further byte change made the audit fail again.

Two more flows tested edge cases:

- **H-3:** approval of a manifest that lists a missing file is refused.
- **H-2:** approval of a manifest that *narrows* the set (drops README) succeeds. After the rebind, later README changes pass, because README is no longer governed (see R03).

**Current release claims (L).** The four governed files do **not** claim any of the following: that V035-F05 is independently closed, that all residuals are closed, that 1.0 is released or approved, that SHA binding is a signature, or that exports are tamper-proof. The export limits are stated correctly and more than once. One wording issue remains, and it is covered in R02.

---

## 6. Assessment

Within its four declared files, the exact-state control does what it says. Every changed byte fails, whatever the wording, markup or encoding, and so does every change to the file set. The review proposal is read-only, nothing approves itself, and a legitimate change such as the LICENSE addition passes only after explicit approval plus rebinding. Passage does not depend on recognizing any words. That part of V035-F05 is closed, and the brief's objection to semantic detection no longer applies.

The weakness has not been removed; it has moved to the boundary of the governed set. That boundary covers 4 of the 87 served files. It does not include:

- the current release-gate document, which the governed README names as a current control;
- the script and stylesheet that render the governed `index.html`;
- any newly added served page.

Each of these can carry, render or hide the same release-status claims F05 targets. All of them pass every v0.3.10 audit, because the only other binding (`build-info.json`) is regenerated during release construction without any approval step.

## 7. Residual findings

### V0310-F05-R01 — Medium — actionable: governed set leaves public release-claim surfaces outside exact-state control

- **Reproduction:**
  1. Copy the repo.
  2. Make any one of these changes:
     - (K-1) edit `tests/V0_3_10_RELEASE_GATE.md` to read "V035-F05 is independently CLOSED. All residual findings are closed. Version 1.0 is approved for promotion.";
     - (K-2, K-3, K-4) add the same claims to `app.js` UI strings (provenance line, empty-result text) or to the exported `integrity_scope` ("Tamper-proof, independently verified evidence");
     - (K-5) append `body::before{content:"JANUS Harness Version 1.0 — approved. V035-F05 independently closed."}` to `styles.css`;
     - (K-6) add `.footer-restriction{display:none!important}` to `styles.css`, which hides a governed disclaimer without changing any `index.html` bytes;
     - (K-7, K-8, K-12, D-probes) add `status.html`, `404.html` (GitHub Pages serves it for every unknown path; the deployment currently returns the platform 404), `RELEASE.md` or `STATUS.txt` containing the claims;
     - (K-10, K-11) flip the preserved v0.3.9 report headline, or add a `testing/claude/v0.3.10/` "CLOSED" report. The governed `index.html` links to `testing/claude`.
  3. Run `git add -A` and regenerate `build-info.json`.
  4. Run `doc-audit`, `manifest-audit`, `regression`, `surface-fixtures` and `surface-mutation-regression`.
- **Expected:** a change that alters publicly served or rendered release-status claims should fail until explicitly approved, which is the F05 objective.
- **Observed:** every audit PASSES (13/13). All of these paths are publicly served on the deployment (HTTP 200 confirmed for the release gate, `styles.css`, docs JSON and testing reports).
- **Classification:**
  - Public release-claim surfaces: the release gate, `app.js` UI and export text, `styles.css` (it can change what the governed page shows), and any new served page.
  - Historical evidence (public and linked, but a different category): the `testing/claude/*` reports.
  - Internal/support, not counted as release-claim surfaces: `tests/*.mjs` and docs JSON.
- **Suggested bounded fix:**
  - Govern the rendered closure of `index.html` (`app.js`, `styles.css`, image) and the current release gate.
  - Bind the *served file set* itself: any added or removed tracked file fails until approved. This could be done by making the approved baseline cover the `build-info` file list, or by governing all tracked files, with historical evidence hash-pinned.

### V0310-F05-R02 — Low — actionable: the approval authority is not where the workflow and docs place it, and the docs describe approval as "review"

- **Reproduction (E-7 / E-8):**
  1. Add a claim to README.
  2. Hand-edit `docs/APPROVED_GOVERNED_SURFACES.json` so README's hash is the candidate hash.
  3. Hand-edit `EXPECTED_BASELINE_SHA256` in `tests/v0.3.10-doc-audit.mjs`. That file is not governed; it is only listed in the regenerable `build-info.json`.
  4. Regenerate `build-info.json`.
- **Observed:** `doc-audit` and `manifest-audit` PASS. The approval script and token were never used.
- **Why this matters:**
  - The token `APPROVE-EXACT-RELEASE-BASELINE` is a static, publicly served literal, so it is neither necessary nor an authority. The effective approval act is simply a commit that changes two files.
  - No CI or branch protection exists (no `.github/`), so a failed audit does not block a GitHub Pages deployment.
  - The governed docs use wording that implies review took place: README "establish a new reviewed baseline", "the state that was explicitly reviewed and approved"; index.html "any change requires explicit review". The docs do not disclose that approval neither authenticates the approver nor evidences human review.
- **Expected:** the docs should describe exactly what the mechanism provides. Because the architecture itself says approval does not authenticate, the fix is disclosure, not cryptography.
- **Suggested fix:**
  - State plainly that the approval token and the rebind are workflow conventions with no authentication, and that the audit is a local, advisory pre-release check.
  - Replace "reviewed baseline" with "explicitly approved baseline".
  - Optionally, make the audit anchor a governed input.

### V0310-F05-R03 — Observation — actionable: no floor on the governed set

- **Reproduction (H-2):**
  1. Remove README from `GOVERNED_RELEASE_FILES.json`.
  2. Run the approval with a valid token and expected SHA.
  3. Rebind the audit constant.
- **Observed:** the audit passes with 3 files. Later README edits PASS.
- **Why it matters:** narrowing is explicit, and the proposal shows it as `removed_files`. But it uses the same single token as a routine approval, and nothing requires the four core release files to stay governed.
- **Suggested fix:** add a minimum governed set, or require a distinct confirmation for removals.

### Non-actionable notes (not counted)

- `JANUS_TEST_ROOT` lets the audit report PASS against a different root (E-9b). This is a test hook, and the output names the baseline hash.
- The review proposal reports a manifest-listed *missing* file as `changed:false` (G-4). It is listed in `added_files`, and both approval and audit refuse it.
- `docs/APPROVED_GOVERNANCE_CLAIMS.json` (the retired v0.3.9 allowlist) is still served. It is support data, but a future cleanup candidate.
- `docs/EXPECTED_CONTRACT_HASHES.json` still says version "0.3.9". This is deliberate, because the oracle is unchanged, and the regression suite asserts it.

## 8. Closure decision

- **Criteria satisfied:** the identity gate, behavioral gate and F04 checks pass, and the exact-state control is sound within its declared scope.
- **Criteria not satisfied:** the closure standard requires zero Critical, High, Medium and Low findings and zero actionable F05 Observations. This test found 1 Medium, 1 Low and 1 actionable Observation.
- **V035-F05 status:** **PARTIALLY CLOSED**. The byte-level control closes the semantic-escape class entirely. The governed-set scope leaves materially equivalent public claim surfaces uncontrolled.
- **Targeted F05 gate:** **FAIL**.
- **Final full independent regression:** still required. This targeted test does not authorize Version 1.0.

---

Artifact identity: **PASS**

V035-F04: **CLOSED**

V035-F05: **PARTIALLY CLOSED**

Independent probes: **308**

Actionable findings:
Critical: 0
High: 0
Medium: 1
Low: 1
Observation: 1

Targeted V035-F05 closure gate: **FAIL**

Final full independent regression still required: **YES**

Version 1.0 promotion from this targeted test alone: **NO**
