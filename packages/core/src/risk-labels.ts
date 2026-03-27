// @mandaitor/taxonomy-core — Risk-level labels, colors, and i18n
//
// Provides a normative mapping from the riskLevel enum to human-readable
// labels, UX colors, and icons. Widgets and dashboards should use these
// helpers for consistent risk communication across locales.

/** Supported risk levels (same enum as TaxonomyAction.riskLevel) */
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Supported locales for risk label translations */
export type RiskLocale = "en" | "de";

/** A resolved risk label with display properties */
export interface RiskLabelInfo {
  /** The original risk level */
  level: RiskLevel;
  /** Translated human-readable label */
  label: string;
  /** Hex color suitable for badges / indicators */
  color: string;
  /** Hex color for text on the badge background */
  textColor: string;
  /** Optional icon name (from a standard icon set like Lucide) */
  icon: string;
  /** Numeric sort order (0 = lowest risk) */
  sortOrder: number;
}

// ── i18n string resources ──────────────────────────────────────

const labels: Record<RiskLocale, Record<RiskLevel, string>> = {
  en: {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
  },
  de: {
    LOW: "Niedrig",
    MEDIUM: "Mittel",
    HIGH: "Hoch",
    CRITICAL: "Kritisch",
  },
};

// ── Visual properties ──────────────────────────────────────────

const colors: Record<RiskLevel, { color: string; textColor: string }> = {
  LOW: { color: "#22c55e", textColor: "#052e16" },
  MEDIUM: { color: "#eab308", textColor: "#422006" },
  HIGH: { color: "#f97316", textColor: "#431407" },
  CRITICAL: { color: "#ef4444", textColor: "#ffffff" },
};

const icons: Record<RiskLevel, string> = {
  LOW: "shield-check",
  MEDIUM: "shield-alert",
  HIGH: "alert-triangle",
  CRITICAL: "alert-octagon",
};

const sortOrders: Record<RiskLevel, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
};

// ── Public API ─────────────────────────────────────────────────

/**
 * Get the localised label for a risk level.
 *
 * @param riskLevel - One of LOW, MEDIUM, HIGH, CRITICAL
 * @param locale - Target locale (default: "en")
 * @returns The translated risk label string
 *
 * @example
 * ```ts
 * riskLabel("HIGH", "de"); // "Hoch"
 * riskLabel("LOW");        // "Low"
 * ```
 */
export function riskLabel(riskLevel: RiskLevel, locale: RiskLocale = "en"): string {
  const localeLabels = labels[locale] ?? labels.en;
  return localeLabels[riskLevel] ?? riskLevel;
}

/**
 * Get the full risk label info including color, icon, and sort order.
 *
 * @param riskLevel - One of LOW, MEDIUM, HIGH, CRITICAL
 * @param locale - Target locale (default: "en")
 * @returns Complete risk label info for UX rendering
 *
 * @example
 * ```ts
 * const info = riskLabelInfo("CRITICAL", "de");
 * // { level: "CRITICAL", label: "Kritisch", color: "#ef4444", ... }
 * ```
 */
export function riskLabelInfo(riskLevel: RiskLevel, locale: RiskLocale = "en"): RiskLabelInfo {
  return {
    level: riskLevel,
    label: riskLabel(riskLevel, locale),
    ...colors[riskLevel],
    icon: icons[riskLevel],
    sortOrder: sortOrders[riskLevel],
  };
}

/**
 * Get all risk levels with their labels, sorted from lowest to highest risk.
 *
 * @param locale - Target locale (default: "en")
 * @returns Array of RiskLabelInfo sorted by sortOrder
 */
export function allRiskLabels(locale: RiskLocale = "en"): RiskLabelInfo[] {
  const levels: RiskLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  return levels.map((level) => riskLabelInfo(level, locale));
}

/**
 * Get the list of supported locales.
 */
export function supportedLocales(): RiskLocale[] {
  return Object.keys(labels) as RiskLocale[];
}
