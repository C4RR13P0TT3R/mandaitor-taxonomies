import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core";
import { defenceIsrTaxonomy, DEFENCE_ACTIONS, DEFENCE_TEMPLATES } from "../src/index.js";

describe("@mandaitor/taxonomy-defence-isr", () => {
  it("passes validation with no errors", () => {
    const result = validateTaxonomy(defenceIsrTaxonomy);
    expect(result.errors).toEqual([]);
  });

  it("has the correct taxonomy ID and version", () => {
    expect(defenceIsrTaxonomy.metadata.id).toBe("defence");
    expect(defenceIsrTaxonomy.metadata.version).toBe("1.0.0");
  });

  it("has at least 10 actions", () => {
    expect(DEFENCE_ACTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it("has escalation templates for HIGH/CRITICAL actions", () => {
    const criticalActions = DEFENCE_ACTIONS.filter((a) => a.riskLevel === "CRITICAL");
    expect(criticalActions.length).toBeGreaterThanOrEqual(1);
    for (const action of criticalActions) {
      expect(action.requiresHumanApproval).toBe(true);
    }
  });

  it("has mission-scoped resource patterns", () => {
    const patterns = defenceIsrTaxonomy.resourcePatterns.map((r) => r.name);
    expect(patterns).toContain("mission-sector");
    expect(patterns).toContain("mission-wide");
    expect(patterns).toContain("sensor-platform");
  });

  it("has engagement authorization template with MFA escalation", () => {
    const engagementTemplate = DEFENCE_TEMPLATES.find(
      (t) => t.id === "defence.engagement-recommendation",
    );
    expect(engagementTemplate).toBeDefined();
    expect(engagementTemplate!.constraints.escalationRules).toBeDefined();
    expect(engagementTemplate!.constraints.escalationRules!.require_mfa).toBe(true);
  });

  it("all action IDs are prefixed with 'defence.'", () => {
    for (const action of DEFENCE_ACTIONS) {
      expect(action.id).toMatch(/^defence\./);
    }
  });
});
