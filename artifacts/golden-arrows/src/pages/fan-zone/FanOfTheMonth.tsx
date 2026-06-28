import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, ThumbsUp, User, Plus, Trophy, Calendar, X } from "lucide-react";
import { format } from "date-fns";

interface Nominee {
  id: string;
  name: string;
  reason: string;
  submittedBy: string;
  avatar: string;
  votes: number;
  month: string;
}

const MONTH_KEY = format(new Date(), "yyyy-MM");
const STORAGE_KEY = `fotm-nominees-${MONTH_KEY}`;
const VOTED_KEY = `fotm-voted-${MONTH_KEY}`;
const MY_VOTE_KEY = `fotm-my-vote-${MONTH_KEY}`;

const AVATARS = ["🦁", "🐆", "🦅", "🐊", "🦓", "🦏", "🐘", "🦬", "🦒", "🐅"];

const SEED_NOMINEES: Nominee[] = [
  {
    id: "seed-1",
    name: "Thabo Mkhize",
    reason: "Never missed a home game in 3 seasons. Always leads the chants from Row 1 and brings his whole family in matching jerseys!",
    submittedBy: "ArrowsFanatic_KZN",
    avatar: "🦁",
    votes: 47,
    month: MONTH_KEY,
  },
  {
    id: "seed-2",
    name: "Nandi Dlamini",
    reason: "Drives 200km from Pietermaritzburg to every home match. She's been making golden flags and giving them out to kids for free.",
    submittedBy: "GoldenBoyz_Durban",
    avatar: "🦅",
    votes: 38,
    month: MONTH_KEY,
  },
  {
    id: "seed-3",
    name: "Sipho Cele",
    reason: "Organised the community bus service to get fans from Lamontville township to matches. 40 people per game, every game.",
    submittedBy: "KZN_Arrow",
    avatar: "🐆",
    votes: 52,
    month: MONTH_KEY,
  },
];

function loadNominees(): Nominee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    // First visit — seed with defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOMINEES));
    return SEED_NOMINEES;
  } catch {
    return SEED_NOMINEES;
  }
}

function saveNominees(nominees: Nominee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nominees));
}

function getPastWinners(): { month: string; name: string; avatar: string; votes: number }[] {
  const months = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(format(d, "yyyy-MM"));
  }
  const winners = [
    { month: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "MMMM yyyy"), name: "Bongani Zulu", avatar: "🦓", votes: 89 },
    { month: format(new Date(new Date().setMonth(new Date().getMonth() - 2)), "MMMM yyyy"), name: "Lindiwe Ntanzi", avatar: "🐊", votes: 74 },
    { month: format(new Date(new Date().setMonth(new Date().getMonth() - 3)), "MMMM yyyy"), name: "Musa Mthembu", avatar: "🦬", votes: 63 },
  ];
  return winners;
}

