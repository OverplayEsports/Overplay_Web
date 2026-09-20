import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Trophy } from "lucide-react";
import { NAV_LINKS } from "../data/site";
import { Logo } from "./ui/Logo";
import { cn } from "../utils/cn";

/**
 * Navbar sticky premium: transparente arriba, glassmorphism al hacer scroll.
 * Móvil: menú hamburguesa con panel animado, accesible por teclado (Esc cierra).
 */
export function Navbar({ currentRoute }: { currentRoute?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(currentRoute || "inicio");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Actualizar estado activo cuando cambie currentRoute
  useEffect(() => {
    if (currentRoute) {
      setActive(currentRoute);
    }
  }, [currentRoute]);

  // Transformación al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Accesibilidad del menú móvil: Escape cierra y devuelve el foco al botón
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.07] bg-[#050506]/80 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8"
      >
        <Logo />

        {/* Enlaces — desktop */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "link-underline font-display text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                  active === link.id ? "text-orange-400 font-bold" : "text-white/55 hover:text-white"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — desktop */}
        <div className="hidden lg:block">
          <a
            href="#/eventos"
            className="group/cta inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_6px_24px_-6px_rgba(249,115,22,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-6px_rgba(249,115,22,0.8)] active:scale-[0.97]"
          >
            <Trophy className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:rotate-[-8deg]" />
            Ver Torneo
          </a>
        </div>

        {/* Botón hamburguesa — móvil */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:border-orange-400/40 hover:bg-white/[0.08] lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Menú móvil animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={reduce ? undefined : { opacity: 0, height: 0 }}
            animate={reduce ? undefined : { opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-white/10 bg-[#070709]/95 backdrop-blur-2xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={reduce ? undefined : { opacity: 0, x: -18 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-semibold uppercase italic tracking-wide transition-colors",
                      active === link.id
                        ? "bg-white/[0.08] text-orange-400 font-bold"
                        : "text-white/65 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    {link.label}
                    <span className="font-display text-xs text-orange-400/80">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={reduce ? undefined : { opacity: 0, y: 12 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.3 }}
                className="pt-3"
              >
                <a
                  href="#/eventos"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-4 font-display text-sm font-bold uppercase tracking-[0.16em] text-white"
                >
                  <Trophy className="h-4 w-4" />
                  Ver Torneo
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
