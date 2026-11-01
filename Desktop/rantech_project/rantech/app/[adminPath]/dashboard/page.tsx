import Link from "next/link";
import { FolderKanban, GalleryHorizontal, Inbox, MailCheck } from "lucide-react";
import { getProjects, getHeroSlides, getSubmissions } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardOverview({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const projects = getProjects();
  const heroSlides = getHeroSlides();
  const submissions = getSubmissions();
  const pending = submissions.filter((s) => !s.confirmationSent).length;

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      href: `/${adminPath}/dashboard/projects`,
    },
    {
      label: "Hero slides",
      value: heroSlides.length,
      icon: GalleryHorizontal,
      href: `/${adminPath}/dashboard/hero`,
    },
    {
      label: "Total submissions",
      value: submissions.length,
      icon: Inbox,
      href: `/${adminPath}/dashboard/submissions`,
    },
    {
      label: "Awaiting confirmation email",
      value: pending,
      icon: MailCheck,
      href: `/${adminPath}/dashboard/submissions`,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Overview</h1>
      <p className="mt-1 text-sm text-slate-muted">
        A quick snapshot of what&apos;s on the site right now.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-ink/10 bg-white p-6 transition-colors hover:border-copper/40"
          >
            <stat.icon className="h-5 w-5 text-copper" strokeWidth={1.75} />
            <p className="mt-4 font-display text-3xl font-semibold text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-slate-muted group-hover:text-ink">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Recent submissions</h2>
        {submissions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-muted">No enquiries yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10">
            {submissions.slice(0, 5).map((s) => (
              <li key={s.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-slate-muted">{s.service} · {s.email}</p>
                </div>
                <span
                  className={`w-fit px-2.5 py-1 text-xs font-medium ${
                    s.confirmationSent
                      ? "bg-signal/10 text-signal"
                      : "bg-copper/10 text-copper"
                  }`}
                >
                  {s.confirmationSent ? "Confirmed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}