// @mandaitor/taxonomy-space — Resource patterns
//
// Resource scopes model typical mission-operations boundaries across spacecraft,
// individual passes, payload datasets, ground-station networks, and program-level control.

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const SPACE_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "program-satellite",
    pattern: "space:program:{programId}/satellite:{satelliteId}/*",
    description:
      "Resources scoped to a single spacecraft within a mission program, including telemetry, configuration, and operational state",
    parameters: [
      {
        name: "programId",
        type: "string",
        description: "Mission program or constellation identifier",
        required: true,
      },
      {
        name: "satelliteId",
        type: "string",
        description: "Satellite or spacecraft identifier",
        required: true,
      },
    ],
  },
  {
    name: "mission-pass",
    pattern: "space:mission:{missionId}/pass:{passId}/*",
    description:
      "Resources scoped to a specific contact or operational pass, including pass plans, command stacks, and downlink windows",
    parameters: [
      {
        name: "missionId",
        type: "string",
        description: "Mission identifier",
        required: true,
      },
      {
        name: "passId",
        type: "string",
        description: "Ground-contact or mission-pass identifier",
        required: true,
      },
    ],
  },
  {
    name: "payload-dataset",
    pattern: "space:mission:{missionId}/dataset:{datasetId}/*",
    description:
      "Resources scoped to a payload collection or dataset through processing, review, and dissemination",
    parameters: [
      {
        name: "missionId",
        type: "string",
        description: "Mission identifier",
        required: true,
      },
      {
        name: "datasetId",
        type: "string",
        description: "Payload dataset or collection identifier",
        required: true,
      },
    ],
  },
  {
    name: "ground-station-network",
    pattern: "space:network:{networkId}/*",
    description:
      "Resources covering a ground-station network or contracted communications segment used for routine contacts and downlinks",
    parameters: [
      {
        name: "networkId",
        type: "string",
        description: "Ground-station network identifier",
        required: true,
      },
    ],
  },
  {
    name: "program-wide",
    pattern: "space:program:{programId}/*",
    description:
      "Broad program-level scope across mission planning, spacecraft operations, and data flows; use only with tightly constrained mandates",
    parameters: [
      {
        name: "programId",
        type: "string",
        description: "Mission program or constellation identifier",
        required: true,
      },
    ],
  },
  {
    name: "launch-vehicle",
    pattern: "space:launch:{launchId}/vehicle:{vehicleId}/*",
    description:
      "Resources related to a specific launch vehicle, including pre-launch checks and flight data.",
    parameters: [
      {
        name: "launchId",
        type: "string",
        description: "Unique identifier for the launch event.",
        required: true,
      },
      {
        name: "vehicleId",
        type: "string",
        description: "Identifier for the launch vehicle.",
        required: true,
      },
    ],
  },
  {
    name: "orbital-debris-database",
    pattern: "space:debris:{databaseId}/*",
    description:
      "Resources for accessing and managing orbital debris data and conjunction warnings.",
    parameters: [
      {
        name: "databaseId",
        type: "string",
        description: "Identifier for the orbital debris database.",
        required: true,
      },
    ],
  },
];
