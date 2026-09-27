import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RELEASE_PACKAGES = {
  'create-shiso-app': {
    name: 'create-shiso-app',
    root: path.join(REPOSITORY_ROOT, 'packages/create-shiso-app'),
    tagPrefix: 'create-shiso-app-v',
  },
  shiso: {
    name: '@umami/shiso',
    root: path.join(REPOSITORY_ROOT, 'packages/shiso'),
    tagPrefix: 'shiso-v',
  },
};
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function parseArguments(argv) {
  const options = {
    tag: undefined,
    outputDirectory: undefined,
    checkRegistry: false,
    packageName: 'create-shiso-app',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--package') {
      options.packageName = argv[index + 1];
      index += 1;

      if (!RELEASE_PACKAGES[options.packageName]) {
        throw new Error(`--package must be one of: ${Object.keys(RELEASE_PACKAGES).join(', ')}.`);
      }
    } else if (argument === '--output-dir') {
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
  const releasePackage = RELEASE_PACKAGES[options.packageName];
  const packageFile = path.join(releasePackage.root, 'package.json');
  const packageMetadata = JSON.parse(await fs.readFile(packageFile, 'utf8'));
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

  if (name !== releasePackage.name) {
    throw new Error(`Expected package name "${releasePackage.name}", got "${name}".`);
  }

  if (publishConfig?.access !== 'public') {
    throw new Error(`${name} must use public npm access.`);
  }

  if (repository?.url !== 'https://github.com/umami-software/shiso.git') {
    throw new Error('The package repository must match the trusted GitHub repository.');
  }

  const expectedTag = `${releasePackage.tagPrefix}${version}`;
  const tag = options.tag || expectedTag;

  if (tag !== expectedTag) {
    throw new Error(`Tag "${tag}" does not match package version. Expected "${expectedTag}".`);
  }

  const prerelease = version.includes('-');
  const npmTag = prerelease ? 'next' : 'latest';
  let tarball = '';

  if (options.outputDirectory) {
    const outputDirectory = path.resolve(REPOSITORY_ROOT, options.outputDirectory);
    await fs.mkdir(outputDirectory, { recursive: true });
    const archiveName = name.replace(/^@/, '').replaceAll('/', '-');
    tarball = path.join(outputDirectory, `${archiveName}-${version}.tgz`);
    tarball = path.relative(REPOSITORY_ROOT, tarball).split(path.sep).join('/');
  }

  const published = options.checkRegistry ? await registryHasVersion(name, version) : false;

  await appendGitHubOutputs({
    version,
    tag,
    prerelease,
    npm_tag: npmTag,
    published,
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
