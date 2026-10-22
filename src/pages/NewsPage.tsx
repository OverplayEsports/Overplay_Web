import { News } from "../components/sections/News";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Noticias y Anuncios
 */
export function NewsPage() {
  return (
    <div className="pt-16 sm:pt-[4.5rem]">
      <News standalone={true} />
      <FinalCTA />
    </div>
  );
}
