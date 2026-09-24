# JANUS Governance Challenge Harness v0.3.2 — Independent Zero-Open-Finding Adversarial Regression

**Tested:** 24 September 2026
**Tester:** Claude (independent adversarial review, at the request of Kelly Newsome)
**Public harness:** https://newsomek.github.io/JANUS-Governance-Challenge-Harness/
**Release HEAD:** `ef0f67516acd0ea80376ac17ece927c2e7c2ea85`
**Bound application code commit:** `d9b431a733b8d30e596df7b04816eda4da278d4d`
**Reviewed baseline:** `v0.3.1-reviewed` → `dc621ffe20b78443e1a0ce0dd2ad76e5127e81c0`
**JANUS source SHA-256:** `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`

No tag was created, and nothing was renamed.

---

## 1. Executive summary

**Verdict:**

- **The gate is NOT met.**
- **v0.3.2 is not yet eligible for promotion to Version 1.0.**

**What held:**

- **Core evidence behaviour is sound.**
  - **Live matrix:** the 36-run deployed matrix passed 36/36.
  - **Replays and exports:** every clean Replay reported `REPLAY CONSISTENT` with all flags true, and every clean Export reported `integrity_status: PASS` with 15/15 checks true.
  - **Automated regression:** it passes.
  - **Determinism and isolation:** determinism (24/24) and state isolation (9/9) passed live.
  - **Race tests:** all 23 race tests passed.
  - **Source conformance:** 0 of the 18 source commitments are contradicted or insufficiently supported.
- **Seven of the eight v0.3.1 findings are fully closed.**

**What did not hold:**

- **V031-NEW-07 (refusal observability) is only partially closed.**
- **The adversarial program found 9 new, reproducible, actionable items:**
  - 6 Low;
  - 3 Observation.
- **None is Critical, High or Medium.**
- **None produces a false PASS on a clean run.**
  - The worst item lets a fabricated build-manifest commit reach a PASS export. The export does record `bound_commit_verification: UNAVAILABLE`.
  - Several items are reachable only by editing code or using the console.
- **They still count.** The release standard counts *any* actionable defect, misleading documentation or evidence-integrity gap as an open finding, regardless of severity. On that standard these are open findings.

| Category | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| **Low** | **6** (V032-NEW-01 … 06) |
| **Observation (actionable)** | **3** (V032-NEW-07 … 09) |
| v0.3.1 findings not fully closed | 1 (V031-NEW-07, partially fixed; its residual is tracked as V032-NEW-03) |
| Documentation contradictions | Yes (see V032-NEW-01, -03, -08) |
| Integrity failures on clean runs | 0 |
| Stale-state failures | 0 |
| Ordinary-use exceptions (uncaught errors) | 0 |
| Source-conformance concerns | 0 |

---

## 2. Test environment

Two environments were used. Their evidence was cross-checked for byte-level agreement.

| | E1 — Live | E2 — Byte-faithful replica |
|---|---|---|
| Target | The deployed GitHub Pages site, in the user's Chrome (Claude in Chrome) | The deployed URL loaded in headless Chromium 1194 (Playwright 1.56). Every `newsomek.github.io` request is answered from repository HEAD bytes. |
| Network | Real network: github.io, raw.githubusercontent.com, api.github.com | raw.githubusercontent.com answered from `git show <sha>:app.js`. api.github.com emulated as `{sha: ef0f675, parents:[d9b431a]}` unless a test overrode it. |
| Interaction | `element.click()` and `change` events on the real controls, plus one real mouse flow | Real `page.click()` / `selectOption()`, keyboard input, and real browser download events |
| Export capture | The in-page Blob was parsed. Browser save was suppressed to avoid 70 files in Downloads, except in the real-mouse flow. | Real downloaded files were read from disk |
| Used for | Deployment verification, the 36-run matrix, determinism, isolation, UI, and live confirmation of E2 findings | Fault injection (network, manifest, source, API), tamper, races, layout, and the replicate matrix |

**Why E2's results can be trusted as deployed behaviour:**

- **Byte-identical inputs.** All 11 manifest files plus `build-info.json` served in E2 are hash-identical to the live copies.
- **Identical outputs.** All **36/36 evidence-core hashes produced in E2 equal the live hashes** (0 mismatches). The six canonical cores are also identical after a live full reload.
- **Live confirmation.** Every Low finding that E2 reported was reproduced live where that was feasible (§18).

**Independent oracles.** Expected contracts were taken from the **reviewed baseline** (`dc621ff:app.js`), not from the code under test. Contract, evidence-core and record-snapshot hashes were recomputed with my own implementation, both in Node and in the page.

**Scale.**

- **Live E1:** 36 matrix cycles, 24 determinism cycles and 9 isolation cycles. That is 69 clean Run → Replay → Export cycles, plus 1 real-mouse cycle and 4 live fault confirmations.
- **E2:** 298 recorded cases.

**GitHub API quota.** The unauthenticated GitHub API allows 60 requests per hour. The quota ran out partway through the live matrix (from run 21). Main corroboration then correctly reported `UNAVAILABLE` (403) with no effect on PASS or on the evidence core. This is itself a live confirmation of the rate-limit path.

---

## 3. Deployment verification (Phase 1)

