# JANUS Governance Challenge Harness v0.3.1
## Independent Regression, Integrity & Release-Candidate Test Report

| | |
|---|---|
| Tested URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ |
| Release HEAD | `9dc291a5478668b9baae957797b5c799917d35f7` |
| Bound code commit | `a10722a087e740d183598125909319610ca4238f` |
| Baseline | `v0.3-tested` → `d79b0385c5b041772580121deaaf1531c8d4a845` |
| Date | 2026-09-24, about 05:10–05:55 UTC |
| Raw results | `JANUS_Harness_v0.3.1_raw_results.json` |

---

## 1. Executive summary

**The release gate passes.**

- The deployed six-scenario smoke test passed **6/6**. Every scenario went Run → REPLAY CONSISTENT → Export PASS.
- The full matrix passed **36/36**.
- Every clean, untampered Replay was CONSISTENT: **68/68**. Every clean Export was PASS: **67/67**.
- Every stable evidence-core hash matched a hash I recomputed independently in Node from the repository code. I did not rely on the page's own hashing for this.

**V03-NEW-01 is fixed.**

- Volatile fields (`checked_at`, `verification`, `hash_match`, `observed_at`, the GitHub corroboration fields and `generated_at`) no longer affect the core hash.
- Every stable source and build field does affect it.
- Replay and Export stayed clean after delays of 8, 16 and 21 seconds.

**Code provenance is now bound to the deployed build, not to GitHub `main`.**

- GitHub's unauthenticated API quota ran out part-way through the matrix, returning HTTP 429.
- For the remaining runs the bound commit `a10722a…` was kept, and corroboration showed `UNAVAILABLE`.
- A simulated move of `main` produced `MISMATCH` and did not replace the bound commit.

**No new Critical, High or Medium defect was found.** I logged six Low findings and two Observations. The most relevant are:

- The contract schema check does not validate enum values.
- After any Run refusal, the Run button stays disabled.
- The exported `replay` block is outside every integrity check.
- The build manifest's version, build ID and commit are trusted as written at Run.
- A small wording regression appears on a fresh page.
- The README still contains one stale v0.3 sentence about "GitHub `main`" provenance.

**Source conformance is unchanged.** Across 18 commitments: 0 contradicted, 0 insufficiently supported, 0 label disagreements.

**Recommendation:** v0.3.1 is fit to share, and tagging `9dc291a` as `v0.3.1-reviewed` is reasonable. The Low items can wait for v0.3.2. I did not create the tag.

---

## 2. Test environment

**Browser**
- Your Chrome window, driven through Claude in Chrome.
- I drove the real UI controls through page-context JavaScript: I set select values, dispatched `change` events and called `.click()` on the buttons.
- A final clean Run → Replay was also done with real mouse clicks.

**Instrumentation**
- Transparent and in-memory only. Nothing was written to your Downloads folder.
  - `window.alert` was captured.
  - `URL.createObjectURL` and `HTMLAnchorElement.prototype.click` were wrapped. Each export's Blob and filename were captured instead of saved to disk.
- **Caveat:** the browser's final save-to-disk step was not exercised. Everything up to it was: the Blob was built, an anchor with a `download` name was created, and `click()` was called.

**Fault injection**
- A `window.fetch` wrapper (byte flip, 404, network error, manifest edits, GitHub API mocks).
- In-place mutation of `lastRun` and `lastReplay`.

**Independent oracle**
- Node v22 loaded the repository `app.js` in a VM with the repo DOCX and manifest values.
- It computed all 6 contract hashes and all 36 evidence-core hashes, which I injected into the page for comparison.

**Limits**
- The cloud sandbox could not reach github.io (proxy 403). All live-file hashing ran in the browser.
- The GitHub API quota was exhausted from about cycle 26 onward.

---

## 3. Deployment verification

| Check | Result |
|---|---|
| Repo `main` HEAD | `9dc291a5478668b9baae957797b5c799917d35f7` ✔ |
| `v0.3-tested` tag | Tag object `4a93bd8…`, peeled to `d79b0385c5b041772580121deaaf1531c8d4a845` ✔ |
| History | `9dc291a` adds **only** `build-info.json`; `a10722a` holds all code changes ✔ |
| `build-info.json` served | HTTP 200, 1,366 B, SHA `8aafebba…d115`, identical to repo HEAD ✔ |
| `code_commit` in manifest | `a10722a087e740d183598125909319610ca4238f` ✔ |
| Live `app.js` / `index.html` / `styles.css` | Byte-identical to `a10722a` and to the manifest hashes (`0cc9f921…`, `01a6258a…`, `f8f2e06e…`) ✔ |
| Live README, CHANGELOG, VERSION, preserved v0.3 report and raw JSON | Byte-identical to the manifest hashes ✔ |
| Live `app.js` ≠ v0.3 `app.js` (`1e82fe2e…`) | ✔ not stale |
| Page identity | Title "…Harness v0.3.1", header "VERSION 0.3.1", `HARNESS_VERSION` 0.3.1 ✔ |
| JANUS DOCX | HTTP 200, 50,354 B, `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4` ✔ |
| `testing/claude/v0.3/` report and raw results | Present in the repo and served ✔ |
| Docs read | README, CHANGELOG, VERSION.txt, build-info.json, tests/V0_3_1_SMOKE_TEST.md, the v0.3 report ✔ |

**Verdict:** the deployment is the intended v0.3.1 release. Testing proceeded.

---

## 4. Six-scenario release smoke test (Phase 1)

Each scenario was run from Reset with an explicit prediction.

