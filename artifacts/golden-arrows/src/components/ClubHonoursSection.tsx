import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const HONOURS = [
  {
    title: "MTN8 Trophy",
    season: "2009/2010",
    subtitle: "MTN8 Winners",
    description:
      "The oldest knock-out competition in South African football — Golden Arrows claimed it in dramatic fashion, one of the greatest achievements in the PSL era.",
    highlight: true,
  },
  {
    title: "Nedbank Cup",
    season: "2013",
    subtitle: "Nedbank Cup Winners",
    description:
      "A historic cup run that silenced critics and ended with Abafana Bes'thende lifting one of South Africa's most prestigious knockout trophies.",
  },
  {
    title: "NSL Championship",
    season: "2003/04",
    subtitle: "League Champions",
    description:
      "Golden Arrows topped the NSL table in dominant fashion, cementing their status as one of South African football's elite clubs.",
  },
  {
    title: "NSL Championship",
    season: "2012/13",
    subtitle: "League Champions",
    description:
      "The 2012/13 title confirmed Arrows as one of the most consistent clubs of the era — a second NSL crown to add to the cabinet.",
  },
  {
    title: "Telkom Knockout",
    season: "2021/22",
    subtitle: "TKO Winners",
    description:
      "A statement of the modern era — Golden Arrows lifted the Telkom Knockout in a memorable campaign that showcased the club's cup-fighting spirit.",
  },
  {
    title: "Diski Challenge",
    season: "2015/16 & 2017/18",
    subtitle: "MDC Champions",
    description:
      "Back-to-back Diski Challenge titles proved the depth of the Arrows academy, producing the next generation of Durban football talent.",
  },
  {
    title: "National First Division",
    season: "2014/15",
    subtitle: "NFD Champions",
    description:
      "Promotion back to the top flight in emphatic style — winning the NFD title without question and returning Arrows to where they belong.",
  },
];

const N = HONOURS.length;
const ANGLE_PER = 360 / N;
const RADIUS = 380;

