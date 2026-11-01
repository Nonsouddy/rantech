"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, X, Loader2, ShieldCheck, User, AlertCircle, Trash2 } from "lucide-react";
import type { PublicAdmin } from "@/lib/types";

export default function AdminsManager({ currentAdminId }: { currentAdminId: string }) {
  const [admins, setAdmins] = useState<PublicAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listError, setListError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    const res = await fetch("/api/admin/create-admin");
    if (res.ok) {
      const json = await res.json();
      setAdmins(json.admins);
    }
    setLoading(false);
  }

  function openPanel() {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setPanelOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setSaving(false);
        return;
      }

      setPanelOpen(false);
      await loadAdmins();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this admin's access? This can't be undone.")) return;
    setDeletingId(id);
    setListError("");

    try {
      const res = await fetch(`/api/admin/create-admin/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        setListError(json.error || "Could not remove this admin.");
        setDeletingId(null);
        return;
      }
      await loadAdmins();
    } catch {
      setListError("Could not reach the server.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Admins</h1>
          <p className="mt-1 text-sm text-slate-muted">
            Only the super admin can create new admin accounts.
          </p>
        </div>
        <button
          onClick={openPanel}
          className="flex items-center justify-center gap-2 bg-copper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-copper-light"
        >
          <Plus className="h-4 w-4" />
          New admin
        </button>
      </div>

      {listError && (
        <div className="mt-4 flex items-start gap-2 border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {listError}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-slate-muted">Loading admins…</p>
      ) : (
        <div className="mt-8 divide-y divide-ink/10 border border-ink/10 bg-white">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center gap-4 px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/10 bg-paper-dim">
                {admin.role === "super_admin" ? (
                  <ShieldCheck className="h-4 w-4 text-copper" strokeWidth={1.75} />
                ) : (
                  <User className="h-4 w-4 text-slate-muted" strokeWidth={1.75} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {admin.name}
                  {admin.id === currentAdminId && (
                    <span className="ml-2 text-xs font-normal text-slate-muted">(you)</span>
                  )}
                </p>
                <p className="truncate text-xs text-slate-muted">{admin.email}</p>
              </div>
              <span
                className={`shrink-0 px-2.5 py-1 text-xs font-medium ${
                  admin.role === "super_admin"
                    ? "bg-copper/10 text-copper"
                    : "bg-ink/5 text-slate-muted"
                }`}
              >
                {admin.role === "super_admin" ? "Super admin" : "Admin"}
              </span>
              {admin.role !== "super_admin" && (
                <button
                  onClick={() => handleDelete(admin.id)}
                  disabled={deletingId === admin.id}
                  className="flex shrink-0 items-center gap-1.5 border border-ink/15 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:border-red-400 disabled:opacity-50"
                >
                  {deletingId === admin.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">New admin</h2>
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
                <label className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Temporary password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
                />
                <p className="mt-1.5 text-xs text-slate-muted">
                  Share this with the new admin securely — they can&apos;t change it from the
                  dashboard yet, so pick something they can use right away.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 bg-copper py-3 font-semibold text-ink transition-colors hover:bg-copper-light disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating
                  </>
                ) : (
                  "Create admin"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}