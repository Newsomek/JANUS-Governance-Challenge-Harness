# JANUS Governance Challenge Harness v0.3.14 Release Gate

Version 0.3.14 is a bounded documentation/process closure candidate for V0313-F01.

V0312-F01 is independently CLOSED by the deployed v0.3.13 qualification.

The deployed v0.3.13 qualification passed all six authored scenarios, replay, export, integrity, invalidation, fail-closed behavior, release identity, source conformance, attribution, and the original governance challenge.

That qualification found one open actionable finding: V0313-F01 (Low).

Version 1.0 remains blocked.

## V0313-F01 closure objective

V0313-F01 concerns release-process documentation, not runtime behavior.

The v0.3.13 release gate was a stale version-substituted copy of an earlier gate. It:

- described the wrong closure objective;
- did not name V0312-F01;
- incorrectly described historical V035-F05 work as the current closure objective;
- required `node tests/v0.3.11-regression.mjs`, a historical version-pinned suite that cannot pass after the intentional v0.3.13 verifier-oracle metadata change;
- left README identifying v0.3.12 controls as current.

v0.3.14 must close those documentation/process defects without changing the authored scenario contracts or JANUS source document.

## Historical-suite rule

`tests/v0.3.11-regression.mjs` and `tests/v0.3.12-regression.mjs` are historical, version-pinned suites.

They remain preserved as evidence of their release generations.

They are not current v0.3.14 release gates and are not required to pass against v0.3.14 identity.

Reusable historical fixture suites may still be run where their assertions remain release-independent.

## Release-state architecture

The release boundary is the complete exact Git Commit A and its Git tree.

Every tracked path and byte in Commit A belongs to the governed release state.

Commit B must:

- be the single direct child of Commit A;
- change exactly `build-info.json` and `docs/BOUND_RELEASE_STATE.json`;
- bind those provenance files to exact Commit A and its exact Git tree.

No third release commit is permitted.

Release-state binding is workflow provenance only. It is not:

- authentication;
- a digital signature;
- proof of human review;
- branch protection;
- CI enforcement;
- deployment enforcement.

## Required local gates before Commit A

1. `node tests/v0.3.14-regression.mjs`
2. `node tests/v0.3.14-residual-fixtures.mjs`
3. `node tests/v0.3.14-release-lifecycle-fixtures.mjs`
4. `node tests/v0.3.14-doc-audit.mjs`
5. JANUS source SHA-256 unchanged
6. authored scenario-block SHA-256 unchanged
7. preserved v0.3.13 independent report SHA-256 unchanged
8. preserved v0.3.13 raw-evidence SHA-256 unchanged
9. visible title / eyebrow / footer all identify v0.3.14
10. working release-state and manifest controls fail closed before binding where required

The v0.3.11 and v0.3.12 version-pinned regression suites are explicitly not current gates.

## Commit A

Commit A is the exact governed code/content state.

All non-provenance release content, including the preserved v0.3.13 qualification evidence and v0.3.14 controls, must be committed in Commit A.

Record the exact Commit A SHA and exact Commit A Git tree.

## After Commit A

11. run `tests/v0.3.14-bind-release-state.mjs` with explicit expected Commit A/tree
12. run `tests/v0.3.14-generate-build-info.mjs` with explicit expected Commit A/tree
13. run `node tests/v0.3.14-manifest-audit.mjs`
14. run construction-mode `node tests/v0.3.14-release-state-audit.mjs`
15. verify only the two provenance files are modified
16. create Commit B changing exactly those two files

## Final local release gates

17. final-mode `node tests/v0.3.14-release-state-audit.mjs`
18. `node tests/v0.3.14-manifest-audit.mjs`
19. `node tests/v0.3.14-regression.mjs`
20. `node tests/v0.3.14-residual-fixtures.mjs`
21. `node tests/v0.3.14-release-lifecycle-fixtures.mjs`
22. `node tests/v0.3.14-doc-audit.mjs`
23. verify workspace clean, including ignored/excluded untracked-file checks
24. verify Commit B is the only child of Commit A
25. verify Commit A -> Commit B changes exactly the two provenance-only files

## Deployment verification

After guarded fast-forward publication, verify the deployed GitHub Pages artifact directly.

Do not infer deployment success from repository source.

Verify:

- version 0.3.14;
- build ID `janus-governance-challenge-harness-v0.3.14`;
- exact Commit A binding;
- exact release HEAD / Commit B;
- served `app.js` hash;
- JANUS source-document hash;
- authored scenario-block hash;
- complete served manifest;
- served `build-info.json`;
- served `docs/BOUND_RELEASE_STATE.json`;
- served `docs/EXPECTED_CONTRACT_HASHES.json`;
- served `tests/V0_3_14_RELEASE_GATE.md`.

## Independent V0313-F01 closure gate

Independent testing must verify directly that:

- the v0.3.14 release gate names V0313-F01 as the current closure objective;
- V0312-F01 is recorded as independently closed by v0.3.13;
- historical v0.3.11 and v0.3.12 version-pinned regressions are not current required gates;
- every required current gate named by this document is valid for the v0.3.14 tree;
- README labels historical control suites as historical and identifies current v0.3.14 controls;
- all six authored scenarios still return their canonical dispositions;
- Replay remains consistent;
- Export and all integrity checks pass;
- invalidation and fail-closed behavior remain intact;
- release identity and manifest binding remain exact.

The six authored scenarios and JANUS source document must remain unchanged.

V0313-F01 may be called CLOSED only when the exact deployed v0.3.14 artifact returns zero open Critical, High, Medium, or Low actionable findings.

## Version 1.0 rule

A clean v0.3.14 closure does not itself make the artifact Version 1.0.

Only after deployed v0.3.14 independently returns zero open actionable findings may Version 1.0 promotion begin.

The resulting exact deployed Version 1.0 artifact must then receive its own independent deployed verification with zero open actionable findings before tagging, GitHub Release creation, or external delivery.
