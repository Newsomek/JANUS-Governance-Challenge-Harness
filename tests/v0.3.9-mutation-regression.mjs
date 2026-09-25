import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here,'..');

const behavioral = path.join(repo,'tests','v0.3.9-regression.mjs');
const docAudit = path.join(repo,'tests','v0.3.9-doc-audit.mjs');
const claimFixtures = path.join(repo,'tests','v0.3.9-doc-claim-fixtures.mjs');

const sourceDoc = path.join(
  repo,
  'docs',
  'JANUS_Orientation_Edition_2026_EN.docx'
);

const baseFiles = [
  'app.js',
  'index.html',
  'README.md',
  'CHANGELOG.md',
  'VERSION.txt',
  'docs/EXPECTED_CONTRACT_HASHES.json',
  'docs/APPROVED_GOVERNANCE_CLAIMS.json',
  'tests/lib/governance-claim-policy.mjs',
  'tests/v0.3.9-regression.mjs',
  'tests/v0.3.9-doc-audit.mjs',
  'tests/v0.3.9-doc-claim-fixtures.mjs',
  'tests/V0_3_8_RELEASE_GATE.md',
  'tests/V0_3_9_RELEASE_GATE.md',
  'testing/claude/v0.3.8/JANUS_v0.3.8_Targeted_V035-F05_Closure_Report.md',
  'testing/claude/v0.3.8/JANUS_v0.3.8_targeted_F05_closure_raw_evidence.txt'
];

function copyBase(dst) {
  for (const rel of baseFiles) {
    const src = path.join(repo,rel);
    const out = path.join(dst,rel);

    if (!fs.existsSync(src)) {
      throw new Error(`Base file missing: ${rel}`);
    }

    fs.mkdirSync(path.dirname(out),{recursive:true});
    fs.copyFileSync(src,out);
  }
}

function mutateText(root,rel,fn) {
  const p = path.join(root,rel);
  const before = fs.readFileSync(p,'utf8');
  const after = fn(before);

  if (after === before) {
    throw new Error(`Mutation did not change ${rel}`);
  }

  fs.writeFileSync(p,after,'utf8');
}

function mutationChanges(mutation) {
  if (Array.isArray(mutation.changes)) {
    return mutation.changes;
  }

  return [{
    file:mutation.file,
    apply:mutation.apply
  }];
}

function preflightMutation(mutation) {
  for (const change of mutationChanges(mutation)) {
    const target = path.join(repo,change.file);

    if (!fs.existsSync(target)) {
      throw new Error(
        `Mutation preflight target missing: ${mutation.name} -> ${change.file}`
      );
    }

    const before = fs.readFileSync(target,'utf8');
    const after = change.apply(before);

    if (after === before) {
      throw new Error(
        `Mutation preflight NO-OP: ${mutation.name} -> ${change.file}`
      );
    }
  }
}

function applyMutation(root,mutation) {
  for (const change of mutationChanges(mutation)) {
    mutateText(root,change.file,change.apply);
  }
}

function runFromMutatedRoot(relScript,root) {
  const script = path.join(root,relScript);

  if (!fs.existsSync(script)) {
    throw new Error(`Mutated suite script missing: ${relScript}`);
  }

  return spawnSync(
    process.execPath,
    [script],
    {
      cwd:root,
      env:{
        ...process.env,
        JANUS_TEST_ROOT:root,
        JANUS_SOURCE_PATH:sourceDoc
      },
      encoding:'utf8'
    }
  );
}

function runSuite(kind,root) {
  if (kind === 'behavior') {
    return runFromMutatedRoot('tests/v0.3.9-regression.mjs',root);
  }

  if (kind === 'docs') {
    return runFromMutatedRoot('tests/v0.3.9-doc-audit.mjs',root);
  }

  if (kind === 'fixtures') {
    return runFromMutatedRoot('tests/v0.3.9-doc-claim-fixtures.mjs',root);
  }

  throw new Error(`Unknown suite: ${kind}`);
}

