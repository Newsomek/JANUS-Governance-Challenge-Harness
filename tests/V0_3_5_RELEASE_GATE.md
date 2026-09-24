# SUPERSEDED — historical candidate gate

This historical gate is retained for traceability and must not be used for current releases. See `V0_3_6_RELEASE_GATE.md`.

# JANUS v0.3.5 release gate

Version 0.3.5 is the final residual hardening candidate before any Version 1.0 promotion.

Before promotion, all of the following must pass on the exact deployed release:

1. `node tests/v0.3.5-regression.mjs`
2. `node tests/v0.3.5-doc-audit.mjs`
3. `node tests/v0.3.5-mutation-regression.mjs`
4. actual automated output preserved in `tests/V0_3_5_AUTOMATED_REGRESSION_RESULT.txt`
5. six-scenario deployed Run -> Replay CONSISTENT -> Export PASS smoke gate
6. targeted closure of the v0.3.4 smoke residuals
7. one final full independent zero-open-finding adversarial regression
8. zero Critical, High, Medium, Low, or actionable Observation findings
9. authored scenario block unchanged from the reviewed baseline
10. JANUS source document SHA-256 unchanged

Historical v0.3.2, v0.3.3, and v0.3.4 suites/gates remain preserved as evidence but are not current-release gates.
