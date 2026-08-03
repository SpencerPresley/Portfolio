export type ProfessionalWorkSlug = "crunchatlas" | "atlasconnect";

export type ProfessionalWorkAccent = "amber" | "sky";

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
			"I build the AI and backend infrastructure behind AtlasCyber: evidence-grounded agents, governed local inference, durable work orchestration, and isolated execution across cloud, on-prem, and air-gapped environments.",
		lead: "I build the systems that keep long-running security agents bounded, observable, and useful on local hardware. I also built PurpleHaze end to end.",
		role: "I built PurpleHaze end to end and most of AtlasCyber's AI and backend platform, including the systems described here. I also own AtlasCyber's AWS across GovCloud and commercial partitions.",
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
