import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

import {
  canonicalBuildInfoText
} from "./lib/build-info-schema-v0.3.13.mjs";

import {
  PROVENANCE_ONLY_FILES
} from "./lib/release-state-binding-v0.3.13.mjs";

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

const treeEntries =
  git(
    [
      "ls-tree",
      "-r",
      "-z",
      expectedCommit
    ]
  )
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map(entry => {
      const tab = entry.indexOf("\t");

      if (tab < 0) {
        throw new Error(
          "Malformed git ls-tree entry."
        );
      }

      const metadata =
        entry.slice(0,tab);

      const relativePath =
        entry.slice(tab + 1);

      const parts =
        metadata.split(" ");

      if (
        parts.length !== 3 ||
        !/^[0-9a-f]{40}$/.test(parts[2])
      ) {
        throw new Error(
          `Malformed git ls-tree metadata for ${relativePath}.`
        );
      }

      return {
        relativePath,
        objectId: parts[2]
      };
    })
    .filter(
      entry =>
        !PROVENANCE_ONLY_FILES.includes(
          entry.relativePath
        )
    )
    .sort(
      (a,b) =>
        a.relativePath < b.relativePath
          ? -1
          : a.relativePath > b.relativePath
            ? 1
            : 0
    );

const paths =
  treeEntries.map(
    entry =>
      entry.relativePath
  );

const files = {};

for (const entry of treeEntries) {
  const bytes =
    git(
      [
        "cat-file",
        "blob",
        entry.objectId
      ]
    );

  files[entry.relativePath] =
    crypto
      .createHash("sha256")
      .update(bytes)
      .digest("hex");
}

const build = {
  version:
    "0.3.13",

  build_id:
    "janus-governance-challenge-harness-v0.3.13",

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
  `JANUS v0.3.13 build-info generated from exact Commit A: ${paths.length} files`
);

console.log(
  `Code commit: ${expectedCommit}`
);

console.log(
  `Code tree: ${expectedTree}`
);