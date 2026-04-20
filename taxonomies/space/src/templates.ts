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
];
