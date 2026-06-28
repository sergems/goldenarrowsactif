import { useState, useRef } from "react";
import { AdminLayout } from "./AdminLayout";
import { useListAds, useUpdateAd, getListAdsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X, ExternalLink, ImageOff, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Ad } from "@workspace/api-client-react";

const PAGES = [
  { key: "fixtures", label: "Fixtures" },
  { key: "results",  label: "Results"  },
  { key: "table",    label: "League Table" },
] as const;

function AdCard({ ad }: { ad: Ad }) {
  const qc = useQueryClient();
  const updateAd = useUpdateAd();
  const fileRef = useRef<HTMLInputElement>(null);

  const [localLink, setLocalLink] = useState(ad.linkUrl ?? "");
  const [localAlt,  setLocalAlt]  = useState(ad.altText  ?? "");
  const [uploading, setUploading] = useState(false);
  const [saved,     setSaved]     = useState(false);

  const posLabel = ad.slot.match(/-(\d)$/)?.[1] ?? "";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setSaved(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json() as { url: string };
      await updateAd.mutateAsync({ slot: ad.slot, data: { imageUrl: url, linkUrl: localLink || null, altText: localAlt || null } });
      qc.invalidateQueries({ queryKey: getListAdsQueryKey() });
      setSaved(true);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSaveLink() {
    setSaved(false);
    await updateAd.mutateAsync({ slot: ad.slot, data: { imageUrl: ad.imageUrl ?? null, linkUrl: localLink || null, altText: localAlt || null } });
    qc.invalidateQueries({ queryKey: getListAdsQueryKey() });
    setSaved(true);
  }

  async function handleClear() {
    await updateAd.mutateAsync({ slot: ad.slot, data: { imageUrl: null, linkUrl: null, altText: null } });
    qc.invalidateQueries({ queryKey: getListAdsQueryKey() });
    setLocalLink(""); setLocalAlt(""); setSaved(false);
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="font-display font-bold text-xs uppercase tracking-tight">Ad #{posLabel}</span>
        {saved && <span className="flex items-center gap-1 text-[11px] text-green-400 font-bold"><CheckCircle className="h-3 w-3" /> Saved</span>}
      </div>

      <div className="p-4">
        {/* Preview */}
        <div className="relative w-full aspect-[160/200] rounded-lg overflow-hidden bg-background border border-white/5 mb-3">
          {ad.imageUrl ? (
            <>
              <img src={ad.imageUrl} alt={ad.altText ?? ad.slot} className="w-full h-full object-cover" />
              <button onClick={handleClear} className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-500/80 transition-colors" title="Remove">
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground/30">
              <ImageOff className="h-6 w-6" />
              <span className="text-[9px] uppercase tracking-widest">Empty</span>
            </div>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <Button onClick={() => fileRef.current?.click()} disabled={uploading} variant="outline" size="sm" className="w-full mb-3 h-8 text-xs">
          {uploading ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading…</> : <><Upload className="h-3 w-3 mr-1" />{ad.imageUrl ? "Replace" : "Upload"}</>}
        </Button>

        <div className="space-y-1.5">
          <Input value={localLink} onChange={e => { setLocalLink(e.target.value); setSaved(false); }} placeholder="https://…" className="bg-background border-white/10 text-xs h-7" />
          <div className="flex gap-1.5">
            <Input value={localAlt} onChange={e => { setLocalAlt(e.target.value); setSaved(false); }} placeholder="Alt text" className="bg-background border-white/10 text-xs h-7 flex-1" />
            {localLink && (
              <a href={localLink} target="_blank" rel="noopener noreferrer" className="h-7 w-7 flex-shrink-0 rounded border border-white/10 flex items-center justify-center hover:border-primary/40">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}
          </div>
          <Button onClick={handleSaveLink} disabled={updateAd.isPending} variant="outline" size="sm" className="w-full h-7 text-xs">
            {updateAd.isPending ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving…</> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAds() {
  const { data: ads, isLoading } = useListAds();

  function getSlots(page: string, side: "left" | "right") {
    return [1, 2, 3]
      .map(n => ads?.find(a => a.slot === `${page}-${side}-${n}`))
      .filter(Boolean) as Ad[];
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Ad Banners</h1>
        <p className="text-muted-foreground mt-1">
          6 ad slots per page (3 left · 3 right) on Fixtures, Results, and League Table. Visible on wide screens only.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-20">Loading ad slots…</div>
      ) : (
        <div className="space-y-10">
          {PAGES.map(({ key, label }) => (
            <div key={key}>
              <h2 className="font-display font-bold text-lg uppercase tracking-tight mb-4 flex items-center gap-3">
                <span className="text-primary">{label}</span>
                <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">6 slots</span>
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {(["left", "right"] as const).map(side => (
                  <div key={side}>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-white/5" />
                      {side === "left" ? "← Left sidebar" : "Right sidebar →"}
                      <span className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {getSlots(key, side).map(ad => (
                        <AdCard key={ad.slot} ad={ad} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
