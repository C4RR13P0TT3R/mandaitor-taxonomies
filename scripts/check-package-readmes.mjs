#!/usr/bin/env node

import { mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();
const packageRoots = [join(repoRoot, "packages"), join(repoRoot, "taxonomies")];

function collectPackageDirs() {
  const dirs = [];
  for (const root of packageRoots) {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = join(root, entry.name);
      if (existsSync(join(dir, "package.json"))) {
        dirs.push(dir);
      }
    }
  }
  return dirs.sort();
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function packAndList(dir, packageName) {
  const tempDir = mkdtempSync(join(tmpdir(), "mandaitor-pack-"));
  try {
    execFileSync("pnpm", ["pack", "--pack-destination", tempDir], {
      cwd: dir,
      stdio: "pipe",
      encoding: "utf8",
    });

    const tgz = readdirSync(tempDir).find((name) => name.endsWith(".tgz"));
    if (!tgz) {
      throw new Error(`No tarball generated for ${packageName}`);
    }

    const listing = execFileSync("tar", ["-tzf", join(tempDir, tgz)], {
      encoding: "utf8",
      stdio: "pipe",
    })
      .split("\n")
      .filter(Boolean);

    return listing;
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

const failures = [];

for (const dir of collectPackageDirs()) {
  const manifest = readJson(join(dir, "package.json"));
  const readmePath = join(dir, "README.md");
  const distPath = join(dir, "dist");

  if (!existsSync(readmePath)) {
    failures.push(`${manifest.name}: missing README.md at ${readmePath}`);
    continue;
  }

  if (!existsSync(distPath)) {
    failures.push(`${manifest.name}: missing dist/ directory. Run build before README artifact checks.`);
    continue;
  }

  let listing;
  try {
    listing = packAndList(dir, manifest.name);
  } catch (error) {
    failures.push(`${manifest.name}: pnpm pack failed: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  const hasReadme = listing.includes("package/README.md") || listing.includes("README.md");
  if (!hasReadme) {
    failures.push(`${manifest.name}: packed artifact does not contain README.md`);
    continue;
  }

  console.log(`OK ${manifest.name}: README present and included in tarball`);
}

if (failures.length > 0) {
  console.error("README guardrail failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validated ${collectPackageDirs().length} publishable packages.`);
