import type { Metadata } from "next";
import {
	CaseStudyHero,
	CaseStudyShell,
	DetailGrid,
	ProfessionalCaseStudyFooter,
	SystemFlow,
} from "../professional-case-study-ui";
import { professionalWork } from "../professional-work-data";

const work = professionalWork.atlasconnect;

export const metadata: Metadata = {
	title: work.title,
	description: work.summary,
	alternates: {
		canonical: "/projects/atlasconnect",
	},
	openGraph: {
		title: work.title,
		description: work.summary,
		type: "article",
	},
};

const engineeringChoices = [
	{
		title: "Treat extraction quality as data",
		detail:
			"Native parsing remained the fast path, but glyph and quality checks decided when a page needed selective or full OCR instead of silently accepting garbage.",
	},
	{
		title: "Separate preparation from judgment",
		detail:
			"Firm and opportunity analyses could run concurrently before synthesis, keeping expensive research observable and preventing one opaque prompt from owning the whole decision.",
	},
	{
		title: "Move slow work off the request path",
		detail:
			"Background execution and realtime progress let ingestion, research, and memo work complete without turning the browser request into the job lifecycle.",
	},
	{
		title: "Finish the human workflow",
		detail:
			"Stages, voting, discussion, reminders, and notifications connected model output to the actual decision process instead of stopping at generated text.",
	},
] as const;

const stages = [
	{
		number: "01",
		eyebrow: "Intake",
		title: "Accept the opportunity through the channel it actually arrived in.",
		body: "Embedded forms, direct uploads, DocSend imports, and an AWS Lambda email-intake path I built and operated all converged on the same opportunity workflow.",
		detail:
			"Multiple entry points mattered because a venture workflow cannot require every founder, analyst, or forwarded deck to begin inside one idealized form.",
	},
	{
		number: "02",
		eyebrow: "Extraction",
		title: "Make bad documents explicit instead of trusting the happy path.",
		body: "The ingestion layer handled PDF, DOCX, PPTX, images, and text. It attempted native extraction first, detected glyph and quality failures, then used selective or full OCR fallback with parallel page work when the source required it.",
		detail:
			"Structured opportunity fields and visible progress turned that document work into an inspectable product step rather than a blocking upload spinner.",
	},
	{
		number: "03",
		eyebrow: "Fit and research",
		title:
			"Build firm context and opportunity context before asking for a verdict.",
		body: "Firm and opportunity preparation ran concurrently, then fed synthesis, thesis-fit evaluation, market research, and leadership research. Bounded navigation and background execution kept research useful without giving it an unbounded request lifecycle.",
		detail:
			"The public boundary here is the staged system; private scoring prompts, weights, and research instructions stay out of scope.",
	},
	{
		number: "04",
		eyebrow: "Firm workflow",
		title: "A decision product still needs the ordinary product work.",
		body: "Opportunity stages, voting, requests, discussions, reminders, notifications, and realtime completion feedback carried the enriched deal through the firm's human decision process.",
		detail:
			"That workflow is what separated a production product from a collection of LLM calls that happened to read pitch decks.",
	},
] as const;

export default function AtlasConnectCaseStudy() {
	return (
		<CaseStudyShell work={work}>
			<CaseStudyHero
				work={work}
				disclosure="This case study covers the workflow and engineering boundaries I can discuss publicly. It omits customer submissions, private prompts, scoring weights, research instructions, and private source code."
			/>

			<section
				className="border-b border-zinc-800 py-20"
				aria-labelledby="atlasconnect-flow"
			>
				<div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
						01 · System flow
					</p>
					<div className="min-w-0 max-w-4xl">
						<h2
							id="atlasconnect-flow"
							className="font-display text-3xl leading-tight text-white sm:text-4xl"
						>
							One pipeline from raw submission to firm decision.
						</h2>
						<p className="mt-6 max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
							The interesting part was not any single model call. It was making
							messy intake, document recovery, research, structured evaluation,
							and ordinary collaboration behave like one product.
						</p>
						<div className="mt-10">
							<SystemFlow
								label="AtlasConnect opportunity flow"
								steps={work.flow}
								accent={work.accent}
							/>
						</div>
					</div>
				</div>
			</section>

			<div className="border-b border-zinc-800 py-20">
				<div className="grid gap-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<aside className="lg:sticky lg:top-28 lg:self-start">
						<p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
							02 · Pipeline
						</p>
						<p className="mt-5 text-sm leading-7 text-zinc-400">
							Each stage produced a durable input for the next one and a visible
							state for the operator.
						</p>
					</aside>

					<div className="space-y-16">
						{stages.map((stage) => (
							<section
								key={stage.number}
								data-atlasconnect-stage={stage.number}
								aria-labelledby={`atlasconnect-stage-${stage.number}`}
								className="grid gap-6 border-l border-sky-400/20 pl-6 sm:pl-9"
							>
								<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-sky-300">
									{stage.number} · {stage.eyebrow}
								</p>
								<h2
									id={`atlasconnect-stage-${stage.number}`}
									className="font-display text-3xl leading-tight text-white"
								>
									{stage.title}
								</h2>
								<p className="text-[1.02rem] leading-8 text-zinc-400">
									{stage.body}
								</p>
								<p className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-5 text-sm leading-7 text-zinc-400">
									{stage.detail}
								</p>
							</section>
						))}
					</div>
				</div>
			</div>

			<section
				className="border-b border-zinc-800 py-20"
				aria-labelledby="atlasconnect-decisions"
			>
				<div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
						03 · Engineering choices
					</p>
					<div className="min-w-0 max-w-4xl">
						<h2
							id="atlasconnect-decisions"
							className="font-display text-3xl leading-tight text-white sm:text-4xl"
						>
							The pipeline stayed observable at every expensive boundary.
						</h2>
						<div className="mt-10">
							<DetailGrid items={engineeringChoices} accent={work.accent} />
						</div>
					</div>
				</div>
			</section>

			<section className="py-20" aria-labelledby="atlasconnect-outcome">
				<div className="rounded-3xl border border-sky-400/20 bg-zinc-900/55 p-8 sm:p-12">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
						Where it landed
					</p>
					<h2
						id="atlasconnect-outcome"
						className="mt-5 max-w-4xl font-display text-3xl leading-relaxed text-white sm:text-4xl"
					>
						The product moved an opportunity from raw deck to structured
						research, firm-specific fit, and a collaborative decision workflow.
						It is now marketed as Pitchfire.
					</h2>
				</div>
			</section>

			<ProfessionalCaseStudyFooter current="atlasconnect" />
		</CaseStudyShell>
	);
}
