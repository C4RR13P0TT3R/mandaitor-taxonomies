# @mandaitor/taxonomy-healthcare

Healthcare & Life Sciences taxonomy for Mandaitor — actions, resources, constraints, and mandate templates for patient management, clinical documentation, telemedicine, and prescription workflows.

## What this package provides

This package publishes the **Healthcare & Life Sciences taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

The package is designed for clinical, administrative, and telemedicine delegation use cases, providing a structured vocabulary for AI agents operating in healthcare environments.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-healthcare
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { healthcareTaxonomy } from "@mandaitor/taxonomy-healthcare";

registerTaxonomy(healthcareTaxonomy);
```

## Operational Scope

| Area | What it covers |
| :--- | :--- |
| **Patient Management** | Reading records, summaries, and patient history |
| **Clinical Documentation** | Drafting letters, generating reports, and sending correspondence |
| **Prescriptions** | Suggesting and issuing medical prescriptions |
| **Discharge Planning** | Preparing and approving patient discharge documentation |
| **Scheduling & Triage** | Booking appointments and assessing patient triage priority |
| **Telemedicine** | Initiating sessions, transcribing interactions, and generating summaries |

## Included Resource Scopes

| Resource Pattern | Purpose |
| :--- | :--- |
| `patient:record` | Individual patient medical records |
| `clinic:department` | Department-level administrative scopes |
| `telemedicine:session` | Specific telemedicine interaction sessions |

## Governance Notes

The taxonomy reflects strict governance requirements common in healthcare environments (e.g., HIPAA, GDPR). It distinguishes between low-risk administrative actions (like scheduling) and high-risk clinical actions (like issuing prescriptions), ensuring that AI agents can be delegated appropriate levels of authority with mandatory human-in-the-loop approval where required.

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