| # | Scenario | Prediction | Encoded | Badge | Run | Replay (all 7 flags) | Export | Core SHA (= independent) |
|---|---|---|---|---|---|---|---|---|
| 01 | condition-change | B+R | BLOCK + REAUTHORIZE | EXACT | ✔ | CONSISTENT ✔ | PASS ✔ | `849cc3cf…` |
| 02 | evidence-change | BLOCK | BLOCK | EXACT | ✔ | CONSISTENT ✔ | PASS ✔ | `0e232f38…` |
| 03 | authorization-expiry | B+R | BLOCK + REAUTHORIZE | EXACT | ✔ | CONSISTENT ✔ | PASS ✔ | `9db2d32e…` |
| 04 | learning-authority | B+R | BLOCK + REAUTHORIZE | EXACT | ✔ | CONSISTENT ✔ | PASS ✔ | `afe04304…` |
| 05 | conflicting-authorities | INSUF | INSUFFICIENT SPECIFICATION | EXACT | ✔ | CONSISTENT ✔ | PASS ✔ | `3831a345…` |
| 06 | mid-execution-revocation | INSUF | INSUFFICIENT SPECIFICATION | EXACT | ✔ | CONSISTENT ✔ | PASS ✔ | `9f7a0c06…` |

For all six:

**After Run**
- Source expected SHA = observed SHA = `21766f5d…`.
- Bound commit `a10722a…` present.
- Provenance line shown: "Bound code commit … Served app.js hash verified. GitHub main corroboration: MATCH".
- No refusal notice. Replay and Export both enabled.

**After Replay**
- `replay_match`, `disposition_match`, `contract_match`, `source_match`, `code_match`, `record_integrity_match` and `authored_state_match` were all `true`.
- Export stayed enabled.

**After Export**
- One JSON was produced, `integrity_status: PASS`, with all 15 `integrity_checks` true.
- `scenario_id` and `reviewer_prediction` equal the selection.
- The embedded `replay` block equals the live replay record.
- `record_snapshot_sha256` can be recomputed from the exported file itself.
- 0 uncaught errors, 0 alerts.

**Recorded export (S01 / B+R):** `janus-harness-condition-change-block_reauthorize-2026-09-24T05-15-00-480Z-v0.3.1.json`

| Field | Value |
|---|---|
| version / build_id | 0.3.1 / janus-governance-challenge-harness-v0.3.1 |
| harness_code_commit | `a10722a087e740d183598125909319610ca4238f` |
| Build provenance | build_info_url …/build-info.json; build_version 0.3.1; app.js expected = observed `0cc9f921…`; deployment_head_observed `9dc291a…` (parent `a10722a…`); commit_verification MATCH |
| generated_at / exported_at | 2026-09-24T05:15:00.093Z / 05:15:00.480Z |
| Source | URL …/docs/JANUS_Orientation_Edition_2026_EN.docx; expected = observed `21766f5d…`; 50,354 B; checked_at 05:14:59.531Z |
| contract_sha256 | `52a18511594cedbfeceba660b5cb32f293206d93e8b8ee98d6f90c4a3f1eb9a3` |
| evidence_core_sha256 | `849cc3cf5e555db4d8e65ebdfb18be93f92ec30c816b4240a3c6cfa891e85662` |
| record_snapshot_sha256 | `030efe88fdfdf105565f7840412ebfaa3d4370fb46f7759367aca27f53990799` |
| Assessment | BLOCK + REAUTHORIZE; comparison EXACT MATCH |
| Compatibility | [BLOCK, ESCALATE] with reason |
| Support | DIRECT, DIRECT, OPEN |
| Event log | 6 events |
| replay | CONSISTENT |
| integrity | PASS, 15/15 checks |
| Attribution | Kelly Newsome · Stratos Engine / Eryk Dubiel + LinkedIn |
| Restrictions | 7, including "not cryptographically signed or tamper-proof" |

**Phase 1 verdict: PASS 6/6.** Proceeded to Phase 2.

---

## 5. Full 36-run matrix (Phase 2)

All 36 permutations passed Run → REPLAY CONSISTENT → Export PASS. Every one was checked against the independent oracle for:

- core hash, contract hash and comparison code;
- disposition in the UI and in the record;
- badge;
- compatibility set;
- source hashes and code provenance;
- all 7 replay flags, all 15 export checks, and JSON/selection match;
- timestamps;
- 0 errors.

The table shows each scenario's encoded assessment and the comparison result for each prediction.

| Scenario (encoded) | CONTINUE | BLOCK | B+R | ESCALATE | ROLLBACK | INSUF |
|---|---|---|---|---|---|---|
| S01 (B+R) | DIFF | PART | EXACT | PART | DIFF | DIFF |
| S02 (BLOCK) | DIFF | EXACT | PART | PART | DIFF | DIFF |
| S03 (B+R) | DIFF | PART | EXACT | PART | DIFF | DIFF |
| S04 (B+R) | PART | PART | EXACT | PART | DIFF | DIFF |
| S05 (INSUF) | DIFF | PART | DIFF | PART | DIFF | EXACT |
| S06 (INSUF) | DIFF | PART | DIFF | PART | PART | EXACT |

- The prediction never changed the encoded assessment (36/36).
- There are 36 distinct core hashes, one per permutation.
- `commit_verification` was MATCH for the first 25 of 42 smoke+matrix cycles. It was UNAVAILABLE (HTTP 429) afterwards, with no effect on Run, Replay or Export.

---

## 6. v0.3 Critical-fix verification (Phase 3, V03-NEW-01)

**Construction.** `evidenceCore()` now takes two helper outputs:

- `stableSourceEvidence()`: title, url, path, expected/observed SHA and bytes;
- `stableHarnessProvenance()`: build_info_url, version, build_id, code_commit, app.js expected/observed hash and match flag.

