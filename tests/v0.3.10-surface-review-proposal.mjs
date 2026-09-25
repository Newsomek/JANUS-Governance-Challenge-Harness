import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  GOVERNED_SURFACES,
  BASELINE_RELATIVE_PATH,
  loadBaseline,
  sha256File
} from "./lib/governed-surface-baseline.mjs";

const here =
  path.dirname(fileURLToPath(import.meta.url));

const root =
  process.env.JANUS_TEST_ROOT
    ? path.resolve(process.env.JANUS_TEST_ROOT)
    : path.resolve(here,"..");

const baseline =
  loadBaseline(root);

const proposal={
  schema:1,
  purpose:
    "REVIEW CANDIDATE ONLY - this output does not approve or modify the governed-surface baseline.",
  approved_baseline:
    BASELINE_RELATIVE_PATH,
  surfaces:{}
};

for(const surface of GOVERNED_SURFACES) {
  const observed =
    sha256File(path.join(root,surface));

  const approved =
    baseline.governed_surfaces[surface].sha256
      .toLowerCase();

  proposal.surfaces[surface]={
    approved_sha256:approved,
    candidate_sha256:observed,
    changed:observed !== approved
  };
}

process.stdout.write(
  JSON.stringify(proposal,null,2)+"\n"
);
