import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Wrench,
  Repeat,
  ShoppingBag,
  PackageSearch,
  FileCheck2,
  Clock,
} from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import StatBlock from "@/components/StatBlock";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";
import CTABand from "@/components/CTABand";
import Reveal from "@/components/Reveal";
import { getHeroSlides, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

const services = [
  {
    icon: Repeat,
    title: "Transformer rewinding",
    description:
      "Full coil rewinding and diagnostic testing for distribution transformers of every rating.",
  },
  {
    icon: Wrench,
    title: "Maintenance & installation",
    description:
      "Scheduled maintenance and full installation, from site assessment to commissioning.",
  },
  {
    icon: ShoppingBag,
    title: "Buy & sell transformers",
    description:
      "New and reconditioned distribution transformers, bought and sold to the right specification.",
  },
  {
    icon: PackageSearch,
    title: "Materials & parts supply",
    description:
      "Electrical materials and transformer parts sourced and supplied for your project.",
  },
];

export default function Home() {
  const heroSlides = getHeroSlides();
  const projectsPreview = getProjects().slice(0, 3);

  return (
    <>
      {/* HERO */}
    <section className="relative overflow-hidden bg-ink-700">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,245,241,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,245,241,0.06)_1px,transparent_1px)] bg-[length:56px_56px]"
          aria-hidden="true"
        />
        <div className="container-content relative grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-block border border-copper/40 px-3 py-1 font-mono text-xs text-copper">
              RANTECH Electrical Power Company Limited
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-paper md:text-5xl lg:text-[3.4rem]">
              Distribution transformers, rewound, installed and supplied
              <span className="text-copper">.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-paper/60 md:text-lg">
              We rewind, maintain and install distribution transformers, buy
              and sell units directly, and supply the electrical materials
              and transformer parts that go with them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-copper px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-copper-light"
              >
                Request a quote
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-paper/20 px-6 py-3.5 font-semibold text-paper transition-colors hover:border-paper/40"
              >
                See our services
              </Link>
            </div>

            <div className="mt-14 grid max-w-md grid-cols-3 gap-6">
              <StatBlock value="7+" label="Years in the field" />
              <StatBlock value="50+" label="Transformers handled" />
              <StatBlock value="24/7" label="Emergency dispatch" />
            </div>
          </div>

          <HeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* CAPABILITY STRIP */}
      <section className="border-b border-ink/10 bg-paper-dim">
        <div className="container-content flex flex-wrap items-center justify-between gap-6 py-6 font-mono text-xs text-slate-muted md:text-sm">
          <span>Distribution transformers</span>
          <span>Rewinding & repair</span>
          <span>Electrical materials</span>
          <span>Transformer parts</span>
          <span>General contracts</span>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="section-pad">
        <div className="container-content">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
                  What we handle
                </h2>
                <p className="mt-3 max-w-md text-slate-muted">
                  One contractor for the transformer, its parts, and the electrical work around it.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-copper"
              >
                Full service list
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <ServiceCard key={service.title} index={i + 1} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section-pad bg-ink-700">
        <div className="container-content grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
              Built for plants that
              <br />
              can&apos;t afford downtime
            </h2>
            <p className="mt-5 max-w-md text-paper/60">
              Every job — rewind, installation, sale or supply — is logged
              with test readings and signed off by a certified engineer
              before we leave site.
            </p>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: "Tested, not assumed",
                body: "Oil, insulation resistance and load testing on every unit before handover.",
              },
              {
                icon: Clock,
                title: "Fast turnaround",
                body: "Most rewinds are back on site within 7–14 days, faster for emergency calls.",
              },
              {
                icon: FileCheck2,
                title: "Genuine parts",
                body: "Transformer parts and electrical materials sourced from vetted suppliers only.",
              },
              {
                icon: Wrench,
                title: "One point of contact",
                body: "The engineer who scopes the job is the one who signs it off.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <item.icon className="h-6 w-6 text-copper" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-base font-semibold text-paper">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/50">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="section-pad">
        <div className="container-content">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
                  Recent work
                </h2>
                <p className="mt-3 max-w-md text-slate-muted">
                  A sample of rewinds, installations and supply jobs completed across the last two years.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-copper"
              >
                View all projects
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projectsPreview.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <ProjectCard {...project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Have a transformer down or a job to quote?"
        body="Send us the details — rating, fault symptoms or site scope — and an engineer will get back to you within one business day."
      />
    </>
  );
}