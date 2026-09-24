# JANUS Governance Challenge Harness v0.3.3 — Independent Zero-Open-Finding Adversarial Regression

- **Tested:** 2026-09-24
- **Live URL:** https://newsomek.github.io/JANUS-Governance-Challenge-Harness/
- **Repository `main`:** `eb65796c93a18de916cd7a795447ff794194fabb`
- **Bound code commit:** `7322fea30a629eda8cd4655e5dc6d326df398731`
- **Source SHA-256:** `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`
- **Raw results:** `JANUS_Harness_v0.3.3_raw_results.json`

No tag was created. Nothing was renamed to v1.0.

---

## 1. Executive summary

v0.3.3 is functionally sound in ordinary use:

- **Matrix:** 36/36 live permutations pass, and 36/36 pass in the replica.
- **Replay and Export:** every clean Replay was `REPLAY CONSISTENT` with all flags true. Every clean Export was `PASS` with 15/15 integrity checks true.
- **Determinism:** evidence cores are deterministic, including after a reload.
- **Provenance and sources:** source-document and build-provenance attacks all fail closed.
- **Injection:** nothing is executable.
- **Source conformance:** clean (0 contradicted, 0 insufficiently supported).

The v0.3.2 findings are closed except one residual. v0.3.3 does **not** meet the zero-open-finding standard, because **six open findings remain**. None is Critical, High or Medium. Five are Low and one is an actionable Observation:

| ID | Severity | Summary |
|---|---|---|
| V033-NEW-01 | Low | The visible-text validator accepts invisible characters outside `\s`/`\p{Cf}`, such as U+3164, U+2800, U+034F, U+FE0F and U+180B. Duplicate commitments are also accepted. Both render blank or duplicated and export `PASS`. |
| V033-NEW-02 | Low | A stale Replay/Export completion re-enables Replay and Export while a new Run is still in flight. Export then writes a `PASS` file for the *superseded* record and clears the "Verifying…" banner. A Run clicked during an Export silently drops that export. |
| V033-NEW-03 | Low | V032-NEW-03 residual: structural-tamper refusals still expose raw `TypeError` text. A `scenario_id` fault is reported as "Scenario contract is missing." |
| V033-NEW-04 | Low | The automated evidence does not guard the v0.3.3 fixes: all 6 fix-reverting mutations still pass both suites. The release gate requires `v0.3.2-regression.mjs`, which crashes on v0.3.3. |
| V033-NEW-05 | Low | The integrity disclosure overstates what the snapshot hash detects and limits "not tamper-proof" to "after export". Console forgery *before* export yields `PASS` artifacts. |
| V033-NEW-06 | Observation (actionable) | Documentation is stale: `VERSION.txt` lists the v0.3.2 corrections as v0.3.3's, the CHANGELOG entry sits above its title, and the "closes V032-NEW-01…09" claim is contradicted by NEW-03. |

**Verdict:** v0.3.3 does **not** satisfy the zero-known-open-finding release gate and is **not** eligible for promotion to Version 1.0.

---

## 2. Method and environments

| | E1 — Live | E2 — Replica |
|---|---|---|
| **Target** | The deployed site in the user's Chrome | Headless Chromium 1194 (Playwright 1.56). Every `newsomek.github.io` request is answered with repository-HEAD bytes. |
| **External services** | Real github.io, raw.githubusercontent and api.github.com | Raw requests are served from git objects. The API is emulated as `{sha: eb65796, parents:[7322fea]}` unless a test overrides it. |
| **Interaction** | Control clicks and `change` events. One flow used real clicks on the actual buttons. | Real `page.click`, `selectOption` and keyboard input, with real download events |
| **Export capture** | The in-page Blob. Saving to disk was suppressed to avoid about 80 files in Downloads. | Real downloaded files |
| **Used for** | Deployment, the 36-run matrix, determinism, isolation, a real-click flow, and live confirmation of the new findings | Fault injection, tamper tests, contract and injection tests, races, mobile, keyboard, and a replicate matrix |

**Fidelity.** All 36 live evidence-core hashes equal the E2 hashes. The six canonical cores are unchanged after a live reload.

**Oracle.** Expected contracts come from the reviewed baseline `dc621ff:app.js`. Its scenario block is byte-identical at `ef0f675` and `eb65796` (block SHA-256 `948536a1…`). I recomputed the contract, core and snapshot hashes independently, both in Node and in the page.

**Test-helper transparency (E1).** Six first-pass live rows needed a second look. None was an application defect:

- **Two cycles did not export.** My wait helper returned while a Run or Replay was still in flight, so the next click landed on a correctly disabled button. I fixed the helper to be in-flight-aware and re-ran both cycles; both passed.
- **Three rows were false oracle failures.** The oracle accepted only HTTP 403 for GitHub quota exhaustion, but GitHub returned 429. I re-ran all three; all passed.
- **One uncaught error was mine.** A `ReferenceError` came from my own re-evaluated oracle function, not the page. I excluded it from the application error counts.

