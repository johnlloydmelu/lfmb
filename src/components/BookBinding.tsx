import { motion, useReducedMotion } from "framer-motion";

interface BookBindingProps {
  variant?: "spiral" | "string";
  /** When true the rings give a little wobble, as if the page just turned */
  isFlipping?: boolean;
}

const ringCount = 14;

export default function BookBinding({ variant = "spiral", isFlipping = false }: BookBindingProps) {
  const shouldReduceMotion = useReducedMotion();
  const positions = Array.from({ length: ringCount }, (_, index) => index);

  if (variant === "string") {
    return (
      <div className="pointer-events-none absolute inset-y-3 left-1/2 z-30 hidden w-10 -translate-x-1/2 sm:block" aria-hidden="true">
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-skyLove-softPink shadow-sm" />
        {positions.map((position) => (
          <span
            key={position}
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-900/70 shadow-inner"
            style={{ top: `${3 + position * 6.2}%` }}
          />
        ))}
        <motion.span
          className="absolute left-1/2 top-1/2 h-[82%] w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-skyLove-softPink shadow-[0_0_4px_rgba(251,113,133,0.8)]"
          animate={shouldReduceMotion ? undefined : { rotate: [0, 1, 0, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-y-3 left-1/2 z-40 hidden w-14 -translate-x-1/2 sm:block sm:inset-y-5" aria-hidden="true">
      {positions.map((position) => (
        <motion.div
          key={position}
          className="absolute left-0 right-0 h-6"
          style={{ top: `${1.5 + position * (94 / ringCount)}%` }}
          animate={
            isFlipping && !shouldReduceMotion
              ? { rotate: [0, -4, 3, 0], y: [0, -2, 1.5, 0] }
              : { rotate: 0, y: 0 }
          }
          transition={{ duration: 1.1, delay: position * 0.03, ease: "easeInOut" }}
        >
          {/* punched holes */}
          <span className="book-hole left-0.5" />
          <span className="book-hole right-0.5" />
          {/* gold wire ring */}
          <span className="book-ring" />
        </motion.div>
      ))}
    </div>
  );
}
