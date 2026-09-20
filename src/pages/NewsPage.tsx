import { News } from "../components/sections/News";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Noticias y Anuncios
 */
export function NewsPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <News />
      <FinalCTA />
    </div>
  );
}
