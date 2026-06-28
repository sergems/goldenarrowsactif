import { Router } from "express";
import { db } from "@workspace/db";
import { staffTable } from "@workspace/db";
import { CreateStaffBody } from "@workspace/api-zod";

const router = Router();

router.get("/staff", async (_req, res) => {
  const rows = await db.select().from(staffTable);
  res.json(rows.map(mapStaff));
});

router.post("/staff", async (req, res) => {
  const body = CreateStaffBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(staffTable).values(body.data).returning();
  res.status(201).json(mapStaff(row));
});

function mapStaff(row: typeof staffTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photoUrl: row.photoUrl,
    bio: row.bio,
    nationality: row.nationality,
    instagram: row.instagram,
    facebook: row.facebook,
    twitter: row.twitter,
  };
}

export default router;
