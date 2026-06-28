import { useListResults } from "@workspace/api-client-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import { MapPin, ChevronDown, FileText, Share2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/TeamCrest";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";

function getOutcome(result: { homeTeam: string; homeScore: number; awayScore: number }) {
  const isHome =
    result.homeTeam.toLowerCase().includes("arrows") ||
    result.homeTeam.toLowerCase().includes("golden");
  const ours = isHome ? result.homeScore : result.awayScore;
  const theirs = isHome ? result.awayScore : result.homeScore;
  if (ours > theirs) return "W";
  if (ours < theirs) return "L";
  return "D";
}

const OUTCOME_STYLES = {
  W: { pill: "border-green-500/40 text-green-400 bg-green-500/10", label: "Win" },
  D: { pill: "border-yellow-400/40 text-yellow-400 bg-yellow-400/10", label: "Draw" },
  L: { pill: "border-red-500/40 text-red-400 bg-red-500/10", label: "Loss" },
};

function ResultCard({ result, index }: { result: any; index: number }) {
  const [open, setOpen] = useState(false);
  const outcome = getOutcome(result);
  const styles = OUTCOME_STYLES[outcome];
  const matchDate = new Date(result.date);

  function handleShare() {
    const text = `${result.homeTeam} ${result.homeScore}–${result.awayScore} ${result.awayTeam} | ${format(matchDate, "d MMM yyyy")}`;
    if (navigator.share) {
      navigator.share({ title: "Golden Arrows Result", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`bg-card border rounded-xl overflow-hidden transition-colors duration-200 ${
        open ? "border-primary/40" : "border-white/5 hover:border-primary/20"
      }`}
    >
      {/* ── Clickable main row ── */}
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left focus:outline-none">
        <div className="flex items-stretch">
          {/* Competition + date pill */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-4 py-3 bg-black/20 border-r border-white/5 min-w-[90px] flex-shrink-0">
            <span className="text-primary font-bold text-[10px] uppercase tracking-widest text-center leading-tight">
              {result.competition}
            </span>
            <span className="text-muted-foreground text-[10px] mt-1 text-center">
              {format(matchDate, "d MMM")}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${styles.pill.split(" ")[1]}`}>
              {styles.label}
            </span>
          </div>

          {/* Teams + score row */}
          <div className="flex-1 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3">
            {/* Home */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="font-display font-bold text-xs sm:text-sm text-right truncate">
                {result.homeTeam}
              </span>
              <TeamCrest name={result.homeTeam} size="sm" />
            </div>

            {/* Score badge */}
            <div className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 sm:px-4 py-1.5 border rounded-lg ${styles.pill}`}>
              <span className="font-display font-bold text-base sm:text-lg leading-none tabular-nums">
                {result.homeScore}–{result.awayScore}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider opacity-70">FT</span>
            </div>

            {/* Away */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TeamCrest name={result.awayTeam} size="sm" />
              <span className="font-display font-bold text-xs sm:text-sm truncate">
                {result.awayTeam}
              </span>
            </div>
          </div>

          {/* Right meta strip */}
          <div className="hidden md:flex flex-col items-end justify-center gap-0.5 px-4 py-3 bg-black/10 border-l border-white/5 flex-shrink-0 min-w-[130px]">
            {result.venue && (
              <span className="text-muted-foreground text-[10px] text-right truncate max-w-[120px] leading-tight">
                {result.venue}
              </span>
            )}
            <span className="text-primary/50 text-[10px] font-bold uppercase tracking-wide">
              {format(matchDate, "d MMM yyyy")}
            </span>
          </div>

          {/* Expand chevron */}
          <div className="flex items-center pr-3 pl-1 flex-shrink-0">
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
            </motion.div>
          </div>
        </div>

        {/* Mobile: competition strip */}
        <div className="sm:hidden flex items-center justify-between px-3 py-1.5 bg-black/20 border-t border-white/5">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary text-[10px] uppercase tracking-wider font-bold py-0 h-5"
          >
            {result.competition}
          </Badge>
          <span className={`text-[10px] font-black uppercase tracking-widest ${styles.pill.split(" ")[1]}`}>
            {format(matchDate, "d MMM yyyy")} · {styles.label}
          </span>
        </div>
      </button>

      {/* ── Expandable detail panel ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                {result.venue && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <span>{result.venue}</span>
                  </div>
                )}
                {result.scorers && result.scorers.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                    <span>{Array.isArray(result.scorers) ? result.scorers.join(", ") : result.scorers}</span>
                  </div>
                )}
                {result.matchReport && (
                  <p className="text-xs text-muted-foreground/70 italic leading-relaxed line-clamp-2 max-w-md">
                    {result.matchReport}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary rounded-lg px-3 py-2 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <Link
                  href={`/results/${result.id}`}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  className="flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" /> Match Report
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Results() {
  const { data: results, isLoading } = useListResults({ limit: 20 });

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="2024/25 Season"
        title="Match"
        highlight="Results"
        description="All recent results for Abafana Bes'thende across all competitions."
      />

      <PageWrapper page="results">
        {isLoading && (
          <div className="text-center text-muted-foreground py-20">Loading results...</div>
        )}
        {!isLoading && (!results || results.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No results available.</div>
        )}

        <div className="space-y-2">
          {results?.map((result, i) => (
            <ResultCard key={result.id} result={result} index={i} />
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}
