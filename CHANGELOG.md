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
