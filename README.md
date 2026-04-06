# Mandaitor Community Taxonomies

Community-contributed industry taxonomies for the [Mandaitor](https://trust.mandaitor.io) delegation registry. Each taxonomy defines the actions, resources, constraints, and mandate templates that AI agents can be delegated within a specific industry vertical.

## What is a Taxonomy?

A Mandaitor taxonomy is a structured definition of **what an AI agent is allowed to do** within a specific industry. It consists of four building blocks:

| Building Block | Purpose | Example |
|---|---|---|
| **Actions** | Operations that can be delegated | `construction.validation.approve` |
| **Resource Patterns** | URI templates scoping where actions apply | `monco:project:{projectId}/zone:{zoneId}/*` |
| **Constraint Templates** | Reusable boundary conditions (time, budget, rate) | Invoice approval limit of EUR 5,000 |
| **Mandate Templates** | Pre-built delegation blueprints combining the above | "Automated Plan Validation" template |

## Available Taxonomies

| Taxonomy | Version | Actions | Resources | Constraints | Templates | Status |
|---|---|---|---|---|---|---|
| [construction](./taxonomies/construction/) | 1.0.0 | 14 | 7 | 4 | 7 | Reference |

## Contributing a New Taxonomy

### Quick Start

```bash
# 1. Fork and clone this repository
gh repo fork C4RR13P0TT3R/mandaitor-taxonomies --clone

# 2. Install dependencies
pnpm install

# 3. Scaffold a new taxonomy
pnpm new-taxonomy healthcare "Healthcare & Life Sciences"

# 4. Edit the generated files in taxonomies/healthcare/src/
# 5. Run validation
pnpm build && pnpm test

# 6. Submit a PR
```

### Taxonomy Structure

Every taxonomy lives in `taxonomies/{id}/` and follows this structure:

```
taxonomies/healthcare/
├── package.json           # NPM package config
├── tsconfig.json          # TypeScript config
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

| Level | Description | Human Approval |
|---|---|---|
| `LOW` | Read-only or informational actions | Optional |
| `MEDIUM` | Modifying actions with limited blast radius | Recommended |
| `HIGH` | Actions with significant business impact | Required |
| `CRITICAL` | Actions with safety or legal implications | Mandatory |

### Validation

The CI pipeline validates every taxonomy against the core schema. You can run validation locally:

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
- All template references resolve to existing actions and resource patterns
- Resource pattern placeholders match parameter definitions
- ISO 8601 duration formats in time constraints
- CRITICAL actions have human approval flags
- High-risk actions have templates with escalation rules

### Review Process

1. **Fork** this repository
2. **Scaffold** your taxonomy using `pnpm new-taxonomy`
3. **Implement** actions, resources, constraints, and templates
4. **Test** locally with `pnpm build && pnpm test`
5. **Submit** a Pull Request
6. **Review**: A maintainer will review for correctness, completeness, and naming consistency
7. **Merge**: Once approved, the taxonomy is published to NPM as `@mandaitor/taxonomy-{id}`

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

```
mandaitor-taxonomies/
├── packages/
│   └── core/              # @mandaitor/taxonomy-core — types, validator, registry
├── taxonomies/
│   └── construction/      # @mandaitor/taxonomy-construction — reference taxonomy
├── scripts/
│   ├── scaffold-taxonomy.mjs   # Scaffolding script
│   └── validate-all.mjs        # CI validation script
└── .github/
    └── workflows/         # CI/CD pipelines
```

## Integration with Mandaitor

Taxonomies published from this repository are consumed by the main [mandaitor-core](https://github.com/C4RR13P0TT3R/mandaitor-core) registry. The integration works as follows:

1. Taxonomy packages are published to NPM under the `@mandaitor` scope
2. The Mandaitor API imports and registers taxonomies at startup
3. When creating mandates, the API validates actions and resources against the registered taxonomy
4. The SDK and React widget use taxonomy metadata to render action pickers and constraint editors

## License

Apache-2.0. See [LICENSE](./LICENSE) for details.
