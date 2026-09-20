import { Play } from "lucide-react";
import { cn } from "../../utils/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

/** Logotipo de marca Overplay: insignia "play" + wordmark. */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <a
      href="#/"
      aria-label="Overplay — Ir al inicio"
      className={cn("group/logo inline-flex items-center gap-3", className)}
    >
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-gradient shadow-[0_4px_24px_-4px_rgba(249,115,22,0.6)] transition-all duration-300 group-hover/logo:shadow-[0_6px_32px_-4px_rgba(249,115,22,0.85)]">
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover/logo:translate-x-full"
        />
        <Play className="relative h-4.5 w-4.5 fill-white text-white" strokeWidth={0} />
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold uppercase italic tracking-[0.08em] text-white">
          Over<span className="text-brand-gradient">play</span>
        </span>
      )}
      <span className="sr-only">Overplay</span>
    </a>
  );
}
