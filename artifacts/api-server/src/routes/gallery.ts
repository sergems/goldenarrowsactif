import { Router } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ListGalleryQueryParams, CreateGalleryItemBody, DeleteGalleryItemParams } from "@workspace/api-zod";

const router = Router();

router.get("/gallery", async (req, res) => {
  const query = ListGalleryQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  let dbQuery = db.select().from(galleryTable).orderBy(desc(galleryTable.publishedAt)).$dynamic();
  if (query.data.category) {
    dbQuery = dbQuery.where(eq(galleryTable.category, query.data.category));
  }
  if (query.data.type) {
    dbQuery = dbQuery.where(eq(galleryTable.type, query.data.type));
  }
  const limit = query.data.limit ?? 50;
  const rows = await dbQuery.limit(Number(limit));
  res.json(rows.map(mapGallery));
});

router.post("/gallery", async (req, res) => {
  const body = CreateGalleryItemBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(galleryTable).values(body.data).returning();
  res.status(201).json(mapGallery(row));
});

router.delete("/gallery/:id", async (req, res) => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
  res.status(204).send();
});

function mapGallery(row: typeof galleryTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    url: row.url,
    thumbnailUrl: row.thumbnailUrl,
    category: row.category,
    caption: row.caption,
    publishedAt: row.publishedAt.toISOString(),
  };
}

export default router;
