// @mandaitor/taxonomy-core — Semantic Graph Engine
//
// @experimental Builds and queries the semantic graph for a taxonomy.
// Supports both explicit relationship declarations and auto-inference
// from existing action metadata (parentAction, tags, hierarchical IDs).
//
// LEGAL NOTE: All outputs are advisory signals. They do not alter
// the ALLOW/DENY verification decision.

import type {
  ActionRelationship,
  RelationshipType,
  SemanticGraph,
  SemanticDistanceResult,
  ConflictResult,
  ActionCluster,
} from "./semantic-types.js";
import type { TaxonomyAction, IndustryTaxonomy } from "./types.js";

// ────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────

/** Maximum graph traversal depth for distance computation */
const MAX_TRAVERSAL_DEPTH = 10;

/** Default weight for auto-inferred relationships */
const INFERRED_WEIGHTS: Record<string, number> = {
  PART_OF: 0.9,
  SEMANTICALLY_NEAR: 0.5,
  CONFLICTS: 0.8,
  PRECEDES: 0.6,
  IMPLIES: 0.7,
  ESCALATES_TO: 0.7,
  REQUIRES: 0.8,
};

/**
 * Tags that signal conflicting action semantics.
 * If two actions share a domain tag but one has a "positive" and the
 * other a "negative" tag from these pairs, a CONFLICTS edge is inferred.
 */
const CONFLICT_TAG_PAIRS: [string, string][] = [
  ["approval", "rejection"],
  ["approve", "reject"],
  ["create", "delete"],
  ["halt", "release"],
  ["grant", "revoke"],
];

/**
 * Tags that signal escalation relationships.
 * If action A has a "trigger" tag and action B has the corresponding
 * "escalation" tag within the same domain, an ESCALATES_TO edge is inferred.
 */
const ESCALATION_TAG_PAIRS: [string, string][] = [
  ["flagging", "critical"],
  ["flag", "halt"],
  ["flag", "emergency"],
  ["monitoring", "emergency"],
  ["detection", "critical"],
];

// ────────────────────────────────────────────────────────────
// SemanticGraphEngine
// ────────────────────────────────────────────────────────────

export class SemanticGraphEngine {
  private readonly graph: SemanticGraph;
  private readonly adjacency: Map<string, ActionRelationship[]>;
  private readonly reverseAdjacency: Map<string, ActionRelationship[]>;
  private readonly actionIds: Set<string>;

  constructor(graph: SemanticGraph) {
    this.graph = graph;
    this.adjacency = new Map();
    this.reverseAdjacency = new Map();
    this.actionIds = new Set();

    for (const edge of graph.edges) {
      this.actionIds.add(edge.from);
      this.actionIds.add(edge.to);

      // Forward adjacency
      if (!this.adjacency.has(edge.from)) {
        this.adjacency.set(edge.from, []);
      }
      this.adjacency.get(edge.from)!.push(edge);

      // Reverse adjacency
      if (!this.reverseAdjacency.has(edge.to)) {
        this.reverseAdjacency.set(edge.to, []);
      }
      this.reverseAdjacency.get(edge.to)!.push(edge);

      // If bidirectional, add reverse edge to forward adjacency
      if (edge.bidirectional) {
        const reverse: ActionRelationship = {
          from: edge.to,
          to: edge.from,
          type: edge.type,
          weight: edge.weight,
          bidirectional: true,
          rationale: edge.rationale,
        };
        if (!this.adjacency.has(edge.to)) {
          this.adjacency.set(edge.to, []);
        }
        this.adjacency.get(edge.to)!.push(reverse);

        if (!this.reverseAdjacency.has(edge.from)) {
          this.reverseAdjacency.set(edge.from, []);
        }
        this.reverseAdjacency.get(edge.from)!.push(reverse);
      }
    }
  }

  /** Get the underlying semantic graph data */
  getGraph(): SemanticGraph {
    return this.graph;
  }

  /** Get all edges from a given action */
  edgesFrom(actionId: string): ActionRelationship[] {
    return this.adjacency.get(actionId) ?? [];
  }

  /** Get all edges pointing to a given action */
  edgesTo(actionId: string): ActionRelationship[] {
    return this.reverseAdjacency.get(actionId) ?? [];
  }

