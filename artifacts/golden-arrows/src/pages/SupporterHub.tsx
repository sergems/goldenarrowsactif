import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useGetNextFixture, useListPlayers } from "@workspace/api-client-react";
import { format } from "date-fns";
import {
  Trophy, Star, CheckCircle, XCircle, Bolt, ChevronLeft,
  ChevronRight, Zap, Crown, Target, Flame, Users, Award,
  Gamepad2, Palette, Music, Shield, BarChart3, Brain,
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
          <Bolt className="h-4 w-4" />+{score * 20} Supporter Points earned
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
          <Bolt className="h-4 w-4" />+50 Points for predicting
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
            <motion.span key={home} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} className="font-display text-4xl text-primary w-12 text-center inline-block">{home}</motion.span>
            <motion.button onClick={() => setHome(h => Math.min(9, h + 1))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">+</motion.button>
          </div>
        </div>
        <div className="text-white/20 font-display text-3xl flex-shrink-0">–</div>
        <div className="text-center flex-1">
          <div className="font-display text-base sm:text-xl text-white mb-3" style={{ letterSpacing: "0.04em" }}>{fixture.awayTeam}</div>
          <div className="flex items-center justify-center gap-2">
            <motion.button onClick={() => setAway(a => Math.max(0, a - 1))} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">−</motion.button>
            <motion.span key={away} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} className="font-display text-4xl text-primary w-12 text-center inline-block">{away}</motion.span>
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
              <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5"><Bolt className="h-2.5 w-2.5" />{user.streak} day streak</div>
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
  category: "CREATE" | "PLAY" | "COMPETE" | "COMMUNITY";
  description: string;
  accentColor: string;
  btnLabel: string;
  previewEmoji: string;
  component: React.ComponentType;
}

const FEATURES: Feature[] = [
  // CREATE
  { id: "kit", title: "Kit Designer", category: "CREATE", description: "Design your own Golden Arrows jersey with custom colours & patterns", accentColor: "#1B5E20", btnLabel: "Start Designing", previewEmoji: "🎽", component: KitDesigner },
  { id: "boot", title: "Boot Designer", category: "CREATE", description: "Build custom football boots from scratch", accentColor: "#B45309", btnLabel: "Start Designing", previewEmoji: "👟", component: BootDesigner },
  { id: "badge", title: "Badge Creator", category: "CREATE", description: "Design your own supporter shield badge and download it", accentColor: "#7C3AED", btnLabel: "Start Designing", previewEmoji: "🎖️", component: FanBadgeCreator },
  { id: "chant", title: "Chant Mixer", category: "CREATE", description: "Mix crowd chants and drums to create your own match day atmosphere", accentColor: "#0E7490", btnLabel: "Start Mixing", previewEmoji: "🎵", component: ChantMixer },
  // PLAY
  { id: "penalty", title: "Penalty Shootout", category: "PLAY", description: "5 penalties — pick your spot and beat the keeper!", accentColor: "#7C3AED", btnLabel: "Kick Off", previewEmoji: "⚽", component: PenaltyShootout },
  { id: "crossbar", title: "Crossbar Challenge", category: "PLAY", description: "Charge the power meter and try to hit the crossbar", accentColor: "#064E3B", btnLabel: "Kick Off", previewEmoji: "🥅", component: CrossbarChallenge },
  { id: "memory", title: "Memory Game", category: "PLAY", description: "Flip cards and match jersey pairs before time runs out", accentColor: "#991B1B", btnLabel: "Play Now", previewEmoji: "🧠", component: MemoryGame },
  { id: "wordsearch", title: "Word Search", category: "PLAY", description: "Find football words hidden in the grid — race the clock!", accentColor: "#92400E", btnLabel: "Play Now", previewEmoji: "🔍", component: WordSearch },
  { id: "guess", title: "Guess The Player", category: "PLAY", description: "Can you identify a blurred Golden Arrows player from hints?", accentColor: "#065F46", btnLabel: "Guess Now", previewEmoji: "👤", component: GuessThePlayer },
  { id: "wheel", title: "Wheel of Fortune", category: "PLAY", description: "Spin to win points, wallpapers, club facts & more", accentColor: "#B45309", btnLabel: "Spin Now", previewEmoji: "🎡", component: WheelOfFortune },
  // COMPETE
  { id: "quiz", title: "Daily Quiz", category: "COMPETE", description: "5 questions about Golden Arrows. New questions every day!", accentColor: "#1D4ED8", btnLabel: "Play Now", previewEmoji: "🧩", component: DailyQuiz },
  { id: "predict", title: "Score Predictions", category: "COMPETE", description: "Predict the next match result and earn 50 bonus points", accentColor: "#0369A1", btnLabel: "Predict Now", previewEmoji: "🎯", component: ScorePredictor },
  { id: "leaderboard", title: "Leaderboard", category: "COMPETE", description: "See the top Golden Arrows fans ranked by points and streaks", accentColor: "#B45309", btnLabel: "View Rankings", previewEmoji: "🏆", component: Leaderboard },
  { id: "achievements", title: "Achievements", category: "COMPETE", description: "View your unlocked badges and track your fan journey", accentColor: "#B45309", btnLabel: "View All", previewEmoji: "🎖️", component: Achievements },
  // COMMUNITY
  { id: "dream-xi", title: "Dream XI Builder", category: "COMMUNITY", description: "Pick your formation & build the perfect squad on the pitch", accentColor: "#1D4ED8", btnLabel: "Build Team", previewEmoji: "📋", component: DreamXI },
  { id: "polls", title: "Fan Polls", category: "COMMUNITY", description: "Have your say — vote in the latest fan polls", accentColor: "#065F46", btnLabel: "Vote Now", previewEmoji: "📊", component: FanPolls },
  { id: "fotm", title: "Fan of the Month", category: "COMMUNITY", description: "Nominate & vote for the most dedicated Golden Arrows supporter", accentColor: "#92400E", btnLabel: "Nominate", previewEmoji: "🗳️", component: FanOfTheMonth },
  { id: "profile", title: "Fan Profile", category: "COMMUNITY", description: "Your fan stats, rank, points and overall progress", accentColor: "#1B5E20", btnLabel: "View Profile", previewEmoji: "👑", component: FanProfile },
];

