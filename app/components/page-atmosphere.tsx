export type PageAtmosphereVariant =
	| "home"
	| "projects"
	| "contact"
	| "resume";

type PageAtmosphereStyle = {
	wash: string;
	eyebrowText: string;
	eyebrowLine: string;
};

export const pageAtmosphereStyles = {
	home: {
		wash: "h-[54rem] bg-[radial-gradient(circle_at_14%_0%,rgba(124,58,237,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.14),transparent_34%)]",
		eyebrowText: "text-violet-300",
		eyebrowLine: "bg-violet-400/70",
	},
	projects: {
		wash: "h-[52rem] bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.15),transparent_36%),radial-gradient(circle_at_82%_8%,rgba(16,185,129,0.11),transparent_34%)]",
		eyebrowText: "text-sky-300",
		eyebrowLine: "bg-sky-400/70",
	},
	contact: {
		wash: "h-[48rem] bg-[radial-gradient(circle_at_15%_0%,rgba(16,185,129,0.14),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(245,158,11,0.10),transparent_34%)]",
		eyebrowText: "text-emerald-300",
		eyebrowLine: "bg-emerald-400/70",
	},
	resume: {
		wash: "h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_42%),radial-gradient(circle_at_75%_15%,rgba(124,58,237,0.12),transparent_36%)]",
		eyebrowText: "text-amber-300",
		eyebrowLine: "bg-amber-400/70",
	},
} as const satisfies Record<PageAtmosphereVariant, PageAtmosphereStyle>;

export function PageAtmosphere({
	variant,
}: {
	variant: PageAtmosphereVariant;
}) {
	return (
		<div
			data-atmosphere={variant}
			className={`pointer-events-none absolute inset-x-0 top-0 ${pageAtmosphereStyles[variant].wash}`}
			aria-hidden="true"
		/>
	);
}
