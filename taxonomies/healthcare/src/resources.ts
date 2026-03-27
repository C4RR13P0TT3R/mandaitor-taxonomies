// @mandaitor/taxonomy-healthcare — Resource patterns
//
// Resource patterns follow clinical hierarchies:
// organization → department → patient → record/document
//
// Pattern syntax: clinic:{orgId}/department:{deptId}/patient:{patientId}/*

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "patient-record",
    pattern: "clinic:{orgId}/patient:{patientId}/record:{recordId}",
    description: "A specific patient medical record within a clinical organization",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
      { name: "patientId", type: "string", description: "Patient identifier", required: true },
      { name: "recordId", type: "string", description: "Medical record ID", required: true },
    ],
  },
  {
    name: "patient-all",
    pattern: "clinic:{orgId}/patient:{patientId}/*",
    description: "All records and documents for a specific patient — broad access",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
      { name: "patientId", type: "string", description: "Patient identifier", required: true },
    ],
  },
  {
    name: "department-patients",
    pattern: "clinic:{orgId}/department:{deptId}/patient:*/*",
    description: "All patients within a clinical department",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
      {
        name: "deptId",
        type: "enum",
        description: "Clinical department",
        required: true,
        enumValues: [
          "cardiology",
          "neurology",
          "oncology",
          "pediatrics",
          "emergency",
          "general",
          "surgery",
          "psychiatry",
        ],
      },
    ],
  },
  {
    name: "patient-prescription",
    pattern: "clinic:{orgId}/patient:{patientId}/prescription:{prescriptionId}",
    description: "A specific prescription for a patient",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
      { name: "patientId", type: "string", description: "Patient identifier", required: true },
      {
        name: "prescriptionId",
        type: "string",
        description: "Prescription ID",
        required: true,
      },
    ],
  },
  {
    name: "patient-appointment",
    pattern: "clinic:{orgId}/patient:{patientId}/appointment:{appointmentId}",
    description: "A specific patient appointment",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
      { name: "patientId", type: "string", description: "Patient identifier", required: true },
      {
        name: "appointmentId",
        type: "string",
        description: "Appointment ID",
        required: true,
      },
    ],
  },
  {
    name: "patient-document",
    pattern: "clinic:{orgId}/patient:{patientId}/document:{documentId}",
    description: "A specific clinical document (letter, report, discharge summary)",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
      { name: "patientId", type: "string", description: "Patient identifier", required: true },
      { name: "documentId", type: "string", description: "Document ID", required: true },
    ],
  },
  {
    name: "organization-wide",
    pattern: "clinic:{orgId}/*",
    description:
      "All resources within a healthcare organization — use with extreme caution in clinical settings",
    parameters: [
      { name: "orgId", type: "string", description: "Healthcare organization ID", required: true },
    ],
  },
];
