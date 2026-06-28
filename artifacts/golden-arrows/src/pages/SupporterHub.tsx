import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useGetNextFixture, useListPlayers } from "@workspace/api-client-react";
import { format } from "date-fns";
import {
  Trophy, Star, Zap, CheckCircle, XCircle, Clock, Users,
  Target, Award, BarChart2, Crown, ChevronLeft, X
} from "lucide-react";

// Feature components
import KitDesigner from "./fan-zone/KitDesigner";
import BootDesigner from "./fan-zone/BootDesigner";
import DreamXI from "./fan-zone/DreamXI";
import PenaltyShootout from "./fan-zone/PenaltyShootout";
import CrossbarChallenge from "./fan-zone/CrossbarChallenge";
import MemoryGame from "./fan-zone/MemoryGame";
import WordSearch from "./fan-zone/WordSearch";
import GuessThePlayer from "./fan-zone/GuessThePlayer";
import WheelOfFortune from "./fan-zone/WheelOfFortune";
import FanBadgeCreator from "./fan-zone/FanBadgeCreator";
import ChantMixer from "./fan-zone/ChantMixer";
import Achievements from "./fan-zone/Achievements";
import FanProfile from "./fan-zone/FanProfile";
import FanOfTheMonth from "./fan-zone/FanOfTheMonth";

// ─── Quiz questions pool ──────────────────────────────────────────────────────

