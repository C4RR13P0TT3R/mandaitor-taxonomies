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
  {
    id: "space.resource.orbital-asset-access",
    name: "Orbital Asset Access Control",
    description:
      "Defines which orbital assets (satellites, payloads) an AI agent is authorized to interact with.",
    type: "RESOURCE_ACCESS",
    schema: {
      allowed_asset_ids: {
        type: "array",
        items: { type: "string" },
        description: "List of orbital asset IDs the agent can access.",
        default: [],
      },
      access_level: {
        type: "string",
        enum: ["READ_ONLY", "COMMAND_AND_CONTROL"],
        description: "Level of access granted to the orbital assets.",
        default: "READ_ONLY",
      },
    },
    defaults: {
      allowed_asset_ids: [],
      access_level: "READ_ONLY",
    },
  },
  {
    id: "space.data.telemetry-retention",
    name: "Telemetry Data Retention Policy",
    description:
      "Specifies the retention period and archival requirements for telemetry data.",
    type: "DATA_POLICY",
    schema: {
      retention_days: {
        type: "number",
        description: "Number of days to retain raw telemetry data.",
        default: 90,
      },
      archive_format: {
        type: "string",
        enum: ["HDF5", "NetCDF", "CSV"],
        description: "Format for long-term archival of telemetry data.",
        default: "HDF5",
      },
    },
    defaults: {
      retention_days: 90,
      archive_format: "HDF5",
    },
  },
  {
    id: "space.geo.restricted-operation-zones",
    name: "Restricted Operation Zones",
    description:
      "Defines geographical areas where certain space operations are prohibited or require special authorization.",
    type: "GEOSPATIAL",
    schema: {
      restricted_areas: {
        type: "array",
        items: { type: "string" },
        description: "List of geopolitical or orbital regions where operations are restricted.",
        default: [],
      },
      prohibited_actions: {
        type: "array",
        items: { type: "string" },
        description: "List of actions prohibited within restricted areas.",
        default: [],
      },
    },
    defaults: {
      restricted_areas: [],
      prohibited_actions: [],
    },
  },
];
