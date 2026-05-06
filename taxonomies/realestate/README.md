# @mandaitor/taxonomy-realestate

Real Estate & Property Management taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for property operations, tenant management, maintenance coordination, and compliance workflows.

## What this package provides

This package publishes the **Real Estate & Property Management taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is designed for property management, facility operations, and real estate investment delegation use cases.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-realestate
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { realestateTaxonomy } from "@mandaitor/taxonomy-realestate";

registerTaxonomy(realestateTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Property Operations** | Building management, facility coordination, and operational oversight |
| **Tenant Management** | Lease administration, communication, and service requests |
| **Maintenance** | Work order creation, vendor coordination, and preventive maintenance scheduling |
| **Financial** | Rent collection, expense tracking, and budget management |
| **Compliance** | Building code adherence, safety inspections, and regulatory reporting |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `property:building` | Building-level operational scope |
| `property:unit` | Individual unit or tenant scope |
| `property:portfolio` | Portfolio-wide management scope |

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