const QUESTIONS = [
  { q: "What year was Lamontville Golden Arrows FC founded?", options: ["1943", "1953", "1963", "1973"], a: 0 },
  { q: "Which city is Lamontville Golden Arrows based in?", options: ["Johannesburg", "Cape Town", "Durban", "Pretoria"], a: 2 },
  { q: "What is the nickname of Golden Arrows?", options: ["The Arrows", "Bafana Bafana", "Abafana Bes'thende", "The Golden Ones"], a: 2 },
  { q: "In which league do Golden Arrows currently compete?", options: ["NFD", "PSL / DStv Premiership", "ABC Motsepe League", "SAB League"], a: 1 },
  { q: "What colour is the primary kit of Golden Arrows?", options: ["Red & White", "Blue & Gold", "Green & Yellow", "Black & Gold"], a: 2 },
  { q: "How many times have Golden Arrows won the NSL Championship?", options: ["1", "2", "3", "4"], a: 1 },
  { q: "Which stadium is used by Golden Arrows as their home ground?", options: ["Moses Mabhida", "Sugar Ray Xulu", "Chatsworth", "King Bhekuzulu"], a: 1 },
  { q: "What is the capacity of Golden Arrows' home stadium?", options: ["5 000", "10 000", "18 000", "25 000"], a: 1 },
  { q: "Which cup competition did Golden Arrows win in 2013?", options: ["Telkom KO", "MTN8", "Nedbank Cup", "Carling Black Label Cup"], a: 2 },
  { q: "What does 'Abafana Bes'thende' mean in English?", options: ["Boys of the Arrows", "Children of the Feet", "Golden Warriors", "Sons of the South"], a: 1 },
  { q: "In which South African province is Lamontville located?", options: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Mpumalanga"], a: 2 },
  { q: "Which tournament did Golden Arrows win in 2021/22?", options: ["MTN8", "Nedbank Cup", "DStv Compact Cup", "Telkom Knockout"], a: 2 },
  { q: "Golden Arrows' club colours are often described as which combination?", options: ["Gold & Green", "Gold & Black", "Green & White", "Yellow & Blue"], a: 0 },
  { q: "Approximately how many seasons have Golden Arrows spent in the PSL top flight?", options: ["10+", "15+", "20+", "25+"], a: 3 },
  { q: "Which of these rivals is considered a major Durban derby opponent?", options: ["Kaizer Chiefs", "AmaZulu FC", "Orlando Pirates", "Mamelodi Sundowns"], a: 1 },
  { q: "PSL stands for?", options: ["Premier Sports League", "Professional Soccer League", "Premier Soccer League", "Provincial Soccer League"], a: 2 },
  { q: "What does the arrow symbol on the club badge represent?", options: ["Speed & Direction", "Military heritage", "The Zulu nation", "Progress forward"], a: 0 },
  { q: "What colour is Golden Arrows' away kit typically?", options: ["White", "Black", "Gold/Yellow", "Red"], a: 2 },
  { q: "How many teams compete in the DStv Premiership?", options: ["14", "16", "18", "20"], a: 1 },
  { q: "What is the maximum number of foreign players allowed in a PSL squad?", options: ["3", "4", "5", "6"], a: 3 },
  { q: "SAFA stands for?", options: ["South African Football Association", "Southern Africa FA", "SA Football Academy", "State Amateur FA"], a: 0 },
];

function getDailyQuestions(): typeof QUESTIONS {
  const day = Math.floor(Date.now() / 86400000);
  const seed = day % (QUESTIONS.length - 5);
  const pool = [...QUESTIONS];
  const picked: typeof QUESTIONS = [];
  let i = seed;
  while (picked.length < 5) { picked.push(pool[i % pool.length]); i += 7; }
  return picked;
}

const POLLS = [
  { id: "poll-motm", question: "Who was Man of the Match in the last game?", options: ["Pule Mmodi", "Nduduzo Sibiya", "Sifiso Ngcobo", "Nkanyiso Mngwengwe"], votes: [142, 89, 67, 118] },
  { id: "poll-formation", question: "What formation should we play next match?", options: ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"], votes: [88, 210, 45, 134] },
  { id: "poll-rating", question: "How would you rate our last performance?", options: ["⭐ Poor", "⭐⭐ Average", "⭐⭐⭐ Good", "⭐⭐⭐⭐ Excellent"], votes: [23, 67, 198, 89] },
];

const LEADERBOARD = [
  { name: "ArrowsFanatic_KZN", points: 2840, badge: "💎", streak: 14 },
  { name: "GoldenBoyz_Durban", points: 2610, badge: "🥇", streak: 9 },
  { name: "Abafana_Forever", points: 2445, badge: "🥇", streak: 7 },
  { name: "GreenGold_SA", points: 2120, badge: "🥈", streak: 5 },
  { name: "SugarRay_Fan", points: 1988, badge: "🥈", streak: 4 },
  { name: "KZN_Arrow", points: 1740, badge: "🥉", streak: 3 },
  { name: "LamontvillePride", points: 1530, badge: "🥉", streak: 2 },
  { name: "YellowGreen7", points: 1290, badge: "⭐", streak: 1 },
];

// ─── Daily Quiz ───────────────────────────────────────────────────────────────
function DailyQuiz() {
  const storageKey = `quiz-${Math.floor(Date.now() / 86400000)}`;
  const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
  const [questions] = useState(getDailyQuestions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [finished, setFinished] = useState(!!stored);
  const [score, setScore] = useState(stored ? parseInt(stored) : 0);
  const [showResult, setShowResult] = useState(false);
  const q = questions[current];
  const isAnswered = selected !== null;

  function pick(i: number) {
    if (isAnswered || finished) return;
    setSelected(i); setShowResult(true);
    const next = [...answers]; next[current] = i; setAnswers(next);
  }

  function advance() {
    if (current < 4) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
    else {
      const finalScore = answers.slice(0, current).filter((a, i) => a === questions[i].a).length + (selected === q.a ? 1 : 0);
      setScore(finalScore); setFinished(true);
      localStorage.setItem(storageKey, String(finalScore));
      const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + finalScore * 20;
      localStorage.setItem("supporter-points", String(pts));
    }
  }

  const correctCount = answers.filter((a, i) => a === questions[i].a).length;

  if (finished) {
    const pct = Math.round((score / 5) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-center py-8">
        <motion.div className="text-6xl mb-4" animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.6, delay: 0.2 }}>
          {score >= 4 ? "🏆" : score >= 3 ? "⭐" : score >= 2 ? "👍" : "📚"}
        </motion.div>
        <h3 className="font-display text-3xl text-primary mb-2" style={{ letterSpacing: "0.04em" }}>{score}/5 Correct</h3>
        <div className="w-full bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} />
        </div>
        <p className="text-white/50 text-sm mb-5">{score === 5 ? "Perfect score! You're a true Arrow!" : score >= 3 ? "Great work, supporter!" : "Keep learning about your club!"}</p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-5 py-2.5 text-primary text-sm font-bold">
          <Zap className="h-4 w-4" />+{score * 20} Supporter Points earned
        </motion.div>
        <p className="text-white/30 text-xs mt-4">Come back tomorrow for new questions!</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <motion.div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < current ? "bg-primary" : i === current ? "bg-primary/60" : "bg-white/10"}`}
            animate={i === current ? { opacity: [0.6, 1, 0.6] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28, ease: "easeOut" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Question {current + 1} of 5</span>
            <span className="text-xs text-primary font-bold">{correctCount} correct</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-white mb-6" style={{ letterSpacing: "0.02em" }}>{q.q}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              let cls = "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30";
              if (showResult && i === q.a) cls = "border-green-500 bg-green-500/20 text-green-400";
              else if (showResult && i === selected && i !== q.a) cls = "border-red-500 bg-red-500/20 text-red-400";
              return (
                <motion.button key={i} onClick={() => pick(i)} disabled={isAnswered}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  whileHover={!isAnswered ? { scale: 1.02, x: 4 } : {}} whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 ${cls}`}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                  {opt}
                  {showResult && i === q.a && <CheckCircle className="h-4 w-4 ml-auto text-green-400 flex-shrink-0" />}
                  {showResult && i === selected && i !== q.a && <XCircle className="h-4 w-4 ml-auto text-red-400 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </div>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-center">
              <motion.button onClick={advance} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                {current < 4 ? "Next Question →" : "Finish Quiz"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Score Predictor ──────────────────────────────────────────────────────────
function ScorePredictor() {
  const { data: fixture } = useGetNextFixture();
  const { data: players } = useListPlayers();
  const storageKey = fixture ? `predict-${fixture.id}` : null;
  const stored = storageKey ? localStorage.getItem(storageKey) : null;
  const existing = stored ? JSON.parse(stored) : null;
  const [home, setHome] = useState(existing?.home ?? 1);
  const [away, setAway] = useState(existing?.away ?? 0);
  const [scorer, setScorer] = useState(existing?.scorer ?? "");
  const [submitted, setSubmitted] = useState(!!existing);

  function submit() {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ home, away, scorer, ts: Date.now() }));
    const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + 50;
    localStorage.setItem("supporter-points", String(pts));
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["predictor"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
    setSubmitted(true);
  }

  if (!fixture) return <div className="text-center text-white/40 py-8">No upcoming fixture found.</div>;

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-center py-6">
        <motion.div className="text-5xl mb-3" animate={{ rotate: [0, -15, 15, -10, 10, 0] }} transition={{ duration: 0.7, delay: 0.15 }}>🎯</motion.div>
        <h3 className="font-display text-2xl text-primary mb-1">Prediction Locked In!</h3>
        <p className="text-white/50 text-sm mb-4">You predicted: <strong className="text-white">{fixture.homeTeam} {home} – {away} {fixture.awayTeam}</strong></p>
        {scorer && <p className="text-white/40 text-sm">First scorer: <span className="text-primary font-bold">{scorer}</span></p>}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-bold mt-4">
          <Zap className="h-4 w-4" />+50 Points for predicting
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{fixture.competition}</p>
        <p className="text-white/60 text-sm">{format(new Date(fixture.date), "EEEE, MMMM d")}</p>
      </div>
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
        <div className="text-center flex-1">
          <div className="font-display text-base sm:text-xl text-white mb-3" style={{ letterSpacing: "0.04em" }}>{fixture.homeTeam}</div>
          <div className="flex items-center justify-center gap-2">
            <motion.button onClick={() => setHome(h => Math.max(0, h - 1))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">−</motion.button>
            <motion.span key={home} initial={{ scale: 1.4, color: "hsl(51 100% 50%)" }} animate={{ scale: 1, color: "hsl(51 100% 50%)" }} transition={{ duration: 0.2 }} className="font-display text-4xl text-primary w-12 text-center inline-block">{home}</motion.span>
            <motion.button onClick={() => setHome(h => Math.min(9, h + 1))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">+</motion.button>
          </div>
        </div>
        <div className="text-white/20 font-display text-3xl flex-shrink-0">–</div>
        <div className="text-center flex-1">
          <div className="font-display text-base sm:text-xl text-white mb-3" style={{ letterSpacing: "0.04em" }}>{fixture.awayTeam}</div>
          <div className="flex items-center justify-center gap-2">
            <motion.button onClick={() => setAway(a => Math.max(0, a - 1))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">−</motion.button>
            <motion.span key={away} initial={{ scale: 1.4, color: "hsl(51 100% 50%)" }} animate={{ scale: 1, color: "hsl(51 100% 50%)" }} transition={{ duration: 0.2 }} className="font-display text-4xl text-primary w-12 text-center inline-block">{away}</motion.span>
            <motion.button onClick={() => setAway(a => Math.min(9, a + 1))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">+</motion.button>
          </div>
        </div>
      </div>
      {players && players.length > 0 && (
        <div className="mb-6">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold block mb-2">First Goal Scorer (optional)</label>
          <select value={scorer} onChange={e => setScorer(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors">
            <option value="">Select a player…</option>
            {players.filter(p => p.position !== "Goalkeeper").map(p => <option key={p.id} value={p.name}>{p.name} ({p.position})</option>)}
          </select>
        </div>
      )}
      <motion.button onClick={submit} whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(255,215,0,0.25)" }} whileTap={{ scale: 0.97 }}
        className="w-full bg-primary text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-primary/90 transition-colors">
        Lock In Prediction 🎯
      </motion.button>
    </div>
  );
}

// ─── Fan Polls ────────────────────────────────────────────────────────────────
function AnimatedBar({ pct, delay = 0 }: { pct: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-2.5 bg-white/8 rounded-full overflow-hidden">
      <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : { width: 0 }} transition={{ duration: 0.8, delay, ease: "easeOut" }} />
    </div>
  );
}

function FanPolls() {
  const [votes, setVotes] = useState<Record<string, number>>(() => { const s = localStorage.getItem("poll-votes"); return s ? JSON.parse(s) : {}; });
  function vote(pollId: string, optIdx: number) {
    if (votes[pollId] !== undefined) return;
    const next = { ...votes, [pollId]: optIdx };
    setVotes(next);
    localStorage.setItem("poll-votes", JSON.stringify(next));
    const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + 10;
    localStorage.setItem("supporter-points", String(pts));
  }
  return (
    <div className="space-y-8">
      {POLLS.map((poll, pollIdx) => {
        const voted = votes[poll.id];
        const total = poll.votes.reduce((a, b) => a + b, 0) + (voted !== undefined ? 1 : 0);
        return (
          <motion.div key={poll.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pollIdx * 0.1 }}>
            <h3 className="font-display text-lg text-white mb-4" style={{ letterSpacing: "0.03em" }}>{poll.question}</h3>
            <div className="space-y-3">
              {poll.options.map((opt, i) => {
                const v = poll.votes[i] + (voted === i ? 1 : 0);
                const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                const isVoted = voted === i;
                const hasVoted = voted !== undefined;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <motion.button onClick={() => vote(poll.id, i)} disabled={hasVoted}
                        whileHover={!hasVoted ? { x: 5 } : {}} whileTap={!hasVoted ? { scale: 0.97 } : {}}
                        className={`text-sm font-medium flex items-center gap-2 transition-colors ${isVoted ? "text-primary font-bold" : hasVoted ? "text-white/50" : "text-white/80 hover:text-white cursor-pointer"}`}>
                        {isVoted && <CheckCircle className="h-3.5 w-3.5" />}{opt}
                      </motion.button>
                      {hasVoted && <span className={`text-xs font-bold ${isVoted ? "text-primary" : "text-white/30"}`}>{pct}%</span>}
                    </div>
                    {hasVoted && <AnimatedBar pct={pct} delay={i * 0.1} />}
                    {!hasVoted && <motion.button onClick={() => vote(poll.id, i)} whileHover={{ scaleX: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }} className="w-full h-2.5 bg-white/5 border border-white/8 rounded-full cursor-pointer transition-colors" />}
                  </div>
                );
              })}
            </div>
            {voted !== undefined && <p className="text-xs text-white/25 mt-2">{total.toLocaleString()} votes total</p>}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
function Leaderboard() {
  const myPoints = parseInt(localStorage.getItem("supporter-points") || "0");
  return (
    <div>
      {myPoints > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center gap-3 bg-primary/15 border border-primary/30 rounded-xl p-3">
          <motion.div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Star className="h-5 w-5 text-primary" />
          </motion.div>
          <div className="flex-1">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Your Points</p>
            <div className="font-display text-2xl text-primary">{myPoints.toLocaleString()}</div>
          </div>
        </motion.div>
      )}
      <div className="space-y-2">
        {LEADERBOARD.map((user, i) => (
          <motion.div key={user.name} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }} whileHover={{ x: 4, transition: { duration: 0.15 } }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-default ${i === 0 ? "bg-primary/10 border-primary/30" : "bg-white/3 border-white/5 hover:border-white/15"}`}>
            <div className={`font-display text-xl w-7 text-center flex-shrink-0 ${i === 0 ? "text-primary" : "text-white/25"}`}>{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm truncate ${i === 0 ? "text-primary" : "text-white"}`}>{user.badge} {user.name}</div>
              <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5"><Zap className="h-2.5 w-2.5" />{user.streak} day streak</div>
            </div>
            <div className={`font-display text-lg font-black flex-shrink-0 ${i === 0 ? "text-primary" : "text-white/70"}`}>{user.points.toLocaleString()}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-white/20 mt-4">Earn points by completing quizzes, predictions & polls</p>
    </div>
  );
}

// ─── Feature definitions ──────────────────────────────────────────────────────

interface Feature {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  tag: string;
  component: React.ComponentType;
}

const FEATURES: Feature[] = [
  { id: "kit", title: "Kit Designer", emoji: "🎽", description: "Design your own Golden Arrows jersey with custom colours & patterns", color: "#1B5E20", tag: "CREATE", component: KitDesigner },
  { id: "boot", title: "Boot Designer", emoji: "👟", description: "Build custom football boots from scratch", color: "#744210", tag: "CREATE", component: BootDesigner },
  { id: "dream-xi", title: "Dream XI Builder", emoji: "📋", description: "Pick your formation & build the perfect squad on the pitch", color: "#2B6CB0", tag: "BUILD", component: DreamXI },
  { id: "penalty", title: "Penalty Shootout", emoji: "⚽", description: "5 penalties — pick your spot and beat the keeper!", color: "#553C9A", tag: "GAME", component: PenaltyShootout },
  { id: "crossbar", title: "Crossbar Challenge", emoji: "🥅", description: "Charge the power meter and try to hit the crossbar", color: "#276749", tag: "GAME", component: CrossbarChallenge },
  { id: "memory", title: "Memory Game", emoji: "🧠", description: "Flip cards and match jersey pairs before time runs out", color: "#9B2C2C", tag: "GAME", component: MemoryGame },
  { id: "wordsearch", title: "Word Search", emoji: "🔍", description: "Find football words hidden in the grid — race the clock!", color: "#B7791F", tag: "PUZZLE", component: WordSearch },
  { id: "guess", title: "Guess The Player", emoji: "👤", description: "Can you identify a blurred Golden Arrows player from hints?", color: "#276749", tag: "QUIZ", component: GuessThePlayer },
  { id: "wheel", title: "Wheel of Fortune", emoji: "🎡", description: "Spin to win points, wallpapers, club facts & more", color: "#FFD700", tag: "SPIN", component: WheelOfFortune },
  { id: "badge", title: "Fan Badge Creator", emoji: "🎖️", description: "Design your own supporter shield badge and download it", color: "#702459", tag: "CREATE", component: FanBadgeCreator },
  { id: "chant", title: "Chant Mixer", emoji: "🎵", description: "Mix crowd chants and drums to create your own match day atmosphere", color: "#234E52", tag: "SOUND", component: ChantMixer },
  { id: "achievements", title: "Achievements", emoji: "🏆", description: "View your unlocked badges and track your fan journey", color: "#B7791F", tag: "PROFILE", component: Achievements },
  { id: "profile", title: "Fan Profile", emoji: "👑", description: "Your fan stats, rank, points and overall progress", color: "#1B5E20", tag: "PROFILE", component: FanProfile },
  { id: "fotm", title: "Fan of the Month", emoji: "🗳️", description: "Nominate & vote for the most dedicated Golden Arrows supporter each month", color: "#B7791F", tag: "VOTE", component: FanOfTheMonth },
];

// ─── Hub Tabs ─────────────────────────────────────────────────────────────────
const HUB_TABS = [
  { id: "quiz", label: "Daily Quiz", icon: Zap, color: "text-yellow-400" },
  { id: "predict", label: "Predict", icon: Target, color: "text-blue-400" },
  { id: "polls", label: "Fan Polls", icon: BarChart2, color: "text-green-400" },
  { id: "leaderboard", label: "Leaderboard", icon: Crown, color: "text-primary" },
];

const TAG_COLORS: Record<string, string> = {
  CREATE: "bg-green-500/15 text-green-400 border-green-500/25",
  BUILD: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  GAME: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  PUZZLE: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  QUIZ: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  SPIN: "bg-primary/15 text-primary border-primary/25",
  SOUND: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  PROFILE: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  VOTE: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SupporterHub() {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [hubTab, setHubTab] = useState("quiz");
  const today = format(new Date(), "EEEE, MMMM d");
  const myPoints = parseInt(typeof window !== "undefined" ? localStorage.getItem("supporter-points") || "0" : "0");

  const achievementCount = (() => {
    try { return Object.values(JSON.parse(localStorage.getItem("achievements") || "{}")).filter(Boolean).length; } catch { return 0; }
  })();

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/8 py-6 sm:py-10"
        style={{ background: "linear-gradient(135deg, hsl(139 55% 12%) 0%, hsl(139 55% 18%) 60%, hsl(51 80% 14%) 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
        <motion.div className="absolute top-4 right-20 text-6xl opacity-[0.05] select-none pointer-events-none" animate={{ y: [0, -10, 0], rotate: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>⚽</motion.div>
        <motion.div className="absolute bottom-3 left-28 text-4xl opacity-[0.05] select-none pointer-events-none" animate={{ y: [0, 8, 0], rotate: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}>⚽</motion.div>

        <div className="max-w-[1330px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-2 flex items-center justify-center gap-2">
              <span className="w-4 h-px bg-primary opacity-80 inline-block" />{today}<span className="w-4 h-px bg-primary opacity-80 inline-block" />
            </p>
            <h1 className="font-display text-4xl sm:text-6xl uppercase font-black mb-2" style={{ letterSpacing: "0.06em" }}>
              Fan <span className="text-primary">Zone</span>
            </h1>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              Your interactive Golden Arrows entertainment hub — design kits, play games, earn achievements & more.
            </p>

            <div className="flex items-center justify-center gap-3 mt-4">
              {myPoints > 0 && (
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center gap-2 bg-primary/15 border border-primary/25 rounded-full px-4 py-1.5 text-primary text-xs font-bold">
                  <Star className="h-3.5 w-3.5" />{myPoints.toLocaleString()} Points
                </motion.div>
              )}
              {achievementCount > 0 && (
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/25 rounded-full px-4 py-1.5 text-yellow-400 text-xs font-bold"
                  onClick={() => setActiveFeature(FEATURES.find(f => f.id === "achievements") || null)}
                  style={{ cursor: "pointer" }}>
                  <Trophy className="h-3.5 w-3.5" />{achievementCount} Achievements
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Feature overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "hsl(140 10% 4%)" }}
          >
            {/* Feature header */}
            <div className="flex-shrink-0 border-b border-white/8 px-4 py-3 flex items-center gap-3"
              style={{ background: `${activeFeature.color}18` }}>
              <motion.button
                onClick={() => setActiveFeature(null)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors border border-white/10 rounded-xl px-3 py-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </motion.button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-2xl">{activeFeature.emoji}</span>
                <div>
                  <h2 className="font-display text-lg text-white uppercase" style={{ letterSpacing: "0.04em" }}>{activeFeature.title}</h2>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[activeFeature.tag]}`}>{activeFeature.tag}</span>
            </div>

            {/* Feature content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 py-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <activeFeature.component />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Features Grid ───────────────────────────────────── */}
      <div className="max-w-[1330px] mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6">
          <h2 className="font-display text-2xl text-white uppercase" style={{ letterSpacing: "0.04em" }}>
            Interactive <span className="text-primary">Features</span>
          </h2>
          <p className="text-white/40 text-sm mt-0.5">{FEATURES.length} activities — tap any card to open</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FEATURES.map((feature, i) => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(feature)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ y: -4, boxShadow: `0 12px 36px ${feature.color}30` }}
              whileTap={{ scale: 0.97 }}
              className="relative text-left p-4 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 transition-all group overflow-hidden"
            >
              {/* Color accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: feature.color }} />

              <div className="flex items-start justify-between mb-3">
                <motion.span
                  className="text-3xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                >
                  {feature.emoji}
                </motion.span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${TAG_COLORS[feature.tag]}`}>
                  {feature.tag}
                </span>
              </div>

              <h3 className="font-display text-base text-white mb-1 group-hover:text-primary transition-colors" style={{ letterSpacing: "0.03em" }}>
                {feature.title}
              </h3>
              <p className="text-white/40 text-xs leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-3 flex items-center gap-1 text-white/20 group-hover:text-primary/60 transition-colors text-xs font-bold">
                Play now →
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Trivia Hub ──────────────────────────────────────── */}
      <div className="border-t border-white/8 bg-white/[0.01]">
        <div className="max-w-[1330px] mx-auto px-4 pt-8 pb-2">
          <h2 className="font-display text-2xl text-white uppercase mb-1" style={{ letterSpacing: "0.04em" }}>
            Trivia <span className="text-primary">Hub</span>
          </h2>
          <p className="text-white/40 text-sm">Daily quizzes, predictions, polls & the leaderboard</p>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-white/8">
          <div className="max-w-[1330px] mx-auto px-4">
            <div className="flex justify-start overflow-x-auto scrollbar-none">
              {HUB_TABS.map((t, idx) => (
                <motion.button key={t.id} onClick={() => setHubTab(t.id)}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-5 sm:px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all duration-200 flex-shrink-0 ${hubTab === t.id ? "border-primary text-primary" : "border-transparent text-white/40 hover:text-white/70"}`}>
                  <motion.span animate={hubTab === t.id ? { rotate: [0, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
                    <t.icon className={`h-4 w-4 transition-colors ${hubTab === t.id ? "text-primary" : t.color}`} />
                  </motion.span>
                  {t.label}
                  {hubTab === t.id && <motion.span layoutId="activeHubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
          <AnimatePresence mode="wait">
            <motion.div key={hubTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.22, ease: "easeOut" }}>
              {hubTab === "quiz" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div><h2 className="font-display text-2xl uppercase text-white">Daily Quiz</h2><p className="text-white/40 text-xs mt-0.5">5 new questions every day</p></div>
                    <div className="flex items-center gap-2 text-xs text-white/30 border border-white/10 rounded-full px-3 py-1.5"><Clock className="h-3 w-3" />Resets midnight</div>
                  </div>
                  <div className="bg-card border border-white/8 rounded-2xl p-5 sm:p-7"><DailyQuiz /></div>
                </div>
              )}
              {hubTab === "predict" && (
                <div>
                  <div className="mb-5"><h2 className="font-display text-2xl uppercase text-white">Score Prediction</h2><p className="text-white/40 text-xs mt-0.5">Predict the next result and earn points</p></div>
                  <div className="bg-card border border-white/8 rounded-2xl p-5 sm:p-7"><ScorePredictor /></div>
                </div>
              )}
              {hubTab === "polls" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div><h2 className="font-display text-2xl uppercase text-white">Fan Polls</h2><p className="text-white/40 text-xs mt-0.5">Your vote earns +10 points</p></div>
                    <div className="flex items-center gap-1.5 text-xs text-primary border border-primary/20 rounded-full px-3 py-1.5 font-bold"><Users className="h-3 w-3" />Weekly</div>
                  </div>
                  <div className="bg-card border border-white/8 rounded-2xl p-5 sm:p-7"><FanPolls /></div>
                </div>
              )}
              {hubTab === "leaderboard" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div><h2 className="font-display text-2xl uppercase text-white">Leaderboard</h2><p className="text-white/40 text-xs mt-0.5">Top supporters this season</p></div>
                    <div className="flex items-center gap-1.5 text-xs text-primary border border-primary/20 rounded-full px-3 py-1.5 font-bold"><Trophy className="h-3 w-3" />Season</div>
                  </div>
                  <Leaderboard />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Points guide */}
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-white/5 rounded-2xl p-5">
            <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary" />How to Earn Points</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Correct quiz answer", pts: "+20" },
                { label: "Score prediction", pts: "+50" },
                { label: "Fan poll vote", pts: "+10" },
                { label: "Perfect quiz", pts: "+100" },
                { label: "Penalty Shootout", pts: "+50" },
                { label: "Guess a player", pts: "+100" },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,215,0,0.3)" }}
                  className="bg-white/3 border border-white/5 rounded-xl p-3 text-center cursor-default transition-colors">
                  <div className="text-primary font-display text-xl font-black">{item.pts}</div>
                  <div className="text-white/40 text-[10px] font-medium mt-0.5">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
