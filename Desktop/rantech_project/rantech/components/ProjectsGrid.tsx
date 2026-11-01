"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`border px-4 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "border-copper bg-copper text-ink"
                : "border-ink/15 text-slate-muted hover:border-ink/30 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <LayoutGroup>
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-slate-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}