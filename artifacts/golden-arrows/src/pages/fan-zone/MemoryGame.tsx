import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Clock, Star } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
const DIFF_PAIRS: Record<Difficulty, number> = { easy: 6, medium: 8, hard: 12 };

const EMOJIS = ["⚽","🥅","🏆","🥇","👟","🧤","🎽","🎯","🏟️","🌟","🎉","⚡","🦅","🔥","💛","💚"];

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean; }

function buildDeck(pairs: number): Card[] {
  const pool = EMOJIS.slice(0, pairs);
  const doubled = [...pool, ...pool];
  const shuffled = doubled.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

function getBest(diff: Difficulty): number | null {
  try { const v = localStorage.getItem(`memory-best-${diff}`); return v ? parseInt(v) : null; } catch { return null; }
}

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  function startGame(diff = difficulty) {
    setCards(buildDeck(DIFF_PAIRS[diff]));
    setFlipped([]);
    setMoves(0);
    setTime(0);
    setRunning(false);
    setWon(false);
    setChecking(false);
  }

  useEffect(() => { startGame(); }, [difficulty]);

  function flipCard(id: number) {
    if (checking || won) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flipped.length >= 2) return;

    if (!running) setRunning(true);

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setChecking(true);
      const [a, b] = newFlipped;
      const cardA = cards.find(c => c.id === a)!;
      const cardB = cards.find(c => c.id === b)!;

      if (cardA.emoji === cardB.emoji) {
        setTimeout(() => {
          setCards(prev => {
            const next = prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c);
            if (next.every(c => c.matched)) {
              setRunning(false);
              setWon(true);
              const best = getBest(difficulty);
              if (!best || moves + 1 < best) {
                localStorage.setItem(`memory-best-${difficulty}`, String(moves + 1));
              }
              const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
              ach["memory-game"] = true;
              localStorage.setItem("achievements", JSON.stringify(ach));
            }
            return next;
          });
          setFlipped([]);
          setChecking(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
          setChecking(false);
        }, 1000);
      }
    }
  }

  const cols = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 4;
  const best = getBest(difficulty);

  return (
    <div className="space-y-4">
      {/* Difficulty */}
      <div className="flex gap-2 justify-center">
        {(["easy","medium","hard"] as Difficulty[]).map(d => (
          <motion.button key={d} onClick={() => { setDifficulty(d); }} whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold capitalize transition-all ${
              difficulty === d ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/40 hover:border-white/25"
            }`}>
            {d} ({DIFF_PAIRS[d]*2} cards)
          </motion.button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-white/60 text-sm">
          <Star className="h-3.5 w-3.5 text-primary" />
          <span className="font-bold text-white">{moves}</span> moves
        </div>
        <div className="flex items-center gap-1.5 text-white/60 text-sm">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-bold text-white font-mono">{String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</span>
        </div>
        {best && <div className="text-white/30 text-xs">Best: {best} moves</div>}
        <motion.button onClick={() => startGame()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-xs text-white/50 border border-white/10 rounded-lg px-2.5 py-1 hover:border-white/25 transition-colors">
          <RotateCcw className="h-3 w-3" /> New
        </motion.button>
      </div>

      {/* Win screen */}
      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-900/40 to-primary/10 border border-primary/30 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="font-display text-2xl text-primary uppercase mb-1">You Won!</h3>
            <p className="text-white/60 text-sm">{moves} moves · {String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</p>
            {best && moves <= best && <p className="text-primary text-xs mt-1 font-bold">🎉 New best score!</p>}
            <motion.button onClick={() => startGame()} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="mt-4 bg-primary text-black font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl text-sm">
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card grid */}
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => flipCard(card.id)}
            whileHover={!card.matched && !card.flipped ? { scale: 1.05 } : {}}
            whileTap={!card.matched && !card.flipped ? { scale: 0.95 } : {}}
            animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
            transition={{ duration: 0.35 }}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${
              card.matched ? "border-green-500/50 bg-green-500/10" :
              card.flipped ? "border-primary/50 bg-primary/10" :
              "border-white/10 bg-white/3 hover:border-white/25 cursor-pointer"
            }`}
            style={{ fontSize: difficulty === "hard" ? "1.2rem" : "1.5rem" }}
          >
            {card.flipped || card.matched ? card.emoji : (
              <span className="text-white/20 text-lg font-bold">?</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