  /**
   * Compute the semantic distance between two actions.
   *
   * Uses Dijkstra's algorithm on the weighted graph where edge cost
   * is `1 - weight` (stronger relationships = shorter distance).
   * Returns 1.0 if no path exists.
   */
  semanticDistance(actionA: string, actionB: string): SemanticDistanceResult {
    if (actionA === actionB) {
      return { from: actionA, to: actionB, distance: 0, path: [actionA], pathTypes: [] };
    }

    // Dijkstra's algorithm
    const dist = new Map<string, number>();
    const prev = new Map<string, { node: string; type: RelationshipType } | null>();
    const visited = new Set<string>();

    // Priority queue (simple array-based for small graphs)
    const queue: Array<{ node: string; cost: number }> = [];

    dist.set(actionA, 0);
    prev.set(actionA, null);
    queue.push({ node: actionA, cost: 0 });

    while (queue.length > 0) {
      // Extract minimum
      queue.sort((a, b) => a.cost - b.cost);
      const current = queue.shift()!;

      if (visited.has(current.node)) continue;
      visited.add(current.node);

      if (current.node === actionB) break;

      const edges = this.adjacency.get(current.node) ?? [];
      for (const edge of edges) {
        if (visited.has(edge.to)) continue;

        // Edge cost: stronger weight = shorter distance
        const edgeCost = 1 - edge.weight;
        const newDist = current.cost + edgeCost;

        if (!dist.has(edge.to) || newDist < dist.get(edge.to)!) {
          dist.set(edge.to, newDist);
          prev.set(edge.to, { node: current.node, type: edge.type });
          queue.push({ node: edge.to, cost: newDist });
        }
      }
    }

    if (!dist.has(actionB)) {
      return { from: actionA, to: actionB, distance: 1.0, path: [], pathTypes: [] };
    }

    // Reconstruct path
    const path: string[] = [];
    const pathTypes: RelationshipType[] = [];
    let current: string | undefined = actionB;

    while (current !== undefined) {
      path.unshift(current);
      const prevEntry = prev.get(current);
      if (prevEntry) {
        pathTypes.unshift(prevEntry.type);
        current = prevEntry.node;
      } else {
        break;
      }
    }

    // Normalize distance to 0.0–1.0 range
    const rawDist = dist.get(actionB)!;
    const normalizedDist = Math.min(1.0, rawDist / MAX_TRAVERSAL_DEPTH);

    return {
      from: actionA,
      to: actionB,
      distance: normalizedDist,
      path,
      pathTypes,
    };
  }

  /**
   * Find all actions within a given semantic distance from a source action.
   */
  semanticNeighborhood(actionId: string, maxDistance: number): string[] {
    const neighbors: string[] = [];

    for (const candidateId of this.actionIds) {
      if (candidateId === actionId) continue;
      const result = this.semanticDistance(actionId, candidateId);
      if (result.distance <= maxDistance) {
        neighbors.push(candidateId);
      }
    }

    return neighbors;
  }

  /**
   * Check for conflicts between a set of actions.
   */
  checkConflicts(actionIds: string[]): ConflictResult {
    const pairs: ConflictResult["pairs"] = [];

    for (let i = 0; i < actionIds.length; i++) {
      for (let j = i + 1; j < actionIds.length; j++) {
        const edges = this.adjacency.get(actionIds[i]) ?? [];
        for (const edge of edges) {
          if (edge.to === actionIds[j] && edge.type === "CONFLICTS") {
            pairs.push({
              actionA: actionIds[i],
              actionB: actionIds[j],
              weight: edge.weight,
              rationale: edge.rationale,
            });
          }
        }
        // Check reverse direction too
        const reverseEdges = this.adjacency.get(actionIds[j]) ?? [];
        for (const edge of reverseEdges) {
          if (edge.to === actionIds[i] && edge.type === "CONFLICTS") {
            // Avoid duplicates from bidirectional edges
            const alreadyFound = pairs.some(
              (p) =>
                (p.actionA === actionIds[i] && p.actionB === actionIds[j]) ||
                (p.actionA === actionIds[j] && p.actionB === actionIds[i]),
            );
            if (!alreadyFound) {
              pairs.push({
                actionA: actionIds[j],
                actionB: actionIds[i],
                weight: edge.weight,
                rationale: edge.rationale,
              });
            }
          }
        }
      }
    }

    return { hasConflict: pairs.length > 0, pairs };
  }

