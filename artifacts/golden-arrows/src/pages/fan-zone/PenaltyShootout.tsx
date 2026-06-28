import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Zap } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type ShotResult = "goal" | "saved" | "miss" | null;
type Zone = "tl" | "tm" | "tr" | "ml" | "mm" | "mr" | "bl" | "bm" | "br";

const ZONE_POSITIONS: Record<Zone, { keeX: number; keeY: number }> = {
  tl: { keeX: 25, keeY: 20 }, tm: { keeX: 50, keeY: 15 }, tr: { keeX: 75, keeY: 20 },
  ml: { keeX: 20, keeY: 50 }, mm: { keeX: 50, keeY: 50 }, mr: { keeX: 80, keeY: 50 },
  bl: { keeX: 25, keeY: 75 }, bm: { keeX: 50, keeY: 78 }, br: { keeX: 75, keeY: 75 },
};

const SAVE_PROB: Record<Difficulty, number> = { easy: 0.2, medium: 0.45, hard: 0.65 };

const ZONES: Zone[] = ["tl","tm","tr","ml","mm","mr","bl","bm","br"];
const LABELS: Record<Zone, string> = {
  tl:"Top Left", tm:"Top Centre", tr:"Top Right",
  ml:"Mid Left", mm:"Centre", mr:"Mid Right",
  bl:"Bot Left", bm:"Bot Centre", br:"Bot Right",
};

function getHighScores(): { name: string; score: number }[] {
  try { return JSON.parse(localStorage.getItem("penalty-scores") || "[]"); } catch { return []; }
}

