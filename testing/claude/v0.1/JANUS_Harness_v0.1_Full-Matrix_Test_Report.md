# JANUS Governance Challenge Harness v0.1
## Independent Full-Matrix Test Report

---

## 1. Executive summary

**What was executed.** All 36 primary scenario × prediction permutations were run against the **live public harness** in a real Chrome browser (Chrome 153, Windows), not reconstructed from source. Each run did the same thing: select scenario → select prediction → **Run challenge** → capture every displayed field → **Replay last run** → capture the replay record → **Export evidence** → capture the exported JSON. Most runs drove the page's own controls and event handlers from JavaScript on the page. One run was done by hand with real mouse clicks, with screenshots, to confirm the controls behave the same way. Exports were captured by intercepting the page's own `Blob`/download call, so the real `exportEvidence()` code path ran but nothing was written to disk (see §2).

| Question | Result |
|---|---|
| All 36 permutations executed? | **Yes**: 36/36, each with replay and export |
| All six scenarios reachable? | **Yes**: all six are in the dropdown, in the stated order, and all rendered |
| All six predictions available? | **Yes**: exactly the six listed values |
| Replay deterministic? | **Yes**: 60/60 normal replays returned `replay_match: true` / `REPLAY CONSISTENT`. **Caveat (DEF-02):** in normal operation replay cannot fail. It looks up the same static constant again, so it adds very little evidence. |
| Prediction separate from disposition? | **Yes**: for each scenario, all six predictions produced byte-identical disposition, cards, invariants, rationale, sources and open question. Only the badge and the EVENT 002/005 log lines changed. |
| Exported evidence matched displayed state? | **Yes, when the reviewer did not touch the selectors after a run**: 60/60 exports matched the screen field for field. **No, after a selector change (DEF-01):** Export and Replay silently act on the *previous* run, while the selectors and scenario summary show a different scenario or prediction. |
| Source links and attribution work? | **Yes**: the source `.docx` link returns HTTP 200, its SHA-256 matches the README, and the Eryk Dubiel attribution appears in the footer, the README and every export. Provenance caveat in DEF-11. |
| Deployed code = repository? | **Yes**: SHA-256 of the served `app.js`, `index.html`, `styles.css`, `README.md`, `VERSION.txt`, the `.docx` and the cover image all match commit `f8b2eb6` |
| Encoded dispositions match the expected list? | **Yes**: 01 B+R, 02 BLOCK, 03 B+R, 04 B+R, 05 INSUF, 06 INSUF |
| Material defects found? | **Yes**: no Critical. **1 High** (stale state leads to misattributed evidence), **5 Medium**, **4 Low**, **2 Observations**. |

**Bottom line.** The harness is deterministic and internally consistent as a *static lookup table*, and prediction never leaks into the disposition. Its main functional defect is stale UI state that can produce misattributed evidence. Its main conceptual weaknesses are: (a) "evaluation", "invariant checks" and "replay" wording that implies computation which does not happen; (b) disposition labels that are never defined, which makes match/differ partly arbitrary; and (c) uneven use of the fail-closed principle (§32) across scenarios 01/03 and 05. On source conformance, no scenario is contradicted by the Orientation Edition. Scenario 04 is directly supported. Scenarios 01, 02, 03 and 06 are reasonable inferences. Scenario 05 is a reasonable inference whose disposition leaves out a partial answer the source does support.

---

## 2. Test environment

| Item | Value |
|---|---|
| Date/time tested | 2026-09-24 03:20–03:31 UTC (2026-09-23 23:20–23:31 EDT) |
| Browser | Chrome 153.0.0.0 (Windows 10/11 x64), Claude in Chrome extension |
| Public harness | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ |
| Repository | https://github.com/Newsomek/JANUS-Governance-Challenge-Harness |
| Source document | https://github.com/Newsomek/JANUS-Governance-Challenge-Harness/blob/main/docs/JANUS_Orientation_Edition_2026_EN.docx |
| Version shown | "VERSION 0.1" (hero eyebrow), "v0.1" (title/footer), `"version": "0.1"` (export), `Version: 0.1` (VERSION.txt) |
| Git commit | `f8b2eb6284575d1670c748bee1868835bf7242eb` ("Publish original JANUS orientation source", 2026-09-23 23:20:53 −0400). This was remote HEAD at test time; 3 commits in total. |
| Deployed-vs-repo check | Each served file fetched with `cache:no-store` and hashed in the browser: all 7 **MATCH** the commit |
| Source doc | 50,354 bytes; SHA-256 `21766f5d…551fe4` (matches README; identical via Pages, raw.githubusercontent and clone) |
| Page rendering for citations | `.docx` → PDF with LibreOffice: 46 pages; 45 explicit `pageBreakBefore` breaks; section *N* starts on page *N+1* |

**Method notes:**

- **Pages-only driving.** The cloud sandbox's proxy blocks `github.io` (HTTP 403), so all execution happened in the user-side Chrome browser.
- **Export capture.** `URL.createObjectURL` and `HTMLAnchorElement.prototype.click` were wrapped *in the page session only* so the exported Blob could be read without saving a file. The harness's own `exportEvidence()` still ran unmodified.
- **Independent cross-check.** A separate Node script rebuilt, from `app.js` at `f8b2eb6`, the expected export JSON and event-log/replay text for all 36 permutations. All 36 exported files and all 36 event-log + pre-replay records observed in the browser matched this derivation **byte for byte** (SHA-256).
- **Tamper tests.** The tests in §6 changed in-memory state in one browser tab and were then discarded by reloading. Nothing in the repository or deployment was changed.

---

## 3. Part 1: pre-test inspection

| Required element | Present? | Where / note |
|---|---|---|
| Six scenarios, in the stated order | Yes | `#scenarioSelect` values: `condition-change`, `evidence-change`, `authorization-expiry`, `learning-authority`, `conflicting-authorities`, `mid-execution-revocation` |
| Six predictions | Yes | CONTINUE, BLOCK, BLOCK + REAUTHORIZE, ESCALATE, ROLLBACK / COMPENSATE, INSUFFICIENT SPECIFICATION |
| Scenario selection | Yes | |
| Reviewer prediction selection | Yes | Default on page load = **CONTINUE**; default after Reset = **BLOCK + REAUTHORIZE** (DEF-07) |
| Run challenge | Yes | |
| Replay last run | Yes | Disabled on load and after Reset |
| Export evidence | Yes | Disabled on load and after Reset |
| Reset | Yes | Does not reset the scenario selector |
| Event log | Yes | 6 events, 17 lines |
| Replay record | Yes | |
| Source basis | Yes | 3 citations per scenario |
| Invariant checks | Yes | 3 per scenario, status SUPPORTED or OPEN (hard-coded, DEF-06) |
| Open question | Yes | |
| JANUS attribution | Yes | Footer, README, export `janus_attribution` |
| Source-document link | Yes | Footer, relative `docs/…docx`, HTTP 200 |
| Restrictions / non-claims | Yes | Hero "Important boundary", footer restriction, "interpretation-note", README, export `restrictions` |
| README's 7 per-challenge questions | **Partial** | Q7, "What evidence would be required to reconstruct the decision path?", has no corresponding UI or export field (DEF-08) |

