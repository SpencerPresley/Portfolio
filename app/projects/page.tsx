import Image from "next/image";
import Link from "next/link";
import {
	ArrowRight,
	ArrowUpRight,
	Braces,
	Briefcase,
	Database,
	Network,
} from "lucide-react";
import { Navigation } from "../components/nav";
import { projects } from "./project-data";
import { ProjectCard } from "./project-ui";

export const metadata = {
	title: "Projects",
	description:
		"Selected AI, retrieval, backend, and systems projects by Spencer Presley.",
};

const featuredProjects = projects.filter((project) => project.featured);
const earlierProjects = projects.filter((project) => !project.featured);

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
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_18%_0%,rgba(124,58,237,0.16),transparent_36%),radial-gradient(circle_at_82%_8%,rgba(14,165,233,0.13),transparent_34%)]"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_38%)]"
				aria-hidden="true"
			/>
			<Navigation />

			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				<header className="grid gap-14 border-b border-zinc-800 pb-16 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
					<div className="max-w-4xl">
						<p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-violet-300">
							<span className="h-px w-8 bg-violet-400/70" aria-hidden="true" />
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
						<article className="overflow-hidden rounded-3xl border border-amber-400/20 bg-zinc-900/55">
							<div className="relative aspect-video overflow-hidden border-b border-zinc-800 bg-zinc-950">
								<Image
									src="/projects/crunchatlas-campaign-teaser.webp"
									alt="Redacted CrunchAtlas marketing view showing an active network security campaign summary"
									fill
									priority
									sizes="(max-width: 1024px) 100vw, 50vw"
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

							<div className="p-7 sm:p-8">
								<p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber-300">
									Current work · 2025–
								</p>
								<h3 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
									CrunchAtlas / AtlasCyber
								</h3>
								<p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
									At CrunchAtlas, I build the AI and backend infrastructure for
									AtlasCyber, a local-first security platform: evidence-grounded
									network analysis agents, the agent runtime and sandboxing
									layer, Postgres-native job and GPU orchestration, and local
									model serving. It runs in cloud, on-prem, and air-gapped
									environments; this deliberately redacted marketing image is
									the boundary of what I show publicly.
								</p>
								<a
									href="https://www.crunchatlas.com/"
									target="_blank"
									rel="noreferrer"
									className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-4 focus:ring-offset-zinc-950"
								>
									Visit CrunchAtlas
									<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
								</a>
							</div>
						</article>

						<article className="relative overflow-hidden rounded-3xl border border-sky-400/20 bg-zinc-900/55 p-7 sm:p-8">
							<div
								className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.17),transparent_42%),radial-gradient(circle_at_100%_100%,rgba(124,58,237,0.13),transparent_38%)]"
								aria-hidden="true"
							/>
							<div className="relative flex h-full flex-col">
								<div className="flex items-center gap-3 border-b border-zinc-700/70 pb-5">
									<span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
										<Briefcase className="h-4 w-4" aria-hidden="true" />
									</span>
									<span>
										<span className="block text-sm font-medium text-zinc-200">
											AtlasConnect · 2025
										</span>
										<span className="mt-0.5 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-600">
											Private production work
										</span>
									</span>
								</div>

								<h3 className="mt-7 font-display text-3xl leading-tight text-white sm:text-4xl">
									The product is now Pitchfire.
								</h3>
								<p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
									At AtlasConnect, I was the sole developer and maintainer of an
									inherited Django and React product. The multi-format
									pitch-deck ingestion, AI deal research and memo generation,
									thesis-match scoring, and firm workflow now marketed as
									Pitchfire are systems I built and operated there.
								</p>

								<div className="my-7 grid gap-2.5">
									{[
										"Pitch deck ingestion",
										"Native extraction + OCR",
										"Parallel AI research",
										"Firm-fit scoring",
										"Deal workflow",
									].map((step, index) => (
										<div
											key={step}
											className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3"
										>
											<span className="font-mono text-[0.62rem] text-sky-400/70">
												{String(index + 1).padStart(2, "0")}
											</span>
											<span className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
												{step}
											</span>
										</div>
									))}
								</div>

								<a
									href="https://www.pitchfire.com/"
									target="_blank"
									rel="noreferrer"
									className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-4 focus:ring-offset-zinc-950"
								>
									See Pitchfire
									<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
								</a>
							</div>
						</article>
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

				<section className="pt-20" aria-labelledby="earlier-work">
					<div className="mb-8 flex items-center gap-4">
						<span className="font-mono text-xs text-zinc-600">03</span>
						<h2
							id="earlier-work"
							className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
						>
							Earlier work
						</h2>
						<div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						{earlierProjects.map((project, index) => (
							<ProjectCard
								key={project.slug}
								project={project}
								index={featuredProjects.length + index}
							/>
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
