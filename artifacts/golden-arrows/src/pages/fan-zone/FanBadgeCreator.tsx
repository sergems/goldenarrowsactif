import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Save, Shuffle, RotateCcw } from "lucide-react";

type ShieldShape = "classic" | "round" | "diamond" | "hexagon" | "crest";
type BadgeIcon = "arrow" | "star" | "crown" | "lightning" | "football" | "trophy";

interface BadgeConfig {
  shape: ShieldShape;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  icon: BadgeIcon;
  topText: string;
  bottomText: string;
  year: string;
  stars: number;
}

const DEFAULT: BadgeConfig = {
  shape: "classic",
  primaryColor: "#1B5E20",
  secondaryColor: "#FFD700",
  textColor: "#FFD700",
  icon: "arrow",
  topText: "GOLDEN",
  bottomText: "ARROWS",
  year: "2025",
  stars: 2,
};

function ShieldPath({ shape }: { shape: ShieldShape }) {
  if (shape === "classic") return <path d="M100,10 L175,35 L175,95 Q175,150 100,185 Q25,150 25,95 L25,35 Z" />;
  if (shape === "round") return <path d="M100,12 L170,40 L170,100 Q170,158 100,185 Q30,158 30,100 L30,40 Z" />;
  if (shape === "diamond") return <polygon points="100,10 185,100 100,190 15,100" />;
  if (shape === "hexagon") return <polygon points="100,10 175,52.5 175,137.5 100,180 25,137.5 25,52.5" />;
  if (shape === "crest") return <path d="M100,10 L175,10 L175,120 Q175,165 100,185 Q25,165 25,120 L25,10 Z" />;
  return null;
}

function BadgeIcon({ icon, color }: { icon: BadgeIcon; color: string }) {
  if (icon === "arrow") return <path d="M100,60 L140,100 L115,100 L115,135 L85,135 L85,100 L60,100 Z" fill={color} />;
  if (icon === "star") return <polygon points="100,55 112,90 148,90 120,112 130,148 100,125 70,148 80,112 52,90 88,90" fill={color} />;
  if (icon === "crown") return <path d="M65,130 L65,85 L80,105 L100,70 L120,105 L135,85 L135,130 Z" fill={color} />;
  if (icon === "lightning") return <polygon points="115,60 85,105 105,105 85,140 115,90 95,90" fill={color} />;
  if (icon === "football") return <circle cx="100" cy="100" r="32" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />;
  if (icon === "trophy") return <path d="M80,130 L80,120 Q68,115 65,100 L65,75 L135,75 L135,100 Q132,115 120,120 L120,130 L130,130 L130,140 L70,140 L70,130 Z" fill={color} />;
  return null;
}

function BadgePreview({ cfg }: { cfg: BadgeConfig }) {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" }}>
      <defs>
        <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cfg.primaryColor} />
          <stop offset="100%" stopColor={cfg.secondaryColor} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="badge-sheen" x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Shield fill */}
      <g>
        <ShieldPath shape={cfg.shape} />
      </g>
      <g fill="url(#badge-grad)" stroke={cfg.secondaryColor} strokeWidth="3">
        <ShieldPath shape={cfg.shape} />
      </g>

      {/* Secondary border inside */}
      <g fill="none" stroke={cfg.secondaryColor} strokeWidth="2" opacity="0.5" transform="translate(8,8) scale(0.92,0.92)">
        <ShieldPath shape={cfg.shape} />
      </g>

      {/* Sheen */}
      <g fill="url(#badge-sheen)">
        <ShieldPath shape={cfg.shape} />
      </g>

      {/* Icon */}
      <BadgeIcon icon={cfg.icon} color={cfg.textColor} />

      {/* Stars */}
      {cfg.stars > 0 && (
        <g>
          {Array(cfg.stars).fill(0).map((_, i) => {
            const totalWidth = cfg.stars * 14;
            const startX = 100 - totalWidth / 2 + 7;
            return (
              <text key={i} x={startX + i * 14} y="60" textAnchor="middle" fontSize="12" fill={cfg.textColor}>★</text>
            );
          })}
        </g>
      )}

      {/* Top text */}
      {cfg.topText && (
        <text x="100" y="42" textAnchor="middle" fontSize="11" fontWeight="900" fill={cfg.textColor}
          letterSpacing="2" style={{ fontFamily: "Arial Black, sans-serif" }}>
          {cfg.topText.slice(0, 10).toUpperCase()}
        </text>
      )}

      {/* Bottom text */}
      {cfg.bottomText && (
        <text x="100" y="165" textAnchor="middle" fontSize="11" fontWeight="900" fill={cfg.textColor}
          letterSpacing="2" style={{ fontFamily: "Arial Black, sans-serif" }}>
          {cfg.bottomText.slice(0, 10).toUpperCase()}
        </text>
      )}

      {/* Year */}
      {cfg.year && (
        <text x="100" y="178" textAnchor="middle" fontSize="8" fill={cfg.textColor} opacity="0.7">
          EST. {cfg.year}
        </text>
      )}
    </svg>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/40 text-xs w-20">{label}</span>
      <label className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer overflow-hidden">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-full h-full opacity-0 cursor-pointer" />
        <div className="w-full h-full -mt-8" style={{ background: value }} />
      </label>
      <span className="text-white/30 text-xs font-mono">{value}</span>
    </div>
  );
}

