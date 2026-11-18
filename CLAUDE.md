# CLAUDE.md

spencerpresley.com: Next.js 15 + Tailwind, deployed by Vercel from `main` on every push, so `main` is production. There is no CI; the checks below are the only gate.

## Project map

- `app/page.tsx`, `app/layout.tsx`, `app/site-data.ts`: home page, root layout, shared site data.
- `app/projects/`: project list and case studies (`crunchatlas/`, `purplehaze/`, `atlasconnect/`, …); content in `project-data.ts` and `professional-work-data.ts`.
- `app/resume/`: the web resume; content in `resume-data.ts`.
- `app/components/`, `app/lib/`, `app/api/`, `app/contact/`: shared UI, helpers, API routes, contact page.
- `public/`: static files, including the downloadable resume PDFs.
- `scripts/site-contract.mjs`: end-to-end checks against a running server.
- `docs/DESIGN.md`: content, layout, privacy, and verification decisions. Read it before changing what a page claims.

<important if="you need to run commands to develop, build, check, or test the site">

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Production build |
| `pnpm start -p 3100` | Serve the build where the site-contract suites expect it |
| `node scripts/site-contract.mjs <suite>` | One suite: `atlasconnect`, `branding`, `chain-composer`, `contact`, `crunchatlas`, `navigation`, `previews`. `PORTFOLIO_BASE_URL` overrides `http://127.0.0.1:3100` |
| `pnpm fmt` | Rome check + format (see the formatting block before using it) |

Before merging: `pnpm typecheck`, `pnpm build`, then every site-contract suite against `pnpm start -p 3100`.
</important>

<important if="you are committing, opening a PR, or merging">
- Branch → PR → squash merge → `git switch main && git pull`. Merged branches are deleted automatically.
</important>

<important if="you are running `gh` in this repo">
- `gh`'s active account may be the work account, which gets a 404 here. Run `GH_TOKEN=$(gh auth token --user SpencerPresley) gh …`; never `gh auth switch`.
</important>

<important if="you are formatting files or running `pnpm fmt`">
- `app/resume/` uses 2-space indentation and the rest of `app/` uses tabs. `pnpm fmt` across the repo re-tabs `app/resume/`. Format only the files you touched, with `--indent-style space --indent-size 2` under `app/resume/`.
</important>

<important if="you are changing `app/resume/` or anything in `public/*.pdf`">
- `resume-data.ts` mirrors two markdown sources in the private resume repo: `~/resume/me/versions/variants/presley_ai-llm-v2.md` and `presley_backend-platform.md`. Change both sides together. The skill groups (with outbound links) and the Edge & networking section are site-only on purpose.
- `public/*.pdf` are rendered from phone-stripped copies with the recipe in `README.md`. A phone number must never reach this repo: run the README's `pdftotext` check before every push that touches `public/`.
</important>

<important if="you are writing or changing claims about professional work, employers, or customers">
- Every claim is code-verified in the resume repo first. Describe the employer's products by what they do, never how they work internally.
- The only customer named on the site is one the company already lists publicly. Don't add other customer or partner names.
</important>
