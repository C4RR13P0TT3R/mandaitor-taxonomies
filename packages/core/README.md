# @mandaitor/taxonomy-core

The core foundation for Mandaitor industry taxonomies. This package provides shared TypeScript types, validation logic, and the central registry for loading and evaluating domain-specific actions, resources, and constraints within the Mandaitor delegation ecosystem.

## Overview

Mandaitor uses industry-specific taxonomies to define the vocabulary of authority. Instead of generic "read" and "write" permissions, a construction agent uses `construction.validation.approve`, while a healthcare agent uses `healthcare.prescription.issue`.

The `@mandaitor/taxonomy-core` package provides the underlying engine that powers these vocabularies. It defines the structure of a taxonomy, provides the registry to load them at runtime, and includes the validation engine that checks whether an action attempt matches a defined scope pattern.

## Installation

```bash
npm install @mandaitor/taxonomy-core
```

## Core Concepts

| Concept | Description |
| :--- | :--- |
| **Taxonomy** | A domain-specific vocabulary of actions, resources, constraints, and templates |
| **Action** | A specific operation an agent can perform (e.g., `aviation.dispatch.create_release`) |
| **Resource Pattern** | A structured identifier for the target of an action (e.g., `project:proj_1/*`) |
| **Constraint Template** | Pre-defined boundaries for authority (e.g., maximum transaction amount) |
| **Semantic Graph** | Relationships between actions used for drift detection and anomaly scoring |

## Usage

### Registering Taxonomies

Before you can validate actions or scopes, you must register the relevant industry taxonomies with the core registry.

```typescript
import { registerTaxonomy, taxonomyRegistry } from "@mandaitor/taxonomy-core";
import { aviationTaxonomy } from "@mandaitor/taxonomy-aviation";

// Register the aviation taxonomy
registerTaxonomy(aviationTaxonomy);

// Retrieve it later
const taxonomy = taxonomyRegistry.get("aviation");
console.log(`Loaded ${taxonomy.metadata.name} v${taxonomy.metadata.version}`);
```

### Validating Scope

The core package provides the validation engine that determines whether a specific scope declaration is valid according to the taxonomy rules.

```typescript
import { validateScope } from "@mandaitor/taxonomy-core";

const result = validateScope(taxonomy, {
  actions: ["aviation.dispatch.create_release"],
  resources: ["aviation:flight:LH401/*"],
  effect: "ALLOW",
});

if (!result.valid) {
  console.error("Invalid scope:", result.errors);
}
```

### Semantic Graph Analysis

For advanced use cases like drift detection, the core package exposes the `SemanticGraphEngine`, which analyzes the relationships between actions.

```typescript
import { SemanticGraphEngine } from "@mandaitor/taxonomy-core";

const engine = new SemanticGraphEngine(taxonomy.semanticGraph);

// Calculate how semantically distant an attempted action is from the expected scope
const distance = engine.semanticDistance(
  "aviation.maintenance.defer_defect", 
  "aviation.dispatch.create_release"
);

console.log(`Semantic distance: ${distance.score}`);
```

## Package Contents

The published package exposes the compiled runtime and type definitions from `dist/`. The source of truth for the monorepo, contribution workflow, and cross-package release process lives in the repository root at [https://github.com/C4RR13P0TT3R/mandaitor-taxonomies](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies).

## License

Apache-2.0
