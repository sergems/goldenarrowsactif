import { useState, useEffect } from "react";
import { useListGallery } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Instagram, Facebook, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    FB?: { XFBML?: { parse: () => void } };
  }
}

type SocialPost = { id: number; platform: "facebook" | "instagram"; post_url: string; display_order: number };

const CATEGORIES = ["All", "matches", "training", "community", "events"];

export default function Gallery() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [type, setType] = useState<"photo" | "video" | undefined>(undefined);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    fetch("/api/social-posts").then(r => r.json()).then(setSocialPosts).catch(() => {});
  }, []);

  useEffect(() => {
    if (window.FB?.XFBML) window.FB.XFBML.parse();
    if ((window as any).instgrm?.Embeds) (window as any).instgrm.Embeds.process();
  }, [socialPosts]);

  const { data: items, isLoading } = useListGallery({
    category: category || undefined,
    type: type || undefined,
  });

  const fbPosts = socialPosts.filter(p => p.platform === "facebook");
  const igPosts = socialPosts.filter(p => p.platform === "instagram");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Fan <span className="text-primary">Zone</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Photos, videos, and social highlights from Abafana Bes'thende.
          </p>
        </div>
      </div>


      {/* Gallery Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-12">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && items && items.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <div
                  className="relative rounded-xl overflow-hidden cursor-pointer group border border-white/5 hover:border-primary/30 transition-colors"
                  onClick={() => item.type === "photo" && setLightbox(item.url)}
                >
                  {item.type === "video" ? (
                    <video src={item.url} className="w-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.caption || ""} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="h-12 w-12 text-white drop-shadow-lg" />
                    </div>
                  )}
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs leading-snug">{item.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No media available in this category.</div>
        )}
      </div>

      {/* ── From Our Social Media Family ─────────────── */}
      <section className="bg-card border-t border-white/5 py-8 sm:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-4xl uppercase tracking-tight mb-2">
              From Our <span className="text-primary">Social Media Family</span>
            </h2>
            <p className="text-muted-foreground text-sm">Follow us and stay connected with Abafana Bes'thende</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* ── Facebook ── */}
            <div className="bg-background rounded-2xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm leading-none">Lamontville Golden Arrows</p>
                  <p className="text-[#1877F2] text-xs mt-0.5">@LamontvilleGoldenArrows</p>
                </div>
                <a
                  href="https://www.facebook.com/LamontvilleGoldenArrows/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/10 text-[#1877F2] text-xs font-bold hover:bg-[#1877F2]/20 transition-colors flex-shrink-0"
                >
                  Follow <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Posts */}
              {fbPosts.length > 0 ? (
                <div>
                  {fbPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className={`overflow-hidden ${idx < fbPosts.length - 1 ? "border-b border-white/5" : ""}`}
                      style={{ maxHeight: "480px" }}
                    >
                      <div
                        className="fb-post"
                        data-href={post.post_url}
                        data-width="600"
                        data-show-text="true"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-8 py-14 gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
                    <Facebook className="w-7 h-7 text-[#1877F2]" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Follow us on Facebook</p>
                    <p className="text-muted-foreground text-sm">Stay up to date with our latest news and updates.</p>
                  </div>
                  <a href="https://www.facebook.com/LamontvilleGoldenArrows/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1877F2] font-bold text-white text-sm hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" /> Follow on Facebook
                  </a>
                </div>
              )}
            </div>

            {/* ── Instagram ── */}
            <div className="bg-background rounded-2xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm leading-none">Golden Arrows FC</p>
                  <p className="text-[#e1306c] text-xs mt-0.5">@goldenarrowsfc</p>
                </div>
                <a
                  href="https://www.instagram.com/goldenarrowsfc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)", color: "#fff" }}
                >
                  Follow <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Posts */}
              {igPosts.length > 0 ? (
                <div>
                  {igPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className={`overflow-hidden flex justify-center bg-white ${idx < igPosts.length - 1 ? "border-b border-white/5" : ""}`}
                      style={{ maxHeight: "540px" }}
                    >
                      <blockquote
                        className="instagram-media"
                        data-instgrm-permalink={post.post_url}
                        data-instgrm-version="14"
                        style={{
                          background: "#FFF",
                          border: 0,
                          margin: "0",
                          maxWidth: "540px",
                          minWidth: "326px",
                          padding: 0,
                          width: "calc(100% - 2px)",
                        }}
                      >
                        <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                          View this post on Instagram
                        </a>
                      </blockquote>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-8 py-14 gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <Instagram className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">@goldenarrowsfc</p>
                    <p className="text-muted-foreground text-sm">Follow us for match-day moments and behind-the-scenes content.</p>
                  </div>
                  <a href="https://www.instagram.com/goldenarrowsfc/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-white text-sm hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                    <Instagram className="w-4 h-4" /> Follow on Instagram
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={lightbox}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