---

## 4. Part 2: coverage matrix (36 primary runs)

*Replay Consistent* means `replay_match: true` and result `REPLAY CONSISTENT`, with scenario ID and prediction in the replay inputs equal to the run inputs. *Export Checked* gives the first 12 hex digits of the SHA-256 of the exported JSON; each equals the independently derived value.

| Run ID | Scenario | Reviewer Prediction | Orientation-Level Disposition | Prediction Match/Differ | Replay Consistent? | Export Checked? | UI/Logic Error? | Notes |
|---|---|---|---|---|---|---|---|---|
| M01 | 01 condition-change | CONTINUE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`416566b3d6c1`) | None | display=export=independent derivation |
| M02 | 01 condition-change | BLOCK | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`4a6fe189c6a2`) | None | display=export=independent derivation |
| M03 | 01 condition-change | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | **Match** | Yes (match=true) | Yes (`f8b6e884781b`) | None | display=export=independent derivation |
| M04 | 01 condition-change | ESCALATE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`04d23b25afed`) | None | display=export=independent derivation |
| M05 | 01 condition-change | ROLLBACK / COMPENSATE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`315a30c64c71`) | None | display=export=independent derivation |
| M06 | 01 condition-change | INSUFFICIENT SPECIFICATION | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`b88c4e28ab62`) | None | display=export=independent derivation |
| M07 | 02 evidence-change | CONTINUE | BLOCK | Differ | Yes (match=true) | Yes (`f11bc318054b`) | None | display=export=independent derivation |
| M08 | 02 evidence-change | BLOCK | BLOCK | **Match** | Yes (match=true) | Yes (`874191446c85`) | None | display=export=independent derivation |
| M09 | 02 evidence-change | BLOCK + REAUTHORIZE | BLOCK | Differ | Yes (match=true) | Yes (`862c0c3d19ec`) | None | display=export=independent derivation |
| M10 | 02 evidence-change | ESCALATE | BLOCK | Differ | Yes (match=true) | Yes (`ad6cd6ae65c0`) | None | display=export=independent derivation |
| M11 | 02 evidence-change | ROLLBACK / COMPENSATE | BLOCK | Differ | Yes (match=true) | Yes (`11743689bbb7`) | None | display=export=independent derivation |
| M12 | 02 evidence-change | INSUFFICIENT SPECIFICATION | BLOCK | Differ | Yes (match=true) | Yes (`f3b9eec3b11a`) | None | display=export=independent derivation |
| M13 | 03 authorization-expiry | CONTINUE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`40029be5b0ed`) | None | display=export=independent derivation |
| M14 | 03 authorization-expiry | BLOCK | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`ec1c76d15f65`) | None | display=export=independent derivation |
| M15 | 03 authorization-expiry | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | **Match** | Yes (match=true) | Yes (`322a8991b053`) | None | display=export=independent derivation |
| M16 | 03 authorization-expiry | ESCALATE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`a3027340c8d8`) | None | display=export=independent derivation |
| M17 | 03 authorization-expiry | ROLLBACK / COMPENSATE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`46ce61b61b96`) | None | display=export=independent derivation |
| M18 | 03 authorization-expiry | INSUFFICIENT SPECIFICATION | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`31e5b1272438`) | None | display=export=independent derivation |
| M19 | 04 learning-authority | CONTINUE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`f0e7af2a0c10`) | None | display=export=independent derivation |
| M20 | 04 learning-authority | BLOCK | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`79cf98bc9eca`) | None | display=export=independent derivation |
| M21 | 04 learning-authority | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | **Match** | Yes (match=true) | Yes (`72ee1c2e400e`) | None | display=export=independent derivation |
| M22 | 04 learning-authority | ESCALATE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`fa5d8d3c5380`) | None | display=export=independent derivation |
| M23 | 04 learning-authority | ROLLBACK / COMPENSATE | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`b99061d246d2`) | None | display=export=independent derivation |
| M24 | 04 learning-authority | INSUFFICIENT SPECIFICATION | BLOCK + REAUTHORIZE | Differ | Yes (match=true) | Yes (`cc87ffca259a`) | None | display=export=independent derivation |
| M25 | 05 conflicting-authorities | CONTINUE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`90166ceaf31a`) | None | display=export=independent derivation |
| M26 | 05 conflicting-authorities | BLOCK | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`8f95f3990f22`) | None | display=export=independent derivation |
| M27 | 05 conflicting-authorities | BLOCK + REAUTHORIZE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`9f464ac691eb`) | None | display=export=independent derivation |
| M28 | 05 conflicting-authorities | ESCALATE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`86645eb02cea`) | None | display=export=independent derivation |
| M29 | 05 conflicting-authorities | ROLLBACK / COMPENSATE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`202b07cd7b35`) | None | display=export=independent derivation |
| M30 | 05 conflicting-authorities | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | **Match** | Yes (match=true) | Yes (`a9cf42a83356`) | None | display=export=independent derivation |
| M31 | 06 mid-execution-revocation | CONTINUE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`282a919a7e9d`) | None | display=export=independent derivation |
| M32 | 06 mid-execution-revocation | BLOCK | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`c9e6c557400a`) | None | display=export=independent derivation |
| M33 | 06 mid-execution-revocation | BLOCK + REAUTHORIZE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`6350687b7218`) | None | display=export=independent derivation |
| M34 | 06 mid-execution-revocation | ESCALATE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`850b030897b0`) | None | display=export=independent derivation |
| M35 | 06 mid-execution-revocation | ROLLBACK / COMPENSATE | INSUFFICIENT SPECIFICATION | Differ | Yes (match=true) | Yes (`881b027e99d6`) | None | display=export=independent derivation |
| M36 | 06 mid-execution-revocation | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | **Match** | Yes (match=true) | Yes (`b8cbd0a620dd`) | None | display=export=independent derivation |

**Totals:** 6 Match (M03, M08, M15, M21, M30, M36; exactly one per scenario), 30 Differ. For every run, the automated check confirmed all of the following:

- the selector values equal the inputs;
- the export's scenario/prediction equal the inputs;
- the export label equals the displayed disposition;
- `prediction_matches_disposition` agrees with the badge and equals `prediction === disposition`;
- the export's four cards, invariants, rationale, open question and sources equal the display;
- the event log names the scenario and the prediction label;
- the replay's original disposition = recomputed disposition = exported disposition;
- the result area is visible, and Replay/Export are enabled.

