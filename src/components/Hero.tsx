import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { Heart, Sparkles } from "lucide-react";
import SectionFlow from "./SectionFlow";
import FloatingPolaroids from "./FloatingPolaroids";

interface HeroProps {
  herName: string;
  message: string;
  isReady: boolean;
}

/* Soft hearts drifting up behind the content */
const risers = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: ((i * 37 + 9) % 92) + 4,
  size: 12 + ((i * 5) % 12),
  dur: 12 + ((i * 3) % 9),
  delay: -((i * 2.3) % 16),
  drift: (i % 2 ? 1 : -1) * (12 + ((i * 7) % 30)),
  color: i % 3 === 0 ? "text-sky-400" : "text-pink-300",
}));

/* Sparkles around the name */
const twinkles = [
  { cls: "-left-2 -top-6 sm:left-[4%]", size: 22, delay: 0 },
  { cls: "-right-1 -top-8 sm:right-[5%]", size: 18, delay: 0.9 },
  { cls: "left-[12%] -bottom-4 hidden sm:block", size: 14, delay: 1.6 },
  { cls: "right-[10%] -bottom-6 hidden sm:block", size: 20, delay: 0.5 },
];

export default function Hero({ herName, message, isReady }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const title = herName;
  const [typedTitle, setTypedTitle] = useState("");
  const typingDone = typedTitle.length >= title.length;

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

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <SectionFlow
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-16 pt-28 text-center"
    >
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <span className="hero-orb left-[18%] top-[18%] h-72 w-72 bg-pink-300/45" />
        <span className="hero-orb right-[14%] top-[30%] h-80 w-80 bg-sky-300/50" style={{ animationDelay: "-3s" }} />
        <span className="hero-orb bottom-[6%] left-[40%] h-64 w-64 bg-white/70" style={{ animationDelay: "-6s" }} />
      </div>

      {/* Rising hearts */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
          {risers.map((r) => (
            <span
              key={r.id}
              className={`hero-rise ${r.color}`}
              style={
                {
                  left: `${r.left}%`,
                  "--dur": `${r.dur}s`,
                  "--delay": `${r.delay}s`,
                  "--drift": `${r.drift}px`,
                } as CSSProperties
              }
            >
              <Heart size={r.size} fill="currentColor" />
            </span>
          ))}
        </div>
      )}

      <FloatingPolaroids isReady={isReady} />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Anniversary badge */}
        <motion.div {...fadeUp(0.1)} className="mb-7 flex justify-center">
          <div className="hero-badge inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/60 px-5 py-2.5 shadow-glass backdrop-blur-md">
            <Sparkles size={16} className="text-skyLove-pink" />
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-skyLove-dark sm:text-sm">
              Happy 1st Year Anniversary
            </span>
            <Sparkles size={16} className="text-skyLove-pink" />
          </div>
        </motion.div>

        {/* Name */}
        <motion.div {...fadeUp(0.25)} className="relative mx-auto">
          {twinkles.map((t, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`hero-twinkle absolute ${t.cls}`}
              style={{ fontSize: t.size, animationDelay: `${t.delay}s` }}
            >
              ✦
            </span>
          ))}

          <h1 className="mx-auto text-balance font-heading text-[clamp(2.4rem,6.2vw,5.75rem)] font-semibold leading-[1.1]">
            <span aria-label={title} className="hero-gradient-text">
              {typedTitle}
            </span>
            {!shouldReduceMotion && !typingDone && (
              <span
                className="ml-1 inline-block h-[0.8em] w-[0.06em] animate-pulse bg-skyLove-pink align-middle"
                aria-hidden="true"
              />
            )}
          </h1>

          {/* Hand-drawn underline with heart */}
          <svg
            viewBox="0 0 300 30"
            className="mx-auto mt-1 h-7 w-[min(70vw,26rem)] overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="hero-underline" x1="0" x2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <motion.path
              d="M6 18 Q 75 2 150 14 T 294 12"
              fill="none"
              stroke="url(#hero-underline)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
              animate={{ pathLength: typingDone ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: "easeInOut" }}
            />
            <motion.g
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: typingDone ? 1 : 0, scale: typingDone ? 1 : 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.9, type: "spring", stiffness: 260, damping: 14 }}
              style={{ transformOrigin: "150px 14px" }}
            >
              <path
                d="M150 24 C 134 12 138 4 144 4 C 147 4 149 6 150 8 C 151 6 153 4 156 4 C 162 4 166 12 150 24 Z"
                fill="#fb7185"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Message card */}
        <motion.div {...fadeUp(0.5)}>
          <p className="mx-auto mt-6 max-w-xl rounded-[2rem] border border-white/70 bg-white/55 px-7 py-4 text-base leading-8 text-sky-900 shadow-glass backdrop-blur-md sm:text-lg">
            {message}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.7)} className="relative mx-auto mt-9 inline-block">
          <span className="hero-btn-ring" aria-hidden="true" />
          <motion.a
            href="#memories"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.06, y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="hero-btn relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-900 via-skyLove-dark to-sky-800 px-9 py-4 font-bold text-white shadow-romantic"
          >
            Explore it cutie baby
            <Heart size={18} fill="currentColor" className="loading-heart text-pink-300" />
          </motion.a>
        </motion.div>

        {/* Scroll cue */}
        <motion.div {...fadeUp(0.9)} className="mt-10 flex justify-center">
          <a
            href="#memories"
            aria-label="Scroll to our memories"
            className="flex h-12 w-7 justify-center rounded-full border-2 border-skyLove-dark/60 pt-2"
          >
            <motion.span
              className="h-2 w-1.5 rounded-full bg-skyLove-pink"
              animate={shouldReduceMotion ? undefined : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </a>
        </motion.div>
      </div>
    </SectionFlow>
  );
}
