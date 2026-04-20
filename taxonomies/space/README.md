# @mandaitor/taxonomy-space

Space & Satellite Operations taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for commissioning, telemetry triage, payload tasking, remote-sensing data handling, and anomaly escalation workflows.

## What this package provides

This package publishes the **Space & Satellite Operations taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is intentionally scoped to **civil and commercial satellite mission operations**. It is designed for ground-segment and mission-operations delegation use cases, not for generic aerospace, launch-vehicle engineering, or defense command-and-control domains.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-space
```

## Usage

```ts
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { spaceTaxonomy } from "@mandaitor/taxonomy-space";

registerTaxonomy(spaceTaxonomy);
```

## Operational scope

| Area | What it covers |
|---|---|
| Mission planning | Contact-window planning, activity timeline updates, routine campaign coordination |
| Telemetry and health | Health review, anomaly flagging, operator incident preparation |
| Payload operations | Tasking preparation and calibration workflows |
| Data operations | Processing-job initiation and controlled product release |
| Safety and escalation | Conjunction alerts, recovery-mode preparation, human escalation patterns |

## Included resource scopes

| Resource pattern | Purpose |
|---|---|
| `program-satellite` | Single-spacecraft operational scope |
| `mission-pass` | Specific pass or contact window |
| `payload-dataset` | Dataset processing and dissemination scope |
| `ground-station-network` | Ground-segment coordination scope |
| `program-wide` | Broad constellation or program-level scope |

## Governance notes

The taxonomy reflects recurring governance themes from public space-operations guidance, especially the distinction between routine mission operations, remote-sensing data handling, and high-severity anomaly escalation. Remote sensing from space is framed by the United Nations principles as including operation of space systems plus collection, storage, processing, interpretation, and dissemination of data. Commissioning guidance from NASA likewise emphasizes first contact, subsystem checkout, calibration, anomaly planning, and recovery from off-nominal states as early-operation concerns. [1] [2]

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0

## References

[1]: https://www.unoosa.org/oosa/en/ourwork/spacelaw/principles/remote-sensing-principles.html "UNOOSA: Principles Relating to Remote Sensing of the Earth from Outer Space"
[2]: https://s3vi.ndc.nasa.gov/ssri-kb/topics/54/ "NASA SSRI Knowledge Base: Operations > Commissioning"
