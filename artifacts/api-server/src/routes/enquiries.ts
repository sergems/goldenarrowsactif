import { Router } from "express";
import { db } from "@workspace/db";
import { enquiriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateEnquiryBody,
  ListEnquiriesQueryParams,
  UpdateEnquiryParams,
  UpdateEnquiryBody,
  DeleteEnquiryParams,
} from "@workspace/api-zod";

const router = Router();

router.post("/enquiries", async (req, res) => {
  const body = CreateEnquiryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body", details: body.error.issues });
    return;
  }
  const [row] = await db.insert(enquiriesTable).values(body.data).returning();
  res.status(201).json(mapEnquiry(row));
});

router.get("/enquiries", async (req, res) => {
  const query = ListEnquiriesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { status, limit = 50, offset = 0 } = query.data;
  let dbQuery = db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt)).$dynamic();
  if (status) dbQuery = dbQuery.where(eq(enquiriesTable.status, status));
  const rows = await dbQuery.limit(Number(limit)).offset(Number(offset));
  res.json(rows.map(mapEnquiry));
});

router.patch("/enquiries/:id", async (req, res) => {
  const params = UpdateEnquiryParams.safeParse(req.params);
  const body = UpdateEnquiryBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [row] = await db
    .update(enquiriesTable)
    .set(body.data)
    .where(eq(enquiriesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(mapEnquiry(row));
});

router.delete("/enquiries/:id", async (req, res) => {
  const params = DeleteEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  await db.delete(enquiriesTable).where(eq(enquiriesTable.id, params.data.id));
  res.status(204).send();
});

function mapEnquiry(row: typeof enquiriesTable.$inferSelect) {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;