**GitHub quota.** The unauthenticated API quota ran out partway through the live matrix, from row 18. Main corroboration then reported `UNAVAILABLE` (HTTP 403, later 429). That classification is correct, and it did not affect PASS or the evidence cores.

---

## 3. Phase 1 — Deployment and provenance

| # | Check | Result |
|---|---|---|
| 1 | GitHub `main` = `eb65796…` | **PASS**. Both `git ls-remote` and the live API return it. |
| 2 | `build-info.json`: version `0.3.3`, build_id `…-v0.3.3`, code_commit `7322fea…` | **PASS**. The live file is byte-identical to the repository copy (`f4b1621a…`). |
| 3 | `app.js` = HEAD = bound commit = manifest = live | **PASS**. All five are `7ed38e78…7acbe`. |
| 4 | All manifest files exist live and match | **PASS**, 17/17. They were hashed in the browser from the live site. |
| 5 | Source hash | **PASS**: `21766f5d…551fe4`, 50,354 bytes, in the repository and live. |
| 6 | Preserved v0.3.2 report and raw results | **PASS**. Both match the manifest. The v0.1–v0.3.1 evidence is byte-identical to `dc621ff`. |
| 7 | The v0.3.3 automated result record contains real PASS output | **PASS**. It records both PASS lines with exit code 0. |
| 8 | `tests/v0.3.3-regression.mjs` | **PASS**. I reproduced it: exit 0, "Canonical exports: 7; refusal alerts: 1". |
| 9 | `tests/v0.3.3-hardening-regression.mjs` | **PASS**. I reproduced it: exit 0, 11 checks. These are static source-text checks only; see V033-NEW-04. |
| 10 | The provenance commit changes only `build-info.json` | **PASS**. `git diff 7322fea eb65796` lists one file. |
| + | Authored scenario content unchanged | **PASS**. It is identical to v0.3.2 and to the reviewed v0.3.1. |
| + | `tests/v0.3.2-regression.mjs`, required by `V0_3_3_RELEASE_GATE.md` | **FAIL**. It exits 1 with `TypeError: scenarioSummary.replaceChildren is not a function`; see V033-NEW-04. |

---

## 4. Phase 2 — Full 36-run matrix

**E1 live: 36/36. E2 replica: 36/36.** Each row ran Run → Replay → Export, and each row was verified for all of the following:

- **Selection:** scenario and prediction, including the labels.
- **Disposition:** the encoded disposition is independent of the prediction.
- **Comparison:** the comparison code and label.
- **Compatibility:** the set and the rationale.
- **Content:** commitments with their support labels, sources, and the authored text.
- **Hashes:** expected/observed source hash, and contract, core and snapshot hashes against the oracle.
- **Provenance:** the code commit, bound verification `MATCH`, and main corroboration classified correctly.
- **Replay:** `REPLAY CONSISTENT` with 8/8 flags true.
- **Export:** `PASS` with 15/15 checks true, and scenario and prediction matching the UI.
- **Clean state:** exactly one artifact, the filename pattern, no stale notice, no uncaught error, and no alert.

Comparison distribution (identical in both environments):

| Scenario | CONT | BLOCK | B+R | ESC | RB/C | INSUF |
|---|---|---|---|---|---|---|
| S01 condition-change | DIFF | PART | **EXACT** | PART | DIFF | DIFF |
| S02 evidence-change | DIFF | **EXACT** | PART | PART | DIFF | DIFF |
| S03 authorization-expiry | DIFF | PART | **EXACT** | PART | DIFF | DIFF |
| S04 learning-authority | PART | PART | **EXACT** | PART | DIFF | DIFF |
| S05 conflicting-authorities | DIFF | PART | DIFF | PART | DIFF | **EXACT** |
| S06 mid-execution-revocation | DIFF | PART | DIFF | PART | PART | **EXACT** |

**Live clean cycles in total:**

- **Executed:** 77 (the matrix, re-runs, determinism, reload, isolation and a real-click flow).
- **Completed:** 75. All 75 were CONSISTENT and PASS.
- **Aborted:** 2, both by the test helper, as explained in §2.

---

## 5. Phase 3 — Retest of the v0.3.2 findings

