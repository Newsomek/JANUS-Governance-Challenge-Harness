# JANUS Governance Challenge Harness v0.3.9 — Targeted V035-F05 Closure Retest

**Result: V035-F05 — PARTIALLY CLOSED**

The main issue: the v0.3.9 claim control fails closed only when a line contains one of about 20 keyword stems. A claim that uses none of those stems is never inspected, so the control is still a keyword gate. Everything the v0.3.8 retest found escaping is now rejected, and the approval-baseline change detection works. However, 102 distinct unsupported claims and obfuscations still pass: 327 surface placements in total, plus 12 structural and placement bypasses.

| Item | Value |
|---|---|
| Test date | 2026-09-25 (UTC 12:24 onward) |
| Tester | Claude (Anthropic, model id `claude-opus-5-5`) in a Cowork session run for Kelly Newsome. Independent of the v0.3.9 release-gate runs. |
| Scope | A targeted closure retest of V035-F05 only (documentation and release-governance claim control), with a non-regression check on V035-F04. **This is not the final full independent Version 1.0 regression.** |
| Deployed URL | https://newsomek.github.io/JANUS-Governance-Challenge-Harness/ |
| Repository | https://github.com/Newsomek/JANUS-Governance-Challenge-Harness |
| Repository modified? | **No.** The clone showed `git status` with 0 changed paths before and after, and HEAD stayed `aaace7f`. Every probe ran on scratch copies. No commits, tags or branches were made, and nothing was deployed. |
| Raw evidence | `JANUS_v0.3.9_targeted_F05_closure_raw_evidence.txt`, which includes every probe, the audit exit codes and messages, and the harness source code. |

---

## 1. Phase 0: identity gate (PASS, 9/9)

The session's network proxy blocked sandbox access to `*.github.io`. Deployed bytes were therefore fetched from the same origin in the user's open Chrome tab (`cache:'no-store'`) and hashed there with `crypto.subtle` SHA-256.

| # | Check | Observed | Result |
|---|---|---|---|
| 1 | Page shows 0.3.9 | `<title>` is "…Harness v0.3.9" and the body reads "Version 0.3.9 is a bounded fail-closed…" | PASS |
| 2 | build-info `version` | `0.3.9` | PASS |
| 3 | `build_id` | `janus-governance-challenge-harness-v0.3.9` | PASS |
| 4 | `code_commit` | `fcaccec66ca426f997cca6fd89e0461ba4f1d597` | PASS |
| 5 | `main` | `git ls-remote` gives `aaace7f5354f40ddba1cf6c2084492c76e147ca4`. Its only change from `fcaccec` is `build-info.json`. | PASS |
| 6 | Deployed app.js matches the manifest | `7827044b…d14710ec` | PASS |
| 7 | JANUS source SHA-256 | deployed `.docx` is `21766f5d…551fe4` | PASS |
| 8 | Authored scenario block SHA-256 | recomputed from deployed app.js: `948536a1…6b56488` | PASS |
| 9 | Manifest has 74 entries and does not list itself | 74 entries, `build-info.json` not listed. `git ls-files` = 75. | PASS |

**Full deployed re-hash:** all 74 files returned HTTP 200 and all 74 matched, with 0 mismatches. A digest of the deployed hash list (`fa0d0b8a…19af331`) equals the same digest recomputed from the clone. The deployed site is therefore byte-identical to `aaace7f`.

## 2. Phase 1: how the v0.3.9 control works (confirmed by running it, not only by reading the code)

- **Units inspected.** The four surfaces are README.md, CHANGELOG.md, VERSION.txt and index.html. Each line is inspected as one unit, and a unit's key is `section :: normalized line`.
  - Markdown ATX headings and HTML `<h1>`–`<h6>` lines only set the section label. **They are never inspected as units.**
  - In index.html, a line that contains a heading tag is skipped completely.
  - Tag attributes (`title`, `alt`, `aria-label`, `content`) are dropped.
