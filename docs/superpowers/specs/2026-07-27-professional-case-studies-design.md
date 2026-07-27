# Professional Case Studies Design

**Date:** 2026-07-27
**Status:** Approved for implementation

## Context

The homepage and Projects index currently present Spencer's two professional
projects as external-only cards:

- CrunchAtlas / AtlasCyber links to the CrunchAtlas marketing site.
- AtlasConnect links to Pitchfire, the product's current name.

That makes the most substantial production work less inspectable than the
public side projects. The resume contains more technical detail, but it must
remain selective and role-oriented. The portfolio can explain the engineering
mechanisms and ownership boundaries in more depth without becoming an internal
architecture dump.

The existing generic project-detail renderer is intentionally optimized for
public projects. It imposes one fixed sequence of project facts, technology
pills, prose sections, engineering-decision cards, and an outcome. The
professional work needs a different structure because it spans multiple
products, private repositories, explicit confidentiality boundaries, and
different kinds of visual evidence.

AtlasCyber's current implementation is split across two divergent lines of
development:

- `main` contains newer product UI, Rust analysis and visualization integration,
  deployment-readiness work, and other current product changes.
- `llmserving-server-path-cutover` contains the current local model-serving,
  taskqueue resource-admission, worker-supervision, and agent-runtime work.

The case study must synthesize both sources rather than presenting either branch
as the complete current system.

## Audience and Editorial Goal

The primary audience remains hiring managers and recruiters, with enough
mechanism-level detail for a technical peer to distinguish production systems
work from an AI demo.

The pages should answer:

1. What problem did the product solve?
2. What did Spencer personally own?
3. Which engineering constraints made the work difficult?
4. Which mechanisms made the resulting system reliable?
5. What can be shown publicly, and where is the confidentiality boundary?

The portfolio has more room than a resume, but it still requires editorial
selection. It must emphasize the strongest mechanisms and outcomes rather than
cataloging every feature, dependency, commit, test, or implementation detail.

## Goals

- Add internal case studies at `/projects/crunchatlas` and
  `/projects/atlasconnect`.
- Make the professional cards on Home and Projects link to those internal
  routes.
- Keep company/product marketing sites as secondary external links.
- Describe ownership precisely without claiming authorship of inherited or
  unrelated work.
- Explain enough system mechanics to establish technical depth without exposing
  customer data, proprietary detection logic, exact offensive procedures, or
  private source.
- Use public marketing screenshots only where they materially strengthen the
  case.
- Keep all content statically authored in TypeScript and easy to edit.
- Give the two pages distinct editorial presentations while preserving the
  site's zinc base, typography, navigation, focus behavior, and restrained
  atmosphere.
- Avoid project counts, commit counts, test counts, lines-of-code counts, and
  other résumé-stat theater.

## Non-goals

- Add MDX, a CMS, a database, a content API, or runtime content loading.
- Build a generic rich-content schema that recreates a CMS inside TypeScript.
- Publish private repository links, internal file paths, customer information,
  credentials, proprietary prompts, detector algorithms, or a rebuildable
  offensive workflow.
- Present either AtlasCyber branch as the sole source of current truth.
- Create standalone PurpleHaze or CrunchSense pages.
- Redesign the public open-source project-detail renderer.
- Turn the case studies into exhaustive product documentation.
- Scrape, copy, or depend on the current Pitchfire marketing site's assets.
- Make claims about commercial outcomes or adoption that are not supported by
  the approved resume evidence.

## Information Architecture

### Routes

- `/projects/crunchatlas`
  - Display title: **CrunchAtlas: AtlasCyber & PurpleHaze**
  - Primary subject: reliable local-first AI and backend infrastructure for
    security environments where ordinary cloud assumptions do not hold.
- `/projects/atlasconnect`
  - Display title: **AtlasConnect → Pitchfire**
  - Primary subject: the document-to-decision system Spencer built and operated
    during his tenure as sole developer and maintainer.

These are explicit static route files. Next.js static-route precedence allows
them to coexist with the existing `/projects/[slug]` public-project route.

### Entry points

The homepage CrunchAtlas preview will link to `/projects/crunchatlas`; its
CrunchAtlas marketing link remains a smaller secondary action.

Both professional cards on the Projects index will link to their internal case
studies. Each card retains a secondary external action:

- CrunchAtlas → `https://www.crunchatlas.com/`
- AtlasConnect → `https://www.pitchfire.com/`

