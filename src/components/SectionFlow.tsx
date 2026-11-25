import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface SectionFlowProps extends Omit<HTMLMotionProps<"section">, "ref" | "style"> {
  children: ReactNode;
}

export default function SectionFlow({
  children,
  className,
  ...sectionProps
}: SectionFlowProps) {
  return (
    <motion.section
      {...sectionProps}
      className={`flow-section ${className ?? ""}`.trim()}
    >
      {children}
    </motion.section>
  );
}
