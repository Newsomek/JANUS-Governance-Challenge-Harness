import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  normalizeClaimText,
  guardedUnitsForSurface,
  keyOf
} from './lib/governance-claim-policy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here,'..');

const surfaces = [
  'README.md',
  'CHANGELOG.md',
  'VERSION.txt',
  'index.html'
];

const approvedGlobalUnits = [
  'not claimed to be tamper-proof',
  'not a tamper-proof control',
  'The export is never tamper-proof.',
  'The export cannot be considered tamper-proof.',
  'Exports are not tamper-proof.',
  "The export isn't tamper-proof.",
  'PASS does not make the export tamper-proof.',
  'No tamper-proof guarantee is made.',
  'Not signed, and not tamper-proof.',
  'Independent closure is not claimed.',
  'Independent closure: pending.',
  'Independent closure has not been confirmed.',
  'Independent closure is not yet complete.',
  'Independent closure has not yet been confirmed.',
  'Independent closure of V035-F05 has not been confirmed.',
  'No independent closure has been confirmed.',
  'Independent closure is pending until F05 is closed.',
  'Independent closure will be confirmed only after the final regression.',
  'Closure was not independently confirmed.',
  'Closure has not yet been independently confirmed.',
  'F05 is not independently closed.',
  'The remaining finding has not been independently closed.',
  'This release is not ready for Version 1.0.',
  'This release is not yet ready for Version 1.0.',
  'Version 1.0 is not approved.',
  'Version 1.0 was not approved.',
  'v1.0 is not yet approved.',
  'This is not the Version 1.0 release.',
  'This release has not been approved as Version 1.0.',
  'Neither ready for nor approved as Version 1.0.',
  'Not yet approved or ready for Version 1.0.'
].map(normalizeClaimText);

const output = {
  schema: 1,
  version: '0.3.9',
  policy: 'Fail closed on unreviewed normalized guarded claim units.',
  surfaces: {},
  approved_global_units: [...new Set(approvedGlobalUnits)].sort()
};

for (const surface of surfaces) {
  const text = fs.readFileSync(path.join(root,surface),'utf8');

  output.surfaces[surface] = [
    ...new Set(
      guardedUnitsForSurface(surface,text).map(keyOf)
    )
  ].sort();
}

const dest = path.join(root,'docs','APPROVED_GOVERNANCE_CLAIMS.json');

fs.writeFileSync(
  dest,
  JSON.stringify(output,null,2) + '\n',
  'utf8'
);

console.log(
  `Generated reviewed guarded-claim allowlist for ${surfaces.length} surfaces.`
);

for (const surface of surfaces) {
  console.log(`${surface}: ${output.surfaces[surface].length}`);
}

console.log(`Global reviewed disclaimer units: ${output.approved_global_units.length}`);
