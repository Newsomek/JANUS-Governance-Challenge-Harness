import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.JANUS_TEST_ROOT ? path.resolve(process.env.JANUS_TEST_ROOT) : path.resolve(here, '..');
const read = (p) => fs.readFileSync(path.join(root,p),'utf8');
const assert = (ok,msg) => { if(!ok) throw new Error(msg); };

const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const version = read('VERSION.txt');
const html = read('index.html');

const gate = read('tests/V0_3_8_RELEASE_GATE.md');
const gate7 = read('tests/V0_3_7_RELEASE_GATE.md');
const gate6 = read('tests/V0_3_6_RELEASE_GATE.md');
const gate5 = read('tests/V0_3_5_RELEASE_GATE.md');
const gate4 = read('tests/V0_3_4_RELEASE_GATE.md');
const gate3 = read('tests/V0_3_3_RELEASE_GATE.md');
const gate2 = read('tests/V0_3_2_RELEASE_GATE.md');

const hashes = JSON.parse(read('docs/EXPECTED_CONTRACT_HASHES.json'));

const v035Report = read('testing/claude/v0.3.5/V0_3_5_FINAL_INDEPENDENT_ADVERSARIAL_REGRESSION.md');
const v035Findings = read('testing/claude/v0.3.5/V0_3_5_FINAL_FINDINGS_LOG.md');
const v035Result = read('tests/V0_3_5_AUTOMATED_REGRESSION_RESULT.txt');

const v037Report = read('testing/claude/v0.3.7/JANUS_v0.3.7_Targeted_Residual_F04-F05_Closure_Report.md');
const v037Raw = read('testing/claude/v0.3.7/JANUS_v0.3.7_targeted_residual_closure_raw_evidence.txt');

assert(readme.includes('# JANUS Governance Challenge Harness v0.3.8'), 'README current version missing.');
assert(version.includes('Version 0.3.8'), 'VERSION current version missing.');
assert(html.includes('JANUS Governance Challenge Harness v0.3.8'), 'UI version not v0.3.8.');
assert(hashes.version === '0.3.8', 'Expected contract hash file version mismatch.');
assert(Array.isArray(hashes.scenarios) && hashes.scenarios.length === 6, 'Expected contract hash file must contain six scenarios.');

const readmeIntegrity = [
  'unsigned client-side artifact',
  'PASS is not a digital signature or proof of authenticity',
  'controls the page/DevTools and coordinates edits with recomputed client-side hashes',
  'accidental or uncoordinated later mutation'
];

for (const phrase of readmeIntegrity) {
  assert(readme.includes(phrase), `README integrity disclosure missing: ${phrase}`);
}

assert(html.includes('Evidence exports are unsigned client-side artifacts.'), 'UI unsigned-client disclosure missing.');
assert(html.includes('it is not a digital signature'), 'UI digital-signature limitation missing.');
assert(html.includes('controls DevTools/console state and can recompute client-side hashes'), 'UI DevTools limitation missing.');

function normalizeClaimText(text) {
  return text
    .normalize('NFKC')
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/gu, '-')
    .replace(/\*\*/g, '');
}

const tamperTerm = /tamper[\s-]*proof/i;

function withoutAllowedTamperNegations(text) {
  return normalizeClaimText(text)
    .replace(/\bnot\s+claimed\s+to\s+be\s+tamper[\s-]*proof\b/gi, '')
    .replace(/\bnot\s+a\s+tamper[\s-]*proof\b/gi, '')
    .replace(/\bnever\s+tamper[\s-]*proof\b/gi, '')
    .replace(/\bcannot\s+be\s+(?:considered\s+)?tamper[\s-]*proof\b/gi, '')
    .replace(/\bis\s+not\s+(?:yet\s+)?tamper[\s-]*proof\b/gi, '');
}

function hasAffirmativeTamperClaim(text) {
  return tamperTerm.test(withoutAllowedTamperNegations(text));
}

function normalizeVersionText(text) {
  return normalizeClaimText(text)
    .replace(/\bv1\.0\b/gi, 'Version 1.0');
}

function withoutAllowedVersionNegations(text) {
  return normalizeVersionText(text)
    .replace(/\bnot\s+Version 1\.0\b/gi, '')
    .replace(/\bVersion 1\.0\s+(?:is\s+)?not\s+(?:yet\s+)?(?:ready|approved|validated|eligible|complete|certified|promoted)\b/gi, '')
    .replace(/\b(?:is\s+)?not\s+(?:yet\s+)?(?:ready|approved|validated|eligible|complete|certified|promoted)\s+(?:as\s+|for\s+|to\s+)?Version 1\.0\b/gi, '');
}

const version1Claims = [
  /Version 1\.0\s*(?::|-)?\s*(?:is\s+)?(?:ready|approved|validated|eligible|complete|certified|promoted)\b/i,
  /\b(?:ready|approved|validated|eligible|complete|certified|promoted)\s+(?:as\s+|for\s+|to\s+)?Version 1\.0\b/i
];

