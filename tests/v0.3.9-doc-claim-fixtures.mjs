import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here,'..');
const audit = path.join(repo,'tests','v0.3.9-doc-audit.mjs');

const mustFail = [
  'Tamperproof evidence export.',
  'Tamper-proof evidence export.',
  'Tamper\u2011proof evidence export.',
  'Tamper\u00ADproof evidence export.',
  'Tamper\u200Bproof evidence export.',
  'Tamper-*proof* evidence export.',
  'Not signed, but tamper-proof evidence export.',
  'The evidence cannot be altered.',
  'Evidence integrity is guaranteed.',
  'Evidence exports are immutable and cannot be forged.',
  'The exported JSON is cryptographically signed.',
  'Approved as Version 1.0.',
  'Promoted to Version 1.0.',
  'v1.0 approved.',
  'Version 1.0: approved.',
  'Version 1.0 has been approved.',
  'Version 1.0 is now approved.',
  'This release is Version 1.0.',
  'This is the Version 1.0 release.',
  'Version 1.0 release approved.',
  'Approved for release as Version 1.0.',
  'Promoted to v1.',
  'All residual findings are independently closed.',
  'Independent testing closed all remaining findings.',
  'The remaining finding has been independently closed.',
  'F05 is independently closed.',
  'F05 was independently closed.',
  'Every V035 finding has been independently closed.',
  'Independent reviewers confirmed closure of V035-F05.',
  'V035-F05: CLOSED (independent retest).',

  // Single-trigger probes. Each depends on one guarded control so
  // mutation testing can detect removal without another guard masking it.
  'Evidence is immutable.',
  'Evidence protection is guaranteed.',
  'This is v1.',
  'Promotion is complete.',

  // Requires NFKC before "Version 1.0" becomes visible to the guard.
  'Ｖｅｒｓｉｏｎ １.０.',

  // Zero-width character splits the guarded token before "tamper" is formed.
  'Tam\u200Bperproof evidence export.'
];

const mustPass = [
  'not claimed to be tamper-proof',
  'not a tamper-proof control',
  'The export is never tamper-proof.',
  'The export cannot be considered tamper-proof.',
  'Exports are not tamper-proof.',
  "The export isn't tamper-proof.",
  'PASS does not make the export tamper-proof.',
  'No tamper-proof guarantee is made.',
  'Not signed, and not tamper-proof.',
  'Independent closure is not claimed.',
  'Independent closure: pending.',
  'Independent closure has not been confirmed.',
  'Independent closure is not yet complete.',
  'Independent closure has not yet been confirmed.',
  'Independent closure of V035-F05 has not been confirmed.',
  'No independent closure has been confirmed.',
  'Independent closure is pending until F05 is closed.',
  'Independent closure will be confirmed only after the final regression.',
  'Closure was not independently confirmed.',
  'Closure has not yet been independently confirmed.',
  'F05 is not independently closed.',
  'The remaining finding has not been independently closed.',
  'This release is not ready for Version 1.0.',
  'This release is not yet ready for Version 1.0.',
  'Version 1.0 is not approved.',
  'Version 1.0 was not approved.',
  'v1.0 is not yet approved.',
  'This is not the Version 1.0 release.',
  'This release has not been approved as Version 1.0.',
  'Neither ready for nor approved as Version 1.0.',
  'Not yet approved or ready for Version 1.0.'
];

function copyRepo(dst) {
  fs.cpSync(repo,dst,{
    recursive:true,
    filter:src => !src.includes(`${path.sep}.git${path.sep}`) &&
                  !src.endsWith(`${path.sep}.git`)
  });
}

function runAudit(root) {
  return spawnSync(
    process.execPath,
    [audit],
    {
      cwd:repo,
      env:{...process.env,JANUS_TEST_ROOT:root},
      encoding:'utf8'
    }
  );
}

function insertReadme(root,text) {
  const p=path.join(root,'README.md');
  const s=fs.readFileSync(p,'utf8');

  const firstBreak=s.indexOf('\n');

  if(firstBreak < 0) {
    throw new Error('README title line not found.');
  }

  const out =
    s.slice(0,firstBreak+1) +
    '\n' +
    text +
    '\n' +
    s.slice(firstBreak+1);

  fs.writeFileSync(p,out,'utf8');
}

let failures = 0;

for (const fixture of mustFail) {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'janus-v039-deny-'));

  try {
    copyRepo(tmp);
    insertReadme(tmp,fixture);

    const result=runAudit(tmp);

    if (result.status === 0) {
      failures += 1;
      console.error(`UNEXPECTED PASS: ${JSON.stringify(fixture)}`);
    }
  } finally {
    fs.rmSync(tmp,{recursive:true,force:true});
  }
}

for (const fixture of mustPass) {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'janus-v039-allow-'));

  try {
    copyRepo(tmp);
    insertReadme(tmp,fixture);

    const result=runAudit(tmp);

    if (result.status !== 0) {
      failures += 1;
      console.error(`UNEXPECTED FAIL: ${JSON.stringify(fixture)}`);
      console.error(result.stderr);
    }
  } finally {
    fs.rmSync(tmp,{recursive:true,force:true});
  }
}

const rawHtmlMustFail = [
  '<p>Tamper&#8209;proof evidence export.</p>',
  '<p>Tamper<span></span>proof evidence export.</p>',
  '<p>Version&nbsp;1.0 approved.</p>',

  // Numeric entity occurs inside the guarded keyword itself.
  '<p>Tam&#112;erproof evidence export.</p>',

  // No secondary "approved" guard: nbsp decoding is required
  // before "Version 1.0" can be recognized.
  '<p>Version&nbsp;1.0.</p>'
];

for (const fixture of rawHtmlMustFail) {
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'janus-v039-html-'));

  try {
    copyRepo(tmp);

    const p=path.join(tmp,'index.html');
    const s=fs.readFileSync(p,'utf8');

    fs.writeFileSync(
      p,
      s.replace('</main>',`${fixture}\n</main>`),
      'utf8'
    );

    const result=runAudit(tmp);

    if (result.status === 0) {
      failures += 1;
      console.error(`UNEXPECTED HTML PASS: ${fixture}`);
    }
  } finally {
    fs.rmSync(tmp,{recursive:true,force:true});
  }
}

if (failures) {
  console.error(`JANUS v0.3.9 guarded-claim fixtures: FAIL (${failures} unexpected results)`);
  process.exit(1);
}

console.log(
  `JANUS v0.3.9 guarded-claim fixtures: PASS ` +
  `(${mustFail.length} deny, ${mustPass.length} reviewed allow, ` +
  `${rawHtmlMustFail.length} HTML-normalization probes)`
);
