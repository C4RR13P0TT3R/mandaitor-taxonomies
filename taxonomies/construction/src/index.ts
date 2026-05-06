// @mandaitor/taxonomy-construction — Construction industry taxonomy
//
// This taxonomy covers the full construction lifecycle as used by monco.ai:
// plan validation, scheduling, procurement, cost management, documentation,
// defect management, and safety workflows.

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
      "Industry taxonomy for construction project management covering BIM validation, scheduling, procurement, cost management, documentation, defect detection, and safety workflows. Designed for integration with monco.ai.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.3.0",
    tags: ["construction", "bim", "monco", "baumanagement", "agentic-ai"],
    documentationUrl: "https://trust.mandaitor.io",
    standardUrl: "https://www.monco.ai",
  },
  actions: CONSTRUCTION_ACTIONS,
  resourcePatterns: CONSTRUCTION_RESOURCES,
  constraintTemplates: CONSTRUCTION_CONSTRAINTS,
  mandateTemplates: CONSTRUCTION_TEMPLATES,
  semanticGraph: CONSTRUCTION_SEMANTIC_GRAPH as any,
};

export default constructionTaxonomy;
