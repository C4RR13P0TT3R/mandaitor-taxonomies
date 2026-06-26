#!/usr/bin/env node
// scripts/validate-all.mjs
//
// Validates all taxonomy packages in the taxonomies/ directory.
// Runs as part of CI to ensure all contributed taxonomies are valid.
// Usage: node scripts/validate-all.mjs

import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import { execFileSync } from "child_process";

const TAXONOMIES_DIR = "taxonomies";
const SKIP_DIRS = ["_template"];

// Derive the expected named export for a taxonomy dir slug, mirroring exactly
// how scripts/scaffold-taxonomy.mjs generates it:
//   `${taxonomyId.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Taxonomy`
// e.g. "defence-isr" -> "defenceIsrTaxonomy". The previous fallback used the
// raw slug (`${dir}Taxonomy`), which never matched camel-cased hyphenated
// slugs and silently skipped those taxonomies.
function expectedExportName(dir) {
  return `${dir.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Taxonomy`;
}

function ensureBuilt(outputPath, buildArgs, label) {
  if (existsSync(outputPath)) {
    return;
  }

  console.log(`Building ${label}...`);
  execFileSync("pnpm", buildArgs, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
}

async function main() {
  const corePath = join(process.cwd(), "packages", "core", "dist", "index.js");
  ensureBuilt(corePath, ["--filter", "@mandaitor/taxonomy-core", "build"], "@mandaitor/taxonomy-core");

  const core = await import(pathToFileURL(corePath).href);

  const dirs = readdirSync(TAXONOMIES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.includes(d.name))
    .map((d) => d.name);

  if (dirs.length === 0) {
    console.log("No taxonomies found to validate.");
    process.exit(0);
  }

  let hasErrors = false;
  const results = [];

  for (const dir of dirs) {
    const distIndex = join(process.cwd(), TAXONOMIES_DIR, dir, "dist", "index.js");
    ensureBuilt(distIndex, ["--filter", `@mandaitor/taxonomy-${dir}`, "build"], `@mandaitor/taxonomy-${dir}`);

    try {
      // SECURITY NOTE: this import() executes the contributed taxonomy's built
      // dist/index.js (its top-level/module-init code runs) at validation time,
      // BEFORE the taxonomy object is validated. Treat contributed taxonomy code
      // as executable when reasoning about this job — the validate/test CI job
      // (see .github/workflows/ci.yml) is intentionally kept secret-free so a
      // malicious contribution cannot exfiltrate credentials here.
      const mod = await import(pathToFileURL(distIndex).href);
      const exportName = expectedExportName(dir);
      const taxonomy = mod.default || mod[exportName];

      if (!taxonomy) {
        // Fail loudly rather than silently skipping: a taxonomy that exports
        // neither `default` nor the correctly-cased named export is a real
        // packaging error and must not pass CI unnoticed.
        console.error(
          `  FAIL  ${dir} — no taxonomy export found (expected "export default" or named export "${exportName}")`,
        );
        hasErrors = true;
        continue;
      }

      const result = core.validateTaxonomy(taxonomy);

      if (result.valid) {
        const warnCount = result.warnings?.length || 0;
        const warnSuffix = warnCount > 0 ? ` (${warnCount} warnings)` : "";
        console.log(`  PASS  ${dir} v${taxonomy.metadata.version}${warnSuffix}`);
        if (warnCount > 0) {
          for (const w of result.warnings) {
            console.log(`        ⚠ ${w.path}: ${w.message}`);
          }
        }
      } else {
        console.error(`  FAIL  ${dir} v${taxonomy.metadata.version}`);
        for (const e of result.errors) {
          console.error(`        ✗ ${e.path}: ${e.message}`);
        }
        hasErrors = true;
      }

      results.push({
        id: dir,
        version: taxonomy.metadata.version,
        valid: result.valid,
        errors: result.errors.length,
        warnings: result.warnings?.length || 0,
        actions: taxonomy.actions.length,
        resources: taxonomy.resourcePatterns.length,
        templates: taxonomy.mandateTemplates.length,
      });
    } catch (err) {
      console.error(`  FAIL  ${dir} — import error: ${err.message}`);
      hasErrors = true;
    }
  }

  console.log("\n─── Summary ───");
  console.log(`Taxonomies validated: ${results.length}`);
  console.log(`Passed: ${results.filter((r) => r.valid).length}`);
  console.log(`Failed: ${results.filter((r) => !r.valid).length}`);

  if (results.length > 0) {
    console.log("\n  ID                 Version  Actions  Resources  Templates");
    console.log("  ─────────────────  ───────  ───────  ─────────  ─────────");
    for (const r of results) {
      console.log(
        `  ${r.id.padEnd(19)} ${r.version.padEnd(8)} ${String(r.actions).padStart(7)}  ${String(r.resources).padStart(9)}  ${String(r.templates).padStart(9)}`,
      );
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
