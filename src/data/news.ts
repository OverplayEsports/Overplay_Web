/**
 * Adaptador y Consumo de Noticias de Overplay.
 *
 * Integración nativa con la API REST de WordPress:
 * Consume https://<tu-wordpress>/wp-json/wp/v2/posts?_embed
 *
 * Mapea la estructura requerida:
 * - Imagen de Cabecera (Featured Media o primera imagen)
 * - Título (post.title.rendered)
 * - Subtítulo (post.acf.subtitle, post.meta.subtitle o post.excerpt)
 * - Texto General enriquecido con imágenes (post.content.rendered)
 * - Categoría, Autor, Fecha y Tiempo de lectura calculado
 */

export type NewsCategory = "overwatch" | "fortnite" | "valorant" | "marvel-rivals";

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  date: string;
  image: string; // Imagen de cabecera
  readTime: string;
  content: string; // Texto general con formato y soporte para imágenes (HTML o Markdown)
  attachedImages?: string[];
  isHtml?: boolean;
}

export const NEWS_CATEGORIES: { id: NewsCategory | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "overwatch", label: "Overwatch" },
  { id: "fortnite", label: "Fortnite" },
  { id: "valorant", label: "VALORANT" },
  { id: "marvel-rivals", label: "Marvel Rivals" },
];

export const CATEGORY_STYLES: Record<
  NewsCategory,
  { label: string; chip: string }
> = {
  overwatch: {
    label: "Overwatch",
    chip: "bg-orange-500/15 text-orange-300 ring-orange-400/30",
  },
  fortnite: {
    label: "Fortnite",
    chip: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
  },
  valorant: {
    label: "VALORANT",
    chip: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
  },
  "marvel-rivals": {
    label: "Marvel Rivals",
    chip: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  },
};

/**
 * URL base de la instalación de WordPress.
 * Puede sobreescribirse mediante la variable de entorno VITE_WORDPRESS_URL o localStorage.
 */
export const DEFAULT_WORDPRESS_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WORDPRESS_URL) ||
  (typeof window !== "undefined" && localStorage.getItem("overplay_wordpress_url")) ||
  "https://overplay5.wordpress.com";

/**
 * Noticias por defecto (fallback seguro cuando WordPress no está disponible o en desarrollo offline).
 */
