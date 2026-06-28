import { useState } from "react";
import {
  useListSlides, useCreateSlide, useUpdateSlide, useDeleteSlide, getListSlidesQueryKey,
  type Slide,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Plus, Trash2, X, GripVertical, Eye, EyeOff, Pencil, ChevronUp, ChevronDown, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

type SlideFormData = {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  linkLabel: string;
  sortOrder: number;
  active: boolean;
};

const DEFAULT_FORM: SlideFormData = {
  title: "", subtitle: "", imageUrl: "", link: "", linkLabel: "", sortOrder: 0, active: true,
};

function SlideForm({
  initial,
  onClose,
  onSubmit,
  isPending,
  mode,
}: {
  initial: SlideFormData;
  onClose: () => void;
  onSubmit: (data: SlideFormData) => void;
  isPending: boolean;
  mode: "create" | "edit";
}) {
  const [form, setForm] = useState<SlideFormData>(initial);

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">
            {mode === "create" ? "Add Hero Slide" : "Edit Slide"}
          </h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <form
          onSubmit={e => { e.preventDefault(); onSubmit(form); }}
          className="p-6 space-y-4"
        >
          <ImageUpload
            label="Slide Image"
            required
            value={form.imageUrl}
            onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
          />
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Slide Title</label>
            <Input name="title" value={form.title} onChange={handle} placeholder="e.g. Abafana Bes'thende" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Subtitle</label>
            <Input name="subtitle" value={form.subtitle} onChange={handle} placeholder="e.g. Pride of KwaZulu-Natal" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Button Link</label>
              <Input name="link" value={form.link} onChange={handle} placeholder="/fixtures" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Button Label</label>
              <Input name="linkLabel" value={form.linkLabel} onChange={handle} placeholder="View Fixtures" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Sort Order</label>
              <Input name="sortOrder" type="number" value={form.sortOrder} onChange={handle} min={0} />
            </div>
            <div
              onClick={() => setForm(f => ({ ...f, active: !f.active }))}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors mt-5 ${form.active ? "bg-primary/10 border-primary/30" : "bg-white/2 border-white/10"}`}
            >
              <div className={`h-4 w-4 rounded flex items-center justify-center border-2 flex-shrink-0 ${form.active ? "bg-primary border-primary" : "border-white/30"}`}>
                {form.active && <svg viewBox="0 0 12 10" className="w-3 h-3 fill-black"><path d="M1 5l3 4L11 1"/></svg>}
              </div>
              <span className={`text-sm font-bold ${form.active ? "text-primary" : "text-muted-foreground"}`}>
                {form.active ? "Active" : "Hidden"}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending || !form.imageUrl}>
              {isPending ? "Saving…" : mode === "create" ? "Add Slide" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSlides() {
  const qc = useQueryClient();
  const { data: slides, isLoading } = useListSlides();
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);

  function invalidate() {
    qc.invalidateQueries({ queryKey: getListSlidesQueryKey() });
  }

  async function handleCreate(data: SlideFormData) {
    await createSlide.mutateAsync({ data });
    invalidate();
    setShowCreate(false);
  }

  async function handleUpdate(data: SlideFormData) {
    if (!editing) return;
    await updateSlide.mutateAsync({ id: editing.id, data });
    invalidate();
    setEditing(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this slide?")) return;
    await deleteSlide.mutateAsync({ id });
    invalidate();
  }

  async function handleToggle(slide: Slide) {
    await updateSlide.mutateAsync({ id: slide.id, data: { active: !slide.active } });
    invalidate();
  }

  async function handleMove(slide: Slide, dir: -1 | 1) {
    await updateSlide.mutateAsync({ id: slide.id, data: { sortOrder: slide.sortOrder + dir } });
    invalidate();
  }

  const sorted = [...(slides ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <AdminLayout>
      {showCreate && (
        <SlideForm
          mode="create"
          initial={{ ...DEFAULT_FORM, sortOrder: (slides?.length ?? 0) }}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          isPending={createSlide.isPending}
        />
      )}
      {editing && (
        <SlideForm
          mode="edit"
          initial={{
            title: editing.title,
            subtitle: editing.subtitle ?? "",
            imageUrl: editing.imageUrl,
            link: editing.link ?? "",
            linkLabel: editing.linkLabel ?? "",
            sortOrder: editing.sortOrder,
            active: editing.active,
          }}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
          isPending={updateSlide.isPending}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight flex items-center gap-3">
            <MonitorPlay className="h-7 w-7 text-primary" /> Hero Slides
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage the home page hero image slider. Upload images and control what visitors see.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Slide
        </Button>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading…</div>}

      {!isLoading && sorted.length === 0 && (
        <div className="bg-card border border-white/5 rounded-xl p-16 text-center">
          <MonitorPlay className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl uppercase mb-2">No Slides Yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            The home page hero currently shows a static stadium image. Add slides to enable the full-screen image slider.
          </p>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add First Slide
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(slide => (
          <div
            key={slide.id}
            className={`bg-card border rounded-xl overflow-hidden flex items-stretch gap-0 transition-colors ${
              slide.active ? "border-white/10" : "border-white/5 opacity-60"
            }`}
          >
            {/* Thumbnail */}
            <div className="w-40 flex-shrink-0 relative">
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
              {!slide.active && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <EyeOff className="h-5 w-5 text-white/40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 px-5 py-4 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  slide.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 text-muted-foreground border border-white/10"
                }`}>
                  {slide.active ? "Live" : "Hidden"}
                </span>
                <span className="text-xs text-muted-foreground">#{slide.sortOrder}</span>
              </div>
              <div className="font-bold truncate">{slide.title}</div>
              {slide.subtitle && (
                <div className="text-sm text-muted-foreground truncate">{slide.subtitle}</div>
              )}
              {slide.link && (
                <div className="text-xs text-primary mt-1 truncate">{slide.link}</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-center gap-1 pr-4 pl-2 border-l border-white/5">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMove(slide, -1)} title="Move up"
                  className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => handleMove(slide, 1)} title="Move down"
                  className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-1 mt-1">
                <button onClick={() => handleToggle(slide)} title={slide.active ? "Hide" : "Show"}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                    slide.active ? "bg-green-600/20 text-green-400 hover:bg-green-600/30" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}>
                  {slide.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing(slide)} title="Edit"
                  className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 flex items-center justify-center">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(slide.id)} title="Delete"
                  className="h-8 w-8 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
