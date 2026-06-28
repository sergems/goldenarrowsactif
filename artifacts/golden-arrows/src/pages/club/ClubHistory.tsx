import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Trophy, Star, TrendingUp, Shield, Zap, ChevronDown } from "lucide-react";
import mtn8Img from "@assets/MTN_8_LOGO_1782640838208.jpg";
import nslImg from "@assets/National_Soccer_League_(South_Africa)_1782642949618.svg";
import nfdImg from "@assets/ndf_logo_1782640838211.png";
import premierCupImg from "@assets/premier_cup_1782642949619.jpg";
import diskiChallengeImg from "@assets/MCSA-Diski-Challenge-Logo_1782640838206.png";
import diskiShieldImg from "@assets/multichoice_diski_shield_1782640838209.jpg";

const ERA_COLORS: Record<string, { bg: string; border: string; glow: string; label: string }> = {
  founding:   { bg: "from-amber-900/40 to-amber-800/20",  border: "border-amber-500/40",  glow: "shadow-amber-500/20",  label: "Founding Era" },
  growth:     { bg: "from-green-900/40 to-green-800/20",  border: "border-green-500/40",  glow: "shadow-green-500/20",  label: "Growth Era"   },
  promotion:  { bg: "from-blue-900/40 to-blue-800/20",    border: "border-blue-500/40",   glow: "shadow-blue-500/20",   label: "Promotion"    },
  silverware: { bg: "from-yellow-900/40 to-yellow-800/20",border: "border-yellow-400/50", glow: "shadow-yellow-400/30", label: "Silverware"   },
  modern:     { bg: "from-emerald-900/40 to-emerald-800/20",border:"border-emerald-500/40",glow:"shadow-emerald-500/20", label: "Modern Era"  },
};

