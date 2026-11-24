import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function Clouds() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 3000], [0, -90], { clamp: false });

  return (
    <motion.div
      className="sky-cloud-layer"
      aria-hidden="true"
      style={shouldReduceMotion ? undefined : { y: parallaxY }}
    >
      <div className={`cloud cloud-one ${shouldReduceMotion ? "cloud-static-one" : ""}`} />
      <div className={`cloud cloud-two ${shouldReduceMotion ? "cloud-static-two" : ""}`} />
      <div className={`cloud cloud-three ${shouldReduceMotion ? "cloud-static-three" : ""}`} />
      <div className={`cloud cloud-four ${shouldReduceMotion ? "cloud-static-four" : ""}`} />
    </motion.div>
  );
}
