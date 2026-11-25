import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ImagePlus } from "lucide-react";
import { supabase, STORAGE_BUCKET } from "../lib/supabase";
import type { Memory } from "../types";
import Lightbox from "./Lightbox";
import BookBinding from "./BookBinding";
import PageLeaf from "./PageLeaf";
import SectionFlow from "./SectionFlow";
import ScrollReveal from "./ScrollReveal";

const quotes = [
  "I love you for every moment, every memory, and every dream we share.",
  "You make ordinary days feel like my favorite memories.",
  "With you, even the quiet moments feel full of meaning.",
  "I would choose you in every lifetime and every story.",
  "Thank you for being my favorite person and my safest place.",
  "Somehow, you make my whole world feel softer.",
  "My happiest place will always be wherever you are.",
  "You are the sweetest part of every day I get to live.",
  "I hope we keep collecting little moments like this forever.",
  "Loving you feels like coming home after a long day.",
  "You turn simple days into stories I never want to forget.",
  "My heart is happiest when it is making memories with you.",
  "Every version of my future is better with you in it.",
  "You are my favorite hello and the person I never want to say goodbye to.",
  "The best thing about this memory is that I got to share it with you.",
  "I still get butterflies knowing I get to call you mine.",
  "If I could pause time, I would keep moments like this with you.",
  "You make me grateful for the life we are building together.",
  "No matter how much time passes, you will always be my favorite part.",
  "Here is another little proof that loving you is my favorite adventure.",
];

const PHOTOS_PER_SPREAD = 3;
const photoTilts = ["-rotate-2", "rotate-2", "-rotate-1"];
const photoTapes = ["bg-pink-200/85", "bg-sky-200/85", "bg-amber-100/90"];

/* ---------------- LEFT PAGE: photo collage ---------------- */

interface CollagePageProps {
  items: Memory[];
  start: number;
  pageNumber: number;
  getImageUrl: (path: string) => string;
  onOpen: (index: number) => void;
}

