// @mandaitor/taxonomy-core — Taxonomy registry
import type { IndustryTaxonomy, TaxonomyAction, TaxonomyMandateTemplate } from "./types.js";
import { validateTaxonomy } from "./validator.js";

/**
 * Compare two semver strings by precedence (semver.org §11), returning a
 * negative number if `a` has lower precedence than `b`, positive if higher,
 * and 0 if equal in precedence. Dependency-free.
 *
 * Rules implemented:
 *  - Major, minor, and patch are compared numerically in that order.
 *  - A version WITHOUT a prerelease tag has HIGHER precedence than the same
 *    core version WITH a prerelease tag (e.g. 1.0.0 > 1.0.0-beta).
 *  - Prerelease tags are compared per §11: dot-separated identifiers are
 *    compared left to right; purely numeric identifiers compare numerically,
 *    non-numeric (or mixed) identifiers compare lexically in ASCII order,
 *    numeric identifiers always have lower precedence than non-numeric ones,
 *    and a larger set of identifiers outranks a smaller one when all preceding
 *    identifiers are equal.
 *
 * Build metadata (after `+`) is ignored for precedence, per §10. Inputs are
 * expected to already satisfy the validator's SEMVER_PATTERN; any non-numeric
 * core segment is treated as 0 defensively rather than producing NaN.
 */
function compareSemver(a: string, b: string): number {
  const parse = (v: string): { core: number[]; pre: string[] } => {
    // Strip build metadata, then split off the prerelease portion.
    const withoutBuild = v.split("+", 1)[0];
    const dashIndex = withoutBuild.indexOf("-");
    const corePart = dashIndex === -1 ? withoutBuild : withoutBuild.slice(0, dashIndex);
    const prePart = dashIndex === -1 ? "" : withoutBuild.slice(dashIndex + 1);
    const core = corePart.split(".").map((n) => {
      const parsed = Number(n);
      return Number.isFinite(parsed) ? parsed : 0;
    });
    // Pad to [major, minor, patch] so missing segments compare as 0.
    while (core.length < 3) core.push(0);
    const pre = prePart === "" ? [] : prePart.split(".");
    return { core, pre };
  };

  const pa = parse(a);
  const pb = parse(b);

  for (let i = 0; i < 3; i++) {
    if (pa.core[i] !== pb.core[i]) return pa.core[i] - pb.core[i];
  }

  // Equal core versions: a version with no prerelease outranks one with a
  // prerelease tag.
  if (pa.pre.length === 0 && pb.pre.length === 0) return 0;
  if (pa.pre.length === 0) return 1;
  if (pb.pre.length === 0) return -1;

  const len = Math.min(pa.pre.length, pb.pre.length);
  for (let i = 0; i < len; i++) {
    const ia = pa.pre[i];
    const ib = pb.pre[i];
    const aNum = /^\d+$/.test(ia);
    const bNum = /^\d+$/.test(ib);
    if (aNum && bNum) {
      const na = Number(ia);
      const nb = Number(ib);
      if (na !== nb) return na - nb;
    } else if (aNum !== bNum) {
      // Numeric identifiers always have lower precedence than non-numeric.
      return aNum ? -1 : 1;
    } else if (ia !== ib) {
      // Both non-numeric: compare lexically in ASCII sort order.
      return ia < ib ? -1 : 1;
    }
  }

  // All shared identifiers equal: the longer prerelease list outranks.
  return pa.pre.length - pb.pre.length;
}

/**
 * In-memory registry of loaded industry taxonomies.
 * Singleton pattern — one registry per process.
 */
class TaxonomyRegistry {
  private taxonomies = new Map<string, Map<string, IndustryTaxonomy>>();