export const FALLBACK_NEWS_ITEMS: NewsItem[] = [
  {
    id: "tourney-4-inscripciones",
    category: "overwatch",
    title: "Overplay Tourney 4 abre sus inscripciones a todos los equipos",
    subtitle: "La cuarta edición del torneo insignia eleva el nivel con formato de doble eliminación y transmisión oficial.",
    excerpt:
      "La cuarta edición del torneo insignia ya tiene fecha. Registra tu roster de cinco, asegura tu plaza en el bracket y compite por el título de la comunidad.",
    author: "Staff Overplay",
    date: "12 Mar 2026",
    image: "/images/tourney-banner.jpg",
    readTime: "3 min",
    content: `## El Escenario Principal de la Comunidad

La cuarta edición del torneo insignia de Overplay ya está en marcha. Tras el rotundo éxito de las ediciones anteriores, volvemos con un formato renovado, mayor nivel organizativo y retransmisión completa con casters oficiales.

### Estructura y Formato de Competencia

Los enfrentamientos se llevarán a cabo en un bracket de **Doble Eliminación (5v5)**, lo que garantiza que cada equipo tenga una segunda oportunidad en el Losers Bracket para alcanzar la Gran Final.

> "El objetivo de esta edición es brindar una experiencia profesional tanto para jugadores consolidados como para nuevas escuadras emergentes."

### ¿Cómo Inscribirse?

1. Reúne a tu quinteto titular y hasta dos suplentes.
2. Ingresa al servidor oficial de Discord y valida los Riot / Battle.net IDs de todos los integrantes.
3. Completa el formulario de confirmación antes del cierre de plazas oficiales.

Las partidas comenzarán el fin de semana del 21 y 22 de marzo a partir de las 18:00 CEST. ¡Prepara a tu escuadra y compite por la gloria!`,
    attachedImages: ["/images/tourney-banner.jpg"],
    isHtml: false,
  },
  {
    id: "meta-guia-temporada",
    category: "overwatch",
    title: "Guía de meta: los héroes clave de la nueva temporada",
    subtitle: "Desglose técnico de las mejores composiciones y selecciones prioritarias para escalar en el ladder.",
    excerpt:
      "Analizamos las composiciones que están dominando el competitivo y qué picks priorizar si quieres escalar en el ladder antes del Tourney 4.",
    author: "Dirección Técnica",
    date: "08 Mar 2026",
    image: "/images/news-overwatch.jpg",
    readTime: "6 min",
    content: `## Análisis del Estado Actual del Juego

Con los últimos ajustes de balance, el ritmo de las partidas se ha transformado notablemente. Las composiciones de dive coordinado y poke de larga distancia han ganado terreno sobre los planteamientos estáticos de brawl.

### Selecciones Prioritarias por Rol

- **Tanques**: Flexibilidad de movilidad y control de espacio vertical.
- **DPS**: Héroes con capacidad de castigo instantáneo en rotaciones abiertas.
- **Soportes**: Prioridad de utilidad de supervivencia y habilitación de iniciaciones rápidas.

Revisa los replays de los mejores jugadores y adapta el pool de tu equipo antes de que arranque la jornada de torneos.`,
    attachedImages: ["/images/news-overwatch.jpg"],
    isHtml: false,
  },
  {
    id: "valorant-amistoso",
    category: "valorant",
    title: "La comunidad se expande: primer evento amistoso de VALORANT",
    subtitle: "Overplay incursiona en el shooter táctico con su primer torneo abierto para toda la comunidad.",
    excerpt:
      "Overplay abre su primer evento fuera de Overwatch: un torneo comunitario de VALORANT con formato rápido, casters en directo y brackets abiertos.",
    author: "Comunidad Esports",
    date: "27 Feb 2026",
    image: "/images/news-valorant.jpg",
    readTime: "2 min",
    content: `## Nuevos Horizontes Competitivos

Atendiendo a la demanda de nuestros miembros, Overplay expande sus actividades competitivas organizando el primer torneo relámpago de VALORANT.

### Detalles del Encuentro

- **Modo**: 5v5 Modo Competitivo en servidores oficiales de Madrid / Frankfurt.
- **Map Pool**: Ascent, Haven, Bind, Split y Sunset.
- **Transmisión**: En vivo por el canal oficial de Twitch con sorteos para el chat.`,
    attachedImages: ["/images/news-valorant.jpg"],
    isHtml: false,
  },
  {
    id: "fortnite-capitulo",
    category: "fortnite",
    title: "Análisis del nuevo capítulo: mapa, armas y rotaciones",
    subtitle: "Todo lo que necesitas saber sobre el nuevo mapa, cambios en el loot pool y estrategias de rotación.",
    excerpt:
      "Todo lo que cambió en la isla: puntos de interés, loot pool y las rotaciones que están marcando el early game en el competitivo de Fortnite.",
    author: "Área de Análisis",
    date: "20 Feb 2026",
    image: "/images/news-fortnite.jpg",
    readTime: "5 min",
    content: `## La Evolución de la Isla

El nuevo capítulo introduce modificaciones sustanciales en el terreno y la distribución de recursos clave. Las zonas elevadas y los nuevos medios de transporte definen las rutas más eficientes para el late game en partidas clasificatorias.`,
    attachedImages: ["/images/news-fortnite.jpg"],
    isHtml: false,
  },
  {
    id: "marvel-rivals-ranked",
    category: "marvel-rivals",
    title: "Marvel Rivals: las mejores composiciones para ranked",
    subtitle: "Team-ups sinérgicos y estructura de escuadras de seis para dominar la escalera clasificatoria.",
    excerpt:
      "Team-ups que rompen el meta, counters imprescindibles y cómo estructurar tu equipo de seis para ganar consistencia en la escalera clasificatoria.",
    author: "Redacción Esports",
    date: "14 Feb 2026",
    image: "/images/news-marvel.jpg",
    readTime: "4 min",
    content: `## El Poder de las Sinergias

En Marvel Rivals, los efectos de Team-Up son el factor decisivo que puede voltear cualquier combate en punto de captura. Descubre cómo combinar habilidades definitivas para maximizar el daño en área y control de masas.`,
    attachedImages: ["/images/news-marvel.jpg"],
    isHtml: false,
  },
];

// --- Helpers para procesar la API REST de WordPress ---