const mutations = [

  // ----------------------------------------------------------
  // CORE BEHAVIOR / HISTORICAL CONTROLS PRESERVED
  // ----------------------------------------------------------

  {
    name:'stored_core_match forced true',
    file:'app.js',
    suite:'behavior',
    apply:s=>s.replace(
      'const storedCoreMatch = storedCoreHash === snapshot.evidence_core_sha256;',
      'const storedCoreMatch = true;'
    )
  },

  {
    name:'Export event_log equivalent bypass OR true',
    file:'app.js',
    suite:'behavior',
    apply:s=>s.replace(
      'event_log: JSON.stringify(expectedLog) === JSON.stringify(snapshot.event_log)',
      'event_log: JSON.stringify(expectedLog) === JSON.stringify(snapshot.event_log) || true'
    )
  },

  {
    name:'late Export generation guard removed',
    file:'app.js',
    suite:'behavior',
    apply:s=>s.replace(
      '    // Re-check generation immediately before the synchronous download path.\n    // Scenario/prediction changes or Reset during any awaited hashing above invalidate this export.\n    if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;\n\n    const exportedAt = new Date().toISOString();',
      '    const exportedAt = new Date().toISOString();'
    )
  },

  {
    name:'expected source SHA altered in app',
    file:'app.js',
    suite:'behavior',
    apply:s=>s.replace(
      '21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4',
      '01766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4'
    )
  },

  {
    name:'S05 disposition changed',
    file:'app.js',
    suite:'behavior',
    apply:s=>{
      const start=s.indexOf('id: "conflicting-authorities"');
      if(start<0) return s;

      const i=s.indexOf(
        'disposition: "INSUFFICIENT_SPECIFICATION"',
        start
      );

      if(i<0) return s;

      return (
        s.slice(0,i) +
        s.slice(i).replace(
          'disposition: "INSUFFICIENT_SPECIFICATION"',
          'disposition: "ESCALATE"'
        )
      );
    }
  },

  // ----------------------------------------------------------
  // FAIL-CLOSED POLICY ARCHITECTURE
  // ----------------------------------------------------------

  {
    name:'guard classifier disabled',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'export function isGuardedUnit(unit) {\n  return guardedConcept.test(unit);\n}',
      'export function isGuardedUnit(unit) {\n  return false;\n}'
    )
  },

  {
    name:'all units treated as guarded',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'docs',
    apply:s=>s.replace(
      'export function isGuardedUnit(unit) {\n  return guardedConcept.test(unit);\n}',
      'export function isGuardedUnit(unit) {\n  return true;\n}'
    )
  },

  {
    name:'tamper guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'tamper\\w*|',
      ''
    )
  },

  {
    name:'alter guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'alter\\w*|',
      ''
    )
  },

  {
    name:'immutability guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'immutab\\w*|',
      ''
    )
  },

  {
    name:'signature guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'sign(?:ed|ature|ing)?|',
      ''
    )
  },

  {
    name:'integrity guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'integrity|',
      ''
    )
  },

  {
    name:'guarantee guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'guarantee\\w*|',
      ''
    )
  },

  {
    name:'Version 1 guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'version\\s*1(?:\\.0)?|',
      ''
    )
  },

  {
    name:'v1 shorthand guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'v1(?:\\.0)?|',
      ''
    )
  },

  {
    name:'independent guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'independent\\w*|',
      ''
    )
  },

  {
    name:'closure guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'closure|',
      ''
    )
  },

  {
    name:'closed guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'closed|',
      ''
    )
  },

  {
    name:'approval guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'approv\\w*|',
      ''
    )
  },

  {
    name:'promotion guard removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'promot\\w*',
      'nomatchguard'
    )
  },

  // ----------------------------------------------------------
  // NORMALIZATION ATTACKS
  // ----------------------------------------------------------

  {
    name:'NFKC normalization removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      "let text = decodeHtmlEntities(String(value)).normalize('NFKC');",
      "let text = decodeHtmlEntities(String(value));"
    )
  },

  {
    name:'default-ignorable stripping removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      ".replace(/[\\p{Cf}\\p{Default_Ignorable_Code_Point}\\u00AD]/gu, '')",
      ''
    )
  },

  {
    name:'Unicode dash normalization removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      ".replace(/[\\u2010-\\u2015\\u2212\\uFE58\\uFE63\\uFF0D]/gu, '-')",
      ''
    )
  },

  {
    name:'Markdown emphasis stripping removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      ".replace(/[*_~`]/g, '')",
      ''
    )
  },

  {
    name:'numeric HTML entity decoding removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      ".replace(/&#([0-9]+);/g, (_,dec) =>\n      String.fromCodePoint(parseInt(dec,10)))",
      ''
    )
  },

  {
    name:'nbsp HTML entity decoding removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      ".replace(/&nbsp;/gi, ' ')",
      ''
    )
  },

  {
    name:'HTML tag stripping removed',
    file:'tests/lib/governance-claim-policy.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      ".replace(/<[^>]*>/g, '')",
      ''
    )
  },

  // ----------------------------------------------------------
  // ALLOWLIST ENFORCEMENT ATTACKS
  // ----------------------------------------------------------

  {
    name:'all guarded units implicitly approved',
    file:'tests/v0.3.9-doc-audit.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'approvedKeys.has(key) || globalApproved.has(entry.unit)',
      'true'
    )
  },

  {
    name:'global allowlist disabled',
    file:'tests/v0.3.9-doc-audit.mjs',
    suite:'fixtures',
    apply:s=>s.replace(
      'approvedKeys.has(key) || globalApproved.has(entry.unit)',
      'approvedKeys.has(key)'
    )
  },

  {
    name:'surface allowlist disabled',
    file:'tests/v0.3.9-doc-audit.mjs',
    suite:'docs',
    apply:s=>s.replace(
      'approvedKeys.has(key) || globalApproved.has(entry.unit)',
      'globalApproved.has(entry.unit)'
    )
  },

  {
    name:'reviewed guarded claim disappears from README',
    file:'README.md',
    suite:'docs',
    apply:s=>s.replace(
      '- reviewed disclaimer units may be approved globally and remain valid across current release surfaces;\n',
      ''
    )
  },

  {
    name:'allowlist version corrupted',
    file:'docs/APPROVED_GOVERNANCE_CLAIMS.json',
    suite:'docs',
    apply:s=>{
      const obj=JSON.parse(s);
      obj.version='9.9.9';
      return JSON.stringify(obj,null,2)+'\n';
    }
  },

  {
    name:'allowlist schema corrupted',
    file:'docs/APPROVED_GOVERNANCE_CLAIMS.json',
    suite:'docs',
    apply:s=>{
      const obj=JSON.parse(s);
      obj.schema=999;
      return JSON.stringify(obj,null,2)+'\n';
    }
  },

  // ----------------------------------------------------------
  // ALLOWLIST DATA TAMPERING
  // ----------------------------------------------------------

  {
    name:'unreviewed affirmative globally allowlisted',
    file:'docs/APPROVED_GOVERNANCE_CLAIMS.json',
    suite:'fixtures',
    apply:s=>{
      const obj=JSON.parse(s);
      obj.approved_global_units.push(
        'version 1.0 has been approved.'
      );
      return JSON.stringify(obj,null,2)+'\n';
    }
  },

  {
    name:'reviewed current surface claim removed from allowlist',
    file:'docs/APPROVED_GOVERNANCE_CLAIMS.json',
    suite:'docs',
    apply:s=>{
      const obj=JSON.parse(s);
      const names=Object.keys(obj.surfaces);

      for(const name of names){
        if(Array.isArray(obj.surfaces[name]) && obj.surfaces[name].length){
          obj.surfaces[name]=obj.surfaces[name].slice(1);
          return JSON.stringify(obj,null,2)+'\n';
        }
      }

      return s;
    }
  },

  {
    name:'README unreviewed guarded claim inserted',
    file:'README.md',
    suite:'docs',
    apply:s=>s.replace(
      '# JANUS Governance Challenge Harness v0.3.9',
      '# JANUS Governance Challenge Harness v0.3.9\n\nEvidence integrity is guaranteed.'
    )
  },

  {
    name:'README reviewed disclaimer changed slightly',
    file:'README.md',
    suite:'docs',
    apply:s=>s.replace(
      'Independent closure of V035-F05 is **not** claimed.',
      'Independent closure of V035-F05 remains unconfirmed.'
    )
  },

  // ----------------------------------------------------------
  // HTML RENDER-EQUIVALENCE ATTACKS
  // ----------------------------------------------------------

  {
    name:'HTML numeric entity tamper-proof inserted',
    file:'index.html',
    suite:'docs',
    apply:s=>s.replace(
      '</main>',
      '<p>Tamper&#8209;proof evidence export.</p>\n</main>'
    )
  },

  {
    name:'HTML inline tag tamperproof inserted',
    file:'index.html',
    suite:'docs',
    apply:s=>s.replace(
      '</main>',
      '<p>Tamper<span></span>proof evidence export.</p>\n</main>'
    )
  },

  {
    name:'HTML nbsp Version 1 claim inserted',
    file:'index.html',
    suite:'docs',
    apply:s=>s.replace(
      '</main>',
      '<p>Version&nbsp;1.0 approved.</p>\n</main>'
    )
  },

  // ----------------------------------------------------------
  // RELEASE-STATE ASSERTIONS
  // ----------------------------------------------------------

  {
    name:'README F05 closure falsely claimed',
    file:'README.md',
    suite:'docs',
    apply:s=>s.replace(
      'Independent closure of V035-F05 is **not** claimed.',
      'V035-F05 is independently closed.'
    )
  },

  {
    name:'VERSION changed to Version 1.0',
    file:'VERSION.txt',
    suite:'docs',
    apply:s=>s.replace(
      'Version 0.3.9',
      'Version 1.0'
    )
  },

  {
    name:'UI stale v0.3.8 narrative restored',
    file:'index.html',
    suite:'docs',
    apply:s=>s.replace(
      'Version 0.3.9 is a bounded fail-closed documentation-claim-control candidate',
      'Version 0.3.8 is a bounded F05 oracle-hardening candidate'
    )
  },

  {
    name:'v0.3.8 gate superseded marker removed',
    file:'tests/V0_3_8_RELEASE_GATE.md',
    suite:'docs',
    apply:s=>s.replace(
      '# SUPERSEDED — historical candidate gate\n\nThis historical gate is retained for traceability and must not be used as the current release gate.\n\nSee `V0_3_9_RELEASE_GATE.md`.\n',
      ''
    )
  },

  {
    name:'v0.3.9 gate final independent regression removed',
    file:'tests/V0_3_9_RELEASE_GATE.md',
    suite:'docs',
    apply:s=>s.replace(
      '14. one final full independent zero-open-finding adversarial regression\n',
      ''
    )
  }
];

