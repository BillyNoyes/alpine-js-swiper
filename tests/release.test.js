import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

function verify(...arguments_) {
  return spawnSync(process.execPath, ['scripts/verify-release.mjs', ...arguments_], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
}

test('accepts a newer stable release that matches the package version', () => {
  const result = verify('v1.1.0', 'false', '1.0.2');

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Release v1\.1\.0 is valid/);
});

test('rejects a release tag that does not match the package version', () => {
  const result = verify('v1.1.1', 'false', '1.0.2');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not match package version/);
});

test('rejects inconsistent prerelease metadata', () => {
  const result = verify('v1.1.0', 'true', '1.0.2');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /prerelease setting do not agree/);
});

test('rejects a version that would not advance the npm dist-tag', () => {
  const result = verify('v1.1.0', 'false', '1.1.0');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must be newer/);
});
