
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({
  onComplete,
}: LoadingScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(
      onComplete,
      shouldReduceMotion ? 100 : 1200
    );

    return () => window.clearTimeout(timeout);
  }, [onComplete, shouldReduceMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-skyLove-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      aria-label="Loading website"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.25, 1],
              }
        }
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      >
        <Heart
          size={65}
          fill="currentColor"
          className="loading-heart text-skyLove-pink"
        />
      </motion.div>

      <h2 className="mt-7 font-romantic text-3xl font-bold text-skyLove-dark">
        Preparing a little love...
      </h2>

      <p className="mt-3 text-sm text-sky-700">
        Just for you.
      </p>
    </motion.div>
  );
}
