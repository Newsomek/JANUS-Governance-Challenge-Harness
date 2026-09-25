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
  "bdf484238c3a0d76e426f57cf0c6cdc621920737cc2121136f49f003835af146";

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
