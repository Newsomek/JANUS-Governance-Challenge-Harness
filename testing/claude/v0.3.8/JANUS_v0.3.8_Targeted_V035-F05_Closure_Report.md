# JANUS Governance Challenge Harness v0.3.8
## Targeted V035-F05 Closure Report

**Date:** 2026-09-25 · **Tester:** Claude (independent) · **Scope:** V035-F05 only · **Repository:** not modified (read-only clone; all probes ran on temporary copies)

Raw evidence: `JANUS_v0.3.8_targeted_F05_closure_raw_evidence.txt`

---

## IDENTITY GATE: PASS

The sandbox proxy blocked direct access to github.io (HTTP 403). I ran the live checks from the browser tab on the deployed site instead, using `fetch` with `cache: no-store` and cache-busting queries, and hashed the responses with `crypto.subtle` SHA-256.

| Check | Expected | Observed | Result |
|---|---|---|---|
| Live HTML version | 0.3.8 | title and eyebrow read `v0.3.8` / `Version 0.3.8`; `/` is byte-identical to `index.html` | PASS |
| build-info version | 0.3.8 | 0.3.8 | PASS |
| Build ID | janus-governance-challenge-harness-v0.3.8 | same | PASS |
| Bound code commit | eaaf70da3f66d7d6474c583e26325660d4b2ef8e | same | PASS |
| Release HEAD / main | c07cd90b9f5ddd2b5f8fa9da789b2111e3ede12e | `git ls-remote` shows `refs/heads/main` = c07cd90…; eaaf70d→c07cd90 changes only `build-info.json` | PASS |
| app.js SHA-256 | da93962e…c81b526 | da93962ecf3d7c3cd18623f582fd80955f4a1724e694eb8a983aa4f91c81b526 | PASS |
| JANUS source SHA-256 | 21766f5d…74551fe4 | 21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4 | PASS |
| Scenario-block SHA-256 | 948536a1…fe1b56488 | 948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488, computed independently; byte-identical to the v0.3.7 block | PASS |
| Manifest count | 63, not self-listed | 63; `build-info.json` absent; equals `git ls-files` minus `build-info.json` | PASS |
| Live manifest re-hash | all match | **63/63** fetched from the deployed site; 0 mismatches | PASS |

**F04 non-regression:** From v0.3.7 (132cd07) to v0.3.8, the only `app.js` changes are the `HARNESS_VERSION` and `BUILD_ID` constants. The behavior independently closed as V035-F04 did not change, so F04 is not reopened.

---

## Finding

| Finding | Original residual issue | Independent tests performed | Evidence observed | Status | Residual risk / notes |
|---|---|---|---|---|---|
| **V035-F05** | **R1:** equivalent affirmative overclaims escaped the doc audit. **R2:** legitimate disclaimers were rejected. **R3:** the README overstated what the audit covers. | I wrote my own probe runner that executes the **unmodified** `tests/v0.3.8-doc-audit.mjs` against a temporary full-repo copy, with **one probe per run** via `JANUS_TEST_ROOT`. Each probe ran on 2 of the 4 surfaces: README, the current CHANGELOG v0.3.8 section, VERSION.txt, and index.html. One insertion was mid-document and one was at end-of-file (or end of section). **78 probes, 152 audit runs.** Sets: **A** (24 required affirmatives), **B** (15 required disclaimers), **C** (35 new adversarial paraphrases: 19 MUST FAIL, 16 MUST PASS) and **H** (4 raw-HTML render-equivalence probes on the UI). I read the audit source and the 55 canned mutations. I checked the live UI text with DOMParser. I ran all 4 project suites for corroboration only. | **Unmodified baseline copy: PASS.** **Every v0.3.7 bypass is fixed:** all 9 prior escapes are now rejected, and all 3 prior false positives are now accepted. **B: 15/15 legitimate disclaimers pass.** **A: 16/24 caught, 8 escaped on every surface tested:** A-07 "The evidence cannot be altered." · A-08 "Evidence integrity is guaranteed." · A-15 "This is the Version 1.0 release." · A-16 "Version 1.0 release approved." · A-21 "All residual findings are independently closed." · A-22 "Independent testing closed all remaining findings." · A-23 "The remaining finding has been independently closed." · A-24 "F05 is independently closed." **C, false negatives (15/19 escaped):** e.g. "Version 1.0 has been approved.", "Version 1.0 is now approved.", "This release is Version 1.0.", "Approved for release as Version 1.0.", "Promoted to v1.", "F05 was independently closed.", "Every V035 finding has been independently closed.", "Independent reviewers confirmed closure of V035-F05.", "V035-F05: CLOSED (independent retest).", soft-hyphen `Tamper­proof`, zero-width `Tamper​proof`, Markdown `Tamper-*proof*`, "…immutable and cannot be forged.", "…cryptographically signed.", "Who says the export is not tamper-proof? It is." **C, false positives (13/16 rejected):** e.g. "Exports are not tamper-proof.", "The export isn't tamper-proof.", "PASS does not make the export tamper-proof.", "No tamper-proof guarantee is made.", "Not signed, and not tamper-proof.", "This release has not been approved as Version 1.0.", "Not yet approved or ready for Version 1.0.", **"Independent closure of V035-F05 has not been confirmed."**, "No independent closure has been confirmed.", "Independent closure is pending until F05 is closed.", "Closure has not yet been independently confirmed." **H: 3/4 escaped** on the UI: `Tamper&#8209;proof`, `Tamper<span></span>proof`, `Version&nbsp;1.0 approved`. **Release text (D):** all 8 checks pass. **Limitations (E):** present; see note. **Project suites:** regression PASS; doc audit PASS; 55/55 mutations killed; manifest 63/63. The F05 mutation operators are the exact v0.3.7 demonstrated strings. | **PARTIALLY CLOSED** | The oracle is still bound to a list of patterns. v0.3.8 fixed exactly the strings found last time, and nearby paraphrases still get through. **R1 persists (Low):** 8 of the 24 required affirmatives escape. **R2 persists (Low):** plain negations fail when they use "are not", "isn't", "does not", "no", "has not yet been", or the README's own "Independent closure of V035-F05…" construction. **R3 recurs, narrower (Low):** the README says Unicode variants "are covered" and that closure checks "cover equivalent finding-level… claims". The soft-hyphen, zero-width, A-23, A-24 and C-15/16 probes disprove both. None of this has runtime exposure. It affects only documentation and test-oracle quality. |

