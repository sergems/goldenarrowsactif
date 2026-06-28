import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, RotateCcw, Lightbulb } from "lucide-react";

const WORDS = [
  "ARROWS","GOLDEN","DURBAN","ABAFANA","PENALTY","STRIKER","KEEPER","OFFSIDE",
  "TACKLE","DRIBBLE","HEADER","VOLLEY","CORNER","FREEKICK","CAPTAIN","JERSEY",
  "STADIUM","TROPHY","LEAGUE","ASSIST","MIDFIELD","DEFENDER","FORWARD",
];

type Dir = [number, number];
const DIRS: Dir[] = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
const SIZE = 14;

interface PlacedWord { word: string; cells: [number,number][]; }

function buildGrid(): { grid: string[][], placed: PlacedWord[] } {
  const grid: string[][] = Array(SIZE).fill(null).map(() => Array(SIZE).fill(""));
  const placed: PlacedWord[] = [];
  const pool = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 12);

  for (const word of pool) {
    let attempts = 0;
    while (attempts < 80) {
      attempts++;
      const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      const cells: [number,number][] = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dir[0] * i, nc = c + dir[1] * i;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) { ok = false; break; }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== word[i]) { ok = false; break; }
        cells.push([nr, nc]);
      }
      if (ok) {
        cells.forEach(([nr, nc], i) => { grid[nr][nc] = word[i]; });
        placed.push({ word, cells });
        break;
      }
    }
  }

  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === "") grid[r][c] = ALPHA[Math.floor(Math.random() * 26)];

  return { grid, placed };
}

export default function WordSearch() {
  const [{ grid, placed }, setPuzzle] = useState(buildGrid);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<[number,number][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState<[number,number] | null>(null);
  const [hints, setHints] = useState(3);
  const [hintWord, setHintWord] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!running || won) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running, won]);

  function newPuzzle() {
    setPuzzle(buildGrid());
    setFound(new Set());
    setSelecting([]);
    setStart(null);
    setIsDragging(false);
    setHints(3);
    setHintWord(null);
    setTime(0);
    setRunning(false);
    setWon(false);
  }

  function getCellsInLine(a: [number,number], b: [number,number]): [number,number][] {
    const dr = Math.sign(b[0] - a[0]);
    const dc = Math.sign(b[1] - a[1]);
    if (dr === 0 && dc === 0) return [a];
    const cells: [number,number][] = [];
    let r = a[0], c = a[1];
    while (true) {
      cells.push([r, c]);
      if (r === b[0] && c === b[1]) break;
      r += dr; c += dc;
      if (cells.length > SIZE * 2) break;
    }
    return cells;
  }

  function handleCellDown(r: number, c: number) {
    if (!running) setRunning(true);
    setIsDragging(true);
    setStart([r, c]);
    setSelecting([[r, c]]);
    setHintWord(null);
  }

  function handleCellEnter(r: number, c: number) {
    if (!isDragging || !start) return;
    setSelecting(getCellsInLine(start, [r, c]));
  }

  function handleMouseUp() {
    if (!isDragging) return;
    setIsDragging(false);
    checkSelection();
    setStart(null);
  }

  function checkSelection() {
    const word = selecting.map(([r, c]) => grid[r][c]).join("");
    const revWord = [...word].reverse().join("");
    for (const p of placed) {
      if ((p.word === word || p.word === revWord) && !found.has(p.word)) {
        const next = new Set(found);
        next.add(p.word);
        setFound(next);
        if (next.size === placed.length) {
          setWon(true);
          setRunning(false);
          const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
          ach["word-search"] = true;
          localStorage.setItem("achievements", JSON.stringify(ach));
        }
        setSelecting([]);
        return;
      }
    }
    setSelecting([]);
  }

  function useHint() {
    if (hints <= 0) return;
    const unfound = placed.filter(p => !found.has(p.word));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    setHintWord(pick.word);
    setHints(h => h - 1);
  }

  function isCellSelected(r: number, c: number) {
    return selecting.some(([sr, sc]) => sr === r && sc === c);
  }
  function isCellFound(r: number, c: number) {
    for (const p of placed) {
      if (found.has(p.word) && p.cells.some(([pr, pc]) => pr === r && pc === c)) return true;
    }
    return false;
  }
  function isCellHinted(r: number, c: number) {
    if (!hintWord) return false;
    const p = placed.find(w => w.word === hintWord);
    return p ? p.cells.some(([pr, pc]) => pr === r && pc === c) : false;
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono text-white font-bold">{String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</span>
        </div>
        <div className="flex gap-2">
          <motion.button onClick={useHint} disabled={hints <= 0}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 text-xs font-bold border rounded-lg px-3 py-1.5 transition-colors ${
              hints > 0 ? "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10" : "border-white/10 text-white/20 cursor-not-allowed"
            }`}>
            <Lightbulb className="h-3.5 w-3.5" /> Hint ({hints})
          </motion.button>
          <motion.button onClick={newPuzzle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-xs border border-white/10 text-white/40 rounded-lg px-3 py-1.5 hover:border-white/25 transition-colors">
            <RotateCcw className="h-3 w-3" /> New
          </motion.button>
        </div>
      </div>

      {/* Win */}
      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/15 border border-primary/30 rounded-2xl p-4 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-display text-xl text-primary uppercase">All words found!</h3>
            <p className="text-white/50 text-sm mt-1">{String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word list */}
      <div className="flex flex-wrap gap-1.5">
        {placed.map(p => (
          <span key={p.word} className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-all ${
            found.has(p.word) ? "border-green-500/40 bg-green-500/10 text-green-400 line-through" :
            hintWord === p.word ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 animate-pulse" :
            "border-white/10 text-white/40"
          }`}>
            {p.word}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        className="select-none overflow-auto"
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {grid.map((row, r) => row.map((letter, c) => {
            const selected = isCellSelected(r, c);
            const foundCell = isCellFound(r, c);
            const hinted = isCellHinted(r, c);
            return (
              <motion.div
                key={`${r}-${c}`}
                onMouseDown={() => handleCellDown(r, c)}
                onMouseEnter={() => handleCellEnter(r, c)}
                onTouchStart={() => handleCellDown(r, c)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const el = document.elementFromPoint(touch.clientX, touch.clientY);
                  const data = el?.getAttribute("data-rc");
                  if (data) { const [tr, tc] = data.split(",").map(Number); handleCellEnter(tr, tc); }
                }}
                data-rc={`${r},${c}`}
                animate={selected ? { scale: 1.15 } : { scale: 1 }}
                className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[9px] sm:text-[11px] font-black rounded cursor-pointer transition-colors select-none ${
                  foundCell ? "bg-green-500/25 text-green-400" :
                  hinted ? "bg-yellow-400/25 text-yellow-400" :
                  selected ? "bg-primary text-black" :
                  "text-white/70 hover:bg-white/5"
                }`}
              >
                {letter}
              </motion.div>
            );
          }))}
        </div>
      </div>

      <p className="text-center text-white/30 text-xs">{found.size}/{placed.length} words found</p>
    </div>
  );
}
