import type { Metadata } from "next";
import Link from "next/link";
import {
	CaseStudyHero,
	CaseStudySection,
	CaseStudyShell,
	DetailGrid,
	ProfessionalCaseStudyFooter,
	SystemFlow,
} from "../professional-case-study-ui";
import { professionalWork } from "../professional-work-data";

const work = professionalWork.purplehaze;

export const metadata: Metadata = {
	title: work.title,
	description: work.summary,
	alternates: {
		canonical: "/projects/purplehaze",
	},
	openGraph: {
		title: work.title,
		description: work.summary,
		type: "article",
	},
};

const workflows = [
	{
		title: "Network reconnaissance",
		detail:
			"Maps live hosts, open services, and versions with nmap, masscan, httpx, dnsrecon, and nbtscan, and records what it finds as structured findings.",
	},
	{
		title: "Exploitation",
		detail:
			"Works from recon and scan findings through searchsploit and Metasploit, holding any session it opens for the rest of the engagement.",
	},
	{
		title: "Web application testing",
		detail:
			"Probes web targets with nuclei, ffuf, gobuster, sqlmap, nikto, dalfox, sslyze, and schemathesis.",
	},
	{
		title: "Credential testing",
		detail:
			"Tests authentication surfaces with hydra, NetExec, smbmap, and john.",
	},
] as const;

const toolLayer = [
	{
		title: "Metasploit that remembers",
		detail:
			"The Metasploit tool keeps one msfconsole alive across agent turns, so loaded modules, options, and open shell or Meterpreter sessions survive between tool calls and through context compaction. After compaction the agent is told which context it is in: the console, a shell, or Meterpreter. The persistent console is adapted from an open-source implementation, credited in the source.",
	},
	{
		title: "Real tools in an isolated box",
		detail:
			"Every command runs in a Kali container on its own Docker network rather than on the application host. In production, targets are separate EC2 instances reached by IP.",
	},
	{
		title: "Scanning feeds the agent",
		detail:
			"OpenVAS/Greenbone scans run from the product with status, severity overrides, history, and notes, and their results are available to agent runs. Host discovery validates IPs and CIDRs and caps subnet size before an nmap ping sweep.",
	},
	{
		title: "A terminal for the operator",
		detail:
			"A WebSocket terminal in the browser opens a shell in the same pentest container the agent works in.",
	},
] as const;

export default function PurpleHazeCaseStudy() {
	return (
		<CaseStudyShell work={work}>
			<CaseStudyHero
				work={work}
				disclosure="This case study describes what PurpleHaze does and how it is built at the level of components and tools. It omits prompts, exploit procedures, scan data, and customer targets."
			/>

			<CaseStudySection
				number="01"
				eyebrow="Engagement"
				title="Scoped targets in, evidence-backed reports out."
				id="engagement"
				intro="An operator chooses IT targets; PurpleHaze never tests OT or ICS. A self-hosted model then works the engagement with real offensive tools, and what those tools recorded becomes the report."
			>
				<SystemFlow
					label="PurpleHaze engagement flow"
					steps={work.flow}
					accent={work.accent}
				/>
				<p className="mt-8 max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
					The model is Devstral Small 2 (24B), served locally, so target data
					and findings never leave the deployment. Scope is held by the
					operator's target list, per-workflow scope rules, and validated
					discovery input; I do not describe it as an approval-gated system.
				</p>
			</CaseStudySection>

			<CaseStudySection
				number="02"
				eyebrow="Workflows"
				title="Four testing methods, each with its own toolset."
				id="workflows"
				intro="Each workflow decides which tools the agent may use and produces findings, comments, and a summary in the same structure, so any workflow's output can feed the same report."
			>
				<DetailGrid items={workflows} accent={work.accent} />
			</CaseStudySection>

			<CaseStudySection
				number="03"
				eyebrow="Tool layer"
				title="State the model cannot be trusted to remember."
				id="tool-layer"
				intro="A long engagement outlives the model's context window. The tool layer, not the transcript, is what holds the live state an exploit chain depends on."
			>
				<DetailGrid items={toolLayer} accent={work.accent} />
			</CaseStudySection>

			<CaseStudySection
				number="04"
				eyebrow="Reports"
				title="Compliance reports with a fixed shape."
				id="reports"
				intro="The model turns recorded findings into OWASP, NIST, and executive-summary reports. Each report is a validated schema (scope, findings, severity, confidence, and supporting evidence) rendered through HTML templates, so a report cannot omit a required section or invent its own structure."
			>
				<SystemFlow
					label="Report pipeline"
					steps={[
						"Recorded findings and tool evidence",
						"Schema-validated report",
						"OWASP · NIST · executive summary",
						"Rendered report",
					]}
					accent={work.accent}
				/>
			</CaseStudySection>

			<CaseStudySection
				number="05"
				eyebrow="Testing"
				title="Tested against targets that really are vulnerable."
				id="testing"
				intro="A command-line runner drives full workflows against a lab of deliberately vulnerable services (Samba, Tomcat, Struts2, Spring, Redis, and Elasticsearch, each with a known CVE) and keeps the results for comparison across changes."
			>
				<p className="max-w-3xl text-[1.02rem] leading-8 text-zinc-400">
					PurpleHaze began as a fork of the pre-monorepo AtlasCyber codebase.
					The agent framework and job queue underneath it are shared platform
					work, described in the{" "}
					<Link
						href="/projects/crunchatlas"
						className="text-violet-300 underline decoration-violet-400/40 underline-offset-4 transition hover:text-white"
					>
						CrunchAtlas case study
					</Link>
					.
				</p>
			</CaseStudySection>

			<ProfessionalCaseStudyFooter current="purplehaze" />
		</CaseStudyShell>
	);
}
