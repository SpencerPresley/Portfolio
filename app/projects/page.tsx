import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import { getStatusColor, getStatusText, getStatusIcon } from "@/app/lib/status";
import { getCategoryColor, getCategoryText, getCategoryIcon } from "@/app/lib/category";

const redis = Redis.fromEnv();

export const revalidate = 60;
export default async function ProjectsPage() {
  const views = (
    await redis.mget<number[]>(
      ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
    )
  ).reduce((acc, v, i) => {
    acc[allProjects[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const featured = allProjects.find((project) => project.slug === "academic_metrics")!;
  const top2 = allProjects.find((project) => project.slug === "chain_composer")!;
  const top3 = allProjects.find((project) => project.slug === "testifai")!;
  const sorted = allProjects
    .filter((p) => p.published)
    .filter(
      (project) =>
        project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug,
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            Below are a collection of projects spanning from personal, hackathons, school, and internships. The dates represent approximately the time of the last commit to the corresponding repository.
          </p>
          <div className="mt-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-zinc-200">Project Status Key</h3>
              <div className="flex items-center gap-2">
                <div className={getStatusColor("in-dev")}>
                  {getStatusIcon("in-dev")}
                </div>
                <span className="text-sm text-zinc-400">{getStatusText("in-dev")}: Initial development phase; core features under active development</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={getStatusColor("ongoing")}>
                  {getStatusIcon("ongoing")}
                </div>
                <span className="text-sm text-zinc-400">{getStatusText("ongoing")}: Live in production with regular feature updates and enhancements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={getStatusColor("complete")}>
                  {getStatusIcon("complete")}
                </div>
                <span className="text-sm text-zinc-400">{getStatusText("complete")}: Feature-complete and stable; supported for critical updates and bug fixes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={getStatusColor("legacy")}>
                  {getStatusIcon("legacy")}
                </div>
                <span className="text-sm text-zinc-400">{getStatusText("legacy")}: Stable and functional release; no longer actively maintained</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-zinc-200">Project Categories Key</h3>
              {/* <div className="flex items-center gap-2">
                <div className={getCategoryColor("research")}>
                  {getCategoryIcon("research")}
                </div>
                <span className="text-sm text-zinc-400">{getCategoryText("research")}: Academic or industry research initiatives</span>
              </div> */}
              <div className="flex items-center gap-2">
                <div className={getCategoryColor("internship")}>
                  {getCategoryIcon("internship")}
                </div>
                <span className="text-sm text-zinc-400">{getCategoryText("internship")}: Projects developed during professional internships</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <div className={getCategoryColor("school project")}>
                  {getCategoryIcon("school project")}
                </div>
                <span className="text-sm text-zinc-400">{getCategoryText("school project")}: Academic coursework and university projects</span>
              </div> */}
              <div className="flex items-center gap-2">
                <div className={getCategoryColor("personal project")}>
                  {getCategoryIcon("personal project")}
                </div>
                <span className="text-sm text-zinc-400">{getCategoryText("personal project")}: Independent projects and passion initiatives</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={getCategoryColor("hackathon")}>
                  {getCategoryIcon("hackathon")}
                </div>
                <span className="text-sm text-zinc-400">{getCategoryText("hackathon")}: Projects built during hackathons and coding competitions</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Link href={`/projects/${featured.slug}`}>
              <article className="relative w-full h-full p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-100">
                      {featured.date ? (
                        <time dateTime={new Date(featured.date).toISOString()}>
                          {Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(featured.date))}
                        </time>
                      ) : (
                        <span>SOON</span>
                      )}
                    </span>
                    {featured.status && (
                      <span className={`text-xs ${getStatusColor(featured.status)} flex items-center gap-1.5`}>
                        • {getStatusIcon(featured.status)} {getStatusText(featured.status)}
                      </span>
                    )}
                    {featured.category && (
                      <span className={`text-xs ${getCategoryColor(featured.category)} flex items-center gap-1.5`}>
                        • {getCategoryIcon(featured.category)} {getCategoryText(featured.category)}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Eye className="w-4 h-4" />{" "}
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      views[featured.slug] ?? 0,
                    )}
                  </span>
                </div>

                <h2
                  id="featured-post"
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  {featured.title}
                </h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {featured.description}
                </p>
                <div className="absolute bottom-4 md:bottom-8">
                  <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>

          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((project) => (
              <Card key={project.slug}>
                <Article project={project} views={views[project.slug] ?? 0} layout="default" />
              </Card>
            ))}
          </div>
        </div>
        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} layout="compact" />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} layout="compact" />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} views={views[project.slug] ?? 0} layout="compact" />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
