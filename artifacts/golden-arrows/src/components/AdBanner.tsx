import { useGetAd } from "@workspace/api-client-react";
import { ImageOff } from "lucide-react";

interface AdBannerProps {
  slot: string;
  className?: string;
}

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  const { data: ad } = useGetAd(slot);
  const hasImage = !!ad?.imageUrl;

  const inner = hasImage ? (
    <img
      src={ad!.imageUrl!}
      alt={ad!.altText ?? "Advertisement"}
      className="w-full h-full object-cover rounded-xl"
    />
  ) : (
    <div className="w-full rounded-xl border border-dashed border-white/10 bg-white/2 flex flex-col items-center justify-center gap-2 text-muted-foreground/40 select-none py-10">
      <ImageOff className="h-5 w-5" />
      <span className="text-[9px] uppercase tracking-widest font-bold">Ad</span>
    </div>
  );

  return (
    <div className={className}>
      {hasImage && ad?.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
      {hasImage && (
        <p className="text-[9px] text-muted-foreground/30 text-center mt-1 uppercase tracking-widest">Advert</p>
      )}
    </div>
  );
}

/** Renders 3 stacked ad banners for one side of a page. Column is sticky. */
export function AdColumn({ page, side }: { page: string; side: "left" | "right" }) {
  return (
    <div className="sticky top-24 flex flex-col gap-4">
      <AdBanner slot={`${page}-${side}-1`} />
      <AdBanner slot={`${page}-${side}-2`} />
      <AdBanner slot={`${page}-${side}-3`} />
    </div>
  );
}
