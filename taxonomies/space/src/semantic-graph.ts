// @mandaitor/taxonomy-space — Explicit semantic graph
// @experimental

import type { ActionRelationship, SemanticGraph, ActionCluster } from "@mandaitor/taxonomy-core";

export const SPACE_SEMANTIC_GRAPH: SemanticGraph = {
  taxonomyId: "space",
  schemaVersion: "1.0.0",
  edges: [
    {
      from: "space.mission.plan_contact_window",
      to: "space.mission.update_activity_plan",
      type: "PRECEDES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Contact windows are fundamental inputs to the overall mission activity plan."
    },
    {
      from: "space.telemetry.flag_anomaly",
      to: "space.anomaly.enter_recovery_mode",
      type: "ESCALATES_TO",
      weight: 0.8,
      bidirectional: false,
      rationale: "A significant anomaly is a primary trigger for entering a safe or recovery mode to protect the asset."
    },
    {
      from: "space.telemetry.review_health_status",
      to: "space.telemetry.flag_anomaly",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "Anomaly flagging is a direct outcome of reviewing telemetry and health status."
    },
    {
      from: "space.payload.schedule_tasking",
      to: "space.data.generate_processing_job",
      type: "PRECEDES",
      weight: 0.8,
      bidirectional: false,
      rationale: "Payload tasking generates the raw data that requires downstream processing."
    },
    {
      from: "space.data.generate_processing_job",
      to: "space.data.release_processed_product",
      type: "PRECEDES",
      weight: 0.9,
      bidirectional: false,
      rationale: "Data must be processed before a product can be released."
    },
    {
      from: "space.anomaly.issue_collision_alert",
      to: "space.anomaly.enter_recovery_mode",
      type: "ESCALATES_TO",
      weight: 0.6,
      bidirectional: false,
      rationale: "A collision alert may necessitate immediate safe mode entry to prepare for potential evasive maneuvers or impact."
    },
    {
      from: "space.payload.calibrate_sensor",
      to: "space.payload.schedule_tasking",
      type: "REQUIRES",
      weight: 0.5,
      bidirectional: false,
      rationale: "Properly calibrated sensors are often a prerequisite for effective payload tasking to ensure data quality."
    },
    {
      from: "space.anomaly.enter_recovery_mode",
      to: "space.payload.schedule_tasking",
      type: "CONFLICTS",
      weight: 1,
      bidirectional: true,
      rationale: "Payload tasking is typically suspended when the spacecraft is in a recovery or safe mode."
    },
    {
      from: "space.constellation.rebalance_downlink_queue",
      to: "space.mission.plan_contact_window",
      type: "REQUIRES",
      weight: 0.7,
      bidirectional: false,
      rationale: "Rebalancing the downlink queue requires knowledge of upcoming contact windows."
    },
    {
      from: "space.mission.update_activity_plan",
      to: "space.payload.schedule_tasking",
      type: "PRECEDES",
      weight: 0.6,
      bidirectional: false,
      rationale: "The overall activity plan dictates when payload tasking can be scheduled."
    },
    {
      from: "space.data.release_processed_product",
      to: "space.compliance.record_sensed_state_request",
      type: "PRECEDES",
      weight: 0.4,
      bidirectional: false,
      rationale: "Releasing a data product may trigger compliance actions related to data governance and access."
    },
    {
      from: "space.telemetry.flag_anomaly",
      to: "space.anomaly.issue_collision_alert",
      type: "CONFLICTS",
      weight: 0.3,
      bidirectional: true,
      rationale: "While both are anomalies, they represent different classes of problems; a telemetry anomaly is not a collision alert."
    }
  ],
  clusters: [
    {
      id: "space.mission-operations",
      name: "Mission Operations",
      description: "Core workflow for planning and executing satellite missions, from ground contact scheduling to activity planning.",
      actionIds: [
        "space.mission.plan_contact_window",
        "space.mission.update_activity_plan",
        "space.payload.schedule_tasking"
      ],
      domain: "operations"
    },
    {
      id: "space.health-and-safety",
      name: "Spacecraft Health & Safety",
      description: "Actions related to monitoring spacecraft health, detecting anomalies, and responding to critical safety events.",
      actionIds: [
        "space.telemetry.review_health_status",
        "space.telemetry.flag_anomaly",
        "space.anomaly.enter_recovery_mode",
        "space.anomaly.issue_collision_alert"
      ],
      domain: "safety"
    },
    {
      id: "space.data-pipeline",
      name: "Payload Data Pipeline",
      description: "End-to-end workflow for processing and disseminating payload data, from raw data generation to product release.",
      actionIds: [
        "space.data.generate_processing_job",
        "space.data.release_processed_product",
        "space.constellation.rebalance_downlink_queue"
      ],
      domain: "data"
    }
  ]
};
