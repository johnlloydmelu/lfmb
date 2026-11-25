import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** Called by SmoothScroll so other components can use the same Lenis instance. */
export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

/** Smoothly scrolls to the top (uses Lenis when available, native smooth scroll otherwise). */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, {
      duration: 1.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
