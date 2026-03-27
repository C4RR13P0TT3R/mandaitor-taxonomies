// @mandaitor/taxonomy-defence-isr — Resource patterns
//
// Resource patterns follow military operational hierarchies:
// operation → mission → sector → asset
//
// Pattern syntax: ops:{operationId}/mission:{missionId}/sector:{sectorId}/*

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const DEFENCE_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "mission-sector",
    pattern: "ops:{operationId}/mission:{missionId}/sector:{sectorId}/*",
    description: "Resources scoped to a specific sector within a mission",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
      { name: "missionId", type: "string", description: "Mission identifier", required: true },
      { name: "sectorId", type: "string", description: "Geographic sector ID", required: true },
    ],
  },
  {
    name: "mission-wide",
    pattern: "ops:{operationId}/mission:{missionId}/*",
    description: "All resources within a mission — use with caution, grants broad access",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
      { name: "missionId", type: "string", description: "Mission identifier", required: true },
    ],
  },
  {
    name: "operation-wide",
    pattern: "ops:{operationId}/*",
    description: "All resources within an operation — highly privileged, requires senior authorization",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
    ],
  },
  {
    name: "sensor-platform",
    pattern: "ops:{operationId}/platform:{platformId}",
    description: "A specific sensor platform (UAV, satellite, ground station)",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
      {
        name: "platformId",
        type: "string",
        description: "Platform/asset identifier",
        required: true,
      },
    ],
  },
  {
    name: "imagery-collection",
    pattern: "ops:{operationId}/imagery:{collectionId}",
    description: "A specific imagery collection (SAR pass, EO capture, multi-spectral)",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
      {
        name: "collectionId",
        type: "string",
        description: "Imagery collection ID",
        required: true,
      },
    ],
  },
  {
    name: "intelligence-product",
    pattern: "ops:{operationId}/intel:{productId}",
    description: "A specific intelligence product (assessment, report, briefing)",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
      {
        name: "productId",
        type: "string",
        description: "Intelligence product ID",
        required: true,
      },
    ],
  },
  {
    name: "target-record",
    pattern: "ops:{operationId}/target:{targetId}",
    description: "A specific target record in the target tracking database",
    parameters: [
      {
        name: "operationId",
        type: "string",
        description: "Operation identifier",
        required: true,
      },
      { name: "targetId", type: "string", description: "Target record ID", required: true },
    ],
  },
];
