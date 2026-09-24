# SUPERSEDED — historical candidate gate

This historical gate is retained for traceability and must not be used for current releases. See `V0_3_6_RELEASE_GATE.md`.

# JANUS v0.3.4 release gate

Version 0.3.4 is a bounded hardening candidate, not Version 1.0.

Before any promotion, all of the following must pass on the exact deployed release:

1. `node tests/v0.3.4-regression.mjs`
2. `node tests/v0.3.4-doc-audit.mjs`
3. `node tests/v0.3.4-mutation-regression.mjs`
4. recorded automated output preserved in `tests/V0_3_4_AUTOMATED_REGRESSION_RESULT.txt`
5. six-scenario deployed Run -> Replay CONSISTENT -> Export PASS smoke gate
6. full independent zero-open-finding adversarial regression
7. zero Critical, High, Medium, Low, or actionable Observation findings
8. authored scenario block unchanged from the v0.3.3 tested release / reviewed baseline
9. JANUS source document SHA-256 unchanged

The historical v0.3.2 and v0.3.3 regression suites are preserved as evidence but are not current-release gates.