| Finding | Status | Evidence |
|---|---|---|
| **V032-NEW-01** stored-core check | **FIXED** (behaviour) | See the detail below the table. |
| **V032-NEW-02** fabricated bound commit | **FIXED** | See the detail below the table. |
| **V032-NEW-03** resource-specific errors | **PARTIALLY FIXED** | See the detail below the table. |
| **V032-NEW-04** injection | **FIXED** | I injected `<img onerror>`, `<script>` and `onmouseover` payloads into 13 renderable fields at runtime, plus the option label at startup. There were 0 executions and 0 injected elements. The text renders literally, and the export preserves it as data (PASS). |
| **V032-NEW-05** contract validation | **FIXED** for every listed item | See the detail below the table. |
| **V032-NEW-06** mobile overflow | **FIXED** | 320/360/375/390 px were each tested in six states: fresh, result+provenance, replay JSON, divergence banner, a long 404 refusal, and a long parse refusal. Page `scrollWidth` equalled `clientWidth` in every case, with 0 offending elements. The replay `<pre>` scrolls inside its own box. |
| **V032-NEW-07** double Export | **FIXED** | The following each produced exactly **1** artifact: double-click, triple-click, a synchronous triple, and 5 clicks during one in-flight export. A deliberate later click produces a second export, as expected. |
| **V032-NEW-08** documentation | **FIXED** for the five listed items | "until a new clean run" is gone. The smoke-test section and the model section are version-neutral. The Replay list includes the stored core. The closure claims are now "addresses" in the UI and README. New documentation issues are logged as V033-NEW-06. |
| **V032-NEW-09** accessibility and navigation | **FIXED** | `#staleNotice` has `role="status"`, `aria-live="polite"` and `aria-atomic="true"`. The Repository and "Independent test evidence" links are visible and meaningful. |
| **V031-NEW-07** residual | **FIXED** | The divergence banner names the failing flags. I verified this across 110 tamper rows covering single and combined failures, for example `disposition_match, contract_match, record_integrity_match, stored_core_match, authored_state_match`, and `code_match, record_integrity_match` alone. |

**V032-NEW-01 (stored-core check).** Every one of the 35 protected fields, tampered with the snapshot hash recomputed, reports `REPLAY DIVERGENCE` with `stored_core_match` false, and Export refuses. When the core hash is also recomputed (coordinated tampering), `authored_state_match` catches it. However, the promised regression case exists only as a regex over the source text (V033-NEW-04).

**V032-NEW-02 (fabricated bound commit):**

- **Refused:** a nonexistent well-formed SHA gets raw 404, and Run is refused with "…app.js was not found at that commit (HTTP 404)". A 404 at Export time is also refused. A commit whose `app.js` differs is refused. Malformed, short, non-hex and missing commits are all refused.
- **Allowed as `UNAVAILABLE`:** raw 403, 429 or 500, a network failure, or a body-read failure. `PASS` is still produced, with the reason in the bound-commit note, which matches the documented trust model.
- **Accepted by content addressing:** HEAD `eb65796` has identical `app.js` bytes and corroborates (see inherent limit L2).

**V032-NEW-03 (resource-specific errors).** These all name the resource and the category:

- source fetch / HTTP status / body read;
- build-info fetch / HTTP status / parse / non-object;
- app.js fetch / body read / hash mismatch;
- bound fetch / body read / 404 / mismatch;
- main lookup (in the notes).

**Not fixed:** the v0.3.2 fix list also required mapping structural `TypeError`s to a clear message, and raw engine text is still shown → V033-NEW-03.

**V032-NEW-05 (contract validation).** Each of the following was refused with a visible, specific reason, with no Run and no PASS:

- zero-width-only id, name, summary, rationale and commitment text;
- soft-hyphen-only text;
- duplicate compatibility values, duplicate sources, and duplicate IDs (at startup);
- an unknown or prototype-key prediction;
- a malformed or lowercase status;
- empty, null, string or object commitments, and a missing or numeric commitment text;
- a string, empty, numeric, null or nested source list;
- an invalid disposition: `FOO`, empty, `__proto__` or `toString`;
- a disposition inside its own compatibility set;
- a null scenario (runtime and startup), and an empty scenario set;
- wrong field types, and missing fields.

That is 37 of 47 runtime cases refused, plus 6 of 7 startup cases. **Residual gap:** invisible characters outside `\p{Cf}` and duplicate commitments → V033-NEW-01.

---

## 6. Phase 4 — Export schema audit

| Question | Answer |
|---|---|
| Field carrying the harness version | **`version`** at the top level, `"0.3.3"`. There is no `harness_version` field. `harness_provenance.build_version` (`"0.3.3"`) and `build_id` are also present. |
| Machine-readable | Yes |
| Name matches documentation | Yes. The README says "harness version/build ID" without naming a field. No repository document or test refers to `harness_version`. The only occurrence is the preserved v0.3.2 raw-results file, which uses it as its own metadata key. |
| Value | `0.3.3` |
| Integrity protection | `version`, `build_id`, `harness_code.build_version` and `harness_code.build_id` are in the evidence core. A tampered `version` gives Replay DIVERGENCE and an Export refusal. |
| Filename | `…-v0.3.3.json`, from the same `HARNESS_VERSION` constant. It agrees with the JSON value. |
| `build_id` / build-info | These agree, and the runtime enforces them. |

**Verdict: NOT A DEFECT.** The smoke-test remark was a naming observation only.

---

## 7. Phase 5 — Replay/Export adversarial integrity

**Scope.** 43 fields/objects × 3 modes = **129 tamper rows**. The three modes were: naive; snapshot hash recomputed; core and snapshot hashes both recomputed. Each tamper went through Replay, and separately through a direct Export.

**Protected authored core (35 fields).** 110 rows **all detected**, with **0 false CONSISTENT and 0 false PASS**. The fields covered:

