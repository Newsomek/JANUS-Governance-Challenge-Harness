# JANUS Governance Challenge Harness v0.3.13: Final Deployed-Artifact Qualification Test (Internal)

**Result: v1.0 promotion is NOT qualified. Open actionable findings: 1 (Low).**

V0312-F01 is closed. All six scenarios, replay, export, integrity, invalidation, fail-closed and release-identity checks passed on the live deployed artifact, and the original-ask assessment remains YES.

One new Low finding blocks promotion under the zero-open-finding rule: **V0313-F01**. The served v0.3.13 release-gate document is a version-substituted copy of the v0.3.12 gate. It states the wrong closure objective, never mentions V0312-F01, and lists a required gate (`node tests/v0.3.11-regression.mjs`) that fails deterministically on this release.

The finding is confined to release-process documentation. It does not affect runtime behavior, scenario content, dispositions or deployed provenance.

| Item | Value |
|---|---|
| Test date | 2026-09-26, 03:08–03:40 UTC (2026-09-25, 23:08–23:40 America/New_York) |
| Tester | Claude, independent. No repository writes, commits, tags, branches, releases or PRs. |
| Artifact tested | The live GitHub Pages deployment, through the page's own UI in Chrome 153 (Claude in Chrome) |
| Corroboration | A disposable, read-only clone was used for commit topology, local gates and mutation probes. |
| Raw evidence | `raw-evidence/JANUS_v0.3.13_final_qualification_raw_evidence.txt`, plus `raw-evidence/deployed-files/`. These are byte-identical to the served files, verified by SHA-256. |

---

## 1. Release identity and freshness

| Field | Expected | Observed on the deployed artifact | Result |
|---|---|---|---|
| Deployed URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ | same | ✅ |
| Version | `0.3.13` | title, eyebrow, footer, `build-info.json`, `BOUND_RELEASE_STATE.json`, all exports | ✅ |
| Build ID | `janus-governance-challenge-harness-v0.3.13` | `build-info.json`, `BOUND_RELEASE_STATE.json`, all exports | ✅ |
| Commit A | `e519aee7e8a9b38cc73dbbd3389acdec6ef93a8a` | `build-info.code_commit`, `BOUND_RELEASE_STATE.code_commit`, UI provenance line, all exports | ✅ |
| Commit A tree | `745b9cef0de88f51855547feda976186062d8298` | served `BOUND_RELEASE_STATE.code_tree`; `git cat-file -p A` | ✅ |
| Release HEAD / Commit B | `93a6f794f244826b8595f43101cc18f904c9ae66` | `git ls-remote origin main`; `deployment_head_observed` in all six exports | ✅ |
| Commit B shape | single direct child of A; changes exactly the two provenance files | parents = [A]; A has exactly one child; diff = `M build-info.json`, `M docs/BOUND_RELEASE_STATE.json` | ✅ |
| `app.js` SHA-256 | `29dab1f8…d38556c` | served bytes (59,585 B), `?cb=` no-store; all exports expected == observed | ✅ |
| JANUS source SHA-256 | `21766f5d…551fe4` | served docx (50,354 B), re-hashed in-browser; all exports expected == observed | ✅ |
| Authored scenario-block SHA-256 | `948536a1…b56488` | computed on Commit A `app.js`, whose bytes equal the served `app.js` | ✅ |
| Complete served manifest | 133 non-provenance files | 133/133 fetched HTTP 200, 0 hash mismatches | ✅ |
| Provenance files | Commit B bytes | served `build-info.json` `5eb91952…` and `BOUND_RELEASE_STATE.json` `1671d713…` equal the Commit B blobs | ✅ |

**Staleness:** excluded.

- Every served file reports Last-Modified 03:04:07 GMT, after Commit B (02:57:42Z).
- Fetches used `cache: 'no-store'` and a per-request `?cb=`.
- Every version surface reports 0.3.13.
- All six exports recorded GitHub `main` = Commit B with parent Commit A, `commit_verification: MATCH`. Unlike v0.3.12, this time there was no rate-limit gap.

---

## 2. Six-scenario matrix (live UI)

| # | Scenario | Expected | Observed | Comparison | Replay | Export | Integrity | Result |
|---|---|---|---|---|---|---|---|---|
| 1 | Authorization condition changes after approval | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 2 | Evidence changes after authorization | BLOCK | BLOCK | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 3 | Authorization expires before execution | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 4 | Learning attempts to expand authority | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 5 | Two legitimate authorities conflict | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |
| 6 | Authority is revoked during execution | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | EXACT | CONSISTENT | ✅ | PASS 15/15 | **PASS** |

**Every export was checked automatically, with zero failures in all six.** The checks covered:

