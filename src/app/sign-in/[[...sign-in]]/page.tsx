import { SignIn } from "@/lib/clerk-client";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full soft-glow -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary-fixed/20 rounded-full soft-glow -z-10 -translate-x-1/2 translate-y-1/2" />

      {/* Logo */}
      <Link href="/" className="mb-8 font-headline-md text-headline-md font-bold text-primary">
        SkillGap AI
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
            Welcome back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sign in to your career intelligence dashboard
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border border-outline-variant/20 rounded-[24px] bg-white/80 backdrop-blur-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 rounded-full font-label-md",
              footerActionLink: "text-primary",
              formFieldInput:
                "rounded-xl border-outline-variant/30 focus:border-primary",
            },
          }}
        />
      </div>

      <p className="mt-6 font-label-sm text-label-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary font-bold">
          Get started free
        </Link>
      </p>
    </div>
  );
}
