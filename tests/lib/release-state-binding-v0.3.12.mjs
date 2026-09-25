import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

export const RELEASE_STATE_RELATIVE_PATH =
  "docs/APPROVED_RELEASE_STATE.json";

export const PROVENANCE_ONLY_FILES =
  Object.freeze([
    "build-info.json",
    "docs/APPROVED_RELEASE_STATE.json"
  ]);

export const APPROVAL_SEMANTICS =
  "Workflow binding only; not authentication, a digital signature, deployment enforcement, or proof of human review.";

export const RELEASE_SCOPE =
  "Exact committed release state. All tracked paths and bytes outside the two provenance-only files must remain identical to code_commit.";

const EXPECTED_STATE_KEYS =
  Object.freeze([
    "approval_semantics",
    "build_id",
    "code_commit",
    "code_tree",
    "control",
    "provenance_only_files",
    "schema",
    "scope",
    "version"
  ]);

function git(
  root,
  args,
  {
    allowFailure=false
  }={}
) {
  const result =
    spawnSync(
      "git",
      ["-C",root,...args],
      {
        encoding:"utf8"
      }
    );

  if (
    !allowFailure &&
    result.status !== 0
  ) {
    throw new Error(
      `git ${args.join(" ")} failed: ` +
      `${String(result.stderr || "").trim()}`
    );
  }

  return result;
}

function gitText(root,args) {
  return git(
    root,
    args
  )
    .stdout
    .trim();
}

function nulList(text) {
  return String(text)
    .split("\0")
    .filter(Boolean)
    .sort();
}

function sameArray(a,b) {
  return JSON.stringify(a) ===
    JSON.stringify(b);
}

function validateExactKeys(
  value,
  expected,
  label
) {
  const observed =
    Object.keys(value)
      .sort();

  const wanted =
    [...expected]
      .sort();

  if (!sameArray(observed,wanted)) {
    throw new Error(
      `${label} keys differ from the fixed schema. ` +
      `Observed: ${observed.join(", ")}`
    );
  }
}

export function validateReleaseState(state) {
  if (
    !state ||
    typeof state !== "object" ||
    Array.isArray(state)
  ) {
    throw new Error(
      "Approved release state must be an object."
    );
  }

  validateExactKeys(
    state,
    EXPECTED_STATE_KEYS,
    "Approved release state"
  );

  if (state.schema !== 1) {
    throw new Error(
      "Approved release-state schema mismatch."
    );
  }

  if (
    state.control !==
    "complete-git-tree-release-state"
  ) {
    throw new Error(
      "Approved release-state control mismatch."
    );
  }

  if (state.version !== "0.3.12") {
    throw new Error(
      "Approved release-state version mismatch."
    );
  }

  if (
    state.build_id !==
    "janus-governance-challenge-harness-v0.3.12"
  ) {
    throw new Error(
      "Approved release-state build ID mismatch."
    );
  }

  if (
    typeof state.code_commit !== "string" ||
    !/^[0-9a-f]{40}$/.test(
      state.code_commit
    )
  ) {
    throw new Error(
      "Approved release-state code_commit is not a lowercase bound commit."
    );
  }

  if (
    typeof state.code_tree !== "string" ||
    !/^[0-9a-f]{40}$/.test(
      state.code_tree
    )
  ) {
    throw new Error(
      "Approved release-state code_tree is not a lowercase bound tree."
    );
  }

  if (
    !Array.isArray(
      state.provenance_only_files
    ) ||
    !sameArray(
      [...state.provenance_only_files].sort(),
      [...PROVENANCE_ONLY_FILES].sort()
    )
  ) {
    throw new Error(
      "Approved release-state provenance-only file set mismatch."
    );
  }

  if (state.scope !== RELEASE_SCOPE) {
    throw new Error(
      "Approved release-state scope text mismatch."
    );
  }

  if (
    state.approval_semantics !==
    APPROVAL_SEMANTICS
  ) {
    throw new Error(
      "Approved release-state approval semantics mismatch."
    );
  }

  return state;
}