`checked_at`, `verification`, `hash_match`, `observed_at`, the corroboration fields and `generated_at` are outside the core. They are covered by the separate `record_snapshot_sha256`.

**Delay test (S02 / BLOCK)**

| Step | Result |
|---|---|
| Replay after +8 s | CONSISTENT |
| Replay again after +16 s | CONSISTENT; rederived core = stored |
| Export at +21.5 s | PASS |

**Field sensitivity** was checked in the live page and independently in Node. In Node, changing only the volatile fields altered the core in 0/36 permutations, and changing only `bytes` failed to alter it in 0/36.

| Changes core? | Fields |
|---|---|
| **No** (correct) | source `checked_at`, `verification`, `hash_match`; provenance `observed_at`, `commit_verification`, `deployment_head_observed`, `corroboration_note`; `generated_at` |
| **Yes** (correct) | source `title`, `url`, `path`, `expected_sha256`, `observed_sha256`, `bytes`; provenance `build_info_url`, `build_version`, `build_id`, `code_commit`, `app_js_expected_sha256`, `app_js_observed_sha256` |

The live cores equal the independently recomputed cores for 36/36 permutations.

**V03-NEW-01: FIXED.**

---

## 7. Source-byte hashing (Phase 4)

A clean fetch produced observed = expected on every clean cycle.

| Injected at | 1-byte flip | HTTP 404 | Network failure |
|---|---|---|---|
| Run | Refused. Banner: "Execution refused: Observed JANUS source-document SHA-256 does not match the published expected hash." | Refused: "…Source document fetch failed: HTTP 404" | Refused: "…Failed to fetch" |
| Replay | REPLAY REFUSED, banner with reason, Export disabled | Same | Same |
| Export | Refused (alert with reason), no file | Same | Same |

**9/9 detected.** No PASS evidence was produced, the reason was always visible, and there were 0 uncaught errors.

One minor point: "Failed to fetch" does not name which resource failed (see V031-NEW-07).

---

## 8. Build / commit provenance (Phase 5)

| # | Requirement | Result |
|---|---|---|
| 1–2 | `build-info.json` live; records `a10722a…` | ✔ |
| 3 | Records hashes of served files | ✔ 9 files. **At runtime only `app.js` is verified.** |
| 4 | Manifest is primary provenance | ✔ `code_commit` comes from the manifest; Run is refused if the manifest is missing, malformed or does not match `app.js` |
| 5 | GitHub main is corroborative only | ✔ It sets only `commit_verification` |
| 6–7 | API quota / 403 does not erase the commit | ✔ Real 429s (26+ cycles) and a simulated 403 or network failure all kept `a10722a…`, showed UNAVAILABLE, and still gave CONSISTENT and PASS |
| 8–9 | `main` moves ahead | ✔ Mocked `main` = `d79b038`: status MISMATCH with the note "GitHub main app.js differs from the bound build manifest"; bound commit unchanged; Replay CONSISTENT; Export PASS |
| 10 | Provenance fields protected | ✔ `code_commit`, `build_version`, `build_id` and the app.js hashes are in the core; the top-level `harness_code_commit` is checked directly; `commit_verification` is covered by the snapshot hash only |

**Faults injected at Run**

| Fault | Result |
|---|---|
| Manifest 404 | Refused with visible reason |
| Manifest network failure | Refused with visible reason |
| Malformed `code_commit` | Refused with visible reason |
| `files["app.js"]` missing | Refused with visible reason |
| Wrong `app.js` hash | Refused with visible reason |
| Served `app.js` byte-flipped | Refused with visible reason |
| Served `app.js` 404 | Refused with visible reason |

**Accepted at Run (finding V031-NEW-05):** a manifest with `version: "9.9.9"`, an altered `build_id`, or `code_commit` set to `d79b038`, when the `app.js` hash is intact.

- The evidence then records those values. For example, one run's evidence names `d79b038` as its code.
- These cases were caught only because the live manifest differed at Replay: DIVERGENCE on `code_match` and/or `authored_state_match`.

**Faults injected at Replay and Export**

| Fault | Result |
|---|---|
| Manifest commit or version changed at Replay | DIVERGENCE |
| `app.js` flipped at Replay | REPLAY REFUSED |
| Manifest commit changed at Export | Refused (`code_commit`, `authored_state_integrity`) |
| `app.js` flipped at Export | Refused |
| GitHub 403 at Export | PASS with UNAVAILABLE (correct) |

**In-memory tampering** (`lastRun` code commit, provenance commit, build version, app.js hash, `commit_verification`) was caught. See §10.

---

## 9. Replay / integrity

**Clean Replays: 68/68 CONSISTENT.** That is 6 smoke, 36 matrix, 18 determinism, 6 after reload and 2 delayed.

`replayMatch` combines six checks:

- disposition;
- contract;
- source (live bytes vs. Run);
- code (live commit and app.js vs. Run);
- record-snapshot integrity;
- authored-state integrity (rederived core vs. stored).

There is also a real-click confirmation screenshot: S06 / INSUF with all flags true.

Tampering results are in §10. When Replay diverges, the banner reads "Replay divergence detected. Ordinary evidence export is blocked.", Export is disabled, and the failing flags appear in the replay record.

---

## 10. Export integrity (Phase 6)

**Clean Exports: 67/67 PASS.**

**Setup:** S02 / BLOCK.
- Timing A: tamper after Run, then Replay, then Export.
- Timing B: tamper after a clean Replay, then Export.

