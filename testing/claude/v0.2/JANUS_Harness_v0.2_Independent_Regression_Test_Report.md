# JANUS Governance Challenge Harness v0.2
## Independent Regression Test Report

Tested commit `ba7b6e5b9335f395499f569f0df091962c69bb8f` · baseline `v0.1-tested` → `f8b2eb6284575d1670c748bee1868835bf7242eb` · raw data: `JANUS_Harness_v0.2_raw_results.json`

---

## 1. Executive summary

**Scope.** I ran all 36 scenario × prediction permutations against the **live public site** in a real Chrome browser. Each permutation was run, replayed and exported. I also retested every v0.1 defect (DEF-01 to DEF-12), ran 24 determinism runs, both state-isolation sequences, 4 race tests, 13 tamper tests, and a source-conformance re-read of the Orientation Edition. I did not rely on CHANGELOG claims; each fix was exercised.

| Question | Result |
|---|---|
| Deployed = commit `ba7b6e5`? | **Yes**. 10/10 served files hash-match the commit, including the `.docx` and the preserved v0.1 evidence |
| 36/36 permutations executed? | **Yes**. 36 runs, 36 replays, 36 exports, 24 automated checks each (864 total), **0 failures** |
| Deterministic? | **Yes**. 24 repeat runs (18 with Reset, 6 after reload): 0 divergences, excluding the intentional timestamp |
| Prediction leaks into assessment? | **No**. For each scenario, all 6 predictions produced identical content; only EVENT 002/005 and the badge change |
| Export matches display? | **Yes**. 36/36 field-for-field, including event log and replay record |
| DEF-01…DEF-12 | **9 FIXED, 3 PARTIALLY FIXED (DEF-02, DEF-03, DEF-10), 0 NOT FIXED, 0 REGRESSED** |
| New defects | **7**: 0 High, **2 Medium** (NEW-02, NEW-03), 4 Low, 1 Observation |
| Source contradicted? | **No** scenario is contradicted by the Orientation Edition |

**Bottom line.** The v0.1 High defect (stale evidence) is fixed for every path a person can reach. The architectural content is materially better: there is a glossary, a three-tier comparison, S04 is split into in-scope and out-of-scope, S05 separates the unspecified mechanism from the supported constraint, and analogy is labelled as analogy. The remaining weaknesses are all in the **evidence machinery**:

- The "source-document SHA-256 check" compares a hard-coded constant with itself and can never fail (NEW-02).
- Export "consistency checks" cover only 2 fields, and exports proceed after a replay divergence (NEW-03).
- Exports carry no commit SHA (DEF-03 residual).
- Three commitments are still labelled SUPPORTED although they are inferences (DEF-10 residual).

---

## 2. Test environment

| Item | Value |
|---|---|
| Test window | 2026-09-24 03:56–04:05 UTC (2026-09-23 23:56–00:05 EDT) |
| Browser | Chrome 153.0.0.0, Windows x64, driven through Claude in Chrome (user-side) |
| Live URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ (served `Last-Modified: Thu, 24 Sep 2026 03:52:10 GMT`) |
| Repository | cloned to the cloud sandbox; remote refs via `git ls-remote` |
| Source text | `.docx` → plain text with pandoc for citation and term-count checks |

**Method notes**

- **Where it ran.** The cloud sandbox proxy blocks `github.io` (HTTP 403), so all live execution happened in the user-side Chrome tab.
- **Driving the page.** Most runs used the page's own controls: `.click()` and `change` events dispatched from in-page JavaScript. One run and one DEF-01 reproduction used real mouse and dropdown interaction, with screenshots.
- **Export capture.** `URL.createObjectURL` and `HTMLAnchorElement.prototype.click` were wrapped in-page, so the harness's own `exportEvidence()` ran unmodified and no file was written to disk.
- **Independent check.** Expected contract SHA-256 values were derived independently in Node from `app.js` at `ba7b6e5` and compared to the live values (6/6 equal).
- **Tampering.** All tampering was in-memory in one tab, discarded by reload. Nothing in the repository or deployment was modified, and no PR was created.

---

## 3. Deployment / commit verification

| Check | Result |
|---|---|
| Remote HEAD / `refs/heads/main` | `ba7b6e5b9335f395499f569f0df091962c69bb8f` ✔ |
| Tag `v0.1-tested` | annotated tag object `f83eeda…`, which peels to `f8b2eb6284575d1670c748bee1868835bf7242eb` ✔ |
| Served vs commit (SHA-256, `cache:no-store`) | `index.html`, `app.js`, `styles.css`, `README.md`, `VERSION.txt`, `CHANGELOG.md`, `.docx`, cover image, v0.1 report, v0.1 raw JSON: **10/10 MATCH** |
| Page identifies as v0.2 | title "…Harness v0.2"; eyebrow "VERSION 0.2"; `HARNESS_VERSION="0.2"`; footer v0.2 ✔ |
| Source document present | `docs/JANUS_Orientation_Edition_2026_EN.docx`, 50,354 bytes, SHA-256 `21766f5d…551fe4` ✔; byte-identical between `f8b2eb6` and `ba7b6e5` |
| v0.1 evidence present | `testing/claude/v0.1/` report and raw JSON served ✔ |
| CHANGELOG / README / v0.1 report read before testing | ✔ |

