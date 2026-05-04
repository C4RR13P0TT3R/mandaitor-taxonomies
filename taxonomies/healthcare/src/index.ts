import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";

import { HEALTHCARE_ACTIONS } from "./actions.js";
import { HEALTHCARE_RESOURCES } from "./resources.js";
import { HEALTHCARE_CONSTRAINTS } from "./constraints.js";
import { HEALTHCARE_TEMPLATES } from "./templates.js";
import { HEALTHCARE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { HEALTHCARE_ACTIONS } from "./actions.js";
export { HEALTHCARE_RESOURCES } from "./resources.js";
export { HEALTHCARE_CONSTRAINTS } from "./constraints.js";
export { HEALTHCARE_TEMPLATES } from "./templates.js";
export { HEALTHCARE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export const healthcareTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "healthcare",
    version: "1.0.0",
    name: "Healthcare & Life Sciences",
    description: "Industry taxonomy for healthcare workflows including patient management, telemedicine, and prescriptions.",
    maintainers: [
      {
        name: "Mandaitor Community",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies"
      }
    ],
    license: "Apache-2.0",
    coreVersion: "0.1.0",
    tags: ["healthcare", "telemedicine", "medical"]
  },
  actions: HEALTHCARE_ACTIONS,
  resourcePatterns: HEALTHCARE_RESOURCES,
  constraintTemplates: HEALTHCARE_CONSTRAINTS,
  mandateTemplates: HEALTHCARE_TEMPLATES,
  semanticGraph: HEALTHCARE_SEMANTIC_GRAPH as any
};

export default healthcareTaxonomy;
