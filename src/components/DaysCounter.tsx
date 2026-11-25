
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import SectionFlow from "./SectionFlow";
import ScrollReveal from "./ScrollReveal";

interface DaysCounterProps {
  anniversaryDate: string;
}

interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTime(dateString: string): TimeTogether | null {
  const parts = dateString.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isInteger(part)) ||
    parts[0] < 1 ||
    parts[1] < 1 ||
    parts[1] > 12 ||
    parts[2] < 1 ||
    parts[2] > 31
  ) {
    return null;
  }

  const [year, month, day] = parts;

  const calendarDate = new Date(Date.UTC(year, month - 1, day));

  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) {
    return null;
  }

  // The relationship date is official in Philippine time, regardless of the
  // timezone of the device viewing the page.
  const anniversary = new Date(`${dateString}T00:00:00+08:00`);

  const difference = Date.now() - anniversary.getTime();

  if (difference < 0) {
    return null;
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function DaysCounter({
  anniversaryDate,
}: DaysCounterProps) {
  const [time, setTime] = useState<TimeTogether | null>(() =>
    calculateTime(anniversaryDate)
  );

  useEffect(() => {
    const update = () => {
      setTime(calculateTime(anniversaryDate));
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, [anniversaryDate]);

  const values = [
    { label: "Days", value: time?.days },
    { label: "Hours", value: time?.hours },
    { label: "Minutes", value: time?.minutes },
    { label: "Seconds", value: time?.seconds },
  ];

  return (
    <SectionFlow className="relative px-5 py-24 text-center">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <Heart
          size={35}
          fill="currentColor"
          className="mx-auto mb-5 text-skyLove-pink"
          />

        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.22em] text-sky-800 sm:text-base">
          Every second is special
        </p>

        <h2 className="font-heading text-4xl font-semibold text-skyLove-dark sm:text-6xl">
          Our Time Together
        </h2>

        </ScrollReveal>

        {time ? (
          <>
            <ScrollReveal delay={0.12}>
              <p className="mt-5 text-sky-800">
              And counting every beautiful moment...
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {values.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl bg-white/70 p-5 shadow-romantic backdrop-blur-md sm:p-7"
                >
                  <p className="font-heading text-4xl font-semibold text-skyLove-pink sm:text-6xl">
                    {item.value}
                  </p>

                  <p className="mt-3 text-sm font-bold uppercase tracking-wider text-sky-800">
                    {item.label}
                  </p>
                </div>
              ))}
            </ScrollReveal>
          </>
        ) : (
          <p className="mt-8 text-sky-800">
            Please enter a valid anniversary date that is not in the future.
          </p>
        )}

        <ScrollReveal delay={0.3}>
          <p className="mt-10 font-romantic text-xl italic text-skyLove-dark">
            Here&apos;s to every moment, and all the moments still to come.
          </p>
        </ScrollReveal>
      </div>
    </SectionFlow>
  );
}
