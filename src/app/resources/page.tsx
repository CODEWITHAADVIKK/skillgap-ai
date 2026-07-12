import Link from "next/link";
import { Header } from "@/components/landing/header";

const RESOURCES = [
  {
    category: "Career Guides",
    items: [
      {
        title: "The Ultimate Skill Gap Analysis Guide",
        description: "Step-by-step framework for identifying and closing skill gaps in your engineering career.",
        readTime: "12 min read",
        tag: "Guide",
        href: "#",
        icon: "menu_book",
      },
      {
        title: "How to Beat ATS Systems in 2025",
        description: "Proven techniques to optimize your resume for applicant tracking systems.",
        readTime: "8 min read",
        tag: "Guide",
        href: "#",
        icon: "smart_toy",
      },
      {
        title: "GitHub Portfolio That Gets You Hired",
        description: "What top tech companies actually look for in your GitHub profile.",
        readTime: "10 min read",
        tag: "Guide",
        href: "#",
        icon: "code",
      },
    ],
  },
  {
    category: "Interview Prep",
    items: [
      {
        title: "System Design Interview Cheatsheet",
        description: "The complete framework for answering any system design question at FAANG companies.",
        readTime: "20 min read",
        tag: "Cheatsheet",
        href: "#",
        icon: "architecture",
      },
      {
        title: "STAR Method Mastery for Behavioral Rounds",
        description: "50+ example answers to the most common behavioral interview questions.",
        readTime: "15 min read",
        tag: "Templates",
        href: "#",
        icon: "psychology",
      },
    ],
  },
  {
    category: "Market Intelligence",
    items: [
      {
        title: "2025 Engineering Salary Report",
        description: "Comprehensive salary data for software engineers across roles, levels, and locations.",
        readTime: "6 min read",
        tag: "Report",
        href: "#",
        icon: "trending_up",
      },
      {
        title: "Top Skills by Role — 2025 Edition",
        description: "The most in-demand skills for every engineering role, updated quarterly.",
        readTime: "9 min read",
        tag: "Report",
        href: "#",
        icon: "bar_chart",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-16 px-gutter max-w-container-max mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full text-on-primary-fixed text-label-sm font-label-sm mb-6">
          <span className="material-symbols-outlined text-[18px]">library_books</span>
          Free Resources
        </div>
        <h1 className="font-display-xl text-display-xl leading-tight mb-6">
          Everything you need to <span className="italic text-primary">get hired.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Guides, templates, cheatsheets, and market intelligence — all free. Written by engineers who&apos;ve been there.
        </p>
      </section>

      {/* Resources */}
      <section className="pb-20 px-gutter max-w-container-max mx-auto">
        {RESOURCES.map((section) => (
          <div key={section.category} className="mb-14">
            <h2 className="font-headline-md text-headline-md font-bold mb-6">{section.category}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10 hover:shadow-md hover:border-primary/20 transition-all block"
                >
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-[24px]">{item.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">{item.readTime}</span>
                  </div>
                  <h3 className="font-bold text-body-md mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-on-surface-variant">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-surface-container-low px-gutter">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg font-bold mb-4">Stay ahead of the market</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Get weekly market insights, trending skills, and career tips delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-outline-variant/30 px-5 py-3 outline-none focus:border-primary font-body-md text-body-md"
            />
            <button
              type="button"
              className="px-6 py-3 bg-primary text-white rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity shrink-0"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-[11px] text-on-surface-variant/60">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
