// @mandaitor/taxonomy-defence-isr — Defence and ISR taxonomy
//
// This taxonomy covers intelligence, surveillance, and reconnaissance workflows
// inspired by the Rheinmetall and ESG demos: SAR image analysis, target classification,
// kinetic authorization with MFA, sensor tasking, mission planning, and escalation.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { DEFENCE_ACTIONS } from "./actions.js";
import { DEFENCE_RESOURCES } from "./resources.js";
import { DEFENCE_CONSTRAINTS } from "./constraints.js";
import { DEFENCE_TEMPLATES } from "./templates.js";
import { DEFENCE_ISR_SEMANTIC_GRAPH } from "./semantic-graph.js";

export { DEFENCE_ACTIONS } from "./actions.js";
export { DEFENCE_RESOURCES } from "./resources.js";
export { DEFENCE_CONSTRAINTS } from "./constraints.js";
export { DEFENCE_TEMPLATES } from "./templates.js";
export { DEFENCE_ISR_SEMANTIC_GRAPH } from "./semantic-graph.js";

/**
 * The complete defence and ISR taxonomy.
 */
export const defenceIsrTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "defence",
    version: "1.2.0",
    name: "Defence & ISR Workflows",
    description:
      "Industry taxonomy for defence intelligence, surveillance, and reconnaissance covering imagery analysis, target classification, sensor tasking, mission planning, engagement authorization, and intelligence dissemination. Designed for Rheinmetall/ESG-style AI delegation with strict human-in-the-loop controls.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.3.0",
    tags: ["defence", "isr", "intelligence", "military", "agentic-ai", "human-in-the-loop"],
    documentationUrl: "https://trust.mandaitor.io",
  },
  actions: DEFENCE_ACTIONS,
  resourcePatterns: DEFENCE_RESOURCES,
  constraintTemplates: DEFENCE_CONSTRAINTS,
  mandateTemplates: DEFENCE_TEMPLATES,
  semanticGraph: DEFENCE_ISR_SEMANTIC_GRAPH as any,
};

export default defenceIsrTaxonomy;
