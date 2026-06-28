import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Save, Shuffle, RotateCcw, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const PATTERNS = ["solid", "stripes", "hoops", "gradient", "lightning", "geometric", "camouflage", "classic"] as const;
type Pattern = typeof PATTERNS[number];
type CollarStyle = "v-neck" | "round" | "polo";

interface KitConfig {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  sleeve: string;
  collar: CollarStyle;
  pattern: Pattern;
  playerName: string;
  playerNumber: string;
  longSleeve: boolean;
  captain: boolean;
  badgeSide: "left" | "right";
  kitName: string;
}

const DEFAULT_KIT: KitConfig = {
  id: "",
  name: "New Kit",
  primary: "#FFD700",
  secondary: "#1B5E20",
  sleeve: "#1B5E20",
  collar: "round",
  pattern: "solid",
  playerName: "PLAYER",
  playerNumber: "10",
  longSleeve: false,
  captain: false,
  badgeSide: "left",
  kitName: "My Kit",
};

const RANDOM_COLORS = [
  "#FFD700", "#1B5E20", "#E53E3E", "#2B6CB0", "#744210",
  "#553C9A", "#B7791F", "#276749", "#9B2C2C", "#1A365D",
  "#702459", "#234E52", "#000000", "#FFFFFF", "#FF6B35",
];

