import { Competitive } from "../components/sections/Competitive";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Competitivo / Roster Oficial UL
 */
export function CompetitivePage() {
  return (
    <div className="pt-16 sm:pt-[4.5rem]">
      <Competitive />
      <FinalCTA />
    </div>
  );
}
