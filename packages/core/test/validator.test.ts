import { describe, it, expect } from "vitest";
import { validateTaxonomy, validateScope, matchResourcePattern } from "../src/validator";
import type { IndustryTaxonomy, TaxonomyMetadata } from "../src/types";
import type { SemanticGraph } from "../src/semantic-types";

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

  describe("ISO 8601 duration regex", () => {
    function withDuration(duration: string): IndustryTaxonomy {
      return makeTaxonomy({
        mandateTemplates: [
          {
            id: "test.dur-template",
            name: "Duration Template",
            description: "Template under duration test",
            vertical: "test",
            scope: {
              actions: ["test.category.operation"],
              resourcePatterns: ["test-resource"],
              effect: "ALLOW",
            },
            constraints: { time: { defaultDuration: duration } },
            delegateType: "AGENT",
          },
        ],
      });
    }

    const invalid = ["P", "PT", "P0D", "PT0S", "P0Y0M0D", "P0Y0M0DT0H0M0S", "PT0H0M0S"];
    for (const dur of invalid) {
      it(`rejects "${dur}"`, () => {
        const result = validateTaxonomy(withDuration(dur));
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.code === "INVALID_DURATION")).toBe(true);
      });
    }

    const valid = ["P1D", "PT1H30M", "P1Y2M3DT4H5M6S", "P30D", "PT1S", "P1W"];
    for (const dur of valid) {
      it(`accepts "${dur}"`, () => {
        const result = validateTaxonomy(withDuration(dur));
        expect(result.errors.some((e) => e.code === "INVALID_DURATION")).toBe(false);
      });
    }
  });
});

// ── #3: action id dedup + parentAction second pass ──
describe("validateAction id handling", () => {
  const baseAction = {
    label: "Test Action",
    description: "A test action for validation",
    riskLevel: "LOW" as const,
    requiresHumanApproval: false,
    tags: ["test"],
  };

  it("does not report a spurious DUPLICATE for two invalid (empty) ids", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        { ...baseAction, id: "" },
        { ...baseAction, id: "" },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    // Both ids are invalid → two INVALID_ACTION_ID, but NOT a DUPLICATE_ACTION_ID
    expect(result.errors.filter((e) => e.code === "INVALID_ACTION_ID").length).toBe(2);
    expect(result.errors.some((e) => e.code === "DUPLICATE_ACTION_ID")).toBe(false);
  });

  it("still reports a genuine duplicate of a valid id", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        { ...baseAction, id: "test.category.operation" },
        { ...baseAction, id: "test.category.operation" },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.errors.some((e) => e.code === "DUPLICATE_ACTION_ID")).toBe(true);
  });

  it("resolves a forward parentAction reference without error (order-independent)", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        // child appears BEFORE its parent in the array
        { ...baseAction, id: "test.category.child", parentAction: "test.category.parent" },
        { ...baseAction, id: "test.category.parent" },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.errors.some((e) => e.code === "UNKNOWN_PARENT")).toBe(false);
    expect(result.warnings.some((w) => w.code === "UNKNOWN_PARENT")).toBe(false);
  });

  it("reports an unknown parentAction as an ERROR (not a warning)", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        { ...baseAction, id: "test.category.child", parentAction: "test.category.ghost" },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "UNKNOWN_PARENT")).toBe(true);
  });

  it("reports a self-referencing parentAction", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        { ...baseAction, id: "test.category.operation", parentAction: "test.category.operation" },
      ],
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "SELF_PARENT")).toBe(true);
  });
});