**Mismatches: none.** One note: the `.docx` core properties still read `creator: Un-named`, `lastModifiedBy: Kelly Newsome`, `revision 2`. This is the same file as in v0.1. DEF-11 was about wording, and the wording is now accurate.

---

## 4. 36-run coverage matrix

Every run passed all 24 automated checks: selector-enabled state, disposition, badge, pre-replay record, replay (4 match flags and inputs), and export (name pattern, version, `generated_at` window, scenario, prediction, disposition, comparison, 4 cards, commitments, rationale/sources/question/evidence, event log = display, replay = display, contract hash = independently derived, source hash = live `.docx` hash, attribution, restrictions, no alert).

| Run | Scenario | Prediction | Encoded assessment | Comparison | Replay | Event-log SHA (12) |
|---|---|---|---|---|---|---|
| M01 | 01 condition-change | CONTINUE | BLOCK + REAUTHORIZE | DIFFERENT | CONSISTENT | c288734bf1c2 |
| M02 | 01 | BLOCK | B+R | PARTIAL | CONSISTENT | e39a944d5de0 |
| M03 | 01 | BLOCK + REAUTHORIZE | B+R | **EXACT** | CONSISTENT | 6abcfb92670c |
| M04 | 01 | ESCALATE | B+R | DIFFERENT | CONSISTENT | ede1daecee6f |
| M05 | 01 | ROLLBACK / COMPENSATE | B+R | DIFFERENT | CONSISTENT | 6c7f1b65e9cf |
| M06 | 01 | INSUFFICIENT SPEC | B+R | DIFFERENT | CONSISTENT | a9491779c9c5 |
| M07 | 02 evidence-change | CONTINUE | BLOCK | DIFFERENT | CONSISTENT | 4c33b1eafddd |
| M08 | 02 | BLOCK | BLOCK | **EXACT** | CONSISTENT | 7d1cd1e309a7 |
| M09 | 02 | B+R | BLOCK | PARTIAL | CONSISTENT | 0c9762e12708 |
| M10 | 02 | ESCALATE | BLOCK | PARTIAL | CONSISTENT | e7bdb91b3106 |
| M11 | 02 | RB/C | BLOCK | DIFFERENT | CONSISTENT | e977063d4d7f |
| M12 | 02 | INSUF | BLOCK | DIFFERENT | CONSISTENT | cda6429a42fe |
| M13 | 03 authorization-expiry | CONTINUE | B+R | DIFFERENT | CONSISTENT | ddd41d738e4b |
| M14 | 03 | BLOCK | B+R | PARTIAL | CONSISTENT | 78beccc75177 |
| M15 | 03 | B+R | B+R | **EXACT** | CONSISTENT | 62ae207c12b1 |
| M16 | 03 | ESCALATE | B+R | DIFFERENT | CONSISTENT | 15178ae90689 |
| M17 | 03 | RB/C | B+R | DIFFERENT | CONSISTENT | 969b47f167d8 |
| M18 | 03 | INSUF | B+R | DIFFERENT | CONSISTENT | 73a8b6c12940 |
| M19 | 04 learning-authority | CONTINUE | B+R | PARTIAL | CONSISTENT | ecb668836882 |
| M20 | 04 | BLOCK | B+R | PARTIAL | CONSISTENT | e247bd8afefb |
| M21 | 04 | B+R | B+R | **EXACT** | CONSISTENT | 085c376fec08 |
| M22 | 04 | ESCALATE | B+R | DIFFERENT | CONSISTENT | f1b383ff5432 |
| M23 | 04 | RB/C | B+R | DIFFERENT | CONSISTENT | 1f81956e14ea |
| M24 | 04 | INSUF | B+R | DIFFERENT | CONSISTENT | 48e12b8edc7f |
| M25 | 05 conflicting-authorities | CONTINUE | INSUF | DIFFERENT | CONSISTENT | a6d91439d15b |
| M26 | 05 | BLOCK | INSUF | PARTIAL | CONSISTENT | ae72e298ad70 |
| M27 | 05 | B+R | INSUF | DIFFERENT | CONSISTENT | 94b3df93277a |
| M28 | 05 | ESCALATE | INSUF | PARTIAL | CONSISTENT | 0487cd4e4a81 |
| M29 | 05 | RB/C | INSUF | DIFFERENT | CONSISTENT | 4f60d2c65c0f |
| M30 | 05 | INSUF | INSUF | **EXACT** | CONSISTENT | 95fa5027881a |
| M31 | 06 mid-execution-revocation | CONTINUE | INSUF | DIFFERENT | CONSISTENT | 479d3b526666 |
| M32 | 06 | BLOCK | INSUF | PARTIAL | CONSISTENT | 5931ddbd85c0 |
| M33 | 06 | B+R | INSUF | DIFFERENT | CONSISTENT | d2d7eaba1076 |
| M34 | 06 | ESCALATE | INSUF | PARTIAL | CONSISTENT | 6c968c10696f |
| M35 | 06 | RB/C | INSUF | PARTIAL | CONSISTENT | 0eeb8ee59006 |
| M36 | 06 | INSUF | INSUF | **EXACT** | CONSISTENT | a2d4467f6e3d |

