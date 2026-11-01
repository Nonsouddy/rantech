import type { Metadata } from "next";
import {
  Repeat,
  Wrench,
  Cable,
  ShoppingBag,
  PackageSearch,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Services | RANTECH ELECTRICAL POWER COMPANY LIMITED",
  description:
    "Rewinding, maintenance and installation of distribution transformers, buying and selling of transformers, supply of electrical materials and parts, and general electrical contracts.",
};

const detailedServices = [
  {
    id: "rewinding",
    icon: Repeat,
    title: "Distribution transformer rewinding",
    intro:
      "Full coil rewinding and diagnostic testing for distribution transformers of every rating.",
    points: [
      "Winding failure diagnosis and rewind",
      "Bushing and tap-changer replacement and repair",
      "Oil filtration, dehydration and testing",
      "Insulation resistance and load testing on completion",
    ],
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Transformer maintenance",
    intro:
      "Scheduled inspection and maintenance contracts that catch faults before they cause an outage.",
    points: [
      "Quarterly or biannual inspection visits",
      "Oil sampling and analysis",
      "Thermographic scanning",
      "Written condition report after every visit",
    ],
  },
  {
    id: "installation",
    icon: Cable,
    title: "Transformer installation",
    intro:
      "From foundation to commissioning — installation carried out by a certified crew, signed off with test readings.",
    points: [
      "Site assessment and foundation planning",
      "Mounting, cabling and earthing",
      "Protection relay setup and calibration",
      "Commissioning and load testing before handover",
    ],
  },
  {
    id: "sales",
    icon: ShoppingBag,
    title: "Buying & selling of distribution transformers",
    intro:
      "New and reconditioned distribution transformers, bought and sold directly and specified against your load.",
    points: [
      "Distribution transformers, 25kVA – 2500kVA",
      "Reconditioned units, tested before resale",
      "Load study and correct sizing before you buy",
      "Trade-in of faulty units against a replacement",
    ],
  },
  {
    id: "supply",
    icon: PackageSearch,
    title: "Supply of electrical materials & transformer parts",
    intro:
      "Genuine transformer parts and general electrical materials, sourced and supplied for your project.",
    points: [
      "Cables, switchgear and panel components",
      "Bulk supply for contractors and estates",
      "Sourced from vetted suppliers only",
    ],
  },
  {
    id: "contracts",
    icon: FileCheck2,
    title: "General contract",
    intro:
      "General electrical contracting for organisations that need a single accountable contractor.",
    points: [
      "Turnkey electrical project execution",
      "Panel and switchgear installation or upgrade",
      "Earthing and lightning protection",
      "Documentation and sign-off for every job",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
  <section className="border-b border-ink/10 bg-ink-700">
        <div className="container-content py-16 md:py-20">
          <span className="font-mono text-xs text-copper">Services</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-paper md:text-5xl">
            Everything around the distribution transformer
          </h1>
          <p className="mt-4 max-w-lg text-paper/60">
            Rewinding, maintenance, installation, sales and supply — one
            contractor for the transformer and everything that goes with it.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-content space-y-px overflow-hidden border border-ink/10 bg-ink/10">
          {detailedServices.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.04}>
              <div
                id={service.id}
                className="grid scroll-mt-24 gap-6 bg-paper p-8 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-10 md:p-10"
              >
                <div className="flex items-center gap-4 md:block">
                  <span className="flex h-12 w-12 items-center justify-center border border-copper/30 bg-copper/10">
                    <service.icon className="h-6 w-6 text-copper" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-xs text-slate-muted md:mt-4 md:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-muted">
                    {service.intro}
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-ink/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand
        heading="Not sure which service fits your issue?"
        body="Describe the fault or the job and we'll point you to the right service — no obligation."
        buttonLabel="Ask an engineer"
      />
    </>
  );
}