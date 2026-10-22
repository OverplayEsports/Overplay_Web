/** Equipo humano detrás de Overplay: staff, arte y moderación sincronizado con Supabase. */

import type { SocialPlatform } from "./site";
import { supabase } from "../lib/supabase";

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  description?: string;
  avatarType?: "monogram" | "image";
  avatarImage?: string;
  socials?: Partial<Record<SocialPlatform, string>>;
  gradient: string;
}

export interface TeamGroup {
  id: string;
  title: string;
  description: string;
  accent: "ember" | "violet" | "crimson" | "emerald";
  members: TeamMember[];
}

const DEFAULT_SOCIALS: Partial<Record<SocialPlatform, string>> = {
  x: "https://x.com/OverplayEsports",
  twitch: "https://twitch.tv/OverplayEsports",
  discord: "https://discord.gg/overplay",
  youtube: "https://youtube.com/@OverplayEsports",
  instagram: "https://instagram.com/OverplayEsports",
};

export const TEAM_GROUPS: TeamGroup[] = [
  {
    id: "staff",
    title: "Staff Overplay",
    description: "La cabina de mando: organización, producción y dirección de cada evento.",
    accent: "ember",
    members: [
      { id: "member-1", name: "Nosotros", role: "Dirección", description: "Liderazgo, dirección general y visión competitiva de la comunidad.", gradient: "from-orange-500 to-rose-600", socials: DEFAULT_SOCIALS },
      { id: "member-2", name: "Aner", role: "Coordinación", description: "Planificación estratégica y coordinación entre equipos y organizadores.", gradient: "from-rose-500 to-orange-600", socials: DEFAULT_SOCIALS },
      { id: "member-3", name: "Sher", role: "Gestión de eventos", description: "Supervisión logística y gestión de brackets en tiempo real.", gradient: "from-amber-500 to-red-600", socials: DEFAULT_SOCIALS },
      { id: "member-4", name: "Zation", role: "Operaciones", description: "Infraestructura técnica, bots y soporte continuo durante las jornadas.", gradient: "from-orange-600 to-amber-500", socials: DEFAULT_SOCIALS },
      { id: "member-5", name: "Yor", role: "Producción", description: "Realización técnica, streams oficiales y casters en vivo.", gradient: "from-red-500 to-rose-600", socials: DEFAULT_SOCIALS },
      { id: "member-6", name: "Finis", role: "Staff", description: "Atención a participantes y soporte en el Discord de torneos.", gradient: "from-orange-500 to-red-600", socials: DEFAULT_SOCIALS },
    ],
  },
  {
    id: "arte",
    title: "Apartado de Arte",
    description: "La identidad visual de Overplay: diseño, ilustración y gráficos de cada torneo.",
    accent: "violet",
    members: [
      { id: "member-7", name: "Pombetito", role: "Dirección de arte", description: "Diseño de identidad visual, conceptos gráficos y dirección estética.", gradient: "from-violet-500 to-fuchsia-600", socials: DEFAULT_SOCIALS },
      { id: "member-8", name: "Fran", role: "Diseño gráfico", description: "Banners, creatividades promocionales y overlays de stream.", gradient: "from-fuchsia-500 to-purple-600", socials: DEFAULT_SOCIALS },
    ],
  },
  {
    id: "moderacion",
    title: "Moderación",
    description: "Orden y fair play: la comunidad segura dentro y fuera de las partidas.",
    accent: "crimson",
    members: [
      { id: "member-9", name: "Ketos", role: "Moderador jefe", description: "Responsable de arbitraje, resolución de disputas y fair play.", gradient: "from-red-600 to-orange-500", socials: DEFAULT_SOCIALS },
      { id: "member-10", name: "Ronet", role: "Moderador", description: "Control de salas de juego, verificación de jugadores y normas.", gradient: "from-rose-600 to-red-500", socials: DEFAULT_SOCIALS },
      { id: "member-11", name: "Shadow", role: "Moderador", description: "Moderación de canales de chat, comunidad y soporte en directo.", gradient: "from-red-500 to-purple-600", socials: DEFAULT_SOCIALS },
    ],
  },
];

const STORAGE_KEY = "overplay_team_groups_cache";
let inMemoryTeamGroups: TeamGroup[] | null = null;

/**
 * Devuelve de inmediato los datos de equipo en caché (memoria o localStorage),
 * evitando cualquier parpadeo o recarga de vistas desactualizadas.
 */
