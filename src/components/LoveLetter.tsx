import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Mail, X } from "lucide-react";
import SectionFlow from "./SectionFlow";

interface LoveLetterProps {
  myName: string;
  message: string;
}

const heartBurst = [
  { x: -100, y: -95, rotate: -28 },
  { x: -55, y: -130, rotate: 22 },
  { x: 0, y: -150, rotate: -12 },
  { x: 58, y: -125, rotate: 18 },
  { x: 105, y: -85, rotate: -24 },
  { x: -115, y: -30, rotate: 12 },
  { x: 115, y: -25, rotate: -18 },
];

export default function LoveLetter({ myName, message }: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const messageLines = message.split(/\n+/).filter((line) => line.trim());

  useEffect(() => {
    if (!isOpen) {
      setShowLetter(false);
      return;
    }

    const timer = window.setTimeout(
      () => setShowLetter(true),
      shouldReduceMotion ? 0 : 650
    );
    return () => window.clearTimeout(timer);
  }, [isOpen, shouldReduceMotion]);

  useEffect(() => {
    if (!isOpen || !showLetter) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowLetter(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, showLetter]);

  const toggleLetter = () => {
    if (isOpen) {
      setShowLetter(false);
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  };

  return (
    <SectionFlow
      id="letter"
      className="relative px-5 py-24 text-center sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-sky-700 sm:text-base">
          Something from my heart
        </p>
        <h2 className="font-heading text-4xl font-semibold text-skyLove-dark sm:text-6xl">
          A Letter For You
        </h2>
        <p className="mt-5 text-sky-800">
          There&apos;s something I&apos;ve been wanting to tell you.
        </p>

        <div className="relative mx-auto mt-10 flex min-h-[310px] w-full max-w-lg items-center justify-center">
          <motion.div
            aria-hidden="true"
            className="absolute h-48 w-72 rounded-full bg-sky-200/60 blur-3xl"
            animate={
              shouldReduceMotion || isOpen
                ? undefined
                : { opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.05, 0.92] }
            }
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.button
            type="button"
            onClick={toggleLetter}
            aria-expanded={isOpen}
            aria-controls="love-letter-message"
            aria-label={isOpen ? "Close love letter" : "Open love letter"}
            style={{ perspective: 900 }}
            animate={
              shouldReduceMotion || isOpen ? undefined : { y: [0, -7, 0] }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 block h-[245px] w-[360px] max-w-[90vw] overflow-visible rounded-3xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
          >
            <span className="absolute inset-0 rounded-3xl bg-sky-200 shadow-romantic" />

            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-30 h-[145px] rounded-t-3xl bg-skyLove-pink"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
              initial={false}
              animate={{ rotateX: isOpen ? 180 : 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.62,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <span className="absolute inset-x-0 top-[72px] z-20 h-[173px] rounded-b-3xl bg-skyLove-softPink" />

            <motion.span
              aria-hidden="true"
              className="absolute left-[5%] top-[8%] z-10 flex h-[84%] w-[90%] items-center justify-center rounded-2xl bg-white"
              animate={{ y: isOpen ? -34 : 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: isOpen && !shouldReduceMotion ? 0.14 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Heart size={36} fill="currentColor" className="text-skyLove-pink" />
            </motion.span>

            <span className="absolute bottom-5 left-0 right-0 z-40 flex justify-center text-white">
              <Mail size={26} />
            </span>
          </motion.button>
        </div>

        <p className="mt-4 text-sm font-bold text-sky-700">
          {isOpen ? "A little message from me" : "Tap to open your letter"}
        </p>
      </div>

      {showLetter && createPortal(
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-sky-950/35 p-5 backdrop-blur-sm"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
            onClick={toggleLetter}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {heartBurst.map((heart, index) => (
                <motion.span
                  key={`${heart.x}-${heart.y}`}
                  className="absolute text-skyLove-pink"
                  initial={{ x: 0, y: 20, opacity: 0, scale: 0.3, rotate: 0 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : {
                          x: heart.x,
                          y: heart.y,
                          opacity: [0, 1, 0],
                          scale: [0.3, 1, 0.6],
                          rotate: heart.rotate,
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.9,
                    delay: shouldReduceMotion ? 0 : index * 0.025,
                    ease: "easeOut",
                  }}
                >
                  <Heart size={index % 2 === 0 ? 18 : 14} fill="currentColor" />
                </motion.span>
              ))}
            </div>

            <motion.article
              id="love-letter-message"
              role="dialog"
              aria-modal="true"
              aria-label="Love letter"
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
              className="relative z-10 my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/80 bg-white p-7 text-left shadow-2xl sm:p-12"
            >
              <button
                type="button"
                onClick={toggleLetter}
                aria-label="Close love letter"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-skyLove-dark transition hover:bg-sky-200"
              >
                <X size={22} />
              </button>

              <Heart size={30} fill="currentColor" className="mb-6 text-skyLove-pink" />
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
                <p className="font-heading text-xl font-medium text-skyLove-dark">
                  Forever yours,
                </p>
                <p className="mt-2 font-heading text-2xl font-semibold text-skyLove-pink">
                  {myName}
                </p>
              </div>
            </motion.article>
          </motion.div>,
        document.body
      )}
    </SectionFlow>
  );
}
