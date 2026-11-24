import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase, STORAGE_BUCKET } from "../lib/supabase";

interface HangingPhoto {
  id: string;
  url: string;
  tilt: number;
}

export default function FloatingPolaroids() {
  const [photos, setPhotos] = useState<HangingPhoto[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const positions = [
    "left-[1%] top-[18%]",
    "right-[1%] top-[20%]",
    "left-[5%] bottom-[8%]",
    "right-[5%] bottom-[9%]",
    "left-[10%] top-[40%]",
    "right-[10%] top-[42%]",
  ];

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
      setPhotos(images.map((memory, index) => ({
        id: memory.id,
        url: supabase.storage.from(STORAGE_BUCKET).getPublicUrl(memory.path).data.publicUrl,
        tilt: index % 2 === 0 ? -4 : 4,
      })));
    };
    void load();
    return () => { active = false; };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden lg:block" aria-hidden="true">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          className={`absolute ${positions[index]}`}
          animate={shouldReduceMotion ? undefined : { rotate: [photo.tilt, photo.tilt + 3, photo.tilt - 2, photo.tilt], y: [0, -5, 2, 0] }}
          transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
        >
          <div className="mx-auto h-20 w-px bg-white/90 shadow-sm" />
          <div className="relative w-36 rotate-[-2deg] rounded-md bg-white p-2 pb-5 shadow-[0_12px_25px_rgba(12,74,110,0.22)] xl:w-44">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow" />
            <img src={photo.url} alt="" className="h-32 w-full rounded-sm object-cover xl:h-40" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