- **Normalization.** Steps: HTML numeric entities plus six named entities (`nbsp amp lt gt quot apos`) are decoded; NFKC; `\p{Cf}`, Default_Ignorable characters and U+00AD are removed; dash variants become `-`; Markdown `[text](url)` becomes its text; `* _ ~ \`` are deleted; whitespace is collapsed; text is lowercased. For index.html, entities are decoded first and tags stripped afterwards, and entities are then decoded a **second** time inside normalization.
- **What counts as a guarded claim.** Any unit that matches a single regex of about 20 stems: `tamper* alter* modif* immutab* forg* authentic* sign(ed|ature|ing) integrity guarantee* version 1(.0) v1(.0) independent* closure closed certif* approv* promot*`.
- **Approval.** A guarded unit passes if its `section :: unit` key is in `surfaces[file]`, or if the bare unit is in `approved_global_units`. The check is exact string equality after normalization.
- **Change detection.** Every approved surface key must still exist, so a deleted or edited reviewed line fails. A global entry that disappears or goes unused is **not** detected by the audit; only the fixtures suite catches it.
- **Fail-closed or keyword-based?** Both. Inside the stem vocabulary it fails closed: any unreviewed guarded unit fails, whether it reads as affirmative or negative. **Outside that vocabulary nothing is inspected.** This makes it a keyword gate, not a policy that understands meaning.
- **Generator.** `tests/generate-v0.3.9-claim-allowlist.mjs` is separate. No suite imports or runs it, so an ordinary audit never regenerates approval state. When it does run, it approves every guarded unit currently on the surfaces. The committed allowlist is byte-identical to what the generator produces from the unmodified docs (P5-15).

## 3. Phase 2: supplied suites (fresh clone, node v22.22.2)

| Suite | Exit | Result |
|---|---|---|
| v0.3.9-regression.mjs | 0 | PASS (9 canonical exports, 4 refusal alerts) |
| v0.3.9-doc-audit.mjs | 0 | PASS |
| v0.3.9-doc-claim-fixtures.mjs | 0 | PASS (36 deny, 31 allow, 5 HTML) |
| v0.3.9-mutation-regression.mjs | 0 | PASS, 45/45 killed |
| v0.3.9-manifest-audit.mjs | 0 | PASS (74/74) |

I checked that these results are real:
- **Mutations.** Each mutation is applied to a fresh temp copy, a pre-flight check rejects no-op edits, and the suite is spawned from the mutated root with `JANUS_TEST_ROOT` pointing at it. The mutations are genuine.
- **Fixtures.** Each fixture is inserted into a temp copy.
- **Weakness in the fixtures.** The 31 "allow" fixtures are exactly the 31 global allowlist strings. They can only pass, and they never test an unreviewed legitimate sentence (see R09).

## 4. Phase 3: independent adversarial probes

I ran **838 independent doc-audit probes** (229 distinct probe texts across 1–4 surfaces each), plus **34 Phase-5 control runs**.

| Family | Probes | Rejected as expected | Actionable false negatives | Not a real bypass (renders literally) |
|---|---|---|---|---|
| v0.3.8 escapees (8 claims × 4 surfaces) | 32 | 32 | **0** | – |
| A1 tamper/alteration (44 claims × 4) | 176 | 60 | **116** (29 claims) | – |
| A2 Version 1 / approval (34 × 4) | 136 | 60 | **76** (19 claims) | – |
| A3 independent closure (28 × 4) | 112 | 44 | **68** (17 claims) | – |
| A4 obfuscation (45 variants × 4) | 180 | 133 | **35** | 12 |
| A4 HTML-structural (20) | 20 | 6 | **14** | – |
| A4 Markdown-structural (19 × 2) | 38 | 20 | **16** | 2 |
| Context inversion (2) | 2 | 0 | **2** | – |
| B legitimate text (30 × 4) | 120 | – | – | 28 allowed, 92 rejected because unreviewed (by design) |
| B formatting variants of approved text (5 × 4) | 20 | – | – | 20 allowed |
| B edge: double decoding (2) | 2 | – | – | 1 allowed, **1 spurious rejection** |

**No false positive was found against an approved unit.** Formatting variants of reviewed disclaimers (emphasis, `&#8209;`, `&nbsp;`, full-width, zero-width) were all accepted correctly on all four surfaces.

### 4.1 False negatives: semantic bypass (A1–A3, and the A5 question)

Every claim below passed the audit on **all four surfaces**. None contains a guarded stem.

