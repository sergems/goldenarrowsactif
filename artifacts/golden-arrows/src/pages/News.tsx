import { useState } from "react";
import { useListNews } from "@workspace/api-client-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import { Search, ChevronDown, BookOpen, Share2, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["All", "match-report", "club-news", "community"];

const CAT_LABEL: Record<string, string> = {
  "match-report": "Match Report",
  "club-news": "Club News",
  "community": "Community",
};

const CAT_STYLE: Record<string, string> = {
  "match-report": "border-primary/40 text-primary bg-primary/10",
  "club-news":    "border-blue-400/40 text-blue-400 bg-blue-400/10",
  "community":    "border-purple-400/40 text-purple-400 bg-purple-400/10",
};

function ArticleCard({ item, index }: { item: any; index: number }) {
  const [open, setOpen] = useState(false);
  const catStyle = CAT_STYLE[item.category] ?? "border-white/20 text-muted-foreground bg-white/5";
  const catLabel = CAT_LABEL[item.category] ?? item.category;
  const pubDate = new Date(item.publishedAt);

  function handleShare() {
    const text = `${item.title} — Golden Arrows FC`;
    if (navigator.share) {
      navigator.share({ title: item.title, text, url: `/news/${item.id}` });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/news/${item.id}`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`bg-card border rounded-xl overflow-hidden transition-colors duration-200 ${
        open ? "border-primary/40" : "border-white/5 hover:border-primary/20"
      }`}
    >
      {/* ── Clickable main row ── */}
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left focus:outline-none">
        <div className="flex items-stretch">
          {/* Thumbnail */}
          {item.imageUrl && (
            <div className="hidden sm:block w-24 md:w-32 flex-shrink-0 self-stretch relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30" />
            </div>
          )}

          {/* Category + date pill */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-4 py-3 bg-black/20 border-r border-white/5 min-w-[90px] flex-shrink-0">
            <span className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight px-2 py-0.5 rounded border ${catStyle}`}>
              {catLabel}
            </span>
            <span className="text-muted-foreground text-[10px] mt-1 text-center">
              {format(pubDate, "d MMM")}
            </span>
            <span className="text-muted-foreground/50 text-[10px]">
              {format(pubDate, "yyyy")}
            </span>
          </div>

          {/* Title + author */}
          <div className="flex-1 flex flex-col justify-center gap-1 px-3 sm:px-5 py-3 min-w-0">
            <h3 className="font-display font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary">
              {item.title}
            </h3>
            {item.author && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{item.author}</span>
              </div>
            )}
          </div>

          {/* Right meta strip */}
          <div className="hidden md:flex flex-col items-end justify-center gap-0.5 px-4 py-3 bg-black/10 border-l border-white/5 flex-shrink-0 min-w-[110px]">
            <span className="text-muted-foreground text-[10px] text-right">
              {format(pubDate, "d MMM yyyy")}
            </span>
            {item.featured && (
              <span className="text-primary/70 text-[10px] font-black uppercase tracking-wider">Featured</span>
            )}
          </div>

          {/* Expand chevron */}
          <div className="flex items-center pr-3 pl-1 flex-shrink-0">
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
            </motion.div>
          </div>
        </div>

        {/* Mobile: category + date strip */}
        <div className="sm:hidden flex items-center justify-between px-3 py-1.5 bg-black/20 border-t border-white/5">
          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold py-0 h-5 border ${catStyle}`}>
            {catLabel}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(pubDate, "d MMM yyyy")}
          </span>
        </div>
      </button>

      {/* ── Expandable detail panel ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 max-w-xl">
                {item.excerpt}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary rounded-lg px-3 py-2 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <Link
                  href={`/news/${item.id}`}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  className="flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Read Article
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function News() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const { data: news, isLoading } = useListNews({ category: category || undefined, limit: 20 });

  const filtered = news?.filter(
    (item) =>
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered?.find((n) => n.featured);
  const rest = filtered?.filter((n) => !n.featured);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="From The Club"
        title="Latest"
        highlight="News"
        description="Stay up to date with everything happening at Golden Arrows FC."
      />

      <PageWrapper page="news">
        {/* Filters + search */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-5 sm:mb-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === "All" ? undefined : cat)}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                  (cat === "All" && !category) || cat === category
                    ? "bg-primary text-black"
                    : "bg-card border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {CAT_LABEL[cat] ?? cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-20">Loading news...</div>
        )}

        {/* Featured hero */}
        {featured && !search && (
          <Link href={`/news/${featured.id}`} className="block mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden"
            >
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-primary text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Featured
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="text-xs text-white/60 mb-2">
                  {format(new Date(featured.publishedAt), "MMMM d, yyyy")} &bull; {CAT_LABEL[featured.category] ?? featured.category}
                </div>
                <h2 className="font-display font-bold text-xl md:text-3xl text-white mb-2 group-hover:text-primary transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-white/70 max-w-2xl line-clamp-2 text-sm">{featured.excerpt}</p>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Article cards */}
        <div className="space-y-2">
          {(search ? filtered : rest)?.map((item, i) => (
            <ArticleCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {!isLoading && (!filtered || filtered.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No articles found.</div>
        )}
      </PageWrapper>
    </div>
  );
}
