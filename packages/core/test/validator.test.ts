import { describe, it, expect } from "vitest";
import { validateTaxonomy, validateScope, matchResourcePattern } from "../src/validator";
import type { IndustryTaxonomy, TaxonomyMetadata } from "../src/types";

const validMetadata: TaxonomyMetadata = {
  id: "test",
  version: "1.0.0",
  name: "Test Taxonomy",
  description: "A test taxonomy for validation testing purposes",
  maintainers: [{ name: "Test Author", email: "test@example.com" }],
  license: "Apache-2.0",
  coreVersion: "0.1.0",
  tags: ["test"],
};

function makeTaxonomy(overrides: Partial<IndustryTaxonomy> = {}): IndustryTaxonomy {
  return {
    metadata: validMetadata,
    actions: [
      {
        id: "test.category.operation",
        label: "Test Action",
        description: "A test action for validation",
        riskLevel: "LOW",
        requiresHumanApproval: false,
        tags: ["test"],
      },
    ],
    resourcePatterns: [
      {
        name: "test-resource",
        pattern: "test:project:{projectId}/*",
        description: "Test resource pattern",
        parameters: [
          { name: "projectId", type: "string", description: "Project ID", required: true },
        ],
      },
    ],
    constraintTemplates: [],
    mandateTemplates: [
      {
        id: "test.basic-template",
        name: "Basic Template",
        description: "A basic test template",
        vertical: "test",
        scope: {
          actions: ["test.category.operation"],
          resourcePatterns: ["test-resource"],
          effect: "ALLOW",
        },
        constraints: { time: { defaultDuration: "P30D" } },
        delegateType: "AGENT",
      },
    ],
    ...overrides,
  };
}

describe("validateTaxonomy", () => {
  it("accepts a valid taxonomy", () => {
    const result = validateTaxonomy(makeTaxonomy());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects invalid taxonomy ID", () => {
    const taxonomy = makeTaxonomy({
      metadata: { ...validMetadata, id: "INVALID" },
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_TAXONOMY_ID")).toBe(true);
  });

  it("rejects invalid semver", () => {
    const taxonomy = makeTaxonomy({
      metadata: { ...validMetadata, version: "not-semver" },
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_VERSION")).toBe(true);
  });

  it("rejects duplicate action IDs", () => {
    const action = {
      id: "test.category.operation",
      label: "Test Action",
      description: "Duplicate action",
      riskLevel: "LOW" as const,
      requiresHumanApproval: false,
      tags: ["test"],
    };
    const taxonomy = makeTaxonomy({ actions: [action, action] });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "DUPLICATE_ACTION_ID")).toBe(true);
  });

  it("rejects action IDs with wrong prefix", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        {
          id: "wrong.category.operation",
          label: "Wrong Prefix",
          description: "Action with wrong prefix",
          riskLevel: "LOW",
          requiresHumanApproval: false,
          tags: ["test"],
        },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "WRONG_ACTION_PREFIX")).toBe(true);
  });

  it("rejects empty actions array", () => {
    const taxonomy = makeTaxonomy({ actions: [] });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "EMPTY_ACTIONS")).toBe(true);
  });

  it("rejects unmatched placeholders in resource patterns", () => {
    const taxonomy = makeTaxonomy({
      resourcePatterns: [
        {
          name: "broken-pattern",
          pattern: "test:project:{projectId}/zone:{zoneId}/*",
          description: "Pattern with missing param def",
          parameters: [
            { name: "projectId", type: "string", description: "Project ID", required: true },
            // zoneId parameter is missing
          ],
        },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "UNMATCHED_PLACEHOLDER")).toBe(true);
  });

  it("rejects templates referencing unknown actions", () => {
    const taxonomy = makeTaxonomy({
      mandateTemplates: [
        {
          id: "test.bad-template",
          name: "Bad Template",
          description: "References unknown action",
          vertical: "test",
          scope: {
            actions: ["test.nonexistent.action"],
            resourcePatterns: ["test-resource"],
            effect: "ALLOW",
          },
          constraints: {},
          delegateType: "AGENT",
        },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "UNKNOWN_TEMPLATE_ACTION")).toBe(true);
  });

  it("warns about CRITICAL actions without human approval", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        {
          id: "test.critical.noapproval",
          label: "Critical No Approval",
          description: "Critical action without human approval",
          riskLevel: "CRITICAL",
          requiresHumanApproval: false,
          tags: ["test"],
        },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.warnings.some((w) => w.code === "CRITICAL_WITHOUT_APPROVAL")).toBe(true);
  });

  it("validates ISO 8601 duration format", () => {
    const taxonomy = makeTaxonomy({
      mandateTemplates: [
        {
          id: "test.bad-duration",
          name: "Bad Duration",
          description: "Template with invalid duration",
          vertical: "test",
          scope: {
            actions: ["test.category.operation"],
            resourcePatterns: ["test-resource"],
            effect: "ALLOW",
          },
          constraints: { time: { defaultDuration: "invalid" } },
          delegateType: "AGENT",
        },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_DURATION")).toBe(true);
  });
});

describe("validateScope", () => {
  const taxonomy = makeTaxonomy();

  it("accepts valid scope", () => {
    const result = validateScope(taxonomy, {
      actions: ["test.category.operation"],
      effect: "ALLOW",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects unknown actions", () => {
    const result = validateScope(taxonomy, {
      actions: ["test.unknown.action"],
    });
    expect(result.valid).toBe(false);
  });

  it("supports wildcard actions", () => {
    const result = validateScope(taxonomy, {
      actions: ["test.category.*"],
    });
    expect(result.valid).toBe(true);
  });
});

describe("matchResourcePattern", () => {
  it("matches parameterized patterns", () => {
    expect(matchResourcePattern("test:project:{projectId}/*", "test:project:abc/anything")).toBe(
      true,
    );
  });

  it("rejects non-matching resources", () => {
    expect(matchResourcePattern("test:project:{projectId}/*", "other:thing")).toBe(false);
  });

  it("rejects empty parameter segments", () => {
    expect(matchResourcePattern("test:project:{projectId}", "test:project:")).toBe(false);
  });

  it("treats unmatched braces as literal characters", () => {
    expect(matchResourcePattern("test:{project", "test:{project")).toBe(true);
  });
});