function hasAffirmativeVersion1Claim(text) {
  const cleaned = withoutAllowedVersionNegations(text);
  return version1Claims.some((rx) => rx.test(cleaned));
}

function withoutAllowedClosureNegations(text) {
  return normalizeClaimText(text)
    .replace(/\bindependent closure\s*:\s*pending\b/gi, '')
    .replace(/\bindependent closure\s+(?:is|has|was)\s+not\s+(?:yet\s+)?(?:been\s+)?(?:claimed|confirmed|complete|closed|approved|achieved|established)\b/gi, '')
    .replace(/\bclosure\s+(?:was|is|has(?:\s+been)?)\s+not\s+(?:yet\s+)?independently\s+(?:confirmed|closed|approved|established)\b/gi, '');
}

const closureClaims = [
  /\bindependent closure[^.\n]{0,60}\b(?:confirmed|complete|closed|approved|achieved|established)\b/i,
  /\bclosure[^.\n]{0,40}\b(?:was|is|has been)?\s*independently\s+(?:confirmed|closed|approved|established)\b/i,
  /\b(?:all\s+nine\s+V035\s+findings|V035-F01\s+through\s+V035-F09)[^.\n]{0,50}\bindependently\s+closed\b/i
];

function hasAffirmativeClosureClaim(text) {
  const cleaned = withoutAllowedClosureNegations(text);
  return closureClaims.some((rx) => rx.test(cleaned));
}

/* Self-fixtures: legitimate direct negations must remain allowed. */
for (const fixture of [
  'not claimed to be tamper-proof',
  'not a tamper-proof control',
  'The export is never tamper-proof.',
  'The export cannot be considered tamper-proof.'
]) {
  assert(!hasAffirmativeTamperClaim(fixture), `Tamper negative fixture falsely rejected: ${fixture}`);
}

for (const fixture of [
  'not Version 1.0',
  'Version 1.0 is not approved.',
  'This release is not ready for Version 1.0.',
  'This release is not yet ready for Version 1.0.'
]) {
  assert(!hasAffirmativeVersion1Claim(fixture), `Version negative fixture falsely rejected: ${fixture}`);
}

for (const fixture of [
  'Independent closure is not claimed.',
  'Independent closure: pending.',
  'Independent closure has not been confirmed.',
  'Independent closure is not yet complete.',
  'Closure was not independently confirmed.'
]) {
  assert(!hasAffirmativeClosureClaim(fixture), `Closure negative fixture falsely rejected: ${fixture}`);
}

/* Self-fixtures: demonstrated affirmative paraphrases must be rejected. */
for (const fixture of [
  'Tamperproof evidence export.',
  'Tamper-proof evidence export.',
  'Tamper\u2011proof evidence export.',
  'Not signed, but tamper-proof evidence export.'
]) {
  assert(hasAffirmativeTamperClaim(fixture), `Tamper affirmative fixture escaped: ${fixture}`);
}

for (const fixture of [
  'This release is ready for Version 1.0.',
  'Version 1.0 approved.',
  'Approved as Version 1.0.',
  'Promoted to Version 1.0.',
  'v1.0 approved.',
  'Version 1.0: approved.'
]) {
  assert(hasAffirmativeVersion1Claim(fixture), `Version affirmative fixture escaped: ${fixture}`);
}

for (const fixture of [
  'Independent closure confirmed.',
  'Independent closure has been confirmed.',
  'V035-F01 through V035-F09 were independently closed.',
  'All nine V035 findings were independently closed.',
  'Closure was independently confirmed.'
]) {
  assert(hasAffirmativeClosureClaim(fixture), `Closure affirmative fixture escaped: ${fixture}`);
}

const tamperSurfaces = [
  ['README', readme],
  ['CHANGELOG', changelog],
  ['VERSION', version],
  ['UI', html]
];

for (const [name, text] of tamperSurfaces) {
  assert(
    !hasAffirmativeTamperClaim(text),
    `${name} contains affirmative tamper-proof language.`
  );
}

const changelogCurrent =
  changelog.split('## v0.3.8')[1]?.split('\n## ')[0] || '';

const claimSurfaces = [
  ['README', readme],
  ['VERSION', version],
  ['UI', html],
  ['CHANGELOG v0.3.8', changelogCurrent]
];

for (const [name, text] of claimSurfaces) {
  assert(
    !hasAffirmativeVersion1Claim(text),
    `${name} contains premature Version 1.0 claim.`
  );

  assert(
    !hasAffirmativeClosureClaim(text),
    `${name} contains premature independent-closure claim.`
  );
}

for (const rx of [
  /(?:is|are)\s+cryptographically authentic/i,
  /PASS is a digital signature/i,
  /PASS proves? authenticity/i
]) {
  assert(!rx.test(readme), `README integrity overclaim matched: ${rx}`);
  assert(!rx.test(html), `UI integrity overclaim matched: ${rx}`);
}

