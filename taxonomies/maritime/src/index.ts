// @mandaitor/taxonomy-maritime — Maritime & Port Operations taxonomy

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { MARITIME_ACTIONS } from "./actions.js";
import { MARITIME_RESOURCES } from "./resources.js";
import { MARITIME_CONSTRAINTS } from "./constraints.js";
import { MARITIME_TEMPLATES } from "./templates.js";
import { MARITIME_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { MARITIME_ACTIONS } from "./actions.js";
export { MARITIME_RESOURCES } from "./resources.js";
export { MARITIME_CONSTRAINTS } from "./constraints.js";
export { MARITIME_TEMPLATES } from "./templates.js";
export { MARITIME_SEMANTIC_GRAPH } from "./semantic-graph.js";

export const maritimeTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "maritime",
    version: "0.3.0",
    name: "Maritime & Port Operations",
    description:
      "A civil commercial maritime taxonomy covering vessel traffic coordination, berth and terminal operations, cargo documentation, safety-management reporting, and disruption response.",
    maintainers: [
      { name: "Manus AI", url: "https://github.com/manus-ai" },
    ],
    license: "Apache-2.0",
    coreVersion: "0.3.0",
    tags: ["maritime", "port", "shipping", "logistics", "safety"],
  },
  actions: MARITIME_ACTIONS,
  resourcePatterns: MARITIME_RESOURCES,
  constraintTemplates: MARITIME_CONSTRAINTS,
  mandateTemplates: MARITIME_TEMPLATES,
  semanticGraph: MARITIME_SEMANTIC_GRAPH as any,
};

export default maritimeTaxonomy;
