# Contributing to Mandaitor Taxonomies

Thank you for helping expand the Mandaitor taxonomy ecosystem. This repository is the **public contribution layer** for industry taxonomies, but it is curated so that external contributions improve coverage without creating semantic drift or unsafe delegation patterns.

## Before You Start

Please check the [existing taxonomies](./README.md#available-taxonomies) and the [open issues](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/issues) before starting. If your idea introduces a new vertical, a major restructuring, or a new naming pattern, open a proposal issue first so the scope can be aligned before implementation.

| Good candidate for a proposal issue | Good candidate for a direct pull request |
|---|---|
| New industry vertical | Small refinement to an existing taxonomy |
| New naming convention | Additional examples or metadata improvement |
| Breaking structural change | Well-scoped new action or template |
| Unclear scope or overlap | Straightforward documentation update |

## Step-by-Step Contribution Flow

### 1. Fork, Clone, and Install

```bash
gh repo fork C4RR13P0TT3R/mandaitor-taxonomies --clone
cd mandaitor-taxonomies
pnpm install
```

Work on a dedicated branch so your contribution remains easy to review and update.

### 2. Scaffold or Edit the Taxonomy

To create a new taxonomy package, run:

```bash
pnpm new-taxonomy <taxonomy-id> "<Taxonomy Name>"
```

The taxonomy ID must be **lowercase**, stable, and publication-safe. Good examples are `healthcare`, `financial-services`, and `logistics`. The ID becomes the package suffix `@mandaitor/taxonomy-{id}` and should not be renamed casually after publication.

If you are refining an existing taxonomy, edit the relevant files under `taxonomies/{id}/src/` instead of scaffolding a new package.

### 3. Define the Domain Model

A complete taxonomy contribution should cover the operational surface of the vertical in a structured way.

| File | What it defines | What reviewers look for |
|---|---|---|
| `actions.ts` | Delegable operations | Clear naming, proper risk classification, least privilege |
| `resources.ts` | URI patterns that scope actions | Stable hierarchy, good placeholder design, no ambiguity |
| `constraints.ts` | Reusable guardrails | Real-world limits, escalation points, auditability |
| `templates.ts` | Pre-built mandate blueprints | Coherent combinations of actions, resources, and constraints |
| `index.ts` | Taxonomy metadata | Accurate description, maintainers, tags, and versioning intent |

### 4. Follow the Metadata and Naming Rules

The repository expects strong naming consistency so that contributors can add coverage without fragmenting the ontology.

| Field or element | Requirement | Example |
|---|---|---|
| Taxonomy ID | Lowercase, stable, hyphen-safe | `financial-services` |
| Action ID | `{taxonomy}.{category}.{operation}` | `healthcare.prescription.approve` |
| Constraint ID | `{taxonomy}.{type}.{name}` | `construction.limits.max-plan-value` |
| Template ID | `{taxonomy}.{name}` | `logistics.dispatch-optimization` |
| Labels | Human-readable and concise | `Approve Prescription` |
| Descriptions | Explain business meaning, not just technical effect | `Approves a prescription after clinical review` |
| Risk level | `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` | `HIGH` |
| Human approval | Required for high-impact operations | `requiresHumanApproval: true` |

If your contribution introduces new descriptive metadata, document it in [`docs/taxonomy-schema.md`](./docs/taxonomy-schema.md) within the same pull request.

### 5. Validate Locally

Run the full local validation path before opening a PR:

```bash
pnpm build
pnpm test
pnpm validate
```

These checks verify structural correctness, reference integrity, and policy expectations. A pull request that fails the validation pipeline is not ready for maintainer review.

### 6. Open Your Pull Request

Submit the PR against `main` and complete the repository template in full. The PR should clearly explain the scope, risk posture, standards used, and any design trade-offs.

At minimum, include:

- The vertical or subdomain covered
- Whether the change is a new taxonomy or a refinement of an existing one
- The intended use cases
- The key actions, resources, constraints, and templates added or changed
- Any legal, regulatory, or industry standards you relied on
- Any open questions you want reviewed explicitly

## Design Principles

The goal is not to maximize the number of entries. The goal is to make the taxonomy layer **more precise, more reusable, and more governable**.

| Principle | What it means in practice |
|---|---|
| **Least privilege** | Prefer narrow actions and resource scopes over broad omnibus permissions |
| **Semantic stability** | Use names that will still make sense after multiple releases |
| **Granularity over breadth** | Many precise actions are better than one vague action |
| **Safety by default** | High-impact operations require clear approval and escalation semantics |
| **Real-world mapping** | Taxonomy elements should correspond to recognizable business operations |
| **Interoperability** | Reference external standards where they genuinely improve precision |

## What Happens After You Open a PR

Every contribution passes through both an **automation gate** and a **curation gate**.

| Stage | What happens | Outcome |
|---|---|---|
| Automated validation | Build, test, and repository validation workflows run | Confirms technical correctness |
| Maintainer curation | Naming, overlap, safety posture, and metadata are reviewed | Confirms semantic quality |
| Merge to `main` | Contribution becomes part of the public taxonomy source | Public repository acceptance |
| Release publication | The taxonomy package is versioned and published | Public package availability |
| Downstream import | Automation proposes the release to `mandaitor-core` | Candidate for system adoption |
| Final owner approval | Maintainer reviews and merges the downstream update | Live system adoption |

> The final curation gate remains with the Mandaitor maintainer. This ensures that community growth does not degrade trust, safety, or semantic consistency.

## End-to-End Testing Before Community Rollout

If you want to simulate the full contribution lifecycle yourself before broader rollout, follow the public walkthrough in the documentation site and the local checklist in this repository. The recommended sequence is:

1. Create a small, well-scoped taxonomy contribution on a fork.
2. Run local validation and open a PR.
3. Observe the automation results in GitHub Actions.
4. Review the PR as maintainer and merge it.
5. Confirm that the release automation proposes and publishes the package.
6. Confirm that the downstream import PR into `mandaitor-core` is created and reviewed.

## Code Style Expectations

- TypeScript with strict mode enabled
- Descriptive variable names instead of abbreviations
- Comments that explain the design intent, not the obvious syntax
- Exported definitions documented with JSDoc where it improves maintainability

## Questions?

If you are unsure whether a contribution belongs in a new taxonomy, an existing taxonomy, or only in local project configuration, open an issue first. It is better to align the semantic model early than to fix ontology drift after publication.
