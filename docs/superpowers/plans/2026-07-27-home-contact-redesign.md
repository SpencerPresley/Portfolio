# Homepage and Contact Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic animated splash page and obsolete contact cards with immediate, proof-driven pages that match Projects and Resume.

**Architecture:** Keep Home and Contact server-rendered, reuse the existing navigation and typed project cards, and centralize site-wide contact values in one TypeScript module. Remove the canvas/mouse animation stack and its sole dependency after both replacement pages are working.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Tailwind CSS 3, Lucide React, pnpm, Vercel

## Global Constraints

- The homepage primarily serves hiring managers and recruiters.
- Navigation and useful content must be visible immediately; no splash gate, canvas, delayed opacity, or entrance sequence.
- The homepage proof order is CrunchAtlas / AtlasCyber, gloss, then the Celery Fork-Safety Investigation.
- Do not expose any CrunchAtlas information beyond the already-approved Projects copy and redacted image.
- The homepage must remain shorter than the Projects index and must not duplicate its complete information architecture.
- `spencerpresley96@gmail.com` is the only public email literal.
- Contact must make email primary and GitHub/LinkedIn secondary.
- Do not add a CMS, database, contact form, availability claim, or new analytics.
- Home and Contact remain server components except for the existing client-side `Navigation`.
- No horizontal scrolling at 390 CSS pixels.
- External links use `target="_blank"` with `rel="noreferrer"`; `mailto:` does not open a new tab.
- Do not modify the existing Projects or Resume visual systems except where consuming shared contact data requires it.

---

## File Structure

- Create `app/site-data.ts`
  - Owns the canonical email, GitHub, and LinkedIn values used across routes.
- Modify `app/resume/resume-data.ts`
  - Removes the duplicate `resumeContact` literal.
- Modify `app/resume/resume-view.tsx`
  - Reads contact links from `siteContact`.
- Modify `app/contact/page.tsx`
  - Implements the new contact hierarchy and static cards.
- Modify `app/page.tsx`
  - Implements the new hero, CrunchAtlas preview, typed project previews, and closing contact callout.
- Modify `app/components/nav.tsx`
  - Prevents the homepage from rendering a useless link back to itself; internal-route behavior remains unchanged.
- Delete `app/components/card.tsx`
  - Removes the old mouse-mask contact-card abstraction after Contact stops consuming it.
- Delete `app/components/particles.tsx`
  - Removes the generic particle canvas.
- Delete `util/mouse.ts`
  - Removes the particle canvas's now-unused global mouse listener.
- Modify `tailwind.config.js`
  - Removes homepage-only delayed entrance animations and keyframes.
- Modify `global.css`
  - Removes the obsolete outlined-title utility after the splash title disappears.
- Modify `package.json`
  - Removes the now-unused `framer-motion` dependency.
- Modify `pnpm-lock.yaml`
  - Records the dependency removal.
- Modify `docs/superpowers/specs/2026-07-27-home-contact-redesign-design.md`
  - Already updated to mark the reviewed design approved for implementation.

---

### Task 1: Centralize Contact Identity Data

**Files:**
- Create: `app/site-data.ts`
- Modify: `app/resume/resume-data.ts:40-44`
- Modify: `app/resume/resume-view.tsx:1-14,261-310`
- Modify: `app/contact/page.tsx:1-26`

**Interfaces:**
- Produces: `siteContact.email: string`
- Produces: `siteContact.github: { label: string; handle: string; href: string }`
- Produces: `siteContact.linkedin: { label: string; handle: string; href: string }`
- Consumes: no new interfaces

- [ ] **Step 1: Record the stale-data failure**

Run:

```bash
rg -n 'spencer@spencerpresley\.com|spencerpresley96@gmail\.com' app
```

Expected before implementation: Contact contains `spencer@spencerpresley.com`
while Resume contains `spencerpresley96@gmail.com`.

- [ ] **Step 2: Create the shared site-data module**

Create `app/site-data.ts`:

