// @mandaitor/taxonomy-space — Mandate templates
//
// Pre-configured mandate templates for common satellite mission-operations workflows.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const SPACE_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "space.commissioning-assistant",
    name: "Commissioning Assistant",
    description:
      "Delegate routine early-operations support for first contact, health review, checkout tracking, and payload calibration preparation during spacecraft commissioning",
    vertical: "space",
    scope: {
      actions: [
        "space.mission.plan_contact_window",
        "space.telemetry.review_health_status",
        "space.telemetry.flag_anomaly",
        "space.payload.calibrate_sensor",
      ],
      resourcePatterns: ["program-satellite", "mission-pass"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P14D" },
      escalationRules: {
        severity_threshold: "HIGH",
        escalate_to: "flight_director",
        escalation_method: "APPROVAL_REQUIRED",
      },
      rateLimits: {
        max_replans_per_hour: 3,
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "space.earth-observation-tasking",
    name: "Earth Observation Tasking Coordinator",
    description:
      "Delegate preparation of payload tasking, processing jobs, and controlled product release for an observation campaign",
    vertical: "space",
    scope: {
      actions: [
        "space.payload.schedule_tasking",
        "space.data.generate_processing_job",
        "space.data.release_processed_product",
        "space.compliance.record_sensed_state_request",
      ],
      resourcePatterns: ["program-satellite", "payload-dataset"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      transactionLimits: {
        max_products_per_day: 15,
        allow_priority_override: false,
      },
      escalationRules: {
        severity_threshold: "HIGH",
        escalate_to: "mission_manager",
        escalation_method: "APPROVAL_REQUIRED",
      },
      rateLimits: {
        max_tasking_requests_per_day: 12,
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "space.constellation-ops-coordinator",
    name: "Constellation Operations Coordinator",
    description:
      "Delegate routine replanning and downlink coordination across a program while escalating off-nominal fleet conditions",
    vertical: "space",
    scope: {
      actions: [
        "space.mission.update_activity_plan",
        "space.telemetry.review_health_status",
        "space.telemetry.flag_anomaly",
        "space.constellation.rebalance_downlink_queue",
      ],
      resourcePatterns: ["ground-station-network", "program-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: {
        max_replans_per_hour: 4,
      },
      escalationRules: {
        severity_threshold: "HIGH",
        escalate_to: "constellation_operations_lead",
        escalation_method: "IMMEDIATE_NOTIFICATION",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "space.anomaly-safety-watch",
    name: "Anomaly Safety Watch",
    description:
      "Delegate detection support for severe spacecraft anomalies while requiring immediate escalation for any safety-critical action",
    vertical: "space",
    scope: {
      actions: [
        "space.telemetry.flag_anomaly",
        "space.anomaly.issue_collision_alert",
        "space.anomaly.enter_recovery_mode",
      ],
      resourcePatterns: ["program-satellite", "program-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P7D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "flight_director",
        escalation_method: "IMMEDIATE_NOTIFICATION",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "space.launch-operations-coordinator",
    name: "Launch Operations Coordinator",
    description:
      "Delegate coordination of launch window analysis and initial mission phase documentation.",
    vertical: "space",
    scope: {
      actions: [
        "space.mission.launch_window_analysis",
        "space.mission.document_mission_phase",
      ],
      resourcePatterns: ["program-satellite", "launch-vehicle"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P7D" },
      geoRestrictions: {
        restricted_areas: ["KSC", "Vandenberg"],
        prohibited_actions: ["space.orbital.debris_avoidance_maneuver"],
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "space.orbital-safety-manager",
    name: "Orbital Safety Manager",
    description:
      "Delegate monitoring for orbital debris and planning avoidance maneuvers, with strict human approval.",
    vertical: "space",
    scope: {
      actions: [
        "space.telemetry.flag_anomaly",
        "space.orbital.debris_avoidance_maneuver",
      ],
      resourcePatterns: ["program-satellite", "orbital-debris-database"],
      effect: "ALLOW",
    },
    constraints: {
      escalationRules: {
        severity_threshold: "CRITICAL",
        escalate_to: "orbital_safety_officer",
        escalation_method: "IMMEDIATE_NOTIFICATION",
      },
      orbitalAssetAccess: {
        allowed_asset_ids: ["SAT-123", "SAT-456"],
        access_level: "COMMAND_AND_CONTROL",
      },
    },
    delegateType: "AGENT",
  },
];
