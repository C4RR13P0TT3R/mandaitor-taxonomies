import { describe, it, expect } from "vitest";
import {
  SemanticGraphEngine,
  inferSemanticGraph,
  validateSemanticGraph,
} from "../src/semantic-graph";
import type { SemanticGraph } from "../src/semantic-types";
import type { IndustryTaxonomy, TaxonomyMetadata } from "../src/types";

const testMetadata: TaxonomyMetadata = {
  id: "test",
  version: "1.0.0",
  name: "Test Taxonomy",
  description: "A test taxonomy for semantic graph testing",
  maintainers: [{ name: "Test Author" }],
  license: "Apache-2.0",
  coreVersion: "0.1.0",
  tags: ["test"],
};

function makeTestTaxonomy(): IndustryTaxonomy {
  return {
    metadata: testMetadata,
    actions: [
      {
        id: "test.validation.approve",
        label: "Approve",
        description: "Approve validation",
        riskLevel: "HIGH",
        requiresHumanApproval: true,
        tags: ["validation", "approval", "quality"],
      },
      {
        id: "test.validation.reject",
        label: "Reject",
        description: "Reject validation",
        riskLevel: "MEDIUM",
        requiresHumanApproval: false,
        tags: ["validation", "rejection", "quality"],
      },
      {
        id: "test.validation.flag",
        label: "Flag Issue",
        description: "Flag a validation issue",
        riskLevel: "LOW",
        requiresHumanApproval: false,
        tags: ["validation", "flagging", "quality"],
      },
      {
        id: "test.safety.halt",
        label: "Halt Work",
        description: "Emergency halt",
        riskLevel: "CRITICAL",
        requiresHumanApproval: true,
        tags: ["safety", "emergency", "critical"],
      },
      {
        id: "test.documentation.generate",
        label: "Generate Docs",
        description: "Generate documentation",
        riskLevel: "LOW",
        requiresHumanApproval: false,
        tags: ["documentation", "reporting", "automation"],
      },
    ],
    resourcePatterns: [],
    constraintTemplates: [],
    mandateTemplates: [],
  };
}

function makeExplicitGraph(): SemanticGraph {
  return {
    taxonomyId: "test",
    schemaVersion: "1.0.0",
    edges: [
      {
        from: "test.validation.approve",
        to: "test.validation.reject",
        type: "CONFLICTS",
        weight: 1.0,
        bidirectional: true,
        rationale: "Approve and reject are mutually exclusive",
      },
      {
        from: "test.validation.flag",
        to: "test.validation.reject",
        type: "PRECEDES",
        weight: 0.8,
        bidirectional: false,
        rationale: "Flagging typically precedes rejection",
      },
      {
        from: "test.validation.flag",
        to: "test.safety.halt",
        type: "ESCALATES_TO",
        weight: 0.7,
        bidirectional: false,
        rationale: "Flagging can escalate to safety halt",
      },
    ],
    clusters: [
      {
        id: "test.validation",
        name: "Validation",
        description: "Quality validation actions",
        actionIds: [
          "test.validation.approve",
          "test.validation.reject",
          "test.validation.flag",
        ],
        domain: "validation",
      },
    ],
  };
}