export function canonicalReleaseStateText(
  state
) {
  validateReleaseState(state);

  const canonical = {
    schema:
      state.schema,

    control:
      state.control,

    version:
      state.version,

    build_id:
      state.build_id,

    code_commit:
      state.code_commit,

    code_tree:
      state.code_tree,

    provenance_only_files:
      [...PROVENANCE_ONLY_FILES],

    scope:
      state.scope,

    approval_semantics:
      state.approval_semantics
  };

  return JSON.stringify(
    canonical,
    null,
    2
  ) + "\n";
}

export function parseCanonicalReleaseState(
  raw
) {
  if (typeof raw !== "string") {
    throw new Error(
      "Approved release-state bytes must decode as UTF-8 text."
    );
  }

  let state;

  try {
    state =
      JSON.parse(raw);
  }
  catch {
    throw new Error(
      "Approved release-state JSON is invalid."
    );
  }

  validateReleaseState(state);

  const canonical =
    canonicalReleaseStateText(
      state
    );

  if (raw !== canonical) {
    throw new Error(
      "Approved release-state bytes are not canonical JSON."
    );
  }

  return state;
}

export function readReleaseState(root) {
  const statePath =
    path.join(
      root,
      RELEASE_STATE_RELATIVE_PATH
    );

  if (!fs.existsSync(statePath)) {
    throw new Error(
      "Approved release-state binding is missing."
    );
  }

  const raw =
    fs.readFileSync(
      statePath,
      "utf8"
    );

  return parseCanonicalReleaseState(
    raw
  );
}

export function getCommitTree(
  root,
  commit
) {
  return gitText(
    root,
    [
      "rev-parse",
      `${commit}^{tree}`
    ]
  );
}

export function getHead(root) {
  return gitText(
    root,
    [
      "rev-parse",
      "HEAD"
    ]
  );
}

export function getHeadTree(root) {
  return gitText(
    root,
    [
      "rev-parse",
      "HEAD^{tree}"
    ]
  );
}

export function getTrackedAtCommit(
  root,
  commit
) {
  const result =
    git(
      root,
      [
        "ls-tree",
        "-r",
        "--name-only",
        "-z",
        commit
      ]
    );

  return nulList(
    result.stdout
  );
}

export function getTrackedWorkingSet(root) {
  const result =
    git(
      root,
      [
        "ls-files",
        "-z"
      ]
    );

  return nulList(
    result.stdout
  );
}

export function getUntracked(root) {
  /*
   * Intentionally do NOT use --exclude-standard.
   *
   * The final release workspace refuses all filesystem paths
   * that are not tracked by Git, including paths hidden by:
   *   - .gitignore
   *   - .git/info/exclude
   *   - core.excludesFile
   *
   * Git metadata under .git is outside the release tree.
   */
  const result =
    git(
      root,
      [
        "ls-files",
        "--others",
        "-z"
      ]
    );

  return nulList(
    result.stdout
  );
}

export function getChangedFromCommit(
  root,
  commit
) {
  const result =
    git(
      root,
      [
        "diff",
        "--name-only",
        "-z",
        commit,
        "--"
      ]
    );

  return nulList(
    result.stdout
  );
}

export function getCommittedChangesAfter(
  root,
  commit
) {
  const result =
    git(
      root,
      [
        "diff",
        "--name-only",
        "-z",
        `${commit}..HEAD`
      ]
    );

  return nulList(
    result.stdout
  );
}

export function assertOnlyProvenanceChanges(
  paths,
  label
) {
  const unexpected =
    paths.filter(
      p =>
        !PROVENANCE_ONLY_FILES.includes(p)
    );

  if (unexpected.length !== 0) {
    throw new Error(
      `${label} contains non-provenance changes: ` +
      unexpected.join(", ")
    );
  }
}

