import { useGetLeagueTable } from "@workspace/api-client-react";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeamCrest } from "@/components/TeamCrest";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChevronDown, TrendingUp, TrendingDown, Minus, ArrowUpDown } from "lucide-react";

type SortKey = "points" | "goalDifference" | "goalsFor" | "won" | "played";

const ZONES = [
  { label: "CAF Champions League", positions: [1, 2], color: "bg-blue-500", textColor: "text-blue-400", border: "border-l-blue-500" },
  { label: "CAF Confederation Cup", positions: [3, 4], color: "bg-orange-400", textColor: "text-orange-400", border: "border-l-orange-400" },
  { label: "Relegation Playoff", positions: [15], color: "bg-amber-500", textColor: "text-amber-400", border: "border-l-amber-500" },
  { label: "Relegation", positions: [16], color: "bg-red-600", textColor: "text-red-400", border: "border-l-red-600" },
];

function getZone(pos: number) {
  return ZONES.find(z => z.positions.includes(pos));
}

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-bold text-white/80 w-6 text-right">{value}</span>
    </div>
  );
}

function FormBadge({ result }: { result: string }) {
  const r = result.toUpperCase();
  if (r === "W") return <span className="w-5 h-5 rounded-full bg-green-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">W</span>;
  if (r === "D") return <span className="w-5 h-5 rounded-full bg-yellow-400 text-black text-[9px] font-black flex items-center justify-center flex-shrink-0">D</span>;
  return <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">L</span>;
}

