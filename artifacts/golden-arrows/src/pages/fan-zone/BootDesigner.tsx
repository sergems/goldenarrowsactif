import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Save, Shuffle, RotateCcw, Download, Plus, Trash2,
  ChevronLeft, ChevronRight, Check, Layers, Palette, Zap,
  Circle, User, Star, Eye, Share2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelId = "speed" | "power" | "control" | "classic" | "goalkeeper" | "futsal";
type MaterialId = "synthetic" | "leather" | "knit" | "mesh" | "microfibre" | "carbon";
type FinishId = "gloss" | "matte" | "metallic" | "reflective";
type StudType = "fg" | "sg" | "ag" | "tf" | "ic";
type LaceStyle = "flat" | "round" | "none" | "elastic" | "contrast";
type PatternId =
  | "plain" | "gradient" | "stripes" | "hexagon" | "speed-lines"
  | "carbon" | "camo" | "geometric" | "wave" | "lightning" | "brush" | "minimal";
type Angle = "side" | "front" | "back" | "top" | "sole";

interface BootConfig {
  id: string;
  name: string;
  model: ModelId;
  upper: string;
  heel: string;
  toe: string;
  sole: string;
  studs: string;
  laces: string;
  tongue: string;
  trim: string;
  lining: string;
  accent: string;
  material: MaterialId;
  finish: FinishId;
  pattern: PatternId;
  patternOpacity: number;
  studType: StudType;
  laceStyle: LaceStyle;
  playerName: string;
  playerNumber: string;
  showBadge: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_BOOT: BootConfig = {
  id: "", name: "My Boot", model: "speed",
  upper: "#FFD700", heel: "#006B3F", toe: "#D4A800",
  sole: "#1A1A1A", studs: "#BBBBBB", laces: "#FFFFFF",
  tongue: "#FFD700", trim: "#006B3F", lining: "#F0E6B0", accent: "#FFFFFF",
  material: "synthetic", finish: "gloss",
  pattern: "plain", patternOpacity: 0.35,
  studType: "fg", laceStyle: "flat",
  playerName: "", playerNumber: "10", showBadge: true,
};

const BOOT_MODELS: { id: ModelId; label: string; desc: string; icon: string }[] = [
  { id: "speed",      label: "Speed",      desc: "Laceless, ultra-light",  icon: "⚡" },
  { id: "power",      label: "Power",      desc: "Reinforced strike zone",  icon: "💪" },
  { id: "control",    label: "Control",    desc: "Precision microfibre",    icon: "🎯" },
  { id: "classic",    label: "Classic",    desc: "Full-grain leather",      icon: "👑" },
  { id: "goalkeeper", label: "GK",         desc: "Wide toe, grip sole",     icon: "🥅" },
  { id: "futsal",     label: "Futsal",     desc: "Flat rubber sole",        icon: "🏟️" },
];

const PATTERNS: { id: PatternId; label: string }[] = [
  { id: "plain",       label: "Plain" },
  { id: "gradient",    label: "Gradient" },
  { id: "stripes",     label: "Stripes" },
  { id: "speed-lines", label: "Speed" },
  { id: "hexagon",     label: "Hexagon" },
  { id: "carbon",      label: "Carbon" },
  { id: "camo",        label: "Camo" },
  { id: "geometric",   label: "Geo" },
  { id: "wave",        label: "Wave" },
  { id: "lightning",   label: "Lightning" },
  { id: "brush",       label: "Brush" },
  { id: "minimal",     label: "Minimal" },
];

const MATERIALS: { id: MaterialId; label: string; desc: string }[] = [
  { id: "synthetic",  label: "Synthetic",  desc: "Lightweight & durable" },
  { id: "leather",    label: "Leather",    desc: "Premium touch & feel" },
  { id: "knit",       label: "Knit",       desc: "Sock-like fit" },
  { id: "mesh",       label: "Mesh",       desc: "Breathable & fast" },
  { id: "microfibre", label: "Microfibre", desc: "Precision control" },
  { id: "carbon",     label: "Carbon",     desc: "Ultra-light structure" },
];

const STUD_TYPES: { id: StudType; label: string; full: string }[] = [
  { id: "fg", label: "FG",  full: "Firm Ground" },
  { id: "sg", label: "SG",  full: "Soft Ground" },
  { id: "ag", label: "AG",  full: "Artificial Grass" },
  { id: "tf", label: "TF",  full: "Turf" },
  { id: "ic", label: "IC",  full: "Indoor/Court" },
];

const INSPIRE_PRESETS: Array<Partial<BootConfig> & { label: string }> = [
  { label: "Gold Edition",      upper: "#FFD700", heel: "#B8960C", toe: "#D4A800", sole: "#111111", studs: "#FFD700", trim: "#B8960C", pattern: "gradient",    finish: "metallic" },
  { label: "Stealth Black",     upper: "#111111", heel: "#222222", toe: "#1A1A1A", sole: "#0A0A0A", studs: "#444444", trim: "#333333", pattern: "carbon",      finish: "matte" },
  { label: "African Heritage",  upper: "#006B3F", heel: "#FFD700", toe: "#005530", sole: "#1A1A1A", studs: "#FFD700", trim: "#FFD700", pattern: "geometric",   finish: "gloss" },
  { label: "Champions Edition", upper: "#FFFFFF", heel: "#FFD700", toe: "#F0F0F0", sole: "#111111", studs: "#C0C0C0", trim: "#FFD700", pattern: "minimal",     finish: "reflective" },
  { label: "Future",            upper: "#7B2FBE", heel: "#FF6B00", toe: "#5A1F8A", sole: "#111111", studs: "#FF6B00", trim: "#FF6B00", pattern: "lightning",   finish: "metallic" },
  { label: "Retro",             upper: "#E53E3E", heel: "#FFFFFF", toe: "#CC2828", sole: "#1A1A1A", studs: "#CCCCCC", trim: "#FFFFFF", pattern: "stripes",     finish: "matte" },
  { label: "Ocean Rush",        upper: "#0EA5E9", heel: "#1E3A5F", toe: "#0980C0", sole: "#0F172A", studs: "#64B5F6", trim: "#1E3A5F", pattern: "wave",        finish: "gloss" },
  { label: "Limited Edition",   upper: "#B45309", heel: "#FFD700", toe: "#92400E", sole: "#111111", studs: "#FFD700", trim: "#FFD700", pattern: "brush",       finish: "metallic" },
];

const POPULAR_COMBOS = [
  { label: "GA Home",   upper: "#FFD700", heel: "#006B3F" },
  { label: "All Black", upper: "#111111", heel: "#222222" },
  { label: "Red Fire",  upper: "#E53E3E", heel: "#111111" },
  { label: "Ice White", upper: "#FFFFFF", heel: "#DDDDDD" },
  { label: "Navy Gold", upper: "#1E3A5F", heel: "#FFD700" },
  { label: "Forest",    upper: "#006B3F", heel: "#FFD700" },
];

const RANDOM_COLORS = [
  "#FFD700","#006B3F","#E53E3E","#2B6CB0","#111111","#FF6B35",
  "#553C9A","#FFFFFF","#0EA5E9","#10B981","#F59E0B","#EC4899",
];

// ─── SVG Pattern Defs ────────────────────────────────────────────────────────

function BootDefs({ cfg }: { cfg: BootConfig }) {
  return (
    <defs>
      {/* Highlight / gloss */}
      <linearGradient id="b-gloss" x1="10%" y1="0%" x2="50%" y2="90%">
        <stop offset="0%"   stopColor="white" stopOpacity={cfg.finish === "matte" ? 0 : cfg.finish === "reflective" ? 0.55 : 0.32} />
        <stop offset="40%"  stopColor="white" stopOpacity={cfg.finish === "matte" ? 0 : 0.07} />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>

      {/* Metallic sheen */}
      <linearGradient id="b-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="white" stopOpacity="0.5" />
        <stop offset="25%"  stopColor="white" stopOpacity="0" />
        <stop offset="55%"  stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="black" stopOpacity="0.15" />
      </linearGradient>

      {/* Edge darkening (AO) */}
      <radialGradient id="b-ao" cx="45%" cy="42%" r="65%">
        <stop offset="55%" stopColor="black" stopOpacity="0" />
        <stop offset="100%" stopColor="black" stopOpacity="0.5" />
      </radialGradient>

      {/* Drop shadow */}
      <filter id="b-shadow" x="-15%" y="-15%" width="135%" height="135%">
        <feDropShadow dx="2" dy="10" stdDeviation="14" floodColor="black" floodOpacity="0.75" />
      </filter>

      {/* ── Patterns ── */}
      <pattern id="pat-stripes" width="18" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
        <rect width="18" height="60" fill="none" />
        <rect width="9" height="60" fill={cfg.accent} opacity="0.35" />
      </pattern>

      <pattern id="pat-speed-lines" width="30" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <rect width="30" height="80" fill="none" />
        <rect width="4" height="80" fill={cfg.accent} opacity="0.25" />
        <rect x="12" width="2" height="80" fill={cfg.accent} opacity="0.12" />
      </pattern>

      <pattern id="pat-hexagon" width="24" height="28" patternUnits="userSpaceOnUse">
        <polygon points="12,1 23,7 23,19 12,25 1,19 1,7"
          fill="none" stroke={cfg.accent} strokeWidth="0.9" opacity="0.5" />
      </pattern>

      <pattern id="pat-carbon" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="10" height="10" fill="rgba(0,0,0,0.25)" />
        <rect width="5" height="5" fill={cfg.accent} opacity="0.12" />
        <rect x="5" y="5" width="5" height="5" fill={cfg.accent} opacity="0.12" />
      </pattern>

      <pattern id="pat-camo" width="48" height="48" patternUnits="userSpaceOnUse">
        <rect width="48" height="48" fill={cfg.accent} opacity="0.08" />
        <polygon points="0,0 18,0 14,18 0,14"  fill={cfg.accent} opacity="0.2" />
        <polygon points="22,8 38,5 40,22 26,24" fill={cfg.accent} opacity="0.12" />
        <polygon points="8,26 24,22 28,40 10,44" fill={cfg.accent} opacity="0.18" />
        <polygon points="30,30 46,26 48,44 32,48" fill={cfg.accent} opacity="0.1" />
      </pattern>

      <pattern id="pat-geometric" width="32" height="32" patternUnits="userSpaceOnUse">
        <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke={cfg.accent} strokeWidth="1" opacity="0.35" />
        <line x1="16" y1="2" x2="2" y2="10"  stroke={cfg.accent} strokeWidth="0.5" opacity="0.2" />
        <line x1="16" y1="2" x2="30" y2="10" stroke={cfg.accent} strokeWidth="0.5" opacity="0.2" />
      </pattern>

      <pattern id="pat-wave" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0,10 C5,0 15,0 20,10 C25,20 35,20 40,10" fill="none" stroke={cfg.accent} strokeWidth="1.8" opacity="0.35" />
      </pattern>

      <pattern id="pat-lightning" width="60" height="80" patternUnits="userSpaceOnUse">
        <path d="M30,5 L18,38 L26,38 L14,75 L42,32 L34,32 L46,5 Z" fill={cfg.accent} opacity="0.22" />
      </pattern>

      <pattern id="pat-brush" width="60" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
        <path d="M0,20 C15,10 25,28 40,18 C55,8 58,25 60,20" fill="none" stroke={cfg.accent} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
      </pattern>

      <pattern id="pat-minimal" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="none" />
        <circle cx="10" cy="10" r="1" fill={cfg.accent} opacity="0.25" />
      </pattern>

      {/* Gradient pattern */}
      <linearGradient id="pat-gradient-fill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor={cfg.upper} />
        <stop offset="100%" stopColor={cfg.heel} />
      </linearGradient>

      {/* Knit material */}
      <pattern id="mat-knit" width="5" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="1" x2="5" y2="1" stroke="rgba(0,0,0,0.14)" strokeWidth="0.7" />
        <line x1="0" y1="3" x2="5" y2="3" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </pattern>

      {/* Mesh material */}
      <pattern id="mat-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="rgba(0,0,0,0.18)" />
      </pattern>

      {/* Leather grain */}
      <pattern id="mat-leather" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
        <rect width="8" height="8" fill="none" />
        <path d="M0,4 C2,2 6,2 8,4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
        <path d="M0,8 C2,6 6,6 8,8" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
      </pattern>
    </defs>
  );
}

// ─── Boot SVG Shapes per model ────────────────────────────────────────────────

const MODEL_SHAPES: Record<ModelId, {
  upper: string; heel: string; toe: string; outsole: string;
  collarCx: number; collarCy: number; collarRx: number; collarRy: number;
  tongueD: string | null; heelTab: boolean;
}> = {
  speed: {
    upper:   "M 52,172 C 48,152 44,125 50,96 C 56,68 72,54 94,48 L 274,40 C 296,38 318,48 332,66 C 344,84 348,112 344,150 L 342,172 Z",
    heel:    "M 302,172 C 314,166 328,154 336,136 L 340,96 C 336,76 324,60 308,54 L 284,48 C 290,68 294,102 292,148 L 288,172 Z",
    toe:     "M 52,172 C 48,152 44,125 50,96 C 54,80 64,66 78,60 L 118,54 C 106,76 98,110 102,152 L 98,172 Z",
    outsole: "M 40,174 C 38,184 32,202 30,212 L 34,216 L 332,216 C 344,216 354,206 352,194 L 350,180 C 348,174 342,172 336,172 L 52,172 C 46,172 42,172 40,174 Z",
    collarCx: 330, collarCy: 68, collarRx: 26, collarRy: 17,
    tongueD: null, heelTab: false,
  },
  power: {
    upper:   "M 54,174 C 50,154 46,126 52,96 C 58,66 76,52 100,46 L 272,38 C 296,36 320,48 334,68 C 348,88 350,118 344,154 L 340,174 Z",
    heel:    "M 298,174 C 312,166 328,152 336,132 L 342,90 C 338,68 324,52 308,46 L 282,40 C 290,62 295,100 292,150 L 288,174 Z",
    toe:     "M 54,174 C 50,154 46,126 52,96 C 56,78 68,64 84,58 L 128,52 C 114,76 106,112 110,154 L 104,174 Z",
    outsole: "M 42,176 C 40,186 34,204 32,214 L 36,218 L 330,218 C 344,218 356,208 354,196 L 352,182 C 350,176 344,174 338,174 L 54,174 C 48,174 44,174 42,176 Z",
    collarCx: 334, collarCy: 64, collarRx: 30, collarRy: 22,
    tongueD: "M 148,52 C 145,62 143,82 145,102 L 202,98 C 204,78 204,60 202,52 Z",
    heelTab: true,
  },
  control: {
    upper:   "M 56,174 C 52,154 48,126 54,98 C 60,70 78,56 102,50 L 268,42 C 292,40 316,52 330,72 C 344,92 346,120 340,156 L 338,174 Z",
    heel:    "M 294,174 C 308,166 322,152 330,132 L 334,92 C 330,72 318,56 302,50 L 278,44 C 286,66 289,100 287,150 L 284,174 Z",
    toe:     "M 56,174 C 52,154 48,126 54,98 C 58,82 70,68 86,62 L 126,56 C 113,78 106,112 109,154 L 105,174 Z",
    outsole: "M 44,176 C 42,186 36,204 34,214 L 38,218 L 328,218 C 340,218 352,208 350,196 L 348,182 C 346,176 340,174 334,174 L 56,174 C 50,174 46,174 44,176 Z",
    collarCx: 328, collarCy: 68, collarRx: 29, collarRy: 20,
    tongueD: "M 150,56 C 148,66 146,86 148,106 L 204,102 C 206,82 206,64 204,56 Z",
    heelTab: true,
  },
  classic: {
    upper:   "M 56,176 C 52,156 48,128 54,100 C 60,72 80,56 106,50 L 264,42 C 290,40 314,54 328,76 C 342,98 344,126 338,160 L 336,176 Z",
    heel:    "M 290,176 C 306,168 320,153 328,132 L 333,90 C 328,68 315,52 299,46 L 273,42 C 282,66 285,102 282,152 L 279,176 Z",
    toe:     "M 56,176 C 52,156 48,128 54,100 C 58,84 72,70 90,64 L 132,58 C 118,80 110,114 114,156 L 108,176 Z",
    outsole: "M 44,178 C 42,188 36,206 34,216 L 38,220 L 326,220 C 338,220 350,210 348,198 L 346,184 C 344,178 338,176 332,176 L 56,176 C 50,176 46,176 44,178 Z",
    collarCx: 326, collarCy: 64, collarRx: 32, collarRy: 26,
    tongueD: "M 152,56 C 150,68 148,90 150,112 L 210,108 C 212,86 212,68 210,56 Z",
    heelTab: true,
  },
  goalkeeper: {
    upper:   "M 58,174 C 54,154 50,124 58,96 C 65,68 84,54 110,48 L 266,40 C 290,38 314,50 328,72 C 342,94 344,122 337,156 L 334,174 Z",
    heel:    "M 290,174 C 306,166 320,150 326,128 L 330,86 C 325,64 312,48 295,42 L 268,38 C 278,62 281,98 279,148 L 276,174 Z",
    toe:     "M 58,174 C 54,154 50,124 58,96 C 62,78 76,64 96,58 L 142,52 C 126,76 118,112 122,154 L 116,174 Z",
    outsole: "M 46,176 C 44,186 38,204 36,214 L 40,218 L 324,218 C 336,218 348,208 346,196 L 344,182 C 342,176 336,174 330,174 L 58,174 C 52,174 48,174 46,176 Z",
    collarCx: 328, collarCy: 64, collarRx: 30, collarRy: 22,
    tongueD: "M 160,52 C 158,64 156,86 158,108 L 220,104 C 222,82 222,64 220,52 Z",
    heelTab: true,
  },
  futsal: {
    upper:   "M 54,170 C 50,152 46,126 52,100 C 58,74 74,58 98,52 L 268,44 C 290,42 310,52 322,70 C 334,88 336,114 330,148 L 328,170 Z",
    heel:    "M 290,170 C 302,164 314,152 320,132 L 323,92 C 319,72 308,58 293,52 L 270,46 C 276,66 279,100 277,146 L 274,170 Z",
    toe:     "M 54,170 C 50,152 46,126 52,100 C 56,84 66,70 82,64 L 120,58 C 108,78 101,112 104,152 L 100,170 Z",
    outsole: "M 42,170 C 42,175 42,185 42,190 L 330,190 C 338,190 344,184 344,176 L 344,170 Z",
    collarCx: 322, collarCy: 68, collarRx: 24, collarRy: 16,
    tongueD: null, heelTab: false,
  },
};

// ─── Stud Renderer ────────────────────────────────────────────────────────────

function Studs({ studType, color, modelId }: { studType: StudType; color: string; modelId: ModelId }) {
  const y = modelId === "futsal" ? 190 : modelId === "classic" ? 222 : 218;
  const h = studType === "sg" ? 14 : studType === "tf" ? 4 : 9;
  const fg = [
    { x: 80, r: 5 }, { x: 116, r: 5 }, { x: 155, r: 5 }, { x: 194, r: 5 },
    { x: 232, r: 4 }, { x: 265, r: 4 },
    { x: 292, r: 5 }, { x: 316, r: 5 }, { x: 337, r: 5 },
  ];
  if (studType === "ic" || modelId === "futsal") return null;
  if (studType === "tf") {
    const tpx = [68,92,116,140,164,188,210,232,254,275,295,315];
    return (
      <g>
        {tpx.map((x, i) => (
          <ellipse key={i} cx={x} cy={y + 2} rx="4" ry="2" fill={color} opacity="0.85" />
        ))}
      </g>
    );
  }
  return (
    <g>
      {fg.map((s, i) => {
        if (studType === "sg" && i > 5) return null;
        return studType === "speed" || studType === "fg" ? (
          <g key={i}>
            <ellipse cx={s.x} cy={y} rx={s.r} ry={s.r * 0.85} fill="rgba(0,0,0,0.4)" transform={`translate(1,${h})`} />
            <ellipse cx={s.x} cy={y} rx={s.r} ry={s.r * 0.85} fill={color} />
            <path d={`M ${s.x - s.r},${y} L ${s.x},${y + h} L ${s.x + s.r},${y} Z`}
              fill={color} />
            <ellipse cx={s.x} cy={y + h} rx={s.r * 0.65} ry={s.r * 0.4} fill={color} opacity="0.7" />
          </g>
        ) : (
          <g key={i}>
            <circle cx={s.x} cy={y + h / 2} r={s.r + 1} fill="rgba(0,0,0,0.3)" />
            <circle cx={s.x} cy={y + h / 2} r={s.r} fill={color} />
            <circle cx={s.x} cy={y + h / 2} r={s.r * 0.4} fill="rgba(255,255,255,0.3)" />
          </g>
        );
      })}
    </g>
  );
}

// ─── Lace Renderer ────────────────────────────────────────────────────────────

function Laces({ style, color, shapes }: { style: LaceStyle; color: string; shapes: typeof MODEL_SHAPES[ModelId] }) {
  if (style === "none" || !shapes.tongueD) return null;
  const eyelets = [
    [134, 59], [196, 56], [134, 70], [196, 67], [134, 81], [196, 78],
    [134, 92], [196, 89], [134, 103], [196, 100],
  ];
  const isGradient = style === "contrast";
  return (
    <g>
      {eyelets.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(0,0,0,0.5)" />
      ))}
      {[[137,61,193,58],[137,72,193,69],[137,83,193,80],[137,94,193,91],[137,105,193,102]].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isGradient ? (i % 2 === 0 ? color : "#006B3F") : color}
          strokeWidth={style === "round" ? 2.5 : style === "elastic" ? 3.5 : 2}
          strokeLinecap="round" opacity="0.9" />
      ))}
    </g>
  );
}