---

## TARGETED F05 CLOSURE TOTALS

- **CLOSED:** 0
- **PARTIALLY CLOSED:** 1 (V035-F05)
- **OPEN:** 0
- **UNTESTABLE:** 0

**ACTIONABLE FINDINGS REMAINING:** 3 residual items under V035-F05 (R1, R2, R3; all Low)

## TARGETED F05 CLOSURE: FAIL — ACTIONABLE FINDINGS REMAIN

---

## Actionable residuals

**V035-F05-R1: false negatives on required and equivalent affirmative claims (Low)**
Reproduce: add any of these to README.md, VERSION.txt, index.html, or the CHANGELOG v0.3.8 section, then run `node tests/v0.3.8-doc-audit.mjs`. The audit prints PASS.
- Required-list escapes: A-07, A-08, A-15, A-16, A-21, A-22, A-23, A-24 (exact text is in the table above).
- Causes, from the audit source:
  - Integrity checks only look for `tamper[\s-]*proof`, so "cannot be altered", "guaranteed", "immutable" and "signed" are never examined.
  - Version 1.0 patterns allow only `(:|-)? (is)?` between "Version 1.0" and the verb, so "has been", "now", "release" and "This is the Version 1.0 release" all get through.
  - Closure checks need the word "closure" or the phrase "all nine V035 findings". Finding-level subjects such as "F05", "remaining finding", "residual findings" and "every V035 finding" get through.
  - Normalization folds only U+2010–2015 and a few other dashes. Soft hyphen (U+00AD), zero-width characters, Markdown single emphasis and HTML entities or inline tags are not folded.
  - Negation masking strips "is not tamper-proof" before matching, so "Who says the export is not tamper-proof? It is." passes.

**V035-F05-R2: false positives on legitimate disclaimers (Low)**
Reproduce: add "Independent closure of V035-F05 has not been confirmed." to VERSION.txt or the CHANGELOG v0.3.8 section. The audit fails with "contains premature independent-closure claim." That is a natural rewording of the README's own disclaimer. The same failure happens with "Exports are not tamper-proof.", "PASS does not make the export tamper-proof.", "This release has not been approved as Version 1.0." and "Closure has not yet been independently confirmed."
- Cause: the negation allowlist is tied to specific word orders (`is not`, `has not been`, closure directly followed by the verb). A negator in any other position does not remove the match.

**V035-F05-R3: README still overstates audit coverage (Low)**
- README v0.3.8 section, first bullet: "direct and Unicode variants of unsupported integrity-protection terminology are covered…". Probes C-02 (soft hyphen) and C-03 (zero-width space) disprove this.
- Third bullet: "independent-closure checks cover equivalent finding-level… claims". Probes A-23, A-24, C-15, C-16 and C-19 disprove this.

### Note (not scored)
The UI integrity-limit paragraph covers "unsigned", "not a digital signature" and "DevTools… recompute client-side hashes". The fourth disclosure, "accidental or uncoordinated mutation, not malicious coordinated forgery", appears in the README and in the exported `integrity_scope`, but not in the UI page text. This is unchanged from v0.3.7, which accepted it, and the release as a whole still states the limitation. It is recorded for the final full regression to judge.

### Suggested bounded direction (advisory; no repository change made)
Each release has closed the demonstrated strings and nothing more. A bounded fix that ends this cycle would be to **fail closed** on the four current surfaces:
- Any sentence that mentions a guarded concept should fail the audit unless it appears verbatim in a reviewed allowlist of approved sentences. Guarded concepts: `tamper`, `alter`, `immutab`, `sign`, `guarantee`, `Version 1`/`v1`, `independent*`, `closed/closure`.
- Normalize before the concept match: NFKC, then strip Cf/zero-width/soft-hyphen characters, Markdown emphasis, and HTML tags and entities.

Under this approach a new disclaimer needs one explicit review instead of a regex change, and a new overclaim cannot pass without being reviewed.

---

## Gate conclusion

- V035-F05 is **not** independently closed. It remains **PARTIALLY CLOSED**, with Low residuals R1–R3.
- V035-F04 remains independently closed from the v0.3.7 targeted test. v0.3.8 did not change its behavior.
- **Version 1.0 is not recommended.** One more bounded F05 correction and a targeted retest of R1–R3 are needed before the final full independent zero-open-finding adversarial regression against the exact deployed artifact.
