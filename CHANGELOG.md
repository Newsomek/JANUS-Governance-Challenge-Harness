# Changelog

## v1.0 — release candidate

- begins Version 1.0 candidate construction directly from the published v0.3.14 release;
- preserves the complete independent v0.3.14 deployed qualification report and raw evidence unchanged;
- records that v0.3.14 passed all runtime/scenario/provenance checks but returned Low documentation finding V0314-F01;
- corrects the VERSION.txt closure attribution so V0312-F01 remains associated with its actual v0.3.13 oracle correction;
- removes stale historical "current release gates" labeling from README;
- restores `# Changelog` as the first line of this document;
- strengthens documentation auditing around closure attribution, historical/current control labeling, and document structure;
- preserves all six authored scenarios, canonical dispositions, canonical contract hashes, and the JANUS source document unchanged;
- requires direct independent testing of the exact deployed v1.0 candidate with zero actionable findings before any Version 1.0 tag or GitHub Release.

## v0.3.14 — V0313-F01 release-documentation closure candidate

- preserves the complete independent v0.3.13 deployed qualification report and raw evidence unchanged;
- records V0312-F01 as independently closed by the v0.3.13 deployed qualification;
- addresses V0313-F01, the Low release-documentation finding identified by that qualification;
- creates a v0.3.14 release gate explicitly centered on V0313-F01 rather than rewriting the historical v0.3.13 gate;
- removes historical version-pinned regression suites from the current required-gate list;
- adds a targeted v0.3.14 documentation audit covering release-gate objective, required-suite identity, and README control-suite labeling;
- preserves all six authored scenarios, their canonical dispositions, and the JANUS source document unchanged;
- keeps Version 1.0 blocked pending an exact deployed v0.3.14 independent zero-open-actionable-finding closure check.

## v0.3.13 — V0312-F01 provenance-label closure candidate

- preserves the complete v0.3.12 deployed qualification report and raw evidence;
- preserves all six authored scenarios, contract hashes, canonical dispositions, and the JANUS source document unchanged;
- corrects V0312-F01 by replacing the ambiguous verifier-oracle field `"version": "0.3.9"` with explicit historical metadata `contracts_last_changed_in: 0.3.9`;
- adds regression coverage preventing the active contract-hash verification oracle from presenting historical contract-origin metadata as current release identity;
- retains the complete Commit A / single Commit B release-state architecture;
- keeps Version 1.0 blocked pending independent deployed v0.3.13 closure with zero open actionable findings.
## v0.3.12 — residual release-state closure candidate

- preserves the complete Commit A / one-provenance-Commit-B architecture introduced in v0.3.11;
- preserves the independent v0.3.11 targeted closure report and raw evidence unchanged;
- requires exact canonical JSON bytes for `build-info.json` and `docs/BOUND_RELEASE_STATE.json`, eliminating duplicate-key and alternate-serialization claim surfaces;
- requires lowercase commit/tree/hash representations in the canonical provenance records;
- detects untracked release-workspace files even when hidden by `.gitignore`, `.git/info/exclude`, or `core.excludesFile`;
- adds a deterministic, committed v0.3.12 build-info generator that reads exact bytes from Commit A rather than the mutable working tree;
- constrains build-info to hashes of non-provenance Commit A files only; both Commit B provenance files are excluded from the manifest map and validated separately;
- final-mode release auditing requires Commit B to be the single direct child of Commit A and to change exactly both provenance-only files;
- corrects the stale visible page version label and adds regression coverage for title, eyebrow and footer identity;
- leaves V035-F04 closed and V035-F05 partially closed pending independent v0.3.12 targeted retest;
- leaves Version 1.0 blocked pending zero-actionable-finding targeted closure and one final full independent zero-open-finding regression.
## v0.3.11 — complete release-state boundary hardening

