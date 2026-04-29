// @mandaitor/taxonomy-core — Semantic relationship types
//
// @experimental These types enable ontological reasoning about action
// relationships beyond simple string matching. They form the foundation
// for Drift Detection and Semantic Verification.
//
// LEGAL NOTE: Semantic signals are advisory only and do not constitute
// a legal assessment. The ALLOW/DENY decision remains solely based on
// mandate scope matching.

/**
 * Typed semantic relationship between two taxonomy actions.
 *
 * Relationships encode domain knowledge about how actions relate to each
 * other — whether one implies another, conflicts with it, or typically
 * precedes it in a workflow. The {@link SemanticGraph} aggregates these
 * edges into a queryable graph structure.
 */
export interface ActionRelationship {
  /** Source action ID (e.g. "construction.validation.flag") */
  from: string;
  /** Target action ID (e.g. "construction.validation.reject") */
  to: string;
  /** Relationship type — see {@link RelationshipType} */
  type: RelationshipType;
  /**
   * Strength of the relationship on a 0.0–1.0 scale.
   *   - 1.0 = absolute (e.g. approve CONFLICTS reject)
   *   - 0.5 = moderate (e.g. flag PRECEDES reject in most workflows)
   *   - 0.1 = weak (e.g. documentation.generate is loosely related to handover.prepare)
   */
  weight: number;
  /** Whether this relationship holds in both directions */
  bidirectional: boolean;
  /** Optional human-readable justification for this edge */
  rationale?: string;
}

/**
 * Semantic relationship types between taxonomy actions.
 *
 * These types are inspired by ontological modelling (OWL/RDF) but
 * deliberately kept simpler for practical use in drift detection.
 */
export type RelationshipType =
  /** A implies B — if you can do A, you can typically do B (e.g. approve → view) */
  | "IMPLIES"
  /** A conflicts with B — doing both is contradictory (e.g. approve ↔ reject) */
  | "CONFLICTS"
  /** A escalates to B — A triggers B under certain conditions (e.g. flag → halt) */
  | "ESCALATES_TO"
  /** A is part of B — A is a sub-operation of B (e.g. approve-zone is part of approve-project) */
  | "PART_OF"
  /** A typically precedes B in a workflow (e.g. flag → reject → request_recheck) */
  | "PRECEDES"
  /** A requires B to have happened first (e.g. approve requires read_record) */
  | "REQUIRES"
  /** A and B are semantically similar but not identical */
  | "SEMANTICALLY_NEAR";

/**
 * A cluster of semantically related actions that represent a coherent
 * operational domain. Used for intent modelling — a mandate's intent
 * can reference expected clusters to define "what the delegation is for".
 */
export interface ActionCluster {
  /** Cluster identifier (e.g. "construction.quality-assurance") */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of the operational domain */
  description: string;
  /** Action IDs that belong to this cluster */
  actionIds: string[];
  /** Semantic domain tag for cross-taxonomy comparison */
  domain: string;
}

/**
 * The semantic graph for a taxonomy — a directed, weighted graph of
 * action relationships plus optional action clusters.
 *
 * Semantic graphs are optional extensions to {@link IndustryTaxonomy}.
 * When present, they enable the Drift Detection and Semantic Verification
 * experimental features.
 */
export interface SemanticGraph {
  /** Taxonomy ID this graph belongs to */
  taxonomyId: string;
  /** Graph schema version for forward compatibility */
  schemaVersion: "1.0.0";
  /** All directed edges in the graph */
  edges: ActionRelationship[];
  /** Action clusters for intent modelling */
  clusters: ActionCluster[];
}

/**
 * Result of a semantic distance computation between two actions.
 */
export interface SemanticDistanceResult {
  /** Source action ID */
  from: string;
  /** Target action ID */
  to: string;
  /** Semantic distance (0.0 = identical, 1.0 = unrelated) */
  distance: number;
  /** The shortest path between the two actions (action IDs) */
  path: string[];
  /** Relationship types along the path */
  pathTypes: RelationshipType[];
}

/**
 * Result of a conflict check between actions.
 */
export interface ConflictResult {
  /** Whether a conflict exists */
  hasConflict: boolean;
  /** The conflicting pairs found */
  pairs: Array<{
    actionA: string;
    actionB: string;
    weight: number;
    rationale?: string;
  }>;
}
