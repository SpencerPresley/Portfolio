# ChainComposer LCEL Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove ChainComposer's authoring-time value with a typed raw-LCEL comparison, connect it reciprocally to Academic Metrics, and remove unsupported project claims.

**Architecture:** Extend the existing TypeScript `Project` record with two optional server-safe content shapes, then render both through the generic `/projects/[slug]` server component. Keep the comparison dependency-free with semantic `pre` and `code` elements, and verify the rendered production output through the existing HTTP site-contract runner.

**Tech Stack:** Next.js 15 App Router, React 18 server components, TypeScript 5, Tailwind CSS 3, Node.js runtime contracts, pnpm, Rome 12.

## Global Constraints

- Implement `docs/superpowers/specs/2026-07-27-chaincomposer-lcel-comparison-design.md`.
- Keep all content hard-coded and type-checked in `app/projects/project-data.ts`.
- Add no MDX, CMS, database, Redis, runtime fetch, syntax highlighter, or dependency.
- Describe ChainComposer as an opinionated layer over LangChain 0.3-era LCEL, not a replacement execution engine.
- State the authoring improvement in first-person: hours to roughly five minutes.
- Identify Academic Metrics as the earlier embedded implementation and production proving ground.
- Link ChainComposer and Academic Metrics reciprocally through internal project routes.
- Do not claim that LangChain v1 removed LCEL.
- Remove unsupported async and explicit rate-limit claims.
- Preserve the existing navigation contract.
- Verify at 1440×900 and 390×844.

---

### Task 1: Add the LCEL comparison and reciprocal project relationships

**Files:**
- Modify: `scripts/site-contract.mjs`
- Modify: `app/projects/project-data.ts`
- Modify: `app/projects/[slug]/page.tsx`
- Verify: `docs/superpowers/specs/2026-07-27-chaincomposer-lcel-comparison-design.md`

**Interfaces:**
- Produces: `ProjectCodeSample`
- Produces: `ProjectCodeComparison`
- Produces: `ProjectRelationship`
- Extends: `Project.codeComparison?: ProjectCodeComparison`
- Extends: `Project.relatedProjects?: readonly ProjectRelationship[]`
- Produces: rendered `data-code-comparison="true"` section
- Produces: internal `/projects/academic_metrics` and `/projects/chain_composer` relationship links

- [ ] **Step 1: Add the failing production-server contract**

Add this suite to `scripts/site-contract.mjs` before changing either production
file:

```js
async function chainComposerSuite() {
	const chainComposerHtml = await renderedPage("/projects/chain_composer");
	const chainComposerText = visibleText(chainComposerHtml);
	const academicMetricsHtml = await renderedPage("/projects/academic_metrics");
	const academicMetricsText = visibleText(academicMetricsHtml);

	assert.ok(
		chainComposerHtml.includes('data-code-comparison="true"'),
		"ChainComposer must render the LCEL code-comparison surface",
	);
	for (const expected of [
		"Raw LCEL",
		"ChainComposer",
		"RunnablePassthrough.assign",
		"with_fallbacks",
		"add_chain_layer",
		"Hours",
		"~5 minutes",
	]) {
		assert.ok(
			chainComposerText.includes(expected),
			`ChainComposer must explain ${expected}`,
		);
	}
	assert.ok(
		chainComposerHtml.includes('href="/projects/academic_metrics"'),
		"ChainComposer must link to its Academic Metrics proving ground",
	);
	assert.ok(
		academicMetricsHtml.includes('href="/projects/chain_composer"'),
		"Academic Metrics must link to the extracted ChainComposer package",
	);
	assert.match(
		academicMetricsText,
		/earlier embedded (version|implementation) of ChainComposer/i,
		"Academic Metrics must identify its embedded ChainComposer lineage",
	);

	for (const unsupportedClaim of [
		"sync and async paths",
		"rate limits",
		"rate limiting",
	]) {
		assert.ok(
			!chainComposerText.toLowerCase().includes(unsupportedClaim),
			`ChainComposer must not claim unsupported ${unsupportedClaim}`,
		);
	}
}
```

Register it beside the navigation suite:

```js
const suites = {
	"chain-composer": chainComposerSuite,
	navigation: navigationSuite,
};
```

- [ ] **Step 2: Run the contract and verify the expected failure**

Run against the unchanged production build on port 3100:

