import { describe, it, expect } from "vitest";
import { validateTaxonomy, validateScope, registerTaxonomy, taxonomyRegistry } from "@mandaitor/taxonomy-core";
import { constructionTaxonomy, CONSTRUCTION_ACTIONS, CONSTRUCTION_RESOURCES, CONSTRUCTION_CONSTRAINTS, CONSTRUCTION_TEMPLATES } from "../src/index";

describe("construction taxonomy", () => {
  it("passes full validation without errors", () => {
    const result = validateTaxonomy(constructionTaxonomy);
    if (!result.valid) {
      console.error("Validation errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("has correct metadata", () => {
    expect(constructionTaxonomy.metadata.id).toBe("construction");
    expect(constructionTaxonomy.metadata.version).toBe("1.2.0");
    expect(constructionTaxonomy.metadata.name).toBe("Construction & Baumanagement");
  });

  it("exports all action categories", () => {
    const categories = new Set(CONSTRUCTION_ACTIONS.map((a) => a.id.split(".")[1]));
    expect(categories).toContain("validation");
    expect(categories).toContain("scheduling");
    expect(categories).toContain("procurement");
    expect(categories).toContain("cost");
    expect(categories).toContain("documentation");
    expect(categories).toContain("handover");
    expect(categories).toContain("defect");
    expect(categories).toContain("safety");
  });

  it("all actions are prefixed with 'construction.'", () => {
    for (const action of CONSTRUCTION_ACTIONS) {
      expect(action.id.startsWith("construction.")).toBe(true);
    }
  });

  it("all CRITICAL actions require human approval", () => {
    const critical = CONSTRUCTION_ACTIONS.filter((a) => a.riskLevel === "CRITICAL");
    expect(critical.length).toBeGreaterThan(0);
    for (const action of critical) {
      expect(action.requiresHumanApproval).toBe(true);
    }
  });

  it("all resource patterns have valid parameter definitions", () => {
    for (const pattern of CONSTRUCTION_RESOURCES) {
      const placeholders = [...pattern.pattern.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      const paramNames = new Set(pattern.parameters.map((p) => p.name));
      for (const placeholder of placeholders) {
        expect(paramNames.has(placeholder)).toBe(true);
      }
    }
  });

  it("all constraint templates have valid types", () => {
    const validTypes = ["TIME", "TRANSACTION", "ESCALATION", "RATE_LIMIT"];
    for (const constraint of CONSTRUCTION_CONSTRAINTS) {
      expect(validTypes).toContain(constraint.type);
    }
  });

  it("all mandate templates reference existing actions", () => {
    const actionIds = new Set(CONSTRUCTION_ACTIONS.map((a) => a.id));
    for (const template of CONSTRUCTION_TEMPLATES) {
      for (const actionId of template.scope.actions) {
        expect(actionIds.has(actionId)).toBe(true);
      }
    }
  });

  it("all mandate templates reference existing resource patterns", () => {
    const patternNames = new Set(CONSTRUCTION_RESOURCES.map((r) => r.name));
    for (const template of CONSTRUCTION_TEMPLATES) {
      for (const patternName of template.scope.resourcePatterns) {
        expect(patternNames.has(patternName)).toBe(true);
      }
    }
  });

  it("can be registered in the taxonomy registry", () => {
    taxonomyRegistry.clear();
    expect(() => registerTaxonomy(constructionTaxonomy)).not.toThrow();
    const retrieved = taxonomyRegistry.get("construction");
    expect(retrieved).toBeDefined();
    expect(retrieved?.metadata.id).toBe("construction");
    taxonomyRegistry.clear();
  });

  it("validates a valid scope", () => {
    const result = validateScope(constructionTaxonomy, {
      actions: ["construction.validation.approve", "construction.validation.flag"],
      effect: "ALLOW",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects an invalid scope with unknown actions", () => {
    const result = validateScope(constructionTaxonomy, {
      actions: ["construction.nonexistent.action"],
    });
    expect(result.valid).toBe(false);
  });

  it("supports wildcard scope validation", () => {
    const result = validateScope(constructionTaxonomy, {
      actions: ["construction.validation.*"],
    });
    expect(result.valid).toBe(true);
  });
});
