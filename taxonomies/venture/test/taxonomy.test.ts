import { describe, it, expect } from "vitest";
import { validateTaxonomy, validateScope, registerTaxonomy, taxonomyRegistry } from "@mandaitor/taxonomy-core";
import {
  ventureTaxonomy,
  VENTURE_ACTIONS,
  VENTURE_RESOURCES,
  VENTURE_CONSTRAINTS,
  VENTURE_TEMPLATES,
} from "../src/index";

describe("venture taxonomy", () => {
  it("passes full validation without errors", () => {
    const result = validateTaxonomy(ventureTaxonomy);
    if (!result.valid) {
      console.error("Validation errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("has correct metadata", () => {
    expect(ventureTaxonomy.metadata.id).toBe("venture");
    expect(ventureTaxonomy.metadata.version).toBe("0.3.0");
    expect(ventureTaxonomy.metadata.name).toBe("Venture, Startups & Investment Decisioning");
  });

  it("exports all action categories", () => {
    const categories = new Set(VENTURE_ACTIONS.map((a) => a.id.split(".")[1]));
    expect(categories).toContain("deal");
    expect(categories).toContain("diligence");
    expect(categories).toContain("founder");
    expect(categories).toContain("investment");
    expect(categories).toContain("portfolio");
    expect(categories).toContain("fundraising");
  });

  it("all actions are prefixed with 'venture.'", () => {
    for (const action of VENTURE_ACTIONS) {
      expect(action.id.startsWith("venture.")).toBe(true);
    }
  });

  it("all CRITICAL actions require human approval", () => {
    const critical = VENTURE_ACTIONS.filter((a) => a.riskLevel === "CRITICAL");
    expect(critical.length).toBeGreaterThan(0);
    for (const action of critical) {
      expect(action.requiresHumanApproval).toBe(true);
    }
  });

  it("all resource patterns have valid parameter definitions", () => {
    for (const pattern of VENTURE_RESOURCES) {
      const placeholders = [...pattern.pattern.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      const paramNames = new Set(pattern.parameters.map((p) => p.name));
      for (const placeholder of placeholders) {
        expect(paramNames.has(placeholder)).toBe(true);
      }
    }
  });

  it("all constraint templates have valid types", () => {
    const validTypes = ["TIME", "TRANSACTION", "ESCALATION", "RATE_LIMIT"];
    for (const constraint of VENTURE_CONSTRAINTS) {
      expect(validTypes).toContain(constraint.type);
    }
  });

  it("all mandate templates reference existing actions", () => {
    const actionIds = new Set(VENTURE_ACTIONS.map((a) => a.id));
    for (const template of VENTURE_TEMPLATES) {
      for (const actionId of template.scope.actions) {
        expect(actionIds.has(actionId)).toBe(true);
      }
    }
  });

  it("all mandate templates reference existing resource patterns", () => {
    const patternNames = new Set(VENTURE_RESOURCES.map((r) => r.name));
    for (const template of VENTURE_TEMPLATES) {
      for (const patternName of template.scope.resourcePatterns) {
        expect(patternNames.has(patternName)).toBe(true);
      }
    }
  });

  it("can be registered in the taxonomy registry", () => {
    taxonomyRegistry.clear();
    expect(() => registerTaxonomy(ventureTaxonomy)).not.toThrow();
    const retrieved = taxonomyRegistry.get("venture");
    expect(retrieved).toBeDefined();
    expect(retrieved?.metadata.id).toBe("venture");
    taxonomyRegistry.clear();
  });

  it("validates a valid scope", () => {
    const result = validateScope(ventureTaxonomy, {
      actions: ["venture.deal.screen", "venture.diligence.summarize"],
      effect: "ALLOW",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects an invalid scope with unknown actions", () => {
    const result = validateScope(ventureTaxonomy, {
      actions: ["venture.nonexistent.action"],
    });
    expect(result.valid).toBe(false);
  });

  it("supports wildcard scope validation", () => {
    const result = validateScope(ventureTaxonomy, {
      actions: ["venture.deal.*"],
    });
    expect(result.valid).toBe(true);
  });
});