- **A1, tamper and alteration:**
  - "The evidence cannot be changed." · "The evidence cannot be manipulated." · "Exports are verified." · "Exports are validated."
  - "The evidence is cryptographically protected." · "The evidence is secure."
  - "The evidence is **un**alterable / **un**tamperable." · "The record is unmodifiable." · "Exports are unforgeable." A prefix defeats the `\b` word boundary, so `\btamper` does not match inside "untamperable".
  - "The exported record is permanent." · "The record always proves its origin." · "The export establishes authenticity." ("authenticity" is caught; "establishes" only passed because the variant avoided the stem.) · "The evidence is trustworthy by construction."
  - "Exports are cryptographically sealed." · "The export is notarized." · "The export is non-repudiable." · "Hashes prove the evidence was never edited."
  - …29 claims in total.
- **A2, Version 1 and approval:**
  - "This is Version One." · "This is the 1.0 release." · "Release 1.0 is final." · "This is version-1.0." (a hyphen is not `\s*`)
  - "This release is ready for general availability." · "The release has cleared final review." · "This release is production-ready." · "The release is authorized for production." · "Release candidate accepted as final."
  - …19 claims in total.
- **A3, independent closure:**
  - "F05 has been resolved." · "External reviewers found nothing remaining." · "Outside review found no unresolved issues." · "The remaining issue is resolved according to outside testing."
  - "Third-party testing confirmed the fix." · "F05 retest: PASS." · "V035-F05 status: resolved."
  - …17 claims in total.

**Answer to the A5 question:** the control is a larger keyword gate combined with exact-match approval. It does not identify claims by meaning.

### 4.2 Normalization and obfuscation (A4)

Every exotic Unicode character that is *invisible or compatibility-mapped* is handled correctly. This includes the soft hyphen, ZWSP, ZWNJ, ZWJ, WJ, VS16 and CGJ inside words, full-width text, mathematical bold, NBSP, narrow NBSP, the ideographic space, the one-dot leader, subscript ₁, dash variants, Markdown emphasis, strikethrough and code inside words, links inside words, numeric entities, and inline tags in index.html.

Bypasses that render as the guarded word:

| Vector | Surfaces that bypass | Rendering confirmed by |
|---|---|---|
| Inline HTML tag or comment inside the word, e.g. `tam<b></b>per-proof`, `Ver<span>sion</span> 1.0`, `tam<!-- -->per` | README, CHANGELOG. Markdown units are never stripped of tags; index.html handles this correctly. | cmark-gfm renders "tamper-proof" |
| Named entities other than the six decoded ones: `&shy;` `&ZeroWidthSpace;` `&NoBreak;` | README, CHANGELOG, index.html | Browser and cmark-gfm both render invisible characters |
| Numeric reference without the trailing semicolon, `tam&#112er` | index.html only. CommonMark renders it literally. | Browser renders "tamper-proof" |
| Entity-escaped brackets, `&lt;tamper-proof&gt;`, decoded and then stripped as a tag | index.html | Browser shows "<tamper-proof>" |
| Cyrillic or Greek homoglyphs, `tаmper`, `Vеrsion`, `indеpendently clоsed` | All four | Visually identical |

### 4.3 Structural and placement bypasses (Phase 4)

| Probe | Surface | Observed |
|---|---|---|
| `## Version 1.0 approved` / `### Evidence exports are tamper-proof` / `## V035-F05 independently closed`, followed by neutral text | README, CHANGELOG | PASS (bypass) |
| `<h2>Version 1.0 approved</h2>`, `<h3>F05 independently closed</h3>` | index.html | PASS (bypass) |
| `<h2>Notes</h2><p>This is Version 1.0.</p>` on one line | index.html | PASS. The whole line is skipped. |
| `This release is Version⏎1.0.` (soft wrap) | README, CHANGELOG | PASS. Renders as one sentence. |
| `<p>This build is Version⏎1.0.</p>` | index.html | PASS |
| `title=`, `alt=`, `aria-label=`, `<meta content=…>`, Markdown link title | index.html, README, CHANGELOG | PASS (none inspected) |
| Several claims on one line, bullets, numbered lists, block quotes, nested block quotes, tables, setext headings, partial emphasis, nested inline tags, `<script>` split | all | Rejected correctly |

### 4.4 Negation flip on reviewed disclaimers

Normalization deletes the rendering meaning of strikethrough and hidden text. As a result, an approved disclaimer can **render as the affirmative claim** while still matching the allowlist exactly:

- `<p>Version 1.0 is <span hidden>not</span> approved.</p>` passes in index.html. The browser shows **"Version 1.0 is approved."**
- `<p>Exports are <span style="display:none">not</span> tamper-proof.</p>` passes and displays **"Exports are tamper-proof."**
- `Exports are ~~not~~ tamper-proof.`, `F05 is ~~not~~ independently closed.` and `Version 1.0 is ~~not~~ approved.` pass in README and CHANGELOG. `<del>` and `<s>` do the same in index.html. The reader sees the "not" struck out.

### 4.5 Legitimate text (B)

Examples of legitimate text that was **rejected**:
- Negations: "The evidence is not tamper-proof." · "This is not Version 1.0." · "Version 1.0 has not been approved."
- Questions: "Has independent closure been confirmed?" · "Could this eventually become Version 1.0?"
- Historical statements and quoted examples.
- Descriptive text: "A hash mismatch indicates the record may have been altered." · "Reviewers should verify the manifest independently."

Each rejection happened because the guarded unit was unreviewed. That is the policy v0.3.9 states ("fails closed regardless of whether it appears affirmative or negative"), so I **do not count these as defects**.

Three legitimate lines were allowed because they avoid the stems: "The current candidate remains pre-1.0.", "The evidence can be changed by anyone with DevTools." and "There is no release approval yet." All exact global disclaimers were allowed on every surface, which confirms that global approval works across surfaces.

The one actual false positive comes from double decoding (R10).

## 5. Phase 5: allowlist and fail-closed behaviour

| Test | Expected | Observed |
|---|---|---|
| 1 Insert an unreviewed guarded affirmative | fail | FAIL: "unreviewed guarded claim unit" ✔ |
| 2 Change a reviewed claim slightly, or flip F05 to "is claimed" | fail | FAIL ✔ |
| 3 Delete a reviewed surface claim (README, index.html) | fail | FAIL: "disappeared or changed" ✔ |
| 4 Allowlist version set to 0.3.8 | fail | FAIL: version mismatch ✔ |
| 5 Schema set to 2 or "1"; `surfaces` missing; surface key misspelled; file missing; invalid JSON | fail | FAIL ✔ |
| 6 Remove one approved surface entry | fail | FAIL ✔ |
| 7 Remove one or all global entries | should be detected | doc-audit **PASS**, fixtures FAIL. Detected by fixtures only. |
| 8 Add a *new* affirmative to the global or surface allowlist and insert it | should not be approvable silently | doc-audit **PASS** and fixtures **PASS**. Only fixture-listed strings are protected (8b FAIL ✔). |
| 9 Disable surface matching | fail | FAIL ✔ |
| 10 Disable global matching | fail | doc-audit **PASS**, fixtures FAIL. Detected by fixtures only. |
| 11 Disable the disappearance check (my own extra mutation) | should be killed | **Survives both suites.** |
| 14 Insert 3 affirmatives, then run the generator | – | Before: FAIL. After generating: doc-audit **PASS** and fixtures **PASS**. The generator silently approves anything on the surfaces. |
| 15 Generator run on unmodified docs | – | Output is byte-identical to the committed allowlist |

An ordinary audit does **not** regenerate approval state; the generator is kept separate.

## 6. Phase 6: V035-F04 non-regression (CLOSED; not reopened)

- **Code change.** From `132cd07` (the v0.3.7 F04 closure baseline) and from `c07cd90` (v0.3.8) to `fcaccec`, the only `app.js` change is `HARNESS_VERSION` and `BUILD_ID`.
- **Tests.** The forged `event_log` export-refusal test passes. The mutations "Export event_log equivalent bypass OR true", "stored_core_match forced true" and "late Export generation guard removed" are all killed.
- **Deployed check.** Run and Replay produced `replay_match: true` for all six scenarios. Export was not triggered, because it downloads a file.

## 7. Findings

