import { describe, it, expect, beforeEach } from "vitest";
import {
  taxonomyRegistry,
  registerTaxonomy,
  getTaxonomy,
  listTaxonomies,
  lookupAction,
  lookupTemplate,
  searchActions,
} from "../src/registry";
import type { IndustryTaxonomy, TaxonomyMetadata } from "../src/types";

const baseMetadata: TaxonomyMetadata = {
  id: "regtest",
  version: "1.0.0",
  name: "Registry Test Taxonomy",
  description: "Taxonomy used to exercise the in-memory registry",
  maintainers: [{ name: "Test Author", email: "test@example.com" }],
  license: "Apache-2.0",
  coreVersion: "0.1.0",
  tags: ["test"],
};

function makeTaxonomy(overrides: Partial<IndustryTaxonomy> = {}): IndustryTaxonomy {
  return {
    metadata: baseMetadata,
    actions: [
      {
        id: "regtest.category.operation",
        label: "Reg Test Action",
        description: "A registry-test action",
        riskLevel: "LOW",
        requiresHumanApproval: false,
        tags: ["registry", "test"],
      },
    ],
    resourcePatterns: [
      {
        name: "regtest-resource",
        pattern: "regtest:project:{projectId}/*",
        description: "Registry test resource",
        parameters: [
          { name: "projectId", type: "string", description: "Project ID", required: true },
        ],
      },
    ],
    constraintTemplates: [],
    mandateTemplates: [
      {
        id: "regtest.basic-template",
        name: "Registry Basic Template",
        description: "Template for registry tests",
        vertical: "regtest",
        scope: {
          actions: ["regtest.category.operation"],
          resourcePatterns: ["regtest-resource"],
          effect: "ALLOW",
        },
        constraints: { time: { defaultDuration: "P30D" } },
        delegateType: "AGENT",
      },
    ],
    ...overrides,
  };
}

