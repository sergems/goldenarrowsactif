import { Router } from "express";
import { db } from "@workspace/db";
import { slidesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateSlideBody, UpdateSlideBody, UpdateSlideParams, DeleteSlideParams } from "@workspace/api-zod";

const router = Router();

router.get("/slides", async (_req, res) => {
  const rows = await db.select().from(slidesTable).orderBy(asc(slidesTable.sortOrder));
  res.json(rows.map(mapSlide));
});

router.post("/slides", async (req, res) => {
  const body = CreateSlideBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body", details: body.error.issues });
    return;
  }
  const [row] = await db.insert(slidesTable).values(body.data).returning();
  res.status(201).json(mapSlide(row));
});

router.patch("/slides/:id", async (req, res) => {
  const params = UpdateSlideParams.safeParse(req.params);
  const body = UpdateSlideBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [row] = await db
    .update(slidesTable)
    .set(body.data)
    .where(eq(slidesTable.id, params.data.id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapSlide(row));
});

router.delete("/slides/:id", async (req, res) => {
  const params = DeleteSlideParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid params" }); return; }
  await db.delete(slidesTable).where(eq(slidesTable.id, params.data.id));
  res.status(204).send();
});

function mapSlide(row: typeof slidesTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    subtitle: row.subtitle,
    link: row.link,
    linkLabel: row.linkLabel,
    sortOrder: row.sortOrder,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;