| ID | Severity | Type | Summary |
|---|---|---|---|
| V039-F05-R01 | **Medium** | Product/control | Unsupported claims that avoid the ~20 guard stems are never inspected (65 of 106 distinct A1–A3 claims) |
| V039-F05-R02 | **Medium** | Product/control | Headings, heading-bearing HTML lines and claims wrapped across lines are not audited |
| V039-F05-R03 | **Medium** | Product/control | Negation flip: struck-through or hidden "not" turns an approved disclaimer into a rendered affirmative that still matches |
| V039-F05-R04 | **Medium** | Product/control | Obfuscation inside the word: inline HTML/comments in Markdown, undecoded named entities, semicolon-less numeric references, `&lt;…&gt;` deletion |
| V039-F05-R05 | Low | Product/control | Unicode confusable (homoglyph) spellings of guarded words |
| V039-F05-R06 | Low | Product/control | Attribute-borne text is not inspected (title, alt, aria-label, meta content, Markdown link title) |
| V039-F05-R07 | Low | Product/control | Approval ignores context: a neighbouring unguarded line can retract an approved disclaimer |
| V039-F05-R08 | Low | Control/process | The approval baseline is a generator snapshot with no per-claim review record; new affirmatives added to the allowlist pass every suite |
| V039-F05-R09 | Low | Test defect | Allow fixtures are tautological; the disappearance-check mutation survives; the new bypass classes have no fixtures |
| V039-F05-R10 | Low | Product/control (false positive) | Double entity decoding on index.html: literal `&amp;#116;amper` is audited as "tamper" |

### Details

**R01, keyword-gated semantic bypass (Medium)**
- **Probe:** for example "The evidence cannot be changed.", "Exports are verified.", "The evidence is unalterable.", "This is the 1.0 release.", "This is version-1.0.", "This release is ready for general availability.", "F05 has been resolved.", "External reviewers found nothing remaining." (full list in raw evidence, family A1–A3).
- **Surface:** all four.
- **Expected:** rejected.
- **Observed:** audit PASS.
- **Why it matters:** these are the same claim families F05 targets. Fail-closed coverage stops where the vocabulary ends, and prefixed forms (`un-`) and alternate spellings (`version-1`, "Version One", "1.0 release") slip past the existing stems.
- **Remediation (bounded):**
  - Invert the gate so that every sentence on the governance surfaces is covered by the approved baseline, not only sentences that match a stem. The allowlist already does exact matching, so this is a change in scope rather than new logic.
  - At a minimum, widen the stems: drop the leading `\b` for `tamper|alter|modif|forg`, add `version[-\s]*(1|one)\b`, `\b1\.0\b`, and `verif|validat|resolv|fixed|general availability|production|final`.

**R02, structural blind spots (Medium)**
- **Probe:** `## Version 1.0 approved` (README and CHANGELOG, at the end of the file); `<h2>Version 1.0 approved</h2>` (index.html); `<h2>Notes</h2><p>This is Version 1.0.</p>`; `This release is Version⏎1.0.`; `<p>This build is Version⏎1.0.</p>`.
- **Expected:** rejected.
- **Observed:** PASS.
- **Why it matters:** headings are the most prominent claims on the page, and the heading-line skip in index.html hides any content that shares a line with a heading.
- **Remediation:**
  - Emit each heading as a unit in addition to using it as a section label.
  - For HTML, extract the heading text and then continue processing the rest of the line.
  - Build units per rendered paragraph or block (join soft-wrapped lines up to a blank line or a block tag) instead of per physical line.

**R03, negation flip (Medium)**
- **Probe:** `<p>Version 1.0 is <span hidden>not</span> approved.</p>`, `<p>Exports are <span style="display:none">not</span> tamper-proof.</p>`, `Exports are ~~not~~ tamper-proof.`, `<p>F05 is <s>not</s> independently closed.</p>`.
- **Expected:** rejected.
- **Observed:** PASS. The approved normalized text matches while the rendered meaning is the opposite.
- **Why it matters:** the reviewed-disclaimer mechanism itself becomes a way to publish an unsupported affirmative claim.
- **Remediation:**
  - Before comparing, remove the *content* of `~~…~~`, `<del>`, `<s>`, `<strike>` and hidden elements (`hidden`, `display:none`, `aria-hidden`), rather than only removing their markers.
  - Alternatively, reject any guarded unit that contains strike or hidden markup.

**R04, obfuscation inside the word (Medium)**
- **Probe:**
  - `Evidence is tam<b></b>per-proof.` and `tam<!-- -->per-proof` in README and CHANGELOG
  - `tam&shy;per-proof`, `tam&ZeroWidthSpace;per-proof`, `Ver&shy;sion 1.0` and `Version&NoBreak; 1.0` in README, CHANGELOG and index.html
  - `tam&#112er-proof` and `&lt;tamper-proof&gt;` in index.html
