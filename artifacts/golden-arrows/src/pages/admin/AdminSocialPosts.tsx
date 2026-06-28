import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Plus, Trash2, X, Facebook, Instagram, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SocialPost = { id: number; platform: "facebook" | "instagram"; post_url: string; display_order: number };

const API = "/api/social-posts";

function PostForm({ post, onClose, onSaved }: { post?: SocialPost; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    platform: post?.platform ?? "facebook",
    post_url: post?.post_url ?? "",
    display_order: post?.display_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = post ? "PUT" : "POST";
    const url = post ? `${API}/${post.id}` : API;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">{post ? "Edit Post" : "Add Social Post"}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
            <select
              name="platform"
              value={form.platform}
              onChange={e => setForm(f => ({ ...f, platform: e.target.value as "facebook" | "instagram" }))}
              className="w-full bg-background border border-white/10 rounded px-3 py-2 text-sm text-white"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Post URL *</label>
            <Input
              name="post_url"
              value={form.post_url}
              onChange={e => setForm(f => ({ ...f, post_url: e.target.value }))}
              placeholder={form.platform === "facebook"
                ? "https://www.facebook.com/LamontvilleGoldenArrows/posts/..."
                : "https://www.instagram.com/p/..."}
              required
            />
            <p className="text-xs text-white/30 mt-1">
              Copy the URL of the individual post from {form.platform === "facebook" ? "Facebook" : "Instagram"}
            </p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Display Order</label>
            <Input
              type="number"
              name="display_order"
              value={form.display_order}
              onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-primary text-black" disabled={saving}>
              {saving ? "Saving…" : post ? "Update Post" : "Add Post"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<SocialPost | undefined>(undefined);

  async function load() {
    setLoading(true);
    const res = await fetch(API);
    setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm("Remove this post?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  }

  const fbPosts = posts.filter(p => p.platform === "facebook");
  const igPosts = posts.filter(p => p.platform === "instagram");

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Social Media Posts</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage Facebook & Instagram post URLs shown on the Fan Zone page.</p>
          </div>
          <Button className="bg-primary text-black font-bold" onClick={() => { setEditPost(undefined); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Post
          </Button>
        </div>

        {loading && <p className="text-muted-foreground">Loading…</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Facebook */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-white uppercase tracking-wide text-sm">Facebook Posts ({fbPosts.length})</h2>
            </div>
            <div className="space-y-3">
              {fbPosts.map(p => (
                <div key={p.id} className="bg-card border border-white/5 rounded-xl px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40 mb-1">Order: {p.display_order}</p>
                    <p className="text-sm text-white/80 truncate">{p.post_url}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditPost(p); setShowForm(true); }} className="text-white/40 hover:text-white transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.id)} className="text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {!loading && fbPosts.length === 0 && (
                <p className="text-white/30 text-sm">No Facebook posts added yet.</p>
              )}
            </div>
          </div>

          {/* Instagram */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] to-[#bc1888] flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-white uppercase tracking-wide text-sm">Instagram Posts ({igPosts.length})</h2>
            </div>
            <div className="space-y-3">
              {igPosts.map(p => (
                <div key={p.id} className="bg-card border border-white/5 rounded-xl px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40 mb-1">Order: {p.display_order}</p>
                    <p className="text-sm text-white/80 truncate">{p.post_url}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditPost(p); setShowForm(true); }} className="text-white/40 hover:text-white transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.id)} className="text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {!loading && igPosts.length === 0 && (
                <p className="text-white/30 text-sm">No Instagram posts added yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 p-5 bg-card border border-white/5 rounded-xl">
          <p className="text-sm text-white/50 leading-relaxed">
            <strong className="text-white/70">How to add a post:</strong> Go to the Facebook or Instagram post, click the ⋯ menu and copy the post link, then paste it above.
            Facebook posts render as embedded cards on the Fan Zone page. Instagram posts show as a follow card until Instagram opens their embed API.
          </p>
        </div>
      </div>

      {showForm && (
        <PostForm
          post={editPost}
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}
    </AdminLayout>
  );
}