**Totals:** EXACT 6 · PARTIAL 11 · DIFFERENT 19. There were 36 distinct export filenames, e.g. `janus-harness-learning-authority-continue-2026-09-24T04-00-56-775Z-v0.2.json`. Each export has 31 top-level keys, and each event log has 6 events on 17 lines. Console errors during the matrix: 0.

---

## 5. Scenario-by-scenario results

The encoded assessment was identical across all 6 predictions for every scenario (1 distinct content hash per scenario). All six headline dispositions are unchanged from v0.1.

| # | Assessment | Compatible (PARTIAL) | Contract SHA (12) | Key v0.2 change observed |
|---|---|---|---|---|
| 01 | BLOCK + REAUTHORIZE | BLOCK | db90e8442929 | Rationale now says "reauthorize" is harness shorthand; OPEN item for the reauthorization protocol |
| 02 | BLOCK | B+R, ESCALATE | c47f0f2d44cf | §28 commitment is **EXTENDED / BY ANALOGY**; B+R and ESCALATE no longer "Differ" |
| 03 | BLOCK + REAUTHORIZE | BLOCK | a1227aa47e78 | Scope-of-validity marked analogy; §39 now cited; "stipulated bound" made explicit |
| 04 | BLOCK + REAUTHORIZE | BLOCK, CONTINUE | 1f14cd543a27 | Execution card: "Continue only within the already authorized scope. Block the out-of-scope use…"; OPEN item added |
| 05 | INSUFFICIENT SPECIFICATION | BLOCK, ESCALATE | f199cd631c9c | Separates unspecified resolution from "do not silently select O1"; §32/§38/§33 cited; no precedence invented |
| 06 | INSUFFICIENT SPECIFICATION | BLOCK, ESCALATE, RB/C | 9b2de452a1c0 | Revocation commitment downgraded to REASONABLE INFERENCE |

Full displayed text per scenario (changed / valid / invalid / execution / commitments / rationale / sources / open question / evidence required) is recorded for every run in the raw JSON.

---

## 6. DEF-01 through DEF-12 regression results

