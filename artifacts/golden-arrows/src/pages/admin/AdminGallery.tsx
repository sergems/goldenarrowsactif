import { useState } from "react";
import { useListGallery, useCreateGalleryItem, useDeleteGalleryItem, getListGalleryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Plus, Trash2, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

function GalleryForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const createItem = useCreateGalleryItem();
  const [form, setForm] = useState({
    title: "", type: "photo" as "photo" | "video", url: "",
    thumbnailUrl: "", category: "matches", caption: "",
  });

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await createItem.mutateAsync({ data: form });
    queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">Upload Media</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Title *</label>
            <Input name="title" value={form.title} onChange={handle} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Type</label>
              <select name="type" value={form.type} onChange={handle} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Category</label>
              <select name="category" value={form.category} onChange={handle} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="matches">Matches</option>
                <option value="training">Training</option>
                <option value="community">Community</option>
                <option value="events">Events</option>
              </select>
            </div>
          </div>
          {form.type === "photo" ? (
            <ImageUpload
              label="Photo"
              required
              value={form.url}
              onChange={url => setForm(f => ({ ...f, url, thumbnailUrl: url }))}
            />
          ) : (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">YouTube or Video URL *</label>
              <Input name="url" value={form.url} onChange={handle} required placeholder="https://youtube.com/..." />
            </div>
          )}
          {form.type === "video" && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Thumbnail Image</label>
              <ImageUpload
                value={form.thumbnailUrl}
                onChange={url => setForm(f => ({ ...f, thumbnailUrl: url }))}
              />
            </div>
          )}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Caption</label>
            <Input name="caption" value={form.caption} onChange={handle} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createItem.isPending}>
              {createItem.isPending ? "Uploading..." : "Add Media"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useListGallery({ limit: 100 });
  const deleteItem = useDeleteGalleryItem();
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Delete this media item?")) return;
    await deleteItem.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
  }

  return (
    <AdminLayout>
      {showForm && <GalleryForm onClose={() => setShowForm(false)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground mt-1">{items?.length ?? 0} media items</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Media
        </Button>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items?.map(item => (
          <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-card border border-white/5">
            <img
              src={item.thumbnailUrl || item.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.type === "video" && (
              <div className="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-0.5 rounded">VIDEO</div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <p className="text-white text-xs font-bold text-center line-clamp-2">{item.title}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="h-8 w-8 rounded-lg bg-destructive/80 flex items-center justify-center text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && (!items || items.length === 0) && (
        <div className="text-center text-muted-foreground py-20 bg-card rounded-xl border border-white/5">
          <p className="mb-4">No media items yet.</p>
          <Button onClick={() => setShowForm(true)} variant="outline">Add First Item</Button>
        </div>
      )}
    </AdminLayout>
  );
}