| # | Check | Result |
|---|---|---|
| 1 | GitHub `main` = `ef0f67516acd0ea80376ac17ece927c2e7c2ea85` | **PASS** (`git ls-remote`: HEAD and `refs/heads/main`) |
| 2 | `build-info.json` `code_commit` = `d9b431a…` | **PASS** (repository and live, byte-identical; SHA-256 `f7423b12…c403`) |
| 3 | Page identifies as v0.3.2 | **PASS** (`<title>`, header eyebrow, footer) |
| 4 | Live `app.js` = repository = `d9b431a:app.js` = manifest | **PASS** — all four are `e3a716e2d853435e1ac276fc2713b6060d6a655500c752732e67c2bf6bed6105`. `ef0f675` changes only `build-info.json`. |
| 5 | Every manifest file exists live and matches | **PASS** — 11/11 return HTTP 200 with a hash match |
| 6 | Source hash | **PASS** — `21766f5d…551fe4` in the repository and live (50,354 bytes) |
| 7 | `v0.3.1-reviewed` resolves | **PASS** — tag object `77755d48…` → commit `dc621ffe…` |
| 8 | v0.3.1 report and raw results preserved | **PASS** — the v0.1, v0.2, v0.3 and v0.3.1 reports and raw JSON are byte-identical to `dc621ff` |
| 9 | `tests/v0.3.2-regression.mjs` exists | **PASS** (and is listed in the manifest) |
| 10 | Local automated regression | **PASS** (§4) |

---

## 4. Local automated regression

```
$ node tests/v0.3.2-regression.mjs        (Node v22.22.2)
JANUS v0.3.2 automated regression: PASS
Canonical exports: 7; refusal alerts: 1
exit=0
```

**Result: passes.**

**What the release materials show.** `tests/V0_3_2_RELEASE_GATE.md` states only the *expected* output. No recorded result exists in the repository. The result above is the first recorded pass.

**Scope of the script.** It uses a mock DOM and a fake commit (`'a'×40`). None of the v0.3.2 defects found here is covered by it.

---

## 5. Full 36-run matrix (Phase 2)

**Live (E1): 36/36 PASS. E2 replicate: 36/36 PASS. Identical evidence cores in both.**

Each run was checked on all of the following:

- **Selection and assessment:**
  - scenario and prediction;
  - encoded disposition unchanged by the prediction;
  - comparison class and label;
  - compatibility set and rationale.
- **Content:**
  - support statuses and their CSS class;
  - every authored field, in the record and the UI;
  - the exact event log.
- **Hashes and provenance:**
  - contract hash against the baseline;
  - expected and observed source hashes;
  - bound commit;
  - manifest version and build ID;
  - `app.js` expected and observed hashes;
  - independently recomputed evidence-core and snapshot hashes.
- **Replay:**
  - `REPLAY CONSISTENT`, with exactly 7 flags, all true;
  - replay hashes equal the run's hashes;
  - replay DOM equals `lastReplay`.
- **Export:**
  - 15/15 integrity checks true;
  - `integrity_status: PASS`;
  - exported scenario and prediction match the selection;
  - filename pattern correct;
  - exported replay block valid;
  - exported core and snapshot equal the run's, and equal an independent recomputation.
- **State:** no stale notice, no error, no alert.

| Scenario | CONTINUE | BLOCK | BLOCK + REAUTH | ESCALATE | ROLLBACK | INSUFF. SPEC. | Canonical core (live = E2) |
|---|---|---|---|---|---|---|---|
| 01 condition-change | DIFF ✔ | PART ✔ | **EXACT ✔** | PART ✔ | DIFF ✔ | DIFF ✔ | `451a406ee637b9d5…` |
| 02 evidence-change | DIFF ✔ | **EXACT ✔** | PART ✔ | PART ✔ | DIFF ✔ | DIFF ✔ | `3e94d4b8d4ef9b5b…` |
| 03 authorization-expiry | DIFF ✔ | PART ✔ | **EXACT ✔** | PART ✔ | DIFF ✔ | DIFF ✔ | `15314e3ef8797b42…` |
| 04 learning-authority | PART ✔ | PART ✔ | **EXACT ✔** | PART ✔ | DIFF ✔ | DIFF ✔ | `d14f6b2ab2946a37…` |
| 05 conflicting-authorities | DIFF ✔ | PART ✔ | DIFF ✔ | PART ✔ | DIFF ✔ | **EXACT ✔** | `80fe94a1988e27f8…` |
| 06 mid-execution-revocation | DIFF ✔ | PART ✔ | DIFF ✔ | PART ✔ | PART ✔ | **EXACT ✔** | `4e4c5ba02def9103…` |

**Corroboration results in the live matrix:**

- **Bound-commit corroboration** was `MATCH` in 36/36 runs.
- **GitHub `main` corroboration** was `MATCH` in runs 1–20. It was `UNAVAILABLE` in runs 21–36, after the API quota was exhausted.

Neither changed PASS or the evidence core, as designed.

**Other checks:** live console errors were 0, uncaught errors 0, alerts 0.

---

## 6. v0.3.1 finding closure

| Finding | Status | Evidence |
|---|---|---|
| **V031-NEW-01** schema validation | **FIXED** | All 27 listed invalid contracts were refused with a visible `Execution refused: …` reason, and no Run, Export or TypeError occurred. The cases were: `FOO`, invented status, empty commitments, disposition in its own set, null entry, missing fields, wrong types, malformed sources, and malformed compatibility arrays including prototype keys. A null entry elsewhere does not break other scenarios. Post-run contract edits make Replay and Export refuse (5/5). New, separate gaps are logged as V032-NEW-05. |
| **V031-NEW-02** refusal recovery | **FIXED** | Source, build-info and app.js were each tested with 503 and with a network abort (6/6). In every case Run re-enabled immediately, the selection was intact, and a retry succeeded without Reset. |
| **V031-NEW-03** false stale notice | **FIXED** | Fresh page: no notice after any selection change. After a real run: "Scenario changed. Previous result…" and "Prediction changed. Previous result…" appear correctly. After a refusal followed by a selection change, no false claim is made. |
| **V031-NEW-04** replay block integrity | **FIXED** | 8/8 forgeries: `result`, source hash, all flags false, contract hash, disposition, code provenance, replacement object, and DOM text. None of the forged content reached a PASS export. The exported block is freshly re-derived and CONSISTENT. |
| **V031-NEW-05** build manifest validation | **FIXED** for the reproduced cases | Each of these was refused with a named reason: `9.9.9`, wrong build ID, a commit whose `app.js` differs (`a10722a`, "Bound commit app.js differs"), missing or malformed commit, wrong or missing `app.js` hash, `files: null`, and a wrong version with a correct hash. **Residual gap:** a well-formed but fabricated commit is accepted. This is logged as **V032-NEW-02**. |
| **V031-NEW-06** structural null tampering | **FIXED** | 18 mutations × {Replay, Export} = 36/36 failed closed, with a visible refusal, 0 uncaught errors and 0 exports. (The quality of the messages is part of V032-NEW-03.) |
| **V031-NEW-07** refusal observability | **PARTIALLY FIXED** | Fixed: Export refusals now persist in the banner, and plain `fetch()` failures name their resource (source, build provenance, harness code). **Not fixed:** (a) the divergence banner still does not name failing checks (explicitly listed in v0.3.1); (b) build-info parse failures and body-read failures do not name the resource. Tracked as **V032-NEW-03**. |
| **V031-NEW-08** documentation | **FIXED** (all five listed bullets) | The stale "GitHub main observed" wording is gone. The Replay list now includes the code and snapshot checks. The CHANGELOG order is correct. The v0.3 section exists. The manifest-versus-runtime scope is stated. New documentation issues are logged as V032-NEW-01 and V032-NEW-08. |

