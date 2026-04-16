// @mandaitor/taxonomy-venture — Venture, Startups & Investment Decisioning taxonomy
//
// This taxonomy covers founder-investor workflows across deal sourcing,
// opportunity screening, diligence coordination, investment governance,
// fundraising support, and portfolio monitoring.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { VENTURE_ACTIONS } from "./actions.js";
import { VENTURE_RESOURCES } from "./resources.js";
import { VENTURE_CONSTRAINTS } from "./constraints.js";
import { VENTURE_TEMPLATES } from "./templates.js";

export { VENTURE_ACTIONS } from "./actions.js";
export { VENTURE_RESOURCES } from "./resources.js";
export { VENTURE_CONSTRAINTS } from "./constraints.js";
export { VENTURE_TEMPLATES } from "./templates.js";

export const ventureTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "venture",
    version: "1.0.0",
    name: "Venture, Startups & Investment Decisioning",
    description:
      "Industry taxonomy for venture, founder, and investor workflows covering opportunity screening, startup diligence, investment memo preparation, fundraising coordination, and portfolio monitoring. Designed as a reusable delegation baseline for accelerator, venture studio, and early-stage investment contexts.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "0.1.0",
    tags: ["venture", "startup", "investment", "fundraising", "portfolio", "agentic-ai"],
    documentationUrl: "https://docs.mandaitor.io",
    standardUrl: "https://southstarter.com",
  },
  actions: VENTURE_ACTIONS,
  resourcePatterns: VENTURE_RESOURCES,
  constraintTemplates: VENTURE_CONSTRAINTS,
  mandateTemplates: VENTURE_TEMPLATES,
};

export default ventureTaxonomy;
