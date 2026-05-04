import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "healthcare.assistant.documentation",
    name: "Medical Documentation Assistant",
    description: "Delegate drafting and generation of medical letters and reports to an AI assistant",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.patient.read_summary",
        "healthcare.documentation.draft_letter",
        "healthcare.documentation.generate_report"
      ],
      resourcePatterns: ["patient-summary", "medical-document"],
      effect: "ALLOW",
      conditions: {}
    },
    constraints: {
      time: { defaultDuration: "P30D" }
    },
    delegateType: "AGENT"
  },
  {
    id: "healthcare.assistant.triage",
    name: "Triage Assistant",
    description: "Delegate initial patient triage assessment and appointment booking",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.patient.read_summary",
        "healthcare.triage.assess",
        "healthcare.scheduling.book_appointment"
      ],
      resourcePatterns: ["patient-summary", "appointment"],
      effect: "ALLOW",
      conditions: {}
    },
    constraints: {
      time: { defaultDuration: "P90D" }
    },
    delegateType: "AGENT"
  },
  {
    id: "healthcare.assistant.telemedicine",
    name: "Telemedicine Assistant",
    description: "Delegate telemedicine session initiation and transcription",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.telemedicine.initiate_session",
        "healthcare.telemedicine.transcribe",
        "healthcare.documentation.generate_report"
      ],
      resourcePatterns: ["telemedicine-session", "medical-document"],
      effect: "ALLOW",
      conditions: {}
    },
    constraints: {
      time: { defaultDuration: "P180D" }
    },
    delegateType: "AGENT"
  }
];