const CATEGORIES = [
  { id: "CREATE" as const, label: "Create", icon: Palette, color: "#1B5E20", gradient: "from-green-900/40 to-green-950/10", accent: "text-green-400", border: "border-green-500/20" },
  { id: "PLAY" as const, label: "Play", icon: Gamepad2, color: "#7C3AED", gradient: "from-purple-900/40 to-purple-950/10", accent: "text-purple-400", border: "border-purple-500/20" },
  { id: "COMPETE" as const, label: "Compete", icon: Trophy, color: "#B45309", gradient: "from-amber-900/40 to-amber-950/10", accent: "text-amber-400", border: "border-amber-500/20" },
  { id: "COMMUNITY" as const, label: "Community", icon: Users, color: "#0E7490", gradient: "from-cyan-900/40 to-cyan-950/10", accent: "text-cyan-400", border: "border-cyan-500/20" },
];

const CAROUSEL_IDS = ["kit", "penalty", "dream-xi", "boot", "wheel", "guess"];

// ─── Animated Card Previews ───────────────────────────────────────────────────
function CardPreview({ id, accentColor }: { id: string; accentColor: string }) {
  switch (id) {
    case "kit":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotateY: [0, 20, 0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="text-5xl">🎽</div>
            <motion.div
              className="absolute inset-0 rounded-full opacity-30"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
            />
          </motion.div>
        </div>
      );
    case "boot":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-5xl">👟</div>
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full"
            style={{ background: accentColor }}
            animate={{ scaleX: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      );
    case "penalty":
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-3 w-14 h-8 border-2 rounded-t-sm opacity-40" style={{ borderColor: accentColor }} />
          <motion.div
            animate={{ x: [-8, 8, -8], y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-5 text-2xl"
          >⚽</motion.div>
          <motion.div
            animate={{ x: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-4 text-3xl"
          >🧤</motion.div>
        </div>
      );
    case "crossbar":
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 w-14 h-1 rounded opacity-50" style={{ background: accentColor }} />
          <div className="absolute top-4 w-0.5 h-8 left-6 opacity-30" style={{ background: accentColor }} />
          <div className="absolute top-4 w-0.5 h-8 right-6 opacity-30" style={{ background: accentColor }} />
          <motion.div
            animate={{ y: [-20, 0, -20], rotate: [0, 360, 720] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl mt-4"
          >⚽</motion.div>
        </div>
      );
    case "memory":
      return (
        <div className="grid grid-cols-3 gap-1 p-2 w-full h-full">
          {[0,1,2,3,4,5].map(i => (
            <motion.div
              key={i}
              className="rounded aspect-square border flex items-center justify-center text-sm"
              style={{ borderColor: `${accentColor}60`, background: `${accentColor}15` }}
              animate={{ rotateY: [0, 180, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
            >
              {i % 2 === 0 ? "🎽" : ""}
            </motion.div>
          ))}
        </div>
      );
    case "wordsearch":
      return (
        <div className="grid grid-cols-5 gap-px p-2 w-full h-full text-[9px] font-mono font-bold">
          {"GOALARROWSGOALKICK".split("").slice(0, 20).map((c, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center rounded"
              animate={{ backgroundColor: [
                `${accentColor}00`,
                i % 3 === 0 ? `${accentColor}50` : `${accentColor}00`,
                `${accentColor}00`
              ]}}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              style={{ color: i % 3 === 0 ? "#FFD700" : "rgba(255,255,255,0.4)" }}
            >{c}</motion.div>
          ))}
        </div>
      );
    case "guess":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ filter: ["blur(8px)", "blur(4px)", "blur(8px)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl"
          >👤</motion.div>
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest"
            style={{ color: accentColor }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >Who am I?</motion.div>
        </div>
      );
    case "wheel":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative w-14 h-14"
          >
            {[0,1,2,3,4,5].map(i => (
              <div key={i}
                className="absolute inset-0 border-2 rounded-full opacity-60"
                style={{
                  borderColor: i % 2 === 0 ? "#FFD700" : accentColor,
                  transform: `scale(${1 - i * 0.12})`,
                  opacity: 1 - i * 0.12,
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-xl">🎡</div>
          </motion.div>
        </div>
      );
    case "badge":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-5xl">🛡️</div>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }}
          />
        </div>
      );
    case "quiz":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-5xl"
          >🧩</motion.div>
          <motion.div
            className="absolute top-3 right-3 w-3 h-3 rounded-full"
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            style={{ background: "#FFD700" }}
          />
        </div>
      );
    case "predict":
      return (
        <div className="relative w-full h-full flex items-center justify-center gap-2">
          <motion.div className="font-display text-2xl text-white" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>2</motion.div>
          <div className="text-white/40 font-bold">–</div>
          <motion.div className="font-display text-2xl" style={{ color: accentColor }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>1</motion.div>
        </div>
      );
    case "dream-xi":
      return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-full rounded border opacity-30" style={{ borderColor: accentColor, background: `${accentColor}10` }}>
            {[[1],[3],[3],[3],[1]].map((row, ri) => (
              <div key={ri} className="flex justify-around items-center" style={{ height: "20%" }}>
                {row.map((_, ci) => (
                  <motion.div key={ci}
                    className="w-2 h-2 rounded-full"
                    style={{ background: ri === 0 ? "#FFD700" : accentColor }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: ri * 0.2 + ci * 0.1 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    case "polls":
      return (
        <div className="p-2 space-y-1.5 w-full">
          {[70, 45, 25].map((pct, i) => (
            <div key={i} className="space-y-0.5">
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${accentColor}20` }}>
                <motion.div className="h-full rounded-full" style={{ background: accentColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    case "leaderboard":
      return (
        <div className="p-2 space-y-1 w-full">
          {["💎 2840", "🥇 2610", "🥈 2445"].map((entry, i) => (
            <motion.div key={i}
              className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded"
              style={{ background: i === 0 ? `${accentColor}30` : `${accentColor}10`, color: i === 0 ? "#FFD700" : "rgba(255,255,255,0.5)" }}
              animate={{ x: [0, i === 0 ? 3 : 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <span>{i + 1}.</span><span className="flex-1">{entry.split(" ")[0]}</span><span>{entry.split(" ")[1]}</span>
            </motion.div>
          ))}
        </div>
      );
    case "achievements":
      return (
        <div className="relative w-full h-full flex items-center justify-center gap-1 flex-wrap p-2">
          {["🏆","⭐","🎯","🎖️","🔥"].map((em, i) => (
            <motion.div key={i} className="text-xl"
              animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >{em}</motion.div>
          ))}
        </div>
      );
    case "fotm":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="text-5xl">👑</div>
          </motion.div>
          <motion.div className="absolute text-xl" style={{ top: "15%", right: "20%" }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>⭐</motion.div>
          <motion.div className="absolute text-xl" style={{ top: "20%", left: "18%" }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}>⭐</motion.div>
        </div>
      );
    case "profile":
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
          <motion.div className="text-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>👑</motion.div>
          <div className="w-3/4 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "#FFD700" }}
              animate={{ width: ["40%", "75%", "40%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <div className="text-[9px] font-bold" style={{ color: "#FFD700" }}>SUPPORTER LVL 7</div>
        </div>
      );
    case "chant":
      return (
        <div className="relative w-full h-full flex items-center justify-center gap-1">
          {[1, 0.6, 1, 0.7, 0.9, 0.5, 1].map((h, i) => (
            <motion.div key={i}
              className="w-1.5 rounded-full"
              style={{ background: accentColor, height: "40px", transformOrigin: "bottom" }}
              animate={{ scaleY: [h * 0.3, h, h * 0.3] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      );
    default:
      return <div className="text-4xl flex items-center justify-center w-full h-full">⚽</div>;
  }
}

// ─── Particle Background ──────────────────────────────────────────────────────
function StadiumBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base dark gradient */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 50%, hsl(125 55% 8%) 0%, hsl(140 10% 3%) 60%)"
      }} />
      {/* Stadium light beams */}
      <motion.div className="absolute top-0 left-1/4 w-96 h-[600px] opacity-[0.04]"
        style={{ background: "linear-gradient(180deg, #FFD700 0%, transparent 100%)", transformOrigin: "top center" }}
        animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute top-0 right-1/4 w-96 h-[600px] opacity-[0.03]"
        style={{ background: "linear-gradient(180deg, #FFD700 0%, transparent 100%)", transformOrigin: "top center" }}
        animate={{ rotate: [6, -6, 6] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Pitch texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 41px)", backgroundSize: "100% 82px" }}
      />
      {/* Floating particles */}
      {particles.map(p => (
        <motion.div key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.id % 3 === 0 ? "#FFD700" : "#1B5E20", opacity: 0.4 }}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
      {/* Ambient green glow */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10"
        style={{ background: "linear-gradient(0deg, hsl(125 55% 24%) 0%, transparent 100%)" }}
      />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ onOpen }: { onOpen: (f: Feature) => void }) {
  const myPoints = parseInt(typeof window !== "undefined" ? localStorage.getItem("supporter-points") || "0" : "0");
  const achievementCount = (() => {
    try { return Object.values(JSON.parse(localStorage.getItem("achievements") || "{}")).filter(Boolean).length; } catch { return 0; }
  })();
  const today = format(new Date(), "EEEE, MMMM d");
  const quizDone = !!localStorage.getItem(`quiz-${Math.floor(Date.now() / 86400000)}`);
  const level = Math.max(1, Math.floor(myPoints / 500) + 1);
  const xpInLevel = myPoints % 500;
  const xpPct = (xpInLevel / 500) * 100;
  const coins = Math.floor(myPoints / 10);

  return (
    <div className="relative overflow-hidden border-b border-white/5">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(125 55% 8%) 0%, hsl(140 12% 6%) 50%, hsl(51 60% 8%) 100%)" }}
      />
      {/* Animated top border */}
      <motion.div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #FFD700, #1B5E20, #FFD700, transparent)" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative max-w-[1330px] mx-auto px-4 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          {/* Left: Welcome */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-3 flex items-center gap-2">
                <motion.span className="w-6 h-px bg-primary inline-block" animate={{ scaleX: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                {today}
                <motion.span className="w-6 h-px bg-primary inline-block" animate={{ scaleX: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
              </p>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase font-black mb-2 leading-none" style={{ letterSpacing: "0.04em" }}>
                Welcome to
                <br />
                <span className="text-primary">Fan Zone</span>
              </h1>

              <p className="text-white/40 text-sm mb-6 max-w-md">
                Design. Play. Compete. Connect with the Abafana Bes'thende community.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 mb-6">
                <motion.div whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                  <Zap className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-display text-lg text-primary leading-none">{myPoints.toLocaleString()}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wider">Points</div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                  <Crown className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-display text-lg text-white leading-none">Lv {level}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wider">Supporter</div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="font-display text-lg text-white leading-none">{coins.toLocaleString()}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wider">Coins</div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-display text-lg text-white leading-none">{achievementCount}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wider">Achievements</div>
                  </div>
                </motion.div>
              </div>

              {/* XP Bar */}
              <div className="max-w-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">XP Progress — Level {level}</span>
                  <span className="text-[10px] font-bold text-primary">{xpInLevel} / 500 XP</span>
                </div>
                <div className="h-2.5 bg-white/8 rounded-full overflow-hidden relative">
                  <motion.div className="h-full rounded-full relative overflow-hidden"
                    style={{ background: "linear-gradient(90deg, #1B5E20, #FFD700)" }}
                    initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}>
                    <motion.div className="absolute inset-0 opacity-50"
                      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)", backgroundSize: "200% 100%" }}
                      animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Daily Challenge */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm p-5"
            style={{ background: "linear-gradient(135deg, rgba(27,94,32,0.3) 0%, rgba(0,0,0,0.4) 100%)" }}>
            {/* Glow */}
            <motion.div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
              style={{ background: "#FFD700" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Flame className="h-5 w-5 text-orange-400" />
                </motion.div>
                <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">Daily Challenge</span>
                <motion.div className="ml-auto w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              <div className="space-y-2.5 mb-4">
                {[
                  { label: "Daily Quiz", done: quizDone, pts: "+100 XP" },
                  { label: "Score Prediction", done: false, pts: "+50 XP" },
                  { label: "Vote in a Poll", done: false, pts: "+10 XP" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <motion.div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${task.done ? "bg-green-500 border-green-500" : "border-white/20"}`}
                      animate={task.done ? {} : { borderColor: ["rgba(255,255,255,0.2)", "rgba(255,215,0,0.4)", "rgba(255,255,255,0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      {task.done && <CheckCircle className="h-3 w-3 text-white" />}
                    </motion.div>
                    <span className={`text-sm flex-1 ${task.done ? "line-through text-white/30" : "text-white/70"}`}>{task.label}</span>
                    <span className="text-[10px] font-bold text-primary">{task.pts}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => { const f = FEATURES.find(f => f.id === "quiz"); if (f) onOpen(f); }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,215,0,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider text-black relative overflow-hidden"
                style={{ background: "linear-gradient(90deg, #FFD700, #B8860B)" }}>
                <motion.div className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative">Continue Playing →</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Featured Carousel ────────────────────────────────────────────────────────
function FeaturedCarousel({ onOpen }: { onOpen: (f: Feature) => void }) {
  const [active, setActive] = useState(0);
  const featured = CAROUSEL_IDS.map(id => FEATURES.find(f => f.id === id)!).filter(Boolean);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <div className="relative py-8 border-b border-white/5">
      <div className="max-w-[1330px] mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl uppercase font-black text-white" style={{ letterSpacing: "0.06em" }}>
              Featured <span className="text-primary">Activities</span>
            </h2>
            <p className="text-white/30 text-xs mt-0.5 uppercase tracking-widest">Today's top picks</p>
          </div>
          <div className="flex gap-1.5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setActive(a => (a - 1 + featured.length) % featured.length)}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setActive(a => (a + 1) % featured.length)}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Carousel track */}
        <div className="relative overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${featured[active].accentColor}40 0%, ${featured[active].accentColor}15 50%, transparent 100%)` }}
              onClick={() => onOpen(featured[active])}
              whileHover={{ scale: 1.01 }}>
              {/* BG glow */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-2xl"
                style={{ background: featured[active].accentColor }} />
              <motion.div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${featured[active].accentColor}, transparent)` }}
              />

              <div className="absolute inset-0 flex items-center">
                {/* Text */}
                <div className="flex-1 p-8">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/60 mb-4">
                    <Zap className="h-2.5 w-2.5 text-primary" />Featured
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase font-black text-white mb-2" style={{ letterSpacing: "0.04em" }}>
                    {featured[active].title}
                  </h3>
                  <p className="text-white/50 text-sm mb-5 max-w-xs">{featured[active].description}</p>
                  <motion.div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-black relative overflow-hidden"
                    style={{ background: "linear-gradient(90deg, #FFD700, #B8860B)" }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(255,215,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}>
                    <motion.div className="absolute inset-0"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                      animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative">{featured[active].btnLabel}</span>
                  </motion.div>
                </div>
                {/* Preview */}
                <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0 mr-6">
                  <CardPreview id={featured[active].id} accentColor={featured[active].accentColor} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {featured.map((_, i) => (
            <motion.button key={i} onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === active ? 24 : 6, background: i === active ? "#FFD700" : "rgba(255,255,255,0.2)" }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Activity Card ────────────────────────────────────────────────────────────
function ActivityCard({ feature, onOpen, delay = 0 }: { feature: Feature; onOpen: () => void; delay?: number }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
      whileHover={{ y: -6, scale: 1.02, boxShadow: `0 20px 50px ${feature.accentColor}50` }}
      whileTap={{ scale: 0.97 }}
      className="relative text-left rounded-2xl overflow-hidden border transition-all duration-300 group flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${feature.accentColor}28 0%, ${feature.accentColor}10 60%, ${feature.accentColor}05 100%)`,
        borderColor: `${feature.accentColor}45`,
      }}>
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${feature.accentColor}, transparent)` }} />

      {/* Animated preview */}
      <div className="relative h-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at center, ${feature.accentColor} 0%, transparent 70%)` }}
        />
        <CardPreview id={feature.id} accentColor={feature.accentColor} />
        {/* Glow blob */}
        <motion.div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-25 blur-xl pointer-events-none"
          style={{ background: feature.accentColor }}
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col">
        <h3 className="font-display text-sm uppercase font-black text-white mb-1" style={{ letterSpacing: "0.04em" }}>
          {feature.title}
        </h3>
        <p className="text-white/40 text-[11px] leading-relaxed flex-1">{feature.description}</p>
        <motion.div
          className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider relative overflow-hidden rounded-lg px-3 py-2"
          style={{ background: `${feature.accentColor}30`, color: "#FFD700" }}
          whileHover={{ background: `${feature.accentColor}50` }}>
          <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
            animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative">{feature.btnLabel} →</span>
        </motion.div>
      </div>
    </motion.button>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────
function CategorySection({ cat, features, onOpen }: {
  cat: typeof CATEGORIES[number];
  features: Feature[];
  onOpen: (f: Feature) => void;
}) {
  const Icon = cat.icon;
  return (
    <div className="mb-12">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
          style={{ background: `${cat.color}20`, borderColor: `${cat.color}40` }}>
          <Icon className={`h-4.5 w-4.5 ${cat.accent}`} />
        </div>
        <div>
          <h2 className="font-display text-xl uppercase font-black text-white" style={{ letterSpacing: "0.06em" }}>
            {cat.label}
          </h2>
        </div>
        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${cat.color}40, transparent)` }} />
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((f, i) => (
          <ActivityCard key={f.id} feature={f} onOpen={() => onOpen(f)} delay={i * 0.06} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SupporterHub() {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  return (
    <div className="relative min-h-screen">
      <StadiumBackground />

      {/* Feature overlay (fullscreen) */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "hsl(140 10% 4%)" }}>
            {/* Feature header */}
            <div className="flex-shrink-0 border-b border-white/8 px-4 py-3 flex items-center gap-3"
              style={{ background: `${activeFeature.accentColor}18` }}>
              <motion.button
                onClick={() => setActiveFeature(null)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors border border-white/10 rounded-xl px-3 py-2">
                <ChevronLeft className="h-4 w-4" /> Back to Fan Zone
              </motion.button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-2xl">{activeFeature.previewEmoji}</span>
                <h2 className="font-display text-lg text-white uppercase" style={{ letterSpacing: "0.04em" }}>{activeFeature.title}</h2>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                style={{ background: `${activeFeature.accentColor}20`, color: "#FFD700", borderColor: `${activeFeature.accentColor}40` }}>
                {activeFeature.category}
              </span>
            </div>
            {/* Animated top accent */}
            <motion.div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${activeFeature.accentColor}, #FFD700, ${activeFeature.accentColor})` }}
              animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Feature content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 py-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                  <activeFeature.component />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <HeroSection onOpen={setActiveFeature} />
        <FeaturedCarousel onOpen={setActiveFeature} />

        <div className="max-w-[1330px] mx-auto px-4 py-10">
          {CATEGORIES.map(cat => {
            const catFeatures = FEATURES.filter(f => f.category === cat.id);
            return (
              <CategorySection key={cat.id} cat={cat} features={catFeatures} onOpen={setActiveFeature} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
