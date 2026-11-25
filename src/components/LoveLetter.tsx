import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Heart, X } from "lucide-react";
import SectionFlow from "./SectionFlow";
import ScrollReveal from "./ScrollReveal";

interface LoveLetterProps {
  myName: string;
  message: string;
}

/* ---------- EASY SETTINGS ---------- */
const CLOSE_ON_BACKDROP_CLICK = false; // false = tapping the background makes hearts instead of closing
const RISER_COUNT = 18; // floating hearts/sparkles in the letter modal (lower this on slow phones)
const MODAL_DELAY_MS = 950; // how long the envelope animation plays before the letter modal appears
const ENVELOPE_TEXT = "For you, my baby"; // text printed on the front of the envelope

/* ---------- ENVELOPE SHAPES (SVG coordinates) ---------- */
// Flap: rounded top corners, soft rounded tip. Drawn in a 360 x 140 box.
const FLAP_PATH = "M0 16 Q0 0 16 0 H344 Q360 0 360 16 L188 134 Q180 141 172 134 Z";

/* Hearts that drift up around the CLOSED envelope */
const envelopeRisers = [
  { left: "6%", size: 16, dur: 7, delay: 0, drift: -14, color: "text-skyLove-pink" },
  { left: "92%", size: 14, dur: 8, delay: 1.6, drift: 16, color: "text-sky-400" },
  { left: "16%", size: 11, dur: 9, delay: 3.1, drift: 10, color: "text-rose-300" },
  { left: "82%", size: 18, dur: 7.5, delay: 4.4, drift: -12, color: "text-skyLove-pink" },
  { left: "50%", size: 12, dur: 10, delay: 2.2, drift: 18, color: "text-white" },
  { left: "30%", size: 13, dur: 8.5, delay: 5.3, drift: -18, color: "text-sky-300" },
];

/* Hearts that pop out of the envelope when it opens */
const openBurst = Array.from({ length: 9 }, (_, i) => ({
  x: (i - 4) * 26,
  y: -(110 + (i % 3) * 38),
  rotate: (i % 2 ? 1 : -1) * (12 + i * 4),
  size: 14 + (i % 3) * 5,
}));

/* Opening burst: 14 hearts fly out in a ring around the card */
const heartBurst = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const radius = 170 + (i % 3) * 45;
  return {
    x: Math.cos(angle) * radius * 1.15,
    y: Math.sin(angle) * radius * 0.85,
    rotate: (i % 2 ? 1 : -1) * (15 + i * 3),
    size: 14 + (i % 3) * 6,
  };
});

/* Hearts + sparkles that float upward behind/around the card */
const riserColors = ["text-skyLove-pink", "text-rose-200", "text-white"];
const risers = Array.from({ length: RISER_COUNT }, (_, i) => ({
  id: i,
  left: ((i * 53 + 11) % 94) + 3,
  size: 12 + ((i * 7) % 5) * 5,
  duration: 10 + ((i * 5) % 8),
  delay: -((i * 1.9) % 14), // negative = already mid-flight when letter opens
  drift: (i % 2 ? 1 : -1) * (14 + ((i * 3) % 34)),
  blur: i % 4 === 0,
  spark: i % 3 === 0,
  color: riserColors[i % 3],
}));

/* Twinkling stars scattered around */
const stars = [
  { x: "8%", y: "16%", s: 18, d: 0 },
  { x: "22%", y: "82%", s: 14, d: 0.8 },
  { x: "30%", y: "8%", s: 12, d: 1.6 },
  { x: "74%", y: "10%", s: 16, d: 0.4 },
  { x: "90%", y: "30%", s: 20, d: 1.2 },
  { x: "86%", y: "78%", s: 14, d: 2 },
  { x: "5%", y: "55%", s: 12, d: 2.4 },
  { x: "60%", y: "92%", s: 12, d: 1 },
];

const modalClouds = ["letter-cloud-a", "letter-cloud-b", "letter-cloud-c", "letter-cloud-d"];

