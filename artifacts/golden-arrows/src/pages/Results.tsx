import { useListResults } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import { TeamCrest } from "@/components/TeamCrest";
import { AdColumn } from "@/components/AdBanner";

function getOutcome(result: { homeTeam: string; homeScore: number; awayScore: number }) {
  const isHome = result.homeTeam.toLowerCase().includes("arrows") || result.homeTeam.toLowerCase().includes("golden");
  const ourScore = isHome ? result.homeScore : result.awayScore;
  const theirScore = isHome ? result.awayScore : result.homeScore;
  if (ourScore > theirScore) return "W";
  if (ourScore < theirScore) return "L";
  return "D";
}

export default function Results() {
  const { data: results, isLoading } = useListResults({ limit: 20 });

  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Match <span className="text-primary">Results</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            All recent results for Abafana Bes'thende across all competitions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex gap-6 items-start">
          <div className="hidden xl:block w-40 flex-shrink-0">
            <AdColumn page="results" side="left" />
          </div>

          <div className="flex-1 min-w-0">
            {isLoading && <div className="text-center text-muted-foreground py-20">Loading results...</div>}
            <div className="space-y-3">
              {results?.map((result, i) => {
                const outcome = getOutcome(result);
                const outcomeColor = outcome === "W" ? "text-green-400" : outcome === "L" ? "text-red-400" : "text-yellow-400";
                const outcomeBg = outcome === "W" ? "bg-green-500/10 border-green-500/30" : outcome === "L" ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30";

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link href={`/results/${result.id}`} className="block">
                      <div className="bg-card border border-white/5 rounded-xl px-3 py-3 md:p-6 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2 md:hidden">
                          <div className={`h-8 w-8 flex-shrink-0 rounded-lg border ${outcomeBg} flex items-center justify-center font-display font-bold text-sm ${outcomeColor}`}>
                            {outcome}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-muted-foreground mb-0.5">{format(new Date(result.date), "MMM d")} · {result.competition}</div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1 flex-1 justify-end min-w-0">
                                <TeamCrest name={result.homeTeam} size="xs" />
                                <span className="font-bold text-xs truncate">{result.homeTeam}</span>
                              </div>
                              <span className="bg-background border border-white/10 px-2 py-0.5 rounded font-display font-bold text-sm text-primary flex-shrink-0">
                                {result.homeScore}–{result.awayScore}
                              </span>
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                <TeamCrest name={result.awayTeam} size="xs" />
                                <span className="font-bold text-xs truncate">{result.awayTeam}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                          <div className={`h-10 w-10 flex-shrink-0 rounded-lg border ${outcomeBg} flex items-center justify-center font-display font-bold text-lg ${outcomeColor}`}>
                            {outcome}
                          </div>
                          <div className="text-center flex-1">
                            <div className="text-xs text-muted-foreground mb-1">{format(new Date(result.date), "MMM d, yyyy")} &bull; {result.competition}</div>
                            <div className="flex items-center justify-center gap-4">
                              <div className="flex items-center gap-2 flex-1 justify-end">
                                <span className="font-display font-bold text-lg">{result.homeTeam}</span>
                                <TeamCrest name={result.homeTeam} size="sm" />
                              </div>
                              <div className="bg-background border border-white/10 px-4 py-2 rounded-lg font-display font-bold text-xl text-primary flex-shrink-0">
                                {result.homeScore} – {result.awayScore}
                              </div>
                              <div className="flex items-center gap-2 flex-1 justify-start">
                                <TeamCrest name={result.awayTeam} size="sm" />
                                <span className="font-display font-bold text-lg">{result.awayTeam}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            <div>{result.venue}</div>
                            <div className="text-primary mt-1 font-bold uppercase tracking-wider">Match Report &rarr;</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {!isLoading && (!results || results.length === 0) && (
              <div className="text-center text-muted-foreground py-20">No results available.</div>
            )}
          </div>

          <div className="hidden xl:block w-40 flex-shrink-0">
            <AdColumn page="results" side="right" />
          </div>
        </div>
      </div>
    </div>
  );
}
