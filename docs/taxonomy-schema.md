# Taxonomy Contribution Schema Guide

This guide describes the metadata that contributors should provide when proposing a new taxonomy, a new taxonomy entry, or a substantial refinement. The goal is to keep the taxonomy layer **precise, stable, and governable** as community participation grows.

## Why This Schema Exists

A taxonomy contribution should do more than add another label. It should make the semantic model clearer, easier to review, and safer to evolve over time. For that reason, every contribution should explain not only **what** is being added, but also **how it relates** to the existing ontology and **why it belongs** there.

| Schema area | Purpose |
|---|---|
| Identity | Keeps entries unique and stable across releases |
| Semantics | Explains what the entry means and how it differs from neighbors |
| Governance | Shows review status, deprecation state, and ownership intent |
| Scope | Clarifies where the entry applies and where it does not |
| Safety | Captures risk and escalation expectations where relevant |

## Core Entry Fields

These fields should be supplied whenever a contribution introduces a new taxonomy concept or materially changes an existing one.

| Field | Required | Description | Example |
|---|---|---|---|
| `id` | Yes | Stable, machine-readable identifier | `construction.validation.approve` |
| `label` | Yes | Short human-readable display name | `Approve Validation Result` |
| `description` | Yes | One-sentence business meaning | `Approves a completed plan validation result for release to the next workflow stage.` |
| `entry_type` | Yes | Type of concept being proposed | `action`, `resource_pattern`, `constraint_template`, `mandate_template`, `term`, `relationship` |
| `taxonomy_id` | Yes | Top-level taxonomy package the entry belongs to | `construction` |
| `parent_id` | Recommended | Parent concept if the entry belongs to a hierarchy | `construction.validation` |
| `status` | Yes | Governance state of the entry | `draft`, `candidate`, `stable`, `deprecated` |
| `change_type` | Yes | Nature of the contribution | `new_entry`, `refinement`, `alias`, `relationship`, `deprecation` |

## Semantic Precision Fields

These fields help reviewers determine whether the proposal is well-scoped and semantically distinct.

| Field | Required | Description | Example |
|---|---|---|---|
| `synonyms` | Recommended | Alternative terms people may search for | `["sign off", "approve result"]` |
| `aliases` | Recommended | Historical or compatibility labels | `["construction.validation.signoff"]` |
| `examples` | Recommended | Realistic examples that clarify intended use | `["Approve structural review after engineer sign-off"]` |
| `non_examples` | Optional | Similar-looking cases the entry should not cover | `["Rejecting a validation result"]` |
| `notes` | Optional | Additional editorial guidance for maintainers | `Use only when the result has already been computed.` |
| `related_ids` | Recommended | Neighboring concepts that should be considered together | `["construction.validation.reject", "construction.validation.request-change"]` |

## Scope and Context Fields

These fields keep taxonomy growth aligned with real operating contexts rather than abstract labels.

| Field | Required | Description | Example |
|---|---|---|---|
| `jurisdictional_scope` | Recommended | Jurisdictions or regulatory contexts that matter | `["EU", "DE"]` |
| `industry_standard_refs` | Optional | External standards or regulations informing the entry | `["DIN 276", "ISO 19650"]` |
| `applicable_roles` | Optional | Roles that commonly use or approve this concept | `["site-manager", "structural-engineer"]` |
| `resource_scope` | Recommended for resources and templates | The resource boundary the entry expects | `project`, `facility`, `patient-record`, `invoice` |
| `lifecycle_stage` | Optional | Process phase in which the entry typically appears | `review`, `approval`, `handover` |

## Safety and Governance Fields

For any entry that affects delegation semantics, these governance fields make review more transparent.

| Field | Required | Description | Example |
|---|---|---|---|
| `risk_class` | Recommended | Business or safety impact classification | `low`, `medium`, `high`, `critical` |
| `requires_human_approval` | Recommended for actions and templates | Whether human approval is expected by default | `true` |
| `escalation_rule` | Optional | Conditions under which the workflow must escalate | `Escalate if deviation exceeds 10 percent.` |
| `proposed_by` | Recommended | Contributor or organization proposing the change | `@contributor-handle` |
| `review_notes` | Optional | Maintainer feedback or review summary | `Merged with scope narrowed to structural review only.` |
| `deprecated_by` | Required when deprecated | Successor entry replacing the old one | `construction.validation.approve-result` |
| `deprecation_reason` | Required when deprecated | Why the old entry is being retired | `Ambiguous label; replaced by more specific approval action.` |

## Maturity Model

Every contribution should identify its maturity so users can distinguish exploratory ideas from well-curated terms.

| Status | Meaning | Typical maintainer expectation |
|---|---|---|
| `draft` | Early proposal, still under discussion | Not ready for broad downstream adoption |
| `candidate` | Well-formed and reviewable | Good candidate for merge after review |
| `stable` | Reviewed and accepted as canonical | Safe to build against downstream |
| `deprecated` | Retained for compatibility only | Should not be used for new designs |

## Contribution Types

A pull request should make explicit what kind of taxonomy change it contains.

| `change_type` | Use when | Maintainer focus |
|---|---|---|
| `new_entry` | A genuinely new concept is being introduced | Overlap and naming quality |
| `refinement` | An existing entry becomes clearer or more precise | Backward compatibility |
| `alias` | A second discoverability term points to an existing concept | Searchability without semantic duplication |
| `relationship` | A dependency, parent-child link, or mapping is added | Structural consistency |
| `deprecation` | An existing entry should be retired or replaced | Migration clarity |

## Example YAML

```yaml
id: construction.validation.approve
label: Approve Validation Result
description: Approves a completed plan validation result for release to the next workflow stage.
entry_type: action
taxonomy_id: construction
parent_id: construction.validation
status: candidate
change_type: new_entry
synonyms:
  - sign off validation
  - approve result
aliases:
  - construction.validation.signoff
examples:
  - Approve a structural validation after the automated checks and human review are complete.
non_examples:
  - Reject a validation result that failed review.
related_ids:
  - construction.validation.reject
  - construction.validation.request-change
jurisdictional_scope:
  - EU
  - DE
industry_standard_refs:
  - ISO 19650
resource_scope: project
lifecycle_stage: approval
risk_class: high
requires_human_approval: true
escalation_rule: Escalate if the validation contains unresolved structural findings.
proposed_by: "@example-contributor"
```

## Review Guidance for Contributors

If a field is not yet enforced mechanically, contributors should still provide it whenever it improves clarity. The maintainer may accept a pragmatic contribution with a subset of fields, but contributions that explain scope, maturity, related concepts, and governance intent are much easier to review and much less likely to create ontology drift.

## Relationship to Runtime Packages

Not every field in this guide has to be represented as a first-class runtime property today. Some fields are primarily **curation metadata** that support review, governance, and future downstream tooling. Contributors should therefore treat this document as the target level of semantic documentation, even where the runtime package currently models only a subset.
