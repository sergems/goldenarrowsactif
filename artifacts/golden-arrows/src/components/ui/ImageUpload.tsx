import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ImageUpload({ value, onChange, label, required, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json() as { url: string };
      onChange(data.url);
    } catch {
      setError("Upload failed — try again");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  return (
    <div className={className}>
      {label && (
        <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wider">
          {label}{required && " *"}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-card">
          <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-lg"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/80 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            uploading ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">or drag and drop · PNG, JPG, WebP up to 10 MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
