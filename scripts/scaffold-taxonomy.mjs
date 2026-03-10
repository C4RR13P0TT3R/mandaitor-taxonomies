#!/usr/bin/env node
// scripts/scaffold-taxonomy.mjs
//
// Scaffolds a new taxonomy directory from the _template.
// Usage: node scripts/scaffold-taxonomy.mjs <taxonomy-id> "<Taxonomy Name>"
// Example: node scripts/scaffold-taxonomy.mjs healthcare "Healthcare & Life Sciences"

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const [, , taxonomyId, taxonomyName] = process.argv;

if (!taxonomyId || !taxonomyName) {
  console.error("Usage: node scripts/scaffold-taxonomy.mjs <taxonomy-id> \"<Taxonomy Name>\"");
  console.error("Example: node scripts/scaffold-taxonomy.mjs healthcare \"Healthcare & Life Sciences\"");
  process.exit(1);
}

// Validate taxonomy ID
if (!/^[a-z][a-z0-9-]*$/.test(taxonomyId)) {
  console.error(`Invalid taxonomy ID: "${taxonomyId}". Must be lowercase alphanumeric with hyphens.`);
  process.exit(1);
}

const taxonomyDir = join("taxonomies", taxonomyId);

if (existsSync(taxonomyDir)) {
  console.error(`Directory already exists: ${taxonomyDir}`);
  process.exit(1);
}

// Create directory structure
mkdirSync(join(taxonomyDir, "src"), { recursive: true });
mkdirSync(join(taxonomyDir, "test"), { recursive: true });

// package.json
writeFileSync(
  join(taxonomyDir, "package.json"),
  JSON.stringify(
    {
      name: `@mandaitor/taxonomy-${taxonomyId}`,
      version: "0.1.0",
      description: `${taxonomyName} taxonomy for Mandaitor`,
      type: "module",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
        },
      },
      files: ["dist"],
      scripts: {
        build: "tsc",
        test: "vitest run",
        lint: "tsc --noEmit",
        clean: "rm -rf dist tsconfig.tsbuildinfo",
      },
      dependencies: {
        "@mandaitor/taxonomy-core": "workspace:*",
      },
      devDependencies: {
        typescript: "^5.6.0",
        vitest: "^2.0.0",
      },
      keywords: ["mandaitor", "taxonomy", taxonomyId, "delegation", "agentic-ai"],
      license: "Apache-2.0",
    },
    null,
    2,
  ) + "\n",
);

// tsconfig.json
writeFileSync(
  join(taxonomyDir, "tsconfig.json"),
  JSON.stringify(
    {
      extends: "../../tsconfig.json",
      compilerOptions: { outDir: "dist", rootDir: "src" },
      include: ["src/**/*.ts"],
      exclude: ["node_modules", "dist", "test"],
    },
    null,
    2,
  ) + "\n",
);

// src/actions.ts
writeFileSync(
  join(taxonomyDir, "src", "actions.ts"),
  `// @mandaitor/taxonomy-${taxonomyId} — Actions
//
// Define actions for the ${taxonomyName} vertical.
// Naming convention: ${taxonomyId}.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const ${taxonomyId.toUpperCase().replace(/-/g, "_")}_ACTIONS: TaxonomyAction[] = [
  // TODO: Add your actions here. Example:
  // {
  //   id: "${taxonomyId}.category.operation",
  //   label: "Operation Name",
  //   description: "What this action authorizes an AI agent to do",
  //   riskLevel: "LOW",
  //   requiresHumanApproval: false,
  //   tags: ["category"],
  // },
];
`,
);

// src/resources.ts
writeFileSync(
  join(taxonomyDir, "src", "resources.ts"),
  `// @mandaitor/taxonomy-${taxonomyId} — Resource patterns

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const ${taxonomyId.toUpperCase().replace(/-/g, "_")}_RESOURCES: TaxonomyResourcePattern[] = [
  // TODO: Add your resource patterns here. Example:
  // {
  //   name: "resource-name",
  //   pattern: "${taxonomyId}:entity:{entityId}/*",
  //   description: "Description of this resource scope",
  //   parameters: [
  //     { name: "entityId", type: "string", description: "Entity ID", required: true },
  //   ],
  // },
];
`,
);

