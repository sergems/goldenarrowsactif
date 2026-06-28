import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Gift } from "lucide-react";

const PRIZES = [
  { label: "Club Fact!", emoji: "📚", color: "#1B5E20", description: "Golden Arrows were founded in 1943 in Lamontville, Durban." },
  { label: "Wallpaper!", emoji: "🖼️", color: "#FFD700", description: "You've unlocked the Golden Arrows desktop wallpaper pack!" },
  { label: "+100 pts", emoji: "⚡", color: "#2B6CB0", description: "Bonus 100 Supporter Points added to your account!" },
  { label: "Trivia!", emoji: "❓", color: "#553C9A", description: "Did you know? Arrows won the DStv Compact Cup in 2022!" },
  { label: "Kit Hint!", emoji: "👟", color: "#744210", description: "Try the 'Lightning' pattern in the Kit Designer — it looks amazing!" },
  { label: "+50 pts", emoji: "🌟", color: "#276749", description: "50 Supporter Points added to your balance!" },
  { label: "Player Card", emoji: "🃏", color: "#9B2C2C", description: "You've unlocked a rare Arrows player collector card!" },
  { label: "Try Again!", emoji: "🔄", color: "#2D3748", description: "Better luck next spin! Come back tomorrow for another try." },
  { label: "Golden!", emoji: "🏆", color: "#B7791F", description: "You've won the Golden Arrow badge! Check your Achievements." },
  { label: "+25 pts", emoji: "💛", color: "#702459", description: "25 Supporter Points — every bit counts!" },
];

const TOTAL = PRIZES.length;
const SLICE_DEG = 360 / TOTAL;

export default function WheelOfFortune() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null);
  const [totalSpins, setTotalSpins] = useState(() => parseInt(localStorage.getItem("wheel-spins") || "0"));
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();

  async function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const prizeIndex = Math.floor(Math.random() * TOTAL);
    const spins = 5 + Math.random() * 3;
    const finalDeg = 360 * spins + (360 - prizeIndex * SLICE_DEG - SLICE_DEG / 2);

    const newRotation = rotation + finalDeg;
    setRotation(newRotation);

    await controls.start({
      rotate: newRotation,
      transition: { duration: 4 + Math.random(), ease: [0.17, 0.67, 0.14, 0.99] },
    });

    setResult(PRIZES[prizeIndex]);
    setSpinning(false);

    const spinsCount = totalSpins + 1;
    setTotalSpins(spinsCount);
    localStorage.setItem("wheel-spins", String(spinsCount));

    // Add points
    if (PRIZES[prizeIndex].label.includes("pts")) {
      const pts = parseInt(PRIZES[prizeIndex].label.replace(/\D/g, "")) || 25;
      const cur = parseInt(localStorage.getItem("supporter-points") || "0");
      localStorage.setItem("supporter-points", String(cur + pts));
    }
    if (PRIZES[prizeIndex].label === "Golden!") {
      const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
      ach["wheel-winner"] = true;
      localStorage.setItem("achievements", JSON.stringify(ach));
    }
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="text-center">
        <h3 className="font-display text-xl text-white uppercase mb-1">Wheel of Fortune</h3>
        <p className="text-white/40 text-xs">Spin to win prizes, points & surprises!</p>
      </div>

      {/* Wheel */}
      <div className="relative w-64 h-64 flex-shrink-0">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-white" />
        </div>

        <motion.div animate={controls} className="w-64 h-64 rounded-full relative overflow-hidden">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {PRIZES.map((prize, i) => {
              const startAngle = (i * SLICE_DEG - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * SLICE_DEG - 90) * (Math.PI / 180);
              const x1 = 100 + 100 * Math.cos(startAngle);
              const y1 = 100 + 100 * Math.sin(startAngle);
              const x2 = 100 + 100 * Math.cos(endAngle);
              const y2 = 100 + 100 * Math.sin(endAngle);
              const midAngle = ((i + 0.5) * SLICE_DEG - 90) * (Math.PI / 180);
              const tx = 100 + 68 * Math.cos(midAngle);
              const ty = 100 + 68 * Math.sin(midAngle);

              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                    fill={prize.color}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="white"
                    fontWeight="bold"
                    transform={`rotate(${(i + 0.5) * SLICE_DEG}, ${tx}, ${ty})`}
                  >
                    {prize.emoji}
                  </text>
                </g>
              );
            })}
            {/* Center hub */}
            <circle cx="100" cy="100" r="14" fill="#FFD700" stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
            <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold" fill="black">GA</text>
          </svg>
        </motion.div>

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/20 pointer-events-none" />
      </div>

      {/* Spin button */}
      <motion.button
        onClick={spin}
        disabled={spinning}
        whileHover={!spinning ? { scale: 1.05, boxShadow: "0 0 30px rgba(255,215,0,0.4)" } : {}}
        whileTap={!spinning ? { scale: 0.95 } : {}}
        className={`px-10 py-4 rounded-2xl font-black uppercase tracking-wider text-lg transition-all ${
          spinning ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-primary text-black"
        }`}
      >
        {spinning ? "Spinning…" : "SPIN!"}
      </motion.button>

      {/* Result */}
      {result && !spinning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full bg-white/5 border border-primary/30 rounded-2xl p-5 text-center"
        >
          <div className="text-5xl mb-2">{result.emoji}</div>
          <h3 className="font-display text-xl text-primary uppercase mb-1">{result.label}</h3>
          <p className="text-white/60 text-sm">{result.description}</p>
        </motion.div>
      )}

      <p className="text-white/20 text-xs">Total spins: {totalSpins}</p>
    </div>
  );
}
