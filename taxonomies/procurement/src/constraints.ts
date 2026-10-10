// @mandaitor/taxonomy-procurement — Constraint templates
//
// These templates are written in the vocabulary Mandaitor's execution path
// enforces (mandaitor-core docs/execution/constraint-vocabulary.md), not in
// the camelCase dialect of the older industry taxonomies:
//
//   - max_amount is a hard cap: above it, DENY. No approval can lift it.
//   - amount_above is an approval threshold: above it, a person approves
//     that exact request; at or below it, no approval is needed.
//   - Money is { currency, value }: currency is ISO 4217 alpha-3, and value
//     is a decimal string, never a number, so no amount is rounded in
//     floating point. A requisition in another currency is denied; there is
//     no conversion.
//
// Both read the requisition's amount as the system of record states it. The
// agent has no argument in which to state an amount.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

/** Money as the execution path reads it. Exported for the package's tests. */
export const MONEY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["currency", "value"],
  properties: {
    currency: { type: "string", pattern: "^[A-Z]{3}$" },
    value: { type: "string", pattern: "^(0|[1-9][0-9]*)(\\.[0-9]+)?$" },
  },
} as const;

export const PROCUREMENT_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "procurement.transaction.release-cap",
    name: "release-cap",
    description:
      "Hard cap on the amount of a requisition the agent may release. A requisition above the cap is denied, and no approval lifts the cap. The amount is the requisition's total as the system of record states it.",
    type: "TRANSACTION",
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["max_amount"],
      properties: {
        max_amount: MONEY_SCHEMA,
      },
    },
    defaults: {
      max_amount: { currency: "EUR", value: "50000.00" },
    },
  },
  {
    id: "procurement.escalation.release-approval",
    name: "release-approval",
    description:
      "Approval threshold: releasing a requisition above this amount waits until a person approves that exact requisition, at the amount read from the system of record. At or below it, the release needs no approval. Without escalate_to, the mandate's principal approves.",
    type: "ESCALATION",
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["amount_above"],
      properties: {
        amount_above: MONEY_SCHEMA,
        escalate_to: { type: "string", minLength: 1 },
      },
    },
    defaults: {
      amount_above: { currency: "EUR", value: "10000.00" },
    },
  },
];
