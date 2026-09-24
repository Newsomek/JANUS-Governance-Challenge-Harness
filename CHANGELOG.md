# Changelog
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
