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

function runAudit(root) {
  return spawnSync(
    process.execPath,
    [
      path.join(
        root,
        "tests",
        "v0.3.10-doc-audit.mjs"
      )
    ],
    {
      cwd:root,
      env:{
        ...process.env,
        JANUS_TEST_ROOT:root
      },
      encoding:"utf8"
    }
  );
}

function sha256(pathName) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(pathName))
    .digest("hex");
}

function append(root,file,text) {
  const p=path.join(root,file);

  fs.appendFileSync(
    p,
    `\n${text}\n`,
    "utf8"
  );
}

const cases=[
  {
    name:"semantic synonym README",
    file:"README.md",
    text:"The evidence cannot be changed."
  },
  {
    name:"semantic synonym CHANGELOG",
    file:"CHANGELOG.md",
    text:"Exports are verified."
  },
  {
    name:"version synonym VERSION",
    file:"VERSION.txt",
    text:"This is the 1.0 release."
  },
  {
    name:"closure synonym HTML",
    file:"index.html",
    text:"<p>F05 has been resolved.</p>"
  },
  {
    name:"Markdown heading bypass",
    file:"README.md",
    text:"## Version 1.0 approved"
  },
  {
    name:"HTML heading bypass",
    file:"index.html",
    text:"<h2>Version 1.0 approved</h2>"
  },
  {
    name:"wrapped line bypass",
    file:"CHANGELOG.md",
    text:"This release is Version\n1.0."
  },
  {
    name:"hidden-negation flip",
    file:"index.html",
    text:
      '<p>Version 1.0 is <span hidden>not</span> approved.</p>'
  },
  {
    name:"strikethrough-negation flip",
    file:"README.md",
    text:"Version 1.0 is ~~not~~ approved."
  },
  {
    name:"Markdown inline HTML",
    file:"README.md",
    text:"Evidence is tam<b></b>per-proof."
  },
  {
    name:"named entity split",
    file:"index.html",
    text:"<p>Evidence is tam&shy;per-proof.</p>"
  },
  {
    name:"homoglyph",
    file:"VERSION.txt",
    text:"This is Vеrsion 1.0."
  },
  {
    name:"attribute claim",
    file:"index.html",
    text:
      '<img src="x" alt="Tamper-proof evidence; Version 1.0 approved">'
  },
  {
    name:"context retraction",
    file:"README.md",
    text:
      "The following disclaimer is obsolete and no longer true:\nVersion 1.0 is not approved."
  },
  {
    name:"legitimate unreviewed text still fails closed",
    file:"README.md",
    text:
      "Has independent closure been confirmed?"
  }
];

let failures=0;

/*
 * Positive baseline control.
 *
 * The untouched, explicitly approved four-document state MUST
 * pass before any negative mutation case is evaluated.
 *
 * This prevents a broken control that rejects everything from
 * making all negative fixtures appear to succeed.
 */
{
  const tmp=
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0310-baseline-positive-"
      )
    );

  try {
    copyRepo(tmp);

    const result=
      runAudit(tmp);

    if(result.status !== 0) {
      failures += 1;

      console.error(
        "BASELINE FAILURE: unchanged approved documentation did not pass."
      );

      if(result.stderr) {
        console.error(result.stderr.trim());
      }
    } else {
      console.log(
        "PASS: unchanged approved four-document baseline"
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

for(const testCase of cases) {
  const tmp=
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0310-surface-"
      )
    );

  try {
    copyRepo(tmp);

    append(
      tmp,
      testCase.file,
      testCase.text
    );

    const result=
      runAudit(tmp);

    if(result.status === 0) {
      failures += 1;
      console.error(
        `UNEXPECTED PASS: ${testCase.name}`
      );
    } else {
      console.log(
        `KILLED: ${testCase.name}`
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

/*
 * Baseline self-approval attack:
 * mutate README, then rewrite the baseline entry to match.
 * This still must fail because the baseline file itself is bound
 * by an independently stored SHA-256 in the audit.
 */
{
  const tmp=
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0310-baseline-tamper-"
      )
    );

  try {
    copyRepo(tmp);

    append(
      tmp,
      "README.md",
      "Version 1.0 approved."
    );

    const baselinePath=
      path.join(
        tmp,
        "docs",
        "APPROVED_GOVERNED_SURFACES.json"
      );

    const baseline=
      JSON.parse(
        fs.readFileSync(
          baselinePath,
          "utf8"
        )
      );

    baseline.governed_surfaces[
      "README.md"
    ].sha256=
      sha256(
        path.join(
          tmp,
          "README.md"
        )
      );

    fs.writeFileSync(
      baselinePath,
      JSON.stringify(
        baseline,
        null,
        2
      )+"\n",
      "utf8"
    );

    const result=
      runAudit(tmp);

    if(result.status === 0) {
      failures += 1;
      console.error(
        "UNEXPECTED PASS: baseline self-approval attack"
      );
    } else {
      console.log(
        "KILLED: baseline self-approval attack"
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

/*
 * Proposal tool must remain non-mutating.
 */
{
  const tmp=
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "janus-v0310-proposal-"
      )
    );

  try {
    copyRepo(tmp);

    const baselinePath=
      path.join(
        tmp,
        "docs",
        "APPROVED_GOVERNED_SURFACES.json"
      );

    const before=
      sha256(baselinePath);

    append(
      tmp,
      "README.md",
      "The evidence cannot be changed."
    );

    const proposal=
      spawnSync(
        process.execPath,
        [
          path.join(
            tmp,
            "tests",
            "v0.3.10-surface-review-proposal.mjs"
          )
        ],
        {
          cwd:tmp,
          env:{
            ...process.env,
            JANUS_TEST_ROOT:tmp
          },
          encoding:"utf8"
        }
      );

    const after=
      sha256(baselinePath);

    if(
      proposal.status !== 0 ||
      before !== after
    ) {
      failures += 1;
      console.error(
        "UNEXPECTED: review-proposal tool mutated or failed."
      );
    } else {
      console.log(
        "PASS: review-proposal tool is read-only"
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
    `JANUS v0.3.10 exact-surface fixtures: FAIL (${failures})`
  );
  process.exit(1);
}

console.log(
  `JANUS v0.3.10 exact-surface fixtures: PASS ` +
  `(${cases.length} unreviewed-change classes + ` +
  `baseline self-approval + proposal read-only)`
);
