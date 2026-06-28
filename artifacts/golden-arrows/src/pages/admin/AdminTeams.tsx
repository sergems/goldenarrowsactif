import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Shield, Plus, Pencil, Trash2, X, Check, Upload } from "lucide-react";
import { TeamCrest } from "@/components/TeamCrest";

interface Team {
  id: number;
  name: string;
  crestUrl: string | null;
  active: boolean;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCrestUrl, setEditCrestUrl] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCrestUrl, setNewCrestUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<number | "new" | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`${BASE}/api/teams`);
    const data = await res.json() as Team[];
    setTeams(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadCrest(file: File, target: number | "new") {
    setUploadingFor(target);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE}/api/upload`, { method: "POST", body: form });
    const data = await res.json() as { url: string };
    if (target === "new") {
      setNewCrestUrl(data.url);
    } else {
      setEditCrestUrl(data.url);
    }
    setUploadingFor(null);
  }

  async function saveEdit(id: number) {
    setSaving(true);
    await fetch(`${BASE}/api/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        crestUrl: editCrestUrl || null,
        active: editActive,
      }),
    });
    await load();
    setEditingId(null);
    setSaving(false);
  }

  async function deleteTeam(id: number) {
    if (!confirm("Remove this team? This will not delete any fixtures or results.")) return;
    await fetch(`${BASE}/api/teams/${id}`, { method: "DELETE" });
    await load();
  }

  async function addTeam() {
    if (!newName.trim()) return;
    setSaving(true);
    await fetch(`${BASE}/api/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), crestUrl: newCrestUrl || null }),
    });
    setNewName("");
    setNewCrestUrl("");
    setAddOpen(false);
    await load();
    setSaving(false);
  }

  function startEdit(t: Team) {
    setEditingId(t.id);
    setEditName(t.name);
    setEditCrestUrl(t.crestUrl ?? "");
    setEditActive(t.active);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-display font-bold text-2xl uppercase tracking-wider">Teams</h1>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-primary text-black font-bold uppercase tracking-wider text-sm px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Team
          </button>
        </div>

        {/* Add team form */}
        {addOpen && (
          <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-4">
            <h2 className="font-bold uppercase tracking-wider text-sm text-primary">New Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Team Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Cape Town Spurs"
                  className="w-full bg-background border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Crest Image</label>
                <div className="flex gap-2">
                  <input
                    value={newCrestUrl}
                    onChange={e => setNewCrestUrl(e.target.value)}
                    placeholder="URL or upload below"
                    className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <label className="flex-shrink-0 flex items-center gap-1.5 bg-white/10 hover:bg-white/15 transition-colors px-3 py-2.5 rounded-lg text-sm font-bold cursor-pointer">
                    <Upload className="h-4 w-4" />
                    {uploadingFor === "new" ? "…" : ""}
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadCrest(e.target.files[0], "new")} />
                  </label>
                </div>
                {newCrestUrl && (
                  <div className="flex items-center gap-2 mt-1">
                    <TeamCrest name={newName || "?"} logoUrl={newCrestUrl} size="sm" />
                    <span className="text-xs text-muted-foreground">Preview</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addTeam} disabled={saving || !newName.trim()}
                className="flex items-center gap-1.5 bg-primary text-black font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50">
                <Check className="h-4 w-4" /> Save
              </button>
              <button onClick={() => setAddOpen(false)}
                className="flex items-center gap-1.5 bg-white/10 text-sm px-4 py-2 rounded-lg hover:bg-white/15">
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {loading && <div className="text-center text-muted-foreground py-20">Loading teams...</div>}

        {!loading && (
          <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/30 text-muted-foreground border-b border-white/5">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Crest</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Team Name</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider hidden sm:table-cell">Crest URL</th>
                  <th className="px-4 py-3 text-center font-bold uppercase tracking-wider">Active</th>
                  <th className="px-4 py-3 text-right font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams.map(team => (
                  <tr key={team.id} className={`hover:bg-white/2 ${!team.active ? "opacity-50" : ""}`}>
                    {editingId === team.id ? (
                      <>
                        <td className="px-4 py-3">
                          {editCrestUrl
                            ? <TeamCrest name={editName} logoUrl={editCrestUrl} size="sm" />
                            : <TeamCrest name={editName} size="sm" />}
                        </td>
                        <td className="px-4 py-3">
                          <input value={editName} onChange={e => setEditName(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex gap-2">
                            <input value={editCrestUrl} onChange={e => setEditCrestUrl(e.target.value)}
                              placeholder="URL or upload"
                              className="flex-1 bg-background border border-white/10 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <label className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded text-xs font-bold cursor-pointer">
                              <Upload className="h-3.5 w-3.5" />
                              {uploadingFor === team.id ? "…" : ""}
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => e.target.files?.[0] && uploadCrest(e.target.files[0], team.id)} />
                            </label>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)}
                            className="h-4 w-4 accent-yellow-400" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => saveEdit(team.id)} disabled={saving}
                              className="flex items-center gap-1 bg-primary text-black font-bold text-xs px-3 py-1.5 rounded hover:bg-primary/90 disabled:opacity-50">
                              <Check className="h-3.5 w-3.5" /> Save
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="flex items-center gap-1 bg-white/10 text-xs px-3 py-1.5 rounded hover:bg-white/15">
                              <X className="h-3.5 w-3.5" /> Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <TeamCrest name={team.name} logoUrl={team.crestUrl} size="sm" />
                        </td>
                        <td className="px-4 py-3 font-bold">{team.name}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-muted-foreground text-xs truncate max-w-[200px] block">
                            {team.crestUrl ?? <em>none</em>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold uppercase ${team.active ? "text-green-400" : "text-muted-foreground"}`}>
                            {team.active ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(team)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded hover:bg-white/5">
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button onClick={() => deleteTeam(team.id)}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1.5 rounded hover:bg-red-500/10">
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
