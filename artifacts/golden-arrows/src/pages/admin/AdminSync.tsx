import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { useSyncTable } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetLeagueTableQueryKey } from "@workspace/api-client-react";
import { RefreshCw, CheckCircle, AlertCircle, TableProperties, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type SyncStatus = "idle" | "loading" | "success" | "error";

interface SyncState {
  status: SyncStatus;
  message: string;
}

const TABLE_SCHEDULE_SLOTS = Array.from({ length: 23 }, (_, i) => {
  const h = 12 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

export default function AdminSync() {
  const qc = useQueryClient();
  const syncTable = useSyncTable();

  const [tableState, setTableState] = useState<SyncState>({ status: "idle", message: "" });

  async function handleSyncTable() {
    setTableState({ status: "loading", message: "Fetching live PSL standings from ScoreAxis…" });
    try {
      const data = await syncTable.mutateAsync({});
      qc.invalidateQueries({ queryKey: getGetLeagueTableQueryKey() });
      setTableState({
        status: "success",
        message: `Updated ${data.synced} teams in the 2025/2026 league table.`,
      });
    } catch (err) {
      setTableState({
        status: "error",
        message: err instanceof Error ? err.message : "Sync failed.",
      });
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Live Data Sync</h1>
        <p className="text-muted-foreground mt-1">
          Manually refresh PSL standings at any time.
        </p>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-display font-bold text-sm uppercase tracking-wider">League Table — Auto-Sync</span>
          <span className="ml-auto text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Standings are fetched from <span className="text-white font-semibold">ScoreAxis</span> every <span className="text-white font-semibold">30 minutes</span> during the match window — no API key required.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TABLE_SCHEDULE_SLOTS.map(t => (
            <span key={t} className="text-[11px] font-bold font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
          <span className="text-[11px] text-muted-foreground self-center ml-1">SAST</span>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TableProperties className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-base uppercase tracking-tight">League Table</h3>
                <span className="text-[10px] bg-primary/15 text-primary border border-primary/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                  ScoreAxis
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Live 2025/2026 PSL standings pulled directly from ScoreAxis — always up to date.
              </p>
            </div>
          </div>

          {tableState.status !== "idle" && (
            <div
              className={`rounded-lg px-4 py-3 text-sm flex items-start gap-2.5 ${
                tableState.status === "loading"
                  ? "bg-white/5 text-white/70"
                  : tableState.status === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {tableState.status === "loading" && <RefreshCw className="h-4 w-4 animate-spin flex-shrink-0 mt-0.5" />}
              {tableState.status === "success" && <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
              {tableState.status === "error" && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
              <span>{tableState.message}</span>
            </div>
          )}

          <Button
            onClick={handleSyncTable}
            disabled={tableState.status === "loading"}
            className="w-full"
            variant={tableState.status === "success" ? "outline" : "default"}
          >
            {tableState.status === "loading" ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Syncing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                {tableState.status === "success" ? "Sync Again" : "Sync Now"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
