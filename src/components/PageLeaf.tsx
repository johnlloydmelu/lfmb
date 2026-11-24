import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface PageLeafProps {
  direction: "next" | "prev";
  front: ReactNode;
  back: ReactNode;
  onComplete: () => void;
}

export default function PageLeaf({ direction, front, back, onComplete }: PageLeafProps) {
  const shouldReduceMotion = useReducedMotion();
  const next = direction === "next";

  return (
    <motion.div
      initial={{ rotateY: 0, z: 0, scale: 1, skewY: 0 }}
      animate={shouldReduceMotion
        ? { opacity: 0 }
        : { rotateY: next ? [0, -92, -180] : [0, 92, 180], z: [0, 28, 0], scale: [1, 1.02, 1], skewY: [0, next ? 3 : -3, 0] }}
      transition={{ duration: shouldReduceMotion ? 0.14 : 1.08, ease: [0.65, 0, 0.35, 1], times: [0, 0.5, 1] }}
      onAnimationComplete={onComplete}
      className={`absolute inset-y-0 z-20 w-1/2 overflow-hidden rounded-xl bg-[#f8f0df] shadow-[0_18px_24px_rgba(55,35,20,0.28)] ${next ? "right-0" : "left-0"}`}
      style={{ transformOrigin: next ? "left center" : "right center", transformStyle: "preserve-3d", perspective: 2000, willChange: "transform" }}
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
      <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>{back}</div>
      <div className="pointer-events-none absolute inset-y-0 w-3 bg-gradient-to-r from-transparent via-white/50 to-transparent" style={{ [next ? "right" : "left"]: 0 }} />
    </motion.div>
  );
}
