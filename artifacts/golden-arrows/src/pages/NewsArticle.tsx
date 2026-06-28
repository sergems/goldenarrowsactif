import { useGetNewsArticle, useListNews } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Facebook, Twitter, MessageCircle } from "lucide-react";

function ShareBar({ title, url }: { title: string; url: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      bg: "bg-[#1877F2] hover:bg-[#166fe5]",
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      bg: "bg-black hover:bg-neutral-800 border border-white/10",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`,
      bg: "bg-[#25D366] hover:bg-[#20ba59]",
      icon: <MessageCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Share this article</p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map(s => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider transition-colors ${s.bg}`}
          >
            {s.icon} {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading } = useGetNewsArticle(Number(id));
  const { data: related } = useListNews({ category: article?.category, limit: 3 });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading article...</div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Article not found.</div>;

  const relatedArticles = related?.filter(a => a.id !== article.id).slice(0, 2);
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">{article.category}</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-5xl text-white leading-tight">{article.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 md:py-10">
        <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <div className="text-muted-foreground text-sm mb-6 flex flex-wrap items-center gap-2 md:gap-3">
              <span>{article.author}</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
            </div>

            <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed font-medium">{article.excerpt}</p>

            {article.content && (
              <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex gap-2 flex-wrap">
                {article.tags.map(tag => (
                  <span key={tag} className="bg-card border border-white/10 text-muted-foreground text-xs px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}

            <ShareBar title={article.title} url={articleUrl} />
          </div>

          <div>
            {/* Related articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-base uppercase tracking-tight mb-5 text-primary">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map(rel => (
                    <Link key={rel.id} href={`/news/${rel.id}`} className="block group">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{format(new Date(rel.publishedAt), "MMM d, yyyy")}</p>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">{rel.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share shortcut in sidebar on desktop */}
            <div className="hidden md:block mt-8 pt-8 border-t border-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Share</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, color: "text-[#1877F2]", icon: <Facebook className="h-4 w-4" /> },
                  { label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`, color: "text-white/70", icon: <Twitter className="h-4 w-4" /> },
                  { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + articleUrl)}`, color: "text-[#25D366]", icon: <MessageCircle className="h-4 w-4" /> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 text-sm font-bold hover:text-primary transition-colors ${s.color}`}>
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
