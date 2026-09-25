"use strict";

const HARNESS_VERSION = "0.3.8";
const BUILD_ID = "janus-governance-challenge-harness-v0.3.8";
const BUILD_INFO_URL = "build-info.json";
const REPOSITORY = "https://github.com/Newsomek/JANUS-Governance-Challenge-Harness";
const GITHUB_HEAD_API = "https://api.github.com/repos/Newsomek/JANUS-Governance-Challenge-Harness/commits/main";
const SOURCE_DOCUMENT = Object.freeze({
  title: "JANUS Orientation Edition 2026",
  path: "docs/JANUS_Orientation_Edition_2026_EN.docx",
  url: "https://newsomek.github.io/JANUS-Governance-Challenge-Harness/docs/JANUS_Orientation_Edition_2026_EN.docx",
  expected_sha256: "21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4"
});

const labels = Object.freeze({
  CONTINUE: "CONTINUE",
  BLOCK: "BLOCK",
  BLOCK_REAUTHORIZE: "BLOCK + REAUTHORIZE",
  ESCALATE: "ESCALATE",
  ROLLBACK_COMPENSATE: "ROLLBACK / COMPENSATE",
  INSUFFICIENT_SPECIFICATION: "INSUFFICIENT SPECIFICATION"
});
const VALID_PREDICTIONS = new Set(Object.keys(labels));
const VALID_SUPPORT_STATUSES = new Set(["DIRECTLY SUPPORTED", "REASONABLE INFERENCE", "EXTENDED / BY ANALOGY", "OPEN"]);

