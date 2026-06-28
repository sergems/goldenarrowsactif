import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Save, Shuffle, RotateCcw, Trash2,
  Sparkles, ChevronLeft, ChevronRight, Check, Plus,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Pattern =
  | "solid" | "stripes" | "hoops" | "gradient" | "lightning" | "geometric"
  | "camouflage" | "classic" | "diagonal" | "chevron" | "diamond"
  | "pinstripe" | "wave" | "fade" | "split" | "brush" | "hexagon" | "abstract";

type CollarStyle = "v-neck" | "round" | "polo" | "modern-v" | "button" | "turtleneck";
type KitType = "home" | "away" | "third" | "goalkeeper";
type FitType = "player" | "fan";
type SleeveType = "short" | "long";

interface KitConfig {
  id: string;
  kitName: string;
  primary: string;
  secondary: string;
  sleeve: string;
  collar: CollarStyle;
  trim: string;
  pattern: Pattern;
  playerName: string;
  playerNumber: string;
  longSleeve: boolean;
  captain: boolean;
  badgeSide: "left" | "right";
  kitType: KitType;
  fit: FitType;
  sponsor: string;
  numberOutline: string;
}

const DEFAULT_KIT: KitConfig = {
  id: "",
  kitName: "My Kit",
  primary: "#006B3F",
  secondary: "#FFD700",
  sleeve: "#006B3F",
  collar: "v-neck",
  trim: "#FFD700",
  pattern: "solid",
  playerName: "YOUR NAME",
  playerNumber: "10",
  longSleeve: false,
  captain: false,
  badgeSide: "left",
  kitType: "home",
  fit: "player",
  sponsor: "THOBELA",
  numberOutline: "#000000",
};

const PATTERNS: { id: Pattern; label: string }[] = [
  { id: "solid", label: "Solid" },
  { id: "gradient", label: "Gradient" },
  { id: "stripes", label: "Stripes" },
  { id: "hoops", label: "Hoops" },
  { id: "diagonal", label: "Diagonal" },
  { id: "chevron", label: "Chevron" },
  { id: "lightning", label: "Lightning" },
  { id: "geometric", label: "Geometric" },
  { id: "diamond", label: "Diamond" },
  { id: "pinstripe", label: "Pinstripe" },
  { id: "wave", label: "Wave" },
  { id: "fade", label: "Fade" },
  { id: "split", label: "Split" },
  { id: "brush", label: "Brush" },
  { id: "camouflage", label: "Camo" },
  { id: "hexagon", label: "Hexagon" },
  { id: "abstract", label: "Abstract" },
  { id: "classic", label: "Classic" },
];

const COLLARS: { id: CollarStyle; label: string; desc: string }[] = [
  { id: "v-neck", label: "V-Neck", desc: "Modern V" },
  { id: "modern-v", label: "Deep V", desc: "Deep V-neck" },
  { id: "round", label: "Round", desc: "Crew neck" },
  { id: "polo", label: "Polo", desc: "Polo collar" },
  { id: "button", label: "Button", desc: "Button up" },
  { id: "turtleneck", label: "Turtle", desc: "High neck" },
];

const POPULAR_COMBOS = [
  { p: "#006B3F", s: "#FFD700", label: "Arrows Home" },
  { p: "#FFD700", s: "#006B3F", label: "Arrows Away" },
  { p: "#111111", s: "#FFD700", label: "Black & Gold" },
  { p: "#FFFFFF", s: "#006B3F", label: "White & Green" },
  { p: "#1B5E20", s: "#FFFFFF", label: "Forest White" },
  { p: "#1A237E", s: "#FFD700", label: "Navy & Gold" },
  { p: "#B71C1C", s: "#FFFFFF", label: "Red & White" },
  { p: "#4A148C", s: "#FFD700", label: "Purple Gold" },
  { p: "#E65100", s: "#000000", label: "Orange Black" },
];

const INSPIRE_KITS: Partial<KitConfig>[] = [
  { primary: "#006B3F", secondary: "#FFD700", sleeve: "#006B3F", trim: "#FFD700", pattern: "gradient", kitName: "Modern Edition" },
  { primary: "#1A237E", secondary: "#FFD700", sleeve: "#FFD700", trim: "#FFD700", pattern: "diagonal", kitName: "Champions Edition" },
  { primary: "#FFD700", secondary: "#111111", sleeve: "#111111", trim: "#FFD700", pattern: "lightning", kitName: "Thunder Edition" },
  { primary: "#111111", secondary: "#006B3F", sleeve: "#006B3F", trim: "#FFD700", pattern: "geometric", kitName: "Stealth Edition" },
  { primary: "#FFFFFF", secondary: "#006B3F", sleeve: "#006B3F", trim: "#FFD700", pattern: "hoops", kitName: "Classic Edition" },
  { primary: "#8B0000", secondary: "#FFD700", sleeve: "#8B0000", trim: "#FFD700", pattern: "abstract", kitName: "African Edition" },
];

const RANDOM_COLORS = [
  "#FFD700","#006B3F","#E53E3E","#2B6CB0","#744210","#553C9A",
  "#B7791F","#276749","#9B2C2C","#1A365D","#702459","#234E52",
  "#000000","#FFFFFF","#FF6B35","#0D47A1","#1B5E20","#4A148C",
];

