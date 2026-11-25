
import { useEffect, useRef, useState } from "react";
import { Heart, Music, Pause, Play, X } from "lucide-react";

const lyrics = [
  { start: 0, text: "Saram sai saram" },
  { start: 5, text: "Baram sai baram" },
  { start: 10, text: "Gakjaui yeomwoni baraego" },
  { start: 15, text: "Deotchildoeeo" },
  { start: 22, text: "Bari daeul mankeum gudeojimyeon" },
  { start: 28, text: "Biroso nae sesangi doeeojwo" },
  { start: 36, text: "Naui jageun maeumdo" },
  { start: 41, text: "Geu ane jaran naeumdo" },
  { start: 46, text: "Buseojigo gudeojigo" },
  { start: 51, text: "Noganaerigonamyeon" },
  { start: 57, text: "Geujeseoya boineun naui yeongwon" },
  { start: 66, text: "Saram sai sarang" },
  { start: 71, text: "Modu hamkke moyeoseo" },
  { start: 76, text: "Yeongwoneul barago" },
  { start: 81, text: "Mom maeum mudeonaemyeon" },
  { start: 88, text: "Biroso uriui sesangi wanbyeokae" },
  { start: 96, text: "Sarangeuro" },
  { start: 101, text: "Sarangeuro" },
  { start: 109, text: "Naui jageun maeumdo" },
  { start: 114, text: "Geu ane jageun padocheoreom" },
  { start: 120, text: "Buseojigo millyeowaseon" },
  { start: 126, text: "Nege noganaerigo" },
  { start: 132, text: "Geujeseoya boineun naui yeongwon" },
];

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const lyricSplitIndex = Math.ceil(lyrics.length / 2);
  const lyricColumns = [
    lyrics.slice(0, lyricSplitIndex),
    lyrics.slice(lyricSplitIndex),
  ];

  useEffect(() => {
    const audio = audioRef.current;
    const playFromOpening = () => {
      if (!audio) return;
      void audio.play().then(() => setIsPlaying(true)).catch(() => setError(true));
    };

    window.addEventListener("love-letter:open", playFromOpening);
    return () => {
      window.removeEventListener("love-letter:open", playFromOpening);
      audio?.pause();
    };
  }, []);

  useEffect(() => {
    if (!isLyricsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLyricsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isLyricsOpen]);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setError(false);
    } catch {
      setError(true);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/our-song.mp3"
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => void toggleMusic()}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          aria-pressed={isPlaying}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-skyLove-dark text-white shadow-xl transition hover:scale-110 hover:bg-sky-800"
        >
          {isPlaying ? (
            <Pause size={32} />
          ) : (
            <Play size={32} />
          )}
        </button>

        {error && (
          <p className="absolute bottom-16 right-0 w-48 rounded-lg bg-white p-3 text-xs text-red-600 shadow-lg">
            Music could not be played. Check your audio file.
          </p>
        )}

        {!error && (
          <button
            type="button"
            onClick={() => isPlaying && setIsLyricsOpen(true)}
            aria-label="Show lyrics for Love by Wave to Earth"
            className={`absolute bottom-24 right-0 flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-sky-900 shadow-lg transition ${
              isPlaying ? "hover:-translate-y-0.5 hover:bg-rose-50 hover:text-skyLove-dark" : "cursor-default"
            }`}
          >
            <Music size={14} />
            {isPlaying ? "Now Playing Love by Wave to Earth" : "Make sure to play the song before you scroll"}
          </button>
        )}
      </div>

      {isLyricsOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-sky-950/65 p-4 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lyrics-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsLyricsOpen(false);
          }}
        >
          <div className="relative flex max-h-[min(780px,calc(100dvh-2rem))] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-b from-white/95 via-sky-50/95 to-rose-50/95 shadow-[0_24px_90px_rgba(7,50,84,0.45)] sm:max-h-[min(820px,calc(100dvh-3rem))] sm:rounded-[2.5rem]">
            <div className="relative overflow-hidden border-b border-sky-100/80 px-6 pb-5 pt-7 text-center sm:px-10 sm:pt-9">
              <div className="absolute -left-12 -top-16 h-40 w-40 rounded-full bg-sky-200/55 blur-2xl" />
              <div className="absolute -bottom-20 -right-8 h-44 w-44 rounded-full bg-rose-200/55 blur-2xl" />
              <button
                type="button"
                onClick={() => setIsLyricsOpen(false)}
                aria-label="Close lyrics"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100/80 text-skyLove-dark transition hover:rotate-90 hover:bg-rose-100 hover:text-rose-600"
              >
                <X size={20} />
              </button>
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-skyLove-pink/15 text-skyLove-pink shadow-[0_0_0_8px_rgba(251,113,133,0.08)]">
                <Heart size={24} fill="currentColor" />
              </div>
              <p className="relative mt-4 text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-sky-500">Now playing</p>
              <h2 id="lyrics-title" className="relative mt-1 font-heading text-2xl font-semibold text-skyLove-dark sm:text-3xl">love. (사랑으로)</h2>
              <p className="relative mt-1 text-sm font-semibold text-sky-700">Wave to Earth</p>
            </div>

            <div className="flex-1 px-5 py-5 sm:px-10 sm:py-7">
              <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.22em] text-sky-400">Romanized lyrics</p>
              <div className="grid grid-cols-2 gap-x-4 text-center sm:gap-x-8">
                {lyricColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-2 sm:space-y-3">
                    {column.map((lyric) => (
                      <p
                        key={`${lyric.start}-${lyric.text}`}
                        className="font-heading text-sm font-medium leading-snug text-skyLove-dark sm:text-lg"
                      >
                        {lyric.text}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-sky-100/80 bg-white/45 px-6 py-3 text-center text-xs font-semibold text-sky-700/70">
              Love by Wave to Earth ♡
            </div>
          </div>
        </div>
      )}
    </>
  );
}
