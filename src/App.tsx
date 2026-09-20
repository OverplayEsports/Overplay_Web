import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { EventsPage } from "./pages/EventsPage";
import { CompetitivePage } from "./pages/CompetitivePage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { RulesPage } from "./pages/RulesPage";
import { AlliesPage } from "./pages/AlliesPage";

export type RouteId = "inicio" | "nosotros" | "eventos" | "reglas" | "competitivo" | "noticias" | "aliados" | "noticia-detalle";

export interface RouteState {
  id: RouteId;
  articleId?: string;
}

function parseHash(hash: string): RouteState {
  const clean = hash.replace(/^#\/?/, "").toLowerCase().trim();
  
  if (clean.startsWith("noticias/") || clean.startsWith("noticia/")) {
    const parts = clean.split("/");
    const articleId = parts.slice(1).join("/");
    if (articleId) {
      return { id: "noticia-detalle", articleId };
    }
    return { id: "noticias" };
  }

  if (clean === "nosotros") return { id: "nosotros" };
  if (clean === "eventos") return { id: "eventos" };
  if (clean === "reglas" || clean === "reglamento" || clean === "eventos/reglas" || clean === "reglas-torneo") return { id: "reglas" };
  if (clean === "competitivo") return { id: "competitivo" };
  if (clean === "noticias" || clean === "noticia") return { id: "noticias" };
  if (clean === "aliados") return { id: "aliados" };
  return { id: "inicio" };
}

/**
 * Overplay — Aplicación multi-vista:
 * - Home (Inicio): Hero (título 1 línea) + Ticker continuo + Eventos (sin número) + FinalCTA.
 * - Vistas dedicadas e independientes: Sobre Nosotros, Eventos, Competitivo, Noticias, Detalle de Noticia y Aliados.
 */
export default function App() {
  const [routeState, setRouteState] = useState<RouteState>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash(window.location.hash);
      setRouteState(newRoute);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderView = () => {
    switch (routeState.id) {
      case "nosotros":
        return <AboutPage key="nosotros" />;
      case "eventos":
        return <EventsPage key="eventos" />;
      case "reglas":
        return <RulesPage key="reglas" />;
      case "competitivo":
        return <CompetitivePage key="competitivo" />;
      case "noticias":
        return <NewsPage key="noticias" />;
      case "noticia-detalle":
        return <NewsDetailPage key={`noticia-${routeState.articleId}`} articleId={routeState.articleId} />;
      case "aliados":
        return <AlliesPage key="aliados" />;
      case "inicio":
      default:
        return <HomePage key="inicio" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050506] font-sans text-white antialiased">
      {/* Accesibilidad: salto directo al contenido */}
      <a
        href="#contenido"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-orange-500 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white"
      >
        Saltar al contenido
      </a>

      {/* Textura de ruido global */}
      <div aria-hidden className="noise-overlay" />

      <Navbar currentRoute={routeState.id === "noticia-detalle" ? "noticias" : routeState.id === "reglas" ? "eventos" : routeState.id} />

      <main id="contenido">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeState.id === "noticia-detalle" ? `noticia-${routeState.articleId}` : routeState.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
