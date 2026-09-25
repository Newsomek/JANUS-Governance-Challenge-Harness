import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

import {
  BASELINE_RELATIVE_PATH,
  sha256File,
  sha256Bytes,
  validateManifest,
  readJsonFile
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

const expectedCurrentBaselineSha =
  process.env
    .JANUS_APPROVAL_EXPECTED_BASELINE_SHA256;

const approvalToken =
  process.env
    .JANUS_EXPLICIT_RELEASE_APPROVAL;

if (
  !expectedCurrentBaselineSha ||
  !/^[0-9a-f]{64}$/i.test(
    expectedCurrentBaselineSha
  )
) {
  throw new Error(
    "Explicit current baseline SHA-256 is required."
  );
}

if (
  approvalToken !==
  "APPROVE-EXACT-RELEASE-BASELINE"
) {
  throw new Error(
    "Explicit release approval token missing."
  );
}

const baselinePath =
  path.join(
    root,
    BASELINE_RELATIVE_PATH
  );

const currentBaselineRaw =
  fs.readFileSync(
    baselinePath
  );

const currentBaselineSha =
  sha256Bytes(
    currentBaselineRaw
  );

if (
  currentBaselineSha !==
  expectedCurrentBaselineSha
    .toLowerCase()
) {
  throw new Error(
    "Current baseline SHA does not match operator-approved expected baseline."
  );
}

const currentBaseline =
  JSON.parse(
    currentBaselineRaw
      .toString("utf8")
  );

const manifestPath =
  path.join(
    root,
    currentBaseline
      .governed_file_manifest
      .path
  );

const manifest =
  readJsonFile(
    manifestPath
  );

const files =
  validateManifest(
    manifest
  );

const governedFiles={};

for (
  const relativePath
  of files
) {
  const fullPath =
    path.join(
      root,
      relativePath
    );

  if (
    !fs.existsSync(
      fullPath
    )
  ) {
    throw new Error(
      `Cannot approve missing governed file: ${relativePath}`
    );
  }

  governedFiles[
    relativePath
  ]={
    sha256:
      sha256File(
        fullPath
      )
  };
}

const newBaseline={
  schema:2,
  control:
    "exact-governed-release-baseline",
  policy:
    "Any change to the approved governed-file manifest or to any governed file requires explicit release approval.",
  bootstrap_source_release_head:
    currentBaseline
      .bootstrap_source_release_head,
  governed_file_manifest:{
    path:
      currentBaseline
        .governed_file_manifest
        .path,
    sha256:
      sha256File(
        manifestPath
      )
  },
  governed_files:
    governedFiles
};

fs.writeFileSync(
  baselinePath,
  JSON.stringify(
    newBaseline,
    null,
    2
  ) + "\n",
  "utf8"
);

const newBaselineSha =
  sha256File(
    baselinePath
  );

console.log(
  "EXPLICIT RELEASE BASELINE APPROVAL COMPLETED."
);

console.log(
  `New baseline SHA-256: ${newBaselineSha}`
);

console.log(
  `Governed files: ${files.length}`
);

for (
  const file
  of files
) {
  console.log(
    `${file} ${governedFiles[file].sha256}`
  );
}