| ID | Prev. sev. | v0.1 issue | v0.2 result | Status |
|---|---|---|---|---|
| DEF-01 | High | Stale result/replay/export after selector change | Tested with 6 variants, both sequences and a manual mouse test (S05 run → dropdown to S06 → click Export). In every case the result was cleared, a stale notice shown, `lastRun=null`, Replay/Export disabled, and direct `replayLastRun()`/`exportEvidence()` calls did nothing: **0 stale downloads**. | **FIXED** (UI-reachable). Residual race: NEW-01 |
| DEF-02 | Medium | Replay cannot fail; "recompute" overclaim | Wording is now "re-derivation from the static authored scenario contract… not an independent JANUS runtime execution". Contract-hash and disposition tampering produce `REPLAY DIVERGENCE` (T1, T2, T4, T8, T9). Normal replay: 36/36 plus 5× repeat, all CONSISTENT. **But** the source-hash leg is tautological (T7, T12), and prediction/comparison/text tampering is not detected (T3, T5, T6). | **PARTIALLY FIXED** |
| DEF-03 | Medium | Export lacks provenance | Now present: `generated_at`, `version`, `build_id`, `source_document{title,url,sha256}`, `contract_sha256`, summary, perturbation, `event_log`, `replay`, both attributions, restrictions, `evidence_required`. Filenames carry scenario, prediction and ms timestamp (36/36 unique). The two recommended assertions exist and refused T1, T3 and T10. **Missing:** a harness **commit SHA** (`build_id` is a fixed string); an absolute source URL; a computed source hash; any refusal or integrity flag on a divergent or consistently-tampered record (NEW-03). `generated_at` is the Run time, not the Export time. | **PARTIALLY FIXED** |
| DEF-04 | Medium | Undefined labels; exact-string matching | Glossary for all six labels in the UI and README (B+R flagged as harness shorthand). EXACT / PARTIAL / DIFFERENT model. S04 states that in-scope S1 work may continue and only the out-of-scope expansion is blocked. S02 B+R and ESCALATE are now PARTIAL. | **FIXED**. Uneven compatibility sets: NEW-05 |
| DEF-05 | Medium | S05 fail-closed inconsistency | The execution card separates (A) "resolution mechanism is insufficiently specified" from (B) "do not support silently selecting O1 and executing while O2's prohibition remains unresolved". No precedence rule is invented. BLOCK and ESCALATE are PARTIAL. | **FIXED**. Status strength: see DEF-10 |
| DEF-06 | Medium | "Evaluated" / "invariant checks" overclaim | Now "Encoded orientation-level assessment" and "Encoded source commitments". An interpretation note says the result is authored, not measured. EVENT 004 reads "…assessment loaded". No "invariant", "recomputed" or "validated" claims remain. Residual: the hero still says "It evaluates authored architectural interpretations", and the export has `evaluation_mode`. Both are scoped to *authored* interpretations and are acceptable. | **FIXED** (hash/consistency overclaims: NEW-02/03) |
| DEF-07 | Low | Reset anchors to B+R | Load and Reset both show "— choose a prediction —" with Run disabled; a forced `runChallenge()` is refused ("Choose a reviewer prediction before running."). Reset keeps the scenario, which is acceptable. | **FIXED** |
| DEF-08 | Low | Q7 evidence field missing | UI section "Evidence required to reconstruct the path"; `evidence_required` in export; README item 9. | **FIXED** |
| DEF-09 | Low | Pre-replay mislabeled | The pre-replay record is `status: "NOT YET REPLAYED"`, `encoded_disposition`, with no determinism claim. The post-replay record uses `original_disposition` / `rederived_disposition`. | **FIXED** |
| DEF-10 | Low | Support statuses too strong | EXTENDED / BY ANALOGY now marks §28 in S02 and S05 and memory scope-of-validity in S03. §28 is no longer presented as direct support for authority conflict. REASONABLE INFERENCE is used in S06. **Still too strong:** S02 #2, S03 #1 and S05 #2 are labelled SUPPORTED but are inferences (§8). The statuses are undefined in the UI and README (NEW-06). | **PARTIALLY FIXED** |
| DEF-11 | Obs. | "Original… published unchanged" | Replaced by "the repository copy used for this review. Recorded SHA-256…". README: "does not claim that document metadata proves original authorship or chain-of-custody". | **FIXED** |
| DEF-12 | Obs. | Invalid scenario TypeError | An injected `bogus-scenario` option and a non-existent value (selectedIndex −1) both give "Invalid scenario selection." with Run disabled; forced Run → "Execution refused."; Replay/Export unavailable; 0 exceptions. | **FIXED** |

---

## 7. Determinism results

Each scenario/prediction pair (01 CONTINUE, 02 BLOCK, 03 ESCALATE, 04 B+R, 05 INSUF, 06 RB/C) was run 3× with Reset, then once after a full reload. I compared the disposition, badge, rationale, commitments, cards/sources/question/evidence, event log, pre-replay record, replay record, export key set, export body without `generated_at`, contract hash and source hash.

**Result: 24/24 identical, 0 divergences.** Event-log hashes also equal the matrix values (M01, M08, M16, M21, M30, M35). The only varying fields are `generated_at` and the filename timestamp, which is intended (DEF-03).

---

## 8. State-isolation results

| Seq. | Step | Screen | Replay / Export | Export content |
|---|---|---|---|---|
| A | S01 Run (BLOCK) | B+R · PARTIAL | on / on | condition-change/BLOCK |
| A | Switch S06, no run | hidden + "Scenario changed…" | **off / off** | 0 downloads on click or direct call |
| A | S06 Run | INSUF · PARTIAL | on / on | mid-execution-revocation/BLOCK |
| A | S03 Run | B+R · PARTIAL | on / on | authorization-expiry/BLOCK |
| A | Reset | hidden; prediction placeholder | off / off | — |
| A | S02 Run (ESCALATE) | BLOCK · PARTIAL | on / on | evidence-change/ESCALATE |
| B | S05 Run (ESCALATE) | INSUF · PARTIAL | on / on | conflicting-authorities/ESCALATE |
| B | Prediction → CONTINUE, no run | hidden + "Prediction changed…" | **off / off** | 0 downloads |
| B | Switch S04, no run | hidden + "Scenario changed…" | **off / off** | 0 downloads |
| B | S04 Run | B+R · PARTIAL | on / on | learning-authority/CONTINUE |
| B | Reset | hidden | off / off | — |
| B | S06 Run (BLOCK) | INSUF · PARTIAL | on / on | mid-execution-revocation/BLOCK |

