import { db } from "@workspace/db";
import { leagueTableTable } from "@workspace/db";
import { execFile } from "child_process";

const SCOREAXIS_WIDGET_URL =
  "https://widgets.scoreaxis.com/api/football/league-table/623219f2b96de7637f51d75e" +
  "?widgetId=cdv9mqvfg7kc&lang=en&teamLogo=1&tableLines=1&homeAway=0&header=1" +
  "&position=1&goals=1&gamesCount=1&diff=1&winCount=1&drawCount=1&loseCount=1" +
  "&lastGames=1&points=1&teamsLimit=all&links=0";

function parseScoreAxisWidget(raw: string): Array<{
  position: number; team: string; logoUrl: string | null;
  played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDifference: number; points: number;
}> {
  const decoded = raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"');

  const positions = [...decoded.matchAll(/class="num-item fl_c_c[^"]*"[^>]*>\s*(\d+)/g)];
  const names = [...decoded.matchAll(/title="([^"]+)"\s+class="text-overflow"/g)];
  const logos = [...decoded.matchAll(/src="(https:\/\/statistic-cdn\.scoreaxis\.com\/team\/[^"]+)"/g)];
  const rows = [...decoded.matchAll(
    /<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)\s*:\s*(\d+)<\/td>\s*<td[^>]*>([-\d]+)<\/td>\s*<td[^>]*class="points">(\d+)<\/td>/g
  )];

  const PSL_TEAM_COUNT = 16;
  const count = Math.min(positions.length, names.length, rows.length, PSL_TEAM_COUNT);
  const teams = [];

  for (let i = 0; i < count; i++) {
    const logoRaw = logos[i] ? logos[i][1] : null;
    const logoUrl = logoRaw ? logoRaw.replace(/-30-30\.(png|jpg|webp)$/, "-60-60.png") : null;
    teams.push({
      position: parseInt(positions[i][1]),
      team: names[i][1],
      logoUrl,
      played: parseInt(rows[i][1]),
      won: parseInt(rows[i][2]),
      drawn: parseInt(rows[i][3]),
      lost: parseInt(rows[i][4]),
      goalsFor: parseInt(rows[i][5]),
      goalsAgainst: parseInt(rows[i][6]),
      goalDifference: parseInt(rows[i][7]),
      points: parseInt(rows[i][8]),
    });
  }
  return teams;
}

function curlFetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile("curl", [
      "-s",
      "--max-time", "20",
      "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "-H", "Accept: text/javascript, application/javascript, */*; q=0.01",
      "-H", "Accept-Language: en-US,en;q=0.9",
      "-H", "Referer: https://www.scoreaxis.com/",
      "-H", "X-Requested-With: XMLHttpRequest",
      url,
    ], { maxBuffer: 5 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(`curl error: ${err.message}`));
      if (!stdout) return reject(new Error(`curl returned empty response. stderr: ${stderr}`));
      resolve(stdout);
    });
  });
}

export async function runSyncScoreAxisTable(): Promise<{ synced: number; source: string }> {
  const raw = await curlFetch(SCOREAXIS_WIDGET_URL);

  const teams = parseScoreAxisWidget(raw);
  if (teams.length === 0) throw new Error("ScoreAxis: no team data found in widget response");

  const season = 2025;
  await db.delete(leagueTableTable);
  await db.insert(leagueTableTable).values(
    teams.map(t => ({
      season,
      position: t.position,
      team: t.team,
      logoUrl: t.logoUrl,
      played: t.played,
      won: t.won,
      drawn: t.drawn,
      lost: t.lost,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      goalDifference: t.goalDifference,
      points: t.points,
      isGoldenArrows: t.team.toLowerCase().includes("golden arrows"),
    }))
  );
  return { synced: teams.length, source: "scoreaxis" };
}
