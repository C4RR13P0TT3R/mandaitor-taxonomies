// @mandaitor/taxonomy-realestate — Constraint templates
//
// Reusable constraints for property-management delegations.

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const REALESTATE_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "realestate.time.case-response-window",
    name: "Case Response Window",
    description:
      "Limits how long a tenant or maintenance case delegation remains active before renewal is required",
    type: "TIME",
    schema: {
      type: "object",
      properties: {
        duration: { type: "string", format: "duration" },
      },
      required: ["duration"],
    },
    defaults: {
      duration: "P30D",
    },
  },
  {
    id: "realestate.transaction.vendor-dispatch-limit",
    name: "Vendor Dispatch Limit",
    description:
      "Caps the financial scope under which an AI agent may dispatch an approved maintenance vendor",
    type: "TRANSACTION",
    schema: {
      type: "object",
      properties: {
        maxDispatchValue: {
          type: "object",
          properties: {
            currency: { type: "string" },
            value: { type: "number" },
          },
          required: ["currency", "value"],
        },
        maxDispatchesPerWeek: { type: "number" },
      },
      required: ["maxDispatchValue"],
    },
    defaults: {
      maxDispatchValue: { currency: "EUR", value: 750 },
      maxDispatchesPerWeek: 10,
    },
  },
  {
    id: "realestate.escalation.legal-or-financial-review",
    name: "Legal Or Financial Review Escalation",
    description:
      "Escalates tenant notices, contract changes, and payment actions to a human reviewer when thresholds are exceeded",
    type: "ESCALATION",
    schema: {
      type: "object",
      properties: {
        escalateTo: { type: "string" },
        escalationMethod: { type: "string" },
        amountAbove: {
          type: "object",
          properties: {
            currency: { type: "string" },
            value: { type: "number" },
          },
        },
        alwaysEscalateActions: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["escalateTo", "escalationMethod"],
    },
    defaults: {
      escalateTo: "property_manager",
      escalationMethod: "APPROVAL_REQUIRED",
      amountAbove: { currency: "EUR", value: 500 },
      alwaysEscalateActions: [
        "realestate.tenant.send_notice",
        "realestate.contract.approve_change",
        "realestate.finance.release_payment",
      ],
    },
  },
  {
    id: "realestate.rate-limit.document-throughput",
    name: "Document Throughput Limit",
    description:
      "Limits how many real-estate documents can be classified or extracted within a time window",
    type: "RATE_LIMIT",
    schema: {
      type: "object",
      properties: {
        requestsPerHour: { type: "number" },
        requestsPerDay: { type: "number" },
      },
      required: ["requestsPerHour"],
    },
    defaults: {
      requestsPerHour: 250,
      requestsPerDay: 2000,
    },
  },
  {
    id: "realestate.data.privacy_compliance",
    name: "Data Privacy Compliance",
    description:
      "Ensures that all data handling, especially tenant information, complies with relevant data privacy regulations (e.g., GDPR, CCPA).",
    type: "ESCALATION",
    schema: {
      type: "object",
      properties: {
        jurisdiction: { type: "string" },
        dataRetentionPeriod: { type: "string", format: "duration" },
      },
      required: ["jurisdiction"],
    },
    defaults: {
      jurisdiction: "EU",
      dataRetentionPeriod: "P7Y",
    },
  },
  {
    id: "realestate.reporting.data_retention",
    name: "Reporting Data Retention Policy",
    description:
      "Defines the retention period for generated reports and underlying data to meet regulatory and internal policy requirements.",
    type: "RATE_LIMIT",
    schema: {
      type: "object",
      properties: {
        reportType: { type: "string" },
        retentionDays: { type: "number" },
      },
      required: ["reportType", "retentionDays"],
    },
    defaults: {
      reportType: "all",
      retentionDays: 365 * 5,
    },
  },
];