The only content-level UI issue within the matrix is structural: every scenario has exactly one "correct" prediction label (see DEF-04).

---

## 5. Scenario results

In each scenario, the per-scenario content hash (SHA-256 of summary, perturbation, four cards, invariants, rationale, sources and open question) was **identical across all six predictions**.

### Scenario 01: Authorization condition changes after approval (`condition-change`)

- **Definition:** Evidence E1 supports Decision D1. Authorization A1 is granted under operating condition C1. Before execution, C1 changes to C2 while the evidence and decision remain otherwise intact.
- **Perturbation:** A material authorization condition changes from C1 to C2 after authorization but before execution.
- **Expected encoded:** BLOCK + REAUTHORIZE. **Actual:** BLOCK + REAUTHORIZE (6/6 runs).
- **Predictions:** CONTINUE Differ · BLOCK Differ · **B+R Match** · ESCALATE Differ · RB/C Differ · INSUF Differ.
- **Cards:** Changed: *a condition attached to A1 is no longer the one under which A1 was issued.* Valid: *E1 and D1 reasoning may remain valid unless the condition change affects their epistemic basis.* Invalid: *current authorization cannot be inferred solely from the earlier authorization.* Execute: *Not on A1 alone; the changed condition requires re-evaluation under the applicable governance process.*
- **Invariants:** SUPPORTED: decision validity and authorization validity remain separate. SUPPORTED: a still-reasonable decision does not automatically preserve execution permission. OPEN: exact reauthorization protocol not disclosed.
- **Sources:** p.2 §01, p.20 §19, p.33 §32. All three page and section numbers verified.
- **Replay:** consistent 6/6. **Export:** 6/6 matched.
- **Source conformance:** **REASONABLE INFERENCE**, close to direct. §19 ("Authorization is a separate fact, with its own owner, history and conditions") together with §32 ("When a condition is not met, the system should prefer no transition over a silent bypass") directly support *BLOCK*. The *REAUTHORIZE* half is inferred: the Orientation Edition never uses "reauthorization", "renewal" or "revocation" (0 occurrences each). The harness does flag the protocol as OPEN.
- **Open question:** What exact event invalidates A1, and what JANUS mechanism determines that reauthorization is now required?
- **Concerns:** "Material" is taken as given in the scenario. The source doesn't say which condition changes are material. Acceptable, because the scenario stipulates it.

### Scenario 02: Evidence changes after authorization (`evidence-change`)

- **Definition:** E1 supports D1 and A1 exists. Before execution, new evidence E2 materially contradicts E1. No explicit revocation of A1 has occurred.
- **Perturbation:** The epistemic basis changes while the recorded authorization remains historically present.
- **Expected encoded:** BLOCK. **Actual:** BLOCK (6/6).
- **Predictions:** CONTINUE Differ · **BLOCK Match** · B+R Differ · ESCALATE Differ · RB/C Differ · INSUF Differ.
- **Execute card:** *Not merely because A1 still exists… the decision basis must be re-evaluated before execution can safely be derived from the prior chain.*
- **Invariants:** SUPPORTED: contradictory evidence must remain visible rather than being silently resolved. SUPPORTED: authorization history and current epistemic justification are different facts. OPEN: dependency rule linking evidence invalidation to authority invalidation not stated.
- **Sources:** p.7 §06, p.29 §28, p.30 §29. Verified.
- **Replay/Export:** 6/6 consistent and matched.
- **Source conformance:** **REASONABLE INFERENCE.** §06, §29 ("an error must not be given more power than its real grounding justifies") and §38 ("Refusal of an unjustified transition") support *not proceeding on a stale basis*. However, the source never states that authorization depends on the evidence behind the decision. §32 fail-closed applies only if evidence validity is a "condition", which is unstated. The harness correctly marks that dependency as OPEN.
- **Open question:** Does JANUS automatically invalidate authorization when its evidentiary dependency changes, or does another layer formally revoke or suspend it?
- **Concerns:** (1) The first invariant is marked SUPPORTED, but §28 is about *data* conflicts ("What happens when data conflict?"). Applying it to decision evidence is reasonable but is an extension. (2) **Label ambiguity (DEF-04):** the execute card says the decision basis "must be re-evaluated", which in practice may require new authorization, yet a reviewer who predicts B+R is marked "Differ". The BLOCK vs B+R split rests on an unstated distinction. The only coherent reading is: B+R where the authorization's own validity is known to have lapsed; BLOCK where only the epistemic basis changed and the authorization status is unknown. That reading appears nowhere in the UI or README.

### Scenario 03: Authorization expires before execution (`authorization-expiry`)

- **Definition:** D1 is valid; A1 was valid within defined temporal or operating bounds. Execution is delayed until after those bounds expire.
- **Perturbation:** Time or another explicit validity bound expires before execution begins.
- **Expected encoded:** BLOCK + REAUTHORIZE. **Actual:** BLOCK + REAUTHORIZE (6/6).
- **Predictions:** CONTINUE Differ · BLOCK Differ · **B+R Match** · ESCALATE Differ · RB/C Differ · INSUF Differ.
- **Invariants:** SUPPORTED: historical authorization can remain true as history while no longer being current authority. SUPPORTED: scope and context of validity matter. OPEN: no TTL, expiry objects or renewal mechanics defined.
- **Sources:** p.20 §19, p.27 §26, p.28 §27. Verified.
- **Replay/Export:** 6/6.
- **Source conformance:** **REASONABLE INFERENCE.** The Orientation Edition never mentions expiry (0 occurrences). The scenario *stipulates* that A1 had bounds. Given that stipulation, §19 "conditions" plus §32 fail-closed yields BLOCK, and "if execution is still desired, a new authorization is needed" follows from the separation principle. The "scope of validity" citation (§26) is a column entry for the *Memory* layer ("provenance and scope of validity"), not a statement about authorization. It is used here by analogy. §39 ("Conditions can change, and trust must have a context") would be a more on-point citation that the harness does not use.
- **Open question:** How does JANUS represent authorization lifetime?
- **Concerns:** Minor citation weakness (§26 is about memory). No overclaim in the disposition.

### Scenario 04: Learning attempts to expand authority (`learning-authority`)

