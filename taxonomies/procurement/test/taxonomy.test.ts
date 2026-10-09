import { describe, it, expect } from "vitest";
import {
  validateTaxonomy,
  validateScope,
  registerTaxonomy,
  taxonomyRegistry,
  matchResourcePattern,
} from "@mandaitor/taxonomy-core";
import {
  procurementTaxonomy,
  PROCUREMENT_ACTIONS,
  PROCUREMENT_RESOURCES,
  PROCUREMENT_CONSTRAINTS,
  PROCUREMENT_TEMPLATES,
} from "../src/index";
import { MONEY_SCHEMA } from "../src/constraints";

type Money = { currency: string; value: string };

/** Money in integer minor units, the way the execution path compares it. */
function minorUnits(money: Money): bigint {
  const [whole, fraction = ""] = money.value.split(".");
  return BigInt(whole + fraction.padEnd(2, "0"));
}

function isMoney(value: unknown): value is Money {
  if (typeof value !== "object" || value === null) return false;
  const keys = Object.keys(value).sort();
  const { currency, value: amount } = value as Record<string, unknown>;
  return (
    keys.join(",") === "currency,value" &&
    typeof currency === "string" &&
    new RegExp(MONEY_SCHEMA.properties.currency.pattern).test(currency) &&
    typeof amount === "string" &&
    new RegExp(MONEY_SCHEMA.properties.value.pattern).test(amount)
  );
}

const resourcePattern = (name: string): string => {
  const found = PROCUREMENT_RESOURCES.find((r) => r.name === name);
  if (!found) throw new Error(`no resource pattern named ${name}`);
  return found.pattern;
};

