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
const gate = read('tests/V0_3_4_RELEASE_GATE.md');
const oldGate = read('tests/V0_3_3_RELEASE_GATE.md');
const hashes = JSON.parse(read('docs/EXPECTED_CONTRACT_HASHES.json'));

assert(readme.includes('# JANUS Governance Challenge Harness v0.3.4'), 'README current version missing.');
assert(readme.includes('unsigned client-side artifacts'), 'README unsigned-client disclosure missing.');
assert(readme.includes('console/devtools access'), 'README console/devtools limitation missing.');
assert(readme.includes('accidental or uncoordinated mutation'), 'README snapshot limitation missing.');
assert(readme.includes('EXPECTED_CONTRACT_HASHES.json'), 'README offline contract-hash verification missing.');
assert(!readme.includes('Version 0.3.3 addresses every actionable finding'), 'README retains unsupported closure claim.');
assert(!readme.includes('Promotion rule: v0.3.2 must undergo'), 'README retains stale v0.3.2 current-release rule.');

assert(changelog.trimStart().startsWith('# Changelog'), 'CHANGELOG title is not first.');
assert(changelog.indexOf('## v0.3.4') > changelog.indexOf('# Changelog'), 'v0.3.4 changelog entry is misplaced.');
assert(!changelog.includes('closes V032-NEW-01 through V032-NEW-09'), 'CHANGELOG retains unsupported closure claim.');

assert(version.includes('Version 0.3.4'), 'VERSION.txt current version missing.');
assert(version.includes('broader default-ignorable/blank validation'), 'VERSION.txt v0.3.4 corrections are stale.');
assert(version.includes('Independent closure: pending'), 'VERSION.txt overclaims closure.');

assert(html.includes('v0.3.4'), 'UI version not v0.3.4.');
assert(html.includes('Independent confirmation is still required'), 'About panel overclaims closure.');

assert(oldGate.startsWith('# SUPERSEDED'), 'v0.3.3 release gate is not marked superseded.');
assert(gate.includes('v0.3.4-regression.mjs'), 'v0.3.4 gate missing behavioural suite.');
assert(gate.includes('v0.3.4-doc-audit.mjs'), 'v0.3.4 gate missing documentation audit.');
assert(gate.includes('v0.3.4-mutation-regression.mjs'), 'v0.3.4 gate missing mutation suite.');
assert(!gate.includes('v0.3.2-regression.mjs'), 'v0.3.4 gate incorrectly requires v0.3.2 suite.');

assert(hashes.version === '0.3.4', 'Expected contract hash file version mismatch.');
assert(Array.isArray(hashes.scenarios) && hashes.scenarios.length === 6, 'Expected contract hash file must contain six scenarios.');
for (const item of hashes.scenarios) {
  assert(typeof item.scenario_id === 'string' && item.scenario_id, 'Contract hash item missing scenario_id.');
  assert(/^[0-9a-f]{64}$/i.test(item.contract_sha256), `Invalid contract SHA for ${item.scenario_id}.`);
}

console.log('JANUS v0.3.4 documentation/release audit: PASS');