- **Definition:** The system repeatedly succeeds inside Scope S1. Learning produces capability C2 that appears reliable beyond S1. No governing authority has approved a larger scope.
- **Perturbation:** Capability expands; formally granted authority does not.
- **Expected encoded:** BLOCK + REAUTHORIZE. **Actual:** BLOCK + REAUTHORIZE (6/6).
- **Predictions:** CONTINUE Differ · BLOCK Differ · **B+R Match** · ESCALATE Differ · RB/C Differ · INSUF Differ.
- **Execute card:** *Only inside the previously authorized scope unless a separate governance process grants additional authority.*
- **Invariants:** three SUPPORTED, no OPEN.
- **Sources:** p.23 §22, p.25 §24, p.39 §38. Verified: "learning … must not constitute a standalone right to expand its permissions"; "Learning ≠ Self-Promotion"; "A new ability should not automatically receive a new level of authority"; "An improved model is not, in itself, consent to greater power."
- **Replay/Export:** 6/6.
- **Source conformance:** **DIRECTLY SUPPORTED.** This is the strongest-grounded scenario. §24 even names the mechanism in outline: "the system presents a proposal, and the governance process decides".
- **Open question:** What evidence and governance event would JANUS require before expanded capability could receive expanded authority?
- **Concerns:** (1) The execute card allows **continued execution within S1**, while the headline disposition is "BLOCK + REAUTHORIZE". The block applies only to the *out-of-scope* portion. A reviewer who predicts CONTINUE (for in-scope work) is marked Differ, even though the card permits in-scope continuation (DEF-04). (2) All three invariants are SUPPORTED with none OPEN, yet the open question shows that the *governance event* is unspecified. Consider adding an OPEN item for consistency with the other scenarios.

### Scenario 05: Two legitimate authorities conflict (`conflicting-authorities`)

- **Definition:** D1 is technically valid. O1 permits D1; another legitimate authority O2 prohibits D1 under a different applicable policy or scope. Both appear valid.
- **Perturbation:** Two apparently legitimate authority claims point to incompatible execution outcomes.
- **Expected encoded:** INSUFFICIENT SPECIFICATION. **Actual:** INSUFFICIENT SPECIFICATION (6/6).
- **Predictions:** CONTINUE Differ · BLOCK Differ · B+R Differ · ESCALATE Differ · RB/C Differ · **INSUF Match**.
- **Execute card:** *Supports preserving and exposing the conflict, but does not specify a universal authority-precedence mechanism from which this harness can derive execution permission.*
- **Invariants:** SUPPORTED: the conflict should remain explicit until a justified resolution exists. SUPPORTED: a downstream need for one answer does not justify manufactured precedence. OPEN: authority-resolution hierarchy not specified.
- **Sources:** p.20 §19, p.29 §28, p.34 §33. Verified.
- **Replay/Export:** 6/6.
- **Source conformance:** **REASONABLE INFERENCE, with a material concern.** The source has no precedence, jurisdiction or conflict-resolution rule for *authorities* ("precedence": 0 occurrences), so INSUF for *how the conflict is resolved* is correct and avoids invented architecture. However:
  1. §28's "not … by force merely because a downstream consumer expects a single value" is stated about **data** conflicts. The harness marks its extension to **authority** conflicts as SUPPORTED, when it is an extension by analogy.
  2. **Inconsistent use of fail-closed (DEF-05).** In 01 and 03 the harness uses §32 ("When a condition is not met, the system should prefer no transition over a silent bypass") to reach BLOCK. In 05, the same principle arguably gives at least a *partial* answer: executing D1 on O1's permission while O2's prohibition is live is not supported by the source. §38 ("A lack of grounds should not be turned into apparent certainty") and §33 (the human as "escalation point") also point toward not proceeding silently. The harness neither cites §32 here nor says that *silent execution* is excluded. It reports only INSUF, and a reviewer who predicts BLOCK or ESCALATE is marked "Differ" even though those predictions have better source support than CONTINUE.
  3. The counter-argument, stated fairly: whether O2's prohibition makes an authorization "condition not met" depends on the very precedence rule that is unspecified. So INSUF is defensible *as the headline*. The defect is that the result does not separate "*resolution* is unspecified" from "*silent continuation* is unsupported".
- **Open question:** How does JANUS resolve two simultaneously applicable but conflicting authority owners?

### Scenario 06: Authority is revoked during execution (`mid-execution-revocation`)

- **Definition:** X1 begins under valid A1. While the real-world action is underway, A1 is revoked or a required condition becomes false.
- **Perturbation:** Authority changes after execution has already begun.
- **Expected encoded:** INSUFFICIENT SPECIFICATION. **Actual:** INSUFFICIENT SPECIFICATION (6/6).
- **Predictions:** CONTINUE Differ · BLOCK Differ · B+R Differ · ESCALATE Differ · RB/C Differ · **INSUF Match**.
- **Invariants:** SUPPORTED: execution remains separately accountable from the preceding authorization. SUPPORTED: original authorization and later revocation should both remain reconstructable. OPEN: no universal in-flight revocation mechanism.
- **Sources:** p.21 §20, p.32 §31, p.2 §01. Verified. §31: "who had the authority and what actually happened"; §01: "NOT AN IMPLEMENTATION SPECIFICATION".
- **Replay/Export:** 6/6.
- **Source conformance:** **REASONABLE INFERENCE**, strongly grounded. "Revoke", "rollback" and "compensate" each appear 0 times in the source. §32 fail-closed speaks of *preferring no transition*, and in this scenario the transition has already happened, so it does not settle stop vs. finish vs. roll back. INSUF is the correct answer and avoids invented semantics. The appendix mentions "conservative escalation" (Construction) and "replay during incidents" (Software/IT) only as domain examples, not as rules. The harness correctly does not promote them.
- **Concerns:** The second invariant says revocation "should" be reconstructable. §31 supports tracing "who had the authority", but "revocation" as an event type is the harness's own term.

---

## 6. Parts 3, 4 and 6: determinism, state isolation and replay

### 6.1 Determinism (Part 3)

Each combination was run 3× with **Reset** before each run (18 runs), then 1× more after a full page reload (6 runs). Compared: displayed disposition, SHA-256 of the rationale, SHA-256 of the invariants JSON, SHA-256 and line structure of the event log, SHA-256 of the replay JSON, SHA-256 and key count of the export.

| Scenario | Prediction used | 3× with Reset | After reload | Disposition | Export hash (12) |
|---|---|---|---|---|---|
| 01 | CONTINUE | IDENTICAL | identical | BLOCK + REAUTHORIZE | `416566b3d6c1` (= M01) |
| 02 | BLOCK | IDENTICAL | identical | BLOCK | `874191446c85` (= M08) |
| 03 | ESCALATE | IDENTICAL | identical | BLOCK + REAUTHORIZE | `a3027340c8d8` (= M16) |
| 04 | BLOCK + REAUTHORIZE | IDENTICAL | identical | BLOCK + REAUTHORIZE | `72ee1c2e400e` (= M21) |
| 05 | INSUFFICIENT SPECIFICATION | IDENTICAL | identical | INSUFFICIENT SPECIFICATION | `a9cf42a83356` (= M30) |
| 06 | ROLLBACK / COMPENSATE | IDENTICAL | identical | INSUFFICIENT SPECIFICATION | `881b027e99d6` (= M35) |

