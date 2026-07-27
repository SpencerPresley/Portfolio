# Homepage Proof Rows and Atmosphere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the homepage technical projects a distinct evidence-first presentation and introduce a subtle typed color handoff across the four top-level pages.

**Architecture:** A server-compatible `PageAtmosphere` component owns the complete literal Tailwind classes for Home, Projects, Contact, and Resume, plus each page's matching eyebrow classes. A separate `HomeProjectProof` server component consumes existing `Project` records and renders compact linked evidence rows; the Projects index and project-detail presentation remain unchanged.

**Tech Stack:** Next.js 15 App Router, React 18 server components, TypeScript 5, Tailwind CSS 3, Lucide React, pnpm, Rome 12.

## Global Constraints

- The top-level route order is Home → Projects → Contact → Resume → Home.
- Home uses violet at 18% opacity on the left and sky at 14% on the right.
- Projects uses sky at 15% on the left and emerald at 11% on the right.
- Contact uses emerald at 14% on the left and amber at 10% on the right.
- Both Resume variants use amber at 12% on the left and violet at 12% on the right.
- Zinc-950 remains the dominant page background; there is no page-transition animation.
- Only the decorative wash and page eyebrow adopt the page palette.
- Project colors, Contact cards, resume controls, buttons, focus treatments, and project-detail accents remain unchanged.
- The homepage proof order remains CrunchAtlas / AtlasCyber, gloss, then the Celery Fork-Safety Investigation.
- CrunchAtlas copy, image, public boundary, and presentation remain unchanged.
- gloss and Celery reuse their canonical typed records but must not reuse `ProjectCard` or `ProjectVisual` on the homepage.
- Each homepage technical-proof row shows the existing title, year, category, eyebrow, summary, and all three facts.
- The Projects index must retain its existing `ProjectCard` presentation.
- No new dependency, client component, CMS, database, runtime fetch, or analytics is added.
- The repository has no test script. Use the explicit source contracts, Rome on supported files, TypeScript, the production build, and browser contracts below.
- Rome 12 hangs on `global.css`; do not pass CSS files to Rome. The Tailwind production build remains the CSS verification boundary.

---

### Task 1: Add the Typed Top-Level Atmosphere System

**Files:**
- Create: `app/components/page-atmosphere.tsx`
- Modify: `app/page.tsx:1-38`
- Modify: `app/projects/page.tsx:1-66`
- Modify: `app/contact/page.tsx:1-36`
- Modify: `app/resume/resume-view.tsx:1-100`

**Interfaces:**
- Produces: `PageAtmosphereVariant`
- Produces: `pageAtmosphereStyles: Record<PageAtmosphereVariant, PageAtmosphereStyle>`
- Produces: `PageAtmosphere({ variant }: { variant: PageAtmosphereVariant })`
- Consumes: no runtime data and no client-only APIs

- [ ] **Step 1: Run the atmosphere source contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");

const expectations = {
	"app/page.tsx": ["PageAtmosphere", "pageAtmosphereStyles.home", 'variant="home"'],
	"app/projects/page.tsx": [
		"PageAtmosphere",
		"pageAtmosphereStyles.projects",
		'variant="projects"',
	],
	"app/contact/page.tsx": [
		"PageAtmosphere",
		"pageAtmosphereStyles.contact",
		'variant="contact"',
	],
	"app/resume/resume-view.tsx": [
		"PageAtmosphere",
		"pageAtmosphereStyles.resume",
		'variant="resume"',
	],
};

const failures = [];
const componentPath = "app/components/page-atmosphere.tsx";

if (!fs.existsSync(componentPath)) {
	failures.push(`${componentPath}: missing`);
} else {
	const component = fs.readFileSync(componentPath, "utf8");
	for (const token of [
		"rgba(124,58,237,0.18)",
		"rgba(14,165,233,0.14)",
		"rgba(14,165,233,0.15)",
		"rgba(16,185,129,0.11)",
		"rgba(16,185,129,0.14)",
		"rgba(245,158,11,0.10)",
		"rgba(245,158,11,0.12)",
		"rgba(124,58,237,0.12)",
		"eyebrowText",
		"eyebrowLine",
		"data-atmosphere",
	]) {
		if (!component.includes(token)) failures.push(`${componentPath}: missing ${token}`);
	}
}