function saveScore(score: number) {
  const scores = getHighScores();
  scores.push({ name: "You", score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("penalty-scores", JSON.stringify(scores.slice(0, 10)));
}

export default function PenaltyShootout() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<"intro"|"aim"|"result"|"done">("intro");
  const [shotNum, setShotNum] = useState(0);
  const [results, setResults] = useState<ShotResult[]>([]);
  const [lastResult, setLastResult] = useState<ShotResult>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [keeperPos, setKeeperPos] = useState<Zone>("mm");
  const [showConfetti, setShowConfetti] = useState(false);

  const score = results.filter(r => r === "goal").length;

  function startGame() {
    setPhase("aim");
    setShotNum(0);
    setResults([]);
    setLastResult(null);
    setSelectedZone(null);
    setShowConfetti(false);
  }

  function takeShot(zone: Zone) {
    if (phase !== "aim") return;
    setSelectedZone(zone);

    const kZone = ZONES[Math.floor(Math.random() * ZONES.length)] as Zone;
    setKeeperPos(kZone);

    const save = Math.random() < SAVE_PROB[difficulty];
    const saves = save && kZone === zone;
    const result: ShotResult = saves ? "saved" : (Math.random() < 0.05 ? "miss" : "goal");

    setLastResult(result);
    setPhase("result");

    const nextResults = [...results, result];
    setResults(nextResults);

    if (nextResults.length === 5) {
      setTimeout(() => {
        setPhase("done");
        const goals = nextResults.filter(r => r === "goal").length;
        if (goals >= 4) setShowConfetti(true);
        saveScore(goals);
        const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
        ach["penalty-shootout"] = true;
        if (goals === 5) ach["perfect-penalty"] = true;
        localStorage.setItem("achievements", JSON.stringify(ach));
      }, 1800);
    } else {
      setTimeout(() => {
        setPhase("aim");
        setShotNum(n => n + 1);
        setSelectedZone(null);
        setLastResult(null);
      }, 1800);
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-4">
            <div className="text-6xl">⚽</div>
            <h3 className="font-display text-2xl text-white uppercase">Penalty Shootout</h3>
            <p className="text-white/50 text-sm">5 penalties · Choose your spot · Beat the keeper!</p>

            <div>
              <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Difficulty</p>
              <div className="flex gap-2 justify-center">
                {(["easy","medium","hard"] as Difficulty[]).map(d => (
                  <motion.button key={d} onClick={() => setDifficulty(d)} whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold capitalize transition-all ${
                      difficulty === d ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/40 hover:border-white/25"
                    }`}>
                    {d}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button onClick={startGame} whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(255,215,0,0.3)" }} whileTap={{ scale: 0.96 }}
              className="bg-primary text-black font-black uppercase tracking-wider px-10 py-4 rounded-xl text-lg">
              Kick Off!
            </motion.button>

            {getHighScores().length > 0 && (
              <div className="bg-white/3 border border-white/8 rounded-xl p-3">
                <p className="text-white/40 text-xs mb-2">Best Scores</p>
                {getHighScores().slice(0, 5).map((s, i) => (
                  <div key={i} className="flex justify-between text-xs text-white/60 py-0.5">
                    <span>#{i+1} {s.name}</span>
                    <span className="text-primary font-bold">{s.score}/5</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {(phase === "aim" || phase === "result") && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Score dots */}
            <div className="flex gap-2 justify-center mb-4">
              {Array(5).fill(0).map((_, i) => {
                const r = results[i];
                return (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                    r === "goal" ? "border-green-500 bg-green-500/20 text-green-400" :
                    r === "saved" || r === "miss" ? "border-red-500 bg-red-500/20 text-red-400" :
                    i === shotNum ? "border-primary bg-primary/10 text-primary animate-pulse" :
                    "border-white/15 text-white/20"
                  }`}>
                    {r === "goal" ? "⚽" : r === "saved" ? "🧤" : r === "miss" ? "✗" : i + 1}
                  </div>
                );
              })}
            </div>

            {/* Penalty Goal */}
            <div className="relative rounded-xl overflow-hidden mb-4" style={{ background: "linear-gradient(180deg, #1a6b2a 0%, #0d4d1a 100%)", paddingBottom: "65%" }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 65">
                {/* Pitch */}
                <rect x="0" y="40" width="100" height="25" fill="#0d4d1a" />
                <rect x="0" y="0" width="100" height="42" fill="#1a6b2a" />
                {/* Penalty spot */}
                <circle cx="50" cy="55" r="1.5" fill="rgba(255,255,255,0.4)" />
                {/* Goal */}
                <rect x="20" y="5" width="60" height="28" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="1.5" rx="0.5" />
                {/* Net lines */}
                {[0,1,2,3,4].map(i => <line key={i} x1={20+i*15} y1="5" x2={20+i*15} y2="33" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />)}
                {[0,1,2,3,4].map(i => <line key={i} x1="20" y1={5+i*7} x2="80" y2={5+i*7} stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />)}

                {/* Keeper */}
                <motion.g
                  animate={{ x: ZONE_POSITIONS[keeperPos].keeX - 50, y: ZONE_POSITIONS[keeperPos].keeY * 0.35 - 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <ellipse cx="50" cy="25" rx="5" ry="7" fill="#FFD700" />
                  <circle cx="50" cy="17" r="3" fill="#FFDAB9" />
                </motion.g>

                {/* Ball */}
                {phase === "result" && selectedZone && (
                  <motion.circle
                    cx="50" cy="55"
                    animate={{
                      cx: ZONE_POSITIONS[selectedZone].keeX,
                      cy: ZONE_POSITIONS[selectedZone].keeY * 0.35 + 2,
                    }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                    r="2.5" fill="white"
                  />
                )}

                {/* Zone zones indicator */}
                {phase === "aim" && ZONES.map(z => (
                  <rect
                    key={z}
                    x={20 + (["l","m","r"].indexOf(z[z.length-1] === "l" ? "l" : z[z.length-1] === "m" ? "m" : "r")) * 20}
                    y={5 + (z.startsWith("t") ? 0 : z.startsWith("m") ? 9.5 : 18.5)}
                    width="19" height="9"
                    fill="transparent"
                    stroke="rgba(255,215,0,0.2)"
                    strokeWidth="0.3"
                  />
                ))}
              </svg>

              {/* Shot result overlay */}
              <AnimatePresence>
                {phase === "result" && lastResult && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className={`font-display text-4xl uppercase font-black text-center px-6 py-3 rounded-2xl ${
                      lastResult === "goal" ? "bg-green-900/80 text-green-400" :
                      "bg-red-900/80 text-red-400"
                    }`}>
                      {lastResult === "goal" ? "⚽ GOAL!" : lastResult === "saved" ? "🧤 SAVED!" : "😬 MISS!"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Zone picker */}
            {phase === "aim" && (
              <div>
                <p className="text-white/40 text-xs text-center mb-2 uppercase tracking-widest">Choose your spot</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["tl","tm","tr","ml","mm","mr","bl","bm","br"] as Zone[]).map(z => (
                    <motion.button
                      key={z}
                      onClick={() => takeShot(z)}
                      whileHover={{ scale: 1.05, borderColor: "rgba(255,215,0,0.6)" }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-white/10 bg-white/3 rounded-xl py-3 text-white/60 text-xs font-bold hover:bg-white/8 transition-all"
                    >
                      {LABELS[z]}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
            {showConfetti && (
              <div className="text-5xl animate-bounce">🎉</div>
            )}
            <div className="text-6xl font-black font-display" style={{ color: score >= 4 ? "#FFD700" : score >= 3 ? "#90EE90" : "#FF6B6B" }}>
              {score}/5
            </div>
            <h3 className="font-display text-2xl text-white uppercase">
              {score === 5 ? "PERFECT!" : score >= 4 ? "Brilliant!" : score >= 3 ? "Good effort!" : score >= 2 ? "Keep practising!" : "Unlucky!"}
            </h3>
            <div className="flex gap-2 justify-center">
              {results.map((r, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg ${
                  r === "goal" ? "border-green-500 bg-green-500/20" : "border-red-500 bg-red-500/20"
                }`}>
                  {r === "goal" ? "⚽" : "✗"}
                </div>
              ))}
            </div>
            <motion.button onClick={startGame} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 mx-auto bg-primary text-black font-black uppercase tracking-wider px-8 py-3 rounded-xl">
              <RotateCcw className="h-4 w-4" /> Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
