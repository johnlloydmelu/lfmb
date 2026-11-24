import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";

interface SectionFlowProps extends Omit<HTMLMotionProps<"section">, "ref" | "style"> {
  children: ReactNode;
}

export default function SectionFlow({
  children,
  className,
  ...sectionProps
}: SectionFlowProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.section
      {...sectionProps}
      ref={sectionRef}
      className={`flow-section ${className ?? ""}`.trim()}
      style={shouldReduceMotion ? undefined : { opacity }}
    >
      {children}
    </motion.section>
  );
}
