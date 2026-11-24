
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Memory } from "../types";

interface LightboxProps {
  memories: Memory[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  getImageUrl: (path: string) => string;
}

export default function Lightbox({
  memories,
  selectedIndex,
  onClose,
  onNavigate,
  getImageUrl,
}: LightboxProps) {
  const shouldReduceMotion = useReducedMotion();

  const selectedMemory =
    selectedIndex !== null ? memories[selectedIndex] : null;

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onNavigate((selectedIndex + 1) % memories.length);
      }

      if (event.key === "ArrowLeft") {
        onNavigate(
          (selectedIndex - 1 + memories.length) % memories.length
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex, memories.length, onClose, onNavigate]);

  return (
    <AnimatePresence mode="wait">
      {selectedMemory && selectedIndex !== null && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-sky-950/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Memory photo viewer"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
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
                  onNavigate(
                    (selectedIndex - 1 + memories.length) %
                      memories.length
                  );
                }}
                className="absolute left-3 z-10 rounded-full bg-white/20 p-3 text-white hover:bg-white/40 sm:left-8"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  onNavigate((selectedIndex + 1) % memories.length);
                }}
                className="absolute right-3 z-10 rounded-full bg-white/20 p-3 text-white hover:bg-white/40 sm:right-8"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <motion.div
            key={selectedMemory.id}
            initial={shouldReduceMotion ? false : { opacity: 0, rotateY: 82, x: 30 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: -82, x: -30 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            style={{ perspective: 1800, transformStyle: "preserve-3d" }}
            className="relative flex max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[1.25rem] bg-[#f6eedc] p-3 shadow-2xl sm:p-5"
          >
            <div className="pointer-events-none absolute bottom-3 left-1/2 top-3 z-10 hidden w-px -translate-x-1/2 bg-[#b8a98d]/60 shadow-[0_0_12px_rgba(80,60,30,0.25)] sm:block" />
            <div className="flex w-1/2 items-center justify-center rounded-l-xl bg-[#eee3cc] p-2 shadow-[inset_-8px_0_18px_rgba(80,60,30,0.12)] sm:p-5">
              <img src={getImageUrl(selectedMemory.image_path)} alt={selectedMemory.caption} className="max-h-[68vh] w-full rounded-lg object-contain shadow-lg" />
            </div>
            <div className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden rounded-r-xl bg-[#fbf5e8] px-4 py-8 text-center shadow-[inset_8px_0_18px_rgba(80,60,30,0.08)] sm:px-10">
              <span className="absolute left-8 top-10 text-3xl text-skyLove-softPink/60">✦</span>
              <span className="absolute right-10 top-16 text-2xl text-sky-300">♡</span>
              <span className="absolute bottom-12 left-12 text-2xl text-sky-300">✦</span>
              <motion.div
                animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-skyLove-pink/15 shadow-[0_0_0_14px_rgba(251,113,133,0.08),0_18px_35px_rgba(251,113,133,0.24)] sm:h-48 sm:w-48"
              >
                <Heart size={112} fill="currentColor" strokeWidth={1.5} className="text-skyLove-pink drop-shadow-[0_8px_8px_rgba(190,50,80,0.25)] sm:h-36 sm:w-36" />
              </motion.div>
              <div className="rounded-full border-2 border-dashed border-skyLove-softPink/70 bg-white/65 px-6 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">{selectedIndex + 1} of {memories.length}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
