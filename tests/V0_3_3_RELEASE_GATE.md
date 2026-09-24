# SUPERSEDED — historical v0.3.3 candidate gate

This historical gate contained an erroneous reference to the v0.3.2 regression suite. It is retained for traceability and must not be used for current releases. See `V0_3_6_RELEASE_GATE.md`.

# JANUS v0.3.3 release gate

This candidate is not eligible for Version 1.0 until all of the following pass on the deployed release:

- local v0.3.2 regression;
- v0.3.3 hardening regression;
- six-scenario Run → Replay CONSISTENT → Export PASS smoke gate;
- full independent zero-open-finding adversarial regression;
- zero Critical, High, Medium, Low, or actionable Observation findings.

The authored scenario content must remain unchanged from v0.3.2.
