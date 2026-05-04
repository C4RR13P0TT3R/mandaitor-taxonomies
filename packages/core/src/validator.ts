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

  if (!action.id || !ACTION_ID_PATTERN.test(action.id)) {
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

  if (seenIds.has(action.id)) {
    errors.push({
      path: `${prefix}.id`,
      message: `Duplicate action ID: "${action.id}"`,
      code: "DUPLICATE_ACTION_ID",
    });
  }
  seenIds.add(action.id);

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

  if (action.parentAction && !seenIds.has(action.parentAction)) {
    // Parent might be defined later, so this is a warning
    warnings.push({
      path: `${prefix}.parentAction`,
      message: `Parent action "${action.parentAction}" not found (may be defined later)`,
      code: "UNKNOWN_PARENT",
    });
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
    if (!/^P(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.test(dur)) {
      errors.push({
        path: `${prefix}.constraints.time.defaultDuration`,
        message: `Invalid ISO 8601 duration: "${dur}"`,
        code: "INVALID_DURATION",
      });
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
  | { type: "star" };

function tokenizeResourcePattern(pattern: string): ResourcePatternToken[] {
  const tokens: ResourcePatternToken[] = [];
  let literalBuffer = "";

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];

    if (char === "*") {
      if (literalBuffer) {
        tokens.push({ type: "literal", value: literalBuffer });
        literalBuffer = "";
      }

      if (tokens[tokens.length - 1]?.type !== "star") {
        tokens.push({ type: "star" });
      }
      continue;
    }

    if (char === "{") {
      const closingBraceIndex = pattern.indexOf("}", index + 1);
      if (closingBraceIndex !== -1) {
        if (literalBuffer) {
          tokens.push({ type: "literal", value: literalBuffer });
          literalBuffer = "";
        }

        tokens.push({ type: "param" });
        index = closingBraceIndex;
        continue;
      }
    }

    literalBuffer += char;
  }

  if (literalBuffer) {
    tokens.push({ type: "literal", value: literalBuffer });
  }

  return tokens;
}

/**
 * Match a resource URI against a pattern template.
 */
export function matchResourcePattern(pattern: string, resource: string): boolean {
  const tokens = tokenizeResourcePattern(pattern);
  const memo = new Map<string, boolean>();

  const matches = (tokenIndex: number, resourceIndex: number): boolean => {
    const memoKey = `${tokenIndex}:${resourceIndex}`;
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
      let nextIndex = resourceIndex;
      let isMatch = false;

      while (
        nextIndex < resource.length &&
        resource[nextIndex] !== ":" &&
        resource[nextIndex] !== "/"
      ) {
        nextIndex += 1;
        if (matches(tokenIndex + 1, nextIndex)) {
          isMatch = true;
          break;
        }
      }

      memo.set(memoKey, isMatch);
      return isMatch;
    }

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
