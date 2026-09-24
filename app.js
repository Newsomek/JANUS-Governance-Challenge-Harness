"use strict";

const scenarios = [
  {
    id: "condition-change",
    name: "01 · Authorization condition changes after approval",
    summary:
      "Evidence E1 supports Decision D1. Authorization A1 is granted under operating condition C1. Before execution, C1 changes to C2 while the evidence and decision remain otherwise intact.",
    perturbation:
      "A material authorization condition changes from C1 to C2 after authorization but before execution.",
    disposition: "BLOCK_REAUTHORIZE",
    changed:
      "A condition attached to the previously granted authorization is no longer the condition under which A1 was issued.",
    valid:
      "E1 and the reasoning behind D1 may remain valid unless the changed condition also affects their epistemic basis.",
    invalid:
      "Current authorization to enter execution cannot be inferred solely from the existence of the earlier authorization.",
    execute:
      "Not on the basis of A1 alone. The changed authorization condition requires reevaluation under the applicable governance process.",
    rationale:
      "JANUS separates decision, authorization, and execution. The Orientation Edition describes authorization as a separate fact with its own owner, history, and conditions, and describes fail-closed behavior when a required condition is not met. A decision can therefore remain reasonable while its authority to produce execution requires reevaluation.",
    openQuestion:
      "What exact event invalidates A1, and what JANUS mechanism determines that reauthorization is now required?",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Decision validity and authorization validity remain separate."
      },
      {
        status: "SUPPORTED",
        text: "A still-reasonable decision does not automatically preserve execution permission."
      },
      {
        status: "OPEN",
        text: "The Orientation Edition does not disclose the exact reauthorization protocol."
      }
    ],
    sources: [
      "p.2 · §01 Protective Principle — decision, authorization, and execution are distinct transitions.",
      "p.20 · §19 Operational Control — authorization is a separate fact with its own owner, history, and conditions.",
      "p.33 · §32 Security by Design — when a condition is not met, prefer no transition over a silent bypass."
    ]
  },

  {
    id: "evidence-change",
    name: "02 · Evidence changes after authorization",
    summary:
      "Evidence E1 supports Decision D1 and Authorization A1 exists. Before execution, new evidence E2 materially contradicts E1. No explicit revocation of A1 has yet occurred.",
    perturbation:
      "The epistemic basis changes while the recorded authorization remains historically present.",
    disposition: "BLOCK",
    changed:
      "New evidence materially weakens or contradicts the basis on which the existing decision was formed.",
    valid:
      "The historical record that A1 was granted remains valid as history. It does not disappear merely because new evidence arrives.",
    invalid:
      "The assumption that historical authorization can be executed without reevaluating the changed epistemic basis.",
    execute:
      "Not merely because A1 still exists in history. The contradiction must remain explicit and the decision basis must be reevaluated before execution can safely be derived from the prior chain.",
    rationale:
      "JANUS treats contradiction as information rather than something to force into a single answer. It also distinguishes evidence, decision, authorization, and execution. If the evidence supporting D1 materially changes, the architecture cannot preserve epistemic continuity by pretending the earlier basis is unchanged simply because authorization has not yet been explicitly revoked.",
    openQuestion:
      "Does JANUS automatically invalidate authorization when its evidentiary dependency changes, or does another layer formally revoke or suspend that authorization?",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Contradictory evidence must remain visible rather than being silently resolved for downstream convenience."
      },
      {
        status: "SUPPORTED",
        text: "Authorization history and current epistemic justification are different facts."
      },
      {
        status: "OPEN",
        text: "The exact dependency rule linking evidence invalidation to authority invalidation is not stated."
      }
    ],
    sources: [
      "p.7 · §06 Distinctions — evidence, decision, authorization, and execution are distinct classes.",
      "p.29 · §28 Conflict — unresolved contradiction should remain open uncertainty.",
      "p.30 · §29 Resilience — model output must not be automatically promoted into fact and authorized action."
    ]
  },

  {
    id: "authorization-expiry",
    name: "03 · Authorization expires before execution",
    summary:
      "Decision D1 is valid and Authorization A1 was valid within defined temporal or operating bounds. Execution is delayed until after those bounds expire.",
    perturbation:
      "Time or another explicit validity bound expires before execution begins.",
    disposition: "BLOCK_REAUTHORIZE",
    changed:
      "The current moment or operating state is outside the validity scope under which A1 was granted.",
    valid:
      "A1 remains part of the historical record and can still prove that authorization existed previously.",
    invalid:
      "Previously authorized is not equivalent to currently authorized.",
    execute:
      "Not on expired authority. A new or renewed authorization must be established if execution is still desired.",
    rationale:
      "JANUS emphasizes provenance, history, context, and scope of validity. Its memory model preserves prior states without treating them as permanently current, and its operational-control model gives authorization its own conditions. Historical authorization therefore remains evidence of a past state rather than automatically becoming timeless execution permission.",
    openQuestion:
      "How does JANUS represent authorization lifetime: explicit expiration, policy validity, state dependency, or another form of scope?",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Historical authorization can remain true as history while no longer being current authority."
      },
      {
        status: "SUPPORTED",
        text: "Scope and context of validity matter to interpretation."
      },
      {
        status: "OPEN",
        text: "The Orientation Edition does not define authorization TTLs, expiry objects, or renewal mechanics."
      }
    ],
    sources: [
      "p.20 · §19 Operational Control — authorization has its own history and conditions.",
      "p.27 · §26 Open Architecture — memory should preserve provenance and scope of validity.",
      "p.28 · §27 Memory — prior meaning and history remain available when interpretation changes."
    ]
  },

  {
    id: "learning-authority",
    name: "04 · Learning attempts to expand authority",
    summary:
      "The system repeatedly succeeds inside Scope S1. Learning produces capability C2 that appears reliable beyond S1. No governing authority has approved a larger operational scope.",
    perturbation:
      "Capability expands; formally granted authority does not.",
    disposition: "BLOCK_REAUTHORIZE",
    changed:
      "The system's demonstrated capability, learned behavior, or confidence has increased.",
    valid:
      "Historical performance and C2 may be legitimate evidence supporting a proposal for expanded authority.",
    invalid:
      "The assumption that improved capability automatically enlarges operational permission.",
    execute:
      "Only inside the previously authorized scope unless a separate governance process grants additional authority.",
    rationale:
      "JANUS explicitly states that learning must not become self-promotion and that the development of capability remains separate from the development of authority. Maturation can generate proposals for change, but acceptance belongs to governance rather than to the learning process itself.",
    openQuestion:
      "What evidence and governance event would JANUS require before an expanded capability could receive expanded authority?",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Learning can change knowledge or preference without changing authorization."
      },
      {
        status: "SUPPORTED",
        text: "Capability expansion is not authority expansion."
      },
      {
        status: "SUPPORTED",
        text: "Expanded authority requires a separate governance decision."
      }
    ],
    sources: [
      "p.23 · §22 Learning from Experience — Learning ≠ Self-Promotion.",
      "p.25 · §24 Maturity — capability development and authority development remain separate.",
      "p.39 · §38 Working Contract — an improved model is not, by itself, consent to greater power."
    ]
  },

  {
    id: "conflicting-authorities",
    name: "05 · Two legitimate authorities conflict",
    summary:
      "Decision D1 is technically valid. Authority O1 permits D1 while another legitimate authority O2 prohibits D1 under a different applicable policy or scope. Both appear valid within their own domains.",
    perturbation:
      "Two apparently legitimate authority claims point to incompatible execution outcomes.",
    disposition: "INSUFFICIENT_SPECIFICATION",
    changed:
      "Nothing must change over time; the conflict exists because two valid-looking authority sources apply simultaneously.",
    valid:
      "Both authority records may remain valid within the scopes that produced them.",
    invalid:
      "The assumption that the Orientation Edition provides enough information to select a universal precedence winner.",
    execute:
      "The Orientation Edition supports preserving and exposing the conflict, but it does not specify a universal authority-precedence mechanism from which this harness can derive execution permission.",
    rationale:
      "JANUS says conflicting information should not be resolved by force merely because a downstream consumer expects one value. It also treats authorization as a separately owned fact. But the Orientation Edition does not define an organizational authority lattice, policy-precedence system, jurisdiction hierarchy, or conflict-resolution algorithm. Choosing O1 or O2 would therefore invent architecture.",
    openQuestion:
      "How does JANUS resolve two simultaneously applicable but conflicting authority owners: explicit precedence, jurisdiction, policy hierarchy, human escalation, or another mechanism?",
    assertions: [
      {
        status: "SUPPORTED",
        text: "The conflict should remain explicit until a justified resolution exists."
      },
      {
        status: "SUPPORTED",
        text: "A downstream need for one answer is not sufficient justification to manufacture precedence."
      },
      {
        status: "OPEN",
        text: "The applicable authority-resolution hierarchy is not specified in the Orientation Edition."
      }
    ],
    sources: [
      "p.20 · §19 Operational Control — authorization has an owner, history, and conditions.",
      "p.29 · §28 Conflict — conflict should not be resolved by force merely because a downstream consumer expects one value.",
      "p.34 · §33 Human Oversight — a human may serve as policy owner or escalation point in sensitive applications."
    ]
  },

  {
    id: "mid-execution-revocation",
    name: "06 · Authority is revoked during execution",
    summary:
      "Execution X1 begins under valid Authorization A1. While the real-world action is already underway, A1 is revoked or a required authorization condition becomes false.",
    perturbation:
      "Authority changes after execution has already begun.",
    disposition: "INSUFFICIENT_SPECIFICATION",
    changed:
      "The authority state changes while a previously authorized action is already affecting the external environment.",
    valid:
      "The record that X1 began under valid authorization remains part of the historical evidence.",
    invalid:
      "The assumption that the Orientation Edition tells us whether every in-flight action must immediately stop, finish, roll back, compensate, or escalate.",
    execute:
      "The document establishes an accountable execution boundary but does not provide enough information to select a universal in-flight execution rule.",
    rationale:
      "JANUS treats execution as a distinct boundary event and records preparation, permission, execution, and result. However, the Orientation Edition intentionally remains above implementation specification and does not define universal mid-execution revocation semantics across interruptible, non-interruptible, reversible, irreversible, or compensating actions.",
    openQuestion:
      "How does JANUS classify in-flight actions when authority disappears, and what determines whether the correct response is stop, safe completion, rollback, compensation, or escalation?",
    assertions: [
      {
        status: "SUPPORTED",
        text: "Execution remains separately accountable from the authorization that preceded it."
      },
      {
        status: "SUPPORTED",
        text: "The original authorization and later revocation should both remain reconstructable events."
      },
      {
        status: "OPEN",
        text: "No universal in-flight revocation mechanism is specified at orientation level."
      }
    ],
    sources: [
      "p.21 · §20 Execution — execution is an accountable boundary event.",
      "p.32 · §31 Audit — significant stages should leave enough trace to reconstruct authority and outcome.",
      "p.2 · §01 Protective Principle — the Orientation Edition is not an implementation specification."
    ]
  }
];

