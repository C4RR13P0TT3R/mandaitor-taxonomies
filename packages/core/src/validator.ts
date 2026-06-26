// @mandaitor/taxonomy-core — Taxonomy validation
//
// Validates that a taxonomy definition is internally consistent and
// follows the Mandaitor taxonomy specification. This validator runs
// both in CI (via validate-all.mjs) and at runtime when taxonomies
// are registered.

import type {
  IndustryTaxonomy,
  TaxonomyAction,
  TaxonomyResourcePattern,
  TaxonomyConstraintTemplate,
  TaxonomyMandateTemplate,
  TaxonomyMetadata,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "./types.js";
import { validateSemanticGraph } from "./semantic-graph.js";

// ── ID Pattern Rules ─────────────────────────────────────────
// Action IDs: {domain}.{category}.{operation} — at least 3 segments
const ACTION_ID_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$/;
// Constraint IDs: {domain}.{type}.{name}
const CONSTRAINT_ID_PATTERN = /^[a-z][a-z0-9_-]*(\.[a-z][a-z0-9_-]*){1,}$/;
// Template IDs: {domain}.{name}
const TEMPLATE_ID_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_-]*){1,}$/;
// Resource pattern names: lowercase with hyphens
const RESOURCE_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
// Semver pattern
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;

function extractUriTemplatePlaceholders(pattern: string): string[] {
  const placeholders: string[] = [];
  let current = "";
  let inPlaceholder = false;

  for (const char of pattern) {
    if (char === "{") {
      inPlaceholder = true;
      current = "";
      continue;
    }

    if (char === "}") {
      if (inPlaceholder && current.length > 0) {
        placeholders.push(current);
      }
      inPlaceholder = false;
      current = "";
      continue;
    }

    if (inPlaceholder) {
      current += char;
    }
  }

  return placeholders;
}

/**
 * Validate a complete taxonomy definition.
 * Returns errors (must fix) and warnings (should fix).
 */
