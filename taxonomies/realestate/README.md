# @mandaitor/taxonomy-realestate

Real Estate & Property Management taxonomy for Mandaitor

## What this package provides

This package publishes the **Realestate taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-realestate
```

## Usage

```ts
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { realestateTaxonomy } from "@mandaitor/taxonomy-realestate";

registerTaxonomy(realestateTaxonomy);
```

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
