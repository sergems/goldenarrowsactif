import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.5 };
  const ringSpring = { stiffness: 80, damping: 18, mass: 0.8 };

  const smoothRingX = useSpring(ringX, ringSpring);
  const smoothRingY = useSpring(ringY, ringSpring);

  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);
  const frameRef = useRef<number>(0);
  const lastPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      lastPos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]") !== null ||
        getComputedStyle(target).cursor === "pointer";
      setIsPointer(isInteractive);

      // spawn trail sparks occasionally
      if (Math.random() > 0.72) {
        const id = ++trailIdRef.current;
        setTrail(t => [...t.slice(-6), { x: e.clientX, y: e.clientY, id }]);
        setTimeout(() => setTrail(t => t.filter(p => p.id !== id)), 500);
      }
    };

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);
    const enter = () => setIsHidden(false);
    const leave = () => setIsHidden(true);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      cancelAnimationFrame(frameRef.current);
    };
  }, [cursorX, cursorY, ringX, ringY]);

  if (typeof window === "undefined") return null;

  return (
    <>
      {/* Trail sparks */}
      {trail.map(p => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none z-[9995] rounded-full"
          style={{ left: p.x - 3, top: p.y - 3, width: 6, height: 6 }}
          initial={{ opacity: 0.8, scale: 1, background: "rgba(252,218,0,0.9)" }}
          animate={{ opacity: 0, scale: 0, y: -14 + Math.random() * -12, x: (Math.random() - 0.5) * 18 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      ))}

      {/* Outer halo ring */}
      <motion.div
        className="fixed pointer-events-none z-[9996] rounded-full border"
        style={{
          x: smoothRingX,
          y: smoothRingY,
          translateX: isPointer ? "-50%" : "-50%",
          translateY: isPointer ? "-50%" : "-50%",
          borderColor: isPointer ? "rgba(252,218,0,0.8)" : "rgba(252,218,0,0.35)",
          background: isPointer ? "rgba(252,218,0,0.08)" : "transparent",
          boxShadow: isPointer ? "0 0 20px rgba(252,218,0,0.3)" : "0 0 10px rgba(252,218,0,0.1)",
        }}
        animate={{
          width: isClicking ? 28 : isPointer ? 48 : 36,
          height: isClicking ? 28 : isPointer ? 48 : 36,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 }, opacity: { duration: 0.15 } }}
      />

      {/* Inner dot — Golden Arrows logo */}
      <motion.div
        className="fixed pointer-events-none z-[9997] flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.65 : isPointer ? 0 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ scale: { duration: 0.15 }, opacity: { duration: 0.15 } }}
      >
        <img
          src={logo}
          alt=""
          className="select-none"
          style={{
            width: 18,
            height: 18,
            filter: "drop-shadow(0 0 4px rgba(252,218,0,0.9)) drop-shadow(0 0 8px rgba(252,218,0,0.5))",
          }}
        />
      </motion.div>

      {/* Click burst */}
      {isClicking && (
        <motion.div
          className="fixed pointer-events-none z-[9994] rounded-full border border-primary"
          style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 10, height: 10, opacity: 0.8 }}
          animate={{ width: 60, height: 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
    </>
  );
}
