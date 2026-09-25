# SUPERSEDED — historical JANUS v0.3.9 release gate

This gate is retained for traceability and must not be used for the current release.

The independent v0.3.9 targeted V035-F05 closure test left V035-F05 partially closed. See `V0_3_10_RELEASE_GATE.md`.

# JANUS v0.3.9 release gate

Version 0.3.9 replaces the pattern-expansion documentation oracle with explicit fail-closed guarded-claim change control.

V035-F04 remains independently closed and is not reopened by this candidate.

Before any Version 1.0 promotion, all of the following must pass on the exact v0.3.9 candidate:

1. `node tests/v0.3.9-regression.mjs`
2. `node tests/v0.3.9-doc-audit.mjs`
3. `node tests/v0.3.9-doc-claim-fixtures.mjs`
4. the v0.3.9 mutation suite after it is rebound to the new claim-control policy
5. `node tests/v0.3.9-manifest-audit.mjs` after the bound manifest is generated
6. source SHA-256 remains `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`
7. authored scenario-block SHA-256 remains `948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488`
8. exact six canonical dispositions remain unchanged
9. every scenario contract hash matches `docs/EXPECTED_CONTRACT_HASHES.json`
10. the bound manifest covers every tracked release file except `build-info.json`
11. the preserved v0.3.8 targeted report remains a FAIL record and is not rewritten
12. targeted independent retest of V035-F05
13. zero actionable findings in that targeted retest
14. one final full independent zero-open-finding adversarial regression
15. zero Critical, High, Medium, Low, or actionable Observation findings in that final regression

Do not create a Version 1.0 tag until a separate Version 1.0 artifact is built, deployed, and verified.
