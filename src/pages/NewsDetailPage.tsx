import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  User,
  Share2,
  Check,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  CATEGORY_STYLES,
  fetchNews,
  type NewsItem,
} from "../data/news";
import { FormattedContent, NewsCard } from "../components/sections/News";
import { Button } from "../components/ui/Button";
import { FinalCTA } from "../components/FinalCTA";
import { cn } from "../utils/cn";

interface NewsDetailPageProps {
  articleId?: string;
}

/**
 * Vista completa independiente para leer un artículo de noticia.
 * Se accede mediante la ruta #/noticias/:id (ej. #/noticias/6 o #/noticias/tourney-4-inscripciones).
 */
export function NewsDetailPage({ articleId }: NewsDetailPageProps) {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchNews().then((data) => {
      if (!alive) return;
      setAllNews(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Encontrar el artículo por id o slug
  const article = useMemo(() => {
    if (!articleId) return allNews[0] || null;
    return allNews.find(
      (item) =>
        item.id === articleId ||
        item.id.toLowerCase() === articleId.toLowerCase() ||
        item.id === `post-${articleId}` ||
        `post-${item.id}` === articleId
    ) || null;
  }, [allNews, articleId]);

  // Otras noticias recomendadas (excluyendo el artículo actual)
  const relatedNews = useMemo(() => {
    if (!article) return allNews.slice(0, 3);
    const others = allNews.filter((item) => item.id !== article.id);
    // Priorizar misma categoría si es posible
    const sameCat = others.filter((item) => item.category === article.category);
    const diffCat = others.filter((item) => item.category !== article.category);
    return [...sameCat, ...diffCat].slice(0, 3);
  }, [allNews, article]);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const categoryStyle = article
    ? CATEGORY_STYLES[article.category] || CATEGORY_STYLES.overwatch
    : CATEGORY_STYLES.overwatch;

  return (
    <div className="pt-20 sm:pt-24 pb-20">
      {/* Fondo ambiental */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 h-[32rem] w-[50rem] rounded-full bg-orange-500/10 blur-[150px]" />
        <div className="absolute right-0 top-1/3 h-[24rem] w-[24rem] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        {/* Barra superior de navegación / Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-4 border-b border-white/10">
          <a
            href="#/noticias"
            className="group inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
            <span>Volver a todas las noticias</span>
          </a>

          {article && (
            <div className="flex items-center gap-2 font-display text-xs text-white/40">
              <a href="#/noticias" className="hover:text-white/70 transition-colors">
                Noticias
              </a>
              <ChevronRight className="h-3.5 w-3.5 text-white/20" />
              <span className="text-white/80 font-medium truncate max-w-[200px] sm:max-w-[320px]">
                {article.title}
              </span>
            </div>
          )}
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="card-surface rounded-3xl p-8 sm:p-12 space-y-6 my-8 animate-pulse">
            <div className="h-64 sm:h-96 w-full rounded-2xl bg-white/[0.06]" />
            <div className="h-4 w-32 rounded bg-white/[0.08]" />
            <div className="h-10 w-3/4 rounded bg-white/[0.08]" />
            <div className="h-6 w-1/2 rounded bg-white/[0.06]" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full rounded bg-white/[0.04]" />
              <div className="h-4 w-full rounded bg-white/[0.04]" />
              <div className="h-4 w-5/6 rounded bg-white/[0.04]" />
            </div>
          </div>
        ) : !article ? (
          /* Noticia no encontrada */
          <div className="card-surface rounded-3xl p-12 text-center my-12 border border-white/10">
            <BookOpen className="h-14 w-14 text-orange-400/60 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold uppercase italic text-white mb-2">
              Noticia no encontrada
            </h2>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
              El artículo que buscas no existe, ha sido movido o aún no se ha sincronizado con WordPress.
            </p>
            <Button as="a" href="#/noticias" size="md">
              Explorar otras noticias
            </Button>
          </div>
        ) : (
          /* Vista de Artículo Completo */
          <article className="card-surface relative my-6 flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#08080c] shadow-[0_30px_100px_rgba(0,0,0,0.85)]">
            {/* 1. Gran Portada / Header Image */}
            <div className="relative h-72 sm:h-[460px] w-full overflow-hidden bg-black">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/50 to-transparent" />

              {/* Insignia de categoría flotante */}
              <div className="absolute top-6 left-6">
                <span
                  className={cn(
                    "rounded-full px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] ring-1 backdrop-blur-md shadow-lg",
                    categoryStyle.chip
                  )}
                >
                  {categoryStyle.label}
                </span>
              </div>

              {/* Barra de metadatos sobre la imagen */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-white/90 border border-white/15 backdrop-blur-md">
                    <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-white/90 border border-white/15 backdrop-blur-md">
                    <Clock3 className="h-3.5 w-3.5 text-purple-400" />
                    {article.readTime}
                  </span>
                  {article.author && (
                    <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-white/90 border border-white/15 backdrop-blur-md">
                      <User className="h-3.5 w-3.5 text-rose-400" />
                      {article.author}
                    </span>
                  )}
                </div>

                {/* Botón compartir */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-white border border-white/15 backdrop-blur-md hover:bg-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer"
                  title="Copiar enlace"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">¡Enlace copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-orange-400" />
                      <span>Compartir</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Cuerpo del Artículo */}
            <div className="px-6 py-8 sm:px-12 sm:py-12 space-y-8">
              {/* Título Principal */}
              <div>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase italic text-white tracking-tight leading-none text-balance">
                  {article.title}
                </h1>

                {/* Subtítulo */}
                {article.subtitle && (
                  <p className="mt-5 border-l-4 border-orange-500/80 pl-4 sm:pl-6 py-1 font-display text-lg sm:text-2xl font-medium text-orange-200/90 italic leading-relaxed">
                    {article.subtitle}
                  </p>
                )}
              </div>

              {/* Separador brillante */}
              <div className="h-px w-full bg-gradient-to-r from-orange-500/60 via-purple-500/40 to-transparent" />

              {/* Contenido General (HTML de WordPress o Markdown) */}
              <div className="prose prose-invert max-w-none text-base sm:text-lg">
                <FormattedContent content={article.content || article.excerpt} />
              </div>

              {/* 3. Galería de Imágenes Adjuntas (si contiene más de 1) */}
              {article.attachedImages && article.attachedImages.length > 1 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.25em] text-orange-400 mb-4">
                    <ImageIcon className="h-4 w-4" />
                    <span>Galería de Imágenes Adjuntas</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {article.attachedImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="group/img relative overflow-hidden rounded-2xl border border-white/10 aspect-video bg-black/40"
                      >
                        <img
                          src={imgUrl}
                          alt={`Imagen adjunta ${i + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pie de Artículo */}
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Publicado en Overplay Esports · {article.date}</span>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Sección: Otras Noticias Recomendadas */}
        {relatedNews.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
                  Explora más
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase italic text-white mt-1">
                  Otras Noticias Destacadas
                </h3>
              </div>
              <a
                href="#/noticias"
                className="hidden sm:inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-white/60 hover:text-orange-400 transition-colors"
              >
                <span>Ver todas</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <FinalCTA />
    </div>
  );
}
