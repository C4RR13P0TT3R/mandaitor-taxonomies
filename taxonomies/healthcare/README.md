# @mandaitor/taxonomy-healthcare

Healthcare & Life Sciences taxonomy for Mandaitor

## What this package provides

This package publishes the **Healthcare & Life Sciences taxonomy** for Mandaitor. It exposes the compiled taxonomy object together with its actions, resource patterns, constraint templates, and mandate templates so downstream services can register and validate this vertical at runtime.

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

## License

Apache-2.0
