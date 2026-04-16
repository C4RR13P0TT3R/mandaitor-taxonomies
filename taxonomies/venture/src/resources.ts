// @mandaitor/taxonomy-venture — Resource patterns
//
// Resource patterns follow a venture workflow hierarchy:
// fund → startup → round/data room → portfolio reporting → investor interactions
//
// Pattern syntax: venture:startup:{startupId}/round:{roundId}/*

import type { TaxonomyResourcePattern } from "@mandaitor/taxonomy-core";

export const VENTURE_RESOURCES: TaxonomyResourcePattern[] = [
  {
    name: "fund-thesis",
    pattern: "venture:fund:{fundId}/thesis:{thesisId}/*",
    description:
      "Resources scoped to a specific investment thesis or conviction area within a fund",
    parameters: [
      { name: "fundId", type: "string", description: "Fund identifier", required: true },
      { name: "thesisId", type: "string", description: "Investment thesis identifier", required: true },
    ],
  },
  {
    name: "startup-round",
    pattern: "venture:startup:{startupId}/round:{roundId}/*",
    description:
      "Resources scoped to a startup and a specific financing round or opportunity review",
    parameters: [
      { name: "startupId", type: "string", description: "Startup identifier", required: true },
      { name: "roundId", type: "string", description: "Funding round identifier", required: true },
    ],
  },
  {
    name: "startup-dataroom",
    pattern: "venture:startup:{startupId}/dataroom:{roomId}/*",
    description:
      "Resources scoped to a startup diligence or fundraising data room",
    parameters: [
      { name: "startupId", type: "string", description: "Startup identifier", required: true },
      { name: "roomId", type: "string", description: "Data room identifier", required: true },
    ],
  },
  {
    name: "startup-wide",
    pattern: "venture:startup:{startupId}/*",
    description:
      "Broad startup-wide scope for multi-step founder support, screening, and diligence workflows",
    parameters: [
      { name: "startupId", type: "string", description: "Startup identifier", required: true },
    ],
  },
  {
    name: "portfolio-report",
    pattern: "venture:portfolio:{companyId}/report:{reportId}",
    description:
      "A specific portfolio company monitoring or board-style report",
    parameters: [
      { name: "companyId", type: "string", description: "Portfolio company identifier", required: true },
      { name: "reportId", type: "string", description: "Portfolio report identifier", required: true },
    ],
  },
  {
    name: "investor-interaction",
    pattern: "venture:investor:{investorId}/interaction:{interactionId}",
    description:
      "A specific investor communication or matching interaction record",
    parameters: [
      { name: "investorId", type: "string", description: "Investor identifier", required: true },
      { name: "interactionId", type: "string", description: "Interaction identifier", required: true },
    ],
  },
];