- `scenario_id`, the name and summary, the prediction and its label, the disposition and its label, and the comparison and its label;
- the compatibility set and rationale, and the contract hash;
- the source's expected and observed hashes, bytes, URL and title;
- the event log, rationale, evidence required, commitment text and support status, and the source citations;
- the repository, restrictions and both attributions;
- `build_id`, `version`, and both code-commit fields;
- the expected and observed `app.js` hashes, and the core and snapshot hashes themselves.

In every row the banner names the failing flags, and a direct Export refuses with the failing integrity checks named.

**Three rows were restorations, not forgeries.** Recomputing a hash after "tampering" that same hash simply puts the original value back.

**Additional forgery attempts:**

- **Forged `lastReplay` plus a DOM-enabled Export:** refused. The replay is re-derived at Export.
- **Edited on-screen replay record:** refused.

**What a console attacker can forge. These produce a PASS artifact:**

1. **Non-core metadata** (16/16 rows): `generated_at`, `harness`, run-time `bound_commit_verification`, `commit_verification`, `deployment_head_observed`, `checked_at`, `hash_match` (even `false` inside a PASS file), and extra fields, as long as the snapshot hash is recomputed. `export_provenance` is still re-observed fresh at Export.
2. **The authored contract itself.** Changing `scenarios[0]` in memory (disposition → `CONTINUE`) and then running normally gives `EXACT MATCH`, `REPLAY CONSISTENT` and Export `PASS` with a non-baseline `contract_sha256`. Only an offline verifier that recomputes the contract from the bound commit can detect this.
3. **A genuine record for another selection.** Swapping in such a record exports that selection while the UI shows a different one.

**What a console attacker cannot do** is alter one field of a stored run record, even with every stored hash recomputed, and still get a CONSISTENT/PASS result. `authored_state_match` re-derives the core from the live contract.

All of this is inherent in unsigned client-side code. However, the *disclosure* is inaccurate → V033-NEW-05.

---

## 8. Phase 6 — Source attacks

Each attack was applied at three points: at Run, between Run and Replay, and between Replay and Export. That is 7 attacks × 3 = 21 cases, all refused accurately:

- **Wrong bytes:** a one-byte flip, a same-length byte swap and a one-byte truncation all refuse with "Observed JANUS source-document SHA-256 does not match…".
- **HTTP 404 / 500:** "Source document fetch failed: HTTP 404/500".
- **Network failure:** "…fetch failed: Failed to fetch".
- **Body-read failure:** "Source document body read failed: …".

The Run refusals were retryable without Reset in every case (4/4 one-shot faults). The first same-length swap test was a no-op because the two swapped bytes were equal; I re-tested with distinct bytes, and all three points were refused.

---

## 9. Phase 7 — Build and provenance attacks

**51 cases.** Every build-info fault refused with a specific reason:

- **Fetch and parse:** HTTP 404 and 500, malformed JSON, `null`, an array, and HTML returned with 200.
- **Identity mismatches:** wrong or missing version, and wrong build ID.
- **Commit problems:** malformed, short, non-hex or missing commit; a nonexistent commit; a commit whose `app.js` differs.
- **Hash problems:** the wrong app hash in the manifest; missing or null `files`.
- **Served `app.js` failures:** wrong bytes, 404, network failure, and body-read failure.
- **Bound raw file:** 404 and mismatch.

**Corroboration outcomes.** These allow PASS and are correctly classified:

| Condition | Outcome |
|---|---|
| Bound raw 500/403/429, network, or body failure | Bound = `UNAVAILABLE`, with the reason in the note |
| GitHub API 403/429/500, network, body failure, or invalid SHA | Main = `UNAVAILABLE` |
| Main advances with the same `app.js` | Main = `MATCH` |
| Main advances with a different `app.js`, or is behind (`ef0f675`) | Main = `MISMATCH` |
| Main's `app.js` returns 404 | Main = `UNAVAILABLE` |

**Primary bound provenance was never replaced by main:** `bound_code_commit` stayed `7322fea` in every case.

**Mid-session changes:**

- **Build-info version bumped** between Run and Replay: Replay refused.
- **Build-info `code_commit` switched to HEAD** (same `app.js`) between Run and Replay: DIVERGENCE (`code_match`, `authored_state_match`).
- **The same switch between Replay and Export:** Export refused (`code_commit`, `authored_state_integrity`, `replay_rederived_consistent`).
- **Served `app.js` changed mid-session:** refused.

**Note.** Main-lookup body-read and parse failures appear as "GitHub main corroboration unavailable: <browser message>". The resource is named; the category is the raw browser text. Because this is optional corroboration and never a refusal, I do not count it.

---

## 10. Phase 8 — Races and concurrency

**23 race scenarios, all run in E2.** The following passed. There were no duplicate artifacts, no stale completions, no wrong-scenario evidence, and consistent final controls:

