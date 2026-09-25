import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.JANUS_TEST_ROOT ? path.resolve(process.env.JANUS_TEST_ROOT) : path.resolve(here, '..');
const manifestPath = path.join(root,'build-info.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const assert = (ok,msg) => { if(!ok) throw new Error(msg); };
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

assert(manifest.version === '0.3.8', 'Manifest version must be 0.3.8.');
assert(manifest.build_id === 'janus-governance-challenge-harness-v0.3.8', 'Manifest build ID mismatch.');
assert(typeof manifest.code_commit === 'string' && /^[0-9a-f]{40}$/i.test(manifest.code_commit), 'Manifest code_commit is invalid.');
assert(manifest.files && typeof manifest.files === 'object' && !Array.isArray(manifest.files), 'Manifest files map is invalid.');

const git = spawnSync('git',['-C',root,'ls-files','-z'],{encoding:'buffer'});
if (git.status !== 0) throw new Error('git ls-files failed: '+git.stderr.toString('utf8'));
const tracked = git.stdout.toString('utf8').split('\0').filter(Boolean).filter((p) => p !== 'build-info.json').sort();
const listed = Object.keys(manifest.files).sort();

assert(JSON.stringify(listed) === JSON.stringify(tracked),
  'Manifest file set differs from tracked release file set. Missing: ' +
  tracked.filter((p)=>!listed.includes(p)).join(', ') +
  '; Extra: ' + listed.filter((p)=>!tracked.includes(p)).join(', '));

for (const rel of tracked) {
  const full = path.join(root,rel);
  assert(fs.existsSync(full), 'Tracked manifest file missing from working tree: '+rel);
  const observed = sha(fs.readFileSync(full));
  assert(manifest.files[rel] === observed, 'Manifest SHA-256 mismatch: '+rel);
}

console.log(`JANUS v0.3.8 release manifest audit: PASS (${tracked.length}/${tracked.length} tracked files; build-info.json excluded from self-hash)`);
