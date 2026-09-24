import fs from 'fs';
import path from 'path';
import vm from 'vm';
import crypto from 'crypto';
import {fileURLToPath} from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = process.env.JANUS_TEST_ROOT ? path.resolve(process.env.JANUS_TEST_ROOT) : path.resolve(here, '..');
const appPath = path.join(repo, 'app.js');
const sourcePath = process.env.JANUS_SOURCE_PATH ? path.resolve(process.env.JANUS_SOURCE_PATH) : path.join(repo, 'docs', 'JANUS_Orientation_Edition_2026_EN.docx');
const fallbackSourcePath = '/mnt/data/JANUS_Orientation_Edition_2026_EN.docx';

const app = fs.readFileSync(appPath);
const source = fs.readFileSync(fs.existsSync(sourcePath) ? sourcePath : fallbackSourcePath);
const sha = (x) => crypto.createHash('sha256').update(x).digest('hex');
const fakeCommit = 'a'.repeat(40);
const fakeHead = 'b'.repeat(40);
const build = {
  version: '0.3.4',
  build_id: 'janus-governance-challenge-harness-v0.3.4',
  code_commit: fakeCommit,
  files: {'app.js': sha(app)}
};

let unsafeHtmlAssignments = 0;
class MockElement {
  constructor(id = '') {
    this.id = id;
    this.value = '';
    this.textContent = '';
    this._innerHTML = '';
    this.hidden = false;
    this.disabled = false;
    this.className = '';
    this.children = [];
    this.href = '';
    this.download = '';
  }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(value) { this._innerHTML = String(value); if (this._innerHTML.includes('<')) unsafeHtmlAssignments += 1; }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.children.push(item); return item; }
  replaceChildren(...items) { this.children = []; if (items.length) this.children.push(...items); }
  remove() {}
  click() { this._clicked = true; }
  addEventListener(type, fn) { this[`on${type}`] = fn; }
  dispatchEvent(event) { this[`on${event.type}`]?.(event); }
}

const ids = [
  'scenarioSelect','predictionSelect','scenarioSummary','perturbation','runBtn','replayBtn','exportBtn','resetBtn',
  'staleNotice','resultEmpty','resultArea','disposition','matchBadge','changed','valid','invalid','execute','assertions',
  'rationale','sources','openQuestion','evidenceRequired','compatibilityInfo','eventLog','replayRecord','provenanceInfo'
];
const elements = new Map(ids.map((id) => [id, new MockElement(id)]));
elements.get('scenarioSelect').value = 'condition-change';

const downloads = [];
const alerts = [];
const URLImpl = globalThis.URL;
class TestURL extends URLImpl {
  static createObjectURL(blob) { downloads.push(blob); return 'blob:janus-test'; }
  static revokeObjectURL() {}
}

const context = {
  console,
  TextEncoder,
  TextDecoder,
  Blob,
  crypto: crypto.webcrypto,
  URL: TestURL,
  window: {location: {href: 'https://example.test/'}, alert: (m) => alerts.push(m)},
  alert: (m) => alerts.push(m),
  document: {
    getElementById: (id) => elements.get(id) || new MockElement(id),
    createElement: (tag) => new MockElement(tag),
    createTextNode: (text) => { const node = new MockElement('#text'); node.textContent = String(text); return node; },
    body: new MockElement('body')
  },
  Response,
  Request,
  Headers,
  setTimeout,
  clearTimeout,
  fetch: async (url) => {
    url = String(url);
    if (url.endsWith('JANUS_Orientation_Edition_2026_EN.docx')) return new Response(source, {status: 200});
    if (url.endsWith('/build-info.json')) return new Response(JSON.stringify(build), {status: 200, headers: {'content-type': 'application/json'}});
    if (url.endsWith('/app.js')) return new Response(app, {status: 200});
    if (url.includes(`raw.githubusercontent.com/Newsomek/JANUS-Governance-Challenge-Harness/${fakeCommit}/app.js`)) return new Response(app, {status: 200});
    if (url.includes('/commits/main')) return new Response(JSON.stringify({sha: fakeHead, parents: [{sha: 'c'.repeat(40)}]}), {status: 200});
    if (url.includes(`raw.githubusercontent.com/Newsomek/JANUS-Governance-Challenge-Harness/${fakeHead}/app.js`)) return new Response(app, {status: 200});
    throw new Error(`Unexpected URL ${url}`);
  }
};
context.globalThis = context;
vm.createContext(context);
const expose = `\n;globalThis.__janus={scenarios,labels,VALID_PREDICTIONS,VALID_SUPPORT_STATUSES,selectedScenario,validPrediction,validateScenarioContract,validateStoredRunRecord,predictionComparison,evidenceCoreHash,recordSnapshotHash,runChallenge,replayLastRun,exportEvidence,resetHarness,deriveReplayRecord,observeHarnessProvenance,observeSourceDocument,get lastRun(){return lastRun},get lastReplay(){return lastReplay},set lastRun(v){lastRun=v},set lastReplay(v){lastReplay=v},get runInFlight(){return runInFlight},get replayInFlight(){return replayInFlight},get exportInFlight(){return exportInFlight}};`;
vm.runInContext(app.toString() + expose, context, {filename: 'app.js'});
const j = context.__janus;
const clone = (x) => JSON.parse(JSON.stringify(x));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(j.scenarios.length === 6, 'Expected six scenarios.');
for (const scenario of j.scenarios) assert(j.validateScenarioContract(scenario) === null, `Valid scenario rejected: ${scenario.id}`);

