import { useReducedMotion } from "framer-motion";

export default function Clouds() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div
      className="sky-cloud-layer"
      aria-hidden="true"
    >
      <div className={`cloud cloud-one ${shouldReduceMotion ? "cloud-static-one" : ""}`} />
      <div className={`cloud cloud-two ${shouldReduceMotion ? "cloud-static-two" : ""}`} />
      <div className={`cloud cloud-three ${shouldReduceMotion ? "cloud-static-three" : ""}`} />
      <div className={`cloud cloud-four ${shouldReduceMotion ? "cloud-static-four" : ""}`} />
    </div>
  );
}
