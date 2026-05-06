// @mandaitor/taxonomy-aviation — Aviation operations taxonomy
//
// This taxonomy covers civil aviation operational workflows including dispatch,
// maintenance coordination, crew-compliance monitoring, operational notices,
// and safety escalation.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { AVIATION_ACTIONS } from "./actions.js";
import { AVIATION_RESOURCES } from "./resources.js";
import { AVIATION_CONSTRAINTS } from "./constraints.js";
import { AVIATION_TEMPLATES } from "./templates.js";
import { AVIATION_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { AVIATION_ACTIONS } from "./actions.js";
export { AVIATION_RESOURCES } from "./resources.js";
export { AVIATION_CONSTRAINTS } from "./constraints.js";
export { AVIATION_TEMPLATES } from "./templates.js";
export { AVIATION_SEMANTIC_GRAPH } from "./semantic-graph.js";

export const aviationTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "aviation",
    version: "0.2.0",
    name: "Aviation Operations",
    description:
      "Industry taxonomy for civil aviation operations covering dispatch release preparation, route-briefing updates, maintenance triage, crew-compliance monitoring, flight documentation, and safety escalation workflows.",
    maintainers: [
      {
        name: "Mandaitor Community",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.2.0",
    tags: ["aviation", "dispatch", "maintenance", "safety", "agentic-ai"],
    documentationUrl: "https://trust.mandaitor.io",
    standardUrl: "https://www.icao.int",
  },
  actions: AVIATION_ACTIONS,
  resourcePatterns: AVIATION_RESOURCES,
  constraintTemplates: AVIATION_CONSTRAINTS,
  mandateTemplates: AVIATION_TEMPLATES,
  semanticGraph: AVIATION_SEMANTIC_GRAPH as any,
};

export default aviationTaxonomy;
