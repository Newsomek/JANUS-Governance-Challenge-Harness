# JANUS Governance Challenge Harness v0.3.11 — Targeted V035-F05 Closure Test

**Result: V035-F04 — CLOSED · V035-F05 — PARTIALLY CLOSED · Targeted closure gate: FAIL**

| Item | Value |
|---|---|
| Date | 2026-09-25 |
| Tester | Claude, independent. No repository writes, commits, tags, branches, releases or PRs. |
| Scope | Targeted retest of V035-F05 (with the v0.3.10 residuals R01–R03), plus a V035-F04 non-regression check. **This is not the final full independent Version 1.0 regression.** |
| Artifact tested | The **actual deployed artifact**: all 100 served files were fetched from GitHub Pages in a real browser and hashed. Repository files were used separately for the structural audit and mutation probes. |
| Raw evidence | `JANUS_v0.3.11_targeted_F05_closure_raw_evidence.txt` |

---

## 1. Summary

The v0.3.11 complete-tree boundary is a large structural improvement. Every attempt to add, delete, rename, change the mode or type of, or edit a tracked path outside the two provenance files was rejected, in both the working-tree and committed forms. Every attempt to narrow the release state was also rejected, and so was every history-shape attack that stays inside the stated trust boundary. R01 is closed for all ordinary tracked and public surfaces. R02 is closed at the wording level, and R03 is closed.

V035-F05 is still **not closed**, because one reproducible bypass remains inside the two files that are allowed to change:

- **F11-01 (Low, actionable).** The two provenance files are only checked after parsing, not at the byte level. A duplicate JSON key lets `build-info.json` and `docs/APPROVED_RELEASE_STATE.json` carry arbitrary release or approval claims, for example `"approval_semantics": "Authenticated, digitally signed approval by an independent human reviewer."`. Both files still pass every v0.3.11 audit, and the deployed app's own parser still accepts them. This contradicts current claims in `VERSION.txt`, `CHANGELOG.md` and the release gate that these files "cannot carry arbitrary status or approval claims".

There are also two actionable Observations related to F05 (F11-02 and F11-03) and one Low finding outside the F05 mechanism (F11-04, a stale version label on the page). All four can be fixed with small, bounded changes. Because the bound state cannot be changed, each fix needs a new Commit A, which means a new version.

---

## 2. Environment and method

- **Sandbox:** isolated cloud Linux sandbox, Node v22.22.2, git 2.43.0. `git clone` of the public repo produced HEAD `2fdf411…`.
- **Deployed-artifact access:** the sandbox's network proxy refused `*.github.io` with a 403. All deployed observations were therefore made in a real Chrome tab on the live Pages URL, using `fetch(…, {cache:"no-store"})` with cache-busting and `crypto.subtle` SHA-256. Scenario runs went through the page's own UI controls.
- **Export capture:** no file was downloaded. `URL.createObjectURL` was wrapped to read the export Blob, anchor clicks with a `download` attribute were suppressed, and `alert` was captured so that refusals could be recorded.
- **Mutation probes:** each probe ran in a fresh, disposable local clone. Every probe was judged by the **pristine** verifier (the untouched `tests/` directory from the clone at `2fdf411`) pointed at the mutated clone through `JANUS_TEST_ROOT`. A probe counts as **PASS** only when both the final-mode release-state audit and the manifest audit exit 0. Only the "rewrite the verifier" probe used the clone's own verifier, and that was deliberate.
- **Independent tooling:** I wrote my own build-info generator. From Commit A it reproduces the deployed `build-info.json` byte-for-byte, SHA-256 `9f77de83…787c5d`.

---

## 3. Phase 1 — exact deployed-artifact identity

