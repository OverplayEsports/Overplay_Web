import { Events } from "../components/sections/Events";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Eventos y Torneos
 */
export function EventsPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <Events showRules={true} />
      <FinalCTA />
    </div>
  );
}
