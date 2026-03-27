import { describe, it, expect } from "vitest";
import {
  riskLabel,
  riskLabelInfo,
  allRiskLabels,
  supportedLocales,
} from "../src/risk-labels.js";
import type { RiskLevel, RiskLocale } from "../src/risk-labels.js";

describe("riskLabel", () => {
  it("returns English labels by default", () => {
    expect(riskLabel("LOW")).toBe("Low");
    expect(riskLabel("MEDIUM")).toBe("Medium");
    expect(riskLabel("HIGH")).toBe("High");
    expect(riskLabel("CRITICAL")).toBe("Critical");
  });

  it("returns German labels when locale is 'de'", () => {
    expect(riskLabel("LOW", "de")).toBe("Niedrig");
    expect(riskLabel("MEDIUM", "de")).toBe("Mittel");
    expect(riskLabel("HIGH", "de")).toBe("Hoch");
    expect(riskLabel("CRITICAL", "de")).toBe("Kritisch");
  });

  it("falls back to English for unknown locale", () => {
    expect(riskLabel("HIGH", "fr" as RiskLocale)).toBe("High");
  });
});

describe("riskLabelInfo", () => {
  it("returns complete info for LOW risk", () => {
    const info = riskLabelInfo("LOW");
    expect(info.level).toBe("LOW");
    expect(info.label).toBe("Low");
    expect(info.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(info.textColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(info.icon).toBe("shield-check");
    expect(info.sortOrder).toBe(0);
  });

  it("returns complete info for CRITICAL risk in German", () => {
    const info = riskLabelInfo("CRITICAL", "de");
    expect(info.level).toBe("CRITICAL");
    expect(info.label).toBe("Kritisch");
    expect(info.icon).toBe("alert-octagon");
    expect(info.sortOrder).toBe(3);
  });

  it("assigns increasing sort order from LOW to CRITICAL", () => {
    const levels: RiskLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const orders = levels.map((l) => riskLabelInfo(l).sortOrder);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThan(orders[i - 1]);
    }
  });

  it("assigns distinct colors to each risk level", () => {
    const levels: RiskLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const colors = levels.map((l) => riskLabelInfo(l).color);
    const unique = new Set(colors);
    expect(unique.size).toBe(4);
  });
});

describe("allRiskLabels", () => {
  it("returns all 4 risk levels sorted by sortOrder", () => {
    const all = allRiskLabels();
    expect(all).toHaveLength(4);
    expect(all[0].level).toBe("LOW");
    expect(all[1].level).toBe("MEDIUM");
    expect(all[2].level).toBe("HIGH");
    expect(all[3].level).toBe("CRITICAL");
  });

  it("respects locale parameter", () => {
    const deLabels = allRiskLabels("de");
    expect(deLabels[0].label).toBe("Niedrig");
    expect(deLabels[3].label).toBe("Kritisch");
  });
});

describe("supportedLocales", () => {
  it("includes en and de", () => {
    const locales = supportedLocales();
    expect(locales).toContain("en");
    expect(locales).toContain("de");
  });

  it("returns at least 2 locales", () => {
    expect(supportedLocales().length).toBeGreaterThanOrEqual(2);
  });
});
