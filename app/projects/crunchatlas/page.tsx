import type { Metadata } from "next";
import {
	CaseStudyHero,
	CaseStudySection,
	CaseStudyShell,
	DetailGrid,
	MarketingShot,
	ProfessionalCaseStudyFooter,
	SystemFlow,
} from "../professional-case-study-ui";
import { professionalWork } from "../professional-work-data";

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
		images: [{ url: "/projects/crunchatlas-campaign-assessment.webp" }],
	},
};

const atlasCyberMechanisms = [
	{
		title: "Prove the deployment before launch",
		detail:
			"Model serving is declarative and fail-closed. The deployment is rejected unless its declared context, concurrency, and memory shape fit the hardware budget.",
	},
	{
		title: "Admit work by cost, not worker count",
		detail:
			"Postgres claims AI work under a shared token-domain budget, so task shape—not an arbitrary process count—determines whether scarce local inference capacity is available.",
	},
	{
		title: "Keep agent failure visible",
		detail:
			"Workers, supervisors, child processes, streaming events, and a sweeper preserve an observable lifecycle through cancellation, crashes, process death, and abandoned work.",
	},
	{
		title: "Bound fallible model behavior",
		detail:
			"Exact token accounting, tool-result eviction, compaction, parse recovery, and output-cap recovery keep long-running domain agents inside explicit operating limits.",
	},
] as const;

const purpleHazeDetails = [
	{
		title: "Engagement orchestration",
		detail:
			"Workflow and scan steps were chained into one controlled engagement rather than exposed as disconnected tools.",
	},
	{
		title: "Persistent live state",
		detail:
			"Offensive-session state survived long runs and context compaction, preserving the execution state the model could not safely reconstruct.",
	},
	{
		title: "Durable execution records",
		detail:
			"Tool execution and workflow state remained inspectable across the engagement instead of disappearing into an opaque chat transcript.",
	},
	{
		title: "Validated reports",
		detail:
			"OWASP, NIST, executive, and supporting report structures were validated before generating final report artifacts.",
	},
] as const;

export default function CrunchAtlasCaseStudy() {
	return (
		<CaseStudyShell work={work}>
			<CaseStudyHero
				work={work}
				disclosure="This case study describes system boundaries and engineering mechanisms. It omits customer data, proprietary detection logic, exact offensive procedures, private prompts, and private source code."
			/>

			<CaseStudySection
				number="01"
				eyebrow="Operating constraint"
				title="The hard part was making local intelligence operable."
				id="operating-constraint"
				intro="AtlasCyber has to run across cloud, on-premises, and air-gapped environments. That turns GPU capacity, long evidence sets, process failure, and provenance into product constraints—not infrastructure trivia."
			>
				<SystemFlow
					label="AtlasCyber analysis flow"
					steps={work.flow}
					accent={work.accent}
				/>
			</CaseStudySection>

			<CaseStudySection
				number="02"
				eyebrow="AtlasCyber"
				title="Deterministic scaffolding around fallible local models."
				id="atlascyber-runtime"
				intro="I built the serving, work-admission, execution, and agent-runtime layers as one operating system for AI-heavy security work. Each boundary exists because a worker count, a prompt, or a happy-path process tree is not a reliability strategy."
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

			<CaseStudySection
				number="03"
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

			<CaseStudySection
				number="04"
				eyebrow="PurpleHaze"
				title="An autonomous engagement, built end to end."
				id="purplehaze"
				intro="PurpleHaze connected a local model to controlled offensive workflows while preserving the live execution state and report contracts the model could not be trusted to remember or invent."
			>
				<SystemFlow
					label="PurpleHaze engagement flow"
					steps={[
						"Scope",
						"Controlled execution",
						"Persistent session state",
						"Validated report",
					]}
					accent={work.accent}
				/>
				<div className="mt-6">
					<DetailGrid items={purpleHazeDetails} accent={work.accent} />
				</div>
			</CaseStudySection>

			<CaseStudySection
				number="05"
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
							AtlasCyber in AWS
						</h3>
						<p className="mt-4 text-sm leading-7 text-zinc-400">
							I own AtlasCyber's AWS footprint across GovCloud and commercial
							partitions: compute, object storage, IAM, VPC networking, content
							delivery, and the reverse-proxy and tunnel fleet that reaches
							deployed environments.
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
						<p className="mt-3 text-xs leading-6 text-zinc-600">
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
						Local models and security tools became one operable system with
						explicit admission, bounded execution, durable state, and
						inspectable results across cloud, on-premises, and air-gapped
						environments.
					</h2>
				</div>
			</section>

			<ProfessionalCaseStudyFooter current="crunchatlas" />
		</CaseStudyShell>
	);
}
