import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Trophy } from "lucide-react";

const TROPHIES = [
  {
    title: "Multichoice Diski Shield",
    season: "2018/2019",
    subtitle: "MDC Shield Champions",
    description: "Golden Arrows claimed the Multichoice Diski Shield title in the 2018/2019 season, adding to the club's growing collection of reserve league honours.",
    color: "from-yellow-600/20 to-transparent",
    border: "border-yellow-500/20",
  },
  {
    title: "Multichoice Diski Challenge",
    season: "2017/2018",
    subtitle: "MDC Champions",
    description: "Back-to-back Diski Challenge glory — the club retained their reserve-league dominance with another title in 2017/2018.",
    color: "from-yellow-600/20 to-transparent",
    border: "border-yellow-500/20",
  },
  {
    title: "Multichoice Diski Challenge",
    season: "2015/2016",
    subtitle: "MDC Champions",
    description: "The first Diski Challenge title — Golden Arrows established themselves as a force in the reserve league competition.",
    color: "from-yellow-600/20 to-transparent",
    border: "border-yellow-500/20",
  },
  {
    title: "National First Division",
    season: "2014/2015",
    subtitle: "NFD Champions",
    description: "After a stint in the NFD, Golden Arrows returned to the top flight in dominant fashion, winning the league and earning immediate promotion back to the PSL.",
    color: "from-green-700/20 to-transparent",
    border: "border-green-500/20",
  },
  {
    title: "KZN Premiers Cup",
    season: "2011",
    subtitle: "KZN Premiers Cup Champions",
    description: "Regional glory for Abafana Bes'thende — the KZN Premiers Cup title underlined the club's dominance in KwaZulu-Natal football.",
    color: "from-green-700/20 to-transparent",
    border: "border-green-500/20",
  },
  {
    title: "MTN8 Trophy",
    season: "2009/2010",
    subtitle: "MTN8 Winners",
    description: "The MTN8 — the oldest cup competition in South African football — was won by Golden Arrows in dramatic fashion. This remains one of the club's greatest achievements in the PSL era.",
    color: "from-primary/20 to-transparent",
    border: "border-primary/30",
    highlight: true,
  },
  {
    title: "MTN First Division League",
    season: "1999/2000",
    subtitle: "Promoted to PSL",
    description: "The foundation of the modern Golden Arrows era. Winning the First Division in 1999/2000 earned the club promotion to the Premier Soccer League for the first time.",
    color: "from-green-700/20 to-transparent",
    border: "border-green-500/20",
  },
];

export default function ClubTrophy() {
  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
            <Link href="/club" className="hover:text-primary transition-colors">The Club</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Trophy Cabinet</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Trophy <span className="text-primary">Cabinet</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Every major honour won by Lamontville Golden Arrows FC.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">

        {/* Trophy count banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-primary/20 rounded-2xl p-8 text-center mb-14"
        >
          <div className="font-display font-bold text-8xl text-primary mb-2">{TROPHIES.length}</div>
          <div className="font-display font-bold text-2xl uppercase tracking-widest">Major Honours</div>
          <p className="text-muted-foreground mt-2 text-sm">Across league titles, cup competitions and regional honours</p>
        </motion.div>

        {/* Trophies list */}
        <div className="space-y-5">
          {TROPHIES.map((trophy, i) => (
            <motion.div
              key={`${trophy.title}-${trophy.season}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative overflow-hidden bg-card border rounded-2xl p-6 flex gap-6 items-start ${trophy.border} ${trophy.highlight ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${trophy.color} pointer-events-none`} />
              <div className={`relative h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${trophy.highlight ? "bg-primary/20 border border-primary/30" : "bg-white/5 border border-white/10"}`}>
                <Trophy className={`h-7 w-7 ${trophy.highlight ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="relative flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-1">
                  <h3 className="font-display font-bold text-xl">{trophy.title}</h3>
                  {trophy.highlight && (
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      PSL Era
                    </span>
                  )}
                </div>
                <div className="text-primary font-bold text-sm mb-3">{trophy.season} · {trophy.subtitle}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{trophy.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
