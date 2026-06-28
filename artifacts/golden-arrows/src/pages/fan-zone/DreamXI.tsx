import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, Download, RotateCcw, Crown, Star } from "lucide-react";

const FORMATIONS: Record<string, number[][]> = {
  "4-4-2":    [[0],[1,2,3,4],[5,6,7,8],[9,10]],
  "4-3-3":    [[0],[1,2,3,4],[5,6,7],[8,9,10]],
  "3-5-2":    [[0],[1,2,3],[4,5,6,7,8],[9,10]],
  "5-3-2":    [[0],[1,2,3,4,5],[6,7,8],[9,10]],
  "4-2-3-1":  [[0],[1,2,3,4],[5,6],[7,8,9],[10]],
};

interface Player {
  name: string;
  captain: boolean;
  viceCaptain: boolean;
}

const DEFAULT_PLAYER: Player = { name: "", captain: false, viceCaptain: false };
const NAMES = ["Sibiya","Gumede","Zulu","Mkhize","Dlamini","Nkosi","Shabalala","Mbatha","Ntuli","Cele","Mthembu","Ngcobo","Khumalo","Hadebe","Sithole"];

function getPositions(formation: string): { x: number; y: number; role: string }[] {
  const form = FORMATIONS[formation];
  const positions: { x: number; y: number; role: string }[] = [];
  const ROLES = ["GK","DEF","DEF","DEF","DEF","DEF","MID","MID","MID","MID","MID","FWD","FWD","FWD","FWD"];
  let idx = 0;

  const layers = form.length;
  form.forEach((row, layerIdx) => {
    const y = 88 - (layerIdx / (layers - 1)) * 72;
    row.forEach((_, colIdx) => {
      const x = row.length === 1 ? 50 : 10 + (colIdx / (row.length - 1)) * 80;
      positions.push({ x, y, role: ROLES[idx] ?? "MID" });
      idx++;
    });
  });

  return positions;
}

export default function DreamXI() {
  const [formation, setFormation] = useState("4-3-3");
  const [players, setPlayers] = useState<Player[]>(Array(11).fill(null).map(() => ({ ...DEFAULT_PLAYER })));
  const [editing, setEditing] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const positions = getPositions(formation);

  function updatePlayer(idx: number, update: Partial<Player>) {
    setPlayers(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...update };
      if (update.captain) {
        next.forEach((p, i) => { if (i !== idx) next[i] = { ...next[i], captain: false }; });
      }
      if (update.viceCaptain) {
        next.forEach((p, i) => { if (i !== idx) next[i] = { ...next[i], viceCaptain: false }; });
      }
      return next;
    });
    setSaved(false);
  }

  function autoFill() {
    const shuffled = [...NAMES].sort(() => Math.random() - 0.5);
    setPlayers(shuffled.slice(0, 11).map((name, i) => ({ name, captain: i === 9, viceCaptain: i === 6 })));
    setSaved(false);
  }

  function resetLineup() {
    setPlayers(Array(11).fill(null).map(() => ({ ...DEFAULT_PLAYER })));
    setSaved(false);
    setEditing(null);
  }

  function saveLineup() {
    const lineup = { formation, players, savedAt: Date.now() };
    localStorage.setItem("dream-xi", JSON.stringify(lineup));
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["dream-xi"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
    setSaved(true);
  }

  const editingPlayer = editing !== null ? players[editing] : null;

  return (
    <div className="space-y-4">
      {/* Formation selector */}
      <div>
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Formation</p>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(FORMATIONS).map(f => (
            <motion.button
              key={f}
              onClick={() => setFormation(f)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                formation === f ? "border-primary bg-primary/15 text-primary" : "border-white/10 bg-white/3 text-white/50 hover:border-white/25"
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pitch */}
      <div
        className="relative rounded-xl overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(180deg, #0a5c2f 0%, #0d6e38 50%, #0a5c2f 100%)",
          paddingBottom: "120%",
        }}
      >
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="none">
          <rect x="5" y="5" width="90" height="110" rx="1" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="5" y1="60" x2="95" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          <circle cx="50" cy="60" r="12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          <circle cx="50" cy="60" r="0.8" fill="rgba(255,255,255,0.2)" />
          {/* Top penalty area */}
          <rect x="22" y="5" width="56" height="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          <rect x="34" y="5" width="32" height="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          {/* Bottom penalty area */}
          <rect x="22" y="95" width="56" height="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          <rect x="34" y="110" width="32" height="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          {/* Goals */}
          <rect x="38" y="2" width="24" height="4" rx="0.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          <rect x="38" y="114" width="24" height="4" rx="0.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          {/* Stripes */}
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x="5" y={5 + i*18.33} width="90" height="18.33" fill={i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent"} />
          ))}
        </svg>

        {/* Players */}
        <div className="absolute inset-0">
          {positions.map((pos, idx) => {
            const player = players[idx];
            const hasName = !!player?.name;
            return (
              <motion.button
                key={`${formation}-${idx}`}
                onClick={() => setEditing(editing === idx ? null : idx)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y + 10}%` }}
              >
                <div className={`relative flex flex-col items-center`}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-lg transition-all ${
                      editing === idx
                        ? "border-primary bg-primary text-black"
                        : hasName
                        ? "border-yellow-400/60 bg-green-800 text-white"
                        : "border-white/20 bg-white/10 text-white/40"
                    }`}
                  >
                    {player?.captain && <Crown className="h-3 w-3 text-yellow-400 absolute -top-2" />}
                    {player?.viceCaptain && <Star className="h-2.5 w-2.5 text-blue-400 absolute -top-1.5 -right-1.5" />}
                    {idx + 1}
                  </div>
                  <div className="mt-0.5 bg-black/70 rounded px-1 py-0.5 text-[8px] font-bold text-white whitespace-nowrap max-w-[60px] truncate text-center">
                    {hasName ? player.name.toUpperCase() : pos.role}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Player editor */}
      {editing !== null && editingPlayer !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-primary/20 rounded-2xl p-4 space-y-3"
        >
          <p className="text-primary text-xs font-bold uppercase tracking-widest">Editing Player {editing + 1} · {positions[editing].role}</p>
          <input
            value={editingPlayer.name}
            onChange={e => updatePlayer(editing, { name: e.target.value })}
            placeholder="Player name..."
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 placeholder-white/20"
          />
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editingPlayer.captain} onChange={e => updatePlayer(editing, { captain: e.target.checked })} className="accent-yellow-400" />
              <span className="text-white/60 text-xs flex items-center gap-1"><Crown className="h-3 w-3 text-yellow-400" />Captain</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editingPlayer.viceCaptain} onChange={e => updatePlayer(editing, { viceCaptain: e.target.checked })} className="accent-blue-400" />
              <span className="text-white/60 text-xs flex items-center gap-1"><Star className="h-3 w-3 text-blue-400" />Vice Captain</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <motion.button
          onClick={autoFill}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-xs font-bold hover:bg-white/10 transition-colors"
        >
          Auto Fill
        </motion.button>
        <motion.button
          onClick={resetLineup}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-xs font-bold hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </motion.button>
        <motion.button
          onClick={saveLineup}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,215,0,0.2)" }} whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all ${
            saved ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-primary text-black"
          }`}
        >
          <Save className="h-3.5 w-3.5" /> {saved ? "Saved!" : "Save XI"}
        </motion.button>
      </div>
    </div>
  );
}
