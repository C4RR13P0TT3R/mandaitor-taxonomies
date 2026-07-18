#!/usr/bin/env node
/**
 * Release tooling for the publish workflow. Three subcommands:
 *
 *   check-tag <tag>            Guard: for a component tag (<component>-vX.Y.Z)
 *                              assert the component's package.json version
 *                              matches the tag. Catches the "release tagged
 *                              but versions never bumped" failure that made
 *                              the v2.0.x releases publish nothing. Legacy
 *                              root tags (vX.Y.Z) are allowed with a warning
 *                              (backfills of historical releases).
 *                              Outputs TAG_KIND / TAG_COMPONENT / TAG_VERSION
 *                              lines suitable for $GITHUB_ENV.
 *
 *   snapshot <out.json>        Record, for every publishable workspace
 *                              package, whether its current version already
 *                              exists on the npm registry.
 *
 *   verify <pre.json> <out.json>
 *                              Re-check the registry after `pnpm -r publish`
 *                              and compute the delta: published-by-this-run,
 *                              already-published, and still-missing (missing
 *                              => the publish genuinely failed => exit 1).
 *
 * Registry reads use the public npm API and need no auth.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const REGISTRY = process.env.NPM_REGISTRY_URL || "https://registry.npmjs.org";

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function loadWorkspacePackages() {
  const files = ["packages", "taxonomies"]
    .flatMap((root) =>
      readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(root, entry.name, "package.json")),
    )
    .filter((file) => existsSync(file))
    .sort();
  return files
    .map((file) => {
      const pkg = JSON.parse(readFileSync(file, "utf8"));
      return {
        dir: path.dirname(file),
        name: pkg.name,
        version: pkg.version,
        private: Boolean(pkg.private),
      };
    })
    .filter((pkg) => !pkg.private);
}

async function versionOnRegistry(name, version) {
  const url = `${REGISTRY}/${encodeURIComponent(name)}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (res.status === 404) return false;
  if (!res.ok) {
    throw new Error(`Registry lookup failed for ${name}: HTTP ${res.status}`);
  }
  const data = await res.json();
  return Boolean(data.versions && data.versions[version]);
}

async function snapshot(outFile) {
  const packages = loadWorkspacePackages();
  const entries = [];
  for (const pkg of packages) {
    const onRegistry = await versionOnRegistry(pkg.name, pkg.version);
    entries.push({ ...pkg, onRegistry });
    console.log(`${pkg.name}@${pkg.version}: ${onRegistry ? "already on registry" : "NOT on registry (pending publish)"}`);
  }
  writeFileSync(outFile, JSON.stringify(entries, null, 2) + "\n");
}

async function verify(preFile, outFile) {
  const pre = JSON.parse(readFileSync(preFile, "utf8"));
  const published = [];
  const alreadyPublished = [];
  const missing = [];
  for (const pkg of pre) {
    const onRegistryNow = await versionOnRegistry(pkg.name, pkg.version);
    const record = { name: pkg.name, version: pkg.version, dir: pkg.dir };
    if (!pkg.onRegistry && onRegistryNow) published.push(record);
    else if (pkg.onRegistry) alreadyPublished.push(record);
    else missing.push(record);
  }
  const delta = { published, already_published: alreadyPublished, missing };
  writeFileSync(outFile, JSON.stringify(delta, null, 2) + "\n");

  for (const p of published) console.log(`published: ${p.name}@${p.version}`);
  for (const p of alreadyPublished) console.log(`already on registry: ${p.name}@${p.version}`);
  if (missing.length > 0) {
    for (const p of missing) console.error(`::error::MISSING after publish: ${p.name}@${p.version}`);
    fail(`${missing.length} package version(s) still absent from the registry after publish.`);
  }
}

function checkTag(tag) {
  const packages = loadWorkspacePackages();
  const componentMatch = tag.match(/^(.*)-v(\d+\.\d+\.\d+.*)$/);
  const lines = [];

  if (componentMatch) {
    const [, component, version] = componentMatch;
    const pkg = packages.find((p) => p.name === `@mandaitor/${component}`);
    if (!pkg) {
      fail(
        `Release tag "${tag}" names component "${component}", but no publishable workspace package is called @mandaitor/${component}.`,
      );
    }
    if (pkg.version !== version) {
      fail(
        `Release tag "${tag}" expects ${pkg.name}@${version}, but the checked-out package.json says ${pkg.version}. ` +
          `The tag points at a commit whose versions were never bumped — publishing would be a silent no-op ` +
          `(this is exactly what made the v2.0.x releases publish nothing).`,
      );
    }
    console.log(`Tag OK: ${tag} matches ${pkg.name}@${pkg.version}`);
    lines.push("TAG_KIND=component", `TAG_COMPONENT=${pkg.name}`, `TAG_VERSION=${version}`);
  } else if (/^v\d+\.\d+\.\d+/.test(tag)) {
    console.log(
      `::warning::Legacy root tag "${tag}" — root tags do not carry package versions. ` +
        `Per-package releases use component tags (e.g. taxonomy-core-v0.4.0). ` +
        `This run publishes whatever workspace versions are missing from the registry.`,
    );
    lines.push("TAG_KIND=legacy", "TAG_COMPONENT=", "TAG_VERSION=");
  } else {
    fail(`Unrecognized release tag "${tag}" — expected <component>-vX.Y.Z or legacy vX.Y.Z.`);
  }

  const envFile = process.env.GITHUB_ENV;
  if (envFile) writeFileSync(envFile, lines.join("\n") + "\n", { flag: "a" });
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === "check-tag" && args.length === 1) checkTag(args[0]);
  else if (command === "snapshot" && args.length === 1) await snapshot(args[0]);
  else if (command === "verify" && args.length === 2) await verify(args[0], args[1]);
  else {
    console.error(
      "Usage: release-tools.mjs check-tag <tag> | snapshot <out.json> | verify <pre.json> <out.json>",
    );
    process.exit(2);
  }
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
