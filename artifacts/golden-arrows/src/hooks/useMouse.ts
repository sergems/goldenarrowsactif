import { useEffect, useState, useCallback } from "react";

export interface MousePosition {
  x: number;
  y: number;
  normalX: number; // -1 to 1 relative to window center
  normalY: number;
}

export function useMouse(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, normalX: 0, normalY: 0 });

  const handleMove = useCallback((e: MouseEvent) => {
    setPos({
      x: e.clientX,
      y: e.clientY,
      normalX: (e.clientX / window.innerWidth - 0.5) * 2,
      normalY: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove]);

  return pos;
}