let malformed = clone(j.scenarios[0]);
malformed.disposition = 'FOO';
assert(j.validateScenarioContract(malformed), 'Invalid disposition was not rejected.');
malformed = clone(j.scenarios[0]);
malformed.commitments[0].status = 'TOTALLY PROVEN';
assert(j.validateScenarioContract(malformed), 'Invalid support status was not rejected.');
malformed = clone(j.scenarios[0]);
malformed.commitments = [];
assert(j.validateScenarioContract(malformed), 'Empty commitments were not rejected.');
malformed = clone(j.scenarios[0]);
malformed.compatiblePredictions = [malformed.disposition];
assert(j.validateScenarioContract(malformed), 'Disposition in compatibility set was not rejected.');
assert(j.validateScenarioContract(null), 'Null scenario was not rejected.');

for (const scenario of j.scenarios) {
  for (const prediction of Object.keys(j.labels)) {
    const result = j.predictionComparison(scenario, prediction);
    assert(['EXACT','PARTIAL','DIFFERENT'].includes(result.code), `Unexpected comparison for ${scenario.id}/${prediction}.`);
  }
}

const canonicalPredictions = [
  'BLOCK_REAUTHORIZE','BLOCK','BLOCK_REAUTHORIZE','BLOCK_REAUTHORIZE','INSUFFICIENT_SPECIFICATION','INSUFFICIENT_SPECIFICATION'
];
for (let i = 0; i < j.scenarios.length; i += 1) {
  j.resetHarness();
  elements.get('scenarioSelect').value = j.scenarios[i].id;
  elements.get('predictionSelect').value = canonicalPredictions[i];
  await j.runChallenge();
  assert(j.lastRun, `Run failed for ${j.scenarios[i].id}.`);
  await j.replayLastRun();
  assert(j.lastReplay?.replay_match === true, `Replay diverged for ${j.scenarios[i].id}.`);
  const before = downloads.length;
  await j.exportEvidence();
  assert(downloads.length === before + 1, `Export failed for ${j.scenarios[i].id}.`);
  const exported = JSON.parse(await downloads.at(-1).text());
  assert(exported.integrity_status === 'PASS', `Export integrity failed for ${j.scenarios[i].id}.`);
  assert(exported.replay?.replay_match === true, `Exported replay not consistent for ${j.scenarios[i].id}.`);
}


// Fresh-page selection changes must not claim prior evidence was invalidated.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[1].id;
elements.get('scenarioSelect').dispatchEvent({type: 'change'});
assert(elements.get('staleNotice').hidden === true, 'Fresh-page scenario change showed a false invalidation notice.');

// A transient source refusal must leave Run retryable for a still-valid selection.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
const normalFetch = context.fetch;
context.fetch = async (url) => {
  if (String(url).endsWith('JANUS_Orientation_Edition_2026_EN.docx')) throw new Error('simulated offline');
  return normalFetch(url);
};
await j.runChallenge();
assert(!j.lastRun, 'Transient source failure unexpectedly created evidence.');
assert(elements.get('runBtn').disabled === false, 'Run stayed disabled after a transient refusal.');
assert(elements.get('staleNotice').textContent.includes('Source document fetch failed'), 'Transient refusal did not name the source resource.');
context.fetch = normalFetch;

// Build version / ID mismatches must be refused.
const goodFetch = context.fetch;
for (const badBuild of [
  {...build, version: '9.9.9'},
  {...build, build_id: 'wrong-build'}
]) {
  j.resetHarness();
  elements.get('scenarioSelect').value = j.scenarios[0].id;
  elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
  context.fetch = async (url) => {
    if (String(url).endsWith('/build-info.json')) return new Response(JSON.stringify(badBuild), {status: 200, headers: {'content-type':'application/json'}});
    return goodFetch(url);
  };
  await j.runChallenge();
  assert(!j.lastRun, 'Mismatched build manifest was accepted.');
  assert(elements.get('staleNotice').textContent.includes('Build provenance'), 'Build mismatch refusal was not visible.');
}
context.fetch = goodFetch;

