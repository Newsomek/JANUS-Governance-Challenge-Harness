import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {
  guardedUnitsForSurface,
  keyOf,
  loadAllowlist
} from './lib/governance-claim-policy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.JANUS_TEST_ROOT
  ? path.resolve(process.env.JANUS_TEST_ROOT)
  : path.resolve(here,'..');

const read = p => fs.readFileSync(path.join(root,p),'utf8');
const assert = (ok,msg) => {
  if (!ok) throw new Error(msg);
};

const surfaces = [
  'README.md',
  'CHANGELOG.md',
  'VERSION.txt',
  'index.html'
];

const allowlistPath =
  path.join(root,'docs','APPROVED_GOVERNANCE_CLAIMS.json');

const allowlist = loadAllowlist(allowlistPath);

assert(allowlist.schema === 1, 'Guarded-claim allowlist schema mismatch.');
assert(allowlist.version === '0.3.9', 'Guarded-claim allowlist version mismatch.');

const globalApproved =
  new Set(allowlist.approved_global_units || []);

for (const surface of surfaces) {
  const text = read(surface);
  const actual = guardedUnitsForSurface(surface,text);
  const actualKeys = new Set(actual.map(keyOf));
  const approvedKeys =
    new Set(allowlist.surfaces?.[surface] || []);

  for (const entry of actual) {
    const key = keyOf(entry);

    assert(
      approvedKeys.has(key) || globalApproved.has(entry.unit),
      `${surface} contains unreviewed guarded claim unit: ${entry.unit}`
    );
  }

  for (const key of approvedKeys) {
    assert(
      actualKeys.has(key),
      `${surface} reviewed guarded claim disappeared or changed: ${key}`
    );
  }
}

const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const version = read('VERSION.txt');
const html = read('index.html');

assert(
  readme.startsWith('# JANUS Governance Challenge Harness v0.3.9'),
  'README current version missing.'
);

assert(
  readme.includes('## v0.3.9 fail-closed documentation-claim control candidate'),
  'README current v0.3.9 section missing.'
);

assert(
  readme.includes('V035-F04 remains independently closed.'),
  'README does not preserve F04 closure.'
);

assert(
  readme.includes('Independent closure of V035-F05 is **not** claimed.'),
  'README lacks current F05 non-closure statement.'
);

assert(
  version.includes('Version 0.3.9'),
  'VERSION current version missing.'
);

assert(
  version.includes('Build ID: janus-governance-challenge-harness-v0.3.9'),
  'VERSION build ID missing.'
);

assert(
  version.includes('not Version 1.0'),
  'VERSION lacks explicit non-v1 status.'
);

assert(
  changelog.includes('## v0.3.9 — fail-closed documentation-claim control candidate'),
  'CHANGELOG current section missing.'
);

assert(
  html.includes('JANUS Governance Challenge Harness v0.3.9'),
  'UI current version missing.'
);

assert(
  html.includes('Version 0.3.9 is a bounded fail-closed documentation-claim-control candidate'),
  'UI current release narrative missing.'
);

assert(
  !html.includes('Version 0.3.8 is a bounded F05 oracle-hardening candidate'),
  'UI retains stale v0.3.8 current-release narrative.'
);

const hashes =
  JSON.parse(read('docs/EXPECTED_CONTRACT_HASHES.json'));

assert(
  hashes.version === '0.3.9',
  'Expected contract hash metadata version mismatch.'
);

assert(
  Array.isArray(hashes.scenarios) &&
  hashes.scenarios.length === 6,
  'Expected contract hash file must contain six scenarios.'
);

assert(
  readme.includes('unsigned client-side artifact'),
  'README unsigned-artifact limitation missing.'
);

assert(
  readme.includes('PASS is not a digital signature or proof of authenticity'),
  'README signature/authenticity limitation missing.'
);

assert(
  readme.includes('controls the page/DevTools and coordinates edits with recomputed client-side hashes'),
  'README DevTools limitation missing.'
);

assert(
  readme.includes('accidental or uncoordinated mutation, not malicious coordinated forgery'),
  'README accidental/uncoordinated limitation missing.'
);

assert(
  html.includes('Evidence exports are unsigned client-side artifacts.'),
  'UI unsigned-artifact limitation missing.'
);

assert(
  html.includes('it is not a digital signature'),
  'UI digital-signature limitation missing.'
);

assert(
  html.includes('controls DevTools/console state and can recompute client-side hashes'),
  'UI DevTools limitation missing.'
);

const v038Report =
  read('testing/claude/v0.3.8/JANUS_v0.3.8_Targeted_V035-F05_Closure_Report.md');

const v038Raw =
  read('testing/claude/v0.3.8/JANUS_v0.3.8_targeted_F05_closure_raw_evidence.txt');

assert(
  v038Report.includes('TARGETED F05 CLOSURE: FAIL — ACTIONABLE FINDINGS REMAIN'),
  'Preserved v0.3.8 report missing FAIL result.'
);

assert(
  v038Report.includes('PARTIALLY CLOSED'),
  'Preserved v0.3.8 report missing F05 partial-closure status.'
);

assert(
  v038Raw.includes('TOTAL UNEXPECTED: 75'),
  'Preserved v0.3.8 raw evidence missing independent probe result.'
);

const gate9 = read('tests/V0_3_9_RELEASE_GATE.md');
const gate8 = read('tests/V0_3_8_RELEASE_GATE.md');

assert(
  gate8.startsWith('# SUPERSEDED'),
  'v0.3.8 gate is not superseded.'
);

assert(
  gate8.includes('V0_3_9_RELEASE_GATE.md'),
  'v0.3.8 gate does not point to v0.3.9.'
);

assert(
  gate9.includes('final full independent zero-open-finding adversarial regression'),
  'v0.3.9 gate lacks final independent regression requirement.'
);

console.log('JANUS v0.3.9 documentation/release audit: PASS');
