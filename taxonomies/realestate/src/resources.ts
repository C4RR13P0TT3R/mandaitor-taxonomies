// @mandaitor/taxonomy-realestate — Resource patterns
//
// Resource patterns follow a generic property-management hierarchy:
// portfolio → property → unit / tenant / maintenance / document
//
// Pattern syntax: realestate:portfolio:{portfolioId}/property:{propertyId}/unit:{unitId}/*
// Wildcard (*) at any level grants access to all sub-resources.

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const REALESTATE_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "portfolio-property",
    pattern: "realestate:portfolio:{portfolioId}/property:{propertyId}/*",
    description:
      "Resources scoped to a specific property within a managed portfolio",
    parameters: [
      {
        name: "portfolioId",
        type: "string",
        description: "Portfolio identifier",
        required: true,
      },
      {
        name: "propertyId",
        type: "string",
        description: "Property identifier",
        required: true,
      },
    ],
  },
  {
    name: "property-unit",
    pattern: "realestate:portfolio:{portfolioId}/property:{propertyId}/unit:{unitId}/*",
    description: "Resources scoped to a specific unit within a property",
    parameters: [
      {
        name: "portfolioId",
        type: "string",
        description: "Portfolio identifier",
        required: true,
      },
      {
        name: "propertyId",
        type: "string",
        description: "Property identifier",
        required: true,
      },
      {
        name: "unitId",
        type: "string",
        description: "Unit identifier",
        required: true,
      },
    ],
  },
  {
    name: "property-tenant",
    pattern: "realestate:portfolio:{portfolioId}/property:{propertyId}/tenant:{tenantId}/*",
    description: "Resources scoped to a specific tenant case or communication record",
    parameters: [
      {
        name: "portfolioId",
        type: "string",
        description: "Portfolio identifier",
        required: true,
      },
      {
        name: "propertyId",
        type: "string",
        description: "Property identifier",
        required: true,
      },
      {
        name: "tenantId",
        type: "string",
        description: "Tenant identifier",
        required: true,
      },
    ],
  },
  {
    name: "property-maintenance",
    pattern: "realestate:portfolio:{portfolioId}/property:{propertyId}/maintenance:{ticketId}",
    description: "A specific maintenance ticket within a property",
    parameters: [
      {
        name: "portfolioId",
        type: "string",
        description: "Portfolio identifier",
        required: true,
      },
      {
        name: "propertyId",
        type: "string",
        description: "Property identifier",
        required: true,
      },
      {
        name: "ticketId",
        type: "string",
        description: "Maintenance ticket identifier",
        required: true,
      },
    ],
  },
  {
    name: "property-document",
    pattern: "realestate:portfolio:{portfolioId}/property:{propertyId}/document:{documentId}",
    description: "A specific document related to a property or unit",
    parameters: [
      {
        name: "portfolioId",
        type: "string",
        description: "Portfolio identifier",
        required: true,
      },
      {
        name: "propertyId",
        type: "string",
        description: "Property identifier",
        required: true,
      },
      {
        name: "documentId",
        type: "string",
        description: "Document identifier",
        required: true,
      },
    ],
  },
  {
    name: "vendor-record",
    pattern: "realestate:vendor:{vendorId}/*",
    description: "Resources scoped to an approved maintenance or service vendor",
    parameters: [
      {
        name: "vendorId",
        type: "string",
        description: "Vendor identifier",
        required: true,
      },
    ],
  },
  {
    name: "market-data",
    pattern: "realestate:market-data:{dataType}/*",
    description: "External market data for property valuation and analysis",
    parameters: [
      {
        name: "dataType",
        type: "string",
        description: "Type of market data (e.g., sales-comparables, rental-rates)",
        required: true,
      },
    ],
  },
];
