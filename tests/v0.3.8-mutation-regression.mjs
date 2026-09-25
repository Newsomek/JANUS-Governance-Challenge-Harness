import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const sourceDoc = path.join(repo,'docs','JANUS_Orientation_Edition_2026_EN.docx');
const behavioral = path.join(repo,'tests','v0.3.8-regression.mjs');
const docAudit = path.join(repo,'tests','v0.3.8-doc-audit.mjs');

const baseFiles = [
  'app.js','index.html','README.md','CHANGELOG.md','VERSION.txt',
  'docs/EXPECTED_CONTRACT_HASHES.json',
  'tests/V0_3_2_RELEASE_GATE.md','tests/V0_3_3_RELEASE_GATE.md','tests/V0_3_4_RELEASE_GATE.md',
  'tests/V0_3_5_RELEASE_GATE.md','tests/V0_3_6_RELEASE_GATE.md','tests/V0_3_7_RELEASE_GATE.md','tests/V0_3_8_RELEASE_GATE.md',
  'tests/V0_3_5_AUTOMATED_REGRESSION_RESULT.txt',
  'testing/claude/v0.3.5/V0_3_5_FINAL_INDEPENDENT_ADVERSARIAL_REGRESSION.md',
  'testing/claude/v0.3.5/V0_3_5_FINAL_FINDINGS_LOG.md',
  'testing/claude/v0.3.6/JANUS_v0.3.6_Targeted_F01-F09_Closure_Report.md',
  'testing/claude/v0.3.6/JANUS_v0.3.6_targeted_closure_raw_evidence.txt',
  'testing/claude/v0.3.7/JANUS_v0.3.7_Targeted_Residual_F04-F05_Closure_Report.md',
  'testing/claude/v0.3.7/JANUS_v0.3.7_targeted_residual_closure_raw_evidence.txt'
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
    name:'blank-rendering fillers deleted instead of spaced',
    file:'app.js',
    apply:s=>s.replace('.replace(/[\\u2800\\u3164\\u115F\\u1160\\uFFA0]/gu, " ")','.replace(/[\\u2800\\u3164\\u115F\\u1160\\uFFA0]/gu, "")'),
    suite:'behavior'
  },
  {
    name:'U+007F stripping removed',
    file:'app.js',
    apply:s=>s.replace('\\u200B\\u007F]/gu, "")','\\u200B]/gu, "")'),
    suite:'behavior'
  },
  {
    name:'whitespace collapse removed',
    file:'app.js',
    apply:s=>s.replace('.replace(/[\\s\\u00A0]+/gu, " ")',''),
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
    apply:s=>s.replace(
      'async function exportEvidence() {\n  if (!lastRun || runInFlight || replayInFlight || exportInFlight) return;',
      'async function exportEvidence() {\n  if (!lastRun) return;'
    ),
    suite:'behavior'
  },
  {
    name:'stored record validator bypassed',
    file:'app.js',
    apply:s=>s.replace(/function validateStoredRunRecord\(record\) \{[\s\S]*?\n\}/,'function validateStoredRunRecord(record) { return null; }'),
    suite:'behavior'
  },
  {
    name:'divergence failed-check list removes stored_core_match',
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
    name:'source hash mismatch accepted at Run',
    file:'app.js',
    apply:s=>s.replace('if (!sourceObservation.hash_match) throw new Error("Observed JANUS source-document SHA-256 does not match the published expected hash.");','if (!sourceObservation.hash_match) { /* accepted */ }'),
    suite:'behavior'
  },
  {
    name:'bound commit mismatch downgraded to unavailable',
    file:'app.js',
    apply:s=>s.replace('if (/differs from the build manifest hash/.test(error.message)) throw error;','if (/differs from the build manifest hash/.test(error.message)) boundCommitNote = "Bound commit corroboration unavailable: mismatch";'),
    suite:'behavior'
  },
  {
    name:'replay record_integrity_match forced true',
    file:'app.js',
    apply:s=>s.replace('const recordIntegrityMatch = storedSnapshotHash === snapshot.record_snapshot_sha256;','const recordIntegrityMatch = true;'),
    suite:'behavior'
  },
  {
    name:'export stored_record_snapshot_integrity forced true',
    file:'app.js',
    apply:s=>s.replace('stored_record_snapshot_integrity: storedSnapshotHash === snapshot.record_snapshot_sha256','stored_record_snapshot_integrity: true'),
    suite:'behavior'
  },
  {
    name:'scenario selection invalidation removed',
    file:'app.js',
    apply:s=>s.replace('invalidateRun(hadEvidence ? "Scenario changed. Previous result, replay, and export state were invalidated." : "", hadEvidence);',''),
    suite:'behavior'
  },
  {
    name:'Replay post-derive token check removed',
    file:'app.js',
    apply:s=>s.replace('  if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;\n  replayRecord.textContent = JSON.stringify(lastReplay, null, 2);','  replayRecord.textContent = JSON.stringify(lastReplay, null, 2);'),
    suite:'behavior'
  },
  {
    name:'Export event_log check forced true',
    file:'app.js',
    apply:s=>s.replace('event_log: JSON.stringify(expectedLog) === JSON.stringify(snapshot.event_log)','event_log: true'),
    suite:'behavior'
  },
  {
    name:'late Export generation guard removed',
    file:'app.js',
    apply:s=>s.replace('    // Re-check generation immediately before the synchronous download path.\n    // Scenario/prediction changes or Reset during any awaited hashing above invalidate this export.\n    if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;\n\n    const exportedAt = new Date().toISOString();','    const exportedAt = new Date().toISOString();'),
    suite:'behavior'
  },
  {
    name:'S05 disposition changed to ESCALATE',
    file:'app.js',
    apply:s=>{
      const start=s.indexOf('id: "conflicting-authorities"');
      if(start<0) return s;
      const i=s.indexOf('disposition: "INSUFFICIENT_SPECIFICATION"',start);
      if(i<0) return s;
      return s.slice(0,i)+s.slice(i).replace('disposition: "INSUFFICIENT_SPECIFICATION"','disposition: "ESCALATE"');
    },
    suite:'behavior'
  },
  {
    name:'expected contract hash altered',
    file:'docs/EXPECTED_CONTRACT_HASHES.json',
    apply:s=>s.replace('52a18511594cedbfeceba660b5cb32f293206d93e8b8ee98d6f90c4a3f1eb9a3','02a18511594cedbfeceba660b5cb32f293206d93e8b8ee98d6f90c4a3f1eb9a3'),
    suite:'behavior'
  },
  {
    name:'expected source SHA altered in app',
    file:'app.js',
    apply:s=>s.replace('21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4','01766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4'),
    suite:'behavior'
  },
  {
    name:'README DevTools disclosure removed',
    file:'README.md',
    apply:s=>s.replace(', and it cannot protect against a user who controls the page/DevTools and coordinates edits with recomputed client-side hashes before or after export',''),
    suite:'docs'
  },
  {
    name:'README digital-signature limitation inverted',
    file:'README.md',
    apply:s=>s.replace('PASS is not a digital signature or proof of authenticity','PASS is a digital signature and proof of authenticity'),
    suite:'docs'
  },
  {
    name:'UI digital-signature limitation removed',
    file:'index.html',
    apply:s=>s.replace('it is not a digital signature or proof against a user who controls DevTools/console state and can recompute client-side hashes','it passed integrity checks'),
    suite:'docs'
  },
  {
    name:'README premature Version 1.0 readiness claim added',
    file:'README.md',
    apply:s=>s.replace('## v0.3.8 bounded F05 oracle-hardening candidate','## v0.3.8 bounded F05 oracle-hardening candidate\n\nVersion 1.0 ready and approved.'),
    suite:'docs'
  },
  {
    name:'README independent closure claim added',
    file:'README.md',
    apply:s=>s.replace('Independent closure is **not** claimed','Independent closure is confirmed'),
    suite:'docs'
  },
  {
    name:'v0.3.6 superseded pointer regressed away from v0.3.7',
    file:'tests/V0_3_6_RELEASE_GATE.md',
    apply:s=>s.replace('See `V0_3_7_RELEASE_GATE.md`.','See `V0_3_6_RELEASE_GATE.md`.'),
    suite:'docs'
  },
  {
    name:'v0.3.2 V031-NEW-07 history falsely restored to closed',
    file:'CHANGELOG.md',
    apply:s=>s.replace('partially addressed V031-NEW-07 by persisting Export refusal reasons and naming failed fetch resources; independent v0.3.3 testing later confirmed full observability closure;','closes V031-NEW-07 by persisting Export refusal reasons and naming failed fetch resources;'),
    suite:'docs'
  },
  {
    name:'v0.3.4 superseded status removed',
    file:'CHANGELOG.md',
    apply:s=>s.replace('Historical status: v0.3.4 was superseded after its deployed smoke test found residual issues; it was not promoted to Version 1.0.','Independent closure is not claimed until the deployed v0.3.4 smoke gate and zero-open-finding regression both pass.'),
    suite:'docs'
  },
  {
    name:'manifest coverage wording weakened',
    file:'README.md',
    apply:s=>s.replace('every tracked release file except `build-info.json` itself','selected release artifacts'),
    suite:'docs'
  },
  {
    name:'current release gate points to retired v0.3.5 suite',
    file:'tests/V0_3_8_RELEASE_GATE.md',
    apply:s=>s.replace('v0.3.8-regression.mjs','v0.3.5-regression.mjs'),
    suite:'docs'
  },
  {
    name:'v0.3.5 gate no longer superseded',
    file:'tests/V0_3_5_RELEASE_GATE.md',
    apply:s=>s.replace(/^# SUPERSEDED[^\n]*\n\n[\s\S]*?\n\n(?=# JANUS)/,''),
    suite:'docs'
  },
  {
    name:'Export event_log equivalent bypass OR true',
    file:'app.js',
    apply:s=>s.replace(
      'event_log: JSON.stringify(expectedLog) === JSON.stringify(snapshot.event_log)',
      'event_log: JSON.stringify(expectedLog) === JSON.stringify(snapshot.event_log) || true'
    ),
    suite:'behavior'
  },
  {
    name:'README tamper-proof heading claim added',
    file:'README.md',
    apply:s=>'Tamper-proof evidence export.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README provides tamper-proof evidence claim added',
    file:'README.md',
    apply:s=>'The harness provides tamper-proof evidence.\n\n'+s,
    suite:'docs'
  },
  {
    name:'UI tamper-proof claim added',
    file:'index.html',
    apply:s=>s.replace('<body>','<body>\n<p>Tamper-proof evidence.</p>'),
    suite:'docs'
  },
  {
    name:'README ready-for-Version-1 claim added',
    file:'README.md',
    apply:s=>'This release is ready for Version 1.0.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README Version-1-approved claim added',
    file:'README.md',
    apply:s=>'Version 1.0 approved.\n\n'+s,
    suite:'docs'
  },
  {
    name:'UI Version-1-validated claim added',
    file:'index.html',
    apply:s=>s.replace('<body>','<body>\n<p>Version 1.0 validated.</p>'),
    suite:'docs'
  },
  {
    name:'VERSION Version-1-approved claim added',
    file:'VERSION.txt',
    apply:s=>s+'\nVersion 1.0 approved.\n',
    suite:'docs'
  },
  {
    name:'README independent-closure-confirmed claim added',
    file:'README.md',
    apply:s=>'Independent closure confirmed.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README independently-closed findings claim added',
    file:'README.md',
    apply:s=>'V035-F01 through V035-F09 were independently closed.\n\n'+s,
    suite:'docs'
  },
  {
    name:'CHANGELOG independent-closure-confirmed claim added',
    file:'CHANGELOG.md',
    apply:s=>s.replace(
      '## v0.3.8',
      '## v0.3.8\nIndependent closure confirmed.'
    ),
    suite:'docs'
  },
  {
    name:'README unrelated-negation tamper-proof bypass',
    file:'README.md',
    apply:s=>'Not signed, but tamper-proof evidence export.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README tamperproof no-separator bypass',
    file:'README.md',
    apply:s=>'Tamperproof evidence export.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README Unicode nonbreaking-hyphen tamper-proof bypass',
    file:'README.md',
    apply:s=>'Tamper\u2011proof evidence export.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README approved-as Version 1.0 bypass',
    file:'README.md',
    apply:s=>'Approved as Version 1.0.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README promoted-to Version 1.0 bypass',
    file:'README.md',
    apply:s=>'Promoted to Version 1.0.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README v1.0 approved bypass',
    file:'README.md',
    apply:s=>'v1.0 approved.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README Version 1.0 colon approved bypass',
    file:'README.md',
    apply:s=>'Version 1.0: approved.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README all-nine independently-closed bypass',
    file:'README.md',
    apply:s=>'All nine V035 findings were independently closed.\n\n'+s,
    suite:'docs'
  },
  {
    name:'README reversed independent-closure bypass',
    file:'README.md',
    apply:s=>'Closure was independently confirmed.\n\n'+s,
    suite:'docs'
  },
  {
    name:'UI stale current-release narrative restored',
    file:'index.html',
    apply:s=>s.replace(
      'Version 0.3.8 is a bounded F05 oracle-hardening candidate',
      'Version 0.3.6 is a bounded hardening candidate'
    ),
    suite:'docs'
  }
];

for (const mutation of mutations) {
  const target = path.join(repo,mutation.file);
  if (!fs.existsSync(target)) throw new Error(`Mutation preflight target missing: ${mutation.name} -> ${mutation.file}`);
  const before = fs.readFileSync(target,'utf8');
  const after = mutation.apply(before);
  if (after === before) throw new Error(`Mutation preflight NO-OP: ${mutation.name} -> ${mutation.file}`);
}

console.log(`JANUS v0.3.8 mutation target preflight: PASS (${mutations.length}/${mutations.length} operators active)`);
if (process.env.JANUS_MUTATION_PREFLIGHT_ONLY === '1') process.exit(0);

let survived = 0;
for (const mutation of mutations) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'janus-v036-mut-'));
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
  console.error(`JANUS v0.3.8 mutation regression: FAIL (${survived}/${mutations.length} mutations survived)`);
  process.exit(1);
}
console.log(`JANUS v0.3.8 mutation regression: PASS (${mutations.length}/${mutations.length} mutations killed)`);
