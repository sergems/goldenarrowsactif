import { useListFixtures } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/TeamCrest";
import { AdColumn } from "@/components/AdBanner";

export default function Fixtures() {
  const { data: fixtures, isLoading } = useListFixtures();

  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Upcoming <span className="text-primary">Fixtures</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            All upcoming DStv Premiership and cup matches for Abafana Bes'thende.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex gap-6 items-start">
          <div className="hidden xl:block w-40 flex-shrink-0">
            <AdColumn page="fixtures" side="left" />
          </div>

          <div className="flex-1 min-w-0">
            {isLoading && (
              <div className="text-center text-muted-foreground py-20">Loading fixtures...</div>
            )}
            {!isLoading && (!fixtures || fixtures.length === 0) && (
              <div className="text-center text-muted-foreground py-20">No upcoming fixtures at this time.</div>
            )}

            <div className="space-y-4">
              {fixtures?.map((fixture, i) => (
                <motion.div
                  key={fixture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="bg-black/20 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 flex-wrap">
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs uppercase tracking-wider font-bold">
                      {fixture.competition}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="hidden sm:inline">{format(new Date(fixture.date), "EEEE, MMMM d, yyyy")}</span>
                      <span className="sm:hidden">{format(new Date(fixture.date), "MMM d, yyyy")}</span>
                      {fixture.time && <span>&bull; {fixture.time}</span>}
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex items-center justify-between gap-3 sm:gap-6">
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <TeamCrest name={fixture.homeTeam} size="lg" />
                        <span className="font-display font-bold text-sm sm:text-xl text-center leading-tight">{fixture.homeTeam}</span>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <div className="bg-background border border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg">
                          <div className="font-display font-bold text-lg sm:text-2xl text-muted-foreground">VS</div>
                          {fixture.time && (
                            <div className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1">
                              KO {fixture.time}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <TeamCrest name={fixture.awayTeam} size="lg" />
                        <span className="font-display font-bold text-sm sm:text-xl text-center leading-tight">{fixture.awayTeam}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-3 bg-black/10 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      {fixture.venue}
                    </div>
                    {fixture.ticketUrl && (
                      <a
                        href={fixture.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary text-black text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors"
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        Buy Tickets
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/results" className="text-primary hover:underline font-bold uppercase tracking-wider text-sm">
                View Past Results &rarr;
              </Link>
            </div>
          </div>

          <div className="hidden xl:block w-40 flex-shrink-0">
            <AdColumn page="fixtures" side="right" />
          </div>
        </div>
      </div>
    </div>
  );
}

