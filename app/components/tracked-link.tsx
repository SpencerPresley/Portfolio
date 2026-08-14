"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type EventProperties = Record<string, string | number | boolean | null>;

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	event: string;
	eventProperties?: EventProperties;
	href: string;
};

/**
 * Anchor that reports a Vercel Web Analytics custom event on click. Rendered as
 * a plain `<a>` on the server so crawlers and the site contract still see the
 * real markup; the click handler only exists after hydration.
 *
 * `href` stays an explicit prop rather than riding along in the spread so the
 * anchor still reads as real navigation to both humans and the a11y lint.
 */
export function TrackedLink({
	event,
	eventProperties,
	href,
	onClick,
	...anchorProps
}: TrackedLinkProps) {
	return (
		// rome-ignore lint/a11y/useValidAnchor: real navigation, not a button; Rome only recognizes literal hrefs, so a variable href plus an onClick always trips this rule.
		<a
			{...anchorProps}
			href={href}
			onClick={(clickEvent: MouseEvent<HTMLAnchorElement>) => {
				track(event, eventProperties);
				onClick?.(clickEvent);
			}}
		/>
	);
}
