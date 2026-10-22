import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Swords, Play, Pause } from "lucide-react";
import { Button } from "./ui/Button";
import { DEFAULT_HERO_DATA, fetchHeroData, type HeroData } from "../data/site";
import { cn } from "../utils/cn";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hero de alto impacto: fondo cinematográfico, orbes degradados, partículas y profundidad. */
export function Hero() {
  const reduce = useReducedMotion();
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO_DATA);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 pb-20 sm:pb-28 pt-28 sm:pt-36 lg:pt-40">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* Lado izquierdo: Titulares, descripción, botones y estadísticas */}
          <div className="lg:col-span-6 xl:col-span-6">
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
              className="mt-10 grid max-w-lg grid-cols-3 gap-3 sm:gap-6 border-t border-white/10 pt-6 sm:mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 mt-1 block font-display text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white/45 truncate">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-xl sm:text-2xl md:text-3xl font-bold italic text-white first:mt-0">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Lado derecho: Pantalla Visualizador de Clips sin marcos (más grande y simétrico) */}
          <motion.div {...rise(0.4)} className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              {/* Glow ambiental detrás del reproductor */}
              <div
                aria-hidden
                className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-500/20 via-rose-500/15 to-purple-600/20 blur-2xl opacity-75 pointer-events-none"
              />

              {/* Pantalla visualizador directa (sin marcos ni casillas exteriores) */}
              <div
                onClick={togglePlay}
                className="group relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black shadow-2xl ring-1 ring-white/10 cursor-pointer select-none"
              >
                {hero.clipVideoUrl ? (
                  <video
                    ref={videoRef}
                    key={hero.clipVideoUrl}
                    src={hero.clipVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* Vista previa visual cuando no hay video cargado */
                  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c0c10] via-[#120a1a] to-[#1a0c08] p-6 text-center">
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </div>
                      <p className="font-display text-sm font-bold uppercase tracking-wider text-white">
                        Pantalla Visualizador
                      </p>
                      <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-white/50">
                        Sube o enlaza un clip en video MP4 desde Cloudflare R2 en el Builder
                      </p>
                    </div>
                  </div>
                )}

                {/* Overlay interactivo para pausar / continuar al pasar el mouse por encima */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 pointer-events-none",
                    isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100 bg-black/55"
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md shadow-2xl transition-transform duration-200 group-hover:scale-110">
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current text-orange-400" />
                    ) : (
                      <Play className="h-6 w-6 fill-current text-orange-400 ml-0.5" />
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-black/70 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md">
                    {isPlaying ? "Clic para pausar" : "Clic para continuar"}
                  </span>
                </div>
              </div>

              {/* Casilla para el título desplegada desde el borde inferior del player */}
              {hero.clipTitle && (
                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0c0c10]/95 px-6 py-2.5 shadow-xl backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                    </span>
                    <h3 className="font-display text-xs sm:text-sm font-bold uppercase italic tracking-wider text-white">
                      {hero.clipTitle}
                    </h3>
                  </div>
                </div>
              )}
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
