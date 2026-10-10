# @mandaitor/taxonomy-procurement

Procurement function taxonomy for Mandaitor: vendor-neutral business actions on procurement records, starting with releasing a purchase requisition.

## What this package provides

This package publishes the **Procurement taxonomy**. It exports the taxonomy object together with its actions, resource patterns, constraint templates and mandate template, so that downstream services can register and validate it at runtime.

Unlike the industry taxonomies, this one describes a business function. Its actions name an operation on a procurement record, whatever system holds the record. Mandaitor's tool registry maps each vendor's API onto these actions. For example, the SAP tool `sap.purchase_requisition.release` maps onto `procurement.requisition.release`. A mandate therefore names the business action and the record, never a product, and does not change when a tool for another system is added.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-procurement
```

## Usage

```typescript
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { procurementTaxonomy } from "@mandaitor/taxonomy-procurement";

registerTaxonomy(procurementTaxonomy);
```

## Actions

| Action                            | Risk | What it authorizes                                                                                                |
| --------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------- |
| `procurement.requisition.release` | HIGH | Releasing a purchase requisition in the system of record, so that purchasing can convert it into a purchase order |

The action does not set `requiresHumanApproval`. Setting it would make every release wait for a person, overriding the threshold the principal sets in the mandate (below).

## Resource patterns

| Name                 | Pattern                                                        | Covers                                                          |
| -------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| `requisition`        | `procurement:plant:{plant}/requisition:{purchase_requisition}` | One requisition. This is the resource an execution acts on.     |
| `plant-requisitions` | `procurement:plant:{plant}/requisition:*`                      | Every requisition of one plant, and nothing below a requisition |

The placeholders are fact names. Mandaitor fills them from what it reads in the system of record, never from what the agent sends. No pattern uses `**`, and a mandate covering several plants names each one.

## Constraints

The constraint templates use the vocabulary Mandaitor's execution path enforces:

| Template                                  | Mandate constraint                                             | Effect                                                                                     |
| ----------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `procurement.transaction.release-cap`     | `transaction_limits.max_amount`                                | Above it, the release is denied. No approval lifts it.                                     |
| `procurement.escalation.release-approval` | `escalation_rules.amount_above` (and optionally `escalate_to`) | Above it, a person approves that exact requisition. At or below it, no approval is needed. |

- **Money** is `{ "currency": "EUR", "value": "10000.00" }`: an ISO 4217 code and a decimal string, never a floating-point number.
- **The amount** is the requisition's total as the system of record states it. The agent cannot state one.
- **Currency:** a requisition in another currency is denied, because there is no conversion.

The mandate template `procurement.requisition-release` combines the two templates for one plant: a cap of EUR 50,000.00 and approval above EUR 10,000.00. Its outer keys, `transactionLimits` and `escalationRules`, are the ones taxonomy-core's template type defines. A mandate made from it carries the values as `constraints.transaction_limits` and `constraints.escalation_rules`, because those are the keys the execution path reads, and it denies any constraint key it does not recognise.

## License

Apache-2.0