const scenarios = [
  {
    id: "condition-change",
    name: "01 · Authorization condition changes after approval",
    summary: "Evidence E1 supports Decision D1. Authorization A1 is granted under operating condition C1. Before execution, C1 changes to C2 while the evidence and decision remain otherwise intact.",
    perturbation: "A material authorization condition changes from C1 to C2 after authorization but before execution.",
    disposition: "BLOCK_REAUTHORIZE",
    compatiblePredictions: ["BLOCK", "ESCALATE"],
    compatibilityReason: "BLOCK captures the fail-closed constraint; ESCALATE is compatible because the scenario requires reevaluation by an applicable governance authority. Neither supplies the missing JANUS reauthorization mechanism.",
    changed: "A condition attached to the previously granted authorization is no longer the condition under which A1 was issued.",
    valid: "E1 and the reasoning behind D1 may remain valid unless the changed condition also affects their epistemic basis.",
    invalid: "Current authorization to enter execution cannot be inferred solely from the existence of the earlier authorization.",
    execute: "Do not proceed on A1 alone. The changed authorization condition requires reevaluation under the applicable governance process.",
    rationale: "JANUS separates decision, authorization, and execution. The Orientation Edition describes authorization as a separate fact with its own owner, history, and conditions, and describes fail-closed behavior when a required condition is not met. The document supports blocking silent execution; the harness uses 'reauthorize' as its own disposition shorthand for obtaining a new valid authorization state if execution is still desired.",
    openQuestion: "What exact event invalidates A1, and what JANUS mechanism determines whether a new authorization fact is required?",
    evidenceRequired: "A reconstructable record of E1, D1, A1, the C1→C2 change, the authority owner, the decision to stop or continue, and any subsequent authorization event.",
    commitments: [
      {status: "DIRECTLY SUPPORTED", text: "Decision validity and authorization validity remain separate."},
      {status: "DIRECTLY SUPPORTED", text: "A still-reasonable decision does not automatically preserve execution permission."},
      {status: "OPEN", text: "The Orientation Edition does not disclose a specific reauthorization protocol."}
    ],
    sources: [
      "§01 Protective Principle — decision, authorization, and execution are separate concepts.",
      "§19 Operational Control — authorization is a separate fact with its own owner, history, and conditions.",
      "§32 Security by Design — when a condition is not met, prefer no transition over a silent bypass."
    ]
  },
  {
    id: "evidence-change",
    name: "02 · Evidence changes after authorization",
    summary: "Evidence E1 supports Decision D1 and Authorization A1 exists. Before execution, new evidence E2 materially contradicts E1. No explicit revocation of A1 has yet occurred.",
    perturbation: "The epistemic basis changes while the recorded authorization remains historically present.",
    disposition: "BLOCK",
    compatiblePredictions: ["BLOCK_REAUTHORIZE", "ESCALATE"],
    compatibilityReason: "BLOCK + REAUTHORIZE and ESCALATE are compatible because both preserve the core refusal to execute on the stale evidentiary basis while leaving the authorization dependency mechanism unresolved.",
    changed: "New evidence materially weakens or contradicts the basis on which the existing decision was formed.",
    valid: "The historical record that A1 was granted remains valid as history. It does not disappear merely because new evidence arrives.",
    invalid: "The assumption that historical authorization can be executed without reevaluating the changed epistemic basis.",
    execute: "Do not proceed merely because A1 remains in history. The contradiction must remain explicit and the decision basis must be reevaluated before execution can safely be derived from the prior chain.",
    rationale: "JANUS distinguishes evidence, decision, authorization, and execution, and treats contradiction as information that must remain visible. Blocking execution on a materially changed evidentiary basis is a reasonable orientation-level inference. Whether authorization is automatically suspended, separately revoked, or later reissued is not stated.",
    openQuestion: "Is authorization formally dependent on the evidence behind the decision it authorizes, and if so, how is that dependency represented?",
    evidenceRequired: "E1, E2, the contradiction record, D1, A1, provenance for both evidence sets, and the subsequent reevaluation or escalation decision.",
    commitments: [
      {status: "EXTENDED / BY ANALOGY", text: "The no-forced-resolution principle for conflicting data is applied here to conflicting decision evidence."},
      {status: "REASONABLE INFERENCE", text: "Authorization history and current epistemic justification are different facts."},
      {status: "OPEN", text: "The dependency rule linking evidence invalidation to authority invalidation is not stated."}
    ],
    sources: [
      "§06 Distinctions — evidence, decision, authorization, and execution are distinct classes.",
      "§28 Conflict — data conflict should remain explicit rather than be forced into a single value.",
      "§29 Resilience and §38 Working Contract — unjustified transitions should not gain more power than their grounding supports."
    ]
  },
  {
    id: "authorization-expiry",
    name: "03 · Authorization expires before execution",
    summary: "Decision D1 is valid and Authorization A1 was valid within defined temporal or operating bounds. Execution is delayed until after those bounds expire.",
    perturbation: "Time or another explicit validity bound expires before execution begins.",
    disposition: "BLOCK_REAUTHORIZE",
    compatiblePredictions: ["BLOCK", "ESCALATE"],
    compatibilityReason: "BLOCK captures the invalid-current-authority constraint; ESCALATE is compatible as a route to an applicable authority, while the exact renewal mechanism remains unspecified.",
    changed: "The current moment or operating state is outside the stipulated validity scope under which A1 was granted.",
    valid: "A1 remains part of the historical record and can still prove that authorization existed previously.",
    invalid: "Previously authorized is not equivalent to currently authorized under the scenario's stipulated validity bound.",
    execute: "Do not proceed on expired authority. If execution is still desired, a new valid authorization state is required.",
    rationale: "The Orientation Edition does not define authorization expiry, but this scenario stipulates a validity bound. Given that stipulation, JANUS's separation of current state, historical state, authorization conditions, and fail-closed behavior supports blocking execution after the bound has lapsed. 'Reauthorize' is harness shorthand, not a JANUS term.",
    openQuestion: "How does JANUS represent authorization lifetime: explicit expiry, policy validity, state dependency, or another mechanism?",
    evidenceRequired: "The original authorization, its stipulated validity condition, the time/state transition that ended validity, and any later authorization event.",
    commitments: [
      {status: "REASONABLE INFERENCE", text: "Historical authorization can remain true as history while no longer proving present authority under a stipulated bound."},
      {status: "EXTENDED / BY ANALOGY", text: "The document's scope-of-validity language is explicit for memory and is applied here by analogy to authorization validity."},
      {status: "OPEN", text: "No authorization TTL, expiry object, or renewal mechanism is specified."}
    ],
    sources: [
      "§19 Operational Control — authorization has its own history and conditions.",
      "§27 Memory — prior states remain available when later interpretation changes; §26 names provenance and scope of validity for memory (used here only by analogy).",
      "§39 Limits — conditions can change and trust must have context; §32 supplies the fail-closed principle."
    ]
  },
  {
    id: "learning-authority",
    name: "04 · Learning attempts to expand authority",
    summary: "The system repeatedly succeeds inside Scope S1. Learning produces capability C2 that appears reliable beyond S1. No governing authority has approved a larger operational scope.",
    perturbation: "Capability expands; formally granted authority does not.",
    disposition: "BLOCK_REAUTHORIZE",
    compatiblePredictions: ["BLOCK", "CONTINUE", "ESCALATE"],
    compatibilityReason: "BLOCK is compatible for the attempted expansion; CONTINUE is compatible only for already-authorized S1 work; ESCALATE is compatible because §24 places expansion with a governance decision.",
    changed: "The system's demonstrated capability, learned behavior, or confidence has increased.",
    valid: "Historical performance and C2 may be legitimate evidence supporting a proposal for expanded authority. Existing work inside S1 may continue if separately authorized.",
    invalid: "The assumption that improved capability automatically enlarges operational permission beyond S1.",
    execute: "Continue only within the already authorized scope. Block the out-of-scope use unless a separate governance process grants additional authority.",
    rationale: "JANUS directly states that learning must not become self-promotion and that a new ability should not automatically receive a new level of authority. The headline disposition applies to the attempted expansion beyond S1, not to already authorized in-scope work.",
    openQuestion: "What evidence and governance event would JANUS require before expanded capability could receive expanded authority?",
    evidenceRequired: "Performance history inside S1, evidence supporting C2, the current authority scope, the proposal for expansion, independent verification evidence, and the governance decision.",
    commitments: [
      {status: "DIRECTLY SUPPORTED", text: "Learning can change knowledge or preference without changing authorization."},
      {status: "DIRECTLY SUPPORTED", text: "Capability expansion is not authority expansion."},
      {status: "OPEN", text: "The exact verification evidence and governance event required for expanded authority are not specified."}
    ],
    sources: [
      "§22 Learning from Experience — Learning ≠ Self-Promotion.",
      "§24 Maturity — capability development and authority development remain separate; governance decides whether change is accepted.",
      "§38 Working Contract — an improved model is not, by itself, consent to greater power."
    ]
  },
  {
    id: "conflicting-authorities",
    name: "05 · Two legitimate authorities conflict",
    summary: "Decision D1 is technically valid. Authority O1 permits D1 while another legitimate authority O2 prohibits D1 under a different applicable policy or scope. Both appear valid within their own domains.",
    perturbation: "Two apparently legitimate authority claims point to incompatible execution outcomes.",
    disposition: "INSUFFICIENT_SPECIFICATION",
    compatiblePredictions: ["BLOCK", "ESCALATE"],
    compatibilityReason: "BLOCK and ESCALATE are compatible constraints while the precedence mechanism itself remains insufficiently specified. BLOCK + REAUTHORIZE remains DIFFERENT because obtaining another authorization does not itself resolve which of the conflicting authorities governs.",
    changed: "Nothing must change over time; the conflict exists because two valid-looking authority sources apply simultaneously.",
    valid: "Both authority records may remain valid within the scopes that produced them.",
    invalid: "The assumption that the Orientation Edition supplies a universal authority-precedence rule.",
    execute: "The resolution mechanism is insufficiently specified. The orientation-level constraints do not support silently selecting O1 and executing while O2's prohibition remains unresolved; the conflict should be preserved and resolved by an applicable authority or escalation path.",
    rationale: "JANUS does not define an organizational authority lattice, policy-precedence system, or jurisdiction hierarchy. Therefore the mechanism for resolving O1 versus O2 is unspecified. Separately, its fail-closed and refusal-of-unjustified-transition principles weigh against silently executing on one side of an unresolved authority conflict. Applying §28's data-conflict language to authority conflict is explicitly marked as an analogy rather than direct support.",
    openQuestion: "How does JANUS resolve two simultaneously applicable but conflicting authority owners: precedence, jurisdiction, policy hierarchy, human escalation, or another mechanism?",
    evidenceRequired: "Both authority records, their scopes and owners, the conflicting policy conditions, any precedence rule consulted, the escalation path, and the resolution event.",
    commitments: [
      {status: "EXTENDED / BY ANALOGY", text: "The no-forced-resolution principle stated for data conflict is applied here to authority conflict."},
      {status: "REASONABLE INFERENCE", text: "Fail-closed / refusal-of-unjustified-transition principles do not support silent execution on an unresolved basis."},
      {status: "OPEN", text: "The authority-resolution hierarchy itself is not specified."}
    ],
    sources: [
      "§19 Operational Control — authorization has an owner, history, and conditions.",
      "§32 Security by Design and §38 Working Contract — prefer no transition to a silent bypass; do not convert lack of grounds into certainty.",
      "§33 Human Oversight — a human may be the policy owner or escalation point; §28 is analogous, not direct, support for preserving conflict."
    ]
  },
  {
    id: "mid-execution-revocation",
    name: "06 · Authority is revoked during execution",
    summary: "Execution X1 begins under valid Authorization A1. While the real-world action is already underway, A1 is revoked or a required authorization condition becomes false.",
    perturbation: "Authority changes after execution has already begun.",
    disposition: "INSUFFICIENT_SPECIFICATION",
    compatiblePredictions: ["BLOCK", "ESCALATE", "ROLLBACK_COMPENSATE"],
    compatibilityReason: "BLOCK, ESCALATE, and ROLLBACK / COMPENSATE are plausible constrained responses. CONTINUE remains DIFFERENT because the glossary means unqualified continuation under current authority, and this scenario stipulates that authority has disappeared; safe completion is a narrower mechanism that JANUS does not specify. BLOCK + REAUTHORIZE remains DIFFERENT because the immediate in-flight handling rule is still unspecified; a later authorization event would not by itself decide what the already-running action should do now.",
    changed: "The authority state changes while a previously authorized action is already affecting the external environment.",
    valid: "The record that X1 began under valid authorization remains part of the historical evidence.",
    invalid: "The assumption that the Orientation Edition determines one universal response for every in-flight action.",
    execute: "The Orientation Edition establishes an accountable execution boundary but does not specify whether an in-flight action must stop, safely complete, roll back, compensate, or escalate.",
    rationale: "JANUS treats execution as a distinct accountable event and requires enough trace to reconstruct authority and outcome. The Orientation Edition intentionally remains above implementation specification and does not define universal semantics for authority loss during execution. The harness therefore refuses to invent one.",
    openQuestion: "How does JANUS classify in-flight actions when authority disappears, and what determines stop, safe completion, rollback, compensation, or escalation?",
    evidenceRequired: "The authorization state at execution start, the revocation or condition-change event, action interruptibility/reversibility characteristics, the response selected, and the resulting external effect.",
    commitments: [
      {status: "DIRECTLY SUPPORTED", text: "Execution remains separately accountable from the authorization that preceded it."},
      {status: "REASONABLE INFERENCE", text: "The authority-loss event should be reconstructable as part of the audit trail even though 'revocation' is not a named JANUS event."},
      {status: "OPEN", text: "No universal in-flight authority-loss mechanism is specified at orientation level."}
    ],
    sources: [
      "§20 Execution — execution is an accountable boundary event.",
      "§31 Audit — significant stages should leave enough trace to reconstruct authority and outcome.",
      "§01 Protective Principle — the Orientation Edition is not an implementation specification."
    ]
  }
];

