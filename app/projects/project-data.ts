export type ProjectStatus = "active" | "shipped" | "archived" | "prototype";

export type ProjectAccent =
	| "sky"
	| "violet"
	| "amber"
	| "emerald"
	| "cyan"
	| "rose"
	| "fuchsia"
	| "blue";

export type ProjectLink = {
	label: string;
	href: string;
};

export type ProjectFact = {
	label: string;
	value: string;
};

export type ProjectSection = {
	title: string;
	paragraphs: readonly string[];
	bullets?: readonly string[];
};

export type ProjectDecision = {
	title: string;
	detail: string;
};

export type ProjectImage = {
	src: string;
	alt: string;
	fit?: "cover" | "contain";
};

export type ProjectVideo = {
	src: string;
	poster: string;
	label: string;
	fit?: "cover" | "contain";
};

export type Project = {
	slug: string;
	title: string;
	eyebrow: string;
	summary: string;
	lead: string;
	year: string;
	status: ProjectStatus;
	category: string;
	role: string;
	accent: ProjectAccent;
	featured: boolean;
	stack: readonly string[];
	links: readonly ProjectLink[];
	facts: readonly ProjectFact[];
	flow: readonly string[];
	image?: ProjectImage;
	video?: ProjectVideo;
	sections: readonly ProjectSection[];
	decisions: readonly ProjectDecision[];
	outcome: string;
};

export type OpenSourceContribution = {
	project: string;
	year: string;
	eyebrow: string;
	summary: string;
	credit: string;
	links: readonly ProjectLink[];
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
	active: "Active",
	shipped: "Shipped",
	archived: "Archived",
	prototype: "Prototype",
};

