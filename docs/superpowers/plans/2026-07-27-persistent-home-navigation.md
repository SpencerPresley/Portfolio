# Persistent Home Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the route-dependent back-arrow control with a persistent `Spencer Presley` Home link and add a visible active indicator to the current right-side destination.

**Architecture:** Keep `app/components/nav.tsx` as the only implementation surface. Continue using `usePathname()` for route-family state and the existing intersection observer for the fixed-header background; change only the DOM order, Home affordance, focus treatment, and active indicator.

**Tech Stack:** Next.js 15 App Router, React 18 client component, TypeScript 5, Tailwind CSS 3, Lucide removal, pnpm, Rome 12.

## Global Constraints

- Implement the approved design in `docs/superpowers/specs/2026-07-27-navigation-home-link-design.md`.
- Keep visible order and DOM order: `Spencer Presley`, Projects, Contact, Resume.
- Use the wordmark as the only Home affordance; do not add a right-side `Home` item.
- Mark the wordmark current only on `/`.
- Mark Projects current for `/projects` and `/projects/*`.
- Mark Contact current only for `/contact`.
- Mark Resume current for `/resume` and `/resume/*`.
- Add a non-color one-pixel indicator only beneath the current right-side item.
- Remove `ArrowLeft`, the icon-only Home control, and `flex-row-reverse`.
- Preserve the existing intersection-observer behavior and fixed-header background transition.
- Add visible `focus-visible` treatment to all four links.
- Add no dependency and modify no other production file.
- Verify at 1440×900 and 390×844.

---

### Task 1: Implement and verify the persistent navigation

**Files:**
- Modify: `app/components/nav.tsx`

**Interfaces:**
- Consumes: `usePathname(): string | null`
- Produces: `Navigation(): JSX.Element`
- Preserves: the existing `IntersectionObserver`-driven transparent/scrolled header state

- [ ] **Step 1: Run the navigation source contract and verify it fails**

Run:

```bash
node - <<'NODE'
const fs = require("node:fs");
const path = "app/components/nav.tsx";
const source = fs.readFileSync(path, "utf8");
const failures = [];

for (const forbidden of ["ArrowLeft", "flex-row-reverse", 'aria-label="Home"']) {
	if (source.includes(forbidden)) failures.push(`${path}: still contains ${forbidden}`);
}

for (const required of [
	'href="/"',
	"Spencer Presley",
	'aria-current={isHome ? "page" : undefined}',
	"focus-visible:ring-2",
	"h-px",
	"Projects",
	"Contact",
	"Resume",
]) {
	if (!source.includes(required)) failures.push(`${path}: missing ${required}`);
}

const labels = ["Spencer Presley", "Projects", "Contact", "Resume"];
const positions = labels.map((label) => source.indexOf(label));
if (positions.some((position) => position < 0)) {
	failures.push(`${path}: one or more visible labels are absent`);
} else if (!positions.every((position, index) => index === 0 || positions[index - 1] < position)) {
	failures.push(`${path}: visible labels are not in DOM order`);
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log("Persistent navigation source contract passes.");
NODE
```

Expected: FAIL because the current component imports `ArrowLeft`, uses
`flex-row-reverse`, replaces the wordmark on inner routes, and lacks the active
bar and focus-visible treatment.

- [ ] **Step 2: Replace the navigation component**

Replace `app/components/nav.tsx` with:

```tsx
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
```

Do not move the observer or header background behavior into a new component.

- [ ] **Step 3: Run the source contract and static verification**

Rerun the Step 1 source contract, then run:

```bash
pnpm exec rome check app/components/nav.tsx
pnpm typecheck
pnpm build
git diff --check
```

Expected:

- The source contract prints `Persistent navigation source contract passes.`
- Rome, TypeScript, and the production build pass.
- The build retains the existing Home, Projects, Contact, Resume, and project
  detail routes.

- [ ] **Step 4: Verify route state and mobile fit in the production build**

Start the built application:

```bash
pnpm start
```

At both 1440×900 and 390×844, inspect `/`, `/projects/gloss`, `/contact`, and
`/resume/backend-platform`. On each route evaluate:

```js
() => {
	const headerLinks = [...document.querySelectorAll("header a")];
	return {
		labels: headerLinks.map((link) => link.textContent?.trim()),
		hrefs: headerLinks.map((link) => link.getAttribute("href")),
		current: headerLinks
			.filter((link) => link.getAttribute("aria-current") === "page")
			.map((link) => link.textContent?.trim()),
		activeBars: headerLinks.filter((link) =>
			link.querySelector('[aria-hidden="true"]'),
		).length,
		overflow:
			document.documentElement.scrollWidth -
			document.documentElement.clientWidth,
	};
}
```

Expected:

- Labels are always `Spencer Presley`, Projects, Contact, Resume.
- Hrefs are always `/`, `/projects`, `/contact`, `/resume`.
- Home marks only `Spencer Presley` current and has no right-side active bar.
- `/projects/gloss` marks only Projects current and has one active bar.
- `/contact` marks only Contact current and has one active bar.
- `/resume/backend-platform` marks only Resume current and has one active bar.
- Overflow is `0` at both viewports.
- Tabbing follows visible left-to-right order and every link has a visible focus
  ring.

- [ ] **Step 5: Commit the independently verified navigation change**

Immediately before committing, run:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff -- app/components/nav.tsx
git diff --check
```

Then commit only the navigation file:

```bash
git add app/components/nav.tsx
git diff --cached --check
git commit -m "feat: make the home wordmark persistent"
```

- [ ] **Step 6: Push and verify the exact deployed commit**

Run:

```bash
git push origin main
portfolio_navigation_sha="$(git rev-parse HEAD)"
vercel ls --prod -m "githubCommitSha=${portfolio_navigation_sha}"
```

Copy the exact deployment URL returned for
`githubCommitSha=${portfolio_navigation_sha}`, assign it to a task-specific
variable, and inspect it:

```bash
printf "Deployment URL returned by vercel ls: "
IFS= read -r portfolio_navigation_deployment
vercel inspect "$portfolio_navigation_deployment" --logs
vercel logs --environment production --level error --since 5m
vercel httpstat /
```

The deployment URL is a runtime value from `vercel ls`, not a hard-coded
project hostname. Wait until `vercel inspect` reports `Ready`, verify that its
Git commit matches `portfolio_navigation_sha`, then re-run the Step 4
route-state checks on `https://spencerpresley.com` at both viewports and confirm
there are no browser-console errors.
