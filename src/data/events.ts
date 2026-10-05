/** Datos y configuración del evento / torneo insignia conectado con Supabase. */

import { supabase } from "../lib/supabase";

export interface TourneyInfoItem {
  id?: string;
  icon: string;
  label: string;
  value: string;
}

export interface ProcessPhase {
  id?: string;
  step: string;
  icon: string;
  title: string;
  text: string;
}

export interface EventData {
  id: string;
  statusBadge: string;
  titlePrefix: string;
  titleMain: string;
  edition: string;
  description: string;
  bannerImage: string;
  chips: string[];
  registerButtonText: string;
  registerButtonUrl: string;
  rulesButtonText: string;
  rulesButtonUrl: string;
  infoItems: TourneyInfoItem[];
  processPhases: ProcessPhase[];
}

export const DEFAULT_EVENT_DATA: EventData = {
  id: "tourney-4",
  statusBadge: "Inscripciones abiertas",
  titlePrefix: "Overplay",
  titleMain: "Tourney",
  edition: "4",
  description:
    "La cuarta edición del torneo insignia reúne a los mejores equipos de la comunidad en un bracket 5v5 de doble eliminación. Compite, demuestra y escribe tu nombre en la historia de Overplay.",
  bannerImage: "/images/tourney-banner.jpg",
  chips: ["5v5", "Doble eliminación", "Marzo 2026"],
  registerButtonText: "Inscribirse",
  registerButtonUrl: "#inscripcion",
  rulesButtonText: "Ver reglas",
  rulesButtonUrl: "#/reglas",
  infoItems: [
    { icon: "Radio", label: "Estado", value: "Inscripciones abiertas" },
    { icon: "CalendarDays", label: "Fecha", value: "21 – 22 Mar 2026" },
    { icon: "Clock", label: "Horario", value: "18:00 CEST" },
    { icon: "Swords", label: "Formato", value: "5v5 · Doble eliminación" },
    { icon: "UserPlus", label: "Inscripción", value: "Por equipos · Gratuita" },
    { icon: "Trophy", label: "Premios", value: "Prize pool + medallero" },
  ],
  processPhases: [
    {
      step: "01",
      icon: "FilePenLine",
      title: "Inscripción",
      text: "Registra a tu equipo de cinco a través del Discord oficial antes del cierre de plazas.",
    },
    {
      step: "02",
      icon: "BadgeCheck",
      title: "Confirmación",
      text: "El staff verifica el roster, confirma la plaza y asigna a tu equipo su llave del bracket.",
    },
    {
      step: "03",
      icon: "Swords",
      title: "Competencia",
      text: "Enfrentamientos 5v5 con formato de doble eliminación, casters en vivo y arbitraje oficial.",
    },
    {
      step: "04",
      icon: "Medal",
      title: "Resultados",
      text: "Clasificación final, medallero oficial y reconocimientos publicados para toda la comunidad.",
    },
  ],
};

/**
 * Obtiene la configuración del evento en tiempo real desde Supabase.
 * Si falla o no existe, devuelve DEFAULT_EVENT_DATA como fallback.
 */
export async function fetchEventData(): Promise<EventData> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("description")
      .eq("id", "config_event_details")
      .maybeSingle();

    if (!error && data?.description) {
      const parsed = typeof data.description === "string" ? JSON.parse(data.description) : data.description;
      if (parsed && typeof parsed === "object") {
        return {
          id: parsed.id || DEFAULT_EVENT_DATA.id,
          statusBadge: parsed.statusBadge || DEFAULT_EVENT_DATA.statusBadge,
          titlePrefix: parsed.titlePrefix || DEFAULT_EVENT_DATA.titlePrefix,
          titleMain: parsed.titleMain || DEFAULT_EVENT_DATA.titleMain,
          edition: parsed.edition || DEFAULT_EVENT_DATA.edition,
          description: parsed.description || DEFAULT_EVENT_DATA.description,
          bannerImage: parsed.bannerImage || DEFAULT_EVENT_DATA.bannerImage,
          chips: Array.isArray(parsed.chips) && parsed.chips.length > 0 ? parsed.chips : DEFAULT_EVENT_DATA.chips,
          registerButtonText: parsed.registerButtonText || parsed.registerButton?.text || DEFAULT_EVENT_DATA.registerButtonText,
          registerButtonUrl: parsed.registerButtonUrl || parsed.registerButton?.url || DEFAULT_EVENT_DATA.registerButtonUrl,
          rulesButtonText: parsed.rulesButtonText || parsed.rulesButton?.text || DEFAULT_EVENT_DATA.rulesButtonText,
          rulesButtonUrl: parsed.rulesButtonUrl || parsed.rulesButton?.url || DEFAULT_EVENT_DATA.rulesButtonUrl,
          infoItems: Array.isArray(parsed.infoItems) && parsed.infoItems.length > 0 ? parsed.infoItems : DEFAULT_EVENT_DATA.infoItems,
          processPhases: Array.isArray(parsed.processPhases) && parsed.processPhases.length > 0 ? parsed.processPhases : DEFAULT_EVENT_DATA.processPhases,
        };
      }
    }
  } catch (err) {
    console.warn("[Events] Usando datos locales de eventos:", err);
  }

  return DEFAULT_EVENT_DATA;
}
