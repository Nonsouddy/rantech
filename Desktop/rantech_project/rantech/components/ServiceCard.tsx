import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  id,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  id?: string;
  index: number;
}) {
  return (
    <div
      id={id}
      className="group relative border border-ink/10 bg-white/40 p-7 transition-colors hover:border-copper/40 hover:bg-white/70 scroll-mt-24"
    >
      <span className="font-mono text-xs text-slate-muted">{String(index).padStart(2, "0")}</span>
      <Icon className="mt-5 h-7 w-7 text-copper" strokeWidth={1.75} />
      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-muted">{description}</p>
      <Link
        href="/contact"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ink transition-colors group-hover:text-copper"
      >
        Request this service
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}