describe("taxonomyRegistry", () => {
  beforeEach(() => {
    taxonomyRegistry.clear();
  });

  it("registers and retrieves a taxonomy by id", () => {
    const tx = makeTaxonomy();
    registerTaxonomy(tx);
    expect(getTaxonomy("regtest")).toBe(tx);
  });

  it("retrieves a specific version when multiple are registered", () => {
    const v1 = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } });
    const v2 = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.2.0" } });
    registerTaxonomy(v1);
    registerTaxonomy(v2);
    expect(getTaxonomy("regtest", "1.0.0")).toBe(v1);
    expect(getTaxonomy("regtest", "1.2.0")).toBe(v2);
  });

  it("returns the latest version when no version is specified", () => {
    const v1 = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } });
    const v2 = makeTaxonomy({ metadata: { ...baseMetadata, version: "2.3.1" } });
    const v3 = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.5.0" } });
    registerTaxonomy(v1);
    registerTaxonomy(v2);
    registerTaxonomy(v3);
    expect(getTaxonomy("regtest")).toBe(v2);
  });

  it("prefers a stable release over a prerelease of the same core version", () => {
    // Order of registration intentionally varies to ensure the result is
    // selection-driven, not insertion-order driven.
    const beta = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0-beta" } });
    const stable = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } });
    registerTaxonomy(beta);
    registerTaxonomy(stable);
    expect(getTaxonomy("regtest")).toBe(stable);
  });

  it("does not let a prerelease (NaN-prone core) corrupt latest selection", () => {
    // The old numeric comparator parsed "1.0.0-beta" as [1, 0, NaN]; NaN
    // comparisons are always false, which could leave a prerelease ranked
    // ahead of a higher stable release. Verify the higher stable wins.
    const beta = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0-beta" } });
    const stableLow = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } });
    const stableHigh = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.1.0" } });
    registerTaxonomy(stableLow);
    registerTaxonomy(beta);
    registerTaxonomy(stableHigh);
    expect(getTaxonomy("regtest")).toBe(stableHigh);
  });

  it("orders correctly across major, minor, and patch", () => {
    const versions = ["1.0.0", "1.0.9", "1.2.0", "2.0.0", "1.10.0"];
    for (const version of versions) {
      registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version } }));
    }
    // 2.0.0 is the highest; note 1.10.0 must outrank 1.2.0 (numeric, not lexical).
    expect(getTaxonomy("regtest")?.metadata.version).toBe("2.0.0");
    taxonomyRegistry.unregister("regtest", "2.0.0");
    expect(getTaxonomy("regtest")?.metadata.version).toBe("1.10.0");
  });

  it("compares multiple prerelease identifiers per semver precedence", () => {
    // Per semver.org §11:
    //   1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta
    //   < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
    const ladder = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
    ];
    for (const version of ladder) {
      registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version } }));
    }
    // Peeling from the top of the ladder downward, getTaxonomy() must return
    // exactly the next-highest precedence version each time.
    for (let i = ladder.length - 1; i >= 0; i--) {
      expect(getTaxonomy("regtest")?.metadata.version).toBe(ladder[i]);
      taxonomyRegistry.unregister("regtest", ladder[i]);
    }
    expect(getTaxonomy("regtest")).toBeUndefined();
  });

  it("ranks a numeric prerelease identifier below an alphanumeric one", () => {
    // 1.0.0-1 < 1.0.0-alpha (numeric identifiers have lower precedence).
    const numericPre = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0-1" } });
    const alphaPre = makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0-alpha" } });
    registerTaxonomy(numericPre);
    registerTaxonomy(alphaPre);
    expect(getTaxonomy("regtest")?.metadata.version).toBe("1.0.0-alpha");
  });

  it("returns undefined for an unknown id", () => {
    expect(getTaxonomy("does-not-exist")).toBeUndefined();
  });

  it("throws when validation fails", () => {
    const bad = makeTaxonomy({ actions: [] });
    expect(() => registerTaxonomy(bad)).toThrow(/failed validation/);
  });

  it("throws when the same id+version is registered twice", () => {
    registerTaxonomy(makeTaxonomy());
    expect(() => registerTaxonomy(makeTaxonomy())).toThrow(/already registered/);
  });

  it("does not accept a skipValidation flag", () => {
    const bad = makeTaxonomy({ actions: [] });
    // The footgun-y skipValidation flag has been removed; the registry must
    // refuse to register an invalid taxonomy regardless of extra options.
    expect(() => (registerTaxonomy as (t: IndustryTaxonomy) => void)(bad)).toThrow(
      /failed validation/,
    );
  });

  it("lists registered taxonomies with their latest version", () => {
    registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } }));
    registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version: "2.0.0" } }));
    const list = listTaxonomies();
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual({
      id: "regtest",
      version: "2.0.0",
      name: "Registry Test Taxonomy",
    });
  });

  it("looks up an action across registered taxonomies", () => {
    registerTaxonomy(makeTaxonomy());
    const result = lookupAction("regtest.category.operation");
    expect(result?.taxonomyId).toBe("regtest");
    expect(result?.action.id).toBe("regtest.category.operation");
    expect(lookupAction("unknown.action")).toBeUndefined();
  });

  it("looks up a mandate template across registered taxonomies", () => {
    registerTaxonomy(makeTaxonomy());
    const result = lookupTemplate("regtest.basic-template");
    expect(result?.taxonomyId).toBe("regtest");
    expect(result?.template.id).toBe("regtest.basic-template");
    expect(lookupTemplate("unknown.template")).toBeUndefined();
  });

  it("searches actions by id, label, and tag", () => {
    registerTaxonomy(makeTaxonomy());
    // id match
    expect(searchActions("operation")).toHaveLength(1);
    // label match (case-insensitive substring)
    expect(searchActions("reg test action")).toHaveLength(1);
    // tag match
    expect(searchActions("registry")).toHaveLength(1);
    // no match
    expect(searchActions("nothing-matches-this")).toHaveLength(0);
  });

  it("unregisters a single version when version is provided", () => {
    registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } }));
    registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version: "2.0.0" } }));
    expect(taxonomyRegistry.unregister("regtest", "1.0.0")).toBe(true);
    expect(getTaxonomy("regtest", "1.0.0")).toBeUndefined();
    expect(getTaxonomy("regtest", "2.0.0")).toBeDefined();
  });

  it("unregisters all versions when no version is provided", () => {
    registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version: "1.0.0" } }));
    registerTaxonomy(makeTaxonomy({ metadata: { ...baseMetadata, version: "2.0.0" } }));
    expect(taxonomyRegistry.unregister("regtest")).toBe(true);
    expect(getTaxonomy("regtest")).toBeUndefined();
  });
});
