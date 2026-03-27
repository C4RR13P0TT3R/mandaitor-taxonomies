#!/usr/bin/env node
// scripts/generate-manifest.mjs
//
// Generates a taxonomy manifest (dist/taxonomy-manifest.json) from all
// validated taxonomy packages. This manifest is consumed by the Mandaitor
// backend to dynamically validate taxonomy references in widget configs.
//
// Usage: node scripts/generate-manifest.mjs
// Output: dist/taxonomy-manifest.json

import { readdirSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

const SCHEMA_VERSION = "1.0.0";
const TAXONOMIES_DIR = "taxonomies";
const OUTPUT_DIR = "dist";
const OUTPUT_FILE = join(OUTPUT_DIR, "taxonomy-manifest.json");
const SKIP_DIRS = ["_template"];

async function main() {
  // Dynamic import of core (must be built first)
  const corePath = join(process.cwd(), "packages", "core", "dist", "index.js");
  if (!existsSync(corePath)) {
    console.error("Error: @mandaitor/taxonomy-core must be built first.");
    console.error("Run: pnpm -r build");
    process.exit(1);
  }

  const core = await import(pathToFileURL(corePath).href);

  const dirs = readdirSync(TAXONOMIES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.includes(d.name))
    .map((d) => d.name);

  if (dirs.length === 0) {
    console.log("No taxonomies found.");
    process.exit(0);
  }

  const entries = [];

  for (const dir of dirs) {
    const distIndex = join(process.cwd(), TAXONOMIES_DIR, dir, "dist", "index.js");
    if (!existsSync(distIndex)) {
      console.warn(`  SKIP  ${dir} — not built`);
      continue;
    }

    try {
      const mod = await import(pathToFileURL(distIndex).href);
      const taxonomy = mod.default || mod[`${dir}Taxonomy`];

      if (!taxonomy) {
        console.warn(`  SKIP  ${dir} — no default or named taxonomy export`);
        continue;
      }

      // Validate before including in manifest
      const result = core.validateTaxonomy(taxonomy);
      if (!result.valid) {
        console.error(`  SKIP  ${dir} — validation failed`);
        for (const e of result.errors) {
          console.error(`        ✗ ${e.path}: ${e.message}`);
        }
        continue;
      }

      // Compute risk distribution
      const riskDistribution = {};
      for (const action of taxonomy.actions) {
        riskDistribution[action.riskLevel] = (riskDistribution[action.riskLevel] || 0) + 1;
      }

      // Extract verticals from templates
      const verticals = [...new Set(taxonomy.mandateTemplates.map((t) => t.vertical))];

      entries.push({
        package: `@mandaitor/taxonomy-${dir}`,
        taxonomyId: taxonomy.metadata.id,
        version: taxonomy.metadata.version,
        name: taxonomy.metadata.name,
        description: taxonomy.metadata.description,
        displayName: taxonomy.metadata.name,
        verticals,
        license: taxonomy.metadata.license,
        coreVersion: taxonomy.metadata.coreVersion,
        actionsCount: taxonomy.actions.length,
        resourcesCount: taxonomy.resourcePatterns.length,
        constraintsCount: taxonomy.constraintTemplates.length,
        templatesCount: taxonomy.mandateTemplates.length,
        riskDistribution,
        tags: taxonomy.metadata.tags || [],
      });

      console.log(`  OK    ${dir} v${taxonomy.metadata.version} (${taxonomy.actions.length} actions, ${taxonomy.mandateTemplates.length} templates)`);
    } catch (err) {
      console.error(`  FAIL  ${dir} — ${err.message}`);
    }
  }

  const manifest = {
    schema_version: SCHEMA_VERSION,
    generated_at: new Date().toISOString(),
    taxonomy_count: entries.length,
    taxonomies: entries,
  };

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest written to ${OUTPUT_FILE} (${entries.length} taxonomies)`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
