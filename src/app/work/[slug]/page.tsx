import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/lab/CaseStudy";
import { pageMetadata } from "@/lib/seo";
import { hasCaseStudy, labContent } from "@/data/lab";

/** Only projects that actually have a case study are routable. */
const builtProjects = labContent.projects.filter(hasCaseStudy);

export function generateStaticParams() {
  return builtProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = builtProjects.find((entry) => entry.slug === slug);
  if (!project) return {};

  /* The project's own cover as the share card, rather than the site
     card. A case study shared into a chat should show the work it is
     about — and every built project has cover art by definition, since
     that is what `builtProjects` filters on. Falls back to the site card
     if a project ever has spreads but no cover. */
  const art = project.feature ?? project.cover;

  return pageMetadata({
    path: `/work/${project.slug}`,
    title: `${project.name} — Ali Aljardabi`,
    /* Every routable project has a summary today — `spreads` and
       `summary` happen to travel together — but the type allows one
       without the other, and a page with no description is worse than a
       plain one. The fallback states what the page is and nothing
       more. */
    description:
      project.summary ??
      `${project.name} — ${
        project.disciplines.length > 0
          ? `${project.disciplines.join(", ")} work`
          : "a project"
      } by Ali Aljardabi, independent designer in Manama, Bahrain.`,
    type: "article",
    image: art?.src,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = builtProjects.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  return (
    <CaseStudy
      content={labContent}
      project={builtProjects[index]}
      /* No "next project" while there is only one — it would link to itself. */
      next={
        builtProjects.length > 1
          ? builtProjects[(index + 1) % builtProjects.length]
          : undefined
      }
    />
  );
}
