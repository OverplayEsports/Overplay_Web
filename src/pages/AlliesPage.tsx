import { Allies } from "../components/sections/Allies";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Nuestros Aliados y Creadores
 */
export function AlliesPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <Allies />
      <FinalCTA />
    </div>
  );
}