for (const suite of [
  'tests/v0.3.8-regression.mjs',
  'tests/v0.3.8-doc-audit.mjs',
  'tests/v0.3.8-mutation-regression.mjs',
  'tests/v0.3.8-manifest-audit.mjs'
]) {
  assert(readme.includes(suite), `README current suite missing: ${suite}`);
  assert(gate.includes(suite), `Current gate missing suite: ${suite}`);
}

assert(readme.includes('V0_3_8_RELEASE_GATE.md'), 'README current gate missing.');
assert(gate.includes('targeted independent retest of residual V035-F05'), 'Current gate missing targeted residual F05 requirement.');
assert(gate.includes('final full independent zero-open-finding adversarial regression'), 'Current gate missing final full independent regression requirement.');
assert(gate.includes('zero Critical, High, Medium, Low, or actionable Observation findings'), 'Current gate missing zero-actionable-finding requirement.');

for (const [name,text] of [
  ['v0.3.2',gate2],
  ['v0.3.3',gate3],
  ['v0.3.4',gate4],
  ['v0.3.5',gate5],
  ['v0.3.6',gate6],
  ['v0.3.7',gate7]
]) {
  assert(text.startsWith('# SUPERSEDED'), `${name} gate is not marked superseded.`);
}

assert(gate6.includes('V0_3_7_RELEASE_GATE.md'), 'v0.3.6 historical pointer changed unexpectedly.');
assert(gate7.includes('V0_3_8_RELEASE_GATE.md'), 'v0.3.7 superseded gate does not point to current v0.3.8 gate.');

assert(changelog.trimStart().startsWith('# Changelog'), 'CHANGELOG title is not first.');
assert(changelog.indexOf('## v0.3.8') > changelog.indexOf('# Changelog'), 'v0.3.8 entry missing or misplaced.');
assert(changelog.includes('v0.3.5 passed its deployed smoke gates but its final independent regression found nine actionable findings'), 'CHANGELOG lacks v0.3.5 final failure history.');
assert(changelog.includes('v0.3.4 was superseded after its deployed smoke test found residual issues'), 'CHANGELOG lacks v0.3.4 superseded status.');
assert(changelog.includes('partially addressed V031-NEW-07'), 'CHANGELOG v0.3.2 history does not preserve partial-closure status.');
assert(changelog.includes('v0.3.3 testing later confirmed full observability closure'), 'CHANGELOG does not record final V031-NEW-07 closure timing.');

assert(readme.includes('Version 0.3.5 was superseded and was not promoted to Version 1.0.'), 'README lacks v0.3.5 superseded/not-promoted status.');
assert(readme.includes('v0.3.4 was superseded and was not promoted to Version 1.0.'), 'README lacks v0.3.4 superseded/not-promoted status.');
assert(readme.includes('every tracked release file except `build-info.json` itself'), 'README manifest coverage rule missing.');

const currentSection =
  readme.split('## v0.3.8 bounded F05 oracle-hardening candidate')[1] || '';

assert(currentSection.length > 0, 'README v0.3.8 section missing.');
assert(currentSection.includes('V035-F04 is independently closed.'), 'README does not preserve independent F04 closure.');
assert(currentSection.includes('Independent closure of V035-F05 is **not** claimed.'), 'README current F05 closure disclaimer missing.');

assert(version.includes('Independent closure: pending'), 'VERSION overclaims closure.');
assert(version.includes('not Version 1.0'), 'VERSION lacks explicit not-Version-1.0 status.');

assert(html.includes('Version 0.3.8 is a bounded F05 oracle-hardening candidate'), 'UI current-release narrative missing.');
assert(!html.includes('Version 0.3.6 is a bounded hardening candidate'), 'UI retains stale v0.3.6 current-release narrative.');

assert(v035Report.includes('FAIL — ACTIONABLE FINDINGS REMAIN'), 'Preserved v0.3.5 report missing final FAIL result.');
assert(v035Findings.includes('TOTAL ACTIONABLE FINDINGS: 9'), 'Preserved v0.3.5 findings total missing.');
assert(v035Result.includes('21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4'), 'v0.3.5 result source SHA missing.');

assert(v037Report.includes('TARGETED RESIDUAL CLOSURE: FAIL — ACTIONABLE FINDINGS REMAIN'), 'Preserved v0.3.7 report missing FAIL result.');
assert(v037Report.includes('V035-F04'), 'Preserved v0.3.7 report missing F04.');
assert(v037Report.includes('**CLOSED**'), 'Preserved v0.3.7 report does not preserve F04 closure.');
assert(v037Report.includes('**PARTIALLY CLOSED**'), 'Preserved v0.3.7 report does not preserve F05 partial closure.');
assert(v037Raw.includes('GROUP extra-pos: 9 UNEXPECTED'), 'Preserved v0.3.7 raw evidence missing affirmative-paraphrase failures.');
assert(v037Raw.includes('GROUP extra-neg: 3 UNEXPECTED'), 'Preserved v0.3.7 raw evidence missing legitimate-negation failures.');

console.log('JANUS v0.3.8 documentation/release audit: PASS');
