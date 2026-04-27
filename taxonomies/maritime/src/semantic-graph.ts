// @mandaitor/taxonomy-maritime — Explicit semantic graph
// @experimental

import type { ActionRelationship, SemanticGraph, ActionCluster } from "@mandaitor/taxonomy-core";

export const MARITIME_SEMANTIC_GRAPH: Partial<SemanticGraph> = {
  taxonomyId: "maritime",
  edges: [
    {
      from: "maritime.vts.sequence_arrival_slot",
      to: "maritime.port.assign_berth",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "Vessel arrival must be sequenced before a berth can be assigned.",
    },
    {
      from: "maritime.port.assign_berth",
      to: "maritime.port.coordinate_tug_pilot_request",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "A berth assignment is required to coordinate tug and pilot services for that specific location.",
    },
    {
      from: "maritime.cargo.review_manifest",
      to: "maritime.cargo.process_dangerous_goods_declaration",
      type: "PRECEDES",
      weight: 0.7,
      bidirectional: false,
      rationale: "A manifest review often precedes handling special declarations like dangerous goods.",
    },
    {
      from: "maritime.cargo.process_dangerous_goods_declaration",
      to: "maritime.port.assign_berth",
      type: "REQUIRES",
      weight: 0.6,
      bidirectional: false,
      rationale: "Berth assignment may depend on the nature of the cargo, especially dangerous goods.",
    },
    {
      from: "maritime.incident.flag_navigation_risk",
      to: "maritime.vts.issue_navigation_advisory",
      type: "ESCALATES_TO",
      weight: 0.9,
      bidirectional: false,
      rationale: "A flagged navigation risk is a direct trigger for issuing a navigation advisory to other vessels.",
    },
    {
      from: "maritime.incident.flag_navigation_risk",
      to: "maritime.incident.activate_port_disruption_protocol",
      type: "ESCALATES_TO",
      weight: 0.7,
      bidirectional: false,
      rationale: "A severe navigation risk can escalate to a full port disruption.",
    },
    {
      from: "maritime.safety.log_near_miss",
      to: "maritime.incident.flag_navigation_risk",
      type: "PRECEDES",
      weight: 0.5,
      bidirectional: false,
      rationale: "Logging a near-miss event can contribute to the identification of a larger navigation risk.",
    },
    {
      from: "maritime.terminal.schedule_container_move",
      to: "maritime.cargo.review_manifest",
      type: "REQUIRES",
      weight: 0.8,
      bidirectional: false,
      rationale: "Container moves are scheduled based on the reviewed and confirmed cargo manifest.",
    },
        {
      from: "maritime.compliance.file_pollution_prevention_report",
      to: "maritime.incident.activate_port_disruption_protocol",
      type: "ESCALATES_TO",
      weight: 0.4,
      bidirectional: false,
      rationale: "A significant pollution event can trigger a port disruption protocol.",
    },
  ],
  clusters: [
    {
      id: "maritime.vessel-arrival",
      name: "Vessel Arrival Coordination",
      description: "Workflow for sequencing and berthing arriving vessels.",
      actionIds: [
        "maritime.vts.sequence_arrival_slot",
        "maritime.port.assign_berth",
        "maritime.port.coordinate_tug_pilot_request",
        "maritime.vts.issue_navigation_advisory",
      ],
      domain: "port-operations",
    },
    {
      id: "maritime.cargo-handling",
      name: "Cargo Documentation and Handling",
      description: "Workflow for processing cargo manifests and special goods declarations.",
      actionIds: [
        "maritime.cargo.review_manifest",
        "maritime.cargo.process_dangerous_goods_declaration",
        "maritime.terminal.schedule_container_move",
      ],
      domain: "cargo-logistics",
    },
    {
      id: "maritime.incident-response",
      name: "Incident and Safety Response",
      description: "Workflow for escalating and responding to safety and navigation incidents.",
      actionIds: [
        "maritime.safety.log_near_miss",
        "maritime.incident.flag_navigation_risk",
        "maritime.incident.activate_port_disruption_protocol",
      ],
      domain: "safety-management",
    },
  ],
};
