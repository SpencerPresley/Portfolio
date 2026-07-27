# Professional Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add internal, statically authored CrunchAtlas and AtlasConnect professional case studies and route the existing Home and Projects previews into them.

**Architecture:** Canonical card and hero metadata lives in one server-safe TypeScript module. A focused shared UI module owns the repeated case-study shell, headings, flows, figures, and footer; two explicit static routes compose those primitives differently so CrunchAtlas remains screenshot-led and AtlasConnect remains process-led. Dedicated Home and Projects preview components consume the same metadata without sharing presentation.

**Tech Stack:** Next.js 15 App Router, React 18 server components, TypeScript 5, Tailwind CSS 3, Next Image, Lucide React, pnpm, Rome 12, `cwebp`.

## Global Constraints

- Implement `docs/superpowers/specs/2026-07-27-professional-case-studies-design.md`.
- Before Task 1, complete `docs/superpowers/plans/2026-07-27-persistent-home-navigation.md`; every new route consumes that persistent shared navigation.
- Add exactly two professional routes: `/projects/crunchatlas` and `/projects/atlasconnect`.
- Keep public open-source projects in the existing `projects` array; do not insert either professional slug there.
- Keep content hard-coded in TypeScript. Add no MDX, CMS, database, Redis, runtime fetch, or content API.
- Use explicit page composition rather than a generic polymorphic block schema.
- Use only `campaign-assessment-dark.png` and `case-agent-report-dark.png` from the approved CrunchAtlas marketing-shot directory for new images.
- Copy no Pitchfire website assets.
- Preserve the ownership and confidentiality language in the design spec.
- Do not include customer data, private repository paths, proprietary prompts, exact detector logic, exact offensive procedures, private capacity values, or deployment recipes.
- Do not add project, commit, test, contributor, deployment, customer, revenue, or lines-of-code counts.
- The current broad read-only sandbox media mount prevents any claim of perfect tenant isolation.
- The AtlasConnect email-intake path is valid user-confirmed work even though its Lambda source is outside the checked-out repositories.
- Home and Projects must consume the same canonical metadata but retain different professional-preview compositions.
- Both pages remain server-rendered and fetch no runtime data.
- Add no dependency.
- Verify at 1440×900 and 390×844.

---

### Task 1: Add the typed professional-work foundation

**Files:**
- Create: `app/projects/professional-work-data.ts`
- Create: `app/projects/professional-case-study-ui.tsx`

**Interfaces:**
- Produces: `ProfessionalWorkSlug = "crunchatlas" | "atlasconnect"`
- Produces: `ProfessionalWork`
- Produces: `professionalWork: Record<ProfessionalWorkSlug, ProfessionalWork>`
- Produces: `professionalWorkList: readonly ProfessionalWork[]`
- Produces: `getProfessionalWork(slug): ProfessionalWork`
- Produces: `CaseStudyShell`, `CaseStudyHero`, `CaseStudySection`, `SystemFlow`, `DetailGrid`, `MarketingShot`, and `ProfessionalCaseStudyFooter`
- Consumes: the already-implemented shared `Navigation`

- [ ] **Step 1: Run the foundation source contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");
const expectations = {
	"app/projects/professional-work-data.ts": [
		"ProfessionalWorkSlug",
		"ProfessionalWork",
		"professionalWork",
		"professionalWorkList",
		"getProfessionalWork",
		'"crunchatlas"',
		'"atlasconnect"',
		'"/projects/crunchatlas"',
		'"/projects/atlasconnect"',
		'"https://www.crunchatlas.com/"',
		'"https://www.pitchfire.com/"',
	],
	"app/projects/professional-case-study-ui.tsx": [
		"CaseStudyShell",
		"CaseStudyHero",
		"CaseStudySection",
		"SystemFlow",
		"DetailGrid",
		"MarketingShot",
		"ProfessionalCaseStudyFooter",
		"<Navigation",
	],
};
const failures = [];

