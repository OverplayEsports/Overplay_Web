export const R2_HEROES_CDN = "https://pub-def6d9ceb4ef4e8f84ee8a391d2b0b27.r2.dev/heroes";

/**
 * Retorna la URL CDN de Cloudflare R2 para el icono del héroe.
 * También limpia caracteres en caso de nombres con tildes o espacios.
 */
export function getHeroImageUrl(heroName: string): string {
  if (!heroName || typeof heroName !== "string") return "";
  const clean = heroName.trim();
  return `${R2_HEROES_CDN}/${encodeURIComponent(clean)}.png`;
}

/**
 * Retorna la ruta relativa local como fallback por si falla la conexión a R2.
 */
export function getLocalHeroImageUrl(heroName: string): string {
  if (!heroName || typeof heroName !== "string") return "";
  return `./images/Overwatch/${heroName.trim()}.png`;
}
