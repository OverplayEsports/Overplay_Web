import { useState, useEffect } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  FilePenLine,
  Medal,
  Radio,
  Swords,
  Trophy,
  UserPlus,
  Scale,
  Shield,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { TOURNAMENT_RULES } from "../../data/rules";
import { DEFAULT_EVENT_DATA, fetchEventData, type EventData } from "../../data/events";
import { cn } from "../../utils/cn";

const ICON_MAP: Record<string, LucideIcon> = {
  Radio,
  CalendarDays,
  Clock,
  Swords,
  UserPlus,
  Trophy,
  FilePenLine,
  BadgeCheck,
  Medal,
  Shield,
  Scale,
  BookOpen,
};

interface EventsProps {
  showRules?: boolean;
}

/** II. EVENTOS — pieza central: Overplay Tourney 4 & Reglamento Oficial sincronizado con Supabase. */
export function Events({ showRules = true }: EventsProps) {
  const [eventData, setEventData] = useState<EventData>(DEFAULT_EVENT_DATA);

  useEffect(() => {
    let alive = true;
    fetchEventData().then((data) => {
      if (!alive) return;
      if (data) setEventData(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="eventos" aria-label="Eventos" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Ambiente */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-14rem] top-16 h-[30rem] w-[30rem] rounded-full bg-orange-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10rem] left-[-10rem] h-[26rem] w-[26rem] rounded-full bg-violet-600/10 blur-[140px]" />
        <span className="absolute -right-8 top-2 select-none font-display text-[16rem] font-bold italic leading-none text-white/[0.025] sm:text-[22rem]">
          {eventData.edition || "04"}
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Eventos"
          title={
            <>
              Nuestros <span className="text-brand-gradient">Eventos</span>
            </>
          }
          description="Cada edición eleva el nivel de la competencia. Este es el escenario principal de la comunidad Overplay."
        />

        {/* Panel destacado: Overplay Tourney 4 */}
        <Reveal className="mt-14" y={40}>
          <article
            aria-label={`${eventData.titlePrefix} ${eventData.titleMain} ${eventData.edition}`}
            className={cn(
              "card-surface relative overflow-hidden rounded-[2rem]",
              "shadow-[0_40px_120px_-40px_rgba(249,115,22,0.25)]"
            )}
          >
            {/* Borde luminoso superior */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent"
            />

            <div className="relative grid lg:grid-cols-2">
              {/* Columna de contenido */}
              <div className="relative z-10 p-7 sm:p-10 lg:p-14">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
                  </span>
                  <span className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-orange-200">
                    {eventData.statusBadge}
                  </span>
                </span>

                <h3 className="mt-7 font-display font-bold uppercase italic leading-[0.9] tracking-tight">
                  <span className="block text-3xl text-white/85 sm:text-4xl">{eventData.titlePrefix}</span>
                  <span className="block text-6xl text-white sm:text-7xl lg:text-8xl">
                    {eventData.titleMain}{" "}
                    <span className="text-brand-gradient drop-shadow-[0_0_35px_rgba(249,115,22,0.4)]">
                      {eventData.edition}
                    </span>
                  </span>
                </h3>

                <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                  {eventData.description}
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("open-tournament-registration"));
                    }}
                    href={eventData.registerButtonUrl || "#inscripcion"}
                    ariaLabel={eventData.registerButtonText || "Inscribirse"}
                  >
                    <UserPlus className="h-4 w-4" />
                    {eventData.registerButtonText || "Inscribirse"}
                  </Button>
                  <Button
                    href={eventData.rulesButtonUrl || "#/reglas"}
                    variant="ghost"
                    ariaLabel={eventData.rulesButtonText || "Ver reglas"}
                  >
                    <FilePenLine className="h-4 w-4" />
                    {eventData.rulesButtonText || "Ver reglas"}
                  </Button>
                </div>

              </div>

              {/* Columna visual */}
              <div className="relative min-h-[260px] overflow-hidden sm:min-h-[320px] lg:min-h-full">
                <img
                  src={eventData.bannerImage || "/images/tourney-banner.jpg"}
                  alt={`${eventData.titlePrefix} ${eventData.titleMain} ${eventData.edition}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2.5s] ease-out hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0b0b0d] lg:via-[#0b0b0d]/30 lg:to-transparent" />

                {/* Chips flotantes */}
                {eventData.chips && eventData.chips.length > 0 && (
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2.5 sm:bottom-7 sm:left-7">
                    {eventData.chips.map((chip, i) => (
                      <span
                        key={chip}
                        className={cn(
                          "glass rounded-lg px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/85",
                          "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)]",
                          i === 1 && "motion-safe:animate-glow-pulse"
                        )}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ficha técnica */}
            {eventData.infoItems && eventData.infoItems.length > 0 && (
              <dl className="relative grid grid-cols-2 gap-px border-t border-white/[0.08] bg-white/[0.06] md:grid-cols-3 xl:grid-cols-6">
                {eventData.infoItems.map((item) => {
                  const ItemIcon = ICON_MAP[item.icon] || Trophy;
                  return (
                    <div
                      key={item.label}
                      className="group/info flex flex-col gap-2 bg-[#0b0b0d] p-5 transition-colors duration-300 hover:bg-[#101014] sm:p-6"
                    >
                      <dt className="flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
                        <ItemIcon className="h-3.5 w-3.5 text-orange-400/80 transition-transform duration-300 group-hover/info:scale-110" />
                        {item.label}
                      </dt>
                      <dd className="text-sm font-semibold text-white/90 sm:text-[15px]">{item.value}</dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </article>
        </Reveal>

        {/* Proceso competitivo */}
        {eventData.processPhases && eventData.processPhases.length > 0 && (
          <div className="relative mt-16 sm:mt-20">
            <Reveal className="mb-9 flex items-center gap-4">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                Así funciona el torneo
              </span>
              <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </Reveal>

            <div className="relative">
              {/* Línea conectora — desktop */}
              <span
                aria-hidden
                className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-orange-500/50 via-white/10 to-violet-500/50 md:block"
              />
              <Stagger gap={0.12} className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
                {eventData.processPhases.map((phase) => {
                  const PhaseIcon = ICON_MAP[phase.icon] || Swords;
                  return (
                    <StaggerItem key={phase.step}>
                      <article className="card-surface group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-400/30 hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.35)]">
                        <span
                          aria-hidden
                          className="absolute -right-3 -top-6 select-none font-display text-7xl font-bold italic text-white/[0.045] transition-colors duration-500 group-hover:text-orange-500/10"
                        >
                          {phase.step}
                        </span>
                        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-500/10 text-orange-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                          <PhaseIcon className="h-5 w-5" />
                        </span>
                        <p className="mt-5 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-300/80">
                          Fase {phase.step}
                        </p>
                        <h4 className="mt-1.5 font-display text-xl font-bold uppercase italic text-white">
                          {phase.title}
                        </h4>
                        <p className="mt-2.5 text-sm leading-relaxed text-white/50">{phase.text}</p>
                      </article>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        )}

        {/* Apartado de Reglas del Torneo (Solo visible en la sección/vista de eventos) */}
        {showRules && (
          <div className="relative mt-16 sm:mt-20">
            <Reveal className="mb-9 flex items-center gap-4">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                Reglamento & Normativa
              </span>
              <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </Reveal>

            <Reveal y={30}>
              <div className="card-surface relative overflow-hidden rounded-3xl border border-white/10 p-7 sm:p-10 lg:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
                <div className="absolute right-[-8rem] top-[-8rem] h-64 w-64 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-400/30 text-orange-400">
                        <Scale className="h-4 w-4" />
                      </span>
                      <h3 className="font-display text-2xl font-bold uppercase italic text-white sm:text-3xl">
                        Reglas del <span className="text-brand-gradient">Torneo</span>
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                      {TOURNAMENT_RULES.summary}
                    </p>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                        <BadgeCheck className="h-3.5 w-3.5 text-orange-400" />
                        Fair Play Garantizado
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                        <Shield className="h-3.5 w-3.5 text-purple-400" />
                        Arbitraje en Vivo
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                        <Swords className="h-3.5 w-3.5 text-rose-400" />
                        Doble Eliminación Oficial
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <a
                      href="#/reglas"
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_40px_-10px_rgba(249,115,22,0.7)] active:scale-95 cursor-pointer"
                    >
                      <BookOpen className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-8deg]" />
                      <span>{TOURNAMENT_RULES.rulesButtonText}</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

