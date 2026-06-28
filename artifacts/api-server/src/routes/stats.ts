import { Router } from "express";
import { db } from "@workspace/db";
import { resultsTable, leagueTableTable, playersTable } from "@workspace/db";
import { eq, sum, desc } from "drizzle-orm";

const router = Router();

router.get("/stats/summary", async (_req, res) => {
  // Get Golden Arrows row from league table
  const [gaRow] = await db
    .select()
    .from(leagueTableTable)
    .where(eq(leagueTableTable.isGoldenArrows, true))
    .limit(1);

  // Get all results
  const allResults = await db.select().from(resultsTable).orderBy(desc(resultsTable.date));

  // Calculate stats from results
  let goalsScored = 0;
  let goalsConceded = 0;
  let cleanSheets = 0;

  for (const r of allResults) {
    const isHome = r.homeTeam.toLowerCase().includes("arrows") || r.homeTeam.toLowerCase().includes("golden");
    const ourGoals = isHome ? r.homeScore : r.awayScore;
    const theirGoals = isHome ? r.awayScore : r.homeScore;
    goalsScored += ourGoals;
    goalsConceded += theirGoals;
    if (theirGoals === 0) cleanSheets++;
  }

  // Top scorer — player with most goals
  const [topScorerRow] = await db
    .select()
    .from(playersTable)
    .orderBy(desc(playersTable.goals))
    .limit(1);

  const played = gaRow?.played ?? allResults.length;
  const won = gaRow?.won ?? 0;
  const drawn = gaRow?.drawn ?? 0;
  const lost = gaRow?.lost ?? 0;
  const points = gaRow?.points ?? 0;
  const winRate = played > 0 ? Math.round((won / played) * 100) / 100 : 0;

  res.json({
    leaguePosition: gaRow?.position ?? 0,
    played,
    won,
    drawn,
    lost,
    goalsScored: gaRow?.goalsFor ?? goalsScored,
    goalsConceded: gaRow?.goalsAgainst ?? goalsConceded,
    points,
    topScorer: topScorerRow?.name ?? "N/A",
    topScorerGoals: topScorerRow?.goals ?? 0,
    cleanSheets,
    winRate,
  });
});

export default router;
