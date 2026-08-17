// @mandaitor/taxonomy-core — Base types for all industry taxonomies
//
// These types define the contract that every community taxonomy must implement.
// They are intentionally kept compatible with @mandaitor/taxonomy-core from the
// main mandaitor repository, but published independently so that taxonomy
// contributors do not need access to the full infrastructure monorepo.

import type { SemanticGraph } from "./semantic-types.js";

/**
 * An Action defines a specific operation that can be delegated.
 * Actions follow a hierarchical naming convention: {domain}.{category}.{operation}
 */
export interface TaxonomyAction {
  /** Unique action identifier, e.g. "construction.validation.approve" */
  id: string;
  /** Human-readable label (supports i18n keys) */
  label: string;
  /** Detailed description of what this action authorizes */
  description: string;
  /** Risk level determines default approval requirements */
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  /** Whether this action requires human-in-the-loop confirmation */
  requiresHumanApproval: boolean;
  /** Parent action ID for hierarchical grouping */
  parentAction?: string;
  /** Tags for filtering and categorization */
  tags: string[];
}

/**
 * A Resource Pattern defines the URI structure for resources
 * that actions can operate on.
 */
export interface TaxonomyResourcePattern {
  /** Pattern name, e.g. "project-zone-trade" */
  name: string;
  /** URI template with placeholders: "construction:project:{projectId}/zone:{zoneId}/*" */
  pattern: string;
  /** Description of what this resource represents */
  description: string;
  /** Parameter definitions for the URI template */
  parameters: ResourceParameter[];
}

export interface ResourceParameter {
  name: string;
  type: "string" | "enum" | "uuid";
  description: string;
  enumValues?: string[];
  required: boolean;
}

/**
 * A Constraint Template defines reusable constraint configurations.
 */
export interface TaxonomyConstraintTemplate {
  /** Unique constraint ID, e.g. "construction.time.project-duration" */
  id: string;
  /** Template name, e.g. "time-limited" */
  name: string;
  description: string;
  /** Type of constraint */
  type: "TIME" | "TRANSACTION" | "ESCALATION" | "RATE_LIMIT" | "RESOURCE_ACCESS" | "DATA_POLICY" | "GEOSPATIAL";
  /** The constraint schema (JSON Schema subset) */
  schema: Record<string, unknown>;
  /** Default values for this constraint */
  defaults: Record<string, unknown>;
}

/**
 * A Mandate Template is a pre-built delegation pattern
 * combining actions, resources, and constraints for common use cases.
 */
export interface TaxonomyMandateTemplate {
  /** Template ID, e.g. "construction.automated-validation" */
  id: string;
  /** Human-readable name */
  name: string;
  description: string;
  /** The industry vertical this template belongs to */
  vertical: string;
  /** Pre-configured scope */
  scope: {
    actions: string[];
    resourcePatterns: string[];
    effect: "ALLOW" | "DENY";
    conditions?: Record<string, unknown>;
  };
  /** Pre-configured constraints with sensible defaults */
  constraints: {
    time?: { defaultDuration: string };
    transactionLimits?: Record<string, unknown>;
    escalationRules?: Record<string, unknown>;
    rateLimits?: Record<string, unknown>;
    geoRestrictions?: Record<string, unknown>;
    orbitalAssetAccess?: Record<string, unknown>;
  };
  /** Required delegate type */
  delegateType: "AGENT" | "NATURAL_PERSON" | "LEGAL_ENTITY" | "ANY";
}

/**
 * Taxonomy metadata — describes the taxonomy package itself.
 */
export interface TaxonomyMetadata {
  /** Taxonomy identifier, e.g. "construction" */
  id: string;
  /** Semantic version */
  version: string;
  /** Human-readable name */
  name: string;
  /** Description of the industry vertical */
  description: string;
  /** Maintainer(s) */
  maintainers: Array<{ name: string; email?: string; url?: string }>;
  /** License identifier (SPDX) */
  license: string;
  /** Minimum @mandaitor/taxonomy-core version required */
  coreVersion: string;
  /** Tags for discoverability */
  tags: string[];
  /** Optional link to documentation */
  documentationUrl?: string;
  /** Optional link to the industry standard this taxonomy is based on */
  standardUrl?: string;
}

/**
 * The main interface every industry taxonomy must implement.
 */
export interface IndustryTaxonomy {
  /** Taxonomy metadata */
  metadata: TaxonomyMetadata;
  /** All registered actions */
  actions: TaxonomyAction[];
  /** All resource patterns */
  resourcePatterns: TaxonomyResourcePattern[];
  /** All constraint templates */
  constraintTemplates: TaxonomyConstraintTemplate[];
  /** All mandate templates */
  mandateTemplates: TaxonomyMandateTemplate[];
  /**
   * @experimental Semantic graph defining relationships between actions.
   * When present, it is structurally validated by {@link validateTaxonomy}
   * and enables Drift Detection and Semantic Verification features.
   */
  semanticGraph?: SemanticGraph;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}
