import { useState } from "react";
import { motion } from "framer-motion";
import { User, Edit2, Save } from "lucide-react";

function getStat(key: string, fallback = 0): number {
  try { return parseInt(localStorage.getItem(key) || String(fallback)); } catch { return fallback; }
}

function getAchievementCount(): number {
  try { return Object.values(JSON.parse(localStorage.getItem("achievements") || "{}")).filter(Boolean).length; } catch { return 0; }
}

function getKitCount(): number {
  try { return JSON.parse(localStorage.getItem("kit-collection") || "[]").length; } catch { return 0; }
}

function getPredictionCount(): number {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("predict-")) count++;
  }
  return count;
}

function getQuizStreak(): number {
  // Simple: check last 7 days
  let streak = 0;
  for (let i = 0; i < 7; i++) {
    const day = Math.floor(Date.now() / 86400000) - i;
    if (localStorage.getItem(`quiz-${day}`)) streak++;
    else break;
  }
  return streak;
}

const RANKS = [
  { min: 0, label: "Casual Supporter", badge: "🤍" },
  { min: 100, label: "Regular Fan", badge: "💚" },
  { min: 500, label: "Loyal Arrow", badge: "💛" },
  { min: 1000, label: "Die-Hard Fan", badge: "🏅" },
  { min: 2000, label: "Arrow Legend", badge: "🏆" },
  { min: 5000, label: "Golden Arrow", badge: "👑" },
];

function getRank(points: number) {
  return [...RANKS].reverse().find(r => points >= r.min) || RANKS[0];
}

export default function FanProfile() {
  const [name, setName] = useState(() => localStorage.getItem("fan-name") || "");
  const [editing, setEditing] = useState(!localStorage.getItem("fan-name"));
  const [nameInput, setNameInput] = useState(name);

  const points = getStat("supporter-points");
  const rank = getRank(points);
  const nextRank = RANKS.find(r => r.min > points);

  const stats = [
    { label: "Supporter Points", value: points.toLocaleString(), icon: "⚡", color: "text-primary" },
    { label: "Kits Created", value: getKitCount(), icon: "🎽", color: "text-blue-400" },
    { label: "Achievements", value: getAchievementCount(), icon: "🏆", color: "text-yellow-400" },
    { label: "Predictions Made", value: getPredictionCount(), icon: "🎯", color: "text-purple-400" },
    { label: "Quiz Streak", value: `${getQuizStreak()} days`, icon: "🔥", color: "text-orange-400" },
    { label: "Wheel Spins", value: getStat("wheel-spins"), icon: "🎡", color: "text-green-400" },
  ];

  function saveName() {
    localStorage.setItem("fan-name", nameInput);
    setName(nameInput);
    setEditing(false);
  }

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-primary/15 to-transparent border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-3xl flex-shrink-0">
            {rank.badge}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="Your fan name..."
                  autoFocus
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-primary/50 placeholder-white/30"
                  onKeyDown={e => e.key === "Enter" && saveName()}
                />
                <motion.button onClick={saveName} whileTap={{ scale: 0.95 }}
                  className="bg-primary text-black rounded-lg px-3 py-1.5">
                  <Save className="h-4 w-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl text-white">{name || "Anonymous Fan"}</h3>
                <button onClick={() => { setEditing(true); setNameInput(name); }}
                  className="text-white/30 hover:text-white/60 transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="text-primary font-bold text-sm mt-0.5">{rank.badge} {rank.label}</p>
            <p className="text-white/40 text-xs mt-0.5">{points.toLocaleString()} supporter points</p>
          </div>
        </div>

        {nextRank && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Progress to {nextRank.label}</span>
              <span>{Math.round((points / nextRank.min) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (points / nextRank.min) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-white/25 text-xs mt-1">{(nextRank.min - points).toLocaleString()} points needed</p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white/3 border border-white/8 rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{stat.icon}</span>
              <span className={`font-display text-xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-white/40 text-[11px]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* All Ranks */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
        <h3 className="text-white font-bold text-sm mb-3">Fan Rank Ladder</h3>
        <div className="space-y-2">
          {RANKS.map(r => (
            <div key={r.label} className={`flex items-center gap-3 py-1.5 px-2 rounded-lg transition-all ${
              rank.label === r.label ? "bg-primary/10 border border-primary/20" : ""
            }`}>
              <span className="text-xl w-8">{r.badge}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${rank.label === r.label ? "text-primary" : "text-white/60"}`}>{r.label}</p>
                <p className="text-white/25 text-xs">{r.min.toLocaleString()} points</p>
              </div>
              {rank.label === r.label && <span className="text-primary text-xs font-bold">YOU</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={() => {
            if (confirm("Reset all your Fan Zone data? This cannot be undone.")) {
              ["supporter-points","achievements","kit-collection","fan-name","dream-xi",
               "penalty-scores","memory-best-easy","memory-best-medium","memory-best-hard",
               "wheel-spins","fan-badges","poll-votes","boot-collection"].forEach(k => localStorage.removeItem(k));
              window.location.reload();
            }
          }}
          className="text-red-400/50 text-xs hover:text-red-400 transition-colors"
        >
          Reset all Fan Zone data
        </button>
      </div>
    </div>
  );
}