// src/constraints.ts
writeFileSync(
  join(taxonomyDir, "src", "constraints.ts"),
  `// @mandaitor/taxonomy-${taxonomyId} — Constraint templates

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const ${taxonomyId.toUpperCase().replace(/-/g, "_")}_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  // TODO: Add your constraint templates here.
];
`,
);

// src/templates.ts
writeFileSync(
  join(taxonomyDir, "src", "templates.ts"),
  `// @mandaitor/taxonomy-${taxonomyId} — Mandate templates

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const ${taxonomyId.toUpperCase().replace(/-/g, "_")}_TEMPLATES: TaxonomyMandateTemplate[] = [
  // TODO: Add your mandate templates here.
];
`,
);

// src/index.ts
const constPrefix = taxonomyId.toUpperCase().replace(/-/g, "_");
writeFileSync(
  join(taxonomyDir, "src", "index.ts"),
  `// @mandaitor/taxonomy-${taxonomyId} — ${taxonomyName} taxonomy

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { ${constPrefix}_ACTIONS } from "./actions";
import { ${constPrefix}_RESOURCES } from "./resources";
import { ${constPrefix}_CONSTRAINTS } from "./constraints";
import { ${constPrefix}_TEMPLATES } from "./templates";

export { ${constPrefix}_ACTIONS } from "./actions";
export { ${constPrefix}_RESOURCES } from "./resources";
export { ${constPrefix}_CONSTRAINTS } from "./constraints";
export { ${constPrefix}_TEMPLATES } from "./templates";

export const ${taxonomyId.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Taxonomy: IndustryTaxonomy = {
  metadata: {
    id: "${taxonomyId}",
    version: "0.1.0",
    name: "${taxonomyName}",
    description: "TODO: Describe what this taxonomy covers",
    maintainers: [
      { name: "Your Name", url: "https://github.com/your-username" },
    ],
    license: "Apache-2.0",
    coreVersion: "0.1.0",
    tags: ["${taxonomyId}"],
  },
  actions: ${constPrefix}_ACTIONS,
  resourcePatterns: ${constPrefix}_RESOURCES,
  constraintTemplates: ${constPrefix}_CONSTRAINTS,
  mandateTemplates: ${constPrefix}_TEMPLATES,
};

export default ${taxonomyId.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Taxonomy;
`,
);

// test/taxonomy.test.ts
writeFileSync(
  join(taxonomyDir, "test", "taxonomy.test.ts"),
  `import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core";
import taxonomy from "../src/index";

describe("${taxonomyId} taxonomy", () => {
  it("passes full validation", () => {
    const result = validateTaxonomy(taxonomy);
    if (!result.valid) {
      console.error("Errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.valid).toBe(true);
  });

  it("has correct metadata", () => {
    expect(taxonomy.metadata.id).toBe("${taxonomyId}");
  });

  it("all actions are prefixed correctly", () => {
    for (const action of taxonomy.actions) {
      expect(action.id.startsWith("${taxonomyId}.")).toBe(true);
    }
  });
});
`,
);

console.log(`\n  Taxonomy scaffolded at: ${taxonomyDir}/`);
console.log(`\n  Next steps:`);
console.log(`  1. cd ${taxonomyDir}`);
console.log(`  2. Edit src/actions.ts — define your actions`);
console.log(`  3. Edit src/resources.ts — define resource patterns`);
console.log(`  4. Edit src/constraints.ts — define constraint templates`);
console.log(`  5. Edit src/templates.ts — define mandate templates`);
console.log(`  6. Edit src/index.ts — update metadata`);
console.log(`  7. Run: pnpm install && pnpm test`);
console.log(`  8. Submit a PR!\n`);