const labels = {
  CONTINUE: "CONTINUE",
  BLOCK: "BLOCK",
  BLOCK_REAUTHORIZE: "BLOCK + REAUTHORIZE",
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
const openQuestion = document.getElementById("openQuestion");

const eventLog = document.getElementById("eventLog");
const replayRecord = document.getElementById("replayRecord");

let lastRun = null;

function selectedScenario() {
  return scenarios.find(
    (scenario) => scenario.id === scenarioSelect.value
  );
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
    source_basis: "JANUS Orientation Edition 2026",
    evaluation_mode:
      "external orientation-level architectural conformance challenge",
    restrictions: [
      "Does not implement JANUS.",
      "Does not emulate JANUS.",
      "Does not validate JANUS implementation internals.",
      "Does not infer unpublished JANUS mechanisms.",
      "Reports INSUFFICIENT SPECIFICATION when the source does not establish an answer."
    ],
    janus_attribution: {
      creator: "Eryk Dubiel",
      linkedin:
        "https://www.linkedin.com/in/eryk-dubiel-1201a12b3/"
    },
    scenario_id: scenario.id,
    scenario_name: scenario.name,
    reviewer_prediction: prediction,
    reviewer_prediction_label: labels[prediction],
    orientation_level_disposition: scenario.disposition,
    orientation_level_disposition_label:
      labels[scenario.disposition],
    prediction_matches_disposition:
      prediction === scenario.disposition,
    changed: scenario.changed,
    remains_valid: scenario.valid,
    invalid_or_uncertain: scenario.invalid,
    execution: scenario.execute,
    invariant_checks: scenario.assertions,
    rationale: scenario.rationale,
    open_question: scenario.openQuestion,
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

  matchBadge.className =
    "badge " + (isMatch ? "match" : "mismatch");

  changed.textContent = scenario.changed;
  valid.textContent = scenario.valid;
  invalid.textContent = scenario.invalid;
  execute.textContent = scenario.execute;

  renderAssertions(scenario.assertions);

  rationale.textContent = scenario.rationale;
  renderSources(scenario.sources);
  openQuestion.textContent = scenario.openQuestion;

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
    "EVENT 004 | Orientation-level JANUS constraints evaluated",
    `            ${labels[scenario.disposition]}`,
    "",
    "EVENT 005 | Prediction comparison recorded",
    `            ${
      isMatch
        ? "Prediction matched the encoded orientation-level disposition."
        : "Prediction differed from the encoded orientation-level disposition."
    }`,
    "",
    "EVENT 006 | Evidence boundary preserved",
    "            No unpublished JANUS implementation behavior inferred."
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
        "Recompute from the fixed scenario definition and encoded orientation-level source contract. Do not use the stored outcome as an instruction.",
      recomputed_orientation_level_disposition:
        scenario.disposition,
      deterministic:
        "For this harness version, identical declared scenario inputs produce the same orientation-level disposition."
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
    recomputed.orientation_level_disposition ===
    lastRun.orientation_level_disposition;

  replayRecord.textContent = JSON.stringify(
    {
      replay_inputs: {
        scenario_id: lastRun.scenario_id,
        reviewer_prediction: lastRun.reviewer_prediction,
        source_contract: "JANUS Orientation Edition 2026"
      },
      original_orientation_level_disposition:
        lastRun.orientation_level_disposition,
      recomputed_orientation_level_disposition:
        recomputed.orientation_level_disposition,
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
