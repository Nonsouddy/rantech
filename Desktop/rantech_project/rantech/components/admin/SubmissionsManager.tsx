"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import type { Submission } from "@/lib/types";

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    void loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setLoading(true);
    const res = await fetch("/api/admin/submissions");
    if (res.ok) {
      const json = await res.json();
      setSubmissions(json.submissions);
    }
    setLoading(false);
  }

  async function handleSendEmail(id: string) {
    setSendingId(id);
    setErrorId(null);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/submissions/${id}/send-email`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorId(id);
        setErrorMsg(json.error || "Failed to send email.");
        setSendingId(null);
        return;
      }

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? json.submission : s))
      );
    } catch {
      setErrorId(id);
      setErrorMsg("Could not reach the server.");
    } finally {
      setSendingId(null);
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Submissions</h1>
      <p className="mt-1 text-sm text-slate-muted">
        Enquiries from the contact form. Send a confirmation email once you&apos;ve reviewed one.
      </p>

      {loading ? (
        <p className="mt-10 text-sm text-slate-muted">Loading submissions…</p>
      ) : submissions.length === 0 ? (
        <p className="mt-10 text-sm text-slate-muted">No enquiries yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-ink/10 border border-ink/10 bg-white">
          {submissions.map((s) => {
            const expanded = expandedId === s.id;
            return (
              <div key={s.id}>
                <button
                  onClick={() => setExpandedId(expanded ? null : s.id)}
                  className="flex w-full flex-col gap-2 px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink">{s.name}</p>
                      <span className="text-xs text-slate-muted">·</span>
                      <span className="text-xs text-slate-muted">{s.service}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-muted">
                      {s.email} · {s.phone}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-slate-muted">{formatDate(s.createdAt)}</span>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium ${
                        s.confirmationSent
                          ? "bg-signal/10 text-signal"
                          : "bg-copper/10 text-copper"
                      }`}
                    >
                      {s.confirmationSent ? "Confirmed" : "Pending"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-muted transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-ink/10 bg-paper-dim px-5 py-4">
                    <p className="text-sm leading-relaxed text-ink/80">{s.message}</p>

                    {errorId === s.id && (
                      <div className="mt-3 flex items-start gap-2 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleSendEmail(s.id)}
                        disabled={sendingId === s.id || s.confirmationSent}
                        className="flex items-center gap-2 bg-copper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {sendingId === s.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending
                          </>
                        ) : s.confirmationSent ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmation sent
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" />
                            Send confirmation email
                          </>
                        )}
                      </button>
                      {s.confirmationSent && s.confirmationSentAt && (
                        <span className="text-xs text-slate-muted">
                          Sent {formatDate(s.confirmationSentAt)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}