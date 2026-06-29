import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronRight, ChevronLeft, Trophy, Star, Award, Filter,
} from "lucide-react";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";
import mtn8Img from "@assets/MTN_8_LOGO_1782640838208.jpg";
import diskiShieldImg from "@assets/multichoice_diski_shield_1782640838209.jpg";
import nfdImg from "@assets/ndf_logo_1782640838211.png";
import nedbankImg from "@assets/Nedbank_cup_logo_1782642949619.png";
import nslImg from "@assets/National_Soccer_League_(South_Africa)_1782642949618.svg";
import carlingKnockoutImg from "@assets/Knockout-Cup-Logo_1782642949617.png";
import premierCupImg from "@assets/premier_cup_1782642949619.jpg";

type Category = "all" | "cup" | "league" | "regional";

const TROPHIES = [
  {
    title: "MTN8 Trophy",
    season: "2009/10",
    subtitle: "MTN8 Champions",
    description:
      "The oldest knock-out competition in South African football — Golden Arrows claimed it in dramatic fashion in the 2009/10 season. A packed Moses Mabhida witnessed Abafana Bes'thende lift the most prestigious cup of the era in one of the greatest achievements in the PSL era. This title remains the pinnacle of the club's cup pedigree.",
    image: mtn8Img,
    objectFit: "contain" as const,
    category: "cup" as Category,
    highlight: true,
    stat: "1st PSL cup title",
  },
  {
    title: "Nedbank Cup",
    season: "2013",
    subtitle: "Nedbank Cup Champions",
    description:
      "A historic cup run that silenced critics and ended with Abafana Bes'thende lifting one of South Africa's most prestigious knockout trophies. The 2013 Nedbank Cup campaign demonstrated Golden Arrows' quality across 90 minutes and extra time, finishing with a triumphant final that cemented the club's reputation as cup specialists.",
    image: nedbankImg,
    objectFit: "cover" as const,
    category: "cup" as Category,
    highlight: false,
    stat: "2nd major cup title",
  },
  {
    title: "Carling Knockout",
    season: "2021/22",
    subtitle: "Carling Black Label Cup Winners",
    description:
      "A statement of the modern era — Golden Arrows lifted the Carling Black Label Knockout in a memorable campaign that showcased the club's cup-fighting spirit. The win demonstrated that the next generation of Abafana Bes'thende could produce the big moments when it mattered most.",
    image: carlingKnockoutImg,
    objectFit: "cover" as const,
    category: "cup" as Category,
    highlight: false,
    stat: "Most recent cup win",
  },
  {
    title: "NSL Championship",
    season: "2003/04",
    subtitle: "League Champions",
    description:
      "Golden Arrows topped the NSL table in dominant fashion in the 2003/04 season, cementing their status as one of South African football's elite clubs. This title was the product of a sustained season-long campaign, with consistency and quality throughout the year earning the club their first league championship.",
    image: nslImg,
    objectFit: "contain" as const,
    category: "league" as Category,
    highlight: false,
    stat: "First league title",
  },
  {
    title: "NSL Championship",
    season: "2012/13",
    subtitle: "League Champions",
    description:
      "The 2012/13 title confirmed Arrows as one of the most consistent clubs of the modern era — a second NSL crown to add to the cabinet. The campaign was built on a solid defensive foundation and clinical finishing from a squad that had been carefully assembled to compete at the highest level.",
    image: nslImg,
    objectFit: "contain" as const,
    category: "league" as Category,
    highlight: false,
    stat: "Second league title",
  },
  {
    title: "National First Division",
    season: "2014/15",
    subtitle: "NFD Champions & Promoted",
    description:
      "Promotion back to the top flight in emphatic style — winning the NFD title without question and returning Arrows to where they belong. After a period in the second tier, the club showed the character and quality that defines Abafana Bes'thende, going through the season as worthy champions.",
    image: nfdImg,
    objectFit: "cover" as const,
    category: "league" as Category,
    highlight: false,
    stat: "Promotion season",
  },
  {
    title: "KZN Premier's Cup",
    season: "Multiple",
    subtitle: "KZN Premier's Cup Champions",
    description:
      "A provincial honour that underscores Golden Arrows' dominance in KwaZulu-Natal football — representing the club's roots and pride in the region. The KZN Premier's Cup titles across multiple seasons proved the club's consistent quality at both national and provincial level.",
    image: premierCupImg,
    objectFit: "cover" as const,
    category: "regional" as Category,
    highlight: false,
    stat: "Regional dominance",
  },
  {
    title: "Diski Challenge",
    season: "2015/16 · 2017/18",
    subtitle: "MDC Champions — Back to Back",
    description:
      "Back-to-back Diski Challenge titles proved the depth of the Arrows academy, producing the next generation of Durban football talent. Two championships in the reserve league highlighted a long-term club philosophy — investing in youth, developing players, and winning from the grassroots up.",
    image: diskiShieldImg,
    objectFit: "cover" as const,
    category: "regional" as Category,
    highlight: false,
    stat: "Academy excellence",
  },
];

