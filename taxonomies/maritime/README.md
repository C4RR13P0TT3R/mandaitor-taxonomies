# @mandaitor/taxonomy-maritime

`@mandaitor/taxonomy-maritime` publishes the **Maritime & Port Operations** taxonomy for Mandaitor. It is designed for civil commercial maritime workflows such as vessel traffic coordination, berth planning, cargo-document handling, safety-management reporting, and disruption escalation.

## What this package provides

This package exposes a complete industry taxonomy bundle for runtime registration in Mandaitor, including actions, resource scopes, constraint templates, and mandate templates.

| Component | Purpose |
|---|---|
| `maritimeTaxonomy` | Full taxonomy object for runtime registration |
| `MARITIME_ACTIONS` | Action catalogue for vessel traffic, port, cargo, compliance, and incident workflows |
| `MARITIME_RESOURCES` | Resource boundaries for vessels, port calls, cargo consignments, terminals, and operator-wide scopes |
| `MARITIME_CONSTRAINTS` | Reusable time, throughput, escalation, and reporting guardrails |
| `MARITIME_TEMPLATES` | Ready-made delegation patterns for common maritime operations |

## Scope

The taxonomy is intentionally limited to **civil and commercial maritime operations**. It does not model naval warfare, offensive military activity, or unrestricted emergency command authority. Instead, it focuses on bounded operational delegation where auditability, human review, and safety-management controls remain important.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-maritime
```

## Usage

```ts
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { maritimeTaxonomy } from "@mandaitor/taxonomy-maritime";

registerTaxonomy(maritimeTaxonomy);
```

## Example action families

| Family | Examples |
|---|---|
| Vessel traffic and port coordination | `maritime.vts.issue_navigation_advisory`, `maritime.port.assign_berth` |
| Cargo and terminal workflows | `maritime.cargo.review_manifest`, `maritime.terminal.schedule_container_move` |
| Safety and compliance | `maritime.safety.log_near_miss`, `maritime.compliance.file_pollution_prevention_report` |
| Incident response | `maritime.incident.flag_navigation_risk`, `maritime.incident.activate_port_disruption_protocol` |

## Governance notes

High-risk and critical actions are modeled explicitly with elevated risk levels and, where appropriate, human-approval requirements. Broad operator-wide scopes should be paired with tight constraints such as active shift windows, escalation requirements, and environmental reporting policies.

## License

Apache-2.0
