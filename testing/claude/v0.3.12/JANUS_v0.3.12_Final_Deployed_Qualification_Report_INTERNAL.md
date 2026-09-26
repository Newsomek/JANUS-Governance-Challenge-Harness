# JANUS Governance Challenge Harness v0.3.12: Final Deployed-Artifact Qualification Test (Internal)

**Result: v1.0 promotion is NOT technically qualified. Open actionable findings: 1 (Low).**

All six scenarios, replay, export, integrity, invalidation and release-identity checks passed on the live deployed artifact. One Low-severity provenance-labelling finding is still open: V0312-F01, a stale `"version": "0.3.9"` in the contract-hash verification oracle that every export tells verifiers to use. Under the zero-open-finding rule, this blocks promotion.

This test decides only whether promotion may begin. It is not the v1.0 test, and it does not approve or release v1.0.

| Item | Value |
|---|---|
| Test date | 2026-09-25, 19:52–20:40 UTC (15:52–16:40 America/New_York) |
| Tester | Claude, independent. No repository writes, commits, tags, branches, releases or PRs. |
| Artifact tested | The live GitHub Pages deployment, through the page's own UI in a real Chrome browser |
| Raw evidence | `raw-evidence/` (kept separate from this report). See `raw-evidence/JANUS_v0.3.12_final_qualification_raw_evidence.txt`. |

---

## 1. Release identity

| Field | Expected | Observed on the deployed artifact | Result |
|---|---|---|---|
| Deployed URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ | same | ✅ |
| Version | `0.3.12` | title, eyebrow, footer, `build-info.json`, all exports | ✅ |
| Build ID | `janus-governance-challenge-harness-v0.3.12` | `build-info.json`, all exports | ✅ |
| Commit A (bound code) | `df8c2f54cc0bb55e82e2f36a8c0309d924e5a1d9` | `build-info.code_commit`, `BOUND_RELEASE_STATE.code_commit`, UI provenance line, all exports | ✅ |
| Commit A tree | `8400244b9f5908f9a096caa3d69f09af86cf6ec5` | served `BOUND_RELEASE_STATE.code_tree`; GitHub API `git/commits/<A>.tree` | ✅ |
| Release HEAD (Commit B) | `d26322339b425836c309068d5500e26517e0eab5` | GitHub API `commits/main`; export `deployment_head_observed` (once the API was reachable) | ✅ |
| Commit B shape | single parent A; changes only the two provenance files | parents = [A]; files = `build-info.json`, `docs/BOUND_RELEASE_STATE.json` | ✅ |
| Source SHA-256 | `21766f5d…551fe4` | served docx re-hashed in-browser, 50,354 bytes; all exports expected == observed | ✅ |
| `app.js` SHA-256 | `3e06a642…c17c408` | served bytes (plain and `?cb=`), raw @A, raw @B, all exports | ✅ |
| Complete served manifest | 110 files | 110/110 fetched with HTTP 200, every hash equal | ✅ |
| Browser / environment | — | Chrome 153 (Windows 10 x64 UA) through Claude in Chrome | — |

**Staleness:** excluded. Checked with `cache: 'no-store'`, `?cb=` busting and a fresh navigation. `app.js` Last-Modified is 19:23:51 GMT, after Commit B (19:19:25Z). Every surface reports 0.3.12. The only visible "v0.3.11" is a historical sentence about the prior test.

---

## 2. Six-scenario test matrix (live UI)

| # | Scenario | Expected | Observed | Run | Comparison | Replay | Export | Integrity | Result |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Authorization condition changes after approval | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | ✅ | EXACT | CONSISTENT | ✅ enabled, exported | PASS 15/15 | **PASS** |
| 2 | Evidence changes after authorization | BLOCK | BLOCK | ✅ | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 3 | Authorization expires before execution | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | ✅ | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 4 | Learning attempts to expand authority | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | ✅ | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 5 | Two legitimate authorities conflict | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | ✅ | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 6 | Authority is revoked during execution | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | ✅ | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |

Checks that applied to every row:

- **During the runs:** no refusal, error, stale notice or alert appeared.
- **UI provenance:** the UI line read "Bound code commit: df8c2f54…", with "Served app.js hash verified" and "Bound commit corroboration: MATCH".
- **UI vs export:** every displayed explanation field matched the exported record verbatim. This was checked in-page.
- **Replay sub-checks:** all eight were true: disposition, contract, source, code, record integrity, stored core, authored state and replay.
- **Contract hashes:** all six `contract_sha256` values equal the served `EXPECTED_CONTRACT_HASHES.json` entries.

**Export file checks (all six, byte-exact files):**

