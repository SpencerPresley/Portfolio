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
						className="inline-flex items-center gap-2 rounded-sm text-sm text-zinc-400 transition hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
					>
						{work.external.label}
						<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</article>
	);
}
