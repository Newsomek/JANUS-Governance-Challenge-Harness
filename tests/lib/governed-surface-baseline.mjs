import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const BASELINE_RELATIVE_PATH =
  "docs/APPROVED_GOVERNED_SURFACES.json";

export function sha256Bytes(bytes) {
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

export function sha256File(filePath) {
  return sha256Bytes(
    fs.readFileSync(filePath)
  );
}

export function readJsonFile(filePath) {
  return JSON.parse(
    fs.readFileSync(filePath,"utf8")
  );
}

export function readBaselineRaw(root) {
  return fs.readFileSync(
    path.join(
      root,
      BASELINE_RELATIVE_PATH
    )
  );
}

export function loadBaseline(root) {
  return JSON.parse(
    readBaselineRaw(root).toString("utf8")
  );
}

export function validateRelativePath(value) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    path.isAbsolute(value) ||
    value.includes("..") ||
    value.includes("\\")
  ) {
    throw new Error(
      `Invalid governed release path: ${value}`
    );
  }
}

export function validateManifest(manifest) {
  if (
    !manifest ||
    typeof manifest !== "object"
  ) {
    throw new Error(
      "Governed-file manifest must be an object."
    );
  }

  if (manifest.schema !== 1) {
    throw new Error(
      "Governed-file manifest schema mismatch."
    );
  }

  if (
    manifest.control !==
    "versioned-governed-release-file-set"
  ) {
    throw new Error(
      "Governed-file manifest control mismatch."
    );
  }

  if (
    !Array.isArray(manifest.files) ||
    manifest.files.length === 0
  ) {
    throw new Error(
      "Governed-file manifest must contain at least one file."
    );
  }

  const seen =
    new Set();

  for (const file of manifest.files) {
    validateRelativePath(file);

    if (seen.has(file)) {
      throw new Error(
        `Duplicate governed release file: ${file}`
      );
    }

    seen.add(file);
  }

  return [...manifest.files];
}

export function validateBaselineShape(baseline) {
  if (
    !baseline ||
    typeof baseline !== "object"
  ) {
    throw new Error(
      "Governed baseline must be an object."
    );
  }

  if (baseline.schema !== 2) {
    throw new Error(
      "Governed baseline schema mismatch."
    );
  }

  if (
    baseline.control !==
    "exact-governed-release-baseline"
  ) {
    throw new Error(
      "Governed baseline control mismatch."
    );
  }

  const manifestRef =
    baseline.governed_file_manifest;

  if (
    !manifestRef ||
    typeof manifestRef.path !== "string" ||
    !/^[0-9a-f]{64}$/i.test(
      String(manifestRef.sha256 || "")
    )
  ) {
    throw new Error(
      "Governed-file manifest binding is invalid."
    );
  }

  validateRelativePath(
    manifestRef.path
  );

  if (
    !baseline.governed_files ||
    typeof baseline.governed_files !== "object" ||
    Array.isArray(
      baseline.governed_files
    )
  ) {
    throw new Error(
      "Governed baseline file map is invalid."
    );
  }
}

export function auditGovernedSurfaces(
  root,
  expectedBaselineSha256
) {
  const rawBaseline =
    readBaselineRaw(root);

  const baselineFileSha =
    sha256Bytes(rawBaseline);

  if (
    baselineFileSha !==
    expectedBaselineSha256
  ) {
    throw new Error(
      "Approved governed baseline changed without explicit audit rebinding."
    );
  }

  const baseline =
    JSON.parse(
      rawBaseline.toString("utf8")
    );

  validateBaselineShape(
    baseline
  );

  const manifestPath =
    path.join(
      root,
      baseline.governed_file_manifest.path
    );

  if (
    !fs.existsSync(manifestPath)
  ) {
    throw new Error(
      "Governed-file manifest is missing."
    );
  }

  const actualManifestSha =
    sha256File(manifestPath);

  if (
    actualManifestSha !==
    baseline.governed_file_manifest.sha256
      .toLowerCase()
  ) {
    throw new Error(
      "Governed-file manifest changed without explicit approval."
    );
  }

  const manifest =
    readJsonFile(manifestPath);

  const governedFiles =
    validateManifest(manifest);

  const manifestSet =
    [...governedFiles].sort();

  const baselineSet =
    Object.keys(
      baseline.governed_files
    ).sort();

  if (
    JSON.stringify(manifestSet) !==
    JSON.stringify(baselineSet)
  ) {
    throw new Error(
      "Governed-file manifest and approved baseline file set differ."
    );
  }

  const observed={};

  for (
    const relativePath
    of governedFiles
  ) {
    const entry =
      baseline.governed_files[
        relativePath
      ];

    if (
      !entry ||
      typeof entry.sha256 !== "string" ||
      !/^[0-9a-f]{64}$/i.test(
        entry.sha256
      )
    ) {
      throw new Error(
        `Invalid approved hash for ${relativePath}`
      );
    }

    const absolutePath =
      path.join(
        root,
        relativePath
      );

    if (
      !fs.existsSync(
        absolutePath
      )
    ) {
      throw new Error(
        `Governed release file missing: ${relativePath}`
      );
    }

    const actual =
      sha256File(
        absolutePath
      );

    const expected =
      entry.sha256
        .toLowerCase();

    observed[
      relativePath
    ]={
      expected_sha256:
        expected,
      observed_sha256:
        actual,
      match:
        actual === expected
    };

    if (
      actual !== expected
    ) {
      throw new Error(
        `${relativePath} differs from the explicitly approved release baseline.`
      );
    }
  }

  return {
    baseline_sha256:
      baselineFileSha,
    manifest_sha256:
      actualManifestSha,
    governed_files:
      governedFiles,
    files:
      observed
  };
}
