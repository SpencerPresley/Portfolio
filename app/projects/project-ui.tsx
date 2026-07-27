import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
	type Project,
	type ProjectAccent,
	type ProjectStatus,
	projectStatusLabels,
} from "./project-data";

export const projectAccentStyles: Record<
	ProjectAccent,
	{
		glow: string;
		border: string;
		text: string;
		dot: string;
		wash: string;
	}
> = {
	sky: {
		glow: "from-sky-500/30 via-sky-500/5",
		border: "border-sky-400/20",
		text: "text-sky-300",
		dot: "bg-sky-300",
		wash: "bg-sky-400/10",
	},
	violet: {
		glow: "from-violet-500/30 via-violet-500/5",
		border: "border-violet-400/20",
		text: "text-violet-300",
		dot: "bg-violet-300",
		wash: "bg-violet-400/10",
	},
	amber: {
		glow: "from-amber-500/25 via-amber-500/5",
		border: "border-amber-400/20",
		text: "text-amber-300",
		dot: "bg-amber-300",
		wash: "bg-amber-400/10",
	},
	emerald: {
		glow: "from-emerald-500/25 via-emerald-500/5",
		border: "border-emerald-400/20",
		text: "text-emerald-300",
		dot: "bg-emerald-300",
		wash: "bg-emerald-400/10",
	},
	cyan: {
		glow: "from-cyan-500/25 via-cyan-500/5",
		border: "border-cyan-400/20",
		text: "text-cyan-300",
		dot: "bg-cyan-300",
		wash: "bg-cyan-400/10",
	},
	rose: {
		glow: "from-rose-500/25 via-rose-500/5",
		border: "border-rose-400/20",
		text: "text-rose-300",
		dot: "bg-rose-300",
		wash: "bg-rose-400/10",
	},
	fuchsia: {
		glow: "from-fuchsia-500/25 via-fuchsia-500/5",
		border: "border-fuchsia-400/20",
		text: "text-fuchsia-300",
		dot: "bg-fuchsia-300",
		wash: "bg-fuchsia-400/10",
	},
	blue: {
		glow: "from-blue-500/25 via-blue-500/5",
		border: "border-blue-400/20",
		text: "text-blue-300",
		dot: "bg-blue-300",
		wash: "bg-blue-400/10",
	},
};

