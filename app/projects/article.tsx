import type { Project } from "@/.contentlayer/generated";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getStatusColor, getStatusText, getStatusIcon } from "@/app/lib/status";
import { getCategoryColor, getCategoryText, getCategoryIcon } from "@/app/lib/category";

type Props = {
	project: Project;
	views: number;
	layout?: "default" | "compact";
};

export const Article: React.FC<Props> = ({ project, views, layout = "default" }) => {
	return (
		<Link href={`/projects/${project.slug}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<div className={`flex items-center gap-2 ${layout === "compact" ? "md:flex-col md:items-start md:gap-1" : "items-center gap-2"}`}>
						<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
							{project.date ? (
								<time dateTime={new Date(project.date).toISOString()}>
									{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
										new Date(project.date),
									)}
								</time>
							) : (
								<span>SOON</span>
							)}
						</span>
						{project.status && (
							<span className={`text-xs ${getStatusColor(project.status)} flex items-center gap-1.5 md:text-[11px] whitespace-nowrap`}>
								{layout === "compact" ? <span className="md:hidden">• </span> : "• "}{getStatusIcon(project.status)} {getStatusText(project.status)}
							</span>
						)}
						{project.category && (
							<span className={`text-xs ${getCategoryColor(project.category)} flex items-center gap-1.5 md:text-[11px] whitespace-nowrap`}>
								{layout === "compact" ? <span className="md:hidden">• </span> : "• "}{getCategoryIcon(project.category)} {getCategoryText(project.category)}
							</span>
						)}
					</div>
					<span className="text-zinc-500 text-xs flex items-center gap-1">
						<Eye className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{project.title}
				</h2>
				<p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{project.description}
				</p>
			</article>
		</Link>
	);
};
