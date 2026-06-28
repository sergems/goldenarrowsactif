import { logger } from "./logger";
import { runSyncScoreAxisTable } from "./syncJobs";

const TABLE_SYNC_WINDOW_UTC = { start: 10, end: 21 };
const TABLE_SYNC_INTERVAL_MIN = 30;

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

async function syncLeagueTable() {
  try {
    const result = await runSyncScoreAxisTable();
    logger.info({ synced: result.synced, source: result.source }, "Scheduled sync: league table done");
  } catch (err) {
    logger.warn({ err }, "Scheduled sync: league table failed");
  }
}

export function startScheduler() {
  logger.info(
    {
      tableSync: `every ${TABLE_SYNC_INTERVAL_MIN} min between ${TABLE_SYNC_WINDOW_UTC.start}:00–${TABLE_SYNC_WINDOW_UTC.end}:00 UTC (12:00–23:00 SAST)`,
    },
    "Scheduler started"
  );

  let lastTableSyncMin = -1;

  schedulerInterval = setInterval(() => {
    const now = new Date();
    const hourUTC = now.getUTCHours();
    const minUTC = now.getUTCMinutes();
    const totalMinUTC = hourUTC * 60 + minUTC;

    const windowStart = TABLE_SYNC_WINDOW_UTC.start * 60;
    const windowEnd = TABLE_SYNC_WINDOW_UTC.end * 60;
    const inWindow = totalMinUTC >= windowStart && totalMinUTC < windowEnd;
    const slotMin = Math.floor(totalMinUTC / TABLE_SYNC_INTERVAL_MIN) * TABLE_SYNC_INTERVAL_MIN;

    if (inWindow && minUTC % TABLE_SYNC_INTERVAL_MIN === 0 && slotMin !== lastTableSyncMin) {
      lastTableSyncMin = slotMin;
      syncLeagueTable().catch(err => logger.error({ err }, "Unexpected error in table sync"));
    }

    if (!inWindow) lastTableSyncMin = -1;
  }, 30_000);
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