**Closure: 7/8 fully closed; 1/8 partially closed.**

---

## 7. Contract-schema adversarial tests (Phases 3–4)

44 cases were run in E2. The first 27, and 5 post-run cases, are in §6.

| Case | Result | Classification |
|---|---|---|
| Duplicate compatibility values `['ESCALATE','ESCALATE']` | Accepted, rendered as "ESCALATE, ESCALATE", exported PASS | Validation gap → V032-NEW-05 |
| Duplicate source citation | Accepted, rendered twice, exported PASS | Validation gap → V032-NEW-05 |
| Zero-width-only title / rationale / commitment text (`​`, `⁠`) | Accepted. Renders visually blank (a blank `<strong>` title). Exported PASS. | Validation gap → V032-NEW-05 (`String.prototype.trim()` does not strip U+200B or U+2060) |
| Duplicate scenario ID | Not detected at load. The second scenario becomes silently unreachable; selecting it shows "Invalid scenario selection." No export. | Fails closed, but undetected → V032-NEW-05 |
| Blank ID, blank title, unknown compatibility value, missing commitment text, status case variation or trailing space, empty source list | Refused | PASS |
| HTML/script in `summary` or `name` | **`onerror` executed** (5 times in E2, 2 times live), because `renderScenario()` uses `innerHTML` | **V032-NEW-04** |
| HTML/script in `rationale` and other `textContent` fields | Inert | PASS |
| 1,000,000-character rationale | Rendered, hashed and exported PASS; no error | PASS |
| RTL override, emoji, combining marks, lone surrogate | Rendered and exported PASS; no error | PASS (note: a lone surrogate encodes as U+FFFD before hashing; not reachable with the shipped contracts) |
| Prototype-looking keys (`__proto__` own property, `constructor`, `hasOwnProperty`) | Harmless; PASS | PASS |

---

## 8. Replay integrity (Phase 5)

| Test | Result |
|---|---|
| Run → Replay → Replay → Export, ×6 scenarios | **6/6 PASS.** Both replays were CONSISTENT and byte-identical, and each export was PASS. |
| Replay before Run (button and forced) | Button disabled; forced call does nothing; no state change |
| Replay after Reset, after scenario change, after prediction change | Button disabled; `lastRun` and `lastReplay` are null; forced call does nothing |
| Transient source failure, then retry | "Replay refused: Source document fetch failed: HTTP 503"; Export disabled. The retry was CONSISTENT and the Export PASS. |
| Transient build-info failure, then retry | Refused with the resource named; the retry was CONSISTENT and the Export PASS |
| Tamper (`rationale`) → Replay → restore → Replay | Divergence, then Export refused, then CONSISTENT, then Export PASS |
| **Core field tampered, and the unkeyed snapshot hash recomputed** | **Replay reports `REPLAY CONSISTENT` with all 7 flags true, and leaves Export enabled. Yet the same replay record shows `stored_evidence_core_sha256 ≠ original_evidence_core_sha256`, and Export then refuses with `stored_evidence_core_integrity`.** Reproduced live. → **V032-NEW-01** |
| No stale replay survives; no forged replay is exported | Confirmed (§6 NEW-04, and races R3, R9) |

---

## 9. Export integrity (Phase 6)

30/30 of the scripted expectations held.

| Test | Result |
|---|---|
| Before Run | Button disabled; the forced call makes no file |
| After Run (no Replay) / after a clean Replay | PASS, with all independent recomputations matching |
| After a failed (transient) Replay | Button disabled. A forced export after recovery is PASS, with a freshly re-derived CONSISTENT replay block. This is by design. |
| After a divergent Replay (tamper) | Button disabled; the forced export is refused (`stored_record_snapshot_integrity, replay_rederived_consistent`) |
| After Reset / after a selector change | Button disabled; the forced call makes no file |
| Race: Export → immediate scenario change | 0 files, no alert |
| **Double-click Export** | **Two evidence files, 4 ms apart** → V032-NEW-07 |
| Structural tamper | Refused, persistent banner, no file |
| Protected-field tamper, 11 fields: name, rationale, disposition, label, contract hash, core hash, commit, repository, attribution, event log, compatibility set | 11/11 refused, with the failing checks named |
| Non-core metadata change: `generated_at`, `checked_at`, `commit_verification`, `observed_at` | 4/4 refused (`stored_record_snapshot_integrity`) |

**Attempt to produce a PASS artifact with contradictory internal fields:**

