import { after } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Visit beacon. The browser cannot see its own geo, so the client posts the
 * page context here and the edge fills in location from the headers Vercel
 * injects on every request.
 *
 * Deliberately records city/region/country and never the IP: the geo answers
 * "roughly where is this person" without storing a personal identifier.
 */

// Reading request headers already opts this route out of static rendering, but
// state it so a future refactor can't silently prerender the beacon away.
export const dynamic = "force-dynamic";

type VisitPayload = {
	path?: unknown;
	referrer?: unknown;
	self?: unknown;
};

type Visit = {
	city: string;
	region: string;
	country: string;
	timezone: string;
	path: string;
	referrer: string;
	ua: string;
	self: boolean;
};

/** City arrives RFC3986-encoded so non-ASCII names survive the header. */
function readHeader(request: NextRequest, name: string): string {
	const raw = request.headers.get(name);
	if (!raw) {
		return "unknown";
	}
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

function asString(value: unknown, fallback: string): string {
	return typeof value === "string" && value.length > 0 ? value : fallback;
}

/** The full referrer URL is noise in a chat message; the host is the signal. */
function referrerHost(referrer: string): string {
	if (referrer === "direct") {
		return "direct";
	}
	try {
		return new URL(referrer).hostname.replace(/^www\./, "");
	} catch {
		return referrer;
	}
}

function formatVisit(visit: Visit): string {
	const place = [visit.city, visit.region, visit.country]
		.filter((part) => part !== "unknown")
		.join(", ");
	const host = referrerHost(visit.referrer);
	const from = host === "direct" ? "direct" : `via ${host}`;
	return `${visit.self ? "[self] " : ""}${place || "unknown"} · ${
		visit.path
	} · ${from}`;
}

/**
 * Discord reads `content`, Slack reads `text`. Discord rejects a payload whose
 * fields it does not recognize, so pick one rather than sending both.
 */
function webhookBody(webhook: string, message: string): string {
	if (webhook.includes("discord.com") || webhook.includes("discordapp.com")) {
		return JSON.stringify({ content: message });
	}
	if (webhook.includes("slack.com")) {
		return JSON.stringify({ text: message });
	}
	return JSON.stringify({ content: message, text: message });
}

async function notify(visit: Visit) {
	const webhook = process.env.HIT_WEBHOOK_URL;
	if (!webhook || visit.self) {
		return;
	}

	try {
		const response = await fetch(webhook, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: webhookBody(webhook, formatVisit(visit)),
		});
		if (!response.ok) {
			// Surfaces a bad or revoked webhook URL in the runtime logs instead of
			// failing silently and looking like "nobody visited".
			console.error(
				`[visit] webhook rejected: ${response.status} ${await response.text()}`,
			);
		}
	} catch (error) {
		console.error("[visit] webhook failed", error);
	}
}

export async function POST(request: NextRequest) {
	let payload: VisitPayload = {};
	try {
		payload = (await request.json()) as VisitPayload;
	} catch {
		// An unparseable body still tells us someone loaded a page; keep the
		// visit and fall back to the defaults below.
	}

	const visit: Visit = {
		city: readHeader(request, "x-vercel-ip-city"),
		region: readHeader(request, "x-vercel-ip-country-region"),
		country: readHeader(request, "x-vercel-ip-country"),
		timezone: readHeader(request, "x-vercel-ip-timezone"),
		path: asString(payload.path, "unknown"),
		referrer: asString(payload.referrer, "direct"),
		ua: request.headers.get("user-agent") ?? "unknown",
		self: payload.self === true,
	};

	console.log(`[visit] ${formatVisit(visit)}`, visit);
	after(() => notify(visit));

	// 204 keeps the response empty; the client ignores it either way.
	return new Response(null, { status: 204 });
}
