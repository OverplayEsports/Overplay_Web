/** Equipo humano detrás de Overplay: staff, arte y moderación sincronizado con Supabase. */

import type { SocialPlatform } from "./site";
import { supabase } from "../lib/supabase";

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
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

const DEFAULT_SOCIALS: Record<SocialPlatform, string> = {
  x: "#",
  twitch: "#",
  instagram: "#",
  youtube: "#",
  discord: "#",
};

export const TEAM_GROUPS: TeamGroup[] = [
  {
    id: "staff",
    title: "Staff Overplay",
    description: "La cabina de mando: organización, producción y dirección de cada evento.",
    accent: "ember",
    members: [
      { name: "Nosotros", role: "Dirección", gradient: "from-orange-500 to-rose-600", socials: DEFAULT_SOCIALS },
      { name: "Aner", role: "Coordinación", gradient: "from-rose-500 to-orange-600", socials: DEFAULT_SOCIALS },
      { name: "Sher", role: "Gestión de eventos", gradient: "from-amber-500 to-red-600", socials: DEFAULT_SOCIALS },
      { name: "Zation", role: "Operaciones", gradient: "from-orange-600 to-amber-500", socials: DEFAULT_SOCIALS },
      { name: "Yor", role: "Producción", gradient: "from-red-500 to-rose-600", socials: DEFAULT_SOCIALS },
      { name: "Finis", role: "Staff", gradient: "from-orange-500 to-red-600", socials: DEFAULT_SOCIALS },
    ],
  },
  {
    id: "arte",
    title: "Apartado de Arte",
    description: "La identidad visual de Overplay: diseño, ilustración y gráficos de cada torneo.",
    accent: "violet",
    members: [
      { name: "Pombetito", role: "Dirección de arte", gradient: "from-violet-500 to-fuchsia-600", socials: DEFAULT_SOCIALS },
      { name: "Fran", role: "Diseño gráfico", gradient: "from-fuchsia-500 to-purple-600", socials: DEFAULT_SOCIALS },
    ],
  },
  {
    id: "moderacion",
    title: "Moderación",
    description: "Orden y fair play: la comunidad segura dentro y fuera de las partidas.",
    accent: "crimson",
    members: [
      { name: "Ketos", role: "Moderador jefe", gradient: "from-red-600 to-orange-500", socials: DEFAULT_SOCIALS },
      { name: "Ronet", role: "Moderador", gradient: "from-rose-600 to-red-500", socials: DEFAULT_SOCIALS },
      { name: "Shadow", role: "Moderador", gradient: "from-red-500 to-purple-600", socials: DEFAULT_SOCIALS },
    ],
  },
];

/**
 * Obtiene los grupos y miembros en tiempo real desde Supabase.
 * Si falla o está offline, devuelve TEAM_GROUPS como fallback.
 */
export async function fetchTeamGroups(): Promise<TeamGroup[]> {
  try {
    const { data: dbGroups, error: groupErr } = await supabase
      .from("team_groups")
      .select("*")
      .order("order_index", { ascending: true });

    if (groupErr || !dbGroups || dbGroups.length === 0) {
      console.warn("[Overplay Team] Usando datos locales de equipo (fallback):", groupErr);
      return TEAM_GROUPS;
    }

    const { data: dbMembers, error: memberErr } = await supabase
      .from("team_members")
      .select("*")
      .order("order_index", { ascending: true });

    if (memberErr || !dbMembers) {
      console.warn("[Overplay Team] Error al obtener miembros de Supabase:", memberErr);
      return TEAM_GROUPS;
    }

    // Mapear miembros a cada grupo (excluyendo registros de configuración)
    const formattedGroups: TeamGroup[] = dbGroups
      .filter((group: any) => !group.id?.startsWith("config_"))
      .map((group: any) => {
        const groupMembers = dbMembers
          .filter((m: any) => m.group_id === group.id)
        .map((m: any) => {
          // Extraer urls activas de socials jsonb
          const socialsMap: Partial<Record<SocialPlatform, string>> = {};
          if (m.socials && typeof m.socials === "object") {
            Object.entries(m.socials).forEach(([key, val]: [string, any]) => {
              if (val && typeof val === "object" && val.enabled && val.url) {
                socialsMap[key as SocialPlatform] = val.url;
              } else if (typeof val === "string" && val.trim()) {
                socialsMap[key as SocialPlatform] = val;
              }
            });
          }

          return {
            id: m.id,
            name: m.name,
            role: m.role,
            avatarType: m.avatar_type || "monogram",
            avatarImage: m.avatar_image || "",
            gradient: m.gradient || "from-orange-500 to-rose-600",
            socials: Object.keys(socialsMap).length > 0 ? socialsMap : DEFAULT_SOCIALS,
          };
        });

      return {
        id: group.id,
        title: group.title,
        description: group.description,
        accent: group.accent || "ember",
        members: groupMembers,
      };
    });

    return formattedGroups;
  } catch (e) {
    console.error("[Overplay Team] Error en fetchTeamGroups:", e);
    return TEAM_GROUPS;
  }
}
