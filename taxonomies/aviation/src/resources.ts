// @mandaitor/taxonomy-aviation — Resource patterns
//
// Resource patterns model operator, aircraft, and flight-scoped operational data.

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const AVIATION_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "operator-flight",
    pattern: "aviation:operator:{operatorId}/flight:{flightId}/*",
    description:
      "Resources scoped to a specific flight under an operator, including dispatch release, weather pack, and movement status",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Air operator identifier",
        required: true,
      },
      {
        name: "flightId",
        type: "string",
        description: "Flight identifier, for example LH123-2026-04-15",
        required: true,
      },
    ],
  },
  {
    name: "operator-aircraft",
    pattern: "aviation:operator:{operatorId}/aircraft:{aircraftId}/*",
    description:
      "Resources scoped to a single aircraft, including technical log, MEL items, and maintenance status",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Air operator identifier",
        required: true,
      },
      {
        name: "aircraftId",
        type: "string",
        description: "Aircraft registration or internal fleet identifier",
        required: true,
      },
    ],
  },
  {
    name: "operator-wide",
    pattern: "aviation:operator:{operatorId}/*",
    description:
      "Broad operator-wide scope across dispatch, fleet, and compliance resources; use only for tightly constrained mandates",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Air operator identifier",
        required: true,
      },
    ],
  },
  {
    name: "operator-crew-roster",
    pattern: "aviation:operator:{operatorId}/crew-roster:{rosterId}",
    description:
      "A specific crew roster or duty assignment set for compliance and currency checks",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Air operator identifier",
        required: true,
      },
      {
        name: "rosterId",
        type: "string",
        description: "Crew roster identifier",
        required: true,
      },
    ],
  },
];
