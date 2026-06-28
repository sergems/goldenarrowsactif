import { Router } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

async function getStoredPassword(): Promise<string> {
  const rows = await db.execute(
    sql`SELECT value FROM admin_settings WHERE key = 'admin_password' LIMIT 1`
  );
  const row = rows.rows[0] as { value: string } | undefined;
  return row?.value ?? process.env["ADMIN_PASSWORD"] ?? "";
}

router.post("/admin/login", async (req, res) => {
  const { password } = req.body as { password?: string };

  if (!password) {
    res.status(401).json({ error: "Password required" });
    return;
  }

  const stored = await getStoredPassword();

  if (!stored) {
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }

  if (password !== stored) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  res.json({ ok: true });
});

router.post("/admin/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current and new password are required" });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  const stored = await getStoredPassword();

  if (currentPassword !== stored) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  await db.execute(
    sql`INSERT INTO admin_settings (key, value, updated_at)
        VALUES ('admin_password', ${newPassword}, now())
        ON CONFLICT (key) DO UPDATE SET value = ${newPassword}, updated_at = now()`
  );

  res.json({ ok: true });
});

export default router;
