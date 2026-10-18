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
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Lado izquierdo: Titulares, descripción, botones y estadísticas */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div {...rise(0.05)} className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-orange-500 to-transparent" aria-hidden />
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.4em] text-orange-300/90 sm:text-xs">
                {hero.eyebrow}
              </p>
            </motion.div>

            <motion.h1
              {...rise(0.15)}
              className="font-display text-[clamp(2.8rem,7.5vw,6.5rem)] font-bold uppercase italic leading-none tracking-tight"
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
              className="mt-6 font-display text-lg font-semibold uppercase italic tracking-[0.1em] text-white/90 sm:text-xl lg:text-2xl"
            >
              {hero.tagline}
            </motion.p>

            <motion.p {...rise(0.38)} className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              {hero.subtitle}
            </motion.p>

            <motion.div {...rise(0.5)} className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
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
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6 sm:mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 mt-1 block font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-2xl font-bold italic text-white first:mt-0 sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Lado derecho: Recuadro de Clips R2 Cloudflare */}
          <motion.div {...rise(0.4)} className="lg:col-span-5 xl:col-span-5">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Glow ambiental detrás del reproductor */}
              <div
                aria-hidden
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/25 via-rose-500/20 to-purple-600/25 blur-xl opacity-75 transition-opacity duration-700"
              />

              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0e]/90 p-3 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-4">
                {/* Cabecera del reproductor */}
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                    </span>
                    <span className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-orange-400">
                      {hero.clipBadge || "Clip Oficial"}
                    </span>
                  </div>
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-display text-[9px] font-semibold uppercase tracking-wider text-white/50">
                    Overplay R2
                  </span>
                </div>

                {/* Contenedor del video 16:9 */}
                <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/80 shadow-inner">
                  {hero.clipVideoUrl ? (
                    <video
                      key={hero.clipVideoUrl}
                      src={hero.clipVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    /* Vista previa interactiva si aún no han colocado enlace de video */
                    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black/80 via-[#120a1a]/70 to-[#1a0c08]/80 p-5 text-center">
                      <div className="absolute inset-0 bg-grid opacity-25" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-110">
                          <svg className="h-5 w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="font-display text-xs font-bold uppercase tracking-wider text-white">
                          Reproductor de Clips
                        </p>
                        <p className="mt-1 max-w-[240px] text-[11px] leading-relaxed text-white/50">
                          Sube o enlaza un clip en video (MP4/WebM) desde Cloudflare R2 en el Builder
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Línea inferior sutil de degradado */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-gradient opacity-70" />
                </div>

                {/* Pie con título y subtítulo del clip */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="min-w-0 pr-2">
                    <h4 className="truncate font-display text-xs font-bold uppercase italic tracking-wide text-white sm:text-sm">
                      {hero.clipTitle || "Highlight Reel"}
                    </h4>
                    <p className="truncate text-[11px] text-white/50">
                      {hero.clipSubtitle || "Las mejores jugadas de la comunidad"}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-orange-400/90 font-display uppercase tracking-wider">
                    <span>1080p</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>60FPS</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
