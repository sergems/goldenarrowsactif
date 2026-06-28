import { useState } from "react";
import { useListNews } from "@workspace/api-client-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["All", "match-report", "club-news", "community"];

export default function News() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const { data: news, isLoading } = useListNews({ category: category || undefined, limit: 20 });

  const filtered = news?.filter(item =>
    !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered?.find(n => n.featured);
  const rest = filtered?.filter(n => !n.featured);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="From The Club"
        title="Latest"
        highlight="News"
        description="Stay up to date with everything happening at Golden Arrows FC."
      />

      <PageWrapper page="news">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-5 sm:mb-10">
          <div className="hidden md:flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === "All" ? undefined : cat)}
                className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors ${
                  (cat === "All" && !category) || cat === category
                    ? "bg-primary text-black"
                    : "bg-card border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "match-report" ? "Match Reports" : cat === "club-news" ? "Club News" : cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading && <div className="text-center text-muted-foreground py-20">Loading news...</div>}

        {/* Featured Article */}
        {featured && !search && (
          <Link href={`/news/${featured.id}`} className="block mb-6 sm:mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
            >
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="bg-primary text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">Featured</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-sm text-white/60 mb-3">{format(new Date(featured.publishedAt), "MMMM d, yyyy")} &bull; {featured.category}</div>
                <h2 className="font-display font-bold text-2xl md:text-4xl text-white mb-3 group-hover:text-primary transition-colors leading-tight">{featured.title}</h2>
                <p className="text-white/70 max-w-2xl line-clamp-2">{featured.excerpt}</p>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(search ? filtered : rest)?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group"
            >
              <Link href={`/news/${item.id}`} className="block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-black text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{format(new Date(item.publishedAt), "MMM d, yyyy")} &bull; {item.author}</div>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{item.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {!isLoading && (!filtered || filtered.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No articles found.</div>
        )}
      </PageWrapper>
    </div>
  );
}
