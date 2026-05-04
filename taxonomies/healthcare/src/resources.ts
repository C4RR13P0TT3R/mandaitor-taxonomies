import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "patient-record",
    description: "A complete medical record for a specific patient",
    pattern: "urn:healthcare:patient:{patientId}:record",
    parameters: [
      { name: "patientId", description: "The unique identifier of the patient", type: "string", required: true }
    ]
  },
  {
    name: "patient-summary",
    description: "A summarized view of a patient's medical history",
    pattern: "urn:healthcare:patient:{patientId}:summary",
    parameters: [
      { name: "patientId", description: "The unique identifier of the patient", type: "string", required: true }
    ]
  },
  {
    name: "prescription",
    description: "A medical prescription for a specific patient",
    pattern: "urn:healthcare:patient:{patientId}:prescription:{prescriptionId}",
    parameters: [
      { name: "patientId", description: "The unique identifier of the patient", type: "string", required: true },
      { name: "prescriptionId", description: "The unique identifier of the prescription", type: "string", required: true }
    ]
  },
  {
    name: "medical-document",
    description: "A medical document, letter, or report",
    pattern: "urn:healthcare:patient:{patientId}:document:{documentId}",
    parameters: [
      { name: "patientId", description: "The unique identifier of the patient", type: "string", required: true },
      { name: "documentId", description: "The unique identifier of the document", type: "string", required: true }
    ]
  },
  {
    name: "appointment",
    description: "A scheduled medical appointment",
    pattern: "urn:healthcare:clinic:{clinicId}:appointment:{appointmentId}",
    parameters: [
      { name: "clinicId", description: "The unique identifier of the clinic or facility", type: "string", required: true },
      { name: "appointmentId", description: "The unique identifier of the appointment", type: "string", required: true }
    ]
  },
  {
    name: "telemedicine-session",
    description: "A virtual telemedicine session",
    pattern: "urn:healthcare:telemedicine:session:{sessionId}",
    parameters: [
      { name: "sessionId", description: "The unique identifier of the session", type: "string", required: true }
    ]
  }
];
