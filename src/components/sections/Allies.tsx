import { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown, Handshake, Plus } from "lucide-react";
import { ALLIES, fetchAlliesData, type Ally } from "../../data/allies";
import { SectionHeading } from "../ui/SectionHeading";
import { MonogramAvatar } from "../ui/MonogramAvatar";
import { SocialButton } from "../ui/SocialIcons";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { cn } from "../../utils/cn";

function AllyCard({ ally }: { ally: Ally }) {
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isImageAvatar =
    !imgError &&
    ally.avatarType === "image" &&
    typeof ally.avatarImage === "string" &&
    ally.avatarImage.trim().length > 0;

  const hasLongDescription = Boolean(
    ally.description && ally.description.trim().length > 80
  );

  return (
    <article
      onClick={() => setIsExpanded((prev) => !prev)}
      className={cn(
        "isolate group relative flex w-full self-start min-h-[400px] sm:min-h-[430px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c10] px-6 pb-6 pt-0 text-center transition-all duration-300 cursor-pointer select-none",
        "hover:-translate-y-1.5 hover:border-violet-400/40 hover:shadow-[0_24px_60px_-26px_rgba(139,92,246,0.35)]",
        isExpanded && "border-violet-400/50 shadow-[0_24px_60px_-26px_rgba(139,92,246,0.45)] ring-1 ring-violet-400/20"
      )}
    >
      {/* 1. Fondo superior: Imagen de fondo fija en la parte superior sin alterar su altura ni posición */}
      <div className="absolute inset-x-0 top-0 h-[260px] sm:h-[280px] overflow-hidden rounded-t-3xl pointer-events-none bg-[#0c0c10]">
        {isImageAvatar ? (
          <img
            src={ally.avatarImage}
            alt={ally.name || "Aliado"}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              "h-full w-full flex items-center justify-center bg-gradient-to-br opacity-25",
              ally.gradient || "from-violet-500 to-fuchsia-600"
            )}
          />
        )}
        {/* Degradado hacia abajo: a la altura del nombre se funde con el fondo de la casilla */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-15% via-[#0c0c10]/75 via-60% to-[#0c0c10]" />
      </div>

      {/* 2. Textos con posición superior fija: no se desplazan sobre la imagen al expandir */}
      <div className="relative z-10 flex flex-col items-center pt-[180px] sm:pt-[200px] w-full">
        {/* Badge / Etiqueta - Mantiene altura fija inicial */}
        <span className="rounded-full border border-violet-400/25 bg-[#0c0c10]/90 px-3.5 py-1 font-display text-[9px] font-bold uppercase tracking-[0.22em] text-violet-200/90 shadow-sm">
          {ally.badge}
        </span>

        {/* Nombre del aliado - Mantiene altura fija inicial */}
        <h4 className="mt-2.5 font-display text-xl sm:text-2xl font-bold uppercase italic tracking-wide text-white drop-shadow-md">
          {ally.name}
        </h4>

        {/* Descripción: crece únicamente HACIA ABAJO al expandirse */}
        <p
          className={cn(
            "mt-2 text-xs sm:text-sm leading-relaxed text-white/60 transition-colors duration-200",
            isExpanded
              ? "line-clamp-none whitespace-pre-line text-white/85 text-left w-full"
              : "line-clamp-3 text-center"
          )}
        >
          {ally.description}
        </p>

        {/* Indicador de expandir/colapsar */}
        {hasLongDescription && (
          <div className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold text-white/50 transition-colors group-hover:border-violet-400/40 group-hover:text-violet-200">
            <span>{isExpanded ? "Menos info" : "Ver info completa"}</span>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        )}
      </div>

      {/* 3. Redes sociales: ancladas abajo con mt-auto */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 mt-auto pt-4 flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.08]"
      >
        {ally.socials &&
          (Object.entries(ally.socials) as [keyof typeof ally.socials, string][]).map(
            ([platform, href]) =>
              href &&
              href !== "#" && (
                <SocialButton
                  key={platform}
                  platform={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  label={`${ally.name} en ${platform}`}
                  className="h-8 w-8 hover:border-violet-400/50 hover:bg-violet-500/10"
                  iconClassName="h-3.5 w-3.5"
                />
              )
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
    <section id="aliados" aria-label="Aliados" className="relative scroll-mt-24 pt-6 sm:pt-8 pb-24 sm:pb-32">
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

        <Stagger gap={0.09} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 items-start">
          {allies.map((ally) => (
            <StaggerItem key={ally.id || ally.name} className="self-start">
              <AllyCard ally={ally} />
            </StaggerItem>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <StaggerItem key={`empty-${i}`} className="self-start">
              <EmptySlot index={allies.length + i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
