# JANUS Governance Challenge Harness v1.0 Release Candidate Gate

Version 1.0 is being constructed as the next candidate directly from the published v0.3.14 release.

It is not yet a tagged or approved Version 1.0 release.

The deployed v0.3.14 qualification passed all runtime, scenario, provenance, replay, export, integrity, invalidation, and fail-closed tests but returned one Low actionable documentation finding: V0314-F01.

V0313-F01 therefore remained NOT CLOSED under the zero-actionable-finding rule.

## Closure objective

The Version 1.0 candidate must close V0314-F01 and thereby complete the remaining V0313-F01 documentation closure without changing:

- the six authored scenario contracts;
- their canonical dispositions;
- their canonical contract hashes;
- the JANUS Orientation Edition 2026 source document;
- runtime governance behavior already independently qualified in v0.3.14.

The bounded documentation corrections are:

1. preserve the V0312-F01 oracle correction under its correct historical attribution;
2. describe V0313-F01 / V0314-F01 using the actual release-documentation work;
3. remove stale historical "Current local release gates" labels;
4. ensure the CHANGELOG begins with its document title;
5. strengthen automated documentation checks so those defects fail closed.

## Historical-suite rule

All v0.3.x version-pinned suites remain historical evidence.

They are not current Version 1.0 gates unless explicitly incorporated into the v1.0 control suite.

Historical qualification reports and raw evidence must not be rewritten to remove terminology that was accurate or observed at the time.

## Release-state architecture

The release boundary remains the complete exact Git Commit A and its Git tree.

Every tracked path and byte in Commit A belongs to the governed release state.

Commit B must:

- be the single direct child of Commit A;
- change exactly `build-info.json` and `docs/BOUND_RELEASE_STATE.json`;
- bind those provenance files to exact Commit A and its exact Git tree.

No third release commit is permitted.

Release-state binding is workflow provenance only. It is not authentication, a digital signature, proof of human review, branch protection, CI enforcement, or deployment enforcement.

## Required local gates before Commit A

1. `node tests/v1.0-regression.mjs`
2. `node tests/v1.0-residual-fixtures.mjs`
3. `node tests/v1.0-release-lifecycle-fixtures.mjs`
4. `node tests/v1.0-doc-audit.mjs`
5. JANUS source SHA-256 unchanged
6. authored scenario-block SHA-256 unchanged
7. preserved v0.3.14 independent report SHA-256 unchanged
8. preserved v0.3.14 raw-evidence SHA-256 unchanged
9. visible title, eyebrow, and footer identify v1.0
10. working release-state and manifest controls fail closed before binding where required

## Commit A

Commit A is the exact governed v1.0 candidate code/content state.

All non-provenance release content, including preserved v0.3.14 qualification evidence and all v1.0 controls, must be committed in Commit A.

Record exact Commit A SHA and exact Commit A Git tree.

## After Commit A

11. run `tests/v1.0-bind-release-state.mjs` with explicit expected Commit A/tree
12. run `tests/v1.0-generate-build-info.mjs` with explicit expected Commit A/tree
13. run `node tests/v1.0-manifest-audit.mjs`
14. run construction-mode `node tests/v1.0-release-state-audit.mjs`
15. verify only the two provenance files are modified
16. create Commit B changing exactly those two files

## Final local release-candidate gates

17. final-mode `node tests/v1.0-release-state-audit.mjs`
18. `node tests/v1.0-manifest-audit.mjs`
19. `node tests/v1.0-regression.mjs`
20. `node tests/v1.0-residual-fixtures.mjs`
21. `node tests/v1.0-release-lifecycle-fixtures.mjs`
22. `node tests/v1.0-doc-audit.mjs`
23. verify workspace clean, including ignored/excluded untracked-file checks
24. verify Commit B is the only child of Commit A
25. verify Commit A -> Commit B changes exactly the two provenance-only files

## Deployment verification

After guarded fast-forward publication of the candidate, verify the deployed GitHub Pages artifact directly.

Do not infer deployment success from repository source.

Verify:

- version 1.0;
- build ID `janus-governance-challenge-harness-v1.0`;
- exact Commit A binding;
- exact release HEAD / Commit B;
- served `app.js` hash;
- JANUS source-document hash;
- authored scenario-block hash;
- complete served manifest;
- served `build-info.json`;
- served `docs/BOUND_RELEASE_STATE.json`;
- served `docs/EXPECTED_CONTRACT_HASHES.json`;
- served `tests/V1_0_RELEASE_GATE.md`.

## Independent Version 1.0 qualification gate

The exact deployed candidate must be independently tested directly.

Independent testing must verify:

- V0314-F01 is CLOSED;
- V0313-F01 is CLOSED;
- V0312-F01 remains CLOSED;
- all six authored scenarios return their exact canonical dispositions;
- Replay remains consistent;
- Export and all integrity checks pass;
- invalidation and fail-closed behavior remain intact;
- release identity and manifest binding remain exact;
- current documentation contains no actionable stale-release or version-substitution defects.

The six authored scenarios and JANUS source document must remain unchanged.

The candidate may be tagged and released as Version 1.0 only if the exact deployed candidate returns zero open Critical, High, Medium, or Low actionable findings.

## Version 1.0 release rule

Candidate identity is not release approval.

Do not create the Version 1.0 tag or GitHub Release until the exact deployed candidate has independently passed with zero actionable findings.

Only that independently qualified deployed artifact may become the Version 1.0 release.
