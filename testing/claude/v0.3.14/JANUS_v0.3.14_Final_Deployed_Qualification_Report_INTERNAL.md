# JANUS Governance Challenge Harness v0.3.14: Final Deployed-Artifact Qualification (Internal)

## Executive result

**The deployed v0.3.14 qualification FAILS. There is 1 open actionable finding (Low), so the v1.0 promotion gate is NOT satisfied.**

- **Runtime:** the deployed artifact is exactly the declared v0.3.14 release. All six scenarios, replay, export, integrity, invalidation and fail-closed behavior pass. The authored scenarios, their contract hashes, the JANUS source and the contract oracle are all unchanged.
- **V0313-F01 primary defects: corrected.** The v0.3.14 release gate names V0313-F01 as its objective and records V0312-F01 as closed. It treats the v0.3.11/v0.3.12 regressions as historical. Every numbered current gate passes on the release tree. The README labels the v0.3.12 controls as historical and lists the current v0.3.14 controls.
- **The same defect class still reproduces in the served current documentation.**
  - `VERSION.txt` relabels the v0.3.13 "V0312-F01 closure" section as "V0313-F01 closure" without changing its content. The file now credits V0313-F01 with the oracle-field fix, which was actually V0312-F01. This error is new in v0.3.14.
  - README line 360 still presents the v0.3.6 gates as "Current local release gates". This predates v0.3.14, and the v0.3.13 qualification missed it.
  - These residuals are recorded as **V0314-F01 (Low)**, and V0313-F01 is reported **NOT CLOSED**.

**Scope of the result:** this does not affect governance content, scenario behavior, provenance binding or runtime integrity. It concerns the accuracy of the release-status documentation only.

| | |
|---|---|
| Deployed artifact tested directly | **YES**. The live GitHub Pages site was tested in Chrome 153 (Claude in Chrome), through its own UI and served files. |
| Test window | 2026-09-26, 05:05–05:15 UTC (01:05–01:15 America/New_York) |
| Tester | Claude, independent. No repository writes, commits, tags or releases. |
| Raw evidence | `raw-evidence/JANUS_v0.3.14_final_qualification_raw_evidence.txt`, plus `raw-evidence/deployed-files/`. The deployed files are byte-identical to the served bytes, verified by SHA-256. |

---

## 1. Release identity — PASS

| Field | Expected | Observed (deployed) | Result |
|---|---|---|---|
| URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ | same | ✅ |
| Visible version | 0.3.14 | title, eyebrow ("VERSION 0.3.14"), footer | ✅ |
| Build ID | `janus-governance-challenge-harness-v0.3.14` | served `build-info.json`, `BOUND_RELEASE_STATE.json`, all exports | ✅ |
| code_commit (Commit A) | `ab79d345784cb05d7985626fa6fb3acd03b36fa8` | build-info, bound state, UI provenance line, all exports | ✅ |
| code_tree | `fa21807269677967e4e30df537d1528d5d907586` | served `BOUND_RELEASE_STATE.code_tree`; `git cat-file` A | ✅ |
| Release HEAD (Commit B) | `9803339474c8f16c2c27edb57d4ee9361d0e09bd` | `ls-remote main`; `deployment_head_observed` in all 6 exports | ✅ |
| Commit B shape | single child of A; changes exactly the 2 provenance files | parents [A]; A has only that child; `M build-info.json`, `M docs/BOUND_RELEASE_STATE.json` | ✅ |
| build-info.json SHA-256 | `57dc1ee5…968e4a32` | served, equal | ✅ |
| BOUND_RELEASE_STATE.json SHA-256 | `7e7e9188…ef2c5e83` | served, equal | ✅ |
| JANUS source SHA-256 | `21766f5d…551fe4` | served (50,354 B) and in all exports | ✅ |
| Scenario-block SHA-256 | `948536a1…b56488` | recomputed; the block is unchanged from v0.3.13 | ✅ |
| Served `app.js` | bound in manifest | `8654bf8a…2bfecbd04`; expected == observed in all exports | ✅ |
| Complete manifest | all non-provenance files | 146/146 served HTTP 200, 0 mismatches; regenerated from Commit A byte-identically | ✅ |

**Provenance consistency:**

- `build-info.json` and `BOUND_RELEASE_STATE.json` agree on version, build ID and Commit A. Both are canonical JSON.
- `provenance_only_files` names exactly the two files that differ between A and B.
- `binding_semantics` reads "Workflow binding only; not authentication, a digital signature, deployment enforcement, or proof of human review." This report uses the same meaning: **workflow provenance binding only**.

**Freshness:** served files carry Last-Modified 05:00:03Z, which is after Commit B (04:51:52Z). GitHub `main` corroboration was MATCH in all exports.

