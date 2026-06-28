import { Router } from "express";
import { db } from "@workspace/db";
import { leagueTableTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router = Router();

function mapRow(row: typeof leagueTableTable.$inferSelect) {
  return {
    id: row.id,
    season: row.season,
    position: row.position,
    team: row.team,
    logoUrl: row.logoUrl,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.goalDifference,
    points: row.points,
    isGoldenArrows: row.isGoldenArrows,
  };
}

router.get("/league/table", async (_req, res) => {
  const rows = await db.select().from(leagueTableTable).orderBy(asc(leagueTableTable.position));
  const season = rows[0]?.season ?? 0;
  res.json({ season, entries: rows.map(mapRow) });
});

router.patch("/league/table/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const fields = ["position","team","logoUrl","played","won","drawn","lost","goalsFor","goalsAgainst","goalDifference","points","isGoldenArrows"];
  const updates: Record<string, unknown> = {};
  for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
  updates.updatedAt = new Date();
  const [row] = await db.update(leagueTableTable).set(updates).where(eq(leagueTableTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapRow(row));
});

router.put("/league/table", async (req, res) => {
  const entries = req.body as Array<{
    position: number; team: string; played: number; won: number; drawn: number; lost: number;
    goalsFor: number; goalsAgainst: number; goalDifference: number; points: number;
    isGoldenArrows?: boolean; logoUrl?: string;
  }>;
  if (!Array.isArray(entries) || entries.length === 0) {
    res.status(400).json({ error: "Expected non-empty array" });
    return;
  }
  await db.delete(leagueTableTable);
  const rows = await db.insert(leagueTableTable).values(
    entries.map(e => ({
      position: e.position, team: e.team, played: e.played, won: e.won,
      drawn: e.drawn, lost: e.lost, goalsFor: e.goalsFor, goalsAgainst: e.goalsAgainst,
      goalDifference: e.goalDifference, points: e.points,
      isGoldenArrows: e.isGoldenArrows ?? false, logoUrl: e.logoUrl ?? null,
    }))
  ).returning();
  res.json(rows.map(mapRow));
});

export default router;