| Tamper | A: Replay | B: Export refused with |
|---|---|---|
| disposition | DIVERGENCE (disposition, record) | disposition_label, core, snapshot |
| disposition label | DIVERGENCE (record) | disposition_label, core, snapshot |
| prediction | DIVERGENCE (record, authored) | prediction_label, comparison_code/label, event_log, core, snapshot, authored |
| prediction label | DIVERGENCE | prediction_label, core, snapshot |
| comparison code / label | DIVERGENCE | comparison_code / comparison_label, core, snapshot |
| contract hash | DIVERGENCE (contract, record) | contract_hash, core, snapshot |
| source observed hash | DIVERGENCE | source_matches_run, core, snapshot |
| event log | DIVERGENCE | event_log, core, snapshot |
| code commit (top-level) | DIVERGENCE (code, record) | code_commit, snapshot |
| compat set, compat rationale, scenario rationale, source expected hash, source URL, byte count, evidence required, support status, provenance code_commit, build version, manifest app.js hash, repository, restrictions, JANUS attribution, harness attribution | DIVERGENCE (record) | core, snapshot |
| Non-core: generated_at, checked_at, hash_match, commit_verification, harness name | DIVERGENCE (record) | snapshot |
| Recompute attack: disposition + core + snapshot rehashed | DIVERGENCE (disposition, authored) | authored_state_integrity |

- **Protected fields:** 25/25 caught at A and 25/25 caught at B.
- **Non-core fields:** 5/5 caught at each timing.
- No PASS-looking evidence was emitted for any of these.

**Not caught.** These are the inherent limit of an unkeyed hash, which the README discloses in general terms.

- Forging `commit_verification`, the corroboration note or `generated_at` and then recomputing `record_snapshot_sha256` → CONSISTENT and PASS, at both A and B.
- A fully self-consistent forgery (prediction CONTINUE→BLOCK, with labels, comparison, log and both hashes rewritten) → CONSISTENT and PASS. The result is byte-identical to a genuine BLOCK run (V03-NEW-07, unchanged).
- The **exported `replay` block** is copied from `lastReplay` without any check. Setting `result = "FORGED RESULT"` and zeroing a hash after a clean Replay exported `integrity_status: PASS` containing the forged block (V031-NEW-04).

**Structural tampering.** Setting `harness_provenance` or `source_document` to `null` throws an uncaught `TypeError` in Replay and in Export, because the hashing runs outside their `try` blocks. The result fails closed (no export) but silently (V031-NEW-06).

**What is not protected, and whether it is disclosed**

| Item | Disclosed? |
|---|---|
| `replay` block, `export_provenance`, `integrity_checks`, `integrity_scope`, `exported_at` | No. `integrity_scope` says "stable authored evidence core plus full stored record snapshot" but does not say the replay block is outside it. |
| Non-core fields: only unkeyed snapshot protection | Yes, in general terms ("not cryptographically signed or tamper-proof") |
| `index.html`, `styles.css` etc. listed in the manifest but not verified | No |
| Manifest `code_commit` asserted, not verified against git | Partly: the README describes the two-commit process |

---

## 11. Refusal observability (Phase 7)

| Refusal | Visible? |
|---|---|
| Source hash mismatch, 404, network (Run) | ✔ Banner "Execution refused: …" (screenshot taken) |
| Same at Replay | ✔ Banner "Replay refused: …" and replay record |
| Same at Export | ⚠ `alert()` dialog only; nothing persists on the page |
| Invalid scenario | ✔ Summary reads "Invalid scenario selection." and Run is disabled; a forced Run shows "Execution refused: invalid scenario selection." |
| Invalid prediction | ✔ Run disabled; a forced Run shows "Execution refused: choose a valid reviewer prediction…" |
| Malformed contract (missing or wrong-type fields) | ✔ "Execution refused: Scenario … invalid" |
| Build-info failure | ✔ "Build provenance fetch failed / is malformed" |
| Provenance mismatch (`app.js`) | ✔ "Served app.js SHA-256 does not match build provenance." |
| Corroboration MISMATCH or UNAVAILABLE | ✔ Shown in the provenance line; not a refusal, by design |
| Integrity mismatch | ✔ Divergence banner (failing flags only in the record); Export shows the failed check names in an alert |

The generic "No challenge has been run for this selection." is **no longer** the only signal. **V03-NEW-04 is fixed for Run and Replay.**

Remaining gaps:

- Export refusals are shown only in an alert.
- After a Run refusal the Run button stays disabled (V031-NEW-02).
- A null scenario object and structural tampering produce no message.

---

## 12. Malformed-contract robustness (Phase 8)

These tests mutated the contracts in memory and restored them afterwards. I confirmed all six contracts were intact afterwards.

| Case | Result |
|---|---|
| Missing commitments / sources / disposition / compatibility set / rationale | ✔ Refused visibly, no export |
| Compatibility set contains `FOO`; commitments `[null]`; sources `[42]` | ✔ Refused visibly |
| **Disposition `"FOO"`** | ✘ Accepted. The UI disposition is blank; Export PASS with `orientation_level_disposition_label` missing |
| **Support status `"TOTALLY PROVEN"`** | ✘ Accepted. Rendered with OPEN styling; Export PASS carrying the invented status |
| **Empty commitments `[]`** | ✘ Accepted, Export PASS |
| Compatibility set contains the scenario's own disposition | ✘ Accepted (logically inconsistent) |
| **`scenarios[0] = null`** | ✘ Uncaught `TypeError` (reading 'id') in `selectedScenario()`; no visible reason. Fails closed. |

In every case the UI never stuck in "Verifying…", and controls returned to a safe state.

**Summary:** 8 of 13 refused visibly, 4 were accepted and exported PASS, and 1 threw an uncaught error.

