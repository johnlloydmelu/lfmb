
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import SectionFlow from "./SectionFlow";
import FloatingPolaroids from "./FloatingPolaroids";

interface HeroProps {
  herName: string;
  message: string;
  isReady: boolean;
}

export default function Hero({ herName, message, isReady }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const title = herName;
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    if (!isReady) {
      setTypedTitle("");
      return;
    }

    if (shouldReduceMotion) {
      setTypedTitle(title);
      return;
    }

    let character = 0;
    setTypedTitle("");
    const timer = window.setInterval(() => {
      character += 1;
      setTypedTitle(title.slice(0, character));
      if (character >= title.length) window.clearInterval(timer);
    }, 85);

    return () => window.clearInterval(timer);
  }, [isReady, shouldReduceMotion, title]);

  const animation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: "easeOut" as const },
      };

  return (
    <SectionFlow
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-16 pt-24 text-center"
    >
      <div className="absolute left-10 top-28 text-pink-400 opacity-60">
        <Heart size={24} fill="currentColor" />
      </div>

      <div className="absolute right-12 top-40 text-sky-600 opacity-50">
        <Heart size={18} fill="currentColor" />
      </div>

      <FloatingPolaroids />

      <motion.div
        {...animation}
        className="relative z-10 w-full max-w-none"
      >
        <motion.p
          className="mb-5 text-base font-bold uppercase tracking-[0.3em] text-skyLove-dark sm:text-lg"
          animate={shouldReduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Happy 1st Year Anniversary
        </motion.p>

        <h1 className="block w-full text-center whitespace-nowrap font-heading text-[clamp(2rem,7.2vw,7rem)] font-semibold leading-[1.04] text-skyLove-pink">
          <span aria-label={title}>
            {typedTitle}
            {!shouldReduceMotion && typedTitle.length < title.length && (
              <span className="ml-1 inline-block h-[0.8em] w-[0.06em] animate-pulse bg-skyLove-pink align-middle" aria-hidden="true" />
            )}
          </span>
        </h1>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-sky-900 sm:text-lg">
            {message}
          </p>
        </motion.div>

        <motion.a
          href="#memories"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-skyLove-dark px-8 py-4 font-bold text-white shadow-romantic transition-colors hover:bg-sky-800"
        >
          Explore it cutie baby
          <Heart size={18} fill="currentColor" />
        </motion.a>

        <motion.a
          href="#memories"
          aria-label="Scroll to our memories"
          animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mt-10 flex items-center justify-center text-skyLove-dark"
        >
          <ChevronDown size={30} />
        </motion.a>
      </motion.div>
    </SectionFlow>
  );
}
