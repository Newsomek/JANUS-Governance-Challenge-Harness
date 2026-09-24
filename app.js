"use strict";

const scenarios = [
  {
    id: "condition-change",
    name: "01 · Authorization condition changes after approval",
    summary:
      "Evidence E1 supports Decision D1. Authorization A1 is granted under operating condition C1. Before execution, C1 changes to C2 while the evidence and decision remain otherwise intact.",
    perturbation:
      "C1 → C2 after authorization but before execution.",
    disposition: "BLOCK_REAUTHORIZE",
    changed:
      "A material condition attached to the authorization is no longer the condition under which A1 was granted.",
    valid:
      "The existing evidence and the reasoning behind D1 may remain valid unless the condition change also affects them.",
    invalid:
      "Current authorization to cross into execution cannot simply be assumed from the earlier authorization.",
    execute:
      "Not until the authorization condition is reevaluated and the applicable authority confirms a valid path forward.",
    rationale:
      "JANUS explicitly separates decision from authorization and authorization from execution. It also describes authorization as having its own owner, history, and conditions, and describes fail-closed behavior when a required condition is not met. Therefore a still-reasonable decision is not sufficient by itself to preserve execution authority after a material authorization condition changes.",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Decision validity and authorization validity remain separate."
      },
      {
        status: "SUPPORTED",
        text: "Execution does not inherit permission merely because the proposed decision remains reasonable."
      },
      {
        status: "OPEN",
        text: "The Orientation Edition does not specify the exact reauthorization protocol or authority-resolution mechanism."
      }
    ],
    sources: [
      "p.20 · §19 Operational Control — authorization is a separate fact with its own owner, history, and conditions.",
      "p.33 · §32 Security by Design — when a condition is not met, prefer no transition over a silent bypass.",
      "p.2 · §01 Protective Principle — decision, authorization, and execution are distinct transitions."
    ]
  },

  {
    id: "learning-authority",
    name: "02 · Learning attempts to expand authority",
    summary:
      "A bounded agent repeatedly succeeds inside Scope S1. Learning produces a new capability C2 that appears reliable beyond S1. No governing authority has approved a larger operational scope.",
    perturbation:
      "Capability expands; formally granted authority does not.",
    disposition: "BLOCK_REAUTHORIZE",
    changed:
      "The system's demonstrated capability and confidence have increased.",
    valid:
      "Historical success, learned preferences, and the new capability may all remain legitimate evidence for a proposal.",
    invalid:
      "The assumption that improved capability automatically expands operational authority.",
    execute:
      "Only inside the previously authorized scope unless a separate governance process grants additional authority.",
    rationale:
      "JANUS explicitly distinguishes learning from self-promotion and says improved capability does not itself constitute consent to greater power. Maturation can produce proposals for architectural change, but acceptance remains a separate governance event.",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Learning can change knowledge without changing authorization."
      },
      {
        status: "SUPPORTED",
        text: "Capability expansion is not authority expansion."
      },
      {
        status: "SUPPORTED",
        text: "Expanded authority requires a distinct approval or governance event."
      }
    ],
    sources: [
      "p.23 · §22 Learning from Experience — Learning ≠ Self-Promotion.",
      "p.25 · §24 Maturity — capability development and authority development remain separate.",
      "p.39 · §38 Working Contract — an improved model is not, by itself, consent to greater power."
    ]
  },

  {
    id: "mid-execution-revocation",
    name: "03 · Authority is revoked during execution",
    summary:
      "Execution X1 begins under valid Authorization A1. While the action is already underway, A1 is revoked or a required authorization condition becomes false.",
    perturbation:
      "Authority changes after execution has begun.",
    disposition: "INSUFFICIENT_SPECIFICATION",
    changed:
      "The authority state changes while a previously authorized real-world action is already in progress.",
    valid:
      "The record that X1 began under valid authorization remains part of the historical evidence.",
    invalid:
      "The assumption that the Orientation Edition tells us whether every in-flight action must stop, finish, roll back, compensate, or escalate.",
    execute:
      "The Orientation Edition establishes the accountability boundary but does not provide enough information to select a universal in-flight execution rule.",
    rationale:
      "JANUS treats execution as a distinct and accountable event and records preparation, permission, execution, and result. However, the Orientation Edition deliberately stays above implementation specification and does not establish the mechanism for mid-execution revocation across interruptible, non-interruptible, reversible, or compensating actions. A deterministic answer here would therefore invent architecture that the source does not state.",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Execution must remain separately accountable from the authorization that preceded it."
      },
      {
        status: "SUPPORTED",
        text: "The original authorization and subsequent revocation should both remain reconstructable events."
      },
      {
        status: "OPEN",
        text: "Stop, finish, rollback, compensate, or escalate cannot be selected universally from the Orientation Edition alone."
      }
    ],
    sources: [
      "p.21 · §20 Execution — execution is an accountable boundary event.",
      "p.32 · §31 Audit — significant stages should leave enough trace to reconstruct authority and outcome.",
      "p.2 · §01 Protective Principle — the document is an orientation document, not an implementation specification."
    ]
  }
];