**V03-NEW-05: PARTIALLY FIXED** (the remainder is V031-NEW-01). Only a code edit can trigger these cases; the six shipped contracts are valid.

---

## 13. Race tests (Phase 10)

| Case | Result |
|---|---|
| R1 Run → immediate scenario change | ✔ No state, Export off |
| R2 Run → immediate prediction change | ✔ |
| R3 Replay → immediate prediction change | ✔ `lastReplay` null |
| R4 Run → immediate Reset | ✔ |
| R5 Run S01 → switch S06 → Run S06 | ✔ Only the S06 result |
| R6 Replay → Reset → direct `exportEvidence()` | ✔ 0 files |
| R7 Export in flight → scenario change | ✔ 0 files |
| R8 Run → prediction change → Run | ✔ The later run (ESCALATE) wins |
| R9 Replay in flight → prediction change → Run | ✔ The new run wins, `lastReplay` null |

**9/9 pass.** 0 stale exports, 0 uncaught errors.

---

## 14. Prediction validation (Phase 11)

I injected these values as `<option>`s:

- `constructor`, `toString`, `__proto__`, `prototype`, `valueOf`, `hasOwnProperty`
- `FOO`, `block`, `"BLOCK "`, `" "`
- `CONTINUE` followed by U+200B (zero-width space)

Results:

- Run was disabled automatically for **11/11**.
- A forced Run was refused visibly for **11/11**.
- 0 runs, 0 evidence, 0 uncaught errors.

This works because `VALID_PREDICTIONS` is a `Set` combined with `Object.hasOwn`. **PASS.**

---

## 15. Compatibility audit (Phase 12)

UI text = `scenario.compatiblePredictions` = run record = export, for 6/6 scenarios. The comparison behaviour equals the set for 36/36 permutations.

| Scenario | Encoded | Compatible set |
|---|---|---|
| S01 | B+R | BLOCK, ESCALATE |
| S02 | BLOCK | B+R, ESCALATE |
| S03 | B+R | BLOCK, ESCALATE |
| S04 | B+R | BLOCK, CONTINUE, ESCALATE |
| S05 | INSUF | BLOCK, ESCALATE |
| S06 | INSUF | BLOCK, ESCALATE, ROLLBACK/COMPENSATE |

- **S05 B+R → DIFFERENT.** The new reason reads: "obtaining another authorization does not itself resolve which of the conflicting authorities governs". This is clear and persuasive.
- **S06 B+R → DIFFERENT.** The new reason reads: "the immediate in-flight handling rule is still unspecified; a later authorization event would not by itself decide what the already-running action should do now". This is understandable.
  - An asymmetry remains: bare BLOCK (which also presumes an in-flight rule, namely *stop*) is PARTIAL.
  - A reviewer could still argue B+R ⊇ BLOCK.
  - This is an interpretive choice, now disclosed. It is not a software defect.
- **S06 CONTINUE → DIFFERENT**, with an explicit reason. Coherent.

**INT-01: NOT A SOFTWARE DEFECT.** It has been addressed by disclosure.

---

## 16. Support-status audit (Phase 13)

**Vocabulary.** The four labels are defined in the UI glossary and the README, and each has a distinct colour:

| Label | Colour (rgb) |
|---|---|
| DIRECTLY SUPPORTED | 143,213,170 (green) |
| REASONABLE INFERENCE | 212,180,255 (violet) |
| EXTENDED / BY ANALOGY | 159,210,255 (blue) |
| OPEN | 232,207,125 (amber) |

S02 #2, S03 #1 and S05 #2 are all REASONABLE INFERENCE ✔.

**Re-check of all 18 commitments against the extracted DOCX text**

| # | Harness label | My assessment | Basis |
|---|---|---|---|
| S01-1 | DIRECT | DIRECTLY SUPPORTED | §01 "A decision is not authorization"; §06 Decision/Authorization |
| S01-2 | DIRECT | DIRECTLY SUPPORTED | §19 "currently justified … does not automatically imply the right to carry it out" |
| S01-3 | OPEN | OPEN ✔ | "reauthor*" occurs 0 times |
| S02-1 | EXTENDED | EXTENDED / BY ANALOGY ✔ | §28 is stated for data (conservative label) |
| S02-2 | INFERENCE | REASONABLE INFERENCE ✔ | §06, §19 ("own … history"), §27 |
| S02-3 | OPEN | OPEN ✔ | No dependency rule stated |
| S03-1 | INFERENCE | REASONABLE INFERENCE ✔ | §27 history; §39 "Conditions can change" |
| S03-2 | EXTENDED | EXTENDED / BY ANALOGY ✔ | §26 "Memory — provenance and scope of validity" |
| S03-3 | OPEN | OPEN ✔ | "expir*" occurs 0 times |
| S04-1 | DIRECT | DIRECTLY SUPPORTED | §22 "must not constitute a standalone right to expand its permissions" |
| S04-2 | DIRECT | DIRECTLY SUPPORTED | §24 "development of capability and … authority remain separate"; §38 |
| S04-3 | OPEN | OPEN ✔ | §24 requires a process "that can be independently verified" but does not specify it |
| S05-1 | EXTENDED | EXTENDED / BY ANALOGY ✔ | §28 |
| S05-2 | INFERENCE | REASONABLE INFERENCE ✔ | §32 fail-closed; §38 refusal of unjustified transition |
| S05-3 | OPEN | OPEN ✔ | "precedence", "hierarch*" and "jurisdiction" each occur 0 times |
| S06-1 | DIRECT | DIRECTLY SUPPORTED | §20 "Execution is an accountable event"; §06 |
| S06-2 | INFERENCE | REASONABLE INFERENCE ✔ | §31 "who had the authority"; "revoc*" occurs 0 times |
| S06-3 | OPEN | OPEN ✔ | Not specified; §01 says it is not an implementation specification |