export default function LeagueTable() {
  const { data, isLoading } = useGetLeagueTable();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rawTable = data?.entries ?? [];

  const maxPts = Math.max(...rawTable.map(r => r.points), 1);
  const maxGF = Math.max(...rawTable.map(r => r.goalsFor), 1);
  const maxW = Math.max(...rawTable.map(r => r.won), 1);

  const sorted = [...rawTable].sort((a, b) => {
    const dir = sortDir === "desc" ? -1 : 1;
    return (a[sortKey] - b[sortKey]) * dir;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortTh({ label, skey, className = "" }: { label: string; skey: SortKey; className?: string }) {
    const active = sortKey === skey;
    return (
      <th
        className={`px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10 cursor-pointer select-none transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-white"} ${className}`}
        onClick={() => handleSort(skey)}
      >
        <span className="flex items-center justify-center gap-0.5">
          {label}
          <ArrowUpDown className={`h-2.5 w-2.5 ${active ? "opacity-100" : "opacity-30"}`} />
        </span>
      </th>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="DStv Premiership"
        title="PSL League"
        highlight="Table"
        description="DStv Premiership · 2025/2026 Season. Click any team for a detailed breakdown."
      />

      <PageWrapper page="table">
        {isLoading && <div className="text-center text-muted-foreground py-20">Loading table...</div>}

        {/* Zone legend */}
        {rawTable.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {ZONES.map(z => (
              <div key={z.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className={`w-2 h-4 rounded-sm ${z.color}`} />
                <span>{z.label}</span>
              </div>
            ))}
          </div>
        )}

        {rawTable.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-white/5 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-black/30 border-b border-white/5">
                    <th className="px-3 sm:px-4 py-3 text-left font-bold uppercase tracking-wider w-10 text-muted-foreground">#</th>
                    <th className="px-3 sm:px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground">Club</th>
                    <SortTh label="P" skey="played" />
                    <SortTh label="W" skey="won" />
                    <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10 text-muted-foreground">D</th>
                    <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10 text-muted-foreground">L</th>
                    <SortTh label="GF" skey="goalsFor" className="hidden sm:table-cell" />
                    <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10 hidden sm:table-cell text-muted-foreground">GA</th>
                    <SortTh label="GD" skey="goalDifference" />
                    <SortTh label="Pts" skey="points" />
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => {
                    const zone = getZone(row.position);
                    const isOpen = expanded === row.team;
                    const isGA = row.isGoldenArrows;
                    const form: string[] = (row as any).form
                      ? ((row as any).form as string).split("").filter(Boolean)
                      : [];

                    return (
                      <Fragment key={row.team}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setExpanded(isOpen ? null : row.team)}
                          className={`cursor-pointer transition-colors duration-150 border-b border-white/5 last:border-0 ${
                            isGA
                              ? "bg-primary/10 border-l-4 border-l-primary font-bold"
                              : zone
                              ? `border-l-4 ${zone.border} hover:bg-white/3`
                              : "border-l-4 border-l-transparent hover:bg-white/3"
                          } ${isOpen ? "bg-white/5" : ""}`}
                        >
                          <td className={`px-3 sm:px-4 py-3 text-left font-display font-bold ${isGA ? "text-primary text-lg" : "text-muted-foreground"}`}>
                            {row.position}
                          </td>
                          <td className={`px-3 sm:px-4 py-3 text-left font-display font-bold ${isGA ? "text-primary" : ""}`}>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <TeamCrest name={row.team} logoUrl={row.logoUrl} size="xs" />
                              <span className="truncate max-w-[120px] sm:max-w-none">{row.team}</span>
                              {isGA && (
                                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded uppercase tracking-wider hidden md:inline flex-shrink-0">
                                  Our Club
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-center">{row.played}</td>
                          <td className="px-2 sm:px-4 py-3 text-center text-green-400 font-bold">{row.won}</td>
                          <td className="px-2 sm:px-4 py-3 text-center text-yellow-400">{row.drawn}</td>
                          <td className="px-2 sm:px-4 py-3 text-center text-red-400">{row.lost}</td>
                          <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">{row.goalsFor}</td>
                          <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">{row.goalsAgainst}</td>
                          <td className={`px-2 sm:px-4 py-3 text-center font-bold ${row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                            <span className="flex items-center justify-center gap-0.5">
                              {row.goalDifference > 0 ? <TrendingUp className="h-3 w-3" /> : row.goalDifference < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                              {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                            </span>
                          </td>
                          <td className={`px-2 sm:px-4 py-3 text-center font-display font-black text-lg ${isGA ? "text-primary" : ""}`}>
                            {row.points}
                          </td>
                          <td className="pr-3 text-center">
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40" />
                            </motion.div>
                          </td>
                        </motion.tr>

                        {/* Expanded detail row */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <tr key={`${row.team}-detail`}>
                              <td colSpan={11} className="p-0 border-b border-white/10">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 sm:px-8 py-5 bg-black/20 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {/* Win/Draw/Loss breakdown */}
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Results Breakdown</p>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-green-400 font-bold w-4">W</span>
                                          <StatBar value={row.won} max={row.played} color="bg-green-500" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-yellow-400 font-bold w-4">D</span>
                                          <StatBar value={row.drawn} max={row.played} color="bg-yellow-400" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-red-400 font-bold w-4">L</span>
                                          <StatBar value={row.lost} max={row.played} color="bg-red-500" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Goals breakdown */}
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Goals</p>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-white/60 font-bold w-6">For</span>
                                          <StatBar value={row.goalsFor} max={maxGF} color="bg-primary" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-white/60 font-bold w-6">Ag</span>
                                          <StatBar value={row.goalsAgainst} max={maxGF} color="bg-white/20" />
                                        </div>
                                      </div>
                                      <div className={`mt-3 text-xs font-bold ${row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                                        Goal difference: {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                                      </div>
                                    </div>

                                    {/* Points + zone */}
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Standing</p>
                                      <div className="flex items-end gap-2 mb-3">
                                        <span className={`font-display font-black text-4xl ${isGA ? "text-primary" : "text-white"}`}>{row.points}</span>
                                        <span className="text-muted-foreground text-xs mb-1.5">pts from {row.played} games</span>
                                      </div>
                                      <StatBar value={row.points} max={maxPts} color={isGA ? "bg-primary" : "bg-white/40"} />
                                      {zone && (
                                        <div className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${zone.textColor}`}>
                                          ● {zone.label} zone
                                        </div>
                                      )}
                                      {form.length > 0 && (
                                        <div className="mt-3">
                                          <p className="text-[10px] text-muted-foreground mb-1.5">Recent form</p>
                                          <div className="flex gap-1">
                                            {form.slice(-5).map((r, fi) => <FormBadge key={fi} result={r} />)}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {!isLoading && rawTable.length === 0 && (
          <div className="text-center text-muted-foreground py-20">No standings data available.</div>
        )}
      </PageWrapper>
    </div>
  );
}
