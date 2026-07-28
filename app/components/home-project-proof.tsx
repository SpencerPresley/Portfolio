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
					<div className="flex flex-wrap items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-400">
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
								<dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-400">
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
