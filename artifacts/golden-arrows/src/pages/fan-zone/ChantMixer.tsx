import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface Track {
  id: string;
  label: string;
  emoji: string;
  color: string;
  frequency: number;
  type: "sine" | "square" | "sawtooth" | "triangle";
  description: string;
}

const TRACKS: Track[] = [
  { id: "drums", label: "War Drums", emoji: "🥁", color: "#9B2C2C", frequency: 80, type: "square", description: "Deep tribal rhythm" },
  { id: "chant1", label: "Arrows! Arrows!", emoji: "📣", color: "#1B5E20", frequency: 220, type: "sine", description: "Classic supporter chant" },
  { id: "whistle", label: "Referee Whistle", emoji: "⚡", color: "#2B6CB0", frequency: 1200, type: "sine", description: "Sharp match whistle" },
  { id: "crowd", label: "Crowd Roar", emoji: "🏟️", color: "#553C9A", frequency: 150, type: "sawtooth", description: "Stadium roar" },
  { id: "clap", label: "Clapping", emoji: "👏", color: "#744210", description: "Crowd applause", frequency: 300, type: "square" },
  { id: "horn", label: "Vuvuzela", emoji: "📯", color: "#FFD700", frequency: 465, type: "sawtooth", description: "The famous SA horn" },
  { id: "bass", label: "Bass Drum", emoji: "💥", color: "#276749", frequency: 55, type: "square", description: "Heavy bass beat" },
  { id: "cheer", label: "Goal Cheer", emoji: "🎉", color: "#B7791F", frequency: 440, type: "triangle", description: "Celebrate the goal!" },
];

type PlayingState = Record<string, boolean>;
type VolumeState = Record<string, number>;

export default function ChantMixer() {
  const [playing, setPlaying] = useState<PlayingState>({});
  const [volumes, setVolumes] = useState<VolumeState>(Object.fromEntries(TRACKS.map(t => [t.id, 0.6])));
  const [muted, setMuted] = useState(false);
  const [masterVol, setMasterVol] = useState(0.7);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { osc: OscillatorNode; gain: GainNode }>>({});

  function getCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function toggleTrack(track: Track) {
    const isPlaying = playing[track.id];
    if (isPlaying) {
      const node = nodesRef.current[track.id];
      if (node) {
        node.gain.gain.setTargetAtTime(0, getCtx().currentTime, 0.1);
        setTimeout(() => { try { node.osc.stop(); } catch {} delete nodesRef.current[track.id]; }, 300);
      }
      setPlaying(p => ({ ...p, [track.id]: false }));
    } else {
      const ctx = getCtx();
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const master = ctx.createGain();

      osc.type = track.type;

      // Create interesting rhythmic patterns with LFO for drums
      if (track.id === "drums" || track.id === "bass" || track.id === "clap") {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = track.id === "clap" ? 2.5 : 1.5;
        lfoGain.gain.value = 0.8;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        osc.frequency.value = track.frequency;
      } else if (track.id === "vuvuzela" || track.id === "horn") {
        osc.frequency.value = track.frequency;
        // Slight detune for vuvuzela effect
        const osc2 = ctx.createOscillator();
        osc2.type = "sawtooth";
        osc2.frequency.value = track.frequency * 1.005;
        osc2.connect(gain);
        osc2.start();
      } else {
        osc.frequency.value = track.frequency;
      }

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setTargetAtTime(volumes[track.id] * masterVol * (muted ? 0 : 1), ctx.currentTime, 0.15);
      master.gain.value = 1;

      osc.connect(gain);
      gain.connect(master);
      master.connect(ctx.destination);
      osc.start();

      nodesRef.current[track.id] = { osc, gain };
      setPlaying(p => ({ ...p, [track.id]: true }));

      const ach = JSON.parse(localStorage.getItem("achievements") || "{}");
      ach["chant-mixer"] = true;
      localStorage.setItem("achievements", JSON.stringify(ach));
    }
  }

  function stopAll() {
    Object.entries(nodesRef.current).forEach(([, node]) => {
      try { node.gain.gain.setTargetAtTime(0, getCtx().currentTime, 0.05); setTimeout(() => { try { node.osc.stop(); } catch {} }, 200); } catch {}
    });
    nodesRef.current = {};
    setPlaying({});
  }

  function toggleMute() {
    const newMuted = !muted;
    setMuted(newMuted);
    Object.entries(nodesRef.current).forEach(([id, node]) => {
      node.gain.gain.setTargetAtTime(newMuted ? 0 : volumes[id] * masterVol, getCtx().currentTime, 0.1);
    });
  }

  const anyPlaying = Object.values(playing).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-display text-xl text-white uppercase mb-1">Stadium Chant Mixer</h3>
        <p className="text-white/40 text-xs">Mix sounds to create your own match atmosphere!</p>
      </div>

      {/* Master controls */}
      <div className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
        <motion.button onClick={toggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="text-white/60 hover:text-white transition-colors">
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </motion.button>
        <input type="range" min="0" max="1" step="0.05" value={masterVol}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setMasterVol(v);
            Object.entries(nodesRef.current).forEach(([id, node]) => {
              node.gain.gain.setTargetAtTime(volumes[id] * v * (muted ? 0 : 1), getCtx().currentTime, 0.05);
            });
          }}
          className="flex-1 accent-yellow-400" />
        <span className="text-white/40 text-xs w-8 text-right">{Math.round(masterVol * 100)}%</span>
        {anyPlaying && (
          <motion.button onClick={stopAll} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="text-xs text-red-400 border border-red-500/30 rounded-lg px-3 py-1 hover:bg-red-500/10 transition-colors">
            Stop All
          </motion.button>
        )}
      </div>

      {/* Track grid */}
      <div className="grid grid-cols-2 gap-2">
        {TRACKS.map(track => {
          const isPlaying = playing[track.id];
          return (
            <motion.button
              key={track.id}
              onClick={() => toggleTrack(track)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                isPlaying
                  ? "border-2 shadow-lg"
                  : "border border-white/10 bg-white/3 hover:bg-white/6"
              }`}
              style={isPlaying ? {
                borderColor: track.color,
                backgroundColor: `${track.color}25`,
                boxShadow: `0 0 20px ${track.color}40`,
              } : {}}
            >
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ background: track.color }}
                />
              )}

              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <motion.span
                    className="text-2xl"
                    animate={isPlaying ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.6, repeat: isPlaying ? Infinity : 0 }}
                  >
                    {track.emoji}
                  </motion.span>
                  {isPlaying && (
                    <div className="flex gap-0.5 items-end h-4">
                      {[1,2,3,4].map(i => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-sm"
                          style={{ background: track.color }}
                          animate={{ height: ["4px", `${8 + Math.random() * 8}px`, "4px"] }}
                          transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-bold text-sm text-white">{track.label}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{track.description}</p>
              </div>

              {/* Volume slider */}
              <div className="mt-3" onClick={e => e.stopPropagation()}>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={volumes[track.id]}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setVolumes(p => ({ ...p, [track.id]: v }));
                    const node = nodesRef.current[track.id];
                    if (node) node.gain.gain.setTargetAtTime(v * masterVol * (muted ? 0 : 1), getCtx().currentTime, 0.05);
                  }}
                  className="w-full h-1 accent-yellow-400"
                  style={{ accentColor: track.color }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-white/20 text-xs">
        {anyPlaying ? `${Object.values(playing).filter(Boolean).length} track${Object.values(playing).filter(Boolean).length > 1 ? "s" : ""} playing` : "Tap a button to start a sound"}
      </p>
    </div>
  );
}