describe("procurement taxonomy", () => {
  it("passes full validation with no errors and no warnings", () => {
    const result = validateTaxonomy(procurementTaxonomy);
    if (!result.valid) {
      console.error(
        "Validation errors:",
        JSON.stringify(result.errors, null, 2),
      );
    }
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("has correct metadata", () => {
    expect(procurementTaxonomy.metadata.id).toBe("procurement");
    expect(procurementTaxonomy.metadata.version).toBe("0.1.0");
    expect(procurementTaxonomy.metadata.name).toBe("Procurement");
  });

  it("defines exactly the one action Phase 1 executes", () => {
    expect(PROCUREMENT_ACTIONS.map((a) => a.id)).toEqual([
      "procurement.requisition.release",
    ]);
  });

  it("leaves the approval threshold to the mandate", () => {
    // requiresHumanApproval would make every release wait for a person,
    // overriding the principal's escalation_rules.amount_above.
    const [release] = PROCUREMENT_ACTIONS;
    expect(release.requiresHumanApproval).toBe(false);
    expect(release.riskLevel).toBe("HIGH");
  });

  describe("resource patterns", () => {
    it("define every placeholder as a parameter", () => {
      for (const pattern of PROCUREMENT_RESOURCES) {
        const placeholders = [...pattern.pattern.matchAll(/\{([^}]+)\}/g)].map(
          (m) => m[1],
        );
        const paramNames = new Set(pattern.parameters.map((p) => p.name));
        for (const placeholder of placeholders) {
          expect(paramNames.has(placeholder)).toBe(true);
        }
      }
    });

    it("never use the subtree wildcard", () => {
      for (const pattern of PROCUREMENT_RESOURCES) {
        expect(pattern.pattern).not.toContain("**");
      }
    });

    it("name their placeholders after the facts a tool reads", () => {
      expect(resourcePattern("requisition")).toBe(
        "procurement:plant:{plant}/requisition:{purchase_requisition}",
      );
    });

    // A mandate made from the template names one plant in place of {plant}.
    const plant1000 = resourcePattern("plant-requisitions").replace(
      "{plant}",
      "1000",
    );

    it("let a plant mandate cover that plant's requisitions", () => {
      expect(plant1000).toBe("procurement:plant:1000/requisition:*");
      expect(
        matchResourcePattern(
          plant1000,
          "procurement:plant:1000/requisition:10000124",
        ),
      ).toBe(true);
    });

    it("do not let a plant mandate cover another plant", () => {
      expect(
        matchResourcePattern(
          plant1000,
          "procurement:plant:2000/requisition:10000124",
        ),
      ).toBe(false);
      expect(
        matchResourcePattern(
          plant1000,
          "procurement:plant:10000/requisition:10000124",
        ),
      ).toBe(false);
    });

    it("do not let a plant mandate reach below a requisition", () => {
      expect(
        matchResourcePattern(
          plant1000,
          "procurement:plant:1000/requisition:10000124/item:10",
        ),
      ).toBe(false);
    });

    it("do not let a separator in a value widen the wildcard", () => {
      // What a forged plant value "1000/requisition:999" would produce.
      expect(
        matchResourcePattern(
          plant1000,
          "procurement:plant:1000/requisition:999/requisition:10000124",
        ),
      ).toBe(false);
    });

    it("match a concrete requisition with the record pattern, and nothing longer", () => {
      const record = resourcePattern("requisition");
      expect(
        matchResourcePattern(
          record,
          "procurement:plant:1000/requisition:10000124",
        ),
      ).toBe(true);
      expect(
        matchResourcePattern(
          record,
          "procurement:plant:1000/requisition:10000124/x",
        ),
      ).toBe(false);
    });
  });

  describe("constraint templates", () => {
    it("are prefixed and typed", () => {
      for (const constraint of PROCUREMENT_CONSTRAINTS) {
        expect(constraint.id.startsWith("procurement.")).toBe(true);
      }
      expect(PROCUREMENT_CONSTRAINTS.map((c) => c.type).sort()).toEqual([
        "ESCALATION",
        "TRANSACTION",
      ]);
    });

    it("use only keys the execution path recognises", () => {
      const allowed: Record<string, string[]> = {
        TRANSACTION: ["max_amount"],
        ESCALATION: ["amount_above", "escalate_to"],
      };
      for (const constraint of PROCUREMENT_CONSTRAINTS) {
        const properties = Object.keys(
          (constraint.schema as { properties: Record<string, unknown> })
            .properties,
        );
        for (const key of properties) {
          expect(allowed[constraint.type]).toContain(key);
        }
        for (const key of Object.keys(constraint.defaults)) {
          expect(allowed[constraint.type]).toContain(key);
        }
        expect(
          (constraint.schema as { additionalProperties: unknown })
            .additionalProperties,
        ).toBe(false);
      }
    });

    it("state default amounts as exact decimal strings", () => {
      for (const constraint of PROCUREMENT_CONSTRAINTS) {
        for (const value of Object.values(constraint.defaults)) {
          expect(isMoney(value)).toBe(true);
          // EUR has two minor-unit digits; the execution path stores them all.
          expect((value as Money).value).toMatch(/^\d+\.\d{2}$/);
        }
      }
    });

    it("refuse money as a number", () => {
      expect(isMoney({ currency: "EUR", value: 10000 })).toBe(false);
      expect(isMoney({ currency: "eur", value: "10000.00" })).toBe(false);
      expect(isMoney({ currency: "EUR", value: "1e4" })).toBe(false);
      expect(isMoney({ currency: "EUR", value: "10000.00", extra: true })).toBe(
        false,
      );
    });
  });

  describe("mandate template", () => {
    const [template] = PROCUREMENT_TEMPLATES;
    const cap = (
      template.constraints.transactionLimits as { max_amount: Money }
    ).max_amount;
    const threshold = (
      template.constraints.escalationRules as { amount_above: Money }
    ).amount_above;

    it("scopes one plant's requisitions to the release action", () => {
      expect(PROCUREMENT_TEMPLATES).toHaveLength(1);
      expect(template.scope).toEqual({
        actions: ["procurement.requisition.release"],
        resourcePatterns: ["plant-requisitions"],
        effect: "ALLOW",
      });
      expect(template.delegateType).toBe("AGENT");
    });

    it("carries only execution keys inside its constraint blocks", () => {
      expect(Object.keys(template.constraints.transactionLimits ?? {})).toEqual(
        ["max_amount"],
      );
      expect(Object.keys(template.constraints.escalationRules ?? {})).toEqual([
        "amount_above",
      ]);
      expect(template.constraints.rateLimits).toBeUndefined();
      expect(template.scope.conditions).toBeUndefined();
    });

    it("puts the approval threshold below the cap, in one currency", () => {
      expect(isMoney(cap)).toBe(true);
      expect(isMoney(threshold)).toBe(true);
      expect(threshold.currency).toBe(cap.currency);
      expect(minorUnits(threshold) < minorUnits(cap)).toBe(true);
    });

    it("references only defined actions and resource patterns", () => {
      const actionIds = new Set(PROCUREMENT_ACTIONS.map((a) => a.id));
      const patternNames = new Set(PROCUREMENT_RESOURCES.map((r) => r.name));
      for (const actionId of template.scope.actions)
        expect(actionIds.has(actionId)).toBe(true);
      for (const name of template.scope.resourcePatterns)
        expect(patternNames.has(name)).toBe(true);
    });
  });

  it("can be registered in the taxonomy registry", () => {
    taxonomyRegistry.clear();
    expect(() => registerTaxonomy(procurementTaxonomy)).not.toThrow();
    expect(taxonomyRegistry.get("procurement")?.metadata.id).toBe(
      "procurement",
    );
    taxonomyRegistry.clear();
  });

  it("validates scopes against the taxonomy", () => {
    expect(
      validateScope(procurementTaxonomy, {
        actions: ["procurement.requisition.release"],
        resources: ["procurement:plant:1000/requisition:*"],
        effect: "ALLOW",
      }).valid,
    ).toBe(true);
    expect(
      validateScope(procurementTaxonomy, {
        actions: ["procurement.requisition.*"],
      }).valid,
    ).toBe(true);
    expect(
      validateScope(procurementTaxonomy, {
        actions: ["procurement.order.create"],
      }).valid,
    ).toBe(false);
    expect(
      validateScope(procurementTaxonomy, {
        resources: ["procurement:vendor:4711"],
      }).valid,
    ).toBe(false);
  });
});
