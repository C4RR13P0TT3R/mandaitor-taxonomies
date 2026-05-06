import { describe, it, expect } from "vitest";
import {
  validateTaxonomy,
  validateScope,
  registerTaxonomy,
  taxonomyRegistry,
} from "@mandaitor/taxonomy-core";
import {
  healthcareTaxonomy,
  HEALTHCARE_ACTIONS,
  HEALTHCARE_RESOURCES,
  HEALTHCARE_CONSTRAINTS,
  HEALTHCARE_TEMPLATES,
} from "../src/index.js";

describe("healthcare taxonomy", () => {
  it("passes full validation without errors", () => {
    const result = validateTaxonomy(healthcareTaxonomy);
    if (!result.valid) {
      console.error("Validation errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("has correct metadata", () => {
    expect(healthcareTaxonomy.metadata.id).toBe("healthcare");
    expect(healthcareTaxonomy.metadata.version).toBe("0.2.0");
    expect(healthcareTaxonomy.metadata.name).toBe("Healthcare & Life Sciences");
  });

  it("exports all action categories", () => {
    const categories = new Set(HEALTHCARE_ACTIONS.map((a) => a.id.split(".")[1]));
    expect(categories).toContain("patient");
    expect(categories).toContain("telemedicine");
    expect(categories).toContain("prescription");
    expect(categories).toContain("documentation");
    expect(categories).toContain("discharge");
    expect(categories).toContain("triage");
  });

  it("all actions are prefixed with 'healthcare.'", () => {
    for (const action of HEALTHCARE_ACTIONS) {
      expect(action.id.startsWith("healthcare.")).toBe(true);
    }
  });

  it("all CRITICAL actions require human approval", () => {
    const critical = HEALTHCARE_ACTIONS.filter((a) => a.riskLevel === "CRITICAL");
    expect(critical.length).toBeGreaterThan(0);
    for (const action of critical) {
      expect(action.requiresHumanApproval).toBe(true);
    }
  });

  it("all resource patterns have valid parameter definitions", () => {
    for (const pattern of HEALTHCARE_RESOURCES) {
      const placeholders = [...pattern.pattern.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      const paramNames = new Set(pattern.parameters.map((p) => p.name));
      for (const placeholder of placeholders) {
        expect(paramNames.has(placeholder)).toBe(true);
      }
    }
  });

  it("all constraint templates have valid types", () => {
    const validTypes = ["TIME", "TRANSACTION", "ESCALATION", "RATE_LIMIT"];
    for (const constraint of HEALTHCARE_CONSTRAINTS) {
      expect(validTypes).toContain(constraint.type);
    }
  });

  it("all mandate templates reference existing actions", () => {
    const actionIds = new Set(HEALTHCARE_ACTIONS.map((a) => a.id));
    for (const template of HEALTHCARE_TEMPLATES) {
      for (const actionId of template.scope.actions) {
        expect(actionIds.has(actionId)).toBe(true);
      }
    }
  });

  it("all mandate templates reference existing resource patterns", () => {
    const patternNames = new Set(HEALTHCARE_RESOURCES.map((r) => r.name));
    for (const template of HEALTHCARE_TEMPLATES) {
      for (const patternName of template.scope.resourcePatterns) {
        expect(patternNames.has(patternName)).toBe(true);
      }
    }
  });

  it("can be registered in the taxonomy registry", () => {
    taxonomyRegistry.clear();
    expect(() => registerTaxonomy(healthcareTaxonomy)).not.toThrow();
    const retrieved = taxonomyRegistry.get("healthcare");
    expect(retrieved).toBeDefined();
    expect(retrieved?.metadata.id).toBe("healthcare");
    taxonomyRegistry.clear();
  });

  it("validates a valid scope", () => {
    const result = validateScope(healthcareTaxonomy, {
      actions: ["healthcare.patient.read_record", "healthcare.telemedicine.initiate_session"],
      effect: "ALLOW",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects an invalid scope with unknown actions", () => {
    const result = validateScope(healthcareTaxonomy, {
      actions: ["healthcare.nonexistent.action"],
    });
    expect(result.valid).toBe(false);
  });

  it("supports wildcard scope validation", () => {
    const result = validateScope(healthcareTaxonomy, {
      actions: ["healthcare.patient.*"],
    });
    expect(result.valid).toBe(true);
  });
});
