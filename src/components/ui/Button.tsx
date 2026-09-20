import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  ariaLabel?: string;
}

/**
 * Botones de marca Overplay. `primary`: degradado naranja→rojo→morado con glow.
 * `ghost`: vidrio con borde que se enciende al hover.
 */
export function Button({ href, children, variant = "primary", className, ariaLabel }: ButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5",
        "font-display text-sm font-semibold uppercase tracking-[0.14em]",
        "transition-all duration-300 will-change-transform",
        "active:scale-[0.97]",
        variant === "primary" && [
          "bg-brand-gradient text-white",
          "shadow-[0_8px_32px_-8px_rgba(249,115,22,0.55),0_4px_20px_-6px_rgba(139,92,246,0.4)]",
          "hover:shadow-[0_12px_44px_-8px_rgba(249,115,22,0.75),0_6px_28px_-6px_rgba(139,92,246,0.55)]",
          "hover:-translate-y-0.5",
        ],
        variant === "ghost" && [
          "border border-white/15 bg-white/[0.04] text-white/85 backdrop-blur-sm",
          "hover:border-orange-400/50 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5",
        ],
        className
      )}
    >
      {/* Barrido luminoso al hover */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
        />
      )}
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </a>
  );
}
