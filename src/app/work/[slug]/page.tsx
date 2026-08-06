import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/lab/CaseStudy";
import { labContent } from "@/data/lab";

/** Only projects that actually have a case study are routable. */
const builtProjects = labContent.projects.filter((project) => project.spreads);

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

  return {
    title: `${project.name} — Ali Aljardabi`,
    description: project.summary,
  };
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
