import { motion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description?: string;
}

export function PageHero({ eyebrow, title, highlight, description }: PageHeroProps) {
  return (
    <div
      className="border-b border-white/8 py-4 sm:py-5 relative overflow-hidden"
      style={{ background: "hsl(139 55% 18%)" }}
    >
      {/* subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
        backgroundSize: "8px 8px",
      }} />

      <div className="max-w-[1330px] mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-1.5 flex items-center justify-center gap-2">
            <span className="w-4 h-px bg-primary inline-block flex-shrink-0 opacity-80" />
            {eyebrow}
            <span className="w-4 h-px bg-primary inline-block flex-shrink-0 opacity-80" />
          </p>
          <h1
            className="font-display text-2xl sm:text-4xl uppercase font-black"
            style={{ letterSpacing: "0.06em" }}
          >
            {title} <span className="text-primary">{highlight}</span>
          </h1>
          {description && (
            <p className="text-white/50 text-xs mt-1.5 max-w-xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
