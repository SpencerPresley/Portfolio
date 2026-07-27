"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Navigation() {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const pathname = usePathname();
	const isHome = pathname === "/";
	const isProjects = pathname?.startsWith("/projects") ?? false;
	const isContact = pathname === "/contact";
	const isResume = pathname?.startsWith("/resume") ?? false;
	const navItems = [
		{ href: "/projects", label: "Projects", isCurrent: isProjects },
		{ href: "/contact", label: "Contact", isCurrent: isContact },
		{ href: "/resume", label: "Resume", isCurrent: isResume },
	] as const;

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur duration-200 ${
					isIntersecting
						? "border-transparent bg-zinc-900/0"
						: "border-zinc-800 bg-zinc-950/80"
				}`}
			>
				<div className="container mx-auto flex items-center justify-between px-6 py-5">
					<Link
						href="/"
						aria-current={isHome ? "page" : undefined}
						className="rounded-sm font-display text-lg text-zinc-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
					>
						Spencer Presley
					</Link>

					<nav
						aria-label="Primary"
						className="flex justify-between gap-5 sm:gap-8"
					>
						{navItems.map(({ href, label, isCurrent }) => (
							<Link
								key={href}
								href={href}
								aria-current={isCurrent ? "page" : undefined}
								className={`relative rounded-sm pb-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 ${
									isCurrent
										? "text-zinc-100"
										: "text-zinc-400 hover:text-zinc-100"
								}`}
							>
								{label}
								{isCurrent ? (
									<span
										data-active-indicator="true"
										className="absolute -bottom-1 left-1/2 h-px w-5 -translate-x-1/2 bg-zinc-100"
										aria-hidden="true"
									/>
								) : null}
							</Link>
						))}
					</nav>
				</div>
			</div>
		</header>
	);
}
