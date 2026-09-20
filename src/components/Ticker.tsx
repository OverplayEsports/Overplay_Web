import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { DEFAULT_TICKER_ITEMS, fetchTickerData } from "../data/site";

/** Cinta marquee con los titulares de marca en deslizamiento horizontal continuo e infinito. */
export function Ticker() {
  const [items, setItems] = useState<string[]>(DEFAULT_TICKER_ITEMS);

  useEffect(() => {
    let alive = true;
    fetchTickerData().then((data) => {
      if (!alive) return;
      if (data && data.length > 0) setItems(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const repeatedItems = [...items, ...items];

  return (
    <div
      aria-hidden
      className="relative select-none overflow-hidden border-y border-white/[0.07] bg-[#08080a] py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050506] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050506] to-transparent" />
      <motion.div
        className="flex w-max"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: 25,
          repeat: Infinity,
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {repeatedItems.map((item, idx) => (
              <span
                key={`${copy}-${idx}-${item}`}
                className="flex items-center gap-8 pr-8 font-display text-sm font-semibold uppercase tracking-[0.3em] text-white/50"
              >
                <span>{item}</span>
                <Zap className="h-3.5 w-3.5 shrink-0 fill-orange-500 text-orange-500" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

