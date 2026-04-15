## Summary

<!-- Describe what this pull request changes and why it should exist. -->

## Contribution Type

- [ ] New taxonomy
- [ ] New entry in an existing taxonomy
- [ ] Refinement or clarification of an existing entry
- [ ] Alias or relationship update
- [ ] Deprecation or replacement
- [ ] Documentation only

## Scope and Intent

<!-- Explain the business scope, the user problem, and the operational surface covered. -->

## Taxonomy Metrics

| Metric | Count |
|---|---|
| Actions added or changed | |
| Resource patterns added or changed | |
| Constraint templates added or changed | |
| Mandate templates added or changed | |
| Metadata-only entries added or changed | |

## Governance Metadata

| Field | Value |
|---|---|
| Taxonomy ID | |
| Entry IDs affected | |
| Intended maturity (`draft`, `candidate`, `stable`, `deprecated`) | |
| Risk class (`low`, `medium`, `high`, `critical`) | |
| Jurisdictional scope | |
| Relevant industry standards or regulations | |
| Proposed successor if deprecating | |

## Design Notes

<!-- Explain naming choices, why this does not duplicate an existing concept, and any trade-offs reviewers should focus on. -->

## Validation Checklist

- [ ] Taxonomy ID follows repository naming conventions
- [ ] New or changed IDs are stable and semantically precise
- [ ] Labels and descriptions are human-readable and non-ambiguous
- [ ] Overlap with existing taxonomy concepts has been reviewed
- [ ] Risk classification is justified
- [ ] High-impact actions or templates document human approval expectations
- [ ] Resource pattern placeholders have matching parameter definitions
- [ ] Mandate templates reference existing actions and resource patterns
- [ ] New metadata fields are documented in `docs/taxonomy-schema.md` when relevant
- [ ] Local checks pass: `pnpm build`
- [ ] Local checks pass: `pnpm test`
- [ ] Local checks pass: `pnpm validate`

## Maintainer Review Focus

<!-- Call out any area where you want special feedback, such as naming, hierarchy, scope boundaries, or migration concerns. -->

## Breaking Changes and Migration Notes

<!-- If updating an existing taxonomy, describe any breaking changes, deprecations, or migration guidance. If none, write `None`. -->

None