| Check | Expected | Observed (deployed unless noted) | Result |
|---|---|---|---|
| Version / Build ID | 0.3.11 / `janus-governance-challenge-harness-v0.3.11` | same (build-info, app constants, export records) | ✅ |
| Release HEAD (`main`) | `2fdf41158000ab13b9b05487b6cb06b8ec7ddb6c` | GitHub API `commits/main` = same. Latest github-pages deployment sha = same, state success | ✅ |
| Commit A | `420211a89493dbb741a9bae6b4cb79b72ee34174` | parent of HEAD; `code_commit` in both provenance files | ✅ |
| Commit A tree | `c09d6f17b1e7f8d02661c2c40605827b770f1b1b` | `git rev-parse 420211a^{tree}` = same; `code_tree` in state = same | ✅ |
| `build-info.json` SHA-256 | `9f77de83…787c5d` | served = same | ✅ |
| `APPROVED_RELEASE_STATE.json` SHA-256 | `c1556e26…2f83ab` | served = same | ✅ |
| `app.js` SHA-256 | `94eb3132…957842` | served = same | ✅ |
| JANUS source SHA-256 | `21766f5d…551fe4` | served docx = same (50,354 bytes) | ✅ |
| Authored scenario-block SHA-256 | `948536a1…b56488` | recomputed from app.js with the regression's boundary rule = same | ✅ |
| Strict 4-field build-info schema | `version, build_id, code_commit, files` | exactly those keys | ✅ |
| Release-state schema | 9 fixed keys | exactly those keys; values equal the library constants | ✅ |
| build-info file-set coverage | Commit A tree minus `build-info.json` | 99 entries = the Commit A tree minus build-info (exact set equality), and all hashes match `git show A:path` | ✅ |
| Commit B contents | exactly the two provenance files | API `files` and `git diff --name-status A B`: `M build-info.json`, `M docs/APPROVED_RELEASE_STATE.json` | ✅ |
| Commit B parent | exactly Commit A | single parent `420211a…`; `rev-list --count A..B` = 1 | ✅ |
| **Complete served tree** | the 100 tracked files at HEAD | all 100 served with HTTP 200. The manifest digest `88d0b560…3c5581` is identical for the deployment and the local HEAD | ✅ |

Pages is deployed from the branch (classic "pages build and deployment" workflow, no `.github/` directory), so the site serves the committed tree, not a working directory. This matters for how the working-tree-only observations are classified in section 9.

Note: `build-info.json` records `docs/APPROVED_RELEASE_STATE.json` as `ebcd1684…` (the Commit A placeholder), not the served `c1556e26…`. This is consistent with the design, but it is not how the README describes it. See F11-03.

---

## 4. Phase 2 — six-scenario deployed behaviour

| Scenario | Prediction | Run disposition | Replay | Export | 15/15 checks | Contract hash matches `EXPECTED_CONTRACT_HASHES.json` |
|---|---|---|---|---|---|---|
| condition-change | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | CONSISTENT | PASS | ✅ | `52a18511…` ✅ |
| evidence-change | BLOCK | BLOCK | CONSISTENT | PASS | ✅ | `36bc7042…` ✅ |
| authorization-expiry | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | CONSISTENT | PASS | ✅ | `e7e29686…` ✅ |
| learning-authority | BLOCK + REAUTHORIZE | BLOCK + REAUTHORIZE | CONSISTENT | PASS | ✅ | `d783abf9…` ✅ |
| conflicting-authorities | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | CONSISTENT | PASS | ✅ | `437615c4…` ✅ |
| mid-execution-revocation | INSUFFICIENT SPECIFICATION | INSUFFICIENT SPECIFICATION | CONSISTENT | PASS | ✅ | `916a960c…` ✅ |

Every export records version `0.3.11`, the v0.3.11 Build ID, `harness_code_commit` `420211a…`, a source hash match, the served app.js `94eb3132…`, `bound_commit_verification: MATCH`, `commit_verification: MATCH`, and `deployment_head_observed: 2fdf411…`. Totals: 6/6 Run PASS, 6/6 Replay CONSISTENT, 6/6 Export PASS, 6/6 integrity PASS, **0 alerts**.

