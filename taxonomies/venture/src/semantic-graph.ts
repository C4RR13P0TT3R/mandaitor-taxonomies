// @mandaitor/taxonomy-venture — Explicit semantic graph
// @experimental

import type { ActionRelationship, SemanticGraph, ActionCluster } from "@mandaitor/taxonomy-core";

export const VENTURE_SEMANTIC_GRAPH: SemanticGraph = {
  taxonomyId: "venture",
  schemaVersion: "1.0.0",
  edges: [
    {
      from: "venture.deal.screen",
      to: "venture.deal.prioritize",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "Screening naturally precedes prioritization in a deal flow funnel.",
    },
    {
      from: "venture.deal.prioritize",
      to: "venture.diligence.request_documents",
      type: "PRECEDES",
      weight: 0.7,
      bidirectional: false,
      rationale: "After prioritizing an opportunity, the next logical step is to request diligence materials.",
    },
    {
      from: "venture.diligence.summarize",
      to: "venture.diligence.flag_risk",
      type: "PRECEDES",
      weight: 0.6,
      bidirectional: false,
      rationale: "Risks are typically flagged after summarizing and analyzing the diligence materials.",
    },
    {
      from: "venture.diligence.flag_risk",
      to: "venture.investment.recommend_decision",
      type: "ESCALATES_TO",
      weight: 0.9,
      bidirectional: false,
      rationale: "Flagging a significant risk during diligence escalates to a formal investment recommendation, often a pass.",
    },
    {
      from: "venture.investment.prepare_memo",
      to: "venture.investment.recommend_decision",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "The investment memo is a primary input for the investment committee's decision-making process.",
    },
    {
      from: "venture.investment.recommend_decision",
      to: "venture.investment.approve_commitment",
      type: "PRECEDES",
      weight: 1.0,
      bidirectional: false,
      rationale: "A formal capital commitment can only be approved after a positive investment recommendation is made.",
    },
    {
      from: "venture.investment.prepare_memo",
      to: "venture.diligence.summarize",
      type: "REQUIRES",
      weight: 0.9,
      bidirectional: false,
      rationale: "An investment memo cannot be properly prepared without the summarized findings from the diligence process.",
    },
    {
      from: "venture.investment.approve_commitment",
      to: "venture.investment.recommend_decision",
      type: "REQUIRES",
      weight: 1.0,
      bidirectional: false,
      rationale: "A capital commitment requires a preceding positive investment recommendation.",
    },
    {
      from: "venture.portfolio.flag_kpi_deviation",
      to: "venture.portfolio.generate_report",
      type: "REQUIRES",
      weight: 0.8,
      bidirectional: false,
      rationale: "KPI deviations are flagged based on the data presented in portfolio reports.",
    },
  ],
  clusters: [
    {
      id: "venture.deal-flow-diligence",
      name: "Deal Flow & Diligence",
      description: "Actions related to sourcing, screening, and conducting due diligence on new investment opportunities.",
      actionIds: [
        "venture.deal.screen",
        "venture.deal.prioritize",
        "venture.diligence.request_documents",
        "venture.diligence.summarize",
        "venture.diligence.flag_risk",
      ],
      domain: "Venture Capital",
    },
    {
      id: "venture.investment-decisioning",
      name: "Investment Decisioning",
      description: "Actions related to the formal process of making an investment decision, from memo to commitment.",
      actionIds: [
        "venture.investment.prepare_memo",
        "venture.investment.recommend_decision",
        "venture.investment.approve_commitment",
      ],
      domain: "Venture Capital",
    },
    {
      id: "venture.portfolio-management",
      name: "Portfolio Management",
      description: "Actions related to monitoring and supporting portfolio companies post-investment.",
      actionIds: [
        "venture.portfolio.generate_report",
        "venture.portfolio.flag_kpi_deviation",
        "venture.founder.prepare_update",
        "venture.founder.coordinate_followup",
      ],
      domain: "Venture Capital",
    },
  ],
};
