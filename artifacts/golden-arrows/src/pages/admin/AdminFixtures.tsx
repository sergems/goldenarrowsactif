import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Plus, Trash2, X, Pencil, Loader2, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Fixture } from "@workspace/api-client-react";

const COMPETITIONS = ["DStv Premiership", "Nedbank Cup", "MTN8", "CAF Confederation Cup", "Friendly"];
const GA = "Golden Arrows FC";

type FixtureWithCompleted = Fixture & { completed?: boolean };

function useFixtures() {
  const [data, setData] = useState<FixtureWithCompleted[] | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/fixtures");
    setData(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  return { data: data ?? [], loading, reload: load };
}

type FormData = {
  date: string; time: string; homeTeam: string; awayTeam: string;
  competition: string; venue: string; ticketUrl: string;
};

const DEFAULT_FORM: FormData = {
  date: "", time: "15:00", homeTeam: GA, awayTeam: "",
  competition: "DStv Premiership", venue: "Princess Magogo Stadium", ticketUrl: "",
};

function FixtureForm({
  initial, mode, onClose, onSaved,
}: {
  initial?: FixtureWithCompleted; mode: "create" | "edit";
  onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<FormData>(
    initial
      ? { date: initial.date, time: initial.time ?? "15:00", homeTeam: initial.homeTeam,
          awayTeam: initial.awayTeam, competition: initial.competition,
          venue: initial.venue, ticketUrl: initial.ticketUrl ?? "" }
      : DEFAULT_FORM
  );
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, ticketUrl: form.ticketUrl || null };
    if (mode === "edit" && initial) {
      await fetch(`/api/fixtures/${initial.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/fixtures", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    if (mode === "edit") { onSaved(); onClose(); }
    else setDone(true);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-card border border-white/10 rounded-xl w-full max-w-md p-10 text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <div className="font-display font-bold text-xl uppercase mb-2">Fixture Added!</div>
          <p className="text-muted-foreground text-sm mb-6">{form.homeTeam} vs {form.awayTeam} on {form.date}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setDone(false); setForm(DEFAULT_FORM); }}>Add Another</Button>
            <Button onClick={() => { onSaved(); onClose(); }}>Done</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">
            {mode === "edit" ? "Edit Fixture" : "Add Fixture"}
          </h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Date *</label>
              <Input name="date" type="date" value={form.date} onChange={handle} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Kick-off Time</label>
              <Input name="time" type="time" value={form.time} onChange={handle} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Home Team *</label>
              <Input name="homeTeam" value={form.homeTeam} onChange={handle} required placeholder="e.g. Golden Arrows FC" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Away Team *</label>
              <Input name="awayTeam" value={form.awayTeam} onChange={handle} required placeholder="e.g. Kaizer Chiefs" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Competition</label>
              <select name="competition" value={form.competition} onChange={handle}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {COMPETITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Venue *</label>
              <Input name="venue" value={form.venue} onChange={handle} required placeholder="e.g. Princess Magogo Stadium" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Ticket URL</label>
              <Input name="ticketUrl" value={form.ticketUrl} onChange={handle} placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="min-w-32">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : mode === "edit" ? "Save Changes" : "Add Fixture"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminFixtures() {
  const { data: fixtures, loading, reload } = useFixtures();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<FixtureWithCompleted | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this fixture?")) return;
    setDeleting(id);
    await fetch(`/api/fixtures/${id}`, { method: "DELETE" });
    setDeleting(null);
    reload();
  }

  async function markCompleted(id: number) {
    await fetch(`/api/fixtures/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    reload();
  }

  return (
    <AdminLayout>
      {showCreate && <FixtureForm mode="create" onClose={() => setShowCreate(false)} onSaved={reload} />}
      {editing && <FixtureForm mode="edit" initial={editing} onClose={() => setEditing(null)} onSaved={reload} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Fixtures</h1>
          <p className="text-muted-foreground mt-1">{fixtures?.length ?? 0} upcoming fixtures</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Fixture
          </Button>
        </div>
      </div>

      {loading && <div className="text-muted-foreground">Loading…</div>}

      <div className="space-y-3">
        {fixtures?.map(f => (
          <div key={f.id} className="bg-card border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <div className="font-bold text-sm">{f.date}</div>
                <div className="text-xs text-muted-foreground">{f.time ?? "TBC"}</div>
              </div>
            </div>

            <div className="flex-1">
              <div className="font-display font-bold text-lg">
                <span className={f.homeTeam.includes("Golden Arrows") ? "text-primary" : ""}>{f.homeTeam}</span>
                <span className="text-muted-foreground mx-3">vs</span>
                <span className={f.awayTeam.includes("Golden Arrows") ? "text-primary" : ""}>{f.awayTeam}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{f.competition} · {f.venue}</div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => markCompleted(f.id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-green-900/40 text-green-400 border border-green-700/30 hover:bg-green-900/60 transition-colors font-bold"
                title="Mark as played"
              >
                Mark Played
              </button>
              <button onClick={() => setEditing(f)}
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                disabled={deleting === f.id}
                className="p-2 rounded-lg hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors">
                {deleting === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}

        {!loading && fixtures?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold mb-1">No fixtures scheduled</p>
            <p className="text-sm">Add upcoming matches using the button above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
