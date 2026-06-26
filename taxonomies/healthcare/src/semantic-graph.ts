// @mandaitor/taxonomy-healthcare — Explicit semantic graph
// @experimental
//
// Encodes the "higher-capability action implies the lower-capability one"
// relationships for the healthcare taxonomy (e.g. issuing a prescription
// implies being able to suggest one). IMPLIES edges are directional.

import type { SemanticGraph } from "@mandaitor/taxonomy-core";

export const HEALTHCARE_SEMANTIC_GRAPH: SemanticGraph = {
  taxonomyId: "healthcare",
  schemaVersion: "1.0.0",
  edges: [
    {
      from: "healthcare.patient.read_summary",
      to: "healthcare.patient.read_record",
      type: "IMPLIES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Reading a patient summary implies access to the underlying record.",
    },
    {
      from: "healthcare.prescription.issue",
      to: "healthcare.prescription.suggest",
      type: "IMPLIES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Issuing a prescription implies the ability to suggest one.",
    },
    {
      from: "healthcare.discharge.approve",
      to: "healthcare.discharge.prepare",
      type: "IMPLIES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Approving a discharge implies the ability to prepare the discharge documentation.",
    },
    {
      from: "healthcare.documentation.send_letter",
      to: "healthcare.documentation.draft_letter",
      type: "IMPLIES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Sending a letter implies the ability to draft it.",
    },
  ],
  clusters: [],
};
