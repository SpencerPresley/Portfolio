import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
	CaseStudyHero,
	CaseStudySection,
	CaseStudyShell,
	DetailGrid,
	MarketingShot,
	ProfessionalCaseStudyFooter,
	SystemFlow,
} from "../professional-case-study-ui";
import {
	professionalWork,
	showCrunchAtlasImages,
} from "../professional-work-data";

const work = professionalWork.crunchatlas;

export const metadata: Metadata = {
	title: work.title,
	description: work.summary,
	alternates: {
		canonical: "/projects/crunchatlas",
	},
	openGraph: {
		title: work.title,
		description: work.summary,
		type: "article",
		images: showCrunchAtlasImages
			? [{ url: "/projects/crunchatlas-campaign-assessment.webp" }]
			: undefined,
	},
};

const products = [
	{
		name: "AtlasCyber",
		what: "Detection, hunting, and case management for IT, OT, and ICS networks: hosted, on-site, or air-gapped.",
		mine: "Local model serving, GPU admission, the job queue, autonomous investigation, AWS and edge, and the Rust capture sensor.",
		caseStudy: undefined,
		product: "https://www.crunchatlas.com/atlascyber",
	},
	{
		name: "ClemAI",
		what: "AtlasCyber's built-in analyst: investigates detections, hunts, attributes activity, and writes reports. A person approves any response action.",
		mine: "The agent harness every ClemAI agent runs on, and the packet-capture forensics agent.",
		caseStudy: undefined,
		product: "https://www.crunchatlas.com/clemai",
	},
	{
		name: "PurpleHaze",
		what: "Tests authorized IT attack paths and retests after remediation. IT targets only, never OT or ICS.",
		mine: "Every PurpleHaze-specific component: workflows, tool layer, scanning, reports, pentest lab, and UI.",
		caseStudy: "/projects/purplehaze",
		product: "https://www.crunchatlas.com/purplehaze",
	},
] as const;

const stats = [
	{
		value: "~17,000",
		label:
			"packet-capture investigations the platform queued and completed on its own in its first two months",
	},
	{
		value: "7 or 160",
		label:
			"concurrent 128k-context agents, or 4k-token jobs, held in one 655k-token GPU pool that replaced five fixed slots",
	},
	{
		value: "12.3 s → 1.5 ms",
		label: "Files page query on a 7.2M-row table",
	},
	{
		value: "21.8 → 1.95 GiB",
		label: "peak memory of a campaign rebuild",
	},
] as const;

const atlasCyberMechanisms = [
	{
		title: "Prove the deployment before launch",
		detail:
			"A Python model reproduces llama.cpp's KV-cache allocation to the byte across grouped-query attention, sliding-window layers, and per-K/V quantization, so CI rejects a serving config that won't fit the GPU without one attached. A hardware acceptance test caught a 4-bit V-cache path with 18x slower prefill before it shipped.",
	},
	{
		title: "Admit work by tokens, not worker count",
		detail:
			"Each task declares the context it can use. A per-pool Postgres advisory lock admits a job only when its tokens fit beside what is already running, and a claimer that waited on the lock re-prices under READ COMMITTED, so concurrent workers cannot overcommit the card.",
	},
	{
		title: "Every job reaches a terminal state",
		detail:
			"Workers claim with SELECT FOR UPDATE SKIP LOCKED; interactive work always runs ahead of background work, and customers take fair-share turns. Each job runs under a spawned supervisor that reaps its process tree, and a heartbeat sweeper fails jobs whose supervisor died or froze. Chaos tests SIGKILL supervisors and kill the database mid-job.",
	},
	{
		title: "Bound fallible model behavior",
		detail:
			"Before every model call the harness tokenizes the exact outgoing request and refuses anything that won't fit. Oversized tool output moves to searchable files, a repeated call is steered and then compacted, and a generation that hits its cap is retracted before it reaches memory or a tool.",
	},
	{
		title: "Investigate without a click",
		detail:
			"A background reconciler decides which AI work should exist and queues it. Each dispatch commits independently behind a durable resume cursor, so a crash loses nothing already queued, and a user's click promotes an already-queued run ahead of all background work.",
	},
	{
		title: "Keep the analyst's pages fast at millions of rows",
		detail:
			"Per-document alert counts live in a summary table kept exact by statement-level Postgres triggers, with a reconcile job that repairs drift; campaign rebuilds read only the columns they aggregate and load a large JSON column only for the rows that need it.",
	},
] as const;