- replaces the four-file governed-surface boundary with an exact Commit A / Git-tree release boundary;
- treats every tracked release path and byte as part of the bound code/content state automatically;
- permits only `build-info.json` and `docs/APPROVED_RELEASE_STATE.json` to differ in the single provenance Commit B;
- rejects added tracked files, removed tracked files, untracked files, post-code runtime/style/document/evidence changes, and additional release commits;
- constrains both provenance files with fixed schemas so they cannot become arbitrary release-status claim surfaces;
- binds `build-info.json` to the exact Commit A file set and bytes rather than regenerating authority from the current working tree;
- explicitly states that release-state binding is a workflow declaration, not authentication, signature, human-review proof, CI enforcement, or deployment enforcement;
- preserves the independent v0.3.10 targeted report and raw evidence unchanged;
- retains V035-F05 as partially closed pending targeted independent v0.3.11 retest;
- leaves Version 1.0 blocked pending zero-finding targeted closure and final full independent regression.

## v0.3.10 — exact governed-release baseline candidate

- preserves the independent v0.3.9 targeted V035-F05 PARTIALLY CLOSED report and raw evidence unchanged;
- records V035-F04 as independently closed and retains V035-F05 as partially closed pending targeted independent retest;
- retires guarded-claim keyword/allowlist inference as the current release-document control;
- binds the exact approved release-document bytes with SHA-256 rather than attempting semantic classification of arbitrary natural-language claims;
- introduces a versioned governed-release file manifest so the protected file set can itself change through explicit review;
- rejects unapproved changes to either governed content or the governed-file set;
- keeps candidate review generation read-only and requires explicit approval before a changed state becomes the new baseline;
- verifies a future LICENSE/file-set transition is blocked before approval and can be accepted after explicit approval;
- adds isolated mutation coverage for per-file content binding, baseline binding, manifest binding, file-set equality, and governed-file traversal completeness;
- derives the current v0.3.10 behavioral regression from the preserved v0.3.9 suite while leaving the historical v0.3.9 regression intact; the six authored scenarios and canonical dispositions remain unchanged.

Independent closure of V035-F05 is not claimed. Version 1.0 remains blocked pending targeted v0.3.10 closure testing and one final full independent zero-open-finding adversarial regression.

## v0.3.9 — fail-closed documentation-claim control candidate

- preserves the independent v0.3.8 targeted V035-F05 FAIL evidence unchanged;
- records V035-F04 as independently closed;
- retains V035-F05 as partially closed pending independent retest;
- replaces phrase-expansion release-claim matching with explicit reviewed guarded-claim allowlisting;
- normalizes formatting and invisible-character variants before guarded-claim comparison;
- treats unreviewed guarded claims as failures instead of attempting to infer arbitrary natural-language intent;
- does not change the six authored scenarios or their canonical dispositions.

Independent closure of V035-F05 is not claimed. Version 1.0 remains blocked.

## v0.3.8 — bounded F05 oracle hardening candidate

- preserves the independent v0.3.7 targeted residual FAIL evidence unchanged;
- records V035-F04 as independently closed;
- retains V035-F05 as the single remaining actionable residual finding;
- broadens release-claim detection for the exact false-negative paraphrases demonstrated by independent v0.3.7 testing;
- adds explicit must-pass negative/disclaimer fixtures for the false-positive forms demonstrated by that test;
- removes the stale v0.3.6 release narrative from the current UI;
- adds those demonstrated F05 bypasses as mutation operators;
- does not change the six authored scenarios or their canonical dispositions.

Independent closure of V035-F05 is not claimed. Version 1.0 remains blocked.

## v0.3.7 — targeted oracle hardening candidate

- preserves the exact v0.3.6 targeted independent closure FAIL evidence;
- does not change the six authored scenarios;
- replaces the F04 Export event-log source-text oracle with a behavioral export-refusal assertion;
- broadens F05 overclaim detection across README, CHANGELOG current-release text, VERSION.txt, and index.html;
- adds the exact equivalent mutations that survived the v0.3.6 targeted closure pass;
- keeps Version 1.0 blocked pending targeted F04/F05 closure and one final full independent zero-open-finding adversarial regression.

Historical status: v0.3.6 closed seven of nine v0.3.5 findings in targeted independent testing. V035-F04 and V035-F05 remained partially closed, so v0.3.6 was superseded and was not promoted to Version 1.0.

