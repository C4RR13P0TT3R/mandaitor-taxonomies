// @mandaitor/taxonomy-defence-isr — Constraint templates
//
// Defence constraints enforce rules of engagement, classification boundaries,
// operational time windows, and mandatory escalation for critical decisions.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const DEFENCE_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "defence.time.mission-window",
    name: "Mission Time Window",
    description: "Limits mandate validity to the mission's operational time window",
    type: "TIME",
    schema: {
      not_before: {
        type: "string",
        format: "date-time",
        description: "Mission start time (ISO 8601)",
      },
      expires_at: {
        type: "string",
        format: "date-time",
        description: "Mission end time (ISO 8601)",
      },
      defaultDuration: {
        type: "string",
        format: "duration",
        description: "ISO 8601 duration (e.g., P30D for 30-day mission rotation)",
        default: "P30D",
      },
    },
    defaults: {
      defaultDuration: "P30D",
    },
  },
  {
    id: "defence.limits.engagement-daily",
    name: "Daily Engagement Limits",
    description: "Limits on engagement-related actions per operational period",
    type: "TRANSACTION",
    schema: {
      max_recommendations_per_day: {
        type: "number",
        description: "Maximum engagement recommendations per 24h period",
        default: 10,
      },
      max_pid_verifications_per_day: {
        type: "number",
        description: "Maximum PID verification requests per 24h period",
        default: 20,
      },
    },
    defaults: {
      max_recommendations_per_day: 10,
      max_pid_verifications_per_day: 20,
    },
  },
  {
    id: "defence.escalation.engagement-authority",
    name: "Engagement Authority Escalation",
    description:
      "Mandatory escalation for engagement authorization — always requires human-in-the-loop decision",
    type: "ESCALATION",
    schema: {
      classification_threshold: {
        type: "string",
        enum: ["UNCLASSIFIED", "RESTRICTED", "CONFIDENTIAL", "SECRET"],
        description: "Minimum classification level that triggers escalation",
        default: "RESTRICTED",
      },
      escalate_to: {
        type: "string",
        description: "Subject ID of the commander or authorization authority",
      },
      escalation_method: {
        type: "string",
        enum: ["APPROVAL_REQUIRED", "IMMEDIATE_NOTIFICATION"],
        default: "APPROVAL_REQUIRED",
      },
      require_mfa: {
        type: "boolean",
        description: "Whether MFA is required for escalation approval",
        default: true,
      },
    },
    defaults: {
      classification_threshold: "RESTRICTED",
      escalation_method: "APPROVAL_REQUIRED",
      require_mfa: true,
    },
  },
  {
    id: "defence.rate.analysis-throughput",
    name: "Analysis Throughput Limit",
    description: "Rate limits for automated intelligence analysis to maintain quality standards",
    type: "RATE_LIMIT",
    schema: {
      max_analyses_per_hour: {
        type: "number",
        description: "Maximum imagery/data analyses per hour",
        default: 200,
      },
      max_classifications_per_hour: {
        type: "number",
        description: "Maximum target classifications per hour",
        default: 50,
      },
    },
    defaults: {
      max_analyses_per_hour: 200,
      max_classifications_per_hour: 50,
    },
  },
];
