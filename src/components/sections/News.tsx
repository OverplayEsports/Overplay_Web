import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";
import {
  CATEGORY_STYLES,
  NEWS_CATEGORIES,
  fetchNews,
  type NewsCategory,
  type NewsItem,
} from "../../data/news";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cn } from "../../utils/cn";

type Filter = NewsCategory | "todas";

export function FormattedContent({ content }: { content: string }) {
  if (!content) return null;

  // Si el contenido contiene etiquetas HTML de WordPress
  const isHtmlContent = /<\/?[a-z][\s\S]*>/i.test(content);

  if (isHtmlContent) {
    return (
      <div
        className={cn(
          "space-y-4 text-sm sm:text-base leading-relaxed text-white/80",
          "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:italic [&_h2]:text-white [&_h2]:text-brand-gradient",
          "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:uppercase [&_h3]:italic [&_h3]:text-white",
          "[&_h4]:mt-4 [&_h4]:font-display [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-white",
          "[&_p]:leading-relaxed [&_p]:text-white/80 [&_p]:my-3",
          "[&_blockquote]:my-6 [&_blockquote]:rounded-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-500/10 [&_blockquote]:p-4 [&_blockquote]:font-display [&_blockquote]:text-sm [&_blockquote]:sm:text-base [&_blockquote]:italic [&_blockquote]:text-orange-200",
          "[&_figure]:my-6 [&_figure]:overflow-hidden [&_figure]:rounded-2xl [&_figure]:border [&_figure]:border-white/10",
          "[&_img]:w-full [&_img]:max-h-[500px] [&_img]:object-cover [&_img]:rounded-xl",
          "[&_figcaption]:p-2.5 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-white/40 [&_figcaption]:bg-black/40",
          "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-white/75",
          "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:text-white/75",
          "[&_a]:text-orange-400 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-orange-300",
          "[&_strong]:text-white [&_strong]:font-bold",
          "[&_em]:text-orange-200"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Render paragraphs, headings, blockquotes, bullet lists, and embedded images
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-4 text-sm sm:text-base leading-relaxed text-white/80">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 2 (## ...)
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={idx}
              className="mt-6 font-display text-xl sm:text-2xl font-bold uppercase italic text-white text-brand-gradient"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h3>
          );
        }

        // Heading 3 (### ...)
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="mt-4 font-display text-lg sm:text-xl font-bold uppercase italic text-white"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }

        // Blockquote (> ...)
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="my-4 rounded-2xl border-l-4 border-orange-500 bg-orange-500/10 p-4 font-display text-sm sm:text-base italic text-orange-200"
            >
              {trimmed.replace(/^>\s+/, "").replace(/^"|"$/g, "")}
            </blockquote>
          );
        }

        // Image (![alt](url))
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imageMatch) {
          const alt = imageMatch[1] || "Imagen de la noticia";
          const src = imageMatch[2];
          return (
            <figure key={idx} className="my-6 overflow-hidden rounded-2xl border border-white/10">
              <img src={src} alt={alt} className="w-full object-cover max-h-[450px]" />
              {alt && alt !== "Imagen de la noticia" && (
                <figcaption className="p-2.5 text-center text-xs text-white/40 bg-black/40">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // Bullet List
        if (trimmed.includes("\n- ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed
            .split("\n")
            .filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))
            .map((l) => l.replace(/^[-*]\s+/, ""));
          return (
            <ul key={idx} className="my-3 space-y-2 pl-2">
              {items.map((itemText, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-white/75">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                  <span>{itemText}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Numbered List
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed
            .split("\n")
            .filter((l) => /^\d+\.\s/.test(l.trim()))
            .map((l) => l.replace(/^\d+\.\s+/, ""));
          return (
            <ol key={idx} className="my-3 space-y-2 pl-2">
              {items.map((itemText, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-white/75">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-300">
                    {i + 1}
                  </span>
                  <span>{itemText}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-white/70 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export function NewsCard({
  item,
  featured = false,
  onSelect,
}: {
  item: NewsItem;
  featured?: boolean;
  onSelect?: (item: NewsItem) => void;
}) {
  const category = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.overwatch;
  const reduce = useReducedMotion();

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? undefined : { opacity: 0, scale: 0.96, y: 20, filter: "blur(10px)" }}
      animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: -14, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "card-surface group relative flex flex-col overflow-hidden rounded-2xl",
        "transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-400/35",
        "hover:shadow-[0_24px_60px_-24px_rgba(249,115,22,0.3)]",
        featured && "lg:col-span-2"
      )}
    >
      <a
        href={`#/noticias/${item.id}`}
        onClick={(e) => {
          if (onSelect) {
            e.preventDefault();
            onSelect(item);
          }
        }}
        className={cn(
          "flex flex-1 flex-col h-full",
          featured && "lg:flex-row"
        )}
      >
        {/* Imagen de Cabecera */}
        <div
          className={cn(
            "relative overflow-hidden shrink-0",
            featured ? "aspect-video lg:aspect-auto lg:min-h-[300px] lg:w-[46%]" : "aspect-video"
          )}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-transparent",
              featured && "lg:bg-gradient-to-r"
            )}
          />
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] ring-1 backdrop-blur-md",
              category.chip
            )}
          >
            {category.label}
          </span>
        </div>

        {/* Contenido: Titulo, Subtítulo y Metadatos */}
        <div className={cn("relative flex flex-1 flex-col gap-3 p-6", featured && "lg:justify-center lg:p-9")}>
          <div className="flex items-center gap-4 font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-orange-400/70" />
              {item.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-violet-400/70" />
              {item.readTime}
            </span>
          </div>

          <h3
            className={cn(
              "font-display font-bold uppercase italic leading-snug text-white transition-colors duration-300 group-hover:text-orange-200",
              featured ? "text-xl lg:text-2xl" : "text-lg"
            )}
          >
            {item.title}
          </h3>

          {item.subtitle ? (
            <p className="line-clamp-2 text-xs font-medium text-orange-200/80 leading-relaxed">
              {item.subtitle}
            </p>
          ) : null}

          <p className="line-clamp-2 text-sm leading-relaxed text-white/50">{item.excerpt}</p>

          <div className="group/link mt-auto inline-flex items-center gap-2 pt-2 font-display text-xs font-bold uppercase tracking-[0.22em] text-orange-300/90 transition-colors group-hover:text-orange-200">
            <span>Leer noticia completa</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </div>
      </a>
    </motion.article>
  );
}

interface NewsProps {
  showFilters?: boolean;
  limit?: number;
  showViewMoreButton?: boolean;
  showSectionNumber?: boolean;
}

/** IV. NOTICIAS — cobertura de Overwatch, Fortnite, VALORANT y Marvel Rivals con estructura tipo WordPress. */
export function News({
  showFilters = true,
  limit,
  showViewMoreButton = false,
  showSectionNumber = true,
}: NewsProps = {}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todas");
  const reduce = useReducedMotion();

  // Carga reactiva de noticias desde WordPress / Local
  useEffect(() => {
    let alive = true;

    const loadData = () => {
      fetchNews().then((data) => {
        if (!alive) return;
        setItems(data);
        setLoading(false);
      });
    };

    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "overplay_wordpress_url") {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", loadData);

    return () => {
      alive = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  const displayedItems = useMemo(() => {
    const list = filter === "todas" ? items : items.filter((i) => i.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [items, filter, limit]);

  return (
    <section id="noticias" aria-label="Noticias" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-12rem] top-24 h-[26rem] w-[26rem] rounded-full bg-violet-600/8 blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index={showSectionNumber ? "04" : undefined}
          eyebrow="Noticias"
          title={
            <>
              Últimas <span className="text-brand-gradient">Noticias</span>
            </>
          }
          description="Cobertura de Overwatch y de la escena competitiva: Fortnite, VALORANT y Marvel Rivals. Todo lo que mueve a la comunidad."
        />

        {/* Filtros */}
        {showFilters && (
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-2.5" y={18}>
            {NEWS_CATEGORIES.map((cat) => {
              const isActive = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer",
                    isActive ? "text-white" : "text-white/50 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={reduce ? undefined : "news-filter-pill"}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded-full bg-brand-gradient shadow-[0_6px_24px_-6px_rgba(249,115,22,0.55)]"
                    />
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full border border-white/12 bg-white/[0.03] transition-colors duration-300 hover:border-white/25" />
                  )}
                  <span className="relative">{cat.label}</span>
                </button>
              );
            })}
          </Reveal>
        )}

        {/* Grid de noticias */}
        <Reveal className="mt-10" y={24}>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Cargando noticias">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-surface overflow-hidden rounded-2xl">
                  <div className="aspect-video animate-pulse bg-white/[0.05] motion-reduce:animate-none" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06] motion-reduce:animate-none" />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-white/[0.07] motion-reduce:animate-none" />
                    <div className="h-4 w-full animate-pulse rounded bg-white/[0.05] motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <p className="card-surface rounded-2xl p-10 text-center text-white/50">
              No hay noticias en esta categoría todavía.
            </p>
          ) : (
            <motion.div layout={!reduce} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item, index) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    featured={index === 0 && filter === "todas"}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Reveal>

        {/* Botón Ver Más Noticias */}
        {showViewMoreButton && (
          <Reveal delay={0.2} className="mt-12 flex justify-center" y={16}>
            <a
              href="#/noticias"
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:shadow-[0_8px_30px_-8px_rgba(249,115,22,0.4)] active:scale-95 cursor-pointer"
            >
              <span>Ver más noticias</span>
              <ArrowRight className="h-4 w-4 text-orange-400 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}

