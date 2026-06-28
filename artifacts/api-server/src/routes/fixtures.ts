import { Router } from "express";
import { db } from "@workspace/db";
import { fixturesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { ListFixturesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/fixtures", async (req, res) => {
  const query = ListFixturesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  let dbQuery = db
    .select()
    .from(fixturesTable)
    .where(eq(fixturesTable.completed, false))
    .orderBy(asc(fixturesTable.date))
    .$dynamic();
  if (query.data.competition) {
    dbQuery = dbQuery.where(eq(fixturesTable.competition, query.data.competition));
  }
  const limit = query.data.limit ?? 20;
  const rows = await dbQuery.limit(Number(limit));
  res.json(rows.map(mapFixture));
});

router.get("/fixtures/next", async (_req, res) => {
  const [row] = await db
    .select()
    .from(fixturesTable)
    .where(eq(fixturesTable.completed, false))
    .orderBy(asc(fixturesTable.date))
    .limit(1);
  if (!row) {
    res.json(null);
    return;
  }
  res.json(mapFixture(row));
});

router.post("/fixtures", async (req, res) => {
  const { date, time, homeTeam, awayTeam, competition, venue, ticketUrl } = req.body;
  if (!date || !homeTeam || !awayTeam || !competition || !venue) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [row] = await db.insert(fixturesTable).values({
    date, time: time || null, homeTeam, awayTeam, competition, venue,
    ticketUrl: ticketUrl || null, completed: false,
  }).returning();
  res.status(201).json(mapFixture(row));
});

router.patch("/fixtures/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const updates: Record<string, unknown> = {};
  const fields = ["date","time","homeTeam","awayTeam","competition","venue","ticketUrl","completed"];
  for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
  const [row] = await db.update(fixturesTable).set(updates).where(eq(fixturesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapFixture(row));
});

router.delete("/fixtures/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(fixturesTable).where(eq(fixturesTable.id, id));
  res.status(204).end();
});

function mapFixture(row: typeof fixturesTable.$inferSelect) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    homeTeam: row.homeTeam,
    awayTeam: row.awayTeam,
    competition: row.competition,
    venue: row.venue,
    ticketUrl: row.ticketUrl,
    completed: row.completed,
  };
}

export default router;
