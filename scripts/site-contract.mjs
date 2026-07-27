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

const suites = {
	navigation: navigationSuite,
};

assert.ok(
	suite && suite in suites,
	`Choose one site-contract suite: ${Object.keys(suites).join(", ")}`,
);

await suites[suite]();
console.log(`${suite} site contract passes.`);
