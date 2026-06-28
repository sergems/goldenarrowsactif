import { motion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description?: string;
}

export function PageHero({ eyebrow, title, highlight, description }: PageHeroProps) {
  return (
    <div className="bg-card border-b border-white/8 py-4 sm:py-5">
      <div className="max-w-[1330px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-1 flex items-center justify-center gap-1.5">
            <span className="w-3 h-px bg-primary inline-block flex-shrink-0" />
            {eyebrow}
            <span className="w-3 h-px bg-primary inline-block flex-shrink-0" />
          </p>
          <h1
            className="font-display text-2xl sm:text-4xl uppercase"
            style={{ letterSpacing: "0.06em" }}
          >
            {title} <span className="text-primary">{highlight}</span>
          </h1>
          {description && (
            <p className="text-white/40 text-xs mt-1.5 max-w-xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