export function ClubHonoursSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 22, restDelta: 0.001 });

  const logoRotateY = useTransform(smooth, [0, 1], [0, 720]);
  const carouselRotate = useTransform(smooth, [0, 1], [0, -(N - 1) * ANGLE_PER]);

  useMotionValueEvent(smooth, "change", (p) => {
    setActiveIdx(Math.min(Math.round(p * (N - 1)), N - 1));
  });

  return (
    <section
      ref={containerRef}
      className="bg-card border-y border-white/5"
      style={{ height: `${(N + 2) * 100}vh`, position: "relative" }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col select-none">

        {/* Header */}
        <div className="text-center pt-10 pb-2 flex-shrink-0">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-1 flex items-center justify-center gap-1.5">
            <span className="w-3 h-px bg-primary" />
            A Legacy of Success
            <span className="w-3 h-px bg-primary" />
          </p>
          <h2
            className="font-display text-2xl sm:text-4xl uppercase text-white"
            style={{ letterSpacing: "0.08em" }}
          >
            Club <span className="text-primary">Honours</span>
          </h2>
        </div>

        {/* ── Arena ── */}
        <div className="flex-1 flex items-center justify-center gap-4 lg:gap-12 px-4 overflow-hidden min-h-0">

          {/* Logo — 3D spin */}
          <div
            className="hidden lg:flex flex-col items-center gap-5 flex-shrink-0 w-44"
            style={{ perspective: "650px" }}
          >
            <motion.div style={{ rotateY: logoRotateY }}>
              <img
                src={logo}
                alt="Golden Arrows"
                className="w-36 h-36 object-contain"
                style={{
                  filter: "drop-shadow(0 0 28px rgba(255,215,0,0.4))",
                }}
              />
            </motion.div>
            <div className="text-center">
              <p className="font-display text-[9px] uppercase tracking-[0.25em] text-white/30">
                Lamontville
              </p>
              <p className="font-display text-xs uppercase tracking-widest text-primary font-bold">
                Golden Arrows FC
              </p>
              <p className="text-[9px] text-white/20 mt-1 tracking-wider">Est. 1943</p>
            </div>
          </div>

          {/* Carousel + info */}
          <div className="flex-1 flex flex-col items-center gap-5 min-w-0 max-w-2xl">

            {/* 3D Carousel */}
            <div
              className="relative w-full"
              style={{
                height: "240px",
                perspective: "1050px",
                perspectiveOrigin: "50% 45%",
              }}
            >
              {/* Ambient glow at carousel center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 bg-primary/8 rounded-full blur-3xl" />
              </div>

              {/* The rotating disk */}
              <motion.div
                className="absolute"
                style={{
                  width: 180,
                  height: 220,
                  top: "50%",
                  left: "50%",
                  marginTop: -110,
                  marginLeft: -90,
                  transformStyle: "preserve-3d",
                  rotateY: carouselRotate,
                  rotateX: "10deg",
                }}
              >
                {HONOURS.map((honour, i) => {
                  const angle = i * ANGLE_PER;
                  const isActive = i === activeIdx;
                  return (
                    <div
                      key={`${honour.title}-${i}`}
                      className="absolute inset-0 rounded-2xl border flex flex-col items-center justify-center px-4 py-5"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                        backfaceVisibility: "hidden",
                        background: isActive
                          ? "rgba(255,215,0,0.08)"
                          : "rgba(20,28,20,0.85)",
                        borderColor: isActive
                          ? "rgba(255,215,0,0.5)"
                          : "rgba(255,255,255,0.07)",
                        boxShadow: isActive
                          ? "0 0 32px rgba(255,215,0,0.15), inset 0 0 20px rgba(255,215,0,0.04)"
                          : "none",
                        transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
                      }}
                    >
                      <Trophy
                        className="h-9 w-9 mb-3"
                        style={{
                          color: isActive ? "#FFD700" : "rgba(255,255,255,0.2)",
                          transition: "color 0.5s",
                          filter: isActive ? "drop-shadow(0 0 8px rgba(255,215,0,0.6))" : "none",
                        }}
                      />
                      <div
                        className="font-display font-bold text-[11px] text-center leading-tight uppercase tracking-wide"
                        style={{
                          color: isActive ? "#FFD700" : "rgba(255,255,255,0.35)",
                          transition: "color 0.5s",
                        }}
                      >
                        {honour.title}
                      </div>
                      <div
                        className="text-[9px] mt-1.5 font-bold tracking-wider"
                        style={{
                          color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
                          transition: "color 0.5s",
                        }}
                      >
                        {honour.season}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Ground reflection / shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
            </div>

            {/* Active trophy info */}
            <div className="text-center px-4 w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-8 h-px bg-primary/40" />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">
                      {HONOURS[activeIdx].subtitle}
                    </span>
                    <span className="w-8 h-px bg-primary/40" />
                  </div>
                  <h3
                    className="font-display font-bold text-xl sm:text-2xl text-white uppercase mb-1"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {HONOURS[activeIdx].title}
                  </h3>
                  <div className="text-primary font-bold text-sm mb-3">
                    {HONOURS[activeIdx].season}
                  </div>
                  <p className="text-white/40 text-[13px] leading-relaxed">
                    {HONOURS[activeIdx].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {HONOURS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? 24 : 6,
                    height: 6,
                    background: i === activeIdx ? "#FFD700" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-10 pb-6 pt-2">
          <div className="flex items-center gap-2 text-white/20 text-[11px]">
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            <span>Scroll to explore all {N} honours</span>
          </div>
          {/* Honour counter */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/25">
            <span className="text-primary font-black text-base">{activeIdx + 1}</span>
            <span>/</span>
            <span>{N}</span>
            <Link
              href="/club/trophy"
              className="ml-3 flex items-center gap-1 text-white/20 hover:text-primary transition-colors duration-200 uppercase tracking-widest text-[10px]"
            >
              Full Cabinet <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