- version, build ID and Commit A;
- `app.js` and source expected == observed;
- `contract_sha256` == the served oracle entry;
- canonical disposition and EXACT comparison;
- `integrity_status` PASS, with all 15 `integrity_checks` true;
- `replay.result` REPLAY CONSISTENT, with rederived == stored == original evidence-core hash;
- bound-commit and GitHub `main` corroboration MATCH;
- JANUS attribution;
- the oracle reference in `integrity_scope`;
- displayed UI text == exported text for all seven explanation fields.

**Scenario exports (SHA-256 over the exact Blob bytes):**

| Export file | Bytes | SHA-256 |
|---|---|---|
| `janus-harness-condition-change-block_reauthorize-2026-09-26T03-11-04-113Z-v0.3.13.json` | 10,079 | `6988fedd8535e14b7d205204b3c309ad2203655ccdeeb121348884a1f19c785d` |
| `janus-harness-evidence-change-block-2026-09-26T03-11-26-164Z-v0.3.13.json` | 9,959 | `2b2b4e1e5c11ce80b64cdc579f35df23225e4efe6bfd9883b21eb51b85bfbd1e` |
| `janus-harness-authorization-expiry-block_reauthorize-2026-09-26T03-11-29-529Z-v0.3.13.json` | 9,977 | `4910b278d0a1a41aafcd87157c122d463403d55dc2a472f5d53ab580afbc756f` |
| `janus-harness-learning-authority-block_reauthorize-2026-09-26T03-11-33-314Z-v0.3.13.json` | 9,833 | `d9a6eb728f2908daafe40d80d178bf58c05fec6fb9421c009dc103f22a704651` |
| `janus-harness-conflicting-authorities-insufficient_specification-2026-09-26T03-11-36-780Z-v0.3.13.json` | 10,495 | `787d23d7e0775db295ac388fff8b2698c71bac201c606cddf5f669edcad72986` |
| `janus-harness-mid-execution-revocation-insufficient_specification-2026-09-26T03-11-40-444Z-v0.3.13.json` | 10,403 | `33bbdf827989a0f53f93252b0f0f26ba369690bc82222b4eca0921f885c8ef7e` |

The export JSON bytes were verified in the browser. They are not included in this package, because the browser-tool channel does not allow bulk encoded transfer. They are needed only for a zero-finding qualification package, and this test is not that. The six scenarios should be exported again from the release that closes V0313-F01.

---

## 3. V0312-F01 closure — CLOSED

- **Oracle field:** the served `docs/EXPECTED_CONTRACT_HASHES.json` has keys `harness`, `contracts_last_changed_in`, `purpose`, `scenarios`. There is no top-level `version` field, and `contracts_last_changed_in` is `"0.3.9"`.
- **Commit-level diff:** in the whole v0.3.12-B → v0.3.13-A diff, the only change to this file is that one field rename.
- **Hashes unchanged:** all six `scenario_id` / `scenario_name` / `contract_sha256` triples are identical to the served v0.3.12 oracle, and all six live exports match them.
- **Regression coverage:** the new assertion in `tests/v0.3.13-regression.mjs` kills a reintroduced `"version": "0.3.9"`, and also kills an added `"version": "0.3.13"`. A mutated contract hash is still killed.
- **Supporting text:** README, CHANGELOG, VERSION.txt, index.html and the export `integrity_scope` wording are consistent with the change.

---

## 4. Behavioral, invalidation and fail-closed matrix

| Check | Observed | Result |
|---|---|---|
| Initial state | Run, Replay and Export disabled; Reset enabled; "No challenge has been run."; no result, notice or provenance | ✅ |
| Missing prediction | Run disabled. A force-enabled Run was refused with "Execution refused: choose a valid reviewer prediction before running." | ✅ |
| Scenario change | Result, replay and export invalidated with a named notice. Forced Export/Replay gave 0 Blobs. Switching back did not resurrect the old result. | ✅ |
| Prediction change | Same as scenario change. Forced Export gave 0 Blobs. | ✅ |
| Reset | All evidence actions disabled; prediction cleared; scenario kept | ✅ |
| Stale in-flight state | Export in flight (source fetch delayed 2.5 s) followed by a scenario change, a prediction change or Reset → 0 Blobs each time. Replay in flight followed by a scenario change → completion discarded. Run locked out during Replay. | ✅ |
| Source mismatch (1-bit flip) | Run refused; Replay REFUSED and Export disabled; forced Export and direct Export gave 0 Blobs with a named reason; true bytes led to CONSISTENT and re-enabled Export | ✅ |
| Missing source (404 or network failure) | Same fail-closed pattern with "Source document fetch failed: …" | ✅ |
| `app.js` mismatch | Same fail-closed pattern with "Served app.js SHA-256 does not match build provenance." | ✅ |
| build-info version mismatch | Same fail-closed pattern with "Build provenance version mismatch: expected 0.3.13, observed 0.3.12." | ✅ |
| Malformed stored evidence (6 mutations) | Structural corruption gave REPLAY REFUSED with a named field. Uncoordinated edits gave REPLAY DIVERGENCE with Export blocked. Every Export attempt gave 0 Blobs with the failing integrity checks named. | ✅ |
| Failed replay shown as success | Never observed | ✅ |

