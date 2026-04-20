// @mandaitor/taxonomy-maritime — Mandate templates

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const MARITIME_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "maritime.port.standard_port_call_coordination",
    name: "Standard Port Call Coordination",
    description:
      "Routine authority for berth-planning support, tug and pilot coordination, and arrival-sequencing updates for a single port call",
    vertical: "maritime",
    scope: {
      actions: [
        "maritime.vts.sequence_arrival_slot",
        "maritime.port.coordinate_tug_pilot_request",
        "maritime.port.assign_berth",
      ],
      resourcePatterns: ["port-call"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P7D" },
      rateLimits: { max_vessel_movements_per_shift: 20 },
    },
    delegateType: "AGENT",
  },
  {
    id: "maritime.cargo.dangerous_goods_review",
    name: "Dangerous Goods Review",
    description:
      "Controlled authority for manifest review and dangerous-goods declaration handling within an identified cargo scope",
    vertical: "maritime",
    scope: {
      actions: [
        "maritime.cargo.review_manifest",
        "maritime.cargo.process_dangerous_goods_declaration",
      ],
      resourcePatterns: ["cargo-consignment"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      escalationRules: {
        escalate_to: "dangerous_goods_officer",
        response_minutes: 30,
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "maritime.safety.routine_safety_watch",
    name: "Routine Safety Watch",
    description:
      "Delegation for safety logging, cyber-risk control recording, and navigation-risk flagging during routine operations",
    vertical: "maritime",
    scope: {
      actions: [
        "maritime.safety.log_near_miss",
        "maritime.compliance.record_cyber_risk_control",
        "maritime.incident.flag_navigation_risk",
      ],
      resourcePatterns: ["operator-vessel", "operator-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P14D" },
      escalationRules: {
        escalate_to: "duty_officer",
        response_minutes: 15,
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "maritime.port.disruption_response",
    name: "Port Disruption Response",
    description:
      "Emergency-limited authority for approved disruption workflows during severe weather, berth outages, or safety incidents",
    vertical: "maritime",
    scope: {
      actions: [
        "maritime.incident.activate_port_disruption_protocol",
        "maritime.incident.flag_navigation_risk",
        "maritime.port.coordinate_tug_pilot_request",
      ],
      resourcePatterns: ["port-call", "terminal-yard"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P1D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "harbour_master",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
];