## v0.3.6 — bounded hardening candidate
- addresses V035-F01 through V035-F09 from the v0.3.5 final independent adversarial regression without changing authored scenario content;
- maps blank-rendering filler characters to ordinary spaces before canonical whitespace collapse, strips U+007F, and adds internal-separator regression coverage;
- re-checks export generation state immediately before the synchronous artifact-download path;
- adds exact source SHA, scenario-block SHA/method, exact canonical dispositions, expected contract-hash verification, and broader mismatch/invalidation integrity assertions;
- expands mutation testing to cover the core regressions identified by V035-F04/F05 rather than only the previous 18 operators;
- corrects historical v0.3.2/v0.3.4 status language and the v0.3.3 superseded-gate pointer;
- requires the bound v0.3.6 manifest to cover every tracked release file except build-info.json itself;
- preserves the v0.3.5 final independent report and findings log under testing/claude/v0.3.5/.

Independent closure is not claimed until targeted V035-F01 through V035-F09 closure and one final full zero-open-finding regression both pass.

## v0.3.5 — final residual hardening candidate
- canonicalizes duplicate-comparison text using Unicode NFC, selected ignorable/blank handling, and whitespace collapse so specified canonically equivalent commitment/source variants are rejected;
- adds behavioural regression cases for near-duplicate commitments and sources, including whitespace, NBSP, zero-width/default-ignorable, Hangul filler, Braille blank, and Unicode-normalization variants;
- aligns README and UI integrity disclosures: exported evidence is unsigned client-side evidence and PASS is not cryptographic authenticity;
- marks historical v0.3.2/v0.3.4 release gates as superseded and names the current v0.3.5 suites/gate;
- corrects the v0.3.3 historical record: V031-NEW-07 was confirmed closed in that independent regression;
- extends positive documentation assertions and mutation tests so these corrections fail closed if reverted.
Historical status: v0.3.5 passed its deployed smoke gates but its final independent regression found nine actionable findings; it was superseded and was not promoted to Version 1.0.


## v0.3.4 — bounded hardening candidate

- addresses V033-NEW-01 through V033-NEW-06 without changing authored scenario content;
- broadens invisible-text validation and rejects duplicate commitments;
- serializes Run, Replay, and Export so stale async completions cannot re-enable superseded evidence actions;
- validates stored run-record structure before hashing/replay/export and returns stable refusal messages;
- replaces static-only coverage claims with behavioural regression and mutation testing;
- corrects integrity-limit documentation and publishes expected scenario contract hashes for offline verification;
- corrects VERSION/README/release-gate documentation.

Historical status: v0.3.4 was superseded after its deployed smoke test found residual issues; it was not promoted to Version 1.0.

## v0.3.3 — bounded zero-open-finding hardening candidate

- was intended to address V032-NEW-01 through V032-NEW-09; independent v0.3.3 testing found six residual actionable findings, while V031-NEW-07 observability was confirmed closed;
- preserves all six authored scenario contracts unchanged;
- adds explicit regression cases and a recorded automated test result;
- remains a pre-Version-1 candidate pending deployed smoke and independent adversarial regression.

## v0.3.2 — Zero-known-defect hardening candidate

Based on the independent v0.3.1 release-candidate test:

- closes V031-NEW-01 with strict scenario schema and enum validation plus null-safe lookup;
- closes V031-NEW-02 by restoring runnable state after transient refusals;
- closes V031-NEW-03 by suppressing invalidation notices when no evidence existed;
- closes V031-NEW-04 by freshly re-deriving the replay block at Export;
- closes V031-NEW-05 by validating manifest version/build ID and corroborating the declared bound commit when available;
- closes V031-NEW-06 by routing structural hash failures through guarded refusal paths;
- partially addressed V031-NEW-07 by persisting Export refusal reasons and naming failed fetch resources; independent v0.3.3 testing later confirmed full observability closure;
- closes V031-NEW-08 through README, changelog, integrity-scope, and provenance documentation cleanup;
- adds automated regression coverage and a zero-open-finding gate before Version 1.0 promotion.

## v0.3.1 — Stable integrity baseline correction

Based on the independent v0.3 regression at commit `d79b0385c5b041772580121deaaf1531c8d4a845`:

