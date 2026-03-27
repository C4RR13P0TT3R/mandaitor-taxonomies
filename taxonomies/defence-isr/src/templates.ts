// @mandaitor/taxonomy-defence-isr — Mandate templates
//
// Pre-configured mandate templates for defence ISR workflows.
// Inspired by Rheinmetall/ESG demo: SAR analysis, kinetic authorization, MFA enforcement.

import type { TaxonomyMandateTemplate } from "@mandaitor/taxonomy-core";

export const DEFENCE_TEMPLATES: TaxonomyMandateTemplate[] = [
  {
    id: "defence.imagery-analysis",
    name: "Automated Imagery Analysis",
    description:
      "Delegate SAR/EO imagery analysis and object detection to AI agent — classification requires human approval",
    vertical: "defence",
    scope: {
      actions: [
        "defence.intelligence.analyze_imagery",
        "defence.intelligence.classify_target",
        "defence.intelligence.generate_report",
      ],
      resourcePatterns: ["mission-sector", "imagery-collection"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: { max_analyses_per_hour: 200, max_classifications_per_hour: 50 },
      escalationRules: {
        always_escalate: true,
        escalate_to: "intelligence_officer",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "defence.multi-source-fusion",
    name: "Multi-Source Intelligence Fusion",
    description:
      "Delegate multi-source data correlation and intelligence product generation across SIGINT, IMINT, OSINT",
    vertical: "defence",
    scope: {
      actions: [
        "defence.intelligence.fuse_data",
        "defence.intelligence.generate_report",
        "defence.intelligence.analyze_imagery",
      ],
      resourcePatterns: ["mission-wide", "imagery-collection", "intelligence-product"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: { max_fusion_ops_per_day: 100 },
    },
    delegateType: "AGENT",
  },
  {
    id: "defence.sensor-tasking",
    name: "ISR Sensor Tasking",
    description:
      "Delegate sensor platform tasking and parameter adjustment — platform tasking requires human approval",
    vertical: "defence",
    scope: {
      actions: ["defence.sensor.task_platform", "defence.sensor.adjust_parameters"],
      resourcePatterns: ["sensor-platform", "mission-sector"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: { max_taskings_per_day: 20, max_adjustments_per_hour: 50 },
      escalationRules: {
        always_escalate: true,
        escalate_to: "collection_manager",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "defence.mission-support",
    name: "AI Mission Planning Support",
    description:
      "Delegate mission plan generation and status tracking — plan approval requires commander authorization",
    vertical: "defence",
    scope: {
      actions: ["defence.mission.plan", "defence.mission.update_status"],
      resourcePatterns: ["mission-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      escalationRules: {
        always_escalate: true,
        escalate_to: "mission_commander",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "defence.engagement-recommendation",
    name: "Engagement Authorization Support",
    description:
      "Delegate engagement recommendation and PID verification to AI — ALWAYS requires human-in-the-loop authorization with MFA",
    vertical: "defence",
    scope: {
      actions: ["defence.authorization.recommend", "defence.authorization.verify_pid"],
      resourcePatterns: ["target-record", "mission-sector"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P7D" },
      transactionLimits: {
        max_recommendations_per_day: 10,
        max_pid_verifications_per_day: 20,
      },
      escalationRules: {
        always_escalate: true,
        escalate_to: "engagement_authority",
        escalation_method: "APPROVAL_REQUIRED",
        require_mfa: true,
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "defence.intelligence-dissemination",
    name: "Intelligence Dissemination",
    description:
      "Delegate intelligence product dissemination and alert distribution to authorized recipients",
    vertical: "defence",
    scope: {
      actions: ["defence.comms.disseminate", "defence.comms.send_alert"],
      resourcePatterns: ["intelligence-product", "operation-wide"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: { max_disseminations_per_day: 50, max_alerts_per_hour: 20 },
      escalationRules: {
        classification_threshold: "CONFIDENTIAL",
        escalate_to: "release_authority",
        escalation_method: "APPROVAL_REQUIRED",
      },
    },
    delegateType: "AGENT",
  },
  {
    id: "defence.battle-damage-assessment",
    name: "Battle Damage Assessment",
    description:
      "Delegate post-strike battle damage assessment from imagery and sensor data analysis",
    vertical: "defence",
    scope: {
      actions: [
        "defence.bda.assess",
        "defence.intelligence.analyze_imagery",
        "defence.intelligence.generate_report",
      ],
      resourcePatterns: ["mission-sector", "imagery-collection", "target-record"],
      effect: "ALLOW",
    },
    constraints: {
      time: { defaultDuration: "P30D" },
      rateLimits: { max_assessments_per_day: 50 },
    },
    delegateType: "AGENT",
  },
];
