import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const GOVERNED_SURFACES = Object.freeze([
  "README.md",
  "CHANGELOG.md",
  "VERSION.txt",
  "index.html"
]);

export const BASELINE_RELATIVE_PATH =
  "docs/APPROVED_GOVERNED_SURFACES.json";

export function sha256Bytes(bytes) {
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

export function sha256File(filePath) {
  return sha256Bytes(fs.readFileSync(filePath));
}

export function readBaselineRaw(root) {
  return fs.readFileSync(
    path.join(root,BASELINE_RELATIVE_PATH)
  );
}

export function loadBaseline(root) {
  return JSON.parse(
    readBaselineRaw(root).toString("utf8")
  );
}

export function validateBaselineShape(baseline) {
  if (!baseline || typeof baseline !== "object") {
    throw new Error(
      "Governed-surface baseline must be an object."
    );
  }

  if (baseline.schema !== 1) {
    throw new Error(
      "Governed-surface baseline schema mismatch."
    );
  }

  if (
    baseline.control !==
    "exact-governed-surface-baseline"
  ) {
    throw new Error(
      "Governed-surface baseline control mismatch."
    );
  }

  if (
    baseline.bootstrap_source_release_head !==
    "aaace7f5354f40ddba1cf6c2084492c76e147ca4"
  ) {
    throw new Error(
      "Governed-surface bootstrap release identity mismatch."
    );
  }

  if (
    !baseline.governed_surfaces ||
    typeof baseline.governed_surfaces !== "object" ||
    Array.isArray(baseline.governed_surfaces)
  ) {
    throw new Error(
      "Governed-surface baseline surface map is invalid."
    );
  }

  const actualKeys =
    Object.keys(baseline.governed_surfaces).sort();

  const expectedKeys =
    [...GOVERNED_SURFACES].sort();

  if (
    JSON.stringify(actualKeys) !==
    JSON.stringify(expectedKeys)
  ) {
    throw new Error(
      "Governed-surface baseline must contain exactly the four controlled surfaces."
    );
  }

  for (const surface of GOVERNED_SURFACES) {
    const entry =
      baseline.governed_surfaces[surface];

    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.sha256 !== "string" ||
      !/^[0-9a-f]{64}$/i.test(entry.sha256)
    ) {
      throw new Error(
        `Invalid governed-surface SHA-256 entry: ${surface}`
      );
    }
  }
}

export function auditGovernedSurfaces(
  root,
  expectedBaselineSha256
) {
  const rawBaseline = readBaselineRaw(root);
  const baselineFileSha =
    sha256Bytes(rawBaseline);

  if (
    baselineFileSha !==
    expectedBaselineSha256
  ) {
    throw new Error(
      "Approved governed-surface baseline changed without corresponding reviewed audit binding."
    );
  }

  const baseline =
    JSON.parse(rawBaseline.toString("utf8"));

  validateBaselineShape(baseline);

  const observed = {};

  for (const surface of GOVERNED_SURFACES) {
    const filePath =
      path.join(root,surface);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Governed surface missing: ${surface}`
      );
    }

    const actual =
      sha256File(filePath);

    const expected =
      baseline.governed_surfaces[surface].sha256
        .toLowerCase();

    observed[surface]={
      expected_sha256:expected,
      observed_sha256:actual,
      match:actual === expected
    };

    if (actual !== expected) {
      throw new Error(
        `${surface} differs from the explicitly reviewed governed-surface baseline.`
      );
    }
  }

  return {
    baseline_sha256:baselineFileSha,
    surfaces:observed
  };
}
