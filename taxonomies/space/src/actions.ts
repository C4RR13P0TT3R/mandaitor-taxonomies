// @mandaitor/taxonomy-space — Space & Satellite Operations actions
//
// Actions cover a bounded operational mission-operations scope:
// mission planning → telemetry and health → payload tasking → data handling → anomaly response
//
// Naming convention: space.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const SPACE_ACTIONS: TaxonomyAction[] = [
  // ── Mission Planning & Scheduling ───────────────────────
  {
    id: "space.mission.plan_contact_window",
    label: "Plan Contact Window",
    description:
      "Authorize an AI agent to draft or update ground-contact planning for a satellite pass within approved operational constraints",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["mission", "planning", "ground-segment"],
  },
  {
    id: "space.mission.update_activity_plan",
    label: "Update Activity Plan",
    description:
      "Authorize an AI agent to revise a mission activity timeline for routine operations, payload sessions, and ground-station usage",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["mission", "planning", "timeline"],
  },

  // ── Telemetry & Health Monitoring ───────────────────────
  {
    id: "space.telemetry.review_health_status",
    label: "Review Telemetry Health Status",
    description:
      "Authorize an AI agent to evaluate telemetry trends, summarize subsystem health, and identify off-nominal behavior for operator review",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["telemetry", "monitoring", "health"],
  },
  {
    id: "space.telemetry.flag_anomaly",
    label: "Flag Telemetry Anomaly",
    description:
      "Authorize an AI agent to flag a suspected spacecraft, payload, or communications anomaly and create an operator-facing incident record",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["telemetry", "anomaly", "incident"],
  },

  // ── Payload Operations ──────────────────────────────────
  {
    id: "space.payload.schedule_tasking",
    label: "Schedule Payload Tasking",
    description:
      "Authorize an AI agent to prepare payload tasking requests for approved mission objectives, collection windows, and orbital opportunities",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["payload", "tasking", "operations"],
  },
  {
    id: "space.payload.calibrate_sensor",
    label: "Calibrate Sensor",
    description:
      "Authorize an AI agent to initiate or recommend payload calibration workflows according to approved operating procedures and mission timelines",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["payload", "calibration", "quality"],
  },

  // ── Data Operations ─────────────────────────────────────
  {
    id: "space.data.generate_processing_job",
    label: "Generate Data Processing Job",
    description:
      "Authorize an AI agent to trigger routine data-processing workflows for downlinked payload data products",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["data", "processing", "automation"],
  },
  {
    id: "space.data.release_processed_product",
    label: "Release Processed Product",
    description:
      "Authorize an AI agent to prepare a processed data product for dissemination subject to mission policy, quality checks, and applicable access controls",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["data", "release", "dissemination"],
  },

  // ── Constellation & Ground Segment Coordination ────────
  {
    id: "space.constellation.rebalance_downlink_queue",
    label: "Rebalance Downlink Queue",
    description:
      "Authorize an AI agent to reprioritize downlink sequencing across routine passes within operator-defined network and latency constraints",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["constellation", "downlink", "ground-segment"],
  },
  {
    id: "space.compliance.record_sensed_state_request",
    label: "Record Sensed State Request",
    description:
      "Authorize an AI agent to log and route a request relating to sensed-state access, dissemination, or consultation handling",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["compliance", "governance", "remote-sensing"],
  },

  // ── Anomaly & Safety Response ───────────────────────────
  {
    id: "space.anomaly.enter_recovery_mode",
    label: "Enter Recovery Mode",
    description:
      "Emergency authority to place a spacecraft into an approved recovery or safe-mode posture after a confirmed off-nominal condition",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["anomaly", "recovery", "safety"],
  },
  {
    id: "space.anomaly.issue_collision_alert",
    label: "Issue Collision Alert",
    description:
      "Authorize an AI agent to issue a conjunction or collision-risk alert and escalate it to the responsible mission decision-maker without delay",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["anomaly", "safety", "conjunction"],
  },
];
