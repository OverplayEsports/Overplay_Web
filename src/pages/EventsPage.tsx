import { Events } from "../components/sections/Events";
import { FinalCTA } from "../components/FinalCTA";

/**
 * Vista independiente: Eventos y Torneos
 */
export function EventsPage() {
  return (
    <div className="pt-16 sm:pt-[4.5rem]">
      <Events showRules={true} standalone={true} />
      <FinalCTA />
    </div>
  );
}