- **Repeated clicks:** triple Run (one source fetch), triple and double Replay (one replay operation), and triple, double and burst Export (one artifact).
- **Clicks during an operation:** Run → Replay immediately and Replay → Export immediately (the second button is disabled).
- **Interrupted operations:** an in-flight Export or Replay followed by Reset or a scenario change (no artifact, correct notice), and Export → Reset or scenario change.
- **Recovery:** failure → immediate retry, and failure → prediction change → retry → Export.
- **Delays:** a delayed source fetch → Reset, and a delayed build fetch → prediction change → new Run (the export reflects the new prediction).
- **Reset during Run** → new selection → Run.

**Failed:** Run clicked while Replay or Export is in flight → **V033-NEW-02**. I reproduced it live as well.

---

## 11. Phases 9–11 — Determinism, isolation, UI

**Determinism:** 24/24 live and 24/24 in E2. Each scenario was run three times with Reset plus once after reload, and gave an identical evidence-core hash in every run. The contract hash was identical and the snapshot hashes were distinct, as documented (timestamps). Live canonical cores:

| Scenario | Evidence-core hash |
|---|---|
| S01 | `ec39282e…` |
| S02 | `b11e439e…` |
| S03 | `0e10a0bf…` |
| S04 | `5d9d3c2a…` |
| S05 | `4a9a1e78…` |
| S06 | `978e0379…` |

**Isolation:** 9/9 live and 9/9 in E2, running mixed sequences without Reset and injecting three refusals. Nothing leaked between runs: rationale, commitments, sources, prediction, compatibility, provenance, event log, replay and refusal state were all fresh each time.

**UI and ordinary user:**

- **Labels and text:** the select labels are bound, the glossary and badges are correct, and S04 × CONTINUE shows PARTIAL with its rationale.
- **Notices:** the prediction-change and Reset notices are correct.
- **Filename:** the export filename pattern is correct.
- **Footer and links:** the footer attribution (Kelly Newsome · Stratos Engine) and the Eryk Dubiel LinkedIn, Repository, Independent-test-evidence and source-document links are all visible, `target=_blank` and `rel=noopener noreferrer`.
- **Images:** both have alt text and load.
- **Real clicks:** the live real-click flow worked.
- **Keyboard:**
  - Tab order is scenario → prediction → Reset → links, with disabled buttons skipped.
  - Arrow keys change the prediction.
  - Enter runs, Space replays and Enter exports.
  - Focus falls back to `<body>` while the active button is disabled. The next Tab still moves to the next control, so this is not treated as broken. I record it as an informational note, not a finding.

No formal WCAG audit was performed.

---

## 12. Phase 12 — Source conformance (18 commitments)

| Scenario | Commitment | Label | Source check |
|---|---|---|---|
| S01 | Decision validity ≠ authorization validity | DIRECTLY SUPPORTED | §01 "A decision is not authorization"; §06; §19 |
| S01 | A reasonable decision does not preserve permission | DIRECTLY SUPPORTED | §19 "does not automatically imply the right to carry it out" |
| S01 | No reauthorization protocol | OPEN | Correct; the source has no reauthorize or revoke terms |
| S02 | No-forced-resolution applied to evidence | EXTENDED / BY ANALOGY | §28, correctly marked as an analogy |
| S02 | Authorization history ≠ current justification | REASONABLE INFERENCE | §06, §19, §27 |
| S02 | Evidence→authority dependency not stated | OPEN | Correct |
| S03 | History ≠ present authority under a stipulated bound | REASONABLE INFERENCE | §19, §27, §39 |
| S03 | Scope-of-validity by analogy | EXTENDED / BY ANALOGY | §26 Memory row "provenance and scope of validity" |
| S03 | No TTL or renewal | OPEN | Correct |
| S04 | Learning ≠ authorization change | DIRECTLY SUPPORTED | §22 table and "Learning ≠ Self-Promotion" |
| S04 | Capability ≠ authority expansion | DIRECTLY SUPPORTED | §24; §19 "Capability ≠ Authority" |
| S04 | Governance event unspecified | OPEN | Correct; §24 names only an "independently verified" process |
| S05 | No-forced-resolution applied to authority | EXTENDED / BY ANALOGY | §28 |
| S05 | Fail-closed does not support silent execution | REASONABLE INFERENCE | §32 fail-closed; §38 refusal of an unjustified transition |
| S05 | Authority hierarchy unspecified | OPEN | Correct |
| S06 | Execution separately accountable | DIRECTLY SUPPORTED | §20 "accountable event"; §06 |
| S06 | Authority loss reconstructable | REASONABLE INFERENCE | §31 "who had the authority and what actually happened" |
| S06 | No in-flight mechanism | OPEN | Correct; §01 says it is not an implementation specification |

**Result: 0 contradicted and 0 insufficiently supported.** By label: 5 DIRECTLY SUPPORTED, 4 REASONABLE INFERENCE, 3 EXTENDED / BY ANALOGY, 6 OPEN. All cited sections were checked against the served DOCX (§01, 06, 19, 20, 22, 24, 26–29, 31–33, 38, 39). Scenario content is unchanged since the reviewed baseline.

