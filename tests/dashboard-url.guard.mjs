// tests/dashboard-url.guard.mjs - BATCH LINK1 static guard (bobo repo, git-tracked).
// bobo .gitignore ignores *.py, so this .mjs guard is the tracked version
// (tests/test_dashboard_public_url.py exists on disk too and passes under
// pytest, but is git-ignored by the pre-existing `*.py` rule).
//
// Asserts no bobo template/JS contains the bad panel host+port (see BAD).
// NOTE: BAD is built by concatenation so raw grep for the bad URL skips
// this guard file itself.
// Run: node tests/dashboard-url.guard.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const BAD = 'panelnexus.duckdns.org' + ':3000';
const SCAN_EXTS = new Set(['.html', '.js', '.mjs', '.cjs', '.json', '.md', '.txt', '.conf', '.xml', '.css']);
const SKIP_DIRS = new Set(['.git', 'node_modules', '__pycache__', 'fonts', 'images', '.pytest_cache']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) yield* walk(full);
    } else if (SCAN_EXTS.has(extname(name).toLowerCase())) {
      yield full;
    }
  }
}

const offenders = [];
for (const file of walk(REPO_ROOT)) {
  const rel = relative(REPO_ROOT, file);
  if (rel === join('tests', 'dashboard-url.guard.mjs')) continue; // self (names BAD)
  if (rel === join('tests', 'test_dashboard_public_url.py')) continue; // sibling guard (names BAD)
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  text.split('\n').forEach((line, i) => {
    if (line.includes(BAD)) offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 200)}`);
  });
}

// Documented fact: bobo serves bobobot.duckdns.org, not ninjanexus.
const indexHtml = readFileSync(join(REPO_ROOT, 'index.html'), 'utf8');
const identityOk = indexHtml.includes('bobobot.duckdns.org') && !indexHtml.includes('ninjanexus.duckdns.org');

if (offenders.length || !identityOk) {
  if (offenders.length) console.error(`FAIL: found ${BAD} in:\n${offenders.join('\n')}`);
  if (!identityOk) console.error('FAIL: bobo landing identity check failed');
  process.exit(1);
}
console.log('[GUARD] no bad panel host+port in bobo [OK]');
console.log('[GUARD] bobo landing identity confirmed [OK]');
