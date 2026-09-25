import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  BASELINE_RELATIVE_PATH,
  loadBaseline,
  readJsonFile,
  sha256File,
  validateManifest
} from "./lib/governed-surface-baseline.mjs";

const here =
  path.dirname(
    fileURLToPath(
      import.meta.url
    )
  );

const root =
  process.env.JANUS_TEST_ROOT
    ? path.resolve(
        process.env.JANUS_TEST_ROOT
      )
    : path.resolve(
        here,
        ".."
      );

const baseline =
  loadBaseline(root);

const manifestPath =
  path.join(
    root,
    baseline.governed_file_manifest.path
  );

const manifest =
  readJsonFile(
    manifestPath
  );

const candidateFiles =
  validateManifest(
    manifest
  );

const approvedFiles =
  Object.keys(
    baseline.governed_files
  );

const approvedSet =
  new Set(
    approvedFiles
  );

const candidateSet =
  new Set(
    candidateFiles
  );

const added =
  candidateFiles.filter(
    file =>
      !approvedSet.has(file)
  );

const removed =
  approvedFiles.filter(
    file =>
      !candidateSet.has(file)
  );

const files={};

for (
  const file
  of candidateFiles
) {
  const fullPath =
    path.join(
      root,
      file
    );

  const candidateSha =
    fs.existsSync(fullPath)
      ? sha256File(fullPath)
      : null;

  const approvedSha =
    baseline
      .governed_files[
        file
      ]?.sha256 || null;

  files[file]={
    approved_sha256:
      approvedSha,
    candidate_sha256:
      candidateSha,
    changed:
      approvedSha !==
      candidateSha
  };
}

const proposal={
  schema:1,
  purpose:
    "REVIEW CANDIDATE ONLY - does not modify or approve the governed-file manifest or baseline.",
  approved_baseline:
    BASELINE_RELATIVE_PATH,
  governed_manifest:
    baseline
      .governed_file_manifest
      .path,
  added_files:
    added,
  removed_files:
    removed,
  files
};

process.stdout.write(
  JSON.stringify(
    proposal,
    null,
    2
  ) + "\n"
);
