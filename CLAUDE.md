# Working agreements

These apply across all six Mandaitor repositories (`core`, `dashboard`, `ops`,
`public`, `taxonomies`, `trust`). The estate-wide half of this file is kept
identical in each; anything below **This repository** is local.

Start of session: read `mandaitor-ops/docs/session-handoff.md` when it is
available in the checkout. It carries the live state, what is blocked on whom,
and the mistakes made in earlier sessions that are worth not repeating. Update
it before you finish a session that changed anything.

## Always open a pull request when pushing code

Every push to a feature branch gets a PR opened in the same turn — not left for
Oliver to open. Do not wait to be asked, and do not batch several pushes behind
one eventual PR.

If PR creation is unavailable (no `gh` CLI, GitHub MCP tools absent, or the API
relay returns *"GitHub access is not enabled for this session"*), say so in the
reply, quote the reason, and hand over a ready-to-use compare link plus the PR
title and body. Do not silently skip it.

## House conventions

- Validator exit codes: `0` clean, `1` errors, `2` warnings only. A `&&` chain
  stops at the first exit 2, which is why a chained validate run ends early.
- Never flip a gate from warning to error while the backlog it would red-line is
  still open.
- A probe that cannot reach its target reports `skipped`, never `pass` and never
  `fail`. Only a real refutation is a `fail`.
- Compare YAML and lockfile changes as parsed structures, not as text.
  Reserialisation has silently changed value types here before.
- **A document that plans work names the condition under which it should be
  deleted.** Plans decay at the rate the work lands, and nothing else in the
  repository notices. A dated snapshot (an audit, an assessment) is never edited
  after the fact — a snapshot that changes is not evidence — but its header
  carries a superseded-by line.
- **Anything that speaks for the product has one copy.** The security policy
  lives in `mandaitor-core/SECURITY.md`; other repositories reference it and add
  only their own scope. Contributing guides may legitimately differ, because
  they describe a repository's own build.
- **Published documentation is the contract.** A behaviour change that makes a
  page in `mandaitor-public` wrong ships with the doc fix in the same turn, not
  after someone notices.

## Verifying before you push

Run what CI runs, from the directory CI runs it in — not from the repository
root, which collects unbuilt packages and unrelated suites. Install first: an
absent `node_modules` fails with a module-not-found that reads like a broken
test.

## This repository — mandaitor-taxonomies

Eight industry taxonomy packages (aviation, construction, defence-isr,
healthcare, maritime, realestate, space, venture) plus `@mandaitor/taxonomy-core`.
Published to npm on release. `pnpm`, not `npm`.

```
pnpm test        # builds taxonomy-core first, then runs every package
pnpm lint
pnpm validate    # node scripts/validate-all.mjs
```

- `taxonomy-core` must be built before the other packages typecheck — every
  script here does that first, so use the scripts rather than a bare `vitest`.
- **A change to `taxonomy-core` types ripples out of this repository**: all eight
  packages, `mandaitor-core`'s `validate-taxonomy.ts` and SDK, and the generated
  pages under `mandaitor-public/docs/taxonomies/generated/`. See the change
  impact matrix in `mandaitor-core/ECOSYSTEM.md`.
- Taxonomies define the vocabulary mandates are written against, so an overly
  permissive resource pattern or a constraint template that does not bound what
  it claims to is a security issue, not a content one.
- `research/` holds completed selection research kept as a template. It is not
  outstanding work; its header says so.
