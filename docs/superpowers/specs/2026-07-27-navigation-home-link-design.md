# Persistent Home Wordmark and Active Navigation Design

## Context

The shared `Navigation` currently changes its left-side control by route:

- Home shows an unlinked `Spencer Presley` wordmark.
- Every inner page replaces the wordmark with an icon-only back arrow linking
  to Home.
- The right side always contains Projects, Contact, and Resume.

The container uses `flex-row-reverse` because the right-side navigation appears
before the left-side control in the DOM. Simply turning the wordmark into a link
would therefore create a keyboard order that disagrees with the visual order.

The generic `/projects/[slug]` route is a separate inconsistency: it does not
render the shared `Navigation` at all. It instead has a local project bar with
`All projects` and `Resume`, so the approved Projects route-family state cannot
exist on those detail pages until the shared header is mounted there.

## Goals

- Make `Spencer Presley` a persistent, conventional Home link on every route.
- Keep the right-side navigation stable across routes.
- Give the current right-side destination a visible non-color cue.
- Make keyboard order match the left-to-right visual order.
- Preserve the restrained visual language and existing mobile fit.

## Non-goals

- Add a separate `Home` item to the right-side navigation.
- Add a mobile menu, route-transition animation, or new dependency.
- Change page routing, the fixed-header behavior, or the scrolled-header
  background.
- Redesign the wordmark typography or the three destination labels.

## Navigation Structure

The implementation surfaces are:

- `app/components/nav.tsx` for the persistent wordmark, stable destination
  order, focus treatment, and active indicator.
- `app/projects/[slug]/page.tsx` to mount that shared navigation on generic
  project details.

The flex container will use normal row order. Its DOM and visual order will be:

1. A persistent `Spencer Presley` link to `/`.
2. The existing Projects, Contact, and Resume navigation.

The wordmark link will use `aria-current="page"` only on `/`. Its visible text
already provides an accessible name, so it does not need a replacement
`aria-label`. The inner-page `ArrowLeft` control and import will be removed.

There will be no conditional `Home` label on the right. The wordmark is the
single Home affordance everywhere. This avoids duplicate destinations, prevents
the navigation from changing shape between routes, and preserves space at
390-pixel mobile widths.

The generic project detail route keeps its local `All projects` context link
below the shared header. Its duplicate local `Resume` link is removed because
Resume is now consistently available in the shared navigation. Top spacing is
increased so the fixed header and local project control do not overlap.

## Current-Destination Treatment

The existing route grouping remains:

- `/projects` and every `/projects/*` detail route activate Projects.
- `/contact` activates Contact.
- `/resume` and `/resume/*` activate Resume.
- Home activates none of the three right-side destinations.

Each active destination keeps the existing zinc-100 text and
`aria-current="page"`. It also receives a thin, centered one-pixel bar beneath
the label. This is an intentional active indicator rather than a browser
text-decoration underline: it adds a non-color cue without making the compact
navigation visually heavy.

Inactive links remain zinc-400 and brighten on hover. The wordmark and all three
destination links receive explicit `focus-visible` rings with sufficient offset
from the text. Focus styling must not depend on hover or the active bar.

## Behavior and Degradation

Navigation continues to use `usePathname()` for local route state and fetches no
runtime data. On an unknown route, the wordmark remains available and none of
the three right-side destinations is marked current.

If client-side navigation is unavailable, every destination remains an ordinary
anchor emitted by Next.js and continues to work as a full-page navigation.

## Accessibility and Responsive Behavior

- DOM order and keyboard order are wordmark, Projects, Contact, Resume.
- Exactly one navigation destination uses `aria-current="page"` on Home,
  Projects, Contact, and Resume route families.
- The current right-side destination is distinguishable by both text contrast
  and the one-pixel indicator.
- The wordmark remains visible text rather than an icon-only Home control.
- The four links fit without horizontal overflow at 390 CSS pixels.
- Focus rings remain visible against both transparent and scrolled header
  backgrounds.

## Verification

1. Run the `navigation` runtime contract against the pre-change production
   build and confirm that Home and `/projects/gloss` fail for their respective
   missing shared-header behavior.
2. Run the same contract against the changed production build and confirm link
   order, destinations, `aria-current`, and active-indicator behavior on every
   route family.
3. Run Rome on `app/components/nav.tsx`,
   `app/projects/[slug]/page.tsx`, and `scripts/site-contract.mjs`.
4. Run `pnpm typecheck` and `pnpm build`.
5. At 1440×900 and 390×844, inspect `/`, `/projects/gloss`, `/contact`, and
   `/resume/backend-platform`.
6. Confirm the visible labels are always `Spencer Presley`, Projects, Contact,
   and Resume in that order.
7. Confirm Home marks the wordmark current; each inner route marks only its
   matching right-side destination current.
8. Confirm the matching right-side destination computes a one-pixel active
   indicator and inactive destinations do not.
9. Tab through the header and confirm focus order matches visual order and every
   focus ring is visible.
10. Confirm no horizontal overflow or browser-console error at either viewport.
11. Push without force, wait for the exact-SHA Vercel deployment to reach Ready,
    and repeat the navigation and console checks on the custom domain.
