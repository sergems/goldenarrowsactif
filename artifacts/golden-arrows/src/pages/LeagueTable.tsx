import { useGetLeagueTable } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { TeamCrest } from "@/components/TeamCrest";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function LeagueTable() {
  const { data, isLoading } = useGetLeagueTable();
  const table = data?.entries;

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="DStv Premiership"
        title="PSL League"
        highlight="Table"
        description="DStv Premiership · 2025/2026 Season"
      />

      <PageWrapper page="table">
            {isLoading && <div className="text-center text-muted-foreground py-20">Loading table...</div>}

            {table && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-white/5 rounded-xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-black/30 text-muted-foreground border-b border-white/5">
                        <th className="px-3 sm:px-4 py-3 text-left font-bold uppercase tracking-wider w-10">#</th>
                        <th className="px-3 sm:px-4 py-3 text-left font-bold uppercase tracking-wider">Club</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10">P</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10">W</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10">D</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10">L</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10 hidden sm:table-cell">GF</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10 hidden sm:table-cell">GA</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-10">GD</th>
                        <th className="px-2 sm:px-4 py-3 text-center font-bold uppercase tracking-wider w-12">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {table.map((row, i) => (
                        <motion.tr
                          key={row.team}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className={row.isGoldenArrows ? "bg-primary/10 border-l-4 border-l-primary font-bold" : "hover:bg-white/2"}
                        >
                          <td className={`px-3 sm:px-4 py-3 text-left font-display font-bold ${row.isGoldenArrows ? "text-primary text-lg" : "text-muted-foreground"}`}>
                            {row.position}
                          </td>
                          <td className={`px-3 sm:px-4 py-3 text-left font-display font-bold ${row.isGoldenArrows ? "text-primary" : ""}`}>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <TeamCrest name={row.team} logoUrl={row.logoUrl} size="xs" />
                              <span className="truncate max-w-[120px] sm:max-w-none">{row.team}</span>
                              {row.isGoldenArrows && (
                                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded uppercase tracking-wider hidden md:inline flex-shrink-0">
                                  Our Club
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-center">{row.played}</td>
                          <td className="px-2 sm:px-4 py-3 text-center text-green-400">{row.won}</td>
                          <td className="px-2 sm:px-4 py-3 text-center text-yellow-400">{row.drawn}</td>
                          <td className="px-2 sm:px-4 py-3 text-center text-red-400">{row.lost}</td>
                          <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">{row.goalsFor}</td>
                          <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">{row.goalsAgainst}</td>
                          <td className={`px-2 sm:px-4 py-3 text-center ${row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : ""}`}>
                            {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                          </td>
                          <td className={`px-2 sm:px-4 py-3 text-center font-display font-black text-lg ${row.isGoldenArrows ? "text-primary" : ""}`}>
                            {row.points}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {!isLoading && (!table || table.length === 0) && (
              <div className="text-center text-muted-foreground py-20">No standings data available.</div>
            )}
      </PageWrapper>
    </div>
  );
}
