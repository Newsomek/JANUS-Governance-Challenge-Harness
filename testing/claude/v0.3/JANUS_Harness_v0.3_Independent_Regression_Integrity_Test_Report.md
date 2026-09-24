# JANUS Governance Challenge Harness v0.3
## Independent Regression & Integrity Test Report

Tested commit `d79b0385c5b041772580121deaaf1531c8d4a845` · baseline `v0.2-tested` → `ba7b6e5b9335f395499f569f0df091962c69bb8f` · raw data: `JANUS_Harness_v0.3_raw_results.json`

---

## 1. Executive summary

**Scope.** I ran all 36 scenario × prediction permutations on the **live public site** in a real Chrome browser. Every permutation was run, replayed, and had Export attempted both before and after Replay. I also ran:

- targeted v0.3 hardening tests (Part 3 A–J): 14 tamper-then-Replay cases, 12 post-Replay export-recheck cases and 11 no-Replay export cases;
- 7 source-byte substitution/failure cases, 5 commit-provenance cases and 9 race cases;
- 12 prediction/scenario injection cases and 9 replay edge cases;
- state-isolation sequences A–D and 24 determinism runs;
- a source-conformance re-read of the Orientation Edition.

CHANGELOG claims were not trusted. Each one was exercised.

| Question | Result |
|---|---|
| Deployed = `d79b038`? | **Yes**. 10/10 served files hash-match the commit. The `.docx` is byte-identical to v0.2. The `v0.2-tested` tag peels to `ba7b6e5` |
| 36/36 permutations executed? | **Yes**. 36 runs, 36 replays, 72 export attempts, 576 automated display/state checks, **0 check failures** |
| Assessment content correct and prediction-independent? | **Yes**. For each scenario, 1 content fingerprint across 6 predictions. Only 3 cells changed from v0.2, all intended: S01, S03 and S04 ESCALATE went from DIFFERENT to PARTIAL |
| Real source-byte hashing? | **Yes**. `crypto.subtle` over the fetched bytes. A one-byte substitution is detected at Run, Replay and Export |
| **Replay on an untampered run** | **REPLAY DIVERGENCE in 36/36** (plus 18/18 determinism runs and 4/4 repeated replays) |
| **Ordinary evidence export** | **Refused in 72/72 attempts. 0 evidence files can be produced from the live site** |
| Deterministic? | Assessment content, contract hash, source hashes, event log, compatibility and commit: **yes**. The evidence-core hash: **no**, it changes on every run |
| Race / stale state | **Fixed**. 9/9 race cases and all 4 isolation sequences pass |
| Prediction allow-list | **Fixed**. 11/11 injected values refused |
| Support-status precision | **Fixed**. Glossary present, 4 distinct styles, 3 relabels done |
| DEF-02 / DEF-03 / DEF-10 | **REGRESSED / REGRESSED / FIXED** |
| NEW-01…NEW-07 | 5 FIXED, 2 PARTIALLY FIXED (NEW-03, NEW-07) |
| New v0.3 findings | **1 Critical**, **2 Medium**, 2 Low, 3 Observations, plus 1 interpretive concern |
| Source contradicted? | **No**. 0 contradicted, 0 insufficiently supported |

**Bottom line.** v0.3 contains the right hardening *logic*, and it works when tested in isolation. The problem is one design error: `source_document.checked_at` is a fresh timestamp written at every source fetch, and it sits **inside** the hashed evidence core. Replay and Export each re-fetch the source, get a new timestamp, rebuild the core and compare hashes, so they can never match an honest run.

The result is that the harness now reports **"REPLAY DIVERGENCE — export blocked"** for every clean run and **refuses every export**. I confirmed the root cause two ways:

- An independent Node re-derivation reproduces all 36 stored core hashes, and shifting `checked_at` by 1 ms changes every one of them.
- An instrumented fixed-clock fixture makes Replay CONSISTENT and Export PASS.

It fails closed, so no bad evidence is emitted. But the headline v0.3 claims (replay integrity and exportable provenance) are not achievable on the live site, and the divergence signal is a 100% false positive. **v0.3 should not be tagged `v0.3-reviewed` or shared yet.** The fix is small: remove per-fetch metadata from the core (§18).

---

## 2. Test environment

| Item | Value |
|---|---|
| Test window | 2026-09-24 ≈04:31–04:52 UTC (00:31–00:52 EDT) |
| Browser | Chrome 153.0.0.0 (Windows x64 UA), driven through Claude in Chrome in the user's tab |
| Live URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ (`Last-Modified: Thu, 24 Sep 2026 04:26:15 GMT`) |
| Repository | cloned into the cloud sandbox; refs checked with `git ls-remote` |
| Independent derivation | Node 22 (`crypto`) re-derives contract hashes, event logs and evidence-core hashes from `app.js` at `d79b038` |
| Source text | `.docx` converted to plain text with pandoc (5,643 words, §01–§42) |

**Method notes**

- **Where it ran.** The cloud sandbox proxy blocks `github.io` (HTTP 403), so all live execution happened in the user-side Chrome tab. The sandbox was used only for git, independent hashing and source reading.
- **Driving the page.** The page's own controls were used: `.click()` and `change` events. Direct calls to `runChallenge()`, `replayLastRun()` and `exportEvidence()` were used only for adversarial cases.
- **Export capture.** `URL.createObjectURL`, `HTMLAnchorElement.prototype.click` and `window.alert` were wrapped in-page. The harness's own `exportEvidence()` ran unmodified, and no file was written to disk.
- **FIXED-CLOCK FIXTURE.** This means `Date.prototype.toISOString` frozen, plus the GitHub commit API answered from a cached copy of its real response. It was used only to:
  - confirm the V03-NEW-01 root cause;
  - give tamper, race and export-content tests a passing baseline, so that a refusal can be attributed to the tamper and not to V03-NEW-01.

  Every fixture result is labelled. **Unfixtured, every export is refused.**
- **Tampering and substitution.** All tampering and byte substitution was in-memory in one tab (for example, a wrapped `fetch` that flips one byte of the `.docx` response) and was discarded by reload. The repository, deployment and source document were not modified. No PR and no tag were created.
- **GitHub API budget.** The unauthenticated limit is 60 requests per hour per IP. The live quota was exhausted naturally during testing, which served as a real failure-mode observation (§10). The post-reload determinism runs waited for the quota to reset.

---

## 3. Deployment / commit verification

