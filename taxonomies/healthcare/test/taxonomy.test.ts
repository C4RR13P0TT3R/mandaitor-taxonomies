import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core/schema";
import { healthcareTaxonomy } from "../src/index.js";

describe("Healthcare Taxonomy", () => {
  it("should pass core schema validation", () => {
    const result = validateTaxonomy(healthcareTaxonomy);
    expect(result.success).toBe(true);
  });
});