**Result:** 0 contradicted by the source, 0 insufficiently supported, 0 label disagreements.

---

## 17. Determinism (Phase 14)

**Method.** For each scenario, with its smoke prediction:
- 3 runs, each preceded by Reset;
- then a full page reload;
- then 1 more run.

**Compared** across those runs:
- core, contract, source expected and observed hashes, bound commit;
- comparison;
- event-log hash;
- a UI hash covering disposition, badge, compatibility, support statuses and event log;
- replay and export results.

**Results**
- Identical across all runs for 6/6 scenarios: **24/24**.
- Replay was CONSISTENT and Export PASS for 24/24.
- The stable cores equal the independent Node values.
- Only `generated_at`, `exported_at`, the observation timestamps, and therefore `record_snapshot_sha256`, varied. That is by design.

---

## 18. State isolation (Phase 15)

| Sequence | Steps | Result |
|---|---|---|
| A | S01 Run → S06 (no run) → Export attempt → S06 Run → S03 Run → Reset → S02/ESC Run | ✔ Each state clean, 0 files from the invalidated state |
| B | S05/ESC Run → prediction CONTINUE → S04 → S04 Run → Reset → S06/BLOCK Run | ✔ |
| C | S01 Run → scripted switch to S06 → Run in the same task | ✔ Only S06/BLOCK |
| D | S04 Run → Replay (CONSISTENT) → Replay → Reset → direct Export | ✔ 0 files; `lastRun` and `lastReplay` null |
| E (new) | Clean Replay → forge `lastReplay` → Export | ✘ PASS with the forged replay block (V031-NEW-04) |
| F (new) | Fresh page → change scenario | ⚠ Shows "Previous result, replay, and export state were invalidated." with nothing run (V031-NEW-03) |

**Stale DOM (Phase 9).** After a scenario change, a prediction change, Reset, or an injected invalid value, all 13 result elements were **empty**, not merely hidden, with no scenario text left behind. 4/4. **V03-NEW-06: FIXED.**

---

## 19. Source conformance (Phase 16)

**What changed in the scenario content since v0.3?** Only the S05 and S06 `compatibilityReason` strings.

**Re-evaluation.** I re-evaluated all six scenarios against the Orientation Edition text only, using no external governance doctrine.

| Scenario | Assessment |
|---|---|
| S01 | BLOCK is directly supported (§19, §32). "Reauthorize" is disclosed as harness shorthand. |
| S02 | BLOCK on a changed epistemic basis is a reasonable inference (§06, §28, §29). |
| S03 | The validity bound is stipulated and disclosed; blocking once it has lapsed is a reasonable inference. |
| S04 | Directly supported (§22, §24, §38). |
| S05 | INSUFFICIENT SPECIFICATION is correct: the source defines no precedence, hierarchy or jurisdiction. |
| S06 | INSUFFICIENT SPECIFICATION is correct: the source defines no revocation, rollback, compensation or in-flight semantics. |

**Totals:** 0/6 scenarios and 0/18 commitments contradicted; 0 insufficiently supported; 0 label disagreements.

---

## 20. v0.3 defect closure (Phase 17)

| ID | Status | Evidence |
|---|---|---|
| V03-NEW-01 volatile timestamp in core | **FIXED** | §6. 68/68 clean Replays CONSISTENT and 67/67 Exports PASS; volatile fields excluded (in the page and in Node, 0/36) |
| V03-NEW-02 observed, not bound, provenance | **FIXED** (residual Low V031-NEW-05) | The manifest binds the commit; 429/403/network keep it; MISMATCH does not replace it; it is in the core |
| V03-NEW-03 PASS covered less than the whole record | **PARTIALLY FIXED** | Restrictions, attributions and repository are now in the core, and `generated_at` is in the snapshot. The exported `replay` block is still unchecked (V031-NEW-04) |
| V03-NEW-04 hidden refusal reasons | **FIXED** for Run and Replay | Banners with specific reasons; Export uses an alert only (V031-NEW-07) |
| V03-NEW-05 malformed-contract TypeError | **PARTIALLY FIXED** | Missing and wrong-type fields are refused, with no stuck "Verifying". Enum values and emptiness are not validated, and a null element throws (V031-NEW-01) |
| V03-NEW-06 hidden stale DOM | **FIXED** | §18 |
| V03-NEW-08 wording | **PARTIALLY FIXED** | About heading fixed. The CHANGELOG still lists v0.2 above v0.3, and there is a new stale README sentence (V031-NEW-08) |
| INT-01 compatibility interpretation | **NOT A SOFTWARE DEFECT** | Exclusion reasons added and understandable (§15) |
| (V03-NEW-07 self-consistent forgery) | **NOT A SOFTWARE DEFECT** | Inherent and disclosed; unchanged |

---

## 21. New v0.3.1 defects (Phase 18)

### V031-NEW-01 · Low · Robustness / schema validation

**Reproduction.** In the console:

- `scenarios[1].disposition = "FOO"`, or
- `scenarios[1].commitments[0].status = "TOTALLY PROVEN"`, or
- `scenarios[1].commitments = []`,

then select S02 and a prediction, and Run → Export. Separately: `scenarios[0] = null`, then change the scenario or Run.

**Expected.** Refused, with a visible schema error.

**Actual.**
- The first three are accepted and exported with `integrity_status: PASS`.
  - With `FOO`, the disposition label is absent and the UI disposition is blank.
  - With the invented status, it is rendered with OPEN styling.