**PASS.** No stale result or evidence action survived any selector change made through the UI.

**Race tests (adversarial, script-driven, same JavaScript task).** All 4 failed:

- **R1:** Run then switch scenario. The S01 result showed under the S06 selector, Export was enabled, and it exported a `condition-change` file.
- **R2:** Run then change prediction. Same failure mode.
- **R3:** Replay then change prediction. Unhandled `TypeError` (property of null).
- **R4:** Run then Reset. The result stayed visible with the placeholder prediction, and Export was enabled.

Logged as NEW-01.

---

## 9. Replay results

- **Primary:** 36/36 `REPLAY CONSISTENT`. In every replay, inputs equalled the run's scenario/prediction, `original_contract_sha256 = current_contract_sha256 =` the independently derived value, and disposition, contract and source all matched.
- **Before Run / after Reset / after selector change:** Replay was disabled, and direct calls did nothing. Repeated replay (5×) gave the same result each time.

**Tamper tests (in-memory):**

| ID | Tamper | Replay | Export |
|---|---|---|---|
| T1 | stored disposition only | **DIVERGENCE** | **Refused** (label inconsistent) |
| T2 | stored disposition + label (consistent) | **DIVERGENCE** | Exported (before replay: "NOT PERFORMED"; after: carries the divergence) |
| T3 | stored comparison → EXACT | not detected | **Refused** |
| T4 | stored contract hash | **DIVERGENCE** | Exported |
| T5 | stored rationale / execution text | not detected | Exported with tampered text |
| T6 | stored prediction + label + comparison (consistent) | not detected | Exported; file says `block_reauthorize`/EXACT while its own event log says BLOCK |
| T7 | `lastRun.source_document.sha256` | **not detected**: same object as `SOURCE_DOCUMENT` | — |
| T8 | contract rationale text | **DIVERGENCE** (contract) | Exported |
| T9 | contract disposition | **DIVERGENCE** | Exported |
| T10 | contract compatible set | — | **Refused** |
| T11 | contract removed | **REPLAY REFUSED** | Silent no-op |
| T12 | `SOURCE_DOCUMENT.sha256` before Run | CONSISTENT, `source_match: true` | Exported with the wrong hash |

Replay now does real work on the **contract hash** and **disposition** (5/13 tamper cases diverge, plus 1 refused). The **source-document leg cannot fail**.

---

## 10. Export / provenance results

| Field | Present | Note |
|---|---|---|
| `generated_at` | ✔ | Run time, not Export time; the filename uses Export time |
| version / `build_id` | ✔ | `build_id` is a constant string, **not a commit** |
| harness commit | **✘** | |
| source URL | ✔ | relative `docs/…docx` |
| source SHA-256 | ✔ | a hard-coded constant, never computed from bytes (NEW-02). It is correct for the live file (verified independently) |
| contract SHA-256 | ✔ | equal to the independent derivation, 36/36 |
| summary, perturbation, event log, replay | ✔ | the event log matched the display 36/36 |
| prediction, disposition, comparison (+labels) | ✔ | |
| evidence_required | ✔ | |
| support classifications | ✔ | status per commitment |
| attributions, restrictions | ✔ | Eryk Dubiel (JANUS); Kelly Newsome / Stratos Engine (harness); 6 restrictions |
| compatible predictions | ✘ | only implicit inside the contract hash |

- **Uniqueness:** filenames include scenario, prediction and a millisecond timestamp. 36/36 were distinct.
- **Consistency checks:** they refuse single-field contradictions (T1, T3, T10). They do not catch coordinated tampering or divergent replays (NEW-03).
- **Prototype-key predictions** (`constructor`, `toString`, `__proto__`, via DOM injection) were accepted and exported with function text in the event log (NEW-04).

---

## 11. Source-conformance analysis

Categories are applied to the Orientation Edition text only. Term counts come from the pandoc text: "expir" 0, "revok/revoc" 0, "rollback/roll back" 0, "compensat" 0, "precedence" 0, "hierarchy" 0, "jurisdiction" 0, "reauthor" 0, "in-flight" 0, "fail-closed" 1 (§32), "escalat" 2 (§33, appendix).

