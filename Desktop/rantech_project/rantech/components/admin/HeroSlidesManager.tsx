"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2, ImagePlus, GripVertical } from "lucide-react";
import type { HeroSlide } from "@/lib/types";

type FormState = {
  id: string | null;
  caption: string;
  order: string;
};

const emptyForm: FormState = { id: null, caption: "", order: "1" };

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void loadSlides();
  }, []);

  async function loadSlides() {
    setLoading(true);
    const res = await fetch("/api/admin/hero");
    if (res.ok) {
      const json = await res.json();
      setSlides(json.slides);
    }
    setLoading(false);
  }

  function openCreatePanel() {
    setForm({ ...emptyForm, order: String(slides.length + 1) });
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setPanelOpen(true);
  }

  function openEditPanel(slide: HeroSlide) {
    setForm({ id: slide.id, caption: slide.caption, order: String(slide.order) });
    setImageFile(null);
    setImagePreview(slide.image);
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

    if (!form.id && !imageFile) {
      setError("Please choose an image for this slide.");
      setSaving(false);
      return;
    }

    const fd = new FormData();
    fd.set("caption", form.caption);
    fd.set("order", form.order);
    if (imageFile) fd.set("image", imageFile);

    const url = form.id ? `/api/admin/hero/${form.id}` : "/api/admin/hero";
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
      await loadSlides();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this hero slide? This can't be undone.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
    await loadSlides();
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Hero slides</h1>
          <p className="mt-1 text-sm text-slate-muted">
            These rotate automatically in the homepage hero, in the order set below.
          </p>
        </div>
        <button
          onClick={openCreatePanel}
          className="flex items-center justify-center gap-2 bg-copper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-copper-light"
        >
          <Plus className="h-4 w-4" />
          Add slide
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-slate-muted">Loading slides…</p>
      ) : slides.length === 0 ? (
        <p className="mt-10 text-sm text-slate-muted">
          No hero slides yet — the homepage carousel will be empty until you add one.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex flex-col gap-4 border border-ink/10 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-2 text-slate-muted">
                <GripVertical className="h-4 w-4" />
                <span className="font-mono text-xs">#{slide.order}</span>
              </div>
              <div className="relative h-24 w-full shrink-0 overflow-hidden bg-ink/5 sm:w-36">
                <Image src={slide.image} alt={slide.caption} fill className="object-cover" />
              </div>
              <p className="flex-1 text-sm text-ink">{slide.caption}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditPanel(slide)}
                  className="flex items-center gap-1.5 border border-ink/15 px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-copper hover:text-copper"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={deletingId === slide.id}
                  className="flex items-center gap-1.5 border border-ink/15 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:border-red-400 disabled:opacity-50"
                >
                  {deletingId === slide.id ? (
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

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                {form.id ? "Edit slide" : "Add slide"}
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
                  Slide image
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
                  Recommended: landscape photos, roughly 1400×1000px.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Caption</label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  required
                  placeholder="e.g. Distribution transformer rewinding"
                  className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Display order
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  required
                  className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
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
                  "Publish slide"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}