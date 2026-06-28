import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Save, Shuffle, RotateCcw, ChevronRight, Trash2 } from "lucide-react";

type BootModel = "speed" | "power" | "control" | "classic" | "goalkeeper";
type Finish = "gloss" | "matte" | "metallic" | "carbon";
type Pattern = "plain" | "stripes" | "curves" | "speed";

interface BootConfig {
  id: string;
  model: BootModel;
  mainColor: string;
  secondaryColor: string;
  studColor: string;
  soleColor: string;
  lacesColor: string;
  finish: Finish;
  pattern: Pattern;
  initials: string;
  name: string;
}

const DEFAULT: BootConfig = {
  id: "", model: "speed",
  mainColor: "#FFD700", secondaryColor: "#1B5E20",
  studColor: "#C0C0C0", soleColor: "#1B5E20",
  lacesColor: "#FFFFFF", finish: "gloss", pattern: "plain",
  initials: "GA", name: "My Boot",
};

function BootPreview({ cfg }: { cfg: BootConfig }) {
  const getBodyFill = () => {
    if (cfg.finish === "metallic") return "url(#metallic-grad)";
    if (cfg.finish === "carbon") return "url(#carbon-pat)";
    return cfg.mainColor;
  };

  return (
    <svg viewBox="0 0 260 180" className="w-full max-w-xs mx-auto" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))" }}>
      <defs>
        <linearGradient id="metallic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cfg.mainColor} />
          <stop offset="40%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor={cfg.mainColor} />
        </linearGradient>
        <pattern id="carbon-pat" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill={cfg.mainColor} />
          <rect width="4" height="4" fill="rgba(0,0,0,0.3)" />
          <rect x="4" y="4" width="4" height="4" fill="rgba(0,0,0,0.3)" />
        </pattern>
        <linearGradient id="sheen-grad" x1="0%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity={cfg.finish === "matte" ? "0" : "0.25"} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id="boot-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Sole / outsole */}
      <path d="M30,145 Q50,160 130,162 Q200,162 230,148 L230,140 Q200,155 130,155 Q55,153 30,138 Z"
        fill={cfg.soleColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

      {/* Studs */}
      {[55,85,115,145,175,200].map((x, i) => (
        <ellipse key={i} cx={x} cy={158} rx={i < 2 ? 6 : 5} ry="5" fill={cfg.studColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      ))}

      {/* Boot upper body */}
      <path
        d="M30,140 Q30,80 50,60 Q70,40 100,38 Q155,35 180,55 Q210,75 225,115 L230,140 Q200,152 130,152 Q55,150 30,140 Z"
        fill={getBodyFill()}
        stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"
        filter="url(#boot-shadow)"
      />

      {/* Pattern overlay */}
      {cfg.pattern === "stripes" && (
        <>
          <line x1="120" y1="38" x2="140" y2="152" stroke={cfg.secondaryColor} strokeWidth="8" opacity="0.6" />
          <line x1="145" y1="36" x2="165" y2="152" stroke={cfg.secondaryColor} strokeWidth="8" opacity="0.6" />
          <line x1="170" y1="40" x2="190" y2="152" stroke={cfg.secondaryColor} strokeWidth="8" opacity="0.6" />
        </>
      )}
      {cfg.pattern === "curves" && (
        <>
          <path d="M90,40 Q140,80 180,130" fill="none" stroke={cfg.secondaryColor} strokeWidth="8" opacity="0.6" strokeLinecap="round" />
          <path d="M65,60 Q120,100 165,145" fill="none" stroke={cfg.secondaryColor} strokeWidth="5" opacity="0.4" strokeLinecap="round" />
        </>
      )}
      {cfg.pattern === "speed" && (
        <>
          <polyline points="100,42 125,80 108,80 135,130" fill="none" stroke={cfg.secondaryColor} strokeWidth="10" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="148,42 170,75 155,75 178,120" fill="none" stroke={cfg.secondaryColor} strokeWidth="7" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {/* Tongue */}
      <path d="M85,40 Q100,35 115,40 L118,75 Q100,80 82,75 Z"
        fill={cfg.secondaryColor} stroke="rgba(0,0,0,0.25)" strokeWidth="1" />

      {/* Laces */}
      {[48,56,64,72].map((y, i) => (
        <line key={i} x1={i % 2 === 0 ? 83 : 92} y1={y} x2={i % 2 === 0 ? 117 : 108} y2={y + 4}
          stroke={cfg.lacesColor} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      ))}

      {/* Sheen overlay */}
      <path
        d="M30,140 Q30,80 50,60 Q70,40 100,38 Q155,35 180,55 Q210,75 225,115 L230,140 Q200,152 130,152 Q55,150 30,140 Z"
        fill="url(#sheen-grad)"
      />

      {/* Initials */}
      {cfg.initials && (
        <text x="190" y="105" textAnchor="middle" fontSize="14" fontWeight="900"
          fill={cfg.secondaryColor} opacity="0.8" style={{ fontFamily: "Arial Black, sans-serif" }}>
          {cfg.initials.toUpperCase().slice(0,3)}
        </text>
      )}

      {/* Heel tab */}
      <rect x="200" y="80" width="22" height="45" rx="4" fill={cfg.secondaryColor} opacity="0.7" />
    </svg>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/40 text-xs w-20 flex-shrink-0">{label}</span>
      <label className="relative w-7 h-7 rounded-lg border-2 border-white/15 cursor-pointer overflow-hidden flex-shrink-0">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        <div className="w-full h-full" style={{ background: value }} />
      </label>
      <span className="text-white/25 text-xs font-mono">{value}</span>
    </div>
  );
}

export default function BootDesigner() {
  const [cfg, setCfg] = useState<BootConfig>({ ...DEFAULT, id: Date.now().toString() });
  const [collection, setCollection] = useState<BootConfig[]>(() => {
    try { return JSON.parse(localStorage.getItem("boot-collection") || "[]"); } catch { return []; }
  });
  const [showCol, setShowCol] = useState(false);
  const [saved, setSaved] = useState(false);

  function upd<K extends keyof BootConfig>(k: K, v: BootConfig[K]) {
    setCfg(p => ({ ...p, [k]: v }));
    setSaved(false);
  }

  function randomize() {
    const models: BootModel[] = ["speed","power","control","classic","goalkeeper"];
    const patterns: Pattern[] = ["plain","stripes","curves","speed"];
    const finishes: Finish[] = ["gloss","matte","metallic","carbon"];
    const colors = ["#FFD700","#1B5E20","#E53E3E","#2B6CB0","#000000","#FF6B35","#553C9A","#FFFFFF"];
    setCfg(p => ({
      ...p,
      model: models[Math.floor(Math.random() * models.length)],
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      finish: finishes[Math.floor(Math.random() * finishes.length)],
      mainColor: colors[Math.floor(Math.random() * colors.length)],
      secondaryColor: colors[Math.floor(Math.random() * colors.length)],
      studColor: colors[Math.floor(Math.random() * colors.length)],
    }));
    setSaved(false);
  }

  function saveBoot() {
    const toSave = { ...cfg, id: Date.now().toString() };
    const next = [...collection, toSave];
    setCollection(next);
    localStorage.setItem("boot-collection", JSON.stringify(next));
    const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
    ach["boot-designer"] = true;
    localStorage.setItem("achievements", JSON.stringify(ach));
    setSaved(true);
  }

  function deleteBoot(id: string) {
    const next = collection.filter(b => b.id !== id);
    setCollection(next);
    localStorage.setItem("boot-collection", JSON.stringify(next));
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
        <BootPreview cfg={cfg} />
        <p className="text-center text-white/30 text-xs mt-2">{cfg.model.toUpperCase()} · {cfg.finish.toUpperCase()}</p>
      </div>

      {/* Controls */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-4">
        {/* Model */}
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Boot Model</p>
          <div className="grid grid-cols-5 gap-1">
            {(["speed","power","control","classic","goalkeeper"] as BootModel[]).map(m => (
              <motion.button key={m} onClick={() => upd("model", m)} whileTap={{ scale: 0.95 }}
                className={`py-1.5 text-[10px] font-bold rounded-lg border capitalize transition-all ${
                  cfg.model === m ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/40 hover:border-white/25"
                }`}>{m}</motion.button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Colours</p>
          <ColorInput label="Main" value={cfg.mainColor} onChange={v => upd("mainColor", v)} />
          <ColorInput label="Secondary" value={cfg.secondaryColor} onChange={v => upd("secondaryColor", v)} />
          <ColorInput label="Studs" value={cfg.studColor} onChange={v => upd("studColor", v)} />
          <ColorInput label="Sole" value={cfg.soleColor} onChange={v => upd("soleColor", v)} />
          <ColorInput label="Laces" value={cfg.lacesColor} onChange={v => upd("lacesColor", v)} />
        </div>

        {/* Pattern + Finish */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Pattern</p>
            {(["plain","stripes","curves","speed"] as Pattern[]).map(p => (
              <label key={p} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input type="radio" checked={cfg.pattern === p} onChange={() => upd("pattern", p)} className="accent-yellow-400" />
                <span className="text-white/60 text-xs capitalize">{p}</span>
              </label>
            ))}
          </div>
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Finish</p>
            {(["gloss","matte","metallic","carbon"] as Finish[]).map(f => (
              <label key={f} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input type="radio" checked={cfg.finish === f} onChange={() => upd("finish", f)} className="accent-yellow-400" />
                <span className="text-white/60 text-xs capitalize">{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Initials */}
        <div className="grid grid-cols-2 gap-2">
          <input value={cfg.initials} onChange={e => upd("initials", e.target.value.slice(0,3).toUpperCase())}
            placeholder="Initials (3 max)"
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20" />
          <input value={cfg.name} onChange={e => upd("name", e.target.value)}
            placeholder="Boot name"
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary/50 placeholder-white/20" />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button onClick={randomize} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white/70 text-sm font-bold hover:bg-white/10 transition-colors">
          <Shuffle className="h-4 w-4" /> Random
        </motion.button>
        <motion.button onClick={saveBoot} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            saved ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-primary text-black"
          }`}>
          <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Boot"}
        </motion.button>
      </div>

      {/* Collection */}
      {collection.length > 0 && (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
          <button onClick={() => setShowCol(v => !v)} className="flex items-center justify-between w-full">
            <h3 className="text-white font-bold text-sm">My Boot Collection ({collection.length})</h3>
            <ChevronRight className={`h-4 w-4 text-white/40 transition-transform ${showCol ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {showCol && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="space-y-2 mt-3">
                  {collection.map(b => (
                    <div key={b.id} className="bg-white/3 border border-white/8 rounded-xl p-3 flex items-center gap-3 group">
                      <div className="w-12 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full" style={{ background: b.mainColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/70 text-xs font-bold">{b.name}</p>
                        <p className="text-white/30 text-[10px]">{b.model} · {b.finish}</p>
                      </div>
                      <button onClick={() => deleteBoot(b.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
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