// ─── Main Boot Side View ──────────────────────────────────────────────────────

function BootSideView({ cfg, className = "" }: { cfg: BootConfig; className?: string }) {
  const sh = MODEL_SHAPES[cfg.model];
  const patternId = cfg.pattern === "plain" ? null :
    cfg.pattern === "gradient" ? "pat-gradient-fill" : `pat-${cfg.pattern}`;

  const upperFill = cfg.pattern === "gradient" ? `url(#pat-gradient-fill)` : cfg.upper;
  const matOverlay = cfg.material === "knit" ? "url(#mat-knit)" :
    cfg.material === "mesh" ? "url(#mat-mesh)" :
    cfg.material === "leather" ? "url(#mat-leather)" : null;

  return (
    <svg viewBox="0 0 400 235" className={className} style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.8))" }}>
      <BootDefs cfg={cfg} />

      {/* Ground shadow */}
      <ellipse cx="196" cy="228" rx="168" ry="9" fill="rgba(0,0,0,0.5)" />

      <g filter="url(#b-shadow)">
        {/* Outsole */}
        <path d={sh.outsole} fill={cfg.sole} />
        <path d={sh.outsole} fill="rgba(255,255,255,0.04)" />

        {/* Soleplate edge highlight */}
        <path d={sh.upper.replace(/Z$/, "").split(" ").slice(-4).join(" ") + " Z"}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Studs */}
        <Studs studType={cfg.studType} color={cfg.studs} modelId={cfg.model} />

        {/* MAIN UPPER BASE */}
        <path d={sh.upper} fill={upperFill} />

        {/* Pattern overlay */}
        {patternId && cfg.pattern !== "gradient" && (
          <path d={sh.upper} fill={`url(#${patternId})`} opacity={cfg.patternOpacity} />
        )}

        {/* Material overlay */}
        {matOverlay && (
          <path d={sh.upper} fill={matOverlay} opacity="0.6" />
        )}

        {/* TOE BOX */}
        <path d={sh.toe} fill={cfg.toe} />
        {patternId && cfg.pattern !== "gradient" && (
          <path d={sh.toe} fill={`url(#${patternId})`} opacity={cfg.patternOpacity * 0.7} />
        )}

        {/* Toe/upper seam */}
        <path d={sh.toe} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
        <path d={sh.toe} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />

        {/* TONGUE */}
        {sh.tongueD && (
          <>
            <path d={sh.tongueD} fill={cfg.tongue} />
            <path d={sh.tongueD} fill="rgba(0,0,0,0.12)" />
            <path d={sh.tongueD} fill="url(#b-gloss)" />
          </>
        )}

        {/* LACES */}
        <Laces style={cfg.laceStyle} color={cfg.laces} shapes={sh} />

        {/* HEEL COUNTER */}
        <path d={sh.heel} fill={cfg.heel} />
        {patternId && cfg.pattern !== "gradient" && (
          <path d={sh.heel} fill={`url(#${patternId})`} opacity={cfg.patternOpacity * 0.6} />
        )}
        {/* Heel counter seam */}
        <path d={sh.heel} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
        <path d={sh.heel} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />

        {/* Heel tab */}
        {sh.heelTab && (
          <path d={`M ${sh.collarCx - 4},${sh.collarCy + sh.collarRy + 2} L ${sh.collarCx - 4},${sh.collarCy + sh.collarRy + 18} C ${sh.collarCx - 4},${sh.collarCy + sh.collarRy + 22} ${sh.collarCx + 4},${sh.collarCy + sh.collarRy + 22} ${sh.collarCx + 4},${sh.collarCy + sh.collarRy + 18} L ${sh.collarCx + 4},${sh.collarCy + sh.collarRy + 2} Z`}
            fill={cfg.trim} opacity="0.9" />
        )}

        {/* ANKLE COLLAR ring */}
        <ellipse cx={sh.collarCx} cy={sh.collarCy} rx={sh.collarRx} ry={sh.collarRy}
          fill={cfg.lining} opacity="0.9" />
        <ellipse cx={sh.collarCx} cy={sh.collarCy} rx={sh.collarRx} ry={sh.collarRy}
          fill="rgba(0,0,0,0.35)" />
        <ellipse cx={sh.collarCx} cy={sh.collarCy} rx={sh.collarRx} ry={sh.collarRy}
          fill="none" stroke={cfg.trim} strokeWidth="3" opacity="0.8" />
        <ellipse cx={sh.collarCx} cy={sh.collarCy} rx={sh.collarRx - 4} ry={sh.collarRy - 3}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Midfoot panel seam line (speed line across upper) */}
        {cfg.model === "speed" && (
          <path d={`M 98,54 C 180,44 260,43 332,64`}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        )}

        {/* GA Badge on heel */}
        {cfg.showBadge && (
          <g>
            <circle cx={sh.collarCx - 2} cy={sh.collarCy + sh.collarRy + 38}
              r="14" fill="rgba(0,0,0,0.4)" />
            <circle cx={sh.collarCx - 2} cy={sh.collarCy + sh.collarRy + 38}
              r="13" fill={cfg.trim} opacity="0.95" />
            <circle cx={sh.collarCx - 2} cy={sh.collarCy + sh.collarRy + 38}
              r="9" fill="rgba(0,0,0,0.3)" />
            <text x={sh.collarCx - 2} y={sh.collarCy + sh.collarRy + 42}
              textAnchor="middle" fontSize="8" fill="white" fontWeight="900"
              style={{ fontFamily: "Arial Black, sans-serif" }}>GA</text>
          </g>
        )}

        {/* Personalisation text */}
        {cfg.playerName && sh.tongueD && (
          <text x="165" y="85" textAnchor="middle" fontSize="7.5" fill={cfg.trim}
            fontWeight="900" letterSpacing="1.5" style={{ fontFamily: "Arial Black, sans-serif" }}>
            {cfg.playerName.toUpperCase().slice(0, 9)}
          </text>
        )}

        {/* Gloss / finish overlay on upper */}
        <path d={sh.upper} fill="url(#b-gloss)" />
        {cfg.finish === "metallic" && <path d={sh.upper} fill="url(#b-metallic)" />}

        {/* AO edge darkening */}
        <path d={sh.upper} fill="url(#b-ao)" />
        <path d={sh.heel}  fill="url(#b-ao)" />
        <path d={sh.toe}   fill="url(#b-ao)" />
      </g>
    </svg>
  );
}

