import Link from "next/link";
import {
	ArrowRight,
	ArrowUpRight,
	Braces,
	Database,
	GitPullRequest,
	Network,
} from "lucide-react";
import { Navigation } from "../components/nav";
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "../components/page-atmosphere";
import { openSourceContributions, projects } from "./project-data";
import { ProjectCard } from "./project-ui";
import { ProfessionalWorkCard } from "./professional-work-card";
import { professionalWorkList } from "./professional-work-data";

export const metadata = {
	title: "Projects",
	description:
		"Selected AI, retrieval, backend, systems, and developer-tooling projects by Spencer Presley.",
};

const featuredProjects = projects.filter((project) => project.featured);
const moreProjects = projects.filter((project) => !project.featured);
const projectsAtmosphere = pageAtmosphereStyles.projects;

const disciplines = [
	{
		icon: Network,
		label: "AI systems",
		detail: "Retrieval, evaluation, and grounded model behavior",
	},
	{
		icon: Database,
		label: "Backend",
		detail: "State, concurrency, and explicit failure modes",
	},
	{
		icon: Braces,
		label: "Product",
		detail: "Useful interfaces around complicated machinery",
	},
];

export default function ProjectsPage() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
			<PageAtmosphere variant="projects" />
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_38%)]"
				aria-hidden="true"
			/>
			<Navigation />

			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				<header className="grid gap-14 border-b border-zinc-800 pb-16 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
					<div className="max-w-4xl">
						<p
							className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${projectsAtmosphere.eyebrowText}`}
						>
							<span
								className={`h-px w-8 ${projectsAtmosphere.eyebrowLine}`}
								aria-hidden="true"
							/>
							Selected work
						</p>
						<h1 className="font-display text-5xl leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
							Systems worth
							<br />
							opening up.
						</h1>
						<p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
							Case studies about the machinery: what the system had to
							guarantee, where it could fail, and the decisions that made it
							hold together.
						</p>
					</div>

					<div className="grid gap-3">
						{disciplines.map(({ icon: Icon, label, detail }) => (
							<div
								key={label}
								className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4 backdrop-blur"
							>
								<span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400">
									<Icon className="h-4 w-4" aria-hidden="true" />
								</span>
								<span>
									<span className="block text-sm font-medium text-zinc-200">
										{label}
									</span>
									<span className="mt-1 block text-xs leading-5 text-zinc-500">
										{detail}
									</span>
								</span>
							</div>
						))}
					</div>
				</header>

				<section className="pt-16" aria-labelledby="professional-work">
					<div className="mb-8 flex items-center gap-4">
						<span className="font-mono text-xs text-zinc-600">01</span>
						<h2
							id="professional-work"
							className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
						>
							Professional work
						</h2>
						<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
					</div>

					<div className="grid gap-5 lg:grid-cols-2">
						{professionalWorkList.map((work, index) => (
							<ProfessionalWorkCard
								key={work.slug}
								work={work}
								priority={index === 0}
							/>
						))}
					</div>
				</section>

				<section className="pt-16" aria-labelledby="featured-work">
					<div className="mb-8 flex items-center gap-4">
						<span className="font-mono text-xs text-zinc-600">02</span>
						<h2
							id="featured-work"
							className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
						>
							Featured case studies
						</h2>
						<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
					</div>

					<div className="grid gap-5 lg:grid-cols-2">
						{featuredProjects.map((project, index) => (
							<div key={project.slug}>
								<ProjectCard project={project} index={index} visual />
							</div>
						))}
					</div>
				</section>

				<section className="pt-20" aria-labelledby="more-projects">
					<div className="mb-8 flex items-center gap-4">
						<span className="font-mono text-xs text-zinc-600">03</span>
						<h2
							id="more-projects"
							className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
						>
							More projects
						</h2>
						<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						{moreProjects.map((project, index) => (
							<ProjectCard
								key={project.slug}
								project={project}
								index={featuredProjects.length + index}
							/>
						))}
					</div>
				</section>

				<section className="pt-20" aria-labelledby="open-source-contributions">
					<div className="mb-8 flex items-center gap-4">
						<span className="font-mono text-xs text-zinc-600">04</span>
						<h2
							id="open-source-contributions"
							className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
						>
							Open-source contributions
						</h2>
						<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
					</div>

					<div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/35">
						{openSourceContributions.map((contribution, index) => (
							<article
								key={contribution.project}
								className={`grid gap-6 p-6 sm:p-8 lg:grid-cols-[3rem_minmax(0,1fr)_auto] lg:items-start ${
									index > 0 ? "border-t border-zinc-800" : ""
								}`}
							>
								<span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
									<GitPullRequest className="h-5 w-5" aria-hidden="true" />
								</span>

								<div>
									<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-violet-300">
										{contribution.eyebrow} · {contribution.year}
									</p>
									<h3 className="mt-3 font-display text-3xl text-white">
										{contribution.project}
									</h3>
									<p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
										{contribution.summary}
									</p>
									<p className="mt-3 max-w-3xl text-xs leading-6 text-zinc-600">
										{contribution.credit}
									</p>
								</div>

								<div className="flex flex-wrap gap-3 lg:justify-end">
									{contribution.links.map((link) => (
										<a
											key={link.href}
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
										>
											{link.label}
											<ArrowUpRight
												className="h-3.5 w-3.5"
												aria-hidden="true"
											/>
										</a>
									))}
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="mt-24 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/45">
					<div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
						<div>
							<p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sky-300">
								The shorter version
							</p>
							<h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-white sm:text-4xl">
								The resume has the outcomes. These pages have the mechanisms.
							</h2>
						</div>
						<Link
							href="/resume"
							className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
						>
							View resume
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
