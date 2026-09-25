import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

import {
  canonicalBuildInfoText
} from "./lib/build-info-schema-v0.3.12.mjs";

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
  process.env.JANUS_BUILD_EXPECTED_CODE_COMMIT;

const expectedTree =
  process.env.JANUS_BUILD_EXPECTED_CODE_TREE;

const confirmation =
  process.env.JANUS_GENERATE_BUILD_INFO;

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
  "GENERATE-FROM-EXACT-CODE-COMMIT"
) {
  throw new Error(
    "Explicit build-info generation confirmation is required."
  );
}

function git(
  args,
  encoding="buffer"
) {
  const result =
    spawnSync(
      "git",
      [
        "-C",
        root,
        ...args
      ],
      {
        encoding
      }
    );

  if (result.status !== 0) {
    const stderr =
      Buffer.isBuffer(result.stderr)
        ? result.stderr.toString("utf8")
        : String(result.stderr || "");

    throw new Error(
      `git ${args.join(" ")} failed: ${stderr.trim()}`
    );
  }

  return result.stdout;
}

const head =
  String(
    git(
      [
        "rev-parse",
        "HEAD"
      ],
      "utf8"
    )
  ).trim();

if (head !== expectedCommit) {
  throw new Error(
    "HEAD must equal the explicitly supplied code commit when generating build-info."
  );
}

const objectType =
  String(
    git(
      [
        "cat-file",
        "-t",
        expectedCommit
      ],
      "utf8"
    )
  ).trim();

if (objectType !== "commit") {
  throw new Error(
    "Expected code object must be a commit."
  );
}

const observedTree =
  String(
    git(
      [
        "rev-parse",
        `${expectedCommit}^{tree}`
      ],
      "utf8"
    )
  ).trim();

if (observedTree !== expectedTree) {
  throw new Error(
    "Expected code tree does not match expected code commit."
  );
}

const paths =
  git(
    [
      "ls-tree",
      "-r",
      "--name-only",
      "-z",
      expectedCommit
    ]
  )
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter(
      p =>
        p !== "build-info.json"
    )
    .sort(
      (a,b) =>
        a < b
          ? -1
          : a > b
            ? 1
            : 0
    );

const files = {};

for (const relativePath of paths) {
  const bytes =
    git(
      [
        "show",
        `${expectedCommit}:${relativePath}`
      ]
    );

  files[relativePath] =
    crypto
      .createHash("sha256")
      .update(bytes)
      .digest("hex");
}

const build = {
  version:
    "0.3.12",

  build_id:
    "janus-governance-challenge-harness-v0.3.12",

  code_commit:
    expectedCommit,

  files
};

fs.writeFileSync(
  path.join(
    root,
    "build-info.json"
  ),
  canonicalBuildInfoText(build),
  "utf8"
);

console.log(
  `JANUS v0.3.12 build-info generated from exact Commit A: ${paths.length} files`
);

console.log(
  `Code commit: ${expectedCommit}`
);

console.log(
  `Code tree: ${expectedTree}`
);