for (const mutation of mutations) {
  preflightMutation(mutation);
}

console.log(
  `JANUS v0.3.9 mutation target preflight: PASS ` +
  `(${mutations.length}/${mutations.length} operators active)`
);

if (process.env.JANUS_MUTATION_PREFLIGHT_ONLY === '1') {
  process.exit(0);
}

let survived = 0;

for (const mutation of mutations) {
  const tmp = fs.mkdtempSync(
    path.join(os.tmpdir(),'janus-v039-mut-')
  );

  try {
    copyBase(tmp);
    applyMutation(tmp,mutation);

    const result = runSuite(mutation.suite,tmp);

    if (result.status === 0) {
      survived += 1;

      console.error(`SURVIVED: ${mutation.name}`);

      if (result.stdout) console.error(result.stdout);
      if (result.stderr) console.error(result.stderr);
    } else {
      console.log(`KILLED: ${mutation.name}`);
    }
  } finally {
    fs.rmSync(tmp,{recursive:true,force:true});
  }
}

if (survived) {
  console.error(
    `JANUS v0.3.9 mutation regression: FAIL ` +
    `(${survived}/${mutations.length} mutations survived)`
  );
  process.exit(1);
}

console.log(
  `JANUS v0.3.9 mutation regression: PASS ` +
  `(${mutations.length}/${mutations.length} mutations killed)`
);