---

## 5. Phase 3 — V035-F04 non-regression

On the deployed page I made 19 uncoordinated mutations to the stored record (`lastRun`) with no hash recomputation. The mutations covered editing, appending, deleting and reordering event-log entries; the disposition code and label; the label alone; the rationale; stored scenario evidence (`changed`/`execution`, `source_commitments`, `evidence_required`); an observation timestamp; the bound code commit; the contract hash; each stored integrity hash on its own; the prediction; two combinations; an added `approved:true` field; and deletion of the snapshot-hash field.

**Result: 19/19 Export refused before Replay, 19/19 Replay DIVERGED, 19/19 Export still refused after the divergent Replay.** Refusal messages name the failing checks, for example `event_log, stored_evidence_core_integrity, stored_record_snapshot_integrity, replay_rederived_consistent`. A fresh clean Run afterwards recovered normally (Replay CONSISTENT, Export PASS). Forging only the on-screen replay text did not affect the export. The export was re-derived and stayed BLOCK/consistent, which is correct because the UI is not trusted. Coordinated forgery with recomputed client-side hashes is outside scope, as the README documents.

**V035-F04: CLOSED** (no regression).

---

## 6. Phase 8 — supplied v0.3.11 suites (run independently)

| Suite | Result |
|---|---|
| `node tests/v0.3.11-regression.mjs` | PASS (9 canonical exports, 4 refusal alerts), exit 0 |
| `node tests/v0.3.11-release-state-fixtures.mjs` | PASS (2 pass fixtures, 11 killed), exit 0 |
| `node tests/v0.3.11-build-info-fixtures.mjs` | PASS (1 pass fixture, 7 killed), exit 0 |
| `node tests/v0.3.11-manifest-audit.mjs` | PASS (99 files from bound code commit), exit 0 |
| `tests/v0.3.11-release-state-audit.mjs` (construction) | PASS, exit 0 |
| same, `JANUS_FINAL_RELEASE_AUDIT=REQUIRE-FINAL-PROVENANCE-COMMIT` | PASS, FINAL RELEASE mode, 1 commit after code, 100 tracked files, exit 0 |

The supplied fixtures contain no duplicate-key, non-canonical-byte, ignored-file, or index-flag cases. Passing suites are therefore not evidence that F11-01 or F11-02 are closed.

---

## 7. Phases 4–6 and 9 — independent probes

**Totals:** 260 local repository probes (247 in the main set and 13 supplementary, used to correct probe artifacts and deepen two findings), plus 28 deployed-browser probes (6 smoke, 19 F04, 1 recovery, 1 DOM-only forgery, 1 parser parity) and a byte-for-byte comparison of all 100 deployed files.

| Phase | Probes (main + supplementary) | Killed | Passed | Unexpected (before classification) |
|---|---|---|---|---|
| 4 — tracked content / add / delete / rename / mode / type / untracked / staged / index | 133 + 10 | 116 + 8 | 17 + 2 | 12 + 2 |
| 4 — indirect narrowing | 19 + 2 | 19 + 0 | 0 + 2 | 1 + 0 |
| 5 — build-info abuse | 38 | 30 | 8 | 3 |
| 5 — release-state abuse | 26 | 20 | 6 | 4 |
| 6 — commit history | 31 + 1 | 21 + 1 | 10 | 1 |
| **Total local** | **260** | **215** | **45** | **23** |

### 7.1 What held (all killed as expected)

