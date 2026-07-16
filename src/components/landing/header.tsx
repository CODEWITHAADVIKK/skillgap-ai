"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Demo", href: "/demo" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
      <nav className="flex justify-between items-center w-full max-w-7xl mx-auto px-6 py-4 h-20">
        {/* Left: Logo */}
        <div className="flex flex-1 justify-start">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight shrink-0">
            SkillGap AI
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (centered absolutely in the header) */}
        <div className="hidden lg:flex justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all duration-300 font-medium"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-1 justify-end items-center gap-4">
          <Link
            className="hidden sm:inline-flex px-6 py-2 font-label-md text-label-md text-on-surface hover:text-primary transition-colors"
            href="/sign-in"
          >
            Log in
          </Link>
          <Link
            className="hidden sm:inline-flex px-6 py-3 bg-on-surface text-white rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all duration-150"
            href="/sign-up"
          >
            Get started free
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center size-10 rounded-xl hover:bg-surface-container-high transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-outline-variant/10 bg-surface/95 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col px-6 py-6 gap-1 max-w-container-max mx-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                className="px-4 py-3 rounded-xl font-body-md text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-outline-variant/10 mt-4 pt-4 flex flex-col gap-3">
              <Link
                className="px-4 py-3 font-label-md text-label-md text-on-surface hover:text-primary transition-colors text-center"
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                className="px-6 py-3 bg-on-surface text-white rounded-full font-label-md text-label-md hover:opacity-90 transition-all text-center"
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
