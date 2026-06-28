import { Router } from "express";
import { db } from "@workspace/db";
import { sponsorsTable } from "@workspace/db";

const router = Router();

router.get("/sponsors", async (_req, res) => {
  const rows = await db.select().from(sponsorsTable);
  res.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      logoUrl: row.logoUrl,
      websiteUrl: row.websiteUrl,
      tier: row.tier,
    }))
  );
});

export default router;