- **Tracked content (W and C):** app.js, including the Build ID string; styles.css; index.html; README; CHANGELOG; VERSION; the current release gate; a historical independent report (`PARTIALLY CLOSED` changed to `CLOSED`); raw historical evidence; a test implementation; two JSON control files; the JANUS source docx (1 byte); the candidate's own release-control library; `.gitignore`; claim bytes appended to the cover JPEG; CRLF-only and trailing-newline-only changes.
- **New paths (untracked, staged and committed):** `status.html`, `404.html`, `RELEASE.md`, `.txt/.md/.json/.html/.js/.css`, a PNG with a `tEXt` claim, an SVG claim, `docs/status/index.html`, `.well-known/release.json`, unicode and space filenames, the case variants `App.js`, `readme.md` and `index.htm`, `.gitattributes` with `export-ignore`, and an empty file.
- **Structure:** deleting README, `.nojekyll` or a historical report; renames including the case-only renames `README.md→readme.md` and `index.html→Index.html`; a mode change 644→755 (working tree and committed); symlink replacement (working tree and committed); a submodule gitlink (working tree and committed); force-adding an ignored file into Commit B.
- **Narrowing (R03):** adding README to the provenance set, replacing an entry, an empty set, a duplicate entry, a string instead of an array, narrowing the scope text, renaming the control, and dropping files from the build-info map. All were rejected. The provenance set is a code constant, and the build-info map must equal the full Commit A tree.
- **build-info (P):** `status`, `approved`, `reviewed`, `generated_at`, nested claim values, extra keys or objects, missing keys, wrong version / build ID / commit (another real commit, Commit B, non-existent), wrong hash, removed or extra entries, `../x`, `./app.js`, `/app.js`, backslash paths, non-hex and short hashes, wrong types, a top-level array, trailing garbage, a BOM, a `__proto__` key.
- **Release state:** extra `release_status` / `approved_by`, missing fields, altered scope or approval semantics, a different provenance set, a wrong Commit A (older ancestor with its own tree), a wrong tree, a valid tree paired with the wrong commit, a short SHA, a non-hex SHA, null, `schema:"1"`, `schema:2`, version 1.0, a top-level array, a deleted state file, trailing garbage, and a tree-object ID used as `code_commit`.
- **History:** zero commits after A (placeholder, and bound-but-uncommitted in final mode); two provenance commits; B plus an empty commit; B plus a whitespace-only provenance commit; a non-provenance file changed in B or after it; a file added or removed in B; change-then-revert (net-zero diff); A→X(claim)→B′; a merge with a side commit or an orphan root; a state that binds A while HEAD was rebased off A; `.git/info/grafts` hiding an extra commit; a shallow `--depth 1` clone (fails closed: "code_commit does not exist"); a detached HEAD at A; an empty B.

### 7.2 Passed by design (expected PASS, recorded for transparency)

| Probe | Why it is not a bypass |
|---|---|
| Byte-identical replacement (P119 working tree, P120 committed); `core.fileMode=false` chmod (P122); untracked empty directory (P123); skip-worktree edit not captured by `commit -a` (P133) | No tracked path or byte changed. |
| Semantically identical provenance reordering or reformatting (S09, P186–P190, P213, P214) | No claim content, but the same root cause as F11-01 (bytes are not canonical). Fixed by the same remedy. |
| Merge commit with parents (A, A^) and B's tree (P230) | Count stays 1 and the tree is still constrained to A plus provenance. Tree-level content is identical. |
| Different commit with a tree identical to A, rebound (P233) | Release bytes are identical. The Commit A SHA is an external identity anchor. |
| Hand-written binding byte-identical to the helper output (P234) | The helper has no special authority. Documented: "workflow declaration". |
| **Rebind** to a new Commit A′ containing a README claim, by helper (P235) or by hand (P236) | This creates a *different* release state with a different Commit A SHA. It is not a change after binding. It is only detectable against an externally published Commit A SHA, and the documentation says the binding is not authentication and results must be verified against the deployed artifact. **Category B**: exercising repository-write authority to declare a new release. |
| Candidate rewrites its own verifier and is audited with that verifier (P242) | **Category B.** The pristine verifier kills it (P243). No documentation claims self-protection. |
| Construction mode with uncommitted bound state (P220) | Final mode correctly rejects it (P219). |

---

## 8. Phase 7 — approval and authority wording review (current v0.3.11 surfaces)

