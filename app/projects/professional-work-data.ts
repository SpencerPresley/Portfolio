export type ProfessionalWorkSlug =
	| "crunchatlas"
	| "purplehaze"
	| "atlasconnect";

export type ProfessionalWorkAccent = "amber" | "sky" | "violet";

export type ProfessionalWorkImage = {
	src: string;
	alt: string;
};

export type ProfessionalWork = {
	slug: ProfessionalWorkSlug;
	href: `/projects/${ProfessionalWorkSlug}`;
	title: string;
	cardTitle: string;
	eyebrow: string;
	period: string;
	category: string;
	headline: string;
	summary: string;
	lead: string;
	role: string;
	accent: ProfessionalWorkAccent;
	external: {
		label: string;
		href: string;
	};
	previewSteps: readonly string[];
	flow: readonly string[];
	image: ProfessionalWorkImage | undefined;
};

export const showCrunchAtlasImages =
	process.env.SHOW_CRUNCHATLAS_IMAGES === "true";

export const professionalWork = {
	crunchatlas: {
		slug: "crunchatlas",
		href: "/projects/crunchatlas",
		title: "CrunchAtlas: AtlasCyber & PurpleHaze",
		cardTitle: "CrunchAtlas / AtlasCyber",
		eyebrow: "Current work",
		period: "2025–",
		category: "Local AI and security systems",
		headline: "Reliable local AI where cloud assumptions break.",
		summary:
			"I build the AI and backend infrastructure behind AtlasCyber and the agent platform its built-in analyst, ClemAI, runs on: local model serving, token-priced GPU admission, a Postgres job queue, autonomous investigation, and the AWS and edge that reach on-prem and air-gapped boxes.",
		lead: "I build the systems that keep long-running security agents bounded, observable, and useful on a single local GPU. The platform has completed nearly 17,000 packet-capture investigations on its own, with no analyst click. I also built PurpleHaze's product layer end to end.",
		role: "Most of AtlasCyber's AI and backend platform, including every system described here, and every PurpleHaze-specific component. I also own AtlasCyber's AWS across GovCloud and commercial partitions, managed in Terraform.",
		accent: "amber",
		external: {
			label: "Visit CrunchAtlas",
			href: "https://www.crunchatlas.com/",
		},
		previewSteps: [
			"Governed local inference",
			"Durable work admission",
			"Observable agent runtime",
			"Cloud, on-prem, and air-gapped delivery",
		],
		flow: [
			"Evidence",
			"Durable work admission",
			"Governed local agents",
			"Inspectable analysis",
		],
		image: showCrunchAtlasImages
			? {
					src: "/projects/crunchatlas-campaign-assessment.webp",
					alt: "Public CrunchAtlas marketing view showing a network security campaign summary",
			  }
			: undefined,
	},
	purplehaze: {
		slug: "purplehaze",
		href: "/projects/purplehaze",
		title: "PurpleHaze",
		cardTitle: "PurpleHaze",
		eyebrow: "CrunchAtlas product",
		period: "2025–",
		category: "Autonomous penetration testing",
		headline: "A local model that runs a scoped pentest.",
		summary:
			"PurpleHaze tests authorized IT attack paths with a self-hosted LLM driving real offensive tooling, then turns the evidence into OWASP, NIST, and executive reports. I built every PurpleHaze-specific component.",
		lead: "PurpleHaze points a self-hosted model at approved IT targets and lets it work through reconnaissance, exploitation, web, and credential testing with real tools, keeping live Metasploit sessions alive across turns, then turns what it recorded into structured compliance reports.",
		role: "Sole author of PurpleHaze's product layer: the agent workflows, tool layer, OpenVAS pipeline and host discovery, report generation, pentest container, and UI. It runs on the AtlasCyber platform it was forked from, including agent and queue infrastructure I also built.",
		accent: "violet",
		external: {
			label: "PurpleHaze on crunchatlas.com",
			href: "https://www.crunchatlas.com/purplehaze",
		},
		previewSteps: [
			"Discover and scan targets",
			"Agent-driven workflows",
			"Persistent Metasploit state",
			"OWASP, NIST, and executive reports",
		],
		flow: ["Discover and scan", "Agent workflow", "Structured findings", "Report"],
		image: undefined,
	},
	atlasconnect: {
		slug: "atlasconnect",
		href: "/projects/atlasconnect",
		title: "AtlasConnect → Pitchfire",
		cardTitle: "AtlasConnect",
		eyebrow: "Private production work",
		period: "2025",
		category: "AI product and backend",
		headline: "From incoming pitch deck to an investment decision.",
		summary:
			"As sole developer and maintainer of an inherited Django and React product, I built the ingestion, AI research, fit evaluation, and firm workflow now marketed as Pitchfire.",
		lead: "The system turned messy submissions into structured opportunities, firm-specific research, and a decision workflow people could actually operate.",
		role: "I was the sole developer and maintainer during my tenure. I inherited the original product, then built and operated the systems described here.",
		accent: "sky",
		external: {
			label: "See Pitchfire",
			href: "https://www.pitchfire.com/",
		},
		previewSteps: [
			"Form, file, DocSend, and email intake",
			"Native extraction with OCR fallback",
			"AI enrichment and firm-fit research",
			"Voting, discussion, and deal workflow",
		],
		flow: ["Intake", "Extraction", "Enrichment and research", "Firm decision"],
		image: undefined,
	},
} as const satisfies Record<ProfessionalWorkSlug, ProfessionalWork>;

export const professionalWorkList: readonly ProfessionalWork[] = [
	professionalWork.crunchatlas,
	professionalWork.atlasconnect,
];

export function getProfessionalWork(
	slug: ProfessionalWorkSlug,
): ProfessionalWork {
	return professionalWork[slug];
}
