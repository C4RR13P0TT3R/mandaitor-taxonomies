# Mandaitor Community Taxonomies

Community-contributed industry taxonomies for [Mandaitor](https://trust.mandaitor.io). Each taxonomy defines the actions, resources, constraints, and mandate templates that AI agents can be delegated within a specific industry vertical.

## What is a Taxonomy?

A Mandaitor taxonomy is a structured definition of **what an AI agent is allowed to do** within a specific industry. It consists of four building blocks:

| Building Block | Purpose | Example |
|---|---|---|
| **Actions** | Operations that can be delegated | `construction.validation.approve` |
| **Resource Patterns** | URI templates scoping where actions apply | `construction:project:{projectId}/zone:{zoneId}/*` |
| **Constraint Templates** | Reusable boundary conditions such as time, budget, or rate limits | Invoice approval limit of EUR 5,000 |
| **Mandate Templates** | Pre-built delegation blueprints combining the above | `construction.automated-plan-validation` |

## Available Taxonomies

| Taxonomy | Version | Actions | Resources | Constraints | Templates | Status |
|---|---|---|---|---|---|---|
| [construction](./taxonomies/construction/) | 1.0.0 | 14 | 7 | 4 | 7 | Reference |

## How Community Contributions Become Part of Mandaitor

Community contributions are welcome, but **a merged change in this repository is not yet the same thing as a live change inside Mandaitor**. The contribution path has two public entry points and two maintainer-controlled gates.

A contributor can either start with a **proposal issue** to discuss a new taxonomy or a substantial change before writing code, or go straight to a **direct pull request** if the implementation is already clear. In both cases, the change still has to pass validation, maintainer review, release, and downstream import before it becomes part of the Mandaitor system.

| Lifecycle stage | What happens | Who decides |
|---|---|---|
| Proposal | Open a `New Taxonomy Proposal` issue to discuss a new vertical or major change | Community starts the discussion |
| Direct implementation | Fork the repository, scaffold or edit a taxonomy, and prepare a PR | Community prepares the change |
| Validation and review | CI validates the contribution and a maintainer reviews naming, safety, metadata, and scope | **Mandaitor maintainer** |
| Merge to `main` | The public source is accepted into `mandaitor-taxonomies` | **Mandaitor maintainer** |
| Release PR | Release Please prepares the next package release from merged changes | Automated |
| Published release | Packages are built, tested, validated, and published to npm | **Mandaitor maintainer** |
| Downstream import | `mandaitor-ops` opens an update PR into `mandaitor-core` | Automated |
| System adoption | The downstream `mandaitor-core` PR is reviewed and merged | **Mandaitor maintainer** |

> A taxonomy contribution becomes part of the **public taxonomy source** when its PR is merged here. It becomes part of the **Mandaitor system** only after the released package is imported downstream and the corresponding `mandaitor-core` update is merged.

## Contributing a New Taxonomy

### Choose Your Entry Path

If you are exploring a new industry vertical or a substantial restructuring, start with a **proposal issue** so the scope and naming can be discussed before implementation. If the change is already well-defined, you can go straight to a fork and pull request.

| Path | Best for | Public entry point |
|---|---|---|
| **Proposal first** | New verticals, large refactors, uncertain scope | `.github/ISSUE_TEMPLATE/new-taxonomy.md` |
| **Direct PR** | Small refinements or well-scoped additions | Fork + branch + pull request |

### Quick Start

```bash
# 1. Fork and clone this repository
gh repo fork C4RR13P0TT3R/mandaitor-taxonomies --clone
cd mandaitor-taxonomies

# 2. Install dependencies
pnpm install

# 3. Scaffold a new taxonomy
pnpm new-taxonomy healthcare "Healthcare & Life Sciences"

# 4. Edit the generated files in taxonomies/healthcare/src/
# 5. Run validation
pnpm build
pnpm test
pnpm validate

# 6. Push your branch and submit a PR to main
```

### Taxonomy Structure

Every taxonomy lives in `taxonomies/{id}/` and follows this structure:

```text
taxonomies/healthcare/
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── src/
│   ├── index.ts           # Main export (IndustryTaxonomy object)
│   ├── actions.ts         # Action definitions
│   ├── resources.ts       # Resource pattern definitions
│   ├── constraints.ts     # Constraint template definitions
│   └── templates.ts       # Mandate template definitions
└── test/
    └── taxonomy.test.ts   # Validation tests
```

### Naming Conventions

All identifiers use **dot-separated lowercase** with the taxonomy ID as prefix:

| Element | Pattern | Example |
|---|---|---|
| Action ID | `{taxonomy}.{category}.{operation}` | `healthcare.prescription.approve` |
| Constraint ID | `{taxonomy}.{type}.{name}` | `healthcare.limits.daily-prescriptions` |
| Template ID | `{taxonomy}.{name}` | `healthcare.automated-triage` |
| Resource Pattern Name | lowercase with hyphens | `patient-record` |

### Risk Levels

Actions must declare a risk level that determines default approval requirements:

| Level | Description | Human approval expectation |
|---|---|---|
| `LOW` | Read-only or informational actions | Optional |
| `MEDIUM` | Modifying actions with limited blast radius | Recommended |
| `HIGH` | Actions with significant business impact | Required |
| `CRITICAL` | Actions with safety or legal implications | Mandatory |

### Validation

The CI pipeline validates every taxonomy against the shared schema. Run the same checks locally before opening a PR:

```bash
# Build everything
pnpm build

# Run all tests
pnpm test

# Validate all taxonomies
pnpm validate
```

The validator checks for:

- Correct ID formats and prefixes
- No duplicate IDs
- All template references resolving to existing actions and resource patterns
- Resource pattern placeholders matching parameter definitions
- ISO 8601 duration formats in time constraints
- Required human approval flags on high-risk actions
- Escalation coverage for high-risk templates

### Review and Release Process

After you open your PR, the repository evaluates both the **technical quality** and the **taxonomy design quality** of the change.

| Step | What reviewers and automation check |
|---|---|
| Pull request | Naming, scope, safety, metadata, and maintainer intent |
| CI | Build, test, and taxonomy validation |
| Merge | Acceptance into the public taxonomy source |
| Release | Packaging and npm publication |
| Downstream import | Creation of the update PR that can bring the release into `mandaitor-core` |

If you want more operational detail, see [`CONTRIBUTING.md`](./CONTRIBUTING.md), which explains contributor expectations and what happens after merge.

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Setup

```bash
pnpm install
pnpm build
pnpm test
```

### Monorepo Structure

```text
mandaitor-taxonomies/
├── packages/
│   └── core/                   # @mandaitor/taxonomy-core — types, validator, registry
├── taxonomies/
│   └── construction/           # @mandaitor/taxonomy-construction — reference taxonomy
├── scripts/
│   ├── scaffold-taxonomy.mjs   # Scaffolding script
│   └── validate-all.mjs        # CI validation script
└── .github/
    └── workflows/              # CI, release, and notification pipelines
```

## Integration with Mandaitor

Taxonomies published from this repository are eventually consumed by [mandaitor-core](https://github.com/C4RR13P0TT3R/mandaitor-core). The integration works as follows:

1. Taxonomy packages are published to npm under the `@mandaitor` scope.
2. The downstream automation proposes the released version for import into `mandaitor-core`.
3. After that import PR is merged, the Mandaitor API can register the taxonomy and expose it to runtime services.
4. The SDK and React widgets can then use taxonomy metadata to render action pickers and constraint editors.

## License

Apache-2.0. See [LICENSE](./LICENSE) for details.