```ts
export type SiteProfile = {
	label: string;
	handle: string;
	href: string;
};

export const siteContact = {
	email: "spencerpresley96@gmail.com",
	github: {
		label: "GitHub",
		handle: "SpencerPresley",
		href: "https://github.com/SpencerPresley",
	},
	linkedin: {
		label: "LinkedIn",
		handle: "Spencer Presley",
		href: "https://www.linkedin.com/in/spencerpresley96",
	},
} as const satisfies {
	email: string;
	github: SiteProfile;
	linkedin: SiteProfile;
};
```

- [ ] **Step 3: Move Resume to the canonical object**

Delete `resumeContact` from `app/resume/resume-data.ts`.

In `app/resume/resume-view.tsx`, import:

```ts
import { siteContact } from "../site-data";
```

Remove `resumeContact` from the `./resume-data` import and replace its uses:

```tsx
href={`mailto:${siteContact.email}`}
```

```tsx
<span className="break-all">{siteContact.email}</span>
```

```tsx
href={siteContact.linkedin.href}
```

```tsx
href={siteContact.github.href}
```

- [ ] **Step 4: Point the existing Contact page at shared data**

This step changes data ownership only; Task 2 replaces the UI.

Import `siteContact` and define the temporary `socials` entries from it:

```tsx
const socials = [
	{
		icon: <Mail size={20} />,
		href: `mailto:${siteContact.email}`,
		label: "Email",
		handle: siteContact.email,
	},
	{
		icon: <Github size={20} />,
		href: siteContact.github.href,
		label: siteContact.github.label,
		handle: siteContact.github.handle,
	},
	{
		icon: <Linkedin size={20} />,
		href: siteContact.linkedin.href,
		label: siteContact.linkedin.label,
		handle: siteContact.linkedin.handle,
	},
];
```

- [ ] **Step 5: Verify the shared-data change**

Run:

```bash
pnpm exec rome check app/site-data.ts app/resume/resume-data.ts app/resume/resume-view.tsx app/contact/page.tsx
pnpm typecheck
if rg -n 'spencer@spencerpresley\.com' app; then
	echo "stale email remains"
	exit 1
fi
rg -n 'spencerpresley96@gmail\.com' app
```

Expected:

- Rome and TypeScript pass.
- The old domain address has no matches.
- The Gmail address appears only in `app/site-data.ts`.

- [ ] **Step 6: Commit**

```bash
git status --short --branch
git log -1 --oneline --decorate
git add app/site-data.ts app/resume/resume-data.ts app/resume/resume-view.tsx app/contact/page.tsx
git commit -m "refactor: centralize site contact details"
```

---

### Task 2: Rebuild the Contact Page

**Files:**
- Modify: `app/contact/page.tsx`
- Delete: `app/components/card.tsx`

**Interfaces:**
- Consumes: `siteContact` from `app/site-data.ts`
- Produces: static `/contact` page with one email action and two external-profile actions

- [ ] **Step 1: Capture the current semantic baseline**

Start the local site:

```bash
pnpm dev
```

Open `/contact` and confirm the current route has no page `h1` and presents all
three destinations with equal visual weight. This is the behavior Task 2 must
replace.

- [ ] **Step 2: Replace Contact with the approved hierarchy**

Use these imports:

```tsx
import type { Metadata } from "next";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Navigation } from "../components/nav";
import { siteContact } from "../site-data";
```

Keep the existing metadata. Replace the component body with:

```tsx
export default function ContactPage() {
	const profiles = [
		{ icon: Github, ...siteContact.github },
		{ icon: Linkedin, ...siteContact.linkedin },
	];

	return (
		<div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-[48rem] bg-[radial-gradient(circle_at_15%_0%,rgba(124,58,237,0.16),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(14,165,233,0.13),transparent_34%)]"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_48%)]"
				aria-hidden="true"
			/>
			<Navigation />

			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				<header className="max-w-4xl border-b border-zinc-800 pb-14">
					<p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-violet-300">
						<span className="h-px w-8 bg-violet-400/70" aria-hidden="true" />
						Contact
					</p>
					<h1 className="font-display text-5xl leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
						Let's talk.
					</h1>
					<p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
						Email is the best way to reach me. You can also find my public
						work on GitHub and connect on LinkedIn.
					</p>
				</header>

				<section className="pt-12" aria-labelledby="contact-methods">
					<h2 id="contact-methods" className="sr-only">
						Contact methods
					</h2>

					<a
						href={`mailto:${siteContact.email}`}
						className="group grid gap-6 rounded-3xl border border-sky-400/20 bg-zinc-900/55 p-7 transition hover:border-sky-300/40 hover:bg-zinc-900/75 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:p-10 lg:grid-cols-[3rem_minmax(0,1fr)_auto] lg:items-center"
					>
						<span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
							<Mail className="h-5 w-5" aria-hidden="true" />
						</span>
						<span>
							<span className="block font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sky-300">
								Email me
							</span>
							<span className="mt-3 block break-all font-display text-2xl leading-tight text-white sm:text-4xl">
								{siteContact.email}
							</span>
						</span>
						<ArrowUpRight
							className="h-5 w-5 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-300"
							aria-hidden="true"
						/>
					</a>

					<div className="mt-5 grid gap-5 sm:grid-cols-2">
						{profiles.map(({ icon: Icon, label, handle, href }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noreferrer"
								className="group flex items-center gap-5 rounded-3xl border border-zinc-800 bg-zinc-900/35 p-6 transition hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-violet-400 sm:p-8"
							>
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
									<Icon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span className="min-w-0">
									<span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
										{label}
									</span>
									<span className="mt-2 block truncate text-base font-medium text-zinc-200 transition group-hover:text-white">
										{handle}
									</span>
								</span>
								<ArrowUpRight
									className="ml-auto h-4 w-4 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
									aria-hidden="true"
								/>
							</a>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
```

- [ ] **Step 3: Remove the obsolete card component**

Verify the only consumer is gone:

```bash
rg -n 'components/card|<Card' app --glob '!app/components/card.tsx'
```

Expected: no matches.

Delete `app/components/card.tsx`.

- [ ] **Step 4: Run focused checks**

```bash
pnpm exec rome check app/contact/page.tsx app/site-data.ts
pnpm typecheck
if rg -n 'spencer@spencerpresley\.com|components/card|<Card' app; then
	echo "stale contact implementation remains"
	exit 1
fi
```

Expected: all commands pass and the final search has no matches.

- [ ] **Step 5: Verify Contact in the browser**

At desktop and 390×844:

- One `h1` reads `Let's talk.`
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- The email address remains visible and copyable.
- The email link is `mailto:spencerpresley96@gmail.com` with no `_blank`.
- GitHub and LinkedIn use `_blank` and `rel="noreferrer"`.
- Keyboard focus rings are visible.
- Browser console has no errors.

- [ ] **Step 6: Commit**

```bash
git status --short --branch
git log -1 --oneline --decorate
git add app/contact/page.tsx app/components/card.tsx
git commit -m "feat: rebuild contact page"
```

---

### Task 3: Build the Proof-Driven Homepage

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/components/nav.tsx`

**Interfaces:**
- Consumes: `getProject(slug: string): Project | undefined`
- Consumes: `ProjectCard({ project, index, visual })`
- Produces: statically rendered `/` route with required project records

- [ ] **Step 1: Add fail-closed project selection**

Replace the homepage imports and define its required project records:

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navigation } from "./components/nav";
import { getProject } from "./projects/project-data";
import { ProjectCard } from "./projects/project-ui";

const homepageProjects = ["gloss", "celery-fork-safety"].map((slug) => {
	const project = getProject(slug);

	if (!project) {
		throw new Error(`Missing homepage project: ${slug}`);
	}

	return project;
});
```

This makes a renamed or deleted required project fail during the build instead
of silently disappearing from the homepage.

- [ ] **Step 2: Implement the immediate hero**

Replace the splash wrapper with the shared page shell and hero:

