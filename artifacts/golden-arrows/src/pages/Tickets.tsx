import { useListFixtures } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Ticket, MapPin, Calendar } from "lucide-react";

const PRICING = [
  { zone: "North Stand", price: "R80", description: "General admission, standing" },
  { zone: "South Stand", price: "R80", description: "General admission, standing" },
  { zone: "East Stand", price: "R120", description: "Seated, covered" },
  { zone: "VIP West", price: "R250", description: "Premium seated, hospitality" },
];

export default function Tickets() {
  const { data: fixtures } = useListFixtures({ limit: 5 });

  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Match <span className="text-primary">Tickets</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Get your tickets for all upcoming Golden Arrows FC home matches at Princess Magogo Stadium, Durban.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Stadium Info */}
        <div className="bg-card border border-white/5 rounded-xl p-8 mb-12 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-4 text-primary">Princess Magogo Stadium</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Located in KwaMashu, Durban, KwaZulu-Natal. Home of Abafana Bes'thende since the club's formation. The stadium holds 12,600 passionate supporters and is a fortress for Golden Arrows.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              KwaMashu, Durban, KwaZulu-Natal, 4051
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center flex-shrink-0">
            <div className="font-display font-black text-4xl text-primary">12,600</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Capacity</div>
          </div>
        </div>

        {/* Pricing */}
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Ticket <span className="text-primary">Pricing</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {PRICING.map((zone, i) => (
            <motion.div
              key={zone.zone}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="font-display font-bold text-lg mb-1">{zone.zone}</div>
              <div className="font-display font-black text-3xl text-primary mb-2">{zone.price}</div>
              <p className="text-sm text-muted-foreground">{zone.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Home Fixtures */}
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Buy <span className="text-primary">Now</span></h2>
        <div className="space-y-4">
          {fixtures?.filter(f => f.homeTeam.toLowerCase().includes("arrows") || f.homeTeam.toLowerCase().includes("golden")).map((fixture) => (
            <div key={fixture.id} className="bg-card border border-white/5 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">{fixture.competition}</div>
                <div className="font-display font-bold text-lg">{fixture.homeTeam} <span className="text-muted-foreground">vs</span> {fixture.awayTeam}</div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(fixture.date), "MMM d, yyyy")}</span>
                  {fixture.time && <span>KO {fixture.time}</span>}
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{fixture.venue}</span>
                </div>
              </div>
              <a
                href={fixture.ticketUrl || "#"}
                className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                <Ticket className="h-4 w-4" />
                Buy Tickets
              </a>
            </div>
          ))}
          {(!fixtures || fixtures.filter(f => f.homeTeam.toLowerCase().includes("arrows") || f.homeTeam.toLowerCase().includes("golden")).length === 0) && (
            <p className="text-muted-foreground text-center py-10">Check back soon for upcoming home fixtures.</p>
          )}
        </div>
      </div>
    </div>
  );
}