| Check | Result |
|---|---|
| Remote HEAD / `refs/heads/main` | `d79b0385c5b041772580121deaaf1531c8d4a845` ✔ (committed 2026-09-24T00:25:53-04:00, "Harden JANUS governance challenge harness v0.3") |
| Tag `v0.2-tested` | annotated tag object `e521c1d5…`, which peels to `ba7b6e5b9335f395499f569f0df091962c69bb8f` ✔ |
| Tag `v0.1-tested` | `f83eeda3…`, which peels to `f8b2eb62…` ✔ (unchanged) |
| Served vs commit (SHA-256, `cache:no-store`) | `index.html`, `app.js`, `styles.css`, `.docx`, `VERSION.txt`, `CHANGELOG.md`, `README.md`, cover image, v0.2 report, v0.2 raw JSON: **10/10 MATCH** |
| Page identifies as v0.3 | title "…Harness v0.3"; eyebrow "VERSION 0.3"; `HARNESS_VERSION="0.3"`; `BUILD_ID="janus-governance-challenge-harness-v0.3"`; footer v0.3 ✔ |
| Source document | 50,354 bytes, SHA-256 `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4` ✔; byte-identical to `ba7b6e5` ✔ |
| v0.2 Claude evidence | `testing/claude/v0.2/` report + raw JSON present and served ✔ |
| Read before testing | CHANGELOG, README, VERSION.txt, v0.2 report, v0.2 raw JSON ✔ |

**Mismatches: none.**

---

## 4. Full 36-run coverage matrix

Every run passed all 16 automated checks:

1. disposition shown = state;
2. badge and comparison;
3. 4 cards shown = state;
4. commitments shown = state;
5. rationale, sources, open question and evidence shown = state;
6. compatibility text = set + reason;
7. event log shown = state, with lines 2 and 5 correct;
8. replay record shown = `lastReplay`;
9. pre-run button states;
10. `harness_commit` = full `d79b038` SHA;
11. observed = expected source SHA at 50,354 bytes;
12. absolute source URL;
13. in-page evidence-core recompute = stored;
14. contract hash = `canonicalContract`;
15. pre-replay record "NOT YET REPLAYED";
16. no uncaught error.

Separately, Node re-derived for all 36 runs:

