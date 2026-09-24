import emailjs from "@emailjs/browser";
import { TournamentRegistrationData, OVERWATCH_RANKS } from "../types/tournament";

const EMAILJS_SERVICE_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_EMAILJS_SERVICE_ID) || "";
const EMAILJS_TEMPLATE_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_EMAILJS_TEMPLATE_ID) || "";
const EMAILJS_PUBLIC_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_EMAILJS_PUBLIC_KEY) || "";

export const STAFF_NOTIFICATION_EMAIL = "overplaypage@gmail.com";

const LOGO_URL =
  "https://pub-def6d9ceb4ef4e8f84ee8a391d2b0b27.r2.dev/branding/Logo_Overplay.png";

function getRankImgUrl(rankName: string): string {
  const found = OVERWATCH_RANKS.find((r) => r.id === rankName);
  return found?.image || "";
}

/**
 * Genera el cuerpo HTML con diseño oficial de Overplay Esports para usar en EmailJS
 */
export function generateRegistrationEmailHtml(data: TournamentRegistrationData, isStaffCopy: boolean = false): string {
  const tankImg = getRankImgUrl(data.rankTank);
  const dpsImg = getRankImgUrl(data.rankDps);
  const supportImg = getRankImgUrl(data.rankSupport);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Comprobante de Inscripción — Overplay Tourney</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050508; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Contenedor Principal -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0b0b12; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.8);">
          
          <!-- Barra Superior Neón -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #f97316 0%, #fbbf24 50%, #8b5cf6 100%);"></td>
          </tr>

          <!-- Cabecera con Logo -->
          <tr>
            <td style="padding: 32px 28px 20px 28px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <img src="${LOGO_URL}" alt="Overplay Esports" width="60" height="60" style="display: inline-block; margin-bottom: 12px; border-radius: 12px;" />
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: #f97316; margin-bottom: 6px;">
                ${isStaffCopy ? "⚡ NUEVA INSCRIPCIÓN RECIBIDA (STAFF)" : "COMPROBANTE OFICIAL DE INSCRIPCIÓN"}
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff; text-transform: uppercase;">
                ${data.tournamentName}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.65); line-height: 1.5;">
                ${
                  isStaffCopy
                    ? `Se ha recibido un nuevo registro de <strong>${data.draftName}</strong>.`
                    : `¡Hola <strong>${data.draftName}</strong>! Tu solicitud de inscripción ha sido registrada con éxito.`
                }
              </p>
            </td>
          </tr>

          <!-- Badge Capitán / Jugador -->
          <tr>
            <td style="padding: 20px 28px 10px 28px;">
              <div style="background-color: ${data.isCaptain ? "rgba(245, 158, 11, 0.12)" : "rgba(249, 115, 22, 0.1)"}; border: 1px solid ${data.isCaptain ? "rgba(245, 158, 11, 0.4)" : "rgba(249, 115, 22, 0.3)"}; border-radius: 12px; padding: 12px 16px; text-align: center;">
                <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${data.isCaptain ? "#fbbf24" : "#fdba74"};">
                  ${data.isCaptain ? "👑 POSTULANTE A CAPITÁN DEL TORNEO" : "🎮 ROL: JUGADOR EN EL DRAFT"}
                </span>
              </div>
            </td>
          </tr>

          <!-- Ficha de Datos del Participante -->
          <tr>
            <td style="padding: 10px 28px 24px 28px;">
              <table role="presentation" width="100%" style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px;">
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Nombre en Draft:</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; font-weight: 700; color: #fdba74; text-align: right;">${data.draftName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Battle.net Tag:</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; font-family: monospace; font-weight: 700; color: #fbbf24; text-align: right;">${data.battleNetId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Discord ID:</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; font-family: monospace; font-weight: 700; color: #a5b4fc; text-align: right;">${data.discordId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Correo de Contacto:</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; font-family: monospace; color: #ffffff; text-align: right;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: rgba(255, 255, 255, 0.5);">Rol Preferido:</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; font-weight: 700; color: #38bdf8; text-align: right;">${data.preferredRole}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-size: 12px; color: rgba(255, 255, 255, 0.5);">Héroe Favorito:</td>
                  <td style="padding: 8px 12px; font-size: 13px; font-weight: 700; color: #f472b6; text-align: right;">${data.favoriteHero}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Medallas de Rangos Declarados -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); margin-bottom: 10px;">
                Rangos Declarados por Rol:
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Tanque -->
                  <td width="32%" style="background-color: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 10px; padding: 10px; text-align: center;">
                    <div style="font-size: 10px; font-weight: 800; color: #60a5fa; text-transform: uppercase;">TANQUE</div>
                    ${tankImg ? `<img src="${tankImg}" alt="${data.rankTank}" width="32" height="32" style="display: block; margin: 6px auto;" />` : ""}
                    <div style="font-size: 11px; font-weight: 700; color: #ffffff;">${data.rankTank}</div>
                  </td>
                  <td width="2%"></td>
                  <!-- DPS -->
                  <td width="32%" style="background-color: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 10px; padding: 10px; text-align: center;">
                    <div style="font-size: 10px; font-weight: 800; color: #f87171; text-transform: uppercase;">DPS</div>
                    ${dpsImg ? `<img src="${dpsImg}" alt="${data.rankDps}" width="32" height="32" style="display: block; margin: 6px auto;" />` : ""}
                    <div style="font-size: 11px; font-weight: 700; color: #ffffff;">${data.rankDps}</div>
                  </td>
                  <td width="2%"></td>
                  <!-- Support -->
                  <td width="32%" style="background-color: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; padding: 10px; text-align: center;">
                    <div style="font-size: 10px; font-weight: 800; color: #34d399; text-transform: uppercase;">SUPPORT</div>
                    ${supportImg ? `<img src="${supportImg}" alt="${data.rankSupport}" width="32" height="32" style="display: block; margin: 6px auto;" />` : ""}
                    <div style="font-size: 11px; font-weight: 700; color: #ffffff;">${data.rankSupport}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Próximos Pasos (Solo para el jugador) -->
          ${
            !isStaffCopy
              ? `
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #12121e; border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 12px; padding: 16px 20px;">
                <div style="font-size: 13px; font-weight: 800; color: #f97316; margin-bottom: 8px;">
                  📌 PRÓXIMOS PASOS IMPORTANTES:
                </div>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: rgba(255, 255, 255, 0.8); line-height: 1.6;">
                  <li>Acepta la solicitud de amistad en Battle.net de: <strong style="color: #fbbf24; font-family: monospace;">OVERPLAY#11220</strong></li>
                  <li>Revisa tus mensajes y solicitudes de amistad en <strong>Discord</strong>.</li>
                  <li>El staff revisará tu perfil de carrera para confirmar tu plaza en el bracket oficial.</li>
                </ul>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #07070b; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.45);">
                © ${new Date().getFullYear()} <strong>Overplay Esports</strong>. Todos los derechos reservados.
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: rgba(255, 255, 255, 0.3);">
                Este es un mensaje automático de respaldo. Si no solicitaste esta inscripción, puedes ignorar este correo.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Envía la confirmación por correo al jugador y la copia al Staff de Overplay mediante EmailJS
 */
export async function sendTournamentConfirmationEmail(
  data: TournamentRegistrationData
): Promise<{ success: boolean; error?: string }> {
  const serviceId = EMAILJS_SERVICE_ID.trim();
  const templateId = EMAILJS_TEMPLATE_ID.trim();
  const publicKey = EMAILJS_PUBLIC_KEY.trim();

  // Si EmailJS no está configurado aún, permitimos que el formulario continúe
  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      "EmailJS no configurado (VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY). La inscripción se guardó en Supabase."
    );
    return { success: true };
  }

  try {
    const templateParams = {
      to_email: data.email.trim(),
      staff_email: STAFF_NOTIFICATION_EMAIL,
      draft_name: data.draftName,
      battlenet_id: data.battleNetId,
      discord_id: data.discordId,
      email: data.email.trim(),
      preferred_role: data.preferredRole,
      rank_tank: data.rankTank,
      rank_dps: data.rankDps,
      rank_support: data.rankSupport,
      favorite_hero: data.favoriteHero,
      is_captain: data.isCaptain ? "SÍ (Postulante a Capitán)" : "NO (Jugador en Draft)",
      tournament_name: data.tournamentName,
      submitted_at: new Date().toLocaleString("es-ES"),
      html_content: generateRegistrationEmailHtml(data, false),
    };

    // Envío oficial vía SDK de EmailJS
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("Correo enviado exitosamente a través de EmailJS / Gmail.");

    return { success: true };
  } catch (err: any) {
    console.error("Error al enviar correo con EmailJS:", err);
    return { success: false, error: err.text || err.message };
  }
}

