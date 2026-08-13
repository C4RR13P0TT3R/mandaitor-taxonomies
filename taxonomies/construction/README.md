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
| `construction:project:{projectId}/zone:{zoneId}/trade:{tradeId}/*` | Specific trade within a project zone |
| `construction:project:{projectId}/zone:{zoneId}/*` | Entire zone across all trades |
| `construction:project:{projectId}/*` | Project-wide scope for cross-zone operations |
| `construction:project:{projectId}/schedule:{scheduleId}` | A specific project schedule |
| `construction:project:{projectId}/procurement:{orderId}` | A specific procurement order |
| `construction:project:{projectId}/invoice:{invoiceId}` | A specific invoice |
| `construction:project:{projectId}/defect:{defectId}` | A specific defect report |

## Governance Notes

The taxonomy enforces the principle that validation approvals require prior inspection, and that safety halts override all other ongoing operations. The semantic graph captures these workflow dependencies for drift detection.

Resource patterns are namespaced by domain (`construction:`) rather than by product, so the same mandates apply whichever BIM, scheduling, or site management platform a tenant runs.

<!-- neutrality-allow-begin: migration note; a migration note has to name the identifier it replaces. -->

## Migration: resource namespace in 2.0.0

Resource patterns previously used a vendor namespace (`monco:project:...`). They now use the domain namespace `construction:project:...`, matching how the other taxonomies in this repository are structured (`ops:` for defence-ISR, for example).

Only the templates in this package changed. Mandates already issued against `monco:` URIs keep verifying against those URIs, because verification compares the request resource with the resource recorded in the mandate — not with the taxonomy template. What changes is the output of anything that builds URIs *from* these templates, such as the action pickers in `@mandaitor/react`.

If you operate mandates created from the 1.x templates, either reissue them against `construction:` URIs or keep the previous package version pinned until you do.

<!-- neutrality-allow-end -->

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
