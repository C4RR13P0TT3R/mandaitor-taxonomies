// @mandaitor/taxonomy-maritime — Constraint templates

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const MARITIME_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "maritime.time.active_shift_window",
    name: "Active Shift Window",
    description:
      "Limit authority to an approved watch, shift, or port-operations window",
    type: "TIME",
    schema: {
      type: "object",
      properties: {
        startTime: { type: "string", format: "date-time" },
        endTime: { type: "string", format: "date-time" },
        timezone: { type: "string" },
      },
      required: ["startTime", "endTime"],
      additionalProperties: false,
    },
    defaults: {
      timezone: "UTC",
    },
  },
  {
    id: "maritime.ops.max_vessel_movements_per_shift",
    name: "Max Vessel Movements per Shift",
    description:
      "Cap the number of berth, arrival-sequencing, or harbour-movement actions that may be executed within a single shift window",
    type: "RATE_LIMIT",
    schema: {
      type: "object",
      properties: {
        maxMovements: { type: "integer", minimum: 1 },
        shiftLabel: { type: "string" },
      },
      required: ["maxMovements"],
      additionalProperties: false,
    },
    defaults: {
      maxMovements: 20,
      shiftLabel: "standard-watch",
    },
  },
  {
    id: "maritime.escalation.human_review_for_incidents",
    name: "Human Review for Incidents",
    description:
      "Require a named duty officer or safety lead to review incident-related actions within a defined response window",
    type: "ESCALATION",
    schema: {
      type: "object",
      properties: {
        approverRole: { type: "string" },
        responseMinutes: { type: "integer", minimum: 1 },
      },
      required: ["approverRole", "responseMinutes"],
      additionalProperties: false,
    },
    defaults: {
      approverRole: "duty_officer",
      responseMinutes: 15,
    },
  },
  {
    id: "maritime.reporting.environmental_release_policy",
    name: "Environmental Release Policy",
    description:
      "Restrict environmental or pollution-prevention report submission to approved authorities, jurisdictions, and disclosure scopes",
    type: "TRANSACTION",
    schema: {
      type: "object",
      properties: {
        allowedAuthorities: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
        },
        jurisdiction: { type: "string" },
        requiresAttachmentChecklist: { type: "boolean" },
      },
      required: ["allowedAuthorities"],
      additionalProperties: false,
    },
    defaults: {
      allowedAuthorities: ["port_state_authority"],
      requiresAttachmentChecklist: true,
    },
  },
];
