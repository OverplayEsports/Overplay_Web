import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  /** Intensidad del desenfoque inicial en píxeles. */
  blur?: number;
}

/** Aparición al hacer scroll hacia abajo: difuminado + deslizado suave + fade. */
export function Reveal({ children, className, delay = 0, y = 24, once = true, blur = 10 }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.985, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.05 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}

const parentVariants = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Contenedor que orquesta la entrada escalonada de sus hijos <StaggerItem>. */
export function Stagger({ children, className, gap = 0.06, delay = 0 }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={parentVariants(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
