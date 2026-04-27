// @mandaitor/taxonomy-realestate — Explicit semantic graph
// @experimental

import type { ActionRelationship, SemanticGraph, ActionCluster } from "@mandaitor/taxonomy-core";

export const REALESTATE_SEMANTIC_GRAPH: Partial<SemanticGraph> = {
  taxonomyId: "realestate",
  edges: [
    {
      from: "realestate.document.classify",
      to: "realestate.document.extract",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "Document classification is a prerequisite for data extraction.",
    },
    {
      from: "realestate.document.extract",
      to: "realestate.property.update_record",
      type: "PRECEDES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Extracted data from documents is used to update property records.",
    },
    {
      from: "realestate.maintenance.create_ticket",
      to: "realestate.maintenance.dispatch_vendor",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "A maintenance ticket must be created before a vendor can be dispatched.",
    },
    {
      from: "realestate.maintenance.dispatch_vendor",
      to: "realestate.contract.review",
      type: "REQUIRES",
      weight: 0.6,
      bidirectional: false,
      rationale: "Reviewing the vendor contract is necessary before dispatching them.",
    },
    {
      from: "realestate.finance.prepare_invoice",
      to: "realestate.finance.release_payment",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "An invoice must be prepared before a payment can be released.",
    },
    {
      from: "realestate.finance.release_payment",
      to: "realestate.contract.approve_change",
      type: "REQUIRES",
      weight: 0.5,
      bidirectional: false,
      rationale: "A contract change might need to be approved before releasing a payment.",
    },
    {
      from: "realestate.tenant.prepare_message",
      to: "realestate.tenant.send_notice",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "A tenant message is prepared before a formal notice is sent.",
    },
    {
      from: "realestate.contract.review",
      to: "realestate.contract.approve_change",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "A contract must be reviewed before any changes can be approved.",
    },
  ],
  clusters: [
    {
      id: "realestate.document-workflow",
      name: "Document Workflow",
      description: "Actions related to the processing of real estate documents.",
      actionIds: [
        "realestate.document.classify",
        "realestate.document.extract",
        "realestate.property.update_record",
      ],
      domain: "document-management",
    },
    {
      id: "realestate.maintenance-workflow",
      name: "Maintenance Workflow",
      description: "Actions related to property maintenance.",
      actionIds: [
        "realestate.maintenance.create_ticket",
        "realestate.maintenance.dispatch_vendor",
        "realestate.finance.release_payment",
      ],
      domain: "maintenance",
    },
    {
      id: "realestate.finance-workflow",
      name: "Finance Workflow",
      description: "Actions related to financial operations in real estate.",
      actionIds: [
        "realestate.finance.prepare_invoice",
        "realestate.finance.release_payment",
        "realestate.contract.approve_change",
      ],
      domain: "finance",
    },
  ],
};