- `version` is 0.3.12, `build_id` is correct, and `harness_code_commit` is Commit A.
- Source expected hash == observed hash == `21766f5d…`.
- `app_js_hash_match` is true, `integrity_status` is PASS, and every `integrity_checks` value is true.
- `replay.result` is REPLAY CONSISTENT, and the rederived evidence-core hash equals the stored and original hashes. This is a real re-derivation, not an echo of the display.
- `export_provenance.bound_code_commit` is Commit A.
- The `restrictions` array states that the harness does not implement, emulate, penetrate or security-test JANUS, and does not validate JANUS internals.

**Note on corroboration:** in the six primary exports, `commit_verification` is `UNAVAILABLE` ("HTTP 403"). The unauthenticated GitHub API rate limit in this browser was exhausted. The harness reported this honestly and did not claim MATCH.

A later export, made once the API was reachable, recorded `deployment_head_observed = d2632233…`, parent Commit A and `commit_verification = MATCH`. It is saved in `raw-evidence/supplementary-negative-path/`.

---

## 3. Governance-content assessment

The served docx was parsed in the browser, and every cited section was checked against its text. Details are in raw evidence §8.

| # | What changed | What remains valid | Invalid / uncertain | Execution guidance | Support categories | Invents beyond the Orientation Edition? | Result |
|---|---|---|---|---|---|---|---|
| 1 | The authorization condition C1→C2 | E1 and the reasoning behind D1, unless C2 affects their basis | Current execution permission cannot be inferred from A1 alone | "Do not proceed on A1 alone"; reevaluate under the applicable process | DIRECT ×2 (§01, §19); OPEN (reauthorization protocol) | No. "Reauthorize" is labelled harness shorthand, not a JANUS term. | PASS |
| 2 | New evidence E2 contradicts E1 | The A1 grant remains valid *as history* | The assumption that historical authorization is executable without reevaluation | Do not proceed; keep the contradiction explicit; reevaluate | ANALOGY (§28 data→evidence conflict); INFERENCE (history ≠ current justification); OPEN (evidence→authority dependency) | No. It explicitly leaves suspension, revocation and reissue unspecified. | PASS |
| 3 | The stipulated validity bound lapsed | A1 still proves authorization existed | "Previously authorized ≠ currently authorized" under the stipulated bound | Do not proceed on expired authority; a new valid state is needed | INFERENCE; ANALOGY (§26 memory scope-of-validity); OPEN (no TTL or expiry object) | No. It states that the Orientation Edition does not define expiry and that the bound is a scenario stipulation. | PASS |
| 4 | Capability or confidence increased | Performance history and C2 as *evidence for a proposal*; S1 work if separately authorized | The assumption that capability enlarges permission beyond S1 | Continue only in authorized scope; block out-of-scope use | DIRECT ×2 (§22, §24, §38); OPEN (verification event not specified) | No | PASS |
| 5 | Two simultaneous valid-looking authorities | Both records within their own scopes | The assumption of a universal precedence rule | Mechanism insufficiently specified; do not silently select O1; preserve the conflict and escalate | ANALOGY (§28, explicitly marked); INFERENCE (fail-closed, §32/§38); OPEN (hierarchy) | No. It explicitly denies an authority lattice or precedence system. | PASS |
| 6 | Authority lost mid-execution | X1 began under valid authorization (history) | The assumption of one universal in-flight response | Accountable boundary established; stop, complete, rollback, compensate and escalate are all unspecified | DIRECT (§06, §20); INFERENCE ("revocation" not a named JANUS event); OPEN | No. "The harness therefore refuses to invent one." | PASS |

**Distinctions preserved.** Each is demonstrated by at least one live scenario:

- evidence ≠ decision (2);
- decision ≠ authorization (1);
- authorization ≠ execution (1, 6);
- capability ≠ authority (4);
- historical ≠ current authorization (1, 2, 3);
- history ≠ current execution permission (1, 3);
- a changed evidentiary basis is not ignored (2);
- learning does not expand authority (4);
- conflict is not converted into permission (5);
- INSUFFICIENT SPECIFICATION is used where no mechanism is published (5, 6);
- execution is an accountable boundary (6).

Open questions stay visible in every scenario. Support-category use is sensible and internally consistent: analogies are labelled as analogies, and OPEN appears exactly where the docx is silent. The compatibility sets and "DIFFERENT" explanations are coherent; this was checked with five extra live prediction probes.

---

## 4. Behavioral / invalidation matrix