I reviewed README (current sections), `VERSION.txt`, `CHANGELOG.md` v0.3.11, `tests/V0_3_11_RELEASE_GATE.md`, the visible text of `index.html`, the app.js UI strings, and `APPROVED_RELEASE_STATE.json`.

- **None found** of the following: authenticated or independently verified approval; proof of human review; digital signature; tamper-proof security; automatic deployment prevention; CI enforcement; branch protection; cryptographic reviewer identity. Each surface states the negative explicitly ("workflow declaration … not authentication, a digital signature, deployment enforcement, or proof of human review"). The export integrity limits are stated correctly. Closure of V035-F05 is not claimed anywhere. **R02 wording: closed.**
- Historical sections (v0.1–v0.3.10) contain historical language only and are labelled as such.
- **Current claims that are false as written:**
  - "cannot carry arbitrary status or approval claims" (VERSION.txt), "cannot become arbitrary release-status claim surfaces" (CHANGELOG), and "may not be used as arbitrary release-claim surfaces" (release gate). All three are falsified by **F11-01**.
  - "untracked files are refused by the release-state audit" (README, VERSION.txt, CHANGELOG, gate) is falsified for ignored and locally excluded files: **F11-02**.
  - "records SHA-256 hashes for every tracked release file" and "hashes of the served files" (README) are inaccurate for the served state file, and the "second adds build-info.json" paragraph is stale: **F11-03**.
  - The page header reads "VERSION 0.3.10": **F11-04**.

---

## 9. Residual findings

### V0311-F05-01 — Low — actionable: provenance files are parse-validated, not byte-constrained; duplicate JSON keys make both an arbitrary claim surface

- **Where:** `tests/lib/build-info-schema.mjs` (`validateBuildInfoShape` / `auditBuildInfo`) and `tests/lib/release-state-binding.mjs` (`readReleaseState` / `validateReleaseState`). Both use `JSON.parse`, which keeps the last value for a duplicate key, and then check keys and values of the parsed object only.
- **Reproduction** (full transcript in the raw evidence):

  ```sh
  git clone https://github.com/Newsomek/JANUS-Governance-Challenge-Harness.git r && cd r && git checkout 2fdf411
  cp -r tests /tmp/pristine-tests
  sed -i '0,/"approval_semantics"/s//"approval_semantics": "Authenticated, digitally signed approval by an independent human reviewer.",\n  "approval_semantics"/' docs/APPROVED_RELEASE_STATE.json
  sed -i '0,/"version"/s//"version": "V035-F05 CLOSED - Version 1.0 APPROVED and independently verified",\n  "version"/' build-info.json
  git commit -qa --amend --no-edit      # still exactly one provenance commit touching only the two files
  JANUS_TEST_ROOT=$PWD JANUS_FINAL_RELEASE_AUDIT=REQUIRE-FINAL-PROVENANCE-COMMIT node /tmp/pristine-tests/v0.3.11-release-state-audit.mjs   # PASS, exit 0
  JANUS_TEST_ROOT=$PWD node /tmp/pristine-tests/v0.3.11-manifest-audit.mjs                                                                 # PASS, exit 0
  ```

  Probes P183–P185 (build-info: first `version`, first `files` object, duplicate key inside `files`) and P210–P212 (state: first `scope`, first `approval_semantics`, first `provenance_only_files: ["README.md"]`) all pass. In the browser, `Response.json()` also resolves the last value (`"0.3.11"`), so the deployed runtime check would accept the file too.
