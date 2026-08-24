# Changelog

## [1.0.0](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/compare/taxonomy-core-v0.3.2...taxonomy-core-v1.0.0) (2026-08-24)


### ⚠ BREAKING CHANGES

* **construction:** Resource patterns in @mandaitor/taxonomy-construction now use the `construction:` namespace instead of `monco:`. Mandates already issued keep verifying against their recorded URIs, because verification compares the request resource with the mandate's resource rather than with the taxonomy template. What changes is anything that builds URIs from these templates, such as the action pickers in @mandaitor/react. Tenants operating mandates created from the 1.x templates should reissue them against

### Features

* **construction:** namespace resources by domain instead of by vendor ([12cd132](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/commit/12cd132abe1ad15c22da2cc743d339cfd732c4f2))

## [0.3.2](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/compare/taxonomy-core-v0.3.1...taxonomy-core-v0.3.2) (2026-08-06)


### Bug Fixes

* repository metadata for provenance + attestation-free backfills ([9599513](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/commit/9599513ed982d065e19479c1ed8071faf9ced0af))
* repository metadata for provenance + attestation-free backfills ([6aa4aa2](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/commit/6aa4aa2e24cebf79eb200da800879106dd72f65d))

## [0.3.1](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/compare/taxonomy-core-v0.3.0...taxonomy-core-v0.3.1) (2026-07-20)


### Bug Fixes

* **core,scripts,ci:** semver-correct latest selection, export-name fallback, supply-chain hardening ([b06d6d0](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/commit/b06d6d0fc7ec1427c458c2f8e72d2455a04ea1c9))
* **core:** harden duration regex, remove skipValidation, add publish provenance ([68a6e44](https://github.com/C4RR13P0TT3R/mandaitor-taxonomies/commit/68a6e44d3bdb1c33e0dd99d6534544762c8714c6))