```tsx
<div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
	<div
		className="pointer-events-none absolute inset-x-0 top-0 h-[54rem] bg-[radial-gradient(circle_at_14%_0%,rgba(124,58,237,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.14),transparent_34%)]"
		aria-hidden="true"
	/>
	<div
		className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_42%)]"
		aria-hidden="true"
	/>
	<Navigation />

	<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
		<header className="max-w-5xl border-b border-zinc-800 pb-16">
			<p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-violet-300">
				<span className="h-px w-8 bg-violet-400/70" aria-hidden="true" />
				Spencer Presley · Software engineer
			</p>
			<h1 className="max-w-5xl font-display text-5xl leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
				AI and backend systems that hold up outside the demo.
			</h1>
			<p className="mt-7 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
				I build evidence-grounded agents, local-first inference, retrieval
				systems, and the backend infrastructure that keeps them reliable.
			</p>
			<div className="mt-9 flex flex-wrap gap-3">
				<Link
					href="/projects"
					className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
				>
					Explore projects
					<ArrowRight className="h-4 w-4" aria-hidden="true" />
				</Link>
				<Link
					href="/resume"
					className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
				>
					View resume
					<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
				</Link>
			</div>
		</header>
```

- [ ] **Step 3: Add the CrunchAtlas preview**

Add a `Selected work` section with the approved public boundary:

```tsx
<section className="pt-16" aria-labelledby="selected-work">
	<div className="mb-8 flex items-center gap-4">
		<span className="font-mono text-xs text-zinc-600">01</span>
		<h2
			id="selected-work"
			className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
		>
			Selected work
		</h2>
		<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
	</div>

	<article className="grid overflow-hidden rounded-3xl border border-amber-400/20 bg-zinc-900/55 lg:grid-cols-[1.1fr_0.9fr]">
		<div className="relative min-h-[18rem] overflow-hidden border-b border-zinc-800 bg-zinc-950 lg:min-h-full lg:border-b-0 lg:border-r">
			<Image
				src="/projects/crunchatlas-campaign-teaser.webp"
				alt="Redacted CrunchAtlas marketing view showing an active network security campaign summary"
				fill
				priority
				sizes="(max-width: 1024px) 100vw, 55vw"
				className="object-cover"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent"
				aria-hidden="true"
			/>
			<span className="absolute left-5 top-5 rounded-full border border-white/10 bg-zinc-950/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur">
				Public marketing image
			</span>
		</div>

		<div className="flex flex-col p-7 sm:p-9">
			<p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber-300">
				Current work · 2025–
			</p>
			<h3 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
				CrunchAtlas / AtlasCyber
			</h3>
			<p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
				At CrunchAtlas, I build the AI and backend infrastructure for
				AtlasCyber: evidence-grounded network analysis agents, the agent
				runtime and sandboxing layer, Postgres-native job and GPU
				orchestration, and local model serving across cloud, on-prem, and
				air-gapped environments.
			</p>
			<p className="mt-3 text-xs leading-6 text-zinc-600">
				The image is intentionally redacted; it marks the boundary of what I
				show publicly.
			</p>
			<a
				href="https://www.crunchatlas.com/"
				target="_blank"
				rel="noreferrer"
				className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-4 focus:ring-offset-zinc-950"
			>
				Visit CrunchAtlas
				<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
	</article>
```

- [ ] **Step 4: Add typed gloss and Celery previews**

Immediately below CrunchAtlas:

```tsx
<div className="mt-5 grid gap-5 lg:grid-cols-2">
	{homepageProjects.map((project, index) => (
		<ProjectCard
			key={project.slug}
			project={project}
			index={index}
			visual
		/>
	))}
</div>
</section>
```

- [ ] **Step 5: Add the closing contact callout**

```tsx
<section className="mt-24 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/45">
	<div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
		<div>
			<p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sky-300">
				Get in touch
			</p>
			<h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-white sm:text-4xl">
				Want to talk through the work?
			</h2>
			<p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
				Email is the most reliable way to reach me.
			</p>
		</div>
		<Link
			href="/contact"
			className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
		>
			Contact me
			<ArrowRight className="h-4 w-4" aria-hidden="true" />
		</Link>
	</div>
</section>
```

Close `main` and the outer page wrapper.

- [ ] **Step 6: Make Navigation sensible on the homepage**