for (const [path, tokens] of Object.entries(expectations)) {
	if (!fs.existsSync(path)) {
		failures.push(`${path}: missing`);
		continue;
	}
	const source = fs.readFileSync(path, "utf8");
	for (const token of tokens) {
		if (!source.includes(token)) failures.push(`${path}: missing ${token}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.log("Professional case-study foundation contract passes.");
NODE
```

Expected: FAIL because neither foundation file exists.

- [ ] **Step 2: Create the canonical professional-work data**

Create `app/projects/professional-work-data.ts`:

```ts
export type ProfessionalWorkSlug = "crunchatlas" | "atlasconnect";

export type ProfessionalWorkAccent = "amber" | "sky";

export type ProfessionalWorkImage = {
	src: string;
	alt: string;
};

export type ProfessionalWork = {
	slug: ProfessionalWorkSlug;
	href: `/projects/${ProfessionalWorkSlug}`;
	title: string;
	cardTitle: string;
	eyebrow: string;
	period: string;
	category: string;
	headline: string;
	summary: string;
	lead: string;
	role: string;
	accent: ProfessionalWorkAccent;
	external: {
		label: string;
		href: string;
	};
	previewSteps: readonly string[];
	flow: readonly string[];
	image: ProfessionalWorkImage | undefined;
};

export const professionalWork = {
	crunchatlas: {
		slug: "crunchatlas",
		href: "/projects/crunchatlas",
		title: "CrunchAtlas: AtlasCyber & PurpleHaze",
		cardTitle: "CrunchAtlas / AtlasCyber",
		eyebrow: "Current work",
		period: "2025–",
		category: "Local AI and security systems",
		headline: "Reliable local AI where cloud assumptions break.",
		summary:
			"I build the AI and backend infrastructure behind AtlasCyber: evidence-grounded agents, governed local inference, durable work orchestration, and isolated execution across cloud, on-prem, and air-gapped environments.",
		lead:
			"I build the systems that keep long-running security agents bounded, observable, and useful on local hardware. I also built PurpleHaze end to end.",
		role:
			"I built the systems described here, built PurpleHaze end to end, and built most of AtlasCyber's AI and backend platform. I also own AtlasCyber's AWS across GovCloud and commercial partitions.",
		accent: "amber",
		external: {
			label: "Visit CrunchAtlas",
			href: "https://www.crunchatlas.com/",
		},
		previewSteps: [
			"Governed local inference",
			"Durable work admission",
			"Observable agent runtime",
			"Cloud, on-prem, and air-gapped delivery",
		],
		flow: [
			"Evidence",
			"Durable work admission",
			"Governed local agents",
			"Inspectable analysis",
		],
		image: {
			src: "/projects/crunchatlas-campaign-teaser.webp",
			alt: "CrunchAtlas marketing view showing a redacted network security campaign summary",
		},
	},
	atlasconnect: {
		slug: "atlasconnect",
		href: "/projects/atlasconnect",
		title: "AtlasConnect → Pitchfire",
		cardTitle: "AtlasConnect",
		eyebrow: "Private production work",
		period: "2025",
		category: "AI product and backend",
		headline: "From incoming pitch deck to an investment decision.",
		summary:
			"As sole developer and maintainer of an inherited Django and React product, I built the ingestion, AI research, fit evaluation, and firm workflow now marketed as Pitchfire.",
		lead:
			"The system turned messy submissions into structured opportunities, firm-specific research, and a decision workflow people could actually operate.",
		role:
			"I was the sole developer and maintainer during my tenure. I inherited the original product, then built and operated the systems described here.",
		accent: "sky",
		external: {
			label: "See Pitchfire",
			href: "https://www.pitchfire.com/",
		},
		previewSteps: [
			"Form, file, DocSend, and email intake",
			"Native extraction with OCR fallback",
			"AI enrichment and firm-fit research",
			"Voting, discussion, and deal workflow",
		],
		flow: [
			"Intake",
			"Extraction",
			"Enrichment and research",
			"Firm decision",
		],
		image: undefined,
	},
} as const satisfies Record<ProfessionalWorkSlug, ProfessionalWork>;

export const professionalWorkList: readonly ProfessionalWork[] = [
	professionalWork.crunchatlas,
	professionalWork.atlasconnect,
];

export function getProfessionalWork(
	slug: ProfessionalWorkSlug,
): ProfessionalWork {
	return professionalWork[slug];
}
```

Keep the module free of React, browser APIs, private-source paths, and
page-layout fields.

- [ ] **Step 3: Create the shared case-study UI primitives**

Create `app/projects/professional-case-study-ui.tsx` with these exported
interfaces and implementations:

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Navigation } from "../components/nav";
import {
	getProfessionalWork,
	type ProfessionalWork,
	type ProfessionalWorkAccent,
	type ProfessionalWorkSlug,
} from "./professional-work-data";

const accentStyles = {
	amber: {
		wash: "bg-[radial-gradient(circle_at_16%_0%,rgba(245,158,11,0.17),transparent_38%),radial-gradient(circle_at_84%_12%,rgba(244,63,94,0.11),transparent_34%)]",
		text: "text-amber-300",
		border: "border-amber-400/20",
		soft: "bg-amber-400/10",
		dot: "bg-amber-300",
		ring: "focus-visible:ring-amber-400",
	},
	sky: {
		wash: "bg-[radial-gradient(circle_at_14%_0%,rgba(14,165,233,0.17),transparent_38%),radial-gradient(circle_at_86%_12%,rgba(124,58,237,0.13),transparent_34%)]",
		text: "text-sky-300",
		border: "border-sky-400/20",
		soft: "bg-sky-400/10",
		dot: "bg-sky-300",
		ring: "focus-visible:ring-sky-400",
	},
} as const satisfies Record<
	ProfessionalWorkAccent,
	{
		wash: string;
		text: string;
		border: string;
		soft: string;
		dot: string;
		ring: string;
	}
>;

export function CaseStudyShell({
	work,
	children,
}: {
	work: ProfessionalWork;
	children: ReactNode;
}) {
	const accent = accentStyles[work.accent];

	return (
		<div
			data-professional-case-study={work.slug}
			className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100"
		>
			<div
				className={`pointer-events-none absolute inset-x-0 top-0 h-[56rem] ${accent.wash}`}
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_38%)]"
				aria-hidden="true"
			/>
			<Navigation />
			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				{children}
			</main>
		</div>
	);
}

export function CaseStudyHero({
	work,
	disclosure,
}: {
	work: ProfessionalWork;
	disclosure?: string;
}) {
	const accent = accentStyles[work.accent];

	return (
		<header className="border-b border-zinc-800 pb-16">
			<Link
				href="/projects"
				className={`inline-flex items-center gap-2 rounded-sm text-sm text-zinc-500 transition hover:text-white focus:outline-none focus-visible:ring-2 ${accent.ring}`}
			>
				<ArrowLeft className="h-4 w-4" aria-hidden="true" />
				All projects
			</Link>

			<div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
				<div className="max-w-4xl">
					<p
						className={`font-mono text-xs uppercase tracking-[0.22em] ${accent.text}`}
					>
						{work.title}
					</p>
					<p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-600">
						{work.eyebrow} · {work.period}
					</p>
					<h1 className="mt-6 font-display text-5xl leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
						{work.headline}
					</h1>
					<p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">
						{work.lead}
					</p>
				</div>

				<aside className="border-l border-zinc-800 pl-7">
					<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
						My role
					</p>
					<p className="mt-3 text-sm leading-7 text-zinc-300">{work.role}</p>
					<a
						href={work.external.href}
						target="_blank"
						rel="noreferrer"
						className={`mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-medium ${accent.text} focus:outline-none focus-visible:ring-2 ${accent.ring}`}
					>
						{work.external.label}
						<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
					</a>
				</aside>
			</div>

			{disclosure ? (
				<p
					data-public-boundary
					className={`mt-12 max-w-4xl rounded-2xl border ${accent.border} ${accent.soft} px-5 py-4 text-sm leading-7 text-zinc-400`}
				>
					{disclosure}
				</p>
			) : null}
		</header>
	);
}

export function CaseStudySection({
	number,
	eyebrow,
	title,
	id,
	intro,
	children,
}: {
	number: string;
	eyebrow: string;
	title: string;
	id: string;
	intro?: string;
	children: ReactNode;
}) {
	return (
		<section className="border-b border-zinc-800 py-20" aria-labelledby={id}>
			<div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
				<div>
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
						{number} · {eyebrow}
					</p>
				</div>
				<div className="min-w-0 max-w-4xl">
					<h2
						id={id}
						className="font-display text-3xl leading-tight text-white sm:text-4xl"
					>
						{title}
					</h2>
					{intro ? (
						<p className="mt-6 max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
							{intro}
						</p>
					) : null}
					<div className="mt-10">{children}</div>
				</div>
			</div>
		</section>
	);
}

export function SystemFlow({
	label,
	steps,
	accent,
}: {
	label: string;
	steps: readonly string[];
	accent: ProfessionalWorkAccent;
}) {
	const styles = accentStyles[accent];

	return (
		<ol
			aria-label={label}
			className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
		>
			{steps.map((step, index) => (
				<li
					key={step}
					className={`relative rounded-2xl border ${styles.border} bg-zinc-900/55 p-5`}
				>
					<span className={`font-mono text-[0.65rem] ${styles.text}`}>
						{String(index + 1).padStart(2, "0")}
					</span>
					<span className="mt-4 block text-sm leading-6 text-zinc-200">
						{step}
					</span>
				</li>
			))}
		</ol>
	);
}

