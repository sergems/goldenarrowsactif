import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";
import mtn8Img from "@assets/MTN_8_LOGO_1782640838208.jpg";
import diskiShieldImg from "@assets/multichoice_diski_shield_1782640838209.jpg";
import nfdImg from "@assets/ndf_logo_1782640838211.png";
import nedbankImg from "@assets/Nedbank_cup_logo_1782642949619.png";
import nslImg from "@assets/National_Soccer_League_(South_Africa)_1782642949618.svg";
import carlingKnockoutImg from "@assets/Knockout-Cup-Logo_1782642949617.png";
import premierCupImg from "@assets/premier_cup_1782642949619.jpg";

const HONOURS = [
  {
    title: "MTN8 Trophy",
    season: "2009/2010",
    subtitle: "MTN8 Winners",
    description:
      "The oldest knock-out competition in South African football — Golden Arrows claimed it in dramatic fashion, one of the greatest achievements in the PSL era.",
    image: mtn8Img,
    imgPosition: "center center",
    objectFit: "contain" as const,
  },
  {
    title: "Nedbank Cup",
    season: "2013",
    subtitle: "Nedbank Cup Winners",
    description:
      "A historic cup run that silenced critics and ended with Abafana Bes'thende lifting one of South Africa's most prestigious knockout trophies.",
    image: nedbankImg,
    imgPosition: "center center",
    objectFit: "cover" as const,
  },
  {
    title: "NSL Championship",
    season: "2003/04",
    subtitle: "League Champions",
    description:
      "Golden Arrows topped the NSL table in dominant fashion, cementing their status as one of South African football's elite clubs.",
    image: nslImg,
    imgPosition: "center center",
    objectFit: "contain" as const,
  },
  {
    title: "NSL Championship",
    season: "2012/13",
    subtitle: "League Champions",
    description:
      "The 2012/13 title confirmed Arrows as one of the most consistent clubs of the era — a second NSL crown to add to the cabinet.",
    image: nslImg,
    imgPosition: "center center",
    objectFit: "contain" as const,
  },
  {
    title: "Carling Knockout",
    season: "2021/22",
    subtitle: "Carling Black Label Knockout Winners",
    description:
      "A statement of the modern era — Golden Arrows lifted the Carling Black Label Knockout in a memorable campaign that showcased the club's cup-fighting spirit.",
    image: carlingKnockoutImg,
    imgPosition: "center center",
    objectFit: "cover" as const,
  },
  {
    title: "KZN Premier's Cup",
    season: "Multiple",
    subtitle: "KZN Premier's Cup Winners",
    description:
      "A provincial honour that underscores Golden Arrows' dominance in KwaZulu-Natal football — representing the club's roots and pride in the region.",
    image: premierCupImg,
    imgPosition: "center center",
    objectFit: "cover" as const,
  },
  {
    title: "Diski Challenge",
    season: "2015/16 & 2017/18",
    subtitle: "MDC Champions",
    description:
      "Back-to-back Diski Challenge titles proved the depth of the Arrows academy, producing the next generation of Durban football talent.",
    image: diskiShieldImg,
    imgPosition: "center center",
    objectFit: "cover" as const,
  },
  {
    title: "National First Division",
    season: "2014/15",
    subtitle: "NFD Champions",
    description:
      "Promotion back to the top flight in emphatic style — winning the NFD title without question and returning Arrows to where they belong.",
    image: nfdImg,
    imgPosition: "center center",
    objectFit: "cover" as const,
  },
];

const N = HONOURS.length;
const ANGLE_PER = 360 / N;
const RADIUS = 378;