- the contract hash (6/6 distinct values equal);
- the event log (36/36 equal);
- the stored evidence-core hash (**36/36 equal**, using the run's own `checked_at`).

Replay flags are shown in the order disposition, contract, source, record-integrity, authored-state.

| Run | Sc. | Prediction | Encoded | Comparison | Replay (D/C/S/R/A) | Export pre / post Replay | Checks | Event-log SHA (12) | Core SHA (12) |
|---|---|---|---|---|---|---|---|---|---|
| M01 | 01 | CONTINUE | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | c288734bf1c2 | ab391f3f740b |
| M02 | 01 | BLOCK | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | e39a944d5de0 | 4897bc69128a |
| M03 | 01 | B+R | B+R | **EXACT** | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 6abcfb92670c | 3007c4e500b4 |
| M04 | 01 | ESCALATE | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | bfc1276d5707 | e2f1d5313c53 |
| M05 | 01 | ROLLBACK/COMP | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 6c7f1b65e9cf | 26484ff60fdf |
| M06 | 01 | INSUF SPEC | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | a9491779c9c5 | d961e8a90918 |
| M07 | 02 | CONTINUE | BLOCK | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 4c33b1eafddd | c726bec1478e |
| M08 | 02 | BLOCK | BLOCK | **EXACT** | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 7d1cd1e309a7 | 282d506cf64e |
| M09 | 02 | B+R | BLOCK | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 0c9762e12708 | abbb930f0d4c |
| M10 | 02 | ESCALATE | BLOCK | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | e7bdb91b3106 | fa2e4f81cd18 |
| M11 | 02 | ROLLBACK/COMP | BLOCK | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | e977063d4d7f | f2ea7d5abcaf |
| M12 | 02 | INSUF SPEC | BLOCK | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | cda6429a42fe | e89da5ef3ee9 |
| M13 | 03 | CONTINUE | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | ddd41d738e4b | c94edef0a259 |
| M14 | 03 | BLOCK | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 78beccc75177 | 4b9fd1874464 |
| M15 | 03 | B+R | B+R | **EXACT** | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 62ae207c12b1 | a587cd90b655 |
| M16 | 03 | ESCALATE | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 61cb2fef797b | e507601cc2ed |
| M17 | 03 | ROLLBACK/COMP | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 969b47f167d8 | 0c7db9d7e247 |
| M18 | 03 | INSUF SPEC | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 73a8b6c12940 | a6ecb16abbeb |
| M19 | 04 | CONTINUE | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | ecb668836882 | 7c72ad0df5f5 |
| M20 | 04 | BLOCK | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | e247bd8afefb | 174cf762fa7b |
| M21 | 04 | B+R | B+R | **EXACT** | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 085c376fec08 | 00f954715e12 |
| M22 | 04 | ESCALATE | B+R | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | a0403c4e8440 | ca5018bfe4e4 |
| M23 | 04 | ROLLBACK/COMP | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 1f81956e14ea | 471bfc6cb9cd |
| M24 | 04 | INSUF SPEC | B+R | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 48e12b8edc7f | ca9061226560 |
| M25 | 05 | CONTINUE | INSUF SPEC | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | a6d91439d15b | 85208cd32bcc |
| M26 | 05 | BLOCK | INSUF SPEC | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | ae72e298ad70 | 614c456c06fc |
| M27 | 05 | B+R | INSUF SPEC | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 94b3df93277a | 0684d35c8928 |
| M28 | 05 | ESCALATE | INSUF SPEC | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 0487cd4e4a81 | 42701dce1620 |
| M29 | 05 | ROLLBACK/COMP | INSUF SPEC | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 4f60d2c65c0f | 9171c34e3304 |
| M30 | 05 | INSUF SPEC | INSUF SPEC | **EXACT** | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 95fa5027881a | 9a95e44b0582 |
| M31 | 06 | CONTINUE | INSUF SPEC | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 479d3b526666 | 0cd2322af04e |
| M32 | 06 | BLOCK | INSUF SPEC | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 5931ddbd85c0 | 2dc175e6dbc0 |
| M33 | 06 | B+R | INSUF SPEC | DIFFERENT | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | d2d7eaba1076 | cc371ebb6327 |
| M34 | 06 | ESCALATE | INSUF SPEC | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 6c968c10696f | 200b5ef0d258 |
| M35 | 06 | ROLLBACK/COMP | INSUF SPEC | PARTIAL | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | 0eeb8ee59006 | d033e09878fb |
| M36 | 06 | INSUF SPEC | INSUF SPEC | **EXACT** | DIVERGENCE (✔✔✔✔✘) | refused / refused | 16/16 | a2d4467f6e3d | 3275c99349ab |

**Totals**

- 36 runs, 36 replays, 72 export attempts.
- 576 checks with 0 failures.
- Replay: 0 CONSISTENT, **36 DIVERGENCE on untampered state**.
- Exports: 0 emitted.
  - All 36 pre-Replay attempts were refused with `authored_state_integrity`.
  - All 36 post-Replay attempts were refused with "replay integrity is divergent".
  - The Export button was disabled after Replay in 36/36.

**v0.2 → v0.3 cell changes:** only M04, M16 and M22 (ESCALATE for S01, S03 and S04) changed, from DIFFERENT to PARTIAL. This is the intended NEW-05 change. The other 33 event-log hashes are identical to v0.2. No scenario card, rationale, open-question or evidence text changed. The S03 source list gained the §26 reference.

---

## 5. Scenario-by-scenario results

Contract hashes were derived independently and equal the live values.

| # | Scenario | Encoded | Compatible set (shown) | Commitment statuses | Contract SHA (12) |
|---|---|---|---|---|---|
| 01 | condition-change | BLOCK + REAUTHORIZE | BLOCK, ESCALATE | DIRECT, DIRECT, OPEN | 52a18511594c |
| 02 | evidence-change | BLOCK | B+R, ESCALATE | EXTENDED, **INFERENCE**, OPEN | 36bc70425fbd |
| 03 | authorization-expiry | BLOCK + REAUTHORIZE | BLOCK, ESCALATE | **INFERENCE**, EXTENDED, OPEN | e7e29686985b |
| 04 | learning-authority | BLOCK + REAUTHORIZE | BLOCK, CONTINUE, ESCALATE | DIRECT, DIRECT, OPEN | d783abf986fc |
| 05 | conflicting-authorities | INSUFFICIENT SPECIFICATION | BLOCK, ESCALATE | EXTENDED, **INFERENCE**, OPEN | a0c4ec5335ce |
| 06 | mid-execution-revocation | INSUFFICIENT SPECIFICATION | BLOCK, ESCALATE, ROLLBACK/COMP | DIRECT, INFERENCE, OPEN | 039374e4ac3e |

The full per-run content is in the raw JSON: changed, remains valid, invalid/uncertain, execution, commitments, rationale, sources, open question, evidence required and event log.

- **S01.** Unchanged from v0.2 apart from the compatibility disclosure. The card "Do not proceed on A1 alone…" is consistent with its rationale.
- **S02.** Commitment #2 was relabelled to REASONABLE INFERENCE.
- **S03.** Commitment #1 was relabelled. §26 is now named as the analogy source. It sits inside the §27 line rather than in its own entry, which is acceptable.
- **S04.** The in-scope CONTINUE compatibility is now explicit.
- **S05.** Commitment #2 was relabelled. The execution card still separates the unspecified mechanism from the constraint against silent execution.
- **S06.** CONTINUE is DIFFERENT, with a stated reason tied to the glossary.

---

## 6. v0.2 partial-finding closure

| ID | v0.2 | v0.3 behaviour (evidence) | Status |
|---|---|---|---|
| DEF-02 Replay/integrity hardening | PARTIALLY FIXED | **Improvements:** the source leg now hashes real bytes, and tamper detection is strong (B1–B10b: all 12 effective non-forgery tampers diverge). **Regression:** Replay reports **DIVERGENCE on 36/36 untampered runs**, where v0.2 gave 36/36 CONSISTENT. Replay can no longer tell a clean record from a tampered one because both diverge (V03-NEW-01). | **REGRESSED** |
| DEF-03 Export provenance/integrity | PARTIALLY FIXED | Under the fixture the export carries an absolute URL, expected and observed hashes, the full commit, `generated_at` and `exported_at`, the compatibility set and reason, a 12-check integrity map and `integrity_status`. **Live, 0/72 exports are emitted**, where v0.2 emitted 36/36. Commit provenance is weak (V03-NEW-02). | **REGRESSED** (the design-level remediation is verified; it becomes FIXED except for V03-NEW-02 once V03-NEW-01 is corrected) |
| DEF-10 Support-status precision | PARTIALLY FIXED | S02 #2, S03 #1 and S05 #2 = REASONABLE INFERENCE. Glossary in the UI and README. 4 distinct colours. §26 named in S03. | **FIXED** |

---

## 7. v0.2 NEW-defect closure

| ID | v0.3 behaviour | Status |
|---|---|---|
| NEW-01 async race | A generation token and post-await checks are in place. R1–R9 all pass: the later action wins, no stale result is shown, Replay/Export are off and 0 stale files are produced. There is no TypeError in R3, which threw in v0.2 (§11). | **FIXED** |
| NEW-02 source-hash tautology | The fetched bytes are hashed with `crypto.subtle`. Expected and observed values are stored separately. The expected constant is frozen (assignment is silently ignored). A one-byte substitution is caught at Run (refused), at Replay (`source_match:false`, DIVERGENCE) and at Export (refused) (§8). | **FIXED** |
| NEW-03 shallow export integrity | Export rechecks 12 conditions, including after a clean Replay. Every covered-field tamper is refused (§9, fixture). **Residual:** `harness_commit`, attributions, restrictions, `generated_at` and `repository` can be edited and still export `integrity_status: PASS`. The gate also refuses every honest run (V03-NEW-01). | **PARTIALLY FIXED** |
| NEW-04 prototype prediction lookup | A `Set` plus `Object.hasOwn`. 11/11 injected values are refused, with no function text and no export (§12). | **FIXED** |
| NEW-05 compatibility disclosure | The set and reason are shown on 36/36 runs and exported (fixture). Behaviour equals the displayed set on 36/36. S01, S03 and S04 ESCALATE are now PARTIAL. S06 CONTINUE stays DIFFERENT, with a reason. | **FIXED** (interpretive concern INT-01 remains) |
| NEW-06 status vocabulary/style | Glossary plus distinct styles: DIRECT green, INFERENCE violet, EXTENDED blue, OPEN amber. | **FIXED** |
| NEW-07 polish | See the four sub-items below. | **PARTIALLY FIXED** |

NEW-07 sub-items:

- (a) Fresh-page scenario change: the message now reads "No challenge has been run for this selection." and no notice appears. **Fixed.**
- (b) Export with a missing contract now alerts "Export refused: scenario or prediction is invalid.", and Replay shows REPLAY REFUSED. **Fixed.**
- (c) After invalidation, the hidden result DOM still holds the previous disposition, badge, rationale and compatibility. **Not fixed.**
- (d) `exported_at` has been added alongside `generated_at`. **Fixed.**

---

## 8. Real source-byte hashing results (Part 3A)

| Test | Result |
|---|---|
| Code path | `observeSourceDocument()`: `fetch(url,{cache:"no-store"})` → `arrayBuffer` → `crypto.subtle.digest("SHA-256")`. It is called at Run, Replay and Export ✔ |
| Distinct fields | `source_document.expected_sha256` / `observed_sha256`; `replay.source_expected_sha256` / `source_observed_sha256` ✔ |
| Observed = live `.docx` hash `21766f5d…551fe4` | 36/36 primary runs and all determinism runs ✔; 50,354 bytes ✔ |
| Tamper the in-memory expected **constant** | Not possible: `SOURCE_DOCUMENT` is a frozen `const`, so the assignment is silently ignored and the value stays unchanged (B4b) |
| Tamper the stored expected hash (`lastRun`), then Replay | **DIVERGENCE** (record_integrity). Note: `source_match` itself does not compare the stored *expected* value. It is caught only by the core hash |
| Tamper the stored observed hash, then Replay | **DIVERGENCE** (`source_match:false`, record_integrity) ✔ |
| One-byte-altered `.docx` response at **Run** | Run refused: `lastRun` null, Replay and Export off ✔. **No visible reason** (V03-NEW-04) |
| Altered bytes at **Replay** only | `source_match:false`, observed `45b8f06f0d01…` ≠ expected, DIVERGENCE, Export disabled ✔ |
| Altered bytes at **Export** only | Refused (`source_expected_hash, source_matches_run, authored_state_integrity`) ✔ |
| HTTP 404 / network error at Run | Refused silently. At Replay: `REPLAY REFUSED — Failed to fetch`. At Export: refused ✔ |

**Classification: FIXED.** The source hash is now a real observation.

---

## 9. Replay / integrity results (Parts 3B, 3C, 8)

**Unfixtured (the product as deployed).** Clean replays:

- 36/36 primary runs;
- 18/18 determinism runs;
- 6/6 post-reload runs;
- 4/4 repeated replays of one run.

All of them returned **DIVERGENCE**. The failing flag is always `authored_state_match` alone. Repeated replays of the same run give four *different* re-derived hashes. Because clean and tampered records both diverge, unfixtured tamper tests prove nothing, so the tamper tests below were run on the fixture baseline (B0 = CONSISTENT and PASS).

**Part 3B: tamper after Run → Replay → Export (fixture)**

| ID | Tamper | Replay | Failed flags | Export |
|---|---|---|---|---|
| B1 | stored disposition | DIVERGENCE | disposition, record | refused (divergent) |
| B1b | disposition + label, consistent | DIVERGENCE | disposition, record | refused |
| B2 | stored contract hash | DIVERGENCE | contract, record | refused |
| B3 | `scenarios[]` rationale text | DIVERGENCE | contract, authored | refused |
| B3b | `scenarios[]` disposition | DIVERGENCE | disposition, contract, authored | refused |
| B4 | stored expected source hash | DIVERGENCE | record | refused |
| B5 | stored observed source hash | DIVERGENCE | source, record | refused |
| B6 | event-log line | DIVERGENCE | record | refused |
| B7 | prediction + label | DIVERGENCE | record, authored | refused |
| B8 | comparison + label | DIVERGENCE | record | refused |
| B9 | rationale | DIVERGENCE | record | refused |
| B10 | **consistent multi-field forgery** (prediction → B+R, comparison → EXACT, event log, core hash recomputed with the page's own `evidenceCoreHash`) | **CONSISTENT** | — | **emitted, PASS** |
| B10b | rationale + recomputed core | DIVERGENCE | authored | refused |

**Part 3C: Run → Replay CONSISTENT → tamper → Export (export-time recheck, fixture)**

| Tamper after replay | Export |
|---|---|
| contract hash | refused (`contract_hash, stored_record_integrity`) |
| `scenarios[]` text | refused (`contract_hash, authored_state_integrity`) |
| event log | refused (`event_log, stored_record_integrity`) |
| disposition + label | refused (`stored_record_integrity`) |
| prediction + label | refused (`event_log, stored_record_integrity, authored_state_integrity`) |
| observed source hash | refused (`source_matches_run, stored_record_integrity`) |
| expected source hash | refused (`stored_record_integrity`) |
| rationale | refused (`stored_record_integrity`) |
| `harness_commit` → `ffff…` | **emitted, PASS, with the forged commit** |
| restrictions / JANUS attribution → "SOMEONE ELSE" | **emitted, PASS** |
| `generated_at` / `repository` | **emitted, PASS** |

With **no Replay at all**, the same 11 tampers gave identical outcomes. Export does not depend on a prior Replay.

**Part 8 edge cases**

| Case | Result |
|---|---|
| Replay before Run | disabled; a direct call is a no-op |
| Replay after Reset | "No replay performed." |
| Replay after selector change | "No replay performed for the current selection." |
| Contract removed | REPLAY REFUSED; Export alert |
| Stored `scenario_id` malformed | REPLAY REFUSED; Export refused |
| Stored prediction `__proto__` | REPLAY REFUSED; Export refused |
| Scenario object missing `commitments` | uncaught TypeError; UI stuck on "Verifying…" (V03-NEW-05) |

**Conclusion:** the detection logic is sound for every covered field, at both Replay and Export. The *baseline* is broken (V03-NEW-01).

### Evidence-core hash (Part 3D)

- **Covered:**
  - `version`, `build_id`;
  - the entire `source_document` object, including **`checked_at`**, `bytes`, `hash_match` and `verification`;
  - `contract_sha256`;
  - scenario id, name, summary and perturbation;
  - prediction and label, disposition and label, comparison and label;
  - compatibility set and reason;
  - the 4 cards;
  - commitments, rationale, open question, evidence required, sources and event log.
- **Not covered:** `harness`, `generated_at`, `repository`, `harness_commit`, `harness_commit_provenance`, `evaluation_mode`, `restrictions`, both attributions, and the export-only `exported_at`, `integrity_status`, `integrity_checks` and `replay`.
- **Canonical form:** `JSON.stringify` of an object literal in fixed insertion order (no key sorting), UTF-8, SHA-256.
- **Independent recreation:** Node reproduced **36/36** stored hashes. Changing any covered field changes the hash. Changing an uncovered field does not.
- **Intentional or not?** The exclusion of commit and attribution is not documented as intentional. README says the export "includes … the full GitHub `main` commit" and lists integrity checks without saying that the commit is outside them. The inclusion of `checked_at` is clearly unintentional.
- **What it protects:** the *authored assessment content* against naive or single-field edits made after Run.
- **What it does not protect:** provenance fields; forgery by anyone who recomputes the hash (it is unkeyed); or the record once it leaves the browser.

---

## 10. Export / provenance results (Parts 3E, 3F, 9)

**Live, 0 evidence files can be exported**, so every field check below comes from fixture exports (LA/ESCALATE and others).

| Field | Present (fixture) | Note |
|---|---|---|
| `version` / `build_id` | ✔ | `0.3` / symbolic string |
| `harness_commit` (full 40-hex) | ✔ | `d79b0385c5b041772580121deaaf1531c8d4a845` in 36/36 runs while the API quota lasted. **It is GitHub `main` HEAD fetched at Run time, not the deployed build.** |
| `generated_at` / `exported_at` | ✔ / ✔ | distinct fields (NEW-07d) |
| absolute source URL | ✔ | `https://newsomek.github.io/…/docs/JANUS_Orientation_Edition_2026_EN.docx`; fetched with HTTP 200 during deployment verification |
| expected / observed source SHA-256 | ✔ / ✔ | equal to the live hash |
| contract SHA-256 / evidence-core SHA-256 | ✔ / ✔ | contract independently equal; core independently equal |
| scenario, summary, perturbation, prediction, disposition, comparison (+ labels) | ✔ | |
| compatibility set + reason | ✔ | |
| support classifications, `evidence_required`, event log | ✔ | |
| replay result | ✔ | or `{status:"NOT PERFORMED BEFORE EXPORT"}` |
| integrity result | ✔ | `integrity_status:"PASS"` plus a 12-key `integrity_checks` map |
| attributions, restrictions | ✔ | 7 restrictions, including "not cryptographically signed or tamper-proof" |

**Commit-provenance tests (3E)**

| Case | Result |
|---|---|
| Natural quota exhaustion (live) | After the unauthenticated quota ran out, Runs proceeded with `harness_commit: null` and note "Commit lookup unavailable: HTTP 403". **No UI warning.** |
| Simulated 403 (fixture) | Export emitted with **`harness_commit: null` and `integrity_status: PASS`** |
| Simulated network error | `null`; the Run proceeds |
| Simulated API returning another SHA | That SHA was recorded, and Replay was CONSISTENT (fixture) |
| `harness_commit` tampered after Run | Exported with PASS |

**Verdict:** the full SHA is present and correct whenever the API answers. But it records what `main` pointed to at that moment, not what code the browser is running. It is silently absent after 60 runs per hour per IP, and it is not integrity-protected (V03-NEW-02).

---

## 11. Async-race results (Part 3G)

| ID | Sequence (same JS task unless noted) | Result |
|---|---|---|
| R1 | Run S01 → switch scenario | PASS: `lastRun` null, result hidden, Replay/Export off, direct Export 0 files |
| R2 | Run → change prediction | PASS |
| R3 | Replay → change prediction | PASS: no TypeError (it threw in v0.2) |
| R4 | Run → Reset | PASS |
| R5 | Run S01 → switch S06 → Run S06 | PASS: only the S06 state |
| R6 | Replay → Reset → direct Export | PASS: 0 files, no alert |
| R7 | Export in flight → scenario change | PASS: 0 files |
| R8 | `runChallenge` ×2 with a prediction change in between | PASS: the later one wins |
| R9 | Replay in flight → change prediction → Run | PASS |

**9/9 pass, 0 exceptions. NEW-01 FIXED.**

---

## 12. Prediction-validation results (Part 3H)

The injected `<option>` values `constructor`, `toString`, `__proto__`, `prototype`, `valueOf`, `hasOwnProperty`, `FOO`, `block`, `"BLOCK "`, `" "` and `CONTINUE​` were each run twice: once with Run disabled by the UI, and once forced by enabling the button and calling `runChallenge()` directly.

| Measure | Result |
|---|---|
| Refused | **11/11** |
| Function text in the log | none |
| Export | 0 files |
| Uncaught exceptions | 0 |

An injected scenario value `__proto__` produced "Invalid scenario selection." and a refusal.

**Residual:** none of these refusals shows a reason. The page just says "No challenge has been run for this selection." (V03-NEW-04).

---

## 13. Compatibility-rule audit (Part 3J)

| Sc. | Encoded | Set (UI = behaviour, 36/36) | Rationale shown | In export | Assessment |
|---|---|---|---|---|---|
| 01 | B+R | BLOCK, ESCALATE | ✔ | ✔ (fixture) | Coherent. ESCALATE rests on the execution card ("reevaluation under the applicable governance process") and §33 "escalation point" |
| 02 | BLOCK | B+R, ESCALATE | ✔ | ✔ | Coherent |
| 03 | B+R | BLOCK, ESCALATE | ✔ | ✔ | Coherent. INSUF → DIFFERENT is defensible only because the scenario *stipulates* a validity bound (the source has 0 mentions of expiry). That is disclosed |
| 04 | B+R | BLOCK, CONTINUE, ESCALATE | ✔ | ✔ | Coherent with the scoped CONTINUE glossary ("within the currently supported and authorized scope"). ESCALATE rests on §24 "the governance process decides" |
| 05 | INSUF | BLOCK, ESCALATE | ✔ | ✔ | Coherent. The B+R exclusion is unexplained |
| 06 | INSUF | BLOCK, ESCALATE, ROLLBACK/COMP | ✔ | ✔ | CONTINUE → DIFFERENT is now disclosed and consistent with the glossary, since no authorised scope remains. **B+R → DIFFERENT while BLOCK → PARTIAL is not explained**, although B+R is "BLOCK, and obtain new authority if execution is still desired" |

**The rule is disclosed, internally coherent and consistent with behaviour.** One interpretive concern (INT-01) is logged, not a software defect: the reasons explain what is *included* but, except for S06 CONTINUE, not what is *excluded*. S05 and S06 B+R are the cells a reviewer is most likely to dispute.

---

## 14. Support-status audit (Part 3I)

| Check | Result |
|---|---|
| UI glossary | DIRECTLY SUPPORTED / REASONABLE INFERENCE / EXTENDED / BY ANALOGY / OPEN, each with a distinct definition ✔ |
| README glossary | identical ✔ |
| Naming | The harness uses **"OPEN"**, not "OPEN / UNSPECIFIED". The meaning is equivalent ("does not specify the mechanism or rule") |
| Relabels | S02 #2, S03 #1, S05 #2 → REASONABLE INFERENCE ✔ |
| S03 §26 | Named in the §27 source line. Verified: §26 "Open Architecture" has the row "Memory — provenance and scope of validity" ✔ |
| Styles | direct `rgb(143,213,170)`, **inference `rgb(212,180,255)`**, **extended `rgb(159,210,255)`**, open `rgb(232,207,125)`: 4 distinct ✔ |
| Minor | The glossary terms themselves are not colour-keyed to the badges (cosmetic) |

**Label vs my source reading:** 18/18 commitment labels are acceptable. One is arguably *conservative*, not overstated: S02 #1 marks §28 as EXTENDED, although evidence contradicting evidence is itself a data conflict.

---

## 15. Determinism results (Part 6)

For each scenario the same prediction was used throughout: S01 CONTINUE, S02 BLOCK, S03 ESCALATE, S04 B+R, S05 INSUF, S06 ROLLBACK. Each got 3 runs with Reset in between (18 runs), plus one run after a full page reload, which was run once the GitHub API quota had reset so that commit provenance was live (6 runs, each on a freshly reloaded page with no prior state).

The fingerprint covers:

- disposition, comparison, rationale, commitments, compatibility set and reason;
- event log, contract hash, expected and observed source hash, commit;
- replay flags and result, and export outcome;
- all displayed text;
- the key sets of the record and the replay object.

| Scenario | Stable fingerprint (16) | Identical across runs | Evidence-core SHA (per run) |
|---|---|---|---|
| 01 | 3929b44581e4095d | 3/3 + reload 1/1 = **4/4** | 6d4fe7950e · 332c753df7 · 6b3832c96a · reload b9e9dae9eb — **all different** |
| 02 | ec1bd536cedf0d12 | 3/3 + reload 1/1 = **4/4** | d6217ca955 · 7ab721692e · cc5107dad5 · reload 62d0dc2fa9 |
| 03 | 98d75d4487f2b04e | 3/3 + reload 1/1 = **4/4** | b8babc4a9e · 3d65dd04b2 · 6d40ab0a6b · reload 2c932a3353 |
| 04 | 00a6222115b9618e | 3/3 + reload 1/1 = **4/4** | 5d8fdc2982 · 7fd93d2548 · 5d130f305d · reload 0a8eaed3f7 |
| 05 | b2ec3befe7ed5aee | 3/3 + reload 1/1 = **4/4** | 99413f75fe · ed7feb721d · 8a99e22701 · reload edb90bef0a |
| 06 | d4f096f72fcc38f8 | 3/3 + reload 1/1 = **4/4** | 091ac270f4 · d659f3aeb3 · ef19f1a66e · reload b863158208 |

**Assessment, contract, source, event log, compatibility, commit and export outcome are deterministic.** Ignoring timestamps, 0 divergences.

The **evidence-core hash is not deterministic**, because it absorbs a timestamp. That is the same defect as V03-NEW-01. v0.2's 24/24 identical result included no such hash. The export *structure* could only be compared under the fixture, where every export had the identical 40-key set.

---

## 16. State-isolation results (Part 7)

| Seq. | Steps | Result |
|---|---|---|
| A | S01 Run → switch S06 (no Run; Replay/Export attempts give 0 files) → S06 Run → S03 Run → Reset → S02 Run | PASS. Each Run shows only its own scenario. The switch shows "Scenario changed…" with Replay/Export off |
| B | S05 Run → prediction change (attempts give 0 files) → switch S04 (attempts give 0 files) → S04 Run → Reset → S06 Run | PASS |
| C | S01 Run → scripted switch S06 → Run (same task) | PASS: S06 only |
| D | S04 Run → Replay → Replay click + immediate Reset → direct Export | PASS: `lastRun` and `lastReplay` null, 0 files. (After the first Replay, Export was already off because of V03-NEW-01.) |

**No stale state survived. 0 uncaught errors.**

---

## 17. Source-conformance analysis (Part 10, Orientation Edition only)

Term counts from the pandoc text:

- 0 occurrences: "expir", "revok/revoc", "rollback/roll back", "compensat", "precedence", "hierarch", "jurisdiction", "reauthor", "in-flight";
- 1 occurrence: "fail-closed" (§32) and "no transition" (§32);
- 2 occurrences: "escalat" (§33, appendix).

| # | Overall | Detail | v0.3 labels vs my reading |
|---|---|---|---|
| 01 | **REASONABLE INFERENCE**; core BLOCK **DIRECTLY SUPPORTED** | §19 "Authorization is a separate fact, with its own owner, history and conditions" + §32 "When a condition is not met, the system should prefer no transition over a silent bypass". Commitment #2 matches §19 "That does not automatically imply the right to carry it out." "Reauthorize" is disclosed as shorthand. | match |
| 02 | **REASONABLE INFERENCE** | §06 Evidence/Decision/Authorization pairs; §29 "an error must not be given more power than its real grounding justifies"; §38 refusal of an unjustified transition. The evidence → authority dependency is unstated (OPEN). §27 ("new knowledge does not have to erase the old history") would support "A1 remains valid as history" but is not cited. | match (§28 EXTENDED is conservative) |
| 03 | **REASONABLE INFERENCE** on a stipulated bound | Expiry does not exist in the source. §39 "Conditions can change, and trust must have a context"; §27 history; §26 memory scope-of-validity used as analogy. | match |
| 04 | **DIRECTLY SUPPORTED** | §22 "must not constitute a standalone right to expand its permissions"; §24 "A new ability should not automatically receive a new level of authority"; §38 "An improved model is not, in itself, consent to greater power". | match |
| 05 | INSUF **DIRECTLY SUPPORTED by absence**; constraint **REASONABLE INFERENCE** | No precedence or hierarchy language. §32 applies "when a condition is not met", and whether O2's prohibition counts as an unmet condition is itself the open question. §38 "A lack of grounds should not be turned into apparent certainty"; §33 escalation point. | match (now INFERENCE) |
| 06 | **REASONABLE INFERENCE** (strong) | §20 execution as an accountable boundary event; §31 "who had the authority and what actually happened"; §01 "not an implementation specification". | match |

**Contradicted by source: 0. Insufficiently supported: 0.** v0.3's labels now match my reading in 18/18 commitments.

*Outside reasoning, not JANUS.* The harness's replay concept can be checked against JANUS's own §30 ("Replay — whether the event history can be reconstructed"; "Reproduce — whether the result can be obtained again under controlled conditions"; "Mutation — whether a structural change really breaks or alters a detectable property"). By that standard:

- v0.3 passes *Mutation*: covered-field tampers are detected;
- v0.3 fails *Reproduce*: an honest run cannot be re-obtained.

I use this only as a framing device, not as a JANUS requirement on the harness.

---

## 18. New v0.3 defects

**V03-NEW-01 · Critical · software defect (evidence integrity): volatile timestamp inside the hashed evidence core**

- **Repro:** open the live site → choose any scenario and prediction → Run → Replay. Or: Run → Export.
- **Expected:** REPLAY CONSISTENT, and a normal evidence file.
- **Actual:**
  - Replay reports `REPLAY DIVERGENCE — export blocked until a new clean run` with `authored_state_match:false` (36/36, 18/18, 6/6, 4/4).
  - Export is refused before Replay with `authored_state_integrity` (36/36) and after Replay as "divergent" (36/36).
- **Evidence:**
  - `evidenceCore()` includes `source_document: record.source_document`, whose `checked_at` is `new Date().toISOString()` at every `observeSourceDocument()` call.
  - `replayLastRun()` and `exportEvidence()` each re-observe the source and rebuild the record, so the timestamp always differs.
  - Node reproduced 36/36 stored hashes, and a +1 ms shift in `checked_at` changes all 36.
  - The fixed-clock fixture gives CONSISTENT and PASS.
  - Screenshot of a clean-run divergence taken in session.
- **Impact:**
  - No user can obtain evidence.
  - Replay's divergence signal becomes a 100% false positive, so it cannot distinguish tampering from honest use.
  - README/UI claims about replay and export are untrue in practice.
  - It fails closed: no bad evidence escapes.
- **Fix (bounded):** build the core from stable source fields only: `{title,url,path,expected_sha256,observed_sha256,bytes}`. Keep `checked_at`, `hash_match` and `verification` outside the core, or record the replay and export observations in separate objects. Then add a smoke test before tagging (Playwright: Run → Replay CONSISTENT → Export PASS for 6 scenarios).

**V03-NEW-02 · Medium · evidence-integrity weakness: commit provenance is observed, not bound**

- **Repro:** §10.
- **Expected:** the export carries the full commit of the code actually served, protected by the integrity check, with an explicit status when unavailable.
- **Actual:**
  - `harness_commit` = GitHub `main` HEAD fetched at Run time (unauthenticated API).
  - After the 60/h per-IP quota it is `null` with no UI warning. The export (fixture) is still `integrity_status: PASS`.
  - Any SHA the API returns is accepted.
  - The field is outside the evidence core, and a forged value exports with PASS.
  - If `main` moves ahead of the Pages deployment, the record names code that was not run.
- **Impact:** DEF-03's key requirement (the full deployed SHA in every export) is only conditionally met, and it is neither verifiable nor protected.
- **Fix:** stamp the commit at build/deploy time, for example a GitHub Actions step writing `build-info.json` or a `<meta>` tag. Include it in the core. Treat the API lookup as optional corroboration (`commit_verification: MATCH/MISMATCH/UNAVAILABLE`). Show a visible provenance status.

**V03-NEW-03 · Low · evidence-integrity weakness / wording: PASS covers less than it appears to**

- `restrictions`, both attributions, `generated_at` and `repository` can be edited before Export and still export `integrity_status: PASS`.
- README's list of checks is accurate, but a reader will take `integrity_status: PASS` on the whole record as whole-record integrity.
- **Fix:** include them in the core, or rename the field `evidence_core_integrity`.

**V03-NEW-04 · Medium · software defect (observability): refusal reasons are hidden**

- **Repro:** serve a one-byte-altered `.docx` (or a 404, or a network error) at Run. Or force a Run with an invalid prediction or scenario.
- **Expected:** a visible "Execution refused: …" message.
- **Actual:** `invalidateRun(reason, false)` sets `staleNotice.hidden = true` and blanks the text. The user sees only "No challenge has been run for this selection."
- **Impact:** the exact event that v0.3's source hashing exists to surface (a source mismatch) is invisible, and looks the same as the user not having clicked Run.
- **Fix:** show refusal reasons regardless of `hadEvidence`, for example with a separate `refusalNotice`.

**V03-NEW-05 · Low · software defect (robustness): unhandled error on a malformed contract**

- **Repro:** delete a scenario's `commitments` in memory → Run.
- **Actual:** `TypeError` thrown after the source fetch. The UI stays on "Verifying source bytes and building evidence state…" with Run disabled.
- **Fix:** try/catch around `buildEvidence`, plus schema validation of the contract.

**V03-NEW-06 · Observation · carry-over NEW-07(c)**

- The hidden result DOM keeps the previous disposition, badge, rationale and compatibility after invalidation.
- **Fix:** clear the fields in `invalidateRun()`.

**V03-NEW-07 · Observation · inherent limit: self-consistent forgery**

- Rewriting prediction, comparison and event log and recomputing the core hash with the page's own function passes both Replay and Export (B10).
- The record is identical to a genuine B+R run, and the unkeyed hash cannot prevent this.
- The harness does not claim otherwise ("not cryptographically signed or tamper-proof"). **Not an overclaim.**

**V03-NEW-08 · Observation · wording**

- The About panel heading still reads "Independent v0.1 test record".
- CHANGELOG places v0.2 above v0.3.
- README and UI statements that Replay "checks … the recorded evidence core" and that "a replay divergence disables ordinary export until a new clean run" are true in design only while V03-NEW-01 exists, because no clean run is possible.

**INT-01 · Observation · interpretive disagreement (not a software defect)**

- S05 and S06 BLOCK + REAUTHORIZE → DIFFERENT, while BLOCK → PARTIAL.
- For S06, B+R ("do not proceed on the current authority; obtain new authorization if still desired") is at least as compatible as bare BLOCK.
- **Suggest:** add a one-line exclusion reason, or add B+R to the S06 set.

---

## 19. Remaining assumptions / overreach

1. **Materiality** (S01, S02) and **validity bounds** (S03) are stipulated. This is disclosed.
2. **"Reauthorize"** is harness vocabulary (0 occurrences in the source). This is disclosed. In S04 it remains semantically odd, since beyond-S1 authority never existed to be *re*-authorized.
3. **The compatibility sets** are harness interpretations. This is disclosed and coherent, with INT-01 open.
4. **Provenance claims** such as "full GitHub main commit" and "integrity PASS" exceed what is bound and protected (V03-NEW-02 and NEW-03).
5. **Replay and export claims** are currently true in design but not in operation (V03-NEW-01).
6. **Authored vs runtime.** This is correctly bounded in v0.3:
   - "Encoded orientation-level assessment" and "authored … not a measured result from a JANUS implementation or a runtime rule engine";
   - the replay limitation "not an independent JANUS runtime execution";
   - 7 export restrictions.

   No runtime-execution overclaim was found.

---

## 20. JANUS questions still exposed

1. What event invalidates an authorization when one of its conditions changes, and is a new authorization fact required (S01)?
2. Is authorization formally dependent on the evidence behind the decision, and how is that dependency represented (S02)?
3. How is authorization lifetime represented: expiry, policy validity, state dependency (S03)?
4. What verification evidence and governance event would expanded authority require (S04)?
5. How are two simultaneously applicable, conflicting authority owners resolved: precedence, jurisdiction, hierarchy or escalation (S05)?
6. How are in-flight actions classified when authority disappears: stop, safe completion, rollback, compensation or escalation (S06)?

These are **INSUFFICIENT SPECIFICATION** questions at orientation level (§01 "not an implementation specification"), not JANUS failures.

---

## 21. v0.2 → v0.3 comparison

| Area | v0.2 | v0.3 |
|---|---|---|
| Source hash | a constant compared with itself | **real byte hashing, detects substitution** |
| Replay on a clean run | 36/36 CONSISTENT | **36/36 DIVERGENCE (false positive)** |
| Tamper detection at Replay | 5/13 | **all covered fields** (12/12 effective non-forgery cases) |
| Export gate | 2 checks; divergent/tampered records exported | **12 checks; tampered records refused**, but so is every honest record |
| Exports produced | 36/36 | **0/72** |
| Commit in export | none | full SHA when the API answers (observed `main`, unprotected) |
| Absolute source URL / `exported_at` | ✘ / ✘ | ✔ / ✔ |
| Races | 4/4 fail | **9/9 pass** |
| Prototype predictions | accepted | **refused** |
| Compatibility sets | hidden | **disclosed and exported** |
| Support statuses | 3 overstated, undefined | **precise, defined, styled** |
| Refusal feedback | n/a | hidden (new) |

---

## 22. Final accounting

| Category | Count |
|---|---|
| Primary runs / replays / export attempts | 36 / 36 / 72 |
| Automated per-run checks | 576 (0 failures) |
| Independent Node checks (contract, event log, core, comparison, disposition, commit per run) | 216 (0 failures) |
| Clean replays reporting DIVERGENCE (unfixtured) | 36 primary + 18 determinism + 6 reload + 4 repeat |
| Evidence files emitted, unfixtured | **0** |
| Tamper cases (3B / 3C / no-replay) | 14 / 12 / 11 |
| Source-byte / fetch cases | 7 |
| Commit-provenance cases | 5 (+ natural quota exhaustion) |
| Race cases | 9 (9 pass) |
| Prediction / scenario injection | 11 / 1 (all refused) |
| Replay edge cases | 9 |
| Determinism runs | 18 Reset + 6 reload |
| State-isolation sequences | 4 (4 pass) |
| DEF-02 / DEF-03 / DEF-10 | REGRESSED / REGRESSED / FIXED |
| NEW-01…07 | 5 FIXED, 2 PARTIALLY FIXED |
| New findings | **1 Critical, 2 Medium, 2 Low, 3 Observations, plus 1 interpretive (INT-01)** |
| Source contradicted / insufficiently supported | 0 / 0 |

### Explicit answers

**A. Did v0.3 fully close DEF-02, DEF-03 and DEF-10?**

No.

- **DEF-10 is fixed.**
- **DEF-02 and DEF-03 regressed.** Their detection and provenance design is correct, but on the live site Replay always diverges and no evidence can be exported (V03-NEW-01). Commit provenance is also weak (V03-NEW-02).

**B. Did v0.3 fully close NEW-01 through NEW-07?**

No.

- NEW-01, 02, 04, 05 and 06 are **fixed**.
- NEW-03 is **partially fixed**: provenance and attribution fields are uncovered, and the gate over-blocks.
- NEW-07 is **partially fixed**: the hidden stale DOM remains.

**C. Did v0.3 introduce any new Critical, High or Medium defects?**

Yes:

- **1 Critical:** V03-NEW-01;
- **2 Medium:** V03-NEW-02 (commit provenance) and V03-NEW-04 (refusal reasons hidden);
- no High.

**D. Does the harness now truthfully support its own claims about source hashing, replay, integrity and export provenance?**

- **Source hashing: yes.**
- **Replay: no.** Every clean replay reports divergence.
- **Integrity: partly.** Detection of covered-field tampering is real, but the check cannot pass on honest data, and PASS does not cover commit or attribution.
- **Export provenance: no.** No export can be produced, and the commit is observed, not bound.

**E. Is v0.3 ready to share with Eryk for architectural challenge purposes?**

**No, not as the tested commit.** The architectural *content* is in good shape and consistent with the source: 0 contradictions, precise labels and disclosed compatibility. But the evidence machinery that v0.3 presents as its main improvement does not work on the live site. A challenger who presses Replay will see "REPLAY DIVERGENCE" on an untouched run. **I do not recommend tagging `d79b038` as `v0.3-reviewed`.**

**F. What should change before sharing?** Each item is bounded and incremental.

1. **V03-NEW-01 (required).** Remove `checked_at`, and any other per-observation metadata, from `evidenceCore()`. Hash a stable source subset.
2. **Add a pre-tag smoke test (required).** On the deployed URL: Run → Replay CONSISTENT → Export PASS, for all 6 scenarios.
3. **V03-NEW-02 (strongly recommended).**
   - Bind the commit at deploy time and include it in the core.
   - Mark API corroboration as MATCH / MISMATCH / UNAVAILABLE.
   - Surface the provenance status in the UI.
4. **V03-NEW-04 (recommended).** Display refusal reasons, especially a source-hash mismatch.
5. **Optional.**
   - V03-NEW-03: cover the attribution and restrictions fields, or rename the status field.
   - V03-NEW-05: try/catch around evidence building.
   - V03-NEW-06: clear the hidden DOM.
   - INT-01: add exclusion reasons.
   - V03-NEW-08: wording fixes.

Then re-run this regression. If it is clean, tag that commit (for example `v0.3.1-reviewed`).

---

## 23. Raw results appendix

`JANUS_Harness_v0.3_raw_results.json` contains:

- tested commit, URL, baselines and deployment verification;
- source expected and observed SHA;
- independently derived contracts;
- **all 36 primary runs**, each with:
  - full content: cards, commitments, rationale, sources, open question, evidence and event log;
  - compatibility set and reason;
  - timestamps, commit, contract hash, stored and re-derived core hashes, event-log hash;
  - replay flags, both export attempts and 16 check results;
  - independent Node checks and the v0.2 comparison;
- root-cause confirmation;
- evidence-core coverage;
- tamper tests (3B / 3C / no-replay), source-hash tests, commit-provenance tests, race tests, prediction validation and replay edge cases;
- state isolation and determinism (Reset and reload);
- support-status checks and compatibility sets;
- v0.2 defect closure, new v0.3 defects, source conformance and final counts.

**Minimal reproduction of V03-NEW-01** (browser console, live site): choose any scenario and prediction → Run → Replay, and read `authored_state_match: false`. Then:

```js
const a = await evidenceCoreHash(lastRun);
const b = await evidenceCoreHash({...lastRun, source_document: {...lastRun.source_document, checked_at: new Date().toISOString()}});
a === lastRun.evidence_integrity_sha256; // true
a === b;                                  // false: only checked_at differs
```
