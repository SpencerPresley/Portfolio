# CrunchAtlas Image Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the `/projects/crunchatlas` Product proof section by default and restore it only when `SHOW_CRUNCHATLAS_IMAGES=true` is present at build time.

**Architecture:** Read one server-only environment variable directly in the CrunchAtlas server component and conditionally render the existing Section 03 as a unit. Keep the route statically rendered and teach the existing rendered-page contract to validate both the hidden default and explicit visible configuration.

**Tech Stack:** Next.js 15 App Router, React Server Components, TypeScript, Node.js `assert`, pnpm

## Global Constraints

- Only the exact string `true` enables the screenshots; unset, `false`, and unrecognized values hide them.
- Hide the entire Section 03 “Product proof” block, including its heading, introduction, screenshots, and captions.
- Keep `SHOW_CRUNCHATLAS_IMAGES` server-only; do not use `NEXT_PUBLIC_` and do not opt the route into dynamic rendering.
- Do not remove public assets or change the Open Graph, Home, or Projects image usage.
- Vercel configuration changes require a new deployment.

---

### Task 1: Add and verify the build-time image toggle

**Files:**
- Modify: `scripts/site-contract.mjs:345-369`
- Modify: `app/projects/crunchatlas/page.tsx:13-141`

**Interfaces:**
- Consumes: `process.env.SHOW_CRUNCHATLAS_IMAGES: string | undefined`
- Produces: `showProductProof: boolean`, where only `"true"` maps to `true`
- Produces: rendered Section 03 and both `MarketingShot` components when enabled; no Section 03 body markup when disabled

- [ ] **Step 1: Write the failing rendered-page contract**

Replace the unconditional image assertions in `crunchAtlasSuite()` with flag-aware assertions for both the section and its two images:

```js
const shouldRenderProductProof =
	process.env.SHOW_CRUNCHATLAS_IMAGES === "true";

assert.equal(
	content.includes('id="product-proof"'),
	shouldRenderProductProof,
	"CrunchAtlas Product proof visibility must match SHOW_CRUNCHATLAS_IMAGES",
);
for (const image of [
	"crunchatlas-campaign-assessment.webp",
	"crunchatlas-agent-report.webp",
]) {
	assert.equal(
		content.includes(image),
		shouldRenderProductProof,
		`CrunchAtlas ${image} visibility must match SHOW_CRUNCHATLAS_IMAGES`,
	);
}
```

Keep the existing shell, copy, navigation, external-link, and canonical assertions unchanged.

- [ ] **Step 2: Run the contract to verify it fails against the current unconditional page**

Build and start the current page with the flag unset:

```bash
pnpm build
PORT=3100 pnpm start
```

In a second terminal, run:

```bash
pnpm test:site crunchatlas
```

Expected: FAIL at `CrunchAtlas Product proof visibility must match SHOW_CRUNCHATLAS_IMAGES`, with the page rendering the section while the default expectation is hidden. Stop the production server before rebuilding.

- [ ] **Step 3: Implement the minimal server-only conditional**

After `const work = professionalWork.crunchatlas;`, add:

```ts
const showProductProof = process.env.SHOW_CRUNCHATLAS_IMAGES === "true";
```

Wrap the complete existing Section 03 block in the condition without changing its contents:

```tsx
{showProductProof ? (
	<CaseStudySection
		number="03"
		eyebrow="Product proof"
		title="The infrastructure ends in inspectable work."
		id="product-proof"
		intro="Public marketing views show the boundary I can expose: evidence-backed assessment and an agent-generated report, not customer data or internal detection logic."
	>
		<div className="space-y-6">
			<MarketingShot
				src="/projects/crunchatlas-campaign-assessment.webp"
				alt="CrunchAtlas campaign assessment showing summarized network-security evidence and findings"
				caption="Public CrunchAtlas marketing image: a campaign assessment turns collected evidence into an inspectable security result."
				priority
			/>
			<MarketingShot
				src="/projects/crunchatlas-agent-report.webp"
				alt="CrunchAtlas case view showing a structured report produced by a security analysis agent"
				caption="Public CrunchAtlas marketing image: a domain agent's result is presented as a structured report rather than an opaque chat response."
			/>
		</div>
	</CaseStudySection>
) : null}
```

- [ ] **Step 4: Verify the hidden default passes**

With `SHOW_CRUNCHATLAS_IMAGES` unset, run:

```bash
pnpm typecheck
pnpm build
PORT=3100 pnpm start
```

In a second terminal, run:

```bash
pnpm test:site crunchatlas
```

Expected: typecheck and build exit 0; the CrunchAtlas suite passes with no `product-proof` section or body references to either screenshot. Stop the production server before rebuilding.

- [ ] **Step 5: Verify the explicit visible state passes**

Build and start with the flag enabled:

```bash
SHOW_CRUNCHATLAS_IMAGES=true pnpm build
SHOW_CRUNCHATLAS_IMAGES=true PORT=3100 pnpm start
```

In a second terminal, run the contract with the same expected state:

```bash
SHOW_CRUNCHATLAS_IMAGES=true pnpm test:site crunchatlas
```

Expected: build exits 0; the CrunchAtlas suite passes with `id="product-proof"` and both screenshot references present in the rendered body.

- [ ] **Step 6: Inspect the final patch**

Run:

```bash
git diff --check
git diff -- app/projects/crunchatlas/page.tsx scripts/site-contract.mjs
git status --short
```

Expected: no whitespace errors; only the approved page conditional, the flag-aware contract, and this plan are new implementation-scope changes.

- [ ] **Step 7: Commit the implementation**

```bash
git add app/projects/crunchatlas/page.tsx scripts/site-contract.mjs
git commit -m "feat: toggle CrunchAtlas screenshots"
```
