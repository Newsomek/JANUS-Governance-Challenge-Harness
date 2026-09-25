import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

import {
  APPROVAL_SEMANTICS,
  PROVENANCE_ONLY_FILES,
  RELEASE_SCOPE,
  RELEASE_STATE_RELATIVE_PATH,
  auditCompleteReleaseState
} from "./lib/release-state-binding.mjs";

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

const tempRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "janus-v0311-tree-fixtures-"
    )
  );

const assert =
  (condition,message) => {
    if (!condition) {
      throw new Error(message);
    }
  };

function runGit(root,args) {
  const result =
    spawnSync(
      "git",
      ["-C",root,...args],
      {
        encoding:"utf8"
      }
    );

  if (result.status !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed: ` +
      `${result.stderr}`
    );
  }

  return result.stdout.trim();
}

function writeText(root,relative,text) {
  const target =
    path.join(
      root,
      relative
    );

  fs.mkdirSync(
    path.dirname(target),
    {
      recursive:true
    }
  );

  fs.writeFileSync(
    target,
    text,
    "utf8"
  );
}

function boundState(commit,tree) {
  return {
    schema:1,
    control:
      "complete-git-tree-release-state",
    version:
      "0.3.11",
    build_id:
      "janus-governance-challenge-harness-v0.3.11",
    code_commit:
      commit,
    code_tree:
      tree,
    provenance_only_files:
      [...PROVENANCE_ONLY_FILES],
    scope:
      RELEASE_SCOPE,
    approval_semantics:
      APPROVAL_SEMANTICS
  };
}

function setup(label) {
  const root =
    path.join(
      tempRoot,
      label
    );

  const clone =
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

  if (clone.status !== 0) {
    throw new Error(
      `Fixture clone failed: ${clone.stderr}`
    );
  }

  runGit(
    root,
    [
      "config",
      "user.email",
      "janus-fixture@example.invalid"
    ]
  );

  runGit(
    root,
    [
      "config",
      "user.name",
      "JANUS Fixture"
    ]
  );

  writeText(
    root,
    RELEASE_STATE_RELATIVE_PATH,
    JSON.stringify(
      {
        schema:1,
        control:
          "complete-git-tree-release-state",
        version:
          "0.3.11",
        build_id:
          "janus-governance-challenge-harness-v0.3.11",
        code_commit:null,
        code_tree:null,
        provenance_only_files:
          [...PROVENANCE_ONLY_FILES],
        scope:
          RELEASE_SCOPE,
        approval_semantics:
          APPROVAL_SEMANTICS
      },
      null,
      2
    ) + "\n"
  );

  runGit(
    root,
    [
      "add",
      RELEASE_STATE_RELATIVE_PATH
    ]
  );

  runGit(
    root,
    [
      "commit",
      "--quiet",
      "-m",
      "fixture code commit"
    ]
  );

  const commit =
    runGit(
      root,
      [
        "rev-parse",
        "HEAD"
      ]
    );

  const tree =
    runGit(
      root,
      [
        "rev-parse",
        "HEAD^{tree}"
      ]
    );

  writeText(
    root,
    RELEASE_STATE_RELATIVE_PATH,
    JSON.stringify(
      boundState(
        commit,
        tree
      ),
      null,
      2
    ) + "\n"
  );

  return {
    root,
    commit,
    tree
  };
}

function expectPass(label,mutate) {
  const fixture =
    setup(
      `pass-${label}`
    );

  if (mutate) {
    mutate(
      fixture.root,
      fixture
    );
  }

  auditCompleteReleaseState(
    fixture.root
  );

  console.log(
    `PASS: ${label}`
  );
}

function expectFail(label,mutate) {
  const fixture =
    setup(
      `fail-${label}`
    );

  mutate(
    fixture.root,
    fixture
  );

  let failed=false;

  try {
    auditCompleteReleaseState(
      fixture.root
    );
  }
  catch {
    failed=true;
  }

  assert(
    failed,
    `Expected failure was not detected: ${label}`
  );

  console.log(
    `KILLED: ${label}`
  );
}

try {
  expectPass(
    "exact bound code commit with only release-state provenance change"
  );

  expectPass(
    "build-info.json may change as the second provenance file",
    root => {
      const file =
        path.join(
          root,
          "build-info.json"
        );

      const value =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      value.version=
        "0.3.11";

      fs.writeFileSync(
        file,
        JSON.stringify(
          value,
          null,
          2
        ) + "\n"
      );
    }
  );

  expectFail(
    "app.js changed after approved code commit",
    root => {
      fs.appendFileSync(
        path.join(
          root,
          "app.js"
        ),
        "\n// unauthorized fixture change\n"
      );
    }
  );

  expectFail(
    "styles.css changed after approved code commit",
    root => {
      fs.appendFileSync(
        path.join(
          root,
          "styles.css"
        ),
        '\nbody::before{content:"Version 1.0 approved";}\n'
      );
    }
  );

  expectFail(
    "current release gate changed after approved code commit",
    root => {
      fs.appendFileSync(
        path.join(
          root,
          "tests",
          "V0_3_10_RELEASE_GATE.md"
        ),
        "\nVersion 1.0 approved.\n"
      );
    }
  );

  expectFail(
    "historical independent evidence changed after approved code commit",
    root => {
      fs.appendFileSync(
        path.join(
          root,
          "testing",
          "claude",
          "v0.3.10",
          "JANUS_v0.3.10_Targeted_V035-F05_Closure_Report.md"
        ),
        "\nALTERED\n"
      );
    }
  );

  expectFail(
    "new tracked status.html added after approved code commit",
    root => {
      writeText(
        root,
        "status.html",
        "<h1>Version 1.0 approved</h1>\n"
      );

      runGit(
        root,
        [
          "add",
          "status.html"
        ]
      );
    }
  );

  expectFail(
    "new untracked 404.html present in release workspace",
    root => {
      writeText(
        root,
        "404.html",
        "<h1>Version 1.0 approved</h1>\n"
      );
    }
  );

  expectFail(
    "tracked README removed after approved code commit",
    root => {
      runGit(
        root,
        [
          "rm",
          "--quiet",
          "README.md"
        ]
      );
    }
  );

  expectFail(
    "release-state gains an unauthorized status field",
    root => {
      const file =
        path.join(
          root,
          RELEASE_STATE_RELATIVE_PATH
        );

      const value =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      value.status=
        "Version 1.0 approved";

      fs.writeFileSync(
        file,
        JSON.stringify(
          value,
          null,
          2
        ) + "\n"
      );
    }
  );

  expectFail(
    "release-state code tree does not match bound code commit",
    root => {
      const file =
        path.join(
          root,
          RELEASE_STATE_RELATIVE_PATH
        );

      const value =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      value.code_tree=
        "0".repeat(40);

      fs.writeFileSync(
        file,
        JSON.stringify(
          value,
          null,
          2
        ) + "\n"
      );
    }
  );

  expectFail(
    "non-provenance third-state change cannot hide behind a provenance commit",
    (root,fixture) => {
      runGit(
        root,
        [
          "add",
          RELEASE_STATE_RELATIVE_PATH
        ]
      );

      runGit(
        root,
        [
          "commit",
          "--quiet",
          "-m",
          "fixture provenance commit"
        ]
      );

      fs.appendFileSync(
        path.join(
          root,
          "app.js"
        ),
        "\n// post-provenance unauthorized change\n"
      );
    }
  );

  expectFail(
    "second provenance commit after code commit is rejected",
    root => {
      runGit(
        root,
        [
          "add",
          RELEASE_STATE_RELATIVE_PATH
        ]
      );

      runGit(
        root,
        [
          "commit",
          "--quiet",
          "-m",
          "fixture provenance commit one"
        ]
      );

      const file =
        path.join(
          root,
          RELEASE_STATE_RELATIVE_PATH
        );

      const text =
        fs.readFileSync(
          file,
          "utf8"
        );

      fs.writeFileSync(
        file,
        text.replace(
          "\n}",
          " \n}"
        )
      );

      runGit(
        root,
        [
          "add",
          RELEASE_STATE_RELATIVE_PATH
        ]
      );

      runGit(
        root,
        [
          "commit",
          "--quiet",
          "-m",
          "fixture provenance commit two"
        ]
      );
    }
  );

  console.log(
    "JANUS v0.3.11 complete-tree release-state fixtures: PASS"
  );
}
finally {
  fs.rmSync(
    tempRoot,
    {
      recursive:true,
      force:true
    }
  );
}