The card renderers may share canonical metadata, but the homepage and Projects
index must retain distinct compositions. The homepage remains a concise proof
sequence; the Projects index remains the fuller catalog.

### Case-study navigation

Both pages use the shared site `Navigation` once the separately approved
persistent-wordmark navigation change is implemented. A local **All projects**
link appears at the start of the case-study content. The page footer links to
the other professional case study, then provides the standard route back to the
Projects index.

The company/product website is never the only way forward or back.

## Content and Component Architecture

Content remains hard-coded TypeScript.

`app/projects/professional-work-data.ts` owns canonical information reused by
Home, Projects, metadata generation, and the two case studies:

- slug and internal route
- company/product title
- period and status label
- concise card summary
- case-study lead
- exact role/ownership statement
- external links
- screenshot source and accessible alternative text where applicable
- short system-flow labels

It does not own an arbitrary array of polymorphic page blocks. Page composition
stays visible in the route files.

`app/projects/professional-case-study-ui.tsx` owns the small set of repeated
presentation primitives:

- case-study shell and atmosphere
- breadcrumb/back link
- hero metadata and ownership panel
- confidentiality disclosure
- numbered section heading
- ownership grid
- accessible system-flow diagram
- screenshot figure with caption
- engineering-decision card grid
- next-case-study footer

The two explicit page files compose those primitives with page-specific,
semantic sections. This keeps repeated behavior consistent without forcing
unrelated stories into the same layout or creating a miniature content
framework.

The shared data module must remain server-safe and contain no browser APIs.
The case-study pages fetch no runtime data and remain server components.

## CrunchAtlas Case Study

### Editorial direction

Working hero:

> **CrunchAtlas · AtlasCyber & PurpleHaze**
>
> # Reliable local AI where cloud assumptions break.
>
> I build the AI, backend, and execution infrastructure behind AtlasCyber,
> including the systems that keep long-running security agents bounded,
> observable, and useful on local and air-gapped hardware. I also built
> PurpleHaze end to end.

The final copy may be tightened during implementation, but it must preserve
these ownership boundaries:

- Spencer built the systems described on the page.
- Spencer built PurpleHaze end to end.
- Spencer built most of AtlasCyber's AI and backend platform; the page must not
  imply sole authorship of every AtlasCyber product surface.
- Spencer owned the AtlasCyber AWS footprint across GovCloud and commercial
  partitions.

### Up-front public boundary

A single visible disclosure near the hero states that the case study describes
system architecture and engineering mechanisms, while omitting customer data,
proprietary detection logic, exact offensive procedures, private prompts, and
private source.

The page should not repeat defensive redaction language under every section.
Individual screenshot captions only need to identify the images as public
marketing material.

### Chapter 1: The operating constraint

Establish why an ordinary hosted-LLM architecture was insufficient:

- local, on-premises, and air-gapped deployments
- constrained shared GPU capacity
- large evidence sets and long-running analysis
- security work that requires provenance and inspectable results
- failure modes that must remain observable after worker or process death

This chapter introduces the high-level system flow:

**Evidence → durable work admission → governed local agents → inspectable
analysis**

The visualization is semantic HTML/CSS, remains legible without animation, and
collapses into reading order on narrow screens.

### Chapter 2: AtlasCyber — making local agents operational

This is the spine of the page. It explains three connected mechanisms.

#### Governed model serving

- Declarative model/deployment configuration.
- Measured llama.cpp/llama-swap behavior rather than assumed defaults.
- Fail-closed validation that proves declared context and concurrency fit the
  available memory budget before launch.
- A single model-construction boundary that hides backend details from domain
  agents.
- Separate per-request serving ceilings and per-task operating budgets.

Do not publish exact production model names, private capacity values, prompt
content, or a deployment recipe sufficient to reproduce the internal
environment.

#### Durable heavy-work execution

- Postgres-native queues for observable AI-bound and CPU-bound work.
- Atomic claim behavior and dependency-aware job creation.
- Token-domain admission at claim time so multiple task shapes share finite
  local inference capacity without relying on worker count as a proxy.
- Worker, supervisor, and spawned-child separation with bounded termination and
  a sweeper for abandoned work.

The page may describe the sandbox as read-only, network-disabled, resource
bounded, and self-reaping. It must not claim perfect tenant isolation: the
current broad read-only media mount remains an internal boundary still being
narrowed.

