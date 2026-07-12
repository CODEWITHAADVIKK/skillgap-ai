import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-surface/80 backdrop-blur-xl dark:bg-surface-container/80 border-b border-outline-variant/10 dark:border-outline/5 shadow-sm">
      <nav className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto h-20">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-surface-bright tracking-tight">
            SkillGap AI
          </span>
          <div className="hidden lg:flex items-center gap-6">
            <Link
              className="font-body-md text-body-md text-primary dark:text-inverse-primary font-semibold transition-all duration-300 hover:opacity-80"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-all duration-300 hover:opacity-80"
              href="#"
            >
              Solutions
            </Link>
            <Link
              className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-all duration-300 hover:opacity-80"
              href="/resources"
            >
              Resources
            </Link>
            <Link
              className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-all duration-300 hover:opacity-80"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="font-body-md text-body-md text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary transition-all duration-300 hover:opacity-80"
              href="/about"
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="px-6 py-2 font-label-md text-label-md text-on-surface hover:text-primary transition-colors"
            href="/sign-in"
          >
            Log in
          </Link>
          <Link
            className="px-6 py-3 bg-on-secondary-fixed text-white rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all duration-150"
            href="/sign-up"
          >
            Get started free
          </Link>
        </div>
      </nav>
    </header>
  );
}
