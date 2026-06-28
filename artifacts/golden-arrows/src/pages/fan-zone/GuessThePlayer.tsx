import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListPlayers } from "@workspace/api-client-react";
import { Eye, RotateCcw, Zap } from "lucide-react";

interface Hint { type: string; value: string; }

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function GuessThePlayer() {
  const { data: players } = useListPlayers();
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<typeof players>([]);
  const [current, setCurrent] = useState<typeof players[0] | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [blurLevel, setBlurLevel] = useState(20);
  const ROUNDS = 5;

  useEffect(() => {
    if (players && players.length >= 5) {
      const shuffled = shuffle(players).slice(0, ROUNDS);
      setPool(shuffled);
      setCurrent(shuffled[0]);
      setHintsShown(0);
      setBlurLevel(20);
    }
  }, [players]);

  const hints: Hint[] = current ? [
    { type: "Position", value: current.position || "Unknown" },
    { type: "Nationality", value: current.nationality || "South Africa" },
    { type: "Squad No.", value: current.squadNumber?.toString() || "—" },
    { type: "First letter", value: current.name?.[0] || "?" },
  ] : [];

  function revealHint() {
    if (hintsShown >= hints.length) return;
    setHintsShown(h => h + 1);
    setBlurLevel(b => Math.max(0, b - 5));
  }

  function submitGuess() {
    if (!current || !guess.trim()) return;
    const playerName = current.name.toLowerCase();
    const userGuess = guess.toLowerCase().trim();
    const isCorrect = playerName.includes(userGuess) || userGuess.includes(playerName.split(" ")[0].toLowerCase());

    setGuessResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      const pts = Math.max(10, 100 - hintsShown * 20);
      setScore(s => s + pts);
      const supPts = parseInt(localStorage.getItem("supporter-points") || "0") + pts;
      localStorage.setItem("supporter-points", String(supPts));
      const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
      ach["guess-player"] = true;
      localStorage.setItem("achievements", JSON.stringify(ach));
    }

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= ROUNDS || nextRound >= pool.length) {
        setDone(true);
      } else {
        setRound(nextRound);
        setCurrent(pool[nextRound]);
        setHintsShown(0);
        setBlurLevel(20);
        setGuess("");
        setGuessResult(null);
      }
    }, 2000);
  }

  function restart() {
    if (!players) return;
    const shuffled = shuffle(players).slice(0, ROUNDS);
    setPool(shuffled);
    setCurrent(shuffled[0]);
    setRound(0);
    setHintsShown(0);
    setBlurLevel(20);
    setGuess("");
    setGuessResult(null);
    setScore(0);
    setDone(false);
  }

  if (!players || players.length < 3) {
    return (
      <div className="text-center py-12 text-white/40">
        <div className="text-4xl mb-3">👥</div>
        <p>Loading players from the squad…</p>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
        <div className="text-5xl">🏆</div>
        <h3 className="font-display text-3xl text-primary uppercase">Game Over!</h3>
        <p className="text-white/60">You scored <span className="text-white font-bold">{score}</span> points</p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">You earned</p>
          <div className="flex items-center justify-center gap-2 text-primary font-bold">
            <Zap className="h-5 w-5" />
            <span className="font-display text-2xl">{score}</span>
            <span>Supporter Points</span>
          </div>
        </div>
        <motion.button onClick={restart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 mx-auto bg-primary text-black font-black uppercase tracking-wider px-8 py-3 rounded-xl">
          <RotateCcw className="h-4 w-4" /> Play Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {Array(ROUNDS).fill(0).map((_, i) => (
            <div key={i} className={`w-8 h-1.5 rounded-full transition-all ${
              i < round ? "bg-primary" : i === round ? "bg-primary/50 animate-pulse" : "bg-white/10"
            }`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-primary text-sm font-bold">
          <Zap className="h-3.5 w-3.5" />{score} pts
        </div>
      </div>

      {/* Player image (blurred) */}
      {current && (
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="relative flex items-center justify-center" style={{ minHeight: 220 }}>
            {current.imageUrl ? (
              <img
                src={current.imageUrl}
                alt="Mystery player"
                className="w-full h-56 object-cover object-top transition-all duration-700"
                style={{ filter: `blur(${blurLevel}px) brightness(0.8)` }}
              />
            ) : (
              <div className="w-full h-56 flex items-center justify-center text-8xl"
                style={{ filter: `blur(${blurLevel / 3}px)`, background: "linear-gradient(135deg, #1B5E20, #FFD700)" }}>
                <span>👤</span>
              </div>
            )}

            {/* Blur overlay text */}
            {blurLevel > 10 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-2xl px-4 py-2 text-white/60 text-sm font-bold backdrop-blur-sm">
                  Who is this player?
                </div>
              </div>
            )}

            {/* Result overlay */}
            <AnimatePresence>
              {guessResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className={`font-display text-3xl uppercase font-black px-6 py-3 rounded-2xl ${
                    guessResult === "correct" ? "bg-green-900/90 text-green-400" : "bg-red-900/80 text-red-400"
                  }`}>
                    {guessResult === "correct" ? "✓ CORRECT!" : `✗ ${current.name}`}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Hints */}
      <div className="grid grid-cols-2 gap-2">
        {hints.slice(0, hintsShown).map((hint, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
            <p className="text-white/30 text-[10px] uppercase tracking-widest">{hint.type}</p>
            <p className="text-white font-bold text-sm mt-0.5">{hint.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      {!guessResult && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={guess}
              onChange={e => setGuess(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitGuess()}
              placeholder="Type player name…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 placeholder-white/25"
            />
            <motion.button onClick={submitGuess} disabled={!guess.trim()}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="bg-primary text-black font-bold px-5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed">
              Guess
            </motion.button>
          </div>

          <div className="flex gap-2">
            <motion.button onClick={revealHint} disabled={hintsShown >= hints.length}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-bold transition-all ${
                hintsShown < hints.length
                  ? "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                  : "border-white/10 text-white/20 cursor-not-allowed"
              }`}>
              <Eye className="h-4 w-4" />
              {hintsShown < hints.length ? `Reveal Hint (${hints.length - hintsShown} left)` : "No more hints"}
            </motion.button>
            <motion.button onClick={() => {
              setGuessResult("wrong");
              setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound >= ROUNDS || nextRound >= pool.length) { setDone(true); }
                else { setRound(nextRound); setCurrent(pool[nextRound]); setHintsShown(0); setBlurLevel(20); setGuess(""); setGuessResult(null); }
              }, 1500);
            }} whileTap={{ scale: 0.95 }}
              className="border border-white/10 text-white/30 rounded-xl px-4 text-sm hover:border-white/25 transition-colors">
              Skip
            </motion.button>
          </div>
        </div>
      )}

      <p className="text-center text-white/25 text-xs">
        More hints = fewer points · Max 100 pts per correct guess
      </p>
    </div>
  );
}
