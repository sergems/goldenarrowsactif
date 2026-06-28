import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useGetNextFixture, useListPlayers } from "@workspace/api-client-react";
import { format } from "date-fns";
import {
  Trophy, Star, Zap, CheckCircle, XCircle, Clock, Users,
  Target, Award, ChevronRight, BarChart2, MessageSquare, Crown
} from "lucide-react";

// ─── Quiz questions pool ──────────────────────────────────────────────────────

const QUESTIONS = [
  { q: "What year was Lamontville Golden Arrows FC founded?", options: ["1943", "1953", "1963", "1973"], a: 1 },
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
  { q: "Which tournament did Golden Arrows win in 2021/22?", options: ["MTN8", "Nedbank Cup", "DStv Compact Cup", "Telkom Knockout"], a: 3 },
  { q: "Golden Arrows' club colours are often described as which combination?", options: ["Gold & Green", "Gold & Black", "Green & White", "Yellow & Blue"], a: 0 },
  { q: "Approximately how many seasons have Golden Arrows spent in the PSL top flight?", options: ["10+", "15+", "20+", "25+"], a: 3 },
  { q: "Which of these rivals is considered a major Durban derby opponent?", options: ["Kaizer Chiefs", "AmaZulu FC", "Orlando Pirates", "Mamelodi Sundowns"], a: 1 },
  { q: "Which position does Golden Arrows traditionally play from — formation wise?", options: ["Ultra-defensive", "Counter-attacking", "High-pressing", "Tiki-taka"], a: 1 },
  { q: "What does the arrow symbol on the club badge represent?", options: ["Speed & Direction", "Military heritage", "The Zulu nation", "Progress forward"], a: 0 },
  { q: "Which year did Golden Arrows win the MTN8?", options: ["2009", "2011", "2013", "2015"], a: 1 },
  { q: "PSL stands for?", options: ["Premier Sports League", "Professional Soccer League", "Premier Soccer League", "Provincial Soccer League"], a: 2 },
  { q: "What colour is Golden Arrows' away kit typically?", options: ["White", "Black", "Gold/Yellow", "Red"], a: 2 },
  { q: "Which broadcaster holds the South African PSL broadcasting rights?", options: ["SABC", "SuperSport", "eTV", "DStv"], a: 1 },
  { q: "How many teams compete in the DStv Premiership?", options: ["14", "16", "18", "20"], a: 1 },
  { q: "What is the maximum number of foreign players allowed in a PSL squad?", options: ["3", "4", "5", "6"], a: 3 },
  { q: "Which region of Durban is Lamontville in?", options: ["North", "South", "West", "Central"], a: 1 },
  { q: "Golden Arrows are also known by which abbreviation?", options: ["LAG", "LGA", "LGAFC", "GA"], a: 1 },
  { q: "The DStv Premiership season runs approximately from?", options: ["Jan–Dec", "Aug–May", "Feb–Nov", "Jun–Mar"], a: 1 },
  { q: "Which cup competition uses a two-leg knockout format?", options: ["MTN8", "Nedbank Cup", "Telkom KO", "PSL Cup"], a: 1 },
  { q: "What is the prize for winning the DStv Premiership title?", options: ["R3m", "R6m", "R10m", "R15m"], a: 2 },
  { q: "Which Golden Arrows season saw them finish in the top 4?", options: ["2009/10", "2012/13", "2017/18", "2019/20"], a: 1 },
  { q: "SAFA stands for?", options: ["South African Football Association", "Southern Africa FA", "SA Football Academy", "State Amateur FA"], a: 0 },
];

function getDailyQuestions(): typeof QUESTIONS {
  const day = Math.floor(Date.now() / 86400000);
  const seed = day % (QUESTIONS.length - 5);
  const pool = [...QUESTIONS];
  const picked: typeof QUESTIONS = [];
  let i = seed;
  while (picked.length < 5) {
    picked.push(pool[i % pool.length]);
    i += 7;
  }
  return picked;
}

// ─── Weekly polls data ────────────────────────────────────────────────────────

