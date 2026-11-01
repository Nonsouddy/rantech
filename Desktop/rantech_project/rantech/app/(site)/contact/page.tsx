import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact | RANTECH ELECTRICAL POWER COMPANY LIMITED",
  description:
    "Request a quote or report a transformer fault. Emergency callouts dispatched within 60 minutes.",
};

const details = [
  { icon: Phone, label: "Call us", value: "+2348061597152", href: "tel:+2348061597152" },
  { icon: Mail, label: "Email us", value: "info@rantechelectrical.com", href: "mailto:info@rantechelectrical.com" },
  { icon: MapPin, label: "Visit us", value: "Low Cost Estate,Abakiliki Ebonyi, Nigeria" },
  { icon: Clock, label: "Emergency line", value: "24/7, dispatched within 60 minutes" },
];

export default function ContactPage() {
  return (
    <>
   <section className="border-b border-ink/10 bg-ink-700">
        <div className="container-content py-16 md:py-20">
          <span className="font-mono text-xs text-copper">Contact</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-paper md:text-5xl">
            Tell us what needs power
          </h1>
          <p className="mt-4 max-w-lg text-paper/60">
            Quotes, callouts and general enquiries — an engineer replies within one business day.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-content grid gap-14 md:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-8">
              {details.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-copper/30 bg-copper/10">
                    <item.icon className="h-5 w-5 text-copper" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-muted">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="mt-1 block font-display text-lg text-ink hover:text-copper">
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-display text-lg text-ink">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-ink/10 bg-white/40 p-6 md:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}