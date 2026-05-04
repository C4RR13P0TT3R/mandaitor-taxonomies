// @mandaitor/taxonomy-maritime — Maritime & Port Operations actions
//
// Actions cover a bounded civil-commercial operations scope:
// vessel traffic coordination → berth and terminal planning → cargo documentation
// → compliance logging → incident escalation.
//
// Naming convention: maritime.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const MARITIME_ACTIONS: TaxonomyAction[] = [
  // ── Vessel Traffic & Port Coordination ───────────────────
  {
    id: "maritime.vts.issue_navigation_advisory",
    label: "Issue Navigation Advisory",
    description:
      "Authorize an AI agent to prepare or transmit routine vessel traffic advisories concerning traffic flow, weather hazards, or port-entry coordination within approved VTS procedures",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["vts", "navigation", "port-coordination"],
  },
  {
    id: "maritime.vts.sequence_arrival_slot",
    label: "Sequence Arrival Slot",
    description:
      "Authorize an AI agent to propose or update arrival sequencing and approach windows for vessels entering a managed port or waterway",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["vts", "arrival", "scheduling"],
  },
  {
    id: "maritime.port.assign_berth",
    label: "Assign Berth",
    description:
      "Authorize an AI agent to allocate or recommend berth assignments based on vessel characteristics, terminal availability, and operational constraints",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["port", "berth", "terminal"],
  },
  {
    id: "maritime.port.coordinate_tug_pilot_request",
    label: "Coordinate Tug and Pilot Request",
    description:
      "Authorize an AI agent to prepare tug, pilot, and harbour-service coordination requests for an approved vessel movement",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["port", "pilotage", "harbour-services"],
  },

  // ── Cargo & Documentation ───────────────────────────────
  {
    id: "maritime.cargo.review_manifest",
    label: "Review Cargo Manifest",
    description:
      "Authorize an AI agent to review cargo manifests for completeness, routing consistency, and operational readiness before port handling",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["cargo", "documentation", "manifest"],
  },
  {
    id: "maritime.cargo.process_dangerous_goods_declaration",
    label: "Process Dangerous Goods Declaration",
    description:
      "Authorize an AI agent to log, validate, and route dangerous-goods declarations under approved port and carrier procedures",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["cargo", "dangerous-goods", "compliance"],
  },
  {
    id: "maritime.terminal.schedule_container_move",
    label: "Schedule Container Move",
    description:
      "Authorize an AI agent to plan routine container-yard or quay-side moves within terminal operating constraints",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["terminal", "container", "yard"],
  },

  // ── Safety, Compliance & Environment ────────────────────
  {
    id: "maritime.safety.log_near_miss",
    label: "Log Near Miss",
    description:
      "Authorize an AI agent to capture and route near-miss or safety-observation reports within the operator’s safety management process",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["safety", "reporting", "ism"],
  },
  {
    id: "maritime.compliance.file_pollution_prevention_report",
    label: "File Pollution Prevention Report",
    description:
      "Authorize an AI agent to prepare and submit a routine pollution-prevention or environmental compliance report within approved reporting channels",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["compliance", "environment", "pollution-prevention"],
  },
  {
    id: "maritime.compliance.record_cyber_risk_control",
    label: "Record Cyber Risk Control",
    description:
      "Authorize an AI agent to log maritime cyber-risk management actions within the safety management system for auditability and follow-up",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["compliance", "cyber", "ism"],
  },

  // ── Incident & Emergency Response ───────────────────────
  {
    id: "maritime.incident.flag_navigation_risk",
    label: "Flag Navigation Risk",
    description:
      "Authorize an AI agent to raise an operational alert for collision risk, unsafe traffic evolution, or channel congestion requiring operator review",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["incident", "navigation", "escalation"],
  },
  {
    id: "maritime.incident.activate_port_disruption_protocol",
    label: "Activate Port Disruption Protocol",
    description:
      "Emergency authority to initiate an approved disruption or contingency workflow in response to severe weather, major berth outage, or port-safety incident",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["incident", "disruption", "contingency"],
  },
  // ── New Actions for Maritime Taxonomy ───────────────────
  {
    id: "maritime.cargo.manage_manifest",
    label: "Manage Cargo Manifest",
    description:
      "Authorize an AI agent to create, update, or review cargo manifests, ensuring accuracy and compliance with shipping regulations.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["cargo", "manifest", "documentation"],
  },
  {
    id: "maritime.crew.track_certification",
    label: "Track Crew Certification",
    description:
      "Authorize an AI agent to monitor and update crew certifications, ensuring all personnel meet required qualifications and training standards.",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["crew", "certification", "compliance"],
  },
  {
    id: "maritime.compliance.prepare_port_state_inspection",
    label: "Prepare Port State Inspection",
    description:
      "Authorize an AI agent to compile necessary documentation and checklists for port state control inspections, ensuring vessel readiness.",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["compliance", "inspection", "port-state"],
  },
  {
    id: "maritime.bunker.manage_fuel",
    label: "Manage Bunker Fuel",
    description:
      "Authorize an AI agent to monitor bunker fuel levels, plan refueling operations, and optimize fuel consumption for voyages.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["bunker", "fuel", "operations"],
  },
  {
    id: "maritime.vessel.report_performance",
    label: "Report Vessel Performance",
    description:
      "Authorize an AI agent to generate reports on vessel performance metrics, including speed, fuel efficiency, and operational uptime.",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["vessel", "performance", "reporting"],
  },
];