// ── #1: semanticGraph is validated by validateTaxonomy ──
describe("validateTaxonomy semanticGraph", () => {
  function withGraph(graph: SemanticGraph): IndustryTaxonomy {
    return makeTaxonomy({ semanticGraph: graph });
  }

  const baseGraph = (edges: SemanticGraph["edges"]): SemanticGraph => ({
    taxonomyId: "test",
    schemaVersion: "1.0.0",
    edges,
    clusters: [],
  });

  it("accepts a graph whose edges reference only existing actions", () => {
    const taxonomy = makeTaxonomy({
      actions: [
        {
          id: "test.category.operation",
          label: "Op One",
          description: "first operation",
          riskLevel: "LOW",
          requiresHumanApproval: false,
          tags: ["test"],
        },
        {
          id: "test.category.other",
          label: "Op Two",
          description: "second operation",
          riskLevel: "LOW",
          requiresHumanApproval: false,
          tags: ["test"],
        },
      ],
      semanticGraph: baseGraph([
        {
          from: "test.category.operation",
          to: "test.category.other",
          type: "PRECEDES",
          weight: 0.6,
          bidirectional: false,
        },
      ]),
    });
    const result = validateTaxonomy(taxonomy);
    expect(result.errors.some((e) => e.code === "INVALID_SEMANTIC_GRAPH")).toBe(false);
    expect(result.valid).toBe(true);
  });

  it("rejects an edge referencing an unknown action", () => {
    const result = validateTaxonomy(
      withGraph(
        baseGraph([
          {
            from: "test.category.operation",
            to: "test.category.ghost",
            type: "PRECEDES",
            weight: 0.5,
            bidirectional: false,
          },
        ]),
      ),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_SEMANTIC_GRAPH")).toBe(true);
  });

  it("rejects an out-of-range edge weight", () => {
    const result = validateTaxonomy(
      withGraph(
        baseGraph([
          {
            from: "test.category.operation",
            to: "test.category.operation",
            type: "IMPLIES",
            weight: 1.5,
            bidirectional: false,
          },
        ]),
      ),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_SEMANTIC_GRAPH")).toBe(true);
  });

  it("rejects a non-numeric edge weight (NaN)", () => {
    const result = validateTaxonomy(
      withGraph(
        baseGraph([
          {
            from: "test.category.operation",
            to: "test.category.operation",
            type: "IMPLIES",
            weight: Number.NaN,
            bidirectional: false,
          },
        ]),
      ),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_SEMANTIC_GRAPH")).toBe(true);
  });

  it("rejects a self-referencing edge", () => {
    const result = validateTaxonomy(
      withGraph(
        baseGraph([
          {
            from: "test.category.operation",
            to: "test.category.operation",
            type: "IMPLIES",
            weight: 0.5,
            bidirectional: false,
          },
        ]),
      ),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_SEMANTIC_GRAPH")).toBe(true);
  });

  it("warns on a graph taxonomyId mismatch", () => {
    const graph = baseGraph([]);
    graph.taxonomyId = "not-test";
    const result = validateTaxonomy(withGraph(graph));
    expect(result.warnings.some((w) => w.code === "SEMANTIC_GRAPH_ID_MISMATCH")).toBe(true);
  });

  it("rejects a cluster referencing an unknown action", () => {
    const graph = baseGraph([]);
    graph.clusters = [
      {
        id: "test.cluster",
        name: "Test Cluster",
        description: "A cluster",
        actionIds: ["test.category.ghost"],
        domain: "test",
      },
    ];
    const result = validateTaxonomy(withGraph(graph));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "INVALID_SEMANTIC_GRAPH")).toBe(true);
  });

  it("ignores a missing semanticGraph (still valid)", () => {
    const result = validateTaxonomy(makeTaxonomy());
    expect(result.valid).toBe(true);
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

  it("treats unmatched braces as literal characters", () => {
    expect(matchResourcePattern("test:{project", "test:{project")).toBe(true);
  });

  // ── #4: param matches an empty segment ──
  // A {param} may resolve to a zero-length value (e.g. a missing id), so an
  // empty trailing segment now matches. Adjacency with ":" and "/" is exercised
  // explicitly so the param boundary behaviour is pinned down.
  describe("param empty / separator adjacency", () => {
    it("matches an empty trailing param value", () => {
      expect(matchResourcePattern("test:project:{projectId}", "test:project:")).toBe(true);
    });

    it("matches a populated trailing param value", () => {
      expect(matchResourcePattern("test:project:{projectId}", "test:project:abc")).toBe(true);
    });

    it("matches an empty param value adjacent to a following ':' literal", () => {
      // {a} is empty, then ":zone:" literal follows
      expect(matchResourcePattern("test:{a}:zone:{b}", "test::zone:z1")).toBe(true);
    });

    it("matches an empty param value adjacent to a following '/' literal", () => {
      expect(matchResourcePattern("test:{a}/zone:{b}", "test:/zone:z1")).toBe(true);
    });

    it("does not let a param swallow the ':' separator", () => {
      // {a} must stop at ':', so it cannot absorb "a1:zone" into one value
      expect(matchResourcePattern("test:{a}", "test:a1:zone")).toBe(false);
    });

    it("does not let a param swallow the '/' separator", () => {
      expect(matchResourcePattern("test:{a}", "test:a1/zone")).toBe(false);
    });
  });

  // ── #2: single "*" is segment-scoped and must NOT cross "/" ──
  describe("single-star wildcard (segment-scoped)", () => {
    it("matches exactly one trailing segment", () => {
      expect(matchResourcePattern("ops:{operationId}/*", "ops:op1/target:t1")).toBe(true);
    });

    it("rejects a resource that escapes the scope across '/' (over-broad case)", () => {
      // The headline over-broad acceptance: ops:{op}/* must NOT match a deeper path.
      expect(
        matchResourcePattern(
          "ops:{operationId}/*",
          "ops:op1/mission:m1/sector:s9/target:t1",
        ),
      ).toBe(false);
    });

    it("allows ':' inside the matched segment but not '/'", () => {
      // "doc:d1" is one segment containing a ':' — allowed.
      expect(
        matchResourcePattern(
          "construction:project:{projectId}/zone:{zoneId}/trade:{tradeId}/*",
          "construction:project:p1/zone:z1/trade:elektro/doc:d1",
        ),
      ).toBe(true);
      // One level deeper is rejected.
      expect(
        matchResourcePattern(
          "construction:project:{projectId}/zone:{zoneId}/trade:{tradeId}/*",
          "construction:project:p1/zone:z1/trade:elektro/sub/doc",
        ),
      ).toBe(false);
    });

    it("scopes the mission-wide pattern to exactly one extra level", () => {
      expect(
        matchResourcePattern(
          "ops:{operationId}/mission:{missionId}/*",
          "ops:op1/mission:m1/sector:s9",
        ),
      ).toBe(true);
      expect(
        matchResourcePattern(
          "ops:{operationId}/mission:{missionId}/*",
          "ops:op1/mission:m1/sector:s9/asset:a1",
        ),
      ).toBe(false);
    });

    it("requires the literal separator before the wildcard segment", () => {
      // Trailing "/*" needs the "/" to be present in the resource.
      expect(matchResourcePattern("ops:{operationId}/*", "ops:op1")).toBe(false);
    });

    it("matches a star embedded inside a single segment without crossing '/'", () => {
      expect(matchResourcePattern("test:prefix*", "test:prefix-and-more")).toBe(true);
      expect(matchResourcePattern("test:prefix*", "test:prefix/extra")).toBe(false);
    });
  });

  // ── #2: explicit "**" recursive wildcard ──
  describe("double-star wildcard (recursive)", () => {
    it("matches a whole subtree across '/'", () => {
      expect(
        matchResourcePattern("ops:{operationId}/**", "ops:op1/mission:m1/sector:s9/target:t1"),
      ).toBe(true);
    });

    it("matches a single trailing segment too", () => {
      expect(matchResourcePattern("ops:{operationId}/**", "ops:op1/x")).toBe(true);
    });

    it("collapses runs of '*' longer than two into a single recursive wildcard", () => {
      expect(matchResourcePattern("ops:{operationId}/***", "ops:op1/a/b/c")).toBe(true);
    });
  });
});
