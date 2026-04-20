// @mandaitor/taxonomy-space — Constraint templates
//
// Constraint templates model common governance and operational limits for
// mission planning, payload tasking, remote-sensing dissemination, and anomaly escalation.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const SPACE_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "space.time.operations-window",
    name: "Operations Window Constraint",
    description:
      "Limits mandate validity to an explicit mission-operations period such as commissioning, a campaign, or an approved support rotation",
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
        description: "Default ISO 8601 duration for routine space-operations mandates",
        default: "P30D",
      },
    },
    defaults: {
      defaultDuration: "P30D",
    },
  },
  {
    id: "space.rate.tasking-throughput",
    name: "Payload Tasking Throughput Limit",
    description:
      "Prevents runaway payload scheduling or repeated replanning across a satellite or constellation",
    type: "RATE_LIMIT",
    schema: {
      max_tasking_requests_per_day: {
        type: "number",
        description: "Maximum payload tasking requests per day",
        default: 20,
      },
      max_replans_per_hour: {
        type: "number",
        description: "Maximum mission replans per hour",
        default: 4,
      },
    },
    defaults: {
      max_tasking_requests_per_day: 20,
      max_replans_per_hour: 4,
    },
  },
  {
    id: "space.escalation.anomaly-response",
    name: "Anomaly Response Escalation",
    description:
      "Escalates anomaly, conjunction, or safe-mode actions to the responsible flight-operations authority",
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
  {
    id: "space.transaction.data-dissemination",
    name: "Data Dissemination Guardrail",
    description:
      "Constrains the volume and priority of dataset releases that may be prepared within a mandate window",
    type: "TRANSACTION",
    schema: {
      max_products_per_day: {
        type: "number",
        description: "Maximum number of processed products that may be released per day",
        default: 25,
      },
      allow_priority_override: {
        type: "boolean",
        description: "Whether priority override is permitted for time-sensitive dissemination workflows",
        default: false,
      },
    },
    defaults: {
      max_products_per_day: 25,
      allow_priority_override: false,
    },
  },
];