const POLLS = [
  {
    id: "poll-motm",
    question: "Who was Man of the Match in the last game?",
    options: ["Pule Mmodi", "Nduduzo Sibiya", "Sifiso Ngcobo", "Nkanyiso Mngwengwe"],
    votes: [142, 89, 67, 118],
  },
  {
    id: "poll-formation",
    question: "What formation should we play next match?",
    options: ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1"],
    votes: [88, 210, 45, 134],
  },
  {
    id: "poll-rating",
    question: "How would you rate our last performance?",
    options: ["⭐ Poor", "⭐⭐ Average", "⭐⭐⭐ Good", "⭐⭐⭐⭐ Excellent"],
    votes: [23, 67, 198, 89],
  },
];

// ─── Leaderboard mock data ────────────────────────────────────────────────────

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
    setSelected(i);
    setShowResult(true);
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
  }

  function advance() {
    if (current < 4) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const s = answers.filter((a, i) => a === questions[i].a).length + (selected === q.a ? 1 : 0);
      const finalScore = answers.slice(0, current).filter((a, i) => a === questions[i].a).length + (selected === q.a ? 1 : 0);
      setScore(finalScore);
      setFinished(true);
      localStorage.setItem(storageKey, String(finalScore));
      const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + finalScore * 20;
      localStorage.setItem("supporter-points", String(pts));
    }
  }

  const correctCount = answers.filter((a, i) => a === questions[i].a).length;

  if (finished) {
    const pct = Math.round((score / 5) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-6xl mb-4">{score >= 4 ? "🏆" : score >= 3 ? "⭐" : score >= 2 ? "👍" : "📚"}</div>
        <h3 className="font-display text-3xl text-primary mb-2" style={{ letterSpacing: "0.04em" }}>
          {score}/5 Correct
        </h3>
        <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <p className="text-white/50 text-sm mb-4">
          {score === 5 ? "Perfect score! You're a true Arrow!" : score >= 3 ? "Great work, supporter!" : "Keep learning about your club!"}
        </p>
        <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-bold">
          <Zap className="h-4 w-4" />+{score * 20} Supporter Points earned
        </div>
        <p className="text-white/30 text-xs mt-4">Come back tomorrow for new questions!</p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < current ? "bg-primary" : i === current ? "bg-primary/60" : "bg-white/10"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
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
                <motion.button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 ${cls}`}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {showResult && i === q.a && <CheckCircle className="h-4 w-4 ml-auto text-green-400" />}
                  {showResult && i === selected && i !== q.a && <XCircle className="h-4 w-4 ml-auto text-red-400" />}
                </motion.button>
              );
            })}
          </div>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
              <motion.button
                onClick={advance}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
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
    const prediction = { home, away, scorer, ts: Date.now() };
    localStorage.setItem(storageKey, JSON.stringify(prediction));
    const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + 50;
    localStorage.setItem("supporter-points", String(pts));
    setSubmitted(true);
  }

  if (!fixture) {
    return <div className="text-center text-white/40 py-8">No upcoming fixture found.</div>;
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
        <div className="text-5xl mb-3">🎯</div>
        <h3 className="font-display text-2xl text-primary mb-1">Prediction Locked In!</h3>
        <p className="text-white/50 text-sm mb-4">You predicted: <strong className="text-white">{fixture.homeTeam} {home} – {away} {fixture.awayTeam}</strong></p>
        {scorer && <p className="text-white/40 text-sm">First scorer: <span className="text-primary font-bold">{scorer}</span></p>}
        <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-bold mt-4">
          <Zap className="h-4 w-4" />+50 Points for predicting
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{fixture.competition}</p>
        <p className="text-white/60 text-sm">{format(new Date(fixture.date), "EEEE, MMMM d")}</p>
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
        <div className="text-center flex-1">
          <div className="font-display text-lg sm:text-2xl text-white mb-3" style={{ letterSpacing: "0.04em" }}>{fixture.homeTeam}</div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setHome(h => Math.max(0, h - 1))} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">−</button>
            <span className="font-display text-4xl text-primary w-12 text-center">{home}</span>
            <button onClick={() => setHome(h => Math.min(9, h + 1))} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">+</button>
          </div>
        </div>

        <div className="text-white/20 font-display text-3xl flex-shrink-0">–</div>

        <div className="text-center flex-1">
          <div className="font-display text-lg sm:text-2xl text-white mb-3" style={{ letterSpacing: "0.04em" }}>{fixture.awayTeam}</div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setAway(a => Math.max(0, a - 1))} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">−</button>
            <span className="font-display text-4xl text-primary w-12 text-center">{away}</span>
            <button onClick={() => setAway(a => Math.min(9, a + 1))} className="w-9 h-9 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/15 font-bold transition-colors">+</button>
          </div>
        </div>
      </div>

      {players && players.length > 0 && (
        <div className="mb-6">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold block mb-2">First Goal Scorer (optional)</label>
          <select
            value={scorer}
            onChange={e => setScorer(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="">Select a player…</option>
            {players.filter(p => p.position !== "Goalkeeper").map(p => (
              <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
            ))}
          </select>
        </div>
      )}

      <motion.button
        onClick={submit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-primary text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-primary/90 transition-colors"
      >
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
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </div>
  );
}

function FanPolls() {
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const s = localStorage.getItem("poll-votes");
    return s ? JSON.parse(s) : {};
  });

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
      {POLLS.map(poll => {
        const voted = votes[poll.id];
        const total = poll.votes.reduce((a, b) => a + b, 0) + (voted !== undefined ? 1 : 0);
        return (
          <div key={poll.id}>
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
                      <motion.button
                        onClick={() => vote(poll.id, i)}
                        disabled={hasVoted}
                        whileHover={!hasVoted ? { x: 4 } : {}}
                        className={`text-sm font-medium flex items-center gap-2 transition-colors ${isVoted ? "text-primary font-bold" : hasVoted ? "text-white/50" : "text-white/80 hover:text-white"}`}
                      >
                        {isVoted && <CheckCircle className="h-3.5 w-3.5" />}
                        {opt}
                      </motion.button>
                      {hasVoted && <span className={`text-xs font-bold ${isVoted ? "text-primary" : "text-white/30"}`}>{pct}%</span>}
                    </div>
                    {hasVoted && <AnimatedBar pct={pct} delay={i * 0.1} />}
                    {!hasVoted && (
                      <motion.button
                        onClick={() => vote(poll.id, i)}
                        whileHover={{ scaleX: 1.01 }}
                        className="w-full h-2.5 bg-white/5 border border-white/8 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {voted !== undefined && (
              <p className="text-xs text-white/25 mt-2">{total.toLocaleString()} votes total</p>
            )}
          </div>
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center gap-3 bg-primary/15 border border-primary/30 rounded-xl p-3"
        >
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-white/40 font-bold uppercase tracking-wide">Your Points</div>
            <div className="font-display text-2xl text-primary">{myPoints.toLocaleString()}</div>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {LEADERBOARD.map((user, i) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${i === 0 ? "bg-primary/10 border-primary/30" : "bg-white/3 border-white/5 hover:border-white/15"}`}
          >
            <div className={`font-display text-xl w-7 text-center flex-shrink-0 ${i === 0 ? "text-primary" : "text-white/25"}`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm truncate ${i === 0 ? "text-primary" : "text-white"}`}>
                {user.badge} {user.name}
              </div>
              <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                <Zap className="h-2.5 w-2.5" />{user.streak} day streak
              </div>
            </div>
            <div className={`font-display text-lg font-black flex-shrink-0 ${i === 0 ? "text-primary stat-glow" : "text-white/70"}`}>
              {user.points.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-white/20 mt-4">Earn points by completing quizzes, predictions & polls</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "quiz", label: "Daily Quiz", icon: Zap, color: "text-yellow-400" },
  { id: "predict", label: "Predict", icon: Target, color: "text-blue-400" },
  { id: "polls", label: "Fan Polls", icon: BarChart2, color: "text-green-400" },
  { id: "leaderboard", label: "Leaderboard", icon: Crown, color: "text-primary" },
];

export default function SupporterHub() {
  const [tab, setTab] = useState("quiz");
  const today = format(new Date(), "EEEE, MMMM d");
  const myPoints = parseInt(typeof window !== "undefined" ? localStorage.getItem("supporter-points") || "0" : "0");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-card border-b border-white/8">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-transparent to-primary/5 pointer-events-none" />

        {/* Floating decorative balls */}
        <div className="absolute top-6 right-12 text-6xl opacity-5 ball-float" style={{ "--dur": "5s", "--delay": "0s" } as React.CSSProperties}>⚽</div>
        <div className="absolute bottom-4 left-20 text-4xl opacity-5 ball-float" style={{ "--dur": "7s", "--delay": "2s" } as React.CSSProperties}>⚽</div>

        <div className="container mx-auto px-4 py-10 sm:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-3">{today}</p>
            <h1 className="font-display text-4xl sm:text-6xl uppercase mb-3" style={{ letterSpacing: "0.06em" }}>
              Supporter <span className="text-primary">Hub</span>
            </h1>
            <p className="text-white/50 max-w-lg mx-auto text-sm">
              Your daily football fix — quiz, predict, vote and climb the leaderboard.
            </p>

            {myPoints > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 mt-4 bg-primary/15 border border-primary/25 rounded-full px-5 py-2 text-primary text-sm font-bold"
              >
                <Star className="h-4 w-4" />
                {myPoints.toLocaleString()} Points
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-white/8">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-0 scrollbar-none">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all duration-200 flex-shrink-0 ${tab === t.id ? "border-primary text-primary" : "border-transparent text-white/40 hover:text-white/70"}`}
              >
                <t.icon className={`h-4 w-4 ${tab === t.id ? "text-primary" : t.color}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "quiz" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-2xl uppercase text-white">Daily Quiz</h2>
                    <p className="text-white/40 text-xs mt-0.5">5 new questions every day</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/30 border border-white/10 rounded-full px-3 py-1.5">
                    <Clock className="h-3 w-3" />
                    Resets midnight
                  </div>
                </div>
                <div className="bg-card border border-white/8 rounded-2xl p-5 sm:p-7">
                  <DailyQuiz />
                </div>
              </div>
            )}

            {tab === "predict" && (
              <div>
                <div className="mb-5">
                  <h2 className="font-display text-2xl uppercase text-white">Score Prediction</h2>
                  <p className="text-white/40 text-xs mt-0.5">Predict the next result and earn points</p>
                </div>
                <div className="bg-card border border-white/8 rounded-2xl p-5 sm:p-7">
                  <ScorePredictor />
                </div>
              </div>
            )}

            {tab === "polls" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-2xl uppercase text-white">Fan Polls</h2>
                    <p className="text-white/40 text-xs mt-0.5">Your vote earns +10 points</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary border border-primary/20 rounded-full px-3 py-1.5 font-bold">
                    <Users className="h-3 w-3" />
                    Weekly
                  </div>
                </div>
                <div className="bg-card border border-white/8 rounded-2xl p-5 sm:p-7">
                  <FanPolls />
                </div>
              </div>
            )}

            {tab === "leaderboard" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-2xl uppercase text-white">Leaderboard</h2>
                    <p className="text-white/40 text-xs mt-0.5">Top supporters this season</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary border border-primary/20 rounded-full px-3 py-1.5 font-bold">
                    <Trophy className="h-3 w-3" />
                    Season
                  </div>
                </div>
                <Leaderboard />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Points guide */}
      <div className="container mx-auto px-4 pb-12 max-w-2xl">
        <div className="bg-card border border-white/5 rounded-2xl p-5">
          <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />How to Earn Points
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Correct quiz answer", pts: "+20" },
              { label: "Score prediction", pts: "+50" },
              { label: "Fan poll vote", pts: "+10" },
              { label: "Perfect quiz", pts: "+100" },
              { label: "Daily visit", pts: "+5" },
              { label: "Share content", pts: "+15" },
            ].map(item => (
              <div key={item.label} className="bg-white/3 rounded-xl p-3 text-center">
                <div className="text-primary font-display text-xl font-black">{item.pts}</div>
                <div className="text-white/40 text-[10px] font-medium mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
