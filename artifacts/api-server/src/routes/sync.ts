import { Router } from "express";
import { runSyncScoreAxisTable } from "../lib/syncJobs";

const router = Router();

router.post("/sync/table", async (_req, res) => {
  try {
    const result = await runSyncScoreAxisTable();
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Sync failed" });
  }
});

export default router;