```bash
pnpm exec rome check scripts/site-contract.mjs
pnpm test:site chain-composer
```

Expected: Rome passes, then the site contract fails with
`ChainComposer must render the LCEL code-comparison surface`.

- [ ] **Step 3: Add the optional typed content shapes**

Add these exported types above `Project` in `app/projects/project-data.ts`:

```ts
export type ProjectCodeSample = {
	label: string;
	title: string;
	detail: string;
	code: string;
};

export type ProjectCodeComparison = {
	eyebrow: string;
	title: string;
	description: string;
	samples: readonly [ProjectCodeSample, ProjectCodeSample];
};

export type ProjectRelationship = {
	slug: string;
	eyebrow: string;
	detail: string;
};
```

Extend `Project` with:

```ts
	codeComparison?: ProjectCodeComparison;
	relatedProjects?: readonly ProjectRelationship[];
```

The two-element tuple prevents an incomplete one-sided comparison while keeping
the renderer generic.

- [ ] **Step 4: Correct the Academic Metrics and ChainComposer records**

Add this relationship to Academic Metrics:

```ts
relatedProjects: [
	{
		slug: "chain_composer",
		eyebrow: "Extracted developer tool",
		detail:
			"The embedded workflow layer that powered this classifier was later reorganized and published as ChainComposer.",
	},
],
```

Add this paragraph to Academic Metrics' `A package, not a hidden pipeline`
section:

```ts
"The LLM stages run through an earlier embedded version of ChainComposer. Academic Metrics was its production proving ground: the classifier declares method extraction, sentence analysis, summarization, recursive classification, and theme recognition across three managers, then carries named outputs into later prompts. That implementation was later extracted and published as its own package.",
```

Set the ChainComposer summary and lead to:

```ts
summary:
	"An opinionated layer over LangChain LCEL that reduced multi-stage LLM workflow setup from hours to minutes.",
lead:
	"ChainComposer came out of Academic Metrics, where five LLM stages needed structured parsers, fallback paths, and named outputs carried into later prompts. LCEL could express that machinery, but every new workflow meant rebuilding the same construction pattern. ChainComposer kept LCEL underneath and reduced each stage to one declarative call.",
```

Replace its facts with:

```ts
facts: [
	{ label: "Era", value: "LangChain 0.3 / LCEL" },
	{ label: "Authoring", value: "Hours → ~5 minutes" },
	{ label: "Runtime", value: "LCEL Runnable pipelines" },
],
```

Add this relationship:

```ts
relatedProjects: [
	{
		slug: "academic_metrics",
		eyebrow: "Production proving ground",
		detail:
			"Academic Metrics contains the earlier embedded implementation and the five-stage classifier that motivated the standalone package.",
	},
],
```

Use this exact comparison record:

```ts
codeComparison: {
	eyebrow: "Before / after",
	title: "The abstraction was the product.",
	description:
		"LCEL could express every step. The recurring cost was constructing and debugging the same prompt, parser, fallback, and state machinery before building the actual workflow. ChainComposer paid that cost once; scaling the pattern across Academic Metrics' five LLM stages became layer declarations.",
	samples: [
		{
			label: "Raw LCEL",
			title: "Build the machinery first",
			detail:
				"This is the compact version for one intermediate stage. Reusing it cleanly means extracting another helper—which is already the beginning of an orchestration library.",
			code: [
				"prompt = ChatPromptTemplate.from_messages([",
				'    ("system", METHOD_EXTRACTION_SYSTEM_MESSAGE),',
				'    ("human", HUMAN_MESSAGE_PROMPT),',
				"])",
				"",
				"primary = (",
				"    prompt",
				"    | llm",
				"    | JsonOutputParser(",
				"        pydantic_object=MethodExtractionOutput,",
				"    )",
				")",
				"fallback = prompt | llm | StrOutputParser()",
				"",
				"method_layer = primary.with_fallbacks(",
				"    [fallback],",
				"    exceptions_to_handle=PARSE_ERRORS,",
				")",
				"pipeline = RunnablePassthrough.assign(",
				"    method_json_output=method_layer,",
				")",
				"state = pipeline.invoke(inputs)",
			].join("\n"),
		},
		{
			label: "ChainComposer",
			title: "Declare the workflow",
			detail:
				"Prompt construction, parser policy, the fallback path, and the named state handoff become one layer contract. Additional stages use the same call.",
			code: [
				"composer = ChainComposer(",
				'    model="gpt-4o-mini",',
				"    api_key=api_key,",
				")",
				"",
				"composer.add_chain_layer(",
				"    system_prompt=METHOD_EXTRACTION_SYSTEM_MESSAGE,",
				"    human_prompt=HUMAN_MESSAGE_PROMPT,",
				'    parser_type="json",',
				'    fallback_parser_type="str",',
				"    pydantic_output_model=MethodExtractionOutput,",
				'    output_passthrough_key_name="method_json_output",',
				")",
				"",
				"state = composer.run(inputs)",
			].join("\n"),
		},
	],
},
```

