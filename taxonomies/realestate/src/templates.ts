// @mandaitor/taxonomy-realestate — Mandate templates
//
// Pre-configured mandate templates for common property-management workflows.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const REALESTATE_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "realestate.document-intake",
    name: "Document Intake & Extraction",
    description:
      "Delegate document classification and extraction for property-management intake workflows",
    vertical: "realestate",
    scope: {
      actions: ["realestate.document.classify", "realestate.document.extract"],
      resourcePatterns: ["property-document"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P180D" },
      rateLimits: { max_documents_per_hour: 250, max_documents_per_day: 2000 },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.tenant-communications",
    name: "Tenant Communications Assistant",
    description:
      "Delegate tenant message drafting and approved notice dispatch within a governed communication workflow",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.tenant.prepare_message",
        "realestate.tenant.send_notice",
      ],
      resourcePatterns: ["property-tenant"],
      effect: "ALLOW",
      conditions: {
        approved_templates_only: true,
        legal_review_required_for_notice: true,
      },
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "property_manager",
        escalation_method: "APPROVAL_REQUIRED",
      },
      rateLimits: { max_notices_per_day: 50 },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.maintenance-coordination",
    name: "Maintenance Coordination",
    description:
      "Delegate maintenance ticket creation and vendor dispatch within configured vendor and budget controls",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.maintenance.create_ticket",
        "realestate.maintenance.dispatch_vendor",
      ],
      resourcePatterns: ["property-maintenance", "vendor-record"],
      effect: "ALLOW",
      conditions: {
        approved_vendor_only: true,
        emergency_dispatch_requires_approval: true,
      },
    },
    constraints: {
      time: { defaultDuration: "P60D" },
      transactionLimits: {
        max_dispatch_value: { currency: "EUR", value: 750 },
        max_dispatches_per_week: 10,
      },
      escalationRules: {
        amount_above: { currency: "EUR", value: 500 },
        escalate_to: "property_manager",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.contract-governance",
    name: "Contract Governance Assistant",
    description:
      "Delegate contract review and proposed contract changes within explicit legal and approval controls",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.contract.review",
        "realestate.contract.approve_change",
      ],
      resourcePatterns: ["property-document", "portfolio-property"],
      effect: "ALLOW",
      conditions: {
        approved_clause_library_only: true,
        human_signoff_required_for_changes: true,
      },
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "legal_reviewer",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.finance-review",
    name: "Finance Preparation & Review",
    description:
      "Delegate invoice preparation and payment release checks within strict approval controls",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.finance.prepare_invoice",
        "realestate.finance.release_payment",
      ],
      resourcePatterns: ["portfolio-property", "vendor-record"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      transactionLimits: {
        max_single_payment: { currency: "EUR", value: 500 },
        max_daily_total: { currency: "EUR", value: 2500 },
      },
      escalationRules: {
        always_escalate: true,
        escalate_to: "finance_controller",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.portfolio-reporting",
    name: "Portfolio Reporting",
    description:
      "Delegate property and portfolio reporting for operational visibility and planning",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.property.update_record",
        "realestate.reporting.generate",
      ],
      resourcePatterns: ["portfolio-property", "property-unit"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      rateLimits: { max_reports_per_day: 25 },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.esg-reporting-compliance",
    name: "ESG Reporting & Compliance",
    description:
      "Delegate ESG reporting and ensure compliance with data privacy regulations for property data.",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.reporting.esg_sustainability",
      ],
      resourcePatterns: ["portfolio-property"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      escalationRules: {
        escalateTo: "data_privacy_officer",
        escalationMethod: "APPROVAL_REQUIRED",
        alwaysEscalateActions: ["realestate.reporting.esg_sustainability"],
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "realestate.property-acquisition-valuation",
    name: "Property Acquisition & Valuation",
    description:
      "Delegate property valuation, acquisition analysis, and budget forecasting for new investments.",
    vertical: "realestate",
    scope: {
      actions: [
        "realestate.property.valuation",
        "realestate.property.acquisition_analysis",
        "realestate.finance.budget_forecasting",
      ],
      resourcePatterns: ["portfolio-property", "market-data"],
      effect: "ALLOW",
      conditions: {
        external_data_sources_allowed: true,
      },
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      transactionLimits: {
        max_deviation_percentage: 0.05,
      },
      escalationRules: {
        amount_above: { currency: "EUR", value: 1000000 },
        escalate_to: "investment_committee",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
];