- **Core forgery fails.**
  - Changing the rationale and recomputing only the snapshot hash → refused (`stored_evidence_core_integrity`).
  - Recomputing both the core and snapshot hashes → refused (`authored_state_integrity`).
  - **The authored core cannot be forged.**
- **Non-core forgery succeeds when done with the console.** After recomputing the unkeyed snapshot hash, Export produced PASS artifacts containing:
  - `source_document.hash_match: false`;
  - `harness_provenance.commit_verification: MISMATCH` beside `export_provenance: MATCH`;
  - an arbitrary added field (`"reviewer_note": "JANUS certified"`).
- **This is an inherent, disclosed limit** (see §19), the same one the v0.3.1 review classified (V03-NEW-07). Such fields can equally be edited after export, and the export `restrictions` state the evidence "is not cryptographically signed or tamper-proof."

**Independent recomputation** (69 live exports and all E2 exports):

- **Contract hash:** equals SHA-256 of the canonical baseline contract.
- **Evidence-core hash:** equals my own reimplementation of the core.
- **Snapshot hash:** equals SHA-256 of the export minus the export-only keys.
- **Exported replay block:** its hashes equal the run's hashes.

---

## 10. Build provenance attacks (Phase 7)

| Attack | Result |
|---|---|
| GitHub API 403 / 429 / network failure / malformed SHA | Run proceeds; the bound commit `d9b431a` is kept; main shows `UNAVAILABLE`; Export PASS. The mismatch is visible in the UI provenance box. ✔ |
| `main` moves ahead (app.js changed) / behind (`dc621ff`) | `MISMATCH` recorded, the bound identity is unchanged, Export PASS. Corroboration never overwrites the primary provenance. ✔ |
| `main` moves ahead (docs-only commit) | `MATCH` ✔ |
| `main` moves between Run and Export | The run keeps `MATCH` and `export_provenance` records `MISMATCH`; the bound commit is stable ✔ |
| Manifest 404 / version 9.9.9 / wrong build ID / missing, short or foreign-code commit / wrong or missing app.js hash / `files: null` | Refused, with a specific reason ✔ |
| Uppercase commit and hash | Normalised; PASS ✔ |
| app.js altered (1 byte) / 404 | Refused ✔ |
| Manifest commit or version changed after Run | Replay diverges or refuses (`code_match`, `authored_state_match`); Export refused ✔ |
| **Manifest is malformed JSON / `null` / an HTML page returned with 200** | Refused, but with a raw parser or TypeError message that does not name the manifest → **V032-NEW-03** |
| Commit = `ef0f675` (a real commit with an identical app.js) | Accepted, `MATCH`. This is an inherent limit (§19). |
| **Commit = a fabricated, well-formed, nonexistent SHA** | **Accepted.** raw.githubusercontent returns 404, which is reported as `UNAVAILABLE` ("HTTP 404"). **Export `integrity_status: PASS` with `bound_code_commit` = the fabricated SHA.** Reproduced live (run and UI). → **V032-NEW-02** |

**What the harness proves about the claimed code commit:**

1. **It enforces that the served `app.js` bytes equal the manifest hash.**
2. **When raw.githubusercontent.com answers 200**, it proves that the claimed commit contains an `app.js` with those same bytes. It does not prove that this commit is the unique or first such commit.
3. **When raw.githubusercontent.com does not answer 200** (network, 403, **or 404**), it proves nothing about the commit. It then relies on the manifest as written.
4. **GitHub `main` is corroboration only.**

---

## 11. Source document attacks (Phase 8)

| Attack | Result |
|---|---|
| One-byte modification / truncated (25,000 B) / same length but different bytes / empty 200 | Refused: "Observed JANUS source-document SHA-256 does not match…"; Run re-enabled ✔ |
| 404 / network failure | "Source document fetch failed: HTTP 404 / Failed to fetch" ✔ |
| Slow (3 s) but correct | PASS ✔ |
| Source changes between Run and Replay | Replay refused, Export disabled, forced Export gives no file ✔ |
| Source changes between Replay and Export | Export refused, persistent banner ✔ |
| **Connection drop mid-body**, for the source, build-info and app.js | Refused, but every one reads "Execution refused: Failed to fetch". Which resource failed is not stated. → **V032-NEW-03** |

---

## 12. Race and state tests (Phase 9)

**23/23 PASS.** There were no stale completions, stale exports, dead buttons, phantom notices or wrong-scenario evidence.

| # | Race | Result |
|---|---|---|
| R1–R9 | The v0.3.1 set: Run → scenario change; Run → prediction change; Replay → prediction change; Run → Reset; S01 → S06 → Run; Replay → Reset → forced export; Export → scenario change; Run → prediction → Run; Replay → prediction → Run | 9/9 ✔ |
| R10 / R10b | Triple Run (button; forced) | One consistent result ✔ |
| R11 | Run → Replay immediately | Replay disabled during Run ✔ |
| R12 | Replay → Export immediately | 1 file, PASS ✔ |
| R13 / R14 | Export → Reset; Export → scenario change | 0 files, no notice ✔ |
| R15 / R16 | Failure → immediate retry; failure → scenario switch → Run | Correct new result, no stale notice ✔ |
| R17 | Run with the source delayed 1.5 s → Reset | Clean reset state ✔ |
| R18 / R18b | Build fetch delayed → new Run (changed or same prediction) | The later run wins ✔ |
| R19 | A slow refusing Run superseded by a fast Run | The stale refusal did not overwrite ✔ |
| R20 | Replay double-click | CONSISTENT ✔ |
| R21 | Export in flight → Run | 0 files ✔ |

---

## 13. UI and ordinary-user tests (Phase 10)

**Real mouse flow, live:**

- **Flow:** S03 × ESCALATE → Run → "BLOCK + REAUTHORIZE", "PARTIAL / COMPATIBLE" → Replay CONSISTENT (all flags true) → Export (no refusal) → Reset.
- **After Reset:** the prediction is cleared, Run, Replay and Export are all disabled, the page shows "No challenge has been run.", and the event log and replay record are reset.
- **Console errors:** 0.

