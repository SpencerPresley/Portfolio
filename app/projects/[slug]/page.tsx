import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Navigation } from "../../components/nav";
import { getNextProject, getProject, projects } from "../project-data";
import {
	projectAccentStyles,
	ProjectStatusPill,
	ProjectVisual,
} from "../project-ui";

type Params = {
	slug: string;
};

type Props = {
	params: Promise<Params>;
};

export function generateStaticParams(): Params[] {
	return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const project = getProject(slug);

	if (!project) {
		return {};
	}

	return {
		title: project.title,
		description: project.summary,
		alternates: {
			canonical: `/projects/${project.slug}`,
		},
		openGraph: {
			title: project.title,
			description: project.summary,
			type: "article",
			images: project.image
				? [{ url: project.image.src }]
				: project.video
				? [{ url: project.video.poster }]
				: undefined,
		},
	};
}

export default async function ProjectPage({ params }: Props) {
	const { slug } = await params;
	const project = getProject(slug);

	if (!project) {
		notFound();
	}

	const nextProject = getNextProject(project.slug);
	const accent = projectAccentStyles[project.accent];

	return (
		<div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
			<div
				className={`pointer-events-none absolute inset-x-0 top-0 h-[48rem] bg-gradient-to-b ${accent.glow} to-transparent opacity-60`}
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_38%)]"
				aria-hidden="true"
			/>

			<Navigation />

			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				<nav className="flex items-center" aria-label="Project">
					<Link
						href="/projects"
						className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-400 backdrop-blur transition hover:border-zinc-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
					>
						<ArrowLeft className="h-4 w-4" aria-hidden="true" />
						All projects
					</Link>
				</nav>

				<header className="pb-14 pt-16 sm:pt-20">
					<div className="flex flex-wrap items-center gap-3">
						<ProjectStatusPill status={project.status} />
						<span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-400">
							{project.category} · {project.year}
						</span>
					</div>

					<div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
						<div className="max-w-4xl">
							<p
								className={`mb-5 font-mono text-xs uppercase tracking-[0.22em] ${accent.text}`}
							>
								{project.eyebrow}
							</p>
							<h1 className="font-display text-5xl leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
								{project.title}
							</h1>
							<p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">
								{project.lead}
							</p>
						</div>

						<div className="lg:border-l lg:border-zinc-800 lg:pl-8">
							<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
								My role
							</p>
							<p className="mt-3 text-sm leading-7 text-zinc-300">
								{project.role}
							</p>

							{project.links.length > 0 ? (
								<div className="mt-7 flex flex-wrap gap-3">
									{project.links.map((link) => (
										<a
											key={link.href}
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
										>
											{link.label}
											<ArrowUpRight
												className="h-3.5 w-3.5"
												aria-hidden="true"
											/>
										</a>
									))}
								</div>
							) : (
								<p className="mt-6 text-xs leading-6 text-zinc-400">
									Private repository · no public project link
								</p>
							)}
						</div>
					</div>
				</header>

				<ProjectVisual project={project} priority />

				<dl className="grid border-b border-zinc-800 sm:grid-cols-3">
					{project.facts.map((fact, index) => (
						<div
							key={fact.label}
							className={`py-7 sm:px-7 ${
								index > 0
									? "border-t border-zinc-800 sm:border-l sm:border-t-0"
									: ""
							} ${index === 0 ? "sm:pl-0" : ""}`}
						>
							<dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
								{fact.label}
							</dt>
							<dd className="mt-2 text-sm leading-6 text-zinc-200">
								{fact.value}
							</dd>
						</div>
					))}
				</dl>

				<div className="grid gap-16 py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<aside>
						<div className="lg:sticky lg:top-10">
							<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
								Built with
							</p>
							<ul className="mt-5 flex flex-wrap gap-2 lg:flex-col lg:items-start">
								{project.stack.map((technology) => (
									<li
										key={technology}
										className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 font-mono text-[0.68rem] text-zinc-400"
									>
										{technology}
									</li>
								))}
							</ul>
						</div>
					</aside>

					<div className="max-w-3xl">
						<div className="space-y-20">
							{project.sections.map((section, index) => (
								<section
									key={section.title}
									aria-labelledby={`${project.slug}-section-${index + 1}`}
								>
									<div className="flex items-center gap-4">
										<span className={`font-mono text-xs ${accent.text}`}>
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="h-px w-8 bg-zinc-800" aria-hidden="true" />
										<h2
											id={`${project.slug}-section-${index + 1}`}
											className="font-display text-3xl leading-tight text-white sm:text-4xl"
										>
											{section.title}
										</h2>
									</div>
									<div className="mt-7 space-y-5 text-[1.02rem] leading-8 text-zinc-400">
										{section.paragraphs.map((paragraph) => (
											<p key={paragraph}>{paragraph}</p>
										))}
									</div>
									{section.bullets ? (
										<ul className="mt-7 space-y-3">
											{section.bullets.map((bullet) => (
												<li
													key={bullet}
													className="relative pl-5 text-sm leading-7 text-zinc-400"
												>
													<span
														className={`absolute left-0 top-[0.7rem] h-1.5 w-1.5 rounded-full ${accent.dot}`}
														aria-hidden="true"
													/>
													{bullet}
												</li>
											))}
										</ul>
									) : null}
								</section>
							))}
						</div>
					</div>
				</div>

				{project.codeComparison ? (
					<section
						data-code-comparison="true"
						className="border-t border-zinc-800 py-20"
						aria-labelledby={`${project.slug}-code-comparison`}
					>
						<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-end">
							<div className="max-w-3xl">
								<p
									className={`font-mono text-xs uppercase tracking-[0.2em] ${accent.text}`}
								>
									{project.codeComparison.eyebrow}
								</p>
								<h2
									id={`${project.slug}-code-comparison`}
									className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl"
								>
									{project.codeComparison.title}
								</h2>
							</div>
							<p className="text-sm leading-7 text-zinc-400">
								{project.codeComparison.description}
							</p>
						</div>

						<div className="mt-10 grid gap-5 lg:grid-cols-2">
							{project.codeComparison.samples.map((sample, index) => (
								<article
									key={sample.label}
									className={`min-w-0 overflow-hidden rounded-2xl border ${
										index === 0 ? "border-zinc-800" : accent.border
									} bg-zinc-900/45`}
								>
									<div className="p-6 sm:p-7">
										<p
											className={`font-mono text-[0.65rem] uppercase tracking-[0.18em] ${
												index === 0 ? "text-zinc-400" : accent.text
											}`}
										>
											{sample.label}
										</p>
										<h3 className="mt-4 text-lg font-semibold text-zinc-100">
											{sample.title}
										</h3>
										<p className="mt-3 text-sm leading-7 text-zinc-400">
											{sample.detail}
										</p>
									</div>
									<pre className="max-w-full overflow-x-auto border-t border-zinc-800 bg-zinc-950/80 p-5 font-mono text-[0.72rem] leading-6 text-zinc-300 sm:p-7 sm:text-xs">
										<code>{sample.code}</code>
									</pre>
								</article>
							))}
						</div>
					</section>
				) : null}

				{project.relatedProjects?.length ? (
					<section
						className="border-t border-zinc-800 py-16"
						aria-labelledby={`${project.slug}-related-projects`}
					>
						<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
							Connected work
						</p>
						<h2
							id={`${project.slug}-related-projects`}
							className="mt-4 font-display text-3xl leading-tight text-white"
						>
							Follow the implementation thread.
						</h2>

						<div className="mt-8 grid gap-4 sm:grid-cols-2">
							{project.relatedProjects.map((relationship) => {
								const relatedProject = getProject(relationship.slug);

								if (!relatedProject) {
									return null;
								}

								const relatedAccent =
									projectAccentStyles[relatedProject.accent];

								return (
									<Link
										key={relationship.slug}
										href={`/projects/${relatedProject.slug}`}
										data-related-project={relatedProject.slug}
										className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-600 hover:bg-zinc-900/65 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-4 focus:ring-offset-zinc-950"
									>
										<p
											className={`font-mono text-[0.65rem] uppercase tracking-[0.18em] ${relatedAccent.text}`}
										>
											{relationship.eyebrow}
										</p>
										<div className="mt-4 flex items-start justify-between gap-5">
											<div>
												<h3 className="font-display text-2xl text-zinc-100 transition group-hover:text-white">
													{relatedProject.title}
												</h3>
												<p className="mt-3 text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300">
													{relationship.detail}
												</p>
											</div>
											<ArrowRight
												className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300"
												aria-hidden="true"
											/>
										</div>
									</Link>
								);
							})}
						</div>
					</section>
				) : null}

				<section
					className="border-y border-zinc-800 py-16"
					aria-labelledby="decisions"
				>
					<div className="mb-9 grid gap-5 sm:grid-cols-[minmax(0,1fr)_24rem] sm:items-end">
						<div>
							<p
								className={`font-mono text-xs uppercase tracking-[0.2em] ${accent.text}`}
							>
								Engineering choices
							</p>
							<h2
								id="decisions"
								className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl"
							>
								The decisions that shaped it.
							</h2>
						</div>
						<p className="text-sm leading-7 text-zinc-400">
							The implementation details matter because each one closes a
							specific failure mode or keeps an important boundary visible.
						</p>
					</div>

					<div className="grid gap-4 lg:grid-cols-3">
						{project.decisions.map((decision, index) => (
							<article
								key={decision.title}
								className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-6"
							>
								<span className="font-mono text-[0.65rem] text-zinc-400">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h3 className="mt-5 text-base font-semibold text-zinc-100">
									{decision.title}
								</h3>
								<p className="mt-3 text-sm leading-7 text-zinc-400">
									{decision.detail}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="py-20">
					<div
						className={`relative overflow-hidden rounded-3xl border ${accent.border} bg-zinc-900/55 p-8 sm:p-12`}
					>
						<div
							className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} to-transparent opacity-50`}
							aria-hidden="true"
						/>
						<div className="relative max-w-3xl">
							<p
								className={`font-mono text-xs uppercase tracking-[0.2em] ${accent.text}`}
							>
								Where it landed
							</p>
							<p className="mt-5 font-display text-2xl leading-relaxed text-white sm:text-3xl">
								{project.outcome}
							</p>
						</div>
					</div>
				</section>

				<Link
					href={`/projects/${nextProject.slug}`}
					className="group grid gap-8 border-t border-zinc-800 py-12 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-400 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
				>
					<div>
						<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
							Next case study
						</p>
						<p className="mt-4 font-display text-3xl text-zinc-200 transition group-hover:text-white sm:text-4xl">
							{nextProject.title}
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
			</main>
		</div>
	);
}
