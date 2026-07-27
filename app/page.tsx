import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navigation } from "./components/nav";
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "./components/page-atmosphere";
import { getProject } from "./projects/project-data";
import { ProjectCard } from "./projects/project-ui";

const homeAtmosphere = pageAtmosphereStyles.home;

const homepageProjects = ["gloss", "celery-fork-safety"].map((slug) => {
	const project = getProject(slug);

	if (!project) {
		throw new Error(`Missing homepage project: ${slug}`);
	}

	return project;
});

export default function Home() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
			<PageAtmosphere variant="home" />
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_42%)]"
				aria-hidden="true"
			/>
			<Navigation />

			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				<header className="max-w-5xl border-b border-zinc-800 pb-16">
					<p
						className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${homeAtmosphere.eyebrowText}`}
					>
						<span
							className={`h-px w-8 ${homeAtmosphere.eyebrowLine}`}
							aria-hidden="true"
						/>
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
								The image is intentionally redacted; it marks the boundary of
								what I show publicly.
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
			</main>
		</div>
	);
}