---

## 2. Six-scenario results — PASS

| Scenario | Expected | Exact observed disposition | Comparison | Contract SHA-256 (export = expected = oracle) | Replay | Export / integrity |
|---|---|---|---|---|---|---|
| condition-change | BLOCK + REAUTHORIZE | `BLOCK + REAUTHORIZE` | EXACT MATCH | `52a18511…f1eb9a3` | CONSISTENT | ✅ PASS 15/15 |
| evidence-change | BLOCK | `BLOCK` | EXACT MATCH | `36bc7042…5dadcc45` | CONSISTENT | ✅ PASS 15/15 |
| authorization-expiry | BLOCK + REAUTHORIZE | `BLOCK + REAUTHORIZE` | EXACT MATCH | `e7e29686…ba69af4` | CONSISTENT | ✅ PASS 15/15 |
| learning-authority | BLOCK + REAUTHORIZE | `BLOCK + REAUTHORIZE` | EXACT MATCH | `d783abf9…5142bf` | CONSISTENT | ✅ PASS 15/15 |
| conflicting-authorities | INSUFFICIENT SPECIFICATION | `INSUFFICIENT SPECIFICATION` | EXACT MATCH | `437615c4…c1098f27` | CONSISTENT | ✅ PASS 15/15 |
| mid-execution-revocation | INSUFFICIENT SPECIFICATION | `INSUFFICIENT SPECIFICATION` | EXACT MATCH | `916a960c…c50b164` | CONSISTENT | ✅ PASS 15/15 |

**Scenario integrity:**

- The authored scenario block (`948536a1…`), the JANUS docx and `docs/EXPECTED_CONTRACT_HASHES.json` are byte-identical to the qualified v0.3.13 release.
- `app.js` differs from v0.3.13 only in the `HARNESS_VERSION` and `BUILD_ID` constants.
- All six contract hashes equal the supplied canonical values.
- Source citations are therefore unchanged from the v0.3.13 check, which verified them against the served docx.

**Every export was also checked automatically.** Every check passed:

- version 0.3.14, build ID and Commit A;
- `app.js` and source expected == observed;
- `integrity_status` PASS, with all 15 checks true;
- REPLAY CONSISTENT, with rederived == stored == record core hash;
- bound-commit and `main` corroboration MATCH (head B, parent A);
- JANUS attribution and restrictions present;
- UI text == export text for all seven explanation fields.

Export file names, sizes and SHA-256 values are in raw evidence §4.

---

## 3. Export, replay, integrity and invalidation — PASS

| Check | Observed | Result |
|---|---|---|
| Initial state | Run, Replay and Export disabled; Reset enabled; no result; no notice | ✅ |
| Missing prediction | Run disabled. A forced Run was refused with a named notice; no result. | ✅ |
| Scenario / prediction change | Evidence invalidated with a named notice; Replay and Export disabled; forced actions gave 0 Blobs; no resurrection | ✅ |
| Reset | No-result state; all evidence actions disabled | ✅ |
| Stale in-flight state (source fetch delayed 2.5 s) | An Export in flight followed by a scenario change, prediction change or Reset gave 0 Blobs. A Replay in flight followed by a scenario change was discarded. Run was locked throughout. | ✅ |
| Source 1-bit tamper, 404, network failure | Run refused; Replay REFUSED and Export disabled; forced and direct Export gave 0 Blobs with a named reason; recovery gave CONSISTENT | ✅ |
| `app.js` tamper | Same fail-closed pattern | ✅ |
| build-info version 0.3.13 | "Build provenance version mismatch: expected 0.3.14, observed 0.3.13." Same fail-closed pattern. | ✅ |
| Malformed stored evidence (6 mutations) | Structural corruption gave REFUSED with the field named. Uncoordinated edits gave DIVERGENCE with Export blocked. Export gave 0 Blobs with the failing checks named. | ✅ |
| Release identity in exports | Version, build ID, Commit A, `app.js` hash and head/parent are present and correct | ✅ |

---

## 4. V0313-F01 closure — NOT CLOSED

**Criteria that are met.** Evidence is in raw evidence §7.

