// @mandaitor/taxonomy-maritime — Resource patterns
//
// Resource scopes model common boundaries in vessel traffic services, port calls,
// cargo workflows, terminal operations, and operator-level safety management.

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const MARITIME_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "operator-vessel",
    pattern: "maritime:operator:{operatorId}/vessel:{vesselId}/*",
    description:
      "Resources scoped to a single vessel under an operator, including voyage, compliance, and incident records",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Shipping line, carrier, or operator identifier",
        required: true,
      },
      {
        name: "vesselId",
        type: "string",
        description: "Vessel identifier",
        required: true,
      },
    ],
  },
  {
    name: "port-call",
    pattern: "maritime:port:{portId}/call:{callId}/*",
    description:
      "Resources scoped to a specific port call, including arrival plans, berth allocation, tug requests, and clearance status",
    parameters: [
      {
        name: "portId",
        type: "string",
        description: "Port identifier",
        required: true,
      },
      {
        name: "callId",
        type: "string",
        description: "Port-call identifier",
        required: true,
      },
    ],
  },
  {
    name: "cargo-consignment",
    pattern: "maritime:operator:{operatorId}/cargo:{cargoId}/*",
    description:
      "Resources scoped to a cargo consignment or declaration through manifest review, dangerous-goods handling, and compliance tracking",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Shipping line, carrier, or operator identifier",
        required: true,
      },
      {
        name: "cargoId",
        type: "string",
        description: "Cargo or consignment identifier",
        required: true,
      },
    ],
  },
  {
    name: "terminal-yard",
    pattern: "maritime:terminal:{terminalId}/yard:{yardId}/*",
    description:
      "Resources covering a specific terminal and yard area used for berth planning, equipment allocation, and container-move workflows",
    parameters: [
      {
        name: "terminalId",
        type: "string",
        description: "Terminal identifier",
        required: true,
      },
      {
        name: "yardId",
        type: "string",
        description: "Terminal yard or zone identifier",
        required: true,
      },
    ],
  },
  {
    name: "operator-wide",
    pattern: "maritime:operator:{operatorId}/*",
    description:
      "Broad operator-level scope across vessels, cargo, safety, and compliance records; use only with tightly constrained mandates",
    parameters: [
      {
        name: "operatorId",
        type: "string",
        description: "Shipping line, carrier, or operator identifier",
        required: true,
      },
    ],
  },
];
