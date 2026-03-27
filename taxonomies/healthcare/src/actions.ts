// @mandaitor/taxonomy-healthcare — Clinical workflow actions
//
// Actions cover clinical workflows inspired by the Avelios demo:
// patient data access → documentation → prescriptions → discharge → telemedicine
//
// Naming convention: healthcare.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_ACTIONS: TaxonomyAction[] = [
  // ── Patient Data Access ──────────────────────────────────
  {
    id: "healthcare.patient.read_record",
    label: "Read Patient Record",
    description:
      "Authorize AI agent to read patient medical records for clinical decision support",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["patient", "data-access", "clinical"],
  },
  {
    id: "healthcare.patient.read_summary",
    label: "Read Patient Summary",
    description:
      "Authorize AI agent to read patient summary (demographics, allergies, active medications)",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["patient", "summary", "read-only"],
  },
  {
    id: "healthcare.patient.update_record",
    label: "Update Patient Record",
    description:
      "Authorize AI agent to update clinical notes and observations in patient records",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["patient", "data-write", "clinical"],
  },

  // ── Clinical Documentation ───────────────────────────────
  {
    id: "healthcare.documentation.draft_letter",
    label: "Draft Clinical Letter",
    description:
      "Authorize AI agent to draft clinical letters (discharge summaries, referral letters, consultation reports)",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["documentation", "letter", "draft"],
  },
  {
    id: "healthcare.documentation.send_letter",
    label: "Send Clinical Letter",
    description:
      "Authorize AI agent to finalize and send clinical letters to recipients (physicians, patients, insurers)",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["documentation", "letter", "send", "communication"],
  },
  {
    id: "healthcare.documentation.generate_report",
    label: "Generate Clinical Report",
    description:
      "Authorize AI agent to generate structured clinical reports (lab summaries, imaging reports)",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["documentation", "report", "automation"],
  },

  // ── Prescriptions ────────────────────────────────────────
  {
    id: "healthcare.prescription.suggest",
    label: "Suggest Prescription",
    description:
      "Authorize AI agent to suggest prescriptions based on clinical guidelines and patient history",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["prescription", "suggestion", "clinical-decision"],
  },
  {
    id: "healthcare.prescription.issue",
    label: "Issue Prescription",
    description:
      "Authorize AI agent to issue prescriptions — requires physician co-signature in most jurisdictions",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["prescription", "issue", "regulated"],
  },

  // ── Discharge Management ─────────────────────────────────
  {
    id: "healthcare.discharge.prepare",
    label: "Prepare Discharge",
    description:
      "Authorize AI agent to compile discharge documentation including medication plan and follow-up instructions",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["discharge", "preparation", "documentation"],
  },
  {
    id: "healthcare.discharge.approve",
    label: "Approve Discharge",
    description:
      "Authorize AI agent to approve patient discharge — requires attending physician confirmation",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["discharge", "approval", "critical"],
  },

  // ── Scheduling & Triage ──────────────────────────────────
  {
    id: "healthcare.scheduling.book_appointment",
    label: "Book Appointment",
    description:
      "Authorize AI agent to book or reschedule patient appointments based on clinical priority",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["scheduling", "appointment", "automation"],
  },
  {
    id: "healthcare.triage.assess",
    label: "Assess Triage Priority",
    description:
      "Authorize AI agent to assess and assign triage priority levels based on patient symptoms",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["triage", "assessment", "priority"],
  },

  // ── Telemedicine ─────────────────────────────────────────
  {
    id: "healthcare.telemedicine.initiate_session",
    label: "Initiate Telemedicine Session",
    description:
      "Authorize AI agent to initiate and moderate telemedicine sessions with patients",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["telemedicine", "session", "communication"],
  },
  {
    id: "healthcare.telemedicine.transcribe",
    label: "Transcribe Consultation",
    description:
      "Authorize AI agent to transcribe and summarize telemedicine consultations into structured notes",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["telemedicine", "transcription", "automation"],
  },
];