  /**
   * Compute intent coverage — how well a set of performed actions
   * covers a specific action cluster.
   *
   * Returns a value between 0.0 (no coverage) and 1.0 (full coverage).
   */
  intentCoverage(performedActionIds: string[], clusterId: string): number {
    const cluster = this.graph.clusters.find((c) => c.id === clusterId);
    if (!cluster || cluster.actionIds.length === 0) return 0;

    const performedSet = new Set(performedActionIds);
    let coveredCount = 0;

    for (const clusterAction of cluster.actionIds) {
      if (performedSet.has(clusterAction)) {
        coveredCount++;
        continue;
      }
      // Check if any performed action is semantically near the cluster action
      for (const performed of performedActionIds) {
        const dist = this.semanticDistance(performed, clusterAction);
        if (dist.distance < 0.3) {
          coveredCount += 1 - dist.distance;
          break;
        }
      }
    }

    return Math.min(1.0, coveredCount / cluster.actionIds.length);
  }

  /**
   * Validate an action sequence against expected workflow order.
   * Returns sequence violations where actions appear out of the
   * expected PRECEDES/REQUIRES order.
   */
  validateSequence(
    actionSequence: string[],
  ): Array<{ index: number; action: string; violation: string; expected: string }> {
    const violations: Array<{
      index: number;
      action: string;
      violation: string;
      expected: string;
    }> = [];

    for (let i = 0; i < actionSequence.length; i++) {
      const currentAction = actionSequence[i];
      const edges = this.reverseAdjacency.get(currentAction) ?? [];

      for (const edge of edges) {
        if (edge.type === "REQUIRES") {
          // Check if the required action appeared before this one
          const requiredAction = edge.from;
          const requiredIndex = actionSequence.lastIndexOf(requiredAction, i - 1);
          if (requiredIndex === -1) {
            violations.push({
              index: i,
              action: currentAction,
              violation: "MISSING_PREREQUISITE",
              expected: `Action "${requiredAction}" must precede "${currentAction}"`,
            });
          }
        }

        if (edge.type === "PRECEDES" && edge.weight >= 0.7) {
          // Strong PRECEDES: check if the preceding action appeared before
          const precedingAction = edge.from;
          const precedingIndex = actionSequence.lastIndexOf(precedingAction, i - 1);
          if (precedingIndex === -1 && this.actionIds.has(precedingAction)) {
            // Only flag if the preceding action is in the taxonomy
            // and has a strong precedence weight
            violations.push({
              index: i,
              action: currentAction,
              violation: "UNEXPECTED_ORDER",
              expected: `Action "${precedingAction}" typically precedes "${currentAction}"`,
            });
          }
        }
      }
    }

    return violations;
  }
}

// ────────────────────────────────────────────────────────────
// Auto-Inference Engine
// ────────────────────────────────────────────────────────────

/**
 * Auto-infer a semantic graph from an existing taxonomy's action metadata.
 *
 * Inference rules:
 *   1. **Hierarchical PART_OF**: Actions sharing a common prefix
 *      (e.g. "construction.validation.*") are grouped via PART_OF edges.
 *   2. **Tag-based SEMANTICALLY_NEAR**: Actions sharing ≥2 tags get
 *      a SEMANTICALLY_NEAR edge weighted by Jaccard similarity.
 *   3. **Conflict detection**: Actions in the same domain with opposing
 *      semantic tags (approve/reject, create/delete) get CONFLICTS edges.
 *   4. **Escalation inference**: Actions with flagging/monitoring tags
 *      linked to actions with critical/emergency tags get ESCALATES_TO edges.
 *   5. **Risk-based IMPLIES**: Lower-risk actions in the same domain
 *      are inferred to be implied by higher-risk actions.
 *   6. **Cluster generation**: Actions are grouped into clusters by their
 *      second-level domain prefix (e.g. "construction.validation").
 *
 * Explicit edges in `existingGraph` always take precedence over inferred ones.
 *
 * @param taxonomy - The taxonomy to infer relationships from
 * @param existingGraph - Optional explicit graph to merge with (overrides inferred edges)
 * @returns A complete SemanticGraph with both explicit and inferred edges
 */
