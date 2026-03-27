import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core";
import { healthcareTaxonomy, HEALTHCARE_ACTIONS, HEALTHCARE_TEMPLATES } from "../src/index.js";

describe("@mandaitor/taxonomy-healthcare", () => {
  it("passes validation with no errors", () => {
    const result = validateTaxonomy(healthcareTaxonomy);
    expect(result.errors).toEqual([]);
  });

  it("has the correct taxonomy ID and version", () => {
    expect(healthcareTaxonomy.metadata.id).toBe("healthcare");
    expect(healthcareTaxonomy.metadata.version).toBe("1.0.0");
  });

  it("has at least 8 actions with at least 1 HIGH risk", () => {
    expect(HEALTHCARE_ACTIONS.length).toBeGreaterThanOrEqual(8);
    const highRisk = HEALTHCARE_ACTIONS.filter(
      (a) => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL",
    );
    expect(highRisk.length).toBeGreaterThanOrEqual(1);
  });

  it("has at least 3 templates", () => {
    expect(HEALTHCARE_TEMPLATES.length).toBeGreaterThanOrEqual(3);
  });

  it("all action IDs are prefixed with 'healthcare.'", () => {
    for (const action of HEALTHCARE_ACTIONS) {
      expect(action.id).toMatch(/^healthcare\./);
    }
  });

  it("CRITICAL actions require human approval", () => {
    const critical = HEALTHCARE_ACTIONS.filter((a) => a.riskLevel === "CRITICAL");
    for (const action of critical) {
      expect(action.requiresHumanApproval).toBe(true);
    }
  });

  it("has templates covering read, edit/draft, and send workflows", () => {
    const templateNames = HEALTHCARE_TEMPLATES.map((t) => t.id);
    expect(templateNames).toContain("healthcare.clinical-reader");
    expect(templateNames).toContain("healthcare.letter-assistant");
    expect(templateNames).toContain("healthcare.letter-sender");
  });
});
