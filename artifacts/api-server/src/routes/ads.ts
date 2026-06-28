import { Router } from "express";
import { db } from "@workspace/db";
import { adsTable, AD_SLOTS } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function ensureSlots() {
  for (const slot of AD_SLOTS) {
    await db
      .insert(adsTable)
      .values({ slot, imageUrl: null, linkUrl: null, altText: null })
      .onConflictDoNothing();
  }
}

router.get("/ads", async (_req, res) => {
  await ensureSlots();
  const ads = await db.select().from(adsTable).orderBy(adsTable.slot);
  res.json(ads);
});

router.get("/ads/:slot", async (req, res) => {
  await ensureSlots();
  const [ad] = await db.select().from(adsTable).where(eq(adsTable.slot, req.params.slot));
  if (!ad) { res.status(404).json({ error: "Ad slot not found" }); return; }
  res.json(ad);
});

router.put("/ads/:slot", async (req, res) => {
  if (!AD_SLOTS.includes(req.params.slot as typeof AD_SLOTS[number])) {
    res.status(400).json({ error: "Invalid ad slot" });
    return;
  }
  await ensureSlots();
  const { imageUrl, linkUrl, altText } = req.body as { imageUrl?: string | null; linkUrl?: string | null; altText?: string | null };
  const [updated] = await db
    .insert(adsTable)
    .values({ slot: req.params.slot, imageUrl: imageUrl ?? null, linkUrl: linkUrl ?? null, altText: altText ?? null })
    .onConflictDoUpdate({
      target: adsTable.slot,
      set: {
        imageUrl: imageUrl ?? null,
        linkUrl: linkUrl ?? null,
        altText: altText ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();
  res.json(updated);
});

export default router;
