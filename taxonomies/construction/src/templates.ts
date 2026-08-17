// @mandaitor/taxonomy-construction — Mandate templates
//
// Pre-configured mandate templates for construction workflows.
// Each template defines a ready-to-use delegation blueprint.
//
// Templates name the agent's role, not a specific product. The delegate is
// whatever agent a tenant runs for that role.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const CONSTRUCTION_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "construction.automated-validation",
    name: "Automated Plan Validation",
    description:
      "Delegate BIM plan validation, issue flagging, and re-check requests to a plan validation agent",
    vertical: "construction",
    scope: {
      actions: [
        "construction.validation.approve",
        "construction.validation.flag",
        "construction.validation.reject",
        "construction.validation.request_recheck",
        "construction.validation.request_change",
      ],
      resourcePatterns: ["project-zone-trade"],
      effect: "ALLOW",
      conditions: {
        require_photo_evidence: true,
        max_deviation_percent: 5,
      },
    },
    constraints: {
      time: { defaultDuration: "P180D" },
      rateLimits: { max_validations_per_hour: 100, max_auto_approvals_per_day: 50 },
      escalationRules: {
        deviation_above_percent: 15,
        escalate_to: "project_manager",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.schedule-management",
    name: "AI Schedule Management",
    description:
      "Delegate schedule updates and notifications to a scheduling agent based on progress and weather data",
    vertical: "construction",
    scope: {
      actions: ["construction.scheduling.update", "construction.scheduling.notify"],
      resourcePatterns: ["project-zone", "project-schedule"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      rateLimits: { max_schedule_updates_per_day: 10, max_notifications_per_day: 100 },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.procurement-automation",
    name: "Automated Procurement",
    description:
      "Delegate material ordering and quote comparison to a procurement agent within budget limits",
    vertical: "construction",
    scope: {
      actions: [
        "construction.procurement.create_order",
        "construction.procurement.compare_quotes",
      ],
      resourcePatterns: ["project-procurement"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      transactionLimits: {
        max_order_value: { currency: "EUR", value: 10000 },
        max_orders_per_week: 20,
      },
      escalationRules: {
        amount_above: { currency: "EUR", value: 5000 },
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.cost-management",
    name: "AI Cost Management",
    description:
      "Delegate invoice approval and cost deviation monitoring to a cost control agent",
    vertical: "construction",
    scope: {
      actions: ["construction.cost.approve_invoice", "construction.cost.flag_deviation"],
      resourcePatterns: ["project-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      transactionLimits: {
        max_single_invoice: { currency: "EUR", value: 5000 },
        max_daily_total: { currency: "EUR", value: 25000 },
      },
      escalationRules: {
        deviation_above_percent: 10,
        escalate_to: "finance_controller",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.documentation-handover",
    name: "Documentation & Handover",
    description:
      "Delegate documentation generation and handover preparation to a documentation agent",
    vertical: "construction",
    scope: {
      actions: ["construction.documentation.generate", "construction.handover.prepare"],
      resourcePatterns: ["project-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      rateLimits: { max_documents_per_day: 50 },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.defect-detection",
    name: "Automated Defect Detection",
    description:
      "Delegate defect report creation from 360° scan anomaly detection to a quality assurance agent",
    vertical: "construction",
    scope: {
      actions: ["construction.defect.create"],
      resourcePatterns: ["project-zone-trade", "project-defect"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P180D" },
      rateLimits: { max_defects_per_day: 200 },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.safety-halt",
    name: "Emergency Safety Halt",
    description:
      "Authorize AI agent to halt work in a construction zone due to detected safety hazards — requires human confirmation",
    vertical: "construction",
    scope: {
      actions: ["construction.safety.halt"],
      resourcePatterns: ["project-zone"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "site_manager",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "construction.punch-list-triage",
    name: "Construction Punch-List Triage",
    description:
      "Delegate zone-level punch-list triage, defect capture, and follow-up documentation to a construction quality agent",
    vertical: "construction",
    scope: {
      actions: [
        "construction.validation.flag",
        "construction.defect.create",
        "construction.documentation.generate",
      ],
      resourcePatterns: ["project-zone", "project-defect"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      rateLimits: { max_defects_per_day: 50, max_documents_per_day: 25 },
      escalationRules: {
        repeated_findings_above: 10,
        escalate_to: "site_manager",
        escalation_method: "NOTIFY",
      },
    },
    delegateType: "AGENT",
  },
];