---

## 5. Build-manifest logic (long-path safety and ordering)

- **Entries:** 133, in strict code-point order. The longest path is 181 characters, and every path contains only printable ASCII.
- **Served files:** all 133 fetched with HTTP 200 and matched (path segments URI-encoded).
- **Local match:** the manifest equals `sha256(git show B:<path>)` for 133/133 files. It equals the tracked set exactly, minus the two provenance files.
- **Deterministic regeneration:** `tests/v0.3.13-generate-build-info.mjs` reads `git ls-tree -z` and blob bytes from Commit A. Run on a disposable checkout of Commit A, it reproduced the served `build-info.json` byte for byte (`5eb91952…`). The output is canonical JSON with 2-space indentation and a trailing LF.
- **Verifier-visible inconsistency:** none found.

---

## 6. v0.3.11 residuals — none reproduce

| Residual | Probe | Result |
|---|---|---|
| F11-01 duplicate-key / non-canonical provenance | Duplicate `version` key in build-info; uppercase commit in `BOUND_RELEASE_STATE` | Killed by the release-state and manifest audits |
| F11-02 ignored/excluded untracked files | A file hidden via `.git/info/exclude`; plus the three supplied fixtures | Killed |
| F11-03 manifest documentation | README "Evidence export" manifest paragraph | Accurate |
| GEN-04 stale visible version | Title, eyebrow and footer | All read 0.3.13 |

---

## 7. Source conformance, claim scope and attribution

**Source citations:**

- Every citation in the six scenarios was checked against the text of the served docx, which was parsed in document order. The sections covered were §01, 06, 19, 20, 22, 24, 26, 27, 28, 29, 31, 32, 33, 38 and 39. All are accurate; quotations are in raw evidence §8.
- DIRECTLY SUPPORTED appears only where the text is explicit.
- Analogies are labelled EXTENDED / BY ANALOGY. §26 is explicitly cited "only by analogy", and §28 is marked "analogous, not direct".
- OPEN appears in every scenario.

**Claim scope:** the boundary box, integrity-limit paragraph, per-result wording and export `restrictions` all remain in place. The harness does not claim to implement, emulate, penetrate, certify, validate or reproduce JANUS. It describes exports as unsigned client-side evidence, and release binding as a workflow declaration only.

**Attribution:** JANUS is attributed to Eryk Dubiel (footer, README, `janus_attribution` in every export), and the harness to Kelly Newsome · Stratos Engine. The README says the harness "is not an official JANUS artifact or an endorsement by Eryk Dubiel". No surface implies that Eryk Dubiel reviewed, approved or endorsed the harness.

---

## 8. Original-ask assessment — YES

> "Does this deployed harness, within the limits of the published JANUS Orientation Edition, successfully challenge whether a reviewer can distinguish capability, evidence, decision, authorization, and execution without the harness inventing unpublished JANUS mechanisms?"

**YES.** Authored scenario content, contract hashes, dispositions and the source document are byte-identical to v0.3.12, where this assessment was established. The live v0.3.13 runs reproduce every disposition exactly, replay is a real re-derivation that fails closed, and every citation checks out against the served source. V0313-F01 concerns release-process documentation only.

---

## 9. Findings

### V0313-F01 — LOW — actionable: the v0.3.13 release gate is a stale v0.3.12 copy and lists a gate that cannot pass

