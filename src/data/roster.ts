import type { SocialPlatform } from "./site";
import { supabase } from "../lib/supabase";

export interface Player {
  id?: string;
  tag: string;
  name: string;
  role: string;
  position: string;
  events: string[];
  avatarType?: "monogram" | "image";
  avatarImage?: string;
  socials: Partial<Record<SocialPlatform, string>>;
  gradient: string;
}

export const ROSTER: Player[] = [
  {
    tag: "01",
    name: "KRON",
    role: "Main Tank",
    position: "Capitán",
    events: ["Tourney 1", "Tourney 2", "Tourney 3", "Clash Cup"],
    socials: { x: "#", twitch: "#" },
    gradient: "from-orange-500 to-rose-600",
  },
  {
    tag: "02",
    name: "VIPER",
    role: "DPS Hitscan",
    position: "Titular",
    events: ["Tourney 2", "Tourney 3", "Clash Cup"],
    socials: { x: "#", twitch: "#" },
    gradient: "from-rose-500 to-red-600",
  },
  {
    tag: "03",
    name: "NOVA",
    role: "DPS Proyectil",
    position: "Titular",
    events: ["Tourney 3", "Clash Cup"],
    socials: { x: "#", youtube: "#" },
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    tag: "04",
    name: "SAIT",
    role: "Flex Tank",
    position: "Titular",
    events: ["Tourney 1", "Tourney 3", "Clash Cup"],
    socials: { x: "#", twitch: "#" },
    gradient: "from-amber-500 to-orange-600",
  },
  {
    tag: "05",
    name: "LUNAR",
    role: "Main Support",
    position: "Titular",
    events: ["Tourney 2", "Tourney 3", "Clash Cup"],
    socials: { x: "#", twitch: "#" },
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    tag: "06",
    name: "ORBE",
    role: "Flex Support",
    position: "Titular",
    events: ["Tourney 3", "Clash Cup"],
    socials: { x: "#" },
    gradient: "from-red-500 to-rose-600",
  },
  {
    tag: "07",
    name: "DASH",
    role: "DPS",
    position: "Suplente",
    events: ["Tourney 3"],
    socials: { x: "#", twitch: "#" },
    gradient: "from-orange-600 to-red-600",
  },
  {
    tag: "08",
    name: "FEROZ",
    role: "Tank",
    position: "Suplente",
    events: ["Tourney 3", "Clash Cup"],
    socials: { x: "#" },
    gradient: "from-purple-500 to-violet-600",
  },
  {
    tag: "09",
    name: "MIRKO",
    role: "Head Coach",
    position: "Cuerpo técnico",
    events: ["Tourney 2", "Tourney 3", "Clash Cup"],
    socials: { x: "#", youtube: "#" },
    gradient: "from-rose-600 to-violet-600",
  },
];

export interface TeamEvent {
  name: string;
  year: string;
  result: string;
  tier: "gold" | "silver" | "bronze" | "neutral";
  blurb: string;
}

export const TEAM_EVENTS: TeamEvent[] = [
  {
    name: "Overplay Tourney 1",
    year: "2024",
    result: "Cuartos de final",
    tier: "neutral",
    blurb: "El debut del roster ante la comunidad. Primer contacto con el escenario.",
  },
  {
    name: "Overplay Tourney 2",
    year: "2025",
    result: "Semifinales",
    tier: "bronze",
    blurb: "Salto de nivel: el equipo empieza a competir contra los brackets altos.",
  },
  {
    name: "Overplay Tourney 3",
    year: "2025",
    result: "Subcampeones",
    tier: "silver",
    blurb: "A un mapa del título. La final más reñida en la historia de Overplay.",
  },
  {
    name: "Community Clash Cup",
    year: "2025",
    result: "Campeones",
    tier: "gold",
    blurb: "Primer título oficial de UL. Invictos durante todo el bracket.",
  },
];

/**
 * Obtiene el roster competitivo y el historial de torneos desde Supabase.
 * Si falla o no existe, devuelve los datos locales como fallback.
 */
export async function fetchCompetitiveData(): Promise<{ roster: Player[]; events: TeamEvent[] }> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_competitive_roster")
      .single();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && Array.isArray(parsed.roster)) {
        const roster: Player[] = parsed.roster.map((p: any) => {
          const socialsMap: Partial<Record<SocialPlatform, string>> = {};
          if (p.socials && typeof p.socials === "object") {
            Object.entries(p.socials).forEach(([key, val]: [string, any]) => {
              if (val && typeof val === "object") {
                if (val.enabled && val.url) {
                  socialsMap[key as SocialPlatform] = val.url;
                }
              } else if (typeof val === "string" && val.trim()) {
                socialsMap[key as SocialPlatform] = val;
              }
            });
          }
          return {
            id: p.id,
            tag: p.tag || "01",
            name: p.name || "",
            role: p.role || "Player",
            position: p.position || "Titular",
            events: Array.isArray(p.events) ? p.events : [],
            avatarType: p.avatarType || (p.avatarImage ? "image" : "monogram"),
            avatarImage: p.avatarImage || "",
            socials: socialsMap,
            gradient: p.gradient || "from-orange-500 to-rose-600",
          };
        });

        const events: TeamEvent[] = Array.isArray(parsed.events) && parsed.events.length > 0
          ? parsed.events
          : TEAM_EVENTS;

        return { roster, events };
      }
    }
  } catch (err) {
    console.warn("[Overplay Competitive] Usando datos locales de competitivo (fallback):", err);
  }

  return { roster: ROSTER, events: TEAM_EVENTS };
}