const labels = {
  BLOCK_REAUTHORIZE: "BLOCK + REAUTHORIZE",
  CONTINUE: "CONTINUE",
  ESCALATE: "ESCALATE",
  ROLLBACK_COMPENSATE: "ROLLBACK / COMPENSATE",
  INSUFFICIENT_SPECIFICATION: "INSUFFICIENT SPECIFICATION"
};

const scenarioSelect = document.getElementById("scenarioSelect");
const predictionSelect = document.getElementById("predictionSelect");
const scenarioSummary = document.getElementById("scenarioSummary");
const perturbation = document.getElementById("perturbation");

const runBtn = document.getElementById("runBtn");
const replayBtn = document.getElementById("replayBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");

const resultEmpty = document.getElementById("resultEmpty");
const resultArea = document.getElementById("resultArea");

const disposition = document.getElementById("disposition");
const matchBadge = document.getElementById("matchBadge");
const changed = document.getElementById("changed");
const valid = document.getElementById("valid");
const invalid = document.getElementById("invalid");
const execute = document.getElementById("execute");
const assertions = document.getElementById("assertions");
const rationale = document.getElementById("rationale");
const sources = document.getElementById("sources");

const eventLog = document.getElementById("eventLog");
const replayRecord = document.getElementById("replayRecord");

let lastRun = null;

function selectedScenario() {
  return scenarios.find((scenario) => scenario.id === scenarioSelect.value);
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

  scenarioSummary.innerHTML =
    `<strong>${scenario.name}</strong>${scenario.summary}`;

  perturbation.textContent = scenario.perturbation;
}