**Result:** no divergence in 24 repeat runs. Exports are byte-identical across the matrix pass, the Reset-separated repeats and the post-reload repeats. The export carries no timestamp, which is part of why it is byte-stable (see DEF-03).

### 6.2 State isolation (Part 4)

**Sequence A** (as specified): Run S01 (pred ESCALATE) → switch to S06 → Run S06 → switch to S03 → Run S03 → Reset → Run S02.

| Step | Observation |
|---|---|
| After Run S01 | Correct S01 result |
| **Switch to S06, not run** | Scenario box and perturbation show **S06**; result panel still shows **S01**: "BLOCK + REAUTHORIZE", S01 rationale and open question, S01 event log. Replay and Export remain **enabled**. Export produced `janus-harness-condition-change-evidence-v0.1.json` (S01). Replay's `scenario_id` = `condition-change`. **→ DEF-01** |
| Run S06 | All fields replaced with S06; no S01 residue |
| Run S03 | All fields replaced with S03; no residue |
| Reset | Result hidden; log and replay show "Not run."; Replay/Export disabled. Scenario **stays S03**. Prediction **changes from ESCALATE to BLOCK + REAUTHORIZE** (DEF-07). The hidden result DOM still holds the previous values (not visible). |
| Run S02 | Clean S02 result. It ran with prediction **B+R**, which Reset injected, not what the reviewer last chose |

This was confirmed visually by hand: select S01 + B+R and click Run, then select S06. The screen shows the S06 heading and the perturbation "Authority changes after execution has already begun", while the result directly below shows **BLOCK + REAUTHORIZE / PREDICTION MATCHED** and the S01 "What changed?" text.

**Sequence B** (different order): Run S05 (INSUF, Match) → change prediction to CONTINUE without re-running → Export → Replay → switch to S04 without running → Export → Run S04 → Replay ×2 → Reset → Replay (click) and Export (click) → Run S06.

| Step | Observation |
|---|---|
| Prediction changed after run | Selector shows CONTINUE; badge still shows **PREDICTION MATCHED**; the export records `INSUFFICIENT_SPECIFICATION`/`match=true`; Replay uses `INSUFFICIENT_SPECIFICATION`. **Stale (DEF-01).** |
| Switch to S04, not run | Selector S04 + CONTINUE; screen shows the S05 result; export = S05. **Stale (DEF-01).** |
| Run S04 | Clean S04 result, log shows CONTINUE |
| Replay ×2 | Both REPLAY CONSISTENT; idempotent |
| Reset, then click Replay/Export | Buttons disabled; replay record stays "Not run."; **no export produced**. Correct. |
| Run S06 | Clean S06 result (prediction B+R, from Reset); no S04/S05 residue |

**Conclusion:** after a new **Run**, there is **no leakage**: rationale, result, prediction, events, replay, sources, assertions and open question are all fully replaced. **Between Run and the next Run, however, the screen, Replay and Export are not tied to the visible selectors.** That is a real state-integrity defect for an evidence tool.

### 6.3 Replay (Part 6)

- **Normal replays:** 60 (36 matrix + 18 determinism + 6 reload). Every one had `scenario_id` and `reviewer_prediction` equal to the run inputs, original = recomputed, `replay_match: true`, `REPLAY CONSISTENT`.
- **Edge cases:**
  - Replay before any run: button disabled (on load and after Reset). Clicking the disabled button does nothing.
  - Replay after Reset: disabled; no stale replay is possible through the UI.
  - Replay after a selector change without re-running: replays the *previous* run (DEF-01).
  - Double replay: idempotent.
- **Does replay recompute or copy? (tamper test, in-page only)**
  - **T1:** after a run, the stored `lastRun.orientation_level_disposition` was overwritten with `CONTINUE`, then Replay was clicked. Output: original `CONTINUE`, recomputed `BLOCK_REAUTHORIZE`, `replay_match: false`, "REPLAY DIVERGENCE — investigate harness state". So replay does **not** reuse the stored result as an instruction, which **confirms the README claim**.
  - **T2:** the in-memory scenario table (`scenarios[0].disposition`) was overwritten with `CONTINUE` after a run. Replay returned recomputed `CONTINUE`, divergence flagged. Replay therefore re-reads the encoded table.
- **Weakness (DEF-02):** "recompute" means calling `buildEvidence()` again, which reads the same constant (`scenario.disposition`) from the same page. There is no rule engine, no contract hash, and nothing that can differ between run and replay unless memory is tampered with. `REPLAY CONSISTENT` is therefore guaranteed by construction and is weak evidence of determinism. The determinism statement shown *before* replay (`"deterministic": "For this harness version, identical declared scenario inputs produce the same…"`) is a hard-coded string, not a measured result. The field `recomputed_orientation_level_disposition` also appears in the replay record before any replay has happened (DEF-09).

---

## 7. Part 7: export-evidence results

- **Export attempts:** 65. 60 normal (36 + 18 + 6), all producing files, **every one field-for-field equal to the displayed state** and byte-equal to the independent derivation. 5 edge attempts: 3 stale exports (A2b, B2, B3), 1 after Reset (no file, correct), 1 after tamper (T1).
- **File name:** `janus-harness-<scenario_id>-evidence-v0.1.json`. The name does **not** include the prediction or a timestamp, so different runs of the same scenario overwrite each other or collide in a downloads folder.
- **Keys present (21), in order:** `harness, version, source_basis, evaluation_mode, restrictions[5], janus_attribution{creator, linkedin}, scenario_id, scenario_name, reviewer_prediction, reviewer_prediction_label, orientation_level_disposition, orientation_level_disposition_label, prediction_matches_disposition, changed, remains_valid, invalid_or_uncertain, execution, invariant_checks[3], rationale, open_question, sources[3]`. **Every key requested in Part 7 is present.**
- **Missing for an evidence record (DEF-03):**
  - timestamp;
  - harness commit or build hash;
  - source-document SHA-256 or URL (`source_basis` is a bare title);
  - a hash of the encoded contract;
  - the scenario `summary` and `perturbation` text;
  - the event log;
  - the replay outcome (exporting after Replay gives exactly the same file as before);
  - the harness author attribution;
  - a restriction line for "does not penetrate", which the hero text includes.
- **Integrity:** in T1 (tampered memory), the export contained `orientation_level_disposition: "CONTINUE"`, `orientation_level_disposition_label: "BLOCK + REAUTHORIZE"`, `prediction_matches_disposition: true`. That is internally contradictory, and it was emitted without warning while the screen showed B+R. The page performs no self-consistency check. This is only reachable through the developer console; it matters because the file is called "evidence".

---

## 8. Part 8/9: source-conformance analysis and expected-disposition check

**Expected vs. actual (Part 9):** all six match the stated expected list (6/6). This confirms only that the app behaves as intended, not that the intent is correct.

