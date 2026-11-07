import { supabase } from "../lib/supabase";

export interface ChampionMember {
  name: string;
  role: string;
}

export interface PastChampion {
  id: string;
  tournamentName: string;
  date: string;
  teamName: string;
  teamLogo?: string;
  gradient?: string;
  members: ChampionMember[];
}

export interface PastChampionsConfig {
  title: string;
  description: string;
  champions: PastChampion[];
}

export const DEFAULT_PAST_CHAMPIONS: PastChampionsConfig = {
  title: "Antiguos Campeones",
  description: "El salón de la gloria de Overplay: los equipos y jugadores que alcanzaron la cima en nuestros torneos oficiales.",
  champions: [
    {
      id: "champ-1",
      tournamentName: "Overplay Tourney 3",
      date: "Noviembre 2025",
      teamName: "Dark Pulse",
      teamLogo: "",
      gradient: "from-amber-500 to-orange-600",
      members: [
        { name: "KRON", role: "Tank" },
        { name: "VIPER", role: "DPS Hitscan" },
        { name: "NOVA", role: "DPS Flex" },
        { name: "LUNAR", role: "Main Support" },
        { name: "ORBE", role: "Flex Support" },
      ],
    },
    {
      id: "champ-2",
      tournamentName: "Overplay Tourney 2",
      date: "Julio 2025",
      teamName: "Vortex Gaming",
      teamLogo: "",
      gradient: "from-orange-500 to-rose-600",
      members: [
        { name: "Aner", role: "Tank" },
        { name: "Sher", role: "DPS" },
        { name: "Zation", role: "DPS" },
        { name: "Yor", role: "Support" },
        { name: "Finis", role: "Support" },
      ],
    },
    {
      id: "champ-3",
      tournamentName: "Overplay Tourney 1",
      date: "Diciembre 2024",
      teamName: "Solaris Esports",
      teamLogo: "",
      gradient: "from-rose-500 to-violet-600",
      members: [
        { name: "Mirko", role: "Tank" },
        { name: "Sait", role: "DPS" },
        { name: "Dash", role: "DPS" },
        { name: "Feroz", role: "Support" },
        { name: "Blaze", role: "Support" },
      ],
    },
  ],
};

const STORAGE_KEY = "overplay_past_champions_cache";
let inMemoryPastChampions: PastChampionsConfig | null = null;

export function getCachedPastChampions(): PastChampionsConfig {
  if (inMemoryPastChampions) return inMemoryPastChampions;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.champions) && parsed.champions.length > 0) {
          inMemoryPastChampions = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_PAST_CHAMPIONS;
}

export async function fetchPastChampions(): Promise<PastChampionsConfig> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_past_champions")
      .single();

    if (!error && data?.description) {
      let parsed: any = null;
      try {
        parsed = typeof data.description === "string" ? JSON.parse(data.description) : data.description;
      } catch (e) {
        console.warn("[Past Champions] Error parseando JSON:", e);
      }

      if (parsed && Array.isArray(parsed.champions)) {
        const result: PastChampionsConfig = {
          title: parsed.title || DEFAULT_PAST_CHAMPIONS.title,
          description: parsed.description || DEFAULT_PAST_CHAMPIONS.description,
          champions: parsed.champions,
        };
        inMemoryPastChampions = result;
        if (typeof window !== "undefined" && window.localStorage) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
          } catch {
            // ignore
          }
        }
        return result;
      }
    }
  } catch (err) {
    console.warn("[Past Champions] Error al consultar Supabase, usando caché:", err);
  }

  return getCachedPastChampions();
}

// Iniciar precarga en segundo plano
if (typeof window !== "undefined") {
  fetchPastChampions().catch(() => {});
}
