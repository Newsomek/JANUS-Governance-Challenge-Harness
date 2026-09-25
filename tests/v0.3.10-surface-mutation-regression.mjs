import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const here =
  path.dirname(fileURLToPath(import.meta.url));

const repo =
  path.resolve(here,"..");

function copyRepo(dst) {
  fs.cpSync(
    repo,
    dst,
    {
      recursive:true,
      filter:src =>
        !src.includes(`${path.sep}.git${path.sep}`) &&
        !src.endsWith(`${path.sep}.git`)
    }
  );
}

function replaceExactlyOnce(
  file,
  before,
  after
) {
  const source=
    fs.readFileSync(
      file,
      "utf8"
    );

  const first=
    source.indexOf(before);

  if(first < 0) {
    throw new Error(
      `Mutation target missing in ${file}`
    );
  }

  if(
    source.indexOf(
      before,
      first + before.length
    ) >= 0
  ) {
    throw new Error(
      `Mutation target not unique in ${file}`
    );
  }

  fs.writeFileSync(
    file,
    source.replace(
      before,
      after
    ),
    "utf8"
  );
}

function runFixtures(root) {
  return spawnSync(
    process.execPath,
    [
      path.join(
        root,
        "tests",
        "v0.3.10-surface-fixtures.mjs"
      )
    ],
    {
      cwd:root,
      encoding:"utf8"
    }
  );
}

const mutations=[
  {
    name:"surface mismatch enforcement disabled",
    file:"tests/lib/governed-surface-baseline.mjs",
    before:"if (actual !== expected) {",
    after:"if (false) {"
  },
  {
    name:"baseline binding enforcement disabled",
    file:"tests/lib/governed-surface-baseline.mjs",
    before:
      "if (\n    baselineFileSha !==\n    expectedBaselineSha256\n  ) {",
    after:
      "if (false) {"
  },
  {
    name:"README removed from governed surfaces",
    file:"tests/lib/governed-surface-baseline.mjs",
    before:
      '  "README.md",\n  "CHANGELOG.md",',
    after:
      '  "CHANGELOG.md",'
  }
];

let failures=0;

for(const mutation of mutations) {
  const tmp=
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0310-mut-"
      )
    );

  try {
    copyRepo(tmp);

    replaceExactlyOnce(
      path.join(
        tmp,
        mutation.file
      ),
      mutation.before,
      mutation.after
    );

    const result=
      runFixtures(tmp);

    if(result.status === 0) {
      failures += 1;

      console.error(
        `SURVIVED: ${mutation.name}`
      );
    } else {
      console.log(
        `KILLED: ${mutation.name}`
      );
    }
  } finally {
    fs.rmSync(
      tmp,
      {
        recursive:true,
        force:true
      }
    );
  }
}

if(failures) {
  console.error(
    `JANUS v0.3.10 surface mutation regression: FAIL (${failures} survivors)`
  );
  process.exit(1);
}

console.log(
  `JANUS v0.3.10 surface mutation regression: PASS ` +
  `(${mutations.length}/${mutations.length} mutations killed)`
);
