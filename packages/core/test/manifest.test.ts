import { describe, it, expect } from "vitest";
import type { TaxonomyManifest, TaxonomyManifestEntry } from "../src/manifest.js";

describe("TaxonomyManifest types", () => {
  it("manifest structure is valid", () => {
    const manifest: TaxonomyManifest = {
      schema_version: "1.0.0",
      generated_at: "2026-03-27T10:00:00Z",
      taxonomy_count: 1,
      taxonomies: [
        {
          package: "@mandaitor/taxonomy-construction",
          taxonomyId: "construction",
          version: "1.0.0",
          name: "Construction Industry Taxonomy",
          description: "BIM validation, scheduling, procurement",
          displayName: "Construction Industry Taxonomy",
          verticals: ["construction"],
          license: "Apache-2.0",
          coreVersion: "0.1.0",
          actionsCount: 15,
          resourcesCount: 5,
          constraintsCount: 4,
          templatesCount: 3,
          riskDistribution: { LOW: 5, MEDIUM: 6, HIGH: 3, CRITICAL: 1 },
          tags: ["construction", "bim"],
        },
      ],
    };

    expect(manifest.schema_version).toBe("1.0.0");
    expect(manifest.taxonomy_count).toBe(1);
    expect(manifest.taxonomies).toHaveLength(1);

    const entry = manifest.taxonomies[0];
    expect(entry.taxonomyId).toBe("construction");
    expect(entry.actionsCount).toBe(15);
    expect(entry.riskDistribution.CRITICAL).toBe(1);
    expect(entry.verticals).toContain("construction");
  });

  it("entry validates required fields", () => {
    const entry: TaxonomyManifestEntry = {
      package: "@mandaitor/taxonomy-test",
      taxonomyId: "test",
      version: "0.1.0",
      name: "Test",
      description: "Test taxonomy",
      displayName: "Test",
      verticals: [],
      license: "MIT",
      coreVersion: "0.1.0",
      actionsCount: 0,
      resourcesCount: 0,
      constraintsCount: 0,
      templatesCount: 0,
      riskDistribution: {},
      tags: [],
    };

    expect(entry.package).toBe("@mandaitor/taxonomy-test");
    expect(entry.riskDistribution).toEqual({});
  });
});
