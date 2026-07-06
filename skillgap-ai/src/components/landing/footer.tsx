import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface dark:bg-surface-dim border-t border-outline-variant/10 w-full py-stack-lg relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
            SkillGap AI
          </div>
          <p className="font-label-sm text-label-sm text-on-secondary-fixed-variant">
            Building the intelligence layer for your engineering career.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link
            className="font-label-sm text-label-sm text-on-secondary-fixed-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-label-sm text-label-sm text-on-secondary-fixed-variant hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="font-label-sm text-label-sm text-on-secondary-fixed-variant hover:text-primary transition-colors"
            href="#"
          >
            Cookie Policy
          </Link>
          <Link
            className="font-label-sm text-label-sm text-on-secondary-fixed-variant hover:text-primary transition-colors"
            href="#"
          >
            Contact
          </Link>
        </div>
        <div className="text-right">
          <p className="font-label-sm text-label-sm text-on-secondary-fixed-variant opacity-60">
            © 2024 SkillGap AI. All rights reserved.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </footer>
  );
}
