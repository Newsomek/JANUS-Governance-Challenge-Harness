# Changelog

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
