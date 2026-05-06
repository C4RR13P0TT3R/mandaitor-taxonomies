# @mandaitor/taxonomy-construction

Construction industry taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for BIM validation, scheduling, procurement, cost management, documentation, defect detection, and safety workflows.

## What this package provides

This package publishes the **Construction & Baumanagement taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is designed for construction project management delegation use cases, particularly for AI agents operating within BIM-driven workflows and site management platforms.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-construction
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { constructionTaxonomy } from "@mandaitor/taxonomy-construction";

registerTaxonomy(constructionTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Validation** | Approving, flagging, rejecting, and requesting rechecks of construction elements |
| **Scheduling** | Updating project timelines and sending notifications |
| **Procurement** | Creating purchase orders and comparing supplier quotes |
| **Cost Management** | Approving invoices and flagging cost deviations |
| **Documentation** | Generating project reports and preparing handover packages |
| **Defect Management** | Creating and tracking construction defects |
| **Safety** | Halting work on safety-critical issues |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `project:zone:installation` | Specific installation within a project zone |
| `project:zone` | Entire zone within a construction project |
| `project` | Project-wide scope for cross-zone operations |

## Governance Notes

The construction taxonomy is designed for integration with platforms like monco.ai. It enforces the principle that validation approvals require prior inspection, and that safety halts override all other ongoing operations. The semantic graph captures these workflow dependencies for drift detection.

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
