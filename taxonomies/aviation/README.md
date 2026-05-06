# @mandaitor/taxonomy-aviation

Aviation operations taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for dispatch, crew scheduling, maintenance coordination, flight documentation, and safety escalation workflows.

## What this package provides

This package publishes the **Aviation Operations taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is designed for airline operations control, dispatch, and maintenance delegation use cases where AI agents assist with operational decision-making under strict regulatory oversight.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-aviation
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { aviationTaxonomy } from "@mandaitor/taxonomy-aviation";

registerTaxonomy(aviationTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Dispatch** | Creating operational releases and updating route briefings |
| **Crew Management** | Scheduling crew assignments and checking currency/qualifications |
| **Flight Planning** | Fuel planning, ETOPS compliance monitoring, and route optimization |
| **Maintenance** | Flagging aircraft issues and deferring defects under MEL |
| **Documentation** | Generating flight logs and issuing operational notices |
| **Safety** | Reporting SMS events, grounding aircraft, and ATC communication logging |
| **Compliance** | Verifying crew currency and regulatory adherence |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `aviation:flight` | Specific flight operation scope |
| `aviation:aircraft` | Aircraft-level maintenance and dispatch scope |
| `aviation:crew` | Crew scheduling and qualification scope |
| `aviation:route` | Route planning and briefing scope |

## Governance Notes

The aviation taxonomy enforces strict separation between advisory actions (e.g., calculating fuel plans) and safety-critical actions (e.g., grounding an aircraft). High-risk actions require explicit human-in-the-loop approval and are flagged with elevated risk levels in the semantic graph.

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
