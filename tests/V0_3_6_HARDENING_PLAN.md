# JANUS Governance Challenge Harness v0.3.6 — Bounded Hardening Plan

Status: Planned hardening response to the failed v0.3.5 final independent adversarial regression.

## Governing constraints

- Preserve the six authored scenarios unchanged.
- Preserve JANUS source SHA-256: `21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4`.
- Preserve authored scenario-block SHA-256: `948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488`.
- Do not add the Version 1.0 license yet.
- Do not create a reviewed or Version 1.0 tag.
- Preserve the complete v0.3.5 independent regression evidence unchanged under `testing/claude/v0.3.5/`.
- Use inspect-before-mutate, exact baseline checks, dry-run gates, and separate code/evidence vs build-provenance commits.

## Evidence to preserve before hardening

Add unchanged:

- `testing/claude/v0.3.5/V0_3_5_FINAL_INDEPENDENT_ADVERSARIAL_REGRESSION.md`
- `testing/claude/v0.3.5/V0_3_5_FINAL_FINDINGS_LOG.md`

The v0.3.5 final independent regression result is FAIL with 9 actionable findings. v0.3.5 must remain recorded as not eligible for Version 1.0.

## Findings and required corrections

### V035-F01 — blank-rendering fillers used as separators

Problem: U+2800, U+3164, U+FFA0, U+115F, and U+1160 can bypass duplicate detection when used inside text because canonicalization deletes them rather than treating them as spacing. Deletion also creates false duplicate rejection between strings such as `A<blank>B` and `AB`.

Correction:
- map these blank-rendering filler characters to an ordinary space before whitespace collapse;
- retain NFC normalization;
- continue removing true default-ignorable characters as intended;
- add inside-string tests, not suffix-only tests;
- change documentation wording from broad visual-equivalence language to precise canonical-equivalence language.

### V035-F02 — U+007F blank-text / duplicate bypass

Problem: U+007F can be accepted as blank-looking authored text or appended to duplicate text without canonical duplicate detection.

Correction:
- remove/reject U+007F during authored text canonicalization;
- test both blank-only and appended duplicate cases.

### V035-F03 — Export invalidation race after final token check

Problem: scenario change or Reset after the existing Export token check but before blob/download creation can allow an invalidated PASS export and can clear the invalidation notice.

Correction:
- re-check `token`, `stateGeneration`, `lastRun`, and snapshot identity immediately before blob/download creation;
- do not clear stale/invalidation UI unless the export is still current;
- add race tests covering scenario change and Reset during the final hashing/build phase.

### V035-F04 — material regression/mutation gaps

Problem: important regressions survive the current suites, including authored disposition changes, expected-contract-hash changes, source mismatch acceptance, bound-commit mismatch downgrade, forced integrity checks, invalidation removal, Replay token-check removal, Export event-log bypass, and whitespace-collapse removal.

Correction:
- assert exact authored scenario-block SHA;
- assert exact JANUS source SHA;
- assert each canonical scenario's exact disposition;
- assert contract hashes equal `EXPECTED_CONTRACT_HASHES.json`;
- add behavioral cases for source mismatch, bound-commit mismatch, snapshot edits, invalidation, Replay post-derive invalidation, Export event-log validation, and canonical whitespace collapse;
- add meaningful mutation operators for each control;
- require mutation-target preflight before mutation execution.

### V035-F05 — weak integrity-disclosure mutation/doc audit

Problem: the current disclosure mutant is killed by a mutant-specific negative string assertion rather than robust positive requirements. Other overclaims/removals survive.

Correction:
- positively require all integrity-limit concepts in README and live About/UI;
- require that PASS is not a digital signature;
- require unsigned-client-side-artifact wording;
- require DevTools/page-control limitation wording;
- prohibit premature independent-closure and Version 1.0 claims while candidate is unreviewed;
- mutation-test each independent disclosure requirement.

### V035-F06 — stale superseded-gate pointer

Problem: `tests/V0_3_3_RELEASE_GATE.md` points to superseded `V0_3_4_RELEASE_GATE.md`.

Correction:
- point it to current `V0_3_6_RELEASE_GATE.md` when v0.3.6 is created;
- positively audit the pointer.

### V035-F07 — historical CHANGELOG/status inconsistencies

Problem:
- v0.3.2 says it closes V031-NEW-07 even though the v0.3.2 report found it only partly closed;
- v0.3.4 README/CHANGELOG sections retain pending-closure language rather than recording that v0.3.4 was superseded after smoke residuals.

Correction:
- correct v0.3.2 history;
- mark v0.3.4 superseded/not promoted;
- preserve historical facts without rewriting prior independent evidence.

### V035-F08 — manifest scope ambiguity / omissions

Problem: served assets/evidence files are not all in `build-info.json`, while README wording can be read as covering all served files.

Correction preference:
- define a deterministic manifest inclusion rule and include all release-controlled served files intended to be provenance-bound, including `assets/images/stratosengine_cover.jpg`, current test/release evidence, and preserved independent evidence; or
- if intentionally excluding classes, document the exact manifest scope unambiguously.

For final assurance, prefer comprehensive deterministic inclusion of repository-served release artifacts except explicitly excluded metadata such as `.git` internals.

### V035-F09 — incomplete automated regression evidence record

Problem: `V0_3_5_AUTOMATED_REGRESSION_RESULT.txt` omitted the source SHA and scenario-block SHA, and the scenario-block hash method was undocumented.

Correction:
- v0.3.6 automated regression result must record source SHA and scenario-block SHA;
- document exact block hashing method: bytes from `const scenarios = [` through the closing `];` plus one trailing LF;
- add a reproducible helper/check for the method.

## v0.3.6 test strategy

### Local gates before publication

1. Exact baseline/clean-tree/remote checks.
2. Preserve v0.3.5 Claude evidence unchanged.
3. Apply fixes in disposable dry-run tree first.
4. Behavioral regression including all new F01-F04 cases.
5. Documentation/release audit including F05-F09 positive requirements.
6. Mutation-target preflight: every operator must change its intended target.
7. Mutation regression: every operator must be killed for the intended reason.
8. Verify JANUS source SHA unchanged.
9. Verify six authored scenario block SHA unchanged.
10. Record actual gate output.
11. Commit code + tests + preserved independent evidence.
12. Generate build provenance bound to that code commit.
13. Commit only build provenance separately.
14. Push; do not tag.

## Independent-test economy

The next independent Claude run SHOULD be a bounded targeted closure regression covering V035-F01 through V035-F09 plus release identity and a minimal six-scenario sanity check. A full adversarial matrix is not necessary immediately after the hardening change.

However, a final full independent adversarial regression is still required before Version 1.0 promotion. The recommended sequence is:

1. v0.3.6 local full gates;
2. deployed identity/smoke verification;
3. targeted independent closure test of exactly V035-F01–F09;
4. if any targeted finding remains, fix and repeat targeted closure only;
5. once targeted closure reaches zero actionable findings, run ONE final full independent adversarial regression of the exact deployed candidate;
6. only after that final full regression returns zero actionable findings, begin Version 1.0 promotion.

This sequence conserves independent-agent usage while retaining a defensible final assurance gate.