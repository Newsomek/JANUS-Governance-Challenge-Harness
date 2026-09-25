import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  auditCompleteReleaseState
} from "./lib/release-state-binding.mjs";

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

const finalMode =
  process.env.JANUS_FINAL_RELEASE_AUDIT ===
  "REQUIRE-FINAL-PROVENANCE-COMMIT";

const result =
  auditCompleteReleaseState(
    root,
    {
      requireFinalRelease:
        finalMode
    }
  );

console.log(
  "JANUS v0.3.11 complete-tree release-state audit: PASS"
);

console.log(
  `Mode: ${finalMode ? "FINAL RELEASE" : "CONSTRUCTION"}`
);

console.log(
  `Code commit: ${result.code_commit}`
);

console.log(
  `Code tree: ${result.code_tree}`
);

console.log(
  `Tracked release files: ${result.tracked_files}`
);

console.log(
  `Commits after code commit: ${result.commits_after_code}`
);

console.log(
  "Allowed provenance-only files: " +
  result.provenance_only_files.join(", ")
);