const industries = [
	{
		label: "Water and wastewater",
		href: "https://www.crunchatlas.com/industries/water-and-wastewater",
	},
	{
		label: "Power and energy",
		href: "https://www.crunchatlas.com/industries/power-and-energy",
	},
	{
		label: "Federal and defense",
		href: "https://www.crunchatlas.com/industries/federal-and-defense",
	},
	{
		label: "Local government",
		href: "https://www.crunchatlas.com/industries/local-government",
	},
	{
		label: "Manufacturing",
		href: "https://www.crunchatlas.com/industries/manufacturing",
	},
	{
		label: "Education",
		href: "https://www.crunchatlas.com/industries/education",
	},
	{
		label: "MSPs and MSSPs",
		href: "https://www.crunchatlas.com/partners/msp-mssp",
	},
] as const;

const linkClass =
	"inline-flex items-center gap-1 text-amber-300 underline decoration-amber-400/30 underline-offset-4 transition hover:text-white";

export default function CrunchAtlasCaseStudy() {
	const sectionNumbers = new Map<string, string>();
	for (const id of [
		"products",
		"operating-constraint",
		"atlascyber-runtime",
		...(showCrunchAtlasImages ? ["product-proof"] : []),
		"delivery-and-edge",
	]) {
		sectionNumbers.set(id, String(sectionNumbers.size + 1).padStart(2, "0"));
	}
	const number = (id: string) => sectionNumbers.get(id) ?? "";

	return (
		<CaseStudyShell work={work}>
			<CaseStudyHero
				work={work}
				disclosure="This case study describes system boundaries and engineering mechanisms. It omits customer data, proprietary detection logic, exact offensive procedures, private prompts, and private source code."
			/>

			<CaseStudySection
				number={number("products")}
				eyebrow="Products"
				title="Three products, one platform underneath."
				id="products"
				intro="CrunchAtlas sells security for critical infrastructure. Its public product pages describe what each product does; the right-hand column is what I built."
			>
				<div className="overflow-x-auto rounded-2xl border border-zinc-800">
					<table className="w-full min-w-[40rem] text-left text-sm">
						<thead className="bg-zinc-900/70 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-400">
							<tr>
								<th scope="col" className="px-5 py-4 font-normal">
									Product
								</th>
								<th scope="col" className="px-5 py-4 font-normal">
									What it does
								</th>
								<th scope="col" className="px-5 py-4 font-normal">
									My part
								</th>
								<th scope="col" className="px-5 py-4 font-normal">
									Links
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800">
							{products.map((product) => (
								<tr key={product.name} className="align-top">
									<th
										scope="row"
										className="px-5 py-5 font-display text-lg font-normal text-white"
									>
										{product.name}
									</th>
									<td className="px-5 py-5 leading-6 text-zinc-400">
										{product.what}
									</td>
									<td className="px-5 py-5 leading-6 text-zinc-300">
										{product.mine}
									</td>
									<td className="space-y-2 px-5 py-5 leading-6">
										{product.caseStudy ? (
											<Link href={product.caseStudy} className={linkClass}>
												Case study
											</Link>
										) : null}
										<a
											href={product.product}
											target="_blank"
											rel="noreferrer"
											className={`${linkClass} ${
												product.caseStudy ? "flex" : ""
											}`}
										>
											Product page
											<ArrowUpRight
												className="h-3.5 w-3.5"
												aria-hidden="true"
											/>
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="mt-8 max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
					It serves critical-infrastructure operators across these sectors.
					CrunchAtlas publicly lists NEUCIC, the New England Utilities
					Cybersecurity Integration Collaborative, among its partners, and the
					platform runs in production for it.
				</p>
				<ul className="mt-5 flex flex-wrap gap-2">
					{industries.map((industry) => (
						<li key={industry.href}>
							<a
								href={industry.href}
								target="_blank"
								rel="noreferrer"
								className="block rounded-md border border-zinc-800 bg-zinc-900/70 px-2.5 py-1.5 text-xs leading-4 text-zinc-400 transition hover:border-zinc-600 hover:text-amber-300"
							>
								{industry.label}
							</a>
						</li>
					))}
				</ul>
			</CaseStudySection>

			<CaseStudySection
				number={number("operating-constraint")}
				eyebrow="Operating constraint"
				title="The hard part was making local intelligence operable."
				id="operating-constraint"
				intro="AtlasCyber has to run across cloud, on-premises, and air-gapped environments, usually on one GPU per box. That turns GPU capacity, long evidence sets, process failure, and provenance into product constraints, not infrastructure trivia."
			>
				<SystemFlow
					label="AtlasCyber analysis flow"
					steps={work.flow}
					accent={work.accent}
				/>
				<dl className="mt-8 grid gap-4 sm:grid-cols-2">
					{stats.map((stat) => (
						<div
							key={stat.value}
							className="rounded-2xl border border-amber-400/20 bg-zinc-900/45 p-6"
						>
							<dt className="font-display text-3xl text-white">{stat.value}</dt>
							<dd className="mt-3 text-sm leading-6 text-zinc-400">
								{stat.label}
							</dd>
						</div>
					))}
				</dl>
			</CaseStudySection>

			<CaseStudySection
				number={number("atlascyber-runtime")}
				eyebrow="AtlasCyber"
				title="Deterministic scaffolding around fallible local models."
				id="atlascyber-runtime"
				intro="I built the serving, admission, queue, autonomy, and agent-runtime layers as one system for AI-heavy security work. Each boundary exists because a worker count, a prompt, or a happy-path process tree is not a reliability strategy."
			>
				<DetailGrid items={atlasCyberMechanisms} accent={work.accent} />
				<div className="mt-8 grid gap-5 text-[1.02rem] leading-8 text-zinc-400 lg:grid-cols-2">
					<p>
						Domain agents construct models through one boundary, while
						per-request serving ceilings remain separate from per-task context
						budgets. Generic middleware owns context policy; report and security
						semantics stay in their domain layers.
					</p>
					<p>
						Per-run tool containers are read-only, network-disabled, resource
						bounded, and self-reaping. I do not describe that as perfect tenant
						isolation: narrowing the current read-only media aperture remains a
						separate security boundary.
					</p>
				</div>
			</CaseStudySection>

			{showCrunchAtlasImages ? (
				<CaseStudySection
					number={number("product-proof")}
					eyebrow="Product proof"
					title="The infrastructure ends in inspectable work."
					id="product-proof"
					intro="Public marketing views show the boundary I can expose: evidence-backed assessment and an agent-generated report, not customer data or internal detection logic."
				>
					<div className="space-y-6">
						<MarketingShot
							src="/projects/crunchatlas-campaign-assessment.webp"
							alt="CrunchAtlas campaign assessment showing summarized network-security evidence and findings"
							caption="Public CrunchAtlas marketing image: a campaign assessment turns collected evidence into an inspectable security result."
							priority
						/>
						<MarketingShot
							src="/projects/crunchatlas-agent-report.webp"
							alt="CrunchAtlas case view showing a structured report produced by a security analysis agent"
							caption="Public CrunchAtlas marketing image: a domain agent's result is presented as a structured report rather than an opaque chat response."
						/>
					</div>
				</CaseStudySection>
			) : null}

			<CaseStudySection
				number={number("delivery-and-edge")}
				eyebrow="Delivery and edge"
				title="The same reliability boundary continues outside the agent."
				id="delivery-and-edge"
			>
				<div className="grid gap-5 lg:grid-cols-2">
					<article className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-7">
						<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber-300">
							Operational ownership
						</p>
						<h3 className="mt-5 font-display text-2xl text-white">
							AtlasCyber in AWS and at the edge
						</h3>
						<p className="mt-4 text-sm leading-7 text-zinc-400">
							I own AtlasCyber's AWS across GovCloud and commercial partitions,
							managed in Terraform: load balancers behind WAF, EC2 bastions,
							certificates, DNS, CloudWatch alarms, and flow logs. Deployed
							boxes are reached three ways: a Cloudflare Tunnel with no inbound
							ports, an nginx bastion linked over WireGuard, and older SSH
							reverse tunnels I adopted into Terraform with import blocks.
						</p>
						<p className="mt-3 text-sm leading-7 text-zinc-400">
							Details are on the{" "}
							<Link href="/resume/backend-platform" className={linkClass}>
								resume page
							</Link>
							.
						</p>
					</article>

					<article className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-7">
						<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber-300">
							Completed rewrite foundation
						</p>
						<h3 className="mt-5 font-display text-2xl text-white">
							CrunchSense v3
						</h3>
						<p className="mt-4 text-sm leading-7 text-zinc-400">
							I rewrote the AtlasCyber edge sensor around a headless Rust
							daemon: BPF-filtered capture and atomic rotation, a persistent
							SQLite WAL upload queue, bounded retry, storage-pressure guards,
							machine-bound encrypted credentials, an authenticated loopback
							API, hardened systemd delivery, and Linux package/service smoke
							coverage. The UI is optional, so capture does not depend on its
							lifecycle.
						</p>
						<p className="mt-3 text-xs leading-6 text-zinc-400">
							This is a stability-oriented foundation with deliberate legacy
							parity still deferred.
						</p>
					</article>
				</div>
			</CaseStudySection>

			<section className="py-20" aria-labelledby="crunchatlas-outcome">
				<div className="rounded-3xl border border-amber-400/20 bg-zinc-900/55 p-8 sm:p-12">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
						Where it landed
					</p>
					<h2
						id="crunchatlas-outcome"
						className="mt-5 max-w-4xl font-display text-3xl leading-relaxed text-white sm:text-4xl"
					>
						Local models and security tools became one operable system: work is
						admitted by what the GPU can hold, every job ends in a known state,
						and the platform investigates on its own across cloud, on-premises,
						and air-gapped environments.
					</h2>
				</div>
			</section>

			<ProfessionalCaseStudyFooter current="crunchatlas" />
		</CaseStudyShell>
	);
}
