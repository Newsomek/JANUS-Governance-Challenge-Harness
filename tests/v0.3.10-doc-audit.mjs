import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  auditGovernedSurfaces,
  GOVERNED_SURFACES
} from "./lib/governed-surface-baseline.mjs";

const here =
  path.dirname(fileURLToPath(import.meta.url));

const root =
  process.env.JANUS_TEST_ROOT
    ? path.resolve(process.env.JANUS_TEST_ROOT)
    : path.resolve(here,"..");

const EXPECTED_BASELINE_SHA256 =
  "1ab1e200ac86feeda4ed07dda639641c69da8477b1cf9f32b791b010ddd50a0a";

const result =
  auditGovernedSurfaces(
    root,
    EXPECTED_BASELINE_SHA256
  );

if (
  Object.keys(result.surfaces).length !==
  GOVERNED_SURFACES.length
) {
  throw new Error(
    "Governed-surface audit coverage mismatch."
  );
}

console.log(
  "JANUS v0.3.10 exact governed-surface audit: PASS " +
  `(${GOVERNED_SURFACES.length}/${GOVERNED_SURFACES.length} surfaces; ` +
  `baseline ${result.baseline_sha256})`
);
