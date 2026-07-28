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
					<span className="sr-only">
						Read {work.cardTitle} case study
					</span>
				</Link>
			) : (
				<Link
					href={work.href}
					className={`block border-b border-zinc-800 bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.17),transparent_44%),radial-gradient(circle_at_100%_100%,rgba(124,58,237,0.13),transparent_40%)] p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset ${focusRing}`}
				>
					<ol
						aria-label={`${work.cardTitle} system flow`}
						className="grid gap-2.5"
					>
						{work.previewSteps.map((step, index) => (
							<li
								key={step}
								className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3"
							>
								<span className="font-mono text-[0.62rem] text-sky-300">
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
						className={`inline-flex items-center gap-2 rounded-sm text-sm text-zinc-400 transition hover:text-zinc-200 focus:outline-none focus-visible:ring-2 ${focusRing}`}
					>
						{work.external.label}
						<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</article>
	);
}
