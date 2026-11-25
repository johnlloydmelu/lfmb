import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Heart, Menu, X } from "lucide-react";

import Hero from "./components/Hero";
import Clouds from "./components/Clouds";
import FloatingHearts from "./components/FloatingHearts";
import Gallery from "./components/Gallery";
import LoveLetter from "./components/LoveLetter";
import DaysCounter from "./components/DaysCounter";
import MusicToggle from "./components/MusicToggle";
import LoadingScreen from "./components/LoadingScreen";
import ScrollReveal from "./components/ScrollReveal";

const HER_NAME = "Althea Kaye Palentinos";
const MY_NAME = "John Lloyd E. Melu";
const COPYRIGHT_YEAR = new Date().getFullYear();
const ANNIVERSARY_DATE = "2025-11-27";

const HERO_MESSAGE = "You are the most cutiest, prettiest, yummiest person I have ever met.";

const LOVE_LETTER_MESSAGE = `Happy 1st year anniversary baby ko

grabe sobrang bilis ng panahon na para bang kailan lang ni-ra-ragebait lang kita dati HAHAHA. Who would've thought na from those simple interactions, we would end up here, celebrating our first year together yippieeeee

first, I would like to say thank you for being part of my life and for choosing me. Thank you always for understanding me lalo na since this is all new to me. I'm still learning how to be a good partner and me is so lucky to have someone as wonderful as you cutie pie. You've taught me so many things and allowed me to experience a lot of things na hindi ko pa nararanasan before.

And of course, thank you sa mga libre mo palagi baby. Don't worry, just wait for me to bawi. Someday, I'll be the one treating you, spoiling you, and giving you the things you deserve. I may not be able to give you everything right now, but I promise that I'll keep working hard so I can give you more reasons to smile.

You're the best girl, the best girlfriend, and the woman I want to call my future wife. I hope you know how much you mean to me. I'm genuinely grateful that I get to experience life with you.

We've been through a lot of challenges this past year. I know some of them were really difficult and there were moments when things weren't easy for both of us. But what matters most to me is that we chose to stay, understand each other, communicate and find ways to resolve our problems together. We may not always get things right and we might make mistakes along the way but I hope we never stop choosing each other.

Even in the simplest moments, you always find a way to make my days feel special. Sometimes, it's just a simple conversation, a random laugh, a little update about your day or just knowing that you're there. You make ordinary days feel extraordinary and I hope I make you feel the same way.

I know this is only the beginning. Marami pa tayong pagdadaanan, more challenges, misunderstandings, sacrifices and unexpected situations. But I want you to know that I'm willing to face all of those with you. We won't always have perfect days, but I hope we continue to make the choice to understand, support and love one another through every season of life.

I also want you to know that you don't have to be perfect around me. You can be yourself, you can have bad days, you can be emotional and you can tell me whenever something is bothering you. I want to be someone you can run to, someone you can trust and someone who makes you feel safe and loved.

I still have so much to learn and I know I have a lot of things to improve as your boyfriend. I want to keep growing with you. I want to celebrate more anniversaries, create more memories, travel to places we've always wanted to visit, try new things together, achieve our dreams and eventually build the future we've always talked about.

Thank you for making my first year of being in a relationship. If I could go back to the beginning, I would still choose you, even knowing all the challenges we've faced, because every moment with you is worth it.

Happy 1st anniversary again, baby ko! Here's to more years, more memories, more laughter, more adventures and more loveeeee.

I love you so much`;

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Memories", href: "#memories" },
  { label: "Love Letter", href: "#letter" },
];

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hidden, setHidden] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current;
    const delta = current - previous;

    if (current < 120 || delta < -3) {
      setHidden(false);
    } else if (delta > 3) {
      setHidden(true);
      setMenuOpen(false);
    }
  });

  useEffect(() => {
    const sections = navigation
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.35, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.nav
      initial={false}
      animate={{
        y: hidden ? (shouldReduceMotion ? 0 : -120) : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed left-0 right-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-glass backdrop-blur-xl sm:px-6"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between gap-3">
        <a
          href="#home"
          onClick={closeMenu}
          className="relative z-10 flex shrink-0 items-center gap-2 font-heading text-lg font-semibold text-skyLove-dark sm:text-xl"
        >
          <Heart size={20} fill="currentColor" className="text-skyLove-pink" />
          <span>My Baby</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const sectionId = item.href.slice(1);
            const active = activeSection === sectionId;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "text-skyLove-dark" : "text-sky-700 hover:text-skyLove-pink"
                }`}
                aria-current={active ? "location" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="active-navigation-pill"
                    className="absolute inset-0 rounded-full bg-sky-100/90"
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100/80 text-skyLove-dark md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+0.6rem)] flex flex-col gap-1 rounded-[2rem] border border-white/70 bg-white/90 p-3 shadow-glass backdrop-blur-xl md:hidden"
          >
            {navigation.map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-full px-5 py-3 text-sm font-bold ${
                    active ? "bg-sky-100 text-skyLove-dark" : "text-sky-800"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HomePage() {
  const [loading, setLoading] = useState(true);

  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={finishLoading} />}
      </AnimatePresence>

      <div className="sky-page relative isolate min-h-screen overflow-clip">
        <Clouds />
        <FloatingHearts />
        <Navigation />

        <main className="relative z-10">
          <Hero herName={HER_NAME} message={HERO_MESSAGE} isReady={!loading} />
          <Gallery />
          <DaysCounter anniversaryDate={ANNIVERSARY_DATE} />
          <LoveLetter myName={MY_NAME} message={LOVE_LETTER_MESSAGE} />
        </main>

        <ScrollReveal>
          <footer className="relative z-10 overflow-hidden px-5 pb-10 pt-6 text-center text-sky-900">
          <Heart
            size={30}
            fill="currentColor"
            className="mx-auto mb-4 text-skyLove-pink"
          />
          <h2 className="font-heading text-3xl font-semibold text-skyLove-dark sm:text-4xl">
            I will be always choosing you, my cutie and yummy baby. ♡
          </h2>
          <p className="mt-4 text-sm text-sky-800">
            ugh
          </p>
          <p className="mt-8 text-sm text-sky-700">mwa mwa mwa. ♡</p>
          <p className="mt-3 text-xs text-sky-700">
            © {COPYRIGHT_YEAR} {MY_NAME}
          </p>
          </footer>
        </ScrollReveal>

        <MusicToggle />
      </div>
    </>
  );
}

export default function App() {
  return <HomePage />;
}
