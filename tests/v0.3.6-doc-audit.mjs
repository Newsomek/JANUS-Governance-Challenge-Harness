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
const gate = read('tests/V0_3_6_RELEASE_GATE.md');
const gate2 = read('tests/V0_3_2_RELEASE_GATE.md');
const gate3 = read('tests/V0_3_3_RELEASE_GATE.md');
const gate4 = read('tests/V0_3_4_RELEASE_GATE.md');
const gate5 = read('tests/V0_3_5_RELEASE_GATE.md');
const hashes = JSON.parse(read('docs/EXPECTED_CONTRACT_HASHES.json'));
const report = read('testing/claude/v0.3.5/V0_3_5_FINAL_INDEPENDENT_ADVERSARIAL_REGRESSION.md');
const findings = read('testing/claude/v0.3.5/V0_3_5_FINAL_FINDINGS_LOG.md');
const v035Result = read('tests/V0_3_5_AUTOMATED_REGRESSION_RESULT.txt');

assert(readme.includes('# JANUS Governance Challenge Harness v0.3.6'), 'README current version missing.');
assert(version.includes('Version 0.3.6'), 'VERSION current version missing.');
assert(html.includes('JANUS Governance Challenge Harness v0.3.6'), 'UI version not v0.3.6.');
assert(hashes.version === '0.3.6', 'Expected contract hash file version mismatch.');
assert(Array.isArray(hashes.scenarios) && hashes.scenarios.length === 6, 'Expected contract hash file must contain six scenarios.');

const readmeIntegrity = [
  'unsigned client-side artifact',
  'PASS is not a digital signature or proof of authenticity',
  'controls the page/DevTools and coordinates edits with recomputed client-side hashes',
  'accidental or uncoordinated later mutation'
];
for (const phrase of readmeIntegrity) assert(readme.includes(phrase), `README integrity disclosure missing: ${phrase}`);
assert(html.includes('Evidence exports are unsigned client-side artifacts.'), 'UI unsigned-client disclosure missing.');
assert(html.includes('it is not a digital signature'), 'UI digital-signature limitation missing.');
assert(html.includes('controls DevTools/console state and can recompute client-side hashes'), 'UI DevTools limitation missing.');

const forbiddenOverclaims = [
  /(?:is|are|remains?)\s+tamper[- ]proof/i,
  /(?:is|are)\s+cryptographically authentic/i,
  /PASS is a digital signature/i,
  /PASS proves? authenticity/i
];
for (const rx of forbiddenOverclaims) {
  assert(!rx.test(readme), `README integrity overclaim matched: ${rx}`);
  assert(!rx.test(html), `UI integrity overclaim matched: ${rx}`);
}

for (const suite of ['tests/v0.3.6-regression.mjs','tests/v0.3.6-doc-audit.mjs','tests/v0.3.6-mutation-regression.mjs','tests/v0.3.6-manifest-audit.mjs']) {
  assert(readme.includes(suite), `README current suite missing: ${suite}`);
  assert(gate.includes(suite), `Current gate missing suite: ${suite}`);
}
assert(readme.includes('V0_3_6_RELEASE_GATE.md'), 'README current gate missing.');
assert(gate.includes('targeted V035-F01 through V035-F09 closure'), 'Current gate missing targeted closure requirement.');
assert(gate.includes('final full independent zero-open-finding adversarial regression'), 'Current gate missing final full independent regression requirement.');
assert(gate.includes('zero Critical, High, Medium, Low, or actionable Observation findings'), 'Current gate missing zero-actionable-finding requirement.');

for (const [name,text] of [['v0.3.2',gate2],['v0.3.3',gate3],['v0.3.4',gate4],['v0.3.5',gate5]]) {
  assert(text.startsWith('# SUPERSEDED'), `${name} gate is not marked superseded.`);
}
for (const text of [gate2,gate3,gate4,gate5]) assert(text.includes('V0_3_6_RELEASE_GATE.md'), 'Superseded gate does not point to current v0.3.6 gate.');

assert(changelog.trimStart().startsWith('# Changelog'), 'CHANGELOG title is not first.');
assert(changelog.indexOf('## v0.3.6') > changelog.indexOf('# Changelog'), 'v0.3.6 entry missing or misplaced.');
assert(changelog.includes('v0.3.5 passed its deployed smoke gates but its final independent regression found nine actionable findings'), 'CHANGELOG lacks v0.3.5 final failure history.');
assert(changelog.includes('v0.3.4 was superseded after its deployed smoke test found residual issues'), 'CHANGELOG lacks v0.3.4 superseded status.');
assert(changelog.includes('partially addressed V031-NEW-07'), 'CHANGELOG v0.3.2 history does not preserve partial-closure status.');
assert(changelog.includes('v0.3.3 testing later confirmed full observability closure'), 'CHANGELOG does not record final V031-NEW-07 closure timing.');
assert(!changelog.includes('visually equivalent commitments and sources are rejected'), 'CHANGELOG retains overbroad canonical-equivalence claim.');

assert(readme.includes('Version 0.3.5 was superseded and was not promoted to Version 1.0.'), 'README lacks v0.3.5 superseded/not-promoted status.');
assert(readme.includes('v0.3.4 was superseded and was not promoted to Version 1.0.'), 'README lacks v0.3.4 superseded/not-promoted status.');
assert(readme.includes('every tracked release file except `build-info.json` itself'), 'README manifest coverage rule missing.');

const currentSection = readme.split('## v0.3.6 bounded hardening candidate')[1] || '';
assert(currentSection.length > 0, 'README v0.3.6 section missing.');
assert(!/Version 1\.0\s+(ready|eligible|approved|complete|validated)/i.test(currentSection), 'README contains premature Version 1.0 readiness claim.');
assert(!/independent closure\s+(is|has been)\s+(claimed|confirmed|complete)/i.test(currentSection), 'README contains premature independent-closure claim.');
assert(currentSection.includes('Independent closure is **not** claimed'), 'README current closure disclaimer missing.');

assert(version.includes('Independent closure: pending'), 'VERSION overclaims closure.');
assert(!/Status:.*Version 1\.0/i.test(version) || version.includes('not Version 1.0'), 'VERSION implies Version 1.0 promotion.');

assert(report.includes('FAIL — ACTIONABLE FINDINGS REMAIN'), 'Preserved v0.3.5 report missing final FAIL result.');
assert(report.includes('TOTAL ACTIONABLE FINDINGS:'), 'Preserved v0.3.5 report missing finding total.');
assert(findings.includes('TOTAL ACTIONABLE FINDINGS: 9'), 'Findings log does not record nine actionable findings.');
assert(findings.includes('Do not promote to Version 1.0.'), 'Findings log does not preserve release block.');
assert(v035Result.includes('21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4'), 'v0.3.5 result addendum missing source SHA.');
assert(v035Result.includes('948536a17a454e59f782e023ac1ded8e30e9f33ca660c3dbd674273fe1b56488'), 'v0.3.5 result addendum missing scenario-block SHA.');
assert(v035Result.includes('including exactly one trailing LF after the semicolon'), 'v0.3.5 result addendum missing exact scenario-block hashing method.');

console.log('JANUS v0.3.6 documentation/release audit: PASS');