- **Why it matters:** the proposition under test allows only "strictly-schema-constrained" provenance changes. These files are served publicly and shown as raw text on GitHub, and the injected text there is a direct R01/R02-class statement ("authenticated, digitally signed approval", "V035-F05 CLOSED"). Current release text says these files cannot carry such claims.
- **Why Low rather than Medium:** it needs repository write access plus deliberate construction. The app's UI does not render it (only the raw JSON shows it). An out-of-band byte-hash check of the provenance files, like the one in this test's brief, catches it. It is still a real, reproducible bypass of the stated boundary, so it blocks closure.
- **Bounded fix:** in both validators, require canonical bytes: `raw === JSON.stringify(parsed, null, 2) + "\n"`, with lowercase hex, and keep the fixed key order the helper and generator already emit. I confirmed that both deployed files already satisfy this exactly, so the check would not disturb a legitimate release. Add fixtures for duplicate keys (top-level, nested, inside `files`), key order, whitespace, uppercase hex and unicode escapes. This also closes the claim-free non-canonical variants (P186–P190, P213, P214).

### V0311-F05-02 — Observation — actionable: "untracked files are refused" is false for ignored and locally excluded files

- `getUntracked` uses `git ls-files --others --exclude-standard`. Files matched by `.gitignore`, `.git/info/exclude` or `core.excludesFile` are therefore invisible to the audit in both modes. Probes P125 (`status.log`), P126 (`.vscode/status.html`), P127 (`_backup-before-v0.2-x/index.html`), P128 (`.git/info/exclude`), P129 (`core.excludesFile`) and S11 (construction mode) all pass with a claim file present in the release workspace.
- **No deployment impact.** Branch-based Pages serves only committed content, and force-adding an ignored file into Commit B is killed (S12). It is still a precise, unqualified statement about the control in four current documents. It is also plausible in practice: the repo's own `.gitignore` ignores `_backup-before-*` release-backup directories.
- **Fix (either):** drop `--exclude-standard` (or also run `git ls-files --others --ignored --exclude-standard` and refuse non-empty output in final mode), **or** reword to "untracked, non-ignored files".

### V0311-F05-03 — Observation — actionable: build-info coverage statement is inaccurate for the released state file; bound-provenance paragraph is stale

- README says the manifest "records SHA-256 hashes for every tracked release file except `build-info.json` itself" and, in *Bound code provenance*, "hashes of the served files". The value recorded for `docs/APPROVED_RELEASE_STATE.json` is the **Commit A placeholder** (`ebcd1684…`), not the served file (`c1556e26…`). A verifier following release gate step 23 ("verify deployed file hashes") against build-info will see a mismatch for that file. The same paragraph says "the second [commit] adds `build-info.json`", which predates the two-file Commit B. As a result, nothing inside the release pins the served bytes of the state file, which is why F11-01 goes undetected there.
- **Fix:** reword to "hashes of every file in the bound code commit (Commit A); the state file is recorded at its Commit A placeholder bytes", and update the stale paragraph. F11-01's canonical-bytes rule then constrains the released state file.

### V0311-GEN-04 — Low — actionable, outside the F05 mechanism: the deployed v0.3.11 page header shows "VERSION 0.3.10"

- `index.html` line 17: `EXTERNAL ARCHITECTURAL CONFORMANCE CHALLENGE · VERSION 0.3.10`, confirmed in a zoomed screenshot of the live page. The string came in with v0.3.10 (`ac9ce22`) and was not updated. The title, footer, build-info and exports all say 0.3.11.
- This is not a failure of the release-state boundary. The boundary correctly bound these bytes, and by design it does not judge semantics. It is still a false current version-identity claim on the primary public surface. The supplied regression does not check it.
- **Fix:** update the label, or render it from `HARNESS_VERSION`, and add a regression assertion.

### Non-actionable Observations (no change required to close F05)