| # | Encoded | Classification | Basis in the Orientation Edition | Gap / inference |
|---|---|---|---|---|
| 01 | B+R | **REASONABLE INFERENCE** (strong) | §19 conditions; §32 fail-closed; §06 Decision ≠ Authorization | "Reauthorize" is never named; it follows from separation |
| 02 | BLOCK | **REASONABLE INFERENCE** | §06, §29, §38 "Refusal of an unjustified transition" | Evidence→authorization dependency unstated (harness flags it OPEN); §28 is about data conflicts |
| 03 | B+R | **REASONABLE INFERENCE** | §19 conditions; §32; §27 history ≠ current; §39 "Conditions can change" (not cited) | Expiry never mentioned; the scenario stipulates bounds; §26 citation is by analogy |
| 04 | B+R | **DIRECTLY SUPPORTED** | §22, §24, §38, §35 "does not automatically grant more power", §41 "must not grant itself new competencies" | Label/execute-card mismatch (in-scope work continues) |
| 05 | INSUF | **REASONABLE INFERENCE**, with concern | §19 owners; §28 by analogy; §33 escalation point; no precedence rule exists | Leaves out a source-supported partial answer (no silent execution: §32/§38); fail-closed applied inconsistently with 01/03 |
| 06 | INSUF | **REASONABLE INFERENCE** (strong) | §20 boundary event; §31 audit; §01 not an implementation spec | Correct restraint; "revocation" is the harness's own term |

None are **CONTRADICTED BY SOURCE**. None are **INSUFFICIENTLY SUPPORTED** at the level of the headline disposition. Several individual *invariant statuses* are stronger than the source (see §11).

**The JANUS concepts, checked against the source:**

| Concept | Where in the source | Used correctly by the harness? |
|---|---|---|
| Model ≠ evidence ≠ proof ≠ decision ≠ authorization ≠ execution | §07; §01 gives the shorter chain "model is not proof…" | Yes |
| Capability ≠ authority | §05, §19, §24 | Yes (S04) |
| Authorization: owner, history, conditions | §19 | Yes (S01, S03, S05) |
| Learning ≠ self-promotion | §03, §22 | Yes (S04) |
| Maturation does not auto-expand authority | §24, §36 | Yes (S04) |
| No forced conflict resolution | §28 (**data** conflict) | Extended to evidence (S02) and authority (S05) and labeled SUPPORTED |
| Fail-closed | §32 | Used in S01; not cited in S03 or S05 |
| Execution as accountable boundary event | §20 | Yes (S06) |
| Auditability and provenance | §26, §27, §31 | Yes, but the harness's own export lacks provenance (DEF-03) |
| Scope of validity | §26 (Memory row only) | Used by analogy for authorization (S03) |
| Human oversight | §33, §37 | Cited only in S05; not reflected in any disposition |
| Orientation-only restriction | §01 | Respected throughout |

---

## 9. Part 10: defect log

Severity reflects impact on the harness's purpose as an *evidence-producing* challenge tool.

**DEF-01 · High · All scenarios · Stale result, replay and export after a selector change**

- **Steps to reproduce:** Run any scenario → change the scenario and/or prediction dropdown → do not click Run → look at the screen, then click Replay or Export.
- **Expected:** the result is cleared or marked stale and Replay/Export are disabled, or the selectors are locked after the run.
- **Actual:** the new scenario summary and perturbation render above the *old* result and badge. Replay and Export stay enabled and act on the old run. The export file carries the old scenario ID.
- **Evidence:** sequences A2, A2b, A2c, B2 and B3 (§6.2); manual reproduction with screenshots.
- **Impact:** screenshots and exports can be misattributed to the wrong scenario or prediction. For a tool whose job is evidence and replay, that is the most serious finding.
- **Fix:** add a `change` handler on both selectors that clears `resultArea`, `eventLog` and `replayRecord`, disables Replay and Export, and sets `lastRun = null`, or shows a "STALE — re-run" banner.

**DEF-02 · Medium · All · Replay cannot fail in normal operation**

- **Steps:** any Run → Replay.
- **Expected (from "recomputes"):** an independent re-derivation that could in principle diverge, for example a different code path or a check of a contract hash.
- **Actual:** it re-reads the same constant through the same function in the same page.
- **Evidence:** 60/60 consistent; tamper tests T1 and T2 were needed to make it diverge.
- **Impact:** `REPLAY CONSISTENT` suggests a verification that barely exists.
- **Fix:** hash the encoded scenario contract and the source SHA-256, record both at run time and recheck them at replay; describe replay honestly as "re-derivation from the static encoded table".

**DEF-03 · Medium · All · Export lacks provenance and integrity**

- **Steps:** Export.
- **Expected:** a self-describing evidence record.
- **Actual:** no timestamp, commit, source hash/URL, contract hash, summary, perturbation, event log or replay result. The filename has no prediction or time. No consistency check (T1 produced a contradictory file).
- **Impact:** exports cannot be tied to a harness build or source version, and they collide on disk.
- **Fix:** add `generated_at`, `harness_commit`, `source_document{url, sha256}`, `contract_sha256`, `scenario_summary`, `perturbation`, `event_log`, `replay`. Put the prediction and time in the filename. Assert that `label === labels[disposition]` and `match === (prediction === disposition)` before export.

**DEF-04 · Medium · 02, 04 (and all) · Disposition vocabulary undefined; exact-string matching**

- **Steps:** read the UI and README for definitions of BLOCK vs. B+R vs. ESCALATE.
- **Expected:** each label defined, including what counts as a match.
- **Actual:** there are no definitions. In S02, BLOCK is "correct" although the execute card requires re-evaluation of the decision basis. In S04, B+R is "correct" although the execute card permits in-scope continuation. BLOCK against B+R counts as a flat "Differ".
- **Impact:** the match/differ scores partly measure guessing the author's labeling convention rather than understanding JANUS.
- **Fix:** publish a glossary of labels; allow compound results (for example S04 = "CONTINUE within S1; BLOCK + REAUTHORIZE beyond S1"); report partial agreement.

**DEF-05 · Medium · 05 (vs. 01/03) · Uneven application of fail-closed (§32)**

- **Steps:** compare the S01/S03 rationale and sources with S05.
- **Expected:** the same source principle applied consistently, or the difference explained.
- **Actual:** §32 drives BLOCK in S01. S05 omits §32 and does not state that silent execution under a contested authority is unsupported.
- **Evidence:** the S05 sources are §19/§28/§33; the S05 execute card.
- **Impact:** INSUF can read as "anything goes". BLOCK and ESCALATE predictions are marked Differ although they have more source support than CONTINUE.
- **Fix:** keep INSUF for the *resolution mechanism* but add an explicit line such as "Orientation-level constraint: do not execute silently on O1 alone (§32, §38); resolution mechanism unspecified." Alternatively explain why §32 does not apply.

**DEF-06 · Medium · All · "Evaluated" / "invariant checks" overstate what the harness computes**

