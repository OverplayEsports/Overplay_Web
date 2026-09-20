import { Hero } from "../components/Hero";
import { Ticker } from "../components/Ticker";
import { Events } from "../components/sections/Events";
import { News } from "../components/sections/News";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista de Inicio (Home):
 * Incluye la portada Hero con título en una sola línea, el banner continuo (Ticker),
 * la sección de Eventos (sin número ni reglas), las 5 últimas noticias y el recuadro para participar (FinalCTA).
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Events showRules={false} />
      <News
        showFilters={false}
        limit={5}
        showViewMoreButton={true}
        showSectionNumber={false}
      />
      <FinalCTA />
    </>
  );
}
