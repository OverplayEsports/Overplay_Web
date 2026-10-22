import { About } from "../components/sections/About";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Sobre Nosotros
 */
export function AboutPage() {
  return (
    <div className="pt-16 sm:pt-[4.5rem]">
      <About />
      <FinalCTA />
    </div>
  );
}
