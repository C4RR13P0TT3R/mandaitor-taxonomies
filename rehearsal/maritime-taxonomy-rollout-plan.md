# Maritime Taxonomy Rollout Plan

This document defines the end-to-end rehearsal path for `@mandaitor/taxonomy-maritime` as the second new taxonomy PR within a single release cycle.

## Objective

The goal is to validate that `mandaitor-taxonomies` can accept, merge, release, and downstream-import **more than one new taxonomy package** in the same release train.

## Planned flow

| Step | Repository | Expected outcome |
|---|---|---|
| 1 | `mandaitor-taxonomies` | Open proposal Issue for the maritime taxonomy |
| 2 | `mandaitor-taxonomies` | Open package PR with taxonomy sources, README, and tests |
| 3 | `mandaitor-taxonomies` | Merge the maritime PR after review |
| 4 | `mandaitor-taxonomies` | Include both new taxonomy packages in the next release |
| 5 | `mandaitor-ops` | Run `taxonomy import` against the new release tag |
| 6 | `mandaitor-core` | Confirm that the generated runtime-sync PR includes both new taxonomies |
| 7 | `mandaitor-core` | Review and merge the generated update PR |

## Validation checkpoints

| Checkpoint | What to verify |
|---|---|
| Package validation | Lint, test, and build pass for `@mandaitor/taxonomy-maritime` |
| README guardrail | `pnpm check:package-readmes` passes |
| Release output | Release PR or published package includes both new taxonomy packages |
| Import output | `taxonomy import` generates expected `mandaitor-core` changes for both new taxonomies |
| Downstream stability | Resulting `mandaitor-core` PR checks pass |

## Success criteria

The rehearsal is successful if a single taxonomy release in `mandaitor-taxonomies` can carry both the already merged `space` taxonomy and this new `maritime` taxonomy, and the downstream import produces one coherent `mandaitor-core` sync PR without manual workflow repair.