export function inferSemanticGraph(
  taxonomy: IndustryTaxonomy,
  existingGraph?: Partial<SemanticGraph>,
): SemanticGraph {
  const actions = taxonomy.actions;
  const inferredEdges: ActionRelationship[] = [];
  const inferredClusters: ActionCluster[] = [];

  // Build lookup maps
  const actionMap = new Map<string, TaxonomyAction>();
  const domainGroups = new Map<string, TaxonomyAction[]>();

  for (const action of actions) {
    actionMap.set(action.id, action);

    // Group by second-level domain (e.g. "construction.validation")
    const parts = action.id.split(".");
    const domain = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0];
    if (!domainGroups.has(domain)) {
      domainGroups.set(domain, []);
    }
    domainGroups.get(domain)!.push(action);
  }

  // Track existing explicit edges to avoid duplicates
  const existingEdgeKeys = new Set<string>();
  if (existingGraph?.edges) {
    for (const edge of existingGraph.edges) {
      existingEdgeKeys.add(`${edge.from}|${edge.to}|${edge.type}`);
      if (edge.bidirectional) {
        existingEdgeKeys.add(`${edge.to}|${edge.from}|${edge.type}`);
      }
    }
  }

  function addEdge(edge: ActionRelationship): void {
    const key = `${edge.from}|${edge.to}|${edge.type}`;
    const reverseKey = `${edge.to}|${edge.from}|${edge.type}`;
    if (!existingEdgeKeys.has(key) && !existingEdgeKeys.has(reverseKey)) {
      inferredEdges.push(edge);
      existingEdgeKeys.add(key);
      if (edge.bidirectional) {
        existingEdgeKeys.add(reverseKey);
      }
    }
  }

  // ── Rule 1: Hierarchical PART_OF ──────────────────────────
  for (const [domain, domainActions] of domainGroups) {
    if (domainActions.length <= 1) continue;

    // Actions in the same domain are PART_OF the domain concept
    for (let i = 0; i < domainActions.length; i++) {
      for (let j = i + 1; j < domainActions.length; j++) {
        // Only connect if they share the same second-level prefix
        const partsA = domainActions[i].id.split(".");
        const partsB = domainActions[j].id.split(".");
        if (partsA[1] === partsB[1]) {
          addEdge({
            from: domainActions[i].id,
            to: domainActions[j].id,
            type: "SEMANTICALLY_NEAR",
            weight: 0.7,
            bidirectional: true,
            rationale: `Same domain group: ${domain}`,
          });
        }
      }
    }
  }

  // ── Rule 2: Tag-based SEMANTICALLY_NEAR ───────────────────
  for (let i = 0; i < actions.length; i++) {
    for (let j = i + 1; j < actions.length; j++) {
      const tagsA = new Set(actions[i].tags);
      const tagsB = new Set(actions[j].tags);
      const intersection = new Set([...tagsA].filter((t) => tagsB.has(t)));
      const union = new Set([...tagsA, ...tagsB]);

      if (intersection.size >= 2) {
        const jaccard = intersection.size / union.size;
        // Only add if not already connected by a domain edge
        const key = `${actions[i].id}|${actions[j].id}|SEMANTICALLY_NEAR`;
        if (!existingEdgeKeys.has(key)) {
          addEdge({
            from: actions[i].id,
            to: actions[j].id,
            type: "SEMANTICALLY_NEAR",
            weight: Math.round(jaccard * 100) / 100,
            bidirectional: true,
            rationale: `Shared tags: ${[...intersection].join(", ")}`,
          });
        }
      }
    }
  }

  // ── Rule 3: Conflict detection ────────────────────────────
  for (const [_domain, domainActions] of domainGroups) {
    for (let i = 0; i < domainActions.length; i++) {
      for (let j = i + 1; j < domainActions.length; j++) {
        const tagsA = domainActions[i].tags;
        const tagsB = domainActions[j].tags;

        for (const [positiveTag, negativeTag] of CONFLICT_TAG_PAIRS) {
          const aHasPositive =
            tagsA.includes(positiveTag) ||
            domainActions[i].id.includes(positiveTag);
          const bHasNegative =
            tagsB.includes(negativeTag) ||
            domainActions[j].id.includes(negativeTag);
          const aHasNegative =
            tagsA.includes(negativeTag) ||
            domainActions[i].id.includes(negativeTag);
          const bHasPositive =
            tagsB.includes(positiveTag) ||
            domainActions[j].id.includes(positiveTag);

          if ((aHasPositive && bHasNegative) || (aHasNegative && bHasPositive)) {
            addEdge({
              from: domainActions[i].id,
              to: domainActions[j].id,
              type: "CONFLICTS",
              weight: INFERRED_WEIGHTS.CONFLICTS,
              bidirectional: true,
              rationale: `Opposing semantics: ${positiveTag}/${negativeTag}`,
            });
            break; // One conflict edge per pair is enough
          }
        }
      }
    }
  }

  // ── Rule 4: Escalation inference (cross-domain) ───────────
  // Escalation can cross domain boundaries (e.g. flag in validation → halt in safety)
  for (const actionA of actions) {
    for (const actionB of actions) {
      if (actionA.id === actionB.id) continue;

      for (const [triggerTag, escalationTag] of ESCALATION_TAG_PAIRS) {
        const aIsTrigger =
          actionA.tags.includes(triggerTag) || actionA.id.includes(triggerTag);
        const bIsEscalation =
          actionB.tags.includes(escalationTag) || actionB.id.includes(escalationTag);

        if (aIsTrigger && bIsEscalation) {
          addEdge({
            from: actionA.id,
            to: actionB.id,
            type: "ESCALATES_TO",
            weight: INFERRED_WEIGHTS.ESCALATES_TO,
            bidirectional: false,
            rationale: `Escalation: ${triggerTag} → ${escalationTag}`,
          });
        }
      }
    }
  }

  // ── Rule 5: Risk-based IMPLIES ────────────────────────────
  const riskOrder: Record<string, number> = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    CRITICAL: 3,
  };

  for (const [_domain, domainActions] of domainGroups) {
    for (const actionHigh of domainActions) {
      for (const actionLow of domainActions) {
        if (actionHigh.id === actionLow.id) continue;
        if (
          riskOrder[actionHigh.riskLevel] > riskOrder[actionLow.riskLevel] &&
          riskOrder[actionHigh.riskLevel] - riskOrder[actionLow.riskLevel] >= 2
        ) {
          // Higher-risk action implies access to lower-risk actions in same domain
          addEdge({
            from: actionHigh.id,
            to: actionLow.id,
            type: "IMPLIES",
            weight: 0.5,
            bidirectional: false,
            rationale: `Risk hierarchy: ${actionHigh.riskLevel} implies ${actionLow.riskLevel}`,
          });
        }
      }
    }
  }

  // ── Rule 6: Cluster generation ────────────────────────────
  for (const [domain, domainActions] of domainGroups) {
    const parts = domain.split(".");
    const taxonomyId = parts[0];
    const domainName = parts[1] ?? parts[0];

    inferredClusters.push({
      id: domain,
      name: domainName.charAt(0).toUpperCase() + domainName.slice(1).replace(/-/g, " "),
      description: `Actions related to ${domainName} in the ${taxonomyId} domain`,
      actionIds: domainActions.map((a) => a.id),
      domain: domainName,
    });
  }

  // ── Merge explicit and inferred ───────────────────────────
  const allEdges = [...(existingGraph?.edges ?? []), ...inferredEdges];
  const allClusters = [
    ...(existingGraph?.clusters ?? []),
    // Only add inferred clusters that don't conflict with explicit ones
    ...inferredClusters.filter(
      (ic) => !(existingGraph?.clusters ?? []).some((ec) => ec.id === ic.id),
    ),
  ];

  return {
    taxonomyId: taxonomy.metadata.id,
    schemaVersion: "1.0.0",
    edges: allEdges,
    clusters: allClusters,
  };
}

/**
 * Validate a semantic graph against its taxonomy.
 * Ensures all referenced action IDs exist in the taxonomy.
 */
export function validateSemanticGraph(
  graph: SemanticGraph,
  taxonomy: IndustryTaxonomy,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validActionIds = new Set(taxonomy.actions.map((a) => a.id));

  for (const edge of graph.edges) {
    if (!validActionIds.has(edge.from)) {
      errors.push(`Edge references unknown action: "${edge.from}"`);
    }
    if (!validActionIds.has(edge.to)) {
      errors.push(`Edge references unknown action: "${edge.to}"`);
    }
    if (edge.weight < 0 || edge.weight > 1) {
      errors.push(`Edge ${edge.from} → ${edge.to} has invalid weight: ${edge.weight}`);
    }
    if (edge.from === edge.to) {
      errors.push(`Self-referencing edge: "${edge.from}"`);
    }
  }

  for (const cluster of graph.clusters) {
    for (const actionId of cluster.actionIds) {
      if (!validActionIds.has(actionId)) {
        errors.push(`Cluster "${cluster.id}" references unknown action: "${actionId}"`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