// ─── Front / Back / Top / Sole Views ─────────────────────────────────────────

function BootFrontView({ cfg }: { cfg: BootConfig }) {
  return (
    <svg viewBox="0 0 180 240" className="w-full max-w-[130px] mx-auto" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.7))" }}>
      <BootDefs cfg={cfg} />
      <ellipse cx="90" cy="234" rx="60" ry="6" fill="rgba(0,0,0,0.4)" />
      {/* Sole */}
      <path d="M 30,195 C 28,205 26,218 26,222 L 154,222 C 154,218 152,205 150,195 Z" fill={cfg.sole} />
      {/* Toe cap (circular front view) */}
      <ellipse cx="90" cy="135" rx="60" ry="65" fill={cfg.toe} />
      <ellipse cx="90" cy="95" rx="54" ry="56" fill={cfg.upper} />
      {/* Upper body */}
      <path d="M 36,155 L 36,48 C 36,32 144,32 144,48 L 144,155 Z" fill={cfg.upper} />
      <path d="M 36,155 L 36,48 C 36,32 144,32 144,48 L 144,155 Z" fill="url(#b-gloss)" />
      {/* Collar */}
      <ellipse cx="90" cy="48" rx="54" ry="20" fill={cfg.lining} opacity="0.9" />
      <ellipse cx="90" cy="48" rx="54" ry="20" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="90" cy="48" rx="54" ry="20" fill="none" stroke={cfg.trim} strokeWidth="3" opacity="0.85" />
      {/* Studs */}
      {cfg.studType !== "ic" && (
        <>
          {[50,70,90,110,130].map(x => <circle key={x} cx={x} cy={224} r="5" fill={cfg.studs} />)}
          {[62,90,118].map(x => <circle key={x} cx={x} cy={216} r="4" fill={cfg.studs} opacity="0.7" />)}
        </>
      )}
      <path d="M 36,155 L 36,48 C 36,32 144,32 144,48 L 144,155 Z" fill="url(#b-ao)" />
    </svg>
  );
}

