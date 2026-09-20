/** Aliados y creadores de contenido que apoyan el proyecto. */

import type { SocialPlatform } from "./site";
import { supabase } from "../lib/supabase";

export interface Ally {
  id?: string;
  name: string;
  badge: string;
  description: string;
  avatarType?: "monogram" | "image";
  avatarImage?: string;
  socials: Partial<Record<SocialPlatform, string>>;
  link: string;
  gradient: string;
}

export const ALLIES: Ally[] = [
  {
    id: "ally-1",
    name: "MKimada",
    badge: "Creador de contenido",
    description:
      "Estrategia, guías y análisis de Overwatch. Su comunidad respira competitivo en cada directo.",
    socials: { x: "#", twitch: "#", youtube: "#" },
    link: "#",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    id: "ally-2",
    name: "EvilTokki",
    badge: "Streamer",
    description:
      "Energía y variedad en directo. Voz habitual de los watch parties de los torneos de Overplay.",
    socials: { x: "#", twitch: "#" },
    link: "#",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "ally-3",
    name: "Finiscat",
    badge: "Arte & Clips",
    description:
      "Ilustración, clips y edición. Detrás de gran parte del contenido visual de la comunidad.",
    socials: { x: "#", youtube: "#" },
    link: "#",
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "ally-4",
    name: "Lordotox",
    badge: "Caster & Análisis",
    description:
      "Narración y análisis en vivo. La voz que pone emoción a las finales del Tourney.",
    socials: { x: "#", twitch: "#" },
    link: "#",
    gradient: "from-rose-500 to-red-600",
  },
];

/**
 * Obtiene la lista de aliados y creadores desde Supabase.
 * Si falla o no existe, devuelve los datos locales como fallback.
 */
export async function fetchAlliesData(): Promise<Ally[]> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_allies")
      .single();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && Array.isArray(parsed.allies)) {
        const allies: Ally[] = parsed.allies.map((a: any) => {
          const socialsMap: Partial<Record<SocialPlatform, string>> = {};
          if (a.socials && typeof a.socials === "object") {
            Object.entries(a.socials).forEach(([key, val]: [string, any]) => {
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
            id: a.id,
            name: a.name || "",
            badge: a.badge || "Creador de contenido",
            description: a.description || "",
            avatarType: a.avatarType || (a.avatarImage ? "image" : "monogram"),
            avatarImage: a.avatarImage || "",
            socials: socialsMap,
            link: a.link || "#",
            gradient: a.gradient || "from-orange-500 to-rose-600",
          };
        });

        if (allies.length > 0) {
          return allies;
        }
      }
    }
  } catch (err) {
    console.warn("[Overplay Allies] Usando datos locales de aliados (fallback):", err);
  }

  return ALLIES;
}

