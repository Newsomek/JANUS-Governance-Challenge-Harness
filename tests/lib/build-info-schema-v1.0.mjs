import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";

import {
  PROVENANCE_ONLY_FILES
} from "./release-state-binding-v1.0.mjs";

export const BUILD_INFO_KEYS =
  Object.freeze([
    "build_id",
    "code_commit",
    "files",
    "version"
  ]);

function sameArray(a,b) {
  return JSON.stringify(a) ===
    JSON.stringify(b);
}

function sha256(bytes) {
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function lexicalSort(values) {
  return [...values]
    .sort(
      (a,b) =>
        a < b
          ? -1
          : a > b
            ? 1
            : 0
    );
}

function git(root,args) {
  const result =
    spawnSync(
      "git",
      ["-C",root,...args],
      {
        encoding:"buffer"
      }
    );

  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed: ` +
      result.stderr
        .toString("utf8")
        .trim()
    );
  }

  return result;
}

export function validateBuildInfoShape(
  build
) {
  if (
    !build ||
    typeof build !== "object" ||
    Array.isArray(build)
  ) {
    throw new Error(
      "build-info.json must contain an object."
    );
  }

  const keys =
    Object.keys(build)
      .sort();

  const expected =
    [...BUILD_INFO_KEYS]
      .sort();

  if (!sameArray(keys,expected)) {
    throw new Error(
      "build-info.json keys differ from the fixed schema."
    );
  }

  if (build.version !== "1.0") {
    throw new Error(
      "build-info version must be 1.0."
    );
  }

  if (
    build.build_id !==
    "janus-governance-challenge-harness-v1.0"
  ) {
    throw new Error(
      "build-info Build ID mismatch."
    );
  }

  if (
    typeof build.code_commit !== "string" ||
    !/^[0-9a-f]{40}$/.test(
      build.code_commit
    )
  ) {
    throw new Error(
      "build-info code_commit must be a lowercase 40-character Git object ID."
    );
  }

  if (
    !build.files ||
    typeof build.files !== "object" ||
    Array.isArray(build.files)
  ) {
    throw new Error(
      "build-info files map is invalid."
    );
  }

  for (
    const [relativePath,value]
    of Object.entries(build.files)
  ) {
    if (
      typeof relativePath !== "string" ||
      relativePath.length === 0 ||
      relativePath.includes("\\") ||
      relativePath.startsWith("/") ||
      relativePath
        .split("/")
        .some(
          segment =>
            segment.length === 0 ||
            segment === "." ||
            segment === ".."
        )
    ) {
      throw new Error(
        `Invalid build-info path: ${relativePath}`
      );
    }

    if (
      typeof value !== "string" ||
      !/^[0-9a-f]{64}$/.test(value)
    ) {
      throw new Error(
        `Invalid build-info hash: ${relativePath}`
      );
    }
  }

  return build;
}

export function canonicalBuildInfoText(
  build
) {
  validateBuildInfoShape(build);

  const files = {};

  for (
    const relativePath
    of lexicalSort(
      Object.keys(build.files)
    )
  ) {
    files[relativePath] =
      build.files[relativePath];
  }

  const canonical = {
    version:
      build.version,

    build_id:
      build.build_id,

    code_commit:
      build.code_commit,

    files
  };

  return JSON.stringify(
    canonical,
    null,
    2
  ) + "\n";
}

export function parseCanonicalBuildInfo(
  raw
) {
  if (typeof raw !== "string") {
    throw new Error(
      "build-info.json bytes must decode as UTF-8 text."
    );
  }

  let build;

  try {
    build =
      JSON.parse(raw);
  }
  catch {
    throw new Error(
      "build-info.json is invalid JSON."
    );
  }

  validateBuildInfoShape(build);

  const canonical =
    canonicalBuildInfoText(
      build
    );

  if (raw !== canonical) {
    throw new Error(
      "build-info.json bytes are not canonical JSON."
    );
  }

  return build;
}

export function auditBuildInfo(
  root,
  {
    expectedCodeCommit=null
  }={}
) {
  const buildPath =
    path.join(
      root,
      "build-info.json"
    );

  const raw =
    fs.readFileSync(
      buildPath,
      "utf8"
    );

  const build =
    parseCanonicalBuildInfo(
      raw
    );

  if (
    expectedCodeCommit &&
    build.code_commit !==
      expectedCodeCommit
  ) {
    throw new Error(
      "build-info code_commit differs from bound release-state code_commit."
    );
  }

  const objectType =
    git(
      root,
      [
        "cat-file",
        "-t",
        build.code_commit
      ]
    )
      .stdout
      .toString("utf8")
      .trim();

  if (objectType !== "commit") {
    throw new Error(
      "build-info code_commit must name a Git commit object directly."
    );
  }

  const treeEntries =
    git(
      root,
      [
        "ls-tree",
        "-r",
        "-z",
        build.code_commit
      ]
    )
      .stdout
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
      .map(entry => {
        const tab =
          entry.indexOf("\t");

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

  const tree =
    treeEntries.map(
      entry =>
        entry.relativePath
    );

  const listed =
    Object.keys(
      build.files
    )
      .sort();

  if (!sameArray(tree,listed)) {
    throw new Error(
      "build-info file set differs from bound code commit."
    );
  }

  for (const entry of treeEntries) {
    const result =
      git(
        root,
        [
          "cat-file",
          "blob",
          entry.objectId
        ]
      );

    const observed =
      sha256(
        result.stdout
      );

    if (
      build.files[entry.relativePath] !==
      observed
    ) {
      throw new Error(
        `build-info SHA-256 mismatch against bound commit: ${entry.relativePath}`
      );
    }
  }

  return {
    version:
      build.version,

    build_id:
      build.build_id,

    code_commit:
      build.code_commit,

    file_count:
      tree.length
  };
}