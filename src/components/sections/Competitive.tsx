import { useState, useEffect } from "react";
import { Flag, Medal, Shield, ChevronDown } from "lucide-react";
import { ROSTER, TEAM_EVENTS, fetchCompetitiveData, type Player, type TeamEvent } from "../../data/roster";
import { SectionHeading } from "../ui/SectionHeading";
import { MonogramAvatar } from "../ui/MonogramAvatar";
import { SocialButton } from "../ui/SocialIcons";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { cn } from "../../utils/cn";

function PlayerCard({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isImageAvatar =
    !imgError &&
    player.avatarType === "image" &&
    typeof player.avatarImage === "string" &&
    player.avatarImage.trim().length > 0;

  const topHeroes = Array.isArray(player.topHeroes) ? player.topHeroes : [];

  const activeSocials = player.socials
    ? (Object.entries(player.socials) as [keyof typeof player.socials, string][]).filter(
        ([_, href]) => href && href.trim().length > 0 && href !== "#"
      )
    : [];

  return (
    <article
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "card-surface group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer select-none",
        "hover:-translate-y-1 hover:border-orange-400/40 hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.35)]",
        isExpanded
          ? "border-orange-500/60 shadow-[0_20px_50px_-20px_rgba(249,115,22,0.45)] ring-1 ring-orange-500/30"
          : "border-white/10"
      )}
    >
      {/* Barra superior animada */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2.5px] origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 group-hover:scale-x-100 z-20"
      />

      {/* Glow de fondo */}
      <span
        aria-hidden
        className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
      />

      {/* 1. Bloque Horizontal Principal */}
      <div className="relative min-h-[125px] sm:min-h-[135px] overflow-hidden">
        {/* Fondo del lado izquierdo: Imagen usando el alto total y degradado hacia la derecha */}
        <div className="absolute left-0 top-0 bottom-0 w-36 sm:w-44 overflow-hidden pointer-events-none">
          {isImageAvatar ? (
            <img
              src={player.avatarImage}
              alt={player.name || "Jugador"}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={cn(
                "h-full w-full flex items-center justify-center font-display font-black text-3xl sm:text-4xl text-white/90 bg-gradient-to-br",
                player.gradient || "from-orange-500 to-rose-600"
              )}
            >
              {player.name ? player.name.slice(0, 2).toUpperCase() : "UL"}
            </div>
          )}
          {/* Degradado hacia la derecha para fundirse con la casilla */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0b0b0e]/75 to-[#0b0b0e]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e]/80 via-transparent to-black/20" />
        </div>

        {/* Textos y contenido a la derecha de la imagen */}
        <div className="relative z-10 flex h-full flex-col justify-between pl-32 sm:pl-40 pr-3.5 sm:pr-4 py-3 sm:py-3.5">
          <div>
            {/* Nombre arriba y Tag */}
            <div className="flex items-start justify-between gap-1.5">
              <h4 className="font-display text-lg sm:text-xl font-bold uppercase italic tracking-wide text-white truncate drop-shadow-md">
                {player.name || "Jugador"}
              </h4>
              <span className="font-display text-xs font-bold text-white/30 group-hover:text-orange-400 transition-colors shrink-0">
                #{player.tag || "00"}
              </span>
            </div>

            {/* Rol abajo del nombre */}
            <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-orange-400 font-display mt-0.5 truncate">
              {player.role || "Player"}
            </p>
          </div>

          {/* Abajo: Los 3 héroes más usados en una línea horizontal + Botón Ver detalles */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            {topHeroes.length > 0 ? (
              <div className="flex items-center gap-1.5">
                {topHeroes.slice(0, 3).map((hero, idx) => (
                  <div
                    key={idx}
                    title={hero}
                    className="group/hero relative h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-black/70 p-0.5 shadow-md ring-1 ring-white/10 transition-transform hover:scale-110"
                  >
                    <img
                      src={`/images/Overwatch/${hero}.png`}
                      alt={hero}
                      className="h-full w-full rounded-md object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-white/30 italic">Sin héroes asignados</span>
            )}

            {/* Botón de despliegue interactivo */}
            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-white/50 transition-colors group-hover:border-orange-400/40 group-hover:text-white">
              <span>{isExpanded ? "Cerrar" : "Detalles"}</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Despliegue interactivo (Redes Sociales, Tags y Descripción) */}
      {isExpanded && (
        <div
          className="relative z-10 border-t border-white/10 bg-black/50 px-4 py-3.5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Descripción / Biografía */}
          {player.description ? (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                Biografía & Trayectoria
              </span>
              <p className="text-xs text-white/70 leading-relaxed italic">
                {player.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">Sin descripción añadida aún.</p>
          )}

          {/* Tags & Torneos */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
              Tags & Torneos
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                <Shield className="h-2.5 w-2.5" />
                {player.position || "Titular"}
              </span>
              {player.events &&
                player.events.map((ev) => (
                  <span
                    key={ev}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-display text-[9px] font-semibold uppercase tracking-wider text-white/60"
                  >
                    {ev}
                  </span>
                ))}
            </div>
          </div>

          {/* Redes Sociales */}
          {activeSocials.length > 0 && (
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Redes Sociales
              </span>
              <div className="flex items-center gap-1.5">
                {activeSocials.map(([platform, href]) => (
                  <SocialButton
                    key={platform}
                    platform={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    label={`${player.name} en ${platform}`}
                    className="h-6.5 w-6.5 rounded-full border-white/10 bg-white/[0.04] text-white/60 hover:border-orange-400/50 hover:bg-orange-500/15 hover:text-white"
                    iconClassName="h-3 w-3"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
