# JANUS Governance Challenge Harness v0.3.5 — Final Findings Log

Date: 24 September 2026
Gate: Final independent adversarial regression
Tester: Claude
Release under test: v0.3.5
Code commit: `e0e6790e27e1a37858646f2f56411bd435bd5a63`
Release HEAD: `e38b2f00baa549d18fea4751f92b67b64f69e392`
Source SHA-256: `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`
Scenario-block SHA-256: `948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488`

## Gate result

**FAIL — ACTIONABLE FINDINGS REMAIN**

**TOTAL ACTIONABLE FINDINGS: 9**

Version 1.0 promotion remains blocked.

## Findings

| ID | Severity | Actionable | Area | Short description |
|---|---|---:|---|---|
| V035-F01 | Low | YES | F/K | Blank-rendering filler characters used as internal separators can bypass or falsely trigger canonical duplicate detection; CHANGELOG wording overclaims equivalence handling. |
| V035-F02 | Low | YES | F | U+007F can be accepted as blank-looking text and can bypass duplicate detection. |
| V035-F03 | Low | YES | D | Export can still complete and clear the invalidation notice if scenario/reset invalidation occurs during the final hashing window. |
| V035-F04 | Medium | YES | L/M | Important regressions survive the current automated/mutation suites, including authored disposition changes, expected contract hash changes, source/bound mismatch downgrades, snapshot-integrity bypasses, invalidation removal, replay token-check removal, export event-log bypass, and whitespace-collapse removal. |
| V035-F05 | Low | YES | M | Integrity-disclosure mutation is killed by mutant-specific wording rather than robust positive disclosure assertions; several misleading disclosure/closure mutations survive. |
| V035-F06 | Low | YES | K | `V0_3_3_RELEASE_GATE.md` points to superseded `V0_3_4_RELEASE_GATE.md` instead of the current v0.3.5 gate. |
| V035-F07 | Low | YES | K | Historical CHANGELOG/README release-status language remains contradictory or stale for v0.3.2/v0.3.4. |
| V035-F08 | Observation | YES | A/K | Build manifest omits served/tracked files while README wording implies it records served-file hashes. |
| V035-F09 | Observation | YES | K/L | v0.3.5 automated regression result omits source/scenario hashes and does not document exact scenario-block hashing method. |

## Regression strengths retained

- Exact release identity verified.
- Six authored scenarios: 6/6 PASS.
- Prediction permutations: 36/36 PASS.
- Replay: 42/42 CONSISTENT; 336/336 checks passed.
- Export: 42/42 PASS; 630/630 checks passed.
- Structural validation: PASS.
- Stored-run integrity: PASS.
- Corroboration behavior: PASS.
- Output handling: PASS.
- Export artifact consistency: PASS.
- Local behavioral regression: PASS.
- Documentation audit: PASS.
- Mutation target preflight: 18/18 active.
- Existing mutation regression: 18/18 killed.
- Source conformance: 42 SUPPORTED, 0 CONTRADICTED, 0 INSUFFICIENTLY SUPPORTED.

## Required release disposition

- Do not tag v0.3.5 as reviewed.
- Do not promote to Version 1.0.
- Address V035-F01 through V035-F09 in a new bounded hardening candidate.
- Preserve the full independent report as evidence; do not overwrite it when the next candidate is built.
