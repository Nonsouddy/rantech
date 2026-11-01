import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Users, Award, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import StatBlock from "@/components/StatBlock";

export const metadata: Metadata = {
  title: "About | RANTECH ELECTRICAL POWER COMPANY LIMITED",
  description:
    "7+ years rewinding, maintaining, installing, buying, selling and supplying distribution transformers and electrical materials across Nigeria.",
};

const timeline = [
  { year: "2019", event: "Founded as a small distribution transformer rewinding workshop in Abuja." },
  { year: "2021", event: "Opened our first dedicated testing and maintenance shop." },
  { year: "2022", event: "Began buying and selling distribution transformers directly." },
  { year: "2024", event: "Added supply of electrical materials and transformer parts." },
  { year: "2026", event: "50+ transformers handled, crews active across five states." },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Safety first",
    body: "Every technician works to documented lockout-tagout and PPE procedures, no exceptions on site.",
  },
  {
    icon: Award,
    title: "Certified work",
    body: "Test readings and sign-off on every job, so you have a paper trail for insurance and audits.",
  },
  {
    icon: Users,
    title: "Trained crews",
    body: "Ongoing technical training on both legacy oil-filled units and newer dry-type transformers.",
  },
  {
    icon: MapPin,
    title: "Field-ready",
    body: "Mobile repair units and stocked vans mean most callouts don't need a second visit.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-ink">
        <div className="container-content grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="font-mono text-xs text-copper">About RANTECH</span>
            <h1 className="mt-3 font-display text-4xl font-semibold text-paper md:text-5xl">
              Started in a workshop, still run like one
            </h1>
            <p className="mt-4 max-w-md text-paper/60">
              RANTECH began as a small transformer repair shop and grew
              into a full electrical contractor without losing the habit of
              testing everything before it leaves our hands.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 md:justify-self-end">
            <StatBlock value="7+" label="Years running" />
            <StatBlock value="50+" label="Units handled" />
            <StatBlock value="5" label="States covered" />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-content grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/site-background.png"
                alt="RANTECH technicians working on a transformer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl font-semibold text-ink">
              How we got here
            </h2>
            <ol className="mt-8 space-y-6 border-l border-ink/10 pl-6">
              {timeline.map((item) => (
                <li key={item.year} className="relative">
                  <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-copper" />
                  <span className="font-mono text-sm text-copper">{item.year}</span>
                  <p className="mt-1 text-sm leading-relaxed text-slate-muted">{item.event}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-ink">
        <div className="container-content">
          <Reveal>
            <h2 className="max-w-md font-display text-3xl font-semibold text-paper md:text-4xl">
              What guides the work
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, i) => (
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

      <CTABand
        heading="Want to work with us?"
        body="We're always looking to hear from experienced electrical technicians and reliable suppliers."
        buttonLabel="Get in touch"
      />
    </>
  );
}