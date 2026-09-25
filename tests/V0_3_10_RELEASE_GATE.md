# JANUS v0.3.10 release gate

Version 0.3.10 replaces guarded-claim keyword/allowlist inference as the current release-document control with exact governed-release change control.

V035-F04 remains independently closed. V035-F05 remains partially closed pending targeted independent v0.3.10 retest.

The six authored scenarios, canonical dispositions, JANUS source document, and scenario-contract oracle remain unchanged.

## Local candidate gate

Before creating the bound v0.3.10 release manifest:

1. `node tests/v0.3.10-regression.mjs`
2. `node tests/v0.3.10-doc-audit.mjs`
3. `node tests/v0.3.10-surface-fixtures.mjs`
4. `node tests/v0.3.10-surface-mutation-regression.mjs`
5. `node tests/v0.3.10-surface-review-proposal.mjs` reports no unapproved governed release changes
6. JANUS source SHA-256 remains `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`
7. authored scenario-block SHA-256 remains `948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488`
8. exact six canonical dispositions remain unchanged
9. every scenario contract hash matches `docs/EXPECTED_CONTRACT_HASHES.json`
10. the v0.3.9 independent targeted report and raw evidence remain preserved unchanged
11. Version 1.0 remains blocked

## Bound release construction

The v0.3.10 release uses the established two-commit provenance model.

First create the exact v0.3.10 code/content commit containing the approved release documents, runtime identity, current regression/gate files, governance controls, and preserved evidence.

Then generate `build-info.json` so that:

- `version` is `0.3.10`;
- `build_id` is `janus-governance-challenge-harness-v0.3.10`;
- `code_commit` is the exact first v0.3.10 code/content commit;
- `files` contains SHA-256 for every tracked release file except `build-info.json` itself.

After generating the bound manifest:

12. `node tests/v0.3.10-manifest-audit.mjs`
13. commit only the governed `build-info.json` provenance update as the second release commit
14. verify the working tree is clean
15. verify deployed GitHub Pages reports Version 0.3.10 and the expected Build ID
16. verify deployed `build-info.json` binds the exact v0.3.10 code/content commit
17. verify served `app.js` SHA-256 matches the bound manifest
18. perform the deployed six-scenario Run → Replay CONSISTENT → Export PASS smoke gate
19. independently verify exact deployed-artifact identity and manifest coverage

## Independent closure gate

20. targeted independent retest of residual V035-F05 against the exact deployed v0.3.10 artifact
21. zero actionable findings in that targeted retest
22. one final full independent zero-open-finding adversarial regression
23. zero Critical, High, Medium, Low, or actionable Observation findings in that final regression

Independent closure of V035-F05 is not claimed until the targeted v0.3.10 retest passes with zero actionable findings.

Do not create a Version 1.0 tag from v0.3.10.

Only after the exact v0.3.10 deployed artifact passes the required independent closure gates should a separate Version 1.0 artifact be prepared. That Version 1.0 transition may add `LICENSE` through the governed release-file approval process. The exact Version 1.0 artifact must then be independently tested before the final Version 1.0 tag is created.
