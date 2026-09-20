/** Configuración global del sitio: navegación y redes oficiales. */

import { supabase } from "../lib/supabase";

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: "inicio", label: "Inicio", href: "#/" },
  { id: "nosotros", label: "Sobre Nosotros", href: "#/nosotros" },
  { id: "eventos", label: "Eventos", href: "#/eventos" },
  { id: "competitivo", label: "Competitivo", href: "#/competitivo" },
  { id: "noticias", label: "Noticias", href: "#/noticias" },
  { id: "aliados", label: "Aliados", href: "#/aliados" },
];

export type SocialPlatform = "x" | "twitch" | "instagram" | "youtube" | "discord";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

export const OFFICIAL_SOCIALS: SocialLink[] = [
  { platform: "x", href: "#", label: "Overplay en X" },
  { platform: "twitch", href: "#", label: "Overplay en Twitch" },
  { platform: "youtube", href: "#", label: "Overplay en YouTube" },
  { platform: "discord", href: "#", label: "Discord de Overplay" },
];

export const SITE = {
  name: "Overplay",
  tagline: "Donde la competencia comienza.",
  heroSubtitle:
    "Eventos competitivos, comunidad y talento unidos en un mismo lugar.",
  footerNote: "Donde la competencia comienza y nace la comunidad.",
} as const;

export interface HeroData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  tagline: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  editionNumber: string;
  playersCount: string;
  communityCount: string;
  backgroundImage?: string;
}

export const DEFAULT_HERO_DATA: HeroData = {
  eyebrow: "Organización de Esports — Overwatch",
  titlePrefix: "Over",
  titleHighlight: "play",
  tagline: "Donde la competencia comienza.",
  subtitle: "Eventos competitivos, comunidad y talento unidos en un mismo lugar.",
  primaryButtonText: "Ver Overplay Tourney 4",
  primaryButtonUrl: "#/eventos",
  secondaryButtonText: "Sobre Nosotros",
  secondaryButtonUrl: "#/nosotros",
  editionNumber: "04",
  playersCount: "+300",
  communityCount: "+1.2K",
  backgroundImage: "/images/hero-bg.jpg",
};

export const DEFAULT_TICKER_ITEMS: string[] = [
  "Overplay Tourney 4",
  "Inscripciones abiertas",
  "Formato 5v5",
  "Doble eliminación",
  "Comunidad Overplay",
  "Donde la competencia comienza",
];

export interface CtaData {
  eyebrow: string;
  titleMain: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bannerImage?: string;
}

export const DEFAULT_CTA_DATA: CtaData = {
  eyebrow: "Overplay Tourney 4 te espera",
  titleMain: "¿Listo para ",
  titleHighlight: "competir?",
  description: "Inscribe a tu equipo, enfréntate a los mejores y sé parte de la mayor comunidad competitiva de Overwatch.",
  buttonText: "Inscribirse al Torneo",
  buttonUrl: "#eventos",
  bannerImage: "/images/tourney-banner.jpg",
};

/** Obtener configuración de Hero desde Supabase */
export async function fetchHeroData(): Promise<HeroData> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_hero")
      .single();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && parsed.hero) {
        return { ...DEFAULT_HERO_DATA, ...parsed.hero };
      }
    }
  } catch (err) {
    console.warn("[Hero] Usando datos locales:", err);
  }
  return DEFAULT_HERO_DATA;
}

/** Obtener titulares de Display Deslizante desde Supabase */
export async function fetchTickerData(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_ticker")
      .single();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && parsed.ticker && Array.isArray(parsed.ticker.items) && parsed.ticker.items.length > 0) {
        return parsed.ticker.items;
      }
    }
  } catch (err) {
    console.warn("[Ticker] Usando datos locales:", err);
  }
  return DEFAULT_TICKER_ITEMS;
}

/** Obtener configuración de Recuadro CTA desde Supabase */
export async function fetchCtaData(): Promise<CtaData> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_cta")
      .single();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && parsed.cta) {
        return { ...DEFAULT_CTA_DATA, ...parsed.cta };
      }
    }
  } catch (err) {
    console.warn("[CTA] Usando datos locales:", err);
  }
  return DEFAULT_CTA_DATA;
}