const CATEGORY_TABS: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "all",      label: "All Honours",    icon: <Trophy className="h-3.5 w-3.5" /> },
  { id: "cup",      label: "Cup Wins",       icon: <Award className="h-3.5 w-3.5" /> },
  { id: "league",   label: "League Titles",  icon: <Star className="h-3.5 w-3.5" /> },
  { id: "regional", label: "Regional",       icon: <Filter className="h-3.5 w-3.5" /> },
];

const STATS = [
  { label: "Cup Titles",       value: TROPHIES.filter(t => t.category === "cup").length },
  { label: "League Titles",    value: TROPHIES.filter(t => t.category === "league").length },
  { label: "Regional Honours", value: TROPHIES.filter(t => t.category === "regional").length },
  { label: "Total Honours",    value: TROPHIES.length },
];

const ANGLE_PER = 360 / TROPHIES.length;
const RADIUS = 380;

// ─── Stat Counter ─────────────────────────────────────────────────────────────

function StatCounter({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-0.5"
    >
      <span className="font-display font-black text-3xl sm:text-4xl text-primary leading-none">{value}</span>
      <span className="text-white/35 text-[10px] uppercase tracking-widest font-bold">{label}</span>
    </motion.div>
  );
}

// ─── Trophy Card ──────────────────────────────────────────────────────────────

