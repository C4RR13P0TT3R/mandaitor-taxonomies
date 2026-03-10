// @mandaitor/taxonomy-construction — Constraint templates
//
// Constraint templates define reusable boundary conditions for construction mandates.
// They are referenced by mandate templates and can be overridden per-mandate.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const CONSTRUCTION_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "construction.time.project-duration",
    name: "Project Duration Constraint",
    description: "Limits mandate validity to the project's active construction phase",
    type: "TIME",
    schema: {
      not_before: {
        type: "string",
        format: "date-time",
        description: "Mandate becomes active at this timestamp (ISO 8601)",
      },
      expires_at: {
        type: "string",
        format: "date-time",
        description: "Mandate expires at this timestamp (ISO 8601)",
      },
      defaultDuration: {
        type: "string",
        format: "duration",
        description: "ISO 8601 duration (e.g., P180D for 180 days)",
        default: "P180D",
      },
    },
    defaults: {
      defaultDuration: "P180D",
    },
  },
  {
    id: "construction.limits.invoice-approval",
    name: "Invoice Approval Limits",
    description: "Financial limits for automated invoice approval",
    type: "TRANSACTION",
    schema: {
      max_single_invoice: {
        type: "object",
        properties: {
          currency: { type: "string", default: "EUR" },
          value: { type: "number", description: "Maximum single invoice amount" },
        },
        default: { currency: "EUR", value: 5000 },
      },
      max_daily_total: {
        type: "object",
        properties: {
          currency: { type: "string", default: "EUR" },
          value: { type: "number", description: "Maximum daily approval total" },
        },
        default: { currency: "EUR", value: 25000 },
      },
      max_approvals_per_day: {
        type: "number",
        description: "Maximum number of invoice approvals per day",
        default: 50,
      },
    },
    defaults: {
      max_single_invoice: { currency: "EUR", value: 5000 },
      max_daily_total: { currency: "EUR", value: 25000 },
      max_approvals_per_day: 50,
    },
  },
  {
    id: "construction.escalation.cost-deviation",
    name: "Cost Deviation Escalation",
    description: "Escalation rules when costs deviate from budget",
    type: "ESCALATION",
    schema: {
      deviation_threshold_percent: {
        type: "number",
        description: "Percentage deviation that triggers escalation",
        default: 10,
      },
      escalate_to: {
        type: "string",
        description: "Subject ID of the escalation target (e.g., project manager)",
      },
      escalation_method: {
        type: "string",
        enum: ["APPROVAL_REQUIRED", "IMMEDIATE_NOTIFICATION"],
        default: "APPROVAL_REQUIRED",
      },
    },
    defaults: {
      deviation_threshold_percent: 10,
      escalation_method: "APPROVAL_REQUIRED",
    },
  },
  {
    id: "construction.rate.validation-checks",
    name: "Validation Check Rate Limit",
    description: "Rate limits for automated validation checks to prevent runaway agents",
    type: "RATE_LIMIT",
    schema: {
      max_validations_per_hour: {
        type: "number",
        description: "Maximum validation checks per hour",
        default: 100,
      },
      max_validations_per_day: {
        type: "number",
        description: "Maximum validation checks per day",
        default: 1000,
      },
    },
    defaults: {
      max_validations_per_hour: 100,
      max_validations_per_day: 1000,
    },
  },
];
