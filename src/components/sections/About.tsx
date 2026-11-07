import { useEffect, useState } from "react";
import { ChevronDown, Palette, ShieldCheck, Sparkles, Trophy, Users, Calendar, Crown, Shield } from "lucide-react";
import { TEAM_GROUPS, fetchTeamGroups, getCachedTeamGroups, type TeamGroup } from "../../data/team";
import {
  DEFAULT_PAST_CHAMPIONS,
  fetchPastChampions,
  getCachedPastChampions,
  type PastChampion,
  type PastChampionsConfig,
} from "../../data/champions";
import { SectionHeading } from "../ui/SectionHeading";
import { SocialButton } from "../ui/SocialIcons";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { cn } from "../../utils/cn";

/** Layouts equilibrados según el número de integrantes del grupo. */
const GROUP_ICONS = {
  ember: Users,
  violet: Palette,
  crimson: ShieldCheck,
  emerald: Sparkles,
} as const;

const ACCENTS = {
  ember: {
    icon: "border-orange-400/25 bg-orange-500/10 text-orange-300",
    hover: "hover:border-orange-400/40 hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.35)]",
    activeBorder: "border-orange-500/60 shadow-[0_20px_50px_-20px_rgba(249,115,22,0.45)] ring-1 ring-orange-500/30",
    roleText: "text-orange-400",
    bar: "from-orange-500 to-rose-500",
    glow: "from-orange-500 to-rose-600",
  },
  violet: {
    icon: "border-violet-400/25 bg-violet-500/10 text-violet-300",
    hover: "hover:border-violet-400/40 hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.35)]",
    activeBorder: "border-violet-500/60 shadow-[0_20px_50px_-20px_rgba(139,92,246,0.45)] ring-1 ring-violet-500/30",
    roleText: "text-violet-400",
    bar: "from-violet-500 to-fuchsia-500",
    glow: "from-violet-500 to-fuchsia-600",
  },
  crimson: {
    icon: "border-rose-400/25 bg-rose-500/10 text-rose-300",
    hover: "hover:border-rose-400/40 hover:shadow-[0_20px_50px_-20px_rgba(244,63,94,0.35)]",
    activeBorder: "border-rose-500/60 shadow-[0_20px_50px_-20px_rgba(244,63,94,0.45)] ring-1 ring-rose-500/30",
    roleText: "text-rose-400",
    bar: "from-rose-500 to-red-500",
    glow: "from-rose-500 to-red-600",
  },
  emerald: {
    icon: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    hover: "hover:border-emerald-400/40 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.35)]",
    activeBorder: "border-emerald-500/60 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.45)] ring-1 ring-emerald-500/30",
    roleText: "text-emerald-400",
    bar: "from-emerald-500 to-teal-500",
    glow: "from-emerald-500 to-teal-600",
  },
} as const;

const SOCIAL_ORDER = ["x", "twitch", "instagram", "youtube", "discord"] as const;

