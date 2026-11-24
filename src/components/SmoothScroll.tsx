import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -96 },
      lerp: 0.085,
    });

    return () => lenis.destroy();
  }, []);

  return children;
}