- `null` throws an uncaught `TypeError` (reading 'id') with no message.

**Impact.** Low: only a code or authoring error can trigger it, and the shipped contracts are valid. But the new validator would not catch the most likely authoring mistakes.

**Fix.**
- Require `disposition ∈ VALID_PREDICTIONS`.
- Require every `status` to be one of the four vocabulary terms.
- Require `commitments.length ≥ 1`, and that the disposition is not in its own compatibility set.
- Make `selectedScenario()` null-safe (`item && item.id`).

### V031-NEW-02 · Low · Usability / refusal recovery

**Reproduction.** Cause any Run refusal (for example a transient source or network error), then restore the network.

**Expected.** Run is re-enabled for the still-valid selection.

**Actual.** `runChallenge()` disables Run, and the catch path calls `invalidateRun()` without `renderScenario()`. Run stays disabled until Reset or a new selection. Confirmed by real click.

**Fix.** Call `renderScenario()` at the end of every refusal path.

### V031-NEW-03 · Low · Wording regression (v0.3 NEW-07a)

**Reproduction.** Load the page fresh and change the scenario.

**Actual.** The banner reads "Scenario changed. Previous result, replay, and export state were invalidated." while the result box says "No challenge has been run for this selection."

**Cause.** `invalidateRun` now shows the notice whenever `reason` is set. v0.3 gated this on `hadEvidence`.

**Fix.** Show selection-change notices only when `hadEvidence` is true. Keep refusal notices unconditional.

### V031-NEW-04 · Low · Evidence integrity scope

**Reproduction.** Run → Replay (CONSISTENT) → `lastReplay.result = "FORGED RESULT"; lastReplay.source_observed_sha256 = "0".repeat(64)` → Export.

**Actual.** `integrity_status: PASS` with the forged `replay` block.

**Impact.** A reader may take `replay.result` in a PASS file as verified. This is the residual part of V03-NEW-03.

**Fix.** Either:
- rebuild the exported `replay` block from checks recomputed at export time, or hash `lastReplay` when it is created and verify that hash at export; or
- state in `integrity_scope` and the README that `replay`, `export_provenance` and `integrity_checks` are outside the hashes.

### V031-NEW-05 · Low · Provenance binding

**Reproduction.** Serve `build-info.json` with `version: "9.9.9"`, an altered `build_id`, or `code_commit: d79b038…`, keeping the correct `app.js` hash, then Run.

**Expected.** Refused, or flagged as a manifest/app mismatch.

**Actual.** Run is accepted and the evidence records the wrong version or commit. Replay only diverges if the live manifest later differs.

**Fix.**
- Refuse when `build.version !== HARNESS_VERSION` or `build.build_id !== BUILD_ID`.
- Optionally corroborate `code_commit` directly: fetch `raw/<code_commit>/app.js` and compare it to the manifest hash, in addition to `main`.
- Optionally verify `index.html` and `styles.css` too, or say that only `app.js` is verified.

### V031-NEW-06 · Low · Robustness

**Reproduction.** `lastRun.harness_provenance = null` (or `source_document = null`), then Replay or Export.

**Actual.** Uncaught `TypeError` outside the `try` block. No replay record, no message, no export.

**Impact.** It fails closed; there is only an observability gap.

**Fix.** Move `evidenceCoreHash` and `recordSnapshotHash` of the snapshot inside the `try` blocks, and route the error to the refusal banner.

### V031-NEW-07 · Observation · Refusal observability

- Export refusals are shown only through `alert()` and are not persisted on the page.
- The divergence banner does not name the failing checks.
- "Failed to fetch" does not say whether the source, build-info or `app.js` failed.

**Suggestion.** Use the banner for Export refusals, and prefix each fetch error with its resource.

### V031-NEW-08 · Observation · Documentation

- README "Evidence export" still says exports include "the full GitHub `main` commit observed at run time when available". This contradicts the v0.3.1 model.
- The README "Replay" bullet list omits the code-provenance and snapshot checks.
- The CHANGELOG lists v0.2 above v0.3.
- The README has no "Independent v0.3 regression record" section, unlike v0.1 and v0.2.
- The manifest lists nine files but the runtime verifies only `app.js`; this is not stated.

---

## 22. Remaining assumptions and limitations

1. **Evidence is unsigned.** Anyone who recomputes the unkeyed snapshot hash can forge non-core metadata, and a fully self-consistent re-run forgery cannot be told apart from a genuine run. This is disclosed.
2. **The manifest is trusted.** It is authoritative for `code_commit`. I verified independently that `a10722a:app.js` equals the manifest hash; the page itself does not check this.
3. **The download step was not exercised.** Export verification stopped at Blob and anchor creation.
4. **Interpretive choices are disclosed.** Materiality (S01, S02), the stipulated validity bound (S03), the "reauthorize" vocabulary, and the compatibility sets are all harness interpretations, and are disclosed as such.
5. **Replay is not a JANUS runtime execution.** It re-derives from the static authored contracts, and this is stated correctly in the UI, README and export.

---

## 23. JANUS questions still exposed

These are unchanged by v0.3.1:

- the event that invalidates an authorization and triggers the need for a new authorization fact (S01);
- the dependency of authorization on evidence (S02);
- how the lifetime of an authorization is represented (S03);
- the verification and governance event that could grant expanded authority (S04);
- how conflicts between authorities are resolved (S05);
- the semantics when authority is lost during execution: stop, safely complete, roll back, compensate, or escalate (S06).

---

## 24. v0.3 → v0.3.1 comparison