Replace the first ChainComposer narrative section with:

```ts
{
	title: "Why it existed",
	paragraphs: [
		"Academic Metrics was not a toy example bolted on after the fact. Its classifier was the original proving ground: method extraction, sentence analysis, summarization, recursive taxonomy classification, and theme recognition run across three managers with outputs carried forward by name.",
		"LangChain 0.3's LCEL supplied expressive prompt, model, parser, and Runnable primitives. It did not supply this opinionated application pattern. Once I extracted that repeated construction into ChainComposer, assembling a new multi-stage workflow went from hours of wiring and debugging to roughly five minutes of declaring layers.",
	],
},
```

Replace the ChainComposer decisions with:

```ts
decisions: [
	{
		title: "Wrap LCEL, do not replace it",
		detail:
			"Every layer still compiles to ordinary Runnable pipelines; the library removes repeated construction without inventing another execution engine.",
	},
	{
		title: "Name every handoff",
		detail:
			"Each output enters shared state under an explicit key, so the next prompt's inputs remain visible and inspectable.",
	},
	{
		title: "Treat parsers as policy",
		detail:
			"Output format, validation, and fallback behavior are configured per layer instead of being scattered through control flow.",
	},
],
```

Set the outcome to:

```ts
"A PyPI package extracted from a working classifier that reduced my repeat pipeline setup from hours to roughly five minutes while leaving LCEL visible underneath.",
```

- [ ] **Step 5: Render the optional comparison**

In `app/projects/[slug]/page.tsx`, immediately after the prose-and-stack grid
and before engineering decisions, render `project.codeComparison` as:

```tsx
{project.codeComparison ? (
	<section
		data-code-comparison="true"
		className="border-t border-zinc-800 py-20"
		aria-labelledby={`${project.slug}-code-comparison`}
	>
		<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-end">
			<div className="max-w-3xl">
				<p
					className={`font-mono text-xs uppercase tracking-[0.2em] ${accent.text}`}
				>
					{project.codeComparison.eyebrow}
				</p>
				<h2
					id={`${project.slug}-code-comparison`}
					className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl"
				>
					{project.codeComparison.title}
				</h2>
			</div>
			<p className="text-sm leading-7 text-zinc-500">
				{project.codeComparison.description}
			</p>
		</div>

		<div className="mt-10 grid gap-5 lg:grid-cols-2">
			{project.codeComparison.samples.map((sample, index) => (
				<article
					key={sample.label}
					className={`min-w-0 overflow-hidden rounded-2xl border ${
						index === 0 ? "border-zinc-800" : accent.border
					} bg-zinc-900/45`}
				>
					<div className="p-6 sm:p-7">
						<p
							className={`font-mono text-[0.65rem] uppercase tracking-[0.18em] ${
								index === 0 ? "text-zinc-500" : accent.text
							}`}
						>
							{sample.label}
						</p>
						<h3 className="mt-4 text-lg font-semibold text-zinc-100">
							{sample.title}
						</h3>
						<p className="mt-3 text-sm leading-7 text-zinc-500">
							{sample.detail}
						</p>
					</div>
					<pre className="max-w-full overflow-x-auto border-t border-zinc-800 bg-zinc-950/80 p-5 font-mono text-[0.72rem] leading-6 text-zinc-300 sm:p-7 sm:text-xs">
						<code>{sample.code}</code>
					</pre>
				</article>
			))}
		</div>
	</section>
) : null}
```

- [ ] **Step 6: Render reciprocal related-project cards**

After the optional comparison and before engineering decisions, add:

