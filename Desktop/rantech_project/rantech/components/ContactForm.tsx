"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const serviceOptions = [
  "Transformer rewinding",
  "Transformer maintenance",
  "Transformer installation",
  "Buy / sell distribution transformer",
  "Electrical materials & parts supply",
  "General contract",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      service: data.get("service"),
      message: data.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setErrorMsg("Could not reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-3 border border-copper/30 bg-copper/10 p-8"
      >
        <CheckCircle2 className="h-8 w-8 text-copper" />
        <h3 className="font-display text-xl font-semibold text-ink">Request received</h3>
        <p className="text-sm text-slate-muted">
          An engineer will get back to you within one business day. For anything
          urgent, call the emergency line listed on this page.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Phone number" name="phone" type="tel" required />
      </div>
      <Field label="Email address" name="email" type="email" required />

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">
          Service needed
        </label>
        <select
          name="service"
          required
          className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
        >
          <option value="">Select a service</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">
          Tell us about the job
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Transformer rating, fault symptoms, site location, timeline..."
          className="w-full resize-none border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-muted/60 focus:border-copper"
        />
      </div>

      {status === "error" && (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 bg-copper px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-copper-light disabled:opacity-70 sm:w-auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "submitting" ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Send request
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-copper"
      />
    </div>
  );
}