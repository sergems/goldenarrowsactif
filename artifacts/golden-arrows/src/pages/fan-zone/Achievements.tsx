import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  points: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "kit-designer", title: "Kit Creator", description: "Designed your first Golden Arrows kit", emoji: "🎽", color: "#1B5E20", points: 50 },
  { id: "kit-collector", title: "Kit Collector", description: "Saved 5 kits to your collection", emoji: "👗", color: "#2B6CB0", points: 100 },
  { id: "dream-xi", title: "Tactical Genius", description: "Built your first Dream XI lineup", emoji: "📋", color: "#553C9A", points: 75 },
  { id: "penalty-shootout", title: "Penalty Taker", description: "Played the Penalty Shootout game", emoji: "⚽", color: "#744210", points: 50 },
  { id: "perfect-penalty", title: "Perfect Spot", description: "Scored all 5 penalties in a shootout", emoji: "🏆", color: "#B7791F", points: 200 },
  { id: "memory-game", title: "Sharp Memory", description: "Completed the Jersey Memory Game", emoji: "🧠", color: "#276749", points: 75 },
  { id: "word-search", title: "Word Hunter", description: "Found all words in the Word Search", emoji: "🔍", color: "#9B2C2C", points: 75 },
  { id: "wheel-winner", title: "Lucky Spin", description: "Won the Golden prize on Wheel of Fortune", emoji: "🎡", color: "#FFD700", points: 150 },
  { id: "badge-creator", title: "Badge Maker", description: "Created your own fan supporter badge", emoji: "🎖️", color: "#702459", points: 50 },
  { id: "chant-mixer", title: "DJ Arrows", description: "Mixed the stadium chants like a pro", emoji: "🎵", color: "#234E52", points: 50 },
  { id: "boot-designer", title: "Bootroom Boss", description: "Designed a pair of custom football boots", emoji: "👟", color: "#1A365D", points: 50 },
  { id: "crossbar", title: "Crossbar King", description: "Hit the crossbar in the Crossbar Challenge", emoji: "🥅", color: "#2D3748", points: 100 },
  { id: "quiz-master", title: "Quiz Master", description: "Answered 50+ trivia questions correctly", emoji: "🎓", color: "#1B5E20", points: 150 },
  { id: "trivia-streak", title: "On Fire!", description: "Got a 7-day quiz streak", emoji: "🔥", color: "#E53E3E", points: 200 },
  { id: "predictor", title: "Fortune Teller", description: "Made your first match prediction", emoji: "🎯", color: "#553C9A", points: 50 },
  { id: "guess-player", title: "Know Your Squad", description: "Guessed a player correctly", emoji: "👁️", color: "#276749", points: 75 },
];

export default function Achievements() {
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("achievements") || "{}"); } catch { return {}; }
  });

  const unlockedCount = Object.values(unlocked).filter(Boolean).length;
  const totalPoints = ACHIEVEMENTS.filter(a => unlocked[a.id]).reduce((s, a) => s + a.points, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/10 border border-primary/25 rounded-2xl p-4 text-center">
          <div className="font-display text-3xl text-primary">{unlockedCount}/{ACHIEVEMENTS.length}</div>
          <div className="text-white/40 text-xs mt-0.5">Achievements</div>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
          <div className="font-display text-3xl text-white">{totalPoints}</div>
          <div className="text-white/40 text-xs mt-0.5">Badge Points</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/40">
          <span>Progress</span>
          <span>{Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 gap-2">
        {ACHIEVEMENTS.map((ach, i) => {
          const isUnlocked = !!unlocked[ach.id];
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isUnlocked
                  ? "border-white/15 bg-white/5"
                  : "border-white/5 bg-white/2 opacity-50"
              }`}
            >
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={isUnlocked ? { background: `${ach.color}30`, border: `1.5px solid ${ach.color}60` } : { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)" }}
                animate={isUnlocked ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              >
                {isUnlocked ? ach.emoji : <Lock className="h-5 w-5 text-white/20" />}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${isUnlocked ? "text-white" : "text-white/30"}`}>{ach.title}</div>
                <div className="text-white/30 text-[11px] mt-0.5 truncate">{ach.description}</div>
              </div>
              <div className={`text-xs font-bold flex-shrink-0 ${isUnlocked ? "text-primary" : "text-white/15"}`}>
                +{ach.points}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