---

## 13. Phase 13 — Documentation and claims audit

**Accurate:**

- the version and build identity;
- the bound commit and the two-commit model;
- main described as optional corroboration;
- source hashing at Run, Replay and Export;
- the Replay comparison list;
- the Export check list (it matches the 15 keys exactly);
- that the on-screen replay record is not trusted;
- that runtime re-hashes only `app.js` and the source;
- the "export blocked until a subsequent consistent Replay" wording;
- the independent-test status of v0.1–v0.3.2;
- the export version fields.

**Contradictions and inaccuracies:** see V033-NEW-03 (closure claim), V033-NEW-04 (gate and tests), V033-NEW-05 (integrity disclosure) and V033-NEW-06.

---

## 14. New findings

### V033-NEW-01 · Low · Invisible characters outside `\p{Cf}` pass contract validation; duplicate commitments are accepted

**Reproduction** (E2, and live on S02):

1. In the console, set `scenarios[1].name = 'ㅤ'; scenarios[1].rationale = '⠀'`.
2. Select S02 × BLOCK, then Run → Replay → Export.

**Observed.** There is no refusal. The title renders blank (screenshot captured in E2). Replay is `CONSISTENT` and Export is `PASS`, with an exported `scenario_name` of U+3164.

**Characters accepted by the validator.** Each of these is accepted as "visible text" at runtime:

| Character class | Code points |
|---|---|
| Hangul fillers | U+3164, U+115F/U+1160, U+FFA0 |
| Braille blank | U+2800 |
| Combining grapheme joiner | U+034F |
| Variation selectors | U+FE0E/U+FE0F |
| Mongolian free variation selector | U+180B |

The same gap exists at startup: a U+3164 name gives a blank option label and initialisation is not refused. Duplicate `commitments` are also accepted and rendered twice, even though compatibility values and sources are now required to be unique.

**Impact.** Authoring-time only. The shipped contracts are valid. The stated goal of V032-NEW-05 was "blank-looking fields must not pass", and they still can.

**Fix:**

- Treat `[\s\p{Cf}\p{Default_Ignorable_Code_Point}⠀]` as empty. `\p{DI}` covers the Hangul fillers, CGJ, the variation selectors and FVS; I verified the regex in Node.
- Require unique commitments by `status + text`.

### V033-NEW-02 · Low · A stale Replay/Export completion re-enables controls during an in-flight Run

**Reproduction** (E2, and live on S01 × BLOCK):

1. Run once.
2. Delay the next source fetch by 0.7 s and the one after it by 3 s.
3. Click Replay. Run is still enabled while the Replay is in flight.
4. After 0.1 s, click Run.

**Observed:**

- **Controls re-enable too early.** About 1.3 s later, the banner still reads "Verifying source bytes, bound build provenance, and evidence state…" and Run is disabled, but **Replay and Export are enabled**.
- **Export uses the superseded record.** Clicking Export writes a `PASS` evidence file whose `generated_at` is that of the **superseded** record (`08:48:17.979Z`, live). It also **clears the Verifying banner** while the new Run is still in flight. The new Run then completes with a new record (`08:48:21.805Z`).
- **Exports can be silently dropped.** In the Export variant (Run clicked while an Export is in flight), the export is dropped without any notice, and the controls again re-enable during the Run.

**Cause:**

- `replayLastRun()` and `exportEvidence()` re-enable the buttons in `finally` whenever `lastRun` is truthy, but `runChallenge()` leaves the old `lastRun` in place until it finishes.
- Run is not disabled while a Replay or Export is in flight.

**Impact.** In ordinary use, the UI state becomes inconsistent: an artifact can be produced for a record the user just chose to replace. Scenario and prediction are unchanged, and the file is internally valid.

**Fix:**

- Track `runInFlight`, or compare the generation token in the `finally` blocks.
- Disable Run while a Replay or Export is in flight.
- Optionally clear `lastRun` at the start of a Run.

### V033-NEW-03 · Low · Structural-tamper refusals still expose raw engine text (V032-NEW-03 residual)

**Reproduction.** Run S01, then in the console set `lastRun.harness_provenance = null`, then click Replay or Export.

**Observed:**

- `lastRun.harness_provenance = null` → `Replay refused: Cannot read properties of null (reading 'build_info_url')`, and the same text for Export.
- `source_document = null` → `(reading 'title')`.
- `delete harness_provenance` → `(reading 'build_info_url')` on `undefined`.
- `scenario_id = null` → "Scenario contract is missing." This blames the authored contract for a fault in the stored record.

**Impact.** It fails closed with no export. However, the v0.3.2 fix list explicitly required mapping structural `TypeError`s to a clear message such as "Stored run record is structurally invalid". The CHANGELOG, README and About panel therefore overstate closure.

**Fix:**

- Validate the stored record's structure before hashing.
- Map any `TypeError` to "Stored run record is structurally invalid (<field>)".
- Distinguish an invalid `scenario_id` in the record from a missing contract.

