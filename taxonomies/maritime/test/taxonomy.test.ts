import { describe, it, expect } from "vitest";
import { validateTaxonomy } from "@mandaitor/taxonomy-core";
import taxonomy from "../src/index";

describe("maritime taxonomy", () => {
  it("passes full validation", () => {
    const result = validateTaxonomy(taxonomy);
    if (!result.valid) {
      console.error("Errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.valid).toBe(true);
  });

  it("has correct metadata", () => {
    expect(taxonomy.metadata.id).toBe("maritime");
  });

  it("all actions are prefixed correctly", () => {
    for (const action of taxonomy.actions) {
      expect(action.id.startsWith("maritime.")).toBe(true);
    }
  });
});