const scenarioSelect = document.getElementById("scenarioSelect");
const predictionSelect = document.getElementById("predictionSelect");
const scenarioSummary = document.getElementById("scenarioSummary");
const perturbation = document.getElementById("perturbation");
const runBtn = document.getElementById("runBtn");
const replayBtn = document.getElementById("replayBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");
const staleNotice = document.getElementById("staleNotice");
const resultEmpty = document.getElementById("resultEmpty");
const resultArea = document.getElementById("resultArea");
const disposition = document.getElementById("disposition");
const matchBadge = document.getElementById("matchBadge");
const changed = document.getElementById("changed");
const valid = document.getElementById("valid");
const invalid = document.getElementById("invalid");
const execute = document.getElementById("execute");
const commitments = document.getElementById("assertions");
const rationale = document.getElementById("rationale");
const sources = document.getElementById("sources");
const openQuestion = document.getElementById("openQuestion");
const evidenceRequired = document.getElementById("evidenceRequired");
const compatibilityInfo = document.getElementById("compatibilityInfo");
const eventLog = document.getElementById("eventLog");
const replayRecord = document.getElementById("replayRecord");

let lastRun = null;
let lastReplay = null;
let stateGeneration = 0;

function selectedScenario() {
  return scenarios.find((item) => item && item.id === scenarioSelect.value) || null;
}

function validPrediction(value) {
return typeof value === "string" && VALID_PREDICTIONS.has(value) && Object.hasOwn(labels, value);

}

function canonicalComparisonText(value) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/[\u2800\u3164\u115F\u1160\uFFA0]/gu, " ")
    .replace(/[\p{Cf}\p{Default_Ignorable_Code_Point}\u034F\uFE0F\u180B\u200B\u007F]/gu, "")
    .replace(/[\s\u00A0]+/gu, " ")
    .trim();
}

function hasVisibleText(value) {
  return canonicalComparisonText(value).length > 0;
}
function uniqueStrings(values) {
  if (!Array.isArray(values)) return false;
  const keys = values.map(canonicalComparisonText);
  return new Set(keys).size === keys.length;
}

function uniqueCommitments(values) {
  if (!Array.isArray(values)) return false;
  const keys = values.map((item) => item && typeof item === "object"
    ? canonicalComparisonText(String(item.status)) + "\u0000" + canonicalComparisonText(String(item.text))
    : "__INVALID__");
  return new Set(keys).size === keys.length;
}function validateScenarioSet() {
  if (!Array.isArray(scenarios) || scenarios.length < 1) return "Scenario set is missing.";
  const ids = [];
  for (const scenario of scenarios) {
    const error = validateScenarioContract(scenario);
    if (error) return error;
    ids.push(scenario.id);
  }
  if (new Set(ids).size !== ids.length) return "Scenario IDs must be unique.";
  return null;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSha256(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/i.test(value);
}

function validateStoredRunRecord(record) {
  if (!isPlainObject(record)) return "Stored run record is structurally invalid (record).";
  if (!hasVisibleText(record.scenario_id)) return "Stored run record is structurally invalid (scenario_id).";
  if (!scenarios.some((item) => item && item.id === record.scenario_id)) return "Stored run record is structurally invalid (scenario_id does not identify a known scenario).";
  if (!validPrediction(record.reviewer_prediction)) return "Stored run record is structurally invalid (reviewer_prediction).";
  if (!isPlainObject(record.harness_provenance)) return "Stored run record is structurally invalid (harness_provenance).";
  if (!isPlainObject(record.source_document)) return "Stored run record is structurally invalid (source_document).";
  if (!isSha256(record.contract_sha256)) return "Stored run record is structurally invalid (contract_sha256).";
  if (!isSha256(record.evidence_core_sha256)) return "Stored run record is structurally invalid (evidence_core_sha256).";
  if (!isSha256(record.record_snapshot_sha256)) return "Stored run record is structurally invalid (record_snapshot_sha256).";
  if (!Array.isArray(record.event_log)) return "Stored run record is structurally invalid (event_log).";
  if (!Array.isArray(record.source_commitments)) return "Stored run record is structurally invalid (source_commitments).";
  if (!Array.isArray(record.sources)) return "Stored run record is structurally invalid (sources).";
  if (!Array.isArray(record.compatible_predictions)) return "Stored run record is structurally invalid (compatible_predictions).";
  return null;
}

function normalizeStoredRunError(error) {
  if (error instanceof TypeError) return new Error("Stored run record is structurally invalid.");
  return error;
}

function populateScenarios() {
  for (const scenario of scenarios) {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  }
}

function renderScenario() {
  const scenario = selectedScenario();
  if (!scenario) {
    scenarioSummary.textContent = "Invalid scenario selection.";
    perturbation.textContent = "No perturbation available.";
    runBtn.disabled = true;
    return;
  }
  scenarioSummary.replaceChildren();
const scenarioTitle = document.createElement("strong");
scenarioTitle.textContent = scenario.name;
scenarioSummary.append(scenarioTitle, document.createTextNode(scenario.summary));
  perturbation.textContent = scenario.perturbation;
  syncActionButtons();
}

function predictionComparison(scenario, prediction) {
  if (!validPrediction(prediction)) return {code: "INVALID", label: "INVALID PREDICTION", css: "mismatch"};
  if (prediction === scenario.disposition) return {code: "EXACT", label: "EXACT MATCH", css: "match"};
  if ((scenario.compatiblePredictions || []).includes(prediction)) return {code: "PARTIAL", label: "PARTIAL / COMPATIBLE", css: "partial"};
  return {code: "DIFFERENT", label: "DIFFERENT", css: "mismatch"};
}

function renderCommitments(items) {
  commitments.innerHTML = "";
  const classMap = {
    "DIRECTLY SUPPORTED": "direct",
    "REASONABLE INFERENCE": "inference",
    "EXTENDED / BY ANALOGY": "extended",
    "OPEN": "open"
  };
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "assertion";
    const status = document.createElement("div");
    status.className = `assertion-status ${classMap[item.status] || "open"}`;
    status.textContent = item.status;
    const text = document.createElement("div");
    text.textContent = item.text;
    row.append(status, text);
    commitments.appendChild(row);
  }
}

