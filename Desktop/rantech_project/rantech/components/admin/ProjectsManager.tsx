"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2, ImagePlus } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

const CATEGORY_OPTIONS = [
  "Rewinding",
  "Maintenance",
  "Installation",
  "Sales",
  "Supply",
  "General contract",
];

type FormState = {
  id: string | null;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
};

const emptyForm: FormState = {
  id: null,
  title: "",
  category: CATEGORY_OPTIONS[0],
  location: "",
  year: String(new Date().getFullYear()),
  description: "",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    if (res.ok) {
      const json = await res.json();
      setProjects(json.projects);
    }
    setLoading(false);
  }

  function openCreatePanel() {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setPanelOpen(true);
  }

  function openEditPanel(project: Project) {
    setForm({
      id: project.id,
      title: project.title,
      category: project.category,
      location: project.location,
      year: project.year,
      description: project.description,
    });
    setImageFile(null);
    setImagePreview(project.image);
    setError("");
    setPanelOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("category", form.category);
    fd.set("location", form.location);
    fd.set("year", form.year);
    fd.set("description", form.description);
    if (imageFile) fd.set("image", imageFile);

    const url = form.id ? `/api/admin/projects/${form.id}` : "/api/admin/projects";
    const method = form.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setSaving(false);
        return;
      }
      setPanelOpen(false);
      await loadProjects();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This can't be undone.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    await loadProjects();
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-slate-muted">
            What you add here appears on the public Projects page, styled exactly like this.
          </p>
        </div>
        <button
          onClick={openCreatePanel}
          className="flex items-center justify-center gap-2 bg-copper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-copper-light"
        >
          <Plus className="h-4 w-4" />
          Add project
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-slate-muted">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="mt-10 text-sm text-slate-muted">
          No projects yet — click &quot;Add project&quot; to create the first one.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <ProjectCard {...project} />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEditPanel(project)}
                  className="flex flex-1 items-center justify-center gap-1.5 border border-ink/15 py-2 text-xs font-medium text-ink transition-colors hover:border-copper hover:text-copper"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                  className="flex flex-1 items-center justify-center gap-1.5 border border-ink/15 py-2 text-xs font-medium text-red-600 transition-colors hover:border-red-400 disabled:opacity-50"
                >
                  {deletingId === project.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over form panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                {form.id ? "Edit project" : "Add project"}
              </h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-slate-muted hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Project image
                </label>
                <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-ink/20 bg-white text-slate-muted hover:border-copper">
                  {imagePreview ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized={imagePreview.startsWith("blob:")}
                      />
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-xs">Click to upload (JPG, PNG, WEBP — under 8MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-1.5 text-xs text-slate-muted">
                  Recommended: landscape photos, roughly 1200×900px, for the best fit.
                </p>
              </div>

              <Field
                label="Title"
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                required
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Location"
                  value={form.location}
                  onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                  required
                />
                <Field
                  label="Year"
                  value={form.year}
                  onChange={(v) => setForm((f) => ({ ...f, year: v }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full resize-none border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
                />
              </div>

              {error && (
                <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 bg-copper py-3 font-semibold text-ink transition-colors hover:bg-copper-light disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : form.id ? (
                  "Save changes"
                ) : (
                  "Publish project"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
      />
    </div>
  );
}