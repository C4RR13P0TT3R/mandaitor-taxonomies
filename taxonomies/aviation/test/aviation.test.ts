import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core";
import { aviationTaxonomy, AVIATION_ACTIONS, AVIATION_TEMPLATES } from "../src/index.js";

describe("@mandaitor/taxonomy-aviation", () => {
  it("passes validation with no errors", () => {
    const result = validateTaxonomy(aviationTaxonomy);
    expect(result.errors).toEqual([]);
  });

  it("has the correct taxonomy ID and version", () => {
    expect(aviationTaxonomy.metadata.id).toBe("aviation");
    expect(aviationTaxonomy.metadata.version).toBe("0.2.0");
  });

  it("has at least 8 actions with at least 1 HIGH or CRITICAL action", () => {
    expect(AVIATION_ACTIONS.length).toBeGreaterThanOrEqual(8);
    const elevatedRisk = AVIATION_ACTIONS.filter(
      (a) => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL",
    );
    expect(elevatedRisk.length).toBeGreaterThanOrEqual(1);
  });

  it("has at least 3 templates", () => {
    expect(AVIATION_TEMPLATES.length).toBeGreaterThanOrEqual(3);
  });

  it("all action IDs are prefixed with 'aviation.'", () => {
    for (const action of AVIATION_ACTIONS) {
      expect(action.id).toMatch(/^aviation\./);
    }
  });

  it("HIGH and CRITICAL actions require human approval", () => {
    const gated = AVIATION_ACTIONS.filter(
      (a) => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL",
    );
    for (const action of gated) {
      expect(action.requiresHumanApproval).toBe(true);
    }
  });

  it("includes dispatch, maintenance, and compliance workflow templates", () => {
    const templateNames = AVIATION_TEMPLATES.map((t) => t.id);
    expect(templateNames).toContain("aviation.dispatch-assistant");
    expect(templateNames).toContain("aviation.maintenance-triage");
    expect(templateNames).toContain("aviation.crew-compliance-monitor");
  });
});
