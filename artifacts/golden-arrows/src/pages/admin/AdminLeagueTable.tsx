import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Save, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Row = {
  id: number; position: number; team: string; played: number;
  won: number; drawn: number; lost: number; goalsFor: number;
  goalsAgainst: number; goalDifference: number; points: number;
  isGoldenArrows: boolean; logoUrl?: string | null;
};

export default function AdminLeagueTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function syncFromApi() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/sync/table", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Sync failed");
      setSyncMsg({ type: "ok", text: json.message ?? "Table synced!" });
      await load();
    } catch (e: unknown) {
      setSyncMsg({ type: "err", text: e instanceof Error ? e.message : "Sync failed" });
    }
    setSyncing(false);
  }

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/league/table");
    const data = await res.json();
    setRows(data?.entries ?? data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  function update(id: number, field: keyof Row, value: string | number | boolean) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setSaved(false);
  }

  function recalcGD(id: number, gf: number, ga: number) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, goalsFor: gf, goalsAgainst: ga, goalDifference: gf - ga } : r));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/league/table", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows.map(r => ({
        position: r.position, team: r.team, played: r.played, won: r.won,
        drawn: r.drawn, lost: r.lost, goalsFor: r.goalsFor, goalsAgainst: r.goalsAgainst,
        goalDifference: r.goalDifference, points: r.points, isGoldenArrows: r.isGoldenArrows,
      }))),
    });
    if (!res.ok) { setError("Failed to save. Try again."); }
    else { setSaved(true); await load(); }
    setSaving(false);
  }

  const num = (val: string) => parseInt(val, 10) || 0;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">League Table</h1>
          <p className="text-muted-foreground mt-1">Edit standings directly — GD auto-calculates from GF − GA</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={load} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Reload
          </Button>
          <Button variant="outline" onClick={syncFromApi} disabled={syncing || loading} className="flex items-center gap-2" title="Pull live standings from API-Football">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync from ScoreAxis"}
          </Button>
          <Button onClick={save} disabled={saving || loading} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </Button>
        </div>
      </div>

      {syncMsg && (
        <div className={`flex items-center gap-2 text-sm rounded-xl p-3 mb-4 border ${
          syncMsg.type === "ok"
            ? "bg-green-900/20 border-green-700/30 text-green-400"
            : "bg-red-900/20 border-red-700/30 text-red-400"
        }`}>
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {syncMsg.text}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-700/30 rounded-xl p-4 mb-6 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (
        <div className="bg-card border border-white/5 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-10">#</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-3 py-3 text-center w-14">P</th>
                <th className="px-3 py-3 text-center w-14">W</th>
                <th className="px-3 py-3 text-center w-14">D</th>
                <th className="px-3 py-3 text-center w-14">L</th>
                <th className="px-3 py-3 text-center w-14">GF</th>
                <th className="px-3 py-3 text-center w-14">GA</th>
                <th className="px-3 py-3 text-center w-14">GD</th>
                <th className="px-3 py-3 text-center w-14">Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={`border-b border-white/5 last:border-0 ${row.isGoldenArrows ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-2">
                    <input
                      type="number" value={row.position}
                      onChange={e => update(row.id, "position", num(e.target.value))}
                      className="w-10 bg-transparent text-center font-bold text-primary focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={row.team}
                      onChange={e => update(row.id, "team", e.target.value)}
                      className={`h-8 text-sm ${row.isGoldenArrows ? "font-bold text-primary border-primary/30" : ""}`}
                    />
                  </td>
                  {(["played","won","drawn","lost"] as const).map(field => (
                    <td key={field} className="px-3 py-2">
                      <input type="number" value={row[field]}
                        onChange={e => update(row.id, field, num(e.target.value))}
                        className="w-12 h-8 bg-background border border-input rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <input type="number" value={row.goalsFor}
                      onChange={e => recalcGD(row.id, num(e.target.value), row.goalsAgainst)}
                      className="w-12 h-8 bg-background border border-input rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={row.goalsAgainst}
                      onChange={e => recalcGD(row.id, row.goalsFor, num(e.target.value))}
                      className="w-12 h-8 bg-background border border-input rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`font-bold text-sm ${row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                      {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={row.points}
                      onChange={e => update(row.id, "points", num(e.target.value))}
                      className="w-12 h-8 bg-background border border-input rounded text-center text-sm font-bold focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        💡 <strong>Tip:</strong> Click any cell to edit it inline. Goal Difference recalculates automatically when you change GF or GA. Press <strong>Save Changes</strong> when done.
      </p>
    </AdminLayout>
  );
}
