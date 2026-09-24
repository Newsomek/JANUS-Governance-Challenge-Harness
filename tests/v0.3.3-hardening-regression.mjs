import fs from 'node:fs';
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const readme=fs.readFileSync('README.md','utf8');
const checks=[
 ['stored core replay check',/stored_core_match: storedCoreMatch/.test(app)&&/replayMatch = .*storedCoreMatch/.test(app)],
 ['bound 404 refused',/BOUND_COMMIT_NOT_FOUND/.test(app)&&/could not be corroborated because app\.js was not found/.test(app)],
 ['resource errors named',/Build provenance parse failed/.test(app)&&/Source document body read failed/.test(app)&&/Harness code body read failed/.test(app)],
 ['no scenario innerHTML sink',!app.includes('scenarioSummary.innerHTML')&&app.includes('scenarioSummary.replaceChildren')],
 ['visible text and uniqueness validation',/\p\{Cf\}/.test(app)&&/duplicate values/.test(app)&&/duplicate citations/.test(app)&&/Scenario IDs must be unique/.test(app)],
 ['async replay export locks',/replayInFlight/.test(app)&&/exportInFlight/.test(app)],
 ['mobile provenance wraps',/#provenanceInfo\{overflow-wrap:anywhere/.test(css)],
 ['aria live notices',/aria-live="polite"/.test(html)],
 ['repository and evidence links',/Independent test evidence/.test(html)&&/github\.com\/Newsomek\/JANUS-Governance-Challenge-Harness/.test(html)],
 ['docs no new-clean-run claim',!readme.includes('until a new clean run is performed')],
 ['version 0.3.3',app.includes('HARNESS_VERSION = "0.3.3"')&&html.includes('v0.3.3')&&readme.includes('v0.3.3')]
];
const failed=checks.filter(([,ok])=>!ok);
if(failed.length){for(const [n] of failed) console.error('FAIL:',n);process.exit(1);}
console.log('JANUS v0.3.3 hardening regression: PASS');
console.log('Checks:',checks.length);