| Criterion | Evidence | Met |
|---|---|---|
| Identifies v0.3.14 as current | Gate L1/L3, README L1 and v0.3.14 section, VERSION.txt L3, index.html | ✅ |
| Names V0313-F01 as the finding being closed | Gate L3 and "V0313-F01 closure objective"; README; CHANGELOG; index.html | ✅ |
| States V0312-F01 already independently closed | Gate L5; README; VERSION.txt L8; CHANGELOG | ✅ |
| v0.3.11 regression not a current gate | Appears only in the historical description and the "Historical-suite rule"; numbered gates 1–25 are v0.3.14 suites | ✅ |
| v0.3.12 controls not presented as current | README L82 reads "v0.3.12 control suites (historical):" | ✅ |
| Current v0.3.14 suites identified | README L25 "### Current v0.3.14 control suites" (9 items) | ✅ |
| Every current gate valid for the tree | All 6 runnable current gates pass on Commit B (raw evidence §7) | ✅ |
| Commit A / Commit B architecture kept | Gate text, final-mode audit PASS, verified topology | ✅ |
| Deployed independent verification required before v1.0 | Gate "Deployment verification" and "Version 1.0 rule" sections | ✅ |

**Criteria that are not met:**

- **"Preserves older release documentation as historical rather than silently rewriting release history."** In `VERSION.txt`, v0.3.14 changed only the section label from "V0312-F01 closure:" to "V0313-F01 closure:" and kept the three V0312-F01 bullets. That rewrites what V0312-F01's closure consisted of, and misstates V0313-F01's closure.
- **"Obsolete current-gate references" removed.** README line 360 still says "Current local release gates are:" and lists the v0.3.6 suites.

Both are the same defect class as V0313-F01: stale or version-substituted release documentation. The v0.3.14 gate also states: "V0313-F01 may be called CLOSED only when the exact deployed v0.3.14 artifact returns zero open … Low actionable findings." For both reasons, V0313-F01 is **NOT CLOSED**. Its primary defects are corrected, and the remaining residue is recorded below as V0314-F01.

V0312-F01 stays closed. The oracle is unchanged, and the regression still rejects a reintroduced `version` field.

---

## 5. New actionable findings

### V0314-F01 — LOW — actionable: current release documentation still contains version-substituted and stale "current" content (V0313-F01 residual)

**(a) VERSION.txt credits V0313-F01 with V0312-F01's change.** This is new in v0.3.14.

- **Reproduction:**
  1. Open `…/VERSION.txt?cb=1` and read lines 22–25.
  2. Compare them with `git show 93a6f79:VERSION.txt`, lines 22–25.
- **Observed:** the heading reads "V0313-F01 closure:". The bullets underneath say that `EXPECTED_CONTRACT_HASHES.json` no longer presents 0.3.9 as a version, that `contracts_last_changed_in` records 0.3.9, and that the six hashes are unchanged. In v0.3.13, these same bullets sat under "V0312-F01 closure:", and only the label changed.
- **Expected:** the V0313-F01 closure section describes the actual correction: the new v0.3.14 gate, historical-suite handling, README control labelling and the doc audit. Any V0312-F01 text stays attributed to V0312-F01.
- **Why the audit misses it:** `tests/v0.3.14-doc-audit.mjs` requires only that the substring `V0313-F01` appears somewhere in VERSION.txt. Reverting the heading to "V0312-F01 closure:" still passes the audit.

**(b) README presents the v0.3.6 gates as current.** This predates v0.3.14; the v0.3.13 qualification missed it.

- **Reproduction:** open `…/README.md?cb=1` and read line 360, under "## v0.3.6 bounded hardening candidate".
- **Observed:** "Current local release gates are:", followed by `v0.3.6-regression`, `v0.3.6-doc-audit`, `v0.3.6-mutation-regression`, `v0.3.6-manifest-audit` and `V0_3_6_RELEASE_GATE.md`, with no historical label.
- **Expected:** labelled historical, the same way v0.3.14 relabelled the v0.3.12 list.

**(c) Secondary, cosmetic on its own:** `CHANGELOG.md` line 1 is the v0.3.14 entry, and the `# Changelog` title follows at line 11.

**Why it matters:** V0313-F01 was opened because a release's own documentation misdescribed the release and its current controls. VERSION.txt is the release-status summary, and it now tells a verifier that V0313-F01 was the oracle-field fix. That contradicts the gate, README and CHANGELOG, and it rewrites the recorded content of V0312-F01's closure. The README still carries a "current" gate list from four release generations ago. There is no runtime, integrity or governance-content impact.

**Blocks v1.0 promotion:** yes, under the zero-actionable-finding rule.

**Suggested bounded remediation:** a documentation-only v0.3.15 Commit A and Commit B.

1. Restore the "V0312-F01 closure (v0.3.13)" section in VERSION.txt, and add an accurate "V0313-F01 closure (v0.3.14)" section.
2. Change README L360 to "v0.3.6 local release gates (historical):", and sweep the file for any other "Current …" under a historical version heading.
3. Move the v0.3.14 CHANGELOG entry below `# Changelog`.
4. Strengthen the doc audit:
   - require that the VERSION.txt closure section for the current finding does not contain the V0312-F01 oracle bullets;
   - forbid `Current local release gates are:` / `Current v0.3.x` outside the current release section;
   - require that `# Changelog` is line 1.

