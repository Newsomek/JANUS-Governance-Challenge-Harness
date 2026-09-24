# SUPERSEDED — historical candidate gate

This historical gate is retained for traceability and must not be used for current releases. See `V0_3_5_RELEASE_GATE.md`.

# JANUS Governance Challenge Harness v0.3.2 — Release Gate

Version 0.3.2 is a zero-known-defect hardening candidate. It must not be promoted to Version 1.0 merely because the code builds.

## Automated local gate

Run:

```powershell
node .\tests\v0.3.2-regression.mjs
```

Expected:

`JANUS v0.3.2 automated regression: PASS`

## Deployed smoke gate

On the public GitHub Pages URL, run each of the six scenarios with the canonical prediction:

1. condition-change — BLOCK + REAUTHORIZE
2. evidence-change — BLOCK
3. authorization-expiry — BLOCK + REAUTHORIZE
4. learning-authority — BLOCK + REAUTHORIZE
5. conflicting-authorities — INSUFFICIENT SPECIFICATION
6. mid-execution-revocation — INSUFFICIENT SPECIFICATION

For every scenario require:

Run → REPLAY CONSISTENT → Export PASS.

## Independent adversarial gate

Claude must then rerun the full 36-permutation matrix and explicitly attempt to find new defects beyond the known v0.3.1 list.

Promotion to Version 1.0 requires:

- 6/6 deployed smoke PASS;
- 36/36 matrix PASS;
- all known defect reproductions PASS;
- no open Critical, High, Medium, Low, or defect-like Observation findings;
- 0 source contradictions and 0 unsupported claims;
- the exact v0.3.2 tested artifact preserved in the repository.

Only after v0.3.2 is clean should the project be promoted to a separate Version 1.0 artifact and tested again before the final Version 1.0 tag is created.
