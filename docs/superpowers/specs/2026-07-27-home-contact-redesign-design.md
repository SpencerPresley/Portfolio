# Homepage and Contact Redesign

**Date:** 2026-07-27
**Status:** Approved for implementation

## Context

The Projects and Resume pages now establish the site's strongest visual and
editorial language. The homepage and Contact page predate that work.

The current homepage is a full-viewport splash screen containing Spencer's name,
three navigation links, and a particle canvas. Its three-second entrance
animations keep the navigation and particles at zero opacity for roughly the
first 2.25 seconds. Even after the animation finishes, the page provides no
positioning, project evidence, or primary next step.

The current Contact page presents email, GitHub, and LinkedIn as three equal
mouse-reactive cards. It uses an obsolete email address and an older visual
system that no longer matches Projects or Resume.

## Audience and Goal

The homepage primarily serves hiring managers and recruiters. Technical peers
are more likely to arrive through GitHub or a direct project link.

The redesign must let a visitor answer three questions without waiting or
guessing:

1. What kind of engineer is Spencer?
2. What is the strongest evidence?
3. Where should the visitor go next?

The page should still reward technical readers with direct routes into the
public case studies.

## Goals

- Make navigation and useful content available immediately.
- Position Spencer around reliable AI, backend, and platform systems.
- Lead with current professional work, then show the two strongest inspectable
  technical projects.
- Bring Contact into the Projects/Resume visual system.
- Make `spencerpresley96@gmail.com` the canonical email everywhere.
- Eliminate unnecessary client-side animation and duplicated contact data.

## Non-goals

- Rebuild the Projects or Resume information architecture.
- Add a CMS, database, contact form, availability status, or new analytics.
- Add unsupported professional claims or expose more private CrunchAtlas work.
- Turn the homepage into a second complete projects index.
- Preserve the particle effect merely for continuity with the previous design.

## Homepage

### Visual language

The page will use the same zinc background, radial color washes, subtle grid,
Cal Sans display typography, mono labels, rounded borders, and restrained accent
colors already established by Projects.

The existing fixed `Navigation` component remains visible from first paint.
There is no splash gate, canvas, delayed opacity, or entrance sequence.
Interaction is limited to short hover and focus transitions that convey no
information unavailable to reduced-motion users.

### Hero

The hero appears below the fixed navigation and does not require a full viewport.

Proposed copy:

> **Spencer Presley · Software engineer**
>
> # AI and backend systems that hold up outside the demo.
>
> I build evidence-grounded agents, local-first inference, retrieval systems,
> and the backend infrastructure that keeps them reliable.

Primary actions:

- **Explore projects** → `/projects`
- **View resume** → `/resume`

Contact remains in the visible primary navigation rather than becoming a third
equal hero button.

### Selected work

The homepage contains one concise proof section rather than reproducing the full
Projects page.

1. **CrunchAtlas / AtlasCyber** is the primary, full-width preview.
   - Label it as current professional work.
   - Reuse the approved redacted marketing image.
   - Summarize Spencer's AI and backend infrastructure work without expanding
     the existing public boundary.
   - Link to the public CrunchAtlas site.
2. **gloss** and the **Celery Fork-Safety Investigation** appear as equal
   technical case-study cards.
   - Reuse their existing typed project records and `ProjectCard` presentation.
   - Link directly to their internal case-study routes.

This ordering communicates production scope first, followed by public evidence
that a visitor can inspect in depth.

### Closing contact callout

A compact final callout routes visitors to `/contact`. It should not claim that
Spencer is actively looking or available. Its job is only to make the next step
obvious after the proof section.

## Contact

### Structure

The page uses the shared navigation and the same background treatment as the
homepage and Projects.

Header:

> **Contact**
>
> # Let's talk.
>
> Email is the best way to reach me. You can also find my public work on GitHub
> and connect on LinkedIn.

The actions are intentionally unequal:

1. A large primary email card links to
   `mailto:spencerpresley96@gmail.com` and displays the full address.
2. GitHub and LinkedIn appear as two smaller secondary cards with their handles
   and external links.

The cards use ordinary border, color, and icon transitions. They do not use a
mouse-following mask, perpetual animation, or equal visual weight for channels
that do not serve the same purpose.

### Shared contact data

Email, GitHub, and LinkedIn values move into one small shared TypeScript object.
Resume and Contact consume that object so the public identity cannot drift
between pages. The homepage may consume the email or Contact route but must not
introduce another literal copy of the address.

## Component and Dependency Changes

The implementation will:

- Replace the homepage splash markup with the server-rendered editorial page.
- Replace the old Contact cards with page-local static presentation.
- Reuse `Navigation`, `ProjectCard`, and the existing typed project records.
- Remove `app/components/particles.tsx`.
- Remove `util/mouse.ts` after confirming it has no remaining consumers.
- Remove `app/components/card.tsx` after confirming it has no remaining
  consumers.
- Remove the homepage-only custom entrance animations and keyframes from
  `tailwind.config.js`.
- Remove `framer-motion` and update the lockfile after confirming no remaining
  imports.

Home and Contact remain server components except for the already-client-side
shared navigation.

## Failure and Degradation Behavior

The redesigned pages fetch no runtime data, so their primary content does not
depend on an API, browser animation, or successful client hydration. The
CrunchAtlas preview retains meaningful text and a descriptive image alternative
if its visual cannot be displayed. Every external destination is an ordinary
link; one unavailable third-party site must not affect the rest of either page.
The email address remains visible and copyable even when the visitor has no
configured `mailto:` handler.

## Accessibility and Responsive Behavior

- All navigation and calls to action are usable immediately from the keyboard.
- Focus treatments meet the visual conventions already used by Projects.
- The page hierarchy contains one `h1` per route and ordered section headings.
- External links identify their destination and use safe new-tab attributes.
- The email action uses `mailto:` without unnecessarily opening a new tab.
- Selected-work cards stack cleanly on narrow screens.
- No horizontal scrolling is introduced at 390 CSS pixels.
- Removing the canvas means reduced-motion users receive the complete design
  without a degraded alternate state.

## Verification

Before committing the implementation:

1. Run the formatter/checker on every changed source file.
2. Run `pnpm typecheck`.
3. Run `pnpm build` and confirm the home, Contact, Projects, and project-detail
   routes are generated successfully.
4. Verify desktop and 390-pixel mobile renders for Home and Contact.
5. Confirm there is no horizontal overflow or browser-console error.
6. Exercise the Projects, Resume, Contact, email, GitHub, LinkedIn, CrunchAtlas,
   gloss, and Celery links.
7. Search the rendered source for `spencer@spencerpresley.com` and confirm no
   stale public occurrence remains.
8. Confirm `framer-motion`, `Particles`, the mouse hook, and the old `Card` have
   no remaining imports before deleting them.

After the implementation is pushed, wait for the production Vercel deployment
to reach Ready and verify the custom-domain routes.