function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  if (typeof document !== "undefined") {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || text;
  }
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function formatWpDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function extractCategoryFromWp(post: any): NewsCategory {
  try {
    const terms = post._embedded?.["wp:term"]?.flat() || [];
    const termStrings = terms
      .map((term: any) => `${term.slug || ""} ${term.name || ""}`.toLowerCase())
      .join(" ");
    const postSlug = (post.slug || "").toLowerCase();
    const postTitle = (post.title?.rendered || "").toLowerCase();
    const fullText = `${termStrings} ${postSlug} ${postTitle}`;

    // 1. Fortnite (reconoce 'fortnite', 'fornite', 'fort', etc.)
    if (
      fullText.includes("fortnite") ||
      fullText.includes("fornite") ||
      fullText.includes("battle royale")
    ) {
      return "fortnite";
    }

    // 2. Marvel Rivals (reconoce 'marvel', 'rivals', etc.)
    if (
      fullText.includes("marvel") ||
      fullText.includes("rivals") ||
      fullText.includes("netease")
    ) {
      return "marvel-rivals";
    }

    // 3. VALORANT (reconoce 'valorant', 'vct', 'riot', etc.)
    if (
      fullText.includes("valorant") ||
      fullText.includes("val ") ||
      fullText.includes("vct")
    ) {
      return "valorant";
    }

    // 4. Overwatch (reconoce 'overwatch', 'ow2', 'blizzard', etc.)
    if (
      fullText.includes("overwatch") ||
      fullText.includes("ow2") ||
      fullText.includes("blizzard")
    ) {
      return "overwatch";
    }
  } catch (e) {
    console.warn("No se pudo extraer la categoría del post de WordPress", e);
  }
  return "overwatch";
}

function extractImagesFromHtml(html: string): string[] {
  const images: string[] = [];
  if (!html) return images;
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[1] && !images.includes(match[1])) {
      images.push(match[1]);
    }
  }
  return images;
}

function calculateReadTime(text: string): string {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min`;
}

/**
 * Transforma un post de la API REST de WordPress al formato uniforme NewsItem.
 */
export function transformWordPressPost(post: any): NewsItem {
  const title = decodeHtmlEntities(post.title?.rendered || "Sin título");
  const rawContent = post.content?.rendered || "";
  const rawExcerpt = post.excerpt?.rendered || "";

  // 1. Imagen de Cabecera (Featured Media de WordPress o primera imagen del contenido)
  const featuredMediaUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
    post.featured_media_src_url ||
    "";

  const allContentImages = extractImagesFromHtml(rawContent);
  const headerImage =
    featuredMediaUrl || allContentImages[0] || "/images/tourney-banner.jpg";

  // 2. Extracción Inteligente de Subtítulo y Separación del Contenido
  let cleanSubtitle = "";
  let cleanContent = rawContent;

  // Si tiene campo personalizado explícito (ACF o meta)
  if (post.acf?.subtitle || post.acf?.subtitulo || post.meta?.subtitle) {
    cleanSubtitle = decodeHtmlEntities(
      post.acf?.subtitle || post.acf?.subtitulo || post.meta?.subtitle
    );
  } else {
    // Buscar si el contenido empieza con un encabezado (h1, h2, h3, h4) o párrafo destacado que actúa como subtítulo
    const headingMatch =
      rawContent.match(
        /^\s*<(h[1-4]|p\s+class="[^"]*(?:subtitle|lead|has-large-font-size|wp-block-heading)[^"]*")[^>]*>([\s\S]*?)<\/\1>/i
      ) || rawContent.match(/^\s*<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/i);

    if (headingMatch) {
      const extractedHeadingText = stripHtml(headingMatch[2]);
      if (extractedHeadingText) {
        cleanSubtitle = decodeHtmlEntities(extractedHeadingText);
        // Remover el encabezado del contenido para que no se duplique en el cuerpo del desarrollo
        cleanContent = rawContent.replace(headingMatch[0], "").trim();
      }
    } else {
      // Si no hay encabezado inicial, verificar si el extracto fue ingresado manualmente
      const isAutoExcerpt =
        /\[(?:&hellip;|\.\.\.)\]/.test(rawExcerpt) ||
        /&hellip;$/.test(rawExcerpt.trim());

      if (rawExcerpt && !isAutoExcerpt) {
        cleanSubtitle = decodeHtmlEntities(stripHtml(rawExcerpt));
      } else if (rawExcerpt) {
        // En extracto automático, tomar solo la primera frase/oración limpia
        const textWithoutEllipsis = stripHtml(rawExcerpt)
          .replace(/\[(?:&hellip;|\.\.\.)\]/g, "")
          .trim();
        const firstSentenceMatch = textWithoutEllipsis.match(/^([^.!?]+[.!?])/);
        cleanSubtitle = decodeHtmlEntities(
          firstSentenceMatch ? firstSentenceMatch[1].trim() : textWithoutEllipsis
        );
      }
    }
  }

  // 3. Extracto para tarjetas del portal
  const shortExcerpt =
    cleanSubtitle ||
    decodeHtmlEntities(stripHtml(cleanContent).slice(0, 150) + "...");

  // 4. Autor
  const authorName =
    post._embedded?.author?.[0]?.name || post.author_name || "Staff Overplay";

  // 5. Categoría
  const category = extractCategoryFromWp(post);

  // 6. Fecha y tiempo de lectura
  const date = formatWpDate(post.date);
  const readTime = calculateReadTime(cleanContent || rawContent);

  // 7. Galería de imágenes adjuntas
  const attachedImages = [
    ...(featuredMediaUrl ? [featuredMediaUrl] : []),
    ...allContentImages,
  ].filter((v, i, a) => a.indexOf(v) === i);

  return {
    id: String(post.id || post.slug),
    category,
    title,
    subtitle: cleanSubtitle,
    excerpt: shortExcerpt,
    author: authorName,
    date,
    image: headerImage,
    readTime,
    content: cleanContent,
    attachedImages,
    isHtml: true,
  };
}

export function getWordPressEndpoints(inputUrl: string): string[] {
  const clean = inputUrl.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const endpoints: string[] = [];

  // Si es un subdominio de WordPress.com (ej. overplay5.wordpress.com)
  if (clean.includes("wordpress.com")) {
    const siteSlug = clean.split("/")[0];
    endpoints.push(
      `https://public-api.wordpress.com/wp/v2/sites/${siteSlug}/posts?_embed=1&per_page=20`
    );
  }

  // Endpoints estándar de WordPress autoalojado / custom domain
  const fullBase = inputUrl.startsWith("http")
    ? inputUrl.replace(/\/+$/, "")
    : `https://${clean}`;

  endpoints.push(`${fullBase}/wp-json/wp/v2/posts?_embed=1&per_page=20&status=publish`);
  endpoints.push(`${fullBase}/?rest_route=/wp/v2/posts&_embed=1&per_page=20&status=publish`);

  return endpoints;
}