// ─── Pattern Defs ─────────────────────────────────────────────────────────────
function PatternDefs({ kit }: { kit: KitConfig }) {
  return (
    <defs>
      {/* Fabric texture */}
      <filter id="fabric">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
        <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
        <feComposite in="blended" in2="SourceGraphic" operator="in" />
      </filter>
      {/* Wrinkle filter */}
      <filter id="wrinkle">
        <feTurbulence type="turbulence" baseFrequency="0.03 0.06" numOctaves="3" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {/* Body shading */}
      <linearGradient id="bodyShade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="black" stopOpacity="0.35" />
        <stop offset="15%" stopColor="black" stopOpacity="0.1" />
        <stop offset="50%" stopColor="black" stopOpacity="0" />
        <stop offset="85%" stopColor="black" stopOpacity="0.1" />
        <stop offset="100%" stopColor="black" stopOpacity="0.35" />
      </linearGradient>
      {/* Top shoulder highlight */}
      <linearGradient id="topHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.22" />
        <stop offset="40%" stopColor="white" stopOpacity="0.06" />
        <stop offset="100%" stopColor="black" stopOpacity="0.08" />
      </linearGradient>
      {/* Sheen */}
      <linearGradient id="sheen" x1="10%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.18" />
        <stop offset="50%" stopColor="white" stopOpacity="0.04" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      {/* Drop shadow */}
      <filter id="shadow">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.7" />
      </filter>

      {/* PATTERNS */}
      <pattern id="pat-stripes" patternUnits="userSpaceOnUse" width="22" height="1">
        <rect width="11" height="1" fill={kit.primary} />
        <rect x="11" width="11" height="1" fill={kit.secondary} />
      </pattern>
      <pattern id="pat-hoops" patternUnits="userSpaceOnUse" width="1" height="22">
        <rect width="1" height="11" fill={kit.primary} />
        <rect y="11" width="1" height="11" fill={kit.secondary} />
      </pattern>
      <linearGradient id="pat-gradient" x1="0%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor={kit.primary} />
        <stop offset="100%" stopColor={kit.secondary} />
      </linearGradient>
      <pattern id="pat-lightning" patternUnits="userSpaceOnUse" width="30" height="60">
        <rect width="30" height="60" fill={kit.primary} />
        <polyline points="19,0 9,32 19,32 9,60" stroke={kit.secondary} strokeWidth="5" fill="none" opacity="0.9" />
      </pattern>
      <pattern id="pat-geometric" patternUnits="userSpaceOnUse" width="40" height="40">
        <rect width="40" height="40" fill={kit.primary} />
        <polygon points="0,0 20,20 40,0" fill={kit.secondary} opacity="0.45" />
        <polygon points="0,40 20,20 40,40" fill={kit.secondary} opacity="0.45" />
      </pattern>
      <pattern id="pat-camo" patternUnits="userSpaceOnUse" width="60" height="60">
        <rect width="60" height="60" fill={kit.primary} />
        <ellipse cx="15" cy="15" rx="13" ry="9" fill={kit.secondary} opacity="0.45" />
        <ellipse cx="45" cy="38" rx="11" ry="15" fill={kit.secondary} opacity="0.38" />
        <ellipse cx="8" cy="50" rx="9" ry="7" fill={kit.secondary} opacity="0.52" />
        <ellipse cx="54" cy="8" rx="7" ry="12" fill={kit.secondary} opacity="0.4" />
      </pattern>
      <pattern id="pat-classic" patternUnits="userSpaceOnUse" width="60" height="60">
        <rect width="60" height="60" fill={kit.primary} />
        <rect x="0" width="5" height="60" fill={kit.secondary} opacity="0.25" />
        <rect x="55" width="5" height="60" fill={kit.secondary} opacity="0.25" />
      </pattern>
      <pattern id="pat-diagonal" patternUnits="userSpaceOnUse" width="28" height="28" patternTransform="rotate(45)">
        <rect width="14" height="28" fill={kit.primary} />
        <rect x="14" width="14" height="28" fill={kit.secondary} />
      </pattern>
      <pattern id="pat-chevron" patternUnits="userSpaceOnUse" width="40" height="40">
        <rect width="40" height="40" fill={kit.primary} />
        <polyline points="0,20 20,0 40,20" stroke={kit.secondary} strokeWidth="10" fill="none" />
        <polyline points="0,40 20,20 40,40" stroke={kit.secondary} strokeWidth="10" fill="none" />
      </pattern>
      <pattern id="pat-diamond" patternUnits="userSpaceOnUse" width="30" height="30">
        <rect width="30" height="30" fill={kit.primary} />
        <polygon points="15,0 30,15 15,30 0,15" fill={kit.secondary} opacity="0.45" />
      </pattern>
      <pattern id="pat-pinstripe" patternUnits="userSpaceOnUse" width="12" height="1">
        <rect width="12" height="1" fill={kit.primary} />
        <rect x="5" width="1" height="1" fill={kit.secondary} opacity="0.6" />
      </pattern>
      <pattern id="pat-wave" patternUnits="userSpaceOnUse" width="60" height="30">
        <rect width="60" height="30" fill={kit.primary} />
        <path d="M0,15 Q15,0 30,15 Q45,30 60,15" stroke={kit.secondary} strokeWidth="6" fill="none" opacity="0.7" />
      </pattern>
      <linearGradient id="pat-fade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={kit.secondary} />
        <stop offset="50%" stopColor={kit.primary} />
        <stop offset="100%" stopColor={kit.primary} />
      </linearGradient>
      <pattern id="pat-split" patternUnits="userSpaceOnUse" width="300" height="360">
        <rect width="150" height="360" fill={kit.primary} />
        <rect x="150" width="150" height="360" fill={kit.secondary} />
      </pattern>
      <pattern id="pat-brush" patternUnits="userSpaceOnUse" width="60" height="120">
        <rect width="60" height="120" fill={kit.primary} />
        <path d="M0,30 C20,20 40,40 60,30" stroke={kit.secondary} strokeWidth="18" fill="none" opacity="0.5" />
        <path d="M0,75 C20,65 40,85 60,75" stroke={kit.secondary} strokeWidth="14" fill="none" opacity="0.4" />
      </pattern>
      <pattern id="pat-hexagon" patternUnits="userSpaceOnUse" width="36" height="42">
        <rect width="36" height="42" fill={kit.primary} />
        <polygon points="18,1 34,10 34,28 18,37 2,28 2,10" fill="none" stroke={kit.secondary} strokeWidth="2" opacity="0.5" />
      </pattern>
      <pattern id="pat-abstract" patternUnits="userSpaceOnUse" width="80" height="80">
        <rect width="80" height="80" fill={kit.primary} />
        <path d="M0,40 Q20,10 40,40 Q60,70 80,40" stroke={kit.secondary} strokeWidth="12" fill="none" opacity="0.5" />
        <path d="M0,60 Q30,30 60,60 Q70,75 80,60" stroke={kit.secondary} strokeWidth="8" fill="none" opacity="0.3" />
        <circle cx="20" cy="20" r="8" fill={kit.secondary} opacity="0.25" />
        <circle cx="65" cy="55" r="5" fill={kit.secondary} opacity="0.3" />
      </pattern>

      {/* Clip paths */}
      <clipPath id="body-clip-main">
        <path d="M 95,58 L 205,58 L 232,88 L 242,320 L 58,320 L 68,88 Z" />
      </clipPath>
      <clipPath id="left-sleeve-clip">
        <path d="M 95,58 L 68,88 L 68,140 L 0,155 L 0,110 L 55,75 Z" />
      </clipPath>
      <clipPath id="right-sleeve-clip">
        <path d="M 205,58 L 232,88 L 232,140 L 300,155 L 300,110 L 245,75 Z" />
      </clipPath>
    </defs>
  );
}

