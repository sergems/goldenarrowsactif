import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

interface Team {
  id: number;
  name: string;
  crestUrl: string | null;
  active: boolean;
  createdAt: string;
}

function mapRow(row: Record<string, unknown>): Team {
  return {
    id: row.id as number,
    name: row.name as string,
    crestUrl: (row.crest_url as string | null) ?? null,
    active: row.active as boolean,
    createdAt: row.created_at as string,
  };
}

router.get("/teams", async (_req, res) => {
  const rows = await db.execute(sql`SELECT * FROM teams ORDER BY name ASC`);
  res.json((rows.rows as Record<string, unknown>[]).map(mapRow));
});

router.post("/teams", async (req, res) => {
  const { name, crestUrl, active = true } = req.body as {
    name?: string;
    crestUrl?: string | null;
    active?: boolean;
  };

  if (!name?.trim()) {
    res.status(400).json({ error: "Team name is required" });
    return;
  }

  const rows = await db.execute(
    sql`INSERT INTO teams (name, crest_url, active)
        VALUES (${name.trim()}, ${crestUrl ?? null}, ${active})
        RETURNING *`
  );
  res.status(201).json(mapRow((rows.rows as Record<string, unknown>[])[0]));
});

router.put("/teams/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, crestUrl, active } = req.body as {
    name?: string;
    crestUrl?: string | null;
    active?: boolean;
  };

  const rows = await db.execute(
    sql`UPDATE teams SET
          name = COALESCE(${name ?? null}, name),
          crest_url = CASE WHEN ${crestUrl !== undefined} THEN ${crestUrl ?? null} ELSE crest_url END,
          active = COALESCE(${active ?? null}, active)
        WHERE id = ${id}
        RETURNING *`
  );

  if ((rows.rows as unknown[]).length === 0) {
    res.status(404).json({ error: "Team not found" });
    return;
  }
  res.json(mapRow((rows.rows as Record<string, unknown>[])[0]));
});

router.delete("/teams/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.execute(sql`DELETE FROM teams WHERE id = ${id}`);
  res.json({ ok: true });
});

export default router;