| Area | v0.3 | v0.3.1 |
|---|---|---|
| Clean Replay | 0/36 CONSISTENT (V03-NEW-01) | **68/68 CONSISTENT** |
| Clean Export | 0/36 PASS | **67/67 PASS** |
| Code provenance | GitHub `main` at runtime; null on quota | **Bound by manifest**; MATCH / MISMATCH / UNAVAILABLE |
| Integrity coverage | Core only; restrictions, attributions and repository editable | Core (expanded) + full snapshot; replay block still uncovered |
| Refusal reasons | Hidden | **Visible** (Run/Replay banner, Export alert) |
| Malformed contract | Stuck "Verifying…", TypeError | Missing fields refused; enum gaps; null element throws |
| Stale DOM | Hidden residue | **Cleared** |
| Races | 9/9 | 9/9 |
| Determinism | Stable core | **Stable core**, identical after reload |
| Source conformance | 0/0 | 0/0 |
| New findings | 1 Critical, 2 Medium, 2 Low, 3 Obs | **0 Critical, 0 High, 0 Medium, 6 Low, 2 Obs** |

---

## 25. Final accounting

| Item | Count |
|---|---|
| Smoke test | **6/6 PASS** |
| Primary matrix | **36/36 PASS** |
| Clean Replays CONSISTENT | 68/68 |
| Clean Exports PASS | 67/67 |
| Core hashes equal to the independent oracle | 36/36 (+24 determinism) |
| Source substitutions detected | 9/9 |
| Build-provenance cases | 20 (17 correct; 3 accepted at Run → V031-NEW-05) |
| Tamper cases | 70 (62 caught; 4 recompute forgeries not caught, inherent; 4 structural, fail-closed with uncaught error) |
| Malformed-contract cases | 13 (8 refused, 4 accepted, 1 uncaught error) |
| Races | 9/9 |
| Prediction validation | 11/11 + invalid scenario |
| Stale DOM | 4/4 |
| Determinism | 24/24 |
| State isolation | A–D pass |
| New defects | 0 Critical · 0 High · 0 Medium · 6 Low · 2 Observation |
| Source contradicted / insufficiently supported | 0 / 0 |

### Explicit answers

**A. Did the six-scenario deployed smoke test pass 6/6?**
Yes. All six went Run → REPLAY CONSISTENT (all seven flags true) → Export PASS (15/15 checks), and all six core hashes match my independent recomputation.

**B. Does every clean, untampered Replay now report CONSISTENT?**
Yes: 68/68, including Replays delayed by 8 and 16 seconds and Replays after a full reload.

**C. Does every clean, untampered Export now succeed with PASS?**
Yes: 67/67. This includes Exports made while GitHub corroboration was UNAVAILABLE because of the HTTP 429 quota.

**D. Is V03-NEW-01 fully fixed?**
Yes. Volatile fields are outside the core and stable fields are inside it. I verified this in the live page and in Node, with 0/36 leaks in either direction.

**E. Is code provenance now bound to the deployed code rather than to whatever GitHub `main` happens to be?**
Yes. `code_commit` comes from the deployed `build-info.json`, which is hash-linked to the served `app.js`. Quota exhaustion and a simulated move of `main` did not replace it.

One caveat (Low, V031-NEW-05): the commit is taken from the manifest as written. I verified independently that `a10722a:app.js` matches the manifest; the page itself does not check this.

**F. Are source mismatches and other refusals visibly explained to the user?**
Yes for Run and Replay: a prominent banner states the specific reason, and I took a screenshot.

Export refusals are explained only in an `alert()`. A null scenario object and structural tampering fail closed without any message.

**G. Did v0.3.1 introduce any new Critical, High or Medium defect?**
No. There are six Low findings and two Observations.

**H. Is the architectural content still source-conformant?**
Yes. 0/18 commitments are contradicted, 0/18 are insufficiently supported, and there are no label disagreements.

**I. Is v0.3.1 ready to share with Eryk?**
Yes. The release gate passes and the evidence chain works end to end.

Before sharing, consider fixing the stale README sentence that says exports contain "the full GitHub `main` commit observed at run time". It is the one line Eryk might read as contradicting the v0.3.1 provenance model.

**J. Tag the tested release as `v0.3.1-reviewed`?**
Yes, I recommend tagging `9dc291a5478668b9baae957797b5c799917d35f7`, the release HEAD that was deployed and tested. Track V031-NEW-01 to NEW-08 for v0.3.2.

If you change the README first, the change produces a new release commit, so re-run at least the six-scenario smoke test on that commit before tagging. I did **not** create any tag.

---

## 26. Raw-results appendix

`JANUS_Harness_v0.3.1_raw_results.json` contains:

- release HEAD, bound commit, tested URL and the v0.3 baseline;
- the live hashes of all 11 checked files, and the full `build-info.json` and its hash;
- source expected and observed SHA;
- all 6 contract hashes and all 36 independently computed core hashes;
- 6 smoke records and 36 matrix records. Each has the encoded assessment, comparison, compatibility set, core hash, snapshot hash, `generated_at`, `exported_at`, per-phase `commit_verification`, replay flags and export status;
- an example export's fields;
- the V03-NEW-01 fix evidence;
- source-substitution, build-provenance, tamper, refusal, malformed-contract, race and prediction-validation results;
- the compatibility and support audits;
- determinism and state-isolation results;
- defect closure, new defects and final counts.

**Method notes on the raw JSON**
- Per-run fields that are constant across verified runs (the source hashes, the bound commit, and all flags being true) are recorded as the values I checked in each run. They are not raw dumps of each export.
- Every exported file's snapshot hash was recomputed from the file itself in the page, and matched for 42/42.
