# JANUS v0.3.11 release gate

Version 0.3.11 changes the release-governance boundary from a hand-selected governed-document set to the complete exact Git code/content commit and tree.

V035-F04 remains independently closed.

V035-F05 remains partially closed pending targeted independent v0.3.11 retest.

The six authored scenarios, canonical dispositions, JANUS source document, and scenario-contract oracle remain unchanged.

## Control objective

The deterministic control does not decide whether arbitrary English wording is acceptable.

It determines whether the candidate release corresponds to the exact code/content commit and Git tree deliberately bound for the release.

All tracked files are therefore inside the release-state boundary without needing semantic classification.

The only permitted post-code-commit changes are:

- `build-info.json`
- `docs/APPROVED_RELEASE_STATE.json`

Those two files constitute the single provenance commit.

Both have constrained schemas. They may not be used as arbitrary release-claim surfaces.

## Approval semantics

Release-state binding is a workflow declaration.

It is not:

- authentication of an approver;
- a digital signature;
- proof that a human reviewed the content;
- GitHub branch protection;
- CI enforcement;
- deployment enforcement.

The audit is an inspectable local release control whose results must be independently verified against the deployed artifact.

## Commit A — code/content state

Commit A contains every exact tracked release file, including:

- runtime code;
- styles;
- public documentation;
- test and release-gate material;
- JANUS source material;
- preserved independent evidence;
- release-control implementation;
- the unbound release-state placeholder.

No untracked release files are allowed.

After Commit A is created, record:

- exact code commit;
- exact Git tree.

## Commit B — provenance state

Using the explicit release-state binding workflow:

1. bind the exact Commit A SHA;
2. bind the exact Commit A Git tree;
3. generate strict-schema `build-info.json` from the exact Commit A tree;
4. commit only:
   - `build-info.json`
   - `docs/APPROVED_RELEASE_STATE.json`.

No other path may change in Commit B.

No third release commit is permitted.

## Required local gates

Before Commit A:

1. `node tests/v0.3.11-regression.mjs`
2. `node tests/v0.3.11-release-state-fixtures.mjs`
3. `node tests/v0.3.11-build-info-fixtures.mjs`
4. JANUS source SHA-256 remains unchanged
5. authored scenario-block SHA-256 remains unchanged
6. all six canonical dispositions remain unchanged
7. v0.3.10 independent report and raw evidence remain preserved unchanged
8. Version 1.0 remains blocked

After Commit A:

9. bind exact release state
10. generate build-info from exact Commit A
11. verify construction-mode release-state audit
12. verify strict build-info audit
13. commit exactly the two provenance files

After Commit B:

14. final release-state audit requires exactly one provenance commit
15. final release-state audit requires a clean tracked working tree
16. strict build-info audit passes against Commit A
17. behavioral regression passes
18. repository is clean

## Deployment gate

19. publish exact Commit B release HEAD
20. verify deployed Version 0.3.11
21. verify deployed Build ID
22. verify deployed bound code commit
23. verify deployed file hashes
24. verify JANUS source hash
25. verify authored scenario-block hash
26. run six-scenario deployed Run / Replay CONSISTENT / Export PASS smoke test

## Independent closure gate

27. targeted independent V035-F05 retest against exact deployed v0.3.11
28. zero actionable findings
29. one final full independent zero-open-finding adversarial regression
30. zero Critical, High, Medium, Low, or actionable Observation findings

Do not create a Version 1.0 tag from v0.3.11.

Only after those gates pass should a separate Version 1.0 artifact be prepared and independently tested.