function randomColor() {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

function JerseyPreview({ kit, view }: { kit: KitConfig; view: "front" | "back" }) {
  const BODY = `M112,50 C100,32 80,28 48,62 L5,108 L8,155 L62,140 L62,292 L218,292 L218,140 L272,155 L275,108 L232,62 C200,28 180,32 168,50 Q154,18 140,17 Q126,18 112,50 Z`;
  const BODY_ONLY = `M112,50 L168,50 L220,95 L220,292 L60,292 L60,95 Z`;
  const LEFT_SHORT = `M112,50 C100,32 80,28 48,62 L5,108 L8,155 L62,140 L62,95 Z`;
  const RIGHT_SHORT = `M168,50 C180,32 200,28 232,62 L275,108 L272,155 L218,140 L218,95 Z`;
  const LEFT_LONG = `M112,50 C100,32 80,28 48,62 L5,108 L5,292 L62,292 L62,95 Z`;
  const RIGHT_LONG = `M168,50 C180,32 200,28 232,62 L275,108 L275,292 L218,292 L218,95 Z`;

  const bodyd = BODY_ONLY;
  const leftSleeved = kit.longSleeve ? LEFT_LONG : LEFT_SHORT;
  const rightSleeved = kit.longSleeve ? RIGHT_LONG : RIGHT_SHORT;

  function getBodyFill() {
    if (kit.pattern === "stripes") return "url(#pat-stripes)";
    if (kit.pattern === "hoops") return "url(#pat-hoops)";
    if (kit.pattern === "gradient") return "url(#pat-gradient)";
    if (kit.pattern === "lightning") return "url(#pat-lightning)";
    if (kit.pattern === "geometric") return "url(#pat-geometric)";
    if (kit.pattern === "camouflage") return "url(#pat-camo)";
    if (kit.pattern === "classic") return "url(#pat-classic)";
    return kit.primary;
  }

  const badgeX = kit.badgeSide === "left" ? 90 : 175;

  return (
    <svg viewBox="0 0 280 310" className="w-full max-w-[260px] mx-auto" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}>
      <defs>
        <pattern id="pat-stripes" patternUnits="userSpaceOnUse" width="20" height="1">
          <rect width="10" height="1" fill={kit.primary} />
          <rect x="10" width="10" height="1" fill={kit.secondary} />
        </pattern>
        <pattern id="pat-hoops" patternUnits="userSpaceOnUse" width="1" height="20">
          <rect width="1" height="10" fill={kit.primary} />
          <rect y="10" width="1" height="10" fill={kit.secondary} />
        </pattern>
        <linearGradient id="pat-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={kit.primary} />
          <stop offset="100%" stopColor={kit.secondary} />
        </linearGradient>
        <pattern id="pat-lightning" patternUnits="userSpaceOnUse" width="30" height="60">
          <rect width="30" height="60" fill={kit.primary} />
          <polyline points="18,0 8,32 18,32 8,60" stroke={kit.secondary} strokeWidth="5" fill="none" opacity="0.9" />
        </pattern>
        <pattern id="pat-geometric" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="40" fill={kit.primary} />
          <polygon points="0,0 20,20 40,0" fill={kit.secondary} opacity="0.5" />
          <polygon points="0,40 20,20 40,40" fill={kit.secondary} opacity="0.5" />
        </pattern>
        <pattern id="pat-camo" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill={kit.primary} />
          <ellipse cx="15" cy="15" rx="12" ry="8" fill={kit.secondary} opacity="0.5" />
          <ellipse cx="45" cy="35" rx="10" ry="14" fill={kit.secondary} opacity="0.4" />
          <ellipse cx="10" cy="48" rx="8" ry="6" fill={kit.secondary} opacity="0.6" />
          <ellipse cx="52" cy="10" rx="6" ry="10" fill={kit.secondary} opacity="0.45" />
        </pattern>
        <pattern id="pat-classic" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill={kit.primary} />
          <rect x="0" width="4" height="60" fill={kit.secondary} opacity="0.3" />
          <rect x="56" width="4" height="60" fill={kit.secondary} opacity="0.3" />
          <rect y="0" width="60" height="4" fill={kit.secondary} opacity="0.15" />
        </pattern>
        <clipPath id="body-clip">
          <path d={bodyd} />
        </clipPath>
        <clipPath id="left-sleeve-clip">
          <path d={leftSleeved} />
        </clipPath>
        <clipPath id="right-sleeve-clip">
          <path d={rightSleeved} />
        </clipPath>
      </defs>

      {/* Sleeves */}
      <path d={leftSleeved} fill={kit.sleeve} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
      <path d={rightSleeved} fill={kit.sleeve} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />

      {/* Body fill with pattern */}
      <path d={bodyd} fill={getBodyFill()} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />

      {/* Outline stroke over everything */}
      <path d={BODY} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />

      {/* Collar */}
      {kit.collar === "v-neck" && (
        <path d="M112,50 Q140,88 168,50" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="3" />
      )}
      {kit.collar === "round" && (
        <path d="M112,50 C118,36 162,36 168,50" fill={kit.secondary} stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
      )}
      {kit.collar === "polo" && (
        <>
          <path d="M112,50 L125,78 L155,78 L168,50" fill={kit.secondary} stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
          <line x1="140" y1="50" x2="140" y2="72" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
        </>
      )}

      {/* Highlight sheen */}
      <path d={bodyd} fill="url(#sheen)" opacity="0.12" />
      <defs>
        <linearGradient id="sheen" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="white" />
          <stop offset="60%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Badge (front only) */}
      {view === "front" && (
        <g transform={`translate(${badgeX},105)`}>
          <circle r="12" fill="rgba(0,0,0,0.3)" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#FFD700" fontWeight="bold">GA</text>
        </g>
      )}

      {/* Captain armband */}
      {kit.captain && (
        <rect x={kit.longSleeve ? 15 : 20} y={kit.longSleeve ? 180 : 110} width="45" height="16" rx="3"
          fill="#FFD700" opacity="0.9" />
      )}
      {kit.captain && (
        <text x={kit.longSleeve ? 37 : 42} y={kit.longSleeve ? 192 : 122} textAnchor="middle"
          fontSize="8" fill="black" fontWeight="bold">C</text>
      )}

      {/* Back: name + number */}
      {view === "back" && (
        <>
          <text x="140" y="168" textAnchor="middle" fontSize="16" fill={kit.secondary}
            fontWeight="900" letterSpacing="2" style={{ fontFamily: "Arial Black, sans-serif" }}>
            {kit.playerName.toUpperCase().slice(0, 12)}
          </text>
          <text x="140" y="238" textAnchor="middle" fontSize="52" fill={kit.secondary}
            fontWeight="900" style={{ fontFamily: "Arial Black, sans-serif" }}>
            {kit.playerNumber}
          </text>
        </>
      )}
      {view === "front" && (
        <text x="140" y="245" textAnchor="middle" fontSize="32" fill={kit.secondary}
          fontWeight="900" style={{ fontFamily: "Arial Black, sans-serif" }}>
          {kit.playerNumber}
        </text>
      )}
    </svg>
  );
}

function ColorSwatch({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-white/50 text-xs w-20 flex-shrink-0">{label}</label>
      <label className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer flex-shrink-0 hover:border-white/50 transition-colors">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="w-full h-full" style={{ background: value }} />
      </label>
      <span className="text-white/40 text-xs font-mono">{value}</span>
    </div>
  );
}

