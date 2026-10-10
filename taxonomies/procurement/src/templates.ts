// @mandaitor/taxonomy-procurement — Mandate templates
//
// The outer constraint keys (transactionLimits, escalationRules) are the ones
// taxonomy-core's TaxonomyMandateTemplate type defines. The values inside are
// the execution vocabulary. A mandate made from this template carries them as
// constraints.transaction_limits.max_amount and
// constraints.escalation_rules.amount_above: those are the keys the execution
// path reads, and it denies any constraint key it does not recognise.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const PROCUREMENT_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "procurement.requisition-release",
    name: "Requisition Release for One Plant",
    description:
      "Lets an agent release the purchase requisitions of one plant, up to a hard cap, with a person approving each release above a lower threshold. Amounts are read from the system of record, so the agent cannot state them.",
    vertical: "procurement",
    scope: {
      actions: ["procurement.requisition.release"],
      resourcePatterns: ["plant-requisitions"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      transactionLimits: {
        max_amount: { currency: "EUR", value: "50000.00" },
      },
      escalationRules: {
        amount_above: { currency: "EUR", value: "10000.00" },
      },
    },
    delegateType: "AGENT",
  },
];