export function DetailGrid({
	items,
	accent,
}: {
	items: readonly { title: string; detail: string }[];
	accent: ProfessionalWorkAccent;
}) {
	const styles = accentStyles[accent];

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{items.map((item, index) => (
				<article
					key={item.title}
					className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-6"
				>
					<span className={`font-mono text-[0.65rem] ${styles.text}`}>
						{String(index + 1).padStart(2, "0")}
					</span>
					<h3 className="mt-5 text-base font-semibold text-zinc-100">
						{item.title}
					</h3>
					<p className="mt-3 text-sm leading-7 text-zinc-500">
						{item.detail}
					</p>
				</article>
			))}
		</div>
	);
}

export function MarketingShot({
	src,
	alt,
	caption,
	priority = false,
}: {
	src: string;
	alt: string;
	caption: string;
	priority?: boolean;
}) {
	return (
		<figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/55">
			<div className="relative aspect-video bg-zinc-950">
				<Image
					src={src}
					alt={alt}
					fill
					priority={priority}
					sizes="(max-width: 1024px) 100vw, 900px"
					className="object-cover"
				/>
			</div>
			<figcaption className="border-t border-zinc-800 px-6 py-4 text-xs leading-6 text-zinc-500">
				{caption}
			</figcaption>
		</figure>
	);
}

export function ProfessionalCaseStudyFooter({
	current,
}: {
	current: ProfessionalWorkSlug;
}) {
	const nextSlug: ProfessionalWorkSlug =
		current === "crunchatlas" ? "atlasconnect" : "crunchatlas";
	const next = getProfessionalWork(nextSlug);

	return (
		<footer className="pt-20">
			<Link
				href={next.href}
				className="group grid gap-8 border-y border-zinc-800 py-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
			>
				<div>
					<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
						Next professional case study
					</p>
					<p className="mt-4 font-display text-3xl text-zinc-200 transition group-hover:text-white sm:text-4xl">
						{next.title}
					</p>
				</div>
				<span className="inline-flex items-center gap-2 text-sm text-zinc-500 transition group-hover:text-zinc-200">
					Keep reading
					<ArrowRight
						className="h-4 w-4 transition group-hover:translate-x-1"
						aria-hidden="true"
					/>
				</span>
			</Link>
			<Link
				href="/projects"
				className="mt-8 inline-flex rounded-sm text-sm text-zinc-500 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
			>
				Return to all projects
			</Link>
		</footer>
	);
}
```

Do not add `"use client"` to either foundation file.

- [ ] **Step 4: Run the foundation contract and static verification**

Rerun the Step 1 source contract, then run:

```bash
pnpm exec rome check \
	app/projects/professional-work-data.ts \
	app/projects/professional-case-study-ui.tsx
pnpm typecheck
git diff --check
```

Expected:

- The foundation contract prints
  `Professional case-study foundation contract passes.`
- Rome and TypeScript pass.
- No runtime route changes exist yet.

- [ ] **Step 5: Commit the foundation**

Immediately before committing:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff --check
```

Commit only the two foundation files:

```bash
git add \
	app/projects/professional-work-data.ts \
	app/projects/professional-case-study-ui.tsx
git diff --cached --check
git commit -m "feat: add professional case study foundation"
```

---

### Task 2: Build the CrunchAtlas case study

**Files:**
- Create: `app/projects/crunchatlas/page.tsx`
- Create: `public/projects/crunchatlas-campaign-assessment.webp`
- Create: `public/projects/crunchatlas-agent-report.webp`

**Interfaces:**
- Consumes: `professionalWork.crunchatlas`
- Consumes: all shared UI exports from Task 1
- Produces: static route `/projects/crunchatlas`
- Produces: article metadata with `/projects/crunchatlas` canonical and campaign-assessment Open Graph image

- [ ] **Step 1: Run the CrunchAtlas route contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");
const page = "app/projects/crunchatlas/page.tsx";
const images = [
	"public/projects/crunchatlas-campaign-assessment.webp",
	"public/projects/crunchatlas-agent-report.webp",
];
const failures = [];