function getBodyFill(kit: KitConfig): string {
  switch (kit.pattern) {
    case "stripes": return "url(#pat-stripes)";
    case "hoops": return "url(#pat-hoops)";
    case "gradient": return "url(#pat-gradient)";
    case "lightning": return "url(#pat-lightning)";
    case "geometric": return "url(#pat-geometric)";
    case "camouflage": return "url(#pat-camo)";
    case "classic": return "url(#pat-classic)";
    case "diagonal": return "url(#pat-diagonal)";
    case "chevron": return "url(#pat-chevron)";
    case "diamond": return "url(#pat-diamond)";
    case "pinstripe": return "url(#pat-pinstripe)";
    case "wave": return "url(#pat-wave)";
    case "fade": return "url(#pat-fade)";
    case "split": return "url(#pat-split)";
    case "brush": return "url(#pat-brush)";
    case "hexagon": return "url(#pat-hexagon)";
    case "abstract": return "url(#pat-abstract)";
    default: return kit.primary;
  }
}

// ─── Jersey SVG ───────────────────────────────────────────────────────────────
function JerseyPreview({ kit, view, className = "" }: { kit: KitConfig; view: "front" | "back"; className?: string }) {
  // Paths — realistic jersey outline
  const BODY    = "M 95,58 C 95,44 205,44 205,58 L 232,88 L 242,320 L 58,320 L 68,88 Z";
  const BODY_SHAPE = "M 95,58 L 205,58 L 232,88 L 242,320 L 58,320 L 68,88 Z";
  const LEFT_SHORT = "M 95,58 L 68,88 L 68,148 L 0,162 L 0,110 L 55,74 Z";
  const RIGHT_SHORT = "M 205,58 L 232,88 L 232,148 L 300,162 L 300,110 L 245,74 Z";
  const LEFT_LONG = "M 95,58 L 68,88 L 68,320 L 0,320 L 0,110 L 55,74 Z";
  const RIGHT_LONG = "M 205,58 L 232,88 L 232,320 L 300,320 L 300,110 L 245,74 Z";

  const leftSleeve = kit.longSleeve ? LEFT_LONG : LEFT_SHORT;
  const rightSleeve = kit.longSleeve ? RIGHT_LONG : RIGHT_SHORT;
  const bodyFill = getBodyFill(kit);
  const badgeX = kit.badgeSide === "left" ? 105 : 185;

  return (
    <svg viewBox="0 0 300 370" className={className} filter="url(#shadow)">
      <PatternDefs kit={kit} />

      {/* Sleeve shadow */}
      <path d={leftSleeve} fill="black" opacity="0.15" transform="translate(3,4)" />
      <path d={rightSleeve} fill="black" opacity="0.15" transform="translate(-3,4)" />

      {/* Sleeves */}
      <path d={leftSleeve} fill={kit.sleeve} />
      <path d={rightSleeve} fill={kit.sleeve} />

      {/* Sleeve shading */}
      <path d={leftSleeve} fill="url(#bodyShade)" opacity="0.7" />
      <path d={rightSleeve} fill="url(#bodyShade)" opacity="0.7" />

      {/* Sleeve cuff */}
      {!kit.longSleeve && (
        <>
          <path d="M 2,150 L 68,135 L 68,148 L 2,162 Z" fill={kit.trim} opacity="0.9" />
          <path d="M 298,150 L 232,135 L 232,148 L 298,162 Z" fill={kit.trim} opacity="0.9" />
        </>
      )}

      {/* Body shadow */}
      <path d={BODY_SHAPE} fill="black" opacity="0.12" transform="translate(0,4)" />

      {/* Body base */}
      <path d={BODY_SHAPE} fill={bodyFill} />

      {/* Shoulder seam stripe */}
      <path d="M 95,58 L 68,88 M 205,58 L 232,88" stroke={kit.trim} strokeWidth="3" fill="none" opacity="0.7" />

      {/* Side seams */}
      <line x1="70" y1="95" x2="60" y2="318" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
      <line x1="230" y1="95" x2="240" y2="318" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />

      {/* Center fold */}
      <line x1="150" y1="60" x2="150" y2="318" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

      {/* Hemline trim */}
      <path d="M 60,308 L 240,308 L 242,320 L 58,320 Z" fill={kit.trim} opacity="0.6" />

      {/* Body fabric shading */}
      <path d={BODY_SHAPE} fill="url(#bodyShade)" />
      <path d={BODY_SHAPE} fill="url(#topHighlight)" />
      <path d={BODY_SHAPE} fill="url(#sheen)" />

      {/* Fabric texture overlay */}
      <path d={BODY_SHAPE} fill={kit.primary} opacity="0.04" filter="url(#fabric)" />
      <path d={leftSleeve} fill={kit.sleeve} opacity="0.04" filter="url(#fabric)" />
      <path d={rightSleeve} fill={kit.sleeve} opacity="0.04" filter="url(#fabric)" />

      {/* Outline */}
      <path d="M 95,58 C 95,44 205,44 205,58 L 232,88 L 242,320 L 58,320 L 68,88 Z" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      <path d={leftSleeve} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
      <path d={rightSleeve} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />

      {/* Collar */}
      {kit.collar === "v-neck" && (
        <>
          <path d="M 95,58 Q 150,105 205,58" fill={kit.trim} opacity="0.5" />
          <path d="M 95,58 Q 150,105 205,58" fill="none" stroke={kit.trim} strokeWidth="4" opacity="0.8" />
        </>
      )}
      {kit.collar === "modern-v" && (
        <>
          <path d="M 95,58 Q 150,125 205,58" fill={kit.trim} opacity="0.5" />
          <path d="M 95,58 Q 150,125 205,58" fill="none" stroke={kit.trim} strokeWidth="5" opacity="0.8" />
        </>
      )}
      {kit.collar === "round" && (
        <>
          <path d="M 100,58 C 102,38 198,38 200,58 L 195,55 C 193,42 107,42 105,55 Z" fill={kit.trim} />
          <path d="M 100,58 C 102,38 198,38 200,58" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
        </>
      )}
      {kit.collar === "polo" && (
        <>
          <path d="M 100,58 L 118,90 L 150,82 L 182,90 L 200,58 L 195,55 C 193,42 107,42 105,55 Z" fill={kit.trim} opacity="0.9" />
          <line x1="150" y1="58" x2="150" y2="80" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
          <circle cx="150" cy="74" r="3" fill="rgba(0,0,0,0.2)" />
          <circle cx="150" cy="62" r="3" fill="rgba(0,0,0,0.2)" />
        </>
      )}
      {kit.collar === "button" && (
        <>
          <path d="M 110,58 L 118,90 L 150,82 L 182,90 L 190,58 C 185,44 115,44 110,58 Z" fill={kit.trim} opacity="0.85" />
          {[66, 72, 78].map(y => (
            <circle key={y} cx="150" cy={y} r="2.5" fill="rgba(0,0,0,0.35)" />
          ))}
        </>
      )}
      {kit.collar === "turtleneck" && (
        <>
          <path d="M 95,58 L 95,35 C 95,25 205,25 205,35 L 205,58 L 195,55 L 195,35 C 195,32 105,32 105,35 L 105,55 Z" fill={kit.trim} />
          <path d="M 95,35 C 95,25 205,25 205,35" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
        </>
      )}

      {/* GA Badge (front) */}
      {view === "front" && (
        <g transform={`translate(${badgeX},115)`}>
          <circle r="14" fill="rgba(0,0,0,0.5)" />
          <circle r="13" fill="#FFD700" opacity="0.9" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#006B3F" fontWeight="900">GA</text>
        </g>
      )}

      {/* Umbro logo area (front only) */}
      {view === "front" && (
        <g transform={`translate(${kit.badgeSide === "left" ? 185 : 105},115)`}>
          <rect x="-10" y="-6" width="20" height="12" rx="2" fill="rgba(255,255,255,0.1)" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="rgba(255,255,255,0.5)" fontWeight="bold">UMBRO</text>
        </g>
      )}

      {/* Sponsor (front) */}
      {view === "front" && kit.sponsor && (
        <g transform="translate(150,185)">
          <rect x={-kit.sponsor.length * 4.5} y="-12" width={kit.sponsor.length * 9} height="22" rx="3" fill="rgba(255,255,255,0.12)" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="white" fontWeight="800" letterSpacing="1"
            style={{ fontFamily: "Arial Black, sans-serif" }}>
            {kit.sponsor.toUpperCase().slice(0, 16)}
          </text>
        </g>
      )}

      {/* Captain armband */}
      {kit.captain && (
        <>
          <rect x={kit.longSleeve ? 14 : 17} y={kit.longSleeve ? 200 : 122} width="52" height="18" rx="4" fill="#FFD700" opacity="0.95" />
          <text x={kit.longSleeve ? 40 : 43} y={kit.longSleeve ? 213 : 135} textAnchor="middle"
            fontSize="9" fill="black" fontWeight="900">CAPTAIN</text>
        </>
      )}

      {/* Back: name + number */}
      {view === "back" && (
        <>
          <text x="150" y="165" textAnchor="middle" fontSize="18" fontWeight="900" letterSpacing="3"
            fill={kit.secondary} stroke={kit.numberOutline} strokeWidth="1"
            style={{ fontFamily: "Arial Black, sans-serif" }}>
            {kit.playerName.toUpperCase().slice(0, 12)}
          </text>
          <text x="150" y="255" textAnchor="middle" fontSize="68" fontWeight="900"
            fill={kit.secondary} stroke={kit.numberOutline} strokeWidth="2"
            style={{ fontFamily: "Arial Black, sans-serif" }}>
            {kit.playerNumber}
          </text>
          {/* League badge back */}
          <g transform="translate(150,285)">
            <circle r="10" fill="rgba(0,0,0,0.3)" />
            <text textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={kit.trim} fontWeight="bold">PSL</text>
          </g>
        </>
      )}

      {/* Front number */}
      {view === "front" && (
        <text x="150" y="258" textAnchor="middle" fontSize="38" fontWeight="900"
          fill={kit.secondary} stroke={kit.numberOutline} strokeWidth="1.5"
          style={{ fontFamily: "Arial Black, sans-serif" }}>
          {kit.playerNumber}
        </text>
      )}
    </svg>
  );
}

