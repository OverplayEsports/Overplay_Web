import { useState, useEffect } from "react";
import { Swords } from "lucide-react";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { DEFAULT_CTA_DATA, fetchCtaData, type CtaData } from "../data/site";

/** CTA final: panel de alto impacto con glow ambiental de marca. */
export function FinalCTA() {
  const [cta, setCta] = useState<CtaData>(DEFAULT_CTA_DATA);

  useEffect(() => {
    let alive = true;
    fetchCtaData().then((data) => {
      if (!alive) return;
      if (data) setCta(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="participar" aria-label="Llamada a la acción para participar" className="relative scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal y={32}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-24">
            {/* Fondo: imagen atenuada + degradados */}
            <div aria-hidden className="absolute inset-0">
              <img
                src={cta.bannerImage || "/images/tourney-banner.jpg"}
                alt=""
                className="h-full w-full object-cover opacity-25"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[#070709]/80" />
              <div className="absolute -left-24 top-[-6rem] h-80 w-80 rounded-full bg-orange-600/25 blur-[110px] motion-safe:animate-float-slow" />
              <div className="absolute -right-24 bottom-[-6rem] h-80 w-80 rounded-full bg-violet-600/25 blur-[110px] motion-safe:animate-float-slower" />
              <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent_80%)]" />
            </div>

            {/* Bordes luminosos */}
            <span aria-hidden className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />
            <span aria-hidden className="absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />

            <div className="relative">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.4em] text-orange-300/90 sm:text-xs">
                {cta.eyebrow}
              </p>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold uppercase italic leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {cta.titleMain}
                <span className="text-brand-gradient drop-shadow-[0_0_40px_rgba(249,115,22,0.35)]">
                  {cta.titleHighlight}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
                {cta.description}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-tournament-registration"));
                  }}
                  href={cta.buttonUrl || "#inscripcion"}
                  ariaLabel={cta.buttonText}
                  className="px-9 py-4 text-base"
                >
                  <Swords className="h-4.5 w-4.5" />
                  {cta.buttonText}
                </Button>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

