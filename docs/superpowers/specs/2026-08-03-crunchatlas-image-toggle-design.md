# CrunchAtlas image toggle

## Goal

Temporarily hide CrunchAtlas marketing images across the portfolio while
preserving a single, deliberate switch that restores every site surface.

## Design

The shared professional-work data reads `SHOW_CRUNCHATLAS_IMAGES` and treats
only the exact string `true` as enabled. An unset variable, `false`, or any
unrecognized value removes the CrunchAtlas image from the Home and Projects
cards, removes the CrunchAtlas Open Graph image, and hides the entire Section
03 “Product proof” block, including its heading, introduction, both
screenshots, and both captions.

The flag remains server-only. It does not use the `NEXT_PUBLIC_` prefix and does
not opt the route into dynamic rendering. The route therefore remains statically
rendered, and the value is selected for each build.

The flag does not remove the public image assets, so direct asset URLs continue
to work and setting the flag to `true` can restore every rendered reference.
When the Home image is disabled, its professional-work card collapses to the
existing text content rather than rendering an empty image region.

## Operation

- Default or hidden: leave `SHOW_CRUNCHATLAS_IMAGES` unset or set it to `false`.
- Visible locally: build or run with `SHOW_CRUNCHATLAS_IMAGES=true`.
- Visible on Vercel: set `SHOW_CRUNCHATLAS_IMAGES=true` for the target environment
  and create a new deployment.
- Hidden again on Vercel: remove the variable or set it to `false`, then create a
  new deployment.

Vercel environment changes apply only to new deployments; they do not mutate an
existing deployment.

## Verification

The rendered-page contracts will assert that Home, Projects, and CrunchAtlas
HTML contain no CrunchAtlas image references under the default configuration.
Verification will also build with `SHOW_CRUNCHATLAS_IMAGES=true` and confirm
that the Home and Projects preview image, Open Graph image, Section 03, and both
case-study screenshots return. Type checking and the production build must
pass.