export function getCachedTeamGroups(): TeamGroup[] {
  if (inMemoryTeamGroups && inMemoryTeamGroups.length > 0) {
    return inMemoryTeamGroups;
  }
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryTeamGroups = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return TEAM_GROUPS;
}

/**
 * Obtiene los grupos y miembros en tiempo real desde Supabase.
 * Actualiza la caché en memoria y localStorage.
 */
export async function fetchTeamGroups(): Promise<TeamGroup[]> {
  try {
    const { data: dbGroups, error: groupErr } = await supabase
      .from("team_groups")
      .select("*")
      .order("order_index", { ascending: true });

    if (groupErr || !dbGroups || dbGroups.length === 0) {
      console.warn("[Overplay Team] Usando datos locales de equipo (fallback):", groupErr);
      return getCachedTeamGroups();
    }

    const { data: dbMembers, error: memberErr } = await supabase
      .from("team_members")
      .select("*")
      .order("order_index", { ascending: true });

    if (memberErr || !dbMembers || dbMembers.length === 0) {
      console.warn("[Overplay Team] Usando datos locales por ausencia de miembros en Supabase:", memberErr);
      return getCachedTeamGroups();
    }

    // Mapear miembros a cada grupo (excluyendo registros de configuración y miembros inválidos)
    const formattedGroups: TeamGroup[] = dbGroups
      .filter((group: any) => group && group.id && !String(group.id).startsWith("config_"))
      .map((group: any) => {
        const groupMembers = dbMembers
          .filter((m: any) => m && m.group_id === group.id && typeof m.name === "string" && m.name.trim().length > 0 && m.role !== "8==D")
          .map((m: any) => {
            // Extraer urls activas de socials jsonb (ignorando claves internas como _description)
            const socialsMap: Partial<Record<SocialPlatform, string>> = {};
            if (m.socials && typeof m.socials === "object") {
              Object.entries(m.socials).forEach(([key, val]: [string, any]) => {
                if (key.startsWith("_")) return;
                if (val && typeof val === "object" && val.enabled && val.url) {
                  socialsMap[key as SocialPlatform] = val.url;
                } else if (typeof val === "string" && val.trim()) {
                  socialsMap[key as SocialPlatform] = val;
                }
              });
            }

            const memberDescription =
              (typeof m.description === "string" && m.description.trim()) ||
              (typeof m.socials?._description === "string" && m.socials._description.trim()) ||
              "";

            return {
              id: m.id || String(Math.random()),
              name: m.name || "Miembro",
              role: m.role || "Staff",
              description: memberDescription,
              avatarType: (m.avatar_type === "image" || m.avatar_image ? "image" : "monogram") as "monogram" | "image",
              avatarImage: typeof m.avatar_image === "string" ? m.avatar_image : "",
              gradient: m.gradient || "from-orange-500 to-rose-600",
              socials: Object.keys(socialsMap).length > 0 ? socialsMap : DEFAULT_SOCIALS,
            };
          });

        // Si un grupo estándar en Supabase quedó sin miembros pero existe en TEAM_GROUPS, preservar los locales
        const fallbackGroup = TEAM_GROUPS.find((tg) => tg.id === group.id);
        const finalMembers = groupMembers.length > 0 ? groupMembers : (fallbackGroup?.members || []);

        return {
          id: group.id,
          title: group.title || fallbackGroup?.title || "Grupo",
          description: group.description || fallbackGroup?.description || "",
          accent: (group.accent || fallbackGroup?.accent || "ember") as TeamGroup["accent"],
          members: finalMembers,
        };
      });

    const hasAnyMembers = formattedGroups.some((g) => g.members && g.members.length > 0);
    if (!hasAnyMembers) {
      console.warn("[Overplay Team] Ningún grupo contiene miembros, usando datos predeterminados.");
      return getCachedTeamGroups();
    }

    inMemoryTeamGroups = formattedGroups;
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedGroups));
      } catch {
        // ignore
      }
    }

    return formattedGroups;
  } catch (e) {
    console.error("[Overplay Team] Error en fetchTeamGroups:", e);
    return getCachedTeamGroups();
  }
}

// Iniciar precarga en segundo plano al importar
if (typeof window !== "undefined") {
  fetchTeamGroups().catch(() => {});
}
