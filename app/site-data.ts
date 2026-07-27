export type SiteProfile = {
	label: string;
	handle: string;
	href: string;
};

export const siteContact = {
	email: "spencerpresley96@gmail.com",
	github: {
		label: "GitHub",
		handle: "SpencerPresley",
		href: "https://github.com/SpencerPresley",
	},
	linkedin: {
		label: "LinkedIn",
		handle: "Spencer Presley",
		href: "https://www.linkedin.com/in/spencerpresley96",
	},
} as const satisfies {
	email: string;
	github: SiteProfile;
	linkedin: SiteProfile;
};
