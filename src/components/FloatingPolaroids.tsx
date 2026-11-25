import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase, STORAGE_BUCKET } from "../lib/supabase";

interface HangingPhoto {
  id: string;
  url: string;
}

interface FloatingPolaroidsProps {
  isReady?: boolean;
}

/* Two outer columns (3 per side) so photos never cover the name.
   side = which edge, offset = distance from that edge, top = vertical position */
const slots = [
  { side: "left", offset: "1.2%", top: "14%", tilt: -6, tape: "bg-pink-200/85" },
  { side: "right", offset: "1.2%", top: "16%", tilt: 5, tape: "bg-sky-200/85" },
  { side: "left", offset: "3%", top: "38%", tilt: 4, tape: "bg-sky-200/85" },
  { side: "right", offset: "3%", top: "40%", tilt: -5, tape: "bg-pink-200/85" },
  { side: "left", offset: "1.5%", top: "61%", tilt: -3, tape: "bg-pink-200/85" },
  { side: "right", offset: "2%", top: "60%", tilt: 6, tape: "bg-sky-200/85" },
] as const;

export default function FloatingPolaroids({ isReady = true }: FloatingPolaroidsProps) {
  const [photos, setPhotos] = useState<HangingPhoto[]>([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    const load = async () => {
      const tableResult = await supabase.from("memories").select("id, image_path").limit(6);
      let images = (tableResult.data ?? []).map((memory) => ({ id: memory.id, path: memory.image_path }));

      if (images.length === 0) {
        const storageResult = await supabase.storage.from(STORAGE_BUCKET).list("", { limit: 6 });
        images = (storageResult.data ?? [])
          .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file.name))
          .map((file) => ({ id: file.id ?? file.name, path: file.name }));
      }

      if (!active) return;
      setPhotos(
        images.map((memory) => ({
          id: memory.id,
          url: supabase.storage.from(STORAGE_BUCKET).getPublicUrl(memory.path).data.publicUrl,
        }))
      );
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden xl:block" aria-hidden="true">
      {photos.slice(0, slots.length).map((photo, index) => {
        const slot = slots[index];
        return (
          <motion.div
            key={photo.id}
            className="absolute"
            style={{ [slot.side]: slot.offset, top: slot.top }}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6, y: -40, rotate: slot.tilt - 14 }}
            animate={
              isReady
                ? { opacity: 1, scale: 1, y: 0, rotate: slot.tilt }
                : { opacity: 0, scale: 0.6, y: -40, rotate: slot.tilt - 14 }
            }
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 14,
              delay: shouldReduceMotion ? 0 : 0.5 + index * 0.14,
            }}
          >
            {/* gentle idle float */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { rotate: [0, 2.5, -2, 0], y: [0, -7, 2, 0] }
              }
              transition={{ duration: 6 + index * 0.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
              className="relative w-32 rounded-md bg-white p-2 pb-7 shadow-[0_14px_30px_rgba(12,74,110,0.22)] 2xl:w-44"
            >
              {/* washi tape */}
              <span
                className={`absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-3 rounded-[3px] border border-white/60 shadow-sm ${slot.tape}`}
              />
              <img
                src={photo.url}
                alt=""
                className="h-28 w-full rounded-sm object-cover 2xl:h-40"
              />
              <Heart
                size={14}
                fill="currentColor"
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-skyLove-pink"
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
