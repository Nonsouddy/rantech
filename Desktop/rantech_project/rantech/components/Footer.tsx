import Link from "next/link";
import { Zap, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper/70">
      <div className="container-content grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-copper/50 bg-copper/10">
              <Zap className="h-4 w-4 text-copper" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold text-paper">RANTECH</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/50">
            Distribution transformer rewinding, maintenance, installation,
            sales and electrical materials supply.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper">Services</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/services#rewinding" className="hover:text-copper">Rewinding</Link></li>
            <li><Link href="/services#maintenance" className="hover:text-copper">Maintenance</Link></li>
            <li><Link href="/services#installation" className="hover:text-copper">Installation</Link></li>
            <li><Link href="/services#sales" className="hover:text-copper">Buy & sell transformers</Link></li>
            <li><Link href="/services#supply" className="hover:text-copper">Materials & parts supply</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper">Company</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-copper">About us</Link></li>
            <li><Link href="/projects" className="hover:text-copper">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-copper">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-paper">Reach us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
              <span>Low Cost Estate,Abakiliki Ebonyi, Nigeria</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-copper" />
              <a href="tel:+2348061597152" className="hover:text-copper">+234 8061597152</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-copper" />
              <a href="mailto:info@rantechelectrical.com" className="hover:text-copper">info@rantechelectrical.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-xs text-paper/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} RANTECH ELECTRICAL POWER COMPANY LIMITED. All rights reserved.</p>
          <p className="font-mono">24/7 emergency line dispatched within 60 minutes</p>
        </div>
      </div>
    </footer>
  );
}