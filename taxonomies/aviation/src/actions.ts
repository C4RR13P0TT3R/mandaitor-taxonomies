// @mandaitor/taxonomy-aviation — Aviation operations actions
//
// Actions cover a focused operational slice of civil aviation:
// dispatch planning → maintenance coordination → flight documentation → safety escalation
//
// Naming convention: aviation.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const AVIATION_ACTIONS: TaxonomyAction[] = [
  {
    id: "aviation.dispatch.create_release",
    label: "Create Dispatch Release",
    description:
      "Authorize an AI agent to prepare a draft operational flight release from approved planning inputs and route data",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["dispatch", "planning", "release"],
  },
  {
    id: "aviation.dispatch.update_route_briefing",
    label: "Update Route Briefing",
    description:
      "Authorize an AI agent to update route briefings with weather, NOTAM, and airport status information",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["dispatch", "weather", "notam"],
  },
  {
    id: "aviation.maintenance.flag_aircraft_issue",
    label: "Flag Aircraft Technical Issue",
    description:
      "Authorize an AI agent to record and flag a potential technical issue for maintenance review",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["maintenance", "safety", "flagging"],
  },
  {
    id: "aviation.maintenance.defer_defect",
    label: "Recommend Defect Deferral",
    description:
      "Authorize an AI agent to recommend a defect deferral package for licensed engineer review under approved procedures",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["maintenance", "deferral", "engineering"],
  },
  {
    id: "aviation.documentation.generate_flight_log",
    label: "Generate Flight Log",
    description:
      "Authorize an AI agent to generate a draft flight log and operational summary from dispatch and flight data",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["documentation", "flight-log", "automation"],
  },
  {
    id: "aviation.documentation.issue_ops_notice",
    label: "Issue Operations Notice",
    description:
      "Authorize an AI agent to draft and distribute an operations notice to affected crews and control teams",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["documentation", "notice", "communication"],
  },
  {
    id: "aviation.compliance.check_crew_currency",
    label: "Check Crew Currency",
    description:
      "Authorize an AI agent to verify crew currency and training validity against rostered duties",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["compliance", "crew", "currency"],
  },
  {
    id: "aviation.safety.ground_aircraft",
    label: "Ground Aircraft Recommendation",
    description:
      "Authorize an AI agent to recommend that an aircraft be grounded pending human safety review when critical conditions are detected",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["safety", "grounding", "critical"],
  },
];
