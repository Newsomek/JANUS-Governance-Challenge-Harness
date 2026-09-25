import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  APPROVAL_SEMANTICS,
  PROVENANCE_ONLY_FILES,
  RELEASE_SCOPE,
  RELEASE_STATE_RELATIVE_PATH,
  canonicalReleaseStateText,
  getHead,
  getHeadTree,
  getUntracked
} from "./lib/release-state-binding-v0.3.12.mjs";

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

const expectedCommit =
  process.env
    .JANUS_BIND_EXPECTED_CODE_COMMIT;

const expectedTree =
  process.env
    .JANUS_BIND_EXPECTED_CODE_TREE;

const confirmation =
  process.env
    .JANUS_BIND_RELEASE_STATE;

if (
  !expectedCommit ||
  !/^[0-9a-f]{40}$/.test(
    expectedCommit
  )
) {
  throw new Error(
    "Explicit lowercase expected code commit is required."
  );
}

if (
  !expectedTree ||
  !/^[0-9a-f]{40}$/.test(
    expectedTree
  )
) {
  throw new Error(
    "Explicit lowercase expected code tree is required."
  );
}

if (
  confirmation !==
  "BIND-EXACT-CODE-COMMIT-AND-TREE"
) {
  throw new Error(
    "Explicit release-state binding confirmation is required."
  );
}

const head =
  getHead(root);

const tree =
  getHeadTree(root);

if (head !== expectedCommit) {
  throw new Error(
    "HEAD does not match operator-supplied expected code commit."
  );
}

if (tree !== expectedTree) {
  throw new Error(
    "HEAD tree does not match operator-supplied expected code tree."
  );
}

const untracked =
  getUntracked(root)
    .filter(
      p =>
        p !== RELEASE_STATE_RELATIVE_PATH
    );

if (untracked.length !== 0) {
  throw new Error(
    "Cannot bind while untracked files exist, including ignored/excluded paths: " +
    untracked.join(", ")
  );
}

const state = {
  schema:
    1,

  control:
    "complete-git-tree-release-state",

  version:
    "0.3.12",

  build_id:
    "janus-governance-challenge-harness-v0.3.12",

  code_commit:
    head,

  code_tree:
    tree,

  provenance_only_files:
    [...PROVENANCE_ONLY_FILES],

  scope:
    RELEASE_SCOPE,

  approval_semantics:
    APPROVAL_SEMANTICS
};

const target =
  path.join(
    root,
    RELEASE_STATE_RELATIVE_PATH
  );

fs.writeFileSync(
  target,
  canonicalReleaseStateText(state),
  "utf8"
);

console.log(
  "JANUS v0.3.12 RELEASE STATE BOUND."
);

console.log(
  `Code commit: ${state.code_commit}`
);

console.log(
  `Code tree: ${state.code_tree}`
);

console.log(
  "Binding semantics: workflow declaration only; no authentication or proof of human review."
);