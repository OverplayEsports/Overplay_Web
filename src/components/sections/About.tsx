import { useEffect, useState } from "react";
import { Palette, ShieldCheck, Sparkles, Users } from "lucide-react";
import { TEAM_GROUPS, fetchTeamGroups, type TeamGroup } from "../../data/team";
import { SectionHeading } from "../ui/SectionHeading";
import { MonogramAvatar } from "../ui/MonogramAvatar";
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
    hover: "hover:border-orange-400/40 hover:shadow-[0_18px_50px_-18px_rgba(249,115,22,0.4)]",
    bar: "from-orange-500 to-rose-500",
  },
  violet: {
    icon: "border-violet-400/25 bg-violet-500/10 text-violet-300",
    hover: "hover:border-violet-400/40 hover:shadow-[0_18px_50px_-18px_rgba(139,92,246,0.4)]",
    bar: "from-violet-500 to-fuchsia-500",
  },
  crimson: {
    icon: "border-rose-400/25 bg-rose-500/10 text-rose-300",
    hover: "hover:border-rose-400/40 hover:shadow-[0_18px_50px_-18px_rgba(244,63,94,0.4)]",
    bar: "from-rose-500 to-red-500",
  },
  emerald: {
    icon: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    hover: "hover:border-emerald-400/40 hover:shadow-[0_18px_50px_-18px_rgba(16,185,129,0.4)]",
    bar: "from-emerald-500 to-teal-500",
  },
} as const;

const SOCIAL_ORDER = ["x", "twitch", "instagram", "youtube", "discord"] as const;

function MemberCard({ member, accent }: { member: TeamGroup["members"][number]; accent: TeamGroup["accent"] }) {
  const styles = ACCENTS[accent] || ACCENTS.ember;
  const isImageAvatar = member.avatarType === "image" && Boolean(member.avatarImage?.trim());

  return (
    <article
      className={cn(
        "card-surface group relative flex h-full flex-col items-center gap-3.5 overflow-hidden rounded-2xl p-5 text-center",
        "transition-all duration-500 ease-out will-change-transform hover:-translate-y-1.5",
        styles.hover
      )}
    >
      {/* Barra superior animada */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100",
          styles.bar
        )}
      />
      {/* Glow ambiental */}
      <span
        aria-hidden
        className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white/[0.06] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="transition-transform duration-500 group-hover:scale-[1.06]">
        {isImageAvatar ? (
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full ring-2 ring-white/20 p-0.5 bg-gradient-to-tr shadow-lg group-hover:ring-orange-400/60 transition-all">
            <img
              src={member.avatarImage}
              alt={member.name}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <MonogramAvatar name={member.name} gradient={member.gradient} size="lg" />
        )}
      </div>
      <div>
        <h4 className="font-display text-base font-bold uppercase italic tracking-wide text-white">
          {member.name}
        </h4>
        <p className="mt-0.5 text-xs text-white/50">{member.role}</p>
      </div>
      {member.socials && (
        <div className="mt-auto flex w-full flex-nowrap items-center justify-center gap-1.5 border-t border-white/[0.07] pt-3.5">
          {SOCIAL_ORDER.map((platform) => {
            const href = member.socials?.[platform];
            if (!href || href === "#") return null;
            return (
              <SocialButton
                key={platform}
                platform={platform}
                href={href}
                label={`${member.name} en ${platform}`}
                className="h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 rounded-full border-white/10 bg-white/[0.03] text-white/50 hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-white"
                iconClassName="h-3 w-3 sm:h-3.5 sm:w-3.5"
              />
            );
          })}
        </div>
      )}
    </article>
  );
}

/** I. SOBRE NOSOTROS — presentación de la organización y su equipo con sincronización Supabase. */
export function About() {
  const [groups, setGroups] = useState<TeamGroup[]>(TEAM_GROUPS);

  useEffect(() => {
    let alive = true;
    fetchTeamGroups().then((data) => {
      if (!alive) return;
      if (data && data.length > 0) {
        setGroups(data);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="nosotros" aria-label="Sobre Nosotros" className="relative scroll-mt-24 py-24 sm:py-32">
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
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
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
      </div>
    </section>
  );
}
