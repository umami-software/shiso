import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_ROOT = path.join(REPOSITORY_ROOT, 'packages/create-shiso-app');
const PACKAGE_FILE = path.join(PACKAGE_ROOT, 'package.json');
const CHANGELOG_FILE = path.join(PACKAGE_ROOT, 'CHANGELOG.md');
const TAG_PREFIX = 'create-shiso-app-v';
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function parseArguments(argv) {
  const options = {
    tag: undefined,
    outputDirectory: undefined,
    checkRegistry: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--output-dir') {
      options.outputDirectory = argv[index + 1];
      index += 1;

      if (!options.outputDirectory) {
        throw new Error('--output-dir requires a directory.');
      }
    } else if (argument === '--check-registry') {
      options.checkRegistry = true;
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (!options.tag) {
      options.tag = argument;
    } else {
      throw new Error(`Unexpected argument: ${argument}`);
    }
  }

  return options;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function releaseNotes(changelog, version) {
  const heading = new RegExp(`^## ${escapeRegExp(version)} - (\\d{4}-\\d{2}-\\d{2})\\s*$`, 'm');
  const match = changelog.match(heading);

  if (!match || match.index === undefined) {
    throw new Error(`CHANGELOG.md is missing "## ${version} - YYYY-MM-DD".`);
  }

  const date = new Date(`${match[1]}T00:00:00Z`);

  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== match[1]) {
    throw new Error(`CHANGELOG.md has an invalid release date for ${version}.`);
  }

  const notesStart = match.index + match[0].length;
  const nextHeading = changelog.slice(notesStart).search(/^## /m);
  const notesEnd = nextHeading === -1 ? changelog.length : notesStart + nextHeading;
  const notes = changelog.slice(notesStart, notesEnd).trim();

  if (!notes || /\bTBD\b/i.test(notes)) {
    throw new Error(`CHANGELOG.md has no finalized release notes for ${version}.`);
  }

  return notes;
}

async function registryHasVersion(name, version) {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`,
  );

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error(`npm registry check failed with HTTP ${response.status}.`);
  }

  const metadata = await response.json();

  if (metadata.version !== version) {
    throw new Error(`npm returned version "${metadata.version}" while checking "${version}".`);
  }

  return true;
}

async function appendGitHubOutputs(outputs) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  const lines = Object.entries(outputs).map(([name, value]) => `${name}=${value}`);
  await fs.appendFile(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const packageMetadata = JSON.parse(await fs.readFile(PACKAGE_FILE, 'utf8'));
  const changelog = await fs.readFile(CHANGELOG_FILE, 'utf8');
  const { name, version, publishConfig, repository } = packageMetadata;

  const semver = version.match(SEMVER_PATTERN);

  if (!semver) {
    throw new Error(`Package version "${version}" is not valid semantic versioning.`);
  }

  const prereleaseIdentifiers = semver[4]?.split('.') || [];

  if (
    prereleaseIdentifiers.some(
      identifier => /^\d+$/.test(identifier) && identifier.length > 1 && identifier.startsWith('0'),
    )
  ) {
    throw new Error(`Package version "${version}" has a numeric prerelease with a leading zero.`);
  }

  if (name !== 'create-shiso-app') {
    throw new Error(`Expected package name "create-shiso-app", got "${name}".`);
  }

  if (publishConfig?.access !== 'public') {
    throw new Error('create-shiso-app must use public npm access.');
  }

  if (repository?.url !== 'https://github.com/umami-software/shiso.git') {
    throw new Error('The package repository must match the trusted GitHub repository.');
  }

  const expectedTag = `${TAG_PREFIX}${version}`;
  const tag = options.tag || expectedTag;

  if (tag !== expectedTag) {
    throw new Error(`Tag "${tag}" does not match package version. Expected "${expectedTag}".`);
  }

  const notes = releaseNotes(changelog, version);
  const prerelease = version.includes('-');
  const npmTag = prerelease ? 'next' : 'latest';
  let notesFile = '';
  let tarball = '';

  if (options.outputDirectory) {
    const outputDirectory = path.resolve(REPOSITORY_ROOT, options.outputDirectory);
    await fs.mkdir(outputDirectory, { recursive: true });
    notesFile = path.join(outputDirectory, `${tag}.md`);
    tarball = path.join(outputDirectory, `${name}-${version}.tgz`);
    await fs.writeFile(notesFile, `${notes}\n`);
    notesFile = path.relative(REPOSITORY_ROOT, notesFile).split(path.sep).join('/');
    tarball = path.relative(REPOSITORY_ROOT, tarball).split(path.sep).join('/');
  }

  const published = options.checkRegistry ? await registryHasVersion(name, version) : false;

  await appendGitHubOutputs({
    version,
    tag,
    prerelease,
    npm_tag: npmTag,
    published,
    notes_file: notesFile,
    tarball,
  });

  console.log(
    `Release metadata is valid: ${tag} (${npmTag}${published ? ', already on npm' : ''}).`,
  );
}

main().catch(error => {
  console.error(`\nRelease check failed: ${error.message}\n`);
  process.exitCode = 1;
});
