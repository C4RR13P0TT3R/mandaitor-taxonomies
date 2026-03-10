# Contributing to Mandaitor Taxonomies

Thank you for your interest in contributing an industry taxonomy to Mandaitor. This guide walks you through the process from start to finish.

## Before You Start

Please check the [existing taxonomies](./README.md#available-taxonomies) and [open issues](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/issues) to see if someone is already working on the vertical you have in mind. If not, consider opening an issue first to discuss the scope and design.

## Step-by-Step Guide

### 1. Fork and Clone

```bash
gh repo fork C4RR13P0TT3R/mandaitor-taxonomies --clone
cd mandaitor-taxonomies
pnpm install
```

### 2. Scaffold Your Taxonomy

```bash
pnpm new-taxonomy <taxonomy-id> "<Taxonomy Name>"
```

The taxonomy ID must be lowercase alphanumeric with hyphens (e.g., `healthcare`, `financial-services`, `logistics`). This ID becomes the NPM package name suffix: `@mandaitor/taxonomy-{id}`.

### 3. Define Actions

Open `taxonomies/{id}/src/actions.ts` and define the operations that AI agents can be delegated in your vertical. Each action needs:

- A unique ID following the pattern `{taxonomy}.{category}.{operation}`
- A human-readable label and description
- A risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- A `requiresHumanApproval` flag (should be `true` for `HIGH` and `CRITICAL`)
- Tags for discoverability

Think about the full lifecycle of your industry. Group actions by category (e.g., `healthcare.prescription.*`, `healthcare.diagnosis.*`).

### 4. Define Resource Patterns

Open `taxonomies/{id}/src/resources.ts` and define URI templates that scope where actions apply. Resource patterns use `{param}` placeholders and `*` wildcards.

Design your resource hierarchy to support both fine-grained and broad access patterns. For example:

```
healthcare:patient:{patientId}/record:{recordId}   # Specific record
healthcare:patient:{patientId}/*                     # All patient data
healthcare:facility:{facilityId}/*                   # Facility-wide
```

### 5. Define Constraint Templates

Open `taxonomies/{id}/src/constraints.ts` and define reusable boundary conditions. Constraint types are:

| Type | Purpose | Example |
|---|---|---|
| `TIME` | Temporal bounds | Mandate valid for 90 days |
| `TRANSACTION` | Financial/quantity limits | Max EUR 5,000 per invoice |
| `ESCALATION` | When to involve humans | Escalate if deviation > 10% |
| `RATE_LIMIT` | Throughput limits | Max 100 operations per hour |

### 6. Define Mandate Templates

Open `taxonomies/{id}/src/templates.ts` and create pre-built delegation blueprints. Templates combine actions, resource patterns, and constraints into ready-to-use configurations. They should represent common real-world delegation scenarios.

### 7. Update Metadata

Open `taxonomies/{id}/src/index.ts` and update the metadata object with accurate information about your taxonomy, including maintainers, description, and relevant tags.

### 8. Test

```bash
pnpm build
pnpm test
pnpm validate
```

All tests must pass and the validator must report no errors before submitting.

### 9. Submit a Pull Request

Push your branch and open a PR against `main`. The PR description should include:

- The industry vertical and its scope
- Number of actions, resource patterns, and templates
- Any relevant industry standards or regulations the taxonomy is based on
- Whether you intend to maintain this taxonomy long-term

## Design Principles

When designing a taxonomy, keep these principles in mind:

**Principle of Least Privilege**: Default to restrictive permissions. It is easier to grant more access than to revoke it. Start with `HIGH` risk levels and relax them only when justified.

**Granularity over Breadth**: Prefer many specific actions over few broad ones. `healthcare.prescription.approve` is better than `healthcare.manage_prescriptions`. Fine-grained actions enable precise delegation.

**Real-World Mapping**: Actions should map to real operations in your industry. If a human would need a specific permission to perform an operation, there should be a corresponding action.

**Safety by Default**: CRITICAL actions must require human approval. HIGH actions should require it. Include escalation rules in templates that involve high-risk actions.

**Interoperability**: Use standard identifiers where possible (ISO codes, industry-standard URIs). Document any external standards your taxonomy references.

## Code Style

- TypeScript with strict mode
- Descriptive variable names (no abbreviations)
- Comments explaining the "why", not the "what"
- All exports must have JSDoc descriptions

## Questions?

Open an issue or reach out to the maintainers. We are happy to help you design your taxonomy.
