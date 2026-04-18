# @mandaitor/taxonomy-construction

Construction industry taxonomy for Mandaitor — actions, resources, constraints and mandate templates for BIM validation, scheduling, procurement, cost management and documentation workflows

## What this package provides

This package publishes the **Construction taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-construction
```

## Usage

```ts
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { constructionTaxonomy } from "@mandaitor/taxonomy-construction";

registerTaxonomy(constructionTaxonomy);
```

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
