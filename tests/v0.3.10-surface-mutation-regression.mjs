import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const here =
  path.dirname(fileURLToPath(import.meta.url));

const repo =
  path.resolve(here,"..");

function sha256File(file) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
}

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
  const source =
    fs.readFileSync(file,"utf8");

  const first =
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
    source.replace(before,after),
    "utf8"
  );
}

/*
 * The probe represents a REAL TEST:
 *
 * The prepared state is intentionally invalid.
 * auditGovernedSurfaces MUST reject it.
 *
 * exit 0 = test passed because invalid state was rejected
 * exit 1 = test failed because mutant accepted invalid state
 *
 * Therefore result.status !== 0 means the mutation was KILLED.
 */
function runExpectedRejection(
  root,
  expectedBaselineSha
) {
  const script = `
import path from "node:path";
import {pathToFileURL} from "node:url";

const root =
  process.env.JANUS_TEST_ROOT;

const expected =
  process.env.JANUS_EXPECTED_BASELINE;

const moduleUrl =
  pathToFileURL(
    path.join(
      root,
      "tests",
      "lib",
      "governed-surface-baseline.mjs"
    )
  ).href;

const mod =
  await import(moduleUrl);

try {
  mod.auditGovernedSurfaces(
    root,
    expected
  );

  console.error(
    "UNEXPECTED ACCEPT: deliberately invalid governed release was accepted."
  );

  process.exit(1);
} catch (error) {
  console.log(
    "EXPECTED REJECTION: " +
    String(error.message || error)
  );

  process.exit(0);
}
`;

  return spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      script
    ],
    {
      cwd:root,
      env:{
        ...process.env,
        JANUS_TEST_ROOT:root,
        JANUS_EXPECTED_BASELINE:
          expectedBaselineSha
      },
      encoding:"utf8"
    }
  );
}

function baselinePath(root) {
  return path.join(
    root,
    "docs",
    "APPROVED_GOVERNED_SURFACES.json"
  );
}

function manifestPath(root) {
  return path.join(
    root,
    "docs",
    "GOVERNED_RELEASE_FILES.json"
  );
}

const mutations=[

  /*
   * 1. Per-file content binding.
   *
   * Invalid state:
   * README bytes change while approved hash remains unchanged.
   *
   * Only disabling the file-content comparison should allow it.
   */
  {
    name:
      "governed-file content mismatch enforcement disabled",

    before:
      "if (\n      actual !== expected\n    ) {",

    after:
      "if (false) {",

    prepare(root) {
      fs.appendFileSync(
        path.join(root,"README.md"),
        "\nMUTATION PROBE\n",
        "utf8"
      );

      return sha256File(
        baselinePath(root)
      );
    }
  },

  /*
   * 2. Baseline-file binding.
   *
   * Invalid state:
   * baseline bytes change while caller still supplies old
   * approved baseline SHA.
   */
  {
    name:
      "approved baseline binding enforcement disabled",

    before:
      "if (\n    baselineFileSha !==\n    expectedBaselineSha256\n  ) {",

    after:
      "if (false) {",

    prepare(root) {
      const file =
        baselinePath(root);

      const approvedSha =
        sha256File(file);

      const baseline =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      baseline.policy =
        baseline.policy + " ";

      fs.writeFileSync(
        file,
        JSON.stringify(
          baseline,
          null,
          2
        ) + "\n",
        "utf8"
      );

      return approvedSha;
    }
  },

  /*
   * 3. Manifest-file binding.
   *
   * Invalid state:
   * manifest bytes change while baseline retains the old
   * approved manifest SHA.
   */
  {
    name:
      "governed-file manifest binding enforcement disabled",

    before:
      "if (\n    actualManifestSha !==\n    baseline.governed_file_manifest.sha256\n      .toLowerCase()\n  ) {",

    after:
      "if (false) {",

    prepare(root) {
      const file =
        manifestPath(root);

      const manifest =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      manifest.future_transition_note =
        manifest.future_transition_note +
        " ";

      fs.writeFileSync(
        file,
        JSON.stringify(
          manifest,
          null,
          2
        ) + "\n",
        "utf8"
      );

      return sha256File(
        baselinePath(root)
      );
    }
  },

  /*
   * 4. Manifest/baseline set equality.
   *
   * Invalid state:
   * baseline contains an extra governed entry not present in
   * the approved manifest.
   *
   * The baseline itself is rebound for this isolated probe so
   * only file-set equality should reject it.
   */
  {
    name:
      "manifest versus approved file-set enforcement disabled",

    before:
      "if (\n    JSON.stringify(manifestSet) !==\n    JSON.stringify(baselineSet)\n  ) {",

    after:
      "if (false) {",

    prepare(root) {
      const file =
        baselinePath(root);

      const baseline =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      baseline.governed_files[
        "UNAPPROVED-EXTRA-FILE.txt"
      ]={
        sha256:
          "0000000000000000000000000000000000000000000000000000000000000000"
      };

      fs.writeFileSync(
        file,
        JSON.stringify(
          baseline,
          null,
          2
        ) + "\n",
        "utf8"
      );

      return sha256File(file);
    }
  },

  /*
   * 5. Manifest traversal completeness.
   *
   * Mutant drops the first manifest entry (README.md).
   *
   * For the isolated bad state:
   * - README is changed;
   * - README is removed from baseline.governed_files;
   * - baseline is deliberately rebound.
   *
   * Correct implementation sees manifest=4 vs baseline=3 and
   * rejects.
   *
   * Mutant returns only the final 3 manifest files, causing
   * manifest and baseline sets to appear equal and skipping the
   * changed README entirely.
   */
  {
    name:
      "manifest silently omits first governed file",

    before:
      "return [...manifest.files];",

    after:
      "return manifest.files.slice(1);",

    prepare(root) {
      fs.appendFileSync(
        path.join(root,"README.md"),
        "\nOMITTED GOVERNED FILE PROBE\n",
        "utf8"
      );

      const file =
        baselinePath(root);

      const baseline =
        JSON.parse(
          fs.readFileSync(
            file,
            "utf8"
          )
        );

      delete baseline
        .governed_files[
          "README.md"
        ];

      fs.writeFileSync(
        file,
        JSON.stringify(
          baseline,
          null,
          2
        ) + "\n",
        "utf8"
      );

      return sha256File(file);
    }
  }
];

let survivors=0;

for(const mutation of mutations) {
  const tmp =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0310-isolated-mut-"
      )
    );

  try {
    copyRepo(tmp);

    const policy =
      path.join(
        tmp,
        "tests",
        "lib",
        "governed-surface-baseline.mjs"
      );

    replaceExactlyOnce(
      policy,
      mutation.before,
      mutation.after
    );

    const expectedBaselineSha =
      mutation.prepare(tmp);

    const result =
      runExpectedRejection(
        tmp,
        expectedBaselineSha
      );

    if(result.status !== 0) {
      console.log(
        `KILLED: ${mutation.name}`
      );
    } else {
      survivors += 1;

      console.error(
        `SURVIVED: ${mutation.name}`
      );

      if(result.stdout) {
        console.error(
          result.stdout.trim()
        );
      }

      if(result.stderr) {
        console.error(
          result.stderr.trim()
        );
      }
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

if(survivors) {
  console.error(
    `JANUS v0.3.10 isolated mutation regression: FAIL (${survivors} survivors)`
  );

  process.exit(1);
}

console.log(
  `JANUS v0.3.10 isolated mutation regression: PASS ` +
  `(${mutations.length}/${mutations.length} mutations killed)`
);