if (!fs.existsSync(page)) {
	failures.push(`${page}: missing`);
} else {
	const source = fs.readFileSync(page, "utf8");
	for (const token of [
		"professionalWork.crunchatlas",
		'canonical: "/projects/crunchatlas"',
		"CaseStudyShell",
		"CaseStudyHero",
		"SystemFlow",
		"MarketingShot",
		"PurpleHaze",
		"CrunchSense v3",
		"GovCloud",
		"ProfessionalCaseStudyFooter",
	]) {
		if (!source.includes(token)) failures.push(`${page}: missing ${token}`);
	}
}
for (const image of images) {
	if (!fs.existsSync(image)) failures.push(`${image}: missing`);
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.log("CrunchAtlas route contract passes.");
NODE
```

Expected: FAIL because the route and optimized images do not exist.

- [ ] **Step 2: Optimize the approved marketing images**

Run:

```bash
cwebp -quiet -q 82 -resize 1920 1080 \
	/Users/spencer/work/atlascyber-main/marketing-shots/campaign-assessment-dark.png \
	-o public/projects/crunchatlas-campaign-assessment.webp

cwebp -quiet -q 82 -resize 1920 1080 \
	/Users/spencer/work/atlascyber-main/marketing-shots/case-agent-report-dark.png \
	-o public/projects/crunchatlas-agent-report.webp

magick identify \
	public/projects/crunchatlas-campaign-assessment.webp \
	public/projects/crunchatlas-agent-report.webp
```

Expected: both outputs report WebP format at 1920×1080. Do not copy any other
marketing-shot file.

- [ ] **Step 3: Create the CrunchAtlas page**

Create `app/projects/crunchatlas/page.tsx`:

```tsx
import type { Metadata } from "next";
import {
	CaseStudyHero,
	CaseStudySection,
	CaseStudyShell,
	DetailGrid,
	MarketingShot,
	ProfessionalCaseStudyFooter,
	SystemFlow,
} from "../professional-case-study-ui";
import { professionalWork } from "../professional-work-data";

const work = professionalWork.crunchatlas;

export const metadata: Metadata = {
	title: work.title,
	description: work.summary,
	alternates: {
		canonical: "/projects/crunchatlas",
	},
	openGraph: {
		title: work.title,
		description: work.summary,
		type: "article",
		images: [{ url: "/projects/crunchatlas-campaign-assessment.webp" }],
	},
};

const atlasCyberMechanisms = [
	{
		title: "Prove the deployment before launch",
		detail:
			"Model serving is declarative and fail-closed. The deployment is rejected unless its declared context, concurrency, and memory shape fit the hardware budget.",
	},
	{
		title: "Admit work by cost, not worker count",
		detail:
			"Postgres claims AI work under a shared token-domain budget, so task shape—not an arbitrary process count—determines whether scarce local inference capacity is available.",
	},
	{
		title: "Keep agent failure visible",
		detail:
			"Workers, supervisors, child processes, streaming events, and a sweeper preserve an observable lifecycle through cancellation, crashes, process death, and abandoned work.",
	},
	{
		title: "Bound fallible model behavior",
		detail:
			"Exact token accounting, tool-result eviction, compaction, parse recovery, and output-cap recovery keep long-running domain agents inside explicit operating limits.",
	},
] as const;

const purpleHazeDetails = [
	{
		title: "Engagement orchestration",
		detail:
			"Workflow and scan steps were chained into one controlled engagement rather than exposed as disconnected tools.",
	},
	{
		title: "Persistent live state",
		detail:
			"Offensive-session state survived long runs and context compaction, preserving the execution state the model could not safely reconstruct.",
	},
	{
		title: "Durable execution records",
		detail:
			"Tool execution and workflow state remained inspectable across the engagement instead of disappearing into an opaque chat transcript.",
	},
	{
		title: "Validated reports",
		detail:
			"OWASP, NIST, executive, and supporting report structures were validated before generating final report artifacts.",
	},
] as const;

export default function CrunchAtlasCaseStudy() {
	return (
		<CaseStudyShell work={work}>
			<CaseStudyHero
				work={work}
				disclosure="This case study describes system boundaries and engineering mechanisms. It omits customer data, proprietary detection logic, exact offensive procedures, private prompts, and private source."
			/>

			<CaseStudySection
				number="01"
				eyebrow="Operating constraint"
				title="The hard part was making local intelligence operable."
				id="operating-constraint"
				intro="AtlasCyber has to run across cloud, on-premises, and air-gapped environments. That turns GPU capacity, long evidence sets, process failure, and provenance into product constraints—not infrastructure trivia."
			>
				<SystemFlow
					label="AtlasCyber analysis flow"
					steps={work.flow}
					accent={work.accent}
				/>
			</CaseStudySection>

			<CaseStudySection
				number="02"
				eyebrow="AtlasCyber"
				title="Deterministic scaffolding around fallible local models."
				id="atlascyber-runtime"
				intro="I built the serving, work-admission, execution, and agent-runtime layers as one operating system for AI-heavy security work. Each boundary exists because a worker count, a prompt, or a happy-path process tree is not a reliability strategy."
			>
				<DetailGrid items={atlasCyberMechanisms} accent={work.accent} />
				<div className="mt-8 grid gap-5 text-[1.02rem] leading-8 text-zinc-400 lg:grid-cols-2">
					<p>
						Domain agents construct models through one boundary, while
						per-request serving ceilings remain separate from per-task context
						budgets. Generic middleware owns context policy; report and security
						semantics stay in their domain layers.
					</p>
					<p>
						Per-run tool containers are read-only, network-disabled, resource
						bounded, and self-reaping. I do not describe that as perfect tenant
						isolation: narrowing the current read-only media aperture remains a
						separate security boundary.
					</p>
				</div>
			</CaseStudySection>

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

			<CaseStudySection
				number="04"
				eyebrow="PurpleHaze"
				title="An autonomous engagement, built end to end."
				id="purplehaze"
				intro="PurpleHaze connected a local model to controlled offensive workflows while preserving the live execution state and report contracts the model could not be trusted to remember or invent."
			>
				<SystemFlow
					label="PurpleHaze engagement flow"
					steps={[
						"Scope",
						"Controlled execution",
						"Persistent session state",
						"Validated report",
					]}
					accent={work.accent}
				/>
				<div className="mt-6">
					<DetailGrid items={purpleHazeDetails} accent={work.accent} />
				</div>
			</CaseStudySection>

			<CaseStudySection
				number="05"
				eyebrow="Delivery and edge"
				title="The same reliability boundary continues outside the agent."
				id="delivery-and-edge"
			>
				<div className="grid gap-5 lg:grid-cols-2">
					<article className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-7">
						<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber-300">
							Operational ownership
						</p>
						<h3 className="mt-5 font-display text-2xl text-white">
							AtlasCyber in AWS
						</h3>
						<p className="mt-4 text-sm leading-7 text-zinc-400">
							I own AtlasCyber's AWS footprint across GovCloud and commercial
							partitions: compute, object storage, IAM, VPC networking, content
							delivery, and the reverse-proxy and tunnel fleet that reaches
							deployed environments.
						</p>
					</article>

					<article className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-7">
						<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber-300">
							Completed rewrite foundation
						</p>
						<h3 className="mt-5 font-display text-2xl text-white">
							CrunchSense v3
						</h3>
						<p className="mt-4 text-sm leading-7 text-zinc-400">
							I rewrote the AtlasCyber edge sensor around a headless Rust
							daemon: BPF-filtered capture and atomic rotation, a persistent
							SQLite WAL upload queue, bounded retry, storage-pressure guards,
							machine-bound encrypted credentials, an authenticated loopback
							API, hardened systemd delivery, and Linux package/service smoke
							coverage. The UI is optional, so capture does not depend on its
							lifecycle.
						</p>
						<p className="mt-3 text-xs leading-6 text-zinc-600">
							This is a stability-oriented foundation with deliberate legacy
							parity still deferred.
						</p>
					</article>
				</div>
			</CaseStudySection>

			<section className="py-20" aria-labelledby="crunchatlas-outcome">
				<div className="rounded-3xl border border-amber-400/20 bg-zinc-900/55 p-8 sm:p-12">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
						Where it landed
					</p>
					<h2
						id="crunchatlas-outcome"
						className="mt-5 max-w-4xl font-display text-3xl leading-relaxed text-white sm:text-4xl"
					>
						Local models and security tools became one operable system with
						explicit admission, bounded execution, durable state, and
						inspectable results across cloud, on-premises, and air-gapped
						environments.
					</h2>
				</div>
			</section>

			<ProfessionalCaseStudyFooter current="crunchatlas" />
		</CaseStudyShell>
	);
}
```

- [ ] **Step 4: Run focused verification**

Rerun the Step 1 route contract, then run:

```bash
pnpm exec rome check \
	app/projects/crunchatlas/page.tsx \
	app/projects/professional-case-study-ui.tsx \
	app/projects/professional-work-data.ts
pnpm typecheck
pnpm build
git diff --check
```

Expected:

- The contract prints `CrunchAtlas route contract passes.`
- Rome, TypeScript, and the build pass.
- The build lists `/projects/crunchatlas` as a static route.

- [ ] **Step 5: Inspect the CrunchAtlas route**

Run the production build with `pnpm start`. At 1440×900 and 390×844 inspect
`/projects/crunchatlas` and evaluate:

```js
() => ({
	caseStudy: document
		.querySelector("[data-professional-case-study]")
		?.getAttribute("data-professional-case-study"),
	h1: document.querySelector("h1")?.textContent?.trim(),
	sections: [...document.querySelectorAll("main h2")].map((heading) =>
		heading.textContent?.replace(/\s+/g, " ").trim(),
	),
	figures: [...document.querySelectorAll("figure")].map((figure) => ({
		alt: figure.querySelector("img")?.getAttribute("alt"),
		caption: figure.querySelector("figcaption")?.textContent?.trim(),
	})),
	publicBoundary: document.querySelector("[data-public-boundary]")?.textContent?.trim(),
	overflow:
		document.documentElement.scrollWidth -
		document.documentElement.clientWidth,
})
```

Expected:

- `caseStudy` is `crunchatlas`.
- The hero, five chapters, outcome, two figures, and public-boundary disclosure
  are present.
- Both figures have nonempty, distinct alternatives and visible captions.
- The flow stages read in order at mobile width.
- Overflow is `0`.
- There are no missing-image or browser-console errors.

- [ ] **Step 6: Commit the CrunchAtlas case study**

Immediately before committing:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff --check
```

Commit only the route and approved assets:

```bash
git add \
	app/projects/crunchatlas/page.tsx \
	public/projects/crunchatlas-campaign-assessment.webp \
	public/projects/crunchatlas-agent-report.webp
git diff --cached --check
git commit -m "feat: add CrunchAtlas case study"
```

---

### Task 3: Build the AtlasConnect case study

**Files:**
- Create: `app/projects/atlasconnect/page.tsx`

**Interfaces:**
- Consumes: `professionalWork.atlasconnect`
- Consumes: `CaseStudyShell`, `CaseStudyHero`, `SystemFlow`, `DetailGrid`, and `ProfessionalCaseStudyFooter`
- Produces: static route `/projects/atlasconnect`
- Produces: article metadata with `/projects/atlasconnect` canonical and no fabricated Open Graph image

- [ ] **Step 1: Run the AtlasConnect route contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");
const page = "app/projects/atlasconnect/page.tsx";
const failures = [];

if (!fs.existsSync(page)) {
	failures.push(`${page}: missing`);
} else {
	const source = fs.readFileSync(page, "utf8");
	for (const token of [
		"professionalWork.atlasconnect",
		'canonical: "/projects/atlasconnect"',
		"CaseStudyShell",
		"CaseStudyHero",
		"SystemFlow",
		"DocSend",
		"AWS Lambda",
		"OCR",
		"Firm workflow",
		"ProfessionalCaseStudyFooter",
	]) {
		if (!source.includes(token)) failures.push(`${page}: missing ${token}`);
	}
	if (/images\s*:/.test(source)) {
		failures.push(`${page}: fabricates route-specific Open Graph imagery`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.log("AtlasConnect route contract passes.");
NODE
```

Expected: FAIL because the route does not exist.

- [ ] **Step 2: Create the process-led AtlasConnect page**

Create `app/projects/atlasconnect/page.tsx`:

```tsx
import type { Metadata } from "next";
import {
	CaseStudyHero,
	CaseStudyShell,
	DetailGrid,
	ProfessionalCaseStudyFooter,
	SystemFlow,
} from "../professional-case-study-ui";
import { professionalWork } from "../professional-work-data";

const work = professionalWork.atlasconnect;

export const metadata: Metadata = {
	title: work.title,
	description: work.summary,
	alternates: {
		canonical: "/projects/atlasconnect",
	},
	openGraph: {
		title: work.title,
		description: work.summary,
		type: "article",
	},
};

const engineeringChoices = [
	{
		title: "Treat extraction quality as data",
		detail:
			"Native parsing remained the fast path, but glyph and quality checks decided when a page needed selective or full OCR instead of silently accepting garbage.",
	},
	{
		title: "Separate preparation from judgment",
		detail:
			"Firm and opportunity analyses could run concurrently before synthesis, keeping expensive research observable and preventing one opaque prompt from owning the whole decision.",
	},
	{
		title: "Move slow work off the request path",
		detail:
			"Background execution and realtime progress let ingestion, research, and memo work complete without turning the browser request into the job lifecycle.",
	},
	{
		title: "Finish the human workflow",
		detail:
			"Stages, voting, discussion, reminders, and notifications connected model output to the actual decision process instead of stopping at generated text.",
	},
] as const;

const stages = [
	{
		number: "01",
		eyebrow: "Intake",
		title: "Accept the opportunity through the channel it actually arrived in.",
		body:
			"Embedded forms, direct uploads, DocSend imports, and an AWS Lambda email-intake path all converged on the same opportunity workflow. The Lambda source lived outside the application repositories, but I built and operated that path alongside the product.",
		detail:
			"Multiple entry points mattered because a venture workflow cannot require every founder, analyst, or forwarded deck to begin inside one idealized form.",
	},
	{
		number: "02",
		eyebrow: "Extraction",
		title: "Make bad documents explicit instead of trusting the happy path.",
		body:
			"The ingestion layer handled PDF, DOCX, PPTX, images, and text. It attempted native extraction first, detected glyph and quality failures, then used selective or full OCR fallback with parallel page work when the source required it.",
		detail:
			"Structured opportunity fields and visible progress turned that document work into an inspectable product step rather than a blocking upload spinner.",
	},
	{
		number: "03",
		eyebrow: "Fit and research",
		title: "Build firm context and opportunity context before asking for a verdict.",
		body:
			"Firm and opportunity preparation ran concurrently, then fed synthesis, thesis-fit evaluation, market research, and leadership research. Bounded navigation and background execution kept research useful without giving it an unbounded request lifecycle.",
		detail:
			"The public case study describes the staged system, not the private scoring prompts, weights, or research instructions.",
	},
	{
		number: "04",
		eyebrow: "Firm workflow",
		title: "A decision product still needs the ordinary product work.",
		body:
			"Opportunity stages, voting, requests, discussions, reminders, notifications, and realtime completion feedback carried the enriched deal through the firm's human decision process.",
		detail:
			"That workflow is what separated a production product from a collection of LLM calls that happened to read pitch decks.",
	},
] as const;

export default function AtlasConnectCaseStudy() {
	return (
		<CaseStudyShell work={work}>
			<CaseStudyHero work={work} />

			<section className="border-b border-zinc-800 py-20" aria-labelledby="atlasconnect-flow">
				<div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
						01 · System flow
					</p>
					<div className="min-w-0 max-w-4xl">
						<h2
							id="atlasconnect-flow"
							className="font-display text-3xl leading-tight text-white sm:text-4xl"
						>
							One pipeline from raw submission to firm decision.
						</h2>
						<p className="mt-6 max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
							The interesting part was not any single model call. It was making
							messy intake, document recovery, research, structured evaluation,
							and ordinary collaboration behave like one product.
						</p>
						<div className="mt-10">
							<SystemFlow
								label="AtlasConnect opportunity flow"
								steps={work.flow}
								accent={work.accent}
							/>
						</div>
					</div>
				</div>
			</section>

			<div className="border-b border-zinc-800 py-20">
				<div className="grid gap-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<aside className="lg:sticky lg:top-28 lg:self-start">
						<p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
							02 · Pipeline
						</p>
						<p className="mt-5 text-sm leading-7 text-zinc-500">
							Each stage produced a durable input for the next one and a visible
							state for the operator.
						</p>
					</aside>

					<div className="space-y-16">
						{stages.map((stage) => (
							<section
								key={stage.number}
								aria-labelledby={`atlasconnect-stage-${stage.number}`}
								className="grid gap-6 border-l border-sky-400/20 pl-6 sm:pl-9"
							>
								<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-sky-300">
									{stage.number} · {stage.eyebrow}
								</p>
								<h2
									id={`atlasconnect-stage-${stage.number}`}
									className="font-display text-3xl leading-tight text-white"
								>
									{stage.title}
								</h2>
								<p className="text-[1.02rem] leading-8 text-zinc-400">
									{stage.body}
								</p>
								<p className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-5 text-sm leading-7 text-zinc-500">
									{stage.detail}
								</p>
							</section>
						))}
					</div>
				</div>
			</div>

			<section className="border-b border-zinc-800 py-20" aria-labelledby="atlasconnect-decisions">
				<div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
						03 · Engineering choices
					</p>
					<div className="min-w-0 max-w-4xl">
						<h2
							id="atlasconnect-decisions"
							className="font-display text-3xl leading-tight text-white sm:text-4xl"
						>
							The pipeline stayed observable at every expensive boundary.
						</h2>
						<div className="mt-10">
							<DetailGrid items={engineeringChoices} accent={work.accent} />
						</div>
					</div>
				</div>
			</section>

			<section className="py-20" aria-labelledby="atlasconnect-outcome">
				<div className="rounded-3xl border border-sky-400/20 bg-zinc-900/55 p-8 sm:p-12">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
						Where it landed
					</p>
					<h2
						id="atlasconnect-outcome"
						className="mt-5 max-w-4xl font-display text-3xl leading-relaxed text-white sm:text-4xl"
					>
						The product moved an opportunity from raw deck to structured
						research, firm-specific fit, and a collaborative decision workflow.
						It is now marketed as Pitchfire.
					</h2>
				</div>
			</section>

			<ProfessionalCaseStudyFooter current="atlasconnect" />
		</CaseStudyShell>
	);
}
```

- [ ] **Step 3: Run focused verification**

Rerun the Step 1 contract, then run:

```bash
pnpm exec rome check \
	app/projects/atlasconnect/page.tsx \
	app/projects/professional-case-study-ui.tsx \
	app/projects/professional-work-data.ts
pnpm typecheck
pnpm build
git diff --check
```

Expected:

- The contract prints `AtlasConnect route contract passes.`
- Rome, TypeScript, and the build pass.
- The build lists `/projects/atlasconnect` as a static route.
- No route-specific Open Graph image is present.

- [ ] **Step 4: Inspect the AtlasConnect route**

Run the production build with `pnpm start`. At 1440×900 and 390×844 inspect
`/projects/atlasconnect` and evaluate:

```js
() => ({
	caseStudy: document
		.querySelector("[data-professional-case-study]")
		?.getAttribute("data-professional-case-study"),
	h1: document.querySelector("h1")?.textContent?.trim(),
	flows: [...document.querySelectorAll('ol[aria-label]')].map((flow) => ({
		label: flow.getAttribute("aria-label"),
		steps: [...flow.querySelectorAll("li")].map((step) =>
			step.textContent?.replace(/\s+/g, " ").trim(),
		),
	})),
	stages: [...document.querySelectorAll('[id^="atlasconnect-stage-"]')].map(
		(heading) => heading.textContent?.trim(),
	),
	images: document.querySelectorAll("main img").length,
	overflow:
		document.documentElement.scrollWidth -
		document.documentElement.clientWidth,
})
```

Expected:

- `caseStudy` is `atlasconnect`.
- The four-stage system flow and four detailed stages read in order.
- The page contains no copied Pitchfire or fabricated marketing image.
- The process rail becomes ordinary reading order at mobile width.
- Overflow is `0`.
- There are no browser-console errors.

- [ ] **Step 5: Commit the AtlasConnect case study**

Immediately before committing:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff --check
```

Commit only the new route:

```bash
git add app/projects/atlasconnect/page.tsx
git diff --cached --check
git commit -m "feat: add AtlasConnect case study"
```

---

### Task 4: Route Home and Projects through distinct internal previews

**Files:**
- Create: `app/components/home-professional-work.tsx`
- Create: `app/projects/professional-work-card.tsx`
- Modify: `app/page.tsx`
- Modify: `app/projects/page.tsx`

**Interfaces:**
- Consumes: `ProfessionalWork`
- Produces: `HomeProfessionalWork({ work })`
- Produces: `ProfessionalWorkCard({ work, priority })`
- Preserves: Home proof order CrunchAtlas, gloss, Celery fork-safety
- Preserves: Projects order professional work, featured projects, more projects, open-source contributions

- [ ] **Step 1: Run the professional-preview contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");
const expectations = {
	"app/components/home-professional-work.tsx": [
		"HomeProfessionalWork",
		"data-home-professional-work",
		"Read case study",
		"work.external.href",
	],
	"app/projects/professional-work-card.tsx": [
		"ProfessionalWorkCard",
		"data-professional-work-card",
		"work.previewSteps.map",
		"Read case study",
		"work.external.href",
	],
	"app/page.tsx": [
		"HomeProfessionalWork",
		"professionalWork.crunchatlas",
	],
	"app/projects/page.tsx": [
		"ProfessionalWorkCard",
		"professionalWorkList.map",
	],
};
const failures = [];

for (const [path, tokens] of Object.entries(expectations)) {
	if (!fs.existsSync(path)) {
		failures.push(`${path}: missing`);
		continue;
	}
	const source = fs.readFileSync(path, "utf8");
	for (const token of tokens) {
		if (!source.includes(token)) failures.push(`${path}: missing ${token}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.log("Professional preview contract passes.");
NODE
```

Expected: FAIL because the two preview components do not exist and both route
files still contain inline external-only professional cards.

- [ ] **Step 2: Create the distinct homepage preview**

Create `app/components/home-professional-work.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProfessionalWork } from "../projects/professional-work-data";

export function HomeProfessionalWork({
	work,
}: {
	work: ProfessionalWork;
}) {
	if (!work.image) {
		throw new Error(`Homepage professional work requires an image: ${work.slug}`);
	}

	return (
		<article
			data-home-professional-work={work.slug}
			className="grid overflow-hidden rounded-3xl border border-amber-400/20 bg-zinc-900/55 lg:grid-cols-[1.1fr_0.9fr]"
		>
			<Link
				href={work.href}
				className="group relative min-h-[18rem] overflow-hidden border-b border-zinc-800 bg-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 lg:min-h-full lg:border-b-0 lg:border-r"
			>
				<Image
					src={work.image.src}
					alt={work.image.alt}
					fill
					priority
					sizes="(max-width: 1024px) 100vw, 55vw"
					className="object-cover transition duration-300 group-hover:scale-[1.01]"
				/>
				<div
					className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent"
					aria-hidden="true"
				/>
				<span className="absolute left-5 top-5 rounded-full border border-white/10 bg-zinc-950/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur">
					Public marketing image
				</span>
				<span className="sr-only">Read {work.cardTitle} case study</span>
			</Link>

			<div className="flex flex-col p-7 sm:p-9">
				<p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber-300">
					{work.eyebrow} · {work.period}
				</p>
				<h3 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
					<Link
						href={work.href}
						className="rounded-sm transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
					>
						{work.cardTitle}
					</Link>
				</h3>
				<p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
					{work.summary}
				</p>
				<div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
					<Link
						href={work.href}
						className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-amber-300 transition hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
					>
						Read case study
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
					<a
						href={work.external.href}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 rounded-sm text-sm text-zinc-500 transition hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
					>
						{work.external.label}
						<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</article>
	);
}
```

- [ ] **Step 3: Create the Projects-index cards**

Create `app/projects/professional-work-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProfessionalWork } from "./professional-work-data";

export function ProfessionalWorkCard({
	work,
	priority = false,
}: {
	work: ProfessionalWork;
	priority?: boolean;
}) {
	const isCrunchAtlas = work.accent === "amber";
	const accentText = isCrunchAtlas ? "text-amber-300" : "text-sky-300";
	const accentBorder = isCrunchAtlas
		? "border-amber-400/20"
		: "border-sky-400/20";
	const focusRing = isCrunchAtlas
		? "focus-visible:ring-amber-400"
		: "focus-visible:ring-sky-400";

	return (
		<article
			data-professional-work-card={work.slug}
			className={`flex h-full flex-col overflow-hidden rounded-3xl border ${accentBorder} bg-zinc-900/55`}
		>
			{work.image ? (
				<Link
					href={work.href}
					className={`group relative aspect-video overflow-hidden border-b border-zinc-800 bg-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset ${focusRing}`}
				>
					<Image
						src={work.image.src}
						alt={work.image.alt}
						fill
						priority={priority}
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover transition duration-300 group-hover:scale-[1.01]"
					/>
					<span className="sr-only">Read {work.cardTitle} case study</span>
				</Link>
			) : (
				<Link
					href={work.href}
					className={`block border-b border-zinc-800 bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.17),transparent_44%),radial-gradient(circle_at_100%_100%,rgba(124,58,237,0.13),transparent_40%)] p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset ${focusRing}`}
				>
					<ol aria-label={`${work.cardTitle} system flow`} className="grid gap-2.5">
						{work.previewSteps.map((step, index) => (
							<li
								key={step}
								className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3"
							>
								<span className="font-mono text-[0.62rem] text-sky-400/70">
									{String(index + 1).padStart(2, "0")}
								</span>
								<span className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
									{step}
								</span>
							</li>
						))}
					</ol>
				</Link>
			)}

			<div className="flex flex-1 flex-col p-7 sm:p-8">
				<p
					className={`font-mono text-[0.68rem] uppercase tracking-[0.2em] ${accentText}`}
				>
					{work.eyebrow} · {work.period}
				</p>
				<h3 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
					<Link
						href={work.href}
						className={`rounded-sm transition hover:text-white focus:outline-none focus-visible:ring-2 ${focusRing}`}
					>
						{work.cardTitle}
					</Link>
				</h3>
				<p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
					{work.summary}
				</p>
				<div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 pt-7">
					<Link
						href={work.href}
						className={`inline-flex items-center gap-2 rounded-sm text-sm font-medium ${accentText} focus:outline-none focus-visible:ring-2 ${focusRing}`}
					>
						Read case study
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
					<a
						href={work.external.href}
						target="_blank"
						rel="noreferrer"
						className={`inline-flex items-center gap-2 rounded-sm text-sm text-zinc-500 transition hover:text-zinc-200 focus:outline-none focus-visible:ring-2 ${focusRing}`}
					>
						{work.external.label}
						<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</article>
	);
}
```

- [ ] **Step 4: Replace the inline homepage CrunchAtlas article**

In `app/page.tsx`:

- Remove the `next/image` import.
- Import `HomeProfessionalWork` from
  `./components/home-professional-work`.
- Import `professionalWork` from
  `./projects/professional-work-data`.
- Replace the entire current CrunchAtlas `<article>` inside `Selected work`
  with:

```tsx
<HomeProfessionalWork work={professionalWork.crunchatlas} />
```

Do not change the gloss/Celery evidence rows or the closing Contact callout.

- [ ] **Step 5: Replace the inline Projects professional cards**

In `app/projects/page.tsx`:

- Remove the `next/image` import and the unused `Briefcase` icon import.
- Import `professionalWorkList` from `./professional-work-data`.
- Import `ProfessionalWorkCard` from `./professional-work-card`.
- Replace the full current two-card grid inside `Professional work` with:

```tsx
<div className="grid gap-5 lg:grid-cols-2">
	{professionalWorkList.map((work, index) => (
		<ProfessionalWorkCard
			key={work.slug}
			work={work}
			priority={index === 0}
		/>
	))}
</div>
```

Do not alter featured projects, more projects, open-source contributions, or
their numbering.

- [ ] **Step 6: Run the preview contract and static verification**

Rerun the Step 1 contract, then run:

```bash
pnpm exec rome check \
	app/components/home-professional-work.tsx \
	app/projects/professional-work-card.tsx \
	app/page.tsx \
	app/projects/page.tsx \
	app/projects/professional-work-data.ts
pnpm typecheck
pnpm build
git diff --check
```

Expected:

- The contract prints `Professional preview contract passes.`
- Rome, TypeScript, and the build pass.
- Both internal professional routes remain static.

- [ ] **Step 7: Verify the Home and Projects entry points**

Run the production build. At 1440×900 and 390×844 inspect `/` and `/projects`
and evaluate:

```js
() => ({
	homeProfessional: [...document.querySelectorAll("[data-home-professional-work]")].map(
		(card) => card.getAttribute("data-home-professional-work"),
	),
	projectProfessional: [
		...document.querySelectorAll("[data-professional-work-card]"),
	].map((card) => card.getAttribute("data-professional-work-card")),
	internalLinks: [...document.querySelectorAll('a[href^="/projects/"]')].map(
		(link) => link.getAttribute("href"),
	),
	externalLinks: [
		...document.querySelectorAll(
			'a[href="https://www.crunchatlas.com/"], a[href="https://www.pitchfire.com/"]',
		),
	].map((link) => link.getAttribute("href")),
	overflow:
		document.documentElement.scrollWidth -
		document.documentElement.clientWidth,
})
```

Expected:

- Home contains only the `crunchatlas` professional preview.
- Projects contains `crunchatlas`, then `atlasconnect`.
- Internal links include both professional case-study routes.
- External marketing links remain available as secondary actions.
- Home's layout is the split primary proof; Projects uses two equal catalog
  cards.
- Overflow is `0` at both viewports.
- Clicking each internal action reaches the expected case study.

- [ ] **Step 8: Commit the entry-point integration**

Immediately before committing:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff --check
```

Commit only the two components and two route integrations:

```bash
git add \
	app/components/home-professional-work.tsx \
	app/projects/professional-work-card.tsx \
	app/page.tsx \
	app/projects/page.tsx
git diff --cached --check
git commit -m "feat: link professional work to case studies"
```

---

### Task 5: Run the privacy, accessibility, production, and deployment gate

**Files:**
- Verify: all files changed by Tasks 1–4
- Modify only if verification finds a concrete defect

**Interfaces:**
- Consumes: both case studies and all entry points
- Produces: one exact verified commit SHA deployed at `https://spencerpresley.com`

- [ ] **Step 1: Run the final source and privacy contract**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");
const paths = {
	data: "app/projects/professional-work-data.ts",
	ui: "app/projects/professional-case-study-ui.tsx",
	crunchatlas: "app/projects/crunchatlas/page.tsx",
	atlasconnect: "app/projects/atlasconnect/page.tsx",
	home: "app/page.tsx",
	projects: "app/projects/page.tsx",
	publicProjects: "app/projects/project-data.ts",
};
const source = Object.fromEntries(
	Object.entries(paths).map(([name, path]) => [name, fs.readFileSync(path, "utf8")]),
);
const failures = [];

for (const route of ["/projects/crunchatlas", "/projects/atlasconnect"]) {
	if (!source.data.includes(route)) failures.push(`data: missing ${route}`);
	if (!source.home.includes("professionalWork.crunchatlas") && route === "/projects/crunchatlas") {
		failures.push("home: missing canonical CrunchAtlas record");
	}
}

for (const external of [
	"https://www.crunchatlas.com/",
	"https://www.pitchfire.com/",
]) {
	if (!source.data.includes(external)) failures.push(`data: missing ${external}`);
}

for (const slug of ["crunchatlas", "atlasconnect"]) {
	const projectSlug = new RegExp(`slug:\\s*["']${slug}["']`);
	if (projectSlug.test(source.publicProjects)) {
		failures.push(`public project array contains professional slug ${slug}`);
	}
}

const combined = Object.values(source).join("\n");
for (const forbidden of [
	"/Users/spencer/",
	"llmserving-server-path-cutover",
	"MEDIA_HOST_PATH",
	"write_final_report",
	"customer count",
	"revenue",
	"lines of code",
]) {
	if (combined.includes(forbidden)) failures.push(`public source contains ${forbidden}`);
}

for (const forbiddenPattern of [
	/\bfetch\s*\(/,
	/\bRedis\b/,
	/\.mdx\b/,
]) {
	if (forbiddenPattern.test(combined)) {
		failures.push(`public source matches forbidden pattern ${forbiddenPattern}`);
	}
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.log("Professional case-study privacy and source contract passes.");
NODE
```

Expected: PASS. If it fails, remove or correct the exact unsupported content;
do not weaken the contract to permit it.

- [ ] **Step 2: Run the complete static verification**

Run:

```bash
pnpm exec rome check \
	app/components/nav.tsx \
	app/components/home-professional-work.tsx \
	app/page.tsx \
	app/projects/page.tsx \
	app/projects/professional-work-card.tsx \
	app/projects/professional-work-data.ts \
	app/projects/professional-case-study-ui.tsx \
	app/projects/crunchatlas/page.tsx \
	app/projects/atlasconnect/page.tsx
pnpm typecheck
pnpm build
git diff --check
git status --short --branch
```

Expected:

- Rome, TypeScript, and the production build pass.
- The build lists both professional routes as static.
- The worktree is clean unless this verification exposed a concrete fix.

- [ ] **Step 3: Run the full local browser matrix**

Start `pnpm start`. Inspect these routes at 1440×900 and 390×844:

- `/`
- `/projects`
- `/projects/crunchatlas`
- `/projects/atlasconnect`
- `/projects/gloss`
- `/contact`
- `/resume`

For every route:

- confirm the persistent wordmark navigation and correct `aria-current`
- tab through all visible actions
- confirm no horizontal overflow
- confirm no browser-console errors

For the professional case studies:

- disable CSS and confirm headings, flow stages, figure captions, and footer
  links remain in meaningful reading order
- confirm the CrunchAtlas figures load from local optimized assets
- confirm AtlasConnect loads no Pitchfire image
- confirm external sites are secondary links rather than page dependencies

- [ ] **Step 4: Commit any verification-only fixes narrowly**

If Step 1–3 required changes, inspect and commit only those fixes:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff
git diff --check
git add \
	app/components/nav.tsx \
	app/components/home-professional-work.tsx \
	app/page.tsx \
	app/projects/page.tsx \
	app/projects/professional-work-card.tsx \
	app/projects/professional-work-data.ts \
	app/projects/professional-case-study-ui.tsx \
	app/projects/crunchatlas/page.tsx \
	app/projects/atlasconnect/page.tsx \
	public/projects/crunchatlas-campaign-assessment.webp \
	public/projects/crunchatlas-agent-report.webp
git diff --cached --check
git commit -m "fix: harden professional case studies"
```

If no fixes were required, do not create an empty commit.

- [ ] **Step 5: Push and verify the exact production deployment**

Run:

```bash
git status --short --branch
git log -1 --oneline --decorate
git push origin main
portfolio_case_studies_sha="$(git rev-parse HEAD)"
vercel ls --prod -m "githubCommitSha=${portfolio_case_studies_sha}"
```

Copy the exact deployment URL returned for
`githubCommitSha=${portfolio_case_studies_sha}`, assign it to a task-specific
variable, and inspect it:

```bash
printf "Deployment URL returned by vercel ls: "
IFS= read -r portfolio_case_studies_deployment
vercel inspect "$portfolio_case_studies_deployment" --logs
vercel logs --environment production --level error --since 5m
vercel httpstat /
```

The deployment URL is a runtime value from `vercel ls`, not a hard-coded
project hostname. Wait until `vercel inspect` reports `Ready`, verify that its
Git commit matches `portfolio_case_studies_sha`, then repeat the Step 3 browser
matrix against `https://spencerpresley.com`. Confirm the custom domain serves
the exact SHA, both internal routes resolve without redirects or 404s, both
external links are correct, the two images load, mobile overflow is zero, and
the browser console remains clean.