describe("SemanticGraphEngine", () => {
  describe("constructor and basic queries", () => {
    it("should build adjacency lists from edges", () => {
      const graph = makeExplicitGraph();
      const engine = new SemanticGraphEngine(graph);

      expect(engine.edgesFrom("test.validation.flag")).toHaveLength(2);
      expect(engine.edgesTo("test.validation.reject")).toHaveLength(2); // CONFLICTS (bidi) + PRECEDES
    });

    it("should handle bidirectional edges", () => {
      const graph = makeExplicitGraph();
      const engine = new SemanticGraphEngine(graph);

      // CONFLICTS is bidirectional
      const fromApprove = engine.edgesFrom("test.validation.approve");
      const fromReject = engine.edgesFrom("test.validation.reject");

      expect(fromApprove.some((e) => e.to === "test.validation.reject")).toBe(true);
      expect(fromReject.some((e) => e.to === "test.validation.approve")).toBe(true);
    });
  });

  describe("semanticDistance", () => {
    it("should return 0 for identical actions", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const result = engine.semanticDistance(
        "test.validation.approve",
        "test.validation.approve",
      );
      expect(result.distance).toBe(0);
      expect(result.path).toEqual(["test.validation.approve"]);
    });

    it("should compute distance for directly connected actions", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const result = engine.semanticDistance(
        "test.validation.flag",
        "test.validation.reject",
      );
      expect(result.distance).toBeGreaterThan(0);
      expect(result.distance).toBeLessThan(1);
      expect(result.path).toContain("test.validation.flag");
      expect(result.path).toContain("test.validation.reject");
    });

    it("should return 1.0 for disconnected actions", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const result = engine.semanticDistance(
        "test.documentation.generate",
        "test.validation.approve",
      );
      // documentation.generate has no edges in the explicit graph
      expect(result.distance).toBe(1.0);
      expect(result.path).toEqual([]);
    });

    it("should find multi-hop paths", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const result = engine.semanticDistance(
        "test.validation.flag",
        "test.safety.halt",
      );
      expect(result.distance).toBeGreaterThan(0);
      expect(result.distance).toBeLessThan(1);
      expect(result.pathTypes).toContain("ESCALATES_TO");
    });
  });

  describe("checkConflicts", () => {
    it("should detect conflicts between opposing actions", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const result = engine.checkConflicts([
        "test.validation.approve",
        "test.validation.reject",
      ]);
      expect(result.hasConflict).toBe(true);
      expect(result.pairs).toHaveLength(1);
      expect(result.pairs[0].weight).toBe(1.0);
    });

    it("should not detect conflicts between non-conflicting actions", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const result = engine.checkConflicts([
        "test.validation.flag",
        "test.documentation.generate",
      ]);
      expect(result.hasConflict).toBe(false);
    });
  });

  describe("intentCoverage", () => {
    it("should compute full coverage when all cluster actions are performed", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const coverage = engine.intentCoverage(
        [
          "test.validation.approve",
          "test.validation.reject",
          "test.validation.flag",
        ],
        "test.validation",
      );
      expect(coverage).toBe(1.0);
    });

    it("should compute partial coverage", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const coverage = engine.intentCoverage(
        ["test.validation.flag"],
        "test.validation",
      );
      expect(coverage).toBeGreaterThan(0);
      expect(coverage).toBeLessThan(1);
    });

    it("should return 0 for unknown cluster", () => {
      const engine = new SemanticGraphEngine(makeExplicitGraph());
      const coverage = engine.intentCoverage(
        ["test.validation.flag"],
        "nonexistent.cluster",
      );
      expect(coverage).toBe(0);
    });
  });

  describe("validateSequence", () => {
    it("should detect missing prerequisites", () => {
      const graph: SemanticGraph = {
        taxonomyId: "test",
        schemaVersion: "1.0.0",
        edges: [
          {
            from: "test.validation.flag",
            to: "test.validation.reject",
            type: "REQUIRES",
            weight: 0.9,
            bidirectional: false,
          },
        ],
        clusters: [],
      };
      const engine = new SemanticGraphEngine(graph);
      const violations = engine.validateSequence([
        "test.validation.reject", // reject without prior flag
      ]);
      expect(violations).toHaveLength(1);
      expect(violations[0].violation).toBe("MISSING_PREREQUISITE");
    });

    it("should pass when prerequisites are met", () => {
      const graph: SemanticGraph = {
        taxonomyId: "test",
        schemaVersion: "1.0.0",
        edges: [
          {
            from: "test.validation.flag",
            to: "test.validation.reject",
            type: "REQUIRES",
            weight: 0.9,
            bidirectional: false,
          },
        ],
        clusters: [],
      };
      const engine = new SemanticGraphEngine(graph);
      const violations = engine.validateSequence([
        "test.validation.flag",
        "test.validation.reject",
      ]);
      expect(violations).toHaveLength(0);
    });
  });
});