- **Steps:** read EVENT 004 ("Orientation-level JANUS constraints evaluated") and the "Invariant checks" heading.
- **Expected:** some evaluation logic.
- **Actual:** dispositions, statuses and text are hard-coded per scenario; nothing is checked or evaluated at runtime.
- **Impact:** implies more rigor than exists. This sits close to the harness's own boundary ("does not … validate").
- **Fix:** rename to "Encoded orientation-level assessment" and "Encoded source commitments", and say that results are authored, not computed.

**DEF-07 · Low · All · Reset changes the prediction to B+R; load default is CONTINUE; Reset keeps the scenario**

- **Steps:** load the page (prediction = CONTINUE) → Run → Reset (prediction = BLOCK + REAUTHORIZE).
- **Expected:** Reset restores the load state or clears the prediction.
- **Actual:** it pre-selects the answer that is correct for 3 of the 6 scenarios and silently overwrites the reviewer's committed prediction (Sequence A, step 6).
- **Impact:** anchors the "predict first" step.
- **Fix:** reset to a neutral placeholder ("— choose —") and require an explicit choice before Run is enabled.

**DEF-08 · Low · All · README promises 7 questions per challenge; the UI answers 6**

- **Expected:** a field for Q7, "What evidence would be required to reconstruct the decision path?"
- **Actual:** there is no such field in the UI or the export.
- **Fix:** add the field or remove Q7 from the README.

**DEF-09 · Low · All · Pre-replay record mislabeled**

- **Actual:** before any replay, the record already contains `recomputed_orientation_level_disposition` and a determinism claim written as a static string.
- **Fix:** rename to `encoded_disposition` and mark the determinism line as a design claim, not a test result.

**DEF-10 · Low · 02, 03, 05 · Invariant statuses stronger than the source**

- **Actual:** three statuses are marked SUPPORTED although each extends a principle beyond its stated domain:
  - S02 #1 and S05 #1 and #2 extend §28 (*data* conflict) to evidence and authority;
  - S03 #2 uses §26 (the *memory* layer's scope of validity) for authorization.
- **Fix:** add a third status, such as "EXTENDED / BY ANALOGY".

**DEF-11 · Observation · Source provenance cannot be verified from the file**

- The site says the `.docx` is "the original document supplied by Eryk Dubiel … published here unchanged".
- The file's own metadata reads: `lastModifiedBy: Kelly Newsome`, `revision 2`, created = modified = 2026-09-24T01:42Z, `creator: Un-named`.
- This does **not** show that the content changed; a re-save alone would produce it. It does mean the file bytes were last saved by the harness author's software, so "unchanged" cannot be confirmed from the file. The SHA-256 proves only that the repo, Pages and README agree with *each other*.
- **Fix:** publish a hash or signature supplied by the original author, or state "content unchanged; file re-saved".

**DEF-12 · Observation · Invalid scenario ID crashes instead of failing closed**

- A DOM-injected scenario value makes `runChallenge()` throw `TypeError: Cannot read properties of undefined (reading 'id')`. This is unreachable through the normal UI.
- **Fix:** guard `selectedScenario()` and show an explicit refusal.

**Items checked with no defect found:**

- Prediction never altered the disposition (36/36).
- No residue after re-running.
- Replay and Export are correctly disabled before any run and after Reset.
- All 18 page and section citations resolve to the stated section and page in a LibreOffice render.
- Attribution to Eryk Dubiel is clear and consistent.
- Non-official status is stated in the hero, footer, README and export.
- The "INSUFFICIENT SPECIFICATION is not a failure of JANUS" statement is present; the red "PREDICTION DIFFERED" badge is about the reviewer, not JANUS.
- No console errors.
- No external scripts.

---

## 10. Part 11: harness assumptions and possible overreach

1. **Materiality is stipulated** (S01 "material condition", S02 "materially contradicts"). JANUS gives no test of materiality.
2. **Authorization has validity bounds** (S03). The source never mentions expiry or time bounds on authorization.
3. **Authorization depends on the evidence behind the decision** (S02 BLOCK). This is implied, not stated. The harness flags the mechanism OPEN but still commits to BLOCK.
4. **"Reauthorization" exists as a JANUS concept** (S01, S03, S04). The word does not occur in the source; §24's "governance process decides" is the nearest statement, and it concerns maturation.
5. **§28's data-conflict principle governs authority and evidence conflicts** (S02, S05), marked SUPPORTED.
6. **"Scope of validity" applies to authorization** (S03). The source lists it for the Memory layer.
7. **Disposition taxonomy.** CONTINUE / BLOCK / B+R / ESCALATE / RB-C / INSUF are the harness's own categories. JANUS defines none of them.
8. **"Revocation" as a JANUS event** (S06). The concept is the harness's own.
9. **"Evaluated", "checks" and "recompute"** imply computation; the harness is an authored lookup table.
10. **Page citations** ("p.20") depend on rendering. They are verified here, but a `.docx` has no fixed pagination; section numbers (§) are the stable anchor.
11. **Paraphrase strengthening:**
    - §01 is summarized as "distinct transitions"; the source says "is not".
    - §29 is summarized as "must not be automatically promoted"; the source says it "becomes dangerous when" output is automatically promoted.
    - Both are fair in spirit but more normative than the text.
12. **Under-reach (the opposite risk)** in S05: INSUF hides constraints the source does support (§32, §38, §33).

---

## 11. JANUS questions exposed by the harness

These are not answered here on JANUS's behalf.

1. What event invalidates an existing authorization when one of its conditions changes, and who owns that determination? (S01)
2. Is authorization formally dependent on the evidence behind the decision it authorizes? Does a change in evidence suspend authorization automatically or only through another layer? (S02)
3. How is authorization lifetime represented: expiry, policy validity, state dependency, or something else? (S03)
4. What evidence and which governance event are required before expanded capability may receive expanded authority, and who is the verifier in §24's "independently verified" process? (S04)
5. How are two simultaneously applicable, conflicting authority owners resolved: precedence, jurisdiction, policy hierarchy or human escalation? (S05)
6. Does §32 fail-closed apply to *contested* authorization, as distinct from *absent* authorization? (S05)
7. How are in-flight actions classified when authority disappears, and what selects stop, safe completion, rollback, compensation or escalation? (S06)
8. Does §28's no-forced-resolution principle, stated for data, extend to conflicts between authorities? (S02, S05)
9. Is "reauthorization" a distinct JANUS transition, or simply a new authorization fact? (S01, S03, S04)
10. At what point in the §20 sequence (Preparation → Permission → Execution → Result) is authority last checked? (S01, S03, S06)

---

## 12. Final test accounting