// ─── Mini Pattern Preview ─────────────────────────────────────────────────────
function PatternThumb({ pattern, primary, secondary }: { pattern: Pattern; primary: string; secondary: string }) {
  const mock: KitConfig = { ...DEFAULT_KIT, pattern, primary, secondary };
  const fill = getBodyFill(mock);
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full rounded">
      <PatternDefs kit={mock} />
      <rect width="40" height="40" fill={fill} />
      {pattern === "solid" && <rect width="40" height="40" fill={primary} />}
    </svg>
  );
}

// ─── Color Input ─────────────────────────────────────────────────────────────
function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-white/40 text-xs w-20 flex-shrink-0 uppercase tracking-wide">{label}</label>
      <label className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white/15 cursor-pointer hover:border-white/40 transition-all flex-shrink-0 hover:scale-105">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="w-full h-full" style={{ background: value }} />
      </label>
      <input
        type="text"
        value={value}
        onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-primary/60 transition-colors"
        placeholder="#000000"
      />
    </div>
  );
}

// ─── Tab Button ──────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
        active ? "bg-primary text-black" : "text-white/40 hover:text-white hover:bg-white/8"
      }`}>{label}</button>
  );
}

// ─── Collar Preview SVG ───────────────────────────────────────────────────────
function CollarThumb({ style, active, primary }: { style: CollarStyle; active: boolean; primary: string }) {
  return (
    <svg viewBox="60 40 180 90" className="w-full h-12">
      <path d="M 95,58 C 95,44 205,44 205,58 L 215,75 L 85,75 Z" fill={primary} opacity="0.4" />
      {style === "v-neck" && <path d="M 95,58 Q 150,105 205,58" fill="none" stroke={active ? "#FFD700" : "white"} strokeWidth="5" />}
      {style === "modern-v" && <path d="M 95,58 Q 150,125 205,58" fill="none" stroke={active ? "#FFD700" : "white"} strokeWidth="5" />}
      {style === "round" && <path d="M 100,58 C 102,38 198,38 200,58" fill={active ? "#FFD700" : "rgba(255,255,255,0.5)"} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />}
      {style === "polo" && <path d="M 100,58 L 118,90 L 150,80 L 182,90 L 200,58 C 195,44 105,44 100,58 Z" fill={active ? "#FFD700" : "rgba(255,255,255,0.4)"} />}
      {style === "button" && (
        <>
          <path d="M 110,58 L 118,90 L 150,80 L 182,90 L 190,58 C 185,44 115,44 110,58 Z" fill={active ? "#FFD700" : "rgba(255,255,255,0.4)"} />
          {[68, 76].map(y => <circle key={y} cx="150" cy={y} r="3" fill="rgba(0,0,0,0.4)" />)}
        </>
      )}
      {style === "turtleneck" && (
        <path d="M 95,58 L 95,35 C 95,25 205,25 205,35 L 205,58 L 195,55 L 195,35 C 195,32 105,32 105,35 L 105,55 Z"
          fill={active ? "#FFD700" : "rgba(255,255,255,0.4)"} />
      )}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KitDesigner() {
  const [kit, setKit] = useState<KitConfig>({ ...DEFAULT_KIT, id: Date.now().toString() });
  const [view, setView] = useState<"front" | "back">("front");
  const [tab, setTab] = useState<"colours" | "patterns" | "collar" | "details" | "sponsor" | "options">("colours");
  const [collection, setCollection] = useState<KitConfig[]>(() => {
    try { return JSON.parse(localStorage.getItem("kit-collection") || "[]"); } catch { return []; }
  });
  const [saved, setSaved] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [inspireIdx, setInspireIdx] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(<K extends keyof KitConfig>(key: K, val: KitConfig[K]) => {
    setKit(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  }, []);

  function randomize() {
    const r = () => RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
    setKit(prev => ({
      ...prev,
      primary: r(), secondary: r(), sleeve: r(), trim: r(),
      pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)].id,
      collar: COLLARS[Math.floor(Math.random() * COLLARS.length)].id,
      longSleeve: Math.random() > 0.6,
      id: Date.now().toString(),
    }));
    setSaved(false);
  }

  function inspire() {
    const next = INSPIRE_KITS[inspireIdx % INSPIRE_KITS.length];
    setKit(prev => ({ ...prev, ...next, id: Date.now().toString() }));
    setInspireIdx(i => i + 1);
    setSaved(false);
  }

  function reset() {
    setKit({ ...DEFAULT_KIT, id: Date.now().toString() });
    setSaved(false);
  }

  function saveKit() {
    const toSave = { ...kit, id: Date.now().toString() };
    const next = [...collection, toSave];
    setCollection(next);
    localStorage.setItem("kit-collection", JSON.stringify(next));
    setSaved(true);
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["kit-designer"] = true;
    if (next.length >= 5) ach["kit-collector"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
    const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + 30;
    localStorage.setItem("supporter-points", String(pts));
  }

  function deleteKit(id: string) {
    const next = collection.filter(k => k.id !== id);
    setCollection(next);
    localStorage.setItem("kit-collection", JSON.stringify(next));
  }

  function loadKit(k: KitConfig) {
    setKit({ ...k, id: Date.now().toString() });
    setSaved(false);
  }

  function downloadKit() {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `arrows-kit-${kit.playerNumber}.svg`; a.click();
    URL.revokeObjectURL(url);
  }

  const KIT_TYPES: { id: KitType; label: string }[] = [
    { id: "home", label: "Home" }, { id: "away", label: "Away" },
    { id: "third", label: "Third" }, { id: "goalkeeper", label: "GK" },
  ];

  return (
    // Break out of the max-w-2xl container
    <div className="-mx-4 -mt-6 -mb-6 flex flex-col md:flex-row min-h-[600px]" style={{ background: "#0A0A0A" }}>

      {/* ── LEFT: Jersey Preview ──────────────────────────────────────── */}
      <div className="md:w-[52%] flex flex-col border-r border-white/8 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 40% 30%, #0D2B1A 0%, #0A0A0A 70%)" }}>

        {/* Stadium atmosphere BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-96 opacity-[0.06]"
            style={{ background: "linear-gradient(180deg, #FFD700 0%, transparent 100%)", filter: "blur(40px)" }} />
          <div className="absolute top-0 right-1/4 w-64 h-96 opacity-[0.04]"
            style={{ background: "linear-gradient(180deg, #006B3F 0%, transparent 100%)", filter: "blur(40px)" }} />
        </div>

        {/* Top bar */}
        <div className="relative flex items-center gap-2 px-4 pt-4 pb-2">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            {(["front", "back"] as const).map(v => (
              <motion.button key={v} onClick={() => setView(v)} whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  view === v ? "bg-primary text-black" : "text-white/40 hover:text-white"
                }`}>{v}</motion.button>
            ))}
          </div>
          <motion.button onClick={() => { setView(v => v === "front" ? "back" : "front"); }}
            whileHover={{ scale: 1.05, rotate: 180 }} whileTap={{ scale: 0.9 }}
            transition={{ rotate: { duration: 0.3 } }}
            className="ml-auto flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:text-white hover:bg-white/10 transition-colors">
            <RotateCcw className="h-3.5 w-3.5" /> Rotate
          </motion.button>
          <motion.button onClick={() => setAutoRotate(a => !a)} whileTap={{ scale: 0.95 }}
            className={`text-xs px-3 py-2 rounded-xl border transition-all ${
              autoRotate ? "border-primary/50 bg-primary/15 text-primary" : "border-white/10 bg-white/5 text-white/40 hover:text-white"
            }`}>Auto</motion.button>
        </div>

        {/* Jersey */}
        <div className="relative flex-1 flex items-center justify-center px-6 py-4">
          {/* Kit type badge */}
          <div className="absolute top-2 left-4 z-10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
              {KIT_TYPES.find(k => k.id === kit.kitType)?.label} Kit
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={view}
              initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ perspective: "800px" }}>
              <motion.div ref={previewRef}
                animate={autoRotate ? { rotateY: [0, 180, 360] } : {}}
                transition={autoRotate ? { duration: 4, repeat: Infinity, ease: "linear" } : {}}
              >
                <JerseyPreview kit={kit} view={view}
                  className="w-full max-w-[240px] sm:max-w-[280px] mx-auto drop-shadow-2xl" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Kit name label */}
        <div className="text-center pb-2">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{kit.kitName}</p>
          <p className="text-white/15 text-[10px]">{kit.playerName} · #{kit.playerNumber}</p>
        </div>

        {/* Saved kits strip */}
        <div className="border-t border-white/8 px-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">My Saved Kits ({collection.length})</p>
            {collection.length > 0 && (
              <button onClick={saveKit} className="text-[9px] text-primary font-bold uppercase tracking-wider">+ Save Current</button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {collection.length === 0 && (
              <div className="text-white/20 text-xs py-2 px-1">No saved kits yet — save your design!</div>
            )}
            {collection.map(k => (
              <motion.div key={k.id} className="relative flex-shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.08, y: -2 }} onClick={() => loadKit(k)}>
                <div className="w-14 h-14 rounded-lg border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${k.primary}30, ${k.secondary}20)` }}>
                  <JerseyPreview kit={k} view="front" className="w-12 h-12" />
                </div>
                <p className="text-[8px] text-white/30 text-center mt-1 truncate w-14">{k.kitName}</p>
                <motion.button
                  onClick={e => { e.stopPropagation(); deleteKit(k.id); }}
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  <Trash2 className="h-2.5 w-2.5 text-white" />
                </motion.button>
              </motion.div>
            ))}
            <motion.button onClick={saveKit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-14 h-14 rounded-lg border border-dashed border-white/15 flex items-center justify-center hover:border-primary/40 transition-colors">
              <Plus className="h-4 w-4 text-white/25 hover:text-primary" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Controls ───────────────────────────────────────────── */}
      <div className="md:w-[48%] flex flex-col">
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-3 pt-3 pb-2 overflow-x-auto scrollbar-none border-b border-white/8"
          style={{ background: "#111111" }}>
          {(["colours","patterns","collar","details","sponsor","options"] as const).map(t => (
            <TabBtn key={t} active={tab === t} onClick={() => setTab(t)} label={t} />
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5" style={{ background: "#111111" }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}>

              {/* ── COLOURS ───────────────────────────────────────────── */}
              {tab === "colours" && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">Colours</p>
                    <ColorInput value={kit.primary} onChange={v => update("primary", v)} label="Primary" />
                    <ColorInput value={kit.secondary} onChange={v => update("secondary", v)} label="Secondary" />
                    <ColorInput value={kit.sleeve} onChange={v => update("sleeve", v)} label="Sleeves" />
                    <ColorInput value={kit.trim} onChange={v => update("trim", v)} label="Collar / Trim" />
                    <ColorInput value={kit.numberOutline} onChange={v => update("numberOutline", v)} label="Num Outline" />
                  </div>

                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Popular Combos</p>
                    <div className="grid grid-cols-3 gap-2">
                      {POPULAR_COMBOS.map((combo, i) => (
                        <motion.button key={i}
                          onClick={() => { update("primary", combo.p); update("secondary", combo.s); update("sleeve", combo.p); update("trim", combo.s); }}
                          whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                          className={`rounded-xl overflow-hidden border transition-all ${
                            kit.primary === combo.p && kit.secondary === combo.s
                              ? "border-primary/70 ring-1 ring-primary/40" : "border-white/10 hover:border-white/25"
                          }`}>
                          <div className="flex h-8">
                            <div className="flex-1" style={{ background: combo.p }} />
                            <div className="flex-1" style={{ background: combo.s }} />
                          </div>
                          <p className="text-[8px] text-white/40 py-1 text-center truncate px-1">{combo.label}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATTERNS ─────────────────────────────────────────── */}
              {tab === "patterns" && (
                <div>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Pattern Library</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PATTERNS.map(p => (
                      <motion.button key={p.id}
                        onClick={() => update("pattern", p.id)}
                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                        className={`rounded-xl overflow-hidden border transition-all ${
                          kit.pattern === p.id ? "border-primary ring-1 ring-primary/40" : "border-white/10 hover:border-white/25"
                        }`}>
                        <div className="aspect-square relative">
                          <PatternThumb pattern={p.id} primary={kit.primary} secondary={kit.secondary} />
                          {kit.pattern === p.id && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-black" />
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-white/50 py-1 text-center font-medium">{p.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── COLLAR ───────────────────────────────────────────── */}
              {tab === "collar" && (
                <div>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Collar Style</p>
                  <div className="grid grid-cols-2 gap-3">
                    {COLLARS.map(c => (
                      <motion.button key={c.id}
                        onClick={() => update("collar", c.id)}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        className={`rounded-xl border overflow-hidden transition-all ${
                          kit.collar === c.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/3 hover:border-white/25"
                        }`}>
                        <CollarThumb style={c.id} active={kit.collar === c.id} primary={kit.primary} />
                        <div className="px-3 py-2 text-left">
                          <p className={`text-xs font-bold ${kit.collar === c.id ? "text-primary" : "text-white/70"}`}>{c.label}</p>
                          <p className="text-[10px] text-white/30">{c.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── DETAILS ──────────────────────────────────────────── */}
              {tab === "details" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Player Details</p>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-white/40 text-[10px] uppercase tracking-wide block mb-1">Player Name</label>
                        <input value={kit.playerName} maxLength={14}
                          onChange={e => update("playerName", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors uppercase font-bold tracking-widest"
                          placeholder="YOUR NAME" />
                      </div>
                      <div>
                        <label className="text-white/40 text-[10px] uppercase tracking-wide block mb-1">Squad Number</label>
                        <input value={kit.playerNumber}
                          onChange={e => update("playerNumber", e.target.value.replace(/\D/g, "").slice(0, 2))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors font-display text-2xl tracking-widest text-center"
                          placeholder="10" />
                      </div>
                      <div>
                        <label className="text-white/40 text-[10px] uppercase tracking-wide block mb-1">Kit Name</label>
                        <input value={kit.kitName}
                          onChange={e => update("kitName", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors"
                          placeholder="My Kit" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Options</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div onClick={() => update("captain", !kit.captain)}
                          className={`w-10 h-6 rounded-full border-2 transition-all relative ${kit.captain ? "bg-primary border-primary" : "bg-white/5 border-white/15"}`}>
                          <motion.div animate={{ x: kit.captain ? 16 : 2 }}
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                        </div>
                        <span className="text-white/60 text-sm group-hover:text-white transition-colors">Captain Armband</span>
                      </label>
                      <div>
                        <label className="text-white/40 text-[10px] uppercase tracking-wide block mb-2">Badge Position</label>
                        <div className="flex gap-2">
                          {(["left", "right"] as const).map(s => (
                            <motion.button key={s} onClick={() => update("badgeSide", s)} whileTap={{ scale: 0.95 }}
                              className={`flex-1 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                                kit.badgeSide === s ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/40 hover:border-white/25"
                              }`}>{s} chest</motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SPONSOR ──────────────────────────────────────────── */}
              {tab === "sponsor" && (
                <div className="space-y-5">
                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Kit Type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {KIT_TYPES.map(k => (
                        <motion.button key={k.id} onClick={() => update("kitType", k.id)} whileTap={{ scale: 0.97 }}
                          className={`py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            kit.kitType === k.id ? "border-primary bg-primary/15 text-primary" : "border-white/10 bg-white/3 text-white/40 hover:border-white/25 hover:text-white"
                          }`}>{k.label}</motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Chest Sponsor</p>
                    <input value={kit.sponsor}
                      onChange={e => update("sponsor", e.target.value.slice(0, 16))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors uppercase font-bold tracking-widest"
                      placeholder="SPONSOR NAME" />
                    <p className="text-white/20 text-[10px] mt-1.5">Appears on front chest. Max 16 characters.</p>
                  </div>

                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Fit</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["player", "fan"] as const).map(f => (
                        <motion.button key={f} onClick={() => update("fit", f)} whileTap={{ scale: 0.97 }}
                          className={`py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            kit.fit === f ? "border-primary bg-primary/15 text-primary" : "border-white/10 bg-white/3 text-white/40 hover:border-white/25 hover:text-white"
                          }`}>{f} Fit</motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── OPTIONS ──────────────────────────────────────────── */}
              {tab === "options" && (
                <div className="space-y-5">
                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Sleeve Length</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([["short", "Short Sleeve"], ["long", "Long Sleeve"]] as const).map(([val, label]) => (
                        <motion.button key={val} onClick={() => update("longSleeve", val === "long")} whileTap={{ scale: 0.97 }}
                          className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            (val === "long") === kit.longSleeve ? "border-primary bg-primary/15 text-primary" : "border-white/10 bg-white/3 text-white/40 hover:border-white/25 hover:text-white"
                          }`}>{label}</motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">AI Inspiration</p>
                    <motion.button onClick={inspire} whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,215,0,0.2)" }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-xl border border-primary/40 bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/15 transition-colors">
                      <Sparkles className="h-4 w-4" /> Inspire Me
                    </motion.button>
                    <p className="text-white/20 text-[10px] mt-1.5 text-center">Generates a curated kit design</p>
                  </div>

                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mb-3">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button onClick={randomize} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-2.5 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all">
                        <Shuffle className="h-3.5 w-3.5" /> Random Kit
                      </motion.button>
                      <motion.button onClick={reset} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-2.5 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Persistent action bar ─────────────────────────────────── */}
        <div className="border-t border-white/8 px-4 py-3 flex gap-2" style={{ background: "#0D0D0D" }}>
          <motion.button onClick={randomize} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/50 text-xs font-bold hover:bg-white/10 hover:text-white transition-all">
            <Shuffle className="h-3.5 w-3.5" /> Random
          </motion.button>
          <motion.button onClick={downloadKit} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/50 text-xs font-bold hover:bg-white/10 hover:text-white transition-all">
            <Download className="h-3.5 w-3.5" /> Export
          </motion.button>
          <motion.button onClick={saveKit} whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(255,215,0,0.35)" }} whileTap={{ scale: 0.95 }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden ${
              saved ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-primary text-black"
            }`}>
            {!saved && (
              <motion.div className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
                animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save Kit"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