const statusStyles: Record<ProjectStatus, string> = {
	active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
	shipped: "border-sky-400/20 bg-sky-400/10 text-sky-300",
	archived: "border-zinc-700 bg-zinc-800/60 text-zinc-400",
	prototype: "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
	return (
		<span
			className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] ${statusStyles[status]}`}
		>
			<span
				className="h-1.5 w-1.5 rounded-full bg-current"
				aria-hidden="true"
			/>
			{projectStatusLabels[status]}
		</span>
	);
}

export function ProjectVisual({
	project,
	priority = false,
	compact = false,
}: {
	project: Project;
	priority?: boolean;
	compact?: boolean;
}) {
	const accent = projectAccentStyles[project.accent];

	return (
		<div
			className={`relative isolate overflow-hidden border ${
				accent.border
			} bg-zinc-950 ${
				compact
					? "min-h-[13rem] rounded-2xl"
					: "min-h-[18rem] rounded-3xl sm:min-h-[24rem]"
			}`}
		>
			{project.video ? (
				<>
					{compact ? (
						<Image
							src={project.video.poster}
							alt={project.video.label}
							fill
							priority={priority}
							sizes="(max-width: 768px) 100vw, 50vw"
							className={
								project.video.fit === "contain"
									? "object-contain"
									: "object-cover object-center"
							}
						/>
					) : (
						<video
							className={`absolute inset-0 h-full w-full ${
								project.video.fit === "contain"
									? "object-contain"
									: "object-cover object-center"
							}`}
							controls
							loop
							muted
							playsInline
							preload="metadata"
							poster={project.video.poster}
							aria-label={project.video.label}
						>
							<source src={project.video.src} type="video/mp4" />
						</video>
					)}
					<div
						className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"
						aria-hidden="true"
					/>
					<div
						className={`pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${accent.glow} to-transparent opacity-55`}
						aria-hidden="true"
					/>
				</>
			) : project.image ? (
				<>
					<Image
						src={project.image.src}
						alt={project.image.alt}
						fill
						priority={priority}
						sizes={
							compact
								? "(max-width: 768px) 100vw, 50vw"
								: "(max-width: 1024px) 100vw, 1200px"
						}
						className={
							project.image.fit === "contain"
								? "object-contain p-8 sm:p-12"
								: "object-cover object-center"
						}
					/>
					<div
						className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent"
						aria-hidden="true"
					/>
					<div
						className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${accent.glow} to-transparent opacity-70`}
						aria-hidden="true"
					/>
				</>
			) : (
				<>
					<div
						className={`absolute inset-0 bg-gradient-to-br ${accent.glow} to-transparent`}
						aria-hidden="true"
					/>
					<div
						className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
						aria-hidden="true"
					/>
					<div
						className={`relative flex items-center justify-center px-5 py-16 sm:px-10 ${
							compact ? "min-h-[13rem]" : "min-h-[18rem] sm:min-h-[24rem]"
						}`}
					>
						<div className="w-full">
							<p
								className={`mb-6 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] ${accent.text}`}
							>
								System map
							</p>
							<div className="flex flex-wrap items-center justify-center gap-2.5">
								{project.flow.map((node, index) => (
									<div key={node} className="contents">
										<span
											className={`rounded-lg border ${accent.border} ${accent.wash} px-3 py-2 text-center font-mono text-[0.65rem] leading-5 text-zinc-200 sm:text-xs`}
										>
											{node}
										</span>
										{index < project.flow.length - 1 ? (
											<ArrowRight
												className={`h-3.5 w-3.5 shrink-0 ${accent.text}`}
												aria-hidden="true"
											/>
										) : null}
									</div>
								))}
							</div>
						</div>
					</div>
				</>
			)}

			<div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/75 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur">
				<span
					className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
					aria-hidden="true"
				/>
				{project.category}
			</div>
		</div>
	);
}

export function ProjectCard({
	project,
	index,
	visual = false,
}: {
	project: Project;
	index: number;
	visual?: boolean;
}) {
	const accent = projectAccentStyles[project.accent];

	return (
		<Link
			href={`/projects/${project.slug}`}
			className="group block h-full rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-4 focus:ring-offset-zinc-950"
		>
			<article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/35 transition duration-300 group-hover:-translate-y-1 group-hover:border-zinc-600 group-hover:bg-zinc-900/60">
				{visual ? (
					<div className="p-2 pb-0">
						<ProjectVisual project={project} compact priority={index === 0} />
					</div>
				) : null}

				<div className="flex flex-1 flex-col p-6 sm:p-8">
					<div className="flex items-center justify-between gap-4">
						<span className="font-mono text-[0.65rem] tracking-[0.18em] text-zinc-600">
							{String(index + 1).padStart(2, "0")}
						</span>
						<div className="flex items-center gap-3">
							<span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-zinc-500">
								{project.year}
							</span>
							<ProjectStatusPill status={project.status} />
						</div>
					</div>

					<p
						className={`mt-8 font-mono text-[0.65rem] uppercase tracking-[0.18em] ${accent.text}`}
					>
						{project.eyebrow}
					</p>
					<div className="mt-3 flex items-start justify-between gap-4">
						<h3 className="font-display text-3xl leading-tight text-white sm:text-4xl">
							{project.title}
						</h3>
						<ArrowUpRight
							className="mt-1 h-5 w-5 shrink-0 text-zinc-600 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
							aria-hidden="true"
						/>
					</div>
					<p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 transition group-hover:text-zinc-300 sm:text-[0.95rem]">
						{project.summary}
					</p>

					<div className="mt-auto flex flex-wrap gap-2 pt-8">
						{project.stack.slice(0, 4).map((technology) => (
							<span
								key={technology}
								className="rounded-full border border-zinc-800 bg-zinc-950/50 px-3 py-1.5 font-mono text-[0.62rem] text-zinc-500"
							>
								{technology}
							</span>
						))}
					</div>
				</div>
			</article>
		</Link>
	);
}
