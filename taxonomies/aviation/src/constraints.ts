// @mandaitor/taxonomy-aviation — Constraint templates
//
// Constraint templates define common operational safety and duration boundaries
// for aviation mandates.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const AVIATION_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "aviation.time.operational-window",
    name: "Operational Window Constraint",
    description: "Limits mandate validity to a bounded operational period such as a duty day or rotation window",
    type: "TIME",
    schema: {
      not_before: {
        type: "string",
        format: "date-time",
        description: "Mandate becomes active at this timestamp",
      },
      expires_at: {
        type: "string",
        format: "date-time",
        description: "Mandate expires at this timestamp",
      },
      defaultDuration: {
        type: "string",
        format: "duration",
        description: "Default ISO 8601 duration for aviation operational mandates",
        default: "P30D",
      },
    },
    defaults: {
      defaultDuration: "P30D",
    },
  },
  {
    id: "aviation.rate.dispatch-automation",
    name: "Dispatch Automation Rate Limit",
    description: "Prevents runaway generation of dispatch artifacts and route briefing refreshes",
    type: "RATE_LIMIT",
    schema: {
      max_briefings_per_hour: {
        type: "number",
        description: "Maximum route-briefing refreshes per hour",
        default: 30,
      },
      max_releases_per_day: {
        type: "number",
        description: "Maximum draft releases per day",
        default: 200,
      },
    },
    defaults: {
      max_briefings_per_hour: 30,
      max_releases_per_day: 200,
    },
  },
  {
    id: "aviation.escalation.flight-safety",
    name: "Flight Safety Escalation",
    description: "Escalates high-severity safety conditions to a licensed operational decision-maker",
    type: "ESCALATION",
    schema: {
      severity_threshold: {
        type: "string",
        description: "Minimum severity that triggers escalation",
        default: "HIGH",
      },
      escalate_to: {
        type: "string",
        description: "Role or subject identifier for the escalation target",
      },
      escalation_method: {
        type: "string",
        enum: ["APPROVAL_REQUIRED", "IMMEDIATE_NOTIFICATION"],
        default: "APPROVAL_REQUIRED",
      },
    },
    defaults: {
      severity_threshold: "HIGH",
      escalation_method: "APPROVAL_REQUIRED",
    },
  },
];