function MemberCard({ member, accent }: { member: TeamGroup["members"][number]; accent: TeamGroup["accent"] }) {
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = ACCENTS[accent] || ACCENTS.ember;

  const isImageAvatar =
    !imgError &&
    member.avatarType === "image" &&
    typeof member.avatarImage === "string" &&
    member.avatarImage.trim().length > 0;

  // Filtrar solo las redes sociales que tengan una URL válida (distinta de "#")
  const activeSocials = SOCIAL_ORDER.filter((platform) => {
    const href = member.socials?.[platform];
    return typeof href === "string" && href.trim().length > 0 && href !== "#";
  });

  return (
    <article
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "card-surface group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer select-none",
        "hover:-translate-y-1",
        styles.hover,
        isExpanded ? styles.activeBorder : "border-white/10"
      )}
    >
      {/* 1. Bloque Horizontal Principal */}
      <div className="relative min-h-[110px] sm:min-h-[120px] overflow-hidden">
        {/* Fondo del lado izquierdo: Imagen usando el alto total y degradado hacia la derecha */}
        <div
          className="absolute left-0 top-0 bottom-0 w-28 sm:w-36 overflow-hidden pointer-events-none"
          style={{
            maskImage: "linear-gradient(to right, black 50%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to right, black 50%, transparent 95%)",
          }}
        >
          {isImageAvatar ? (
            <img
              src={member.avatarImage}
              alt={member.name || "Miembro"}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={cn(
                "h-full w-full flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-white/90 bg-gradient-to-br",
                member.gradient || styles.glow
              )}
            >
              {member.name ? member.name.slice(0, 2).toUpperCase() : "OP"}
            </div>
          )}
          {/* Degradado sobre la imagen en la parte derecha para fundirse con la casilla */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-[#0b0b0e] pointer-events-none" />
        </div>

        {/* Textos y contenido a la derecha de la imagen */}
        <div className="relative z-10 flex h-full flex-col justify-between pl-24 sm:pl-32 pr-3 sm:pr-4 py-3 sm:py-3.5">
          <div>
            {/* Nombre */}
            <h4 className="font-display text-lg sm:text-xl font-bold uppercase italic tracking-wide text-white truncate drop-shadow-md">
              {member.name || "Miembro"}
            </h4>

            {/* Rol */}
            <p className={cn("text-xs sm:text-[13px] font-semibold uppercase tracking-wider font-display mt-0.5 truncate", styles.roleText)}>
              {member.role || "Staff"}
            </p>
          </div>

          {/* Abajo: Botón Desplegable para ver Descripción & Redes */}
          <div className="mt-2.5 flex items-center justify-end">
            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-white/50 transition-colors group-hover:border-orange-400/40 group-hover:text-white shrink-0">
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

      {/* 2. Despliegue interactivo: Descripción arriba y Redes Sociales abajo */}
      {isExpanded && (
        <div
          className="relative z-10 border-t border-white/10 bg-black/50 px-4 py-3.5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Descripción / Biografía */}
          {member.description ? (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                Descripción
              </span>
              <p className="text-xs text-white/70 leading-relaxed italic">
                {member.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-white/30 italic">Sin descripción añadida aún.</p>
          )}

          {/* Redes Sociales abajo de la descripción */}
          {activeSocials.length > 0 && (
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Redes Sociales
              </span>
              <div className="flex items-center gap-1.5">
                {activeSocials.map((platform) => {
                  const href = member.socials?.[platform];
                  if (!href) return null;
                  return (
                    <SocialButton
                      key={platform}
                      platform={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      label={`${member.name || "Miembro"} en ${platform}`}
                      className="h-6.5 w-6.5 rounded-full border-white/10 bg-white/[0.04] text-white/60 hover:border-orange-400/50 hover:bg-orange-500/15 hover:text-white"
                      iconClassName="h-3 w-3"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ChampionCard({ champion }: { champion: PastChampion }) {
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasLogo =
    !imgError &&
    typeof champion.teamLogo === "string" &&
    champion.teamLogo.trim().length > 0;

  const members = Array.isArray(champion.members) ? champion.members : [];

  return (
    <article
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "card-surface group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer select-none",
        "hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_20px_50px_-20px_rgba(251,191,36,0.35)]",
        isExpanded
          ? "border-amber-500/60 shadow-[0_20px_50px_-20px_rgba(251,191,36,0.45)] ring-1 ring-amber-500/30"
          : "border-white/10"
      )}
    >
      {/* 1. Bloque Horizontal Principal */}
      <div className="relative min-h-[110px] sm:min-h-[120px] overflow-hidden">
        {/* Fondo del lado izquierdo: Imagen usando el alto total y degradado hacia la derecha */}
        <div
          className="absolute left-0 top-0 bottom-0 w-28 sm:w-36 overflow-hidden pointer-events-none"
          style={{
            maskImage: "linear-gradient(to right, black 50%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to right, black 50%, transparent 95%)",
          }}
        >
          {hasLogo ? (
            <img
              src={champion.teamLogo}
              alt={champion.teamName || "Equipo Campeón"}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={cn(
                "h-full w-full flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-amber-300 bg-gradient-to-br",
                champion.gradient || "from-amber-500 to-orange-600"
              )}
            >
              <Trophy className="h-10 w-10 text-white/90 drop-shadow-md" />
            </div>
          )}
          {/* Degradado sobre la imagen en la parte derecha para fundirse con la casilla */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-[#0b0b0e] pointer-events-none" />
        </div>

        {/* Textos y contenido a la derecha de la imagen */}
        <div className="relative z-10 flex h-full flex-col justify-between pl-24 sm:pl-32 pr-3 sm:pr-4 py-3 sm:py-3.5">
          <div>
            {/* Nombre del torneo y Badge Campeón */}
            <div className="flex items-start justify-between gap-1.5">
              <h4 className="font-display text-base sm:text-lg font-bold uppercase italic tracking-wide text-white truncate drop-shadow-md">
                {champion.tournamentName || "Torneo"}
              </h4>
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-amber-300 shrink-0">
                <Crown className="h-2.5 w-2.5 text-amber-400" />
                Campeón
              </span>
            </div>

            {/* Fecha del torneo */}
            <p className="flex items-center gap-1.5 text-xs font-semibold text-white/50 font-display mt-0.5 truncate">
              <Calendar className="h-3 w-3 text-amber-400/80 shrink-0" />
              <span>{champion.date || "Fecha no especificada"}</span>
            </p>
          </div>

          {/* Abajo: Botón Desplegable para ver Equipo y Participantes */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide truncate">
              {champion.teamName || "Ver roster"}
            </span>

            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-white/50 transition-colors group-hover:border-amber-400/40 group-hover:text-white shrink-0">
              <span>{isExpanded ? "Cerrar" : "Roster"}</span>
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

      {/* 2. Despliegue interactivo: Nombre del Equipo y Participantes con sus roles */}
      {isExpanded && (
        <div
          className="relative z-10 border-t border-white/10 bg-black/60 px-4 py-3.5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado: Nombre del equipo campeón */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Equipo Campeón
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-wide text-amber-300">
              {champion.teamName || "Sin nombre"}
            </span>
          </div>

          {/* Participantes y sus roles */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
              Alineación y Roles ({members.length})
            </span>

            {members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5"
                  >
                    <span className="font-display text-xs font-bold uppercase tracking-wide text-white truncate mr-2">
                      {m.name || "Jugador"}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 font-mono">
                      {m.role || "Jugador"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/30 italic">Sin participantes registrados aún.</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

/** I. SOBRE NOSOTROS — presentación de la organización y su equipo con sincronización Supabase. */
export function About() {
  const [groups, setGroups] = useState<TeamGroup[]>(getCachedTeamGroups);
  const [championsData, setChampionsData] = useState<PastChampionsConfig>(getCachedPastChampions);

  useEffect(() => {
    let alive = true;
    fetchTeamGroups().then((data) => {
      if (!alive) return;
      if (data && data.length > 0 && data.some((g) => g.members && g.members.length > 0)) {
        setGroups(data);
      }
    });

    fetchPastChampions().then((data) => {
      if (!alive) return;
      if (data && Array.isArray(data.champions) && data.champions.length > 0) {
        setChampionsData(data);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="nosotros" aria-label="Sobre Nosotros" className="relative scroll-mt-24 pt-6 sm:pt-8 pb-24 sm:pb-32">
      <div
        aria-hidden
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
          <SectionHeading
            eyebrow="Sobre Nosotros"
            title={
              <>
                Sobre <span className="text-brand-gradient">Nosotros</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="border-l-2 border-orange-500/60 pl-5 text-lg leading-relaxed text-white/65 sm:text-xl">
              Overplay es una organización creada para eventos de Overwatch, disponible para
              participar y colaborar en distintos eventos competitivos.
            </p>
            <p className="mt-4 pl-5 text-base leading-relaxed text-white/45">
              Detrás de cada torneo hay un equipo que diseña, produce y cuida cada detalle para que
              la competencia se sienta profesional desde el primer mapa.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-14 sm:mt-20">
          {groups.map((group, gi) => {
            const Icon = GROUP_ICONS[group.accent] || Users;
            const accentStyle = ACCENTS[group.accent] || ACCENTS.ember;

            return (
              <div key={group.id}>
                <Reveal delay={0.05} className="mb-7 flex flex-wrap items-center gap-4">
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border",
                      accentStyle.icon
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase italic tracking-wide text-white sm:text-2xl">
                      {group.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-white/45">{group.description}</p>
                  </div>
                  <span
                    aria-hidden
                    className="ml-1 hidden h-px flex-1 bg-gradient-to-r from-white/15 to-transparent sm:block"
                  />
                  <span className="font-display text-xs font-semibold tracking-[0.3em] text-white/30">
                    0{gi + 1} / 0{groups.length}
                  </span>
                </Reveal>

                <Stagger
                  gap={0.07}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {group.members.map((member) => (
                    <StaggerItem key={member.id || member.name}>
                      <MemberCard member={member} accent={group.accent} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            );
          })}
        </div>

        {/* Sección: Antiguos Campeones */}
        {championsData && Array.isArray(championsData.champions) && championsData.champions.length > 0 && (
          <div className="mt-20 sm:mt-24 border-t border-white/10 pt-16 sm:pt-20">
            <Reveal delay={0.05} className="mb-8 flex flex-wrap items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-500/10 text-amber-300">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold uppercase italic tracking-wide text-white sm:text-2xl">
                  {championsData.title || "Antiguos Campeones"}
                </h3>
                <p className="mt-0.5 text-sm text-white/45">
                  {championsData.description || "Los equipos y jugadores que conquistaron la gloria en nuestros torneos."}
                </p>
              </div>
              <span
                aria-hidden
                className="ml-1 hidden h-px flex-1 bg-gradient-to-r from-amber-400/20 via-white/10 to-transparent sm:block"
              />
              <span className="font-display text-xs font-semibold tracking-[0.3em] text-amber-400/60 uppercase">
                Hall of Fame
              </span>
            </Reveal>

            <Stagger
              gap={0.08}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {championsData.champions.map((champion) => (
                <StaggerItem key={champion.id || champion.tournamentName}>
                  <ChampionCard champion={champion} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </div>
    </section>
  );
}
