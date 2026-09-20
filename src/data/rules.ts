import { supabase } from "../lib/supabase";

export interface RuleSection {
  id: string;
  category: string;
  title: string;
  description: string;
  points: string[];
}

export interface RulesData {
  summary: string;
  rulesButtonText: string;
  modalTitle: string;
  modalSubtitle: string;
  downloadImageUrl?: string;
  sections: RuleSection[];
}

export const TOURNAMENT_RULES: RulesData = {
  summary:
    "Normativa oficial aplicable a todos los participantes, capitanes y equipos de la competición Overplay. Diseñada para garantizar el juego limpio, el respeto mutuo y la máxima transparencia en cada partida.",
  rulesButtonText: "Reglas del Torneo",
  modalTitle: "Reglamento Oficial de Competición",
  modalSubtitle: "Normativas, código de conducta, formatos y penalizaciones oficiales de Overplay",
  downloadImageUrl: "",
  sections: [
    {
      id: "rule-1",
      category: "Elegibilidad & Roster",
      title: "1. Requisitos de los Jugadores y Equipos",
      description: "Condiciones mínimas de registro y validación de cuentas.",
      points: [
        "Cada equipo debe contar con 5 jugadores titulares y hasta 2 suplentes registrados antes del cierre oficial de plazas.",
        "Todas las cuentas de juego deben estar verificadas en el Discord oficial de Overplay.",
        "Queda estrictamente prohibida la suplantación de identidad (ringing / smurfing). El uso no autorizado causará descalificación inmediata del equipo.",
      ],
    },
    {
      id: "rule-2",
      category: "Formato & Partidas",
      title: "2. Formato de Encuentros y Servidores",
      description: "Estructura del bracket, servidores de juego y pausas técnicas.",
      points: [
        "El torneo se disputa en formato de doble eliminación (Winners & Losers Brackets).",
        "Los enfrentamientos de rondas clasificatorias son al Mejor de 3 (Bo3), y la Gran Final al Mejor de 5 (Bo5).",
        "Se concede un tiempo máximo de cortesía de 10 minutos para presentarse en el lobby antes de declarar Walkover (W.O.).",
        "Cada equipo dispone de hasta 2 pausas tácticas/técnicas de 5 minutos por mapa en caso de desconexión fortuita.",
      ],
    },
    {
      id: "rule-3",
      category: "Conducta & Fair Play",
      title: "3. Código de Conducta y Anticheat",
      description: "Respeto hacia rivales, árbitros, casters y uso de software.",
      points: [
        "El uso de cualquier software externo o trampa (hacks, scripts, macros) causará baneo permanente e irrevocable.",
        "El comportamiento tóxico, insultos o faltas de respeto en el chat general o Discord resultará en advertencias o pérdida de mapas.",
        "Las decisiones tomadas por el equipo de Árbitros y Moderadores oficiales son definitivas e inapelables.",
      ],
    },
    {
      id: "rule-4",
      category: "Retransmisión & Premios",
      title: "4. Streaming, Casters y Premiación",
      description: "Directrices para stream personal y entrega de premios.",
      points: [
        "Los jugadores pueden transmitir sus partidas individuales manteniendo un delay mínimo obligatorio de 120 segundos.",
        "La premiación y reconocimientos oficiales del prize pool se entregarán a los capitanes en un plazo máximo de 7 días hábiles.",
      ],
    },
  ],
};

/**
 * Obtiene la configuración de reglas y la URL de la imagen de descarga en tiempo real desde Supabase.
 */
export async function fetchTournamentRules(): Promise<RulesData> {
  try {
    const { data, error } = await supabase
      .from("team_groups")
      .select("*")
      .eq("id", "config_tournament_rules")
      .maybeSingle();

    if (error || !data || !data.description) {
      return TOURNAMENT_RULES;
    }

    const parsed = JSON.parse(data.description);
    return {
      summary: parsed.summary || TOURNAMENT_RULES.summary,
      rulesButtonText: parsed.rulesButtonText || TOURNAMENT_RULES.rulesButtonText,
      modalTitle: parsed.modalTitle || TOURNAMENT_RULES.modalTitle,
      modalSubtitle: parsed.modalSubtitle || TOURNAMENT_RULES.modalSubtitle,
      downloadImageUrl: parsed.downloadImageUrl || TOURNAMENT_RULES.downloadImageUrl,
      sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : TOURNAMENT_RULES.sections,
    };
  } catch (e) {
    console.warn("[Rules] Error al obtener reglas de Supabase:", e);
    return TOURNAMENT_RULES;
  }
}

/**
 * Descarga una imagen de forma confiable sin errores de archivos vacíos ni cuadros de impresión (usando blob, canvas y fallback directo).
 */
export async function downloadRulesImageFile(url: string, filename = "Reglamento-Overplay-2026.png"): Promise<void> {
  if (!url || !url.trim()) {
    throw new Error("No hay una URL válida para descargar la imagen.");
  }

  const cleanUrl = url.trim();

  // Caso 1: Data URL o Blob URL
  if (cleanUrl.startsWith("data:") || cleanUrl.startsWith("blob:")) {
    const a = document.createElement("a");
    a.href = cleanUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Caso 2: Intento 1 con Fetch directo y Blob
  try {
    const res = await fetch(cleanUrl, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      if (blob && blob.size > 0) {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        return;
      }
    }
  } catch (e) {
    console.warn("[Download] Fetch blob directo falló (posible CORS de R2), intentando Canvas:", e);
  }

  // Caso 3: Intento 2 - Cargar en Image -> Canvas -> DataURL (para salvar CORS y asegurar contenido real)
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (canvasErr) {
          reject(canvasErr);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = cleanUrl;
    });

    if (dataUrl && dataUrl.length > 200) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
  } catch (e) {
    console.warn("[Download] Canvas export falló, recurriendo a descarga forzada por enlace directo:", e);
  }

  // Caso 4: Intento 3 - Enlace directo forzado
  const a = document.createElement("a");
  a.href = cleanUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
