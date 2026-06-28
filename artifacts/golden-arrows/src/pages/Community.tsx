import { motion } from "framer-motion";
import { Users, Trophy, BookOpen, Heart } from "lucide-react";

const PROGRAMS = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Junior Arrows Academy",
    description: "Developing the next generation of football talent from KwaZulu-Natal. Open trials for boys and girls aged 10-18 held annually.",
    impact: "200+ youths enrolled annually",
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Education First Initiative",
    description: "We partner with 10 schools in the greater Durban area, providing academic support, mentorship, and sporting opportunities.",
    impact: "10 partner schools",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Community Football Clinics",
    description: "Free coaching clinics held monthly across KwaZulu-Natal townships, run by our coaching staff and first team players.",
    impact: "Monthly clinics, free entry",
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: "CSR: Arrows Cares",
    description: "Our corporate social responsibility arm tackles food security, education funding, and infrastructure improvement in Lamontville and surrounding areas.",
    impact: "Serving 5,000+ community members",
  },
];

export default function Community() {
  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Our <span className="text-primary">Community</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Lamontville Golden Arrows FC — the heartbeat of KwaZulu-Natal.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {PROGRAMS.map((prog, i) => (
            <motion.div
              key={prog.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-colors"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                {prog.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{prog.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{prog.description}</p>
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 px-4 py-2 rounded-full text-sm font-bold text-primary">
                {prog.impact}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-secondary/20 to-primary/10 border border-primary/20 rounded-2xl p-10 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Get Involved</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Want to partner with us on community initiatives, sponsor our academy, or volunteer? We would love to hear from you.
          </p>
          <a href="/contact" className="inline-block bg-primary text-black font-bold px-8 py-4 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
