import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-ink px-6 text-center">
      <Zap className="h-8 w-8 text-copper" />
      <p className="mt-6 font-mono text-sm text-copper">404 / circuit open</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper md:text-4xl">
        This page isn&apos;t connected
      </h1>
      <p className="mt-3 max-w-sm text-paper/50">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 bg-copper px-6 py-3 font-semibold text-ink hover:bg-copper-light"
      >
        Back to home
      </Link>
    </section>
  );
}