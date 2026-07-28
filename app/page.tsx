import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HomeProfessionalWork } from "./components/home-professional-work";
import { HomeProjectProof } from "./components/home-project-proof";
import { Navigation } from "./components/nav";
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "./components/page-atmosphere";
import { getProject } from "./projects/project-data";
import { professionalWork } from "./projects/professional-work-data";

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
						<span className="font-mono text-xs text-zinc-400">01</span>
						<h2
							id="selected-work"
							className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
						>
							Selected work
						</h2>
						<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
					</div>

					<HomeProfessionalWork work={professionalWork.crunchatlas} />

					<div className="mt-5 divide-y divide-zinc-800 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30">
						{homepageProjects.map((project, index) => (
							<HomeProjectProof
								key={project.slug}
								project={project}
								index={index + 2}
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
							<p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
								LinkedIn gives me enough context for a useful first
								conversation.
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