function CollagePage({ items, start, pageNumber, getImageUrl, onOpen }: CollagePageProps) {
  const count = items.length;
  const spanClass = (index: number) =>
    count === 1 ? "" : count === 2 ? "row-span-2" : index === 0 ? "row-span-2" : "";

  return (
    <div className="book-paper book-page-left absolute inset-0 flex items-center justify-center p-3 sm:p-7">
      <div
        className={`grid h-[300px] w-full max-w-[26rem] gap-2.5 sm:h-[400px] sm:gap-4 ${
          count === 1 ? "grid-cols-1 grid-rows-1" : "grid-cols-2 grid-rows-2"
        }`}
      >
        {items.map((memory, index) => (
          <button
            key={memory.id}
            type="button"
            onClick={() => onOpen(start + index)}
            aria-label={`Open memory ${start + index + 1}`}
            className={`group relative h-full w-full rounded-md bg-white p-1.5 pb-3 shadow-[0_8px_18px_rgba(60,40,20,0.28)] transition duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.04] sm:p-2 sm:pb-6 ${photoTilts[index % 3]} ${spanClass(index)}`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -top-2 left-1/2 z-10 h-3.5 w-10 -translate-x-1/2 -rotate-3 rounded-[2px] shadow-sm sm:h-4 sm:w-14 ${photoTapes[index % 3]}`}
            />
            <img
              src={getImageUrl(memory.image_path)}
              alt={memory.caption}
              loading="lazy"
              decoding="async"
              className="memory-book-photo h-full w-full rounded-sm object-cover"
            />
            <Heart
              size={12}
              fill="currentColor"
              className="absolute bottom-1.5 left-1/2 hidden -translate-x-1/2 text-skyLove-pink opacity-80 sm:block"
            />
          </button>
        ))}
      </div>
      <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.3em] text-amber-900/40 sm:bottom-3 sm:text-xs">
        — {pageNumber} —
      </span>
    </div>
  );
}

/* ---------------- RIGHT PAGE: little note ---------------- */

function NotePage({ quote, pageNumber }: { quote: string; pageNumber: number }) {
  return (
    <div className="book-paper book-lined book-page-right absolute inset-0 flex items-center justify-center overflow-hidden p-3 sm:p-8">
      <span className="book-ribbon" aria-hidden="true" />
      <span className="absolute left-6 top-5 rotate-[-12deg] text-2xl text-skyLove-pink/70 sm:left-10 sm:top-8 sm:text-3xl" aria-hidden="true">♥</span>
      <span className="absolute bottom-10 right-8 rotate-12 text-lg text-sky-300 sm:text-xl" aria-hidden="true">✦</span>
      <span className="absolute bottom-12 left-8 -rotate-12 text-base text-skyLove-softPink sm:text-lg" aria-hidden="true">✦</span>

      <div className="relative flex max-w-sm flex-col items-center rounded-[1.75rem] border-2 border-dashed border-skyLove-softPink/70 bg-white/75 px-4 py-5 text-center shadow-[0_12px_24px_rgba(12,74,110,0.1)] sm:rounded-[2rem] sm:px-9 sm:py-9">
        <div className="book-heart mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-skyLove-pink/15 shadow-[0_0_0_8px_rgba(251,113,133,0.07),0_10px_22px_rgba(251,113,133,0.22)] sm:mb-5 sm:h-28 sm:w-28">
          <Heart
            fill="currentColor"
            strokeWidth={1.5}
            className="h-8 w-8 text-skyLove-pink drop-shadow-[0_5px_5px_rgba(190,50,80,0.22)] sm:h-[70px] sm:w-[70px]"
          />
        </div>
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-sky-500 sm:mb-4 sm:text-xs">A little note</p>
        <p className="font-heading text-sm font-medium leading-snug text-skyLove-dark sm:text-2xl sm:leading-relaxed">“{quote}”</p>
        <span className="mt-3 block text-xl text-skyLove-pink sm:mt-5 sm:text-2xl">♡</span>
      </div>

      <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.3em] text-amber-900/40 sm:bottom-3 sm:text-xs">
        — {pageNumber} —
      </span>
    </div>
  );
}

/* ---------------- GALLERY ---------------- */

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [bookIndex, setBookIndex] = useState(0);
  const [bookDirection, setBookDirection] = useState<1 | -1>(1);
  const [turnTarget, setTurnTarget] = useState<number | null>(null);
  const isFlipping = turnTarget !== null;

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
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-sky-700 sm:text-base">
            Photograph with my cutie baby
          </p>

          <h2 className="font-heading text-4xl font-semibold text-skyLove-dark sm:text-6xl">
            Our Moment Together
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-sky-900">
            I love you in every pages
          </p>

          <Heart
            className="mx-auto mt-5 text-skyLove-pink"
            fill="currentColor"
          />
        </ScrollReveal>

        {loading && (
          <ScrollReveal className="py-12 text-center text-sky-800">
            Loading our beautiful memories...
          </ScrollReveal>
        )}

        {error && (
          <ScrollReveal className="py-12 text-center">
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={retryLoading}
              className="mt-4 rounded-full bg-skyLove-dark px-6 py-2 text-white"
            >
              Try again
            </button>
          </ScrollReveal>
        )}

        {!loading && !error && memories.length === 0 && (
          <ScrollReveal className="rounded-3xl border-2 border-dashed border-sky-300 bg-white/60 px-5 py-16 text-center">
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
          </ScrollReveal>
        )}

        {!loading && !error && memories.length > 0 && (() => {
          const spreadCount = Math.ceil(memories.length / PHOTOS_PER_SPREAD);
          const lastSpread = spreadCount - 1;
          const spread = Math.min(Math.floor(bookIndex / PHOTOS_PER_SPREAD), lastSpread);
          const base = spread * PHOTOS_PER_SPREAD;
          const target = turnTarget ?? base;

          // While a page turns, the page UNDER the leaf already shows the new content
          const leftStart = isFlipping && bookDirection < 0 ? target : base;
          const rightStart = isFlipping && bookDirection > 0 ? target : base;

          const itemsOf = (start: number) => memories.slice(start, start + PHOTOS_PER_SPREAD);
          const quoteOf = (start: number) => {
            const spreadIndex = Math.floor(start / PHOTOS_PER_SPREAD);
            return quotes[spreadIndex] ?? `Another page, another memory I will always treasure with you — ${spreadIndex + 1}.`;
          };
          const pageNumber = (start: number, side: 0 | 1) => (start / PHOTOS_PER_SPREAD) * 2 + 1 + side;

          const goTo = (nextSpread: number) => {
            if (isFlipping || nextSpread === spread || nextSpread < 0 || nextSpread > lastSpread) return;
            setBookDirection(nextSpread > spread ? 1 : -1);
            setTurnTarget(nextSpread * PHOTOS_PER_SPREAD);
          };

          const finishTurn = () => {
            setBookIndex(target);
            setTurnTarget(null);
          };

          return (
            <ScrollReveal className="mx-auto max-w-5xl" distance={34}>
              <div style={{ perspective: 1800 }}>
                <motion.div
                  className="relative isolate"
                  initial={shouldReduceMotion ? false : { opacity: 0, rotateX: 16, scale: 0.94 }}
                  whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* LEATHER COVER */}
                  <div className="book-cover relative rounded-[1.5rem] p-3 sm:p-5">
                    <span className="book-corner left-0 top-0" aria-hidden="true" />
                    <span className="book-corner right-0 top-0 rotate-90" aria-hidden="true" />
                    <span className="book-corner bottom-0 right-0 rotate-180" aria-hidden="true" />
                    <span className="book-corner bottom-0 left-0 -rotate-90" aria-hidden="true" />

                    <BookBinding variant="spiral" isFlipping={isFlipping} />

                    {/* PAGES (with stacked paper edge) */}
                    <div className="book-stack relative rounded-xl">
                      <motion.div
                        className="book-pages relative flex min-h-[360px] overflow-hidden rounded-xl sm:min-h-[480px]"
                        style={{ perspective: 2200, touchAction: "pan-y" }}
                        onPanEnd={(_, info) => {
                          if (Math.abs(info.offset.x) < 60 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return;
                          goTo(spread + (info.offset.x < 0 ? 1 : -1));
                        }}
                      >
                        <div className="relative w-1/2">
                          <CollagePage
                            items={itemsOf(leftStart)}
                            start={leftStart}
                            pageNumber={pageNumber(leftStart, 0)}
                            getImageUrl={getImageUrl}
                            onOpen={setSelectedIndex}
                          />
                        </div>
                        <div className="relative w-1/2">
                          <NotePage quote={quoteOf(rightStart)} pageNumber={pageNumber(rightStart, 1)} />
                        </div>

                        {/* spine shading */}
                        <span className="book-gutter pointer-events-none absolute inset-y-0 left-1/2 z-30 w-12 -translate-x-1/2 sm:w-16" aria-hidden="true" />

                        {isFlipping && bookDirection > 0 && (
                          <PageLeaf
                            key={`next-${target}`}
                            direction="next"
                            front={<NotePage quote={quoteOf(base)} pageNumber={pageNumber(base, 1)} />}
                            back={
                              <CollagePage
                                items={itemsOf(target)}
                                start={target}
                                pageNumber={pageNumber(target, 0)}
                                getImageUrl={getImageUrl}
                                onOpen={setSelectedIndex}
                              />
                            }
                            onComplete={finishTurn}
                          />
                        )}
                        {isFlipping && bookDirection < 0 && (
                          <PageLeaf
                            key={`prev-${target}`}
                            direction="prev"
                            front={
                              <CollagePage
                                items={itemsOf(base)}
                                start={base}
                                pageNumber={pageNumber(base, 0)}
                                getImageUrl={getImageUrl}
                                onOpen={setSelectedIndex}
                              />
                            }
                            back={<NotePage quote={quoteOf(target)} pageNumber={pageNumber(target, 1)} />}
                            onComplete={finishTurn}
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>
                  <div className="book-floor-shadow" aria-hidden="true" />
                </motion.div>
              </div>

              {/* CONTROLS */}
              {spreadCount > 1 && (
                <div className="mt-9 flex items-center justify-center gap-3 sm:gap-5">
                  <button
                    type="button"
                    disabled={isFlipping || spread === 0}
                    onClick={() => goTo(spread - 1)}
                    aria-label="Previous pages"
                    className="rounded-full bg-white/80 p-3 text-skyLove-dark shadow-romantic transition hover:-translate-y-0.5 hover:bg-white hover:text-skyLove-pink active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/65 px-5 py-2.5 shadow-glass backdrop-blur-md">
                    {spreadCount <= 8 &&
                      Array.from({ length: spreadCount }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={isFlipping}
                          onClick={() => goTo(i)}
                          aria-label={`Go to pages ${i * 2 + 1} and ${i * 2 + 2}`}
                          aria-current={i === spread}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            i === spread ? "w-7 bg-skyLove-pink" : "w-2.5 bg-sky-300 hover:bg-sky-400"
                          }`}
                        />
                      ))}
                    <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">
                      {spread + 1} / {spreadCount}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isFlipping || spread >= lastSpread}
                    onClick={() => goTo(spread + 1)}
                    aria-label="Next pages"
                    className="rounded-full bg-white/80 p-3 text-skyLove-dark shadow-romantic transition hover:-translate-y-0.5 hover:bg-white hover:text-skyLove-pink active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
              {spreadCount > 1 && (
                <p className="mt-3 text-center text-xs font-bold text-sky-700/80 sm:hidden">Swipe the book to turn the page</p>
              )}
            </ScrollReveal>
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
