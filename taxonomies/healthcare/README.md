# @mandaitor/taxonomy-healthcare

Healthcare taxonomy for Mandaitor — clinical workflows including patient data access, documentation, prescriptions, discharge management, and telemedicine delegation

## What this package provides

This package publishes the **Healthcare taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

## Installation

```bash
npm install @mandaitor/taxonomy-core @mandaitor/taxonomy-healthcare
```

## Usage

```ts
import { registerTaxonomy } from "@mandaitor/taxonomy-core";
import { healthcareTaxonomy } from "@mandaitor/taxonomy-healthcare";

registerTaxonomy(healthcareTaxonomy);
```

## Notes

This package is published from the `mandaitor-taxonomies` monorepo. The repository root contains the broader contribution guide, taxonomy lifecycle, and release workflow: [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
