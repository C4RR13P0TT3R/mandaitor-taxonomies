# @mandaitor/taxonomy-defence-isr

Defence and ISR (Intelligence, Surveillance, Reconnaissance) taxonomy for Mandaitor — intelligence analysis, mission authorization, kinetic decision support, sensor tasking, and escalation workflows.

## What this package provides

This package publishes the **Defence & ISR taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is designed for military and intelligence delegation use cases where AI agents assist human operators with analysis, targeting, and mission coordination under strict rules of engagement.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-defence-isr
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { defenceIsrTaxonomy } from "@mandaitor/taxonomy-defence-isr";

registerTaxonomy(defenceIsrTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Intelligence Analysis** | Imagery analysis, target classification, report generation, and data fusion |
| **Sensor Tasking** | Platform tasking and parameter adjustment for ISR assets |
| **Mission Operations** | Mission planning, status updates, and coordination |
| **Authorization** | Recommending actions and verifying positive identification (PID) |
| **Communications** | Disseminating intelligence products and sending operational alerts |
| **Battle Damage Assessment** | Post-strike assessment and reporting |
| **Escalation** | Flagging issues for human decision-makers and escalation workflows |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `defence:mission` | Specific mission operational scope |
| `defence:target` | Target identification and classification scope |
| `defence:platform` | ISR platform and sensor tasking scope |
| `defence:product` | Intelligence product dissemination scope |

## Governance Notes

This taxonomy enforces the principle that AI agents in defence contexts operate strictly in an advisory capacity. All kinetic decisions and positive identification verifications require mandatory human-in-the-loop approval. The semantic graph encodes strict escalation chains and separation of duties between analysis, recommendation, and authorization.

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
