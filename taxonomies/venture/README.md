# @mandaitor/taxonomy-venture

Venture, Startups & Investment Decisioning taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for deal flow, due diligence, portfolio monitoring, and fundraising workflows.

## What this package provides

This package publishes the **Venture & Investment taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is designed for venture capital firms, angel investors, and startup accelerators that use AI agents to assist with deal screening, due diligence, and portfolio management.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-venture
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { ventureTaxonomy } from "@mandaitor/taxonomy-venture";

registerTaxonomy(ventureTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Deal Flow** | Screening inbound deals and prioritizing opportunities |
| **Due Diligence** | Requesting documents, summarizing findings, and flagging risks |
| **Founder Relations** | Preparing updates and coordinating follow-up communications |
| **Investment Decisions** | Preparing memos, recommending decisions, and approving commitments |
| **Portfolio Monitoring** | Generating reports, flagging KPI deviations, and tracking metrics |
| **Fundraising** | Preparing data rooms and matching with potential investors |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `venture:deal` | Individual deal or opportunity scope |
| `venture:portfolio` | Portfolio company monitoring scope |
| `venture:fund` | Fund-level operations and reporting scope |
| `venture:dataroom` | Data room access and preparation scope |

## Governance Notes

The venture taxonomy enforces strict separation between advisory actions (screening, summarizing) and commitment actions (approving investments). Investment approval actions carry the highest risk level and always require human-in-the-loop confirmation, reflecting the fiduciary responsibilities of fund managers.

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
