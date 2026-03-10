// @mandaitor/taxonomy-core — Taxonomy registry
import type { IndustryTaxonomy, TaxonomyAction, TaxonomyMandateTemplate } from "./types.js";
import { validateTaxonomy } from "./validator.js";

/**
 * In-memory registry of loaded industry taxonomies.
 * Singleton pattern — one registry per process.
 */
class TaxonomyRegistry {
  private taxonomies = new Map<string, Map<string, IndustryTaxonomy>>();

  /**
   * Register a taxonomy instance.
   * Validates the taxonomy before registration.
   * @throws Error if validation fails or if the same id+version is already registered
   */
  register(taxonomy: IndustryTaxonomy, opts?: { skipValidation?: boolean }): void {
    if (!opts?.skipValidation) {
      const result = validateTaxonomy(taxonomy);
      if (!result.valid) {
        const errorSummary = result.errors.map((e) => `  ${e.path}: ${e.message}`).join("\n");
        throw new Error(
          `Taxonomy "${taxonomy.metadata.id}" v${taxonomy.metadata.version} failed validation:\n${errorSummary}`,
        );
      }
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

    const sorted = [...versions.keys()].sort((a, b) => {
      const pa = a.split(".").map(Number);
      const pb = b.split(".").map(Number);
      for (let i = 0; i < 3; i++) {
        if ((pa[i] || 0) !== (pb[i] || 0)) return (pb[i] || 0) - (pa[i] || 0);
      }
      return 0;
    });
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

export const registerTaxonomy = (t: IndustryTaxonomy, opts?: { skipValidation?: boolean }) =>
  taxonomyRegistry.register(t, opts);
export const getTaxonomy = (id: string, v?: string) => taxonomyRegistry.get(id, v);
export const listTaxonomies = () => taxonomyRegistry.list();
export const lookupAction = (id: string) => taxonomyRegistry.lookupAction(id);
export const lookupTemplate = (id: string) => taxonomyRegistry.lookupTemplate(id);
export const searchActions = (q: string) => taxonomyRegistry.searchActions(q);
