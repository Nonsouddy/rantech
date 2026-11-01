import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CTABand({
  heading,
  body,
  buttonLabel = "Talk to an engineer",
}: {
  heading: string;
  body: string;
  buttonLabel?: string;
}) {
  return (
   <section className="bg-ink-700">
      <div className="container-content flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-paper md:text-3xl">{heading}</h2>
          <p className="mt-3 text-paper/60">{body}</p>
        </div>
        <Link
          href="/contact"
          className="group inline-flex shrink-0 items-center gap-2 bg-copper px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-copper-light"
        >
          {buttonLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}