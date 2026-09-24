import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const sourceDoc = path.join(repo,'docs','JANUS_Orientation_Edition_2026_EN.docx');
const behavioral = path.join(repo,'tests','v0.3.4-regression.mjs');
const docAudit = path.join(repo,'tests','v0.3.4-doc-audit.mjs');

const baseFiles = [
  'app.js','index.html','README.md','CHANGELOG.md','VERSION.txt',
  'tests/V0_3_3_RELEASE_GATE.md','tests/V0_3_4_RELEASE_GATE.md',
  'docs/EXPECTED_CONTRACT_HASHES.json'
];

function copyBase(dst) {
  for (const rel of baseFiles) {
    const src = path.join(repo,rel);
    const out = path.join(dst,rel);
    fs.mkdirSync(path.dirname(out),{recursive:true});
    fs.copyFileSync(src,out);
  }
}

function mutateText(root, rel, fn) {
  const p = path.join(root,rel);
  const before = fs.readFileSync(p,'utf8');
  const after = fn(before);
  if (after === before) throw new Error(`Mutation did not change ${rel}`);
  fs.writeFileSync(p,after);
}

function run(script, root) {
  return spawnSync(process.execPath,[script],{
    cwd:repo,
    env:{...process.env,JANUS_TEST_ROOT:root,JANUS_SOURCE_PATH:sourceDoc},
    encoding:'utf8'
  });
}

const mutations = [
  {
    name:'stored_core_match forced true',
    file:'app.js',
    apply:s=>s.replace('const storedCoreMatch = storedCoreHash === snapshot.evidence_core_sha256;','const storedCoreMatch = true;'),
    suite:'behavior'
  },
  {
    name:'bound 404 treated as unavailable',
    file:'app.js',
    apply:s=>s.replace('if (error.message === "BOUND_COMMIT_NOT_FOUND") throw new Error("Bound code commit could not be corroborated because app.js was not found at that commit (HTTP 404).");','if (error.message === "BOUND_COMMIT_NOT_FOUND") boundCommitNote = "Bound commit corroboration unavailable: HTTP 404";'),
    suite:'behavior'
  },
  {
    name:'collection uniqueness disabled',
    file:'app.js',
    apply:s=>s.replace('if (!uniqueStrings(scenario.compatiblePredictions)) return "Scenario compatibility set contains duplicate values.";','').replace('if (!uniqueStrings(scenario.sources)) return "Scenario source list contains duplicate citations.";',''),
    suite:'behavior'
  },
  {
    name:'visible-text hardening removed',
    file:'app.js',
    apply:s=>s.replace('value.replace(/[\\s\\p{Cf}\\p{Default_Ignorable_Code_Point}\\u2800]+/gu, "").length > 0','value.replace(/[\\s\\p{Cf}]+/gu, "").length > 0'),
    suite:'behavior'
  },
  {
    name:'duplicate commitment check removed',
    file:'app.js',
    apply:s=>s.replace('if (!uniqueCommitments(scenario.commitments)) return "Scenario commitments contain duplicate entries.";',''),
    suite:'behavior'
  },
  {
    name:'Run allowed during Replay/Export',
    file:'app.js',
    apply:s=>s.replace('if (runInFlight || replayInFlight || exportInFlight) return;','if (runInFlight) return;'),
    suite:'behavior'
  },
  {
    name:'Export in-flight lock removed',
    file:'app.js',
    apply:s=>s.replace('if (!lastRun || runInFlight || replayInFlight || exportInFlight) return;\n  exportInFlight = true;','if (!lastRun) return;\n  exportInFlight = true;'),
    suite:'behavior'
  },
  {
    name:'stored record validator bypassed',
    file:'app.js',
    apply:s=>s.replace(/function validateStoredRunRecord\(record\) \{[\s\S]*?\n\}/,'function validateStoredRunRecord(record) { return null; }'),
    suite:'behavior'
  },
  {
    name:'divergence failed-check list removed',
    file:'app.js',
    apply:s=>s.replace('["disposition_match","contract_match","source_match","code_match","record_integrity_match","stored_core_match","authored_state_match"]','["disposition_match","contract_match","source_match","code_match","record_integrity_match","authored_state_match"]'),
    suite:'behavior'
  },
  {
    name:'unsafe scenario innerHTML sink restored',
    file:'app.js',
    apply:s=>s.replace(/scenarioSummary\.replaceChildren\(\);\s*const scenarioTitle = document\.createElement\("strong"\);\s*scenarioTitle\.textContent = scenario\.name;\s*scenarioSummary\.append\(scenarioTitle, document\.createTextNode\(scenario\.summary\)\);/,'scenarioSummary.innerHTML = `<strong>${scenario.name}</strong>${scenario.summary}`;'),
    suite:'behavior'
  },
  {
    name:'integrity disclosure weakened',
    file:'README.md',
    apply:s=>s.replace('It is **not** proof against a user with browser console/devtools access','It is tamper-proof after export'),
    suite:'docs'
  },
  {
    name:'release gate points to retired v0.3.2 suite',
    file:'tests/V0_3_4_RELEASE_GATE.md',
    apply:s=>s.replace('1. `node tests/v0.3.4-regression.mjs`','1. `node tests/v0.3.2-regression.mjs`'),
    suite:'docs'
  }
];

let survived = 0;
for (const mutation of mutations) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'janus-v034-mut-'));
  try {
    copyBase(tmp);
    mutateText(tmp,mutation.file,mutation.apply);
    const result = run(mutation.suite === 'docs' ? docAudit : behavioral,tmp);
    if (result.status === 0) {
      survived += 1;
      console.error(`SURVIVED: ${mutation.name}`);
      console.error(result.stdout);
      console.error(result.stderr);
    } else {
      console.log(`KILLED: ${mutation.name}`);
    }
  } finally {
    fs.rmSync(tmp,{recursive:true,force:true});
  }
}

if (survived) {
  console.error(`JANUS v0.3.4 mutation regression: FAIL (${survived}/${mutations.length} mutations survived)`);
  process.exit(1);
}
console.log(`JANUS v0.3.4 mutation regression: PASS (${mutations.length}/${mutations.length} mutations killed)`);