**Other checks:**

- **Labels and buttons.** Both selects have `<label for>`. Button enable and disable states were correct in every sequence tested.
- **Links.**
  - The Kelly Newsome and Eryk Dubiel LinkedIn links, and the source-document link, have the expected `href` and use `target=_blank rel="noopener noreferrer"`.
  - The Eryk Dubiel URL is identical in the UI, README and export.
  - The source link serves the expected hash.
  - **There is no repository link anywhere in the UI** (→ V032-NEW-09).
- **Keyboard.**
  - The scenario and prediction can be selected with the arrow keys.
  - Run works with Enter and Replay with Space.
  - Tab order is scenario → prediction → Run → Replay → Export → Reset → footer.
  - No `outline:none` rule exists, so default focus rings remain.
- **Responsive (375 px).**
  - Before a Run there is no overflow.
  - **After a Run, the Harness-provenance box overflows. The unbroken 40-hex commit forces a 459 px page width and horizontal scrolling** (→ V032-NEW-06).
- **Accessibility.** This was not a formal audit and no WCAG conformance is claimed.
  - `lang="en"`, one `h1`, and images have `alt` text.
  - **The notice region (`#staleNotice`) has no `role="status"` or `aria-live`**, so refusal and invalidation messages are not announced to screen-reader users (→ V032-NEW-09). This is not a regression.

---

## 14. Determinism (Phase 11)

**Live: 6 scenarios × (3 runs with Reset + 1 after full reload) = 24/24.** There was exactly one distinct evidence-core hash per scenario, and the same hashes appear in E2.

**Volatile fields.** Only `generated_at`, `source_document.checked_at`, `harness_provenance.observed_at`, the corroboration results, notes and head, `exported_at`, and therefore `record_snapshot_sha256`, differ between runs. Per the README, these are outside the stable core.

---

## 15. State isolation (Phase 12)

**Live: 9/9 PASS.** The sequence was run without Reset: S03 CONTINUE → S06 ROLLBACK → S01 ESCALATE → S05 BLOCK+REAUTH → S02 INSUFF → S04 CONTINUE → S06 CONTINUE → S06 BLOCK → S01 BLOCK+REAUTH.

- **Checks per step:** every UI field, record and export matched only the selected scenario and prediction.
- **Leaks:** no text from the other five scenarios appeared in the page or the export. There was no rationale, event-log, replay, provenance, prediction or compatibility leak.
- **E2 replicate:** 9/9.

---

## 16. Source conformance (Phase 13)

**Method.** All 18 commitments were re-checked against the text of the DOCX (hash `21766f5d…`, extracted with pandoc).

**Content unchanged since the baseline.** The scenario content is byte-unchanged from `v0.3.1-reviewed`: all six contract hashes equal the baseline hashes.

| S | # | Status | Source basis (Orientation Edition) | Verdict |
|---|---|---|---|---|
| 01 | 1 | DIRECT | §01 "A decision is not authorization. Authorization is not execution"; §06 | Supported |
| 01 | 2 | DIRECT | §19 "…currently justified. That does not automatically imply the right to carry it out." | Supported |
| 01 | 3 | OPEN | No reauthorization protocol appears in the text | Correct |
| 02 | 1 | EXTENDED | §28 "should not resolve a conflict 'by force'" (data) → decision evidence | Disclosed analogy |
| 02 | 2 | INFERENCE | §06 pairs; §19 authorization as a separate fact | Reasonable |
| 02 | 3 | OPEN | No evidence→authority dependency rule | Correct |
| 03 | 1 | INFERENCE | §27 old history kept while interpretation updates; §19 | Reasonable (bound stipulated by scenario) |
| 03 | 2 | EXTENDED | §26 table: Memory — "provenance and scope of validity" | Disclosed analogy; section cite correct |
| 03 | 3 | OPEN | No TTL or expiry object | Correct |
| 04 | 1 | DIRECT | §22 Learning = "a change of knowledge or preference"; must not be "a standalone right to expand its permissions" | Supported |
| 04 | 2 | DIRECT | §24 "A new ability should not automatically receive a new level of authority"; §38 | Supported |
| 04 | 3 | OPEN | §24 requires an independently verifiable process but does not specify it | Correct |
| 05 | 1 | EXTENDED | §28 (data) → authority | Disclosed analogy |
| 05 | 2 | INFERENCE | §32 "prefer no transition over a silent bypass"; §38 "refusal of an unjustified transition" | Reasonable |
| 05 | 3 | OPEN | No precedence or jurisdiction model | Correct |
| 06 | 1 | DIRECT | §06 authorization and execution are "separate events that can be accounted for"; §20 | Supported |
| 06 | 2 | INFERENCE | §31 trace to answer "who had the authority and what actually happened" | Reasonable; "revocation" is correctly flagged as not a JANUS term |
| 06 | 3 | OPEN | §01 "not an implementation specification" | Correct |

**Result: 0 contradicted, 0 insufficiently supported, no undisclosed interpretive leap.**

**Other content checks:**

- **Harness shorthand is labelled.** "Reauthorize", the compatibility sets and "revocation" are all labelled as harness interpretations.
- **No outside theory.** No external governance theory is imported.
- **Section citations.** All section citations (§01, 06, 19, 20, 22, 24, 26–29, 31–33, 38, 39) point to text that contains the cited idea.

---

## 17. Documentation consistency (Phase 14)

Sources cross-checked: the UI, README, CHANGELOG, VERSION.txt, build-info.json, release-gate docs, test files and exports.

**Consistent:**

