import { Competitive } from "../components/sections/Competitive";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Competitivo / Roster Oficial UL
 */
export function CompetitivePage() {
  return (
    <div className="pt-20 sm:pt-24">
      <Competitive />
      <FinalCTA />
    </div>
  );
}
