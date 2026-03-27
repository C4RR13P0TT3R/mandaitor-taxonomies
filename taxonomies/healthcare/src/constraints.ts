// @mandaitor/taxonomy-healthcare — Constraint templates
//
// Clinical constraints enforce patient safety, regulatory compliance,
// and data protection boundaries for AI delegation in healthcare.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "healthcare.time.shift-duration",
    name: "Shift Duration Constraint",
    description: "Limits mandate validity to a clinical shift or treatment period",
    type: "TIME",
    schema: {
      not_before: {
        type: "string",
        format: "date-time",
        description: "Mandate becomes active at shift start (ISO 8601)",
      },
      expires_at: {
        type: "string",
        format: "date-time",
        description: "Mandate expires at shift end (ISO 8601)",
      },
      defaultDuration: {
        type: "string",
        format: "duration",
        description: "ISO 8601 duration (e.g., P90D for 90 days, PT12H for one shift)",
        default: "P90D",
      },
    },
    defaults: {
      defaultDuration: "P90D",
    },
  },
  {
    id: "healthcare.limits.prescription-daily",
    name: "Prescription Daily Limits",
    description: "Limits for automated prescription suggestions and issuance per day",
    type: "TRANSACTION",
    schema: {
      max_suggestions_per_day: {
        type: "number",
        description: "Maximum prescription suggestions per day",
        default: 100,
      },
      max_issued_per_day: {
        type: "number",
        description: "Maximum prescriptions issued per day (requires co-signature)",
        default: 20,
      },
    },
    defaults: {
      max_suggestions_per_day: 100,
      max_issued_per_day: 20,
    },
  },
  {
    id: "healthcare.escalation.critical-finding",
    name: "Critical Finding Escalation",
    description: "Escalation rules when AI detects critical clinical findings",
    type: "ESCALATION",
    schema: {
      severity_threshold: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        description: "Minimum severity that triggers escalation",
        default: "HIGH",
      },
      escalate_to: {
        type: "string",
        description: "Subject ID of the escalation target (e.g., attending physician)",
      },
      escalation_method: {
        type: "string",
        enum: ["APPROVAL_REQUIRED", "IMMEDIATE_NOTIFICATION"],
        default: "IMMEDIATE_NOTIFICATION",
      },
    },
    defaults: {
      severity_threshold: "HIGH",
      escalation_method: "IMMEDIATE_NOTIFICATION",
    },
  },
  {
    id: "healthcare.rate.record-access",
    name: "Record Access Rate Limit",
    description: "Rate limits for patient record access to detect unusual access patterns",
    type: "RATE_LIMIT",
    schema: {
      max_records_per_hour: {
        type: "number",
        description: "Maximum distinct patient records accessed per hour",
        default: 50,
      },
      max_records_per_day: {
        type: "number",
        description: "Maximum distinct patient records accessed per day",
        default: 200,
      },
    },
    defaults: {
      max_records_per_hour: 50,
      max_records_per_day: 200,
    },
  },
];
