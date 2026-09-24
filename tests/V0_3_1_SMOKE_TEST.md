# JANUS Harness v0.3.1 — Pre-review smoke test

Do not create `v0.3.1-reviewed` until the deployed GitHub Pages site passes this smoke test.

For each of the six scenarios, choose one valid reviewer prediction and verify:

1. Run succeeds without a refusal notice.
2. Source expected SHA-256 equals observed SHA-256.
3. Harness provenance shows a bound code commit and served app.js hash verification.
4. Replay reports `REPLAY CONSISTENT`.
5. Export produces one JSON file.
6. Export contains `integrity_status: PASS`.
7. Export includes `evidence_core_sha256`, `record_snapshot_sha256`, `harness_code_commit`, absolute source URL, source expected/observed hashes, `generated_at`, and `exported_at`.
8. Change either selector after Run and confirm Replay/Export disable and no stale evidence can be exported.

After these six smoke cases pass, run the complete independent 36-permutation regression and adversarial integrity suite.