- **Surface:** `tests/V0_3_13_RELEASE_GATE.md`, which is served, hash-bound in build-info (`a37bd01d…`) and part of the Commit A release state.
- **Expected:** the release's own gate document describes this release's objective, which is independent closure of V0312-F01. It lists only gates that can pass on the released tree.
- **Observed:** `diff V0_3_12_RELEASE_GATE.md V0_3_13_RELEASE_GATE.md` shows only number substitutions. As a result:
  - Line 3 calls v0.3.13 "a bounded residual-hardening candidate".
  - Line 7 says "V035-F05 remains PARTIALLY CLOSED until independent v0.3.13 targeted testing…".
  - The "Independent closure gate" (lines 137–148) targets the v0.3.11 findings F11-01, F11-02, F11-03 and GEN-04, and V035-F05 closure.
  - Neither "V0312-F01" nor `contracts_last_changed_in` appears anywhere in the document.
  - Required local gate #3, `node tests/v0.3.11-regression.mjs`, fails on the released tree with `Error: Expected contract hash metadata version mismatch.`, because that suite asserts `expectedHashes.version === '0.3.9'`, which this release intentionally removed.
  - Gate #8 refers to preserved v0.3.11 evidence rather than v0.3.12.
  - README, VERSION.txt, CHANGELOG and index.html all describe v0.3.13 as the V0312-F01 closure candidate, so the governance record contradicts itself.
- **Secondary:** README line 51 still reads "Current v0.3.12 control suites:" and lists only the v0.3.12 suites. The README names no current v0.3.13 suites.
- **Reproduction:**
  1. Open `…/tests/V0_3_13_RELEASE_GATE.md?cb=1`; read lines 3–7 and 87–98.
  2. In a checkout of Commit B, run `node tests/v0.3.11-regression.mjs`. It exits non-zero.
- **Why it matters:** a verifier who follows the published gate gets a required gate that fails and a closure objective that does not match the release. Either gate #3 was not run as declared, or the gate list is wrong. Both leave the recorded process misaligned with the actual release, and this harness exists to make governance records trustworthy. This is the same class as V0311-F11-03 (inaccurate provenance documentation). It does not affect runtime behavior, dispositions, integrity or deployed provenance.
- **Blocks v1.0 promotion:** yes, under the zero-open-actionable-finding rule.
- **Recommended remediation:** a bounded documentation-only Commit A, with no scenario or `app.js` logic change:
  1. Rewrite the gate's objective and independent closure gate around V0312-F01, with correct V035-F05 status wording.
  2. Replace gate #3 with a suite that is valid on this tree, or mark `tests/v0.3.11-regression.mjs` and `tests/v0.3.12-regression.mjs` as historical, version-pinned suites that are not expected to pass.
  3. Change gate #8 to the preserved v0.3.12 evidence.
  4. Fix the README heading to "v0.3.12 control suites (historical)" and list the current suites.
  5. Add a doc-audit assertion that every command listed as a required gate in the current release gate is executed by the release script, or at least that the gate names the current finding ID.

### Informational / non-actionable observations

| ID | Observation | Why non-actionable |
|---|---|---|
| I-01 | `docs/APPROVED_GOVERNANCE_CLAIMS.json` still has `"version": "0.3.9"`. `GOVERNED_RELEASE_FILES.json` still describes the superseded four-file approval set as `current_policy`. (Carried over from v0.3.12 I-06.) | Neither file is referenced by verifier guidance, exports or the UI; both are legacy tooling inputs. It would be tidy to label them historical in the same release that fixes V0313-F01. |
| I-02 | The older version-pinned suites (`v0.3.11-regression`, `v0.3.12-regression`) fail on v0.3.13 because they pin earlier identities. | This is expected for historical suites. It becomes a defect only where a current gate requires them, which is covered by V0313-F01. |
| I-03 | Export refusals still use a native `alert()`, while Run refusals begin "Execution refused:". (Carried over from v0.3.12 I-08.) | Both fail closed with named reasons. This is optional polish. |
| I-04 | An un-delayed "Export, then switch after 30 ms" attempt produced one Blob. | Tab timer throttling stretched 30 ms to about 1 s, so the export completed on a valid state before the switch. Controlled delayed races all gave 0 Blobs. This was a test artifact, not a defect. |
| I-05 | "Independent test record", VERSION.txt and CHANGELOG describe a candidate. | This is accurate for a candidate. It must be updated for v1.0, which needs its own exact deployed test. |

---

## 10. Final qualification result

| Item | Result |
|---|---|
| Deployed artifact tested | **YES** |
| All six scenarios | **PASS** |
| Replay/export/integrity | **PASS** |
| Invalidation checks | **PASS** |
| Release identity | **PASS** |
| V0312-F01 | **CLOSED** |
| Original-ask assessment | **YES** |
| **Open actionable findings** | **1** (V0313-F01, Low) |
| v1.0 promotion qualified | **NO** |
| External-facing report produced | **NO**. Withheld per the qualification rule. |

**Path forward:**

1. Correct V0313-F01 in a documentation-only v0.3.14 Commit A and Commit B, optionally together with I-01.
2. Run a targeted deployed check of V0313-F01, plus re-export of the six scenarios.
3. If that check returns 0 actionable findings, promotion may begin.
4. The v1.0 artifact still needs its own exact deployed verification.
