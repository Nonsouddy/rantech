"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-ink/95 backdrop-blur-sm border-b border-white/10" : "bg-ink"
        }`}
    >
      <div className="container-content flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
            <Image
              src="/svg/logo.svg"
              alt="RANTECH ELECTRICAL POWER COMPANY LIMITED logo"
              fill
              priority
              className="object-contain"
            />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-paper">
              RANTECH
            </span>
            <span className="mt-1 font-mono text-[10px] tracking-wide text-paper/40">
              RC: 7981659
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${active ? "text-paper" : "text-paper/60 hover:text-paper"
                  }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-4 -bottom-[1px] h-[2px] bg-copper"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="ml-3 rounded-sm bg-copper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-copper-light"
          >
            Get a quote
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center text-paper md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-ink md:hidden"
          >
            <div className="container-content flex flex-col py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 text-base font-medium ${pathname === link.href ? "text-copper" : "text-paper/70"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-2 mb-3 rounded-sm bg-copper px-4 py-3 text-center text-sm font-semibold text-ink"
              >
                Get a quote
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}