import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Navigation } from "../components/nav";
import {
  PageAtmosphere,
  pageAtmosphereStyles,
} from "../components/page-atmosphere";
import { siteContact } from "../site-data";
import {
  type ResumeBullet,
  type ResumeFocus,
  resumeEducation,
  resumeFocuses,
  resumeVariants,
} from "./resume-data";

const resumeAtmosphere = pageAtmosphereStyles.resume;

function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={`${part}-${index}`}
            className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[0.82em] text-zinc-200"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Bullet({ bullet }: { bullet: ResumeBullet }) {
  return (
    <li className="relative pl-5 leading-7 text-zinc-300">
      <span
        className="absolute left-0 top-[0.68rem] h-1.5 w-1.5 rounded-full bg-zinc-600"
        aria-hidden="true"
      />
      <strong className="font-semibold text-zinc-100">{bullet.lead}</strong>
      <InlineCode text={bullet.detail} />
    </li>
  );
}

function SectionHeading({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-mono text-xs text-zinc-400">{index}</span>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
        {children}
      </h2>
      <div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
    </div>
  );
}

export function ResumeView({
  selectedFocus,
}: {
  selectedFocus: ResumeFocus;
}) {
  const resume = resumeVariants[selectedFocus];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <PageAtmosphere variant="resume" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_45%)]"
        aria-hidden="true"
      />
      <Navigation />

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
        <header className="grid gap-12 border-b border-zinc-800 pb-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl">
            <p
              className={`mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] ${resumeAtmosphere.eyebrowText}`}
            >
              <span
                className={`h-px w-8 ${resumeAtmosphere.eyebrowLine}`}
                aria-hidden="true"
              />
              Resume · {resume.shortLabel}
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {resume.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              {resume.introduction}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={resume.pdf}
                download
                className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                Download {resume.shortLabel} PDF
              </a>
              <a
                href={resume.pdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Open PDF
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Choose a focus
            </p>
            <nav
              aria-label="Resume focus"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 shadow-2xl shadow-black/20 backdrop-blur"
            >
              {resumeFocuses.map((focus, index) => {
                const option = resumeVariants[focus];
                const isSelected = focus === selectedFocus;

                return (
                  <Link
                    key={focus}
                    href={
                      focus === "ai-llm"
                        ? "/resume"
                        : "/resume/backend-platform"
                    }
                    aria-current={isSelected ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-xl px-4 py-4 transition ${
                      isSelected
                        ? "bg-zinc-100 text-zinc-950"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                      <span
                        className={`mt-1 block text-xs ${
                          isSelected ? "text-zinc-600" : "text-zinc-400"
                        }`}
                      >
                        {focus === "ai-llm"
                          ? "Agents, serving, retrieval"
                          : "Queues, reliability, infrastructure"}
                      </span>
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        isSelected ? "text-zinc-500" : "text-zinc-700"
                      }`}
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <div className="grid gap-16 pt-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-20">
          <div className="space-y-20">
            <section aria-labelledby="experience-heading">
              <SectionHeading index="01">
                <span id="experience-heading">Experience</span>
              </SectionHeading>
              <div className="space-y-14">
                {resume.experience.map((experience) => (
                  <article
                    key={`${experience.organization}-${experience.role}`}
                    className="grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
                  >
                    <div>
                      <p className="font-mono text-xs leading-5 text-zinc-400">
                        {experience.dates}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-2xl text-white">
                          {experience.organization}
                        </h3>
                        <p className="text-sm text-sky-300">{experience.role}</p>
                      </div>
                      {experience.context ? (
                        <p className="mt-3 border-l border-zinc-700 pl-4 text-sm italic leading-6 text-zinc-400">
                          {experience.context}
                        </p>
                      ) : null}
                      <ul className="mt-6 space-y-4 text-[0.95rem]">
                        {experience.bullets.map((bullet) => (
                          <Bullet key={bullet.lead} bullet={bullet} />
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="projects-heading">
              <SectionHeading index="02">
                <span id="projects-heading">Selected projects</span>
              </SectionHeading>
              <div className="grid gap-4 md:grid-cols-2">
                {resume.projects.map((project) => (
                  <article
                    key={project.name}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                  >
                    <h3 className="font-display text-xl text-white">
                      {project.name}
                    </h3>
                    <p className="mt-2 font-mono text-[0.68rem] uppercase leading-5 tracking-[0.12em] text-zinc-400">
                      {project.technologies.join(" · ")}
                    </p>
                    <ul className="mt-5 space-y-4 text-sm">
                      {project.bullets.map((bullet) => (
                        <Bullet key={bullet.lead} bullet={bullet} />
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="honors-heading">
              <SectionHeading index="03">
                <span id="honors-heading">Honors</span>
              </SectionHeading>
              <ul className="grid gap-4 sm:grid-cols-2">
                {resume.honors.map((honor) => (
                  <li
                    key={honor}
                    className="rounded-2xl border border-zinc-800 px-5 py-4 text-sm leading-6 text-zinc-300"
                  >
                    {honor}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-12 lg:sticky lg:top-28 lg:self-start">
            <section aria-labelledby="contact-heading">
              <h2
                id="contact-heading"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"
              >
                Contact
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${siteContact.email}`}
                    className="group flex items-center gap-3 text-zinc-300 transition hover:text-white"
                  >
                    <Mail
                      className="h-4 w-4 text-zinc-600 transition group-hover:text-sky-300"
                      aria-hidden="true"
                    />
                    <span className="break-all">{siteContact.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={siteContact.linkedin.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 text-zinc-300 transition hover:text-white"
                  >
                    <Linkedin
                      className="h-4 w-4 text-zinc-600 transition group-hover:text-sky-300"
                      aria-hidden="true"
                    />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={siteContact.github.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 text-zinc-300 transition hover:text-white"
                  >
                    <Github
                      className="h-4 w-4 text-zinc-600 transition group-hover:text-sky-300"
                      aria-hidden="true"
                    />
                    GitHub
                  </a>
                </li>
              </ul>
            </section>

            <section aria-labelledby="skills-heading">
              <h2
                id="skills-heading"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"
              >
                Skills for this focus
              </h2>
              <div className="mt-5 space-y-6">
                {resume.skills.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-sm font-medium text-zinc-200">
                      {group.label}
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-md border border-zinc-800 bg-zinc-900/70 px-2.5 py-1.5 text-xs leading-4 text-zinc-400"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="education-heading"
              className="border-t border-zinc-800 pt-8"
            >
              <h2
                id="education-heading"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"
              >
                Education
              </h2>
              <p className="mt-5 font-display text-lg text-white">
                {resumeEducation.institution}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {resumeEducation.degree}
              </p>
              <p className="mt-2 font-mono text-xs text-zinc-400">
                {resumeEducation.dates}
              </p>
            </section>
          </aside>
        </div>

        <footer className="mt-24 flex flex-col gap-4 border-t border-zinc-800 pt-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Prefer the one-page version?</p>
          <a
            href={resume.pdf}
            download
            className="inline-flex items-center gap-2 text-zinc-300 transition hover:text-white"
          >
            Download {resume.label}
            <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
          </a>
        </footer>
      </main>
    </div>
  );
}
