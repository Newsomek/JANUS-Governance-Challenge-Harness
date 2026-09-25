import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";

export const BUILD_INFO_KEYS =
  Object.freeze([
    "build_id",
    "code_commit",
    "files",
    "version"
  ]);

function sameArray(a,b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function sha256(bytes) {
  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
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
      result.stderr.toString("utf8").trim()
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

  if (build.version !== "0.3.11") {
    throw new Error(
      "build-info version must be 0.3.11."
    );
  }

  if (
    build.build_id !==
    "janus-governance-challenge-harness-v0.3.11"
  ) {
    throw new Error(
      "build-info Build ID mismatch."
    );
  }

  if (
    typeof build.code_commit !== "string" ||
    !/^[0-9a-f]{40}$/i.test(
      build.code_commit
    )
  ) {
    throw new Error(
      "build-info code_commit is invalid."
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
      relativePath.includes("..")
    ) {
      throw new Error(
        `Invalid build-info path: ${relativePath}`
      );
    }

    if (
      typeof value !== "string" ||
      !/^[0-9a-f]{64}$/i.test(value)
    ) {
      throw new Error(
        `Invalid build-info hash: ${relativePath}`
      );
    }
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

  const build =
    validateBuildInfoShape(
      JSON.parse(
        fs.readFileSync(
          buildPath,
          "utf8"
        )
      )
    );

  if (
    expectedCodeCommit &&
    build.code_commit.toLowerCase() !==
      expectedCodeCommit.toLowerCase()
  ) {
    throw new Error(
      "build-info code_commit differs from approved release-state code_commit."
    );
  }

  const tree =
    git(
      root,
      [
        "ls-tree",
        "-r",
        "--name-only",
        "-z",
        build.code_commit
      ]
    )
      .stdout
      .toString("utf8")
      .split("\0")
      .filter(Boolean)
      .filter(
        p =>
          p !== "build-info.json"
      )
      .sort();

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

  for (const relativePath of tree) {
    const result =
      git(
        root,
        [
          "show",
          `${build.code_commit}:${relativePath}`
        ]
      );

    const observed =
      sha256(
        result.stdout
      );

    if (
      build.files[relativePath]
        .toLowerCase() !== observed
    ) {
      throw new Error(
        `build-info SHA-256 mismatch against bound commit: ${relativePath}`
      );
    }
  }

  return {
    version:
      build.version,
    build_id:
      build.build_id,
    code_commit:
      build.code_commit.toLowerCase(),
    file_count:
      tree.length
  };
}