import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

import {
  BINDING_SEMANTICS,
  PROVENANCE_ONLY_FILES,
  RELEASE_SCOPE,
  canonicalReleaseStateText,
  auditCompleteReleaseState
} from "./lib/release-state-binding-v0.3.13.mjs";

const here =
  path.dirname(
    fileURLToPath(
      import.meta.url
    )
  );

const sourceRoot =
  path.resolve(
    here,
    ".."
  );

function run(root,args) {
  const result =
    spawnSync(
      "git",
      ["-C",root,...args],
      {encoding:"utf8"}
    );

  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed: ${result.stderr.trim()}`
    );
  }

  return result;
}

function text(root,args) {
  return run(root,args).stdout.trim();
}

function assert(condition,message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectFail(label,fn) {
  let failed = false;

  try {
    fn();
  }
  catch {
    failed = true;
  }

  assert(
    failed,
    `Expected failure was not detected: ${label}`
  );

  console.log(`KILLED: ${label}`);
}

function configure(root) {
  run(
    root,
    [
      "config",
      "user.email",
      "janus-fixture@example.invalid"
    ]
  );

  run(
    root,
    [
      "config",
      "user.name",
      "JANUS Fixture"
    ]
  );
}

function cloneFixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0312-lifecycle-"
      )
    );

  const result =
    spawnSync(
      "git",
      [
        "clone",
        "--quiet",
        "--no-hardlinks",
        sourceRoot,
        root
      ],
      {
        encoding:"utf8"
      }
    );

  if (result.status !== 0) {
    throw new Error(
      `Fixture clone failed: ${result.stderr}`
    );
  }

  configure(root);
  return root;
}

function writeBoundState(root,codeCommit) {
  const codeTree =
    text(
      root,
      [
        "rev-parse",
        `${codeCommit}^{tree}`
      ]
    );

  const state = {
    schema: 1,
    control: "complete-git-tree-bound-release-state",
    version: "0.3.13",
    build_id: "janus-governance-challenge-harness-v0.3.13",
    code_commit: codeCommit,
    code_tree: codeTree,
    provenance_only_files: [...PROVENANCE_ONLY_FILES],
    scope: RELEASE_SCOPE,
    binding_semantics: BINDING_SEMANTICS
  };

  fs.writeFileSync(
    path.join(
      root,
      "docs",
      "BOUND_RELEASE_STATE.json"
    ),
    canonicalReleaseStateText(state),
    "utf8"
  );
}

function commitAll(root,message) {
  run(root,["add","-A"]);
  run(
    root,
    [
      "commit",
      "--quiet",
      "-m",
      message
    ]
  );
}

function prepareCodeCommit(root) {
  const oldStatePath =
    path.join(
      root,
      "docs",
      "APPROVED_RELEASE_STATE.json"
    );

  const newStatePath =
    path.join(
      root,
      "docs",
      "BOUND_RELEASE_STATE.json"
    );

  /*
   * The fixture clone is created from the committed repository HEAD.
   * During pre-Commit-A testing that historical HEAD still tracks the
   * old release-state filename. Normalize the fixture repository to
   * the current v0.3.13 bound-state path before creating its synthetic
   * code commit. After the real Commit A exists this branch becomes a
   * no-op because the new path is already tracked.
   */
  if (
    fs.existsSync(oldStatePath) &&
    !fs.existsSync(newStatePath)
  ) {
    run(
      root,
      [
        "mv",
        "docs/APPROVED_RELEASE_STATE.json",
        "docs/BOUND_RELEASE_STATE.json"
      ]
    );
  }

  fs.writeFileSync(
    path.join(
      root,
      "tests",
      ".v0312-lifecycle-code-marker"
    ),
    "fixture code state\n",
    "utf8"
  );

  commitAll(
    root,
    "fixture code state"
  );

  return text(
    root,
    [
      "rev-parse",
      "HEAD"
    ]
  );
}

function createValidProvenanceCommit(
  root,
  codeCommit
) {
  writeBoundState(
    root,
    codeCommit
  );

  fs.writeFileSync(
    path.join(
      root,
      "build-info.json"
    ),
    JSON.stringify(
      {
        fixture:
          "provenance"
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  run(
    root,
    [
      "add",
      "build-info.json",
      "docs/BOUND_RELEASE_STATE.json"
    ]
  );

  run(
    root,
    [
      "commit",
      "--quiet",
      "-m",
      "fixture provenance state"
    ]
  );
}

/* 1. Final mode with zero provenance commits => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    expectFail(
      "final mode with zero provenance commits",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 2. Exactly one clean provenance commit => pass. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    createValidProvenanceCommit(
      root,
      codeCommit
    );

    const result =
      auditCompleteReleaseState(
        root,
        {
          requireFinalRelease:true
        }
      );

    assert(
      result.commits_after_code === 1,
      "Expected exactly one provenance commit."
    );

    console.log(
      "PASS: exactly one clean provenance commit"
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 3. Commit B changing only one provenance file => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    run(
      root,
      [
        "add",
        "docs/BOUND_RELEASE_STATE.json"
      ]
    );

    run(
      root,
      [
        "commit",
        "--quiet",
        "-m",
        "fixture incomplete provenance commit"
      ]
    );

    expectFail(
      "Commit B changing only one provenance file",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 4. Merge-style Commit B with extra parent => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    fs.writeFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      JSON.stringify(
        {
          fixture:
            "provenance"
        },
        null,
        2
      ) + "\n",
      "utf8"
    );

    run(
      root,
      [
        "add",
        "build-info.json",
        "docs/BOUND_RELEASE_STATE.json"
      ]
    );

    const provenanceTree =
      text(
        root,
        [
          "write-tree"
        ]
      );

    const secondParent =
      text(
        root,
        [
          "rev-parse",
          `${codeCommit}^`
        ]
      );

    const mergeCommit =
      text(
        root,
        [
          "commit-tree",
          provenanceTree,
          "-p",
          codeCommit,
          "-p",
          secondParent,
          "-m",
          "fixture merge provenance commit"
        ]
      );

    run(
      root,
      [
        "reset",
        "--hard",
        mergeCommit
      ]
    );

    expectFail(
      "Commit B with more than one parent",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 5. Uncommitted provenance change after B => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    createValidProvenanceCommit(
      root,
      codeCommit
    );

    fs.appendFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      "\n",
      "utf8"
    );

    expectFail(
      "uncommitted provenance change after Commit B",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 6. New tracked file committed in B => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    fs.writeFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      JSON.stringify(
        {
          fixture:
            "provenance"
        },
        null,
        2
      ) + "\n",
      "utf8"
    );

    fs.writeFileSync(
      path.join(
        root,
        "status.html"
      ),
      "Version 1.0 APPROVED\n",
      "utf8"
    );

    commitAll(
      root,
      "fixture provenance with unauthorized tracked file"
    );

    expectFail(
      "new tracked file committed in provenance Commit B",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 7. Second provenance commit => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit = prepareCodeCommit(root);

    createValidProvenanceCommit(
      root,
      codeCommit
    );

    fs.appendFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      "\n",
      "utf8"
    );

    run(
      root,
      [
        "add",
        "build-info.json"
      ]
    );

    run(
      root,
      [
        "commit",
        "--quiet",
        "-m",
        "fixture second provenance commit"
      ]
    );

    expectFail(
      "second provenance commit after code commit",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 8. Provenance file mode change in B => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit =
      prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    fs.writeFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      JSON.stringify(
        {
          fixture:
            "provenance"
        },
        null,
        2
      ) + "\n",
      "utf8"
    );

    run(
      root,
      [
        "add",
        "build-info.json",
        "docs/BOUND_RELEASE_STATE.json"
      ]
    );

    run(
      root,
      [
        "update-index",
        "--chmod=+x",
        "build-info.json"
      ]
    );

    run(
      root,
      [
        "commit",
        "--quiet",
        "-m",
        "fixture provenance mode change"
      ]
    );

    run(
      root,
      [
        "reset",
        "--hard",
        "HEAD"
      ]
    );

    const entry =
      text(
        root,
        [
          "ls-tree",
          "HEAD",
          "--",
          "build-info.json"
        ]
      );

    assert(
      entry.startsWith(
        "100755 blob "
      ),
      "Mode fixture did not create 100755 build-info.json."
    );

    expectFail(
      "Commit B provenance mode change",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 9. Provenance file Git object type change in B => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit =
      prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    fs.writeFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      "fixture-provenance-target\n",
      "utf8"
    );

    run(
      root,
      [
        "add",
        "build-info.json",
        "docs/BOUND_RELEASE_STATE.json"
      ]
    );

    const blob =
      text(
        root,
        [
          "rev-parse",
          ":build-info.json"
        ]
      );

    run(
      root,
      [
        "update-index",
        "--cacheinfo",
        `120000,${blob},build-info.json`
      ]
    );

    run(
      root,
      [
        "commit",
        "--quiet",
        "-m",
        "fixture provenance type change"
      ]
    );

    run(
      root,
      [
        "reset",
        "--hard",
        "HEAD"
      ]
    );

    const entry =
      text(
        root,
        [
          "ls-tree",
          "HEAD",
          "--",
          "build-info.json"
        ]
      );

    assert(
      entry.startsWith(
        "120000 blob "
      ),
      "Type fixture did not create symlink-type build-info.json."
    );

    expectFail(
      "Commit B provenance Git object type change",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

/* 10. Provenance path rename in B => fail. */
{
  const root = cloneFixture();

  try {
    const codeCommit =
      prepareCodeCommit(root);

    writeBoundState(
      root,
      codeCommit
    );

    fs.writeFileSync(
      path.join(
        root,
        "build-info.json"
      ),
      JSON.stringify(
        {
          fixture:
            "provenance"
        },
        null,
        2
      ) + "\n",
      "utf8"
    );

    run(
      root,
      [
        "add",
        "build-info.json",
        "docs/BOUND_RELEASE_STATE.json"
      ]
    );

    run(
      root,
      [
        "mv",
        "build-info.json",
        "build-info-renamed.json"
      ]
    );

    commitAll(
      root,
      "fixture provenance rename"
    );

    expectFail(
      "Commit B provenance path rename",
      () =>
        auditCompleteReleaseState(
          root,
          {
            requireFinalRelease:true
          }
        )
    );
  }
  finally {
    fs.rmSync(
      root,
      {
        recursive:true,
        force:true
      }
    );
  }
}

console.log(
  "JANUS v0.3.13 release lifecycle fixtures: PASS"
);