```tsx
{project.relatedProjects?.length ? (
	<section
		className="border-t border-zinc-800 py-16"
		aria-labelledby={`${project.slug}-related-projects`}
	>
		<p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-600">
			Connected work
		</p>
		<h2
			id={`${project.slug}-related-projects`}
			className="mt-4 font-display text-3xl leading-tight text-white"
		>
			Follow the implementation thread.
		</h2>

		<div className="mt-8 grid gap-4 sm:grid-cols-2">
			{project.relatedProjects.map((relationship) => {
				const relatedProject = getProject(relationship.slug);

				if (!relatedProject) {
					return null;
				}

				const relatedAccent =
					projectAccentStyles[relatedProject.accent];

				return (
					<Link
						key={relationship.slug}
						href={`/projects/${relatedProject.slug}`}
						className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-600 hover:bg-zinc-900/65 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-4 focus:ring-offset-zinc-950"
					>
						<p
							className={`font-mono text-[0.65rem] uppercase tracking-[0.18em] ${relatedAccent.text}`}
						>
							{relationship.eyebrow}
						</p>
						<div className="mt-4 flex items-start justify-between gap-5">
							<div>
								<h3 className="font-display text-2xl text-zinc-100 transition group-hover:text-white">
									{relatedProject.title}
								</h3>
								<p className="mt-3 text-sm leading-7 text-zinc-500 transition group-hover:text-zinc-400">
									{relationship.detail}
								</p>
							</div>
							<ArrowRight
								className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300"
								aria-hidden="true"
							/>
						</div>
					</Link>
				);
			})}
		</div>
	</section>
) : null}
```

- [ ] **Step 7: Run formatting and static verification**

Run:

```bash
pnpm exec rome format app/projects/project-data.ts \
	'app/projects/[slug]/page.tsx' --write
pnpm exec rome check app/projects/project-data.ts 'app/projects/[slug]/page.tsx' scripts/site-contract.mjs
pnpm typecheck
git diff --check
pnpm build
```

Expected: all four commands pass. The only build output outside the successful
route table is the pre-existing inferred-workspace-root and stale Browserslist
warnings.

- [ ] **Step 8: Run both production-server contracts**

Start the built site on port 3100:

```bash
pnpm exec next start -p 3100
```

In another shell, run:

```bash
pnpm test:site chain-composer
pnpm test:site navigation
```

Expected:

```text
chain-composer site contract passes.
navigation site contract passes.
```

- [ ] **Step 9: Verify desktop and mobile rendering**

At 1440×900 and 390×844, inspect `/projects/chain_composer` and
`/projects/academic_metrics`.

Evaluate:

```js
() => {
	const comparison = document.querySelector('[data-code-comparison="true"]');
	const relationships = [
		...document.querySelectorAll('a[href^="/projects/"]'),
	].filter((link) =>
		["Academic Metrics", "ChainComposer"].includes(
			link.querySelector("h3")?.textContent?.trim() ?? "",
		),
	);

	return {
		comparison: Boolean(comparison),
		codePanels: comparison?.querySelectorAll("pre code").length ?? 0,
		relationshipHrefs: relationships.map((link) =>
			link.getAttribute("href"),
		),
		overflow:
			document.documentElement.scrollWidth -
			document.documentElement.clientWidth,
	};
}
```

Expected on ChainComposer:

```json
{
	"comparison": true,
	"codePanels": 2,
	"relationshipHrefs": ["/projects/academic_metrics"],
	"overflow": 0
}
```

Expected on Academic Metrics:

```json
{
	"comparison": false,
	"codePanels": 0,
	"relationshipHrefs": ["/projects/chain_composer"],
	"overflow": 0
}
```

Confirm both code panels are readable, mobile panels stack, long lines scroll
inside their own panel, focus rings remain visible, and the only local console
error is the pre-existing `/_vercel/insights/script.js` 404.

- [ ] **Step 10: Commit and push the verified slice**

Immediately before committing, run:

```bash
git status --short --branch
git log -1 --oneline --decorate
git diff --check
git diff -- app/projects/project-data.ts 'app/projects/[slug]/page.tsx' scripts/site-contract.mjs
```

Then stage only this slice:

```bash
git add app/projects/project-data.ts 'app/projects/[slug]/page.tsx' \
	scripts/site-contract.mjs \
	docs/superpowers/plans/2026-07-27-chaincomposer-lcel-comparison.md
git diff --cached --check
git commit -m "feat: show the LCEL case for ChainComposer"
git push
```
