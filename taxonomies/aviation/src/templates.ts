// @mandaitor/taxonomy-aviation — Mandate templates
//
// Pre-configured mandate templates for common aviation operations workflows.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const AVIATION_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "aviation.dispatch-assistant",
    name: "Dispatch Assistant",
    description:
      "Delegate route briefing refreshes and draft release preparation for a flight operations control environment",
    vertical: "aviation",
    scope: {
      actions: [
        "aviation.dispatch.create_release",
        "aviation.dispatch.update_route_briefing",
        "aviation.documentation.generate_flight_log",
      ],
      resourcePatterns: ["operator-flight"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: {
        max_briefings_per_hour: 20,
        max_releases_per_day: 100,
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "aviation.maintenance-triage",
    name: "Maintenance Triage Assistant",
    description:
      "Delegate issue flagging and draft defect-deferral preparation while requiring licensed engineer approval for any deferral recommendation",
    vertical: "aviation",
    scope: {
      actions: [
        "aviation.maintenance.flag_aircraft_issue",
        "aviation.maintenance.defer_defect",
        "aviation.documentation.issue_ops_notice",
      ],
      resourcePatterns: ["operator-aircraft"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P14D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "licensed_engineer",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "aviation.crew-compliance-monitor",
    name: "Crew Compliance Monitor",
    description:
      "Delegate crew currency checks and operator notices while escalating any high-severity compliance or safety concern immediately",
    vertical: "aviation",
    scope: {
      actions: [
        "aviation.compliance.check_crew_currency",
        "aviation.documentation.issue_ops_notice",
        "aviation.safety.ground_aircraft",
      ],
      resourcePatterns: ["operator-crew-roster", "operator-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P90D" },
      escalationRules: {
        severity_threshold: "HIGH",
        escalate_to: "director_of_operations",
        escalation_method: "IMMEDIATE_NOTIFICATION",
      },
      rateLimits: {
        max_notices_per_day: 25,
      },
    },
    delegateType: "AGENT",
  },
];
