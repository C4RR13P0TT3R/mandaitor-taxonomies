import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_ACTIONS: TaxonomyAction[] = [
  {
    id: "healthcare.patient.read_record",
    label: "Read Patient Record",
    description: "Authorize AI agent to read a patient's medical record",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["healthcare", "patient"]
  },
  {
    id: "healthcare.patient.read_summary",
    label: "Read Patient Summary",
    description: "Authorize AI agent to read a summarized version of a patient's record",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["healthcare", "patient"]
  },
  {
    id: "healthcare.documentation.draft_letter",
    label: "Draft Medical Letter",
    description: "Authorize AI agent to draft a medical letter or report",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["healthcare", "documentation"]
  },
  {
    id: "healthcare.documentation.generate_report",
    label: "Generate Report",
    description: "Authorize AI agent to generate a medical report",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["healthcare", "documentation"]
  },
  {
    id: "healthcare.documentation.send_letter",
    label: "Send Medical Letter",
    description: "Authorize AI agent to send a medical letter to a patient or another doctor",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["healthcare", "documentation"]
  },
  {
    id: "healthcare.prescription.suggest",
    label: "Suggest Prescription",
    description: "Authorize AI agent to suggest a prescription based on patient data",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["healthcare", "prescription"]
  },
  {
    id: "healthcare.prescription.issue",
    label: "Issue Prescription",
    description: "Authorize AI agent to issue a prescription",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["healthcare", "prescription"]
  },
  {
    id: "healthcare.discharge.prepare",
    label: "Prepare Discharge",
    description: "Authorize AI agent to prepare discharge documents",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["healthcare", "discharge"]
  },
  {
    id: "healthcare.discharge.approve",
    label: "Approve Discharge",
    description: "Authorize AI agent to approve a patient's discharge",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["healthcare", "discharge"]
  },
  {
    id: "healthcare.scheduling.book_appointment",
    label: "Book Appointment",
    description: "Authorize AI agent to book a medical appointment",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["healthcare", "scheduling"]
  },
  {
    id: "healthcare.triage.assess",
    label: "Assess Triage",
    description: "Authorize AI agent to perform initial triage assessment",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["healthcare", "triage"]
  },
  {
    id: "healthcare.telemedicine.initiate_session",
    label: "Initiate Telemedicine Session",
    description: "Authorize AI agent to initiate a telemedicine session",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["healthcare", "telemedicine"]
  },
  {
    id: "healthcare.telemedicine.transcribe",
    label: "Transcribe Telemedicine Session",
    description: "Authorize AI agent to transcribe a telemedicine session",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["healthcare", "telemedicine"]
  }
];
