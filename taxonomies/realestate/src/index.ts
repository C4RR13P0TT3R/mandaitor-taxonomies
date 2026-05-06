// @mandaitor/taxonomy-realestate — Real Estate & Property Management taxonomy

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { REALESTATE_ACTIONS } from "./actions.js";
import { REALESTATE_RESOURCES } from "./resources.js";
import { REALESTATE_CONSTRAINTS } from "./constraints.js";
import { REALESTATE_TEMPLATES } from "./templates.js";
import { REALESTATE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { REALESTATE_ACTIONS } from "./actions.js";
export { REALESTATE_RESOURCES } from "./resources.js";
export { REALESTATE_CONSTRAINTS } from "./constraints.js";
export { REALESTATE_TEMPLATES } from "./templates.js";
export { REALESTATE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export const realestateTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "realestate",
    version: "0.2.0",
    name: "Real Estate & Property Management",
    description:
      "Industry taxonomy for governed AI delegation in property management, tenant operations, maintenance coordination, contracts, finance, and portfolio reporting.",
    maintainers: [
      { name: "C4RR13P0TT3R", url: "https://github.com/C4RR13P0TT3R" },
    ],
    license: "Apache-2.0",
    coreVersion: "0.2.0",
    tags: ["realestate", "property-management", "tenant-operations", "maintenance"],
    documentationUrl: "https://docs.mandaitor.io",
  },
  actions: REALESTATE_ACTIONS,
  resourcePatterns: REALESTATE_RESOURCES,
  constraintTemplates: REALESTATE_CONSTRAINTS,
  mandateTemplates: REALESTATE_TEMPLATES,
  semanticGraph: REALESTATE_SEMANTIC_GRAPH as any,
};

export default realestateTaxonomy;
