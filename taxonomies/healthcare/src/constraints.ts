import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "healthcare.time.working_hours",
    name: "Working Hours Only",
    description: "Limits agent actions to standard clinic working hours",
    type: "TIME",
    schema: {
      type: "object",
      properties: {
        timezone: { type: "string" }
      },
      required: ["timezone"]
    },
    defaults: {
      timezone: "UTC"
    }
  },
  {
    id: "healthcare.rate.prescriptions_per_day",
    name: "Prescription Daily Limit",
    description: "Limits the number of prescriptions an agent can suggest or issue per day",
    type: "RATE_LIMIT",
    schema: {
      type: "object",
      properties: {
        max_prescriptions: { type: "number" }
      },
      required: ["max_prescriptions"]
    },
    defaults: {
      max_prescriptions: 10
    }
  },
  {
    id: "healthcare.approval.doctor_required",
    name: "Doctor Approval Required",
    description: "Requires explicit approval from a licensed doctor for the action",
    type: "ESCALATION",
    schema: {
      type: "object",
      properties: {
        doctor_role: { type: "string" }
      },
      required: ["doctor_role"]
    },
    defaults: {
      doctor_role: "attending"
    }
  }
];