  /**
   * Register a taxonomy instance.
   * Always validates the taxonomy before registration — there is intentionally
   * no opt-out, since skipping validation in downstream consumers is a footgun.
   * @throws Error if validation fails or if the same id+version is already registered
   */
  register(taxonomy: IndustryTaxonomy): void {
    const result = validateTaxonomy(taxonomy);
    if (!result.valid) {
      const errorSummary = result.errors.map((e) => `  ${e.path}: ${e.message}`).join("\n");
      throw new Error(
        `Taxonomy "${taxonomy.metadata.id}" v${taxonomy.metadata.version} failed validation:\n${errorSummary}`,
      );
    }

    const id = taxonomy.metadata.id;
    const version = taxonomy.metadata.version;

    if (!this.taxonomies.has(id)) {
      this.taxonomies.set(id, new Map());
    }
    const versions = this.taxonomies.get(id)!;
    if (versions.has(version)) {
      throw new Error(`Taxonomy "${id}" version ${version} is already registered`);
    }
    versions.set(version, taxonomy);
  }

  /**
   * Get a specific taxonomy by ID and optional version.
   * If version is omitted, returns the latest registered version.
   */
  get(id: string, version?: string): IndustryTaxonomy | undefined {
    const versions = this.taxonomies.get(id);
    if (!versions || versions.size === 0) return undefined;

    if (version) return versions.get(version);

    // Sort by semver precedence, highest first, so the latest stable release is
    // preferred over any prerelease sharing the same core version.
    const sorted = [...versions.keys()].sort((a, b) => compareSemver(b, a));
    return versions.get(sorted[0]);
  }

  /**
   * List all registered taxonomy IDs with their latest versions.
   */
  list(): Array<{ id: string; version: string; name: string }> {
    const result: Array<{ id: string; version: string; name: string }> = [];
    for (const [id] of this.taxonomies) {
      const latest = this.get(id);
      if (latest) {
        result.push({ id, version: latest.metadata.version, name: latest.metadata.name });
      }
    }
    return result;
  }

  /**
   * Look up a specific action across all taxonomies.
   */
  lookupAction(actionId: string): { taxonomyId: string; action: TaxonomyAction } | undefined {
    for (const [taxonomyId] of this.taxonomies) {
      const taxonomy = this.get(taxonomyId);
      if (!taxonomy) continue;
      const action = taxonomy.actions.find((a) => a.id === actionId);
      if (action) return { taxonomyId, action };
    }
    return undefined;
  }

  /**
   * Look up a mandate template across all taxonomies.
   */
  lookupTemplate(
    templateId: string,
  ): { taxonomyId: string; template: TaxonomyMandateTemplate } | undefined {
    for (const [taxonomyId] of this.taxonomies) {
      const taxonomy = this.get(taxonomyId);
      if (!taxonomy) continue;
      const template = taxonomy.mandateTemplates.find((t) => t.id === templateId);
      if (template) return { taxonomyId, template };
    }
    return undefined;
  }

  /**
   * Search actions across all taxonomies by tag or keyword.
   */
  searchActions(query: string): Array<{ taxonomyId: string; action: TaxonomyAction }> {
    const q = query.toLowerCase();
    const results: Array<{ taxonomyId: string; action: TaxonomyAction }> = [];
    for (const [taxonomyId] of this.taxonomies) {
      const taxonomy = this.get(taxonomyId);
      if (!taxonomy) continue;
      for (const action of taxonomy.actions) {
        if (
          action.id.toLowerCase().includes(q) ||
          action.label.toLowerCase().includes(q) ||
          action.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          results.push({ taxonomyId, action });
        }
      }
    }
    return results;
  }

  unregister(id: string, version?: string): boolean {
    if (version) {
      return this.taxonomies.get(id)?.delete(version) ?? false;
    }
    return this.taxonomies.delete(id);
  }

  clear(): void {
    this.taxonomies.clear();
  }
}

export const taxonomyRegistry = new TaxonomyRegistry();

export const registerTaxonomy = (t: IndustryTaxonomy) => taxonomyRegistry.register(t);
export const getTaxonomy = (id: string, v?: string) => taxonomyRegistry.get(id, v);
export const listTaxonomies = () => taxonomyRegistry.list();
export const lookupAction = (id: string) => taxonomyRegistry.lookupAction(id);
export const lookupTemplate = (id: string) => taxonomyRegistry.lookupTemplate(id);
export const searchActions = (q: string) => taxonomyRegistry.searchActions(q);