In `app/components/nav.tsx`, add:

```ts
const isHome = pathname === "/";
```

Replace the left-side home link with a root-specific identity:

```tsx
{isHome ? (
	<span className="font-display text-lg text-zinc-100">Spencer Presley</span>
) : (
	<Link
		href="/"
		aria-label="Home"
		className="duration-200 text-zinc-300 hover:text-zinc-100"
	>
		<ArrowLeft className="h-6 w-6" aria-hidden="true" />
	</Link>
)}
```

Do not change the Projects, Contact, or Resume active-link logic.

- [ ] **Step 7: Run focused checks**

```bash
pnpm exec rome check app/page.tsx app/components/nav.tsx app/projects/project-data.ts app/projects/project-ui.tsx
pnpm typecheck
if rg -n 'Particles|animate-(fade|title)|h-screen|w-screen' app/page.tsx; then
	echo "blocking homepage implementation remains"
	exit 1
fi
```

Expected:

- Rome and TypeScript pass.
- The homepage search has no matches.

- [ ] **Step 8: Verify Home in the browser**

At desktop and 390×844:

- Navigation and hero content are visible on first paint.
- Exactly one `h1` contains `AI and backend systems that hold up outside the demo.`
- CrunchAtlas precedes gloss, and gloss precedes Celery in document order.
- The redacted image has its approved alternative text.
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- Project cards link to `/projects/gloss` and `/projects/celery-fork-safety`.
- Projects, Resume, Contact, and CrunchAtlas links have the expected targets.
- Browser console has no errors.

- [ ] **Step 9: Commit**

```bash
git status --short --branch
git log -1 --oneline --decorate
git add app/page.tsx app/components/nav.tsx
git commit -m "feat: rebuild portfolio homepage"
```

---

### Task 4: Remove the Obsolete Motion Stack

**Files:**
- Delete: `app/components/particles.tsx`
- Delete: `util/mouse.ts`
- Modify: `tailwind.config.js:37-102`
- Modify: `global.css:5-9`
- Modify: `package.json:12-20`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: completed Home and Contact pages with no animation-stack imports
- Produces: dependency graph without `framer-motion` and Tailwind config without delayed entrance animations

- [ ] **Step 1: Prove every old consumer is gone**

```bash
rg -n 'framer-motion|components/particles|util/mouse|components/card|Particles|<Card|animate-(fade|title|glow)|text-edge-outline' app util global.css tailwind.config.js package.json
```

Expected before cleanup:

- Matches only in the obsolete component, hook, configuration, stylesheet, and
  dependency declaration.
- No match in `app/page.tsx` or `app/contact/page.tsx`.

- [ ] **Step 2: Delete the dead canvas and hook**

Delete:

```text
app/components/particles.tsx
util/mouse.ts
```

`app/components/card.tsx` was already deleted in Task 2.

- [ ] **Step 3: Remove obsolete Tailwind and global CSS**

Delete the entire `animation` and `keyframes` properties from
`tailwind.config.js`.

Reduce `global.css` to:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Remove `framer-motion` through pnpm**

Run:

```bash
pnpm remove framer-motion
```

Expected: `package.json` and `pnpm-lock.yaml` change; pnpm exits zero.

- [ ] **Step 5: Prove the stack is absent**

```bash
if rg -n 'framer-motion|components/particles|util/mouse|components/card|Particles|<Card|animate-(fade|title|glow)|text-edge-outline' app util global.css tailwind.config.js package.json pnpm-lock.yaml; then
	echo "obsolete motion-stack reference remains"
	exit 1
fi
```

Expected: no matches.

- [ ] **Step 6: Run full static verification**

```bash
pnpm exec rome check app global.css tailwind.config.js
pnpm typecheck
pnpm build
```

Expected:

- Rome passes.
- TypeScript exits zero.
- Next.js compiles and statically generates `/`, `/contact`, `/projects`,
  `/resume`, and all project-detail paths.
- The existing Browserslist `caniuse-lite` age warning is allowed; any compile,
  type, or route-generation error is not.

- [ ] **Step 7: Commit**

