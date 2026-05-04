// @mandaitor/taxonomy-aviation — Aviation operations actions
//
// Actions cover a focused operational slice of civil aviation:
// dispatch planning → maintenance coordination → flight documentation → safety escalation
//
// Naming convention: aviation.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const AVIATION_ACTIONS: TaxonomyAction[] = [
  {
    id: "aviation.communication.log_atc_communication",
    label: "Log ATC Communication",
    description:
      "Authorize an AI agent to log air traffic control communications for record-keeping and analysis",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["communication", "atc", "logging"],
  },
  {
    id: "aviation.crew.schedule_crew",
    label: "Schedule Crew",
    description:
      "Authorize an AI agent to generate and optimize crew schedules based on regulations and availability",
    riskLevel: "MEDIUM",
    requiresHumanApproval: true,
    tags: ["crew", "scheduling", "operations"],
  },
  {
    id: "aviation.planning.calculate_fuel_plan",
    label: "Calculate Fuel Plan",
    description:
      "Authorize an AI agent to calculate optimal fuel loads considering route, weather, and aircraft performance",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["planning", "fuel", "optimization"],
  },
  {
    id: "aviation.monitoring.etops_compliance",
    label: "Monitor ETOPS Compliance",
    description:
      "Authorize an AI agent to monitor ETOPS (Extended-range Twin-engine Operational Performance Standards) compliance during flight operations",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["monitoring", "etops", "compliance"],
  },
  {
    id: "aviation.safety.report_sms_event",
    label: "Report SMS Event",
    description:
      "Authorize an AI agent to draft and submit a safety management system (SMS) report for detected safety events",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["safety", "sms", "reporting"],
  },
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