describe("inferSemanticGraph", () => {
  it("should infer SEMANTICALLY_NEAR edges from shared tags", () => {
    const taxonomy = makeTestTaxonomy();
    const graph = inferSemanticGraph(taxonomy);

    // approve, reject, and flag all share "validation" and "quality" tags
    const nearEdges = graph.edges.filter((e) => e.type === "SEMANTICALLY_NEAR");
    expect(nearEdges.length).toBeGreaterThan(0);
  });

  it("should infer CONFLICTS edges from opposing tags", () => {
    const taxonomy = makeTestTaxonomy();
    const graph = inferSemanticGraph(taxonomy);

    const conflictEdges = graph.edges.filter((e) => e.type === "CONFLICTS");
    expect(conflictEdges.length).toBeGreaterThan(0);

    // approve and reject should conflict
    const approveReject = conflictEdges.find(
      (e) =>
        (e.from.includes("approve") && e.to.includes("reject")) ||
        (e.from.includes("reject") && e.to.includes("approve")),
    );
    expect(approveReject).toBeDefined();
  });

  it("should infer ESCALATES_TO edges from escalation tags", () => {
    const taxonomy = makeTestTaxonomy();
    const graph = inferSemanticGraph(taxonomy);

    const escalationEdges = graph.edges.filter((e) => e.type === "ESCALATES_TO");
    expect(escalationEdges.length).toBeGreaterThan(0);

    // flag should escalate to halt
    const flagToHalt = escalationEdges.find(
      (e) => e.from.includes("flag") && e.to.includes("halt"),
    );
    expect(flagToHalt).toBeDefined();
  });

  it("should generate clusters from domain groups", () => {
    const taxonomy = makeTestTaxonomy();
    const graph = inferSemanticGraph(taxonomy);

    expect(graph.clusters.length).toBeGreaterThan(0);

    const validationCluster = graph.clusters.find((c) => c.id === "test.validation");
    expect(validationCluster).toBeDefined();
    expect(validationCluster!.actionIds).toHaveLength(3);
  });

  it("should merge explicit edges with inferred ones", () => {
    const taxonomy = makeTestTaxonomy();
    const explicit: Partial<SemanticGraph> = {
      edges: [
        {
          from: "test.validation.approve",
          to: "test.documentation.generate",
          type: "PRECEDES",
          weight: 0.6,
          bidirectional: false,
          rationale: "Manual edge",
        },
      ],
    };
    const graph = inferSemanticGraph(taxonomy, explicit);

    // Should contain both explicit and inferred edges
    const manualEdge = graph.edges.find(
      (e) => e.from === "test.validation.approve" && e.to === "test.documentation.generate",
    );
    expect(manualEdge).toBeDefined();
    expect(manualEdge!.rationale).toBe("Manual edge");

    // Should also have inferred edges
    expect(graph.edges.length).toBeGreaterThan(1);
  });

  it("should not duplicate edges when explicit and inferred overlap", () => {
    const taxonomy = makeTestTaxonomy();
    const explicit: Partial<SemanticGraph> = {
      edges: [
        {
          from: "test.validation.approve",
          to: "test.validation.reject",
          type: "CONFLICTS",
          weight: 1.0,
          bidirectional: true,
          rationale: "Explicit conflict",
        },
      ],
    };
    const graph = inferSemanticGraph(taxonomy, explicit);

    // Count CONFLICTS edges between approve and reject
    const conflictEdges = graph.edges.filter(
      (e) =>
        e.type === "CONFLICTS" &&
        ((e.from.includes("approve") && e.to.includes("reject")) ||
          (e.from.includes("reject") && e.to.includes("approve"))),
    );
    expect(conflictEdges).toHaveLength(1);
    expect(conflictEdges[0].rationale).toBe("Explicit conflict");
  });
});

describe("validateSemanticGraph", () => {
  it("should validate a correct graph", () => {
    const taxonomy = makeTestTaxonomy();
    const graph = makeExplicitGraph();
    const result = validateSemanticGraph(graph, taxonomy);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect references to unknown actions", () => {
    const taxonomy = makeTestTaxonomy();
    const graph: SemanticGraph = {
      taxonomyId: "test",
      schemaVersion: "1.0.0",
      edges: [
        {
          from: "test.nonexistent.action",
          to: "test.validation.approve",
          type: "IMPLIES",
          weight: 0.5,
          bidirectional: false,
        },
      ],
      clusters: [],
    };
    const result = validateSemanticGraph(graph, taxonomy);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should detect invalid weights", () => {
    const taxonomy = makeTestTaxonomy();
    const graph: SemanticGraph = {
      taxonomyId: "test",
      schemaVersion: "1.0.0",
      edges: [
        {
          from: "test.validation.approve",
          to: "test.validation.reject",
          type: "CONFLICTS",
          weight: 1.5, // Invalid
          bidirectional: true,
        },
      ],
      clusters: [],
    };
    const result = validateSemanticGraph(graph, taxonomy);
    expect(result.valid).toBe(false);
  });

  it("should detect self-referencing edges", () => {
    const taxonomy = makeTestTaxonomy();
    const graph: SemanticGraph = {
      taxonomyId: "test",
      schemaVersion: "1.0.0",
      edges: [
        {
          from: "test.validation.approve",
          to: "test.validation.approve",
          type: "IMPLIES",
          weight: 1.0,
          bidirectional: false,
        },
      ],
      clusters: [],
    };
    const result = validateSemanticGraph(graph, taxonomy);
    expect(result.valid).toBe(false);
  });

  it("should reject a non-numeric weight (NaN)", () => {
    const taxonomy = makeTestTaxonomy();
    const graph: SemanticGraph = {
      taxonomyId: "test",
      schemaVersion: "1.0.0",
      edges: [
        {
          from: "test.validation.approve",
          to: "test.validation.reject",
          type: "CONFLICTS",
          weight: Number.NaN,
          bidirectional: true,
        },
      ],
      clusters: [],
    };
    const result = validateSemanticGraph(graph, taxonomy);
    expect(result.valid).toBe(false);
  });
});