function TrophyCard({
  trophy, angle, isActive, total, onClick,
}: {
  trophy: typeof TROPHIES[number];
  angle: number;
  isActive: boolean;
  total: number;
  onClick: () => void;
}) {
  return (
    <div
      className="absolute inset-0 cursor-pointer"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
        backfaceVisibility: "hidden",
      }}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden border"
        animate={{
          borderColor: isActive ? "rgba(255,215,0,0.7)" : "rgba(255,255,255,0.07)",
          boxShadow: isActive
            ? "0 0 48px rgba(255,215,0,0.3), inset 0 0 28px rgba(255,215,0,0.08)"
            : "0 4px 24px rgba(0,0,0,0.4)",
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: isActive
            ? "0 0 64px rgba(255,215,0,0.5), inset 0 0 32px rgba(255,215,0,0.14)"
            : "0 0 36px rgba(255,215,0,0.2)",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{
          backgroundColor: trophy.objectFit === "contain" ? "hsl(140 10% 5%)" : undefined,
        }}
      >
        {/* Trophy image */}
        <img
          src={trophy.image}
          alt={trophy.title}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: trophy.objectFit,
            padding: trophy.objectFit === "contain" ? 20 : undefined,
            transition: "opacity 0.5s ease",
            opacity: isActive ? (trophy.objectFit === "contain" ? 0.95 : 0.88) : 0.28,
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isActive
              ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.75) 50%, rgba(5,15,5,0.65) 100%)",
          }}
        />

        {/* Active gold shimmer top */}
        {isActive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(255,215,0,0.2) 0%, transparent 40%)" }}
          />
        )}

        {/* Text at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-4 text-center">
          <p
            className="font-display font-black text-[11px] uppercase leading-tight tracking-wide transition-colors duration-500"
            style={{ color: isActive ? "#FFD700" : "rgba(255,255,255,0.35)" }}
          >
            {trophy.title}
          </p>
          <p
            className="text-[9px] mt-0.5 font-bold tracking-wider transition-colors duration-500"
            style={{ color: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.16)" }}
          >
            {trophy.season}
          </p>
        </div>

        {/* Active indicator ring */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,215,0,0.2)", border: "1px solid rgba(255,215,0,0.5)" }}
          >
            <Star className="h-2.5 w-2.5 text-primary fill-primary" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClubTrophy() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [category, setCategory] = useState<Category>("all");
  const [logoSpin, setLogoSpin] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = category === "all" ? TROPHIES : TROPHIES.filter(t => t.category === category);
  const N = filtered.length;
  const safeIdx = Math.min(activeIdx, N - 1);

  // Animate carousel rotation
  const rawRotate = useMotionValue(-safeIdx * (360 / N));
  const carouselRotate = useSpring(rawRotate, { stiffness: 60, damping: 18, restDelta: 0.01 });

  useEffect(() => {
    rawRotate.set(-safeIdx * (360 / N));
    setLogoSpin(prev => prev + (360 / N));
  }, [safeIdx, N, rawRotate]);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIdx(0);
  }, [category]);

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + N) % N), [N]);
  const next = useCallback(() => setActiveIdx(i => (i + 1) % N), [N]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const activeTrophy = filtered[safeIdx];
  const anglePerCard = 360 / N;

  return (
    <div className="min-h-screen" style={{ background: "hsl(140 10% 4%)" }}>

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/6" style={{ background: "hsl(140 10% 5%)" }}>
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, #FFD700, transparent)", filter: "blur(40px)" }} />
        </div>

        <div className="relative container mx-auto px-4 pt-5 pb-7">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-white/30 mb-4">
            <Link href="/club" className="hover:text-primary transition-colors font-medium">The Club</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/60 font-medium">Trophy Cabinet</span>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <p className="text-primary font-bold uppercase tracking-[0.35em] text-[10px] mb-2 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-primary/60" />
              Lamontville Golden Arrows FC
              <span className="w-6 h-px bg-primary/60" />
            </p>
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
              Trophy <span className="text-primary">Cabinet</span>
            </h1>
            <p className="text-white/35 text-sm mt-2">Every major honour won by Abafana Bes'thende</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            {STATS.map(s => <StatCounter key={s.label} value={s.value} label={s.label} />)}
          </div>
        </div>
      </div>

      {/* ── Category Tabs ─────────────────────────────────────────────────── */}
      <div className="border-b border-white/6 sticky top-0 z-30" style={{ background: "hsl(140 10% 5% / 0.95)", backdropFilter: "blur(12px)" }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
            {CATEGORY_TABS.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest whitespace-nowrap border transition-all flex-shrink-0 ${
                  category === tab.id
                    ? "border-primary/60 bg-primary/12 text-primary"
                    : "border-white/8 text-white/35 hover:text-white/65 hover:border-white/20"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id !== "all" && (
                  <span className={`text-[9px] rounded-full px-1.5 py-0.5 font-black ${
                    category === tab.id ? "bg-primary/20 text-primary" : "bg-white/6 text-white/25"
                  }`}>
                    {TROPHIES.filter(t => t.category === tab.id).length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Studio ────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">

          {/* ── 3D Carousel Column ───────────────────────────────────────────── */}
          <div ref={containerRef} className="flex-1 flex flex-col items-center gap-6 min-w-0">

            {/* Carousel */}
            <div
              className="relative w-full"
              style={{
                height: 360,
                perspective: "1500px",
                perspectiveOrigin: "50% 50%",
                overflow: "visible",
              }}
            >
              {/* Ambient light */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(255,215,0,0.08), transparent 70%)", filter: "blur(20px)" }}
                />
              </div>

              {/* Spinning disk */}
              <motion.div
                className="absolute"
                style={{
                  width: 190,
                  height: 240,
                  top: "50%",
                  left: "50%",
                  marginTop: -120,
                  marginLeft: -95,
                  transformStyle: "preserve-3d",
                  rotateY: carouselRotate,
                }}
              >
                {filtered.map((trophy, i) => (
                  <TrophyCard
                    key={`${trophy.title}-${trophy.season}-${i}`}
                    trophy={trophy}
                    angle={i * anglePerCard}
                    isActive={i === safeIdx}
                    total={N}
                    onClick={() => setActiveIdx(i)}
                  />
                ))}
              </motion.div>

              {/* Ground shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-8 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,215,0,0.12), transparent)", filter: "blur(16px)" }} />
            </div>

            {/* Navigation controls */}
            <div className="flex items-center gap-5">
              {/* Prev */}
              <motion.button onClick={prev} whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.93 }}
                className="w-10 h-10 rounded-xl border border-white/12 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/40 hover:bg-primary/8 transition-all">
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {filtered.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    animate={{
                      width: i === safeIdx ? 28 : 8,
                      backgroundColor: i === safeIdx ? "#FFD700" : "rgba(255,255,255,0.15)",
                    }}
                    className="h-2 rounded-full"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                ))}
              </div>

              {/* Next */}
              <motion.button onClick={next} whileHover={{ scale: 1.1, x: 2 }} whileTap={{ scale: 0.93 }}
                className="w-10 h-10 rounded-xl border border-white/12 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/40 hover:bg-primary/8 transition-all">
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Counter */}
            <div className="flex items-baseline gap-1 text-white/25 text-xs">
              <span className="text-primary font-black text-2xl leading-none">{safeIdx + 1}</span>
              <span>/</span>
              <span className="font-bold">{N}</span>
              <span className="ml-2 text-[10px] uppercase tracking-widest">honours</span>
            </div>

            {/* Keyboard hint */}
            <p className="text-white/18 text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span className="border border-white/12 rounded px-1 py-0.5 text-[9px]">←</span>
              Use arrow keys to navigate
              <span className="border border-white/12 rounded px-1 py-0.5 text-[9px]">→</span>
            </p>
          </div>

          {/* ── Info Panel ───────────────────────────────────────────────────── */}
          <div className="lg:w-[380px] flex-shrink-0 flex flex-col gap-5">

            {/* GA Logo spinning */}
            <div className="flex items-center gap-4 mb-1">
              <motion.div animate={{ rotateY: logoSpin }} transition={{ type: "spring", stiffness: 45, damping: 14 }}>
                <img src={logo} alt="Golden Arrows" className="w-10 h-10 object-contain"
                  style={{ filter: "drop-shadow(0 0 14px rgba(255,215,0,0.55))" }} />
              </motion.div>
              <div>
                <p className="text-white/25 text-[9px] uppercase tracking-[0.3em] font-bold">Lamontville Golden Arrows</p>
                <p className="text-white/50 text-xs font-bold">PSL · Durban, KwaZulu-Natal</p>
              </div>
            </div>

            {/* Trophy detail card */}
            <AnimatePresence mode="wait">
              {activeTrophy && (
                <motion.div
                  key={`${activeTrophy.title}-${activeTrophy.season}`}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="rounded-2xl overflow-hidden border border-white/10 relative"
                  style={{ background: "hsl(140 10% 7%)" }}
                >
                  {/* Trophy image banner */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={activeTrophy.image}
                      alt={activeTrophy.title}
                      className="absolute inset-0 w-full h-full"
                      style={{
                        objectFit: activeTrophy.objectFit,
                        padding: activeTrophy.objectFit === "contain" ? 24 : undefined,
                        opacity: 0.75,
                      }}
                    />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, hsl(140 10% 7%) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)" }} />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%)" }} />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        activeTrophy.category === "cup"    ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" :
                        activeTrophy.category === "league" ? "bg-green-500/15 border-green-500/30 text-green-400" :
                                                             "bg-blue-500/15 border-blue-500/30 text-blue-400"
                      }`}>
                        {activeTrophy.category === "cup" ? "Cup" : activeTrophy.category === "league" ? "League" : "Regional"}
                      </span>
                    </div>

                    {activeTrophy.highlight && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-primary" /> Signature Win
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Subtitle tag */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-5 h-px bg-primary/50" />
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">
                        {activeTrophy.subtitle}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-white mb-1 leading-tight">
                      {activeTrophy.title}
                    </h2>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-primary font-black text-base">{activeTrophy.season}</span>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-white/30 text-xs font-bold uppercase tracking-wider">{activeTrophy.stat}</span>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed">
                      {activeTrophy.description}
                    </p>

                    {/* Divider */}
                    <div className="my-4 h-px bg-white/6" />

                    {/* Navigation between cards */}
                    <div className="flex items-center justify-between">
                      <motion.button onClick={prev} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white/30 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">
                        <ChevronLeft className="h-3.5 w-3.5" /> Prev
                      </motion.button>

                      <div className="flex items-center gap-1.5">
                        {filtered.map((_, i) => (
                          <motion.button key={i} onClick={() => setActiveIdx(i)}
                            animate={{ scale: i === safeIdx ? 1.3 : 1, backgroundColor: i === safeIdx ? "#FFD700" : "rgba(255,255,255,0.12)" }}
                            className="w-2 h-2 rounded-full"
                          />
                        ))}
                      </div>

                      <motion.button onClick={next} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white/30 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* All trophies quick-nav */}
            <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "hsl(140 10% 6%)" }}>
              <div className="px-4 py-3 border-b border-white/6">
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-black">All Honours</p>
              </div>
              <div className="divide-y divide-white/5">
                {filtered.map((t, i) => (
                  <motion.button
                    key={`${t.title}-${t.season}-nav`}
                    onClick={() => setActiveIdx(i)}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group ${
                      i === safeIdx ? "bg-primary/8" : "hover:bg-white/3"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border relative ${
                      i === safeIdx ? "border-primary/40" : "border-white/8"
                    }`}>
                      <img src={t.image} alt={t.title} className="w-full h-full"
                        style={{ objectFit: t.objectFit, padding: t.objectFit === "contain" ? 4 : undefined, opacity: i === safeIdx ? 0.9 : 0.4 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black truncate uppercase tracking-wide ${i === safeIdx ? "text-primary" : "text-white/50 group-hover:text-white/75"}`}>
                        {t.title}
                      </p>
                      <p className="text-white/25 text-[9px] font-bold">{t.season}</p>
                    </div>
                    {i === safeIdx && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline Strip ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/6 mt-4" style={{ background: "hsl(140 10% 5%)" }}>
        <div className="container mx-auto px-4 py-8">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] font-black text-center mb-6">Honours Timeline</p>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-4 left-0 right-0 h-px bg-white/8" />
            <div className="flex items-start gap-0 overflow-x-auto no-scrollbar pb-2">
              {[...TROPHIES].sort((a, b) => {
                const ya = parseInt(a.season.split("/")[0].split("·")[0]);
                const yb = parseInt(b.season.split("/")[0].split("·")[0]);
                return ya - yb;
              }).map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[90px] relative cursor-pointer group"
                  onClick={() => {
                    const idx = filtered.findIndex(f => f.title === t.title && f.season === t.season);
                    if (idx !== -1) { setCategory("all"); setActiveIdx(TROPHIES.findIndex(f => f.title === t.title && f.season === t.season)); }
                  }}>
                  {/* Dot */}
                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    className={`w-3 h-3 rounded-full border-2 z-10 transition-colors ${
                      t.category === "cup"    ? "border-yellow-400 bg-yellow-400/30 group-hover:bg-yellow-400" :
                      t.category === "league" ? "border-green-400 bg-green-400/30 group-hover:bg-green-400" :
                                               "border-blue-400 bg-blue-400/30 group-hover:bg-blue-400"
                    }`}
                  />
                  {/* Season */}
                  <p className="text-[8px] text-white/30 font-bold text-center leading-tight group-hover:text-white/65 transition-colors">
                    {t.season.slice(0, 7)}
                  </p>
                  {/* Trophy name */}
                  <p className="text-[8px] text-white/20 text-center leading-tight w-full px-1 group-hover:text-white/45 transition-colors">
                    {t.title.split(" ").slice(0, 2).join(" ")}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-4">
              {[
                { color: "bg-yellow-400", label: "Cup" },
                { color: "bg-green-400", label: "League" },
                { color: "bg-blue-400", label: "Regional" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${l.color} opacity-60`} />
                  <span className="text-[9px] text-white/25 uppercase tracking-wider font-bold">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
