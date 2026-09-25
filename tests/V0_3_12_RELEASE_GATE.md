# JANUS Governance Challenge Harness v0.3.12 Release Gate

Version 0.3.12 is a bounded residual-hardening candidate.

V035-F04 remains independently CLOSED.

V035-F05 remains PARTIALLY CLOSED until independent v0.3.12 targeted testing returns zero actionable findings.

Version 1.0 remains blocked.

## Release-state objective

The release boundary is the complete exact Git Commit A and its Git tree.

The control does not classify English claims or guess which files are public claim surfaces.

Every tracked path and byte belongs to Commit A automatically.

## Commit A — code/content state

Commit A contains the complete exact tracked candidate state, including:

- runtime code;
- HTML and CSS;
- documentation;
- tests and control implementation;
- source material;
- preserved independent evidence;
- the unbound `docs/BOUND_RELEASE_STATE.json` placeholder;
- the deterministic v0.3.12 build-info generator.

Record the exact Commit A SHA and exact Git tree.

## Commit B — provenance state

Exactly one commit may follow Commit A. Commit B must have exactly one parent, and that parent must be Commit A.

Commit B changes exactly both of these files:

- `build-info.json`;
- `docs/BOUND_RELEASE_STATE.json`.

`build-info.json` records:

- version;
- Build ID;
- exact Commit A SHA;
- SHA-256 for every non-provenance file in Commit A.

Both provenance-only files — `build-info.json` and `docs/BOUND_RELEASE_STATE.json` — are excluded from the manifest file map.

The served Commit B provenance files are constrained separately by:

- its fixed schema;
- its fixed semantic values;
- its exact canonical JSON representation.

Both provenance files must equal the exact canonical JSON serialization accepted by the v0.3.12 validators. Duplicate keys, reordered keys, alternate whitespace, Unicode-escape alternatives, uppercase commit/tree/hash strings, extra keys and missing keys are refused.

The two provenance files may not be used as arbitrary release-claim surfaces within this release-state mechanism.

## Untracked workspace files

The release-state audit refuses all untracked filesystem paths visible to Git's repository worktree enumeration, including paths hidden by:

- `.gitignore`;
- `.git/info/exclude`;
- `core.excludesFile`.

Git metadata inside `.git` is not part of the release tree.

## Binding semantics

Binding is an explicit workflow declaration.

It is not:

- authentication of an approver;
- a digital signature;
- proof that a human reviewed the release;
- CI enforcement;
- branch protection;
- deployment enforcement.

Independent verification must compare the published/deployed artifact with the declared release identity.

## Required local gates before Commit A

1. `node tests/v0.3.12-regression.mjs`
2. `node tests/v0.3.12-residual-fixtures.mjs`, including `tests/v0.3.12-release-lifecycle-fixtures.mjs`
3. `node tests/v0.3.11-regression.mjs`
4. `node tests/v0.3.11-release-state-fixtures.mjs`
5. `node tests/v0.3.11-build-info-fixtures.mjs`
6. JANUS source SHA-256 unchanged
7. authored scenario-block SHA-256 unchanged
8. preserved v0.3.11 independent report/raw evidence unchanged
9. visible title / eyebrow / footer all identify v0.3.12
10. real v0.3.12 release-state and manifest audits fail closed while still unbound

## After Commit A

11. record exact Commit A SHA
12. record exact Commit A Git tree
13. run `tests/v0.3.12-bind-release-state.mjs` with explicit expected Commit A/tree
14. run `tests/v0.3.12-generate-build-info.mjs` with explicit expected Commit A/tree
15. verify only the two provenance files changed
16. run construction-mode release-state audit
17. run strict manifest audit
18. stage exactly the two provenance files

## After Commit B

19. verify Commit B parent is exact Commit A
20. verify Commit B changes exactly the two provenance files
21. run final-mode release-state audit
22. run strict manifest audit
23. run v0.3.12 behavioral regression
24. run v0.3.12 residual fixtures
25. verify source/scenario hashes
26. require clean working tree

## Deployment gate

27. push exact Commit B release HEAD
28. verify GitHub `main` equals exact release HEAD
29. wait for GitHub Pages
30. verify deployed Version / Build ID
31. verify deployed Commit A/tree binding
32. verify exact provenance-file hashes
33. verify all deployed tracked files against release HEAD
34. run all six deployed scenarios:
    - Run PASS
    - Replay CONSISTENT
    - Export PASS
    - integrity PASS

## Independent closure gate

Independent testing must specifically attempt to reproduce:

- v0.3.11 F11-01 duplicate-key / non-canonical provenance bypass;
- v0.3.11 F11-02 ignored/excluded untracked workspace gap;
- v0.3.11 F11-03 inaccurate manifest/provenance documentation;
- v0.3.11 GEN-04 stale visible version label.

It must also probe for new structural bypasses.

V035-F05 may be called CLOSED only with zero open Critical, High, Medium or Low findings and zero actionable Observations related to the targeted mechanism.

Even after targeted closure, Version 1.0 remains blocked until a separate full independent zero-open-finding adversarial regression passes against the exact same deployed v0.3.12 artifact.
