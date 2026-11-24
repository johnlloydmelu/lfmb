
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, CalendarDays } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { TimelineEvent } from "../types";
import SectionFlow from "./SectionFlow";

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error: fetchError } = await supabase
        .from("timeline_events")
        .select("*")
        .order("event_date", { ascending: true });

      if (fetchError) {
        setError(true);
      } else {
        setEvents(data ?? []);
      }

      setLoading(false);
    };

    void loadEvents();
  }, []);

  return (
    <SectionFlow
      id="story"
      className="relative px-5 pb-24 pt-10 sm:px-10 sm:pt-12"
    >
      <div className="mx-auto max-w-4xl">
        {loading && (
          <p className="py-8 text-center text-sky-800">Loading our story...</p>
        )}

        {error && (
          <p className="py-8 text-center text-red-700">
            Unable to load our story right now.
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="py-8 text-center text-sky-800">
            Our story is still waiting for its first chapter.
          </p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="relative">
            <div className="timeline-line absolute bottom-0 left-5 top-0 w-1 rounded-full sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-12">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.6,
                  }}
                  className={`relative flex pl-14 sm:w-1/2 sm:pl-0 ${
                    index % 2 === 0
                      ? "sm:ml-auto sm:justify-start sm:pl-12"
                      : "sm:mr-auto sm:justify-end sm:pr-12"
                  }`}
                >
                  <div className="absolute left-[10px] top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-skyLove-pink shadow sm:left-auto sm:right-auto sm:translate-x-[-50%]">
                    <Heart
                      size={10}
                      fill="currentColor"
                      className="text-white"
                    />
                  </div>

                  <div className="w-full rounded-3xl bg-white/75 p-7 shadow-romantic backdrop-blur-md sm:p-8">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-sky-600">
                      <CalendarDays size={16} />

                      {new Date(
                        `${event.event_date}T00:00:00`
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    <h3 className="font-heading text-2xl font-semibold text-skyLove-dark sm:text-3xl">
                      {event.title}
                    </h3>

                    <p className="mt-3 leading-7 text-sky-800">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionFlow>
  );
}