export const projects: readonly Project[] = [
	{
		slug: "gloss",
		title: "gloss",
		eyebrow: "Local retrieval engine",
		summary:
			"A hybrid search engine that returns a source document's actual passages—with citations—instead of generating a paraphrase.",
		lead: "gloss turns a source text into a portable SQLite corpus, then searches it through independent lexical and local-vector channels. The design keeps the source verbatim, makes every hit inspectable, and treats retrieval quality as something to measure rather than vibe-check.",
		year: "2026",
		status: "active",
		category: "Retrieval systems",
		role: "Independent project · design and implementation",
		accent: "violet",
		featured: true,
		stack: ["Python", "SQLite / FTS5", "Ollama", "PyMuPDF", "Embeddings"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/gloss",
			},
		],
		facts: [
			{ label: "Artifact", value: "One portable SQLite database" },
			{ label: "Retrieval", value: "BM25 + local vectors + RRF" },
			{ label: "Evaluation", value: "266 rank-sensitive cases" },
		],
		flow: [
			"Source text",
			"Deterministic units",
			"SQLite / FTS5",
			"Hybrid retrieval",
			"Cited passage",
		],
		sections: [
			{
				title: "The constraint",
				paragraphs: [
					"Most AI search products optimize for a fluent answer. That is the wrong output when the job is to recover what a source actually said. gloss is built around a stricter contract: return the original passage, preserve its location, and expose why it ranked.",
					"The first corpus is A Philosophy of Software Design, but the engine is deliberately corpus-agnostic. Book-specific taxonomy, evaluation cases, and enrichment prompts live outside the retrieval core.",
				],
			},
			{
				title: "Build once, retrieve locally",
				paragraphs: [
					"An offline build parses the PDF with font-aware structure, segments it deterministically, and asks an LLM only for retrieval metadata such as context lines, symptom-shaped questions, and key terms. The LLM never rewrites the source text.",
					"The build is checkpointed and resumable. Enrichment, lexical indexes, vectors, and the verbatim units all land in the same SQLite artifact, so the finished corpus is easy to move and inspect.",
				],
			},
			{
				title: "Two channels, visible evidence",
				paragraphs: [
					"At query time, FTS5/BM25 and max-similarity vector search rank independently. Reciprocal-rank fusion combines the lists without pretending their raw scores are comparable, and every result reports which channels supported it.",
					"Lexical mode has no runtime dependencies beyond Python's standard library. Hybrid mode uses a local Ollama embedding model and degrades cleanly back to lexical search when that service is unavailable.",
				],
			},
			{
				title: "Evaluation is part of the product",
				paragraphs: [
					"The repository carries a rank-sensitive evaluation set, hit-at-k and mean-reciprocal-rank scoring, and paired sign-flip tests for comparing retrieval changes. The expanded suite includes curated, developer-voice, and adversarially phrased slices so one flattering aggregate cannot hide a weak usage mode.",
				],
			},
		],
		decisions: [
			{
				title: "Keep source text immutable",
				detail:
					"LLMs enrich retrieval fields offline; they never author the passage returned to the user.",
			},
			{
				title: "Fuse ranks, not scores",
				detail:
					"Lexical and semantic channels remain independently legible, then combine through reciprocal-rank fusion.",
			},
			{
				title: "Ship the evaluation harness",
				detail:
					"Every ranking change can be compared on the same cases instead of being accepted from a demo query.",
			},
		],
		outcome:
			"A working open-source prototype that builds a cited corpus end to end, runs locally, and has a measurable path for deciding whether a retrieval change actually helped.",
	},
	{
		slug: "celery-fork-safety",
		title: "Celery Fork-Safety Investigation",
		eyebrow: "Systems debugging",
		summary:
			"A reproducible investigation of one pre-fork initialization bug that deadlocks on Linux and crashes on macOS.",
		lead: "A vector-store operation inside a Celery task appeared to hang for no reason. The real failure crossed Python, Rust, SQLite, Tokio, Celery's prefork pool, and two operating systems. I reduced it to a public reproduction and followed it down to the inherited synchronization state.",
		year: "2025",
		status: "shipped",
		category: "Concurrency",
		role: "Independent investigation · reproduction and analysis",
		accent: "amber",
		featured: true,
		stack: ["Python", "Celery", "ChromaDB", "GDB", "LLDB", "Docker"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/celeryforksafetyinvestigation",
			},
		],
		facts: [
			{ label: "Linux", value: "Permanent futex wait" },
			{ label: "macOS", value: "libdispatch SIGTRAP" },
			{ label: "Root cause", value: "Forked synchronization state" },
		],
		flow: [
			"Initialize Chroma",
			"Celery forks",
			"Locks are copied",
			"Owner threads vanish",
			"Hang or crash",
		],
		sections: [
			{
				title: "The misleading symptom",
				paragraphs: [
					"The task stopped while adding documents to ChromaDB. Treating that as an application-level timeout or a database bug would have hidden the mechanism: Chroma's Rust and SQLite internals had already created threads and synchronization primitives before Celery called fork.",
				],
			},
			{
				title: "What fork preserves—and what it does not",
				paragraphs: [
					"The child receives a copy of the parent's address space, including mutex and semaphore state, but only the thread that called fork survives. A lock can therefore remain marked as owned by a thread that no longer exists in the child.",
					"The first later operation touching that inherited state exposes the damage. The place where execution stops is not necessarily the place where the bug was introduced.",
				],
			},
			{
				title: "Same cause, platform-specific failure",
				paragraphs: [
					"Inside Linux containers, GDB traced the child to a futex wait that could never complete. On macOS, LLDB showed libdispatch detecting corrupted semaphore state and aborting with SIGTRAP.",
					"The repository includes both paths because a single-platform reproduction makes this class of failure look library-specific. Seeing both makes the process-model bug much harder to misdiagnose.",
				],
			},
			{
				title: "The fixes follow from the mechanism",
				paragraphs: [
					"Initialize fork-unsafe resources inside the worker after the fork, or choose a pool that does not fork. Restarting, adding retries, or increasing timeouts cannot release a lock whose owning thread ceased to exist.",
				],
			},
		],
		decisions: [
			{
				title: "Reduce before theorizing",
				detail:
					"The repository isolates the failure from the original application so each process transition can be observed.",
			},
			{
				title: "Debug both operating systems",
				detail:
					"GDB and LLDB evidence ties the different surface failures back to the same inherited-state mechanism.",
			},
			{
				title: "Publish executable evidence",
				detail:
					"Docker and native commands let another engineer reproduce the deadlock and crash instead of trusting a postmortem.",
			},
		],
		outcome:
			"A concrete explanation for a class of 'Celery hung' failures, plus reproductions and fixes that generalize to database clients, async runtimes, thread pools, and other stateful libraries initialized before fork.",
	},
	{
		slug: "ghostty-yazi-theming",
		title: "Ghostty × Yazi theme sync",
		eyebrow: "Terminal tooling · two delivery paths",
		summary:
			"A Lua plugin and Python CLI that derive Yazi's interface and syntax highlighting from Ghostty's active palette.",
		lead: "Yazi inherits a terminal's ANSI colors, but several of its most visible surfaces ignore or misuse them. I built two complementary tools around the same transformation: a runtime plugin for zero-maintenance syncing and a packaged CLI for static, inspectable flavor files.",
		year: "2026",
		status: "active",
		category: "Terminal tooling",
		role: "Independent project · design, implementation, and packaging",
		accent: "sky",
		featured: true,
		stack: ["Lua", "Python", "Ghostty", "Yazi", "launchd / systemd"],
		links: [
			{
				label: "Lua plugin",
				href: "https://github.com/SpencerPresley/ghostty-flavor.yazi",
			},
			{
				label: "Python CLI",
				href: "https://github.com/SpencerPresley/ghostty-yazi-flavor",
			},
			{
				label: "PyPI",
				href: "https://pypi.org/project/ghostty-yazi-flavor/",
			},
		],
		facts: [
			{ label: "Source", value: "Ghostty's resolved active palette" },
			{ label: "Delivery", value: "Runtime plugin or static flavor" },
			{ label: "Automation", value: "Yazi, launchd, or systemd" },
		],
		flow: [
			"Resolved Ghostty config",
			"Palette parser",
			"Yazi UI theme",
			"TextMate theme",
			"Matched previews",
		],
		video: {
			src: "/projects/ghostty-yazi-demo.mp4",
			poster: "/projects/ghostty-yazi-demo.jpg",
			label:
				"Ghostty and Yazi changing from a mismatched stock theme to a generated matching theme",
			fit: "contain",
		},
		sections: [
			{
				title: "The last mile of terminal theming",
				paragraphs: [
					"Yazi follows the terminal palette for much of its interface, then breaks the illusion in two places: reverse-video hover bars can become neon blocks, and syntect code previews use a separate theme that does not follow the terminal at all.",
					"Hand-authored flavors solve that for popular themes. These tools solve it for whatever Ghostty is actually running, including built-in themes, custom themes, and included configuration.",
				],
			},
			{
				title: "Let Ghostty resolve Ghostty",
				paragraphs: [
					"Both implementations call `ghostty +show-config` and parse the resolved colors rather than duplicating Ghostty's theme lookup and include rules. One stable input contract covers every theme source Ghostty already understands.",
					"The transformation changes only the Yazi surfaces that fail to follow the palette well. It leaves the rest of the preset alone and builds a TextMate theme from the same colors for code previews.",
				],
			},
			{
				title: "One engine, two operational choices",
				paragraphs: [
					"The Lua plugin applies colors directly to Yazi's live theme on every launch and refreshes a cached TextMate file before the first preview. It is the set-and-forget path.",
					"The Python CLI writes a complete `flavor.toml` and `tmtheme.xml` that can be read, diffed, and versioned. It also installs an event-driven launchd or systemd watcher, making it a better fit for declarative dotfiles and static configuration.",
				],
			},
			{
				title: "Verify the runtime boundary",
				paragraphs: [
					"The implementation does not assume every Yazi theme surface behaves the same way. Live theme-object mutations affect the current UI, while the asynchronous preview path requires a stable theme file. The split design follows that observed boundary and keeps the pure parsing and rendering modules testable without launching Yazi.",
				],
			},
		],
		decisions: [
			{
				title: "Consume resolved configuration",
				detail:
					"Ghostty remains responsible for themes and includes; the tools translate its final palette instead of reimplementing its configuration model.",
			},
			{
				title: "Offer two explicit tradeoffs",
				detail:
					"The plugin optimizes for automatic live behavior, while the CLI optimizes for static files and declarative machine setup.",
			},
			{
				title: "Share colors, respect different runtimes",
				detail:
					"Yazi's live interface and syntect preview engine receive the same palette through the mechanisms each one actually observes.",
			},
		],
		outcome:
			"Two public, tested distribution paths for the same theme engine: a native Yazi plugin installed with its package manager and a Python CLI published on PyPI.",
	},
	{
		slug: "claude-code-plugins",
		title: "Focused Claude Code plugins",
		eyebrow: "Agent tooling",
		summary:
			"A plugin marketplace built around one rule: inject exact context only when the current task and runtime event justify it.",
		lead: "The marketplace packages instruction discovery, conditional Codex context, adversarial review, and parser-aware docstring help as narrow plugins. The work is less about adding more prompting than controlling when each piece of context enters the model's working set.",
		year: "2026",
		status: "active",
		category: "Agent tooling",
		role: "Independent project · plugin design and contract testing",
		accent: "emerald",
		featured: true,
		stack: ["Claude Code", "Python", "Bash", "Hooks", "Agent skills"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/spencer-and-claude-sitting-in-a-tree",
			},
		],
		facts: [
			{ label: "Principle", value: "Context only when relevant" },
			{ label: "Scope", value: "One problem per plugin" },
			{ label: "Contracts", value: "Observed hook payloads" },
		],
		flow: [
			"Session event",
			"Narrow matcher",
			"Targeted context",
			"Model action",
			"Regression contract",
		],
		sections: [
			{
				title: "Context is a budget",
				paragraphs: [
					"Persistent instructions are easy to add and hard to reason about. Every unrelated token competes with the repository, user request, and evidence the model needs for the current task.",
					"Each plugin therefore owns one intervention and stays silent outside it: discover instructions only when a file path crosses the project boundary, explain Codex only when that plugin is enabled, and add LangChain-specific rules only when the target actually defines a tool.",
				],
			},
			{
				title: "Probe the hook system instead of guessing",
				paragraphs: [
					"The repository includes a capture harness for the real payloads Claude Code sends when a user invokes a slash command, a model invokes a skill, or a file is read. That exposed materially different event paths and namespaced plugin command names that a documentation-only implementation would have missed.",
					"Deterministic tests replay crafted payloads through the hooks so matching, deduplication, and graduated context behavior remain visible without spending a model call.",
				],
			},
			{
				title: "Keep review scope mechanically narrow",
				paragraphs: [
					"The adversarial-review plugin separates a small request builder from the review agent's actual operating contract. The builder captures the exact slice, collection guidance, and user concern; the reviewer owns the skeptical stance, evidence bar, and output shape.",
					"That boundary prevents a request helper from silently redefining review policy and makes it harder for a broad repository scan to leak unrelated findings into a scoped review.",
				],
			},
			{
				title: "Instruction discovery by content, not path",
				paragraphs: [
					"The discovery plugin can load CLAUDE.md and AGENTS.md files outside the project tree, then deduplicates identical instructions by content hash. Worktrees, clones, and copied templates stay quiet while genuinely different context remains available and changed files trigger a re-read nudge.",
				],
			},
		],
		decisions: [
			{
				title: "Make silence a feature",
				detail:
					"A plugin that is irrelevant to the current task contributes no standing context and no background behavior.",
			},
			{
				title: "Test observed events",
				detail:
					"Hook matchers and payload fields are based on captured runtime behavior, then protected by deterministic contract tests.",
			},
			{
				title: "Separate request from policy",
				detail:
					"Skills gather a precise target; agents retain ownership of the review or transformation contract applied to it.",
			},
		],
		outcome:
			"A public marketplace of focused Claude Code extensions whose main product constraint is predictable context: the right instruction, at the actual trigger, and nothing when it is irrelevant.",
	},
	{
		slug: "dotfiles",
		title: "dotfiles",
		eyebrow: "Reproducible workstation",
		summary:
			"A chezmoi-managed macOS environment that bootstraps itself, keeps secrets out of Git, and treats machine configuration as tested infrastructure.",
		lead: "dotfiles turns a fresh Mac into the workstation I actually use, then keeps it converged through chezmoi. The repository separates public configuration from credentials, owns package and LaunchAgent lifecycle, and includes a fully integrated Neovim environment with custom behavior tested like application code.",
		year: "2026",
		status: "active",
		category: "Developer environment",
		role: "Independent system · design, automation, and maintenance",
		accent: "cyan",
		featured: false,
		stack: [
			"chezmoi",
			"Shell",
			"Lua / Neovim",
			"Homebrew",
			"launchd",
			"1Password",
		],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/dotfiles",
			},
		],
		facts: [
			{ label: "Bootstrap", value: "Fresh Mac to managed workstation" },
			{ label: "Security", value: "1Password + staged secret scanning" },
			{ label: "Validation", value: "43 checks + seeded property fuzzing" },
		],
		flow: [
			"Fresh Mac",
			"Interactive bootstrap",
			"chezmoi + 1Password",
			"Packages + LaunchAgents",
			"Shell / terminal / editor",
		],
		sections: [
			{
				title: "Bootstrap once, converge afterward",
				paragraphs: [
					"The bootstrap takes a bare macOS installation through Xcode tools, Homebrew, 1Password, GitHub authentication, Oh My Zsh, package installation, and the first chezmoi apply. It pauses at the authentication boundaries that should remain interactive instead of pretending credentials can be automated safely.",
					"After that first run, the repository becomes the source of truth. An ordinary chezmoi apply renders configuration and reruns only the lifecycle automation whose declared inputs changed.",
				],
			},
			{
				title: "Keep the repository public without storing credentials",
				paragraphs: [
					"Templates contain 1Password references rather than resolved tokens, passwords, host addresses, or private keys. Chezmoi renders those values only on the destination machine, while the 1Password SSH agent supplies private keys without copying key material into the repository.",
					"A self-healing Git hook installs and wires gitleaks, then scans staged changes with redacted output. Chezmoi's private source attributes control destination permissions; they are not mistaken for secrecy in a public Git repository.",
				],
			},
			{
				title: "Manage machine lifecycle, not just dotfiles",
				paragraphs: [
					"Run-on-change scripts converge the parts of a workstation that cannot be represented by copying files. Homebrew metadata updates run every 12 hours through a command-scoped trust grant, while package and application upgrades remain a deliberate manual action.",
					"Other scripts render Ollama settings into a per-user LaunchAgent, remove conflicting Tailscale installations, synchronize Ghostty's resolved palette into Yazi, and pin global command-line tools from structured data. Each automation path owns both its desired state and the repair logic for stale machine state.",
				],
			},
			{
				title: "Test editor behavior like application code",
				paragraphs: [
					"The Neovim configuration now lives directly in chezmoi alongside its LSP, formatting, navigation, Yazi, and Claude Code integrations. A custom `:Tail` command follows external file changes inside a normal editable buffer using libuv file events with a polling recovery path.",
					"The implementation preserves a scrolled-up cursor, refuses to clobber unsaved edits, rearms after atomic rename or delete-and-recreate rotation, cleans up its handles, and disables itself above a size ceiling. A headless adversarial suite and recovery suite currently pass 43 checks; a seeded property fuzzer then mixes 900 file, buffer, cursor, and watcher operations while asserting invariants after every step.",
				],
			},
		],
		decisions: [
			{
				title: "Render secrets at the destination",
				detail:
					"Public templates carry references and intent; 1Password supplies credential values only while chezmoi applies them locally.",
			},
			{
				title: "Update metadata, not running software",
				detail:
					"Background Homebrew automation refreshes package metadata but never silently upgrades active services or open applications.",
			},
			{
				title: "Pair fast events with recovery",
				detail:
					"Neovim's live follower uses file events for low latency and polling for missed events, watcher rearming, and size enforcement.",
			},
		],
		outcome:
			"An actively used public workstation definition that can reconstruct a Mac, keeps credentials out of Git, and backs its most failure-prone custom editor behavior with deterministic tests and property fuzzing.",
	},
	{
		slug: "iphoto-sizer",
		title: "iPhotoSizer",
		eyebrow: "Local macOS utility",
		summary:
			"A packaged CLI and local web interface for finding the photos and videos consuming the most Apple Photos and iCloud storage.",
		lead: "Apple Photos exposes aggregate storage but makes it difficult to answer a simpler question: which originals are actually large? iPhotoSizer reads the local Photos library, preserves local-versus-cloud status, and turns the result into a sortable report without uploading the library anywhere.",
		year: "2026",
		status: "shipped",
		category: "macOS utility",
		role: "Independent project · application and package engineering",
		accent: "blue",
		featured: false,
		stack: ["Python", "osxphotos", "Pydantic", "Flask", "PyPI"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/iPhotoSizer",
			},
			{
				label: "PyPI",
				href: "https://pypi.org/project/iphoto-sizer/",
			},
		],
		facts: [
			{ label: "Library", value: "Local and iCloud-only originals" },
			{ label: "Surfaces", value: "CLI + local web UI" },
			{ label: "Exports", value: "CSV and JSON" },
		],
		flow: [
			"Photos library",
			"Typed media records",
			"Size and status",
			"CLI or local UI",
			"Portable report",
		],
		image: {
			src: "/projects/iphoto-sizer-results.png",
			alt: "iPhotoSizer local web interface showing storage totals and media sorted by file size",
			fit: "cover",
		},
		sections: [
			{
				title: "Answer the storage question directly",
				paragraphs: [
					"The tool reads Apple Photos metadata through osxphotos, normalizes it into typed media records, and sorts originals by bytes rather than by the smaller local proxy that may happen to be present.",
					"Cloud-only items stay in the report with an explicit iCloud status, so the result describes the whole library rather than only files currently downloaded to the Mac.",
				],
			},
			{
				title: "Local data, two useful surfaces",
				paragraphs: [
					"The default CLI writes a CSV or JSON report and prints a compact summary. An optional Flask extra opens the same scan in a local browser with search, media filters, storage totals, export controls, and an experimental path back into Photos.app.",
					"Both surfaces share the same typed model and scan logic. The web interface is not a separate cloud service and the photo library never leaves the machine.",
				],
			},
			{
				title: "Treat macOS permissions as product behavior",
				paragraphs: [
					"Photos access depends on Full Disk Access granted to the enclosing terminal application, not just the Python process. The error path walks the process tree to identify that host and gives a concrete System Settings instruction instead of surfacing a generic database failure.",
					"Individual records that cannot be parsed are reported and skipped, while disk-space checks happen before export so one bad item or a nearly full volume does not destroy the entire scan.",
				],
			},
		],
		decisions: [
			{
				title: "Keep the library on-device",
				detail:
					"The application reads the Photos database locally and serves the optional UI only on the user's machine.",
			},
			{
				title: "Use one domain model",
				detail:
					"CLI summaries, browser views, and exports consume the same validated media records instead of implementing separate scan paths.",
			},
			{
				title: "Degrade per record",
				detail:
					"An unreadable photo becomes a visible warning, not a reason to discard the rest of a long library scan.",
			},
		],
		outcome:
			"A tested macOS utility distributed through PyPI, with a scriptable export path for quick cleanup work and a local visual interface for exploring the same data.",
	},
	{
		slug: "academic_metrics",
		title: "Academic Metrics",
		eyebrow: "Open-source AI tooling",
		summary:
			"A Python package that collects publications and constrains LLM classification to the NSF NCSES research taxonomy.",
		lead: "Academic Metrics turns publication metadata and abstracts into structured research data. Its classification pipeline recursively walks a three-level taxonomy and treats off-taxonomy model output as a correctness failure to repair, not a string to quietly accept.",
		year: "2025",
		status: "shipped",
		category: "Applied AI",
		role: "Package co-author · pipeline and classification engineering",
		accent: "rose",
		featured: false,
		stack: ["Python", "LangChain", "tiktoken", "Crossref", "MongoDB", "Sphinx"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/AcademicMetrics",
			},
			{
				label: "Documentation",
				href: "https://academicmetrics.readthedocs.io/en/latest/",
			},
			{
				label: "PyPI",
				href: "https://pypi.org/project/academic-metrics/",
			},
		],
		facts: [
			{ label: "Taxonomy", value: "Three-level NSF hierarchy" },
			{ label: "Collection", value: "Crossref + DOI enrichment" },
			{ label: "Outputs", value: "MongoDB, JSON, and Excel" },
		],
		flow: [
			"Publication data",
			"Abstract analysis",
			"Taxonomy traversal",
			"Constrained retry",
			"Structured output",
		],
		sections: [
			{
				title: "From publications to comparable data",
				paragraphs: [
					"The package collects publication records through Crossref, enriches incomplete metadata, deduplicates articles, and coordinates classification and export through one pipeline. The goal is reusable structured data rather than a one-off dashboard.",
				],
			},
			{
				title: "Classification through a real taxonomy",
				paragraphs: [
					"The classifier does not ask for an unconstrained topic label. It traverses the NSF NCSES hierarchy one level at a time, carrying the selected parent into the next decision so every leaf has a valid path.",
					"Before classification, separate stages extract methods, analyze sentence structure, and summarize the abstract. Those outputs give the classifier a smaller and more explicit evidence surface.",
				],
			},
			{
				title: "Reject invalid labels at generation time",
				paragraphs: [
					"When the model returns a label outside the allowed children, the retry path tokenizes the rejected output and applies logit bias against those tokens. The system actively prevents the same invalid answer from recurring instead of dropping the record or normalizing it after the fact.",
				],
			},
			{
				title: "A package, not a hidden pipeline",
				paragraphs: [
					"Academic Metrics ships as an installable Python package with a CLI, storage adapters, export paths, and full Sphinx documentation. The web demo is a separate collaborator-owned consumer; the reusable package is the project presented here.",
				],
			},
		],
		decisions: [
			{
				title: "Traverse instead of classify flat",
				detail:
					"Each model decision sees only valid children of the current taxonomy node, reducing an open-ended labeling problem.",
			},
			{
				title: "Make retries corrective",
				detail:
					"Rejected labels change the next decoding attempt through token-level bias rather than merely repeating the prompt.",
			},
			{
				title: "Separate package from presentation",
				detail:
					"Collection, classification, and export remain reusable without coupling the system to one dashboard.",
			},
		],
		outcome:
			"A documented, installable pipeline for collecting and classifying research publications with an explicit validity mechanism around unreliable model output.",
	},
	{
		slug: "chain_composer",
		title: "ChainComposer",
		eyebrow: "Python library",
		summary:
			"A small orchestration layer for composing multi-stage LLM workflows with explicit variable flow and structured outputs.",
		lead: "ChainComposer grew out of the machinery behind Academic Metrics. It packages multi-layer prompts, state transfer, provider selection, parsing, and recovery behind a chain API that remains inspectable in ordinary Python.",
		year: "2025",
		status: "shipped",
		category: "Developer tooling",
		role: "Independent open-source project",
		accent: "emerald",
		featured: false,
		stack: [
			"Python",
			"Pydantic",
			"LangChain",
			"OpenAI",
			"Anthropic",
			"Google AI",
		],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/AIChainComposer",
			},
			{
				label: "PyPI",
				href: "https://pypi.org/project/ChainComposer/",
			},
		],
		facts: [
			{ label: "Composition", value: "Ordered, multi-layer chains" },
			{ label: "Outputs", value: "JSON, strings, and Pydantic" },
			{ label: "Execution", value: "Sync and async paths" },
		],
		flow: [
			"Input state",
			"Prompt layer",
			"Parsed output",
			"Variable pass",
			"Next layer",
		],
		image: {
			src: "/chainComposerHeader.png",
			alt: "ChainComposer wordmark over a connected-node background",
			fit: "cover",
		},
		sections: [
			{
				title: "The repeated problem",
				paragraphs: [
					"Multi-step LLM applications repeatedly need the same glue: prompt templates, output parsing, state transfer, retries, rate limits, logging, and provider setup. Academic Metrics had enough of that machinery to justify pulling it into a standalone library.",
				],
			},
			{
				title: "Explicit data flow",
				paragraphs: [
					"Each layer declares its prompts, parser, output model, and the key under which its result enters shared chain state. Later layers can consume that value without burying the workflow in callback code.",
				],
			},
			{
				title: "Structured output with a fallback path",
				paragraphs: [
					"Layers can parse JSON or validate against Pydantic models, while an optional fallback parser preserves useful output when a provider misses the preferred format. Errors remain visible through chain logging and inspection APIs.",
				],
			},
		],
		decisions: [
			{
				title: "Keep composition linear",
				detail:
					"The API makes layer ordering and variable handoff visible rather than hiding control flow in a graph runtime.",
			},
			{
				title: "Treat parsers as policy",
				detail:
					"Output format, validation, and fallback behavior are configured per layer instead of scattered through prompts.",
			},
			{
				title: "Keep providers replaceable",
				detail:
					"OpenAI, Anthropic, and Google-backed layers share the same composition model.",
			},
		],
		outcome:
			"A published package that separated reusable LLM workflow machinery from the research application that originally needed it.",
	},
	{
		slug: "saltcast",
		title: "SaltCast",
		eyebrow: "Research internship",
		summary:
			"A retrieval-augmented chatbot for an NSF-funded Chesapeake Bay salinity research platform.",
		lead: "At Horn Point Laboratory, I built the chatbot path that turns project material—research papers, salinity data, interviews, and team information—into grounded, streamed answers for SaltCast users.",
		year: "2024",
		status: "archived",
		category: "RAG system",
		role: "Chatbot engineer · Horn Point Laboratory",
		accent: "cyan",
		featured: false,
		stack: [
			"Python",
			"FastAPI",
			"LangChain",
			"FAISS",
			"OpenAI",
			"Server-Sent Events",
		],
		links: [
			{
				label: "Source",
				href: "https://github.com/Pham-Vincent/Equitable-Water-Solutions/tree/main/chatbot",
			},
		],
		facts: [
			{ label: "Retrieval", value: "FAISS vector search" },
			{ label: "Delivery", value: "Streaming responses over SSE" },
			{ label: "Research", value: "Presented at MIT URTC" },
		],
		flow: [
			"Project sources",
			"Embedding index",
			"Relevant context",
			"LLM response",
			"SSE stream",
		],
		image: {
			src: "/saltcastPortfolio.png",
			alt: "SaltCast website with its salinity research chatbot open",
			fit: "cover",
		},
		sections: [
			{
				title: "A public interface to a research project",
				paragraphs: [
					"SaltCast combines hydrologic and oceanographic work around Chesapeake Bay salinity. The chatbot needed to answer questions about both the science and the people behind it without forcing visitors to search across papers, datasets, and project pages.",
				],
			},
			{
				title: "Retrieval before generation",
				paragraphs: [
					"The service embeds the project corpus into FAISS and retrieves relevant material before asking the model to respond. Index options included HNSW and FlatL2 so retrieval behavior could be tuned for the corpus rather than left at a framework default.",
				],
			},
			{
				title: "A conversation, not a blocking request",
				paragraphs: [
					"The FastAPI service streams generated text over Server-Sent Events and maintains bounded conversational context. The browser receives useful output immediately while the longer model operation continues.",
				],
			},
		],
		decisions: [
			{
				title: "Ground answers in project material",
				detail:
					"The model receives retrieved research context instead of answering Chesapeake Bay questions from general training data.",
			},
			{
				title: "Tune the index deliberately",
				detail:
					"FAISS index choices are explicit, allowing latency and retrieval quality to be evaluated against the actual corpus.",
			},
			{
				title: "Stream the slow boundary",
				detail:
					"Server-Sent Events keep the interface responsive while generation is still in progress.",
			},
		],
		outcome:
			"A research assistant that shipped inside SaltCast and was presented as part of the work at the MIT Undergraduate Research Technology Conference. The original product surface is no longer maintained, so this page preserves the work as an archived case study.",
	},
	{
		slug: "testifai",
		title: "Testif.AI",
		eyebrow: "Award-winning hackathon build",
		summary:
			"An exam-generation pipeline that creates candidates from uploaded course material, then judges and assembles the final test.",
		lead: "Testif.AI helps teachers and students turn documents and web sources into configurable tests and answer keys. I built the AI backend, including document preparation, parallel candidate generation, and the judge stage that selects the final non-duplicate questions.",
		year: "2024",
		status: "archived",
		category: "AI application",
		role: "AI backend engineering · HackUMBC team",
		accent: "fuchsia",
		featured: false,
		stack: ["Python", "FastAPI", "LangChain", "OpenAI", "AsyncIO"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/SpencerPresley/TestifAI",
			},
		],
		facts: [
			{ label: "Award", value: "Best Educational Hack" },
			{ label: "Overall", value: "2nd place at HackUMBC" },
			{ label: "Pipeline", value: "Parallel generation + judge" },
		],
		flow: [
			"Files and URLs",
			"Normalized text",
			"Parallel candidates",
			"LLM judge",
			"Test + answer key",
		],
		image: {
			src: "/testifai.png",
			alt: "Testif.AI wordmark",
			fit: "contain",
		},
		sections: [
			{
				title: "The product constraint",
				paragraphs: [
					"A useful test generator cannot simply ask for ten questions and accept the first ten lines. Users choose question type, count, difficulty, grade level, and testing philosophy, while uploaded sources arrive as PDFs, presentations, documents, text, images, or URLs.",
				],
			},
			{
				title: "Generate candidates in parallel",
				paragraphs: [
					"The backend normalizes the source material, then generates a candidate exam from each document concurrently. This preserves source coverage and avoids one long prompt becoming the only point of failure.",
				],
			},
			{
				title: "Judge the set, not each question alone",
				paragraphs: [
					"A second model stage sees the candidate pool and selects the best non-duplicate questions at the exact requested count for each question type. The judge can optimize the test as a whole instead of scoring isolated outputs with no view of redundancy.",
				],
			},
		],
		decisions: [
			{
				title: "Normalize inputs first",
				detail:
					"Every supported file and web source enters the generation pipeline through a common textual representation.",
			},
			{
				title: "Parallelize by source",
				detail:
					"Independent candidates improve source coverage and keep ingestion latency bounded during the hackathon build.",
			},
			{
				title: "Use a selection stage",
				detail:
					"The final model call enforces requested counts and removes duplicate or weaker questions across candidates.",
			},
		],
		outcome:
			"The project won Best Educational Hack and placed second overall at HackUMBC 2024. The public repository remains available as an archived snapshot of the build.",
	},
	{
		slug: "termbook",
		title: "TermBook",
		eyebrow: "Award-winning hackathon build",
		summary:
			"A terminal-first journaling system that interrupts the developer workflow just enough to make reflection habitual.",
		lead: "TermBook pairs a terminal prompt with an authenticated web archive for daily journal entries. On the Bitcamp team, I built the web experience around the product: the landing surface, profile view, journal cards, visual system, and documentation.",
		year: "2024",
		status: "archived",
		category: "Developer experience",
		role: "Frontend and product engineering · Bitcamp team",
		accent: "blue",
		featured: false,
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"NextAuth",
			"Go",
			"SQLite",
		],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/blues-ts/termbook",
			},
		],
		facts: [
			{ label: "Award", value: "1st place / Best Hack" },
			{ label: "Event", value: "Bitcamp 2024" },
			{ label: "Surface", value: "Terminal client + web archive" },
		],
		flow: [
			"Open terminal",
			"Daily prompt",
			"Journal entry",
			"Cloud sync",
			"Web archive",
		],
		sections: [
			{
				title: "Design friction on purpose",
				paragraphs: [
					"The terminal client prompts for a daily entry before the user settles into work and enforces a meaningful minimum length. The intervention is intentionally harder to ignore than another reminder notification.",
				],
			},
			{
				title: "My part of the build",
				paragraphs: [
					"I built the landing and profile experiences, the journal-entry card system, the particle-backed presentation layer, responsive styling, and the documentation surface. That web work turned the CLI's raw entries into something a user could return to and browse.",
				],
			},
			{
				title: "One product across two runtimes",
				paragraphs: [
					"The broader team joined a cross-platform Go client and SQLite-backed service to a Next.js application with GitHub authentication. The web interface gave the terminal habit a durable history without trying to replace the terminal interaction.",
				],
			},
		],
		decisions: [
			{
				title: "Put the prompt in the workflow",
				detail:
					"The journal asks for attention when the terminal opens, rather than relying on a separate habit tracker.",
			},
			{
				title: "Make the archive calmer",
				detail:
					"The web experience focuses on reading prior entries instead of recreating the interruption of the CLI.",
			},
			{
				title: "Split interaction from storage",
				detail:
					"A cross-platform terminal client handles capture while the authenticated site handles browsing and continuity.",
			},
		],
		outcome:
			"TermBook won first place / Best Hack at Bitcamp 2024. The original live domain is no longer active, so the portfolio links to the surviving source rather than pretending the deployment still exists.",
	},
];

export const openSourceContributions: readonly OpenSourceContribution[] = [
	{
		project: "mnemex",
		year: "2026",
		eyebrow: "Local embedding credentials",
		summary:
			"Diagnosed an unconditional OpenRouter key gate that prevented Ollama, LM Studio, and other local embedding providers from running without a dummy cloud credential, then proposed provider-aware validation.",
		credit:
			"The maintainer rebased the fix onto current main and retained Spencer and Claude as co-authors.",
		links: [
			{
				label: "PR #3",
				href: "https://github.com/MadAppGang/mnemex/pull/3",
			},
			{
				label: "Upstream commit",
				href: "https://github.com/MadAppGang/mnemex/commit/76df5df8c1900a8deb30f89ccc5920ad4bbf946f",
			},
		],
	},
];

export function getProject(slug: string) {
	return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
	const index = projects.findIndex((project) => project.slug === slug);

	if (index === -1) {
		return projects[0];
	}

	return projects[(index + 1) % projects.length];
}
