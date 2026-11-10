# spencerpresley.com

Spencer Presley's portfolio, built with Next.js and Tailwind CSS and deployed
on Vercel.

The durable content, layout, privacy, and verification decisions are documented
in [`docs/DESIGN.md`](docs/DESIGN.md).

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

The downloadable PDFs are rendered in the separate resume repository. The
resume sources there carry a phone number that must NOT be published, so the
public PDFs are rendered from phone-stripped copies. On Spencer's current
machine, refresh them with:

```sh
cd ~/resume
out=$(mktemp -d)
for v in presley_ai-llm-v2 presley_backend-platform; do
  sed 's/^[0-9]\{3\}-[0-9]\{3\}-[0-9]\{4\} | //' versions/variants/$v.md > "$out/$v.md"
  pandoc "$out/$v.md" -s --include-in-header=.render/style.html --metadata title="Spencer Presley" -o "$out/$v.html"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-pdf-header-footer --print-to-pdf="$out/$v.pdf" "file://$out/$v.html"
done
cd ~/code/Portfolio
cp "$out/presley_ai-llm-v2.pdf" public/spencer-presley-ai-llm-resume.pdf
cp "$out/presley_backend-platform.pdf" public/spencer-presley-backend-platform-resume.pdf
cp "$out/presley_ai-llm-v2.pdf" public/RESUME_SpencerPresley.pdf
for f in public/*.pdf; do pdftotext "$f" - | grep -q '[0-9]\{3\}-[0-9]\{3\}-[0-9]\{4\}' && echo "PHONE LEAK: $f"; done
```

`app/resume/resume-data.ts` mirrors the same two markdown sources (lead = the
bolded opening clause of each bullet); update it in the same change.

Two parts are site-only and intentionally richer than the PDFs: the skill
groups (`skillGroups`, with outbound links in `skillLinks`) and the
`resumeEdgeWork` section (Edge & networking), shown on both tabs.

The last copy preserves the original public URL for old links while making the
AI/LLM resume the default download.

## Updating projects

Public project metadata and case-study content live in
`app/projects/project-data.ts`. Each typed record drives both the project index
and its `/projects/[slug]` detail route.

Professional-work summaries live in
`app/projects/professional-work-data.ts`. CrunchAtlas and AtlasConnect use
dedicated route components because their evidence and disclosure boundaries
need different presentations. There is no database, Redis dependency, CMS,
MDX, or generated content layer.
