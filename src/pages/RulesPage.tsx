import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Download,
  Loader2,
  Scale,
} from "lucide-react";
import {
  TOURNAMENT_RULES,
  fetchTournamentRules,
  downloadRulesImageFile,
  type RulesData,
} from "../data/rules";
import { FinalCTA } from "../components/FinalCTA";
import { Reveal } from "../components/ui/Reveal";

export function RulesPage() {
  const [rules, setRules] = useState<RulesData>(TOURNAMENT_RULES);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    fetchTournamentRules().then((data) => {
      if (data) {
        setRules(data);
      }
    });
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let imgUrl = rules.downloadImageUrl?.trim();
      if (!imgUrl) {
        // Re-consultar a Supabase en tiempo real
        const fresh = await fetchTournamentRules();
        if (fresh?.downloadImageUrl?.trim()) {
          setRules(fresh);
          imgUrl = fresh.downloadImageUrl.trim();
        }
      }

      if (!imgUrl) {
        alert("Aún no se ha subido una imagen para la descarga del reglamento en el Builder. Por favor, sube una imagen en el Builder > Eventos > Reglas.");
        return;
      }

      const ext = imgUrl.split(".").pop()?.split("?")[0]?.toLowerCase() || "png";
      const validExt = ["png", "jpg", "jpeg", "webp", "pdf"].includes(ext) ? ext : "png";
      const filename = `Reglamento-Overplay-2026.${validExt}`;

      await downloadRulesImageFile(imgUrl, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error("Error al descargar:", err);
      alert("Hubo un problema al intentar descargar el archivo. Por favor inténtalo de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-16">
      {/* Ambiente luminoso de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-[36rem] w-[36rem] rounded-full bg-orange-600/10 blur-[150px]" />
        <div className="absolute top-96 left-[-10rem] h-[32rem] w-[32rem] rounded-full bg-violet-600/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb / Botón de retorno y Botón Descargar Arriba */}
        <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <a
            href="#/eventos"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 transition-all duration-300 hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver a Eventos
          </a>

          <div className="flex items-center gap-3">
            {/* Botón Descargar Arriba */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_20px_-6px_rgba(249,115,22,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer disabled:opacity-75"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Descargando...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  <span>¡Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                  <span>DESCARGAR</span>
                </>
              )}
            </button>

            {/* Badge Vigente · Temporada 2026 */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                Vigente · Temporada 2026
              </span>
            </div>
          </div>
        </Reveal>

        {/* Tarjeta Principal — Diseño idéntico al visor pero en vista de página completa */}
        <Reveal y={20}>
          <div className="card-surface relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#08080c] shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
            {/* Top Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-400/30 text-orange-400">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">
                      Overplay League
                    </span>
                  </div>
                  <h1 className="font-display text-xl font-bold uppercase italic text-white sm:text-2xl lg:text-3xl mt-0.5">
                    {rules.modalTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/50 mt-0.5">
                    {rules.modalSubtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido / Body de la Normativa */}
            <div className="px-6 py-6 sm:px-8 space-y-6">
              {/* Fair Play Summary Alert */}
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-xs sm:text-sm leading-relaxed text-orange-200/90">
                <p className="font-semibold text-orange-300 mb-1.5 flex items-center gap-2 uppercase font-display text-xs tracking-wider">
                  <BadgeCheck className="h-4 w-4" /> Declaración de Fair Play
                </p>
                {rules.summary}
              </div>

              {/* Rules Sections */}
              <div className="space-y-4">
                {rules.sections.map((sec) => (
                  <article
                    key={sec.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 transition-colors hover:border-white/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-md border border-orange-400/30 bg-orange-500/10 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-orange-300">
                        {sec.category}
                      </span>
                    </div>

                    <h2 className="font-display text-base sm:text-lg font-bold uppercase italic text-white">
                      {sec.title}
                    </h2>

                    {sec.description && (
                      <p className="mt-1 text-xs sm:text-sm text-white/50">{sec.description}</p>
                    )}

                    <ul className="mt-4 space-y-2.5 border-t border-white/[0.06] pt-3.5">
                      {sec.points.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-white/75"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-5 sm:px-8 bg-black/40">
              <span className="text-xs text-white/40">
                Normativa oficial Overplay 2026
              </span>
              <span className="font-display text-[10px] font-bold uppercase tracking-wider text-orange-400/80">
                Documento Oficial
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <FinalCTA />
    </div>
  );
}
