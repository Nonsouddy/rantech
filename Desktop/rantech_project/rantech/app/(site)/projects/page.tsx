import type { Metadata } from "next";
import ProjectsGrid from "@/components/ProjectsGrid";
import CTABand from "@/components/CTABand";
import { getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | RANTECH ELECTRICAL POWER COMPANY LIMITED",
  description:
    "Completed distribution transformer rewinds, installations, sales and supply jobs across industrial, commercial and residential sites.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
  <section className="border-b border-ink/10 bg-ink-700">
        <div className="container-content py-16 md:py-20">
          <span className="font-mono text-xs text-copper">Projects</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-paper md:text-5xl">
            A record of what&apos;s been done
          </h1>
          <p className="mt-4 max-w-lg text-paper/60">
            Rewinds, installations, sales and supply jobs across industrial,
            commercial and residential sites — filter by the kind of work.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-content">
          {projects.length > 0 ? (
            <ProjectsGrid projects={projects} />
          ) : (
            <p className="text-slate-muted">
              Projects will appear here once they&apos;re added from the admin dashboard.
            </p>
          )}
        </div>
      </section>

      <CTABand
        heading="Want a similar job scoped for your site?"
        body="Tell us the site type and the problem you're solving, and we'll walk you through comparable work we've done."
      />
    </>
  );
}