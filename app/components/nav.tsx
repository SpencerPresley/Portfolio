"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const pathname = usePathname();
	const isResume = pathname?.startsWith("/resume") ?? false;
	const isProjects = pathname?.startsWith("/projects") ?? false;

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
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-zinc-950/80 border-zinc-800"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between px-6 py-5 mx-auto">
					<nav
						aria-label="Primary"
						className="flex justify-between gap-5 sm:gap-8"
					>
						<Link
							href="/projects"
							aria-current={isProjects ? "page" : undefined}
							className={`duration-200 hover:text-zinc-100 ${
								isProjects ? "text-zinc-100" : "text-zinc-400"
							}`}
						>
							Projects
						</Link>
						<Link
							href="/contact"
							aria-current={pathname === "/contact" ? "page" : undefined}
							className={`duration-200 hover:text-zinc-100 ${
								pathname === "/contact" ? "text-zinc-100" : "text-zinc-400"
							}`}
						>
							Contact
						</Link>
						<Link
							href="/resume"
							aria-current={isResume ? "page" : undefined}
							className={`duration-200 hover:text-zinc-100 ${
								isResume ? "text-zinc-100" : "text-zinc-400"
							}`}
						>
							Resume
						</Link>
					</nav>

					<Link
						href="/"
						aria-label="Home"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
		</header>
	);
};