### V033-NEW-04 · Low · The automated evidence does not guard the v0.3.3 fixes, and the release gate names a crashing suite

**Observed:**

- **The behavioural suite has no new cases.** `tests/v0.3.3-regression.mjs` is the v0.3.2 suite plus two mock-DOM methods. It adds no case for V032-NEW-01…09.
- **The hardening suite only reads source text.** `tests/v0.3.3-hardening-regression.mjs` is 11 regex checks over source text.
- **Reverting fixes goes undetected.** I made **6 of 6** fix-reverting mutations, and each one still passes both suites:
  - `stored_core_match` forced to `true`;
  - a bound 404 treated as `UNAVAILABLE`;
  - uniqueness checks disabled;
  - the visible-text check reduced to `typeof`;
  - the Export in-flight lock removed;
  - the divergence-flag list removed from the banner.
- **The gate names a crashing suite.** `tests/V0_3_3_RELEASE_GATE.md` requires "local v0.3.2 regression", but `tests/v0.3.2-regression.mjs` crashes against v0.3.3 (exit 1, `replaceChildren is not a function`). The result record omits it.
- **The claims overstate coverage.** The CHANGELOG says "adds explicit regression cases", and `VERSION.txt` claims coverage of "malformed contracts, replay/export integrity, and structural tampering".

**Fix:**

- Add behavioural cases for each V032 and V033 item: a stored-core tamper with the snapshot recomputed, a raw 404, invisible and duplicate contract fields, injection, double Export, and the Run-during-Replay race.
- Name the correct suites in the gate, and retire or repair the v0.3.2 suite.

### V033-NEW-05 · Low · The integrity disclosure overstates tamper detection

**Observed:**

- **README overstates the snapshot hash.** The README says the snapshot hash lets Replay and Export "detect later mutation" of observation and provenance values. In fact it detects only *uncoordinated* mutation: 16 of 16 non-core forgeries with the snapshot hash recomputed gave CONSISTENT/PASS, including `hash_match:false` and `bound_commit_verification:"FORGED"` inside a PASS file.
- **The disclaimer is scoped to "after export".** `integrity_scope` reads "not tamper-proof **after export**", and the README uses the same wording. Yet in-page console manipulation *before* export can produce a `PASS` artifact carrying a forged authored contract (§7, item 2).
- **Offline checking is not described.** There is no published contract-hash list, and no procedure for checking `contract_sha256` against the bound commit.

**Impact.** The limitation itself is inherent. The wording, however, undermines the documented claim, so it cannot be classed as an accurately disclosed inherent limit.

**Fix:**

- Reword the disclosure. Something like: "the in-page state and the exported JSON are unsigned; anyone with console access can produce a PASS file; the snapshot hash detects accidental or uncoordinated mutation only."
- Publish the six expected `contract_sha256` values (in `build-info.json` or the README) and describe the offline check.

### V033-NEW-06 · Observation (actionable) · Documentation staleness and an unsupported closure claim

**Items:**

1. **`VERSION.txt` lists the wrong corrections.** "Primary v0.3.3 corrections" is the v0.3.2 list verbatim; only the heading was changed. It omits the real v0.3.3 changes: the stored-core check, 404 refusal, removal of the `innerHTML` sink, uniqueness checks, live region, links, the export lock, and wrapping.
2. **The CHANGELOG entry is misplaced.** The v0.3.3 entry sits above the `# Changelog` title, and it regressed the order that v0.3.2 had fixed.
3. **The closure claim is too strong.** The CHANGELOG's "closes V032-NEW-01 through V032-NEW-09" and the README/About "addresses every actionable finding" are contradicted by V033-NEW-03, which shows V032-NEW-03 is only partial.
4. **The README v0.3.2 section is stale.** It is still in present tense ("v0.3.2 must undergo a new independent adversarial regression…"), and it points to `tests/v0.3.2-regression.mjs` as current coverage, although that suite now fails.

**Fix:** edit the wording and placement, and state closure only after independent confirmation.

### Considered and not counted (informational)

- **Focus falls back to `<body>`** while a clicked button is disabled. The next Tab still reaches the next control, so the "not obviously broken" criterion is met. Restoring focus would be a small improvement.
- **There is no fetch timeout.** A hung request leaves "Verifying…" on screen until the browser's own network timeout; Reset recovers.
- **Main-lookup body and parse notes** name the resource but use the raw browser text.
- **API 429 vs 403.** GitHub returns either for quota exhaustion; both are classified `UNAVAILABLE` correctly.

---

## 15. Inherent limits (disclosed; not counted)

- **L1. Unsigned client-side evidence.** A console attacker can forge anything. The wording of the disclosure is tracked as V033-NEW-05.
- **L2. Commit identity by content.** Any commit with identical `app.js` bytes corroborates; HEAD `eb65796` is one example.
- **L3. Self-verification.** The running code verifies a re-fetched copy of itself. Only external review, like this report, detects hostile served code.
- **L4. Limited runtime re-hashing.** Only `app.js` and the source are re-hashed at runtime. This is disclosed.
- **L5. Emulated services in E2.** E2 emulates `api.github.com`. Live API behaviour (MATCH, then 403/429 → UNAVAILABLE) was observed in E1.
- **L6. Interpretive choices.** The compatibility sets, "reauthorize" and the stipulated validity bound are harness interpretations, and are labelled as such.

