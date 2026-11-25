import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

interface PageLeafProps {
  direction: "next" | "prev";
  front: ReactNode; // what the page looks like BEFORE it turns
  back: ReactNode; // what the page looks like AFTER it turns (its other side)
  onComplete: () => void;
}

const DURATION = 1.15;

/**
 * A single turning page.
 * - Rotates around the spine with real 3D depth
 * - Darkens as it turns away from the light, brightens as it lands
 * - Casts a soft shadow on the pages beneath it
 * Render it inside the book container (position: relative).
 */
export default function PageLeaf({ direction, front, back, onComplete }: PageLeafProps) {
  const shouldReduceMotion = useReducedMotion();
  const next = direction === "next";

  // Always call the latest onComplete without restarting the animation
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const rotateY = useMotionValue(0);
  const progress = useTransform(rotateY, (value) => Math.min(1, Math.abs(value) / 180));

  const frontDark = useTransform(progress, [0, 0.5], [0, 0.42]);
  const backDark = useTransform(progress, [0.5, 1], [0.42, 0]);
  const lift = useTransform(progress, [0, 0.5, 1], [0, 34, 0]);
  const sourceShadow = useTransform(progress, [0, 1], [0.4, 0]); // page revealed under the lifting leaf
  const landShadow = useTransform(progress, [0, 0.55, 1], [0, 0.34, 0]); // shadow on the page it lands on

  useEffect(() => {
    if (shouldReduceMotion) {
      const timer = window.setTimeout(() => completeRef.current(), 140);
      return () => window.clearTimeout(timer);
    }

    const controls = animate(rotateY, next ? -180 : 180, {
      duration: DURATION,
      ease: [0.45, 0.05, 0.25, 1],
      onComplete: () => completeRef.current(),
    });
    return () => controls.stop();
  }, [next, rotateY, shouldReduceMotion]);

  const spineGradientSource = next ? "to right" : "to left";
  const spineGradientLand = next ? "to left" : "to right";

  return (
    <>
      {/* shadow on the half the page is leaving */}
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 z-10 w-1/2 ${next ? "right-0" : "left-0"}`}
        style={{
          opacity: sourceShadow,
          background: `linear-gradient(${spineGradientSource}, rgb(40 25 10 / 0.6), transparent 65%)`,
        }}
      />
      {/* shadow on the half the page is landing on */}
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 z-10 w-1/2 ${next ? "left-0" : "right-0"}`}
        style={{
          opacity: landShadow,
          background: `linear-gradient(${spineGradientLand}, rgb(40 25 10 / 0.6), transparent 70%)`,
        }}
      />

      {/* the turning page */}
      <motion.div
        className={`pointer-events-none absolute inset-y-0 z-20 w-1/2 ${next ? "right-0" : "left-0"}`}
        style={{
          rotateY,
          z: lift,
          transformOrigin: next ? "left center" : "right center",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#fbf4e4] [backface-visibility:hidden]">
          {front}
          <motion.div aria-hidden="true" className="absolute inset-0 bg-[#2e1c0a]" style={{ opacity: frontDark }} />
          {/* curl highlight along the free edge */}
          <div
            aria-hidden="true"
            className={`absolute inset-y-0 w-6 ${next ? "right-0" : "left-0"}`}
            style={{
              background: `linear-gradient(${next ? "to left" : "to right"}, rgb(255 255 255 / 0.55), transparent)`,
            }}
          />
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl bg-[#fbf4e4] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          {back}
          <motion.div aria-hidden="true" className="absolute inset-0 bg-[#2e1c0a]" style={{ opacity: backDark }} />
          <div
            aria-hidden="true"
            className={`absolute inset-y-0 w-6 ${next ? "left-0" : "right-0"}`}
            style={{
              background: `linear-gradient(${next ? "to right" : "to left"}, rgb(255 255 255 / 0.5), transparent)`,
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
