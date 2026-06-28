import { useState } from "react";
import {
  useListPlayers, useCreatePlayer, useUpdatePlayer, useDeletePlayer,
  getListPlayersQueryKey, useCreateNews, getListNewsQueryKey,
  type Player,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Plus, Trash2, X, Pencil, Megaphone, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import playerPlaceholder from "@/assets/player-placeholder.png";

const PLAYER_POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

const COACHING_STAFF_ROLES = [
  "Coach",
  "Assistant Coach",
  "Head Coach",
  "Assistant Head Coach",
  "Goalkeeper Coach",
  "Fitness & Conditioning Coach",
  "Technical Director",
  "Sports Scientist",
  "Video Analyst",
  "Team Doctor",
  "Physiotherapist",
  "Team Manager",
  "Kit Manager",
  "Scout",
];

const isCoach = (pos: string) => !PLAYER_POSITIONS.includes(pos);

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildAnnouncement(form: {
  name: string; position: string; nationality: string; age: number; number: number; photoUrl: string;
}) {
  const isCoachingRole = isCoach(form.position);
  const role = form.position;
  const title = isCoachingRole
    ? `Golden Arrows Appoint ${form.name} as ${role}`
    : `Golden Arrows Sign ${form.name}`;
  const slug = `${isCoachingRole ? "golden-arrows-appoint" : "golden-arrows-sign"}-${slugify(form.name)}-${Date.now()}`;
  const article = isCoachingRole
    ? `${form.nationality} ${role.toLowerCase()} ${form.name} joins Lamontville Golden Arrows FC as ${role.toLowerCase()}. ` +
      `${form.age > 0 ? `The ${form.age}-year-old` : "The"} experienced tactician is set to guide Abafana Bes'thende this season.\n\n` +
      `"We are thrilled to welcome ${form.name.split(" ")[0]} to the club and look forward to the expertise they will bring," said a club spokesperson.`
    : `${form.nationality} ${role.toLowerCase()} ${form.name} joins Lamontville Golden Arrows FC. ` +
      `The ${form.age > 0 ? `${form.age}-year-old` : "new"} signing wears the number ${form.number} shirt and is set to strengthen the Abafana Bes'thende squad.\n\n` +
      `"We are delighted to welcome ${form.name.split(" ")[0]} to the club," said a club spokesperson.\n\n` +
      `${form.name} is available immediately and the club wishes him every success in the famous Golden Arrows colours.`;

  return {
    title, slug,
    excerpt: isCoachingRole
      ? `Lamontville Golden Arrows FC are pleased to announce the appointment of ${form.name} as ${role}.`
      : `Lamontville Golden Arrows FC are delighted to announce the signing of ${form.name}, ${form.nationality} ${role.toLowerCase()}.`,
    content: article,
    category: isCoachingRole ? "Club News" : "Transfer News",
    imageUrl: form.photoUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    author: "Golden Arrows FC",
    tags: isCoachingRole ? ["Coaching", "Management", "Club News"] : ["Transfer", "Squad", "Signing"],
    featured: false,
  };
}

type FormData = {
  name: string; position: string; number: number; nationality: string;
  age: number; photoUrl: string; bio: string; appearances: number; goals: number; assists: number;
  instagram: string; facebook: string; twitter: string;
};

const DEFAULT_FORM: FormData = {
  name: "", position: "Forward", number: 1, nationality: "South African",
  age: 22, photoUrl: "", bio: "", appearances: 0, goals: 0, assists: 0,
  instagram: "", facebook: "", twitter: "",
};

function PlayerForm({
  initial,
  mode,
  onClose,
}: {
  initial?: Player;
  mode: "create" | "edit";
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();
  const createNews = useCreateNews();

  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name, position: initial.position, number: initial.number,
          nationality: initial.nationality, age: initial.age ?? 22,
          photoUrl: initial.photoUrl ?? "", bio: initial.bio ?? "",
          appearances: initial.appearances ?? 0, goals: initial.goals ?? 0, assists: initial.assists ?? 0,
          instagram: initial.instagram ?? "", facebook: initial.facebook ?? "", twitter: initial.twitter ?? "",
        }
      : DEFAULT_FORM
  );

  const isKnownCoachingRole = COACHING_STAFF_ROLES.includes(form.position);
  const isKnownPlayerRole = PLAYER_POSITIONS.includes(form.position);
  const initialSelectValue =
    isKnownCoachingRole || isKnownPlayerRole ? form.position : "Other";

  const [positionSelect, setPositionSelect] = useState(initialSelectValue);
  const [createAnnouncement, setCreateAnnouncement] = useState(mode === "create");
  const [done, setDone] = useState<{ name: string; withArticle: boolean; isCoach: boolean } | null>(null);

  const coachMode = isCoach(form.position);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  }

  function handlePositionSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setPositionSelect(val);
    if (val !== "Other") {
      setForm(f => ({ ...f, position: val }));
    } else {
      setForm(f => ({ ...f, position: "" }));
    }
  }

  const isPending = createPlayer.isPending || updatePlayer.isPending || createNews.isPending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "edit" && initial) {
      await updatePlayer.mutateAsync({ id: initial.id, data: form });
    } else {
      await createPlayer.mutateAsync({ data: form });
      if (createAnnouncement && form.name.trim()) {
        await createNews.mutateAsync({ data: buildAnnouncement(form) });
        queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
      }
    }
    queryClient.invalidateQueries({ queryKey: getListPlayersQueryKey() });
    if (mode === "edit") { onClose(); return; }
    setDone({ name: form.name, withArticle: createAnnouncement, isCoach: coachMode });
  }

  const label = coachMode ? "Coaching Staff" : "Player";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">
            {mode === "edit" ? `Edit — ${initial?.name}` : `Add ${label}`}
          </h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="font-display font-bold text-xl uppercase mb-2" style={{ letterSpacing: "0.06em" }}>
              {done.isCoach ? "Staff Added!" : "Player Added!"}
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              <strong className="text-foreground">{done.name}</strong> has been added to the squad.
            </p>
            {done.withArticle && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary font-bold mt-1 mb-6">
                <Megaphone className="h-4 w-4" /> Announcement created in News
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => { setDone(null); setForm(DEFAULT_FORM); setPositionSelect("Forward"); setCreateAnnouncement(true); }}>Add Another</Button>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            <ImageUpload
              label={coachMode ? "Photo" : "Player Photo"}
              value={form.photoUrl}
              onChange={url => setForm(f => ({ ...f, photoUrl: url }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Full Name *</label>
                <Input name="name" value={form.name} onChange={handle} required placeholder="e.g. Sibusiso Mthethwa" />
              </div>

              <div className={positionSelect === "Other" ? "col-span-1" : "col-span-1"}>
                <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Role / Position</label>
                <select
                  value={positionSelect}
                  onChange={handlePositionSelect}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <optgroup label="Players">
                    {PLAYER_POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </optgroup>
                  <optgroup label="Coaching Staff">
                    {COACHING_STAFF_ROLES.map(r => <option key={r}>{r}</option>)}
                    <option value="Other">Other (custom)…</option>
                  </optgroup>
                </select>
              </div>

              {positionSelect === "Other" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Custom Role *</label>
                  <Input
                    name="position"
                    value={form.position}
                    onChange={handle}
                    required
                    placeholder="e.g. Ball Analyst"
                  />
                </div>
              )}

              {!coachMode && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Squad Number</label>
                  <Input name="number" type="number" value={form.number} onChange={handle} min={1} />
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Nationality</label>
                <Input name="nationality" value={form.nationality} onChange={handle} placeholder="e.g. South African, Brazilian…" />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Age</label>
                <Input name="age" type="number" value={form.age} onChange={handle} min={15} max={80} />
              </div>

              {!coachMode && (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Appearances</label>
                    <Input name="appearances" type="number" value={form.appearances} onChange={handle} min={0} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Goals</label>
                    <Input name="goals" type="number" value={form.goals} onChange={handle} min={0} />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Bio / About</label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handle}
                placeholder={coachMode
                  ? "Short description of their background, experience, and role at the club…"
                  : "Short bio about the player — background, style of play, career highlights…"}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {coachMode ? "Shown on the Technical Team page." : "Shown on the player's profile page."}
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Social Media</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20 flex-shrink-0">Instagram</span>
                  <Input name="instagram" value={form.instagram} onChange={handle} placeholder="https://instagram.com/username" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20 flex-shrink-0">Facebook</span>
                  <Input name="facebook" value={form.facebook} onChange={handle} placeholder="https://facebook.com/username" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20 flex-shrink-0">X / Twitter</span>
                  <Input name="twitter" value={form.twitter} onChange={handle} placeholder="https://x.com/username" />
                </div>
              </div>
            </div>

            {mode === "create" && (
              <div
                onClick={() => setCreateAnnouncement(v => !v)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                  createAnnouncement ? "bg-primary/10 border-primary/30" : "bg-white/2 border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`h-5 w-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${createAnnouncement ? "bg-primary border-primary" : "border-white/30"}`}>
                  {createAnnouncement && <svg viewBox="0 0 12 10" className="w-3 h-3 fill-black"><path d="M1 5l3 4L11 1"/></svg>}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm mb-0.5">
                    <Megaphone className={`h-4 w-4 ${createAnnouncement ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={createAnnouncement ? "text-foreground" : "text-muted-foreground"}>
                      {coachMode ? "Create appointment announcement" : "Create signing announcement"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {coachMode
                      ? `Publishes a "Golden Arrows Appoint ${form.name || "[Name]"} as ${form.position || "[Role]"}" news article.`
                      : `Publishes a "Golden Arrows Sign ${form.name || "[Player Name]"}" news article in Transfer News.`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="min-w-32">
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "edit" ? "Saving…" : createPlayer.isPending ? "Adding…" : "Announcing…"}
                  </span>
                ) : mode === "edit" ? "Save Changes" : createAnnouncement ? "Add & Announce" : `Add ${label}`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const PLAYER_SECTION_ORDER = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const TECHNICAL_TEAM_KEY = "Technical Team";

export default function AdminSquad() {
  const queryClient = useQueryClient();
  const { data: players, isLoading } = useListPlayers();
  const deletePlayer = useDeletePlayer();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Remove this person from the squad?")) return;
    await deletePlayer.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListPlayersQueryKey() });
  }

  const groups: Record<string, typeof players> = {};
  [TECHNICAL_TEAM_KEY, ...PLAYER_SECTION_ORDER].forEach(k => { groups[k] = []; });

  players?.forEach(p => {
    if (isCoach(p.position)) {
      groups[TECHNICAL_TEAM_KEY]!.push(p);
    } else {
      const key = PLAYER_SECTION_ORDER.find(s => s.toLowerCase() === p.position.toLowerCase()) ?? p.position;
      if (!groups[key]) groups[key] = [];
      groups[key]!.push(p);
    }
  });

  const DISPLAY_ORDER = [TECHNICAL_TEAM_KEY, ...PLAYER_SECTION_ORDER];

  const totalCount = players?.length ?? 0;
  const coachCount = players?.filter(p => isCoach(p.position)).length ?? 0;
  const playerCount = totalCount - coachCount;

  const sectionLabel = (key: string) => {
    if (key === TECHNICAL_TEAM_KEY) return "Technical Team";
    if (key === "Goalkeeper") return "Goalkeepers";
    if (key === "Defender") return "Defenders";
    if (key === "Midfielder") return "Midfielders";
    if (key === "Forward") return "Forwards";
    return key;
  };

  return (
    <AdminLayout>
      {showCreate && <PlayerForm mode="create" onClose={() => setShowCreate(false)} />}
      {editing && <PlayerForm mode="edit" initial={editing} onClose={() => setEditing(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Squad Management</h1>
          <p className="text-muted-foreground mt-1">
            {playerCount} player{playerCount !== 1 ? "s" : ""} · {coachCount} technical staff
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add to Squad
        </Button>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      {!isLoading && DISPLAY_ORDER.map(section => {
        const members = groups[section];
        if (!members || members.length === 0) return null;
        return (
          <div key={section} className="mb-10">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-muted-foreground mb-4 border-b border-white/5 pb-2">
              {sectionLabel(section)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map(person => (
                <div key={person.id} className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors group">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10">
                    <img src={person.photoUrl || playerPlaceholder} alt={person.name} className="w-full h-full object-cover" />
                    {!isCoach(person.position) && (
                      <div className="absolute top-2 right-2 font-display font-black text-3xl text-white/20">{person.number}</div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditing(person)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-lg"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600/80 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{person.position}</div>
                    <div className="font-display font-bold truncate">{person.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{person.nationality}</div>
                    {!isCoach(person.position) && (
                      <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                        <span><strong className="text-foreground">{person.appearances}</strong> Apps</span>
                        <span><strong className="text-foreground">{person.goals}</strong> Goals</span>
                        <span><strong className="text-foreground">{person.assists}</strong> Assists</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AdminLayout>
  );
}