function BootSoleView({ cfg }: { cfg: BootConfig }) {
  return (
    <svg viewBox="0 0 240 380" className="w-full max-w-[110px] mx-auto" style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.7))" }}>
      <ellipse cx="120" cy="374" rx="95" ry="6" fill="rgba(0,0,0,0.4)" />
      {/* Sole plate */}
      <path d="M 50,20 C 38,40 28,80 26,140 C 24,200 30,260 44,310 C 52,340 68,365 90,370 L 150,370 C 172,365 188,340 196,310 C 210,260 216,200 214,140 C 212,80 202,40 190,20 C 174,4 66,4 50,20 Z"
        fill={cfg.sole} />
      <path d="M 50,20 C 38,40 28,80 26,140 C 24,200 30,260 44,310 C 52,340 68,365 90,370 L 150,370 C 172,365 188,340 196,310 C 210,260 216,200 214,140 C 212,80 202,40 190,20 C 174,4 66,4 50,20 Z"
        fill="rgba(255,255,255,0.04)" />
      {/* Arch section */}
      <path d="M 56,185 C 48,185 42,192 42,200 L 42,220 C 42,228 48,235 56,235 L 184,235 C 192,235 198,228 198,220 L 198,200 C 198,192 192,185 184,185 Z"
        fill="rgba(255,255,255,0.06)" />
      {/* Carbon stripe */}
      <path d="M 72,180 L 168,180 L 168,240 L 72,240 Z" fill={cfg.heel} opacity="0.3" />
      {/* Studs */}
      {cfg.studType !== "ic" && ([
        [72,55],[108,45],[148,55],[80,110],[120,105],[160,110],
        [64,180],[120,175],[176,180],
        [72,265],[108,275],[148,265],
        [84,330],[120,340],[156,330],
      ].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={cfg.studType === "tf" ? 5 : 8} fill={cfg.studs} />
      )))}
      {/* Golden Arrows sole text */}
      <text x="120" y="360" textAnchor="middle" fontSize="10" fill={cfg.trim} opacity="0.6"
        style={{ fontFamily: "Arial Black, sans-serif" }} letterSpacing="1">GA</text>
    </svg>
  );
}

