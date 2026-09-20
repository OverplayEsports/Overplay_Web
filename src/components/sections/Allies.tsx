import { useState, useEffect } from "react";
import { ArrowUpRight, Handshake, Plus } from "lucide-react";
import { ALLIES, fetchAlliesData, type Ally } from "../../data/allies";
import { SectionHeading } from "../ui/SectionHeading";
import { MonogramAvatar } from "../ui/MonogramAvatar";
import { SocialButton } from "../ui/SocialIcons";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";

function AllyCard({ ally }: { ally: Ally }) {
  const isImageAvatar = ally.avatarType === "image" && Boolean(ally.avatarImage?.trim());

  return (
    <article className="group relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-violet-400/30 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-26px_rgba(139,92,246,0.5)]">
      {/* Resplandor superior */}
      <span
        aria-hidden
        className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <div className="relative">
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-full bg-brand-gradient opacity-40 blur-md transition-opacity duration-500 group-hover:opacity-90"
        />
        {isImageAvatar ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/20 p-0.5 bg-gradient-to-tr shadow-lg group-hover:ring-violet-400/60 transition-transform duration-500 group-hover:scale-105">
            <img
              src={ally.avatarImage}
              alt={ally.name}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <MonogramAvatar
            name={ally.name}
            gradient={ally.gradient}
            size="lg"
            rounded="full"
            className="relative transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div>
        <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 font-display text-[9px] font-bold uppercase tracking-[0.22em] text-violet-200/90">
          {ally.badge}
        </span>
        <h4 className="mt-3 font-display text-xl font-bold uppercase italic tracking-wide text-white">
          {ally.name}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-white/50">{ally.description}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.07] pt-4">
        {ally.socials &&
          (Object.entries(ally.socials) as [keyof typeof ally.socials, string][]).map(
            ([platform, href]) =>
              href &&
              href !== "#" && (
                <SocialButton
                  key={platform}
                  platform={platform}
                  href={href}
                  label={`${ally.name} en ${platform}`}
                  className="h-8 w-8 hover:border-violet-400/50 hover:bg-violet-500/10"
                  iconClassName="h-3.5 w-3.5"
                />
              )
          )}
        {ally.link && ally.link !== "#" && (
          <a
            href={ally.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visitar el canal de ${ally.name}`}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
          >
            Canal
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <a
      href="#contacto"
      aria-label="Espacio de aliado disponible: contacta con Overplay"
      className="group relative flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/[0.14] bg-transparent p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-orange-400/40 hover:bg-orange-500/[0.04]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 transition-all duration-500 group-hover:scale-110 group-hover:border-orange-400/40 group-hover:text-orange-300">
        <Plus className="h-5 w-5" />
      </span>
      <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-white/45 transition-colors group-hover:text-white/75">
        Próximamente
      </p>
      <p className="max-w-[16rem] text-xs leading-relaxed text-white/35">
        Espacio {index + 1} · ¿Quieres colaborar con Overplay? Este lugar puede ser tuyo.
      </p>
    </a>
  );
}

/** V. ALIADOS — creadores y personas que apoyan el proyecto. */
export function Allies() {
  const [allies, setAllies] = useState<Ally[]>(ALLIES);

  useEffect(() => {
    let alive = true;
    fetchAlliesData().then((data) => {
      if (!alive) return;
      if (data && data.length > 0) {
        setAllies(data);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const emptySlots = Math.max(0, 7 - allies.length);

  return (
    <section id="aliados" aria-label="Aliados" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="05"
            eyebrow="Aliados"
            title={
              <>
                Nuestros <span className="text-brand-gradient">Aliados</span>
              </>
            }
            description="Creadores de contenido y voces de la comunidad que impulsan Overplay dentro y fuera de los torneos."
          />
          <Reveal delay={0.2}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5">
              <Handshake className="h-4 w-4 text-violet-300" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.24em] text-white/75">
                Programa de creadores
              </span>
            </span>
          </Reveal>
        </div>

        <Stagger gap={0.09} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {allies.map((ally) => (
            <StaggerItem key={ally.id || ally.name}>
              <AllyCard ally={ally} />
            </StaggerItem>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <StaggerItem key={`empty-${i}`}>
              <EmptySlot index={allies.length + i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