// ── #5: inferSemanticGraph token-boundary matching ──
describe("inferSemanticGraph token-boundary matching", () => {
  it("does not match an escalation trigger as a mere substring of an id", () => {
    // "flagship_review" contains "flag" as a SUBSTRING but not as a word token,
    // so it must NOT be treated as the "flag" escalation trigger.
    const taxonomy: IndustryTaxonomy = {
      metadata: testMetadata,
      actions: [
        {
          id: "test.fleet.flagship_review",
          label: "Flagship Review",
          description: "Review the flagship vessel",
          riskLevel: "LOW",
          requiresHumanApproval: false,
          tags: ["fleet"],
        },
        {
          id: "test.safety.halt",
          label: "Halt",
          description: "Emergency halt",
          riskLevel: "CRITICAL",
          requiresHumanApproval: true,
          tags: ["safety"],
        },
      ],
      resourcePatterns: [],
      constraintTemplates: [],
      mandateTemplates: [],
    };
    const graph = inferSemanticGraph(taxonomy);
    const flagshipEscalation = graph.edges.find(
      (e) => e.type === "ESCALATES_TO" && e.from === "test.fleet.flagship_review",
    );
    expect(flagshipEscalation).toBeUndefined();
  });

  it("still infers escalation when the trigger is a real word token of the id", () => {
    // "flag_navigation_risk" → tokens include "flag" → should escalate to "halt".
    const taxonomy: IndustryTaxonomy = {
      metadata: testMetadata,
      actions: [
        {
          id: "test.incident.flag_navigation_risk",
          label: "Flag Navigation Risk",
          description: "Flag a navigation risk",
          riskLevel: "HIGH",
          requiresHumanApproval: true,
          tags: ["incident"],
        },
        {
          id: "test.safety.halt",
          label: "Halt",
          description: "Emergency halt",
          riskLevel: "CRITICAL",
          requiresHumanApproval: true,
          tags: ["safety"],
        },
      ],
      resourcePatterns: [],
      constraintTemplates: [],
      mandateTemplates: [],
    };
    const graph = inferSemanticGraph(taxonomy);
    const flagToHalt = graph.edges.find(
      (e) =>
        e.type === "ESCALATES_TO" &&
        e.from === "test.incident.flag_navigation_risk" &&
        e.to === "test.safety.halt",
    );
    expect(flagToHalt).toBeDefined();
  });

  it("preserves the existing fixture's inferred ESCALATES_TO (flag → halt)", () => {
    const graph = inferSemanticGraph(makeTestTaxonomy());
    const flagToHalt = graph.edges.find(
      (e) => e.type === "ESCALATES_TO" && e.from.includes("flag") && e.to.includes("halt"),
    );
    expect(flagToHalt).toBeDefined();
  });
});

// ── #6: single-source distances + heap identical to per-pair Dijkstra ──
describe("distancesFrom / neighborhood parity", () => {
  it("distancesFrom matches semanticDistance for every target", () => {
    const engine = new SemanticGraphEngine(makeExplicitGraph());
    const sources = [
      "test.validation.flag",
      "test.validation.approve",
      "test.documentation.generate",
    ];
    const targets = [
      "test.validation.flag",
      "test.validation.approve",
      "test.validation.reject",
      "test.safety.halt",
      "test.documentation.generate",
    ];
    for (const source of sources) {
      const distances = engine.distancesFrom(source);
      for (const target of targets) {
        const single = engine.semanticDistance(source, target).distance;
        // Consumers treat an absent key as "unreachable" (1.0); mirror that here.
        const fromMap = distances.get(target) ?? 1.0;
        expect(fromMap).toBeCloseTo(single, 10);
      }
    }
  });

  it("semanticNeighborhood is unchanged by the single-pass rewrite", () => {
    const engine = new SemanticGraphEngine(makeExplicitGraph());
    const source = "test.validation.flag";
    const maxDistance = 0.5;
    // Re-derive the neighborhood the slow way (per-candidate semanticDistance)
    const expected = new Set<string>();
    for (const candidate of [
      "test.validation.approve",
      "test.validation.reject",
      "test.safety.halt",
      "test.documentation.generate",
    ]) {
      if (engine.semanticDistance(source, candidate).distance <= maxDistance) {
        expected.add(candidate);
      }
    }
    expect(new Set(engine.semanticNeighborhood(source, maxDistance))).toEqual(expected);
  });

  it("intentCoverage is unchanged by the cached single-pass rewrite", () => {
    const engine = new SemanticGraphEngine(makeExplicitGraph());
    // Partial coverage path exercises the semantic-distance branch.
    expect(engine.intentCoverage(["test.validation.flag"], "test.validation")).toBeGreaterThan(0);
    expect(engine.intentCoverage(["test.validation.flag"], "test.validation")).toBeLessThan(1);
    // Full coverage.
    expect(
      engine.intentCoverage(
        ["test.validation.approve", "test.validation.reject", "test.validation.flag"],
        "test.validation",
      ),
    ).toBe(1.0);
  });
});
