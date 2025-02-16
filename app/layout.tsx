import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { Analytics as BeamAnalytics } from "./components/beam_analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://spencerpresley.com"),
  title: {
    default: "spencerpresley.com",
    template: "%s | spencerpresley.com",
  },
  description: "Portfolio for Spencer Presley; author of Academic Metrics and ChainComposer",
  openGraph: {
    title: "spencerpresley.com",
    description: "Portfolio for Spencer Presley; author of Academic Metrics and ChainComposer",
    url: "https://spencerpresley.com",
    siteName: "spencerpresley.com",
    images: [
      {
        url: "https://spencerpresley.com/og.png",
        width: 1920,
        height: 1080,
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
    card: "summary_large_image",
  },
  // icons: {
  //   shortcut: "/favicon.png",
  // },
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
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
