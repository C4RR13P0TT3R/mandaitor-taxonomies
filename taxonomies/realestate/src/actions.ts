// @mandaitor/taxonomy-realestate — Real estate & property-management actions
//
// Actions cover core property-management workflows:
// property records → document handling → tenant operations → maintenance → contracts → finance → reporting
//
// Naming convention: realestate.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const REALESTATE_ACTIONS: TaxonomyAction[] = [
  // ── Property Records ────────────────────────────────────
  {
    id: "realestate.property.update_record",
    label: "Update Property Record",
    description:
      "Authorize AI agent to update structured property and unit master data from approved source documents",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["property", "master-data", "operations"],
  },

  // ── Document Handling ───────────────────────────────────
  {
    id: "realestate.document.classify",
    label: "Classify Real-Estate Document",
    description:
      "Authorize AI agent to classify incoming real-estate documents into the correct property-management workflow",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["document", "classification", "intake"],
  },
  {
    id: "realestate.document.extract",
    label: "Extract Document Data",
    description:
      "Authorize AI agent to extract structured data from leases, invoices, notices, and maintenance documents",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["document", "extraction", "automation"],
  },

  // ── Tenant Operations ───────────────────────────────────
  {
    id: "realestate.tenant.prepare_message",
    label: "Prepare Tenant Message",
    description:
      "Authorize AI agent to draft tenant-facing communication based on an existing case or approved policy",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["tenant", "communication", "drafting"],
  },
  {
    id: "realestate.tenant.send_notice",
    label: "Send Tenant Notice",
    description:
      "Authorize AI agent to send a tenant-facing notice or status update in an approved workflow",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["tenant", "communication", "notice"],
  },

  // ── Maintenance ─────────────────────────────────────────
  {
    id: "realestate.maintenance.create_ticket",
    label: "Create Maintenance Ticket",
    description:
      "Authorize AI agent to create and categorize a maintenance ticket from inbound tenant or property signals",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["maintenance", "ticketing", "operations"],
  },
  {
    id: "realestate.maintenance.dispatch_vendor",
    label: "Dispatch Maintenance Vendor",
    description:
      "Authorize AI agent to dispatch an approved vendor for a maintenance case within configured budget and urgency limits",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["maintenance", "vendor", "dispatch"],
  },

  // ── Contracts ───────────────────────────────────────────
  {
    id: "realestate.contract.review",
    label: "Review Lease Or Service Contract",
    description:
      "Authorize AI agent to review lease or service-contract documents for completeness, clauses, and deviations",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["contract", "review", "compliance"],
  },
  {
    id: "realestate.contract.approve_change",
    label: "Approve Contract Change",
    description:
      "Authorize AI agent to approve a contract or lease change within a governed approval workflow",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["contract", "approval", "critical"],
  },

  // ── Finance ─────────────────────────────────────────────
  {
    id: "realestate.finance.prepare_invoice",
    label: "Prepare Property Invoice",
    description:
      "Authorize AI agent to prepare invoice or charge documentation for review based on validated operational inputs",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["finance", "invoice", "preparation"],
  },
  {
    id: "realestate.finance.release_payment",
    label: "Release Vendor Payment",
    description:
      "Authorize AI agent to release a vendor payment after invoice matching and approval checks have passed",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["finance", "payment", "critical"],
  },

  // ── Reporting ───────────────────────────────────────────
  {
    id: "realestate.reporting.esg_sustainability",
    label: "Generate ESG/Sustainability Report",
    description:
      "Authorize AI agent to generate ESG and sustainability reports for properties, tracking relevant metrics and compliance.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["reporting", "esg", "sustainability"],
  },

  // ── Property Management ─────────────────────────────────
  {
    id: "realestate.property.valuation",
    label: "Perform Property Valuation",
    description:
      "Authorize AI agent to perform property valuations based on market data, comparable sales, and property characteristics.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: true,
    tags: ["property", "valuation", "finance"],
  },
  {
    id: "realestate.property.acquisition_analysis",
    label: "Analyze Property Acquisition",
    description:
      "Authorize AI agent to analyze potential property acquisitions, including financial projections and risk assessment.",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["property", "acquisition", "investment"],
  },

  // ── Lease Management ────────────────────────────────────
  {
    id: "realestate.lease.renewal_management",
    label: "Manage Lease Renewals",
    description:
      "Authorize AI agent to manage lease renewal processes, including drafting offers and tracking deadlines.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: true,
    tags: ["lease", "renewal", "contract"],
  },

  // ── Tenant Communication ────────────────────────────────
  {
    id: "realestate.tenant.communication_scheduling",
    label: "Schedule Tenant Communications",
    description:
      "Authorize AI agent to schedule and automate routine tenant communications, such as rent reminders or building updates.",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["tenant", "communication", "automation"],
  },

  // ── Maintenance Scheduling ──────────────────────────────
  {
    id: "realestate.maintenance.schedule_service",
    label: "Schedule Maintenance Service",
    description:
      "Authorize AI agent to schedule and coordinate maintenance services with tenants and vendors.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["maintenance", "scheduling", "operations"],
  },

  // ── Finance ─────────────────────────────────────────────
  {
    id: "realestate.finance.budget_forecasting",
    label: "Perform Budget Forecasting",
    description:
      "Authorize AI agent to perform budget forecasting for properties, analyzing income and expenses.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["finance", "budgeting", "forecasting"],
  },
  {
    id: "realestate.reporting.generate",
    label: "Generate Portfolio Report",
    description:
      "Authorize AI agent to generate occupancy, maintenance, and operational reports for a property portfolio",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["reporting", "portfolio", "analytics"],
  },
];

