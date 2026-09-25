# JANUS v0.3.7 release gate

Version 0.3.7 is the narrow oracle-hardening response to the two residual partially closed findings from the independent v0.3.6 targeted closure test.

Before any Version 1.0 promotion, all of the following must pass on the exact v0.3.7 candidate:

1. `node tests/v0.3.7-regression.mjs`
2. `node tests/v0.3.7-doc-audit.mjs`
3. `node tests/v0.3.7-mutation-regression.mjs`
4. `node tests/v0.3.7-manifest-audit.mjs` after generating the bound manifest
5. source SHA-256 remains `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`
6. authored scenario-block SHA-256 remains `948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488`
7. exact six canonical dispositions remain unchanged
8. every scenario contract hash matches `docs/EXPECTED_CONTRACT_HASHES.json`
9. the bound release manifest covers every tracked release file except `build-info.json`
10. the preserved v0.3.6 targeted report remains a FAIL record and is not rewritten
11. targeted independent retest of residual V035-F04 and V035-F05
12. zero actionable findings in that targeted retest
13. one final full independent zero-open-finding adversarial regression
14. zero Critical, High, Medium, Low, or actionable Observation findings in that final regression

Do not create a Version 1.0 tag until a separate Version 1.0 artifact is built, deployed, and verified.
