import { cn } from "../../utils/cn";

interface MonogramAvatarProps {
  name: string;
  gradient: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  rounded?: "xl" | "full";
}

const SIZES: Record<NonNullable<MonogramAvatarProps["size"]>, string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl",
  xl: "h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl",
};

/**
 * Avatar de marca: monograma con degradado propio por integrante.
 * Identidad visual consistente sin depender de fotografías externas.
 */
export function MonogramAvatar({
  name,
  gradient,
  size = "md",
  className,
  rounded = "xl",
}: MonogramAvatarProps) {
  const initials = name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase();
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ring-1 ring-white/20",
        gradient,
        SIZES[size],
        rounded === "xl" ? "rounded-2xl" : "rounded-full",
        className
      )}
    >
      {/* Brillo superior */}
      <span className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/30" />
      {/* Líneas técnicas */}
      <span
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.5) 50%, transparent 58%)",
        }}
      />
      <span className="relative font-display font-bold italic tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
        {initials}
      </span>
    </div>
  );
}
