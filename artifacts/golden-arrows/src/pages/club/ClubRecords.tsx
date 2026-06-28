import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Trophy, Star, Shield, Zap } from "lucide-react";

const HONOURS = [
  { title: "Multichoice Diski Shield Winners", season: "2018/2019", category: "Cup" },
  { title: "Multichoice Diski Challenge Winners", season: "2017/2018", category: "Cup" },
  { title: "Multichoice Diski Challenge Winners", season: "2015/2016", category: "Cup" },
  { title: "Hibiscus Mayoral Cup Winners", season: "2015/2016", category: "Regional" },
  { title: "NFD Champions", season: "2014/2015", category: "League" },
  { title: "Premier Cup Champions", season: "2011", category: "Cup" },
  { title: "MTN8 Champions", season: "2009/2010", category: "Cup" },
  { title: "First Division Coastal Stream Champions", season: "1999/2000", category: "League" },
];

const RECORDS = [
  {
    icon: <Star className="h-5 w-5" />,
    title: "Most Appearances",
    description: "The all-time appearance record holders for the club across all competitions, tracking every player who pulled on the Golden Arrows shirt.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Most Goals",
    description: "The club's top scorers in the PSL era, recognising the strikers and midfielders who found the net most for Abafana Bes'thende.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Record Victories",
    description: "The biggest wins in the club's history — the games where Golden Arrows put their opponents to the sword in memorable fashion.",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "PSL Record",
    description: "Key milestones and records in the DStv / Betway Premiership era, reflecting the club's sustained top-flight status.",
  },
];

const CENTURY_CLUBS = [
  {
    title: "100 Club",
    description: "Players who have made 100 or more appearances for Lamontville Golden Arrows FC in competitive matches.",
  },
  {
    title: "200 Club",
    description: "The elite group of players who have made 200 or more appearances for the club — true Golden Arrows legends.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Cup: "bg-primary/10 text-primary border-primary/20",
  League: "bg-secondary/10 text-secondary border-secondary/20",
  Regional: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function ClubRecords() {
  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
            <Link href="/club" className="hover:text-primary transition-colors">The Club</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Records</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Club <span className="text-primary">Records</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Honours, milestones, and the records that define Lamontville Golden Arrows FC's proud history.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16">

        {/* Honours */}
        <div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-10">
            Honours
          </h2>
          <div className="space-y-3">
            {HONOURS.map((h, i) => (
              <motion.div
                key={`${h.title}-${h.season}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-white/5 rounded-xl p-5 flex items-center gap-5 hover:border-primary/20 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-display font-bold text-lg">{h.title}</div>
                  <div className="text-primary font-bold text-sm mt-0.5">{h.season}</div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${CATEGORY_COLORS[h.category]}`}>
                  {h.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistical Records */}
        <div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">
            Statistical <span className="text-primary">Records</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {RECORDS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-white/5 rounded-xl p-6 hover:border-primary/20 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  {r.icon}
                </div>
                <h3 className="font-display font-bold text-xl mb-2 text-primary">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Century Clubs */}
        <div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">
            Appearance <span className="text-primary">Milestones</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CENTURY_CLUBS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 rounded-xl p-8 text-center hover:border-primary/20 transition-colors"
              >
                <div className="font-display font-bold text-5xl text-primary mb-3">
                  {c.title.split(" ")[0]}
                </div>
                <div className="font-display font-bold text-xl uppercase tracking-wide mb-3">{c.title}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
