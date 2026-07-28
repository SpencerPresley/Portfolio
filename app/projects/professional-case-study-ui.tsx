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
				className={`inline-flex items-center gap-2 rounded-sm text-sm text-zinc-400 transition hover:text-white focus:outline-none focus-visible:ring-2 ${accent.ring}`}
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
					<p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-400">
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
					<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
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
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
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
		<ol aria-label={label} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
					<p className="mt-3 text-sm leading-7 text-zinc-400">{item.detail}</p>
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
			<figcaption className="border-t border-zinc-800 px-6 py-4 text-xs leading-6 text-zinc-400">
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
					<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
						Next professional case study
					</p>
					<p className="mt-4 font-display text-3xl text-zinc-200 transition group-hover:text-white sm:text-4xl">
						{next.title}
					</p>
				</div>
				<span className="inline-flex items-center gap-2 text-sm text-zinc-400 transition group-hover:text-zinc-200">
					Keep reading
					<ArrowRight
						className="h-4 w-4 transition group-hover:translate-x-1"
						aria-hidden="true"
					/>
				</span>
			</Link>
			<Link
				href="/projects"
				className="mt-8 inline-flex rounded-sm text-sm text-zinc-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
			>
				Return to all projects
			</Link>
		</footer>
	);
}
