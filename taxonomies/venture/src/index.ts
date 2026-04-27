// @mandaitor/taxonomy-venture — Venture industry taxonomy
//
// This taxonomy covers founder and investor workflows:
// sourcing, screening, diligence, investment decisioning, and portfolio follow-up.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { VENTURE_ACTIONS } from "./actions.js";
import { VENTURE_RESOURCES } from "./resources.js";
import { VENTURE_CONSTRAINTS } from "./constraints.js";
import { VENTURE_TEMPLATES } from "./templates.js";
import { VENTURE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { VENTURE_ACTIONS } from "./actions.js";
export { VENTURE_RESOURCES } from "./resources.js";
export { VENTURE_CONSTRAINTS } from "./constraints.js";
export { VENTURE_TEMPLATES } from "./templates.js";
export { VENTURE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export const ventureTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "venture",
    version: "1.0.0",
    name: "Venture Capital & Startups",
    description:
      "Industry taxonomy for venture capital covering deal flow, screening, diligence, investment decisioning, founder support, and portfolio monitoring. Designed for founder and investor agentic workflows.",
    maintainers: [
      {
        name: "Mandaitor Community",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.1.0",
    tags: ["venture", "startup", "investment", "fundraising", "portfolio", "agentic-ai"],
    documentationUrl: "https://trust.mandaitor.io",
    standardUrl: "https://southstarter.com",
  },
  actions: VENTURE_ACTIONS,
  resourcePatterns: VENTURE_RESOURCES,
  constraintTemplates: VENTURE_CONSTRAINTS,
  mandateTemplates: VENTURE_TEMPLATES,
  semanticGraph: VENTURE_SEMANTIC_GRAPH as any,
};

export default ventureTaxonomy;
