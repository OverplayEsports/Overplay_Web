import { useState, useEffect } from "react";
import { Flag, Medal, Shield } from "lucide-react";
import { ROSTER, TEAM_EVENTS, fetchCompetitiveData, type Player, type TeamEvent } from "../../data/roster";
import { SectionHeading } from "../ui/SectionHeading";
import { MonogramAvatar } from "../ui/MonogramAvatar";
import { SocialButton } from "../ui/SocialIcons";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { cn } from "../../utils/cn";

function PlayerCard({ player }: { player: Player }) {
  const isImageAvatar = player.avatarType === "image" && Boolean(player.avatarImage?.trim());

  return (
    <article className="card-surface group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-500 will-change-transform hover:-translate-y-2 hover:border-orange-400/30 hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.4)]">
      {/* Glow de fondo */}
      <span
        aria-hidden
        className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      {/* Barra inferior animada */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 group-hover:scale-x-100"
      />

      {/* Bloque Superior: Avatar a la izquierda, Textos a la derecha */}
      <div className="relative flex items-start gap-4 sm:gap-5">
        {/* Avatar */}
        <div className="shrink-0 transition-transform duration-500 group-hover:scale-[1.05] group-hover:rotate-[-2deg]">
          {isImageAvatar ? (
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl ring-2 ring-white/20 p-0.5 bg-gradient-to-tr shadow-lg group-hover:ring-orange-400/60 transition-all">
              <img
                src={player.avatarImage}
                alt={player.name}
                className="h-full w-full rounded-2xl object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <MonogramAvatar name={player.name} gradient={player.gradient} size="xl" />
          )}
        </div>

        {/* Textos a la derecha */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display text-2xl sm:text-3xl font-bold uppercase italic tracking-wide text-white truncate">
              {player.name}
            </h4>
            <span
              aria-hidden
              className="select-none font-display text-3xl sm:text-4xl font-bold italic leading-none text-white/[0.12] transition-colors duration-500 group-hover:text-orange-500/30"
            >
              {player.tag}
            </span>
          </div>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
            <span className="font-bold text-orange-300">{player.role}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
            <span className="text-white/50">{player.position}</span>
          </p>

          {/* Eventos disputados */}
          {player.events && player.events.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {player.events.map((event) => (
                <span
                  key={event}
                  className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-display text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white/80"
                >
                  {event}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Redes Sociales Abajo */}
      <div className="relative mt-5 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-3.5">
        {player.socials &&
          (Object.entries(player.socials) as [keyof typeof player.socials, string][]).map(
            ([platform, href]) =>
              href &&
              href !== "#" && (
                <SocialButton
                  key={platform}
                  platform={platform}
                  href={href}
                  label={`${player.name} en ${platform}`}
                  className="h-8 w-8 rounded-full border-white/10 bg-white/[0.04] text-white/60 hover:border-orange-400/50 hover:bg-orange-500/15 hover:text-white"
                  iconClassName="h-3.5 w-3.5"
                />
              )
          )}
      </div>

      {/* Abajo de las redes sociales: UL · OFICIAL */}
      <div className="relative mt-2 flex items-center justify-center border-t border-white/[0.04] pt-2">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-white/35">
          UL · OFICIAL
        </span>
      </div>
    </article>
  );
}

const TIER_STYLES: Record<TeamEvent["tier"], { badge: string; border: string; icon: string }> = {
  gold: {
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    border: "hover:border-amber-400/35 hover:shadow-[0_20px_50px_-22px_rgba(251,191,36,0.45)]",
    icon: "text-amber-300",
  },
  silver: {
    badge: "border-slate-300/35 bg-slate-300/10 text-slate-200",
    border: "hover:border-slate-300/30 hover:shadow-[0_20px_50px_-22px_rgba(226,232,240,0.35)]",
    icon: "text-slate-200",
  },
  bronze: {
    badge: "border-orange-500/35 bg-orange-500/10 text-orange-300",
    border: "hover:border-orange-500/30 hover:shadow-[0_20px_50px_-22px_rgba(249,115,22,0.35)]",
    icon: "text-orange-300",
  },
  neutral: {
    badge: "border-white/15 bg-white/[0.05] text-white/65",
    border: "hover:border-white/25 hover:shadow-[0_20px_50px_-22px_rgba(255,255,255,0.2)]",
    icon: "text-white/60",
  },
};

/** III. COMPETITIVO — roster oficial de UL + historial de participación. */
export function Competitive() {
  const [roster, setRoster] = useState<Player[]>(ROSTER);
  const [events, setEvents] = useState<TeamEvent[]>(TEAM_EVENTS);

  useEffect(() => {
    let alive = true;
    fetchCompetitiveData().then((data) => {
      if (!alive) return;
      if (data) {
        if (data.roster && data.roster.length > 0) {
          setRoster(data.roster);
        }
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="competitivo" aria-label="Competitivo" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-1/3 h-[26rem] w-[26rem] rounded-full bg-rose-600/8 blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="03"
            eyebrow="Competitivo"
            title={
              <>
                Competitivo <span className="text-brand-gradient">UL</span>
              </>
            }
            description="El roster oficial que defiende los colores de Overplay en cada torneo. Nueve integrantes, un mismo escudo."
          />
          <Reveal delay={0.2}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5">
              <Shield className="h-4 w-4 text-orange-400" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.24em] text-white/75">
                Roster oficial — UL
              </span>
            </span>
          </Reveal>
        </div>

        {/* Roster 3 x 3 */}
        <Stagger gap={0.08} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((player) => (
            <StaggerItem key={player.id || player.tag || player.name}>
              <PlayerCard player={player} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Historial de participación */}
        <div className="mt-20 sm:mt-24">
          <Reveal className="mb-9 flex flex-wrap items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-500/10 text-orange-300">
              <Flag className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold uppercase italic tracking-wide text-white sm:text-2xl">
                Eventos en los que hemos participado
              </h3>
              <p className="mt-0.5 text-sm text-white/45">
                La trayectoria de UL dentro y fuera de casa.
              </p>
            </div>
            <span aria-hidden className="hidden h-px flex-1 bg-gradient-to-r from-white/15 to-transparent sm:block" />
          </Reveal>

          <div className="relative">
            <span
              aria-hidden
              className="absolute left-0 right-0 top-0 hidden h-px bg-gradient-to-r from-amber-400/40 via-white/10 to-violet-500/40 xl:block"
            />
            <Stagger gap={0.1} className="grid gap-5 pt-0 sm:grid-cols-2 xl:grid-cols-4 xl:pt-8">
              {events.map((event) => {
                const tier = TIER_STYLES[event.tier] || TIER_STYLES.neutral;
                return (
                  <StaggerItem key={event.name}>
                    <article
                      className={cn(
                        "card-surface group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5",
                        tier.border
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-display text-xs font-bold tracking-[0.3em] text-white/35">
                          {event.year}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em]",
                            tier.badge
                          )}
                        >
                          <Medal className={cn("h-3 w-3", tier.icon)} />
                          {event.result}
                        </span>
                      </div>
                      <h4 className="mt-4 font-display text-lg font-bold uppercase italic leading-tight text-white">
                        {event.name}
                      </h4>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/50">{event.blurb}</p>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
