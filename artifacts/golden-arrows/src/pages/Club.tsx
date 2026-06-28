import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Trophy, Target, Eye, Building } from "lucide-react";

const TIMELINE = [
  { year: "1943", event: "Lamontville Golden Arrows FC is founded in Lamontville, Durban." },
  { year: "1980s", event: "The club rises through South African football, establishing itself as a KwaZulu-Natal powerhouse." },
  { year: "1997", event: "Golden Arrows earns promotion to the top flight of South African football." },
  { year: "2000s", event: "Consistent PSL presence, building a reputation for developing local talent." },
  { year: "2013", event: "Club legends Knox Mutizwa and other great players bring continental recognition." },
  { year: "Today", event: "Abafana Bes'thende continue to represent Durban and KZN with pride in the DStv Premiership." },
];

export default function Club() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Established 1943"
        title="About The"
        highlight="Club"
        description="Passion, community, and the love of the beautiful game in KwaZulu-Natal."
      />

      <PageWrapper page="club">
        <div className="space-y-16">
        {/* Mission/Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Target className="h-6 w-6" />, title: "Mission", text: "To develop and nurture local football talent while competing at the highest level of South African football, representing our community with pride and professionalism." },
            { icon: <Eye className="h-6 w-6" />, title: "Vision", text: "To be the premier football club in KwaZulu-Natal — celebrated for excellence on the pitch, integrity off it, and our deep roots in the community we serve." },
            { icon: <Trophy className="h-6 w-6" />, title: "Achievements", text: "PSL top-flight regulars. Multiple cup campaigns. Home-grown talent showcased on national and continental stages. The pride of Lamontville since 1943." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-primary">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Club History */}
        <div>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-10">Club <span className="text-primary">History</span></h2>
          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 pb-8 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-display font-bold text-xs flex-shrink-0">
                    {item.year.slice(-2)}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                </div>
                <div className="pb-8 last:pb-0">
                  <div className="font-display font-bold text-primary text-lg mb-1">{item.year}</div>
                  <p className="text-muted-foreground">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stadium */}
        <div className="bg-card border border-white/5 rounded-xl p-8 flex flex-col md:flex-row gap-8">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl mb-2">Princess Magogo <span className="text-primary">Stadium</span></h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Golden Arrows play their home matches at Princess Magogo Stadium in KwaMashu, Durban. Named after the mother of Mangosuthu Buthelezi and grandmother of the Zulu King, the stadium is deeply embedded in KwaZulu-Natal culture. Capacity: 12,600 supporters.
            </p>
            <div className="text-sm text-muted-foreground">KwaMashu, Durban, KwaZulu-Natal, South Africa</div>
          </div>
        </div>
        </div>
      </PageWrapper>
    </div>
  );
}
