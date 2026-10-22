import { Allies } from "../components/sections/Allies";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Nuestros Aliados y Creadores
 */
export function AlliesPage() {
  return (
    <div className="pt-16 sm:pt-[4.5rem]">
      <Allies />
      <FinalCTA />
    </div>
  );
}
