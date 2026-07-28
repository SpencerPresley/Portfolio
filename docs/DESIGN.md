# Portfolio design

This document records durable decisions that are easy to lose when changing the
site. Project copy, status, dates, and links remain canonical in the TypeScript
source rather than being duplicated here.

## Content model

This is a small, owner-edited portfolio. Its content is intentionally
hard-coded and typed:

| Content | Canonical source | Rendering |
| --- | --- | --- |
| Contact details | `app/site-data.ts` | Home and Contact |
| Resume variants | `app/resume/resume-data.ts` | Shared web-native resume view |
| Public projects and contributions | `app/projects/project-data.ts` | Projects index and `/projects/[slug]` |
| Professional-work summaries | `app/projects/professional-work-data.ts` | Home, Projects, and case-study framing |
| Professional case-study detail | Dedicated route files | `/projects/crunchatlas` and `/projects/atlasconnect` |

There is no database, Redis dependency, CMS, MDX layer, or runtime content
fetch. At this scale those systems would add synchronization and deployment
failure modes without improving the editing workflow. Revisit that decision
only if someone other than Spencer needs to edit content without touching code,
or if the volume of content makes typed records meaningfully cumbersome.

Public projects share a typed detail renderer because their information shape
is consistent. The professional case studies keep dedicated route components:
their evidence, disclosure boundaries, and presentation are intentionally
different and should not be forced into one generic schema.

## Information architecture

- Home is an immediate editorial proof page, not a splash screen. It should
  quickly establish Spencer's current technical focus and lead with the
  strongest work.
- Projects is the complete catalog. Its professional-work cards and public
  project cards are denser than the Home treatments.
- Resume is web-native, has AI/LLM and backend/platform variants, and retains
  downloadable PDFs as an option.
- Contact makes LinkedIn the primary first-contact path because it gives useful
  identity and company context. Email and GitHub are direct and technical
  fallbacks.

Home and Projects may reference the same work, but they should not reuse the
exact same composition. The distinction is intentional: Home curates an
argument; Projects supports browsing.

## Navigation and visual system

- “Spencer Presley” is the persistent Home link at the top left.
- Projects, Contact, and Resume remain on the right. Do not add a redundant
  right-side Home item.
- The active right-side destination is underlined. On Home, the wordmark alone
  carries the current-page state.
- Page atmospheres shift subtly through neighboring hues while preserving one
  dark visual system.
- Decorative motion must not block access to the content. The old particle
  introduction was removed because it delayed the page and looked like a
  template effect rather than evidence of the work.
- Mobile layouts must remain usable at 320–390 px. In particular, the contact
  email stays on one line without escaping its card.

## Professional-work boundaries

Private professional work should describe mechanisms and ownership without
publishing private implementation details.

- CrunchAtlas is screenshot-led because public marketing material exists. It
  can discuss AtlasCyber, PurpleHaze, local model serving and agent
  infrastructure, AWS ownership, and the CrunchSense rewrite at the system
  boundary.
- AtlasConnect is process-led and intentionally image-free. Its useful proof is
  the intake-to-decision pipeline, not a fabricated or private product
  screenshot.
- External product sites are evidence of what exists now, not claims of current
  employment, rebrand ownership, or sole authorship beyond the explicitly
  stated tenure and scope.
- Omit customer data, private prompts, scoring weights, proprietary detection
  logic, exact offensive procedures, private source code, local filesystem
  paths, and private branch names.
- Do not invent counts, revenue, throughput, or performance claims to make a
  case study sound larger. Concrete mechanisms are stronger evidence.

## Project lifecycle and links

Use the smallest honest lifecycle label: active, shipped, archived, or
prototype. A completed hackathon or internship project does not need to look
active. Remove dead website links rather than preserving them for visual
symmetry. Public repositories and live product sites should be secondary
evidence, while the internal case-study route remains the primary path through
the portfolio.

Do not copy individual project facts into this document. Update the canonical
record instead.

## Brand assets

The editable sources for the social card and icon live in
`assets/branding/`. Their derived PNGs are public assets referenced from
`app/layout.tsx`.

The public filenames are Spencer-specific so social platforms fetch fresh
previews instead of reusing cached images from the original portfolio
template. If the design changes, update the SVG source, regenerate its PNG, and
bump the public filename and metadata URL so preview caches cannot retain the
previous image. Keep the social metadata dimensions and alternative text
accurate.

```sh
rsvg-convert --width 1200 --height 630 --format png --output public/spencer-presley-og.png assets/branding/og.svg
rsvg-convert --width 512 --height 512 --format png --output public/spencer-presley-icon.png assets/branding/favicon.svg
```

## Verification

Run the static checks for every meaningful content or layout change:

```sh
pnpm typecheck
pnpm build
```

`scripts/site-contract.mjs` contains focused rendered-page contracts. With the
production build running on port 3100, run the suites relevant to the change:

```sh
PORT=3100 pnpm start
pnpm test:site navigation
pnpm test:site branding
pnpm test:site chain-composer
pnpm test:site contact
pnpm test:site crunchatlas
pnpm test:site atlasconnect
pnpm test:site previews
```

Before deployment, inspect the affected routes in a real browser at desktop and
mobile widths. Check current-navigation state, keyboard focus, horizontal
overflow, image loading, and readable contrast. Private-work changes also need
a source/output scan for sensitive paths, internal identifiers, and unsupported
claims.
