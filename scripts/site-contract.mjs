import assert from "node:assert/strict";

const baseUrl =
	process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3100";
const suite = process.argv[2];

function decodeHtml(value) {
	return value
		.replaceAll("&amp;", "&")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">")
		.replaceAll("&quot;", '"')
		.replaceAll("&#x27;", "'")
		.replaceAll("&#39;", "'")
		.replaceAll("&nbsp;", " ");
}

function visibleText(fragment) {
	return decodeHtml(fragment.replaceAll(/<[^>]*>/g, " "))
		.replaceAll(/\s+/g, " ")
		.trim();
}

function attribute(attributes, name) {
	const match = attributes.match(
		new RegExp(`(?:^|\\s)${name}="([^"]*)"`, "i"),
	);
	return match?.[1];
}

function headerAnchors(html) {
	const header = html.match(/<header\b[\s\S]*?<\/header>/i);
	assert.ok(header, "rendered page must contain the shared header");

	return [...header[0].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
		(match) => ({
			href: attribute(match[1], "href"),
			current: attribute(match[1], "aria-current"),
			label: visibleText(match[2]),
			hasActiveIndicator: match[2].includes(
				'data-active-indicator="true"',
			),
		}),
	);
}

function mainContent(html) {
	const main = html.match(/<main\b[\s\S]*?<\/main>/i);
	assert.ok(main, "rendered page must contain the project content");
	return main[0];
}

function relatedProjectAnchors(html) {
	return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
		.filter((match) => attribute(match[1], "data-related-project"))
		.map((match) => ({
			href: attribute(match[1], "href"),
			project: attribute(match[1], "data-related-project"),
		}));
}

async function renderedPage(pathname) {
	const response = await fetch(new URL(pathname, baseUrl));
	assert.equal(
		response.status,
		200,
		`${pathname} must render successfully, received ${response.status}`,
	);
	return response.text();
}

async function navigationSuite() {
	const cases = [
		{ pathname: "/", current: "Spencer Presley", indicator: false },
		{ pathname: "/projects/gloss", current: "Projects", indicator: true },
		{ pathname: "/contact", current: "Contact", indicator: true },
		{
			pathname: "/resume/backend-platform",
			current: "Resume",
			indicator: true,
		},
	];
	const expectedLabels = [
		"Spencer Presley",
		"Projects",
		"Contact",
		"Resume",
	];
	const expectedHrefs = ["/", "/projects", "/contact", "/resume"];

	for (const testCase of cases) {
		const anchors = headerAnchors(await renderedPage(testCase.pathname));
		assert.deepEqual(
			anchors.map((anchor) => anchor.label),
			expectedLabels,
			`${testCase.pathname} must preserve visible and keyboard order`,
		);
		assert.deepEqual(
			anchors.map((anchor) => anchor.href),
			expectedHrefs,
			`${testCase.pathname} must preserve stable destinations`,
		);

		const current = anchors.filter(
			(anchor) => anchor.current === "page",
		);
		assert.deepEqual(
			current.map((anchor) => anchor.label),
			[testCase.current],
			`${testCase.pathname} must expose exactly one current destination`,
		);
		assert.equal(
			current[0]?.hasActiveIndicator,
			testCase.indicator,
			`${testCase.pathname} current-destination indicator is incorrect`,
		);
	}
}

async function chainComposerSuite() {
	const chainComposerHtml = await renderedPage("/projects/chain_composer");
	const chainComposerContent = mainContent(chainComposerHtml);
	const chainComposerText = visibleText(chainComposerContent);
	const academicMetricsHtml = await renderedPage("/projects/academic_metrics");
	const academicMetricsContent = mainContent(academicMetricsHtml);
	const academicMetricsText = visibleText(academicMetricsContent);

	assert.ok(
		chainComposerContent.includes('data-code-comparison="true"'),
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
	assert.deepEqual(
		relatedProjectAnchors(chainComposerContent),
		[
			{
				href: "/projects/academic_metrics",
				project: "academic_metrics",
			},
		],
		"ChainComposer must render Academic Metrics in its connected-work surface",
	);
	assert.deepEqual(
		relatedProjectAnchors(academicMetricsContent),
		[
			{
				href: "/projects/chain_composer",
				project: "chain_composer",
			},
		],
		"Academic Metrics must render ChainComposer in its connected-work surface",
	);
	assert.match(
		academicMetricsText,
		/earlier embedded (version|implementation) of ChainComposer/i,
		"Academic Metrics must identify its embedded ChainComposer lineage",
	);

	for (const { label, pattern } of [
		{ label: "async execution", pattern: /\b(?:async|asynchronous)\b/i },
		{
			label: "rate limiting",
			pattern: /\brate(?:[-\s]+)(?:limit(?:s|ing|ed)?|control)\b/i,
		},
	]) {
		assert.ok(
			!pattern.test(chainComposerText),
			`ChainComposer must not claim unsupported ${label}`,
		);
	}
}

async function contactSuite() {
	const contactHtml = await renderedPage("/contact");
	const contactContent = mainContent(contactHtml);
	const email = contactContent.match(
		/<span\b([^>]*)data-contact-email="true"([^>]*)>/i,
	);

	assert.ok(email, "Contact must expose its responsive email treatment");

	const classNames = attribute(`${email[1]} ${email[2]}`, "class")?.split(/\s+/);
	assert.ok(
		classNames?.includes("whitespace-nowrap"),
		"Contact email must stay on one line",
	);
	assert.ok(
		classNames?.includes("text-[clamp(1rem,5vw,1.5rem)]"),
		"Contact email must use the compact fluid mobile size",
	);
	assert.ok(
		!classNames?.includes("break-all"),
		"Contact email must not split at arbitrary characters",
	);
}

async function crunchAtlasSuite() {
	const html = await renderedPage("/projects/crunchatlas");
	const content = mainContent(html);
	const text = visibleText(content);

	assert.ok(
		html.includes('data-professional-case-study="crunchatlas"'),
		"CrunchAtlas must render through the professional case-study shell",
	);
	for (const expected of [
		"Reliable local AI where cloud assumptions break.",
		"Deterministic scaffolding around fallible local models.",
		"PurpleHaze",
		"CrunchSense v3",
		"GovCloud",
		"This case study describes system boundaries",
	]) {
		assert.ok(text.includes(expected), `CrunchAtlas must explain ${expected}`);
	}
	for (const image of [
		"crunchatlas-campaign-assessment.webp",
		"crunchatlas-agent-report.webp",
	]) {
		assert.ok(content.includes(image), `CrunchAtlas must render ${image}`);
	}
	assert.ok(
		content.includes('href="https://www.crunchatlas.com/"'),
		"CrunchAtlas must link to the public product site",
	);
	assert.ok(
		content.includes('href="/projects/atlasconnect"'),
		"CrunchAtlas must link to the next professional case study",
	);
	const canonical = [...html.matchAll(/<link\b([^>]*)>/gi)].find(
		(match) => attribute(match[1], "rel") === "canonical",
	);
	assert.equal(
		attribute(canonical?.[1] ?? "", "href"),
		"https://spencerpresley.com/projects/crunchatlas",
		"CrunchAtlas must publish its canonical project URL as a canonical link",
	);
}

const suites = {
	"chain-composer": chainComposerSuite,
	contact: contactSuite,
	crunchatlas: crunchAtlasSuite,
	navigation: navigationSuite,
};

assert.ok(
	suite && suite in suites,
	`Choose one site-contract suite: ${Object.keys(suites).join(", ")}`,
);

await suites[suite]();
console.log(`${suite} site contract passes.`);
