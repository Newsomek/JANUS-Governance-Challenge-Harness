# SUPERSEDED — historical JANUS v0.3.6 release gate

This gate must not be used for current releases. The independent targeted v0.3.6 closure test closed seven findings but left V035-F04 and V035-F05 partially closed.

See `V0_3_7_RELEASE_GATE.md`.

# JANUS v0.3.6 release gate

Version 0.3.6 is a bounded hardening candidate addressing the nine actionable findings from the v0.3.5 final independent adversarial regression.

Before any Version 1.0 promotion, all of the following must pass on the exact v0.3.6 candidate/release:

1. `node tests/v0.3.6-regression.mjs`
2. `node tests/v0.3.6-doc-audit.mjs`
3. `node tests/v0.3.6-mutation-regression.mjs`
4. `node tests/v0.3.6-manifest-audit.mjs` after generating the bound manifest
5. actual automated output preserved in `tests/V0_3_6_AUTOMATED_REGRESSION_RESULT.txt`
6. source SHA-256 remains `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`
7. authored scenario-block SHA-256 remains `948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488`
8. scenario-block hashing method is recorded as UTF-8 bytes from `const scenarios = [` through the closing `];` plus one trailing LF
9. exact six canonical dispositions remain unchanged
10. every scenario contract hash matches `docs/EXPECTED_CONTRACT_HASHES.json`
11. the bound release manifest covers every tracked release file except `build-info.json` itself
12. deployed six-scenario Run -> Replay CONSISTENT -> Export PASS sanity smoke
13. targeted V035-F01 through V035-F09 closure test
14. zero actionable findings in that targeted closure test
15. one final full independent zero-open-finding adversarial regression
16. zero Critical, High, Medium, Low, or actionable Observation findings in the final regression

Historical v0.3.2 through v0.3.5 suites, gates, and reports remain preserved as evidence but are not current-release gates.

Do not create a Version 1.0 tag until a separate Version 1.0 artifact is built, deployed, and verified.
