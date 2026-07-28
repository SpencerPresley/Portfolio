import type { Metadata } from "next";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Navigation } from "../components/nav";
import {
	PageAtmosphere,
	pageAtmosphereStyles,
} from "../components/page-atmosphere";
import { siteContact } from "../site-data";

export const metadata: Metadata = {
	title: "Contact",
	description: "Contact Spencer Presley by email, GitHub, or LinkedIn.",
};

const contactAtmosphere = pageAtmosphereStyles.contact;

export default function ContactPage() {
	const profiles = [
		{ icon: Github, ...siteContact.github },
		{ icon: Linkedin, ...siteContact.linkedin },
	];

	return (
		<div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
			<PageAtmosphere variant="contact" />
			<div
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_48%)]"
				aria-hidden="true"
			/>
			<Navigation />

			<main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
				<header className="max-w-4xl border-b border-zinc-800 pb-14">
					<p
						className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${contactAtmosphere.eyebrowText}`}
					>
						<span
							className={`h-px w-8 ${contactAtmosphere.eyebrowLine}`}
							aria-hidden="true"
						/>
						Contact
					</p>
					<h1 className="font-display text-5xl leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
						Let's talk.
					</h1>
					<p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
						Email is the best way to reach me. You can also find my public
						work on GitHub and connect on LinkedIn.
					</p>
				</header>

				<section className="pt-12" aria-labelledby="contact-methods">
					<h2 id="contact-methods" className="sr-only">
						Contact methods
					</h2>

					<a
						href={`mailto:${siteContact.email}`}
						className="group grid gap-6 rounded-3xl border border-sky-400/20 bg-zinc-900/55 p-6 transition hover:border-sky-300/40 hover:bg-zinc-900/75 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:p-10 lg:grid-cols-[3rem_minmax(0,1fr)_auto] lg:items-center"
					>
						<span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
							<Mail className="h-5 w-5" aria-hidden="true" />
						</span>
						<span>
							<span className="block font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sky-300">
								Email me
							</span>
							<span
								data-contact-email="true"
								className="mt-3 block whitespace-nowrap font-display text-[clamp(1rem,5vw,1.5rem)] leading-tight text-white sm:text-4xl"
							>
								{siteContact.email}
							</span>
						</span>
						<ArrowUpRight
							className="h-5 w-5 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-300"
							aria-hidden="true"
						/>
					</a>

					<div className="mt-5 grid gap-5 sm:grid-cols-2">
						{profiles.map(({ icon: Icon, label, handle, href }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noreferrer"
								className="group flex items-center gap-5 rounded-3xl border border-zinc-800 bg-zinc-900/35 p-6 transition hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/60 focus:outline-none focus:ring-2 focus:ring-violet-400 sm:p-8"
							>
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
									<Icon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span className="min-w-0">
									<span className="block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
										{label}
									</span>
									<span className="mt-2 block truncate text-base font-medium text-zinc-200 transition group-hover:text-white">
										{handle}
									</span>
								</span>
								<ArrowUpRight
									className="ml-auto h-4 w-4 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
									aria-hidden="true"
								/>
							</a>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