| Check | Observed | Result |
|---|---|---|
| Initial controls | Run, Replay and Export disabled; no result; Reset enabled | ✅ |
| Missing prediction refusal | Run disabled. A force-enabled Run with an empty prediction produced no result. | ✅ |
| Scenario-change invalidation | Result, log and replay replaced by "Selection changed…"; Replay and Export disabled. Forced Export or Replay gave 0 Blobs. Switching back did not resurrect the old result. | ✅ |
| Prediction-change invalidation | Same as above. Forced Export gave 0 Blobs. | ✅ |
| Reset | No-result state; prediction cleared; Run, Replay and Export disabled. Scenario selection kept (I-05). | ✅ |
| Replay availability | Enabled only after a successful Run | ✅ |
| Export availability | Enabled after Run. Stays enabled after a consistent Replay. Every Export performs its own fresh re-derivation (I-02). | ✅ |
| Replay divergence blocks export | Source tamper, app.js tamper and source-fetch failure all gave **REPLAY REFUSED** with a named reason; Export disabled; forced Export refused with a named alert and 0 Blobs | ✅ |
| Recovery | Restoring the true bytes and replaying gave REPLAY CONSISTENT, and Export was re-enabled | ✅ |
| Provenance refusal at Run | build-info version altered in-browser gave the visible notice "Execution refused: Build provenance version mismatch…"; nothing ran | ✅ |
| Failed replay shown as success | Never observed | ✅ |

---

## 5. Provenance verification

The provenance checks are all ✅ (section 1). The complete served tree matches build-info, and served `build-info.json` and `BOUND_RELEASE_STATE.json` equal Commit B's bytes and are canonical JSON.

**Corroboration (disposable local clone, after the live testing):**

- The supplied v0.3.12 regression, residual fixtures, manifest audit and final-mode release-state audit all pass.
- Independent probes were killed as intended: duplicate JSON keys in either provenance file, ignored or excluded untracked files, a committed README endorsement claim, and uppercase commit IDs.
- The four v0.3.11 residuals (V0311-F05-01/02/03, GEN-04) do not reproduce.

**Open provenance issue:** the verification oracle `docs/EXPECTED_CONTRACT_HASHES.json` still says `"version": "0.3.9"` (V0312-F01).

---

## 6. Claim-scope review

**The harness is accurately scoped.** The boundary box, footer, About text, integrity-limit paragraph and export `restrictions` together say that it:

- does not implement, emulate, penetrate, certify, validate or reproduce JANUS;
- works only from the Orientation Edition;
- reports INSUFFICIENT SPECIFICATION instead of inventing mechanisms;
- treats exports as unsigned client-side artifacts, where PASS "is not a digital signature or proof against a user who controls DevTools".

Each result carries "authored orientation-level assessment, not a measured result from a JANUS implementation". The replay text says it "is not an independent JANUS runtime execution". Release-state binding is described as "a workflow declaration, not authentication… or proof of human review".

No wording was found that implies JANUS certification, implementation, endorsement or independent validation of JANUS itself. The "Conformance" in the eyebrow reads as challenging JANUS against its own stated commitments, and the boundary box qualifies it immediately. Not a finding.

---

## 7. Attribution review

**Attribution is accurate. No endorsement implication was found.**

- **JANUS:** "the work of Eryk Dubiel", in the footer, README and exports (`janus_attribution.creator`).
- **Harness:** created by Kelly Newsome · Stratos Engine (`harness_attribution`).
- **README:** says the harness "is not an official JANUS artifact or an endorsement by Eryk Dubiel".
- **No surface** implies that Eryk Dubiel reviewed, approved, endorsed, certified or took part in the harness or its testing.

---

## 8. Original-ask assessment

> "Does this deployed harness, within the limits of the published JANUS Orientation Edition, successfully challenge whether a reviewer can distinguish capability, evidence, decision, authorization, and execution without the harness inventing unpublished JANUS mechanisms?"

**YES — supported by the observed deployed test evidence.**

This rests on the following:

- All six live scenarios produced the expected dispositions and exact comparisons.
- The displayed explanations keep each distinction separate and keep valid history.
- Every citation checks out against the served docx text.
- Unspecified mechanisms are marked OPEN or INSUFFICIENT SPECIFICATION rather than invented.
- Replay is a real re-derivation that fails closed on tampered bytes.
- Exports carry correct provenance and limitation language.

The one open finding concerns a provenance file label. It does not affect the governance content.

---

## 9. Findings

### V0312-F01 — LOW — actionable: the contract-hash verification oracle reports a stale version identity

- **Surface:** the served `docs/EXPECTED_CONTRACT_HASHES.json`, which is hash-bound in build-info. It is referenced by every export's `integrity_scope` ("Independent verification should compare contract_sha256 with docs/EXPECTED_CONTRACT_HASHES.json and the bound commit") and by README line 295.
- **Expected:** a served file that verifiers are directed to for release verification either carries the current release identity (0.3.12) or clearly labels its version as the version in which the contracts last changed.
- **Observed:** `{"harness": "JANUS Governance Challenge Harness", "version": "0.3.9", ...}`. The file was last changed in `fcaccec` (v0.3.9), and the field has stayed at 0.3.9 through v0.3.10–v0.3.12. The contract hashes themselves are correct (6/6 match).
- **Reproduction:**
  1. Open `https://newsomek.github.io/JANUS-Governance-Challenge-Harness/docs/EXPECTED_CONTRACT_HASHES.json?cb=1`.
  2. Read the top-level `version` field.
  3. Compare it with `build-info.json` (`0.3.12`) and with any export's `version`.
