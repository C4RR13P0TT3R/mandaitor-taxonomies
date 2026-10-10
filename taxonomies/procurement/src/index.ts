// @mandaitor/taxonomy-procurement — Procurement function taxonomy
//
// The first function taxonomy beside the industry ones. It names business
// operations on procurement records in vendor-neutral terms, so that one
// mandate covers the operation on whichever system a tenant connects.
// Mandaitor's execution path (mandaitor-core docs/execution/) maps tools onto
// these actions and reads every amount from the system of record.

import type { IndustryTaxonomy } from "@mandaitor/taxonomy-core";
import { PROCUREMENT_ACTIONS } from "./actions.js";
import { PROCUREMENT_RESOURCES } from "./resources.js";
import { PROCUREMENT_CONSTRAINTS } from "./constraints.js";
import { PROCUREMENT_TEMPLATES } from "./templates.js";

export { PROCUREMENT_ACTIONS } from "./actions.js";
export { PROCUREMENT_RESOURCES } from "./resources.js";
export { PROCUREMENT_CONSTRAINTS } from "./constraints.js";
export { PROCUREMENT_TEMPLATES } from "./templates.js";

export const procurementTaxonomy: IndustryTaxonomy = {
  metadata: {
    id: "procurement",
    version: "0.1.0",
    name: "Procurement",
    description:
      "Function taxonomy for procurement operations an AI agent can be authorized to perform in an organization's system of record, starting with releasing a purchase requisition. Vendor-neutral: actions and resources name the business operation and the record, never a product or an API.",
    maintainers: [
      {
        name: "Mandaitor Core Team",
        url: "https://github.com/C4RR13P0TT3R/mandaitor-taxonomies",
      },
    ],
    license: "Apache-2.0",
    coreVersion: "1.0.0",
    tags: [
      "procurement",
      "purchasing",
      "requisition",
      "spend",
      "function",
      "agentic-ai",
    ],
    documentationUrl: "https://docs.mandaitor.io",
    // No standardUrl: no single standard defines purchase-requisition release
    // across procurement systems.
  },
  actions: PROCUREMENT_ACTIONS,
  resourcePatterns: PROCUREMENT_RESOURCES,
  constraintTemplates: PROCUREMENT_CONSTRAINTS,
  mandateTemplates: PROCUREMENT_TEMPLATES,
};

export default procurementTaxonomy;
