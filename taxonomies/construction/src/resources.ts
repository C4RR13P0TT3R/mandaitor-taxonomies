// @mandaitor/taxonomy-construction — Resource patterns
//
// Resource patterns follow the monco.ai project hierarchy:
// project → zone → trade → document
//
// Pattern syntax: monco:project:{projectId}/zone:{zoneId}/trade:{tradeId}/*
// Wildcard (*) at any level grants access to all sub-resources.

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const CONSTRUCTION_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "project-zone-trade",
    pattern: "monco:project:{projectId}/zone:{zoneId}/trade:{tradeId}/*",
    description:
      "Resources scoped to a specific trade within a project zone (e.g., electrical work in ground floor)",
    parameters: [
      {
        name: "projectId",
        type: "string",
        description: "Project identifier (e.g., proj_ABC123)",
        required: true,
      },
      {
        name: "zoneId",
        type: "string",
        description: "Building zone (e.g., EG, OG1, UG)",
        required: true,
      },
      {
        name: "tradeId",
        type: "enum",
        description: "Construction trade category",
        required: true,
        enumValues: ["elektro", "sanitaer", "heizung", "lueftung", "trockenbau", "rohbau"],
      },
    ],
  },
  {
    name: "project-zone",
    pattern: "monco:project:{projectId}/zone:{zoneId}/*",
    description: "Resources scoped to an entire building zone across all trades",
    parameters: [
      { name: "projectId", type: "string", description: "Project identifier", required: true },
      { name: "zoneId", type: "string", description: "Building zone identifier", required: true },
    ],
  },
  {
    name: "project-wide",
    pattern: "monco:project:{projectId}/*",
    description:
      "Resources scoped to an entire project — use with caution, grants broad access",
    parameters: [
      { name: "projectId", type: "string", description: "Project identifier", required: true },
    ],
  },
  {
    name: "project-schedule",
    pattern: "monco:project:{projectId}/schedule:{scheduleId}",
    description: "A specific project schedule document",
    parameters: [
      { name: "projectId", type: "string", description: "Project identifier", required: true },
      {
        name: "scheduleId",
        type: "string",
        description: "Schedule version identifier",
        required: true,
      },
    ],
  },
  {
    name: "project-procurement",
    pattern: "monco:project:{projectId}/procurement:{orderId}",
    description: "A specific procurement order within a project",
    parameters: [
      { name: "projectId", type: "string", description: "Project identifier", required: true },
      { name: "orderId", type: "string", description: "Procurement order ID", required: true },
    ],
  },
  {
    name: "project-invoice",
    pattern: "monco:project:{projectId}/invoice:{invoiceId}",
    description: "A specific invoice within a project",
    parameters: [
      { name: "projectId", type: "string", description: "Project identifier", required: true },
      { name: "invoiceId", type: "string", description: "Invoice ID", required: true },
    ],
  },
  {
    name: "project-defect",
    pattern: "monco:project:{projectId}/defect:{defectId}",
    description: "A specific defect report within a project",
    parameters: [
      { name: "projectId", type: "string", description: "Project identifier", required: true },
      { name: "defectId", type: "string", description: "Defect report ID", required: true },
    ],
  },
];