- fixes V03-NEW-01 by excluding volatile per-fetch metadata from the stable authored evidence core;
- adds a separate full stored-record snapshot hash;
- binds served `app.js` to a governed `build-info.json` manifest and code commit;
- treats GitHub `main` lookup only as optional corroboration;
- includes repository, restrictions and attributions in the protected authored core;
- surfaces Run/Replay refusal reasons;
- adds scenario-contract schema validation and guarded evidence construction;
- clears hidden result DOM during invalidation/reset;
- explains S05/S06 `BLOCK + REAUTHORIZE` exclusions in compatibility rationale;
- preserves Claude v0.3 regression evidence under `testing/claude/v0.3/`;
- requires a deployed six-scenario Run → Replay → Export smoke test and full independent regression before a reviewed tag.

## v0.3 — Evidence-integrity hardening candidate

Built from independently regression-tested v0.2 commit `ba7b6e5b9335f395499f569f0df091962c69bb8f`.

### Remediations from the v0.2 regression

- **DEF-02 / NEW-02:** source-document integrity now hashes the actual served DOCX bytes with `crypto.subtle` at Run, Replay, and Export.
- **DEF-03:** exports record the absolute source URL, expected/observed source hashes, run/export timestamps, and the full GitHub `main` SHA observed at run time when available.
- **NEW-03:** export rechecks contract, source, event log, labels/comparison, stored evidence-core hash, fresh authored-state hash, and replay status; ordinary export is refused on failure/divergence.
- **DEF-10 / NEW-06:** S02 #2, S03 #1, and S05 #2 are `REASONABLE INFERENCE`; support terms are defined and visually distinct; §26 is identified in S03 as an analogy source.
- **NEW-05:** compatible predictions and their authored rationale are visible and exported. ESCALATE is treated as compatible for S01/S03/S04; S06 CONTINUE remains DIFFERENT with an explicit reason tied to the glossary definition.
- **NEW-01:** generation-token guards discard stale async completions and replay null-checks after awaits.
- **NEW-04:** prediction validation uses an explicit allow-list / own-key check.
- **NEW-07:** fresh-page selection changes no longer claim prior evidence was invalidated; exports distinguish `generated_at` and `exported_at`.

### Evidence preservation

The complete v0.2 regression report and raw results are preserved under `testing/claude/v0.2/`.

## v0.2

Hardening release based on the independent v0.1 full-matrix test.

### Remediations

- **DEF-01 High — stale state:** scenario/prediction changes now invalidate prior results and disable Replay/Export until rerun.
- **DEF-02 Medium — replay overclaim:** replay is now explicitly a static-contract re-derivation and compares contract/source hashes.
- **DEF-03 Medium — thin exports:** exports now include timestamp, build ID, source URL/hash, contract hash, scenario/perturbation, event log, replay result, and attribution; filenames include prediction and timestamp; internal consistency is checked before export.
- **DEF-04 Medium — undefined labels:** added disposition glossary and exact/partial/different comparison model; clarified compound Scenario 04 behavior.
- **DEF-05 Medium — fail-closed inconsistency:** Scenario 05 now separates unresolved precedence from the source-supported constraint against silent execution.
- **DEF-06 Medium — computed-language overreach:** renamed runtime language to "encoded orientation-level assessment" and "encoded source commitments".
- **DEF-07 Low — reset anchoring:** Reset now returns prediction to a neutral placeholder and requires an explicit choice.
- **DEF-08 Low — missing evidence question:** added evidence-required field to UI and exports.
- **DEF-09 Low — pre-replay labeling:** pre-replay state now says "NOT YET REPLAYED" and does not claim a replay has occurred.
- **DEF-10 Low — support-strength overstatement:** added EXTENDED / BY ANALOGY and REASONABLE INFERENCE statuses.
- **DEF-11 Observation — provenance wording:** replaced "original / unchanged" claims with recorded repository-copy hash language.
- **DEF-12 Observation — invalid scenario:** invalid scenario selection is refused rather than dereferenced.

### Preserved test evidence

The complete v0.1 test report and raw results remain under `testing/claude/v0.1/`.