const TIMELINE = [
  {
    year: "1943",
    era: "founding",
    icon: Shield,
    title: "The Birth of the Arrows",
    event: "Lamontville Golden Arrows FC is founded in the township of Lamontville, on the outskirts of Durban, KwaZulu-Natal. Born from the streets and passion of a proud community.",
    detail: "The club was established by local football enthusiasts who wanted to give the people of Lamontville a team to call their own. The yellow-and-green colours were chosen to represent the gold of their ambitions and the green of their land.",
    highlight: null,
  },
  {
    year: "1950s–70s",
    era: "growth",
    icon: TrendingUp,
    title: "Community Roots Run Deep",
    event: "Golden Arrows grow from a local neighbourhood side into one of KwaZulu-Natal's most-recognised football clubs, nurturing generations of local talent.",
    detail: "Through decades of apartheid-era football, the Arrows were a beacon of pride for the Lamontville community. The club competed fiercely in the then-divided football structures, winning hearts across Durban.",
    highlight: null,
  },
  {
    year: "1980s",
    era: "growth",
    icon: TrendingUp,
    title: "KZN Powerhouse",
    event: "The club rises through South African football, establishing itself as a KwaZulu-Natal powerhouse and a proven nursery for local talent.",
    detail: "The 1980s saw Golden Arrows produce some of South Africa's most exciting young talent. Several players who honed their skills at the club went on to represent the national team, Bafana Bafana.",
    highlight: null,
  },
  {
    year: "1997",
    era: "promotion",
    icon: TrendingUp,
    title: "Rising to the Top",
    event: "Golden Arrows earn promotion to the top flight of South African football, paving the way for their first PSL adventure.",
    detail: "The promotion was celebrated across Lamontville and the wider Durban community. It marked a turning point — the Arrows were no longer just a community club; they were a national force.",
    highlight: "Promoted to top-flight",
  },
  {
    year: "1999/2000",
    era: "promotion",
    icon: Star,
    title: "MTN First Division Champions",
    event: "Golden Arrows are crowned MTN First Division League champions, earning promotion to the PSL for the first time and securing their place among South Africa's elite.",
    detail: "The league title was won in dramatic fashion, with the Arrows clinching the championship on the final day of the season. Thousands of fans flooded the streets of Lamontville to celebrate.",
    highlight: "🏆 MTN First Division Champions",
  },
  {
    year: "2009/2010",
    era: "silverware",
    icon: Trophy,
    title: "MTN8 Glory",
    event: "Golden Arrows are crowned MTN8 Cup champions — the club's first major PSL silverware. Abafana Bes'thende announce themselves on the biggest stage.",
    detail: "The MTN8 triumph was the most significant moment in the club's PSL history. It proved that Golden Arrows could compete with — and beat — the biggest clubs in South African football.",
    highlight: "🏆 MTN8 Cup Champions",
  },
  {
    year: "2011",
    era: "silverware",
    icon: Trophy,
    title: "KZN Premiers Cup",
    event: "KZN Premiers Cup champions, cementing their regional dominance and reaffirming the Arrows as the undisputed kings of KwaZulu-Natal football.",
    detail: "Winning the KZN Premiers Cup held special significance. This was about representing the province with honour — and the Arrows delivered in style, defeating rivals in an unforgettable final.",
    highlight: "🏆 KZN Premiers Cup",
  },
  {
    year: "2014/2015",
    era: "silverware",
    icon: Trophy,
    title: "NFD Champions — Back Where They Belong",
    event: "After a difficult spell, Golden Arrows bounce back as National First Division Champions, reclaiming their top-flight status with character and determination.",
    detail: "The NFD title was a testament to the club's resilience. Under difficult circumstances, players and staff united to mount an unstoppable championship-winning campaign that delighted supporters.",
    highlight: "🏆 NFD Champions",
  },
  {
    year: "2015/2016",
    era: "silverware",
    icon: Zap,
    title: "Double Delight",
    event: "Multichoice Diski Challenge Winners and Hibiscus Mayoral Cup Winners — a remarkable double that showcased the depth of talent running through the entire club.",
    detail: "The Diski Challenge triumph highlighted the strength of the club's youth development pipeline. Combined with the Mayoral Cup, it was a season that showed Golden Arrows were building for sustained success.",
    highlight: "🏆 Diski Challenge + Mayoral Cup",
  },
  {
    year: "2017/2018",
    era: "silverware",
    icon: Trophy,
    title: "Diski Dominance",
    event: "Multichoice Diski Challenge Winners once again — confirming Golden Arrows' status as the premier developers of youth talent in South African football.",
    detail: "Back-to-back Diski Challenge glory reinforced the club's commitment to nurturing the next generation. These young players would go on to form the spine of the first team.",
    highlight: "🏆 Diski Challenge Champions",
  },
  {
    year: "2018/2019",
    era: "silverware",
    icon: Star,
    title: "Diski Shield Triumph",
    event: "Multichoice Diski Shield Winners. Golden Arrows' youth teams continue to set the standard, as the club's academy becomes a blueprint for others.",
    detail: "The Diski Shield added yet another trophy to the cabinet and, more importantly, developed another crop of players who would compete at the highest levels of South African football.",
    highlight: "🏆 Diski Shield",
  },
  {
    year: "Today",
    era: "modern",
    icon: Star,
    title: "Abafana Bes'thende — The Future is Bright",
    event: "Competing in the Betway Premiership, Golden Arrows continue to represent Durban and KwaZulu-Natal with fierce pride. The journey from Lamontville's streets to South Africa's top table is an inspiration to all.",
    detail: "The modern Golden Arrows are a club with one eye on the past and both feet pointed toward the future. With a loyal fanbase, vibrant academy, and deep community roots, the best chapters of this story are still to be written.",
    highlight: "Betway Premiership",
  },
];