export default function FanBadgeCreator() {
  const [cfg, setCfg] = useState<BadgeConfig>({ ...DEFAULT });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof BadgeConfig>(k: K, v: BadgeConfig[K]) {
    setCfg(p => ({ ...p, [k]: v }));
    setSaved(false);
  }

  function randomize() {
    const shapes: ShieldShape[] = ["classic", "round", "diamond", "hexagon", "crest"];
    const icons: BadgeIcon[] = ["arrow", "star", "crown", "lightning", "football", "trophy"];
    const colors = ["#1B5E20","#FFD700","#E53E3E","#2B6CB0","#553C9A","#744210","#000000","#9B2C2C"];
    setCfg({
      ...cfg,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      primaryColor: colors[Math.floor(Math.random() * colors.length)],
      secondaryColor: colors[Math.floor(Math.random() * colors.length)],
    });
    setSaved(false);
  }

  function saveBadge() {
    const badges = JSON.parse(localStorage.getItem("fan-badges") || "[]");
    badges.push({ ...cfg, savedAt: Date.now() });
    localStorage.setItem("fan-badges", JSON.stringify(badges.slice(-10)));
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["badge-creator"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
    setSaved(true);
  }

  function downloadBadge() {
    const svg = document.querySelector("#badge-preview") as SVGSVGElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fan-badge.svg"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6" id="badge-preview">
        <BadgePreview cfg={cfg} />
      </div>

      {/* Shape */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3">
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Shield Shape</p>
        <div className="grid grid-cols-5 gap-1.5">
          {(["classic","round","diamond","hexagon","crest"] as ShieldShape[]).map(s => (
            <motion.button key={s} onClick={() => update("shape", s)} whileTap={{ scale: 0.95 }}
              className={`py-2 text-[10px] font-bold rounded-lg border capitalize transition-all ${
                cfg.shape === s ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/40 hover:border-white/25"
              }`}>
              {s}
            </motion.button>
          ))}
        </div>

        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-2">Icon</p>
        <div className="grid grid-cols-6 gap-1.5">
          {(["arrow","star","crown","lightning","football","trophy"] as BadgeIcon[]).map(ic => (
            <motion.button key={ic} onClick={() => update("icon", ic)} whileTap={{ scale: 0.95 }}
              className={`py-2 text-lg rounded-lg border transition-all ${
                cfg.icon === ic ? "border-primary bg-primary/15" : "border-white/10 hover:border-white/25"
              }`}>
              {ic === "arrow" ? "➡️" : ic === "star" ? "⭐" : ic === "crown" ? "👑" : ic === "lightning" ? "⚡" : ic === "football" ? "⚽" : "🏆"}
            </motion.button>
          ))}
        </div>

        <div className="space-y-2">
          <ColorInput label="Primary" value={cfg.primaryColor} onChange={v => update("primaryColor", v)} />
          <ColorInput label="Secondary" value={cfg.secondaryColor} onChange={v => update("secondaryColor", v)} />
          <ColorInput label="Text/Icons" value={cfg.textColor} onChange={v => update("textColor", v)} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input value={cfg.topText} onChange={e => update("topText", e.target.value)} placeholder="Top Text"
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20" />
          <input value={cfg.bottomText} onChange={e => update("bottomText", e.target.value)} placeholder="Bottom Text"
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20" />
        </div>

        <div className="flex gap-2 items-center">
          <input value={cfg.year} onChange={e => update("year", e.target.value.slice(0,4))} placeholder="Year"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">Stars</span>
            {[0,1,2,3,4,5].map(n => (
              <button key={n} onClick={() => update("stars", n)}
                className={`text-sm transition-colors ${n <= cfg.stars ? "text-yellow-400" : "text-white/20"}`}>★</button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <motion.button onClick={randomize} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-xs font-bold hover:bg-white/10 transition-colors">
          <Shuffle className="h-3.5 w-3.5" /> Random
        </motion.button>
        <motion.button onClick={downloadBadge} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-xs font-bold hover:bg-white/10 transition-colors">
          <Download className="h-3.5 w-3.5" /> Download
        </motion.button>
        <motion.button onClick={saveBadge} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all ${
            saved ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-primary text-black"
          }`}>
          <Save className="h-3.5 w-3.5" /> {saved ? "Saved!" : "Save"}
        </motion.button>
      </div>
    </div>
  );
}
