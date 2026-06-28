import { Router } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListPlayersQueryParams,
  CreatePlayerBody,
  GetPlayerParams,
  UpdatePlayerParams,
  UpdatePlayerBody,
  DeletePlayerParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/players", async (req, res) => {
  const query = ListPlayersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  let dbQuery = db.select().from(playersTable).$dynamic();
  if (query.data.position) {
    dbQuery = dbQuery.where(eq(playersTable.position, query.data.position));
  }
  const rows = await dbQuery;
  res.json(rows.map(mapPlayer));
});

router.post("/players", async (req, res) => {
  const body = CreatePlayerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(playersTable).values(body.data).returning();
  res.status(201).json(mapPlayer(row));
});

router.get("/players/:id", async (req, res) => {
  const params = GetPlayerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const [row] = await db.select().from(playersTable).where(eq(playersTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapPlayer(row));
});

router.put("/players/:id", async (req, res) => {
  const params = UpdatePlayerParams.safeParse(req.params);
  const body = UpdatePlayerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [row] = await db.update(playersTable).set(body.data).where(eq(playersTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapPlayer(row));
});

router.delete("/players/:id", async (req, res) => {
  const params = DeletePlayerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  await db.delete(playersTable).where(eq(playersTable.id, params.data.id));
  res.status(204).send();
});

function mapPlayer(row: typeof playersTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    number: row.number,
    nationality: row.nationality,
    age: row.age,
    photoUrl: row.photoUrl,
    bio: row.bio,
    appearances: row.appearances,
    goals: row.goals,
    assists: row.assists,
    instagram: row.instagram,
    facebook: row.facebook,
    twitter: row.twitter,
  };
}

export default router;
