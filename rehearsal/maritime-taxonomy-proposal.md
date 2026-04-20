## Summary

I would like to propose a new industry taxonomy for **Maritime & Port Operations**.

This taxonomy is intended for civil and commercial maritime workflows such as vessel traffic coordination, berth planning, cargo-document review, dangerous-goods handling, safety-management reporting, and operational disruption escalation.

## Why this taxonomy is useful

Maritime operations combine regulated safety workflows, logistics coordination, and high-consequence escalation paths. That makes the domain a strong fit for Mandaitor because delegated AI actions need clear resource boundaries, explicit risk grading, and reusable approval constraints.

The proposed taxonomy would make it easier to model bounded authority for:

- vessel traffic and arrival sequencing
- berth and harbour-service coordination
- manifest and dangerous-goods documentation review
- terminal-yard and container-move planning
- near-miss logging and environmental compliance reporting
- disruption-response escalation during severe weather or berth outages

## Proposed package

- Package name: `@mandaitor/taxonomy-maritime`
- Taxonomy ID: `maritime`
- Suggested display name: `Maritime & Port Operations`

## Suggested boundaries

The taxonomy should stay within **civil commercial maritime operations**. It should not attempt to model naval warfare, unrestricted emergency command powers, or military targeting activities.

## Initial action families

| Family | Illustrative actions |
|---|---|
| Vessel traffic services | navigation advisories, arrival slot sequencing |
| Port operations | berth assignment, tug and pilot coordination |
| Cargo workflows | manifest review, dangerous-goods declaration handling |
| Safety and compliance | near-miss logging, cyber-risk control logging, pollution-prevention reporting |
| Incident response | navigation-risk escalation, disruption protocol activation |

## Why now

This proposal is also a good candidate for validating that multiple independent taxonomy PRs can be merged and later released within a single release train.
