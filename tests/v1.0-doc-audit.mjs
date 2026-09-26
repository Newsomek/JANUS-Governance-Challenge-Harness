import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = process.env.JANUS_TEST_ROOT
  ? path.resolve(process.env.JANUS_TEST_ROOT)
  : path.resolve(here, "..");

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function requireText(text, needle, message) {
  if (!text.includes(needle)) throw new Error(message);
}

function forbidText(text, needle, message) {
  if (text.includes(needle)) throw new Error(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const gate = read("tests/V1_0_RELEASE_GATE.md");
const readme = read("README.md");
const version = read("VERSION.txt");
const changelog = read("CHANGELOG.md");
const index = read("index.html");

requireText(
  gate,
  "V0314-F01",
  "v1.0 gate must explicitly address V0314-F01."
);

requireText(
  gate,
  "V0313-F01",
  "v1.0 gate must preserve the V0313-F01 closure lineage."
);

requireText(
  gate,
  "`node tests/v1.0-regression.mjs`",
  "Current v1.0 regression is absent from the gate."
);

requireText(
  gate,
  "`node tests/v1.0-doc-audit.mjs`",
  "Current v1.0 documentation audit is absent from the gate."
);

requireText(
  readme,
  "### Current v1.0 candidate control suites",
  "README must identify current v1.0 candidate controls."
);

requireText(
  readme,
  "v0.3.14 control suites (historical):",
  "README must label v0.3.14 controls historical."
);

forbidText(
  readme,
  "Current local release gates are:",
  "README contains a stale historical 'Current local release gates are:' label."
);

const readmeLines = readme.split(/\r?\n/);
let activeVersion = null;

for (const line of readmeLines) {
  const heading = line.match(/^## (v[0-9][^ ]*)/);

  if (heading) {
    activeVersion = heading[1];
  }

  if (
    activeVersion &&
    activeVersion !== "v1.0" &&
    /^### Current v/i.test(line)
  ) {
    throw new Error(
      `Historical README section ${activeVersion} contains a current-version control heading: ${line}`
    );
  }
}

requireText(
  version,
  "Version: 1.0",
  "VERSION.txt must identify the v1.0 candidate."
);

requireText(
  version,
  "Status: release candidate",
  "VERSION.txt must explicitly identify v1.0 as a release candidate."
);

requireText(
  version,
  "V0312-F01 closure (v0.3.13):",
  "VERSION.txt must preserve V0312-F01 closure attribution."
);

requireText(
  version,
  "V0313-F01 / V0314-F01 closure work:",
  "VERSION.txt must describe the current documentation closure work."
);

const v0312Start = version.indexOf("V0312-F01 closure (v0.3.13):");
const currentClosureStart =
  version.indexOf("V0313-F01 / V0314-F01 closure work:");

assert(
  v0312Start >= 0 &&
  currentClosureStart > v0312Start,
  "VERSION.txt closure sections are missing or out of order."
);

const v0312Section =
  version.slice(v0312Start, currentClosureStart);

requireText(
  v0312Section,
  "EXPECTED_CONTRACT_HASHES.json",
  "V0312-F01 section must retain the contract-oracle correction."
);

const currentClosureSection =
  version.slice(currentClosureStart);

forbidText(
  currentClosureSection,
  "EXPECTED_CONTRACT_HASHES.json no longer presents 0.3.9",
  "V0313/V0314 closure section must not inherit the V0312 oracle bullets."
);

assert(
  changelog.startsWith("# Changelog\n") ||
  changelog.startsWith("# Changelog\r\n"),
  "CHANGELOG.md must begin with '# Changelog'."
);

requireText(
  changelog,
  "## v1.0 — release candidate",
  "CHANGELOG must contain the v1.0 candidate entry."
);

requireText(
  index,
  "VERSION 1.0",
  "Visible eyebrow must identify Version 1.0."
);

requireText(
  index,
  "v1.0",
  "Public page must identify the v1.0 candidate."
);

console.log("JANUS v1.0 documentation audit: PASS");
