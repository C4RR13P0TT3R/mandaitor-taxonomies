// @mandaitor/taxonomy-defence-isr — Defence and ISR actions
//
// Actions cover intelligence, surveillance, reconnaissance, and mission workflows
// inspired by the Rheinmetall/ESG demo: SAR analysis, target classification,
// kinetic authorization, sensor tasking, and escalation.
//
// Naming convention: defence.{category}.{operation}

import type { TaxonomyAction } from "@mandaitor/taxonomy-core";

export const DEFENCE_ACTIONS: TaxonomyAction[] = [
  // ── Intelligence Analysis ────────────────────────────────
  {
    id: "defence.intelligence.analyze_imagery",
    label: "Analyze Imagery",
    description:
      "Authorize AI agent to perform automated analysis of SAR/EO imagery for object detection and change detection",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["intelligence", "imagery", "sar", "analysis"],
  },
  {
    id: "defence.intelligence.classify_target",
    label: "Classify Target",
    description:
      "Authorize AI agent to classify detected objects as target types (vehicle, structure, equipment)",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["intelligence", "classification", "targeting"],
  },
  {
    id: "defence.intelligence.generate_report",
    label: "Generate Intelligence Report",
    description:
      "Authorize AI agent to compile intelligence assessment reports from multi-source analysis",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["intelligence", "report", "assessment"],
  },
  {
    id: "defence.intelligence.fuse_data",
    label: "Fuse Multi-Source Data",
    description:
      "Authorize AI agent to correlate and fuse data from multiple intelligence sources (SIGINT, IMINT, OSINT)",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["intelligence", "fusion", "multi-source"],
  },

  // ── Sensor Tasking ───────────────────────────────────────
  {
    id: "defence.sensor.task_platform",
    label: "Task Sensor Platform",
    description:
      "Authorize AI agent to task ISR sensor platforms (UAV, satellite) for collection missions",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["sensor", "tasking", "collection", "uav"],
  },
  {
    id: "defence.sensor.adjust_parameters",
    label: "Adjust Sensor Parameters",
    description:
      "Authorize AI agent to adjust sensor collection parameters (frequency, resolution, coverage area)",
    riskLevel: "LOW",
    requiresHumanApproval: false,
    tags: ["sensor", "parameters", "configuration"],
  },

  // ── Mission Planning ─────────────────────────────────────
  {
    id: "defence.mission.plan",
    label: "Generate Mission Plan",
    description:
      "Authorize AI agent to generate mission plans including routes, timing, and resource allocation",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["mission", "planning", "operations"],
  },
  {
    id: "defence.mission.update_status",
    label: "Update Mission Status",
    description:
      "Authorize AI agent to update mission status tracking based on incoming sensor and communication data",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["mission", "status", "tracking"],
  },

  // ── Authorization & Engagement ───────────────────────────
  {
    id: "defence.authorization.recommend",
    label: "Recommend Engagement Authorization",
    description:
      "Authorize AI agent to recommend engagement authorization based on rules of engagement and positive identification",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["authorization", "engagement", "roe", "critical"],
  },
  {
    id: "defence.authorization.verify_pid",
    label: "Verify Positive Identification",
    description:
      "Authorize AI agent to verify positive identification (PID) criteria against collected intelligence",
    riskLevel: "CRITICAL",
    requiresHumanApproval: true,
    tags: ["authorization", "pid", "identification", "critical"],
  },

  // ── Communication & Dissemination ────────────────────────
  {
    id: "defence.comms.disseminate",
    label: "Disseminate Intelligence",
    description:
      "Authorize AI agent to disseminate intelligence products to authorized recipients via secure channels",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    tags: ["communication", "dissemination", "classified"],
  },
  {
    id: "defence.comms.send_alert",
    label: "Send Alert",
    description:
      "Authorize AI agent to send time-critical alerts to operational units and command elements",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["communication", "alert", "time-critical"],
  },

  // ── Battle Damage Assessment ─────────────────────────────
  {
    id: "defence.bda.assess",
    label: "Assess Battle Damage",
    description:
      "Authorize AI agent to perform battle damage assessment from post-strike imagery and sensor data",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    tags: ["bda", "assessment", "post-strike"],
  },
];
