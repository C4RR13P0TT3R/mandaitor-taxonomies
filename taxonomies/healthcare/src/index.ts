// @mandaitor/taxonomy-healthcare — Healthcare industry taxonomy
//
// This taxonomy covers clinical AI workflows inspired by the Avelios demo:
// patient data access, clinical documentation (letters, reports),
// prescriptions, discharge management, scheduling, triage, and telemedicine.

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

/**
 * The complete healthcare industry taxonomy.
 */
export const healthcareTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "healthcare",
    version: "1.0.0",
    name: "Healthcare & Klinische Workflows",
    description:
      "Industry taxonomy for healthcare covering clinical documentation, patient data access, prescriptions, discharge management, scheduling, triage, and telemedicine workflows. Designed for Avelios-style clinical AI assistants.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.1.0",
    tags: ["healthcare", "clinical", "avelios", "patient-safety", "agentic-ai"],
    documentationUrl: "https://trust.mandaitor.io",
  },
  actions: HEALTHCARE_ACTIONS,
  resourcePatterns: HEALTHCARE_RESOURCES,
  constraintTemplates: HEALTHCARE_CONSTRAINTS,
  mandateTemplates: HEALTHCARE_TEMPLATES,
  semanticGraph: HEALTHCARE_SEMANTIC_GRAPH as any,
};

export default healthcareTaxonomy;
