
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ImagePlus } from "lucide-react";
import { supabase, STORAGE_BUCKET } from "../lib/supabase";
import type { Memory } from "../types";
import Lightbox from "./Lightbox";
import BookBinding from "./BookBinding";
import PageLeaf from "./PageLeaf";
import SectionFlow from "./SectionFlow";

export default function Gallery() {
  const quotes = [
    "I love you for every moment, every memory, and every dream we share.",
    "You make ordinary days feel like my favorite memories.",
    "With you, every little moment becomes something beautiful.",
    "I would choose you in every lifetime and every story.",
    "Thank you for being my favorite person and my safest place.",
  ];
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [bookIndex, setBookIndex] = useState(0);
  const [bookDirection, setBookDirection] = useState<1 | -1>(1);
  const [turnTarget, setTurnTarget] = useState<number | null>(null);
  const isFlipping = turnTarget !== null;

  const shouldReduceMotion = useReducedMotion();

  const loadMemories = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("memories")
      .select("*")
      .order("memory_date", { ascending: false });

    // Also support photos uploaded directly to the `memories` Storage bucket,
    // including buckets where only some files have matching table rows.
    const imageFiles: Array<{ path: string; name: string; createdAt: string }> = [];
    const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;
    const listFolder = async (folder = ""): Promise<void> => {
      const { data: objects, error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(folder, { limit: 1000, sortBy: { column: "name", order: "asc" } });

      if (storageError) throw storageError;

      for (const object of objects ?? []) {
        if (object.name === ".emptyFolderPlaceholder") continue;
        const path = folder ? `${folder}/${object.name}` : object.name;
        if (object.id === null && !object.metadata) {
          await listFolder(path);
        } else if (imageExtensions.test(object.name)) {
          imageFiles.push({
            path,
            name: object.name,
            createdAt: object.created_at ?? new Date().toISOString(),
          });
        }
      }
    };

    try {
      await listFolder();
      const storageMemories = await Promise.all(
        imageFiles.map(async ({ path, name, createdAt }) => {
          const { data: signed, error: urlError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(path, 60 * 60);
          if (urlError || !signed) return null;

          return {
            id: path,
            image_path: path,
            image_url: signed.signedUrl,
            caption: name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
            memory_date: createdAt.slice(0, 10),
            created_at: createdAt,
          } as Memory & { image_url: string };
        })
      );

      const availableMemories = storageMemories
        .filter((memory): memory is Memory & { image_url: string } => memory !== null)
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
      const storagePaths = new Set(availableMemories.map((memory) => memory.image_path));
      const tableMemories = (data ?? []).filter((memory) => !storagePaths.has(memory.image_path));
      setMemories(
        [...availableMemories, ...tableMemories].sort((a, b) =>
          b.created_at.localeCompare(a.created_at)
        )
      );
      setError(null);
    } catch {
      if (!fetchError && data?.length) {
        setMemories(data);
        setError(null);
      } else {
        setError("We couldn't load your memories. Check the memories bucket access policy and try again.");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadMemories(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadMemories]);

  const retryLoading = () => {
    setLoading(true);
    setError(null);
    void loadMemories();
  };

  const getImageUrl = useCallback((path: string) => {
    const savedMemory = memories.find((memory) => memory.image_path === path) as
      | (Memory & { image_url?: string })
      | undefined;
    if (savedMemory?.image_url) return savedMemory.image_url;

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }, [memories]);

  return (
    <SectionFlow
      id="memories"
      className="relative px-5 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-sky-700 sm:text-base">
            A Life with you
          </p>

          <h2 className="font-heading text-4xl font-semibold text-skyLove-dark sm:text-6xl">
            Our Beautiful Memories
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-sky-900">
            Every picture 
          </p>

          <Heart
            className="mx-auto mt-5 text-skyLove-pink"
            fill="currentColor"
          />
        </motion.div>

        {loading && (
          <p className="py-12 text-center text-sky-800">
            Loading our beautiful memories...
          </p>
        )}

        {error && (
          <div className="py-12 text-center">
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={retryLoading}
              className="mt-4 rounded-full bg-skyLove-dark px-6 py-2 text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && memories.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-sky-300 bg-white/60 px-5 py-16 text-center">
            <ImagePlus
              size={45}
              className="mx-auto mb-4 text-sky-500"
            />

            <h3 className="font-heading text-2xl font-semibold text-skyLove-dark">
              Our memories will go here
            </h3>

            <p className="mt-3 text-sky-700">
              Upload photos to the public.memories table or directly to the memories Storage bucket.
            </p>
          </div>
        )}

        {!loading && !error && memories.length > 0 && (() => {
          const baseRightIndex = bookIndex < memories.length - 1 ? bookIndex + 1 : Math.max(0, bookIndex - 1);
          const targetIndex = turnTarget ?? baseRightIndex;
          const quote = quotes[bookIndex % quotes.length];
          const collage = Array.from({ length: Math.min(3, memories.length) }, (_, offset) => memories[(bookIndex + offset) % memories.length]);
          const moveBook = (step: number) => {
            if (isFlipping) return;
            const nextIndex = bookIndex + (step > 0 ? 3 : -3);
            if (nextIndex < 0 || nextIndex >= memories.length) return;
            setBookDirection(step > 0 ? 1 : -1);
            setTurnTarget(nextIndex);
          };

          return (
            <div className="mx-auto max-w-5xl">
              <div className="relative rounded-[1.5rem] bg-[#5b3824] p-3 shadow-[0_24px_50px_rgba(12,74,110,0.25)] sm:p-5">
                <BookBinding variant="spiral" />
                <div className="relative flex min-h-[360px] overflow-hidden rounded-xl bg-[#f8f0df] shadow-inner sm:min-h-[480px]" style={{ perspective: 2000 }}>
                    <div className="relative flex w-1/2 items-center justify-center bg-[#eee2c9] p-3 shadow-[inset_-12px_0_20px_rgba(80,60,30,0.14)] sm:p-8">
                      <span className="pointer-events-none absolute left-7 top-5 z-10 h-5 w-20 -rotate-6 bg-skyLove-softPink/70 shadow-sm" />
                      <span className="pointer-events-none absolute bottom-5 right-7 z-10 h-5 w-20 rotate-6 bg-sky-200/80 shadow-sm" />
                      <div className="grid w-full grid-cols-2 gap-2">
                        {collage.map((memory, index) => (
                          <button key={memory.id} type="button" onClick={() => setSelectedIndex((bookIndex + index) % memories.length)} aria-label={`Open memory ${bookIndex + index + 1}`} className={`overflow-hidden rounded-lg shadow-lg ${index === 0 ? "row-span-2" : ""}`}>
                            <img src={getImageUrl(memory.image_path)} alt={memory.caption} className={`h-40 w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-52 ${index === 0 ? "h-[328px] sm:h-[428px]" : ""}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative flex w-1/2 items-center justify-center overflow-hidden bg-[#fffaf0] p-3 shadow-[inset_12px_0_20px_rgba(80,60,30,0.08)] sm:p-8">
                      <span className="absolute left-8 top-8 rotate-[-12deg] text-3xl text-skyLove-pink/70">♥</span>
                      <span className="absolute right-10 top-12 rotate-12 text-xl text-sky-300">✦</span>
                      <span className="absolute bottom-10 left-12 -rotate-12 text-lg text-skyLove-softPink">✦</span>
                      <div className="relative flex max-w-sm flex-col items-center rounded-[2rem] border-2 border-dashed border-skyLove-softPink/70 bg-white/65 px-6 py-7 text-center shadow-[0_12px_24px_rgba(12,74,110,0.08)] sm:px-10 sm:py-10">
                        <motion.div
                          animate={shouldReduceMotion ? undefined : { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                          className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-skyLove-pink/15 shadow-[0_0_0_10px_rgba(251,113,133,0.07),0_12px_25px_rgba(251,113,133,0.2)] sm:h-28 sm:w-28"
                        >
                          <Heart size={70} fill="currentColor" strokeWidth={1.5} className="text-skyLove-pink drop-shadow-[0_5px_5px_rgba(190,50,80,0.22)]" />
                        </motion.div>
                        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.28em] text-sky-500">A little note for you</p>
                        <p className="font-heading text-xl font-medium leading-relaxed text-skyLove-dark sm:text-3xl">“{quote}”</p>
                        <span className="mt-5 block text-2xl text-skyLove-pink">♡</span>
                      </div>
                    </div>
                    {isFlipping && bookDirection > 0 && (
                      <PageLeaf
                        direction="next"
                        front={<div className="flex h-full items-center justify-center bg-[#eee2c9] p-5 text-center"><p className="font-heading text-xl leading-relaxed text-skyLove-dark">“{quote}”</p></div>}
                        back={<div className="flex h-full items-center justify-center bg-[#eee2c9] p-5 text-center"><p className="font-heading text-xl leading-relaxed text-skyLove-dark">“{quotes[targetIndex % quotes.length]}”</p></div>}
                        onComplete={() => { setBookIndex(targetIndex); setTurnTarget(null); }}
                      />
                    )}
                    {isFlipping && bookDirection < 0 && (
                      <PageLeaf
                        direction="prev"
                        front={<div className="flex h-full items-center justify-center bg-[#eee2c9] p-5"><div className="grid grid-cols-2 gap-2">{collage.map((memory) => <img key={memory.id} src={getImageUrl(memory.image_path)} alt="" className="h-32 w-24 rounded object-cover" />)}</div></div>}
                        back={<div className="flex h-full items-center justify-center bg-[#eee2c9] p-5 text-center"><p className="font-heading text-xl leading-relaxed text-skyLove-dark">“{quotes[targetIndex % quotes.length]}”</p></div>}
                        onComplete={() => { setBookIndex(targetIndex); setTurnTarget(null); }}
                      />
                    )}
                </div>
              </div>
              {memories.length > 1 && (
                <div className="mt-5 flex justify-center gap-4">
                  <button type="button" disabled={isFlipping || bookIndex < 3} onClick={() => moveBook(-1)} aria-label="Previous three memories" className="rounded-full bg-white/80 p-3 text-skyLove-dark shadow-romantic hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={24} /></button>
                  <button type="button" disabled={isFlipping || bookIndex + 3 >= memories.length} onClick={() => moveBook(1)} aria-label="Next three memories" className="rounded-full bg-white/80 p-3 text-skyLove-dark shadow-romantic hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={24} /></button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <Lightbox
        memories={memories}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
        getImageUrl={getImageUrl}
      />
    </SectionFlow>
  );
}
