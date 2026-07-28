import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import type { Metadata } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics as BeamAnalytics } from "./components/beam_analytics";

const siteDescription =
	"Spencer Presley is a software engineer building reliable AI, backend, and platform systems.";
const socialImage = "https://spencerpresley.com/spencer-presley-og.png";
const socialImageAlt = "Spencer Presley — AI and backend systems";
const socialImageWidth = 1200;
const socialImageHeight = 630;

export const metadata: Metadata = {
	metadataBase: new URL("https://spencerpresley.com"),
	title: {
		default: "spencerpresley.com",
		template: "%s | spencerpresley.com",
	},
	description: siteDescription,
	openGraph: {
		title: "spencerpresley.com",
		description: siteDescription,
		url: "https://spencerpresley.com",
		siteName: "spencerpresley.com",
		images: [
			{
				url: socialImage,
				width: socialImageWidth,
				height: socialImageHeight,
				alt: socialImageAlt,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Spencer Presley",
		description: siteDescription,
		card: "summary_large_image",
		images: [
			{
				url: socialImage,
				width: socialImageWidth,
				height: socialImageHeight,
				alt: socialImageAlt,
			},
		],
	},
	icons: {
		icon: "/spencer-presley-icon.png",
		shortcut: "/spencer-presley-icon.png",
		apple: "/spencer-presley-icon.png",
	},
};
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
			<head>
				<BeamAnalytics />
			</head>
			<body
				className={`bg-black ${
					process.env.NODE_ENV === "development" ? "debug-screens" : undefined
				}`}
			>
				{children}
				<VercelAnalytics />
			</body>
		</html>
	);
}
