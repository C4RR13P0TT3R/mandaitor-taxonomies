// @mandaitor/taxonomy-procurement — Procurement actions
//
// A function taxonomy, not an industry one: its actions name business
// operations on procurement records, whatever system holds them. A tool in
// the Mandaitor registry maps one vendor's API onto an action here (for
// example sap.purchase_requisition.release onto
// procurement.requisition.release), so a mandate written against these
// actions does not change when a second vendor's tool arrives.
//
// Naming convention: procurement.{record}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const PROCUREMENT_ACTIONS: TaxonomyAction[] = [
  {
    id: "procurement.requisition.release",
    label: "Release Purchase Requisition",
    description:
      "Authorize an AI agent to release a purchase requisition in the system of record, so that purchasing can convert it into a purchase order. The requisition's amount, plant and release state are read from that system when the request is decided, never taken from the agent.",
    // HIGH because a release commits budget. Not CRITICAL, and no blanket
    // human approval: the decision makes every action that sets
    // requiresHumanApproval wait for a person, whatever the mandate says.
    // For this action the threshold belongs to the principal, in the
    // mandate's escalation_rules.amount_above (see the release-approval
    // constraint template), so releases at or below it proceed unattended.
    riskLevel: "HIGH",
    requiresHumanApproval: false,
    tags: ["procurement", "requisition", "release", "spend"],
  },
];
