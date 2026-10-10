// @mandaitor/taxonomy-procurement — Resource patterns
//
// Pattern syntax: procurement:plant:{plant}/requisition:{purchase_requisition}
//
// Placeholder names are fact names. When an agent asks Mandaitor to act, the
// tool fills every placeholder from facts it read from the system of record,
// never from the agent's arguments. A procurement tool therefore declares
// facts with exactly these names.
//
// Matching, as taxonomy-core's matchResourcePattern implements it: "{param}"
// and "*" stay within one "/" segment, and only "**" crosses segments. No
// pattern here uses "**". A mandate covering several plants names each one.

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const PROCUREMENT_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "requisition",
    pattern: "procurement:plant:{plant}/requisition:{purchase_requisition}",
    description:
      "One purchase requisition, identified by its plant and its number in the system of record. An execution of procurement.requisition.release acts on exactly this resource.",
    parameters: [
      {
        name: "plant",
        type: "string",
        description:
          "The plant (site) the requisition belongs to, as the system of record identifies it",
        required: true,
      },
      {
        name: "purchase_requisition",
        type: "string",
        description: "The requisition's number in the system of record",
        required: true,
      },
    ],
  },
  {
    name: "plant-requisitions",
    pattern: "procurement:plant:{plant}/requisition:*",
    description:
      'Every purchase requisition of one plant, and nothing else: "*" matches one requisition number and never a path below it. The usual scope of a release mandate.',
    parameters: [
      {
        name: "plant",
        type: "string",
        description: "The plant (site) whose requisitions are in scope",
        required: true,
      },
    ],
  },
];
