# ChainComposer LCEL Comparison Design

## Context

The existing ChainComposer case study describes a generic orchestration layer,
but it does not show why the abstraction mattered. It also repeats claims from
the project README that the published implementation does not support:
asynchronous execution and explicit rate limiting.

The source establishes a more specific and defensible story:

- ChainComposer 0.1.8 targets LangChain 0.3.7 and langchain-core 0.3.19.
- Its internal builder composes ordinary LCEL `Runnable` pipelines.
- Academic Metrics contains the earlier embedded implementation, with the
  public facade named `ChainManager` and its sequence manager named
  `ChainComposer`.
- Academic Metrics uses that facade across five LLM stages: method extraction,
  sentence analysis, summarization, recursive taxonomy classification, and
  theme recognition.
- The abstraction reduced Spencer's repeated workflow-assembly time from hours
  to roughly five minutes.

The value is not that LCEL was incapable of expressing these workflows. LCEL
provided the low-level prompt, model, parser, fallback, and state primitives.
ChainComposer packaged one recurring application pattern so those decisions did
not need to be reconstructed and debugged for every workflow.

## Goals

- Explain ChainComposer through the concrete raw-LCEL work it removed.
- Make the hours-to-minutes authoring improvement visible and explicitly
  first-person.
- Identify Academic Metrics as the production proving ground and earlier
  embedded implementation.
- Add reciprocal internal links between the two case studies.
- Remove unsupported async and rate-limit claims.
- Preserve TypeScript-backed content and the generic project-detail renderer.

## Non-goals

- Claim that LangChain v1 removed LCEL.
- Present ChainComposer as a replacement execution engine.
- Add MDX, syntax highlighting, a code-rendering dependency, or a one-off route.
- Rewrite either upstream repository or its README.
- Claim every README feature when the published source does not implement it.

## Data Model

`Project` receives two optional, server-safe fields:

- `codeComparison`, containing an eyebrow, title, explanation, and exactly two
  labeled code samples.
- `relatedProjects`, containing a target slug, relationship eyebrow, and
  relationship detail.

The code sample shape contains a label, title, short explanation, and plain code
string. Keeping the content in `project-data.ts` makes it easy to edit, inspect,
and type-check without introducing a rich-text parser.

The generic `/projects/[slug]` renderer resolves related slugs through the
existing `getProject()` lookup. An invalid relationship produces no link rather
than a broken destination.

## ChainComposer Content

The top-level summary and lead will state that ChainComposer:

- is an opinionated layer over LangChain 0.3-era LCEL;
- came directly from the five-stage Academic Metrics classifier;
- retained LCEL `Runnable` pipelines underneath;
- reduced repeated multi-stage workflow setup from hours to roughly five
  minutes.

The facts become:

1. Era: LangChain 0.3 / LCEL.
2. Authoring: Hours to roughly five minutes.
3. Runtime: LCEL `Runnable` pipelines.

The engineering decisions emphasize wrapping rather than replacing LCEL,
explicitly naming state handoffs, and treating parser and fallback behavior as
layer policy.

## Code Comparison

The comparison is a full-width section between the prose narrative and
engineering decisions.

The left sample, “Raw LCEL,” shows one intermediate Academic Metrics-style
stage. It constructs:

- a `ChatPromptTemplate`;
- primary JSON and fallback string parser paths;
- `.with_fallbacks(...)` exception behavior;
- `RunnablePassthrough.assign(...)` state propagation;
- final invocation.

The right sample, “ChainComposer,” expresses the same stage through
`add_chain_layer(...)` and `run(...)`.

The explanatory text is explicit that the raw example is already the compact
version. Extracting a reusable helper for it is the beginning of rebuilding the
same orchestration abstraction.

No syntax highlighter is added. Both samples use semantic headings, `pre` and
`code` elements, monospaced text, and visible borders. They render as two
columns on wide screens and stack on mobile. Long raw-LCEL lines scroll within
their own code panel so the document never gains horizontal overflow.

## Academic Metrics Cross-reference

The Academic Metrics narrative will identify its LLM layer as an earlier
embedded version of ChainComposer and name the five stages it coordinates
across three managers.

Each page receives one “Connected work” card:

- ChainComposer links to Academic Metrics as its production proving ground.
- Academic Metrics links to ChainComposer as the extracted developer tool.

The cards use the related project's existing title and accent, ordinary internal
links, visible focus rings, and concise relationship-specific copy.

## Verification

A production-server contract must fail before implementation and pass after it.
It checks that:

- `/projects/chain_composer` renders the comparison and both LCEL and
  ChainComposer API terms;
- the hours-to-five-minutes claim is visible;
- both reciprocal links render;
- Academic Metrics identifies the earlier embedded implementation;
- the unsupported async and rate-limit claims are absent.

The existing navigation contract remains green. Rome, TypeScript, the production
build, and `git diff --check` must pass. Browser verification covers the
comparison and relationship card at 1440 by 900 and 390 by 844, including
document overflow and console errors.