function BootBackView({ cfg }: { cfg: BootConfig }) {
  const sh = MODEL_SHAPES[cfg.model];
  return (
    <svg viewBox="0 0 180 240" className="w-full max-w-[130px] mx-auto" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.7))" }}>
      <BootDefs cfg={cfg} />
      <ellipse cx="90" cy="234" rx="60" ry="6" fill="rgba(0,0,0,0.4)" />
      {/* Sole */}
      <path d="M 30,195 C 28,208 26,220 26,224 L 154,224 C 154,220 152,208 150,195 Z" fill={cfg.sole} />
      {/* Heel counter (main shape) */}
      <path d="M 36,190 L 36,68 C 36,40 144,40 144,68 L 144,190 Z" fill={cfg.heel} />
      {/* Heel counter shaping curve */}
      <path d="M 60,190 L 60,80 C 60,60 120,60 120,80 L 120,190 Z" fill={cfg.upper} opacity="0.7" />
      <path d="M 36,190 L 36,68 C 36,40 144,40 144,68 L 144,190 Z" fill="url(#b-gloss)" />
      {/* Heel tab */}
      {sh.heelTab && (
        <path d="M 82,38 L 82,22 C 82,18 98,18 98,22 L 98,38 Z" fill={cfg.trim} />
      )}
      {/* Collar */}
      <ellipse cx="90" cy="60" rx="54" ry="22" fill={cfg.lining} opacity="0.9" />
      <ellipse cx="90" cy="60" rx="54" ry="22" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="90" cy="60" rx="54" ry="22" fill="none" stroke={cfg.trim} strokeWidth="3" opacity="0.85" />
      {/* GA badge */}
      {cfg.showBadge && (
        <g>
          <circle cx="90" cy="140" r="18" fill="rgba(0,0,0,0.4)" />
          <circle cx="90" cy="140" r="16" fill={cfg.trim} opacity="0.9" />
          <text x="90" y="145" textAnchor="middle" fontSize="10" fill="white" fontWeight="900"
            style={{ fontFamily: "Arial Black, sans-serif" }}>GA</text>
        </g>
      )}
      {/* Studs */}
      {cfg.studType !== "ic" && (
        <>
          {[52,74,90,106,128].map(x => <circle key={x} cx={x} cy={226} r="5.5" fill={cfg.studs} />)}
        </>
      )}
      <path d="M 36,190 L 36,68 C 36,40 144,40 144,68 L 144,190 Z" fill="url(#b-ao)" />
    </svg>
  );
}

function BootTopView({ cfg }: { cfg: BootConfig }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-[160px] mx-auto" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.7))" }}>
      <BootDefs cfg={cfg} />
      <ellipse cx="150" cy="196" rx="120" ry="5" fill="rgba(0,0,0,0.4)" />
      {/* Main boot top (elongated oval) */}
      <path d="M 30,100 C 30,60 80,22 150,22 C 220,22 272,56 272,100 C 272,144 220,178 150,178 C 80,178 30,140 30,100 Z"
        fill={cfg.upper} />
      {/* Pattern */}
      <path d="M 30,100 C 30,60 80,22 150,22 C 220,22 272,56 272,100 C 272,144 220,178 150,178 C 80,178 30,140 30,100 Z"
        fill="url(#b-gloss)" />
      {/* Toe box */}
      <path d="M 30,100 C 30,68 58,36 90,32 L 90,168 C 58,164 30,132 30,100 Z" fill={cfg.toe} opacity="0.85" />
      {/* Heel */}
      <path d="M 210,30 C 248,46 272,72 272,100 C 272,128 248,154 210,170 L 210,30 Z" fill={cfg.heel} opacity="0.8" />
      {/* Lace channel */}
      {cfg.laceStyle !== "none" && (
        <>
          <ellipse cx="150" cy="100" rx="28" ry="72" fill={cfg.tongue} opacity="0.8" />
          {[72,82,92,100,110,118,126].map((y, i) => (
            <line key={i} x1={122 + (i % 2) * 4} y1={y} x2={178 - (i % 2) * 4} y2={y}
              stroke={cfg.laces} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          ))}
        </>
      )}
      {/* GA badge */}
      {cfg.showBadge && (
        <g>
          <circle cx="240" cy="100" r="14" fill={cfg.trim} opacity="0.9" />
          <text x="240" y="104" textAnchor="middle" fontSize="8" fill="white" fontWeight="900"
            style={{ fontFamily: "Arial Black, sans-serif" }}>GA</text>
        </g>
      )}
      <path d="M 30,100 C 30,60 80,22 150,22 C 220,22 272,56 272,100 C 272,144 220,178 150,178 C 80,178 30,140 30,100 Z"
        fill="url(#b-ao)" />
    </svg>
  );
}

// ─── Mini Boot Thumbnail ──────────────────────────────────────────────────────

function BootThumb({ cfg, angle = "side", active = false, onClick }: {
  cfg: BootConfig; angle?: Angle; active?: boolean; onClick?: () => void;
}) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
      className={`w-full flex flex-col items-center gap-1 rounded-xl border p-2 transition-all ${
        active
          ? "border-primary/70 bg-primary/10"
          : "border-white/10 bg-white/3 hover:border-white/25"
      }`}>
      {angle === "side"  && <BootSideView cfg={cfg} className="w-full max-w-[100px] mx-auto" />}
      {angle === "front" && <BootFrontView cfg={cfg} />}
      {angle === "back"  && <BootBackView cfg={cfg} />}
      {angle === "top"   && <BootTopView cfg={cfg} />}
      {angle === "sole"  && <BootSoleView cfg={cfg} />}
      <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-white/35"}`}>
        {angle}
      </span>
    </motion.button>
  );
}

