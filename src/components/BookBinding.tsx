import { motion, useReducedMotion } from "framer-motion";

interface BookBindingProps {
  variant?: "spiral" | "string";
}

const ringCount = 16;

export default function BookBinding({ variant = "spiral" }: BookBindingProps) {
  const shouldReduceMotion = useReducedMotion();
  const positions = Array.from({ length: ringCount }, (_, index) => index);

  if (variant === "string") {
    return (
      <div className="pointer-events-none absolute inset-y-3 left-1/2 z-30 hidden w-10 -translate-x-1/2 sm:block" aria-hidden="true">
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-skyLove-softPink shadow-sm" />
        {positions.map((position) => (
          <span key={position} className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-900/70 shadow-inner" style={{ top: `${3 + position * 6.2}%` }} />
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
    <div className="pointer-events-none absolute inset-y-3 left-1/2 z-30 hidden w-12 -translate-x-1/2 sm:block" aria-hidden="true">
      <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#8b6b4d]/30 to-transparent" />
      {positions.map((position) => (
        <div key={position} className="absolute left-1/2 h-5 w-full -translate-x-1/2" style={{ top: `${1 + position * 6.35}%` }}>
          <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#5b3824] shadow-inner" />
          <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#5b3824] shadow-inner" />
          <span className="absolute left-1/2 top-1/2 h-5 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#d6c5a8] bg-gradient-to-b from-white/90 via-[#c3b397] to-[#806c51] shadow-[0_2px_3px_rgba(60,40,20,0.4)]" style={{ rotate: position % 2 ? "1deg" : "-1deg" }} />
          <span className="absolute left-1/2 top-0 h-1 w-3 -translate-x-1/2 rounded-full bg-white/80" />
        </div>
      ))}
    </div>
  );
}
