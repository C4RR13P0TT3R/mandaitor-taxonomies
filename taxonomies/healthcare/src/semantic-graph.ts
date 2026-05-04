export const HEALTHCARE_SEMANTIC_GRAPH = {
  nodes: [
    { id: "healthcare.patient.read_record", type: "action" },
    { id: "healthcare.patient.read_summary", type: "action" },
    { id: "healthcare.documentation.draft_letter", type: "action" },
    { id: "healthcare.documentation.generate_report", type: "action" },
    { id: "healthcare.documentation.send_letter", type: "action" },
    { id: "healthcare.prescription.suggest", type: "action" },
    { id: "healthcare.prescription.issue", type: "action" },
    { id: "healthcare.discharge.prepare", type: "action" },
    { id: "healthcare.discharge.approve", type: "action" },
    { id: "healthcare.scheduling.book_appointment", type: "action" },
    { id: "healthcare.triage.assess", type: "action" },
    { id: "healthcare.telemedicine.initiate_session", type: "action" },
    { id: "healthcare.telemedicine.transcribe", type: "action" }
  ],
  edges: [
    { source: "healthcare.patient.read_summary", target: "healthcare.patient.read_record", type: "implies" },
    { source: "healthcare.prescription.issue", target: "healthcare.prescription.suggest", type: "implies" },
    { source: "healthcare.discharge.approve", target: "healthcare.discharge.prepare", type: "implies" },
    { source: "healthcare.documentation.send_letter", target: "healthcare.documentation.draft_letter", type: "implies" }
  ]
};
