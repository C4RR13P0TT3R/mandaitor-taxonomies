import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core";
import taxonomy from "../src/index";

describe("realestate taxonomy", () => {
  it("passes full validation", () => {
    const result = validateTaxonomy(taxonomy);
    if (!result.valid) {
      console.error("Errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.valid).toBe(true);
  });

  it("has correct metadata", () => {
    expect(taxonomy.metadata.id).toBe("realestate");
  });

  it("all actions are prefixed correctly", () => {
    for (const action of taxonomy.actions) {
      expect(action.id.startsWith("realestate.")).toBe(true);
    }
  });
});
