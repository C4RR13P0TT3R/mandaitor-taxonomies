// @mandaitor/taxonomy-venture — Mandate templates

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const VENTURE_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "venture.initial-screening",
    name: "Initial Startup Screening",
    description:
      "Template for thesis-based startup screening, prioritization, and concise diligence summary generation",
    vertical: "venture",
    scope: {
      actions: [
        "venture.deal.screen",
        "venture.deal.prioritize",
        "venture.diligence.summarize",
      ],
      resourcePatterns: ["fund-thesis", "startup-round", "startup-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P7D" },
      rateLimits: { maxRequestsPerHour: 8 },
    },
    delegateType: "AGENT",
  },
  {
    id: "venture.diligence-coordination",
    name: "Diligence Coordination",
    description:
      "Template for requesting missing materials, summarizing startup evidence, and flagging diligence risk",
    vertical: "venture",
    scope: {
      actions: [
        "venture.diligence.request_documents",
        "venture.diligence.summarize",
        "venture.diligence.flag_risk",
      ],
      resourcePatterns: ["startup-round", "startup-dataroom", "startup-wide"],
      effect: "ALLOW",
      conditions: {
        confidentialDataHandling: "review-before-external-share",
      },
    },
    constraints: {
      time: { defaultDuration: "P14D" },
      escalationRules: { requireHumanReview: true, escalationChannel: "deal-owner" },
    },
    delegateType: "AGENT",
  },
  {
    id: "venture.founder-communications",
    name: "Founder Communications & Follow-Up",
    description:
      "Template for drafting founder updates and coordinating structured next steps across investor interactions",
    vertical: "venture",
    scope: {
      actions: [
        "venture.founder.prepare_update",
        "venture.founder.coordinate_followup",
        "venture.fundraising.match_investors",
      ],
      resourcePatterns: ["startup-wide", "investor-interaction"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: { maxRequestsPerHour: 6 },
    },
    delegateType: "AGENT",
  },
  {
    id: "venture.portfolio-monitoring",
    name: "Portfolio Monitoring",
    description:
      "Template for recurring portfolio reporting and KPI deviation monitoring for existing investments",
    vertical: "venture",
    scope: {
      actions: [
        "venture.portfolio.generate_report",
        "venture.portfolio.flag_kpi_deviation",
        "venture.founder.prepare_update",
      ],
      resourcePatterns: ["portfolio-report", "startup-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      escalationRules: { requireHumanReview: true, escalationChannel: "portfolio-lead" },
    },
    delegateType: "AGENT",
  },
  {
    id: "venture.investment-governance",
    name: "Investment Governance",
    description:
      "Template for memo preparation, investment recommendations, and high-risk commitment approval support under governance controls",
    vertical: "venture",
    scope: {
      actions: [
        "venture.investment.prepare_memo",
        "venture.investment.recommend_decision",
        "venture.investment.approve_commitment",
      ],
      resourcePatterns: ["fund-thesis", "startup-round", "startup-dataroom"],
      effect: "ALLOW",
      conditions: {
        humanApprovalRequired: true,
      },
    },
    constraints: {
      time: { defaultDuration: "P5D" },
      transactionLimits: { maxAmount: 250000, currency: "EUR" },
      escalationRules: { requireHumanReview: true, escalationChannel: "investment-committee" },
    },
    delegateType: "AGENT",
  },
];
