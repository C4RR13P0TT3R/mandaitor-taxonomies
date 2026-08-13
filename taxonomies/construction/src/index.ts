// @mandaitor/taxonomy-construction — Construction industry taxonomy
//
// This taxonomy covers the full construction lifecycle: plan validation,
// scheduling, procurement, cost management, documentation, defect management,
// and safety workflows.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { CONSTRUCTION_ACTIONS } from "./actions.js";
import { CONSTRUCTION_RESOURCES } from "./resources.js";
import { CONSTRUCTION_CONSTRAINTS } from "./constraints.js";
import { CONSTRUCTION_TEMPLATES } from "./templates.js";
import { CONSTRUCTION_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { CONSTRUCTION_ACTIONS } from "./actions.js";
export { CONSTRUCTION_RESOURCES } from "./resources.js";
export { CONSTRUCTION_CONSTRAINTS } from "./constraints.js";
export { CONSTRUCTION_TEMPLATES } from "./templates.js";
export { CONSTRUCTION_SEMANTIC_GRAPH } from "./semantic-graph.js";

/**
 * The complete construction industry taxonomy.
 */
export const constructionTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "construction",
    version: "1.2.0",
    name: "Construction & Baumanagement",
    description:
      "Industry taxonomy for construction project management covering BIM validation, scheduling, procurement, cost management, documentation, defect detection, and safety workflows. Designed as a reusable delegation baseline for general contractors, trade contractors, and construction software platforms.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.3.0",
    tags: ["construction", "bim", "baumanagement", "agentic-ai"],
    documentationUrl: "https://trust.mandaitor.io",
    // buildingSMART maintains IFC (ISO 16739), the open data standard the
    // model, zone, and trade resource types in this taxonomy align with.
    standardUrl: "https://www.buildingsmart.org",
  },
  actions: CONSTRUCTION_ACTIONS,
  resourcePatterns: CONSTRUCTION_RESOURCES,
  constraintTemplates: CONSTRUCTION_CONSTRAINTS,
  mandateTemplates: CONSTRUCTION_TEMPLATES,
  semanticGraph: CONSTRUCTION_SEMANTIC_GRAPH,
};

export default constructionTaxonomy;
