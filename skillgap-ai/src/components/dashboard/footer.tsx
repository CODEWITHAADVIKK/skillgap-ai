import Link from "next/link";

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/contact", label: "Contact" },
] as const;

export function DashboardFooter() {
  return (
    <footer className="border-t border-outline-variant/20 bg-[#F9FAFB] px-8 py-6">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-headline-md text-headline-md font-bold text-on-surface">
          SkillGap AI
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
