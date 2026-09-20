import { FileText, Trophy, UserPlus } from "lucide-react";
import { NAV_LINKS, OFFICIAL_SOCIALS, SITE } from "../data/site";
import { Logo } from "./ui/Logo";
import { SocialButton } from "./ui/SocialIcons";

const TOURNEY_LINKS = [
  { icon: Trophy, label: "Overplay Tourney 4", href: "#/eventos" },
  { icon: UserPlus, label: "Inscripción", href: "#/eventos" },
  { icon: FileText, label: "Reglamento", href: "#/eventos" },
];

/** Footer premium: marca, navegación, torneo y redes oficiales. */
export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#060608]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-[-1px] h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,4fr)]">
          {/* Marca */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-white/45">
              Organización de esports dedicada a eventos competitivos de Overwatch. Torneos,
              talento y comunidad en un mismo lugar.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {OFFICIAL_SOCIALS.map((social) => (
                <SocialButton
                  key={social.platform}
                  platform={social.platform}
                  href={social.href}
                  label={social.label}
                />
              ))}
            </div>
          </div>

          {/* Navegación */}
          <nav aria-label="Navegación del pie de página">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/35">
              Navegación
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="link-underline text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Torneo */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/35">
              Torneo activo
            </h3>
            <ul className="mt-5 space-y-3">
              {TOURNEY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group/fl inline-flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <link.icon className="h-4 w-4 text-orange-400/70 transition-transform duration-300 group-hover/fl:scale-110" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 font-display text-xs italic leading-relaxed text-white/45">
              “{SITE.footerNote}”
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-7 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
          </p>
          <p className="text-center text-[11px] leading-relaxed text-white/25 sm:text-right">
            Proyecto comunitario sin afiliación con Blizzard Entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}
