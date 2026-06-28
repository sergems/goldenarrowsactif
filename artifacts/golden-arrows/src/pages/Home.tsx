import {
  useListNews,
  useGetNextFixture,
  useListResults,
  useGetLeagueTable,
  useListPlayers,
  useListSlides,
  useListFixtures,
  useListSponsors,
  type Fixture,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { format, differenceInSeconds } from "date-fns";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useMouse } from "@/hooks/useMouse";
import { useWeather } from "@/hooks/useWeather";
import { MapPin, Clock, ChevronRight, Trophy, Users, Zap, Target, Star, Newspaper } from "lucide-react";
import { TeamCrest } from "@/components/TeamCrest";
import heroStadium from "@/assets/hero-stadium.png";
import playerPlaceholder from "@/assets/player-placeholder.png";
import trophiesImg from "@assets/trophies-won_1780384913023.png";
import sponsor10bet from "@assets/10bet-202425-side-banner_1780384942810.jpg";
import sponsorAquelle from "@assets/aquelle-viv-sidelogo-2425_1780384942808.jpg";
import sponsorDurban from "@assets/durban-tourism-sidelogo-2425_1780384942809.jpg";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

// ─── Date helpers ────────────────────────────────────────────────────────────

function isSameDay(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isMatchLive(dateStr: string, timeStr?: string | null) {
  const now = new Date();
  const kickoff = new Date(`${dateStr}T${timeStr || "15:00:00"}`);
  const elapsed = (now.getTime() - kickoff.getTime()) / (1000 * 60);
  return elapsed >= 0 && elapsed <= 105;
}

// ─── Floating Particles ───────────────────────────────────────────────────────

const PARTICLE_CONFIG = [
  { left: "8%",  size: 6,  dur: "9s",  delay: "0s",   drift: "20px",  color: "rgba(252,218,0,0.5)" },
  { left: "15%", size: 3,  dur: "12s", delay: "1.5s", drift: "-15px", color: "rgba(32,127,62,0.6)" },
  { left: "25%", size: 8,  dur: "7s",  delay: "3s",   drift: "25px",  color: "rgba(252,218,0,0.3)" },
  { left: "35%", size: 4,  dur: "11s", delay: "0.5s", drift: "-20px", color: "rgba(252,218,0,0.6)" },
  { left: "45%", size: 5,  dur: "8s",  delay: "2s",   drift: "10px",  color: "rgba(32,127,62,0.4)" },
  { left: "55%", size: 3,  dur: "13s", delay: "4s",   drift: "-25px", color: "rgba(252,218,0,0.5)" },
  { left: "63%", size: 7,  dur: "9s",  delay: "1s",   drift: "30px",  color: "rgba(32,127,62,0.5)" },
  { left: "72%", size: 4,  dur: "10s", delay: "3.5s", drift: "-10px", color: "rgba(252,218,0,0.4)" },
  { left: "82%", size: 6,  dur: "8s",  delay: "2.5s", drift: "20px",  color: "rgba(32,127,62,0.3)" },
  { left: "90%", size: 3,  dur: "14s", delay: "0s",   drift: "-30px", color: "rgba(252,218,0,0.7)" },
  { left: "20%", size: 5,  dur: "10s", delay: "5s",   drift: "15px",  color: "rgba(252,218,0,0.3)" },
  { left: "75%", size: 4,  dur: "11s", delay: "6s",   drift: "-18px", color: "rgba(32,127,62,0.6)" },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {PARTICLE_CONFIG.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            "--dur": p.dur,
            "--delay": p.delay,
            "--drift": p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Stadium Lights ───────────────────────────────────────────────────────────

function StadiumLights() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <div
        className="stadium-light-left absolute"
        style={{
          top: "-20%",
          left: "15%",
          width: "2px",
          height: "120%",
          background: "linear-gradient(to bottom, rgba(252,218,0,0.6) 0%, rgba(252,218,0,0.02) 70%, transparent 100%)",
          transformOrigin: "top center",
          filter: "blur(8px)",
        }}
      />
      <div
        className="stadium-light-right absolute"
        style={{
          top: "-20%",
          right: "15%",
          width: "2px",
          height: "120%",
          background: "linear-gradient(to bottom, rgba(252,218,0,0.6) 0%, rgba(252,218,0,0.02) 70%, transparent 100%)",
          transformOrigin: "top center",
          filter: "blur(8px)",
        }}
      />
      <div
        className="stadium-light-left absolute"
        style={{
          top: "-20%",
          left: "38%",
          width: "1px",
          height: "90%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%)",
          transformOrigin: "top center",
          filter: "blur(4px)",
          animationDelay: "-2s",
        }}
      />
      <div
        className="stadium-light-right absolute"
        style={{
          top: "-20%",
          right: "38%",
          width: "1px",
          height: "90%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%)",
          transformOrigin: "top center",
          filter: "blur(4px)",
          animationDelay: "-5s",
        }}
      />
    </div>
  );
}

// ─── News Ticker ──────────────────────────────────────────────────────────────

function NewsTicker({ items }: { items: { id: number; title: string; category: string }[] }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="bg-primary text-black overflow-hidden relative z-30">
      <div className="flex items-stretch">
        <div className="flex-shrink-0 bg-black text-primary font-display font-bold uppercase tracking-[0.2em] text-xs px-4 flex items-center gap-2 z-10">
          <Newspaper className="h-3 w-3" />
          Latest
        </div>
        <div className="overflow-hidden flex-1 py-2">
          <div className="ticker-track flex gap-0 whitespace-nowrap">
            {doubled.map((item, i) => (
              <Link
                key={i}
                href={`/news/${item.id}`}
                className="inline-flex items-center gap-3 px-6 hover:underline transition-all text-xs font-bold uppercase tracking-wide"
              >
                <span className="text-black/50">◆</span>
                <span className="text-black/40 font-normal normal-case tracking-normal">[{item.category}]</span>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Countdown ───────────────────────────────────────────────────────────────

function Countdown({ date, large = false }: { date: string; large?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const prevRef = useRef({ d: 0, h: 0, m: 0, s: 0 });
  const [changed, setChanged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const tick = () => {
      const diff = differenceInSeconds(new Date(date), new Date());
      if (diff > 0) {
        const next = {
          d: Math.floor(diff / 86400),
          h: Math.floor((diff % 86400) / 3600),
          m: Math.floor((diff % 3600) / 60),
          s: diff % 60,
        };
        const ch: Record<string, boolean> = {};
        (["d", "h", "m", "s"] as const).forEach((k) => {
          if (next[k] !== prevRef.current[k]) ch[k] = true;
        });
        setChanged(ch);
        prevRef.current = next;
        setTimeLeft(next);
        setTimeout(() => setChanged({}), 350);
      } else {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date]);

  const units = [
    { label: "Days", key: "d", value: timeLeft.d },
    { label: "Hrs", key: "h", value: timeLeft.h },
    { label: "Mins", key: "m", value: timeLeft.m },
    { label: "Secs", key: "s", value: timeLeft.s },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {units.map((item) => (
        <div key={item.key} className="flex flex-col items-center">
          <div
            className={`border border-primary/30 rounded-md flex items-center justify-center font-display text-primary ${changed[item.key] ? "digit-pop" : ""} ${large ? "bg-black/50 w-20 h-20 text-3xl" : "bg-black/40 w-14 h-14 text-xl"}`}
            style={{ letterSpacing: "0.05em" }}
          >
            {item.value.toString().padStart(2, "0")}
          </div>
          <span className={`uppercase tracking-widest mt-1.5 text-white/40 ${large ? "text-[10px]" : "text-[9px]"}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Hero background slider ───────────────────────────────────────────────────

function HeroBackground({ children }: { children?: React.ReactNode }) {
  const { data: slides } = useListSlides();
  const active = slides?.filter(s => s.active) ?? [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % active.length), 6000);
    return () => clearInterval(id);
  }, [active.length]);

  return (
    <div className="absolute inset-0 z-0">
      {active.length > 0 ? (
        active.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1500"
            style={{ opacity: i === idx ? 1 : 0 }}
          >
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
          </div>
        ))
      ) : (
        <img src={heroStadium} alt="Stadium" className="w-full h-full object-cover" />
      )}
      {children}
    </div>
  );
}

// ─── Floating Football ────────────────────────────────────────────────────────

function FloatingBall({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="ball-float absolute pointer-events-none select-none opacity-10 text-4xl"
      style={style}
    >
      ⚽
    </div>
  );
}

// ─── Match-day weather strip ──────────────────────────────────────────────────

function WeatherStrip() {
  const weather = useWeather();
  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-3 bg-black/30 backdrop-blur border border-white/10 rounded-xl px-5 py-2.5"
    >
      <span className="text-2xl" role="img" aria-label={weather.condition}>{weather.icon}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-2xl text-white" style={{ letterSpacing: "0.04em" }}>{weather.temperature}°C</span>
        <span className="text-white/40 text-xs font-medium">{weather.condition}</span>
      </div>
      <div className="w-px h-6 bg-white/10" />
      <div className="flex items-center gap-3 text-[11px] text-white/40 font-medium">
        <span>💨 {weather.windSpeed} km/h</span>
        <span>💧 {weather.humidity}%</span>
      </div>
      <div className="w-px h-6 bg-white/10" />
      <span className="text-[10px] text-white/25 uppercase tracking-widest font-bold">Durban, KZN</span>
    </motion.div>
  );
}

// ─── Match-day hero ───────────────────────────────────────────────────────────

function MatchDayHero({ fixture }: { fixture: Fixture }) {
  if (!fixture) return null;
  const kickoffDate = new Date(`${fixture.date}T${fixture.time || "15:00:00"}`);
  const live = isMatchLive(fixture.date, fixture.time);
  const kickoffPassed = new Date() > kickoffDate;

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden flex items-center">
      <HeroBackground>
        {live && <div className="absolute inset-0 animate-pulse bg-red-900/10" />}
      </HeroBackground>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20 z-[1]" />
      <StadiumLights />
      <FloatingParticles />

      <div className="container relative z-10 mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Status badge + weather on same row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AnimatePresence mode="wait">
              {live ? (
                <motion.div key="live" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full font-bold uppercase tracking-[0.2em] text-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  Live — Match In Progress
                </motion.div>
              ) : (
                <motion.div key="matchday" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 bg-primary text-black px-5 py-2 rounded-full font-bold uppercase tracking-[0.2em] text-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-50" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black" />
                  </span>
                  Match Day
                </motion.div>
              )}
            </AnimatePresence>
            <WeatherStrip />
          </div>

          <p className="text-white/50 font-bold uppercase tracking-[0.3em] text-xs">{fixture.competition}</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full max-w-4xl">
            <div className="flex flex-col items-center gap-4 flex-1">
              <motion.div whileHover={{ scale: 1.05 }}
                className="h-28 w-28 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center overflow-hidden glow-gold">
                <img src={logo} alt={fixture.homeTeam} className="h-22 w-22 object-contain" />
              </motion.div>
              <h2 className="font-display text-3xl md:text-4xl text-white text-center" style={{ letterSpacing: "0.06em" }}>
                {fixture.homeTeam}
              </h2>
            </div>

            <div className="flex flex-col items-center gap-2">
              {live ? (
                <div className="font-display text-5xl md:text-7xl text-primary stat-glow" style={{ letterSpacing: "0.1em" }}>LIVE</div>
              ) : kickoffPassed ? (
                <div className="font-display text-4xl text-white/40" style={{ letterSpacing: "0.1em" }}>FT</div>
              ) : (
                <div className="font-display text-5xl md:text-7xl text-white/20" style={{ letterSpacing: "0.15em" }}>VS</div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 flex-1">
              <div className="h-28 w-28 rounded-full bg-card border-2 border-white/10 flex items-center justify-center">
                <span className="font-display text-3xl text-white/30" style={{ letterSpacing: "0.05em" }}>
                  {fixture.awayTeam.slice(0, 3).toUpperCase()}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-white text-center" style={{ letterSpacing: "0.06em" }}>
                {fixture.awayTeam}
              </h2>
            </div>
          </div>

          {!live && !kickoffPassed && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center items-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Kick-off {format(kickoffDate, "h:mm a")} · {format(kickoffDate, "EEEE, MMMM d")}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{fixture.venue}</span>
              </div>
              <Countdown date={kickoffDate.toISOString()} large />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link href="/fixtures" className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-primary/90 transition-colors glow-gold">
              All Fixtures
            </Link>
            <Link href="/squad" className="bg-white/10 backdrop-blur border border-white/25 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-white/20 transition-colors">
              Meet The Squad
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Mouse spotlight ──────────────────────────────────────────────────────────

function MouseSpotlight() {
  const mouse = useMouse();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    x.set(mouse.x);
    y.set(mouse.y);
  }, [mouse.x, mouse.y, x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[1] hidden sm:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(252,218,0,0.07) 0%, rgba(32,127,62,0.04) 40%, transparent 70%)",
        borderRadius: "50%",
        mixBlendMode: "screen",
      }}
    />
  );
}

// ─── Normal hero ──────────────────────────────────────────────────────────────

function NormalHero() {
  const { data: slides, isLoading } = useListSlides();
  const active = slides?.filter(s => s.active) ?? [];
  const [idx, setIdx] = useState(0);
  const mouse = useMouse();
  const bgX = useSpring(useMotionValue(0), { stiffness: 40, damping: 18 });
  const bgY = useSpring(useMotionValue(0), { stiffness: 40, damping: 18 });
  const textX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const textY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const lightsX = useSpring(useMotionValue(0), { stiffness: 25, damping: 15 });
  const lightsY = useSpring(useMotionValue(0), { stiffness: 25, damping: 15 });

  useEffect(() => {
    // Background moves subtly opposite to mouse (parallax depth effect)
    bgX.set(mouse.normalX * -18);
    bgY.set(mouse.normalY * -12);
    // Text moves slightly with mouse (closer layer)
    textX.set(mouse.normalX * 8);
    textY.set(mouse.normalY * 5);
    // Lights move more (deepest layer)
    lightsX.set(mouse.normalX * -30);
    lightsY.set(mouse.normalY * -20);
  }, [mouse.normalX, mouse.normalY, bgX, bgY, textX, textY, lightsX, lightsY]);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % active.length), 6000);
    return () => clearInterval(id);
  }, [active.length]);

  const currentSlide = active[idx];

  if (isLoading) {
    return <section className="relative w-full bg-background sm:h-[80vh] md:h-[90vh] sm:min-h-[640px]" />;
  }

  const titleNode = currentSlide
    ? currentSlide.title.includes(" ")
      ? (<>{currentSlide.title.split(" ").slice(0, -1).join(" ")}{" "}<span className="text-primary">{currentSlide.title.split(" ").slice(-1)[0]}</span></>)
      : <span className="text-primary">{currentSlide.title}</span>
    : null;

  return (
    <section className="relative w-full bg-black overflow-hidden" style={{ perspective: "1200px" }}>
      <div className="hidden sm:block h-[80vh] md:h-[90vh] min-h-[640px]" />

      {/* Parallax background layer — moves slowest (furthest away) */}
      <motion.div
        className="sm:absolute sm:inset-0 sm:z-0 relative"
        style={{ x: bgX, y: bgY, scale: 1.06 }}
      >
        {active.length > 0 ? (
          active.map((slide, i) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-1000 ${i === idx ? "relative sm:absolute sm:inset-0" : "absolute inset-0 pointer-events-none"}`}
              style={{ opacity: i === idx ? 1 : 0 }}
            >
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-auto sm:h-full sm:object-cover sm:object-top" />
            </div>
          ))
        ) : (
          <img src={heroStadium} alt="Stadium" className="w-full h-auto sm:h-full sm:object-cover sm:object-top" />
        )}
      </motion.div>

      {/* Stadium lights — moves most (deepest parallax layer) */}
      <motion.div style={{ x: lightsX, y: lightsY }} className="absolute inset-0 z-[1]">
        <StadiumLights />
      </motion.div>

      <FloatingParticles />

      {/* Floating balls */}
      <FloatingBall style={{ bottom: "25%", left: "5%", "--dur": "5s", "--delay": "0s" } as React.CSSProperties} />
      <FloatingBall style={{ bottom: "40%", right: "6%", "--dur": "7s", "--delay": "1.5s" } as React.CSSProperties} />
      <FloatingBall style={{ bottom: "60%", left: "10%", "--dur": "6s", "--delay": "3s" } as React.CSSProperties} />

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 z-[3] h-4/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-[3] h-1/4 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Text — moves slightly with mouse (mid layer) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 sm:pb-16 text-center"
        style={{ x: textX, y: textY }}
      >
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide ? currentSlide.id : "default"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {currentSlide && (
                <>
                  <motion.h1
                    className="font-display text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] text-white uppercase mb-2 sm:mb-4 drop-shadow-2xl leading-none"
                    style={{ letterSpacing: "0.06em" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  >
                    {titleNode}
                  </motion.h1>
                  {currentSlide.subtitle && (
                    <motion.p
                      className="text-sm sm:text-lg md:text-xl text-white/80 font-medium mb-4 sm:mb-8 max-w-xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentSlide.subtitle}
                    </motion.p>
                  )}
                  {currentSlide.link && currentSlide.linkLabel && (
                    <motion.div
                      className="flex flex-wrap justify-center gap-4 mb-4 sm:mb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href={currentSlide.link}
                        className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm hover:bg-primary/90 transition-all hover:scale-105 glow-gold"
                      >
                        {currentSlide.linkLabel}
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {active.length > 1 && (
            <div className="flex gap-2 justify-center mt-4">
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-500 ${i === idx ? "w-8 h-2 bg-primary glow-gold" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref} className="stat-glow">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Club Statistics ──────────────────────────────────────────────────────────

function ClubStats({ results, players }: {
  results: { homeScore: number; awayScore: number; homeTeam: string; awayTeam: string }[];
  players: { appearances: number; goals: number; assists: number }[];
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const wins = results.filter(r => {
    const gaHome = r.homeTeam.toLowerCase().includes("golden arrows");
    const gaAway = r.awayTeam.toLowerCase().includes("golden arrows");
    return (gaHome && r.homeScore > r.awayScore) || (gaAway && r.awayScore > r.homeScore);
  }).length;
  const goals = players.reduce((s, p) => s + (p.goals || 0), 0);
  const apps = players.reduce((s, p) => s + (p.appearances || 0), 0);

  const stats = [
    { icon: Trophy,  label: "Trophies Won",   value: 7,                  suffix: "",  detail: "NSL Championship, Nedbank Cup, MTN8 & more" },
    { icon: Zap,     label: "Season Wins",     value: wins || 12,         suffix: "",  detail: "Victories in the current PSL season" },
    { icon: Target,  label: "Goals Scored",    value: goals || 82,        suffix: "+", detail: "Combined goals across all competitions" },
    { icon: Users,   label: "Squad Members",   value: players.length || 21, suffix: "", detail: "Players registered in the senior squad" },
    { icon: Star,    label: "Appearances",     value: apps || 246,        suffix: "+", detail: "Total appearances by squad this season" },
    { icon: Trophy,  label: "Years in PSL",    value: 26,                 suffix: "",  detail: "Consecutive seasons in the top flight" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Dark scoreboard panel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative py-5 sm:py-7">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-0.5 flex items-center gap-1.5">
              <span className="w-3 h-px bg-primary inline-block" />
              By The Numbers
            </p>
            <h2 className="font-display text-xl sm:text-3xl uppercase text-white" style={{ letterSpacing: "0.06em" }}>
              Club <span className="text-primary">Statistics</span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-white/25 uppercase tracking-widest font-bold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            Hover to explore
          </div>
        </div>

        {/* Stats grid — dark cells with gold dividers */}
        <div className="grid grid-cols-3 lg:grid-cols-6 rounded-xl overflow-hidden border border-white/10 divide-x divide-white/8">
          {stats.map((s, i) => (
            <motion.button
              key={s.label}
              onHoverStart={() => setActiveIdx(i)}
              onHoverEnd={() => setActiveIdx(null)}
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center justify-center py-5 px-2 sm:px-4 text-center focus:outline-none group cursor-pointer overflow-hidden"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              {/* Hover fill */}
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIdx === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              {/* Gold bottom bar on active */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeIdx === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              />

              {/* Icon */}
              <motion.div
                animate={{ scale: activeIdx === i ? 1.25 : 1, color: activeIdx === i ? "hsl(52 100% 49%)" : "rgba(255,255,255,0.35)" }}
                transition={{ duration: 0.2 }}
                className="mb-2"
              >
                <s.icon className="h-4 w-4" />
              </motion.div>

              {/* Number */}
              <motion.div
                animate={{ scale: activeIdx === i ? 1.08 : 1 }}
                transition={{ duration: 0.2 }}
                className="font-display text-2xl sm:text-4xl text-white leading-none mb-1 relative z-10 stat-glow"
                style={{ letterSpacing: "0.04em" }}
              >
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </motion.div>

              {/* Label */}
              <div className="text-[8px] sm:text-[9px] text-white/35 uppercase tracking-widest font-bold relative z-10 leading-tight">
                {s.label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail tooltip bar */}
        <AnimatePresence>
          {activeIdx !== null && (
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="mt-2 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black/40 border border-primary/20">
                <span className="text-primary flex-shrink-0">
                  {(() => { const Icon = stats[activeIdx].icon; return <Icon className="h-3.5 w-3.5" />; })()}
                </span>
                <span className="text-xs text-white/60 font-medium">{stats[activeIdx].detail}</span>
                <span className="ml-auto font-display text-lg text-primary stat-glow" style={{ letterSpacing: "0.06em" }}>
                  {stats[activeIdx].value.toLocaleString()}{stats[activeIdx].suffix}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Fixtures Carousel ────────────────────────────────────────────────────────

function FixturesCarousel({ fixtures }: { fixtures: Fixture[] }) {
  const upcoming = fixtures.filter(f => !f.completed).slice(0, 10);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const CARD_WIDTH = 296; // card w-72 = 288 + 8 gap

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, upcoming.length - 1));
    el.scrollTo({ left: clamped * CARD_WIDTH, behavior: "smooth" });
    setActiveIdx(clamped);
  }, [upcoming.length]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / CARD_WIDTH);
    setActiveIdx(Math.max(0, Math.min(idx, upcoming.length - 1)));
  }, [upcoming.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") scrollTo(activeIdx + 1);
      if (e.key === "ArrowLeft") scrollTo(activeIdx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, scrollTo]);

  if (!upcoming.length) return null;

  return (
    <section className="py-4 sm:py-7 bg-card border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-4 flex justify-between items-center">
        <div>
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-0.5 flex items-center gap-1.5">
            <span className="w-3 h-px bg-primary inline-block" />
            Coming Up
          </p>
          <h2 className="font-display text-xl sm:text-3xl uppercase text-white" style={{ letterSpacing: "0.06em" }}>
            Upcoming <span className="text-primary">Fixtures</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="h-8 w-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            aria-label="Previous fixture"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <button
            onClick={() => scrollTo(activeIdx + 1)}
            disabled={activeIdx >= upcoming.length - 1}
            className="h-8 w-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            aria-label="Next fixture"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link href="/fixtures" className="text-white/50 hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs flex items-center gap-1 ml-2">
            All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-4 px-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {upcoming.map((fixture, i) => {
            const d = new Date(fixture.date);
            const isNext = i === 0;
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => scrollTo(i)}
                className={`snap-start flex-shrink-0 w-72 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${isNext ? "border-primary/60 bg-gradient-to-br from-secondary/30 to-card shadow-lg shadow-primary/10" : isActive ? "border-white/25 bg-card/80" : "border-white/8 bg-card hover:border-white/20"}`}
              >
                {isNext && (
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-yellow-300 to-primary" />
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isNext ? "bg-primary text-black" : "bg-white/8 text-white/50"}`}>
                      {isNext ? "Next Match" : fixture.competition}
                    </span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                      {format(d, "MMM d")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-sm font-bold truncate ${fixture.homeTeam.toLowerCase().includes("golden arrows") ? "text-primary" : "text-white"}`}>
                          {fixture.homeTeam}
                        </span>
                        <TeamCrest name={fixture.homeTeam} size="sm" />
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-white/6 border border-white/10 rounded px-2 py-1">
                      <span className="text-xs text-white/40 font-display font-bold tracking-widest">VS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TeamCrest name={fixture.awayTeam} size="sm" />
                        <span className={`text-sm font-bold truncate ${fixture.awayTeam.toLowerCase().includes("golden arrows") ? "text-primary" : "text-white"}`}>
                          {fixture.awayTeam}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-[10px] text-white/30 font-medium">
                    {fixture.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{fixture.time.slice(0, 5)}
                      </span>
                    )}
                    {fixture.venue && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />{fixture.venue}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-card to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none" />
      </div>

      {/* Dot navigation */}
      <div className="flex justify-center gap-1.5 mt-4">
        {upcoming.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Fixture ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Latest News Section ──────────────────────────────────────────────────────

type NewsItem = {
  id: number;
  title: string;
  excerpt?: string | null;
  category: string;
  imageUrl: string;
  publishedAt: string;
};

const NEWS_CATEGORIES = ["All", "Club News", "Match Report", "Transfer", "Community"];
const AUTO_INTERVAL = 5000;

function LatestNewsSection({ news }: { news: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const categories = useMemo(() => {
    const found = new Set(news.map(n => n.category));
    return NEWS_CATEGORIES.filter(c => c === "All" || found.has(c));
  }, [news]);

  const filtered = useMemo(() =>
    activeCategory === "All" ? news : news.filter(n => n.category === activeCategory),
    [news, activeCategory]
  );

  const displayNews = useMemo(() => filtered.slice(0, 5), [filtered]);
  const featured = displayNews[selectedIdx] ?? displayNews[0];

  // Reset index when category changes
  useEffect(() => { setSelectedIdx(0); setProgress(0); }, [activeCategory]);

  // Auto-rotate with smooth progress bar
  useEffect(() => {
    if (isPaused || displayNews.length <= 1) { setProgress(0); return; }
    const tick = 40;
    const steps = AUTO_INTERVAL / tick;
    let current = 0;
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      current++;
      setProgress((current / steps) * 100);
      if (current >= steps) {
        current = 0;
        setProgress(0);
        setSelectedIdx(i => (i + 1) % displayNews.length);
      }
    }, tick);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [isPaused, selectedIdx, displayNews.length, activeCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSelectedIdx(i => (i + 1) % displayNews.length);
      if (e.key === "ArrowLeft") setSelectedIdx(i => (i - 1 + displayNews.length) % displayNews.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [displayNews.length]);

  if (!news.length) return null;

  return (
    <section
      className="py-5 sm:py-7 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Header + pills row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-0.5 flex items-center gap-1.5">
              <span className="w-3 h-px bg-primary inline-block" />
              From The Club
            </p>
            <h2 className="font-display text-xl sm:text-3xl uppercase text-white" style={{ letterSpacing: "0.06em" }}>
              Latest <span className="text-primary">News</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all duration-200 ${
                  cat === activeCategory
                    ? "bg-primary text-black border-primary"
                    : "border-white/20 text-white/50 hover:border-primary/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
            <Link
              href="/news"
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 text-white/30 hover:text-primary hover:border-primary/40 transition-all duration-200 flex items-center gap-1"
            >
              All <ChevronRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">

          {/* ── Featured panel ── */}
          <AnimatePresence mode="wait">
            {featured && (
              <motion.div
                key={featured.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link href={`/news/${featured.id}`}>
                  <div className="relative rounded-xl overflow-hidden h-[260px] sm:h-[330px] bg-card border border-white/8 group cursor-pointer">
                    <motion.img
                      key={featured.imageUrl}
                      src={featured.imageUrl}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: "center 15%" }}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />

                    {/* Auto-progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
                      <motion.div
                        className="h-full bg-primary origin-left"
                        style={{ scaleX: progress / 100, transformOrigin: "left" }}
                        transition={{ duration: 0 }}
                      />
                    </div>

                    {/* Position dots */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {displayNews.map((_, i) => (
                        <button
                          key={i}
                          onClick={e => { e.preventDefault(); setSelectedIdx(i); setProgress(0); }}
                          className={`rounded-full transition-all duration-300 ${i === selectedIdx ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
                        />
                      ))}
                    </div>

                    {/* Nav arrows */}
                    <button
                      onClick={e => { e.preventDefault(); setSelectedIdx(i => (i - 1 + displayNews.length) % displayNews.length); setProgress(0); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-white/60 hover:bg-black/70 hover:text-primary hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                      onClick={e => { e.preventDefault(); setSelectedIdx(i => (i + 1) % displayNews.length); setProgress(0); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-white/60 hover:bg-black/70 hover:text-primary hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                          {featured.category}
                        </span>
                        <span className="text-[10px] text-white/40 font-bold">
                          {format(new Date(featured.publishedAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <h3
                        className="font-display text-xl sm:text-2xl text-white group-hover:text-primary transition-colors duration-300 line-clamp-2"
                        style={{ letterSpacing: "0.03em" }}
                      >
                        {featured.title}
                      </h3>
                      {featured.excerpt && (
                        <p className="text-white/50 text-[13px] mt-1.5 line-clamp-2 max-w-lg">{featured.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center gap-1.5 text-primary text-[11px] font-bold uppercase tracking-widest">
                        Read Full Story
                        <motion.span
                          className="inline-flex"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Side list ── */}
          <div className="flex flex-col gap-1.5">
            {displayNews.map((item, i) => {
              const isSelected = i === selectedIdx;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onMouseEnter={() => { setSelectedIdx(i); setProgress(0); }}
                  className="group cursor-pointer"
                >
                  <Link href={`/news/${item.id}`}>
                    <div className={`flex gap-2.5 p-2.5 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? "border-primary/50 bg-primary/5"
                        : "border-white/6 bg-card/40 hover:border-white/15 hover:bg-white/3"
                    }`}>
                      {/* Number badge */}
                      <div className={`flex-shrink-0 self-center w-5 text-center text-[10px] font-black transition-colors duration-200 ${isSelected ? "text-primary" : "text-white/20 group-hover:text-white/40"}`}>
                        {i + 1}
                      </div>

                      {/* Thumbnail — face focus */}
                      <div className="relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-background">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? "scale-110" : "scale-100 group-hover:scale-105"}`}
                          style={{ objectPosition: "center 15%" }}
                        />
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-md"
                            layoutId="activeBorder"
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 self-center">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-200 ${isSelected ? "text-primary" : "text-white/40 group-hover:text-primary/70"}`}>
                            {item.category}
                          </span>
                          <span className="text-[8px] text-white/20">· {format(new Date(item.publishedAt), "MMM d")}</span>
                        </div>
                        <h4 className={`font-display text-[13px] leading-snug line-clamp-2 transition-colors duration-200 ${isSelected ? "text-primary" : "text-white/80 group-hover:text-white"}`} style={{ letterSpacing: "0.02em" }}>
                          {item.title}
                        </h4>
                      </div>

                      {/* Arrow indicator */}
                      <div className={`flex-shrink-0 self-center transition-all duration-200 ${isSelected ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-60 text-white"}`}>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* View all */}
            <Link
              href="/news"
              className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/8 text-white/35 text-[11px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-200 group"
            >
              View All News
              <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { data: news } = useListNews({ limit: 6 });
  const { data: nextFixture } = useGetNextFixture();
  const { data: recentResults } = useListResults({ limit: 7 });
  const { data: tableData } = useGetLeagueTable();
  const { data: players } = useListPlayers();
  const { data: allFixtures } = useListFixtures();
  const { data: sponsors } = useListSponsors();

  const matchToday = nextFixture ? isSameDay(nextFixture.date) : false;

  const newsItems = useMemo(() =>
    (news ?? []).map(n => ({ id: n.id, title: n.title, category: n.category })),
    [news]
  );

  const sponsorImages = useMemo(() => {
    const base = [
      { src: sponsor10bet, alt: "10bet" },
      { src: sponsorAquelle, alt: "aQuelle VIV" },
      { src: sponsorDurban, alt: "Durban Tourism" },
    ];
    if (sponsors?.length) {
      return [...sponsors.map(s => ({ src: s.logoUrl, alt: s.name })), ...base];
    }
    return base;
  }, [sponsors]);

  return (
    <div className="flex flex-col w-full">

      {/* ── News Ticker ───────────────────────────── */}
      {newsItems.length > 0 && <NewsTicker items={newsItems} />}

      {/* ── Hero ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {matchToday && nextFixture ? (
          <motion.div key="matchday" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MatchDayHero fixture={nextFixture} />
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NormalHero />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Next Match strip ──────────────────────── */}
      {nextFixture && !matchToday && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-20 mx-4 -mt-8 rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-card"
        >
          <div className="h-1 w-full bg-gradient-to-r from-secondary via-primary to-secondary" />
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="text-center md:text-left">
              <div className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-1.5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Next Match
              </div>
              <div className="font-display text-xl" style={{ letterSpacing: "0.05em" }}>{nextFixture.competition}</div>
              <div className="text-white/40 text-sm mt-0.5">
                {format(new Date(nextFixture.date), "PPP")} · {nextFixture.venue}
              </div>
            </div>

            <div className="flex items-center gap-4 font-display">
              <div className="flex items-center gap-2">
                <TeamCrest name={nextFixture.homeTeam} size="lg" bare />
                <span className="text-sm sm:text-lg xl:text-xl" style={{ letterSpacing: "0.04em" }}>{nextFixture.homeTeam}</span>
              </div>
              <span className="text-white/30 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded tracking-widest flex-shrink-0">VS</span>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg xl:text-xl" style={{ letterSpacing: "0.04em" }}>{nextFixture.awayTeam}</span>
                <TeamCrest name={nextFixture.awayTeam} size="lg" bare />
              </div>
            </div>

            <div className="hidden lg:block">
              <Countdown date={`${nextFixture.date}T${nextFixture.time || "15:00:00"}`} />
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Club Statistics ───────────────────────── */}
      <ClubStats
        results={recentResults ?? []}
        players={players ?? []}
      />

      {/* ── Fixtures Carousel ─────────────────────── */}
      {allFixtures && allFixtures.length > 0 && (
        <FixturesCarousel fixtures={allFixtures} />
      )}

      {/* ── Latest News ───────────────────────────── */}
      <LatestNewsSection news={news ?? []} />

      {/* ── Results + Table ───────────────────────── */}
      <section className="bg-card py-5 sm:py-10 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">

            {/* Recent Results */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-1">Season 2024/25</p>
                  <h2 className="font-display font-bold text-2xl uppercase tracking-tight">
                    Recent <span className="text-primary">Results</span>
                  </h2>
                </div>
                <Link href="/results" className="text-white/40 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-1">
                  All Results <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="bg-background border border-white/5 rounded-xl overflow-hidden flex flex-col flex-1">
                <div className="flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-3 border-b border-white/5 text-[9px] sm:text-[10px] text-white/20 uppercase tracking-widest font-bold flex-shrink-0">
                  <span className="w-10 sm:w-14 flex-shrink-0">Date</span>
                  <span className="flex-1 text-right">Home</span>
                  <span className="w-14 sm:w-16 text-center flex-shrink-0">Score</span>
                  <span className="flex-1">Away</span>
                  <span className="w-5 sm:w-6 flex-shrink-0 text-center">Res</span>
                </div>
                <div className="divide-y divide-white/5 flex flex-col flex-1">
                  {recentResults?.map((result, i) => {
                    const gaHome = result.homeTeam.toLowerCase().includes("golden arrows");
                    const gaAway = result.awayTeam.toLowerCase().includes("golden arrows");
                    const gaWin = (gaHome && result.homeScore > result.awayScore) || (gaAway && result.awayScore > result.homeScore);
                    const isDraw = result.homeScore === result.awayScore;
                    const badge = gaWin ? "W" : isDraw ? "D" : "L";
                    const badgeCls = gaWin ? "bg-green-600 text-white" : isDraw ? "bg-amber-500 text-black" : "bg-red-600 text-white";
                    const isLatest = i === 0;
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className={isLatest ? "relative border-l-2 border-l-primary bg-primary/5" : ""}
                      >
                        {isLatest && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-primary/60 hidden sm:block">
                            Latest
                          </span>
                        )}
                        <Link href={`/results/${result.id}`} className="flex flex-1 group">
                          <div className="flex flex-1 items-center gap-1 sm:gap-3 px-2 sm:px-4 py-1 hover:bg-white/3 transition-colors min-w-0">
                            <span className="text-[9px] sm:text-[10px] text-white/25 uppercase tracking-widest font-bold w-10 sm:w-14 flex-shrink-0">
                              {format(new Date(result.date), "MMM d")}
                            </span>
                            <div className="flex items-center gap-1 flex-1 justify-end min-w-0">
                              <span className={`text-right text-[11px] sm:text-sm font-bold truncate ${gaHome ? "text-primary" : "text-white/60"}`}>{result.homeTeam}</span>
                              <TeamCrest name={result.homeTeam} size="xs" className="flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 w-14 sm:w-16 justify-center flex-shrink-0">
                              <div className="bg-card border border-white/10 rounded w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-display font-black text-xs sm:text-sm text-white">{result.homeScore}</div>
                              <span className="text-white/20 text-[10px] font-bold">–</span>
                              <div className="bg-card border border-white/10 rounded w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-display font-black text-xs sm:text-sm text-white">{result.awayScore}</div>
                            </div>
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              <TeamCrest name={result.awayTeam} size="xs" className="flex-shrink-0" />
                              <span className={`text-[11px] sm:text-sm font-bold truncate ${gaAway ? "text-primary" : "text-white/60"}`}>{result.awayTeam}</span>
                            </div>
                            <span className={`text-[8px] sm:text-[10px] font-black uppercase w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${badgeCls}`}>{badge}</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* League Table */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-1">DStv Premiership</p>
                  <h2 className="font-display font-bold text-2xl uppercase tracking-tight">
                    League <span className="text-primary">Table</span>
                  </h2>
                </div>
                <Link href="/league-table" className="text-white/40 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-1">
                  Full Table <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="bg-background border border-white/5 rounded-xl overflow-hidden flex-1">
                <table className="w-full text-sm h-full">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                      <th className="px-4 py-3 text-left w-8">#</th>
                      <th className="px-4 py-3 text-left">Team</th>
                      <th className="px-3 py-3 text-center w-10">P</th>
                      <th className="px-3 py-3 text-center w-10">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tableData?.entries?.slice(0, 10).map((row, i) => (
                      <motion.tr
                        key={row.team}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className={`transition-colors ${row.isGoldenArrows ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-white/2"}`}
                      >
                        <td className={`px-4 py-2.5 text-left text-xs font-bold ${row.isGoldenArrows ? "text-primary" : "text-white/25"}`}>{row.position}</td>
                        <td className={`px-4 py-2.5 text-left text-sm font-bold max-w-[120px] ${row.isGoldenArrows ? "text-primary" : ""}`}>
                          <div className="flex items-center gap-2">
                            <TeamCrest name={row.team} size="xs" className="flex-shrink-0" />
                            <span className="truncate">{row.team}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center text-xs text-white/35">{row.played}</td>
                        <td className={`px-3 py-2.5 text-center text-sm font-black ${row.isGoldenArrows ? "text-primary" : ""}`}>{row.points}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Player Spotlight ──────────────────────── */}
      <section className="py-5 sm:py-10 container mx-auto px-4 relative overflow-hidden">
        <div className="text-center mb-4 sm:mb-7">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-1">The Eleven</p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase" style={{ letterSpacing: "0.06em" }}>
            Player <span className="text-primary">Spotlight</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {players?.slice(0, 4).map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/squad/${player.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 hover:border-primary/50 transition-colors duration-300"
                >
                  <img
                    src={player.photoUrl || playerPlaceholder}
                    alt={player.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <div className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{player.position}</div>
                    <h3 className="text-base sm:text-lg font-display uppercase leading-tight group-hover:text-primary transition-colors" style={{ letterSpacing: "0.05em" }}>{player.name}</h3>
                    <div className="mt-2 flex gap-3 text-[10px] text-white/30 font-bold">
                      {player.appearances > 0 && <span>{player.appearances} Apps</span>}
                      {player.goals > 0 && <span className="text-primary">{player.goals} Goals</span>}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 text-5xl sm:text-6xl font-display font-black text-white/8 leading-none group-hover:text-primary/15 transition-colors">{player.number}</div>

                  {/* Hover arrow */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary text-black rounded-full p-1.5">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link href="/squad">
            <motion.span
              whileHover={{ scale: 1.03 }}
              className="inline-block border border-primary text-primary px-8 py-3 rounded uppercase tracking-wider text-sm font-bold hover:bg-primary hover:text-black transition-all duration-300"
            >
              View Full Squad
            </motion.span>
          </Link>
        </div>
      </section>

      {/* ── Trophy Cabinet ────────────────────────── */}
      <section className="bg-card border-y border-white/5 py-5 sm:py-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 sm:mb-8">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-0.5 flex items-center justify-center gap-1.5">
              <span className="w-3 h-px bg-primary inline-block" />
              A Legacy of Success
            </p>
            <h2 className="font-display text-xl sm:text-3xl uppercase text-white" style={{ letterSpacing: "0.08em" }}>
              Club <span className="text-primary">Honours</span>
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <motion.div
              className="trophy-shimmer relative flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <img src={trophiesImg} alt="Trophies" className="max-w-full w-full max-w-2xl object-contain drop-shadow-2xl" />
            </motion.div>

            <div className="flex-shrink-0 grid grid-cols-2 gap-4 max-w-xs w-full">
              {[
                { title: "NSL Championship", years: ["2003/04", "2012/13"] },
                { title: "Nedbank Cup", years: ["2013"] },
                { title: "MTN8", years: ["2011"] },
                { title: "Telkom KO", years: ["2021/22"] },
              ].map((honor, i) => (
                <motion.div
                  key={honor.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-background border border-white/8 hover:border-primary/30 rounded-xl p-4 text-center transition-all duration-300 cursor-default"
                >
                  <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-xs font-bold text-white/80 mb-1 leading-tight">{honor.title}</div>
                  {honor.years.map(y => (
                    <div key={y} className="text-[10px] text-primary font-bold">{y}</div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sponsor Carousel ──────────────────────── */}
      <section className="bg-white py-8 sm:py-12 overflow-hidden">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-black/30 mb-6 sm:mb-10">
          Our Partners & Sponsors
        </p>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="sponsor-track flex items-center gap-12 sm:gap-20 w-max">
              {[...sponsorImages, ...sponsorImages].map((s, i) => (
                <div key={i} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 transition-all">
                  <img src={s.src} alt={s.alt} className="h-12 sm:h-16 object-contain rounded-lg" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
