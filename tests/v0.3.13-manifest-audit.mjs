import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  readReleaseState
} from "./lib/release-state-binding-v0.3.13.mjs";

import {
  auditBuildInfo
} from "./lib/build-info-schema-v0.3.13.mjs";

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

const state =
  readReleaseState(root);

const result =
  auditBuildInfo(
    root,
    {
      expectedCodeCommit:
        state.code_commit
    }
  );

console.log(
  `JANUS v0.3.13 build-info audit: PASS (${result.file_count} files from bound code commit)`
);