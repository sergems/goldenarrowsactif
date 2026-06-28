import { Router } from "express";
import { db } from "@workspace/db";
import { resultsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ListResultsQueryParams, GetResultParams, CreateResultBody } from "@workspace/api-zod";

const router = Router();

router.post("/results", async (req, res) => {
  const body = CreateResultBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body", details: body.error.issues });
    return;
  }
  const [row] = await db.insert(resultsTable).values(body.data).returning();
  res.status(201).json(mapResult(row));
});

router.get("/results", async (req, res) => {
  const query = ListResultsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const limit = query.data.limit ?? 20;
  const rows = await db
    .select()
    .from(resultsTable)
    .orderBy(desc(resultsTable.date))
    .limit(Number(limit));
  res.json(rows.map(mapResult));
});

router.get("/results/:id", async (req, res) => {
  const params = GetResultParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const [row] = await db.select().from(resultsTable).where(eq(resultsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapResult(row));
});

router.patch("/results/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const fields = ["date","homeTeam","awayTeam","homeScore","awayScore","competition","venue","scorers","matchReport","highlightUrl"];
  const updates: Record<string, unknown> = {};
  for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
  const [row] = await db.update(resultsTable).set(updates).where(eq(resultsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapResult(row));
});

router.delete("/results/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(resultsTable).where(eq(resultsTable.id, id));
  res.status(204).end();
});

function mapResult(row: typeof resultsTable.$inferSelect) {
  return {
    id: row.id,
    date: row.date,
    homeTeam: row.homeTeam,
    awayTeam: row.awayTeam,
    homeScore: row.homeScore,
    awayScore: row.awayScore,
    competition: row.competition,
    venue: row.venue,
    scorers: row.scorers,
    matchReport: row.matchReport,
    highlightUrl: row.highlightUrl,
  };
}

export default router;