function TimelineNode({ item, index, isLeft }: { item: typeof TIMELINE[0]; index: number; isLeft: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const era = ERA_COLORS[item.era];
  const Icon = item.icon;

  return (
    <div ref={ref} className={`flex items-start gap-0 w-full ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-[calc(50%-2.5rem)] relative"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`bg-gradient-to-br ${era.bg} border ${era.border} rounded-2xl p-5 cursor-pointer shadow-lg ${era.glow} shadow-lg relative overflow-hidden`}
          onClick={() => setExpanded(!expanded)}
        >
          {/* Decorative glow blob */}
          <div className={`absolute -top-8 ${isLeft ? "-right-8" : "-left-8"} w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none`} />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${era.border} text-primary/80 uppercase tracking-widest`}>
                  {ERA_COLORS[item.era].label}
                </span>
              </div>
              <div className="font-display font-black text-primary text-2xl mb-1 leading-none">{item.year}</div>
              <div className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">{item.title}</div>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.event}</p>

              {item.highlight && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {item.highlight}
                </div>
              )}
            </div>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${era.bg} border ${era.border} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Expand toggle */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-3 right-3 text-muted-foreground/40 hover:text-primary/60 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>

          {/* Expanded detail */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-muted-foreground/80 leading-relaxed italic">{item.detail}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Connector arrow */}
        <div
          className={`absolute top-8 ${isLeft ? "-right-5" : "-left-5"} w-5 h-px bg-gradient-to-r ${isLeft ? "from-primary/60 to-transparent" : "from-transparent to-primary/60"}`}
        />
      </motion.div>

      {/* Center spine node */}
      <div className="w-20 flex flex-col items-center flex-shrink-0 relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 300 }}
          className="relative"
        >
          {/* Outer ring pulse */}
          {item.highlight && (
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/30"
            />
          )}
          <div className={`w-10 h-10 rounded-full bg-background border-2 ${era.border} flex items-center justify-center shadow-lg ${item.highlight ? "border-primary shadow-primary/30" : ""}`}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </motion.div>
      </div>

      {/* Spacer for opposite side */}
      <div className="w-[calc(50%-2.5rem)]" />
    </div>
  );
}

export default function ClubHistory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [activeEra, setActiveEra] = useState("founding");
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setScrollPct(Math.round(v * 100));
      const idx = Math.min(Math.floor(v * TIMELINE.length), TIMELINE.length - 1);
      setActiveEra(TIMELINE[idx].era);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Sticky scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX: scaleY }}
      />

      {/* Header */}
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
            From Lamontville's streets to the Betway Premiership since 1943. <span className="text-primary/60">Tap any card to learn more.</span>
          </p>
        </div>
      </div>

      {/* Era legend */}
      <div className="sticky top-1 z-40 flex justify-center py-2 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEra}
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`bg-background/90 backdrop-blur border ${ERA_COLORS[activeEra].border} rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest shadow-lg pointer-events-none`}
          >
            {ERA_COLORS[activeEra].label} · {scrollPct}% explored
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Intro hero band */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="font-display font-black text-6xl sm:text-8xl text-primary/10 select-none leading-none mb-2">1943</div>
          <div className="font-display font-bold text-xl sm:text-2xl uppercase tracking-widest text-white">
            Over 80 years of Golden Arrows football
          </div>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm px-4">
            Scroll through our story — trophies, promotions, heartbreak, and triumph. Tap any event to reveal the full story.
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-8 flex justify-center"
          >
            <ChevronDown className="w-6 h-6 text-primary/40" />
          </motion.div>
        </motion.div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-green-800/10 blur-2xl pointer-events-none" />
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-12 max-w-5xl relative">
        {/* Vertical spine line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary/60 to-primary/20 origin-top"
            style={{ scaleY: scrollYProgress, height: "100%" }}
          />
        </div>

        <div className="space-y-10">
          {TIMELINE.map((item, i) => (
            <TimelineNode key={item.year} item={item} index={i} isLeft={i % 2 === 0} />
          ))}
        </div>

        {/* End cap */}
        <div className="flex justify-center mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <Star className="w-7 h-7 text-primary" />
            </div>
            <div className="font-display font-black text-primary text-2xl uppercase">The Story Continues</div>
            <p className="text-muted-foreground text-sm mt-1">The best chapters are still to be written.</p>
          </motion.div>
        </div>
      </div>

      {/* Trophy cabinet summary */}
      <div className="bg-card border-t border-white/5 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-black text-3xl uppercase tracking-tight">
              Trophy <span className="text-primary">Cabinet</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Our silverware at a glance</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { trophy: "MTN8 Cup", year: "2009/10", img: mtn8Img, contain: true },
              { trophy: "MTN First Division", year: "1999/2000", img: nslImg, contain: true },
              { trophy: "National First Division", year: "2014/15", img: nfdImg, contain: true },
              { trophy: "KZN Premiers Cup", year: "2011", img: premierCupImg, contain: false },
              { trophy: "Diski Challenge", year: "2015/16 & 2017/18", img: diskiChallengeImg, contain: true },
              { trophy: "Diski Shield", year: "2018/19", img: diskiShieldImg, contain: false },
            ].map((t, i) => (
              <motion.div
                key={t.trophy}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 text-center hover:border-primary/40 transition-colors shadow-sm group"
              >
                <div className="h-20 flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.trophy}
                    className="max-h-full max-w-full transition-transform duration-300 group-hover:scale-110"
                    style={{ objectFit: t.contain ? "contain" : "cover", maxHeight: "80px" }}
                  />
                </div>
                <div className="font-display font-bold text-white text-sm uppercase tracking-wide">{t.trophy}</div>
                <div className="text-primary/70 text-xs mt-1">{t.year}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