export function validateTaxonomy(taxonomy: IndustryTaxonomy): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // ── Metadata validation ──
  validateMetadata(taxonomy.metadata, errors, warnings);

  // ── Action validation ──
  const actionIds = new Set<string>();
  for (let i = 0; i < taxonomy.actions.length; i++) {
    validateAction(taxonomy.actions[i], i, taxonomy.metadata.id, actionIds, errors, warnings);
  }
  // Second pass: resolve parentAction references against the full id set so the
  // result does not depend on action ordering.
  validateActionParents(taxonomy.actions, actionIds, errors);

  // ── Resource pattern validation ──
  const resourceNames = new Set<string>();
  for (let i = 0; i < taxonomy.resourcePatterns.length; i++) {
    validateResourcePattern(taxonomy.resourcePatterns[i], i, resourceNames, errors, warnings);
  }

  // ── Constraint template validation ──
  const constraintIds = new Set<string>();
  for (let i = 0; i < taxonomy.constraintTemplates.length; i++) {
    validateConstraintTemplate(
      taxonomy.constraintTemplates[i],
      i,
      taxonomy.metadata.id,
      constraintIds,
      errors,
      warnings,
    );
  }

  // ── Mandate template validation ──
  const templateIds = new Set<string>();
  for (let i = 0; i < taxonomy.mandateTemplates.length; i++) {
    validateMandateTemplate(
      taxonomy.mandateTemplates[i],
      i,
      taxonomy.metadata.id,
      actionIds,
      resourceNames,
      templateIds,
      errors,
      warnings,
    );
  }

  // ── Semantic graph validation ──
  // A taxonomy's semanticGraph reaches the runtime engine, so when one is
  // present its structural invariants are enforced here. Referential and
  // numeric problems (edges pointing at unknown actions, weights outside
  // 0.0–1.0, self-references, clusters referencing unknown actions) are
  // promoted to ERRORS — they indicate a malformed graph, not a style nit.
  if (taxonomy.semanticGraph) {
    validateSemanticGraphSection(taxonomy, errors, warnings);
  }

  // ── Cross-reference checks ──
  // Check that high-risk actions have at least one template with escalation
  const highRiskActions = taxonomy.actions.filter(
    (a) => a.riskLevel === "CRITICAL" || a.requiresHumanApproval,
  );
  for (const action of highRiskActions) {
    const hasTemplateWithEscalation = taxonomy.mandateTemplates.some(
      (t) =>
        t.scope.actions.includes(action.id) &&
        t.constraints.escalationRules !== undefined,
    );
    if (!hasTemplateWithEscalation) {
      warnings.push({
        path: `actions[${action.id}]`,
        message: `High-risk action "${action.id}" has no mandate template with escalation rules`,
        code: "MISSING_ESCALATION_TEMPLATE",
      });
    }
  }

  // Check minimum content requirements
  if (taxonomy.actions.length === 0) {
    errors.push({
      path: "actions",
      message: "Taxonomy must define at least one action",
      code: "EMPTY_ACTIONS",
    });
  }
  if (taxonomy.resourcePatterns.length === 0) {
    errors.push({
      path: "resourcePatterns",
      message: "Taxonomy must define at least one resource pattern",
      code: "EMPTY_RESOURCE_PATTERNS",
    });
  }
  if (taxonomy.mandateTemplates.length === 0) {
    warnings.push({
      path: "mandateTemplates",
      message: "Taxonomy should define at least one mandate template for usability",
      code: "NO_MANDATE_TEMPLATES",
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ── Metadata ─────────────────────────────────────────────────

function validateMetadata(
  meta: TaxonomyMetadata,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  if (!meta.id || !/^[a-z][a-z0-9-]*$/.test(meta.id)) {
    errors.push({
      path: "metadata.id",
      message: `Invalid taxonomy ID "${meta.id}". Must be lowercase alphanumeric with hyphens.`,
      code: "INVALID_TAXONOMY_ID",
    });
  }

  if (!meta.version || !SEMVER_PATTERN.test(meta.version)) {
    errors.push({
      path: "metadata.version",
      message: `Invalid version "${meta.version}". Must follow semver (e.g., 1.0.0).`,
      code: "INVALID_VERSION",
    });
  }

  if (!meta.name || meta.name.length < 3) {
    errors.push({
      path: "metadata.name",
      message: "Taxonomy name must be at least 3 characters",
      code: "INVALID_NAME",
    });
  }

  if (!meta.description || meta.description.length < 20) {
    warnings.push({
      path: "metadata.description",
      message: "Taxonomy description should be at least 20 characters for discoverability",
      code: "SHORT_DESCRIPTION",
    });
  }

  if (!meta.maintainers || meta.maintainers.length === 0) {
    errors.push({
      path: "metadata.maintainers",
      message: "Taxonomy must have at least one maintainer",
      code: "NO_MAINTAINERS",
    });
  }

  if (!meta.coreVersion || !SEMVER_PATTERN.test(meta.coreVersion)) {
    errors.push({
      path: "metadata.coreVersion",
      message: `Invalid coreVersion "${meta.coreVersion}". Must follow semver.`,
      code: "INVALID_CORE_VERSION",
    });
  }
}

// ── Actions ──────────────────────────────────────────────────

function validateAction(
  action: TaxonomyAction,
  index: number,
  taxonomyId: string,
  seenIds: Set<string>,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  const prefix = `actions[${index}]`;

  const hasValidId = !!action.id && ACTION_ID_PATTERN.test(action.id);
  if (!hasValidId) {
    errors.push({
      path: `${prefix}.id`,
      message: `Invalid action ID "${action.id}". Must match pattern: {domain}.{category}.{operation}`,
      code: "INVALID_ACTION_ID",
    });
  }

  // Action IDs should be prefixed with the taxonomy ID
  if (action.id && !action.id.startsWith(`${taxonomyId}.`)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Action ID "${action.id}" must be prefixed with taxonomy ID "${taxonomyId}."`,
      code: "WRONG_ACTION_PREFIX",
    });
  }

  // Only track syntactically valid ids for duplicate detection. An empty or
  // malformed id must not be recorded — otherwise two separately-broken actions
  // would collapse into a spurious "duplicate" and mask the real INVALID_ACTION_ID.
  if (hasValidId) {
    if (seenIds.has(action.id)) {
      errors.push({
        path: `${prefix}.id`,
        message: `Duplicate action ID: "${action.id}"`,
        code: "DUPLICATE_ACTION_ID",
      });
    }
    seenIds.add(action.id);
  }

  if (!action.label || action.label.length < 3) {
    errors.push({
      path: `${prefix}.label`,
      message: "Action label must be at least 3 characters",
      code: "INVALID_LABEL",
    });
  }

  if (!action.description || action.description.length < 10) {
    warnings.push({
      path: `${prefix}.description`,
      message: "Action description should be at least 10 characters",
      code: "SHORT_DESCRIPTION",
    });
  }

  if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(action.riskLevel)) {
    errors.push({
      path: `${prefix}.riskLevel`,
      message: `Invalid risk level: "${action.riskLevel}"`,
      code: "INVALID_RISK_LEVEL",
    });
  }

  if (action.riskLevel === "CRITICAL" && !action.requiresHumanApproval) {
    warnings.push({
      path: `${prefix}.requiresHumanApproval`,
      message: `CRITICAL action "${action.id}" should require human approval`,
      code: "CRITICAL_WITHOUT_APPROVAL",
    });
  }

  if (!action.tags || action.tags.length === 0) {
    warnings.push({
      path: `${prefix}.tags`,
      message: "Actions should have at least one tag for discoverability",
      code: "NO_TAGS",
    });
  }

  // NOTE: parentAction is resolved in a dedicated second pass (see
  // validateActionParents) once the full set of action ids is known, so that an
  // unknown parent is a deterministic error rather than an order-dependent warning.
}

/**
 * Second-pass resolution of action.parentAction references.
 *
 * Run after every action has been collected so the check is order-independent:
 * a parent declared later in the array resolves correctly, and a parent that is
 * genuinely absent is a hard error rather than a "may be defined later" warning.
 */
function validateActionParents(
  actions: TaxonomyAction[],
  validActionIds: Set<string>,
  errors: ValidationError[],
): void {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (!action.parentAction) continue;

    if (action.parentAction === action.id) {
      errors.push({
        path: `actions[${i}].parentAction`,
        message: `Action "${action.id}" cannot be its own parent`,
        code: "SELF_PARENT",
      });
      continue;
    }

    if (!validActionIds.has(action.parentAction)) {
      errors.push({
        path: `actions[${i}].parentAction`,
        message: `Parent action "${action.parentAction}" not found in taxonomy`,
        code: "UNKNOWN_PARENT",
      });
    }
  }
}

// ── Semantic Graph ───────────────────────────────────────────

/**
 * Validate a taxonomy's optional semanticGraph and fold the results into the
 * taxonomy-level error/warning lists.
 *
 * Because contributed graphs are untrusted input that reaches the runtime
 * engine, the graph's top-level SHAPE is checked first (the function must never
 * throw on a malformed graph). Referential/numeric checks then come from
 * {@link validateSemanticGraph} (shared with the runtime engine) and are
 * surfaced as ERRORS. A few advisory checks (graph taxonomyId mismatch,
 * duplicate cluster ids) are added here as WARNINGS.
 */
function validateSemanticGraphSection(
  taxonomy: IndustryTaxonomy,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  const graph = taxonomy.semanticGraph;
  if (!graph || typeof graph !== "object") return;

  // ── Top-level structural checks ──
  // A malformed schemaVersion / missing edges|clusters arrays indicate the graph
  // does not implement the SemanticGraph contract at all (e.g. an ad-hoc
  // nodes/source/target shape). These are hard errors.
  if (graph.schemaVersion !== "1.0.0") {
    errors.push({
      path: "semanticGraph.schemaVersion",
      message: `Unsupported semantic graph schemaVersion: "${graph.schemaVersion}" (expected "1.0.0")`,
      code: "INVALID_SEMANTIC_GRAPH",
    });
  }
  if (!Array.isArray(graph.edges)) {
    errors.push({
      path: "semanticGraph.edges",
      message: "Semantic graph must define an edges array",
      code: "INVALID_SEMANTIC_GRAPH",
    });
  }
  if (!Array.isArray(graph.clusters)) {
    errors.push({
      path: "semanticGraph.clusters",
      message: "Semantic graph must define a clusters array",
      code: "INVALID_SEMANTIC_GRAPH",
    });
  }

  // ── Referential / numeric checks (shared with the runtime engine) ──
  const graphResult = validateSemanticGraph(graph, taxonomy);
  for (const message of graphResult.errors) {
    errors.push({
      path: "semanticGraph",
      message,
      code: "INVALID_SEMANTIC_GRAPH",
    });
  }

  // The graph should describe this taxonomy. A mismatched taxonomyId is most
  // likely a copy/paste slip; it is advisory rather than fatal.
  if (graph.taxonomyId !== taxonomy.metadata.id) {
    warnings.push({
      path: "semanticGraph.taxonomyId",
      message: `Semantic graph taxonomyId "${graph.taxonomyId}" does not match taxonomy ID "${taxonomy.metadata.id}"`,
      code: "SEMANTIC_GRAPH_ID_MISMATCH",
    });
  }

  const seenClusterIds = new Set<string>();
  for (const cluster of Array.isArray(graph.clusters) ? graph.clusters : []) {
    if (seenClusterIds.has(cluster.id)) {
      warnings.push({
        path: `semanticGraph.clusters[${cluster.id}]`,
        message: `Duplicate semantic cluster id: "${cluster.id}"`,
        code: "DUPLICATE_SEMANTIC_CLUSTER",
      });
    }
    seenClusterIds.add(cluster.id);
  }
}

// ── Resource Patterns ────────────────────────────────────────

function validateResourcePattern(
  pattern: TaxonomyResourcePattern,
  index: number,
  seenNames: Set<string>,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  const prefix = `resourcePatterns[${index}]`;

  if (!pattern.name || !RESOURCE_NAME_PATTERN.test(pattern.name)) {
    errors.push({
      path: `${prefix}.name`,
      message: `Invalid resource pattern name "${pattern.name}". Must be lowercase with hyphens.`,
      code: "INVALID_RESOURCE_NAME",
    });
  }

  if (seenNames.has(pattern.name)) {
    errors.push({
      path: `${prefix}.name`,
      message: `Duplicate resource pattern name: "${pattern.name}"`,
      code: "DUPLICATE_RESOURCE_NAME",
    });
  }
  seenNames.add(pattern.name);

  if (!pattern.pattern || pattern.pattern.length === 0) {
    errors.push({
      path: `${prefix}.pattern`,
      message: "Resource pattern URI template must not be empty",
      code: "EMPTY_PATTERN",
    });
  }

  // Check that all {param} placeholders have corresponding parameter definitions
  const placeholders = extractUriTemplatePlaceholders(pattern.pattern);
  const paramNames = new Set(pattern.parameters.map((p) => p.name));
  for (const placeholder of placeholders) {
    if (!paramNames.has(placeholder)) {
      errors.push({
        path: `${prefix}.pattern`,
        message: `Placeholder "{${placeholder}}" has no matching parameter definition`,
        code: "UNMATCHED_PLACEHOLDER",
      });
    }
  }

  // Check that all required parameters appear in the pattern
  for (const param of pattern.parameters) {
    if (param.required && !placeholders.includes(param.name)) {
      warnings.push({
        path: `${prefix}.parameters[${param.name}]`,
        message: `Required parameter "${param.name}" does not appear in the URI template`,
        code: "UNUSED_PARAMETER",
      });
    }
  }
}

// ── Constraint Templates ─────────────────────────────────────

function validateConstraintTemplate(
  constraint: TaxonomyConstraintTemplate,
  index: number,
  taxonomyId: string,
  seenIds: Set<string>,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  const prefix = `constraintTemplates[${index}]`;

  if (!constraint.id || !CONSTRAINT_ID_PATTERN.test(constraint.id)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Invalid constraint ID "${constraint.id}"`,
      code: "INVALID_CONSTRAINT_ID",
    });
  }

  if (constraint.id && !constraint.id.startsWith(`${taxonomyId}.`)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Constraint ID "${constraint.id}" must be prefixed with taxonomy ID "${taxonomyId}."`,
      code: "WRONG_CONSTRAINT_PREFIX",
    });
  }

  if (seenIds.has(constraint.id)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Duplicate constraint ID: "${constraint.id}"`,
      code: "DUPLICATE_CONSTRAINT_ID",
    });
  }
  seenIds.add(constraint.id);

  if (!["TIME", "TRANSACTION", "ESCALATION", "RATE_LIMIT", "RESOURCE_ACCESS", "DATA_POLICY", "GEOSPATIAL"].includes(constraint.type)) {
    errors.push({
      path: `${prefix}.type`,
      message: `Invalid constraint type: "${constraint.type}"`,
      code: "INVALID_CONSTRAINT_TYPE",
    });
  }

  if (!constraint.schema || Object.keys(constraint.schema).length === 0) {
    warnings.push({
      path: `${prefix}.schema`,
      message: "Constraint template should define a schema",
      code: "EMPTY_SCHEMA",
    });
  }
}

