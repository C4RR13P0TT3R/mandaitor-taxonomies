# @mandaitor/taxonomy-core

Core types, interfaces, validation, and registry for Mandaitor industry taxonomies

## What this package provides

This package contains the shared **types**, **validation helpers**, and **taxonomy registry utilities** used by Mandaitor taxonomy packages. It is the common foundation for loading industry taxonomies, validating scopes, and wiring runtime registration in downstream services.

## Installation

```bash
npm install @mandaitor/taxonomy-core
```

## Usage

```ts
import { registerTaxonomy, taxonomyRegistry, validateScope } from "@mandaitor/taxonomy-core";
import { aviationTaxonomy } from "@mandaitor/taxonomy-aviation";

registerTaxonomy(aviationTaxonomy);

const taxonomy = taxonomyRegistry.get("aviation");
const result = taxonomy
  ? validateScope(taxonomy, {
      actions: ["aviation.dispatch.assign-crew"],
      resources: ["aviation:flight:LH401/*"],
      effect: "ALLOW",
    })
  : { valid: false, errors: [{ path: "taxonomy", message: "Missing taxonomy", code: "MISSING_TAXONOMY" }], warnings: [] };

console.log(result.valid);
```

## Package contents

The published package exposes the compiled runtime and type definitions from `dist/`. The source of truth for the monorepo, contribution workflow, and cross-package release process lives in the repository root at [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
