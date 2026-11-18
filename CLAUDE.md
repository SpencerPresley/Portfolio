# CLAUDE.md

spencerpresley.com: Next.js 15 + Tailwind. Vercel deploys `main` on every push, so `main` is production. Content, layout, privacy, and verification decisions are in `docs/DESIGN.md`; read it before changing what a page claims.

## Workflow

- Branch → PR → squash merge → `git switch main && git pull`. The repo deletes merged branches automatically.
- `gh`'s active account may be the work account, which gets a 404 on this repo. Run `gh` here as `GH_TOKEN=$(gh auth token --user SpencerPresley) gh …`; never `gh auth switch`.
- There is no CI. Before merging, run `pnpm typecheck` and `pnpm build`, then the site-contract suites against a running build: `pnpm start -p 3100`, then `node scripts/site-contract.mjs <suite>` for each of `atlasconnect`, `branding`, `chain-composer`, `contact`, `crunchatlas`, `navigation`, `previews` (`PORTFOLIO_BASE_URL` overrides the default `http://127.0.0.1:3100`).

## Formatting

Rome is the formatter, and the repo mixes indentation: `app/resume/` uses 2 spaces and the rest of `app/` uses tabs. Don't run `pnpm fmt` across the repo, because it re-tabs the space-indented files. Format only the files you touched, and pass `--indent-style space --indent-size 2` for anything under `app/resume/`.

## Resume

- `app/resume/resume-data.ts` mirrors two markdown sources in the private resume repo (`~/resume/me/versions/variants/presley_ai-llm-v2.md` and `presley_backend-platform.md`). Change both sides together. The skill groups (with outbound links) and the Edge & networking section are site-only on purpose.
- `public/*.pdf` are rendered from phone-stripped copies with the recipe in `README.md`. A phone number must never reach this repo: run the README's `pdftotext` check before every push that touches `public/`.

## Content rules

- Every claim about professional work is code-verified in the resume repo first. Describe the employer's products by what they do, never how they work internally.
- The only customer named on the site is one the company already lists publicly. Don't add other customer or partner names.
