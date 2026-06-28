import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/social-posts", async (req, res) => {
  const platform = req.query.platform as string | undefined;
  let query = `SELECT id, platform, post_url, display_order FROM social_posts`;
  if (platform) {
    query += ` WHERE platform = '${platform.replace(/'/g, "''")}'`;
  }
  query += ` ORDER BY display_order ASC`;
  const rows = await db.execute(sql.raw(query));
  res.json(rows.rows);
});

router.post("/social-posts", async (req, res) => {
  const { platform, post_url, display_order } = req.body;
  if (!platform || !post_url) {
    res.status(400).json({ error: "platform and post_url required" });
    return;
  }
  const order = Number(display_order) || 0;
  const rows = await db.execute(
    sql`INSERT INTO social_posts (platform, post_url, display_order) VALUES (${platform}, ${post_url}, ${order}) RETURNING id, platform, post_url, display_order`
  );
  res.status(201).json(rows.rows[0]);
});

router.put("/social-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { post_url, display_order } = req.body;
  if (!post_url) {
    res.status(400).json({ error: "post_url required" });
    return;
  }
  const order = Number(display_order) || 0;
  const rows = await db.execute(
    sql`UPDATE social_posts SET post_url = ${post_url}, display_order = ${order} WHERE id = ${id} RETURNING id, platform, post_url, display_order`
  );
  res.json(rows.rows[0]);
});

router.delete("/social-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.execute(sql`DELETE FROM social_posts WHERE id = ${id}`);
  res.status(204).send();
});

export default router;