- **Version:** 0.3.2 everywhere, including export filenames.
- **Bound commit identity:** manifest, UI, export, `VERSION.txt` base.
- **Source URL and hash.**
- **Hashing scope:** what is hashed, and that only `app.js` and the source are re-hashed at runtime.
- **Corroboration:** the optional nature of `main` corroboration.
- **Tamper-proofing:** the "not tamper-proof" statements (README, `restrictions`, `integrity_scope`).
- **Attribution:** JANUS attribution (Eryk Dubiel, the same LinkedIn URL in the UI, README and export) and harness attribution.
- **Test records:** v0.1–v0.3.1 records are preserved and described accurately.
- **CHANGELOG:** order is newest first.

**Contradictions or inaccuracies found:**

1. **Replay checks.** README, Replay: "Replay compares … the stored evidence-core SHA-256". Replay's verdict does not include that comparison (V032-NEW-01).
2. **Resource naming.** README v0.3.2: "fetch errors identify the affected resource"; CHANGELOG: "naming failed fetch resources". This is untrue for manifest-parse and body-read failures (V032-NEW-03).
3. **Closure claim.** README v0.3.2 section and the UI About panel: "closes every known Low/Observation finding". This is not supported: V031-NEW-07 is only partially closed (V032-NEW-08).
4. **Divergence wording.** README, UI replay record and divergence text say export is blocked "until a new clean run". In fact a subsequent clean *Replay* re-enables Export without a new Run (V032-NEW-08).
5. **Stale README sections.** "Required pre-review smoke test" still says "Before creating any `v0.3.1-reviewed` tag". The current-model section is headed "v0.3.1 integrity model" and states "The first commit contains the exact v0.3.1 code" (V032-NEW-08).
6. **Release gate has no recorded result.** `V0_3_2_RELEASE_GATE.md` gives only the expected regression output (§4). This is not a false claim, but no pass record existed before this report.

---

## 18. New findings

### V032-NEW-01 · Low · Replay omits the stored-evidence-core check (Replay and Export disagree)

**Reproduction** (live and E2):

1. Run S01 × BLOCK.
2. In the console, set `lastRun.rationale = 'TAMPERED'`.
3. Recompute `lastRun.record_snapshot_sha256` as the SHA-256 of the record without that key.
4. Click Replay.

**Observed:**

- **Replay says consistent.** It reports `REPLAY CONSISTENT` with all 7 flags true, and Export stays enabled.
- **The same record disagrees.** It shows `stored_evidence_core_sha256` (`f99f284f…`) ≠ `original_evidence_core_sha256` (`aa78baa2…`).
- **Export refuses.** Clicking Export gives "Export refused: Evidence integrity check failed (stored_evidence_core_integrity)."

**Cause.** `deriveReplayRecord()` computes `storedCoreHash` but leaves it out of `replayMatch`.

**Impact:**

- Replay can certify a record that Export rejects.
- The README says Replay compares the stored evidence-core hash.
- It fails closed at Export, so there is no false PASS artifact.

**Fix.** Add `stored_core_match: storedCoreHash === snapshot.evidence_core_sha256` and include it in `replayMatch`. Add a regression case.

### V032-NEW-02 · Low · A fabricated bound commit reaches a PASS export (a 404 is treated as "unavailable")

**Reproduction.** Serve `build-info.json` with `code_commit: "1234567890abcdef1234567890abcdef12345678"` and a correct `app.js` hash (E2 B17; reproduced live through Run and UI).

**Observed:**

- **Run:** bound corroboration is `UNAVAILABLE` ("HTTP 404"), and the UI shows "Bound code commit: 1234567890…".
- **Export:** `integrity_status: PASS` with `bound_code_commit` = the fabricated SHA.

**Cause.** `observeHarnessProvenance()` sends every non-200 raw response (including 404) to `UNAVAILABLE`. A 404 for a well-formed SHA is positive evidence that the commit or file does not exist. Only a hash *difference* is fatal.

**Impact:**

- A PASS artifact can carry a nonexistent code identity.
- The honest signal is limited to one `UNAVAILABLE` field.
- The v0.3.1 recommendation for NEW-05 aimed to catch wrong manifest commits.

**Fix.** Distinguish `NOT_FOUND` (404) from `UNAVAILABLE` (network, 403, 429, 5xx):

- **Either** refuse Run and Export on `NOT_FOUND`,
- **or**, at a minimum, never emit `integrity_status: PASS` with a `NOT_FOUND` bound commit, and document the rule.

### V032-NEW-03 · Low · Residual refusal-observability gaps (remainder of V031-NEW-07)

**Observed:**

- **Manifest parse failures.** A malformed manifest JSON, a `null` body, or an HTML 200 page gives raw messages that do not name `build-info` at Run, Replay or Export (9/9 cases). Examples:
  - `Execution refused: Expected double-quoted property name in JSON at position 20…`
  - `Cannot read properties of null (reading 'version')`
  - `Unexpected token '<'…`
- **Body-read failures.** A connection drop mid-body gives `Execution refused: Failed to fetch` for the source, build-info *and* app.js alike (3/3).
- **Structural-tamper refusals.** These surface raw internals, for example `Replay refused: Cannot read properties of null (reading 'title')`.
- **Divergence banner.** It still reads only "Replay divergence detected. Ordinary evidence export is blocked." The failing flags appear only in the replay record. This was explicitly listed in v0.3.1.

**Cause.** `response.json()` and `response.arrayBuffer()` sit outside the resource-prefixed `try` blocks. `build` is not type-checked before `.version` is read.

**Fix.**

- Wrap body reads and parsing with the same resource prefix.
- Reject a non-object manifest as "Build provenance is malformed".
- Map structural `TypeError`s to "Stored run record is structurally invalid".
- List the false flags in the divergence banner.

### V032-NEW-04 · Low · `innerHTML` sink in `renderScenario()`

**Reproduction.** Set `scenarios[4].summary = '<img src=x onerror="…">'`, then select S05. The handler executes (5 times in E2, 2 times live). The same happens with `name`.

