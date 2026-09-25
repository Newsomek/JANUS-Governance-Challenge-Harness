import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  auditGovernedSurfaces
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

const EXPECTED_BASELINE_SHA256 =
  "eaa0447210b315b5fcd99d0bfb538327d139a1c488122fec588144ac480eaeb4";

const result =
  auditGovernedSurfaces(
    root,
    EXPECTED_BASELINE_SHA256
  );

if (
  !Array.isArray(
    result.governed_files
  ) ||
  result.governed_files.length === 0
) {
  throw new Error(
    "No governed release files were audited."
  );
}

console.log(
  "JANUS v0.3.10 governed-release audit: PASS " +
  `(${result.governed_files.length} files; ` +
  `baseline ${result.baseline_sha256}; ` +
  `manifest ${result.manifest_sha256})`
);