| Count | Value |
|---|---|
| Primary matrix runs | **36** (6 × 6), all executed on the live site |
| Repeat determinism runs | **24** (18 Reset-separated: 6 scenarios × 3; plus 6 after page reload) |
| State-isolation runs | **9** (Sequence A: S01, S06, S03, S02, plus a re-run of the S03 → Reset → S02 tail after truncated console output; Sequence B: S05, S04, S06) + **1** manual real-click run with screenshots |
| Tamper/edge runs | **2** (T1, T2) + 1 invalid-scenario probe |
| Replay checks | **67** (60 normal, all consistent; 7 edge: 2 stale, 2 double, 1 post-Reset disabled, 2 tamper divergence) |
| Export checks | **65** (60 normal, all matched the display and the independent derivation; 3 stale; 1 correctly blocked after Reset; 1 tamper) |
| Total scenarios | **6** |
| Total prediction permutations | **36** |
| Defects found | **12** (Critical 0 · High 1 · Medium 5 · Low 4 · Observation 2) |
| Source-conformance concerns | **6** (S02 §28 extension; S03 §26 analogy / §39 not cited; S04 label vs. execute card; S05 §28 extension; S05 fail-closed omission; paraphrase strengthening §01/§29) |
| Unresolved JANUS questions | **10** |

---

## 13. Appendix: raw results

The complete per-run record is in the companion file **`JANUS_Harness_v0.1_raw_results.json`**. For each of the 36 runs it gives: run ID, scenario ID, prediction, disposition, match flag, badge text, replay (original / recomputed / match / result), export filename, SHA-256 prefix of the observed export, SHA-256 prefix of the observed event log + pre-replay record, and whether each equals the independent derivation (all `true`).

**Compact raw record** (Run | scenario | prediction → disposition | badge | replay | export hash):

```
M01 | condition-change         | CONT  -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=416566b3d6c1 log=25ab9cf2a437
M02 | condition-change         | BLOCK -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=4a6fe189c6a2 log=d862bf3894bc
M03 | condition-change         | B+R   -> B+R   | MATCHED | REPLAY CONSISTENT (match=true) | exp=f8b6e884781b log=b82d26b7f91c
M04 | condition-change         | ESC   -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=04d23b25afed log=91347aec5bfb
M05 | condition-change         | RB/C  -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=315a30c64c71 log=7ae840dfc8b8
M06 | condition-change         | INSUF -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=b88c4e28ab62 log=4a4411075b07
M07 | evidence-change          | CONT  -> BLOCK | DIFFERED | REPLAY CONSISTENT (match=true) | exp=f11bc318054b log=deb971ed6743
M08 | evidence-change          | BLOCK -> BLOCK | MATCHED | REPLAY CONSISTENT (match=true) | exp=874191446c85 log=7564e261a35b
M09 | evidence-change          | B+R   -> BLOCK | DIFFERED | REPLAY CONSISTENT (match=true) | exp=862c0c3d19ec log=4f97a9277c64
M10 | evidence-change          | ESC   -> BLOCK | DIFFERED | REPLAY CONSISTENT (match=true) | exp=ad6cd6ae65c0 log=8767b69941a3
M11 | evidence-change          | RB/C  -> BLOCK | DIFFERED | REPLAY CONSISTENT (match=true) | exp=11743689bbb7 log=af8b07bade61
M12 | evidence-change          | INSUF -> BLOCK | DIFFERED | REPLAY CONSISTENT (match=true) | exp=f3b9eec3b11a log=b1baa1842345
M13 | authorization-expiry     | CONT  -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=40029be5b0ed log=10506c7790ce
M14 | authorization-expiry     | BLOCK -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=ec1c76d15f65 log=10d075d33a05
M15 | authorization-expiry     | B+R   -> B+R   | MATCHED | REPLAY CONSISTENT (match=true) | exp=322a8991b053 log=e17041602bee
M16 | authorization-expiry     | ESC   -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=a3027340c8d8 log=ea03df5fa375
M17 | authorization-expiry     | RB/C  -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=46ce61b61b96 log=c891599fb5b2
M18 | authorization-expiry     | INSUF -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=31e5b1272438 log=1e1e14845b7d
M19 | learning-authority       | CONT  -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=f0e7af2a0c10 log=5714bd8f5211
M20 | learning-authority       | BLOCK -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=79cf98bc9eca log=a45b89a8757b
M21 | learning-authority       | B+R   -> B+R   | MATCHED | REPLAY CONSISTENT (match=true) | exp=72ee1c2e400e log=a4c74f08d4ed
M22 | learning-authority       | ESC   -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=fa5d8d3c5380 log=cc4d0213f7af
M23 | learning-authority       | RB/C  -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=b99061d246d2 log=d9083e72100e
M24 | learning-authority       | INSUF -> B+R   | DIFFERED | REPLAY CONSISTENT (match=true) | exp=cc87ffca259a log=667059dde26a
M25 | conflicting-authorities  | CONT  -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=90166ceaf31a log=3990afae4f29
M26 | conflicting-authorities  | BLOCK -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=8f95f3990f22 log=1149836a3ae9
M27 | conflicting-authorities  | B+R   -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=9f464ac691eb log=3392c1c405a0
M28 | conflicting-authorities  | ESC   -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=86645eb02cea log=c71ec1d3442f
M29 | conflicting-authorities  | RB/C  -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=202b07cd7b35 log=fd4600cd11e5
M30 | conflicting-authorities  | INSUF -> INSUF | MATCHED | REPLAY CONSISTENT (match=true) | exp=a9cf42a83356 log=4124d230457b
M31 | mid-execution-revocation | CONT  -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=282a919a7e9d log=aaf074683191
M32 | mid-execution-revocation | BLOCK -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=c9e6c557400a log=1deb29db05b5
M33 | mid-execution-revocation | B+R   -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=6350687b7218 log=ea4e486e28eb
M34 | mid-execution-revocation | ESC   -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=850b030897b0 log=bcb8ba0941cd
M35 | mid-execution-revocation | RB/C  -> INSUF | DIFFERED | REPLAY CONSISTENT (match=true) | exp=881b027e99d6 log=c33fa1009660
M36 | mid-execution-revocation | INSUF -> INSUF | MATCHED | REPLAY CONSISTENT (match=true) | exp=b8cbd0a620dd log=eb67c7300ec0
```

**Determinism records** (D01–D18, 3 per scenario, Reset between runs): all fields identical within each triplet. The export hashes are listed in §6.1.

**How to reproduce independently:**

1. Load the site at commit `f8b2eb6`.
2. For each scenario and prediction: choose the scenario, choose the prediction, click Run, then Replay, then Export.
3. Compute the SHA-256 of the downloaded JSON and compare its first 12 hex digits with the table above. Downloaded files should match exactly, because the export contains no timestamp.
4. To reproduce DEF-01: Run S01, then switch the dropdown to S06 and click Export. You will receive `janus-harness-condition-change-evidence-v0.1.json`.
