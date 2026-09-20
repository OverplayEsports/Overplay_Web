import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Swords } from "lucide-react";
import { Button } from "./ui/Button";
import { DEFAULT_HERO_DATA, fetchHeroData, type HeroData } from "../data/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hero de alto impacto: fondo cinematográfico, orbes degradados, partículas y profundidad. */
export function Hero() {
  const reduce = useReducedMotion();
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO_DATA);

  useEffect(() => {
    let alive = true;
    fetchHeroData().then((data) => {
      if (!alive) return;
      if (data) setHero(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const stats = [
    { value: hero.editionNumber || "04", label: "Ediciones" },
    { value: hero.playersCount || "+300", label: "Jugadores" },
    { value: hero.communityCount || "+1.2K", label: "Comunidad" },
  ];

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 53 + 7) % 100}%`,
        top: `${10 + ((i * 37) % 80)}%`,
        size: 2 + (i % 3),
        delay: (i % 7) * 0.9,
      })),
    []
  );

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 34 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section
      id="inicio"
      aria-label="Presentación de Overplay"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Fondo cinematográfico */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src={hero.backgroundImage || "/images/hero-bg.jpg"}
          alt=""
          className="h-full w-full scale-105 object-cover opacity-55 motion-safe:animate-kenburns"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050506]/85 via-[#050506]/45 to-[#050506]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050506]/80 via-transparent to-[#050506]/60" />
      </div>

      {/* Orbes ambientales */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-orange-600/22 blur-[130px] motion-safe:animate-float-slow" />
        <div className="absolute -right-48 top-10 h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-[140px] motion-safe:animate-float-slower" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-rose-600/16 blur-[150px] motion-safe:animate-float-slow" />
      </div>

      {/* Grid técnico + viñeta */}
      <div
        aria-hidden
        className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black_30%,transparent_78%)] opacity-70"
      />
      <div
        aria-hidden
        className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_35%,#050506_100%)] opacity-80"
      />

      {/* Partículas sutiles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-white/50 motion-safe:animate-drift"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-40">
        <motion.div {...rise(0.05)} className="mb-7 flex items-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent" aria-hidden />
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.4em] text-orange-300/90 sm:text-xs">
            {hero.eyebrow}
          </p>
        </motion.div>

        <motion.h1
          {...rise(0.15)}
          className="font-display text-[clamp(3.2rem,10vw,8.5rem)] font-bold uppercase italic leading-none tracking-tight"
        >
          <span className="text-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
            {hero.titlePrefix}
          </span>
          <span className="text-brand-gradient drop-shadow-[0_0_45px_rgba(249,115,22,0.35)]">
            {hero.titleHighlight}
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.28)}
          className="mt-7 font-display text-xl font-semibold uppercase italic tracking-[0.1em] text-white/90 sm:text-2xl lg:text-3xl"
        >
          {hero.tagline}
        </motion.p>

        <motion.p {...rise(0.38)} className="mt-4 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
          {hero.subtitle}
        </motion.p>

        <motion.div {...rise(0.5)} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          {hero.primaryButtonText && (
            <Button href={hero.primaryButtonUrl || "#/eventos"} ariaLabel={hero.primaryButtonText}>
              <Swords className="h-4 w-4" />
              {hero.primaryButtonText}
            </Button>
          )}
          {hero.secondaryButtonText && (
            <Button href={hero.secondaryButtonUrl || "#/nosotros"} variant="ghost" ariaLabel={hero.secondaryButtonText}>
              {hero.secondaryButtonText}
            </Button>
          )}
        </motion.div>

        {/* Estadísticas */}
        <motion.dl
          {...rise(0.64)}
          className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8 sm:mt-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 mt-1 block font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                {stat.label}
              </dt>
              <dd className="font-display text-3xl font-bold italic text-white first:mt-0 sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Indicador de scroll */}
      <motion.a
        href="#eventos"
        aria-label="Desplazarse a la sección de Eventos"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80 sm:flex"
      >
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em]">Scroll</span>
        <ChevronDown className="h-4 w-4 motion-safe:animate-bounce" />
      </motion.a>
    </section>
  );
}
