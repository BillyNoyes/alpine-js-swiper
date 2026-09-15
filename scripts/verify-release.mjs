#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import semver from 'semver';

const [releaseTag, releasePrerelease, currentDistTagVersion = ''] = process.argv.slice(2);
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const packageVersion = packageJson.version;

if (!semver.valid(packageVersion)) {
  throw new Error(`Invalid package version: ${packageVersion}`);
}

if (releaseTag !== `v${packageVersion}`) {
  throw new Error(`Release tag ${releaseTag} does not match package version v${packageVersion}`);
}

const packageIsPrerelease = semver.prerelease(packageVersion) !== null;
const releaseIsPrerelease = releasePrerelease === 'true';
if (packageIsPrerelease !== releaseIsPrerelease) {
  throw new Error(`Package version ${packageVersion} and GitHub Release prerelease setting do not agree`);
}

if (currentDistTagVersion) {
  if (!semver.valid(currentDistTagVersion)) {
    throw new Error(`npm returned an invalid dist-tag version: ${currentDistTagVersion}`);
  }

  if (!semver.gt(packageVersion, currentDistTagVersion)) {
    throw new Error(
      `Package version ${packageVersion} must be newer than the current npm dist-tag version ${currentDistTagVersion}`,
    );
  }
}

console.log(`Release ${releaseTag} is valid for npm publication`);