for (const [path, tokens] of Object.entries(expectations)) {
	const source = fs.readFileSync(path, "utf8");
	for (const token of tokens) {
		if (!source.includes(token)) failures.push(`${path}: missing ${token}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log("Atmosphere source contract passes.");
NODE
```

Expected: FAIL because `app/components/page-atmosphere.tsx` and the four route integrations do not exist yet.

- [ ] **Step 2: Create the typed atmosphere component**

Create `app/components/page-atmosphere.tsx`:

```tsx
export type PageAtmosphereVariant =
	| "home"
	| "projects"
	| "contact"
	| "resume";

type PageAtmosphereStyle = {
	wash: string;
	eyebrowText: string;
	eyebrowLine: string;
};

export const pageAtmosphereStyles = {
	home: {
		wash: "h-[54rem] bg-[radial-gradient(circle_at_14%_0%,rgba(124,58,237,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.14),transparent_34%)]",
		eyebrowText: "text-violet-300",
		eyebrowLine: "bg-violet-400/70",
	},
	projects: {
		wash: "h-[52rem] bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.15),transparent_36%),radial-gradient(circle_at_82%_8%,rgba(16,185,129,0.11),transparent_34%)]",
		eyebrowText: "text-sky-300",
		eyebrowLine: "bg-sky-400/70",
	},
	contact: {
		wash: "h-[48rem] bg-[radial-gradient(circle_at_15%_0%,rgba(16,185,129,0.14),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(245,158,11,0.10),transparent_34%)]",
		eyebrowText: "text-emerald-300",
		eyebrowLine: "bg-emerald-400/70",
	},
	resume: {
		wash: "h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_42%),radial-gradient(circle_at_75%_15%,rgba(124,58,237,0.12),transparent_36%)]",
		eyebrowText: "text-amber-300",
		eyebrowLine: "bg-amber-400/70",
	},
} as const satisfies Record<PageAtmosphereVariant, PageAtmosphereStyle>;

export function PageAtmosphere({
	variant,
}: {
	variant: PageAtmosphereVariant;
}) {
	return (
		<div
			data-atmosphere={variant}
			className={`pointer-events-none absolute inset-x-0 top-0 ${pageAtmosphereStyles[variant].wash}`}
			aria-hidden="true"
		/>
	);
}
```

Do not add `"use client"`. Complete literal class strings are required so Tailwind discovers every variant.

- [ ] **Step 3: Integrate Home**

In `app/page.tsx`, import:

```tsx
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "./components/page-atmosphere";
```

Define:

```tsx
const homeAtmosphere = pageAtmosphereStyles.home;
```

Replace only the first decorative radial-wash `<div>` with:

```tsx
<PageAtmosphere variant="home" />
```

Keep the existing grid layer unchanged. Update the hero eyebrow:

```tsx
<p
	className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${homeAtmosphere.eyebrowText}`}
>
	<span
		className={`h-px w-8 ${homeAtmosphere.eyebrowLine}`}
		aria-hidden="true"
	/>
	Spencer Presley · Software engineer
</p>
```

- [ ] **Step 4: Integrate Projects**

In `app/projects/page.tsx`, import:

```tsx
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "../components/page-atmosphere";
```

Define:

```tsx
const projectsAtmosphere = pageAtmosphereStyles.projects;
```

Replace only the first decorative radial-wash `<div>` with:

```tsx
<PageAtmosphere variant="projects" />
```

Keep the grid and every project/content accent unchanged. Update only the page eyebrow:

```tsx
<p
	className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${projectsAtmosphere.eyebrowText}`}
>
	<span
		className={`h-px w-8 ${projectsAtmosphere.eyebrowLine}`}
		aria-hidden="true"
	/>
	Selected work
</p>
```

- [ ] **Step 5: Integrate Contact**

In `app/contact/page.tsx`, import:

```tsx
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "../components/page-atmosphere";
```

Define:

```tsx
const contactAtmosphere = pageAtmosphereStyles.contact;
```

Replace only the first decorative radial-wash `<div>` with:

```tsx
<PageAtmosphere variant="contact" />
```

Keep the grid, email card, and profile-card accents unchanged. Update only the page eyebrow:

```tsx
<p
	className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${contactAtmosphere.eyebrowText}`}
>
	<span
		className={`h-px w-8 ${contactAtmosphere.eyebrowLine}`}
		aria-hidden="true"
	/>
	Contact
</p>
```

- [ ] **Step 6: Integrate both Resume variants**

In `app/resume/resume-view.tsx`, import:

```tsx
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "../components/page-atmosphere";
```

Define outside the component:

```tsx
const resumeAtmosphere = pageAtmosphereStyles.resume;
```

Replace only the first decorative radial-wash `<div>` with:

```tsx
<PageAtmosphere variant="resume" />
```

Because both routes render `ResumeView`, this covers `/resume` and `/resume/backend-platform`. Keep the grid, focus selector, download action, and all resume-content accents unchanged. Update only the page eyebrow:

```tsx
<p
	className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${resumeAtmosphere.eyebrowText}`}
>
	<span
		className={`h-px w-8 ${resumeAtmosphere.eyebrowLine}`}
		aria-hidden="true"
	/>
	Resume · {resume.shortLabel}
</p>
```

- [ ] **Step 7: Run the atmosphere source contract and static verification**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");

const expectations = {
	"app/page.tsx": ["PageAtmosphere", "pageAtmosphereStyles.home", 'variant="home"'],
	"app/projects/page.tsx": [
		"PageAtmosphere",
		"pageAtmosphereStyles.projects",
		'variant="projects"',
	],
	"app/contact/page.tsx": [
		"PageAtmosphere",
		"pageAtmosphereStyles.contact",
		'variant="contact"',
	],
	"app/resume/resume-view.tsx": [
		"PageAtmosphere",
		"pageAtmosphereStyles.resume",
		'variant="resume"',
	],
};

const failures = [];
const componentPath = "app/components/page-atmosphere.tsx";

if (!fs.existsSync(componentPath)) {
	failures.push(`${componentPath}: missing`);
} else {
	const component = fs.readFileSync(componentPath, "utf8");
	for (const token of [
		"rgba(124,58,237,0.18)",
		"rgba(14,165,233,0.14)",
		"rgba(14,165,233,0.15)",
		"rgba(16,185,129,0.11)",
		"rgba(16,185,129,0.14)",
		"rgba(245,158,11,0.10)",
		"rgba(245,158,11,0.12)",
		"rgba(124,58,237,0.12)",
		"eyebrowText",
		"eyebrowLine",
		"data-atmosphere",
	]) {
		if (!component.includes(token)) failures.push(`${componentPath}: missing ${token}`);
	}
}

for (const [path, tokens] of Object.entries(expectations)) {
	const source = fs.readFileSync(path, "utf8");
	for (const token of tokens) {
		if (!source.includes(token)) failures.push(`${path}: missing ${token}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log("Atmosphere source contract passes.");
NODE
```

Then run:

```bash
pnpm exec rome check \
	app/components/page-atmosphere.tsx \
	app/page.tsx \
	app/projects/page.tsx \
	app/contact/page.tsx \
	app/resume/resume-view.tsx
pnpm typecheck
pnpm build
git diff --check
```

Expected:

- The source contract prints `Atmosphere source contract passes.`
- Rome and TypeScript exit zero.
- The build generates `/`, `/projects`, `/contact`, `/resume`, `/resume/backend-platform`, and project-detail routes.
- No new dependency or client bundle is introduced.

- [ ] **Step 8: Verify the four variants in the browser**

Run the production build with:

```bash
pnpm start
```

At 1440×900 and 390×844, inspect `/`, `/projects`, `/contact`, `/resume`, and `/resume/backend-platform`.

For each route, evaluate:

```js
() => {
	const layer = document.querySelector("[data-atmosphere]");
	return {
		variant: layer?.getAttribute("data-atmosphere"),
		backgroundImage: layer ? getComputedStyle(layer).backgroundImage : null,
		overflow:
			document.documentElement.scrollWidth -
			document.documentElement.clientWidth,
	};
}
```

Expected variants and computed background colors:

- `/`: `home`; violet `124, 58, 237` and sky `14, 165, 233`.
- `/projects`: `projects`; sky `14, 165, 233` and emerald `16, 185, 129`.
- `/contact`: `contact`; emerald `16, 185, 129` and amber `245, 158, 11`.
- Both Resume routes: `resume`; amber `245, 158, 11` and violet `124, 58, 237`.
- `overflow` is `0` on every route.
- The eyebrow matches the left hue.
- Cards, controls, buttons, and focus rings retain their previous colors.

Open `/projects/gloss` and confirm it has no `[data-atmosphere]` element and still uses the gloss project-specific violet wash.

Stop the production server after the browser checks.

- [ ] **Step 9: Commit**

Immediately before committing:

```bash
git status --short --branch
git log -1 --oneline --decorate
```

Commit only the atmosphere task:

```bash
git add \
	app/components/page-atmosphere.tsx \
	app/page.tsx \
	app/projects/page.tsx \
	app/contact/page.tsx \
	app/resume/resume-view.tsx
git commit -m "feat: add top-level atmosphere palette"
```

---

### Task 2: Replace Homepage Project Cards with Evidence Rows

**Files:**
- Create: `app/components/home-project-proof.tsx`
- Modify: `app/page.tsx:1-150`
- Verify unchanged: `app/projects/page.tsx`
- Verify unchanged: `app/projects/project-ui.tsx`

**Interfaces:**
- Consumes: `Project` from `app/projects/project-data.ts`
- Consumes: `projectAccentStyles` from `app/projects/project-ui.tsx`
- Produces: `HomeProjectProof({ project, index }: { project: Project; index: number })`
- Preserves: `getProject(slug: string): Project | undefined`

- [ ] **Step 1: Run the homepage-presentation contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");

const homePath = "app/page.tsx";
const proofPath = "app/components/home-project-proof.tsx";
const projectsPath = "app/projects/page.tsx";
const home = fs.readFileSync(homePath, "utf8");
const projects = fs.readFileSync(projectsPath, "utf8");
const failures = [];

if (!fs.existsSync(proofPath)) {
	failures.push(`${proofPath}: missing`);
} else {
	const proof = fs.readFileSync(proofPath, "utf8");
	for (const token of [
		"HomeProjectProof",
		"project.title",
		"project.year",
		"project.category",
		"project.eyebrow",
		"project.summary",
		"project.facts.map",
		"data-home-project",
		"data-project-fact",
		"View case study",
	]) {
		if (!proof.includes(token)) failures.push(`${proofPath}: missing ${token}`);
	}
	if (/ProjectCard|ProjectVisual/.test(proof)) {
		failures.push(`${proofPath}: reuses Projects presentation`);
	}
}

for (const token of ["HomeProjectProof", "index={index + 2}"]) {
	if (!home.includes(token)) failures.push(`${homePath}: missing ${token}`);
}

if (/ProjectCard|ProjectVisual/.test(home)) {
	failures.push(`${homePath}: still reuses Projects presentation`);
}

if (!projects.includes("ProjectCard")) {
	failures.push(`${projectsPath}: Projects index lost ProjectCard`);
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log("Homepage presentation contract passes.");
NODE
```

Expected: FAIL because the proof component is absent and `app/page.tsx` still renders `ProjectCard`.

- [ ] **Step 2: Create the evidence-row component**

Create `app/components/home-project-proof.tsx`:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../projects/project-data";
import { projectAccentStyles } from "../projects/project-ui";

export function HomeProjectProof({
	project,
	index,
}: {
	project: Project;
	index: number;
}) {
	const accent = projectAccentStyles[project.accent];

	return (
		<Link
			href={`/projects/${project.slug}`}
			data-home-project={project.slug}
			className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
		>
			<article className="grid gap-8 p-7 transition duration-300 group-hover:bg-zinc-900/60 sm:p-9 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)_auto] lg:items-center">
				<div>
					<div className="flex flex-wrap items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-600">
						<span>{String(index).padStart(2, "0")}</span>
						<span className="h-px w-5 bg-zinc-800" aria-hidden="true" />
						<span>
							{project.year} · {project.category}
						</span>
					</div>
					<p
						className={`mt-7 font-mono text-[0.65rem] uppercase tracking-[0.18em] ${accent.text}`}
					>
						{project.eyebrow}
					</p>
					<h3 className="mt-3 font-display text-3xl leading-tight text-white">
						{project.title}
					</h3>
				</div>

				<div>
					<p className="max-w-3xl text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300 sm:text-[0.95rem]">
						{project.summary}
					</p>
					<dl className="mt-7 grid gap-5 sm:grid-cols-3">
						{project.facts.map((fact) => (
							<div
								key={fact.label}
								data-project-fact={fact.label}
								className="border-l border-zinc-800 pl-4"
							>
								<dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-600">
									{fact.label}
								</dt>
								<dd className="mt-2 text-sm leading-6 text-zinc-300">
									{fact.value}
								</dd>
							</div>
						))}
					</dl>
				</div>

				<span
					className={`inline-flex items-center gap-2 text-sm font-medium ${accent.text} lg:justify-self-end`}
				>
					View case study
					<ArrowUpRight
						className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
						aria-hidden="true"
					/>
				</span>
			</article>
		</Link>
	);
}
```

The row is one internal link. Do not add nested links, status pills, stack pills, `ProjectVisual`, or `"use client"`.

- [ ] **Step 3: Replace only the duplicated homepage cards**

In `app/page.tsx`, remove:

```tsx
import { ProjectCard } from "./projects/project-ui";
```

Add:

```tsx
import { HomeProjectProof } from "./components/home-project-proof";
```

Replace:

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
```

With:

```tsx
<div className="mt-5 divide-y divide-zinc-800 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30">
	{homepageProjects.map((project, index) => (
		<HomeProjectProof
			key={project.slug}
			project={project}
			index={index + 2}
		/>
	))}
</div>
```

Do not change the CrunchAtlas article, closing Contact callout, project selection, or proof order.

- [ ] **Step 4: Run the homepage contract and focused static checks**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");

const homePath = "app/page.tsx";
const proofPath = "app/components/home-project-proof.tsx";
const projectsPath = "app/projects/page.tsx";
const home = fs.readFileSync(homePath, "utf8");
const projects = fs.readFileSync(projectsPath, "utf8");
const failures = [];

if (!fs.existsSync(proofPath)) {
	failures.push(`${proofPath}: missing`);
} else {
	const proof = fs.readFileSync(proofPath, "utf8");
	for (const token of [
		"HomeProjectProof",
		"project.title",
		"project.year",
		"project.category",
		"project.eyebrow",
		"project.summary",
		"project.facts.map",
		"data-home-project",
		"data-project-fact",
		"View case study",
	]) {
		if (!proof.includes(token)) failures.push(`${proofPath}: missing ${token}`);
	}
	if (/ProjectCard|ProjectVisual/.test(proof)) {
		failures.push(`${proofPath}: reuses Projects presentation`);
	}
}

for (const token of ["HomeProjectProof", "index={index + 2}"]) {
	if (!home.includes(token)) failures.push(`${homePath}: missing ${token}`);
}

if (/ProjectCard|ProjectVisual/.test(home)) {
	failures.push(`${homePath}: still reuses Projects presentation`);
}

if (!projects.includes("ProjectCard")) {
	failures.push(`${projectsPath}: Projects index lost ProjectCard`);
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log("Homepage presentation contract passes.");
NODE
```

Then run:

```bash
pnpm exec rome check \
	app/components/home-project-proof.tsx \
	app/page.tsx \
	app/projects/page.tsx \
	app/projects/project-ui.tsx
pnpm typecheck
pnpm build
git diff --check
```

Expected:

- The source contract prints `Homepage presentation contract passes.`
- Rome, TypeScript, and the production build pass.
- `/projects` still renders its existing cards.
- `/` no longer imports or renders `ProjectCard` or `ProjectVisual`.

- [ ] **Step 5: Verify evidence rows in the browser**

Start the verified production build:

```bash
pnpm start
```

At 1440×900 and 390×844, open `/` and evaluate:

```js
() => {
	const slugs = ["gloss", "celery-fork-safety"];
	const rows = slugs.map((slug) => {
		const row = document.querySelector(`[data-home-project="${slug}"]`);
		return {
			slug,
			href: row?.getAttribute("href"),
			facts: row?.querySelectorAll("[data-project-fact]").length ?? 0,
			text: row?.textContent?.replace(/\s+/g, " ").trim() ?? "",
		};
	});

	return {
		rows,
		overflow:
			document.documentElement.scrollWidth -
			document.documentElement.clientWidth,
		order: [...document.querySelectorAll("[data-home-project]")].map((row) =>
			row.getAttribute("data-home-project"),
		),
	};
}
```

Expected:

- gloss links to `/projects/gloss`; Celery links to `/projects/celery-fork-safety`.
- Each row exposes its canonical title, year, category, eyebrow, summary, and exactly the three existing facts.
- `order` is exactly `["gloss", "celery-fork-safety"]`.
- Neither row contains `System map`, status copy, or technology pills.
- `overflow` is `0`.
- On desktop, identity, evidence, and CTA read as three columns.
- On mobile, each row stacks in identity → summary/facts → CTA order with no clipped fact values.
- Keyboard focus remains visible inside the grouped module.
- Browser console has no application errors.

Open `/projects` and confirm its visual cards are unchanged.

Stop the production server after the browser checks.

- [ ] **Step 6: Commit**

Immediately before committing:

```bash
git status --short --branch
git log -1 --oneline --decorate
```

Commit only the homepage presentation task:

```bash
git add app/components/home-project-proof.tsx app/page.tsx
git commit -m "feat: give homepage projects distinct previews"
```

---

### Task 3: Final Regression and Production Delivery

**Files:**
- Verify only; no source changes expected

**Interfaces:**
- Consumes: completed `PageAtmosphere` and `HomeProjectProof`
- Produces: clean integrated `main` and a Vercel production deployment matched to the exact Git SHA

- [ ] **Step 1: Run the complete fail-fast local gate**

Run:

```bash
set -e
git diff --check origin/main...HEAD
pnpm exec rome check app tailwind.config.js
pnpm typecheck
pnpm build

if rg -n \
	'spencer@spencerpresley\.com|framer-motion|components/particles|util/mouse|components/card|animate-(fade|title|glow)|text-edge-outline' \
	app global.css tailwind.config.js package.json pnpm-lock.yaml; then
	echo "stale implementation remains"
	exit 1
fi

if rg -n 'ProjectCard|ProjectVisual' app/page.tsx app/components/home-project-proof.tsx; then
	echo "homepage still duplicates Projects presentation"
	exit 1
fi

test ! -e util/mouse.ts
test ! -e app/components/particles.tsx
test ! -e app/components/card.tsx
```

Expected: every command exits zero and both searches return no matches.

- [ ] **Step 2: Run the production browser regression**

Start:

```bash
pnpm start
```

At 1440×900 and 390×844, verify:

- Home has one immediate `h1`, unchanged CrunchAtlas content, two evidence rows, and the closing Contact callout.
- Home, Projects, Contact, `/resume`, and `/resume/backend-platform` use the assigned atmosphere and eyebrow hues.
- `/projects/gloss` retains its project-specific atmosphere and has no top-level `data-atmosphere`.
- Home and Contact have no horizontal overflow.
- `/projects`, `/resume`, `/contact`, `/projects/gloss`, and `/projects/celery-fork-safety` return 200.
- The homepage rows contain the approved links and three facts each.
- Exercise the Projects, Resume, Contact, email, GitHub, LinkedIn, CrunchAtlas, gloss, and Celery links.
- Tab order follows visual order and focus rings are visible.
- The browser console has no application errors. A local-only 404 for `/_vercel/insights/script.js` from Vercel Analytics is allowed only in local production mode and must not appear on the deployed Vercel domain.

- [ ] **Step 3: Review the final Git range**

Run:

```bash
git status --short --branch
git log --oneline --decorate origin/main..HEAD
git diff --stat origin/main...HEAD
```

Expected:

- Worktree is clean.
- The two design commits, focused plan commit, atmosphere commit, and evidence-row commit are present.
- No unrelated file is included.

- [ ] **Step 4: Confirm the approved direct-main delivery state**

Use `superpowers:finishing-a-development-branch`.

This work is already approved for direct execution on `main`; do not invent a feature branch, merge commit, or worktree-cleanup step. Confirm `HEAD` is on `main`, the Step 3 range contains only the intended commits, and Step 1 passed on that exact `HEAD`.

- [ ] **Step 5: Push without force**

Immediately before pushing:

```bash
git status --short --branch
git log -1 --oneline --decorate
```

Push:

```bash
git push origin main
```

Expected: `main` advances without force.

- [ ] **Step 6: Match and wait for the exact Vercel deployment**

Run:

```bash
task_head_sha=$(git rev-parse HEAD)
task_deployment_json=$(
	vercel ls -m "githubCommitSha=$task_head_sha" --format json --limit 5
)
task_deployment_url=$(
	printf "%s" "$task_deployment_json" |
		jq -r '.deployments[0].url // empty'
)

if [ -z "$task_deployment_url" ]; then
	echo "No Vercel deployment found for $task_head_sha"
	exit 1
fi

vercel inspect "https://$task_deployment_url" --wait --timeout 45s
```

If the first filtered list is empty because GitHub has not created the deployment yet, repeat the filtered `vercel ls` command at five-second intervals for at most 60 seconds. Do not accept a deployment whose `meta.githubCommitSha` differs from `task_head_sha`.

Expected: the exact-SHA production deployment reaches `Ready`.

- [ ] **Step 7: Verify the custom domain**

Run:

```bash
set -e
printf "home_status="
curl -fsS -o /dev/null -w "%{http_code}\n" https://spencerpresley.com/
printf "projects_status="
curl -fsS -o /dev/null -w "%{http_code}\n" https://spencerpresley.com/projects
printf "contact_status="
curl -fsS -o /dev/null -w "%{http_code}\n" https://spencerpresley.com/contact
printf "resume_status="
curl -fsS -o /dev/null -w "%{http_code}\n" https://spencerpresley.com/resume

task_home_html=$(curl -fsSL https://spencerpresley.com/)
for task_marker in \
	"AI and backend systems that hold up outside the demo." \
	"CrunchAtlas / AtlasCyber" \
	"View case study" \
	"Artifact" \
	"Root cause"; do
	printf "%s" "$task_home_html" | rg -Fq "$task_marker"
done
```

Expected: every status is `200` and every homepage marker is present.

Open the deployed Home, Projects, Contact, and Resume pages in a fresh browser tab. Confirm the atmosphere sequence, evidence-row layout, desktop/mobile overflow, link targets, and zero browser-console errors—including no Vercel Analytics 404.
