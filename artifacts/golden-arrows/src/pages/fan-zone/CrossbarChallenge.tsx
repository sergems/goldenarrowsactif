import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Wind } from "lucide-react";

type Phase = "idle" | "powering" | "flying" | "result";
type Result = "crossbar" | "post" | "over" | "under" | "wide" | null;

function getBest(): number { try { return parseInt(localStorage.getItem("crossbar-best") || "0"); } catch { return 0; } }

const RESULT_MSG: Record<NonNullable<Result>, string> = {
  crossbar: "🎯 CROSSBAR! Perfect hit!",
  post: "😬 Post! So close!",
  over: "😅 Over the bar!",
  under: "😬 Blazed it! Too low!",
  wide: "😱 Wide! Left the stadium!",
};

const RESULT_SCORE: Record<NonNullable<Result>, number> = {
  crossbar: 100, post: 10, over: 0, under: 0, wide: 0,
};

export default function CrossbarChallenge() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [power, setPower] = useState(0);
  const [wind, setWind] = useState(() => (Math.random() - 0.5) * 80);
  const [result, setResult] = useState<Result>(null);
  const [attempts, setAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 50, y: 85 });
  const [multiplier, setMultiplier] = useState(1);
  const [hits, setHits] = useState(0);
  const powerRef = useRef(0);
  const dirRef = useRef(1);
  const animRef = useRef<number | null>(null);
  const MAX_ATTEMPTS = 5;
  const done = attempts >= MAX_ATTEMPTS;

  function startPower() {
    if (phase !== "idle" || done) return;
    setPhase("powering");
    setPower(0);
    powerRef.current = 0;
    dirRef.current = 1;

    function animatePower() {
      powerRef.current += dirRef.current * 2.5;
      if (powerRef.current >= 100) { powerRef.current = 100; dirRef.current = -1; }
      if (powerRef.current <= 0) { powerRef.current = 0; dirRef.current = 1; }
      setPower(Math.round(powerRef.current));
      animRef.current = requestAnimationFrame(animatePower);
    }
    animRef.current = requestAnimationFrame(animatePower);
  }

  function kick() {
    if (phase !== "powering") return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const finalPower = powerRef.current;
    const windEffect = wind / 100;
    setPhase("flying");

    // Determine result based on power + wind
    const targetPower = 72 + windEffect * 8; // ideal power for crossbar (adjusted for wind)
    const diff = Math.abs(finalPower - targetPower);
    const windMiss = Math.abs(windEffect) > 0.3 && Math.random() < 0.3;

    let res: Result;
    if (windMiss) {
      res = "wide";
    } else if (diff < 6) {
      res = "crossbar";
    } else if (diff < 12) {
      res = Math.random() > 0.4 ? "post" : (finalPower > targetPower ? "over" : "under");
    } else if (finalPower > targetPower + 12) {
      res = "over";
    } else if (finalPower < targetPower - 12) {
      res = "under";
    } else {
      res = Math.random() > 0.5 ? "wide" : "over";
    }

    // Animate ball trajectory
    const endX = 50 + windEffect * 20 + (Math.random() - 0.5) * 10;
    const endY = res === "crossbar" ? 22 : res === "over" ? 8 : res === "under" ? 30 : res === "wide" ? 45 : 25;

    setBallPos({ x: endX, y: endY });

    setTimeout(() => {
      setResult(res);
      setPhase("result");
      setAttempts(a => a + 1);
      const pts = RESULT_SCORE[res!] * multiplier;
      setTotalScore(s => s + pts);
      if (res === "crossbar") {
        setHits(h => h + 1);
        setMultiplier(m => m + 0.5);
        const best = getBest();
        if (totalScore + pts > best) localStorage.setItem("crossbar-best", String(totalScore + pts));
        const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
        ach["crossbar"] = true;
        localStorage.setItem("achievements", JSON.stringify(ach));
      } else {
        setMultiplier(1);
      }
    }, 1000);

    setTimeout(() => {
      if (attempts + 1 < MAX_ATTEMPTS) {
        setBallPos({ x: 50, y: 85 });
        setResult(null);
        setWind((Math.random() - 0.5) * 80);
        setPhase("idle");
      }
    }, 2500);
  }

  function reset() {
    setPhase("idle");
    setPower(0);
    setResult(null);
    setAttempts(0);
    setTotalScore(0);
    setHits(0);
    setMultiplier(1);
    setBallPos({ x: 50, y: 85 });
    setWind((Math.random() - 0.5) * 80);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }

  const windDir = wind > 0 ? "→" : "←";
  const windStrength = Math.abs(Math.round(wind));

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/3 border border-white/8 rounded-xl p-2.5">
          <div className="font-display text-xl text-primary">{attempts}/{MAX_ATTEMPTS}</div>
          <div className="text-white/40 text-[10px]">Kicks</div>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-xl p-2.5">
          <div className="font-display text-xl text-white">{totalScore}</div>
          <div className="text-white/40 text-[10px]">Score</div>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-xl p-2.5">
          <div className="font-display text-xl text-yellow-400">{hits}</div>
          <div className="text-white/40 text-[10px]">Hits</div>
        </div>
      </div>

      {/* Wind indicator */}
      <div className="flex items-center justify-center gap-2 bg-white/3 border border-white/8 rounded-xl px-4 py-2">
        <Wind className="h-4 w-4 text-blue-400" />
        <span className="text-white/60 text-sm">Wind: <span className="text-white font-bold">{windStrength > 5 ? `${windDir} ${windStrength} km/h` : "Calm"}</span></span>
        {multiplier > 1 && <span className="ml-2 text-primary text-sm font-bold">×{multiplier.toFixed(1)} MULTIPLIER!</span>}
      </div>

      {/* Pitch + crossbar */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10"
        style={{ background: "linear-gradient(180deg, #87CEEB 0%, #87CEEB 40%, #1a6b2a 40%, #0d4d1a 100%)", paddingBottom: "70%" }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 70">
          {/* Sky */}
          <rect x="0" y="0" width="100" height="30" fill="#5B9BD5" />
          {/* Grass */}
          <rect x="0" y="30" width="100" height="40" fill="#1a6b2a" />
          {/* Pitch stripes */}
          {[0,1,2,3].map(i => <rect key={i} x={i*25} y="30" width="25" height="40" fill={i%2===0?"rgba(255,255,255,0.03)":"transparent"} />)}

          {/* Goal post */}
          <rect x="25" y="14" width="50" height="2" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
          <rect x="25" y="14" width="1.5" height="16" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
          <rect x="73.5" y="14" width="1.5" height="16" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
          {/* Net */}
          {[0,1,2,3,4].map(i => <line key={i} x1={26+i*12} y1="16" x2={26+i*12} y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />)}
          {[0,1,2].map(i => <line key={i} x1="26" y1={18+i*5} x2="74" y2={18+i*5} stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />)}

          {/* Crossbar target hint */}
          <line x1="25" y1="15" x2="75" y2="15" stroke="rgba(255,215,0,0.4)" strokeWidth="0.8" strokeDasharray="2,2" />

          {/* Penalty spot */}
          <circle cx="50" cy="65" r="1" fill="rgba(255,255,255,0.4)" />

          {/* Ball */}
          <motion.circle
            cx={ballPos.x}
            cy={ballPos.y}
            r="2.5"
            fill="white"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.5"
            animate={{ cx: ballPos.x, cy: ballPos.y }}
            transition={{ duration: 0.8, ease: "easeIn" }}
          />

          {/* Power bar */}
          {phase === "powering" && (
            <>
              <rect x="10" y="55" width="20" height="4" rx="2" fill="rgba(0,0,0,0.4)" />
              <motion.rect x="10" y="55" width={power * 0.2} height="4" rx="2"
                fill={power < 40 ? "#4CAF50" : power < 70 ? "#FFD700" : power < 85 ? "#FF9800" : "#E53E3E"} />
              <text x="20" y="63" textAnchor="middle" fontSize="3" fill="white" opacity="0.8">POWER</text>
            </>
          )}
        </svg>

        {/* Result overlay */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className={`font-display text-xl sm:text-2xl uppercase font-black text-center px-4 py-2 rounded-xl ${
                result === "crossbar" ? "bg-primary/90 text-black" :
                result === "post" ? "bg-yellow-900/90 text-yellow-400" :
                "bg-red-900/80 text-red-300"
              }`}>
                {RESULT_MSG[result]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Power button or done */}
      {done ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <h3 className="font-display text-2xl text-primary">{totalScore} Points!</h3>
          <p className="text-white/60 text-sm">You hit the crossbar {hits} time{hits !== 1 ? "s" : ""}!</p>
          <p className="text-white/30 text-xs">Best: {getBest()} points</p>
          <motion.button onClick={reset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 mx-auto bg-primary text-black font-black uppercase tracking-wider px-8 py-3 rounded-xl">
            <RotateCcw className="h-4 w-4" /> Play Again
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="text-center text-white/50 text-sm">
            {phase === "idle" ? "Hold the button to charge power, release to kick!" :
             phase === "powering" ? "Release to kick!" :
             phase === "flying" ? "Ball in the air…" : ""}
          </div>
          <motion.button
            onMouseDown={startPower}
            onMouseUp={kick}
            onTouchStart={startPower}
            onTouchEnd={kick}
            disabled={phase === "flying" || phase === "result" || done}
            whileHover={{ scale: 1.03 }}
            animate={phase === "powering" ? { scale: [1, 1.02, 1], boxShadow: ["0 0 0 rgba(255,215,0,0)", "0 0 20px rgba(255,215,0,0.4)", "0 0 0 rgba(255,215,0,0)"] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xl transition-all ${
              phase === "powering" ? "bg-primary text-black" :
              phase === "flying" || phase === "result" ? "bg-white/5 text-white/20 cursor-not-allowed" :
              "bg-primary/80 text-black hover:bg-primary"
            }`}
          >
            {phase === "idle" ? "⚽ HOLD TO CHARGE" : phase === "powering" ? `💥 RELEASE! (${power}%)` : phase === "flying" ? "✈️ FLYING…" : "✅ KICKED!"}
          </motion.button>

          {/* Power visual */}
          {phase === "powering" && (
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-none"
                style={{
                  width: `${power}%`,
                  background: power < 40 ? "#4CAF50" : power < 70 ? "#FFD700" : power < 85 ? "#FF9800" : "#E53E3E"
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