// ─── Color Row ────────────────────────────────────────────────────────────────

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <label className="relative w-8 h-8 rounded-lg border-2 border-white/15 cursor-pointer overflow-hidden flex-shrink-0 hover:border-white/40 transition-colors">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-full h-full" style={{ background: value }} />
        <div className="absolute inset-0 rounded-lg" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)" }} />
      </label>
      <span className="text-white/45 text-xs flex-1">{label}</span>
      <span className="text-white/20 text-[10px] font-mono">{value.toUpperCase()}</span>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function Tab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl border text-center transition-all flex-1 min-w-0 ${
        active
          ? "border-primary/60 bg-primary/12 text-primary"
          : "border-white/8 text-white/30 hover:border-white/20 hover:text-white/60"
      }`}>
      <span className="h-3.5 w-3.5 flex items-center justify-center">{icon}</span>
      <span className="text-[8px] font-bold uppercase tracking-wider leading-none">{label}</span>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabId = "colours" | "patterns" | "materials" | "studs" | "laces" | "personalise";

export default function BootDesigner() {
  const [cfg, setCfg] = useState<BootConfig>({ ...DEFAULT_BOOT, id: Date.now().toString() });
  const [angle, setAngle] = useState<Angle>("side");
  const [tab, setTab] = useState<TabId>("colours");
  const [collection, setCollection] = useState<BootConfig[]>(() => {
    try { return JSON.parse(localStorage.getItem("boot-collection") || "[]"); } catch { return []; }
  });
  const [saved, setSaved] = useState(false);
  const [inspireIdx, setInspireIdx] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(<K extends keyof BootConfig>(key: K, val: BootConfig[K]) => {
    setCfg(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  }, []);

  function randomize() {
    const rc = () => RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
    const models = Object.keys(MODEL_SHAPES) as ModelId[];
    const pats = PATTERNS.map(p => p.id);
    const mats = MATERIALS.map(m => m.id) as MaterialId[];
    const fins: FinishId[] = ["gloss", "matte", "metallic", "reflective"];
    setCfg(prev => ({
      ...prev,
      model:   models[Math.floor(Math.random() * models.length)],
      upper:   rc(), heel: rc(), toe: rc(), sole: "#111111",
      studs:   rc(), laces: "#FFFFFF", trim: rc(), accent: rc(),
      pattern: pats[Math.floor(Math.random() * pats.length)] as PatternId,
      material: mats[Math.floor(Math.random() * mats.length)],
      finish:  fins[Math.floor(Math.random() * fins.length)],
      id: Date.now().toString(),
    }));
    setSaved(false);
  }

  function inspire() {
    const preset = INSPIRE_PRESETS[inspireIdx % INSPIRE_PRESETS.length];
    const { label: _label, ...rest } = preset;
    setCfg(prev => ({ ...prev, ...rest, name: _label, id: Date.now().toString() }));
    setInspireIdx(i => i + 1);
    setSaved(false);
  }

  function reset() {
    setCfg({ ...DEFAULT_BOOT, id: Date.now().toString() });
    setSaved(false);
  }

  function saveBoot() {
    const toSave = { ...cfg, id: Date.now().toString() };
    const next = [...collection, toSave];
    setCollection(next);
    localStorage.setItem("boot-collection", JSON.stringify(next));
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["boot-designer"] = true;
    if (next.length >= 3) ach["boot-collector"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
    const pts = (JSON.parse(localStorage.getItem("supporter-points") || "0") as number) + 25;
    localStorage.setItem("supporter-points", String(pts));
    setSaved(true);
  }

  function deleteBoot(id: string) {
    const next = collection.filter(b => b.id !== id);
    setCollection(next);
    localStorage.setItem("boot-collection", JSON.stringify(next));
  }

  function loadBoot(b: BootConfig) {
    setCfg({ ...b, id: Date.now().toString() });
    setSaved(false);
  }

  function downloadBoot() {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `arrows-boot-${cfg.name.replace(/\s+/g, "-")}.svg`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-col md:flex-row min-h-[640px]" style={{ background: "#0A0A0A" }}>

      {/* ══ LEFT PANEL ═══════════════════════════════════════════════ */}
      <div className="md:w-[180px] flex-shrink-0 border-r border-white/8 flex flex-col overflow-y-auto"
        style={{ background: "#0D0D0D" }}>

        {/* Model selector */}
        <div className="p-3 border-b border-white/8">
          <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2">Boot Model</p>
          <div className="space-y-1">
            {BOOT_MODELS.map(m => (
              <motion.button key={m.id} onClick={() => update("model", m.id)} whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  cfg.model === m.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/5"
                }`}>
                <span className="text-base leading-none">{m.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-black uppercase tracking-wider leading-none mb-0.5 ${cfg.model === m.id ? "text-primary" : "text-white/60"}`}>{m.label}</p>
                  <p className="text-[9px] text-white/25 leading-none truncate">{m.desc}</p>
                </div>
                {cfg.model === m.id && <Check className="h-3 w-3 text-primary ml-auto flex-shrink-0" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick presets */}
        <div className="p-3 border-b border-white/8">
          <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2">Quick Colours</p>
          <div className="grid grid-cols-3 gap-1.5">
            {POPULAR_COMBOS.map((c, i) => (
              <motion.button key={i} whileTap={{ scale: 0.93 }}
                onClick={() => { update("upper", c.upper); update("heel", c.heel); update("toe", c.upper); update("trim", c.heel); }}
                className={`rounded-lg overflow-hidden border transition-all ${
                  cfg.upper === c.upper && cfg.heel === c.heel ? "border-primary" : "border-white/10 hover:border-white/30"
                }`}>
                <div className="h-5 flex">
                  <div className="flex-1" style={{ background: c.upper }} />
                  <div className="flex-1" style={{ background: c.heel }} />
                </div>
                <p className="text-[7px] text-white/30 text-center py-0.5 truncate px-0.5">{c.label}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Saved designs */}
        <div className="p-3 flex-1">
          <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2">
            Saved ({collection.length})
          </p>
          {collection.length === 0 && (
            <p className="text-white/15 text-[10px] text-center py-4">No saved boots yet</p>
          )}
          <div className="space-y-1.5">
            {collection.slice().reverse().map(b => (
              <motion.div key={b.id} whileHover={{ x: 2 }}
                className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-2.5 py-2 cursor-pointer group hover:border-white/20 transition-all"
                onClick={() => loadBoot(b)}>
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                  <svg viewBox="0 0 400 235" className="w-full h-full">
                    <BootDefs cfg={b} />
                    <path d={MODEL_SHAPES[b.model].outsole} fill={b.sole} />
                    <path d={MODEL_SHAPES[b.model].upper} fill={b.upper} />
                    <path d={MODEL_SHAPES[b.model].heel}  fill={b.heel} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-[10px] font-bold truncate">{b.name}</p>
                  <p className="text-white/25 text-[8px] capitalize">{b.model}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteBoot(b.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/70 hover:text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CENTER: Preview ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col border-r border-white/8 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 40% 30%, #0D2B1A 0%, #070707 65%)" }}>

        {/* Stadium atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-[26rem] opacity-[0.05]"
            style={{ background: "linear-gradient(180deg,#FFD700,transparent)", filter: "blur(50px)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-[18rem] opacity-[0.04]"
            style={{ background: "linear-gradient(0deg,#006B3F,transparent)", filter: "blur(50px)" }} />
        </div>

        {/* Top controls */}
        <div className="relative flex items-center gap-2 px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
              {BOOT_MODELS.find(m => m.id === cfg.model)?.label} Boot
            </span>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="text-white/40 text-[10px] capitalize">{cfg.finish}</span>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="text-white/40 text-[10px] uppercase">{cfg.material}</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <motion.button onClick={randomize} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white transition-colors">
              <Shuffle className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button onClick={reset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white transition-colors">
              <RotateCcw className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Main boot preview */}
        <div ref={previewRef} className="flex-1 flex items-center justify-center px-6 py-4 relative">
          <AnimatePresence mode="wait">
            <motion.div key={`${angle}-${cfg.model}`}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full">
              {angle === "side"  && <BootSideView cfg={cfg} className="w-full max-w-[360px] mx-auto" />}
              {angle === "front" && <BootFrontView cfg={cfg} />}
              {angle === "back"  && <BootBackView cfg={cfg} />}
              {angle === "top"   && <BootTopView cfg={cfg} />}
              {angle === "sole"  && <BootSoleView cfg={cfg} />}
            </motion.div>
          </AnimatePresence>

          {/* Boot name */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p className="text-white/25 text-xs font-bold uppercase tracking-widest">{cfg.name}</p>
            {cfg.playerName && <p className="text-white/15 text-[10px]">{cfg.playerName} · #{cfg.playerNumber}</p>}
          </div>
        </div>

        {/* Angle thumbnails */}
        <div className="border-t border-white/8 px-3 py-2.5 grid grid-cols-5 gap-2"
          style={{ background: "#0A0A0A" }}>
          {(["side","front","back","top","sole"] as Angle[]).map(a => (
            <BootThumb key={a} cfg={cfg} angle={a} active={angle === a} onClick={() => setAngle(a)} />
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL: Controls ═════════════════════════════════════ */}
      <div className="md:w-[272px] flex-shrink-0 flex flex-col" style={{ background: "#111111" }}>

        {/* Tab bar */}
        <div className="p-2.5 border-b border-white/8 flex gap-1" style={{ background: "#0D0D0D" }}>
          <Tab active={tab==="colours"}     onClick={()=>setTab("colours")}     icon={<Palette className="h-3 w-3"/>}     label="Colours" />
          <Tab active={tab==="patterns"}    onClick={()=>setTab("patterns")}    icon={<Layers className="h-3 w-3"/>}      label="Pattern" />
          <Tab active={tab==="materials"}   onClick={()=>setTab("materials")}   icon={<Circle className="h-3 w-3"/>}      label="Material" />
          <Tab active={tab==="studs"}       onClick={()=>setTab("studs")}       icon={<Zap className="h-3 w-3"/>}         label="Studs" />
          <Tab active={tab==="laces"}       onClick={()=>setTab("laces")}       icon={<Star className="h-3 w-3"/>}        label="Laces" />
          <Tab active={tab==="personalise"} onClick={()=>setTab("personalise")} icon={<User className="h-3 w-3"/>}        label="Personal" />
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3.5">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }} className="space-y-5">

              {/* ── COLOURS ──────────────────────────────────────── */}
              {tab === "colours" && (
                <>
                  <div className="space-y-2.5">
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Boot Zones</p>
                    <ColorRow label="Upper" value={cfg.upper} onChange={v => update("upper", v)} />
                    <ColorRow label="Heel Counter" value={cfg.heel} onChange={v => update("heel", v)} />
                    <ColorRow label="Toe Box" value={cfg.toe} onChange={v => update("toe", v)} />
                    <ColorRow label="Soleplate" value={cfg.sole} onChange={v => update("sole", v)} />
                    <ColorRow label="Studs" value={cfg.studs} onChange={v => update("studs", v)} />
                    <ColorRow label="Laces" value={cfg.laces} onChange={v => update("laces", v)} />
                    <ColorRow label="Tongue" value={cfg.tongue} onChange={v => update("tongue", v)} />
                    <ColorRow label="Ankle Collar" value={cfg.trim} onChange={v => update("trim", v)} />
                    <ColorRow label="Inner Lining" value={cfg.lining} onChange={v => update("lining", v)} />
                    <ColorRow label="Accent / Pattern" value={cfg.accent} onChange={v => update("accent", v)} />
                  </div>

                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2.5">Finish</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["gloss","matte","metallic","reflective"] as FinishId[]).map(f => (
                        <motion.button key={f} onClick={() => update("finish", f)} whileTap={{ scale: 0.96 }}
                          className={`py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            cfg.finish === f ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/35 hover:border-white/25"
                          }`}>{f}</motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── PATTERNS ─────────────────────────────────────── */}
              {tab === "patterns" && (
                <>
                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2.5">Pattern Library</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PATTERNS.map(p => {
                        const isActive = cfg.pattern === p.id;
                        return (
                          <motion.button key={p.id} onClick={() => update("pattern", p.id)}
                            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                            className={`rounded-xl border overflow-hidden transition-all ${
                              isActive ? "border-primary ring-1 ring-primary/40" : "border-white/10 hover:border-white/25"
                            }`}>
                            <div className="aspect-square relative" style={{ background: cfg.upper }}>
                              {p.id !== "plain" && p.id !== "gradient" && (
                                <svg className="absolute inset-0 w-full h-full">
                                  <BootDefs cfg={cfg} />
                                  <rect width="100%" height="100%" fill={`url(#pat-${p.id})`} opacity="0.6" />
                                </svg>
                              )}
                              {p.id === "gradient" && (
                                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cfg.upper}, ${cfg.heel})` }} />
                              )}
                              {isActive && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="h-2.5 w-2.5 text-black" />
                                </div>
                              )}
                            </div>
                            <p className="text-[9px] text-white/45 py-1 text-center font-bold">{p.label}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {cfg.pattern !== "plain" && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Opacity</p>
                        <span className="text-white/35 text-[10px] font-bold">{Math.round(cfg.patternOpacity * 100)}%</span>
                      </div>
                      <input type="range" min={0.05} max={0.9} step={0.05} value={cfg.patternOpacity}
                        onChange={e => update("patternOpacity", Number(e.target.value))}
                        className="w-full accent-yellow-400" />
                    </div>
                  )}
                </>
              )}

              {/* ── MATERIALS ────────────────────────────────────── */}
              {tab === "materials" && (
                <div className="space-y-2">
                  <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2.5">Upper Material</p>
                  {MATERIALS.map(m => (
                    <motion.button key={m.id} onClick={() => update("material", m.id)} whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        cfg.material === m.id
                          ? "border-primary bg-primary/10"
                          : "border-white/10 bg-white/3 hover:border-white/25"
                      }`}>
                      <div className={`w-8 h-8 rounded-lg border flex-shrink-0 overflow-hidden ${
                        cfg.material === m.id ? "border-primary/40" : "border-white/10"
                      }`}>
                        <svg className="w-full h-full">
                          <rect width="100%" height="100%" fill={cfg.upper} />
                          {m.id === "knit" && <rect width="100%" height="100%" fill="url(#mat-knit)" />}
                          {m.id === "mesh" && <rect width="100%" height="100%" fill="url(#mat-mesh)" />}
                          {m.id === "leather" && <rect width="100%" height="100%" fill="url(#mat-leather)" />}
                          {m.id === "carbon" && <rect width="100%" height="100%" fill="url(#pat-carbon)" />}
                          <defs>
                            <pattern id="mat-knit" width="5" height="4" patternUnits="userSpaceOnUse">
                              <line x1="0" y1="1" x2="5" y2="1" stroke="rgba(0,0,0,0.14)" strokeWidth="0.7" />
                              <line x1="0" y1="3" x2="5" y2="3" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                            </pattern>
                            <pattern id="mat-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
                              <circle cx="3" cy="3" r="1.2" fill="rgba(0,0,0,0.18)" />
                            </pattern>
                            <pattern id="mat-leather" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
                              <path d="M0,4 C2,2 6,2 8,4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                            </pattern>
                            <pattern id="pat-carbon" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                              <rect width="10" height="10" fill="rgba(0,0,0,0.25)" />
                              <rect width="5" height="5" fill="rgba(255,255,255,0.08)" />
                              <rect x="5" y="5" width="5" height="5" fill="rgba(255,255,255,0.08)" />
                            </pattern>
                          </defs>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${cfg.material === m.id ? "text-primary" : "text-white/65"}`}>{m.label}</p>
                        <p className="text-white/25 text-[10px]">{m.desc}</p>
                      </div>
                      {cfg.material === m.id && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* ── STUDS ────────────────────────────────────────── */}
              {tab === "studs" && (
                <>
                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2.5">Stud Configuration</p>
                    <div className="space-y-2">
                      {STUD_TYPES.map(s => (
                        <motion.button key={s.id} onClick={() => update("studType", s.id)} whileTap={{ scale: 0.97 }}
                          className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                            cfg.studType === s.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/25"
                          }`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base flex-shrink-0 border ${
                            cfg.studType === s.id ? "border-primary/40 bg-primary/15" : "border-white/10 bg-white/5"
                          }`}>
                            {s.id === "fg" ? "⚽" : s.id === "sg" ? "⛈️" : s.id === "ag" ? "🏟️" : s.id === "tf" ? "🏃" : "🏠"}
                          </div>
                          <div>
                            <p className={`text-sm font-black uppercase tracking-widest ${cfg.studType === s.id ? "text-primary" : "text-white/65"}`}>{s.label}</p>
                            <p className="text-white/25 text-[10px]">{s.full}</p>
                          </div>
                          {cfg.studType === s.id && <Check className="h-3.5 w-3.5 text-primary ml-auto" />}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Stud Colour</p>
                    <ColorRow label="Studs" value={cfg.studs} onChange={v => update("studs", v)} />
                    <ColorRow label="Soleplate" value={cfg.sole} onChange={v => update("sole", v)} />
                  </div>
                </>
              )}

              {/* ── LACES ────────────────────────────────────────── */}
              {tab === "laces" && (
                <>
                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2.5">Lace Style</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { id: "flat",     label: "Flat",     desc: "Standard flat laces" },
                        { id: "round",    label: "Round",    desc: "Round tubular laces" },
                        { id: "none",     label: "Laceless", desc: "Clean laceless upper" },
                        { id: "elastic",  label: "Elastic",  desc: "Stretch knit system" },
                        { id: "contrast", label: "Contrast", desc: "Two-colour laces" },
                      ] as const).map(l => (
                        <motion.button key={l.id} onClick={() => update("laceStyle", l.id)} whileTap={{ scale: 0.96 }}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            cfg.laceStyle === l.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/3 hover:border-white/25"
                          }`}>
                          <p className={`text-xs font-black uppercase tracking-wider mb-0.5 ${cfg.laceStyle === l.id ? "text-primary" : "text-white/60"}`}>{l.label}</p>
                          <p className="text-white/25 text-[9px]">{l.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {cfg.laceStyle !== "none" && (
                    <div className="space-y-2">
                      <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Lace Colour</p>
                      <ColorRow label="Laces" value={cfg.laces} onChange={v => update("laces", v)} />
                    </div>
                  )}
                </>
              )}

              {/* ── PERSONALISE ──────────────────────────────────── */}
              {tab === "personalise" && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Player Details</p>
                    <div>
                      <label className="text-white/35 text-[10px] uppercase tracking-wide block mb-1">Player Name</label>
                      <input value={cfg.playerName} maxLength={10} placeholder="YOUR NAME"
                        onChange={e => update("playerName", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors uppercase font-black tracking-widest" />
                    </div>
                    <div>
                      <label className="text-white/35 text-[10px] uppercase tracking-wide block mb-1">Squad Number</label>
                      <input value={cfg.playerNumber} maxLength={2} placeholder="10"
                        onChange={e => update("playerNumber", e.target.value.replace(/\D/g,"").slice(0,2))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-2xl focus:outline-none focus:border-primary/60 transition-colors font-black tracking-widest text-center" />
                    </div>
                    <div>
                      <label className="text-white/35 text-[10px] uppercase tracking-wide block mb-1">Boot Name</label>
                      <input value={cfg.name} placeholder="My Boot"
                        onChange={e => update("name", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary/60 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-3">Options</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/55 text-sm">GA Badge on Boot</span>
                      <button onClick={() => update("showBadge", !cfg.showBadge)}
                        className={`w-11 h-6 rounded-full border-2 transition-all relative ${cfg.showBadge ? "bg-primary border-primary" : "bg-white/5 border-white/15"}`}>
                        <motion.div animate={{ x: cfg.showBadge ? 17 : 2 }}
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                      </button>
                    </div>
                  </div>

                  {/* Inspire section */}
                  <div>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mb-2.5">AI Inspiration</p>
                    <motion.button onClick={inspire}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 22px rgba(255,215,0,0.3)" }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-xl border border-primary/40 bg-primary/10 text-primary font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/15 transition-all relative overflow-hidden">
                      <motion.div className="absolute inset-0 opacity-30"
                        style={{ background: "linear-gradient(90deg,transparent,white,transparent)" }}
                        animate={{ x: ["-100%","200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
                      <Sparkles className="h-4 w-4 relative" />
                      <span className="relative">Inspire Me</span>
                    </motion.button>
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      {INSPIRE_PRESETS.slice(0,6).map((p, i) => (
                        <motion.button key={i} whileTap={{ scale: 0.95 }}
                          onClick={() => { const { label: _l, ...rest } = p; setCfg(prev => ({ ...prev, ...rest, name: _l, id: Date.now().toString() })); setSaved(false); }}
                          className="rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all text-left">
                          <div className="h-5 flex">
                            <div className="flex-1" style={{ background: p.upper || cfg.upper }} />
                            <div className="flex-1" style={{ background: p.heel || cfg.heel }} />
                            <div className="flex-1" style={{ background: p.toe || cfg.toe }} />
                          </div>
                          <p className="text-[8px] text-white/35 px-2 py-1 font-bold truncate">{p.label}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Action bar ─────────────────────────────────────────── */}
        <div className="border-t border-white/8 px-3 py-3 flex gap-2" style={{ background: "#0D0D0D" }}>
          <motion.button onClick={downloadBoot} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/40 text-xs font-bold hover:bg-white/10 hover:text-white transition-all">
            <Download className="h-3.5 w-3.5" />
          </motion.button>
          <motion.button onClick={saveBoot}
            whileHover={{ scale: 1.02, boxShadow: "0 0 22px rgba(255,215,0,0.35)" }} whileTap={{ scale: 0.96 }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-black uppercase tracking-wider transition-all relative overflow-hidden ${
              saved ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-primary text-black"
            }`}>
            {!saved && (
              <motion.div className="absolute inset-0"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)" }}
                animate={{ x: ["-100%","200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
            )}
            <span className="relative flex items-center gap-2">
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save Boot"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