---

## 16. Final accounting

| Area | Result |
|---|---|
| Deployment checks | 10/10 (plus the v0.3.2 gate suite failing → V033-NEW-04) |
| Automated suites | 2/2 PASS, but 6/6 mutations survive |
| 36-run matrix | Live 36/36; E2 36/36 |
| Clean Replays CONSISTENT, all flags true | 75/75 live that executed; all E2 |
| Clean Exports PASS, all checks true | 75/75 live; all E2 |
| Tamper rows | 129: 110 detected, 3 restorations, 16 non-core forgeries (inherent; disclosure → NEW-05) |
| Contract cases | 54 in total (47 runtime + 7 startup): 43 refused with a visible reason, 2 with Run disabled, 9 accepted (→ NEW-01) |
| Injection | 14/14 inert |
| Source attacks | 21/21 refused accurately (plus 3 re-tests) |
| Provenance attacks | 51/51 correct (31 refused, 20 corroboration-only PASS, correctly classified) |
| Races | 21/23 clean; 2 → NEW-02 |
| Determinism | 24/24 live, 24/24 E2 |
| Isolation | 9/9 live, 9/9 E2 |
| Mobile | 4 widths × 6 states, 0 page overflow |
| Source conformance | 18/18; 0 contradicted; 0 insufficient |
| **Open findings** | **Critical 0 · High 0 · Medium 0 · Low 5 · Observation 1** |

---

## Final questions

- **A. Did the 36-run live matrix pass 36/36?** Yes. It also passed 36/36 in E2, with identical cores.
- **B. Did every clean Replay report CONSISTENT with all checks true?** Yes, for every Replay that executed (75 live, plus all E2).
- **C. Did every clean Export report PASS with all checks true?** Yes: 15/15 checks on every clean export.
- **D. Did both automated v0.3.3 regression suites pass?** Yes, both exit 0. Mutation testing shows they do not guard the fixes (V033-NEW-04).
- **E. Are ALL v0.3.2 findings fully closed?** **No.** V032-NEW-03 is only partially fixed, because structural-tamper messages still expose raw `TypeError` text (V033-NEW-03). The other eight are fixed.
- **F. Is the prior V031-NEW-07 observability issue fully closed?** Yes. The divergence banner names the failed flags, singly and in combination.
- **G. Did the export-schema audit reveal any defect or documentation mismatch?** No. The field is `version` (`0.3.3`), it is core-protected, and it is consistent with the filename, `build_id`, `build-info.json` and the documentation.
- **H. Did you find ANY new actionable issue at any severity?** **Yes:** V033-NEW-01 through V033-NEW-06.
- **I. Are there any documentation contradictions?** **Yes:** V033-NEW-03/06 (closure claim), V033-NEW-04 (release gate), V033-NEW-05 (integrity wording) and V033-NEW-06 (`VERSION.txt`, CHANGELOG).
- **J. Are there any evidence-integrity gaps beyond explicitly disclosed inherent limitations?** **Yes:** V033-NEW-05. The forgeability is inherent, but the disclosure is not accurate. No false PASS is reachable without console access. V033-NEW-02 lets ordinary use export a superseded, internally valid record.
- **K. Are there any source-conformance concerns?** No.
- **L. Does v0.3.3 satisfy ZERO KNOWN OPEN FINDINGS AFTER THE DEFINED TEST PROGRAM?** **No.**
- **M. Is v0.3.3 eligible for promotion to Version 1.0?** **No.**

### Blockers

1. **V033-NEW-01:** broaden the visible-text rule to cover default-ignorable characters and U+2800, and require unique commitments.
2. **V033-NEW-02:** gate the `finally` re-enable on the generation token or a run-in-flight flag, and disable Run during Replay and Export.
3. **V033-NEW-03:** add structural validation of the stored record and clear messages.
4. **V033-NEW-04:** add behavioural regression cases for every V032/V033 item, and fix the release gate's suite list.
5. **V033-NEW-05:** correct the integrity disclosure, and publish the expected contract hashes and the offline-check procedure.
6. **V033-NEW-06:** correct `VERSION.txt` and the CHANGELOG order, soften the closure wording, and update the README v0.3.2 section.

### Recommended next step

Make a bounded **v0.3.4** that fixes only the six items above. Leave the authored scenario content untouched, because conformance is clean. Add a behavioural test for each item and confirm it fails when that fix is reverted. Then deploy and run the six-scenario smoke gate. After that, rerun this same zero-open-finding regression, with emphasis on the Run-during-Replay/Export race, the invisible-character contract cases and the structural-tamper messages. Do not create a v1.0 artifact or any tag until that regression returns zero open findings.