- **Why it matters:** this is the exact file an external verifier (including the intended recipient) is told to open. A `version: 0.3.9` next to a 0.3.12 export reads as a release-identity mismatch or a stale deployment, which is the confusion this test is meant to rule out. It is the same class as V0311-GEN-04 (stale page label, Low), on a less prominent but verification-critical surface. It does not affect hash correctness, integrity or governance content.
- **Blocks v1.0 promotion:** yes, under the zero-open-actionable-finding rule.
- **Recommended remediation:** a bounded change in a new Commit A, with no scenario change:
  - Either set `"version"` to the release version, or rename it to an unambiguous key such as `"contracts_last_changed_in": "0.3.9"`, and update the README/export wording if needed.
  - Add a regression assertion that every served JSON file with a version-identity field either equals `HARNESS_VERSION` or uses the explicit "last changed" key.
  - At the same time, consider I-06.

### Informational / non-actionable observations

| ID | Observation | Why non-actionable |
|---|---|---|
| I-01 | The first six exports show `commit_verification: UNAVAILABLE` (GitHub API HTTP 403, rate limit). | This is an environment limit, and the harness reported it honestly. A later export recorded MATCH with head = Commit B. For v1.0 exact-artifact testing, plan the API budget, since each Run, Replay and Export uses unauthenticated calls. |
| I-02 | Export is enabled after Run without a manual Replay. The on-screen Replay record still says "NOT YET REPLAYED" after such an export. | This is documented behaviour: Export always performs its own fresh re-derivation, and the on-screen replay record "is never trusted". The exported `replay` block is a real re-derivation. Optional: note the export-time replay in the UI. |
| I-03 | DevTools-only DOM edits (forged disposition text; select value changed without an event) are not reflected back into the UI. | Exports use the stored record and stayed correct. This is within the stated integrity limit (DevTools out of scope). |
| I-04 | The runtime accepts a non-canonical or duplicate-key build-info if one is served (last value wins). | The served bytes are canonical and bound to Commit B, and the repository validators kill duplicate keys. There is no deployed exposure. |
| I-05 | Reset clears the prediction and result but keeps the selected scenario. | It returns to a no-result state with all evidence actions disabled. This is reasonable UX. |
| I-06 | Legacy control files are still served without a "historical" marker: `APPROVED_GOVERNANCE_CLAIMS.json` (`version: 0.3.9`), and `GOVERNED_RELEASE_FILES.json`, whose "current_policy" describes the superseded four-file approval set. | They are not referenced by current verification guidance and are not user-facing. Optional cleanup alongside F01. |
| I-07 | The page "Independent test record", `VERSION.txt` and `CHANGELOG` describe v0.3.12 as a candidate with V035-F05 pending. | This is accurate for a candidate. It must be updated for the v1.0 artifact, which then needs its own exact deployed test. |
| I-08 | Export refusals use a native `alert()`, while Run refusals use the in-page `#staleNotice`. The Run refusal text begins "Execution refused:", which overloads the JANUS term "execution". | Both fail closed with named reasons. Optional consistency and wording polish. The native alert also froze browser automation until it was dismissed by hand. |

---

## 10. Final qualification result

| Item | Result |
|---|---|
| Tested version | v0.3.12 |
| Deployed artifact tested | **YES** |
| All six scenarios passed | **YES** |
| Replay/export/integrity passed | **YES** |
| Behavioral invalidation checks passed | **YES** |
| Release identity verified | **YES**. Version, Build ID, Commit A, tree, Commit B, source and app.js were all verified; V0312-F01 is a stale label in an auxiliary oracle file. |
| Original-ask assessment | **YES** |
| **Open actionable findings** | **1** (V0312-F01, Low) |
| v1.0 promotion technically qualified | **NO** |
| External-facing report produced | **NO**. Withheld per the conditional rule. |

**Tests that could not be performed:** none of the required steps were skipped. Two limits apply:

- **GitHub main corroboration** was unavailable for the six primary exports because of the rate limit. It was then shown as MATCH in a later export and confirmed separately through the GitHub API.
- **Raw files outside the browser:** the cloud sandbox could not reach github.io directly. Every exported JSON was therefore captured in-browser and saved byte-exact, verified by SHA-256 against the Blob text.

**Path forward:**

1. Fix V0312-F01, and optionally I-06, in a new version.
2. Run a targeted closure check plus a full zero-open-finding regression on that deployed artifact.
3. If it returns 0, promotion to v1.0 may begin.
4. The resulting v1.0 artifact still needs its own exact deployed test before external delivery.
