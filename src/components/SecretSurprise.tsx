
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import SectionFlow from "./SectionFlow";

interface SecretSurpriseProps {
  message: string;
}

export default function SecretSurprise({
  message,
}: SecretSurpriseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionFlow className="relative px-5 py-20 text-center">
      <p className="mb-5 text-sm text-sky-700">
        Psst... there's something hidden here.
      </p>

      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Discover a secret message"
        className="mx-auto rounded-full p-3 text-skyLove-pink"
      >
        <Heart size={32} fill="currentColor" />
      </motion.button>

      {isOpen && createPortal(
          <motion.div
            className="fixed inset-0 z-[250] flex items-center justify-center bg-sky-950/70 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8 }}
              onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-[2rem] bg-white p-9 text-center shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Secret love message"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close secret message"
                className="absolute right-5 top-5 text-sky-700"
              >
                <X size={22} />
              </button>

              <Heart
                size={45}
                fill="currentColor"
                className="mx-auto mb-6 text-skyLove-pink"
              />

              <h3 className="font-heading text-3xl font-semibold text-skyLove-dark">
                You Found My Secret!
              </h3>

              <p className="mt-6 whitespace-pre-line leading-8 text-sky-900">
                {message}
              </p>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-8 rounded-full bg-skyLove-dark px-7 py-3 font-bold text-white hover:bg-sky-800"
              >
                I love you too!
              </button>
            </motion.div>
          </motion.div>,
        document.body
      )}
    </SectionFlow>
  );
}
