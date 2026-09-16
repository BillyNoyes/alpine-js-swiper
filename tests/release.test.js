import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const packageVersion = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
).version;
const releaseTag = `v${packageVersion}`;
const previousVersion = '1.0.2';

function verify(...arguments_) {
  return spawnSync(process.execPath, ['scripts/verify-release.mjs', ...arguments_], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
}

test('accepts a newer stable release that matches the package version', () => {
  const result = verify(releaseTag, 'false', previousVersion);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`Release ${releaseTag} is valid`));
});

test('rejects a release tag that does not match the package version', () => {
  const result = verify('v0.0.0-mismatch', 'false', previousVersion);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not match package version/);
});

test('rejects inconsistent prerelease metadata', () => {
  const result = verify(releaseTag, 'true', previousVersion);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /prerelease setting do not agree/);
});

test('rejects a version that would not advance the npm dist-tag', () => {
  const result = verify(releaseTag, 'false', packageVersion);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must be newer/);
});
