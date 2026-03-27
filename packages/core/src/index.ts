// @mandaitor/taxonomy-core — Public API

export type {
  TaxonomyAction,
  TaxonomyResourcePattern,
  ResourceParameter,
  TaxonomyConstraintTemplate,
  TaxonomyMandateTemplate,
  TaxonomyMetadata,
  IndustryTaxonomy,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "./types.js";

export {
  validateTaxonomy,
  validateScope,
  matchResourcePattern,
} from "./validator.js";

export {
  taxonomyRegistry,
  registerTaxonomy,
  getTaxonomy,
  listTaxonomies,
  lookupAction,
  lookupTemplate,
  searchActions,
} from "./registry.js";

export type { RiskLevel, RiskLocale, RiskLabelInfo } from "./risk-labels.js";

export type { TaxonomyManifest, TaxonomyManifestEntry } from "./manifest.js";

export {
  riskLabel,
  riskLabelInfo,
  allRiskLabels,
  supportedLocales,
} from "./risk-labels.js";