function renderSources(items) {
  sources.innerHTML = "";
  for (const item of items) {
    const source = document.createElement("div");
    source.className = "source";
    source.textContent = item;
    sources.appendChild(source);
  }
}

function canonicalContract(scenario) {
  return JSON.stringify({
    id: scenario.id,
    disposition: scenario.disposition,
    compatiblePredictions: scenario.compatiblePredictions,
    compatibilityReason: scenario.compatibilityReason,
    summary: scenario.summary,
    perturbation: scenario.perturbation,
    changed: scenario.changed,
    valid: scenario.valid,
    invalid: scenario.invalid,
    execute: scenario.execute,
    rationale: scenario.rationale,
    openQuestion: scenario.openQuestion,
    evidenceRequired: scenario.evidenceRequired,
    commitments: scenario.commitments,
    sources: scenario.sources
  });
}

async function sha256Buffer(buffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Text(text) {
  return sha256Buffer(new TextEncoder().encode(text));
}

async function observeSourceDocument() {
  let response;
  try {
    response = await fetch(SOURCE_DOCUMENT.url, {cache: "no-store"});
  } catch (error) {
    throw new Error(`Source document fetch failed: ${error.message}`);
  }
  if (!response.ok) throw new Error(`Source document fetch failed: HTTP ${response.status}`);
  let bytes;
try {
  bytes = await response.arrayBuffer();
} catch (error) {
  throw new Error(`Source document body read failed: ${error.message}`);
}

const observed = await sha256Buffer(bytes);
  return {
    title: SOURCE_DOCUMENT.title,
    url: SOURCE_DOCUMENT.url,
    path: SOURCE_DOCUMENT.path,
    expected_sha256: SOURCE_DOCUMENT.expected_sha256,
    observed_sha256: observed,
    bytes: bytes.byteLength,
    hash_match: observed === SOURCE_DOCUMENT.expected_sha256,
    checked_at: new Date().toISOString(),
    verification: "Fetched source bytes and computed SHA-256 in this browser session."
  };
}

async function observeHarnessProvenance() {
  const buildUrl = new URL(BUILD_INFO_URL, window.location.href).href;
  let buildResponse;
  try {
    buildResponse = await fetch(buildUrl, {cache: "no-store"});
  } catch (error) {
    throw new Error(`Build provenance fetch failed: ${error.message}`);
  }
  if (!buildResponse.ok) throw new Error(`Build provenance fetch failed: HTTP ${buildResponse.status}`);
  let build;
try {
  build = await buildResponse.json();
} catch (error) {
  throw new Error(`Build provenance parse failed: ${error.message}`);
}
if (!build || typeof build !== "object" || Array.isArray(build)) throw new Error("Build provenance is malformed: expected a JSON object.");
if (build.version !== HARNESS_VERSION) throw new Error(`Build provenance version mismatch: expected ${HARNESS_VERSION}, observed ${build.version ?? "missing"}.`);
  if (build.build_id !== BUILD_ID) throw new Error(`Build provenance ID mismatch: expected ${BUILD_ID}, observed ${build.build_id ?? "missing"}.`);
  const codeCommit = typeof build.code_commit === "string" && /^[0-9a-f]{40}$/i.test(build.code_commit)
    ? build.code_commit.toLowerCase()
    : null;
  const expectedAppHash = build.files && typeof build.files["app.js"] === "string" ? build.files["app.js"].toLowerCase() : null;
  if (!codeCommit || !expectedAppHash || !/^[0-9a-f]{64}$/.test(expectedAppHash)) {
    throw new Error("Build provenance is malformed.");
  }

  const appUrl = new URL("app.js", window.location.href).href;
  let appResponse;
  try {
    appResponse = await fetch(appUrl, {cache: "no-store"});
  } catch (error) {
    throw new Error(`Harness code fetch failed: ${error.message}`);
  }
  if (!appResponse.ok) throw new Error(`Harness code fetch failed: HTTP ${appResponse.status}`);
  let appBytes;
try {
  appBytes = await appResponse.arrayBuffer();
} catch (error) {
  throw new Error(`Harness code body read failed: ${error.message}`);
}

const observedAppHash = await sha256Buffer(appBytes);
  if (observedAppHash !== expectedAppHash) {
    throw new Error("Served app.js SHA-256 does not match build provenance.");
  }

  let boundCommitVerification = "UNAVAILABLE";
  let boundCommitNote = "Bound commit corroboration unavailable.";
  try {
    const boundRawUrl = `https://raw.githubusercontent.com/Newsomek/JANUS-Governance-Challenge-Harness/${codeCommit}/app.js`;
    const boundRawResponse = await fetch(boundRawUrl, {cache: "no-store"});
if (boundRawResponse.status === 404) throw new Error("BOUND_COMMIT_NOT_FOUND");
if (!boundRawResponse.ok) throw new Error(`HTTP ${boundRawResponse.status}`);
let boundBytes;
try {
  boundBytes = await boundRawResponse.arrayBuffer();
} catch (error) {
  throw new Error(`Bound commit app.js body read failed: ${error.message}`);
}
const boundRawHash = await sha256Buffer(boundBytes);
    if (boundRawHash !== expectedAppHash) throw new Error("Bound commit app.js differs from the build manifest hash.");
    boundCommitVerification = "MATCH";
    boundCommitNote = "The declared bound commit serves the same app.js bytes as the build manifest.";
  } catch (error) {
    if (error.message === "BOUND_COMMIT_NOT_FOUND") throw new Error("Bound code commit could not be corroborated because app.js was not found at that commit (HTTP 404).");
if (/differs from the build manifest hash/.test(error.message)) throw error;
boundCommitNote = `Bound commit corroboration unavailable: ${error.message}`;
  }

  let deploymentHead = null;
  let deploymentParents = [];
  let commitVerification = "UNAVAILABLE";
  let corroborationNote = "GitHub main corroboration unavailable.";
  try {
    const response = await fetch(GITHUB_HEAD_API, {cache: "no-store", headers: {Accept: "application/vnd.github+json"}});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    deploymentHead = typeof data.sha === "string" && /^[0-9a-f]{40}$/i.test(data.sha) ? data.sha.toLowerCase() : null;
    deploymentParents = Array.isArray(data.parents)
      ? data.parents.map((p) => p && typeof p.sha === "string" ? p.sha.toLowerCase() : null).filter(Boolean)
      : [];
    if (!deploymentHead) throw new Error("GitHub main did not return a valid commit SHA.");
    const rawUrl = `https://raw.githubusercontent.com/Newsomek/JANUS-Governance-Challenge-Harness/${deploymentHead}/app.js`;
    const rawResponse = await fetch(rawUrl, {cache: "no-store"});
    if (!rawResponse.ok) throw new Error(`GitHub main app.js fetch failed: HTTP ${rawResponse.status}`);
    const rawHash = await sha256Buffer(await rawResponse.arrayBuffer());
    if (rawHash === expectedAppHash) {
      commitVerification = "MATCH";
      corroborationNote = "GitHub main serves the same app.js bytes as the bound build manifest.";
    } else {
      commitVerification = "MISMATCH";
      corroborationNote = "GitHub main app.js differs from the bound build manifest.";
    }
  } catch (error) {
    corroborationNote = `GitHub main corroboration unavailable: ${error.message}`;
  }

  return {
    build_info_url: buildUrl,
    build_version: build.version || null,
    build_id: build.build_id || null,
    code_commit: codeCommit,
    app_js_expected_sha256: expectedAppHash,
    app_js_observed_sha256: observedAppHash,
    app_js_hash_match: observedAppHash === expectedAppHash,
    bound_commit_verification: boundCommitVerification,
    bound_commit_note: boundCommitNote,
    deployment_head_observed: deploymentHead,
    deployment_parent_shas: deploymentParents,
    commit_verification: commitVerification,
    corroboration_note: corroborationNote,
    observed_at: new Date().toISOString()
  };
}

function stableSourceEvidence(source) {
  return {
    title: source.title,
    url: source.url,
    path: source.path,
    expected_sha256: source.expected_sha256,
    observed_sha256: source.observed_sha256,
    bytes: source.bytes
  };
}

function stableHarnessProvenance(provenance) {
  return {
    build_info_url: provenance.build_info_url,
    build_version: provenance.build_version,
    build_id: provenance.build_id,
    code_commit: provenance.code_commit,
    app_js_expected_sha256: provenance.app_js_expected_sha256,
    app_js_observed_sha256: provenance.app_js_observed_sha256,
    app_js_hash_match: provenance.app_js_hash_match
  };
}

function expectedEventLog(scenario, prediction, comparison) {
  return [
    "EVENT 001 | Scenario selected",
    `            ${scenario.name}`,
    "",
    "EVENT 002 | Reviewer prediction committed",
    `            ${labels[prediction]}`,
    "",
    "EVENT 003 | Perturbation declared",
    `            ${scenario.perturbation}`,
    "",
    "EVENT 004 | Encoded orientation-level assessment loaded",
    `            ${labels[scenario.disposition]}`,
    "",
    "EVENT 005 | Prediction comparison recorded",
    `            ${comparison.label}`,
    "",
    "EVENT 006 | Evidence boundary preserved",
    "            No unpublished JANUS implementation behavior inferred."
  ];
}

function evidenceCore(record) {
  return {
    version: record.version,
    build_id: record.build_id,
    repository: record.repository,
    harness_code: stableHarnessProvenance(record.harness_provenance),
    source_document: stableSourceEvidence(record.source_document),
    contract_sha256: record.contract_sha256,
    evaluation_mode: record.evaluation_mode,
    restrictions: record.restrictions,
    harness_attribution: record.harness_attribution,
    janus_attribution: record.janus_attribution,
    scenario_id: record.scenario_id,
    scenario_name: record.scenario_name,
    scenario_summary: record.scenario_summary,
    perturbation: record.perturbation,
    reviewer_prediction: record.reviewer_prediction,
    reviewer_prediction_label: record.reviewer_prediction_label,
    orientation_level_disposition: record.orientation_level_disposition,
    orientation_level_disposition_label: record.orientation_level_disposition_label,
    prediction_comparison: record.prediction_comparison,
    prediction_comparison_label: record.prediction_comparison_label,
    compatible_predictions: record.compatible_predictions,
    compatibility_reason: record.compatibility_reason,
    changed: record.changed,
    remains_valid: record.remains_valid,
    invalid_or_uncertain: record.invalid_or_uncertain,
    execution: record.execution,
    source_commitments: record.source_commitments,
    rationale: record.rationale,
    open_question: record.open_question,
    evidence_required: record.evidence_required,
    sources: record.sources,
    event_log: record.event_log
  };
}

async function evidenceCoreHash(record) {
  return sha256Text(JSON.stringify(evidenceCore(record)));
}

function recordSnapshotCore(record) {
  const clone = {...record};
  delete clone.record_snapshot_sha256;
  return clone;
}

async function recordSnapshotHash(record) {
  return sha256Text(JSON.stringify(recordSnapshotCore(record)));
}

function validateScenarioContract(scenario) {
  if (!scenario || typeof scenario !== "object") return "Scenario contract is missing.";
  const requiredStrings = ["id","name","summary","perturbation","disposition","compatibilityReason","changed","valid","invalid","execute","rationale","openQuestion","evidenceRequired"];
  for (const key of requiredStrings) {
    if (!hasVisibleText(scenario[key])) return `Scenario contract field is invalid: ${key}`;
  }
  if (!validPrediction(scenario.disposition)) return "Scenario disposition is not a valid disposition value.";
  if (!Array.isArray(scenario.compatiblePredictions) || !scenario.compatiblePredictions.every(validPrediction)) return "Scenario compatibility set is invalid.";
  if (!uniqueStrings(scenario.compatiblePredictions)) return "Scenario compatibility set contains duplicate values.";
  if (scenario.compatiblePredictions.includes(scenario.disposition)) return "Scenario compatibility set cannot contain the encoded disposition.";
  if (!Array.isArray(scenario.commitments) || scenario.commitments.length < 1) return "Scenario commitments must contain at least one commitment.";
  if (!scenario.commitments.every((x) => x && VALID_SUPPORT_STATUSES.has(x.status) && hasVisibleText(x.text))) return "Scenario commitments contain an invalid support status or text.";
  if (!uniqueCommitments(scenario.commitments)) return "Scenario commitments contain duplicate entries.";
  if (!Array.isArray(scenario.sources) || scenario.sources.length < 1 || !scenario.sources.every(hasVisibleText)) return "Scenario source list is invalid.";
  if (!uniqueStrings(scenario.sources)) return "Scenario source list contains duplicate citations.";
  return null;
}

function clearResultDom() {
  disposition.textContent = "";
  matchBadge.textContent = "";
  matchBadge.className = "badge";
  changed.textContent = "";
  valid.textContent = "";
  invalid.textContent = "";
  execute.textContent = "";
  commitments.innerHTML = "";
  rationale.textContent = "";
  sources.innerHTML = "";
  openQuestion.textContent = "";
  evidenceRequired.textContent = "";
  compatibilityInfo.textContent = "";
  const provenance = document.getElementById("provenanceInfo");
  if (provenance) provenance.textContent = "";
}

function invalidateRun(reason, hadEvidence = Boolean(lastRun || lastReplay || !resultArea.hidden)) {
  stateGeneration += 1;
  lastRun = null;
  lastReplay = null;
  resultArea.hidden = true;
  clearResultDom();
  resultEmpty.hidden = false;
  resultEmpty.textContent = hadEvidence ? "Selection changed. Run the challenge to create a new evidence state." : "No challenge has been run for this selection.";
  eventLog.textContent = "Not run for the current selection.";
  replayRecord.textContent = "No replay performed for the current selection.";
  replayBtn.disabled = true;
  exportBtn.disabled = true;
  staleNotice.hidden = !reason;
  staleNotice.textContent = reason || "";
}

function showRefusal(message) {
  staleNotice.hidden = false;
  staleNotice.textContent = message;
}

function restoreRunnableState() {
  renderScenario();
}

async function buildEvidence(scenario, prediction, sourceObservation, harnessProvenance) {
  const comparison = predictionComparison(scenario, prediction);
  const contractSha256 = await sha256Text(canonicalContract(scenario));
  const eventLines = expectedEventLog(scenario, prediction, comparison);
  const record = {
    harness: "JANUS Governance Challenge Harness",
    version: HARNESS_VERSION,
    build_id: BUILD_ID,
    generated_at: new Date().toISOString(),
    repository: REPOSITORY,
    harness_code_commit: harnessProvenance.code_commit,
    harness_provenance: {...harnessProvenance},
    source_document: {...sourceObservation},
    contract_sha256: contractSha256,
    evaluation_mode: "external orientation-level authored conformance challenge",
    restrictions: [
      "Does not implement JANUS.",
      "Does not emulate JANUS.",
      "Does not penetrate or security-test JANUS.",
      "Does not validate JANUS implementation internals.",
      "Does not infer unpublished JANUS mechanisms.",
      "Reports INSUFFICIENT SPECIFICATION when the source does not establish an answer.",
      "Client-side evidence is integrity-checked for internal consistency but is not cryptographically signed or tamper-proof."
    ],
    harness_attribution: {creator: "Kelly Newsome", organization: "Stratos Engine"},
    janus_attribution: {creator: "Eryk Dubiel", linkedin: "https://www.linkedin.com/in/eryk-dubiel-1201a12b3/"},
    scenario_id: scenario.id,
    scenario_name: scenario.name,
    scenario_summary: scenario.summary,
    perturbation: scenario.perturbation,
    reviewer_prediction: prediction,
    reviewer_prediction_label: labels[prediction],
    orientation_level_disposition: scenario.disposition,
    orientation_level_disposition_label: labels[scenario.disposition],
    prediction_comparison: comparison.code,
    prediction_comparison_label: comparison.label,
    compatible_predictions: [...(scenario.compatiblePredictions || [])],
    compatibility_reason: scenario.compatibilityReason,
    changed: scenario.changed,
    remains_valid: scenario.valid,
    invalid_or_uncertain: scenario.invalid,
    execution: scenario.execute,
    source_commitments: scenario.commitments.map((x) => ({...x})),
    rationale: scenario.rationale,
    open_question: scenario.openQuestion,
    evidence_required: scenario.evidenceRequired,
    sources: [...scenario.sources],
    event_log: eventLines
  };
  record.evidence_core_sha256 = await evidenceCoreHash(record);
  record.record_snapshot_sha256 = await recordSnapshotHash(record);
  return record;
}

async function runChallengeCore() {
  const token = ++stateGeneration;
  const scenario = selectedScenario();
  const prediction = predictionSelect.value;
  if (!scenario) {
    invalidateRun("Execution refused: invalid scenario selection.", false);
    return;
  }
  if (!validPrediction(prediction)) {
    invalidateRun("Execution refused: choose a valid reviewer prediction before running.", false);
    return;
  }
  const contractError = validateScenarioContract(scenario);
  if (contractError) {
    invalidateRun(`Execution refused: ${contractError}`, false);
    return;
  }

  runBtn.disabled = true;
  replayBtn.disabled = true;
  exportBtn.disabled = true;
  staleNotice.hidden = false;
  staleNotice.textContent = "Verifying source bytes, bound build provenance, and evidence state…";

  let sourceObservation;
  let harnessProvenance;
  try {
    [sourceObservation, harnessProvenance] = await Promise.all([observeSourceDocument(), observeHarnessProvenance()]);
    if (token !== stateGeneration) return;
    if (!sourceObservation.hash_match) throw new Error("Observed JANUS source-document SHA-256 does not match the published expected hash.");
    if (!harnessProvenance.app_js_hash_match) throw new Error("Served harness code does not match bound build provenance.");
    const evidence = await buildEvidence(scenario, prediction, sourceObservation, harnessProvenance);
    if (token !== stateGeneration) return;
    lastRun = evidence;
    lastReplay = null;
  } catch (error) {
    if (token !== stateGeneration) return;
    invalidateRun(`Execution refused: ${error.message}`, false);
    restoreRunnableState();
    return;
  }

  const evidence = lastRun;
  staleNotice.hidden = true;
  staleNotice.textContent = "";
  resultEmpty.hidden = true;
  resultArea.hidden = false;

  disposition.textContent = labels[scenario.disposition];
  const comparison = predictionComparison(scenario, prediction);
  matchBadge.textContent = comparison.label;
  matchBadge.className = `badge ${comparison.css}`;
  changed.textContent = scenario.changed;
  valid.textContent = scenario.valid;
  invalid.textContent = scenario.invalid;
  execute.textContent = scenario.execute;
  renderCommitments(scenario.commitments);
  rationale.textContent = scenario.rationale;
  renderSources(scenario.sources);
  openQuestion.textContent = scenario.openQuestion;
  evidenceRequired.textContent = scenario.evidenceRequired;
  compatibilityInfo.textContent = `${(scenario.compatiblePredictions || []).map((p) => labels[p]).join(", ") || "None"}. ${scenario.compatibilityReason}`;
  const provenance = document.getElementById("provenanceInfo");
  if (provenance) provenance.textContent = `Bound code commit: ${evidence.harness_code_commit}. Served app.js hash verified. Bound commit corroboration: ${evidence.harness_provenance.bound_commit_verification}. GitHub main corroboration: ${evidence.harness_provenance.commit_verification}.`;
  eventLog.textContent = evidence.event_log.join("\n");

  replayRecord.textContent = JSON.stringify({
    status: "NOT YET REPLAYED",
    scenario_id: scenario.id,
    reviewer_prediction: prediction,
    encoded_disposition: scenario.disposition,
    contract_sha256: evidence.contract_sha256,
    evidence_core_sha256: evidence.evidence_core_sha256,
    record_snapshot_sha256: evidence.record_snapshot_sha256,
    source_expected_sha256: sourceObservation.expected_sha256,
    source_observed_sha256: sourceObservation.observed_sha256,
    source_hash_match: sourceObservation.hash_match,
    harness_code_commit: evidence.harness_code_commit,
    commit_verification: evidence.harness_provenance.commit_verification,
    note: "Replay re-derives the stable authored evidence core, re-hashes the live source and served app.js bytes, and separately verifies the stored record snapshot."
  }, null, 2);

  replayBtn.disabled = false;
  exportBtn.disabled = false;
  renderScenario();
}

async function deriveReplayRecord(snapshot, scenario, sourceObservation, harnessProvenance) {
  const storedRecordError = validateStoredRunRecord(snapshot);
  if (storedRecordError) throw new Error(storedRecordError);
  const recomputed = await buildEvidence(scenario, snapshot.reviewer_prediction, sourceObservation, harnessProvenance);
  const storedCoreHash = await evidenceCoreHash(snapshot);
  const storedSnapshotHash = await recordSnapshotHash(snapshot);
  const dispositionMatch = recomputed.orientation_level_disposition === snapshot.orientation_level_disposition;
  const contractMatch = recomputed.contract_sha256 === snapshot.contract_sha256;
  const sourceMatch = sourceObservation.observed_sha256 === snapshot.source_document.observed_sha256 && sourceObservation.hash_match;
  const codeMatch = harnessProvenance.code_commit === snapshot.harness_code_commit && harnessProvenance.app_js_observed_sha256 === snapshot.harness_provenance.app_js_observed_sha256;
  const recordIntegrityMatch = storedSnapshotHash === snapshot.record_snapshot_sha256;
const storedCoreMatch = storedCoreHash === snapshot.evidence_core_sha256;

const authoredStateMatch = recomputed.evidence_core_sha256 === snapshot.evidence_core_sha256;
const replayMatch = dispositionMatch && contractMatch && sourceMatch && codeMatch && recordIntegrityMatch && storedCoreMatch && authoredStateMatch;
  return {
    replay_inputs: {scenario_id: snapshot.scenario_id, reviewer_prediction: snapshot.reviewer_prediction},
    original_disposition: snapshot.orientation_level_disposition,
    rederived_disposition: recomputed.orientation_level_disposition,
    original_contract_sha256: snapshot.contract_sha256,
    current_contract_sha256: recomputed.contract_sha256,
    original_evidence_core_sha256: snapshot.evidence_core_sha256,
    stored_evidence_core_sha256: storedCoreHash,
    rederived_evidence_core_sha256: recomputed.evidence_core_sha256,
    original_record_snapshot_sha256: snapshot.record_snapshot_sha256,
    stored_record_snapshot_sha256: storedSnapshotHash,
    source_expected_sha256: SOURCE_DOCUMENT.expected_sha256,
    source_observed_sha256: sourceObservation.observed_sha256,
    harness_code_commit: snapshot.harness_code_commit,
    current_harness_code_commit: harnessProvenance.code_commit,
    bound_commit_verification: harnessProvenance.bound_commit_verification,
    commit_verification: harnessProvenance.commit_verification,
    disposition_match: dispositionMatch,
    contract_match: contractMatch,
    source_match: sourceMatch,
    code_match: codeMatch,
    record_integrity_match: recordIntegrityMatch,
stored_core_match: storedCoreMatch,

authored_state_match: authoredStateMatch,
    replay_match: replayMatch,
    result: replayMatch ? "REPLAY CONSISTENT" : "REPLAY DIVERGENCE — export blocked until a subsequent consistent Replay",
    limitation: "This is a re-derivation from the static authored scenario contract plus live source/code hashing; it is not an independent JANUS runtime execution."
  };
}

async function replayLastRunCore() {
  if (!lastRun) return;
  const token = stateGeneration;
  const snapshot = lastRun;
  let scenario;
  try {
    const storedRecordError = validateStoredRunRecord(snapshot);
    if (storedRecordError) throw new Error(storedRecordError);
    scenario = scenarios.find((item) => item && item.id === snapshot.scenario_id) || null;
    if (!scenario) throw new Error("Stored run record is structurally invalid (scenario_id does not identify a known scenario).");
    const contractError = validateScenarioContract(scenario);
    if (contractError) throw new Error(contractError);
    const [sourceObservation, harnessProvenance] = await Promise.all([observeSourceDocument(), observeHarnessProvenance()]);
    if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;
    if (!sourceObservation.hash_match) throw new Error("Observed JANUS source-document SHA-256 does not match the published expected hash.");
    if (!harnessProvenance.app_js_hash_match) throw new Error("Served harness code does not match bound build provenance.");
    lastReplay = await deriveReplayRecord(snapshot, scenario, sourceObservation, harnessProvenance);
  } catch (error) {
    if (token !== stateGeneration || lastRun !== snapshot) return;
    const normalizedError = normalizeStoredRunError(error);
    lastReplay = {result: "REPLAY REFUSED", replay_match: false, reason: normalizedError.message};
    replayRecord.textContent = JSON.stringify(lastReplay, null, 2);
    exportBtn.disabled = true;
    showRefusal("Replay refused: " + normalizedError.message);
    return;
  }
  if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;
  replayRecord.textContent = JSON.stringify(lastReplay, null, 2);
  exportBtn.disabled = !lastReplay.replay_match;
  staleNotice.hidden = lastReplay.replay_match;
const failedReplayChecks = ["disposition_match","contract_match","source_match","code_match","record_integrity_match","stored_core_match","authored_state_match"].filter((key) => lastReplay[key] === false);
staleNotice.textContent = lastReplay.replay_match ? "" : `Replay divergence detected (${failedReplayChecks.join(", ") || "unknown check"}). Ordinary evidence export is blocked until a subsequent consistent Replay.`;
}

async function exportEvidenceCore() {
  if (!lastRun) return;
  const token = stateGeneration;
  const snapshot = lastRun;
  try {
    const storedRecordError = validateStoredRunRecord(snapshot);
    if (storedRecordError) throw new Error(storedRecordError);
    const scenario = scenarios.find((item) => item && item.id === snapshot.scenario_id) || null;
    if (!scenario) throw new Error("Stored run record is structurally invalid (scenario_id does not identify a known scenario).");
    const contractError = validateScenarioContract(scenario);
    if (contractError) throw new Error(contractError);

    const [sourceObservation, harnessProvenance] = await Promise.all([observeSourceDocument(), observeHarnessProvenance()]);
    if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;
    if (!sourceObservation.hash_match) throw new Error("Observed JANUS source-document SHA-256 does not match the published expected hash.");
    if (!harnessProvenance.app_js_hash_match) throw new Error("Served harness code does not match bound build provenance.");

    const expectedRecord = await buildEvidence(scenario, snapshot.reviewer_prediction, sourceObservation, harnessProvenance);
    const freshReplay = await deriveReplayRecord(snapshot, scenario, sourceObservation, harnessProvenance);
    const recomputedContract = await sha256Text(canonicalContract(scenario));
    const storedCoreHash = await evidenceCoreHash(snapshot);
    const storedSnapshotHash = await recordSnapshotHash(snapshot);
    const expectedComparison = predictionComparison(scenario, snapshot.reviewer_prediction);
    const expectedLog = expectedEventLog(scenario, snapshot.reviewer_prediction, expectedComparison);

    const checks = {
      valid_prediction: validPrediction(snapshot.reviewer_prediction),
      disposition_label: labels[snapshot.orientation_level_disposition] === snapshot.orientation_level_disposition_label,
      prediction_label: labels[snapshot.reviewer_prediction] === snapshot.reviewer_prediction_label,
      comparison_code: expectedComparison.code === snapshot.prediction_comparison,
      comparison_label: expectedComparison.label === snapshot.prediction_comparison_label,
      contract_hash: recomputedContract === snapshot.contract_sha256,
      source_expected_hash: sourceObservation.hash_match,
      source_matches_run: sourceObservation.observed_sha256 === snapshot.source_document.observed_sha256,
      code_commit: harnessProvenance.code_commit === snapshot.harness_code_commit,
      code_hash: harnessProvenance.app_js_observed_sha256 === snapshot.harness_provenance.app_js_observed_sha256,
      event_log: JSON.stringify(expectedLog) === JSON.stringify(snapshot.event_log),
      stored_evidence_core_integrity: storedCoreHash === snapshot.evidence_core_sha256,
      stored_record_snapshot_integrity: storedSnapshotHash === snapshot.record_snapshot_sha256,
      authored_state_integrity: expectedRecord.evidence_core_sha256 === snapshot.evidence_core_sha256,
      replay_rederived_consistent: freshReplay.replay_match === true
    };
    const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
    if (failed.length) throw new Error(`Evidence integrity check failed (${failed.join(", ")}).`);

    // Re-check generation immediately before the synchronous download path.
    // Scenario/prediction changes or Reset during any awaited hashing above invalidate this export.
    if (token !== stateGeneration || lastRun !== snapshot || !lastRun) return;

    const exportedAt = new Date().toISOString();
    const exportRecord = {
      ...snapshot,
      exported_at: exportedAt,
      integrity_status: "PASS",
      integrity_scope: "Unsigned client-side evidence. PASS means the current page state is internally consistent with the live authored contract, source, and code checks at export time; it is not proof against a user with console/devtools access. The snapshot hash detects accidental or uncoordinated mutation only. Independent verification should compare contract_sha256 with docs/EXPECTED_CONTRACT_HASHES.json and the bound commit.",
      integrity_checks: checks,
      export_provenance: {
        bound_code_commit: harnessProvenance.code_commit,
        bound_commit_verification: harnessProvenance.bound_commit_verification,
        deployment_head_observed: harnessProvenance.deployment_head_observed,
        commit_verification: harnessProvenance.commit_verification,
        corroboration_note: harnessProvenance.corroboration_note
      },
      replay: freshReplay,
      compatible_predictions: [...scenario.compatiblePredictions],
      compatibility_reason: scenario.compatibilityReason
    };
    const blob = new Blob([JSON.stringify(exportRecord, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const stamp = exportedAt.replace(/[:.]/g, "-");
    anchor.href = url;
    anchor.download = `janus-harness-${snapshot.scenario_id}-${snapshot.reviewer_prediction.toLowerCase()}-${stamp}-v${HARNESS_VERSION}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    staleNotice.hidden = true;
    staleNotice.textContent = "";
  } catch (error) {
    if (token !== stateGeneration || lastRun !== snapshot) return;
    const normalizedError = normalizeStoredRunError(error);
    showRefusal("Export refused: " + normalizedError.message);
    alert("Export refused: " + normalizedError.message);
  }
}

let runInFlight = false;
let replayInFlight = false;
let exportInFlight = false;

function syncActionButtons() {
  const busy = runInFlight || replayInFlight || exportInFlight;
  const scenario = selectedScenario();
  runBtn.disabled = busy || !scenario || !validPrediction(predictionSelect.value);
  replayBtn.disabled = busy || !lastRun;
  exportBtn.disabled = busy || !lastRun || Boolean(lastReplay && lastReplay.replay_match === false);
}

async function runChallenge() {
  if (runInFlight || replayInFlight || exportInFlight) return;
  runInFlight = true;
  syncActionButtons();
  try {
    await runChallengeCore();
  } finally {
    runInFlight = false;
    syncActionButtons();
  }
}

async function replayLastRun() {
  if (!lastRun || runInFlight || replayInFlight || exportInFlight) return;
  replayInFlight = true;
  syncActionButtons();
  try {
    await replayLastRunCore();
  } finally {
    replayInFlight = false;
    syncActionButtons();
  }
}

async function exportEvidence() {
  if (!lastRun || runInFlight || replayInFlight || exportInFlight) return;
  exportInFlight = true;
  syncActionButtons();
  try {
    await exportEvidenceCore();
  } finally {
    exportInFlight = false;
    syncActionButtons();
  }
}

function resetHarness() {
  stateGeneration += 1;
  lastRun = null;
  lastReplay = null;
  predictionSelect.value = "";
  resultArea.hidden = true;
  clearResultDom();
  resultEmpty.hidden = false;
  resultEmpty.textContent = "No challenge has been run.";
  eventLog.textContent = "Not run.";
  replayRecord.textContent = "No replay performed.";
  replayBtn.disabled = true;
  exportBtn.disabled = true;
  staleNotice.hidden = true;
  staleNotice.textContent = "";
  renderScenario();
}

const startupContractError = validateScenarioSet();
if (startupContractError) {
  scenarioSelect.disabled = true;
  predictionSelect.disabled = true;
  runBtn.disabled = true;
  replayBtn.disabled = true;
  exportBtn.disabled = true;
  showRefusal(`Harness initialization refused: ${startupContractError}`);
} else {
  populateScenarios();
  predictionSelect.value = "";
  renderScenario();
}

scenarioSelect.addEventListener("change", () => {
  const hadEvidence = Boolean(lastRun || lastReplay || !resultArea.hidden);
  renderScenario();
  invalidateRun(hadEvidence ? "Scenario changed. Previous result, replay, and export state were invalidated." : "", hadEvidence);
  renderScenario();
});
predictionSelect.addEventListener("change", () => {
  const hadEvidence = Boolean(lastRun || lastReplay || !resultArea.hidden);
  renderScenario();
  invalidateRun(hadEvidence ? "Prediction changed. Previous result, replay, and export state were invalidated." : "", hadEvidence);
  renderScenario();
});
runBtn.addEventListener("click", runChallenge);
replayBtn.addEventListener("click", replayLastRun);
exportBtn.addEventListener("click", exportEvidence);
resetBtn.addEventListener("click", resetHarness);