export function ClubHonoursSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // ── Entry phase: logo flies across from squad section ──────────────────────
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.05"],
  });
  const entrySmooth = useSpring(entryProgress, { stiffness: 38, damping: 20, restDelta: 0.001 });

  const logoEntryY = useTransform(entrySmooth, [0, 1], [280, 0]);
  const logoEntryX = useTransform(entrySmooth, [0, 1], [140, 0]);
  const logoEntryScale = useTransform(entrySmooth, [0, 1], [0.5, 1]);
  const logoEntryOpacity = useTransform(entrySmooth, [0, 0.18, 1], [0, 0.35, 1]);

  // ── Inner scroll: carousel rotation + logo spin ────────────────────────────
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
      <div className="sticky top-0 h-screen flex flex-col select-none overflow-visible">

        {/* ── Main content row ── */}
        <div className="flex-1 flex items-center gap-4 lg:gap-8 px-4 container mx-auto min-h-0 py-2">

          {/* ── Right column: header + carousel + info ── */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">

            {/* Header */}
            <div>
              <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-0.5 flex items-center gap-1.5">
                <span className="w-3 h-px bg-primary inline-block" />
                A Legacy of Success
              </p>
              <h2
                className="font-display text-xl sm:text-3xl uppercase text-white"
                style={{ letterSpacing: "0.06em" }}
              >
                Club <span className="text-primary">Honours</span>
              </h2>
            </div>

            {/* 3D Carousel */}
            <div
              className="relative w-full"
              style={{
                height: "340px",
                perspective: "1400px",
                perspectiveOrigin: "50% 50%",
                overflow: "visible",
              }}
            >
              {/* Ambient glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 bg-primary/8 rounded-full blur-3xl" />
              </div>

              {/* Rotating disk */}
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
                }}
              >
                {HONOURS.map((honour, i) => {
                  const angle = i * ANGLE_PER;
                  const isActive = i === activeIdx;
                  return (
                    <div
                      key={`${honour.title}-${i}`}
                      className="absolute inset-0 rounded-2xl overflow-hidden border"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                        backfaceVisibility: "hidden",
                        borderColor: isActive
                          ? "rgba(255,215,0,0.6)"
                          : "rgba(255,255,255,0.07)",
                        boxShadow: isActive
                          ? "0 0 36px rgba(255,215,0,0.25), inset 0 0 24px rgba(255,215,0,0.07)"
                          : "none",
                        transition: "border-color 0.5s, box-shadow 0.5s",
                        backgroundColor: honour.objectFit === "contain" ? "hsl(140 10% 6%)" : undefined,
                      }}
                    >
                      {/* Trophy image */}
                      <img
                        src={honour.image}
                        alt={honour.title}
                        className="absolute inset-0 w-full h-full"
                        style={{
                          objectFit: honour.objectFit,
                          objectPosition: honour.imgPosition,
                          padding: honour.objectFit === "contain" ? "16px" : undefined,
                          opacity: isActive ? (honour.objectFit === "contain" ? 0.95 : 0.85) : 0.3,
                          transition: "opacity 0.5s",
                        }}
                      />

                      {/* Gradient overlay for text readability */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: isActive
                            ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)"
                            : "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(5,15,5,0.6) 100%)",
                          transition: "background 0.5s",
                        }}
                      />

                      {/* Gold shimmer top edge for active */}
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(255,215,0,0.18) 0%, transparent 35%)",
                          }}
                        />
                      )}

                      {/* Text overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-3 pb-4">
                        <div
                          className="font-display font-bold text-[10px] text-center leading-tight uppercase tracking-wide"
                          style={{
                            color: isActive ? "#FFD700" : "rgba(255,255,255,0.4)",
                            transition: "color 0.5s",
                          }}
                        >
                          {honour.title}
                        </div>
                        <div
                          className="text-[9px] mt-1 font-bold tracking-wider"
                          style={{
                            color: isActive
                              ? "rgba(255,255,255,0.8)"
                              : "rgba(255,255,255,0.18)",
                            transition: "color 0.5s",
                          }}
                        >
                          {honour.season}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Ground shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
            </div>

            {/* Active trophy info — centered below carousel */}
            <div className="text-center w-full max-w-md mx-auto px-4">
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

              {/* Rotating logo below description */}
              <motion.div
                className="flex justify-center mt-4"
                style={{
                  y: logoEntryY,
                  scale: logoEntryScale,
                  opacity: logoEntryOpacity,
                }}
              >
                <div style={{ perspective: "650px" }}>
                  <motion.div
                    style={{ rotateY: logoRotateY }}
                    whileHover={{
                      scale: 1.55,
                      filter: "drop-shadow(0 0 32px rgba(255,215,0,0.85)) drop-shadow(0 0 12px rgba(255,215,0,0.5))",
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className="cursor-pointer"
                  >
                    <img
                      src={logo}
                      alt="Golden Arrows"
                      className="w-14 h-14 object-contain"
                      style={{ filter: "drop-shadow(0 0 18px rgba(255,215,0,0.45))" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
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
                    background:
                      i === activeIdx ? "#FFD700" : "rgba(255,255,255,0.15)",
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