export function auditCompleteReleaseState(
  root,
  {
    requireFinalRelease=false
  }={}
) {
  const state =
    readReleaseState(root);

  const commitExists =
    git(
      root,
      [
        "cat-file",
        "-e",
        `${state.code_commit}^{commit}`
      ],
      {
        allowFailure:true
      }
    );

  if (commitExists.status !== 0) {
    throw new Error(
      "Approved code_commit does not exist in this repository."
    );
  }

  const objectType =
    gitText(
      root,
      [
        "cat-file",
        "-t",
        state.code_commit
      ]
    );

  if (objectType !== "commit") {
    throw new Error(
      "Approved code_commit must name a Git commit object directly."
    );
  }

  const observedTree =
    getCommitTree(
      root,
      state.code_commit
    );

  if (
    observedTree !==
    state.code_tree
  ) {
    throw new Error(
      "Approved code_tree does not match code_commit."
    );
  }

  const ancestor =
    git(
      root,
      [
        "merge-base",
        "--is-ancestor",
        state.code_commit,
        "HEAD"
      ],
      {
        allowFailure:true
      }
    );

  if (ancestor.status !== 0) {
    throw new Error(
      "Approved code_commit is not an ancestor of HEAD."
    );
  }

  const commitCountText =
    gitText(
      root,
      [
        "rev-list",
        "--count",
        `${state.code_commit}..HEAD`
      ]
    );

  const commitCount =
    Number(commitCountText);

  if (
    !Number.isInteger(commitCount) ||
    commitCount < 0 ||
    commitCount > 1
  ) {
    throw new Error(
      "Release state permits at most one provenance commit after code_commit."
    );
  }

  if (
    requireFinalRelease &&
    commitCount !== 1
  ) {
    throw new Error(
      "Final release state requires exactly one provenance commit after code_commit."
    );
  }

  const approvedTracked =
    getTrackedAtCommit(
      root,
      state.code_commit
    );

  const currentTracked =
    getTrackedWorkingSet(root);

  if (
    !sameArray(
      approvedTracked,
      currentTracked
    )
  ) {
    const missing =
      approvedTracked.filter(
        p => !currentTracked.includes(p)
      );

    const added =
      currentTracked.filter(
        p => !approvedTracked.includes(p)
      );

    throw new Error(
      "Tracked release file set differs from approved code_commit. " +
      `Missing: ${missing.join(", ")}; ` +
      `Added: ${added.join(", ")}`
    );
  }

  const untracked =
    getUntracked(root);

  if (untracked.length !== 0) {
    throw new Error(
      "Untracked files are present in the release workspace: " +
      untracked.join(", ")
    );
  }

  const workingChanges =
    getChangedFromCommit(
      root,
      state.code_commit
    );

  assertOnlyProvenanceChanges(
    workingChanges,
    "Working release state"
  );

  if (requireFinalRelease) {
    const porcelain =
      gitText(
        root,
        [
          "status",
          "--porcelain=v1",
          "-uno"
        ]
      );

    if (porcelain.length !== 0) {
      throw new Error(
        "Final release state requires a clean tracked working tree."
      );
    }
  }

  const committedChanges =
    getCommittedChangesAfter(
      root,
      state.code_commit
    );

  assertOnlyProvenanceChanges(
    committedChanges,
    "Post-code commit history"
  );

  return {
    version:
      state.version,

    build_id:
      state.build_id,

    code_commit:
      state.code_commit,

    code_tree:
      state.code_tree,

    head:
      getHead(root).toLowerCase(),

    head_tree:
      getHeadTree(root).toLowerCase(),

    commits_after_code:
      commitCount,

    tracked_files:
      approvedTracked.length,

    provenance_only_files:
      [...PROVENANCE_ONLY_FILES],

    working_changes:
      workingChanges,

    committed_changes:
      committedChanges
  };
}