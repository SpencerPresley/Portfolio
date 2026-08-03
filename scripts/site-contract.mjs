import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const baseUrl = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3100";
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
	const match = attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, "i"));
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
			hasActiveIndicator: match[2].includes('data-active-indicator="true"'),
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

async function renderedAsset(pathname) {
	const response = await fetch(new URL(pathname, baseUrl));
	assert.equal(
		response.status,
		200,
		`${pathname} must load successfully, received ${response.status}`,
	);
	assert.equal(
		response.headers.get("content-type"),
		"image/png",
		`${pathname} must remain a PNG`,
	);
	return Buffer.from(await response.arrayBuffer());
}

function pngDimensions(bytes) {
	assert.equal(
		bytes.subarray(1, 4).toString("ascii"),
		"PNG",
		"asset must contain a PNG signature",
	);
	return {
		width: bytes.readUInt32BE(16),
		height: bytes.readUInt32BE(20),
	};
}

async function brandingSuite() {
	const html = await renderedPage("/");
	const legacyTemplateName = ["chrono", "ark"].join("");
	assert.doesNotMatch(
		html,
		new RegExp(legacyTemplateName, "i"),
		"rendered metadata must not preserve legacy template branding",
	);
	assert.ok(
		html.includes(
			'<meta property="og:image" content="https://spencerpresley.com/spencer-presley-og.png"',
		),
		"Home must publish the Spencer-branded Open Graph image",
	);
	assert.ok(
		html.includes(
			'<meta name="twitter:image" content="https://spencerpresley.com/spencer-presley-og.png"',
		),
		"Home must publish the Spencer-branded Twitter image",
	);
	assert.ok(
		html.includes(
			'<meta property="og:image:alt" content="Spencer Presley — AI and backend systems"',
		),
		"Social previews must describe the branded image",
	);
	assert.ok(
		html.includes(
			'<meta name="twitter:image:alt" content="Spencer Presley — AI and backend systems"',
		),
		"Twitter previews must describe the branded image",
	);
	for (const relationship of ["shortcut icon", "icon", "apple-touch-icon"]) {
		assert.ok(
			html.includes(
				`<link rel="${relationship}" href="/spencer-presley-icon.png"`,
			),
			`${relationship} must reference the Spencer-branded icon`,
		);
	}
	assert.ok(
		!html.includes('content="https://spencerpresley.com/og.png"') &&
			!html.includes('href="/favicon.png"'),
		"rendered metadata must not reference the legacy asset URLs",
	);

	for (const expected of [
		{
			pathname: "/spencer-presley-og.png",
			legacyHash:
				"41f042a04511ab9f773743c3d1b138db4f845df81b1bf369fdf5a74562f19162",
			dimensions: { width: 1200, height: 630 },
		},
		{
			pathname: "/spencer-presley-icon.png",
			legacyHash:
				"9591ef7ba4d337850540c328f4aa94ca7ddab187e2dbe8c217e255455eac263d",
			dimensions: { width: 512, height: 512 },
		},
	]) {
		const bytes = await renderedAsset(expected.pathname);
		assert.notEqual(
			createHash("sha256").update(bytes).digest("hex"),
			expected.legacyHash,
			`${expected.pathname} must not reuse the legacy template asset`,
		);
		assert.deepEqual(
			pngDimensions(bytes),
			expected.dimensions,
			`${expected.pathname} must use its intended social or icon dimensions`,
		);
	}

	for (const pathname of ["/og.png", "/favicon.png"]) {
		const response = await fetch(new URL(pathname, baseUrl));
		assert.equal(
			response.status,
			404,
			`${pathname} must not preserve the legacy template asset`,
		);
	}
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
	const expectedLabels = ["Spencer Presley", "Projects", "Contact", "Resume"];
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

		const current = anchors.filter((anchor) => anchor.current === "page");
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
	const methods = [...contactContent.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
		.filter((match) => attribute(match[1], "data-contact-method"))
		.map((match) => ({
			method: attribute(match[1], "data-contact-method"),
			href: attribute(match[1], "href"),
			primary: attribute(match[1], "data-primary-contact"),
		}));
	const email = contactContent.match(
		/<span\b([^>]*)data-contact-email="true"([^>]*)>/i,
	);

	assert.deepEqual(
		methods,
		[
			{
				method: "linkedin",
				href: "https://www.linkedin.com/in/spencerpresley96",
				primary: "true",
			},
			{
				method: "email",
				href: "mailto:spencerpresley96@gmail.com",
				primary: undefined,
			},
			{
				method: "github",
				href: "https://github.com/SpencerPresley",
				primary: undefined,
			},
		],
		"Contact must prioritize LinkedIn before its direct and technical fallbacks",
	);
	assert.ok(
		visibleText(contactContent).includes(
			"LinkedIn is the best place to start.",
		),
		"Contact must explain why LinkedIn is the preferred first contact",
	);
	assert.ok(email, "Contact must expose its responsive email treatment");

	const classNames = attribute(`${email[1]} ${email[2]}`, "class")?.split(
		/\s+/,
	);
	assert.ok(
		classNames?.includes("whitespace-nowrap"),
		"Contact email must stay on one line",
	);
	assert.ok(
		classNames?.includes("text-[clamp(1rem,5vw,1.25rem)]"),
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
	const shouldRenderCrunchAtlasImages =
		process.env.SHOW_CRUNCHATLAS_IMAGES === "true";

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
		assert.equal(
			html.includes(image),
			shouldRenderCrunchAtlasImages,
			`CrunchAtlas ${image} visibility must match SHOW_CRUNCHATLAS_IMAGES`,
		);
	}
	assert.equal(
		content.includes('id="product-proof"'),
		shouldRenderCrunchAtlasImages,
		"CrunchAtlas Product proof visibility must match SHOW_CRUNCHATLAS_IMAGES",
	);
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

async function atlasConnectSuite() {
	const html = await renderedPage("/projects/atlasconnect");
	const content = mainContent(html);
	const text = visibleText(content);

	assert.ok(
		html.includes('data-professional-case-study="atlasconnect"'),
		"AtlasConnect must render through the professional case-study shell",
	);
	for (const expected of [
		"From incoming pitch deck to an investment decision.",
		"sole developer and maintainer",
		"inherited",
		"DocSend",
		"AWS Lambda",
		"OCR",
		"Firm workflow",
		"Pitchfire",
	]) {
		assert.ok(text.includes(expected), `AtlasConnect must explain ${expected}`);
	}
	assert.deepEqual(
		[...content.matchAll(/data-atlasconnect-stage="([^"]+)"/gi)].map(
			(match) => match[1],
		),
		["01", "02", "03", "04"],
		"AtlasConnect must render its four process stages in order",
	);
	assert.ok(
		!/<img\b/i.test(content),
		"AtlasConnect must not fabricate or copy a product image",
	);
	assert.ok(
		content.includes('href="https://www.pitchfire.com/"'),
		"AtlasConnect must link to the rebranded public product",
	);
	assert.ok(
		content.includes('href="/projects/crunchatlas"'),
		"AtlasConnect must link back to the CrunchAtlas case study",
	);
	const canonical = [...html.matchAll(/<link\b([^>]*)>/gi)].find(
		(match) => attribute(match[1], "rel") === "canonical",
	);
	assert.equal(
		attribute(canonical?.[1] ?? "", "href"),
		"https://spencerpresley.com/projects/atlasconnect",
		"AtlasConnect must publish its canonical project URL as a canonical link",
	);
}

async function previewsSuite() {
	const home = mainContent(await renderedPage("/"));
	const projects = mainContent(await renderedPage("/projects"));
	const homeText = visibleText(home);
	const shouldRenderCrunchAtlasImages =
		process.env.SHOW_CRUNCHATLAS_IMAGES === "true";
	const anchorHrefs = (content) =>
		[...content.matchAll(/<a\b([^>]*)>/gi)].map((match) =>
			attribute(match[1], "href"),
		);
	const markedArticle = (content, marker, slug) => {
		const article = content.match(
			new RegExp(
				`<article\\b[^>]*\\b${marker}="${slug}"[^>]*>[\\s\\S]*?<\\/article>`,
				"i",
			),
		);
		assert.ok(article, `${marker}="${slug}" must mark an article`);
		return article[0];
	};

	assert.deepEqual(
		[
			...home.matchAll(
				/data-(?:home-professional-work|home-project)="([^"]+)"/gi,
			),
		].map((match) => match[1]),
		["crunchatlas", "gloss", "celery-fork-safety"],
		"Home must preserve its CrunchAtlas, gloss, and Celery proof order",
	);
	assert.deepEqual(
		[...projects.matchAll(/data-professional-work-card="([^"]+)"/gi)].map(
			(match) => match[1],
		),
		["crunchatlas", "atlasconnect"],
		"Projects must render both professional case studies in canonical order",
	);

	for (const { content, marker, slug, internal, external } of [
		{
			content: home,
			marker: "data-home-professional-work",
			slug: "crunchatlas",
			internal: "/projects/crunchatlas",
			external: "https://www.crunchatlas.com/",
		},
		{
			content: projects,
			marker: "data-professional-work-card",
			slug: "crunchatlas",
			internal: "/projects/crunchatlas",
			external: "https://www.crunchatlas.com/",
		},
		{
			content: projects,
			marker: "data-professional-work-card",
			slug: "atlasconnect",
			internal: "/projects/atlasconnect",
			external: "https://www.pitchfire.com/",
		},
	]) {
		assert.deepEqual(
			[...new Set(anchorHrefs(markedArticle(content, marker, slug)))],
			[internal, external],
			`${slug} must pair its case study with its own external product`,
		);
	}
	assert.ok(
		!home.includes("crunchatlas-campaign-teaser.webp") &&
			!projects.includes("crunchatlas-campaign-teaser.webp"),
		"Professional previews must not reference the stale teaser asset",
	);
	for (const [surface, content] of [
		["Home", home],
		["Projects", projects],
	]) {
		assert.equal(
			content.includes("crunchatlas-campaign-assessment.webp"),
			shouldRenderCrunchAtlasImages,
			`${surface} CrunchAtlas image visibility must match SHOW_CRUNCHATLAS_IMAGES`,
		);
	}
	assert.ok(
		homeText.includes(
			"LinkedIn gives me enough context for a useful first conversation.",
		),
		"Home must agree with the LinkedIn-first contact path",
	);
	assert.ok(
		!homeText.includes("Email is the most reliable way to reach me."),
		"Home must not preserve its stale email-first contact claim",
	);
}

const suites = {
	atlasconnect: atlasConnectSuite,
	branding: brandingSuite,
	"chain-composer": chainComposerSuite,
	contact: contactSuite,
	crunchatlas: crunchAtlasSuite,
	navigation: navigationSuite,
	previews: previewsSuite,
};

assert.ok(
	suite && suite in suites,
	`Choose one site-contract suite: ${Object.keys(suites).join(", ")}`,
);

await suites[suite]();
console.log(`${suite} site contract passes.`);
