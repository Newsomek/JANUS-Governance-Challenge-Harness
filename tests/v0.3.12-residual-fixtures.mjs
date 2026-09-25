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
  getUntracked,
  parseCanonicalReleaseState
} from "./lib/release-state-binding-v0.3.12.mjs";

import {
  canonicalBuildInfoText,
  parseCanonicalBuildInfo
} from "./lib/build-info-schema-v0.3.12.mjs";

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

const assert =
  (condition,message) => {
    if (!condition) {
      throw new Error(message);
    }
  };

function expectFail(
  label,
  fn
) {
  let failed =
    false;

  try {
    fn();
  }
  catch {
    failed =
      true;
  }

  assert(
    failed,
    `Expected failure was not detected: ${label}`
  );

  console.log(
    `KILLED: ${label}`
  );
}

const build = {
  version:
    "0.3.12",

  build_id:
    "janus-governance-challenge-harness-v0.3.12",

  code_commit:
    "a".repeat(40),

  files: {
    "README.md":
      "b".repeat(64),

    "app.js":
      "c".repeat(64)
  }
};

const buildCanonical =
  canonicalBuildInfoText(
    build
  );

parseCanonicalBuildInfo(
  buildCanonical
);

console.log(
  "PASS: canonical build-info bytes"
);

expectFail(
  "build-info duplicate top-level version key with hidden claim",
  () => {
    const bad =
      buildCanonical.replace(
        '  "version": "0.3.12",',
        '  "version": "V035-F05 CLOSED - Version 1.0 APPROVED",\n  "version": "0.3.12",'
      );

    parseCanonicalBuildInfo(
      bad
    );
  }
);

expectFail(
  "build-info duplicate files object with hidden claim",
  () => {
    const bad =
      buildCanonical.replace(
        '  "files": {',
        '  "files": {"status":"Authenticated independent approval"},\n  "files": {'
      );

    parseCanonicalBuildInfo(
      bad
    );
  }
);

expectFail(
  "build-info duplicate nested file key",
  () => {
    const bad =
      buildCanonical.replace(
        '    "app.js":',
        '    "app.js": "V035-F05 CLOSED",\n    "app.js":'
      );

    parseCanonicalBuildInfo(
      bad
    );
  }
);

expectFail(
  "build-info minified non-canonical bytes",
  () => {
    parseCanonicalBuildInfo(
      JSON.stringify(
        JSON.parse(buildCanonical)
      )
    );
  }
);

expectFail(
  "build-info reordered keys",
  () => {
    const parsed =
      JSON.parse(
        buildCanonical
      );

    const reordered = {
      files:
        parsed.files,

      code_commit:
        parsed.code_commit,

      build_id:
        parsed.build_id,

      version:
        parsed.version
    };

    parseCanonicalBuildInfo(
      JSON.stringify(
        reordered,
        null,
        2
      ) + "\n"
    );
  }
);

expectFail(
  "build-info uppercase commit and hashes",
  () => {
    const parsed =
      JSON.parse(
        buildCanonical
      );

    parsed.code_commit =
      parsed.code_commit.toUpperCase();

    parsed.files =
      Object.fromEntries(
        Object.entries(
          parsed.files
        )
          .map(
            ([k,v]) =>
              [k,v.toUpperCase()]
          )
      );

    parseCanonicalBuildInfo(
      JSON.stringify(
        parsed,
        null,
        2
      ) + "\n"
    );
  }
);

expectFail(
  "build-info unicode escape variant",
  () => {
    const bad =
      buildCanonical.replace(
        '"0.3.12"',
        '"0\\u002e3\\u002e12"'
      );

    parseCanonicalBuildInfo(
      bad
    );
  }
);

const state = {
  schema:
    1,

  control:
    "complete-git-tree-bound-release-state",

  version:
    "0.3.12",

  build_id:
    "janus-governance-challenge-harness-v0.3.12",

  code_commit:
    "d".repeat(40),

  code_tree:
    "e".repeat(40),

  provenance_only_files:
    [...PROVENANCE_ONLY_FILES],

  scope:
    RELEASE_SCOPE,

  binding_semantics:
    BINDING_SEMANTICS
};

const stateCanonical =
  canonicalReleaseStateText(
    state
  );

parseCanonicalReleaseState(
  stateCanonical
);

console.log(
  "PASS: canonical release-state bytes"
);