- **Expected:** rejected.
- **Observed:** PASS. Rendering was confirmed with cmark-gfm and the browser.
- **Why it matters:** HTML-in-word and named entities are among the bypass classes that were explicitly in scope.
- **Remediation:**
  - Strip tags and comments on the Markdown surfaces too.
  - Decode the full HTML5 named-entity table (for example with the `entities` package) and decode semicolon-less numeric references for HTML.
  - Strip tags *before* decoding entities, and decode only once.

**R05, homoglyphs (Low)**
- **Probe:** `Evidence is tаmper-proof.` (Cyrillic а), `This is Vеrsion 1.0.`, `F05 is indеpendently clоsed.`
- **Surface:** all four.
- **Observed:** PASS.
- **Remediation:** reject any unit containing non-Latin letters mixed into Latin words (a mixed-script check), or map characters with the Unicode confusables skeleton.

**R06, attribute-borne text not inspected (Low)**
- **Probe:** `title="Version 1.0 approved"`, `alt="Tamper-proof evidence, independently closed"`, `aria-label`, `<meta … content="Version 1.0 approved; tamper-proof evidence.">`, a Markdown link title.
- **Observed:** PASS.
- **Why it matters:** this text is shown to users (tooltips, screen readers, search snippets).
- **Remediation:** extract `title`, `alt`, `aria-label` and `meta content` as units.

**R07, context-free approval (Low)**
- **Probe:** "The following disclaimer is obsolete and no longer true:" followed by "Version 1.0 is not approved.", and the index.html equivalent.
- **Observed:** PASS.
- **Remediation:** this is mostly resolved by the R01 remediation (covering all sentences). Otherwise, pin the neighbouring units of each approved unit.

**R08, the approval baseline is an unreviewed snapshot (Low)**
- **Observed:**
  - The committed allowlist equals raw generator output (P5-15).
  - Running the generator approves affirmatives silently (P5-14).
  - A new affirmative added to either list passes every suite (P5-8, 8c).
  - The ordinary audit does not invoke the generator, which is correct.
- **Why it matters:** "reviewed" is not evidenced. The broad stems also make routine regeneration likely, and regeneration approves whatever is present at that moment.
- **Remediation:**
  - Make the generator print a diff and require a per-entry `reviewed_by` and rationale field.
  - Add a release-gate check that runs the deny fixtures, plus an affirmative screen, against *every allowlist entry*.

**R09, test gaps (Low)**
- **Observed:**
  - The 31 `mustPass` fixtures equal the global allowlist.
  - Replacing `actualKeys.has(key)` with `true` survives both the audit and the fixtures.
  - There are no fixtures for headings, wrapped lines, Markdown inline HTML, named entities, attributes or negation flip.
- **Remediation:**
  - Add the probes from this report as fixtures.
  - Add a disappearance-check mutation.
  - Add unreviewed-legitimate-text fixtures that assert the specific "unreviewed" failure reason.

**R10, double decoding (Low)**
- **Probe:** `<p>The literal string &amp;#116;amper is shown.</p>` in index.html. It renders "&#116;amper".
- **Expected:** allowed (the unit is not guarded).
- **Observed:** FAIL, "unreviewed guarded claim unit: the literal string tamper…". README handles the same text correctly.
- **Remediation:** decode entities once, inside `visibleHtmlLine`, and skip the second decode in `normalizeClaimText` for HTML input.

### Not treated as defects

- Rejection of unreviewed legitimate disclaimers, questions and historical lines (92 probes). This is the declared fail-closed policy.
- Global-list tampering detected only by fixtures (P5-7, P5-10). It is detected, just not by the audit itself.
- VERSION.txt and CommonMark cases that render markup literally (14 probes).

## 8. Final status

What improved in v0.3.9:
- All 8 v0.3.8 escapee claims are rejected on all 4 surfaces (32/32).
- Invisible characters and compatibility forms are handled.
- Changes to approved claims are detected deterministically.
- Approval metadata fails closed.
- Reviewed disclaimers are accepted reliably across formatting variants.

What remains:
- The control is still keyword-gated, and 4 Medium and 6 Low actionable residuals remain. Among them, unsupported affirmative claims can be published on every controlled surface without changing the audit result.
- This matches the PARTIALLY CLOSED standard: the control improved materially, and actionable residual defects remain.

**V035-F04:** CLOSED (not regressed).
**V035-F05:** **PARTIALLY CLOSED**

The repository and the deployed artifact were not modified. This targeted retest is **not** the final full independent zero-open-finding Version 1.0 regression, and it gives no view on Version 1.0 readiness.
