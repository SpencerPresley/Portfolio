# CrunchAtlas image toggle

## Goal

Temporarily hide both screenshots on `/projects/crunchatlas` while preserving a
single, deliberate switch that can restore them without changing the page
structure.

## Design

The server component reads `SHOW_CRUNCHATLAS_IMAGES` and treats only the exact
string `true` as enabled. An unset variable, `false`, or any unrecognized value
hides the entire Section 03 “Product proof” block, including its heading,
introduction, both screenshots, and both captions.

The flag remains server-only. It does not use the `NEXT_PUBLIC_` prefix and does
not opt the route into dynamic rendering. The route therefore remains statically
rendered, and the value is selected for each build.

The flag affects only the rendered body of `/projects/crunchatlas`. It does not
remove the public image assets, change the Open Graph image, or change the
CrunchAtlas preview used by Home or Projects.

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

The CrunchAtlas rendered-page contract will assert that Section 03 and both
image references are absent under the default configuration. Verification will
also build with `SHOW_CRUNCHATLAS_IMAGES=true` and confirm that the section and
both image references return. Type checking and the production build must pass.
