import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

const SEASONS = [
  "2000/2001","2001/2002","2002/2003","2003/2004","2004/2005",
  "2005/2006","2006/2007","2007/2008","2008/2009","2009/2010",
  "2010/2011","2011/2012","2012/2013","2013/2014","2014/2015",
  "2015/2016","2016/2017","2017/2018","2018/2019","2019/2020",
  "2020/2021","2021/2022","2022/2023","2023/2024",
];

const TIMELINE = [
  { year: "1943", event: "Lamontville Golden Arrows FC is founded in Lamontville, Durban, KwaZulu-Natal." },
  { year: "1980s", event: "The club rises through South African football, establishing itself as a KwaZulu-Natal powerhouse and a nursery for local talent." },
  { year: "1997", event: "Golden Arrows earns promotion to the top flight of South African football." },
  { year: "1999/2000", event: "MTN First Division League champions — promoted to the PSL for the first time." },
  { year: "2009/2010", event: "MTN8 Cup champions — the club's first major PSL silverware." },
  { year: "2011", event: "KZN Premiers Cup champions, cementing regional dominance." },
  { year: "2014/2015", event: "National First Division (NFD) Champions — regain top-flight status." },
  { year: "2015/2016", event: "Multichoice Diski Challenge Winners and Hibiscus Mayoral Cup Winners." },
  { year: "2017/2018", event: "Multichoice Diski Challenge Winners." },
  { year: "2018/2019", event: "Multichoice Diski Shield Winners." },
  { year: "Today", event: "Abafana Bes'thende continue to represent Durban and KwaZulu-Natal with pride in the Betway Premiership." },
];

export default function ClubHistory() {
  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
            <Link href="/club" className="hover:text-primary transition-colors">The Club</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">History</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Club <span className="text-primary">History</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            From Lamontville's streets to the Betway Premiership since 1943.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16">

        {/* Timeline */}
        <div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-10">Club <span className="text-primary">Timeline</span></h2>
          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-6 pb-8 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-display font-bold text-xs flex-shrink-0">
                    {item.year.slice(-2)}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                </div>
                <div className="pb-8 last:pb-0">
                  <div className="font-display font-bold text-primary text-lg mb-1">{item.year}</div>
                  <p className="text-muted-foreground">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Season Archives */}
        <div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-2">Season <span className="text-primary">Archive</span></h2>
          <p className="text-muted-foreground mb-8">All match results and goal scorers from the year 2000 to the end of the last season.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SEASONS.map((season, i) => (
              <motion.a
                key={season}
                href={`https://www.goldenarrowsfc.com/history/`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-white/5 rounded-xl p-4 text-center font-display font-bold text-sm uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-colors group"
              >
                {season}
                <ChevronRight className="h-3 w-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
