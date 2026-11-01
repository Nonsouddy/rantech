"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  GalleryHorizontal,
  Inbox,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { SessionPayload } from "@/lib/auth";

export default function AdminShell({
  adminPath,
  session,
  children,
}: {
  adminPath: string;
  session: SessionPayload;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const base = `/${adminPath}/dashboard`;

  const links = [
    { href: base, label: "Overview", icon: LayoutDashboard, exact: true },
    { href: `${base}/projects`, label: "Projects", icon: FolderKanban },
    { href: `${base}/hero`, label: "Hero slides", icon: GalleryHorizontal },
    { href: `${base}/submissions`, label: "Submissions", icon: Inbox },
    ...(session.role === "super_admin"
      ? [{ href: `${base}/admins`, label: "Admins", icon: Users }]
      : []),
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${adminPath}`);
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="relative h-9 w-9 shrink-0">
          <Image
            src="/svg/logo.svg"
            alt="RANTECH ELECTRICAL POWER COMPANY LIMITED logo"
            fill
            priority
            className="object-contain"
          />
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-paper">RANTECH</p>
          <p className="text-[11px] text-paper/40">Admin dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-copper/10 text-copper"
                  : "text-paper/60 hover:bg-white/5 hover:text-paper"
              }`}
            >
              <link.icon className="h-4 w-4" strokeWidth={1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-sm font-medium text-paper">{session.name}</p>
        <p className="truncate text-xs text-paper/40">
          {session.role === "super_admin" ? "Super admin" : "Admin"} · {session.email}
        </p>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 border border-white/10 px-3 py-2 text-sm font-medium text-paper/70 transition-colors hover:border-copper/40 hover:text-copper"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-ink lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center text-paper/60"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen w-full flex-col  lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink/10 bg-paper/95 px-4 backdrop-blur-sm sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="font-display text-sm font-semibold text-ink-700 lg:hidden">RANTECH Admin</p>
          <div className="hidden items-center gap-2 text-sm text-slate-muted lg:flex">
            Signed in as <span className="font-medium text-ink">{session.name}</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}