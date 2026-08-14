"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SELF_KEY = "portfolio-self-visit";

/**
 * Posts one beacon per page view to /api/hit so the server can record roughly
 * where the visit came from. Runs after paint and ignores its own response, so
 * it never sits on the render path.
 *
 * Visit any page with `?me=1` once to mark this browser as yours; every later
 * visit is then tagged `self` and skipped by the webhook. `?me=0` clears it.
 */
export function VisitBeacon() {
	const pathname = usePathname();
	// Client-side nav can re-run this effect for a path already reported (a nav
	// back, a re-render); one entry per path keeps the log to real page views.
	const reported = useRef(new Set<string>());

	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			return;
		}
		// usePathname is typed nullable; nothing useful to report without it.
		if (!pathname) {
			return;
		}
		if (reported.current.has(pathname)) {
			return;
		}
		reported.current.add(pathname);

		// Read the query string directly rather than via useSearchParams, which
		// would force every page under this component into a Suspense boundary.
		let self = false;
		try {
			const flag = new URLSearchParams(window.location.search).get("me");
			if (flag === "1") {
				window.localStorage.setItem(SELF_KEY, "1");
			} else if (flag === "0") {
				window.localStorage.removeItem(SELF_KEY);
			}
			self = window.localStorage.getItem(SELF_KEY) === "1";
		} catch {
			// Private browsing can throw on localStorage; treat it as not-self.
		}

		void fetch("/api/hit", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				path: pathname,
				referrer: document.referrer || "direct",
				self,
			}),
			// Survives the request if the visitor navigates away immediately.
			keepalive: true,
		}).catch(() => {
			// A dropped beacon is not worth surfacing to the visitor.
		});
	}, [pathname]);

	return null;
}
