# @mandaitor/taxonomy-maritime

Maritime & Port Operations taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for vessel traffic services, port coordination, cargo management, safety reporting, and compliance workflows.

## What this package provides

This package publishes the **Maritime & Port Operations taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is intentionally scoped to **port operations, vessel traffic management, and maritime logistics**. It covers the operational chain from vessel approach through cargo handling to departure, including safety and environmental compliance.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-maritime
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { maritimeTaxonomy } from "@mandaitor/taxonomy-maritime";

registerTaxonomy(maritimeTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Vessel Traffic Services (VTS)** | Issuing navigation advisories and sequencing arrival slots |
| **Port Operations** | Berth assignment and tug/pilot coordination |
| **Cargo Management** | Manifest review, dangerous goods declarations, and container scheduling |
| **Safety** | Near-miss logging and navigation risk flagging |
| **Compliance** | Pollution prevention reporting, cyber risk controls, and port state inspections |
| **Incident Management** | Navigation risk escalation and port disruption protocols |
| **Crew** | Certification tracking and qualification verification |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `maritime:port` | Port-wide operational scope |
| `maritime:vessel` | Specific vessel operations |
| `maritime:berth` | Individual berth assignment scope |
| `maritime:cargo` | Cargo and manifest management scope |

## Governance Notes

The maritime taxonomy reflects governance themes from IMO conventions and port state control requirements. It distinguishes between routine operational actions (berth assignment, manifest review) and safety-critical actions (disruption protocol activation, navigation risk flagging) that require immediate human oversight.

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