**Impact.** It is reachable only by editing authored contracts (code or console), and the shipped contracts are safe. Even so, it is an unsafe sink in an evidence tool, and it is the only non-`textContent` rendering path.

**Fix.** Build the summary with `createElement('strong')` and `textContent`.

### V032-NEW-05 · Low · The schema validator misses invisible, duplicate and collection-level defects

**Observed.** Each of the following is accepted and exported with PASS:

- zero-width-only `name`, `rationale` and commitment `text` (these render blank);
- duplicate compatibility values (shown as "ESCALATE, ESCALATE");
- duplicate source citations.

In addition, duplicate scenario IDs are not detected at load. The shadowed scenario becomes silently unreachable.

**Impact.** Authoring-time only; the shipped contracts are valid. However, "no blank disposition or field" was an explicit NEW-01 goal, and blank-looking fields pass.

**Fix.**

- Treat `\p{Cf}` and whitespace-only strings as empty.
- Require unique `compatiblePredictions`, unique `sources` and unique scenario IDs.
- Validate all contracts once at startup and refuse to initialise on error.

### V032-NEW-06 · Low · Phone-width horizontal overflow after a Run

**Observed.** At a 375 px viewport, after any Run, `#provenanceInfo` contains the unbroken 40-character commit. Page `scrollWidth` becomes 459 px, so the page scrolls horizontally and the text is cut off (screenshot captured).

**Fix.** Add `overflow-wrap:anywhere` to `.question-box`, or wrap the commit in `<code>`, which already has that rule.

### V032-NEW-07 · Observation · A double-clicked Export writes two evidence files

**Observed.** Two rapid clicks produced two PASS files, 4 ms apart. `exportBtn` is not disabled while an export is in flight.

**Fix.** Disable Export (and Replay) during their async work, and restore the button state on completion or refusal.

### V032-NEW-08 · Observation · Documentation inaccuracies and staleness

**Items:**

1. **Unsupported closure claim.** README v0.3.2 and the UI About panel say v0.3.2 "closes every known Low/Observation finding". This is not supported (V031-NEW-07 is partial; see V032-NEW-03).
2. **Divergence wording.** "Export blocked until a new clean run" in the README, the replay result string and the UI. The actual behaviour is "until a subsequent consistent Replay" (verified: tamper → divergence → restore → Replay CONSISTENT → Export PASS, with no new Run).
3. **Stale smoke-test section.** README "Required pre-review smoke test" still refers to creating the `v0.3.1-reviewed` tag.
4. **Stale model section.** The README section "v0.3.1 integrity model" says "The first commit contains the exact v0.3.1 code". It should be version-neutral, or say v0.3.2 (`d9b431a`).
5. **Replay list.** The README Replay list is corrected together with V032-NEW-01.

**Fix.** Edit the wording. For item 2, either make divergence require a new Run (as documented), or change the documentation.

### V032-NEW-09 · Observation · No live-region notice, and no repository link

**Observed:**

- **No live region.** `#staleNotice` carries every refusal and invalidation message but has no `role="status"`/`aria-live="polite"`. Screen-reader users are not told why Run, Replay or Export failed.
- **No repository link.** The UI has no link to the public repository or the preserved test evidence, although the About panel refers readers to `testing/claude/v0.1/`.

**Fix.**

- Add `role="status" aria-live="polite"` to `#staleNotice`.
- Add a footer link to the repository and the `testing/claude/` evidence.

---

## 19. Remaining assumptions and inherent limits

These are **not** counted as findings. Each is unavoidable by design, disclosed, and not contradicted by the harness's claims.

1. **Unsigned client-side evidence.** Anyone with console access can recompute the unkeyed snapshot hash and forge *non-core* metadata into a PASS file, or edit the JSON after export. The authored core cannot be forged this way (§9). This is disclosed in `restrictions` and the README.
2. **Commit identity is by content.** Bound corroboration proves that "commit X contains identical `app.js` bytes". Any commit with an identical `app.js` (for example `ef0f675`) corroborates. This is inherent in content addressing. (Contrast V032-NEW-02, which concerns commits that do *not* exist.)
3. **Self-verification.** The running `app.js` verifies a *re-fetched* copy of itself. A hostile deployment could serve modified code that skips its own checks. Only independent verification, as in this report, detects that.
4. **Only `app.js` and the source are re-hashed at runtime.** `index.html` and `styles.css` are hashed in the manifest for reviewers only. This is disclosed.
5. **Environment E2 emulates the GitHub API** and serves `raw.githubusercontent.com` from git. Live API behaviour (MATCH, then quota 403 → UNAVAILABLE) was observed in E1.
6. **Real-download coverage.** Real file downloads were exercised in E2 (Playwright download events; 57 distinct filenames are recorded in the raw results) and in one live real-mouse flow. The other live exports were verified from the in-page Blob.
7. **Interpretive choices** remain harness interpretations and are labelled as such: materiality, the stipulated validity bound, "reauthorize", and the compatibility sets.
8. **Accessibility** was spot-checked, not audited.

---

## 20. Final accounting

**E1, live:**

| Area | Result |
|---|---|
| Deployment checks | 10/10 |
| 36-run matrix | 36/36 |
| Determinism | 24/24 |
| Isolation | 9/9 |
| Real-mouse flow | 1/1 |
| Live finding confirmations | 4/4 reproduced (V032-NEW-01, -02, -03, -04) |
| Clean Replays CONSISTENT | 70/70 |
| Clean Exports PASS, independently re-verified | 69/69 (the real-click export completed without refusal but its file was not inspected) |
| Console errors / uncaught errors | 0 / 0 |

**E2, replica:** 298 cases in total.

