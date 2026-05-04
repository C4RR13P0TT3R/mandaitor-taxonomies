// @mandaitor/taxonomy-venture — Constraint templates

import type { TaxonomyConstraintTemplate } from "@mandaitor/taxonomy-core";

export const VENTURE_CONSTRAINTS: TaxonomyConstraintTemplate[] = [
  {
    id: "venture.time.review-window",
    name: "review-window",
    description:
      "Time-bound review window for screening, diligence, and memo-preparation workflows",
    type: "TIME",
    schema: {
      type: "object",
      properties: {
        defaultDuration: { type: "string" },
      },
      required: ["defaultDuration"],
    },
    defaults: {
      defaultDuration: "P14D",
    },
  },
  {
    id: "venture.transaction.commitment-cap",
    name: "commitment-cap",
    description:
      "Transaction guardrails for recommendations or approvals involving capital commitments",
    type: "TRANSACTION",
    schema: {
      type: "object",
      properties: {
        maxAmount: { type: "number" },
        currency: { type: "string" },
      },
      required: ["maxAmount", "currency"],
    },
    defaults: {
      maxAmount: 250000,
      currency: "EUR",
    },
  },
  {
    id: "venture.escalation.high-risk-decision",
    name: "high-risk-decision-escalation",
    description:
      "Escalation rules for governance-sensitive investment or diligence findings",
    type: "ESCALATION",
    schema: {
      type: "object",
      properties: {
        requireHumanReview: { type: "boolean" },
        escalationChannel: { type: "string" },
      },
      required: ["requireHumanReview"],
    },
    defaults: {
      requireHumanReview: true,
      escalationChannel: "investment-committee",
    },
  },
  {
    id: "venture.rate-limit.outreach-cadence",
    name: "outreach-cadence",
    description:
      "Rate limits for founder, investor, or follow-up communication workflows",
    type: "RATE_LIMIT",
    schema: {
      type: "object",
      properties: {
        maxRequestsPerHour: { type: "number" },
      },
      required: ["maxRequestsPerHour"],
    },
    defaults: {
      maxRequestsPerHour: 12,
    },
  },
  // ── New Constraints for Venture Taxonomy ────────────────
  {
    id: "venture.data.confidentiality",
    name: "confidentiality-agreement",
    description:
      "Ensures that all data handling and sharing comply with confidentiality agreements and data privacy regulations.",
    type: "ESCALATION",
    schema: {
      type: "object",
      properties: {
        agreementType: { type: "string" },
        enforcementLevel: { type: "string" },
        requireHumanReview: { type: "boolean" },
      },
      required: ["agreementType", "requireHumanReview"],
    },
    defaults: {
      agreementType: "NDA",
      enforcementLevel: "strict",
      requireHumanReview: true,
    },
  },
  {
    id: "venture.compliance.esg-policy",
    name: "esg-compliance-policy",
    description:
      "Defines the ESG compliance policy for investment due diligence and portfolio monitoring.",
    type: "TRANSACTION",
    schema: {
      type: "object",
      properties: {
        policyVersion: { type: "string" },
        auditFrequency: { type: "string" },
        maxAmount: { type: "number" },
      },
      required: ["policyVersion", "maxAmount"],
    },
    defaults: {
      policyVersion: "1.0",
      auditFrequency: "annual",
      maxAmount: 0,
    },
  }
];