| ID | Observation | Why non-actionable | Optional hardening |
|---|---|---|---|
| O-1 | Working-tree edits hidden by `--skip-worktree` (P130), `--assume-unchanged` (P131) or a local `.git/info/attributes` clean filter (S10) pass final mode, including the "clean tracked working tree" requirement. | They need deliberate local index/config manipulation. They cannot reach a commit (P133: `commit -a` does not capture the change; a clean filter stores the original blob) and therefore cannot reach the branch-deployed site. The stated scope is the *committed* release state. | In final mode, refuse `git ls-files -v` entries tagged `h`/`S`, and run git with `-c core.attributesFile=/dev/null`. |
| O-2 | Local `refs/replace` can make the audit see a clean Commit B while the real HEAD commit contains a README claim (P239). | This manipulates the verification environment (category B). Replace refs are not fetched by a fresh clone (P241 killed), and `GIT_NO_REPLACE_OBJECTS=1` defeats it (P240 killed). The documentation already requires independent verification against the deployed artifact. | Set `GIT_NO_REPLACE_OBJECTS=1` in the audit's `spawnSync` env, and refuse if `git replace -l` or `.git/info/grafts` is non-empty. |
| O-3 | `code_commit` can be an annotated **tag object** ID that peels to Commit A, and the tag message can carry a claim (P215). | Hand-edit only; the helper always writes a commit. Release bytes are still exactly A's tree. Not deployed as a file. | Require `git cat-file -t <code_commit>` to equal `commit`. |
| O-4 | Rebinding to a new Commit A′ (P235/P236) or to a tree-identical A2 (P233) passes. | By definition this is a new release state, not a change after binding. The Commit A SHA is anchored externally, and the documentation does not claim otherwise. | Publish the approved Commit A SHA outside the repository (it already is, in the review brief). |

### Test / probe artifacts (not findings)

P003/P004 and P017/P018 used `sed` patterns that did not match, so they were no-ops. The corrected versions S01–S04 were killed. P118's `git add -A` dropped a gitlink that had no directory; the corrected S05 was killed. P152 had the wrong expectation: a working-tree provenance edit correctly fails the final clean-tree gate, and construction and committed variants S08/S09 pass as intended.

**Accounting of the 23 unexpected results:** 6 probe artifacts; 6 → F11-01; 6 → F11-02; 3 → O-1; 1 → O-2; 1 → O-3.

---

## 10. Status of the v0.3.10 residuals

| Residual | v0.3.11 status |
|---|---|
| **R01** — release-claim surfaces outside the governed boundary | **Closed for all tracked/public surfaces** (every add, edit, delete and rename of a tracked path was killed, W and C). **Residual:** the two provenance files remain a byte-level claim surface through duplicate keys (F11-01). |
| **R02** — approval/review authority overstatement | **Closed at the wording level.** No current overstatement was found, and the helper's lack of authority is disclosed. F11-01 allows an injected overstatement inside the state file, which is tracked there. |
| **R03** — narrowing the governed set | **Closed.** The provenance set is a code constant, the whole Commit A tree is in scope automatically, and all 21 narrowing probes behaved correctly (P152 was an expectation error, not a defect). |

---

## 11. Closure determination

**V035-F04: CLOSED.**

**V035-F05: PARTIALLY CLOSED.**

- Open Critical: 0. High: 0. Medium: 0.
- **Open Low: 2.** F11-01 (F05) and GEN-04 (outside the F05 mechanism, but a current public-surface defect).
- **Open actionable Observations related to F05: 2** (F11-02, F11-03).
- Known reproduction bypassing the stated boundary: **yes**, F11-01.
- Materially false current-release claims about what the mechanism proves: **yes**, "cannot carry arbitrary status or approval claims" (F11-01) and "untracked files are refused" (F11-02).

The closure criteria require zero of each, so **the targeted closure gate fails.** The fixes are small and bounded: one canonical-bytes check with fixtures, one git flag or wording change, two documentation corrections, and one label. Because v0.3.11's bound state is immutable by design, they need a new Commit A and a new version (v0.3.12), followed by a fresh targeted F05 retest.

## 12. Promotion constraint

Do **not** tag or promote Version 1.0. Even after these residuals are closed and a targeted retest returns zero actionable findings, Version 1.0 stays blocked until one final full independent zero-open-finding adversarial regression passes against that exact deployed artifact.