expectFail(
  "release-state duplicate binding_semantics claim",
  () => {
    const bad =
      stateCanonical.replace(
        '  "binding_semantics":',
        '  "binding_semantics": "Authenticated, digitally signed approval by an independent human reviewer.",\n  "binding_semantics":'
      );

    parseCanonicalReleaseState(
      bad
    );
  }
);

expectFail(
  "release-state duplicate provenance_only_files narrowing",
  () => {
    const bad =
      stateCanonical.replace(
        '  "provenance_only_files": [',
        '  "provenance_only_files": ["README.md"],\n  "provenance_only_files": ['
      );

    parseCanonicalReleaseState(
      bad
    );
  }
);

expectFail(
  "release-state minified non-canonical bytes",
  () => {
    parseCanonicalReleaseState(
      JSON.stringify(
        JSON.parse(stateCanonical)
      )
    );
  }
);

expectFail(
  "release-state reordered keys",
  () => {
    const parsed =
      JSON.parse(
        stateCanonical
      );

    const reordered = {
      binding_semantics:
        parsed.binding_semantics,

      scope:
        parsed.scope,

      provenance_only_files:
        parsed.provenance_only_files,

      code_tree:
        parsed.code_tree,

      code_commit:
        parsed.code_commit,

      build_id:
        parsed.build_id,

      version:
        parsed.version,

      control:
        parsed.control,

      schema:
        parsed.schema
    };

    parseCanonicalReleaseState(
      JSON.stringify(
        reordered,
        null,
        2
      ) + "\n"
    );
  }
);

expectFail(
  "release-state uppercase commit/tree",
  () => {
    const parsed =
      JSON.parse(
        stateCanonical
      );

    parsed.code_commit =
      parsed.code_commit.toUpperCase();

    parsed.code_tree =
      parsed.code_tree.toUpperCase();

    parseCanonicalReleaseState(
      JSON.stringify(
        parsed,
        null,
        2
      ) + "\n"
    );
  }
);

const tempRoot =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "janus-v0312-untracked-"
    )
  );

try {
  const clone =
    spawnSync(
      "git",
      [
        "clone",
        "--quiet",
        "--no-hardlinks",
        sourceRoot,
        tempRoot
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

  fs.writeFileSync(
    path.join(
      tempRoot,
      "status.log"
    ),
    "V035-F05 CLOSED\n",
    "utf8"
  );

  let observed =
    getUntracked(
      tempRoot
    );

  assert(
    observed.includes(
      "status.log"
    ),
    "Ignored .gitignore file was not observed."
  );

  console.log(
    "KILLED: .gitignore-hidden untracked file"
  );

  fs.rmSync(
    path.join(
      tempRoot,
      "status.log"
    )
  );

  fs.writeFileSync(
    path.join(
      tempRoot,
      ".git",
      "info",
      "exclude"
    ),
    "status-local.html\n",
    "utf8"
  );

  fs.writeFileSync(
    path.join(
      tempRoot,
      "status-local.html"
    ),
    "Version 1.0 APPROVED\n",
    "utf8"
  );

  observed =
    getUntracked(
      tempRoot
    );

  assert(
    observed.includes(
      "status-local.html"
    ),
    ".git/info/exclude-hidden file was not observed."
  );

  console.log(
    "KILLED: .git/info/exclude-hidden untracked file"
  );

  fs.rmSync(
    path.join(
      tempRoot,
      "status-local.html"
    )
  );

  fs.writeFileSync(
    path.join(
      tempRoot,
      ".git",
      "info",
      "exclude"
    ),
    "",
    "utf8"
  );

  const globalExclude =
    path.join(
      tempRoot,
      ".janus-global-excludes"
    );

  fs.writeFileSync(
    globalExclude,
    "status-global.html\n",
    "utf8"
  );

  const config =
    spawnSync(
      "git",
      [
        "-C",
        tempRoot,
        "config",
        "core.excludesFile",
        globalExclude
      ],
      {
        encoding:"utf8"
      }
    );

  if (config.status !== 0) {
    throw new Error(
      `Fixture git config failed: ${config.stderr}`
    );
  }

  fs.writeFileSync(
    path.join(
      tempRoot,
      "status-global.html"
    ),
    "Authenticated approval\n",
    "utf8"
  );

  observed =
    getUntracked(
      tempRoot
    );

  assert(
    observed.includes(
      "status-global.html"
    ),
    "core.excludesFile-hidden file was not observed."
  );

  console.log(
    "KILLED: core.excludesFile-hidden untracked file"
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

console.log(
  "JANUS v0.3.12 residual closure fixtures: PASS"
);