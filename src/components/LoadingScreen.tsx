import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const messages = [
  "Gathering our sweetest memories...",
  "Warming up a little corner of the sky...",
  "Writing something only you should read...",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const readyTimer = window.setTimeout(
      () => setReady(true),
      shouldReduceMotion ? 450 : 2600
    );
    const messageTimer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 1100);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(readyTimer);
      window.clearInterval(messageTimer);
    };
  }, [shouldReduceMotion]);

  const openLetter = () => {
    if (!ready || opening) return;
    setOpening(true);
    window.dispatchEvent(new Event("love-letter:open"));
    window.setTimeout(onComplete, shouldReduceMotion ? 120 : 900);
  };

  return (
    <motion.div
      className="splash-screen fixed inset-0 z-[300] overflow-hidden bg-skyLove-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.12 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      aria-label="A little surprise for you"
    >
      <div className="splash-stars" aria-hidden="true">
        <Sparkles className="splash-star splash-star-one" size={16} />
        <Sparkles className="splash-star splash-star-two" size={13} />
        <Sparkles className="splash-star splash-star-three" size={18} />
      </div>

      <motion.div
        className="relative flex min-h-full flex-col items-center justify-center px-6 text-center"
        animate={opening && !shouldReduceMotion ? { scale: 1.08, opacity: 0 } : undefined}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="splash-envelope relative mb-9 flex h-40 w-56 items-center justify-center rounded-[2rem] border border-white/80 bg-white/35 shadow-2xl backdrop-blur-md sm:h-48 sm:w-72"
          animate={opening || shouldReduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 1, 0, -1, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[2rem] bg-skyLove-softPink/75 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-skyLove-pink text-white shadow-[0_0_0_9px_rgba(251,113,133,0.16),0_12px_28px_rgba(190,50,80,0.24)]">
            <Heart size={31} fill="currentColor" />
          </span>
          <span className="absolute bottom-0 left-0 h-1/2 w-full rounded-b-[2rem] bg-white/55 [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
        </motion.div>

        <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-sky-700 sm:text-sm">
          Just for you, Althea
        </p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-skyLove-dark sm:text-6xl">
          A little love letter
        </h1>

        <div className="mt-5 h-8 text-sm text-sky-800 sm:text-base" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-white/60">
          <motion.span
            className="block h-full rounded-full bg-skyLove-pink"
            initial={{ width: "8%" }}
            animate={{ width: ready ? "100%" : "78%" }}
            transition={{ duration: ready ? 0.35 : 2.6, ease: "easeOut" }}
          />
        </div>

        <motion.button
          type="button"
          onClick={openLetter}
          disabled={!ready || opening}
          whileHover={ready && !shouldReduceMotion ? { scale: 1.04 } : undefined}
          whileTap={ready && !shouldReduceMotion ? { scale: 0.96 } : undefined}
          className="mt-9 rounded-full bg-skyLove-dark px-8 py-4 font-bold text-white shadow-romantic transition-opacity disabled:cursor-wait disabled:opacity-55"
        >
          {opening ? "Opening your letter..." : ready ? "Tap to open" : "Preparing something special..."}
          <Heart size={17} fill="currentColor" className="ml-2 inline-block" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