---

## 6. Informational observations (non-actionable)

| ID | Observation | Why non-actionable |
|---|---|---|
| I-01 | `docs/APPROVED_GOVERNANCE_CLAIMS.json` still has `"version": "0.3.9"`, and `GOVERNED_RELEASE_FILES.json` still has a legacy `current_policy`. (Carried over from earlier releases.) | Neither is referenced by verifier guidance, exports or the UI. Optional cleanup alongside V0314-F01. |
| I-02 | The historical v0.3.11, v0.3.12 and v0.3.13 regressions fail on v0.3.14, because they are pinned to earlier identities. | The gate explicitly declares them historical and not current. |
| I-03 | Export refusals still use a native `alert()`. | They fail closed with named reasons. Cosmetic. |
| I-04 | The v0.3.13 qualification missed README line 360. | Stated for transparency. It is now captured under V0314-F01(b). |
| I-05 | The v0.3.13 qualification report and raw evidence are preserved in the repository, byte-identical to the delivered files. The v0.3.13 gate is unchanged (historical). | Positive observation. |

---

## 7. Zero-actionable-finding result

**Are there any actionable findings remaining after this deployed v0.3.14 qualification? YES**: 1 (V0314-F01, Low).

## 8. v1.0 promotion-gate result

**Is the v0.3.14 qualification gate for beginning v1.0 promotion satisfied? NO.**

The next step is a documentation-only closure release for V0314-F01. It needs a targeted deployed re-check that also re-verifies the six scenarios. If that re-check returns zero actionable findings, preparation of the exact v1.0 candidate may begin. The v1.0 artifact must itself be constructed, locally gated, deployed and independently tested with zero actionable findings before any tag, Release or external delivery.

---

## 9. Exact identities and hashes tested

| Item | Value |
|---|---|
| Version / Build ID | 0.3.14 / janus-governance-challenge-harness-v0.3.14 |
| Commit A / tree | ab79d345784cb05d7985626fa6fb3acd03b36fa8 / fa21807269677967e4e30df537d1528d5d907586 |
| Commit B | 9803339474c8f16c2c27edb57d4ee9361d0e09bd |
| build-info.json | 57dc1ee53f4f38af1decc72a62b006ba1d805d409e45363b36858ae1968e4a32 |
| docs/BOUND_RELEASE_STATE.json | 7e7e9188993f4c15ddb0aaa0352193560c6c849e5c8f70ccc0f7eeaeef2c5e83 |
| app.js | 8654bf8a566abbb09f5a6d73ca00e7cee299c92b85f1f0006a9251f2bfecbd04 |
| JANUS source docx | 21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4 |
| Scenario block | 948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488 |
| EXPECTED_CONTRACT_HASHES.json | 03ae270388befe4a8c65e089556dcd5c482671b174e0023cb68c7b5955b5f4b0 |
| tests/V0_3_14_RELEASE_GATE.md | 40dc5d26e0fcaf4da7e44a2713dbbf1867ae1b057804cab246953126fc0f2fd9 |
| VERSION.txt | 11b3f5b93495d46300b5f056d0d9b3acbe7b4e89d82ff2e70123b7617550cfaf |
| README.md | 0a1f3e4397325022bb59492502c355102308901ad36e5f3815aac2277ac62e2b |

## 10. Limitations

- **Sandbox reach:** the cloud sandbox cannot reach `*.github.io`. Every deployed observation was made in the live browser tab. The local clone was used only for topology, local gates and byte cross-checks against hashes observed as served.
- **Export bytes:** the six export files were verified in-browser (hashes, sizes, all fields). Their full JSON was not copied out, because the browser-tool channel blocks bulk encoded transfer. They can be saved to your computer on request.
- **Test instrumentation:** fail-closed and race tests interposed `window.fetch`, `URL.createObjectURL`, anchor click and `alert` from outside the app. The app's code was not modified. Browser timers in a background tab can be throttled, so the race tests used a deterministic 2.5 s source-fetch delay.
- **Integrity scope:** client-side integrity is out of scope against a user with DevTools, as the harness itself states. Release binding is workflow provenance only: it is not authentication, a signature, deployment enforcement or proof of human review.
- **Source citations:** not re-checked text-by-text in this run. The scenario block and source bytes are identical to v0.3.13, where every citation was verified.

---

**DEPLOYED v0.3.14 QUALIFICATION: FAIL**

**V0313-F01: NOT CLOSED**

**ACTIONABLE FINDINGS REMAIN: YES**

**v1.0 PROMOTION GATE: NOT SATISFIED**
