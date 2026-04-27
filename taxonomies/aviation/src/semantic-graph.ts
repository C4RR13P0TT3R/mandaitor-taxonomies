// @mandaitor/taxonomy-aviation — Explicit semantic graph
// @experimental

import type { ActionRelationship, SemanticGraph, ActionCluster } from "@mandaitor/taxonomy-core";

export const AVIATION_SEMANTIC_GRAPH: Partial<SemanticGraph> = {
  taxonomyId: "aviation",
  clusters: [
    {
      id: "aviation.workflow.dispatch-planning",
      name: "Dispatch & Flight Planning",
      description: "Actions related to the pre-flight planning and dispatch process.",
      actionIds: [
        "aviation.dispatch.create_release",
        "aviation.dispatch.update_route_briefing",
        "aviation.compliance.check_crew_currency",
      ],
      domain: "Flight Operations",
    },
    {
      id: "aviation.workflow.maintenance-safety",
      name: "Maintenance & Safety Escalation",
      description: "Actions covering the identification, deferral, and escalation of aircraft technical issues.",
      actionIds: [
        "aviation.maintenance.flag_aircraft_issue",
        "aviation.maintenance.defer_defect",
        "aviation.safety.ground_aircraft",
      ],
      domain: "Aircraft Maintenance",
    },
    {
      id: "aviation.workflow.flight-documentation",
      name: "Flight Operations & Documentation",
      description: "Actions related to in-flight and post-flight documentation and communication.",
      actionIds: [
        "aviation.documentation.generate_flight_log",
        "aviation.documentation.issue_ops_notice",
      ],
      domain: "Flight Operations",
    },
  ],
  edges: [
    {
      from: "aviation.dispatch.update_route_briefing",
      to: "aviation.dispatch.create_release",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "A route briefing is a standard input for creating a dispatch release.",
    },
    {
      from: "aviation.compliance.check_crew_currency",
      to: "aviation.dispatch.create_release",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "Crew currency and legality must be verified before a flight can be dispatched.",
    },
    {
      from: "aviation.dispatch.create_release",
      to: "aviation.documentation.generate_flight_log",
      type: "PRECEDES",
      weight: 0.7,
      bidirectional: false,
      rationale: "The dispatch release provides the foundational data for the flight log.",
    },
    {
      from: "aviation.maintenance.flag_aircraft_issue",
      to: "aviation.maintenance.defer_defect",
      type: "PRECEDES",
      weight: 1.0,
      bidirectional: false,
      rationale: "A defect must be identified and flagged before it can be considered for deferral.",
    },
    {
      from: "aviation.maintenance.flag_aircraft_issue",
      to: "aviation.safety.ground_aircraft",
      type: "ESCALATES_TO",
      weight: 0.6,
      bidirectional: false,
      rationale: "A sufficiently critical technical issue can escalate to a recommendation to ground the aircraft.",
    },
    {
      from: "aviation.maintenance.defer_defect",
      to: "aviation.safety.ground_aircraft",
      type: "CONFLICTS",
      weight: 1.0,
      bidirectional: true,
      rationale: "Deferring a defect and grounding the aircraft for that same defect are mutually exclusive actions.",
    },
    {
      from: "aviation.documentation.issue_ops_notice",
      to: "aviation.dispatch.create_release",
      type: "REQUIRES",
      weight: 0.4,
      bidirectional: false,
      rationale: "An operations notice might be issued based on information contained within a dispatch release, such as a route change.",
    },
    {
      from: "aviation.maintenance.defer_defect",
      to: "aviation.maintenance.flag_aircraft_issue",
      type: "REQUIRES",
      weight: 1.0,
      bidirectional: false,
      rationale: "A defect cannot be deferred if it has not been formally flagged in the system.",
    },
    {
        from: "aviation.dispatch.create_release",
        to: "aviation.compliance.check_crew_currency",
        type: "REQUIRES",
        weight: 1.0,
        bidirectional: false,
        rationale: "A dispatch release cannot be legally created without ensuring the assigned crew is current and qualified.",
    },
    {
        from: "aviation.safety.ground_aircraft",
        to: "aviation.maintenance.flag_aircraft_issue",
        type: "REQUIRES",
        weight: 0.9,
        bidirectional: false,
        rationale: "A recommendation to ground an aircraft must be based on a documented technical issue.",
    }
  ],
};
