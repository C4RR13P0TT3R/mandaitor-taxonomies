// @mandaitor/taxonomy-venture — Venture industry actions
//
// Actions cover founder and investor workflows:
// sourcing → screening → diligence → investment decisioning → portfolio follow-up
//
// Naming convention: venture.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const VENTURE_ACTIONS: TaxonomyAction[] = [
  // ── Deal Flow & Screening ───────────────────────────────
  {
    id: "venture.deal.screen",
    label: "Screen Opportunity",
    description:
      "Authorize AI agent to screen startup opportunities against defined thesis, stage, and market-fit criteria",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["deal", "screening", "thesis"],
  },
  {
    id: "venture.deal.prioritize",
    label: "Prioritize Opportunity",
    description:
      "Authorize AI agent to rank startup opportunities for founder or investor follow-up based on configured scoring criteria",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["deal", "prioritization", "scoring"],
  },

  // ── Diligence ───────────────────────────────────────────
  {
    id: "venture.diligence.request_documents",
    label: "Request Diligence Documents",
    description:
      "Authorize AI agent to request missing diligence materials, data-room items, or clarifications from founders",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["diligence", "documents", "communication"],
  },
  {
    id: "venture.diligence.summarize",
    label: "Summarize Diligence Materials",
    description:
      "Authorize AI agent to summarize startup materials, traction metrics, product notes, and data-room documents for internal review",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["diligence", "analysis", "summary"],
  },
  {
    id: "venture.diligence.flag_risk",
    label: "Flag Diligence Risk",
    description:
      "Authorize AI agent to flag commercial, execution, governance, or compliance risks discovered during startup diligence",
    riskLevel: "HIGH",
    requiresHumanApproval: false,
    tags: ["diligence", "risk", "governance"],
  },

  // ── Founder Support ─────────────────────────────────────
  {
    id: "venture.founder.prepare_update",
    label: "Prepare Founder Update",
    description:
      "Authorize AI agent to draft founder or portfolio updates using approved business metrics and milestones",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["founder", "communication", "reporting"],
  },
  {
    id: "venture.founder.coordinate_followup",
    label: "Coordinate Founder Follow-Up",
    description:
      "Authorize AI agent to coordinate follow-up questions, meeting actions, and next-step summaries between founders and investors",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["founder", "follow-up", "coordination"],
  },

  // ── Investment Decisioning ──────────────────────────────
  {
    id: "venture.investment.prepare_memo",
    label: "Prepare Investment Memo",
    description:
      "Authorize AI agent to assemble internal investment memos from approved startup diligence inputs and thesis criteria",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["investment", "memo", "ic"],
  },
  {
    id: "venture.investment.recommend_decision",
    label: "Recommend Investment Decision",
    description:
      "Authorize AI agent to generate a recommendation for invest, pass, or monitor decisions for human review",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["investment", "decision", "recommendation"],
  },
  {
    id: "venture.investment.approve_commitment",
    label: "Approve Capital Commitment",
    description:
      "Authorize AI agent to approve a capital commitment or allocation recommendation within a defined governance workflow",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["investment", "commitment", "approval"],
  },

  // ── Portfolio Monitoring ────────────────────────────────
  {
    id: "venture.portfolio.generate_report",
    label: "Generate Portfolio Report",
    description:
      "Authorize AI agent to generate recurring portfolio monitoring reports from approved KPI and milestone inputs",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["portfolio", "reporting", "monitoring"],
  },
  {
    id: "venture.portfolio.flag_kpi_deviation",
    label: "Flag KPI Deviation",
    description:
      "Authorize AI agent to flag deviations in growth, burn, runway, or milestone execution against agreed targets",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["portfolio", "kpi", "risk"],
  },

  // ── Fundraising & Investor Matching ─────────────────────
  {
    id: "venture.fundraising.prepare_dataroom",
    label: "Prepare Data Room",
    description:
      "Authorize AI agent to prepare and structure startup fundraising data-room content for controlled sharing",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["fundraising", "dataroom", "documents"],
  },
  {
    id: "venture.fundraising.match_investors",
    label: "Match Investors",
    description:
      "Authorize AI agent to match fundraising opportunities with relevant investors based on thesis, stage, and geography",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["fundraising", "matching", "outreach"],
  },
  // ── New Actions for Venture Taxonomy ────────────────────
  {
    id: "venture.portfolio.monitor_kpi",
    label: "Monitor Portfolio Company KPIs",
    description:
      "Authorize AI agent to monitor key performance indicators of portfolio companies against set targets and benchmarks.",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["portfolio", "monitoring", "kpi"],
  },
  {
    id: "venture.reporting.lp_report",
    label: "Generate LP Report",
    description:
      "Authorize AI agent to compile and generate reports for Limited Partners, summarizing fund performance and portfolio updates.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: true,
    tags: ["reporting", "lp", "investor"],
  },
  {
    id: "venture.deal.sourcing_pipeline",
    label: "Manage Deal Sourcing Pipeline",
    description:
      "Authorize AI agent to manage and update the deal sourcing pipeline, tracking potential investments from initial contact to due diligence.",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["deal", "sourcing", "pipeline"],
  },
  {
    id: "venture.board.prepare_meeting",
    label: "Prepare Board Meeting Materials",
    description:
      "Authorize AI agent to prepare presentations, reports, and other materials for board meetings of portfolio companies.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: true,
    tags: ["board", "meeting", "preparation"],
  },
  {
    id: "venture.diligence.esg_due_diligence",
    label: "Perform ESG Due Diligence",
    description:
      "Authorize AI agent to conduct environmental, social, and governance (ESG) due diligence on potential investment opportunities.",
    riskLevel: "HIGH",
    requiresHumanApproval: false,
    tags: ["diligence", "esg", "sustainability"],
  }
];
