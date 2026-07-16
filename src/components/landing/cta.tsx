import Link from "next/link";
import Image from "next/image";

export function Cta() {
  return (
    <section className="py-12 md:py-20 w-full max-w-7xl mx-auto px-6">
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[48px] p-12 lg:p-24 relative overflow-hidden text-center group">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="font-display-xl text-display-xl tracking-tight text-balance">
            Ready to close your <span className="text-primary italic">skill gap?</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Join thousands of students and professionals who are making
            data-driven career moves. Start your free analysis today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <Link
              className="px-10 py-5 bg-on-secondary-fixed text-white rounded-full font-label-md text-label-md hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl"
              href="/sign-up"
            >
              Get started for free
            </Link>
            <Link
              className="px-10 py-5 bg-white border border-outline-variant/20 rounded-full font-label-md text-label-md hover:bg-surface-container transition-all"
              href="/demo"
            >
              View live demo
            </Link>
          </div>
          <div className="flex justify-center items-center gap-4 pt-8">
            <div className="flex -space-x-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container-high">
                <Image
                  fill
                  className="object-cover"
                  alt="Portrait of a professional young software developer, clean studio lighting, confident expression, minimalist office background, modern tech professional aesthetic."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ifCzU3UgXW-qhthG-6Cco4lYy8ErOaXzulJMUUpxMjpNfM3dneZjzsjQVHFICfN1tDGCelPo77eKhgSQ05d_0wYDTr05vS-3NTGBCtMMt-p55ah9C037BasHpJTmHyNua2hx8aCVzRwafsTn8qDvAhJh-XRfTiJIpW0JyNHMqFaPTrdMz41SFYAIry3AsVH0K9SDtWQH0to0uKJEe93rmqTNwiGWun4SCEDP09TlxJCrgBbRIGUP"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container-high">
                <Image
                  fill
                  className="object-cover"
                  alt="Portrait of a diverse female data scientist smiling, soft natural lighting, high-end professional photography, minimalist aesthetic with cool tones."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrCmGRZcteiFCL_zZ2rGoIup6yyyv19fMWtNBfcIO-fS7uXf1V4v5uEXh0KGldqmhJBApPIRnY2cH37hAhPYTdGs_CLvKJvQ-cB8Zf19GMqYqvt6uXsBKxQbMUIp3W2Pbk5GWCqbqUPvgiXWo5LW72zxJnChZKZKMOoAew80gS_8vL9Oi-tjYGmN6AWKH13OsjdJxpg68t0e0mw_0SzhajyQmhJY4BEaVTH5UffABzCf0D76Qe61DA"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container-high">
                <Image
                  fill
                  className="object-cover"
                  alt="Portrait of a tech lead in their late 20s, thoughtful expression, wearing glasses, soft professional bokeh background, clean premium look."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF96yX-TugCabAPY52qd8sOFy6lQkZJSUxp8DFyY5sYYnz3H3K6SxcYrcFybxmwjnerrFW3dZ5ASi3swAG2cRmAz3XkzK9aB78twFyDIX2KrGe1_-EAHjicPHXu7N52UTyJeGkC6-wV9WoWmO25cSprQ75idNb882kaI0DTOZ0Qd3-cm7CUEyb-nU1oBJQ5EotjmcIC6IIZ4joHUMM_G-8YtcoSoW8ccs_e2D4NtIb-GVzhOU5r3Vy"
                />
              </div>
            </div>
            <p className="text-label-sm text-on-surface-variant font-medium">
              4.9/5 stars from early adopters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
