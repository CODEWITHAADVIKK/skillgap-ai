import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Literata } from "next/font/google";
import { ClerkProvider } from "@/lib/clerk-client";
import { Providers } from "@/components/providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillGap AI | Premium Career Intelligence",
  description:
    "SkillGap AI analyzes your resume and GitHub, compares real-time job requirements, and shows you exactly what skills and projects you need to get hired.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} ${literata.variable} light`}>
        <body className="font-body-md text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden min-h-screen">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
