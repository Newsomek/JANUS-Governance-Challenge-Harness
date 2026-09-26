import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function requireText(text, needle, message) {
  if (!text.includes(needle)) throw new Error(message);
}

function forbidText(text, needle, message) {
  if (text.includes(needle)) throw new Error(message);
}

const gate = read("tests/V0_3_14_RELEASE_GATE.md");
const readme = read("README.md");
const version = read("VERSION.txt");
const changelog = read("CHANGELOG.md");
const index = read("index.html");

requireText(gate, "V0313-F01", "Current release gate must explicitly name V0313-F01.");
requireText(gate, "V0312-F01 is independently CLOSED", "Gate must record V0312-F01 as independently closed.");

forbidText(
  gate,
  "3. `node tests/v0.3.11-regression.mjs`",
  "Historical v0.3.11 regression must not be a current numbered gate."
);

forbidText(
  gate,
  "3. `node tests/v0.3.12-regression.mjs`",
  "Historical v0.3.12 regression must not be a current numbered gate."
);

requireText(gate, "`node tests/v0.3.14-regression.mjs`", "Current v0.3.14 regression is absent from the gate.");
requireText(gate, "`node tests/v0.3.14-doc-audit.mjs`", "Current documentation audit is absent from the gate.");

requireText(readme, "### Current v0.3.14 control suites", "README must identify current v0.3.14 controls.");
requireText(readme, "v0.3.12 control suites (historical):", "README must label v0.3.12 controls historical.");
requireText(readme, "V0313-F01", "README must identify V0313-F01.");

requireText(version, "Version: 0.3.14", "VERSION.txt must identify v0.3.14.");
requireText(version, "V0313-F01", "VERSION.txt must identify V0313-F01.");

requireText(changelog, "## v0.3.14", "CHANGELOG must contain v0.3.14.");

requireText(index, "VERSION 0.3.14", "Visible eyebrow must identify v0.3.14.");
requireText(index, "V0313-F01", "Independent-test record must identify V0313-F01.");

console.log("JANUS v0.3.14 documentation audit: PASS");
