import { About } from "../components/sections/About";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Sobre Nosotros
 */
export function AboutPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <About />
      <FinalCTA />
    </div>
  );
}
