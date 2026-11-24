
import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

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
        preload="none"
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
          <div className="absolute bottom-24 right-0 flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-sky-900 shadow-lg">
            <Music size={14} />
            {isPlaying ? "Now Playing Love by Wave to Earth" : "Make sure to play the song before you scroll"}
          </div>
        )}
      </div>
    </>
  );
}