#### Reusable agent runtime

- Exact token accounting and context-usage visibility.
- Tool-result eviction and context compaction.
- Parse and output-cap recovery.
- Streaming middleware and graph events into the product.
- Reusable runtime policy with domain behavior kept outside generic middleware.
- Per-run tool containers with explicit lifecycle ownership.

The emphasis is deterministic scaffolding around fallible local models, not
generic claims of autonomous intelligence.

### Chapter 3: Product proof

Use two approved public marketing screenshots:

- `campaign-assessment-dark.png`
- `case-agent-report-dark.png`

Optimized copies live under `public/projects/` with descriptive names and
alternatives. The figures show the product surface at a useful scale instead of
serving as decorative background texture.

The screenshot captions connect the infrastructure to observable product
behavior: evidence-backed campaign assessment and an agent-generated report.
They do not assert that every visible pixel was authored by Spencer.

### Chapter 4: PurpleHaze — end-to-end autonomous engagement

PurpleHaze receives a full chapter because Spencer built the product end to
end. The public narrative covers:

- engagement and scan orchestration
- stateful offensive sessions that survive long runs and context compaction
- workflow and scan chaining
- durable tool-execution records
- schema-validated OWASP, NIST, and executive reporting
- generated report artifacts

The chapter uses a high-level semantic flow rather than a private screenshot:

**Scope → controlled execution → persistent session state → validated report**

It must not enumerate the exact offensive tool inventory, publish private
prompts, or provide a rebuildable exploitation workflow.

### Chapter 5: Delivery and edge reliability

This is a supporting section, not a third equal narrative.

#### AtlasCyber operational ownership

Briefly establish ownership across the relevant AWS deployment surface:
GovCloud and commercial partitions, compute, storage, IAM, VPC networking,
content delivery, and the reverse-proxy/tunnel fleet. Keep this at the system
boundary level rather than listing configuration internals.

#### CrunchSense v3

Label it as the completed stability-oriented Rust rewrite foundation for the
AtlasCyber edge sensor, not full legacy parity or an actively expanding
standalone product.

Include:

- split `crunchsensed` daemon and optional Tauri client so capture survives UI
  failure
- BPF-filtered packet capture and crash-safe rotation
- persistent SQLite WAL upload queue with bounded retry/dead-letter behavior
- quota, retention, and filesystem-pressure guards
- machine-bound encrypted upload credentials and authenticated loopback API
- hardened systemd packaging and Linux package/service smoke coverage

Do not use a standalone CrunchSense hero, imply complete v2 parity, or add
implementation counts.

### Outcome

Close by tying the mechanisms together: the work turned local models and
security tools into an operable system across cloud, on-premises, and
air-gapped environments. The external CrunchAtlas link is a secondary action.

Do not claim customer count, revenue, deployment count, detection improvement,
or other unsupported commercial metrics.

## AtlasConnect Case Study

### Editorial direction

Working hero:

> **AtlasConnect · now Pitchfire**
>
> # From incoming pitch deck to an investment decision.
>
> I was the sole developer and maintainer of an inherited Django and React
> product, building the ingestion, AI research, fit evaluation, and firm
> workflow that moved an opportunity from raw submission to a structured
> decision.

The ownership statement must preserve both facts:

- Spencer was the sole developer and maintainer during his tenure.
- Spencer inherited the original product and must not be described as its sole
  original author.

### Process-led visual language

This page uses a sky-to-violet atmosphere and a process-led composition rather
than borrowing CrunchAtlas's screenshot-led presentation.

Its primary visual is a semantic pipeline:

**Intake → extraction → enrichment and research → firm decision**

Each stage expands into concise mechanism-level detail as the reader moves down
the page. No current Pitchfire website assets are copied or scraped.

### Chapter 1: Intake

Describe the multiple production entry paths:

- embedded intake forms
- direct file uploads
- DocSend import
- email intake through the AWS Lambda path Spencer built

The email path is user-confirmed and lives outside the repositories available
on this machine. Its absence from the checked-out Django and React repositories
must not be treated as evidence that it did not exist.

### Chapter 2: Turning messy documents into structured data

Explain:

- native extraction for PDF, DOCX, PPTX, images, and text
- quality/glyph detection rather than blindly trusting native extraction
- selective or full OCR fallback when required
- parallelized OCR for usable latency
- structured opportunity-field population with visible progress