export default function LoveLetter({ myName, message }: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [bursts, setBursts] = useState<{ x: number; y: number; id: number }[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const messageLines = message.split(/\n+/).filter((line) => line.trim());
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const haloX = useTransform(parallaxX, [-40, 40], [-8, 8]);
  const haloY = useTransform(parallaxY, [-40, 40], [-8, 8]);
  const particleX = useTransform(parallaxX, [-40, 40], [-16, 16]);
  const particleY = useTransform(parallaxY, [-40, 40], [-16, 16]);

  const visibleRisers = useMemo(() => risers, []);

  const closeLetter = useCallback(() => {
    setShowLetter(false);
    window.setTimeout(() => setIsOpen(false), shouldReduceMotion ? 0 : 420);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!isOpen) {
      setShowLetter(false);
      return;
    }
    const timer = window.setTimeout(() => setShowLetter(true), shouldReduceMotion ? 0 : MODAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen, shouldReduceMotion]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLetter();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLetter, isOpen]);

  useEffect(() => {
    if (!isOpen || shouldReduceMotion) return;
    const updateParallax = (x: number, y: number) => {
      parallaxX.set(Math.max(-40, Math.min(40, x)));
      parallaxY.set(Math.max(-40, Math.min(40, y)));
    };
    const handlePointerMove = (event: PointerEvent) => {
      updateParallax(
        (event.clientX / window.innerWidth - 0.5) * 80,
        (event.clientY / window.innerHeight - 0.5) * 80
      );
    };
    const handleOrientation = (event: DeviceOrientationEvent) => {
      updateParallax((event.gamma ?? 0) * 1.4, (event.beta ?? 0) * 0.45);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
      parallaxX.set(0);
      parallaxY.set(0);
    };
  }, [isOpen, parallaxX, parallaxY, shouldReduceMotion]);

  const toggleLetter = () => {
    if (isOpen) {
      closeLetter();
      return;
    }
    setIsOpen(true);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const id = Date.now();
    setBursts((prev) => [...prev.slice(-4), { x: event.clientX, y: event.clientY, id }]);
    window.setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1100);
    if (CLOSE_ON_BACKDROP_CLICK) closeLetter();
  };

  const dur = (seconds: number) => (shouldReduceMotion ? 0 : seconds);

  return (
    <SectionFlow
      id="letter"
      className="relative px-5 pb-12 pt-20 text-center sm:pb-16 sm:pt-24"
    >
      <ScrollReveal className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-sky-700 sm:text-base">
          Something from my heart
        </p>
        <h2 className="font-heading text-4xl font-semibold text-skyLove-dark sm:text-6xl">
          A Letter For You
        </h2>
        <p className="mt-5 text-sky-800">Take your time for reading it.</p>

        {/* ================= ENVELOPE ================= */}
        <div className="relative mx-auto mt-10 flex min-h-[350px] w-full max-w-lg items-center justify-center">
          {/* soft glows */}
          <motion.div
            aria-hidden="true"
            className="absolute h-48 w-72 rounded-full bg-sky-200/70 blur-3xl"
            animate={
              shouldReduceMotion || isOpen
                ? undefined
                : { opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.05, 0.92] }
            }
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute h-40 w-64 translate-y-10 rounded-full bg-rose-200/60 blur-3xl"
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: isOpen ? 1 : [0.3, 0.6, 0.3], scale: isOpen ? 1.25 : [1, 1.1, 1] }
            }
            transition={{ duration: isOpen ? 0.6 : 4.2, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
          />

          {/* hearts drifting up around the closed envelope */}
          {!isOpen && !shouldReduceMotion && (
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {envelopeRisers.map((r, i) => (
                <span
                  key={i}
                  className={`env-rise ${r.color}`}
                  style={
                    {
                      left: r.left,
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

          <div className="relative z-10 h-[245px] w-[360px] max-w-[90vw]">
            {/* ground shadow that breathes with the float */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-8 left-1/2 h-5 w-[78%] -translate-x-1/2 rounded-full bg-sky-900/30 blur-md"
              animate={
                shouldReduceMotion || isOpen
                  ? { scaleX: 1, opacity: 0.4 }
                  : { scaleX: [1, 0.86, 1], opacity: [0.5, 0.28, 0.5] }
              }
              transition={{ duration: 3.2, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
            />

            {/* float wrapper */}
            <motion.div
              className="absolute inset-0"
              animate={shouldReduceMotion || isOpen ? { y: 0 } : { y: [0, -9, 0] }}
              transition={{ duration: 3.2, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }}
            >
              <motion.button
                type="button"
                onClick={toggleLetter}
                aria-expanded={isOpen}
                aria-controls="love-letter-message"
                aria-label={isOpen ? "Close love letter" : "Open love letter"}
                style={{ perspective: 900 }}
                whileHover={shouldReduceMotion || isOpen ? undefined : { y: -4, rotate: -1.2, scale: 1.025 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="relative block h-full w-full overflow-visible rounded-2xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-sky-500"
              >
                {/* 1. BACK WALL (pink heart-patterned liner) + shared SVG definitions */}
                <svg
                  viewBox="0 0 360 245"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="env-body" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffeef1" />
                      <stop offset="1" stopColor="#ffb9c6" />
                    </linearGradient>
                    <pattern id="env-hearts" width="26" height="26" patternUnits="userSpaceOnUse">
                      <path
                        d="M13 19 C7 14 6 10 8.2 8.6 C10 7.5 12 8.5 13 10.2 C14 8.5 16 7.5 17.8 8.6 C20 10 19 14 13 19 Z"
                        fill="rgba(251,113,133,0.3)"
                      />
                    </pattern>
                    <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffb7c3" />
                      <stop offset="0.55" stopColor="#fb7185" />
                      <stop offset="1" stopColor="#f0506a" />
                    </linearGradient>
                    <linearGradient id="env-side-l" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#f0fbff" />
                      <stop offset="1" stopColor="#b3e3fa" />
                    </linearGradient>
                    <linearGradient id="env-side-r" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0" stopColor="#f0fbff" />
                      <stop offset="1" stopColor="#b3e3fa" />
                    </linearGradient>
                    <linearGradient id="env-bottom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#e2f5ff" />
                      <stop offset="1" stopColor="#f6fcff" />
                    </linearGradient>
                    <filter id="env-fold" x="-10%" y="-20%" width="120%" height="140%">
                      <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#0c4a6e" floodOpacity="0.22" />
                    </filter>
                    <filter id="env-flap-shadow" x="-5%" y="-5%" width="110%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#9f1239" floodOpacity="0.35" />
                    </filter>
                    <clipPath id="env-clip">
                      <rect width="360" height="245" rx="16" />
                    </clipPath>
                  </defs>
                  <rect width="360" height="245" rx="16" fill="url(#env-body)" />
                  <rect width="360" height="245" rx="16" fill="url(#env-hearts)" />
                  {/* inner shadow so the opening looks deep */}
                  <rect width="360" height="245" rx="16" fill="rgba(159,18,57,0.08)" />
                </svg>

                {/* 2. FLAP: swings open around the top edge */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[57%]"
                  style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                  initial={false}
                  animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 5 : 40 }}
                  transition={{
                    rotateX: {
                      duration: dur(0.7),
                      delay: isOpen ? 0.05 : dur(0.3),
                      ease: [0.22, 1, 0.36, 1],
                    },
                    zIndex: { duration: 0, delay: isOpen ? dur(0.32) : dur(0.62) },
                  }}
                >
                  {/* outside of the flap */}
                  <svg
                    viewBox="0 0 360 140"
                    preserveAspectRatio="none"
                    className="env-face absolute inset-0 h-full w-full overflow-visible"
                  >
                    <path
                      d={FLAP_PATH}
                      fill="url(#env-flap)"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      filter="url(#env-flap-shadow)"
                    />
                    <path d="M14 7 H346" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {/* inside of the flap (visible once open) */}
                  <svg
                    viewBox="0 0 360 140"
                    preserveAspectRatio="none"
                    className="env-face absolute inset-0 h-full w-full overflow-visible"
                    style={{ transform: "rotateX(180deg)" }}
                  >
                    <path d={FLAP_PATH} fill="#ffd3dc" />
                    <path d={FLAP_PATH} fill="url(#env-hearts)" />
                    <path
                      d={FLAP_PATH}
                      fill="none"
                      stroke="rgba(251,113,133,0.6)"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                {/* 3. THE LETTER: rises out of the envelope */}
                <motion.div
                  aria-hidden="true"
                  className="env-paper absolute left-[7%] top-[9%] z-10 h-[86%] w-[86%] rounded-xl px-5 pt-4 text-center shadow-[0_6px_16px_rgba(12,74,110,0.2)]"
                  initial={false}
                  animate={{ y: isOpen ? -118 : 0, rotate: isOpen ? -1.5 : 0 }}
                  transition={{
                    type: shouldReduceMotion ? "tween" : "spring",
                    stiffness: 110,
                    damping: 16,
                    duration: shouldReduceMotion ? 0 : undefined,
                    delay: isOpen ? dur(0.32) : 0,
                  }}
                >
                  <Heart size={26} fill="currentColor" className="mx-auto text-skyLove-pink" />
                  <p className="mt-1 font-heading text-sm font-semibold text-skyLove-dark">My Dearest Baby Cutie,</p>
                  <div className="mx-auto mt-2 space-y-1.5">
                    <span className="block h-1.5 w-4/5 rounded-full bg-sky-200/80" />
                    <span className="block h-1.5 w-3/5 rounded-full bg-sky-200/80" />
                    <span className="block h-1.5 w-2/3 rounded-full bg-rose-200/80" />
                  </div>
                </motion.div>

                {/* 4. FRONT POCKET: the folded V of the envelope */}
                <svg
                  viewBox="0 0 360 245"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  aria-hidden="true"
                >
                  <g clipPath="url(#env-clip)">
                    <polygon points="0,0 180,128 0,245" fill="url(#env-side-l)" />
                    <polygon points="360,0 180,128 360,245" fill="url(#env-side-r)" />
                    <polygon points="0,245 180,128 360,245" fill="url(#env-bottom)" filter="url(#env-fold)" />
                    <polyline points="0,245 180,128 360,245" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinejoin="round" />
                    <polyline points="0,0 180,128" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                    <polyline points="360,0 180,128" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  </g>
                  <rect x="1" y="1" width="358" height="243" rx="16" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
                </svg>

                {/* printed text + postage stamp */}
                <span className="pointer-events-none absolute inset-x-0 bottom-4 z-[25] flex items-center justify-center gap-1.5 font-heading text-sm font-semibold text-skyLove-dark/80 sm:text-base">
                  {ENVELOPE_TEXT}
                  <Heart size={13} fill="currentColor" className="text-skyLove-pink" />
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[3.5%] top-[17%] z-[25] flex h-10 w-8 rotate-6 items-center justify-center rounded-[3px] border-2 border-dashed border-rose-300 bg-white shadow-sm"
                >
                  <span className="flex h-7 w-5 items-center justify-center rounded-[2px] bg-rose-100">
                    <Heart size={12} fill="currentColor" className="text-skyLove-pink" />
                  </span>
                </span>

                {/* 5. WAX SEAL: cracks in two when opened */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[55%] z-50 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
                >
                  {!isOpen && !shouldReduceMotion && (
                    <motion.span
                      className="absolute -inset-1.5 rounded-full border-2 border-rose-300"
                      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  {[
                    { clip: "inset(-12px 50% -12px -12px)", x: -26, rotate: -28 },
                    { clip: "inset(-12px -12px -12px 50%)", x: 26, rotate: 28 },
                  ].map((half, i) => (
                    <motion.span
                      key={i}
                      className="env-seal absolute inset-0 flex items-center justify-center"
                      style={{ clipPath: half.clip }}
                      initial={false}
                      animate={{
                        x: isOpen ? half.x : 0,
                        y: isOpen ? 24 : 0,
                        rotate: isOpen ? half.rotate : 0,
                        opacity: isOpen ? 0 : 1,
                      }}
                      transition={{ duration: dur(0.5), delay: isOpen ? 0 : dur(0.7), ease: "easeOut" }}
                    >
                      <Heart
                        fill="currentColor"
                        className="h-6 w-6 text-rose-200/90 drop-shadow-[0_1px_1px_rgba(120,10,40,0.6)]"
                      />
                    </motion.span>
                  ))}
                </span>
              </motion.button>

              {/* hearts pop out of the envelope when it opens */}
              {isOpen && !shouldReduceMotion && (
                <div className="pointer-events-none absolute left-1/2 top-[22%] z-[60]" aria-hidden="true">
                  {openBurst.map((heart, i) => (
                    <motion.span
                      key={i}
                      className="absolute -ml-2 -mt-2 text-skyLove-pink drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                      animate={{
                        x: heart.x,
                        y: heart.y,
                        opacity: [0, 1, 0],
                        scale: [0.3, 1.1, 0.7],
                        rotate: heart.rotate,
                      }}
                      transition={{ duration: 1.3, delay: 0.35 + i * 0.05, ease: "easeOut" }}
                    >
                      <Heart size={heart.size} fill="currentColor" />
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <p className="mt-6 text-sm font-bold text-sky-700">
          {isOpen ? "A little message from me" : "Tap to open your letter"}
        </p>
      </ScrollReveal>

      {isOpen &&
        createPortal(
          <AnimatePresence initial={false}>
            {showLetter && (
              <motion.div
                className="letter-modal letter-backdrop fixed inset-0 z-[150] flex h-[100dvh] w-screen items-center justify-center overflow-hidden p-5 backdrop-blur-[6px]"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
                onClick={handleBackdropClick}
              >
                {/* LAYER 1: rays, halo, clouds (behind everything) */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-6 overflow-hidden"
                  style={{ x: haloX, y: haloY }}
                >
                  <div className="letter-rays" />
                  <div className="letter-halo" />
                  {modalClouds.map((name) => (
                    <span key={name} className={`letter-cloud ${name}`} />
                  ))}
                </motion.div>

                {/* LAYER 2: twinkling stars + rising hearts */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-6 overflow-hidden"
                  style={{ x: particleX, y: particleY }}
                >
                  {stars.map((star, i) => (
                    <span
                      key={i}
                      className="letter-star"
                      style={
                        {
                          left: star.x,
                          top: star.y,
                          fontSize: star.s,
                          animationDelay: `${star.d}s`,
                        } as CSSProperties
                      }
                    >
                      ✦
                    </span>
                  ))}

                  {!shouldReduceMotion &&
                    visibleRisers.map((r) => (
                      <span
                        key={r.id}
                        className={`letter-riser ${r.color} ${r.blur ? "letter-riser-blur" : ""}`}
                        style={
                          {
                            left: `${r.left}%`,
                            fontSize: r.size,
                            "--dur": `${r.duration}s`,
                            "--delay": `${r.delay}s`,
                            "--drift": `${r.drift}px`,
                          } as CSSProperties
                        }
                      >
                        {r.spark ? "✦" : <Heart size={r.size} fill="currentColor" />}
                      </span>
                    ))}
                </motion.div>

                {/* OPENING HEART BURST */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2">
                  {heartBurst.map((heart, index) => (
                    <motion.span
                      key={index}
                      className="absolute -ml-2 -mt-2 text-skyLove-pink drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
                      initial={{ x: 0, y: 20, opacity: 0, scale: 0.3, rotate: 0 }}
                      animate={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : {
                              x: heart.x,
                              y: heart.y,
                              opacity: [0, 1, 0],
                              scale: [0.3, 1.15, 0.6],
                              rotate: heart.rotate,
                            }
                      }
                      transition={{
                        duration: shouldReduceMotion ? 0 : 1.1,
                        delay: shouldReduceMotion ? 0 : index * 0.025,
                        ease: "easeOut",
                      }}
                    >
                      <Heart size={heart.size} fill="currentColor" />
                    </motion.span>
                  ))}
                </div>

                {/* TAP-ON-BACKGROUND HEART BURSTS */}
                {bursts.map((burst) => (
                  <div
                    key={burst.id}
                    aria-hidden="true"
                    className="pointer-events-none fixed z-20"
                    style={{ left: burst.x, top: burst.y }}
                  >
                    {Array.from({ length: 7 }, (_, i) => {
                      const a = (i / 7) * Math.PI * 2;
                      return (
                        <motion.span
                          key={i}
                          className="absolute -ml-2 -mt-2 text-skyLove-pink drop-shadow-[0_0_6px_rgba(251,113,133,0.8)]"
                          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                          animate={{
                            x: Math.cos(a) * 70,
                            y: Math.sin(a) * 70 - 20,
                            opacity: 0,
                            scale: 1.1,
                          }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        >
                          <Heart size={14 + (i % 3) * 4} fill="currentColor" />
                        </motion.span>
                      );
                    })}
                  </div>
                ))}

                {/* CARD WRAPPER (animates in; holds corner decorations outside the scroll area) */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 150, scale: 0.55 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: 60, scale: 0.82 }}
                  transition={{
                    type: shouldReduceMotion ? "tween" : "spring",
                    stiffness: 190,
                    damping: 22,
                    duration: shouldReduceMotion ? 0 : undefined,
                  }}
                  onClick={(event) => event.stopPropagation()}
                  className="relative z-10 my-auto w-full max-w-2xl"
                >
                  {/* Corner decorations */}
                  <span aria-hidden="true" className="letter-corner -left-3 -top-4 text-skyLove-pink sm:-left-5 sm:-top-6">
                    <Heart size={28} fill="currentColor" />
                  </span>
                  <span aria-hidden="true" className="letter-corner right-12 -top-5 text-white sm:-top-7" style={{ animationDelay: "0.6s", fontSize: 22 }}>
                    ✦
                  </span>
                  <span aria-hidden="true" className="letter-corner -bottom-4 -left-2 text-white sm:-bottom-6 sm:-left-4" style={{ animationDelay: "1.1s", fontSize: 24 }}>
                    ✦
                  </span>
                  <span aria-hidden="true" className="letter-corner -bottom-4 -right-3 text-skyLove-pink sm:-bottom-6 sm:-right-5" style={{ animationDelay: "1.6s" }}>
                    <Heart size={24} fill="currentColor" />
                  </span>
                  <span aria-hidden="true" className="letter-corner -right-4 top-1/3 hidden text-rose-200 sm:block" style={{ animationDelay: "0.9s" }}>
                    <Heart size={16} fill="currentColor" />
                  </span>
                  <span aria-hidden="true" className="letter-corner -left-4 top-2/3 hidden text-rose-200 sm:block" style={{ animationDelay: "1.9s" }}>
                    <Heart size={16} fill="currentColor" />
                  </span>

                  <article
                    id="love-letter-message"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Love letter"
                    tabIndex={0}
                    data-lenis-prevent
                    className="letter-card relative max-h-[calc(100dvh-2rem)] w-full overscroll-contain overflow-y-auto touch-pan-y rounded-[2rem] bg-white p-7 text-left outline-none sm:max-h-[calc(100dvh-2.5rem)] sm:p-12"
                  >
                    <span className="letter-shimmer pointer-events-none absolute inset-0 rounded-[2rem]" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={toggleLetter}
                      aria-label="Close love letter"
                      className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-skyLove-dark transition hover:rotate-90 hover:bg-sky-200 hover:shadow-[0_0_18px_rgba(125,211,252,0.9)]"
                    >
                      <X size={22} />
                    </button>

                    <motion.div
                      animate={shouldReduceMotion ? undefined : { scale: [1, 1.13, 1] }}
                      transition={{ duration: 1.1, delay: 0.35, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
                      className="relative z-10 mb-6 inline-block origin-center"
                    >
                      <Heart size={30} fill="currentColor" className="text-skyLove-pink" />
                    </motion.div>
                    <h3 className="font-heading text-3xl font-semibold text-skyLove-dark sm:text-4xl">
                      My Dearest Baby Cutie,
                    </h3>

                    <div className="mt-6 space-y-4 text-base leading-8 text-sky-900 sm:text-lg">
                      {messageLines.map((line, index) => (
                        <motion.p
                          key={`${index}-${line.slice(0, 12)}`}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.38,
                            delay: shouldReduceMotion ? 0 : 0.2 + index * 0.16,
                          }}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>

                    <div className="mt-10 text-right">
                      <p className="font-heading text-xl font-medium text-skyLove-dark">Forever yours,</p>
                      <p className="mt-2 font-heading text-2xl font-semibold text-skyLove-pink">{myName}</p>
                    </div>
                  </article>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </SectionFlow>
  );
}
