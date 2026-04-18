# @mandaitor/taxonomy-defence-isr

Defence and ISR taxonomy for Mandaitor — intelligence analysis, mission authorization, kinetic decision support, sensor tasking, and escalation workflows

## What this package provides

This package publishes the **Defence Isr taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-defence-isr
```

## Usage

```ts
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { defenceIsrTaxonomy } from "@mandaitor/taxonomy-defence-isr";

registerTaxonomy(defenceIsrTaxonomy);
```

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
