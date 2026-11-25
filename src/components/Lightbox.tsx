import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Memory } from "../types";

interface LightboxProps {
  memories: Memory[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  getImageUrl: (path: string) => string;
}

/* The book flips in the direction you navigate */
const flipVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, rotateY: dir > 0 ? 65 : -65, x: dir > 0 ? 70 : -70, scale: 0.95 }),
  center: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, rotateY: dir > 0 ? -65 : 65, x: dir > 0 ? -70 : 70, scale: 0.95 }),
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const sparkles = [
  { x: "10%", y: "16%", s: 18, d: 0 },
  { x: "88%", y: "22%", s: 22, d: 0.8 },
  { x: "7%", y: "78%", s: 14, d: 1.5 },
  { x: "92%", y: "74%", s: 16, d: 2.1 },
  { x: "50%", y: "6%", s: 12, d: 1.1 },
];

export default function Lightbox({
  memories,
  selectedIndex,
  onClose,
  onNavigate,
  getImageUrl,
}: LightboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const [direction, setDirection] = useState<1 | -1>(1);

  const selectedMemory = selectedIndex !== null ? memories[selectedIndex] : null;

  const go = useCallback(
    (delta: 1 | -1) => {
      if (selectedIndex === null || memories.length < 2) return;
      setDirection(delta);
      onNavigate((selectedIndex + delta + memories.length) % memories.length);
    },
    [memories.length, onNavigate, selectedIndex]
  );

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex, onClose, go]);

  const variants = shouldReduceMotion ? fadeVariants : flipVariants;

  return (
    <AnimatePresence>
      {selectedMemory && selectedIndex !== null && (
        <motion.div
          className="lightbox-backdrop fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Memory photo viewer"
        >
          {/* twinkling sparkles */}
          {!shouldReduceMotion &&
            sparkles.map((sparkle, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="letter-star pointer-events-none"
                style={{ left: sparkle.x, top: sparkle.y, fontSize: sparkle.s, animationDelay: `${sparkle.d}s` }}
              >
                ✦
              </span>
            ))}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/20 p-3 text-white transition hover:rotate-90 hover:bg-white/35 sm:right-6 sm:top-6"
          >
            <X size={24} />
          </button>

          {memories.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
                className="absolute left-2 z-20 rounded-full bg-white/20 p-3 text-white transition hover:scale-110 hover:bg-white/40 sm:left-8"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
                className="absolute right-2 z-20 rounded-full bg-white/20 p-3 text-white transition hover:scale-110 hover:bg-white/40 sm:right-8"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* perspective wrapper so the flip has depth */}
          <div className="w-full max-w-5xl" style={{ perspective: 1800 }} onClick={(event) => event.stopPropagation()}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={selectedMemory.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ touchAction: "pan-y" }}
                onPanEnd={(_, info) => {
                  if (Math.abs(info.offset.x) < 60 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return;
                  go(info.offset.x < 0 ? 1 : -1);
                }}
                className="book-cover relative max-h-[90vh] w-full overflow-y-auto rounded-[1.5rem] p-3 sm:overflow-hidden sm:p-4"
              >
                <div className="book-stack relative flex flex-col overflow-hidden rounded-xl sm:flex-row">
                  {/* LEFT PAGE: the photo */}
                  <div className="book-paper book-page-left relative flex items-center justify-center p-4 sm:w-1/2 sm:p-8">
                    <div className="relative -rotate-1 rounded-md bg-white p-2 pb-8 shadow-[0_14px_30px_rgba(60,40,20,0.3)] sm:p-3 sm:pb-12">
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[2px] bg-pink-200/85 shadow-sm"
                      />
                      <img
                        src={getImageUrl(selectedMemory.image_path)}
                        alt={selectedMemory.caption}
                        className="max-h-[46vh] w-full rounded-sm object-contain sm:max-h-[62vh]"
                      />
                      <Heart
                        size={16}
                        fill="currentColor"
                        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-skyLove-pink sm:bottom-4"
                      />
                    </div>
                  </div>

                  <span
                    className="book-gutter pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-16 -translate-x-1/2 sm:block"
                    aria-hidden="true"
                  />

                  {/* RIGHT PAGE: counter + progress */}
                  <div className="book-paper book-lined book-page-right relative flex flex-col items-center justify-center overflow-hidden px-4 py-5 text-center sm:w-1/2 sm:px-10 sm:py-8">
                    <span className="book-ribbon" aria-hidden="true" />
                    <span className="absolute left-8 top-10 hidden text-3xl text-skyLove-softPink/70 sm:block" aria-hidden="true">✦</span>
                    <span className="absolute bottom-12 right-10 hidden text-2xl text-sky-300 sm:block" aria-hidden="true">♡</span>
                    <span className="absolute bottom-14 left-12 hidden text-2xl text-sky-300 sm:block" aria-hidden="true">✦</span>

                    <motion.div
                      animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-skyLove-pink/15 shadow-[0_0_0_10px_rgba(251,113,133,0.08),0_14px_28px_rgba(251,113,133,0.24)] sm:mb-8 sm:h-44 sm:w-44"
                    >
                      <Heart
                        fill="currentColor"
                        strokeWidth={1.5}
                        className="h-10 w-10 text-skyLove-pink drop-shadow-[0_8px_8px_rgba(190,50,80,0.25)] sm:h-28 sm:w-28"
                      />
                    </motion.div>

                    <div className="rounded-full border-2 border-dashed border-skyLove-softPink/70 bg-white/75 px-6 py-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                        {selectedIndex + 1} of {memories.length}
                      </p>
                    </div>

                    <div className="mt-5 h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-sky-100">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-skyLove-pink"
                        initial={false}
                        animate={{ width: `${((selectedIndex + 1) / memories.length) * 100}%` }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
                      />
                    </div>

                    <p className="mt-4 hidden text-xs font-bold text-amber-900/45 sm:block">← → to turn the page</p>
                    <p className="mt-3 text-xs font-bold text-amber-900/45 sm:hidden">Swipe to turn the page</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
