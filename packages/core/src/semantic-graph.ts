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
// Binary min-heap (priority queue for Dijkstra)
// ────────────────────────────────────────────────────────────

interface HeapEntry {
  node: string;
  cost: number;
}

/**
 * Minimal binary min-heap keyed on `cost`. Replaces the previous
 * `queue.sort()`-per-iteration approach so Dijkstra runs in
 * O(E log V) instead of O(V·E log E).
 */
class MinHeap {
  private readonly items: HeapEntry[] = [];

  get size(): number {
    return this.items.length;
  }

  push(entry: HeapEntry): void {
    const items = this.items;
    items.push(entry);
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent].cost <= items[i].cost) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  pop(): HeapEntry | undefined {
    const items = this.items;
    const top = items[0];
    if (top === undefined) return undefined;

    const last = items.pop()!;
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      const n = items.length;
      for (;;) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < n && items[left].cost < items[smallest].cost) smallest = left;
        if (right < n && items[right].cost < items[smallest].cost) smallest = right;
        if (smallest === i) break;
        [items[smallest], items[i]] = [items[i], items[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

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
   * Single-source Dijkstra over the weighted graph.
   *
   * Edge cost is `1 - weight` (stronger relationships = shorter distance).
   * Returns the raw (un-normalized) shortest-path cost to every reachable node
   * plus predecessor links for path reconstruction. When `target` is provided
   * the search short-circuits as soon as that node is settled.
   */
  private runDijkstra(
    source: string,
    target?: string,
  ): {
    dist: Map<string, number>;
    prev: Map<string, { node: string; type: RelationshipType } | null>;
  } {
    const dist = new Map<string, number>();
    const prev = new Map<string, { node: string; type: RelationshipType } | null>();
    const visited = new Set<string>();
    const heap = new MinHeap();

    dist.set(source, 0);
    prev.set(source, null);
    heap.push({ node: source, cost: 0 });

    while (heap.size > 0) {
      const current = heap.pop()!;

      if (visited.has(current.node)) continue;
      visited.add(current.node);

      if (target !== undefined && current.node === target) break;

      const edges = this.adjacency.get(current.node) ?? [];
      for (const edge of edges) {
        if (visited.has(edge.to)) continue;

        // Edge cost: stronger weight = shorter distance
        const edgeCost = 1 - edge.weight;
        const newDist = current.cost + edgeCost;

        if (!dist.has(edge.to) || newDist < dist.get(edge.to)!) {
          dist.set(edge.to, newDist);
          prev.set(edge.to, { node: current.node, type: edge.type });
          heap.push({ node: edge.to, cost: newDist });
        }
      }
    }

    return { dist, prev };
  }

  /** Normalize a raw shortest-path cost into the documented 0.0–1.0 range. */
  private static normalizeDistance(rawDist: number): number {
    return Math.min(1.0, rawDist / MAX_TRAVERSAL_DEPTH);
  }

  /**
   * Compute the normalized semantic distance from `source` to every action the
   * graph knows about (i.e. every endpoint of an edge) in a SINGLE Dijkstra
   * pass. Nodes that are unreachable from `source` are reported as 1.0 (fully
   * unrelated); a node that is absent from the returned map is likewise to be
   * treated as 1.0 — this matches {@link semanticDistance}, which returns 1.0
   * for any unknown or unreachable target.
   *
   * Callers that need distances to many targets (neighborhoods, intent
   * coverage) should use this instead of calling {@link semanticDistance}
   * once per target.
   */
  distancesFrom(source: string): Map<string, number> {
    const { dist } = this.runDijkstra(source);
    const normalized = new Map<string, number>();
    for (const node of this.actionIds) {
      const raw = dist.get(node);
      normalized.set(node, raw === undefined ? 1.0 : SemanticGraphEngine.normalizeDistance(raw));
    }
    // The source itself is always distance 0, even if it carries no edges.
    normalized.set(source, 0);
    return normalized;
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

    const { dist, prev } = this.runDijkstra(actionA, actionB);

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

    return {
      from: actionA,
      to: actionB,
      distance: SemanticGraphEngine.normalizeDistance(dist.get(actionB)!),
      path,
      pathTypes,
    };
  }

  /**
   * Find all actions within a given semantic distance from a source action.
   *
   * Runs a single Dijkstra pass via {@link distancesFrom} rather than calling
   * {@link semanticDistance} once per candidate.
   */
  semanticNeighborhood(actionId: string, maxDistance: number): string[] {
    const neighbors: string[] = [];
    const distances = this.distancesFrom(actionId);

    for (const candidateId of this.actionIds) {
      if (candidateId === actionId) continue;
      const distance = distances.get(candidateId) ?? 1.0;
      if (distance <= maxDistance) {
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

    // Pre-compute single-source distances once per performed action, then reuse
    // them across every cluster action instead of re-running Dijkstra for each
    // (performed, clusterAction) pair. The per-performed iteration order is
    // preserved, so the "first sufficiently-near performed action wins" result
    // is identical to the previous implementation.
    const distanceCache = new Map<string, Map<string, number>>();
    const distancesFor = (performed: string): Map<string, number> => {
      let cached = distanceCache.get(performed);
      if (!cached) {
        cached = this.distancesFrom(performed);
        distanceCache.set(performed, cached);
      }
      return cached;
    };

    let coveredCount = 0;

    for (const clusterAction of cluster.actionIds) {
      if (performedSet.has(clusterAction)) {
        coveredCount++;
        continue;
      }
      // Check if any performed action is semantically near the cluster action
      for (const performed of performedActionIds) {
        const distance = distancesFor(performed).get(clusterAction) ?? 1.0;
        if (distance < 0.3) {
          coveredCount += 1 - distance;
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

  // Per-action "signal" set: the union of the action's tags and the word-tokens
  // of its id (split on "." and "_"). Conflict/escalation inference matches tags
  // against this set, so matching happens on word boundaries rather than by raw
  // substring — an id like "...flagship..." no longer matches the "flag" trigger.
  const actionSignals = new Map<string, Set<string>>();
  // Inverted index: signal token → actions that carry it. Lets escalation
  // inference iterate trigger×escalation candidates directly instead of scanning
  // the full action × action × tag-pair cross-product.
  const signalIndex = new Map<string, TaxonomyAction[]>();

  for (const action of actions) {
    actionMap.set(action.id, action);

    // Group by second-level domain (e.g. "construction.validation")
    const parts = action.id.split(".");
    const domain = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0];
    if (!domainGroups.has(domain)) {
      domainGroups.set(domain, []);
    }
    domainGroups.get(domain)!.push(action);

    const signals = new Set<string>(action.tags);
    for (const token of action.id.split(/[._]/)) {
      if (token) signals.add(token);
    }
    actionSignals.set(action.id, signals);
    for (const token of signals) {
      let bucket = signalIndex.get(token);
      if (!bucket) {
        bucket = [];
        signalIndex.set(token, bucket);
      }
      bucket.push(action);
    }
  }

  const hasSignal = (action: TaxonomyAction, token: string): boolean =>
    actionSignals.get(action.id)?.has(token) ?? false;

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
        for (const [positiveTag, negativeTag] of CONFLICT_TAG_PAIRS) {
          const aHasPositive = hasSignal(domainActions[i], positiveTag);
          const bHasNegative = hasSignal(domainActions[j], negativeTag);
          const aHasNegative = hasSignal(domainActions[i], negativeTag);
          const bHasPositive = hasSignal(domainActions[j], positiveTag);

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
  // Escalation can cross domain boundaries (e.g. flag in validation → halt in safety).
  // Use the inverted signal index to enumerate only trigger×escalation candidate
  // pairs instead of the full action × action × tag-pair cross-product.
  for (const [triggerTag, escalationTag] of ESCALATION_TAG_PAIRS) {
    const triggers = signalIndex.get(triggerTag);
    const escalations = signalIndex.get(escalationTag);
    if (!triggers || !escalations) continue;

    for (const actionA of triggers) {
      for (const actionB of escalations) {
        if (actionA.id === actionB.id) continue;

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

  // Contributed graphs are untrusted input, so the shape itself is validated
  // before its contents (a non-array edges/clusters must not throw).
  const edges = Array.isArray(graph.edges) ? graph.edges : [];
  if (!Array.isArray(graph.edges)) {
    errors.push("Semantic graph edges must be an array");
  }
  const clusters = Array.isArray(graph.clusters) ? graph.clusters : [];
  if (!Array.isArray(graph.clusters)) {
    errors.push("Semantic graph clusters must be an array");
  }

  for (const edge of edges) {
    if (!validActionIds.has(edge.from)) {
      errors.push(`Edge references unknown action: "${edge.from}"`);
    }
    if (!validActionIds.has(edge.to)) {
      errors.push(`Edge references unknown action: "${edge.to}"`);
    }
    // A weight must be a real number inside the documented 0.0–1.0 range.
    // NaN / Infinity / non-numeric values are rejected outright.
    if (typeof edge.weight !== "number" || !Number.isFinite(edge.weight)) {
      errors.push(`Edge ${edge.from} → ${edge.to} has non-numeric weight: ${edge.weight}`);
    } else if (edge.weight < 0 || edge.weight > 1) {
      errors.push(`Edge ${edge.from} → ${edge.to} has invalid weight: ${edge.weight}`);
    }
    if (edge.from === edge.to) {
      errors.push(`Self-referencing edge: "${edge.from}"`);
    }
  }

  for (const cluster of clusters) {
    const actionIds = Array.isArray(cluster.actionIds) ? cluster.actionIds : [];
    for (const actionId of actionIds) {
      if (!validActionIds.has(actionId)) {
        errors.push(`Cluster "${cluster.id}" references unknown action: "${actionId}"`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
