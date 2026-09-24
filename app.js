"use strict";

const HARNESS_VERSION = "0.2";
const BUILD_ID = "janus-governance-challenge-harness-v0.2";
const SOURCE_DOCUMENT = {
  title: "JANUS Orientation Edition 2026",
  url: "docs/JANUS_Orientation_Edition_2026_EN.docx",
  sha256: "21766f5dbd86b728f4cb7e5794b208dab52d169eb4e0d4fd717ae8c374551fe4"
};

const labels = {
  CONTINUE: "CONTINUE",
  BLOCK: "BLOCK",
  BLOCK_REAUTHORIZE: "BLOCK + REAUTHORIZE",
  ESCALATE: "ESCALATE",
  ROLLBACK_COMPENSATE: "ROLLBACK / COMPENSATE",
  INSUFFICIENT_SPECIFICATION: "INSUFFICIENT SPECIFICATION"
};

const scenarios = [
  {
    id: "condition-change",
    name: "01 · Authorization condition changes after approval",
    summary: "Evidence E1 supports Decision D1. Authorization A1 is granted under operating condition C1. Before execution, C1 changes to C2 while the evidence and decision remain otherwise intact.",
    perturbation: "A material authorization condition changes from C1 to C2 after authorization but before execution.",
    disposition: "BLOCK_REAUTHORIZE",
    compatiblePredictions: ["BLOCK"],
    changed: "A condition attached to the previously granted authorization is no longer the condition under which A1 was issued.",
    valid: "E1 and the reasoning behind D1 may remain valid unless the changed condition also affects their epistemic basis.",
    invalid: "Current authorization to enter execution cannot be inferred solely from the existence of the earlier authorization.",
    execute: "Do not proceed on A1 alone. The changed authorization condition requires reevaluation under the applicable governance process.",
    rationale: "JANUS separates decision, authorization, and execution. The Orientation Edition describes authorization as a separate fact with its own owner, history, and conditions, and describes fail-closed behavior when a required condition is not met. The document supports blocking silent execution; the harness uses 'reauthorize' as its own disposition shorthand for obtaining a new valid authorization state if execution is still desired.",
    openQuestion: "What exact event invalidates A1, and what JANUS mechanism determines whether a new authorization fact is required?",
    evidenceRequired: "A reconstructable record of E1, D1, A1, the C1→C2 change, the authority owner, the decision to stop or continue, and any subsequent authorization event.",
    commitments: [
      {status: "SUPPORTED", text: "Decision validity and authorization validity remain separate."},
      {status: "SUPPORTED", text: "A still-reasonable decision does not automatically preserve execution permission."},
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
    changed: "New evidence materially weakens or contradicts the basis on which the existing decision was formed.",
    valid: "The historical record that A1 was granted remains valid as history. It does not disappear merely because new evidence arrives.",
    invalid: "The assumption that historical authorization can be executed without reevaluating the changed epistemic basis.",
    execute: "Do not proceed merely because A1 remains in history. The contradiction must remain explicit and the decision basis must be reevaluated before execution can safely be derived from the prior chain.",
    rationale: "JANUS distinguishes evidence, decision, authorization, and execution, and treats contradiction as information that must remain visible. Blocking execution on a materially changed evidentiary basis is a reasonable orientation-level inference. Whether authorization is automatically suspended, separately revoked, or later reissued is not stated.",
    openQuestion: "Is authorization formally dependent on the evidence behind the decision it authorizes, and if so, how is that dependency represented?",
    evidenceRequired: "E1, E2, the contradiction record, D1, A1, provenance for both evidence sets, and the subsequent reevaluation or escalation decision.",
    commitments: [
      {status: "EXTENDED / BY ANALOGY", text: "The no-forced-resolution principle for conflicting data is applied here to conflicting decision evidence."},
      {status: "SUPPORTED", text: "Authorization history and current epistemic justification are different facts."},
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
    compatiblePredictions: ["BLOCK"],
    changed: "The current moment or operating state is outside the stipulated validity scope under which A1 was granted.",
    valid: "A1 remains part of the historical record and can still prove that authorization existed previously.",
    invalid: "Previously authorized is not equivalent to currently authorized under the scenario's stipulated validity bound.",
    execute: "Do not proceed on expired authority. If execution is still desired, a new valid authorization state is required.",
    rationale: "The Orientation Edition does not define authorization expiry, but this scenario stipulates a validity bound. Given that stipulation, JANUS's separation of current state, historical state, authorization conditions, and fail-closed behavior supports blocking execution after the bound has lapsed. 'Reauthorize' is harness shorthand, not a JANUS term.",
    openQuestion: "How does JANUS represent authorization lifetime: explicit expiry, policy validity, state dependency, or another mechanism?",
    evidenceRequired: "The original authorization, its stipulated validity condition, the time/state transition that ended validity, and any later authorization event.",
    commitments: [
      {status: "SUPPORTED", text: "Historical authorization can remain true as history while no longer proving present authority under a stipulated bound."},
      {status: "EXTENDED / BY ANALOGY", text: "The document's scope-of-validity language is explicit for memory and is applied here by analogy to authorization validity."},
      {status: "OPEN", text: "No authorization TTL, expiry object, or renewal mechanism is specified."}
    ],
    sources: [
      "§19 Operational Control — authorization has its own history and conditions.",
      "§27 Memory — prior states remain available when later interpretation changes.",
      "§39 Limits — conditions can change and trust must have context; §32 supplies the fail-closed principle."
    ]
  },
  {
    id: "learning-authority",
    name: "04 · Learning attempts to expand authority",
    summary: "The system repeatedly succeeds inside Scope S1. Learning produces capability C2 that appears reliable beyond S1. No governing authority has approved a larger operational scope.",
    perturbation: "Capability expands; formally granted authority does not.",
    disposition: "BLOCK_REAUTHORIZE",
    compatiblePredictions: ["BLOCK", "CONTINUE"],
    changed: "The system's demonstrated capability, learned behavior, or confidence has increased.",
    valid: "Historical performance and C2 may be legitimate evidence supporting a proposal for expanded authority. Existing work inside S1 may continue if separately authorized.",
    invalid: "The assumption that improved capability automatically enlarges operational permission beyond S1.",
    execute: "Continue only within the already authorized scope. Block the out-of-scope use unless a separate governance process grants additional authority.",
    rationale: "JANUS directly states that learning must not become self-promotion and that a new ability should not automatically receive a new level of authority. The headline disposition applies to the attempted expansion beyond S1, not to already authorized in-scope work.",
    openQuestion: "What evidence and governance event would JANUS require before expanded capability could receive expanded authority?",
    evidenceRequired: "Performance history inside S1, evidence supporting C2, the current authority scope, the proposal for expansion, independent verification evidence, and the governance decision.",
    commitments: [
      {status: "SUPPORTED", text: "Learning can change knowledge or preference without changing authorization."},
      {status: "SUPPORTED", text: "Capability expansion is not authority expansion."},
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
    changed: "Nothing must change over time; the conflict exists because two valid-looking authority sources apply simultaneously.",
    valid: "Both authority records may remain valid within the scopes that produced them.",
    invalid: "The assumption that the Orientation Edition supplies a universal authority-precedence rule.",
    execute: "The resolution mechanism is insufficiently specified. The orientation-level constraints do not support silently selecting O1 and executing while O2's prohibition remains unresolved; the conflict should be preserved and resolved by an applicable authority or escalation path.",
    rationale: "JANUS does not define an organizational authority lattice, policy-precedence system, or jurisdiction hierarchy. Therefore the mechanism for resolving O1 versus O2 is unspecified. Separately, its fail-closed and refusal-of-unjustified-transition principles weigh against silently executing on one side of an unresolved authority conflict. Applying §28's data-conflict language to authority conflict is explicitly marked as an analogy rather than direct support.",
    openQuestion: "How does JANUS resolve two simultaneously applicable but conflicting authority owners: precedence, jurisdiction, policy hierarchy, human escalation, or another mechanism?",
    evidenceRequired: "Both authority records, their scopes and owners, the conflicting policy conditions, any precedence rule consulted, the escalation path, and the resolution event.",
    commitments: [
      {status: "EXTENDED / BY ANALOGY", text: "The no-forced-resolution principle stated for data conflict is applied here to authority conflict."},
      {status: "SUPPORTED", text: "Fail-closed / refusal-of-unjustified-transition principles do not support silent execution on an unresolved basis."},
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
    changed: "The authority state changes while a previously authorized action is already affecting the external environment.",
    valid: "The record that X1 began under valid authorization remains part of the historical evidence.",
    invalid: "The assumption that the Orientation Edition determines one universal response for every in-flight action.",
    execute: "The Orientation Edition establishes an accountable execution boundary but does not specify whether an in-flight action must stop, safely complete, roll back, compensate, or escalate.",
    rationale: "JANUS treats execution as a distinct accountable event and requires enough trace to reconstruct authority and outcome. The Orientation Edition intentionally remains above implementation specification and does not define universal semantics for authority loss during execution. The harness therefore refuses to invent one.",
    openQuestion: "How does JANUS classify in-flight actions when authority disappears, and what determines stop, safe completion, rollback, compensation, or escalation?",
    evidenceRequired: "The authorization state at execution start, the revocation or condition-change event, action interruptibility/reversibility characteristics, the response selected, and the resulting external effect.",
    commitments: [
      {status: "SUPPORTED", text: "Execution remains separately accountable from the authorization that preceded it."},
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
const eventLog = document.getElementById("eventLog");
const replayRecord = document.getElementById("replayRecord");

let lastRun = null;
let lastReplay = null;

function selectedScenario() {
  const scenario = scenarios.find((item) => item.id === scenarioSelect.value);
  if (!scenario) {
    return null;
  }
  return scenario;
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
  scenarioSummary.innerHTML = `<strong>${scenario.name}</strong>${scenario.summary}`;
  perturbation.textContent = scenario.perturbation;
  runBtn.disabled = !predictionSelect.value;
}

function predictionComparison(scenario, prediction) {
  if (prediction === scenario.disposition) {
    return {code: "EXACT", label: "EXACT MATCH", css: "match"};
  }
  if ((scenario.compatiblePredictions || []).includes(prediction)) {
    return {code: "PARTIAL", label: "PARTIAL / COMPATIBLE", css: "partial"};
  }
  return {code: "DIFFERENT", label: "DIFFERENT", css: "mismatch"};
}

function renderCommitments(items) {
  commitments.innerHTML = "";
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "assertion";
    const status = document.createElement("div");
    const cls = item.status === "SUPPORTED" ? "supported" : item.status === "OPEN" ? "open" : "extended";
    status.className = `assertion-status ${cls}`;
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

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function invalidateRun(reason) {
  lastRun = null;
  lastReplay = null;
  resultArea.hidden = true;
  resultEmpty.hidden = false;
  resultEmpty.textContent = "Selection changed. Run the challenge to create a new evidence state.";
  eventLog.textContent = "Not run for the current selection.";
  replayRecord.textContent = "No replay performed for the current selection.";
  replayBtn.disabled = true;
  exportBtn.disabled = true;
  staleNotice.hidden = false;
  staleNotice.textContent = reason || "Selection changed. Previous evidence was invalidated.";
}

async function buildEvidence(scenario, prediction) {
  const comparison = predictionComparison(scenario, prediction);
  const contractSha256 = await sha256Hex(canonicalContract(scenario));
  return {
    harness: "JANUS Governance Challenge Harness",
    version: HARNESS_VERSION,
    build_id: BUILD_ID,
    generated_at: new Date().toISOString(),
    source_document: SOURCE_DOCUMENT,
    contract_sha256: contractSha256,
    evaluation_mode: "external orientation-level authored conformance challenge",
    restrictions: [
      "Does not implement JANUS.",
      "Does not emulate JANUS.",
      "Does not penetrate or security-test JANUS.",
      "Does not validate JANUS implementation internals.",
      "Does not infer unpublished JANUS mechanisms.",
      "Reports INSUFFICIENT SPECIFICATION when the source does not establish an answer."
    ],
    harness_attribution: {
      creator: "Kelly Newsome",
      organization: "Stratos Engine"
    },
    janus_attribution: {
      creator: "Eryk Dubiel",
      linkedin: "https://www.linkedin.com/in/eryk-dubiel-1201a12b3/"
    },
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
    changed: scenario.changed,
    remains_valid: scenario.valid,
    invalid_or_uncertain: scenario.invalid,
    execution: scenario.execute,
    source_commitments: scenario.commitments,
    rationale: scenario.rationale,
    open_question: scenario.openQuestion,
    evidence_required: scenario.evidenceRequired,
    sources: scenario.sources
  };
}

async function runChallenge() {
  const scenario = selectedScenario();
  const prediction = predictionSelect.value;
  if (!scenario) {
    invalidateRun("Invalid scenario selection. Execution refused.");
    return;
  }
  if (!prediction || !labels[prediction]) {
    invalidateRun("Choose a reviewer prediction before running.");
    return;
  }

  lastRun = await buildEvidence(scenario, prediction);
  lastReplay = null;
  staleNotice.hidden = true;
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

  const logLines = [
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
  const log = logLines.join("\n");
  eventLog.textContent = log;
  lastRun.event_log = logLines;

  replayRecord.textContent = JSON.stringify({
    status: "NOT YET REPLAYED",
    scenario_id: scenario.id,
    reviewer_prediction: prediction,
    encoded_disposition: scenario.disposition,
    contract_sha256: lastRun.contract_sha256,
    source_document_sha256: SOURCE_DOCUMENT.sha256,
    note: "Replay will re-derive the authored assessment from the current encoded scenario contract and compare contract/source hashes."
  }, null, 2);

  replayBtn.disabled = false;
  exportBtn.disabled = false;
}

async function replayLastRun() {
  if (!lastRun) return;
  const scenario = scenarios.find((item) => item.id === lastRun.scenario_id);
  if (!scenario) {
    lastReplay = {result: "REPLAY REFUSED", reason: "Scenario contract no longer exists."};
    replayRecord.textContent = JSON.stringify(lastReplay, null, 2);
    return;
  }
  const recomputed = await buildEvidence(scenario, lastRun.reviewer_prediction);
  const dispositionMatch = recomputed.orientation_level_disposition === lastRun.orientation_level_disposition;
  const contractMatch = recomputed.contract_sha256 === lastRun.contract_sha256;
  const sourceMatch = SOURCE_DOCUMENT.sha256 === lastRun.source_document.sha256;
  const replayMatch = dispositionMatch && contractMatch && sourceMatch;
  lastReplay = {
    replay_inputs: {
      scenario_id: lastRun.scenario_id,
      reviewer_prediction: lastRun.reviewer_prediction
    },
    original_disposition: lastRun.orientation_level_disposition,
    rederived_disposition: recomputed.orientation_level_disposition,
    original_contract_sha256: lastRun.contract_sha256,
    current_contract_sha256: recomputed.contract_sha256,
    source_document_sha256: SOURCE_DOCUMENT.sha256,
    disposition_match: dispositionMatch,
    contract_match: contractMatch,
    source_match: sourceMatch,
    replay_match: replayMatch,
    result: replayMatch ? "REPLAY CONSISTENT" : "REPLAY DIVERGENCE — investigate encoded contract or evidence state",
    limitation: "This is a re-derivation from the static authored scenario contract, not an independent JANUS runtime execution."
  };
  replayRecord.textContent = JSON.stringify(lastReplay, null, 2);
}

async function exportEvidence() {
  if (!lastRun) return;
  const scenario = scenarios.find((item) => item.id === lastRun.scenario_id);
  if (!scenario) return;
  const expectedLabel = labels[lastRun.orientation_level_disposition];
  const expectedComparison = predictionComparison(scenario, lastRun.reviewer_prediction);
  if (expectedLabel !== lastRun.orientation_level_disposition_label) {
    alert("Export refused: disposition label is internally inconsistent.");
    return;
  }
  if (expectedComparison.code !== lastRun.prediction_comparison) {
    alert("Export refused: prediction comparison is internally inconsistent.");
    return;
  }

  const exportRecord = {
    ...lastRun,
    replay: lastReplay || {status: "NOT PERFORMED BEFORE EXPORT"}
  };
  const blob = new Blob([JSON.stringify(exportRecord, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `janus-harness-${lastRun.scenario_id}-${lastRun.reviewer_prediction.toLowerCase()}-${stamp}-v${HARNESS_VERSION}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function resetHarness() {
  lastRun = null;
  lastReplay = null;
  predictionSelect.value = "";
  resultArea.hidden = true;
  resultEmpty.hidden = false;
  resultEmpty.textContent = "No challenge has been run.";
  eventLog.textContent = "Not run.";
  replayRecord.textContent = "No replay performed.";
  replayBtn.disabled = true;
  exportBtn.disabled = true;
  staleNotice.hidden = true;
  renderScenario();
}

populateScenarios();
predictionSelect.value = "";
renderScenario();

scenarioSelect.addEventListener("change", () => {
  renderScenario();
  invalidateRun("Scenario changed. Previous result, replay, and export state were invalidated.");
});
predictionSelect.addEventListener("change", () => {
  renderScenario();
  invalidateRun("Prediction changed. Previous result, replay, and export state were invalidated.");
});
runBtn.addEventListener("click", runChallenge);
replayBtn.addEventListener("click", replayLastRun);
exportBtn.addEventListener("click", exportEvidence);
resetBtn.addEventListener("click", resetHarness);