export default function FanOfTheMonth() {
  const [nominees, setNominees] = useState<Nominee[]>(loadNominees);
  const [myVote, setMyVote] = useState<string | null>(() => localStorage.getItem(MY_VOTE_KEY));
  const [showNominate, setShowNominate] = useState(false);
  const [form, setForm] = useState({ name: "", reason: "", submittedBy: localStorage.getItem("fan-name") || "" });
  const [formError, setFormError] = useState("");
  const [justVoted, setJustVoted] = useState<string | null>(null);
  const [tab, setTab] = useState<"vote" | "hall">("vote");

  const sorted = [...nominees].sort((a, b) => b.votes - a.votes);
  const leader = sorted[0];
  const currentMonth = format(new Date(), "MMMM yyyy");
  const pastWinners = getPastWinners();

  function castVote(id: string) {
    if (myVote) return;
    const updated = nominees.map(n => n.id === id ? { ...n, votes: n.votes + 1 } : n);
    setNominees(updated);
    saveNominees(updated);
    localStorage.setItem(MY_VOTE_KEY, id);
    setMyVote(id);
    setJustVoted(id);

    // Award points
    const pts = parseInt(localStorage.getItem("supporter-points") || "0") + 15;
    localStorage.setItem("supporter-points", String(pts));

    // Achievement
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["fotm-voter"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));

    setTimeout(() => setJustVoted(null), 2000);
  }

  function submitNomination() {
    if (!form.name.trim()) { setFormError("Please enter the fan's name."); return; }
    if (form.reason.trim().length < 20) { setFormError("Please write at least 20 characters about why they deserve it."); return; }
    if (nominees.some(n => n.name.toLowerCase() === form.name.toLowerCase().trim())) {
      setFormError("This person has already been nominated this month!"); return;
    }

    const newNominee: Nominee = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      reason: form.reason.trim(),
      submittedBy: form.submittedBy.trim() || "Anonymous Fan",
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      votes: 1,
      month: MONTH_KEY,
    };

    const updated = [...nominees, newNominee];
    setNominees(updated);
    saveNominees(updated);
    setForm({ name: "", reason: "", submittedBy: form.submittedBy });
    setFormError("");
    setShowNominate(false);

    // Award points for nominating
    const pts = parseInt(localStorage.getItem("supporter-points") || "0") + 25;
    localStorage.setItem("supporter-points", String(pts));
  }

  const totalVotes = nominees.reduce((s, n) => s + n.votes, 0);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="text-center">
        <motion.div className="text-4xl mb-1" animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }}>👑</motion.div>
        <h3 className="font-display text-xl text-white uppercase mb-0.5">Fan of the Month</h3>
        <p className="text-white/40 text-xs flex items-center justify-center gap-1.5">
          <Calendar className="h-3 w-3" />{currentMonth} · {totalVotes} votes cast
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-white/10">
        {(["vote", "hall"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              tab === t ? "bg-primary text-black" : "bg-white/3 text-white/50 hover:text-white"
            }`}>
            {t === "vote" ? "🗳️ Vote & Nominate" : "🏆 Hall of Fame"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── VOTE TAB ── */}
        {tab === "vote" && (
          <motion.div key="vote" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-3">

            {/* Leader spotlight */}
            {leader && (
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-primary/30 p-5"
                style={{ background: "linear-gradient(135deg, rgba(27,94,32,0.4) 0%, rgba(255,215,0,0.08) 100%)" }}
                animate={{ boxShadow: ["0 0 0 rgba(255,215,0,0)", "0 0 30px rgba(255,215,0,0.15)", "0 0 0 rgba(255,215,0,0)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-3xl flex-shrink-0"
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  >
                    {leader.avatar}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Crown className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Currently Leading</span>
                    </div>
                    <h3 className="font-display text-lg text-white">{leader.name}</h3>
                    <p className="text-white/50 text-xs mt-1 line-clamp-2">{leader.reason}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-primary font-bold text-sm">{leader.votes} votes</span>
                      <span className="text-white/25 text-xs">·</span>
                      <span className="text-white/30 text-xs">Nominated by {leader.submittedBy}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* All nominees */}
            <div className="space-y-2">
              {sorted.map((nominee, i) => {
                const pct = totalVotes > 0 ? Math.round((nominee.votes / totalVotes) * 100) : 0;
                const isVoted = myVote === nominee.id;
                const isLeader = i === 0;

                return (
                  <motion.div key={nominee.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className={`rounded-xl border p-4 transition-all ${
                      isVoted ? "border-primary/40 bg-primary/8" : "border-white/8 bg-white/3"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-2xl">{nominee.avatar}</div>
                        {isLeader && <div className="absolute -top-1 -right-1 text-sm">👑</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-bold text-sm ${isVoted ? "text-primary" : "text-white"}`}>{nominee.name}</p>
                            <p className="text-white/35 text-[10px]">by {nominee.submittedBy}</p>
                          </div>
                          <motion.button
                            onClick={() => castVote(nominee.id)}
                            disabled={!!myVote}
                            whileHover={!myVote ? { scale: 1.08 } : {}}
                            whileTap={!myVote ? { scale: 0.92 } : {}}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
                              isVoted
                                ? "bg-primary/20 border border-primary/40 text-primary"
                                : myVote
                                ? "bg-white/5 border border-white/8 text-white/25 cursor-not-allowed"
                                : "bg-white/8 border border-white/15 text-white/70 hover:bg-primary/15 hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {isVoted ? "Voted!" : nominee.votes}
                          </motion.button>
                        </div>

                        <p className="text-white/50 text-xs mt-2 leading-relaxed line-clamp-2">{nominee.reason}</p>

                        {/* Vote bar */}
                        {myVote && (
                          <div className="mt-2.5 space-y-1">
                            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${isLeader ? "bg-primary" : "bg-white/30"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                              />
                            </div>
                            <p className={`text-[10px] font-bold ${isLeader ? "text-primary" : "text-white/30"}`}>{pct}%</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Just voted animation */}
                    <AnimatePresence>
                      {justVoted === nominee.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          className="text-center mt-2 text-primary text-xs font-bold">
                          ✓ Vote cast! +15 Supporter Points
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Nominate button */}
            <motion.button onClick={() => setShowNominate(true)}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,215,0,0.15)" }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-primary/40 rounded-xl py-3.5 text-primary text-sm font-bold hover:bg-primary/8 transition-colors">
              <Plus className="h-4 w-4" /> Nominate a Fan (+25 pts)
            </motion.button>

            {!myVote && <p className="text-center text-white/20 text-xs">Tap a nominee to vote · 1 vote per month</p>}
          </motion.div>
        )}

        {/* ── HALL OF FAME TAB ── */}
        {tab === "hall" && (
          <motion.div key="hall" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-3">
            <div className="text-center py-2">
              <p className="text-white/40 text-xs">Previous Fan of the Month winners</p>
            </div>
            {pastWinners.map((w, i) => (
              <motion.div key={w.month}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  i === 0 ? "border-yellow-500/30 bg-yellow-500/8" : "border-white/8 bg-white/3"
                }`}>
                <motion.div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    i === 0 ? "bg-yellow-500/20 border-2 border-yellow-500/50" : "bg-white/8"
                  }`}
                  animate={i === 0 ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {w.avatar}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Trophy className={`h-3.5 w-3.5 ${i === 0 ? "text-yellow-400" : "text-white/30"}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 ? "text-yellow-400" : "text-white/30"}`}>{w.month}</span>
                  </div>
                  <h3 className={`font-display text-lg mt-0.5 ${i === 0 ? "text-white" : "text-white/70"}`}>{w.name}</h3>
                  <p className={`text-xs mt-0.5 ${i === 0 ? "text-yellow-400/80" : "text-white/25"}`}>{w.votes} votes received</p>
                </div>
                {i === 0 && (
                  <motion.div className="text-2xl" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>🥇</motion.div>
                )}
              </motion.div>
            ))}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-white/50 text-sm font-bold">Could you be next?</p>
              <p className="text-white/30 text-xs mt-1">Vote every month and nominate deserving fans to earn Supporter Points</p>
              <motion.button onClick={() => setTab("vote")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="mt-3 bg-primary text-black text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-lg">
                Back to Voting
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Nomination modal ── */}
      <AnimatePresence>
        {showNominate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) setShowNominate(false); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-md rounded-2xl border border-white/10 p-5 space-y-4"
              style={{ background: "hsl(140 10% 7%)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg text-white uppercase">Nominate a Fan</h3>
                  <p className="text-white/40 text-xs">Earn +25 Supporter Points for nominating</p>
                </div>
                <motion.button onClick={() => { setShowNominate(false); setFormError(""); }}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="text-white/30 hover:text-white transition-colors p-1">
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-1.5">Fan's Name *</label>
                  <input
                    value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormError(""); }}
                    placeholder="Who deserves the crown this month?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/60 placeholder-white/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-1.5">Why do they deserve it? *</label>
                  <textarea
                    value={form.reason}
                    onChange={e => { setForm(f => ({ ...f, reason: e.target.value })); setFormError(""); }}
                    placeholder="Tell us what makes this fan special — their dedication, community spirit, or memorable moments supporting the Arrows…"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/60 placeholder-white/20 transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-white/20 text-[10px] mt-1">{form.reason.length} chars · minimum 20</p>
                </div>

                <div>
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-1.5">Your Name (optional)</label>
                  <input
                    value={form.submittedBy}
                    onChange={e => setForm(f => ({ ...f, submittedBy: e.target.value }))}
                    placeholder="Leave blank to post anonymously"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/60 placeholder-white/20 transition-colors"
                  />
                </div>
              </div>

              <AnimatePresence>
                {formError && (
                  <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {formError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <motion.button onClick={() => { setShowNominate(false); setFormError(""); }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="bg-white/5 border border-white/10 rounded-xl py-3 text-white/60 text-sm font-bold hover:bg-white/10 transition-colors">
                  Cancel
                </motion.button>
                <motion.button onClick={submitNomination}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,215,0,0.2)" }} whileTap={{ scale: 0.97 }}
                  className="bg-primary text-black rounded-xl py-3 text-sm font-black uppercase tracking-wide">
                  Submit +25 pts
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