export default function KitDesigner() {
  const [kit, setKit] = useState<KitConfig>({ ...DEFAULT_KIT, id: Date.now().toString() });
  const [view, setView] = useState<"front" | "back">("front");
  const [collection, setCollection] = useState<KitConfig[]>(() => {
    try { return JSON.parse(localStorage.getItem("kit-collection") || "[]"); } catch { return []; }
  });
  const [showCollection, setShowCollection] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = useCallback(<K extends keyof KitConfig>(key: K, val: KitConfig[K]) => {
    setKit(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  }, []);

  function randomize() {
    setKit({
      ...kit,
      primary: randomColor(),
      secondary: randomColor(),
      sleeve: randomColor(),
      pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
      collar: (["v-neck", "round", "polo"] as CollarStyle[])[Math.floor(Math.random() * 3)],
      longSleeve: Math.random() > 0.6,
      id: Date.now().toString(),
    });
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
    // Achievement
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["kit-designer"] = true;
    if (next.length >= 5) ach["kit-collector"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
  }

  function deleteKit(id: string) {
    const next = collection.filter(k => k.id !== id);
    setCollection(next);
    localStorage.setItem("kit-collection", JSON.stringify(next));
  }

  function downloadKit() {
    const svg = document.querySelector("#kit-preview-svg") as SVGSVGElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `golden-arrows-kit-${kit.playerNumber}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Jersey Preview</h3>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setView(v => v === "front" ? "back" : "front")}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-xs text-white/60 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> {view === "front" ? "Flip to Back" : "Flip to Front"}
            </motion.button>
          </div>
        </div>
        <div id="kit-preview-svg">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.3 }}
            >
              <JerseyPreview kit={kit} view={view} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="text-center text-white/30 text-xs mt-2">{view === "front" ? "Front View" : "Back View"}</p>
      </div>

      {/* Customization Controls */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-4">
        <h3 className="text-white font-bold text-sm">Customise Kit</h3>

        {/* Colors */}
        <div className="space-y-2.5">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Colours</p>
          <ColorSwatch value={kit.primary} onChange={v => update("primary", v)} label="Primary" />
          <ColorSwatch value={kit.secondary} onChange={v => update("secondary", v)} label="Secondary" />
          <ColorSwatch value={kit.sleeve} onChange={v => update("sleeve", v)} label="Sleeves" />
        </div>

        {/* Pattern */}
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Pattern</p>
          <div className="grid grid-cols-4 gap-1.5">
            {PATTERNS.map(p => (
              <motion.button
                key={p}
                onClick={() => update("pattern", p)}
                whileTap={{ scale: 0.95 }}
                className={`text-[10px] py-1.5 px-1 rounded-lg border font-medium capitalize transition-all ${
                  kit.pattern === p ? "border-primary bg-primary/15 text-primary" : "border-white/10 bg-white/3 text-white/50 hover:border-white/25"
                }`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Collar + Sleeve */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Collar</p>
            {(["v-neck", "round", "polo"] as CollarStyle[]).map(c => (
              <label key={c} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input type="radio" checked={kit.collar === c} onChange={() => update("collar", c)} className="accent-yellow-400" />
                <span className="text-white/60 text-xs capitalize">{c}</span>
              </label>
            ))}
          </div>
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Options</p>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input type="checkbox" checked={kit.longSleeve} onChange={e => update("longSleeve", e.target.checked)} className="accent-yellow-400" />
              <span className="text-white/60 text-xs">Long Sleeve</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={kit.captain} onChange={e => update("captain", e.target.checked)} className="accent-yellow-400" />
              <span className="text-white/60 text-xs">Captain Armband</span>
            </label>
          </div>
        </div>

        {/* Player details */}
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Player Details</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={kit.playerName}
              onChange={e => update("playerName", e.target.value)}
              placeholder="Player Name"
              maxLength={14}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20"
            />
            <input
              value={kit.playerNumber}
              onChange={e => update("playerNumber", e.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="No."
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20"
            />
          </div>
          <input
            value={kit.kitName}
            onChange={e => update("kitName", e.target.value)}
            placeholder="Kit Name (for collection)"
            className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          onClick={randomize}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-sm font-bold hover:bg-white/10 transition-colors"
        >
          <Shuffle className="h-4 w-4" /> Random
        </motion.button>
        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-sm font-bold hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </motion.button>
        <motion.button
          onClick={downloadKit}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-sm font-bold hover:bg-white/10 transition-colors"
        >
          <Download className="h-4 w-4" /> Download
        </motion.button>
        <motion.button
          onClick={saveKit}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,215,0,0.2)" }} whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            saved ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-primary text-black"
          }`}
        >
          <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Kit"}
        </motion.button>
      </div>

      {/* Collection */}
      {collection.length > 0 && (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
          <button onClick={() => setShowCollection(v => !v)} className="flex items-center justify-between w-full">
            <h3 className="text-white font-bold text-sm">My Kit Collection ({collection.length})</h3>
            <ChevronRight className={`h-4 w-4 text-white/40 transition-transform ${showCollection ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {showCollection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {collection.map(k => (
                    <div key={k.id} className="bg-white/3 border border-white/8 rounded-xl p-2 relative group">
                      <JerseyPreview kit={k} view="front" />
                      <p className="text-white/60 text-[10px] text-center mt-1">{k.kitName}</p>
                      <button
                        onClick={() => deleteKit(k.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 border border-red-500/30 rounded-lg p-1"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
