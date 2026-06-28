import { Router } from "express";
import { db } from "@workspace/db";
import { newsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  ListNewsQueryParams,
  CreateNewsBody,
  GetNewsArticleParams,
  UpdateNewsParams,
  UpdateNewsBody,
  DeleteNewsParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/news", async (req, res) => {
  const query = ListNewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { category, featured, limit = 20, offset = 0 } = query.data;
  let dbQuery = db.select().from(newsTable).orderBy(desc(newsTable.publishedAt)).$dynamic();
  if (category) dbQuery = dbQuery.where(eq(newsTable.category, category));
  if (featured !== undefined) dbQuery = dbQuery.where(eq(newsTable.featured, featured));
  const rows = await dbQuery.limit(Number(limit)).offset(Number(offset));
  res.json(rows.map(mapNews));
});

router.post("/news", async (req, res) => {
  const body = CreateNewsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(newsTable).values(body.data).returning();
  res.status(201).json(mapNews(row));
});

router.get("/news/:id", async (req, res) => {
  const params = GetNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const [row] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapNews(row));
});

router.put("/news/:id", async (req, res) => {
  const params = UpdateNewsParams.safeParse(req.params);
  const body = UpdateNewsBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [row] = await db.update(newsTable).set(body.data).where(eq(newsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapNews(row));
});

router.delete("/news/:id", async (req, res) => {
  const params = DeleteNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
  res.status(204).send();
});

function mapNews(row: typeof newsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    imageUrl: row.imageUrl,
    featured: row.featured,
    author: row.author,
    tags: row.tags,
    publishedAt: row.publishedAt.toISOString(),
  };
}

export default router;