Do not publish private extraction prompts, customer documents, or temporary
debug artifacts from the inherited/evolving codebase.

### Chapter 3: Fit and research

Describe:

- preparation of firm and opportunity context
- concurrent analyses followed by synthesis
- thesis-fit evaluation and structured match detail
- bounded research-agent navigation
- market and leadership research
- background execution with realtime progress

Keep exact scoring prompts, weights, and research instructions private. The
public value is the staged, observable decision pipeline—not the prompt text.

### Chapter 4: Firm workflow

Connect the AI pipeline to the ordinary product work required to make it useful:

- opportunity stages and pipeline movement
- voting and requests
- discussions and reminders
- notifications
- progress and completion feedback

This section prevents the case study from presenting the product as a loose
collection of LLM calls.

### Outcome

State that the work is now marketed as Pitchfire and link to
`https://www.pitchfire.com/`. Do not imply current employment, ownership of the
rebrand, or unsupported business outcomes.

## Visual System

Both pages retain:

- zinc-950 base
- Cal Sans display headings
- mono eyebrow labels
- restrained radial atmosphere
- subtle grid texture
- rounded border language
- ordinary hover/focus transitions

CrunchAtlas uses amber and rose accents with screenshot-led chapters.
AtlasConnect uses sky and violet accents with process-led diagrams.

The differences are structural as well as chromatic. The two routes must not be
the same renderer with different copy and accent classes.

No blocking entrance animation, particle effect, scroll-jacking, parallax, or
essential motion is introduced.

## Metadata and Linking

Each route provides:

- unique title and description
- canonical internal URL
- article Open Graph metadata
- CrunchAtlas Open Graph image from the approved marketing screenshot
- no fabricated AtlasConnect image solely to satisfy social metadata

Internal links use Next.js `Link`. External company/product links open in a new
tab with `rel="noreferrer"`. Screenshot alternatives describe visible content
and do not repeat adjacent captions verbatim.

The public-project "next case study" cycle remains unchanged. The professional
pages link to each other explicitly rather than being inserted into the
open-source project array.

## Failure and Degradation Behavior

The routes fetch no runtime data and render useful content without client
hydration. If a marketing screenshot fails, the CrunchAtlas page retains its
caption and surrounding technical explanation. If either external marketing
site is unavailable, all internal case-study content and navigation still work.

No page depends on Vercel storage, Redis, a database, private repositories, or
an external content service at runtime.

## Accessibility and Responsive Behavior

- Heading levels follow document order and every major chapter has a stable
  accessible heading.
- Flow diagrams use semantic ordered content; arrows and connector lines are
  decorative.
- Screenshot figures use descriptive alternatives and visible captions.
- Color is never the only ownership, status, flow, or navigation cue.
- Focus states remain visible against each atmosphere.
- External links communicate their destination in visible text.
- At 390 CSS pixels, flow stages collapse into reading order with no horizontal
  scrolling or clipped copy.
- At 1440 CSS pixels, prose line length remains bounded and screenshots retain a
  useful readable scale.
- Reduced-motion users lose no information because motion is nonessential.

## Verification

1. Run source-contract checks confirming:
   - both explicit routes exist
   - Home and Projects link to the internal routes
   - both external marketing links remain available as secondary actions
   - the professional content does not enter the public `projects` array
   - no MDX, database, content API, or runtime fetch is introduced
2. Run the repository formatter/linter on every changed TypeScript and TSX file.
3. Run `pnpm typecheck`.
4. Run `pnpm build` and confirm both routes are statically generated.
5. Inspect `/`, `/projects`, `/projects/crunchatlas`, and
   `/projects/atlasconnect` at 1440×900 and 390×844.
6. Confirm Home and Projects retain distinct professional-preview compositions.
7. Confirm both case studies use the persistent shared navigation and visible
   **All projects** links.
8. Confirm the CrunchAtlas screenshots are readable, captioned, and sourced
   only from approved public marketing images.
9. Confirm every flow remains understandable with CSS disabled and in narrow
   reading order.
10. Tab through all links and verify focus visibility and sensible order.
11. Confirm no horizontal overflow, missing-image warning, hydration error, or
    browser-console error.
12. Search the implementation for private repository paths, customer names,
    proprietary prompt text, exact detector logic, and unsupported counts
    before committing.
13. Push without force, wait for the exact-SHA Vercel deployment to reach
    `Ready`, then repeat route, viewport, link, and console checks on the custom
    domain.