// Establish a fresh clean run after refusal tests.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[1].id;
elements.get('predictionSelect').value = 'BLOCK';
await j.runChallenge();
assert(j.lastRun, 'Fresh run after refusal tests failed.');
await j.replayLastRun();
assert(j.lastReplay?.replay_match === true, 'Fresh replay after refusal tests failed.');

// A forged mutable replay record must not be copied into a PASS export.
j.lastReplay.result = 'FORGED RESULT';
const beforeReplayForgery = downloads.length;
await j.exportEvidence();
assert(downloads.length === beforeReplayForgery + 1, 'Clean evidence should remain exportable after mutable replay-display tamper.');
const regenerated = JSON.parse(await downloads.at(-1).text());
assert(regenerated.replay.result !== 'FORGED RESULT', 'Forged replay content leaked into export.');
assert(regenerated.replay.replay_match === true, 'Freshly derived replay should be consistent.');

// Structural tampering must fail closed and visibly.
j.lastRun.harness_provenance = null;
const beforeStructural = downloads.length;
await j.exportEvidence();
assert(downloads.length === beforeStructural, 'Structural tamper unexpectedly exported evidence.');
assert(elements.get('staleNotice').textContent.startsWith('Export refused:'), 'Structural tamper refusal was not visible.');
await j.replayLastRun();
assert(j.lastReplay?.replay_match === false, 'Structural tamper replay did not fail closed.');
assert(elements.get('staleNotice').textContent.startsWith('Replay refused:'), 'Structural tamper replay refusal was not visible.');



// Behavioural guard: authored scenario rendering must not use an executable HTML sink.
{
  const originalName = j.scenarios[0].name;
  const originalSummary = j.scenarios[0].summary;
  const beforeUnsafe = unsafeHtmlAssignments;
  j.scenarios[0].name = '<img src=x onerror=globalThis.__pwned=1>';
  j.scenarios[0].summary = '<script>globalThis.__pwned=1</script>';
  elements.get('scenarioSelect').value = j.scenarios[0].id;
  elements.get('scenarioSelect').dispatchEvent({type:'change'});
  assert(unsafeHtmlAssignments === beforeUnsafe, 'Scenario rendering used an HTML sink.');
  assert(context.__pwned === undefined, 'Scenario rendering executed injected content.');
  j.scenarios[0].name = originalName;
  j.scenarios[0].summary = originalSummary;
  elements.get('scenarioSelect').dispatchEvent({type:'change'});
}

// Behavioural guard: stored-core tampering with snapshot hash recomputed must diverge and name stored_core_match.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
await j.runChallenge();
assert(j.lastRun, 'Stored-core tamper setup failed.');
j.lastRun.scenario_name += ' tampered';
j.lastRun.record_snapshot_sha256 = await j.recordSnapshotHash(j.lastRun);
await j.replayLastRun();
assert(j.lastReplay?.replay_match === false, 'Stored-core tamper falsely replayed CONSISTENT.');
assert(j.lastReplay?.stored_core_match === false, 'Stored-core tamper did not fail stored_core_match.');
assert(elements.get('staleNotice').textContent.includes('stored_core_match'), 'Replay divergence notice did not name stored_core_match.');

// Behavioural guard: nonexistent bound commit 404 must refuse rather than become UNAVAILABLE/PASS.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
const fetchBefore404 = context.fetch;
context.fetch = async (url) => {
  url = String(url);
  if (url.includes(`raw.githubusercontent.com/Newsomek/JANUS-Governance-Challenge-Harness/${fakeCommit}/app.js`)) return new Response('not found', {status:404});
  return fetchBefore404(url);
};
await j.runChallenge();
assert(!j.lastRun, 'Nonexistent bound commit produced a run record.');
assert(elements.get('staleNotice').textContent.includes('app.js was not found at that commit (HTTP 404)'), 'Bound 404 refusal message missing.');
context.fetch = fetchBefore404;

// Behavioural guard: rapid duplicate Export calls must create exactly one artifact.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
await j.runChallenge();
await j.replayLastRun();
const beforeDoubleExport = downloads.length;
await Promise.all([j.exportEvidence(), j.exportEvidence(), j.exportEvidence()]);
assert(downloads.length === beforeDoubleExport + 1, 'Rapid Export calls produced duplicate artifacts.');

