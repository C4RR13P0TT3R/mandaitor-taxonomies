// @mandaitor/taxonomy-space — Space & Satellite Operations taxonomy
//
// This taxonomy covers civil and commercial satellite mission operations:
// commissioning, routine mission planning, payload tasking, data dissemination,
// constellation coordination, and anomaly escalation.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { SPACE_ACTIONS } from "./actions.js";
import { SPACE_RESOURCES } from "./resources.js";
import { SPACE_CONSTRAINTS } from "./constraints.js";
import { SPACE_TEMPLATES } from "./templates.js";
import { SPACE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { SPACE_ACTIONS } from "./actions.js";
export { SPACE_RESOURCES } from "./resources.js";
export { SPACE_CONSTRAINTS } from "./constraints.js";
export { SPACE_TEMPLATES } from "./templates.js";
export { SPACE_SEMANTIC_GRAPH } from "./semantic-graph.js";

export const spaceTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "space",
    version: "0.1.0",
    name: "Space & Satellite Operations",
    description:
      "Industry taxonomy for civil and commercial satellite mission operations covering commissioning, mission planning, telemetry health monitoring, payload tasking, remote-sensing data handling, and anomaly escalation.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.1.0",
    tags: [
      "space",
      "satellite",
      "mission-operations",
      "remote-sensing",
      "agentic-ai",
    ],
    documentationUrl: "https://trust.mandaitor.io",
    standardUrl: "https://www.unoosa.org/oosa/en/ourwork/spacelaw/principles/remote-sensing-principles.html",
  },
  actions: SPACE_ACTIONS,
  resourcePatterns: SPACE_RESOURCES,
  constraintTemplates: SPACE_CONSTRAINTS,
  mandateTemplates: SPACE_TEMPLATES,
  semanticGraph: SPACE_SEMANTIC_GRAPH as any,
};

export default spaceTaxonomy;