function renderAssertions(items) {
  assertions.innerHTML = "";

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "assertion";

    const status = document.createElement("div");
    status.className =
      "assertion-status " +
      (item.status === "SUPPORTED" ? "supported" : "open");
    status.textContent = item.status;

    const text = document.createElement("div");
    text.textContent = item.text;

    row.append(status, text);
    assertions.appendChild(row);
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

function buildEvidence(scenario, prediction) {
  return {
    harness: "JANUS Governance Challenge Harness",
    version: "0.1",
    basis: "JANUS Orientation Edition 2026",
    mode: "external architectural conformance challenge",
    scenario_id: scenario.id,
    scenario_name: scenario.name,
    reviewer_prediction: prediction,
    reviewer_prediction_label: labels[prediction],
    architectural_disposition: scenario.disposition,
    architectural_disposition_label: labels[scenario.disposition],
    prediction_matches_disposition: prediction === scenario.disposition,
    changed: scenario.changed,
    remains_valid: scenario.valid,
    invalid_or_uncertain: scenario.invalid,
    execution: scenario.execute,
    invariant_checks: scenario.assertions,
    rationale: scenario.rationale,
    sources: scenario.sources
  };
}

function runChallenge() {
  const scenario = selectedScenario();
  const prediction = predictionSelect.value;

  lastRun = buildEvidence(scenario, prediction);

  resultEmpty.hidden = true;
  resultArea.hidden = false;

  disposition.textContent = labels[scenario.disposition];

  const isMatch = prediction === scenario.disposition;
  matchBadge.textContent =
    isMatch ? "PREDICTION MATCHED" : "PREDICTION DIFFERED";
  matchBadge.className = "badge " + (isMatch ? "match" : "mismatch");

  changed.textContent = scenario.changed;
  valid.textContent = scenario.valid;
  invalid.textContent = scenario.invalid;
  execute.textContent = scenario.execute;

  renderAssertions(scenario.assertions);
  rationale.textContent = scenario.rationale;
  renderSources(scenario.sources);

  const log = [
    "EVENT 001 | Scenario selected",
    `            ${scenario.name}`,
    "",
    "EVENT 002 | Reviewer prediction committed",
    `            ${labels[prediction]}`,
    "",
    "EVENT 003 | Perturbation applied",
    `            ${scenario.perturbation}`,
    "",
    "EVENT 004 | JANUS-stated architectural constraints evaluated",
    `            ${labels[scenario.disposition]}`,
    "",
    "EVENT 005 | Comparison recorded",
    `            ${isMatch ? "Prediction matched architectural disposition." : "Prediction differed from architectural disposition."}`
  ].join("\n");

  eventLog.textContent = log;

  replayRecord.textContent = JSON.stringify(
    {
      replay_inputs: {
        scenario_id: scenario.id,
        reviewer_prediction: prediction,
        source_contract: "JANUS Orientation Edition 2026"
      },
      replay_rule:
        "Recompute from the fixed scenario definition and stated source contract; do not use the stored outcome as an instruction.",
      recomputed_disposition: scenario.disposition,
      deterministic:
        "For this v0.1 harness, identical scenario inputs produce the same architectural disposition."
    },
    null,
    2
  );

  replayBtn.disabled = false;
  exportBtn.disabled = false;
}

function replayLastRun() {
  if (!lastRun) {
    return;
  }

  const scenario = scenarios.find(
    (item) => item.id === lastRun.scenario_id
  );

  const recomputed = buildEvidence(
    scenario,
    lastRun.reviewer_prediction
  );

  const same =
    recomputed.architectural_disposition ===
    lastRun.architectural_disposition;

  replayRecord.textContent = JSON.stringify(
    {
      replay_inputs: {
        scenario_id: lastRun.scenario_id,
        reviewer_prediction: lastRun.reviewer_prediction
      },
      original_disposition: lastRun.architectural_disposition,
      recomputed_disposition: recomputed.architectural_disposition,
      replay_match: same,
      result:
        same
          ? "REPLAY CONSISTENT"
          : "REPLAY DIVERGENCE — investigate harness state"
    },
    null,
    2
  );
}

function exportEvidence() {
  if (!lastRun) {
    return;
  }

  const blob = new Blob(
    [JSON.stringify(lastRun, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download =
    `janus-harness-${lastRun.scenario_id}-evidence-v0.1.json`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function resetHarness() {
  lastRun = null;

  predictionSelect.value = "BLOCK_REAUTHORIZE";

  resultArea.hidden = true;
  resultEmpty.hidden = false;

  resultEmpty.textContent = "No challenge has been run.";

  eventLog.textContent = "Not run.";
  replayRecord.textContent = "Not run.";

  replayBtn.disabled = true;
  exportBtn.disabled = true;

  renderScenario();
}

populateScenarios();
renderScenario();

scenarioSelect.addEventListener("change", renderScenario);
runBtn.addEventListener("click", runChallenge);
replayBtn.addEventListener("click", replayLastRun);
exportBtn.addEventListener("click", exportEvidence);
resetBtn.addEventListener("click", resetHarness);