// v0.3.4: invisible/default-ignorable text must be rejected.
for (const ch of ['\u3164','\u2800','\u034F','\uFE0F','\u180B','\u115F','\u1160','\uFFA0']) {
  const sample = clone(j.scenarios[0]);
  sample.name = ch;
  assert(j.validateScenarioContract(sample), `Invisible text ${JSON.stringify(ch)} was accepted.`);
}


// Behavioural guard: duplicate compatibility values and duplicate sources must be rejected.
{
  let sample = clone(j.scenarios[0]);
  sample.compatiblePredictions.push(sample.compatiblePredictions[0]);
  assert(j.validateScenarioContract(sample)?.includes('duplicate'), 'Duplicate compatibility values were accepted.');
  sample = clone(j.scenarios[0]);
  sample.sources.push(sample.sources[0]);
  assert(j.validateScenarioContract(sample)?.includes('duplicate'), 'Duplicate sources were accepted.');
}

// v0.3.4: duplicate commitments must be rejected.
{
  const sample = clone(j.scenarios[0]);
  sample.commitments.push(clone(sample.commitments[0]));
  assert(j.validateScenarioContract(sample)?.includes('duplicate'), 'Duplicate commitments were accepted.');
}

// v0.3.4: stored-record structural corruption must fail with stable, non-engine messages.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
await j.runChallenge();
assert(j.lastRun, 'Structural-message setup run failed.');
j.lastRun.harness_provenance = null;
await j.replayLastRun();
assert(elements.get('staleNotice').textContent.includes('Stored run record is structurally invalid (harness_provenance)'), 'Structural Replay refusal was not stable/specific.');
assert(!elements.get('staleNotice').textContent.includes('Cannot read properties'), 'Raw TypeError leaked in Replay refusal.');
const beforeStructuralExport = downloads.length;
await j.exportEvidence();
assert(downloads.length === beforeStructuralExport, 'Structurally invalid record exported.');
assert(elements.get('staleNotice').textContent.includes('Stored run record is structurally invalid (harness_provenance)'), 'Structural Export refusal was not stable/specific.');

// v0.3.4: unknown stored scenario_id must blame the stored record, not the authored contract.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
await j.runChallenge();
j.lastRun.scenario_id = 'not-a-scenario';
await j.replayLastRun();
assert(elements.get('staleNotice').textContent.includes('Stored run record is structurally invalid (scenario_id does not identify a known scenario)'), 'Unknown stored scenario_id message is misleading.');

// v0.3.4: Run must remain locked out while Replay is in flight.
j.resetHarness();
elements.get('scenarioSelect').value = j.scenarios[0].id;
elements.get('predictionSelect').value = 'BLOCK_REAUTHORIZE';
await j.runChallenge();
const raceBaselineGeneratedAt = j.lastRun.generated_at;
const raceFetch = context.fetch;
let delayedReplaySource = true;
context.fetch = async (url) => {
  if (delayedReplaySource && String(url).endsWith('JANUS_Orientation_Edition_2026_EN.docx')) {
    delayedReplaySource = false;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  return raceFetch(url);
};
const replayPromise = j.replayLastRun();
await new Promise((resolve) => setTimeout(resolve, 5));
assert(j.replayInFlight === true, 'Replay did not enter in-flight state.');
assert(elements.get('runBtn').disabled === true, 'Run was enabled during Replay.');
await j.runChallenge();
assert(j.lastRun.generated_at === raceBaselineGeneratedAt, 'Run replaced evidence while Replay was in flight.');
await replayPromise;
context.fetch = raceFetch;

// v0.3.4: Run must remain locked out while Export is in flight, and no export may be silently superseded.
let delayedExportSource = true;
context.fetch = async (url) => {
  if (delayedExportSource && String(url).endsWith('JANUS_Orientation_Edition_2026_EN.docx')) {
    delayedExportSource = false;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  return raceFetch(url);
};
const beforeRaceExport = downloads.length;
const exportPromise = j.exportEvidence();
await new Promise((resolve) => setTimeout(resolve, 5));
assert(j.exportInFlight === true, 'Export did not enter in-flight state.');
assert(elements.get('runBtn').disabled === true, 'Run was enabled during Export.');
await j.runChallenge();
await exportPromise;
assert(downloads.length === beforeRaceExport + 1, 'In-flight Export was dropped or duplicated.');
context.fetch = raceFetch;

console.log('JANUS v0.3.4 automated regression: PASS');
console.log(`Canonical exports: ${downloads.length}; refusal alerts: ${alerts.length}`);
