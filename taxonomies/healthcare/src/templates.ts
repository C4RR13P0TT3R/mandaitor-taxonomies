// @mandaitor/taxonomy-healthcare — Mandate templates
//
// Pre-configured mandate templates for clinical AI workflows.
// Inspired by the Avelios demo: patient letter assistant, record access, discharge management.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "healthcare.clinical-reader",
    name: "Clinical Data Reader",
    description:
      "Delegate read-only access to patient records and summaries for AI clinical decision support",
    vertical: "healthcare",
    scope: {
      actions: ["healthcare.patient.read_record", "healthcare.patient.read_summary"],
      resourcePatterns: ["patient-record", "patient-all"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      rateLimits: { max_records_per_hour: 50, max_records_per_day: 200 },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.letter-assistant",
    name: "Clinical Letter Assistant",
    description:
      "Delegate clinical letter drafting to AI — draft letters are reviewed by physician before sending",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.patient.read_record",
        "healthcare.documentation.draft_letter",
        "healthcare.documentation.generate_report",
      ],
      resourcePatterns: ["patient-all", "patient-document"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P180D" },
      rateLimits: { max_letters_per_day: 50, max_reports_per_day: 100 },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.letter-sender",
    name: "Clinical Letter Sender",
    description:
      "Full letter workflow including sending — requires human approval for each sent letter",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.patient.read_record",
        "healthcare.documentation.draft_letter",
        "healthcare.documentation.send_letter",
      ],
      resourcePatterns: ["patient-all", "patient-document"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      rateLimits: { max_sent_letters_per_day: 20 },
      escalationRules: {
        always_escalate: true,
        escalate_to: "attending_physician",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.prescription-support",
    name: "Prescription Decision Support",
    description:
      "Delegate prescription suggestions based on clinical guidelines — issuance requires physician co-signature",
    vertical: "healthcare",
    scope: {
      actions: ["healthcare.prescription.suggest", "healthcare.prescription.issue"],
      resourcePatterns: ["patient-prescription", "patient-all"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      transactionLimits: {
        max_suggestions_per_day: 100,
        max_issued_per_day: 20,
      },
      escalationRules: {
        always_escalate: true,
        escalate_to: "prescribing_physician",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.discharge-management",
    name: "Discharge Management",
    description:
      "Delegate discharge preparation and documentation — final approval requires attending physician",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.discharge.prepare",
        "healthcare.discharge.approve",
        "healthcare.documentation.draft_letter",
      ],
      resourcePatterns: ["patient-all", "patient-document"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P180D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "attending_physician",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.scheduling-automation",
    name: "Appointment Scheduling",
    description:
      "Delegate appointment booking and rescheduling based on clinical priority and availability",
    vertical: "healthcare",
    scope: {
      actions: ["healthcare.scheduling.book_appointment"],
      resourcePatterns: ["patient-appointment"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      rateLimits: { max_bookings_per_hour: 30, max_bookings_per_day: 200 },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.triage-assistant",
    name: "AI Triage Assessment",
    description:
      "Delegate triage priority assessment — HIGH/CRITICAL findings always escalated to physician",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.triage.assess",
        "healthcare.patient.read_summary",
        "healthcare.scheduling.book_appointment",
      ],
      resourcePatterns: ["department-patients", "patient-appointment"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P365D" },
      escalationRules: {
        severity_threshold: "HIGH",
        escalate_to: "triage_physician",
        escalation_method: "IMMEDIATE_NOTIFICATION",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "healthcare.telemedicine-support",
    name: "Telemedicine Support",
    description:
      "Delegate telemedicine session management including transcription and note generation",
    vertical: "healthcare",
    scope: {
      actions: [
        "healthcare.telemedicine.initiate_session",
        "healthcare.telemedicine.transcribe",
        "healthcare.documentation.generate_report",
      ],
      resourcePatterns: ["patient-all", "patient-document"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P180D" },
      rateLimits: { max_sessions_per_day: 30, max_transcriptions_per_day: 50 },
    },
    delegateType: "AGENT",
  },
];
