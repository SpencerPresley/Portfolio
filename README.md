# spencerpresley.com

Spencer Presley's portfolio, built with Next.js and Tailwind CSS and deployed
on Vercel.

## Local development

```sh
pnpm install
pnpm dev
```

The production checks are:

```sh
pnpm typecheck
pnpm build
```

## Updating the resume

The web-native resume content is intentionally hard-coded in
`app/resume/resume-data.ts`. It contains two role-family variants:

- AI & LLM Systems at `/resume`
- Backend & Platform at `/resume/backend-platform`

The downloadable PDFs are rendered in the separate resume repository. On
Spencer's current machine, refresh them with:

```sh
cp ~/resume/versions/variants/presley_ai-llm-v2.pdf public/spencer-presley-ai-llm-resume.pdf
cp ~/resume/versions/variants/presley_backend-platform.pdf public/spencer-presley-backend-platform-resume.pdf
cp ~/resume/versions/variants/presley_ai-llm-v2.pdf public/RESUME_SpencerPresley.pdf
```

The last copy preserves the original public URL for old links while making the
AI/LLM resume the default download.

## Updating projects

Project metadata and case-study content live in
`app/projects/project-data.ts`. Each typed record drives both the project index
and its `/projects/[slug]` detail route; there is no database, CMS, Markdown, or
generated content layer.