| # | Overall | Detail |
|---|---|---|
| 01 | **REASONABLE INFERENCE** (core BLOCK directly supported) | "Do not proceed on A1 alone" follows from §19 ("Authorization is a separate fact, with its own owner, history and conditions") and §32 fail-closed. "Reauthorize" is correctly flagged as harness shorthand. Materiality is stipulated. |
| 02 | **REASONABLE INFERENCE** | §06 separation and §29/§38 support not proceeding on a changed basis. The authorization↔evidence dependency is unstated (correctly OPEN). §28 is now correctly EXTENDED. Commitment #2 ("authorization history and current epistemic justification are different facts") is labelled SUPPORTED but is an inference from §06/§27. |
| 03 | **REASONABLE INFERENCE** (on a stipulated bound) | The source never mentions expiry. §39 "Conditions can change, and trust must have a context" is a better citation, and it is now used. Commitment #1 (SUPPORTED) is an inference. Commitment #2 cites §26 memory scope-of-validity, but §26 is not in S03's source list. |
| 04 | **DIRECTLY SUPPORTED** | §22 "must not constitute a standalone right to expand its permissions"; §24 "A new ability should not automatically receive a new level of authority… the governance process decides"; §38 "An improved model is not, in itself, consent to greater power". The in-scope CONTINUE clarification is consistent with the source. |
| 05 | **INSUF: DIRECTLY SUPPORTED by absence; constraint: REASONABLE INFERENCE** | No precedence, hierarchy or jurisdiction mechanism exists in the source, so INSUF avoids invention. The "no silent execution on O1" constraint draws on §32 (which applies "when a condition is not met", and whether O2's prohibition is an unmet condition is itself the unspecified question), §38 ("A lack of grounds should not be turned into apparent certainty") and §33 (human "escalation point"). That is a sound inference, but the harness labels it SUPPORTED. |
| 06 | **REASONABLE INFERENCE** (strong) | §20 execution is an accountable boundary event; §31 trace "who had the authority and what actually happened"; §01 "not an implementation specification". Refusing to pick stop, complete or rollback is correct. |

**Contradicted by source: 0. Insufficiently supported: 0.**

**Precision vs v0.1:** improved.

- The §28 data→authority extension is now labelled as analogy.
- S03's memory analogy is labelled.
- S06 revocation is downgraded to REASONABLE INFERENCE.
- S04 gained an OPEN item.
- Three SUPPORTED labels remain one notch too strong.

*Outside reasoning (not JANUS):* treating mid-execution authority loss by reversibility or interruptibility class (S06 evidence-required) is conventional safety-engineering practice, not source content. The harness presents it only as evidence to record, which is appropriate.

---

## 12. New defects

**NEW-01 · Low · Async race leaves stale, exportable evidence**

- **Repro:** `runBtn.click()` followed, in the same task, by a scenario/prediction change or Reset.
- **Expected:** the later action wins.
- **Actual:** `runChallenge()` writes `lastRun` and the DOM after `await` without re-checking. The S01 result shows under S06 and exports. The replay variant throws an unhandled `TypeError`.
- **Evidence:** R1–R4.
- **Impact:** not reachable by a person (the digest resolves in under 1 ms), but it defeats the "never export under mismatched selectors" guarantee.
- **Fix:** add a run-generation token and discard stale completions; null-check `lastRun` after the await in replay.

**NEW-02 · Medium · The source-document SHA-256 "check" is tautological**

- **Repro:** T7 / T12.
- **Expected:** the recorded hash is compared against a hash computed from the served `.docx`.
- **Actual:** `lastRun.source_document` is the same object as `SOURCE_DOCUMENT`, so `source_match` is always `true`. The document is never fetched or hashed. A wrong constant exports with `source_match: true`.
- **Impact:** the UI and README say replay "compares… source-document SHA-256". This is the same overclaim class as v0.1 DEF-02/DEF-06.
- **Fix:** hash the fetched `.docx` with `crypto.subtle` at Run and Replay and record computed vs expected, or reword to "records the published hash; not recomputed". Deep-copy the object either way.

**NEW-03 · Medium · Export consistency checks are shallow; divergent or tampered records export**

- **Repro:** T2, T4, T5, T6, T8, T9.
- **Expected:** a refusal, or an explicit integrity flag.
- **Actual:** only the label and comparison are checked. A replay DIVERGENCE does not block export. The T6 file names and records `block_reauthorize`/EXACT while its own `event_log` says BLOCK.
- **Impact:** README's "Export performs internal consistency checks" overstates what the code does. (Exports are unsigned JSON, so the practical risk is limited to credibility.)
- **Fix:** at export, recompute the contract hash, cross-check the event-log lines, and refuse or flag `integrity: FAILED` on divergence. List the exact checks in the README.

**NEW-04 · Low · Prototype-chain lookup in prediction validation**

- **Repro:** inject `<option value="constructor">` into the prediction select and Run.
- **Expected:** refused, as `FOO` is.
- **Actual:** the run proceeds, EVENT 002 reads `function Object() { [native code] }`, and the export omits `reviewer_prediction_label`.
- **Fix:** `Object.hasOwn(labels, p)` or a `Set`.

**NEW-05 · Low · Compatibility sets are undisclosed and uneven**

- **Repro:** M31, M22, M04/M16, M27.
- **Actual:**
  - **S06 CONTINUE → DIFFERENT**, although the S06 execution card lists "safely complete" as a possibility the source leaves open (BLOCK and ROLLBACK are PARTIAL).
  - **S04 ESCALATE → DIFFERENT**, although §24 places the decision with "the governance process".
  - **S01/S03 ESCALATE → DIFFERENT**, although S01 requires "reevaluation under the applicable governance process".
  - The sets appear nowhere in the UI, README or export.
- **Impact:** comparison labels can still reflect the author's convention rather than the source (a residue of DEF-04).
- **Fix:** publish each set with a one-line reason, revisit these four cells, and export `compatible_predictions`.

**NEW-06 · Low · Support-status vocabulary undefined and inconsistently styled**

- **Actual:**
  - SUPPORTED / REASONABLE INFERENCE / EXTENDED / OPEN are never defined.
  - REASONABLE INFERENCE shares the `extended` CSS class (same colour as analogy; confirmed on screen).
  - "SUPPORTED" is not qualified as *directly* supported.
  - The S03 §26 reference is missing from its source list.
- **Fix:** add a status glossary, give REASONABLE INFERENCE a distinct style, rename SUPPORTED to DIRECTLY SUPPORTED where a quote exists, and add §26 to S03.

**NEW-07 · Observation · Polish**

- (a) The first scenario change on a fresh page says a "previous result… was invalidated" when none existed.
- (b) Export after a missing contract silently does nothing.
- (c) The hidden result DOM keeps old values.
- (d) `generated_at` is Run time while the filename is Export time. Add `exported_at`.

---

## 13. Remaining assumptions / overreach

1. **Materiality is stipulated** (S01 "material condition", S02 "materially contradicts"). The source has no materiality test.
2. **Authorization validity bounds** (S03) are stipulated. They are now openly labelled as such.
3. **"Reauthorize"** is a harness term (0 occurrences in the source). This is disclosed. In S04 it is semantically odd, since beyond-S1 authority never existed to be *re*-authorized.
4. **The disposition taxonomy and compatibility sets** are the harness's own. The taxonomy is disclosed; the sets are not.
5. **Three SUPPORTED commitments** are inferences (S02 #2, S03 #1, S05 #2).
6. **Provenance claims about hashing** exceed the implementation (NEW-02, NEW-03).
7. **Page citations were dropped in favour of § numbers.** This is an improvement, since section numbers are stable.

---

## 14. JANUS questions still exposed

These are not answered here on JANUS's behalf.

1. What event invalidates an authorization when one of its conditions changes, and who determines that? (S01)
2. Is authorization formally dependent on the evidence behind the decision it authorizes? (S02)
3. How is authorization lifetime represented? (S03)
4. What evidence and governance event are required before expanded capability receives expanded authority, and who is the independent verifier in §24? (S04)
5. How are two simultaneously applicable, conflicting authority owners resolved? (S05)
6. How are in-flight actions classified when authority disappears: stop, safe completion, rollback, compensation or escalation? (S06)
7. *(Cross-cutting)* Does §32's "when a condition is not met" cover contested conditions, i.e. an unresolved conflict, or only conditions known to be false?

---

## 15. v0.1 → v0.2 comparison

| Dimension | v0.1 | v0.2 |
|---|---|---|
| Stale evidence after selector change | reproducible (High) | fixed for all UI paths; script-only race remains |
| Replay | could not fail | contract/disposition divergence works; source leg is a no-op |
| Export provenance | none | 31 fields, contract hash, event log, replay; no commit SHA |
| Comparison model | exact-string match/differ | glossary + EXACT/PARTIAL/DIFFERENT (6/11/19) |
| S04 / S05 nuance | missing | explicit in the execution cards |
| Language | "evaluated", "invariant checks", "recomputed" | "encoded", "authored", "re-derivation" |
| Support statuses | SUPPORTED/OPEN | + EXTENDED, REASONABLE INFERENCE (undefined; 3 still too strong) |
| Reset anchoring | pre-selected B+R | neutral placeholder; Run gated |
| Invalid scenario | TypeError | explicit refusal |
| Determinism | 24/24 identical | 24/24 identical (timestamp excluded) |
| Headline dispositions | 01 B+R, 02 BLOCK, 03 B+R, 04 B+R, 05 INSUF, 06 INSUF | unchanged |

---

## 16. Final accounting

| Item | Count |
|---|---|
| Primary runs / replays / exports | 36 / 36 / 36 |
| Automated checks / failures | 864 / 0 |
| Determinism repeat runs / divergences | 24 / 0 |
| State-isolation sequences / UI-level failures | 2 / 0 |
| Race tests / failures | 4 / 4 (NEW-01) |
| Tamper tests / replay divergence / replay refused / export refused | 13 / 5 / 1 / 3 |
| v0.1 defects: FIXED / PARTIAL / NOT FIXED / REGRESSED | 9 / 3 / 0 / 0 |
| New defects: High / Medium / Low / Observation | 0 / 2 / 4 / 1 (total 7) |
| Scenarios contradicted by source | 0 |

### Conclusions

**A. Did v0.2 fix all 12 known findings?** No. **9 are FIXED** (DEF-01, 04, 05, 06, 07, 08, 09, 11, 12) and **3 are PARTIALLY FIXED**:

- **DEF-02:** the source-hash leg of replay cannot fail.
- **DEF-03:** exports have no commit SHA and only shallow integrity checks.
- **DEF-10:** three commitments are still labelled SUPPORTED although they are inferences.

None regressed. The High defect is closed for every path a person can reach.

**B. Were new defects introduced?** Yes, 7:

- **2 Medium:** NEW-02 (tautological source-hash check) and NEW-03 (shallow export integrity). Both are provenance claims that go beyond what the code does.
- **4 Low:** NEW-01 race, NEW-04 prototype keys, NEW-05 compatibility sets, NEW-06 status vocabulary.
- **1 Observation:** NEW-07.

None affects the architectural content of the six scenarios.

**C. Ready to share with Eryk for architectural challenge?** **Yes, conditionally.** The scenario content, dispositions, INSUF handling and source citations are sound, conservative and now honestly labelled. No scenario is contradicted by the Orientation Edition, and the questions exposed are real JANUS questions. The conditions concern the harness's claims about its *own* evidence integrity. An architect who reads "compares source-document SHA-256" and then finds a constant compared to itself will reasonably discount the rest.

**D. What should change before sharing.** These are small, bounded changes:

1. **NEW-02.** Compute the `.docx` SHA-256 from fetched bytes at Run and Replay, or reword the UI and README to "records the published hash (not recomputed)". Deep-copy `SOURCE_DOCUMENT`.
2. **DEF-03.** Add a `harness_commit` field (the full SHA) and an absolute source URL to exports.
3. **NEW-03.** Refuse or flag export after a replay divergence, recompute the contract hash at export, and make the README list exactly which checks run.
4. **DEF-10 / NEW-06.** Relabel S02 #2, S03 #1 and S05 #2 as REASONABLE INFERENCE. Add a status glossary with a distinct REASONABLE INFERENCE style. Add §26 to S03's sources.
5. **NEW-05.** Publish the compatibility sets, and reconsider S06 CONTINUE and S01/S03/S04 ESCALATE.
6. **Optional:** NEW-01 run token, NEW-04 `Object.hasOwn`, NEW-07 polish.

---

## 17. Raw results appendix

`JANUS_Harness_v0.2_raw_results.json` contains:

- tested commit, URL, source hash and v0.1 baseline;
- per-file deployment verification;
- scenario contract hashes and compatibility sets;
- all 36 primary runs with full displayed text, event-log hash and variable lines, pre-replay record, replay result, export filename and hashes, and 24 check results each;
- determinism, state-isolation and race data;
- the 13 tamper tests, prototype-key and invalid-scenario tests;
- the export field audit;
- DEF-01…12 status with evidence, and NEW-01…07;
- source-conformance classifications and final counts.

**Reproduction (key items):**

1. Load the live site at `ba7b6e5`.
2. **DEF-01:** run any scenario, then change either dropdown. Replay/Export disable and the result clears.
3. **NEW-02:** in the console, run `lastRun.source_document === SOURCE_DOCUMENT` → `true`. Then set `SOURCE_DOCUMENT.sha256='a'.repeat(64)`, Run, Replay: the result is `source_match: true`.
4. **NEW-03:** Run, then set `lastRun.orientation_level_disposition='CONTINUE'; lastRun.orientation_level_disposition_label='CONTINUE'`, then Export. The file is produced.
5. **NEW-05:** Run S06 with CONTINUE → DIFFERENT, while the S06 card lists "safely complete" as unspecified.

Sample export (S04 / CONTINUE, after replay; hashes truncated): 31 keys:

`harness, version, build_id, generated_at, source_document{title,url,sha256}, contract_sha256 (1f14cd543a27…), evaluation_mode, restrictions[6], harness_attribution, janus_attribution, scenario_id, scenario_name, scenario_summary, perturbation, reviewer_prediction (CONTINUE), reviewer_prediction_label, orientation_level_disposition (BLOCK_REAUTHORIZE), orientation_level_disposition_label, prediction_comparison (PARTIAL), prediction_comparison_label, changed, remains_valid, invalid_or_uncertain, execution ("Continue only within the already authorized scope. Block the out-of-scope use unless a separate governance process grants additional authority."), source_commitments[3], rationale, open_question, evidence_required, sources[3], event_log[17], replay{…REPLAY CONSISTENT…}`