```bash
git status --short --branch
git log -1 --oneline --decorate
git add app/components/particles.tsx util/mouse.ts tailwind.config.js global.css package.json pnpm-lock.yaml
git commit -m "chore: remove obsolete motion stack"
```

---

### Task 5: Final Browser Verification and Production Delivery

**Files:**
- Verify only; no source changes expected

**Interfaces:**
- Consumes: completed Home, Contact, shared site data, and cleaned dependency graph
- Produces: pushed `main` and a verified production deployment

- [ ] **Step 1: Run the final local verification suite**

```bash
git diff --check origin/main...HEAD
pnpm exec rome check app global.css tailwind.config.js
pnpm typecheck
pnpm build
if rg -n 'spencer@spencerpresley\.com|framer-motion|components/particles|util/mouse|components/card|animate-(fade|title|glow)|text-edge-outline' app util global.css tailwind.config.js package.json pnpm-lock.yaml; then
	echo "stale implementation remains"
	exit 1
fi
```

Expected:

- Diff check, Rome, TypeScript, and build pass.
- The final search has no matches.

- [ ] **Step 2: Verify both routes at desktop**

Start `pnpm dev` and inspect `/` and `/contact` at 1440×900.

For both routes:

- No browser-console errors.
- No horizontal overflow.
- Navigation active states are correct.
- All content is visible without waiting for an entrance animation.
- Tab order follows visual order and focus rings are visible.

- [ ] **Step 3: Verify both routes at 390×844**

For Home:

- Hero heading wraps without clipping.
- CrunchAtlas image and text stack.
- gloss and Celery cards stack.
- Closing contact callout remains readable.

For Contact:

- Gmail address wraps within the primary card.
- GitHub and LinkedIn cards stack without truncated destination meaning.
- `scrollWidth === clientWidth`.

- [ ] **Step 4: Exercise every destination**

Use browser inspection to assert:

```text
/projects
/resume
/contact
/projects/gloss
/projects/celery-fork-safety
https://www.crunchatlas.com/
mailto:spencerpresley96@gmail.com
https://github.com/SpencerPresley
https://www.linkedin.com/in/spencerpresley96
```

Internal routes must return 200. External anchors must have the approved href,
`target`, and `rel` values. The mail link must not have `_blank`.

- [ ] **Step 5: Inspect the final Git state**

```bash
git status --short --branch
git log --oneline --decorate origin/main..HEAD
```

Expected:

- Worktree clean.
- The two design commits and scoped implementation commits are visible above
  `origin/main`.

- [ ] **Step 6: Push `main`**

```bash
git push origin main
```

Expected: push succeeds without force.

- [ ] **Step 7: Wait for Vercel production**

```bash
task_head_sha="$(git rev-parse HEAD)"
task_deployment_url=""

for task_attempt in {1..12}; do
	task_deployment_json="$(vercel ls --format json --limit 5 2>/dev/null)"
	task_deployment_url="$(
		printf '%s' "$task_deployment_json" |
			jq -r --arg sha "$task_head_sha" \
				'.deployments[] | select(.meta.githubCommitSha == $sha) | .url' |
			head -n 1
	)"

	if [ -n "$task_deployment_url" ]; then
		break
	fi

	sleep 5
done

if [ -z "$task_deployment_url" ]; then
	echo "No Vercel deployment found for $task_head_sha"
	exit 1
fi

vercel inspect "https://$task_deployment_url" --wait --timeout 45s
```

Expected: the deployment reaches `Ready`.

- [ ] **Step 8: Verify the custom domain**

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' https://spencerpresley.com/
curl -fsS -o /dev/null -w '%{http_code}\n' https://spencerpresley.com/contact
curl -fsSL https://spencerpresley.com/ | rg 'AI and backend systems that hold up outside the demo|CrunchAtlas / AtlasCyber|gloss|Celery Fork-Safety Investigation'
curl -fsSL https://spencerpresley.com/contact | rg "Let's talk|spencerpresley96@gmail.com|SpencerPresley|LinkedIn"
```

Expected:

- Both HTTP status checks print `200`.
- Both content checks find every required string.
