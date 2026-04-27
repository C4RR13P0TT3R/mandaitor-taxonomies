// @mandaitor/taxonomy-healthcare — Explicit semantic graph
// @experimental

import type { ActionRelationship, SemanticGraph, ActionCluster } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_SEMANTIC_GRAPH: SemanticGraph = {
  taxonomyId: "healthcare",
  schemaVersion: "1.0.0",
  edges: [
    {
      from: "healthcare.document.create_letter",
      to: "healthcare.document.approve_document",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "A document must be created before it can be approved.",
    },
    {
      from: "healthcare.patient.read_record",
      to: "healthcare.document.create_letter",
      type: "PRECEDES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Patient records are typically reviewed before drafting a clinical letter.",
    },
    {
      from: "healthcare.triage.assess",
      to: "healthcare.scheduling.book_appointment",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "Triage assessment determines the urgency and type of appointment needed.",
    },
    {
      from: "healthcare.prescriptions.create",
      to: "healthcare.patient.read_record",
      type: "REQUIRES",
      weight: 1.0,
      bidirectional: false,
      rationale: "Creating a prescription requires access to the patient's medical history and record.",
    },
    {
      from: "healthcare.prescriptions.approve",
      to: "healthcare.prescriptions.create",
      type: "REQUIRES",
      weight: 1.0,
      bidirectional: false,
      rationale: "A prescription must be created before it can be approved.",
    },
    {
      from: "healthcare.discharge.create_summary",
      to: "healthcare.discharge.approve_discharge",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "A discharge summary is prepared before the final discharge approval is given.",
    },
    {
      from: "healthcare.telemedicine.initiate_session",
      to: "healthcare.telemedicine.transcribe",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "A telemedicine session must be initiated and conducted before it can be transcribed.",
    },
    {
      from: "healthcare.document.approve_document",
      to: "healthcare.document.create_letter",
      type: "CONFLICTS",
      weight: 0.9,
      bidirectional: true,
      rationale: "Once a document is approved, it should not be edited or re-created without a formal review process.",
    },
    {
        from: "healthcare.triage.assess",
        to: "healthcare.discharge.approve_discharge",
        type: "ESCALATES_TO",
        weight: 0.5,
        bidirectional: false,
        rationale: "A triage assessment may reveal a critical condition that requires immediate admission, bypassing normal procedures and escalating to a discharge-level decision."
    },
    {
        from: "healthcare.prescriptions.approve",
        to: "healthcare.patient.read_record",
        type: "ESCALATES_TO",
        weight: 0.6,
        bidirectional: false,
        rationale: "If a prescription approval raises questions, it may escalate to a deeper review of the patient's record."
    }
  ],
  clusters: [
    {
      id: "healthcare.clinical-documentation",
      name: "Clinical Documentation Workflow",
      description: "Actions related to the creation, approval, and management of clinical documents.",
      actionIds: [
        "healthcare.document.create_letter",
        "healthcare.document.approve_document",
        "healthcare.patient.read_record",
      ],
      domain: "clinical-workflow",
    },
    {
      id: "healthcare.patient-discharge",
      name: "Patient Discharge Workflow",
      description: "Actions involved in the patient discharge process, from summary creation to final approval.",
      actionIds: [
        "healthcare.discharge.create_summary",
        "healthcare.discharge.approve_discharge",
      ],
      domain: "clinical-workflow",
    },
    {
      id: "healthcare.telemedicine",
      name: "Telemedicine Workflow",
      description: "Actions related to providing remote clinical services through telecommunications technology.",
      actionIds: [
        "healthcare.telemedicine.initiate_session",
        "healthcare.telemedicine.transcribe",
      ],
      domain: "telemedicine",
    },
    {
      id: "healthcare.prescriptions",
      name: "Prescription Workflow",
      description: "Actions for creating and approving medication prescriptions.",
      actionIds: [
        "healthcare.prescriptions.create",
        "healthcare.prescriptions.approve",
      ],
      domain: "clinical-workflow",
    },
  ],
};