/**
 * Obtiene las noticias directamente desde WordPress.
 * Si WordPress no está configurado o falla la conexión, devuelve los datos de reserva (FALLBACK_NEWS_ITEMS).
 */
export async function fetchNews(customWpUrl?: string): Promise<NewsItem[]> {
  const wpBaseUrl = (
    customWpUrl ||
    DEFAULT_WORDPRESS_URL ||
    (typeof window !== "undefined" && localStorage.getItem("overplay_wordpress_url")) ||
    ""
  ).replace(/\/+$/, "");

  if (!wpBaseUrl) {
    console.info(
      "[Overplay News] No hay URL de WordPress configurada todavía. Mostrando noticias de plantilla."
    );
    await new Promise((r) => setTimeout(r, 100));
    return FALLBACK_NEWS_ITEMS;
  }

  console.log(`[Overplay News] Conectando con WordPress en: ${wpBaseUrl}`);

  const endpointsToTry = getWordPressEndpoints(wpBaseUrl);

  for (const endpoint of endpointsToTry) {
    try {
      console.log(`[Overplay News] Consultando endpoint: ${endpoint}`);
      const res = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.warn(`[Overplay News] Endpoint respondió con status ${res.status}: ${res.statusText}`);
        continue;
      }

      const posts = await res.json();
      if (!Array.isArray(posts)) {
        console.warn("[Overplay News] La respuesta no fue un array de posts:", posts);
        continue;
      }

      console.log(`[Overplay News] ¡Éxito! Se obtuvieron ${posts.length} posts desde WordPress.`);

      if (posts.length === 0) {
        console.info(
          "[Overplay News] WordPress respondió correctamente pero no hay posts publicados."
        );
        return FALLBACK_NEWS_ITEMS;
      }

      return posts.map(transformWordPressPost);
    } catch (err: any) {
      console.warn(`[Overplay News] Error al consultar ${endpoint}:`, err);
    }
  }

  console.warn(
    `[Overplay News] No se pudo obtener respuesta válida de WordPress en '${wpBaseUrl}'. Mostrando noticias de respaldo.`
  );
  return FALLBACK_NEWS_ITEMS;
}