| Phase | Cases | Pass | Fail / Info | Fails map to |
|---|---|---|---|---|
| Matrix | 36 | 36 | 0 | — |
| Contract schema | 44 | 37 | 7 | NEW-04 (2), NEW-05 (5) |
| Recovery (NEW-02/03) | 10 | 9 | 0 / 1 info | — |
| Replay | 22 | 21 | 1 | NEW-01 |
| Tamper and observability | 74 | 65 | 9 | NEW-03 |
| Export | 30 | 30 | 0 | (NEW-07 observed within E07b) |
| Provenance | 29 | 26 | 3 | NEW-02 (1), NEW-03 (2) |
| Source | 12 | 9 | 3 | NEW-03 |
| Races | 23 | 23 | 0 | — |
| Determinism, isolation, UI | 18 | 16 | 1 / 1 info | NEW-06 |

**Findings:**

- **v0.3.1 closure:** 7 fixed, 1 partially fixed.
- **New open findings:** 6 Low and 3 Observation. None is Critical, High or Medium.

---

## Final release questions

**A. Did the deployed 36-run matrix pass 36/36?** **Yes.** 36/36 live, and 36/36 in the replica, with identical evidence cores.

**B. Did every clean Replay report CONSISTENT?** **Yes.** Every clean Replay did (70/70 live and all E2). Separately, a tampered record wrongly reports CONSISTENT (V032-NEW-01).

**C. Did every clean Export report PASS?** **Yes.** 69/69 live exports were independently re-verified, and every clean E2 export passed.

**D. Did the automated v0.3.2 regression pass?** **Yes.** It printed "JANUS v0.3.2 automated regression: PASS" and exited with 0.

**E. Are all eight v0.3.1 findings fully closed?** **No.** 7/8 are fully closed. V031-NEW-07 is partially closed (see V032-NEW-03).

**F. Did you find ANY new actionable issue, including Low or Observation?** **Yes.** Nine: V032-NEW-01 to -06 (Low) and V032-NEW-07 to -09 (Observation).

**G. Are there any known documentation contradictions?** **Yes.** The Replay check list, the resource-naming claim, the "closes every known finding" claim, the "until a new clean run" wording, and stale v0.3.1 sections (V032-NEW-01, -03, -08).

**H. Are there any known evidence-integrity gaps beyond explicitly disclosed inherent limits?** **Yes, two, both Low and both failing safe or honestly labelled:**

- V032-NEW-01: Replay certifies a record whose stored core hash was altered. Export still refuses it.
- V032-NEW-02: a fabricated bound commit reaches a PASS export, labelled `UNAVAILABLE`.

**I. Are there any source-conformance concerns?** **No.** 0/18 commitments are contradicted or insufficiently supported, and every analogy is disclosed.

**J. Does v0.3.2 meet the standard "ZERO KNOWN OPEN FINDINGS AFTER THE DEFINED TEST PROGRAM"?** **No.**

**K. Is it ready to be promoted to Version 1.0?** **No.**

### Blockers to Version 1.0

1. **V032-NEW-01:** add the stored-core check to Replay's verdict, and correct the README.
2. **V032-NEW-02:** treat a raw 404 for the bound commit as `NOT_FOUND` and refuse, or at least never mark it PASS.
3. **V032-NEW-03:** name the resource for manifest-parse and body-read failures, clean up structural-tamper messages, and name the failing flags in the divergence banner. This closes V031-NEW-07.
4. **V032-NEW-04:** remove the `innerHTML` sink.
5. **V032-NEW-05:** add invisible-character and uniqueness checks, plus startup contract validation.
6. **V032-NEW-06:** wrap long hashes in the provenance box.
7. **V032-NEW-07:** disable Export (and Replay) while in flight.
8. **V032-NEW-08:** correct the documentation.
9. **V032-NEW-09:** add `aria-live` to the notice region and a repository/evidence link. The maintainer may classify this as out of scope, but it is actionable and is therefore listed.

### Recommended next step

**Make a bounded v0.3.3 hardening release covering these nine items:**

- Keep it incremental: no redesign, and no change to the authored scenario content. That keeps source conformance and the evidence cores stable, so the baseline hashes above can be re-used as oracles.
- Extend `tests/v0.3.2-regression.mjs` with one case per finding:
  - the stored-core replay case;
  - the raw-404 manifest;
  - a malformed or null manifest;
  - a mid-body drop;
  - HTML in the summary;
  - zero-width and duplicate contract fields;
  - Export double-click.
- Record that run's actual output in the repository.

**Then:**

1. Deploy the release.
2. Run the six-scenario smoke gate.
3. Rerun this same program against v0.3.3. Only a clean result there should lead to creating the separate Version 1.0 artifact.

---

## 21. Raw-results appendix

The machine-readable evidence is in **`JANUS_Harness_v0.3.2_raw_results.json`**:

- **`phase1_deployment`:** hashes, tag resolution, preserved-evidence comparison, and the local regression output.
- **`phase2_matrix_live`:** 36 live rows. Each has the verdict, failures, comparison class, evidence-core prefix, and bound and main corroboration.
- **`phase11_determinism_live`, `phase12_isolation_live`.**
- **`live_fault_confirmations`:** L1–L4, the live reproductions of V032-NEW-03, -02, -01 and -04.
- **`phase10_ui_live`:** the real-click flow, link targets, repository-link and aria observations.
- **`e2`:** all 298 E2 cases. Each case has `id`, `phase`, `desc`, the mutation or setup, `verdict` and the full `observed` state, including notices, button states, replay results, export filenames and integrity, alerts and errors.

Case IDs referenced in this report:

- `M-*` — matrix
- `C*` — contract
- `R02*`, `R03*` — recovery
- `NEW04-*`, `P5-*` — replay
- `NEW06-*`, `NEW07-*` — tamper and observability
- `E*` — export
- `B*` — provenance
- `SRC-*` — source
- `R1`–`R21` — races
- `D-*`, `I-*`, `U-*` — determinism, isolation, UI
