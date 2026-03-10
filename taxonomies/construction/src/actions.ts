// @mandaitor/taxonomy-construction — Construction industry actions
//
// Actions cover the full construction lifecycle:
// plan validation → scheduling → procurement → cost management → documentation → handover
//
// Naming convention: construction.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const CONSTRUCTION_ACTIONS: TaxonomyAction[] = [
  // ── Plan Validation ────────────────────────────────────
  {
    id: "construction.validation.approve",
    label: "Approve Plan Validation",
    description:
      "Authorize AI agent to approve construction plan validations against BIM models and regulatory requirements",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["validation", "bim", "compliance"],
  },
  {
    id: "construction.validation.flag",
    label: "Flag Validation Issue",
    description:
      "Authorize AI agent to flag discrepancies between as-built state and approved plans",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["validation", "quality", "flagging"],
  },
  {
    id: "construction.validation.reject",
    label: "Reject Validation",
    description:
      "Authorize AI agent to reject non-conforming installations with documented reasons",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["validation", "quality", "automation"],
  },
  {
    id: "construction.validation.request_recheck",
    label: "Request Re-Check",
    description:
      "Authorize AI agent to request a re-check of previously flagged validation issues",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["validation", "recheck"],
  },

  // ── Scheduling ─────────────────────────────────────────
  {
    id: "construction.scheduling.update",
    label: "Update Project Schedule",
    description:
      "Authorize AI agent to update project schedules based on progress reports and weather data",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["scheduling", "planning", "automation"],
  },
  {
    id: "construction.scheduling.notify",
    label: "Send Schedule Notification",
    description:
      "Authorize AI agent to send schedule change notifications to affected trades and subcontractors",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["scheduling", "notification", "communication"],
  },

  // ── Procurement ────────────────────────────────────────
  {
    id: "construction.procurement.create_order",
    label: "Create Material Order",
    description:
      "Authorize AI agent to create material procurement orders within approved budget limits",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["procurement", "materials", "finance"],
  },
  {
    id: "construction.procurement.compare_quotes",
    label: "Compare Supplier Quotes",
    description:
      "Authorize AI agent to compare and rank supplier quotes based on price, delivery time, and quality ratings",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["procurement", "comparison", "analysis"],
  },

  // ── Cost Management ────────────────────────────────────
  {
    id: "construction.cost.approve_invoice",
    label: "Approve Invoice",
    description:
      "Authorize AI agent to approve invoices up to a defined threshold after matching with delivery notes",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["cost", "invoice", "finance", "approval"],
  },
  {
    id: "construction.cost.flag_deviation",
    label: "Flag Cost Deviation",
    description:
      "Authorize AI agent to flag cost deviations exceeding defined thresholds against the project budget",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["cost", "monitoring", "budget"],
  },

  // ── Documentation & Handover ───────────────────────────
  {
    id: "construction.documentation.generate",
    label: "Generate Documentation",
    description:
      "Authorize AI agent to generate construction documentation (protocols, reports, checklists)",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["documentation", "reporting", "automation"],
  },
  {
    id: "construction.handover.prepare",
    label: "Prepare Handover Package",
    description:
      "Authorize AI agent to compile handover documentation package for project completion",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["handover", "documentation", "completion"],
  },

  // ── Defect Management ──────────────────────────────────
  {
    id: "construction.defect.create",
    label: "Create Defect Report",
    description:
      "Authorize AI agent to create defect reports from 360° scan anomaly detection",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["defect", "quality", "detection"],
  },

  // ── Safety ─────────────────────────────────────────────
  {
    id: "construction.safety.halt",
    label: "Halt Work on Zone",
    description:
      "Emergency authority to halt all work in a construction zone due to safety concerns",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["safety", "emergency", "critical"],
  },
];