// ── Mandate Templates ────────────────────────────────────────

function validateMandateTemplate(
  template: TaxonomyMandateTemplate,
  index: number,
  taxonomyId: string,
  validActionIds: Set<string>,
  validResourceNames: Set<string>,
  seenIds: Set<string>,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  const prefix = `mandateTemplates[${index}]`;

  if (!template.id || !TEMPLATE_ID_PATTERN.test(template.id)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Invalid template ID "${template.id}"`,
      code: "INVALID_TEMPLATE_ID",
    });
  }

  if (template.id && !template.id.startsWith(`${taxonomyId}.`)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Template ID "${template.id}" must be prefixed with taxonomy ID "${taxonomyId}."`,
      code: "WRONG_TEMPLATE_PREFIX",
    });
  }

  if (seenIds.has(template.id)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Duplicate template ID: "${template.id}"`,
      code: "DUPLICATE_TEMPLATE_ID",
    });
  }
  seenIds.add(template.id);

  if (template.vertical !== taxonomyId) {
    warnings.push({
      path: `${prefix}.vertical`,
      message: `Template vertical "${template.vertical}" does not match taxonomy ID "${taxonomyId}"`,
      code: "MISMATCHED_VERTICAL",
    });
  }

  // Validate scope actions reference existing actions
  for (const actionId of template.scope.actions) {
    if (!validActionIds.has(actionId)) {
      errors.push({
        path: `${prefix}.scope.actions[${actionId}]`,
        message: `Template references unknown action: "${actionId}"`,
        code: "UNKNOWN_TEMPLATE_ACTION",
      });
    }
  }

  // Validate scope resource patterns reference existing patterns
  for (const patternName of template.scope.resourcePatterns) {
    if (!validResourceNames.has(patternName)) {
      errors.push({
        path: `${prefix}.scope.resourcePatterns[${patternName}]`,
        message: `Template references unknown resource pattern: "${patternName}"`,
        code: "UNKNOWN_TEMPLATE_RESOURCE",
      });
    }
  }

  if (!["ALLOW", "DENY"].includes(template.scope.effect)) {
    errors.push({
      path: `${prefix}.scope.effect`,
      message: `Invalid effect: "${template.scope.effect}"`,
      code: "INVALID_EFFECT",
    });
  }

  if (!["AGENT", "NATURAL_PERSON", "LEGAL_ENTITY", "ANY"].includes(template.delegateType)) {
    errors.push({
      path: `${prefix}.delegateType`,
      message: `Invalid delegate type: "${template.delegateType}"`,
      code: "INVALID_DELEGATE_TYPE",
    });
  }

  // Check time constraint format
  if (template.constraints.time?.defaultDuration) {
    const dur = template.constraints.time.defaultDuration;
    // ISO 8601 duration: require at least one element after P (and at least one
    // after T if T is present). Bare "P", "PT", trailing "T" are rejected.
    const ISO_8601_DURATION =
      /^P(?=\d|T\d)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/;
    const match = ISO_8601_DURATION.exec(dur);
    if (!match) {
      errors.push({
        path: `${prefix}.constraints.time.defaultDuration`,
        message: `Invalid ISO 8601 duration: "${dur}"`,
        code: "INVALID_DURATION",
      });
    } else {
      // Reject all-zero durations like P0D or PT0S — at least one component
      // must be > 0 for the duration to be meaningful.
      const components = [
        match[1], // years
        match[2], // months
        match[3], // weeks
        match[4], // days
        match[6], // hours
        match[7], // minutes
        match[8], // seconds
      ];
      const hasNonZero = components.some((part) => {
        if (!part) return false;
        const value = parseInt(part, 10);
        return Number.isFinite(value) && value > 0;
      });
      if (!hasNonZero) {
        errors.push({
          path: `${prefix}.constraints.time.defaultDuration`,
          message: `Invalid ISO 8601 duration: "${dur}" (must have at least one non-zero component)`,
          code: "INVALID_DURATION",
        });
      }
    }
  }
}

/**
 * Validate a scope object against a taxonomy's actions and resource patterns.
 */
export function validateScope(
  taxonomy: IndustryTaxonomy,
  scope: { actions?: string[]; resources?: string[]; effect?: string },
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const validActionIds = new Set(taxonomy.actions.map((a) => a.id));

  if (scope.effect && !["ALLOW", "DENY"].includes(scope.effect)) {
    errors.push({
      path: "scope.effect",
      message: `Invalid effect: "${scope.effect}". Must be ALLOW or DENY.`,
      code: "INVALID_EFFECT",
    });
  }

  for (const action of scope.actions || []) {
    if (!validActionIds.has(action)) {
      const isWildcard = action.endsWith(".*");
      if (isWildcard) {
        const prefix = action.slice(0, -2);
        const hasMatch = taxonomy.actions.some((a) => a.id.startsWith(prefix));
        if (!hasMatch) {
          errors.push({
            path: `scope.actions[${action}]`,
            message: `No actions match wildcard pattern: ${action}`,
            code: "NO_WILDCARD_MATCH",
          });
        }
      } else {
        errors.push({
          path: `scope.actions[${action}]`,
          message: `Unknown action: ${action}`,
          code: "UNKNOWN_ACTION",
        });
      }
    }
  }

  for (const resource of scope.resources || []) {
    const matchesAny = taxonomy.resourcePatterns.some((pattern) =>
      matchResourcePattern(pattern.pattern, resource),
    );
    if (!matchesAny) {
      errors.push({
        path: `scope.resources[${resource}]`,
        message: `Resource does not match any registered pattern: ${resource}`,
        code: "INVALID_RESOURCE",
      });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

type ResourcePatternToken =
  | { type: "literal"; value: string }
  | { type: "param" }
  // Single "*" — matches within ONE path segment. It may span the ":" key/value
  // separator (e.g. "doc:d1") but never the "/" level separator, so a trailing
  // "/*" authorizes exactly one additional hierarchy level, not the whole subtree.
  | { type: "star" }
  // Explicit recursive wildcard "**" — matches zero or more characters across
  // any separator, including "/". This is the only way to authorize a whole
  // subtree, and it must be written out deliberately by a taxonomy author.
  | { type: "globstar" };

const SEGMENT_SEPARATOR = "/";

function tokenizeResourcePattern(pattern: string): ResourcePatternToken[] {
  const tokens: ResourcePatternToken[] = [];
  let literalBuffer = "";

  const flushLiteral = (): void => {
    if (literalBuffer) {
      tokens.push({ type: "literal", value: literalBuffer });
      literalBuffer = "";
    }
  };

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];

    if (char === "*") {
      flushLiteral();

      // Collapse a run of "*" into a single token. A run of length >= 2 is the
      // recursive "globstar" (crosses "/"); a single "*" stays segment-scoped.
      let runLength = 1;
      while (pattern[index + 1] === "*") {
        runLength += 1;
        index += 1;
      }

      const type = runLength >= 2 ? "globstar" : "star";
      // Avoid stacking equivalent wildcard tokens (e.g. "*/*" keeps both because a
      // literal "/" sits between them, but "***" collapses to one globstar).
      if (tokens[tokens.length - 1]?.type !== type) {
        tokens.push({ type });
      }
      continue;
    }

    if (char === "{") {
      const closingBraceIndex = pattern.indexOf("}", index + 1);
      if (closingBraceIndex !== -1) {
        flushLiteral();
        tokens.push({ type: "param" });
        index = closingBraceIndex;
        continue;
      }
    }

    literalBuffer += char;
  }

  flushLiteral();

  return tokens;
}

/**
 * Match a resource URI against a pattern template.
 *
 * Wildcard semantics (security-relevant — see {@link validateScope}):
 *   - "{param}" matches a single value within a segment. It does not cross the
 *     ":" or "/" separators, and an empty value is allowed.
 *   - "*" matches within a single hierarchy level: any run of characters that
 *     does not contain "/". It therefore authorizes exactly one trailing
 *     segment (e.g. "ops:{op}/*" matches "ops:o1/target:t1" but NOT
 *     "ops:o1/mission:m1/target:t1").
 *   - "**" is the explicit recursive wildcard: it matches across "/" and
 *     authorizes a whole subtree. Use it deliberately when broad access is
 *     intended.
 */
export function matchResourcePattern(pattern: string, resource: string): boolean {
  const tokens = tokenizeResourcePattern(pattern);
  const memo = new Map<number, boolean>();

  const matches = (tokenIndex: number, resourceIndex: number): boolean => {
    const memoKey = tokenIndex * (resource.length + 1) + resourceIndex;
    const memoized = memo.get(memoKey);
    if (memoized !== undefined) {
      return memoized;
    }

    if (tokenIndex === tokens.length) {
      const isMatch = resourceIndex === resource.length;
      memo.set(memoKey, isMatch);
      return isMatch;
    }

    const token = tokens[tokenIndex];

    if (token.type === "literal") {
      const isMatch = resource.startsWith(token.value, resourceIndex)
        ? matches(tokenIndex + 1, resourceIndex + token.value.length)
        : false;
      memo.set(memoKey, isMatch);
      return isMatch;
    }

    if (token.type === "param") {
      // A param fills one value: it may consume zero or more characters up to
      // (but not across) the next ":" or "/" separator. Zero-length is allowed
      // so an empty value still matches.
      let isMatch = false;
      let nextIndex = resourceIndex;
      // Try the shortest (possibly empty) value first, then extend.
      for (;;) {
        if (matches(tokenIndex + 1, nextIndex)) {
          isMatch = true;
          break;
        }
        if (
          nextIndex >= resource.length ||
          resource[nextIndex] === ":" ||
          resource[nextIndex] === SEGMENT_SEPARATOR
        ) {
          break;
        }
        nextIndex += 1;
      }

      memo.set(memoKey, isMatch);
      return isMatch;
    }

    if (token.type === "star") {
      // Segment-scoped wildcard: consume zero or more characters but never the
      // "/" level separator. This is what keeps a trailing "/*" from escaping
      // the intended hierarchy level.
      let isMatch = false;
      let nextIndex = resourceIndex;
      for (;;) {
        if (matches(tokenIndex + 1, nextIndex)) {
          isMatch = true;
          break;
        }
        if (nextIndex >= resource.length || resource[nextIndex] === SEGMENT_SEPARATOR) {
          break;
        }
        nextIndex += 1;
      }

      memo.set(memoKey, isMatch);
      return isMatch;
    }

    // globstar ("**"): recursive wildcard — may cross any separator, including "/".
    let isMatch = false;
    for (let nextIndex = resourceIndex; nextIndex <= resource.length; nextIndex += 1) {
      if (matches(tokenIndex + 1, nextIndex)) {
        isMatch = true;
        break;
      }
    }

    memo.set(memoKey, isMatch);
    return isMatch;
  };

  return matches(0, 0);
}
