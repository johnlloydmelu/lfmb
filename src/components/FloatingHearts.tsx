
import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import type { FloatingHeart } from "../types";

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const id = nextId.current++;

      const heart: FloatingHeart = {
        id,
        x: event.clientX,
        y: event.clientY,
        rotation: Math.random() * 40 - 20,
        size: 15 + Math.random() * 15,
      };

      setHearts((previous) => [...previous.slice(-19), heart]);

      window.setTimeout(() => {
        setHearts((previous) =>
          previous.filter((item) => item.id !== id)
        );
      }, 1900);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div aria-hidden="true">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="heart-particle"
          fill="currentColor"
          style={{
            left: heart.x,
            top: heart.y,
            width: heart.size,
            height: heart.size,
            transform: `rotate(${heart.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
