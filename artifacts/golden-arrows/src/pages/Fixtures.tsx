import { useListFixtures } from "@workspace/api-client-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { Link } from "wouter";
import { Calendar, MapPin, Ticket, ChevronDown, Clock, Share2, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "@/components/TeamCrest";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";

function FixtureCard({ fixture, index }: { fixture: any; index: number }) {
  const [open, setOpen] = useState(false);

  const matchDate = new Date(fixture.date);
  const isUpcoming = !isPast(matchDate);
  const countdown = isUpcoming
    ? formatDistanceToNow(matchDate, { addSuffix: true })
    : null;

  function handleShare() {
    const text = `${fixture.homeTeam} vs ${fixture.awayTeam} — ${format(matchDate, "EEE d MMM yyyy")}${fixture.time ? " @ " + fixture.time : ""}`;
    if (navigator.share) {
      navigator.share({ title: "Golden Arrows Fixture", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  function handleAddCalendar() {
    const start = fixture.time
      ? new Date(`${fixture.date}T${fixture.time}`)
      : matchDate;
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${fixture.homeTeam} vs ${fixture.awayTeam}`)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(fixture.competition)}&location=${encodeURIComponent(fixture.venue ?? "")}`;
    window.open(url, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`bg-card border rounded-xl overflow-hidden transition-colors duration-200 ${open ? "border-primary/40" : "border-white/5 hover:border-primary/20"}`}
    >
      {/* ── Clickable main row ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left focus:outline-none"
      >
        <div className="flex items-stretch">
          {/* Competition + date pill */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-4 py-3 bg-black/20 border-r border-white/5 min-w-[90px] flex-shrink-0">
            <span className="text-primary font-bold text-[10px] uppercase tracking-widest text-center leading-tight">{fixture.competition}</span>
            <span className="text-muted-foreground text-[10px] mt-1 text-center">{format(matchDate, "d MMM")}</span>
            {fixture.time && <span className="text-primary/70 text-[10px] font-bold">{fixture.time}</span>}
          </div>

          {/* Teams row */}
          <div className="flex-1 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3">
            {/* Home */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="font-display font-bold text-xs sm:text-sm text-right truncate">{fixture.homeTeam}</span>
              <TeamCrest name={fixture.homeTeam} size="sm" />
            </div>

            {/* VS badge */}
            <div className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1 bg-background/60 border border-white/10 rounded-lg">
              <span className="font-display font-bold text-sm sm:text-base text-muted-foreground leading-none">VS</span>
              {fixture.time && (
                <span className="text-[9px] text-primary/60 font-bold uppercase">{fixture.time}</span>
              )}
            </div>

            {/* Away */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TeamCrest name={fixture.awayTeam} size="sm" />
              <span className="font-display font-bold text-xs sm:text-sm truncate">{fixture.awayTeam}</span>
            </div>
          </div>

          {/* Right meta strip */}
          <div className="hidden md:flex flex-col items-end justify-center gap-0.5 px-4 py-3 bg-black/10 border-l border-white/5 flex-shrink-0 min-w-[130px]">
            {fixture.venue && (
              <span className="text-muted-foreground text-[10px] text-right truncate max-w-[120px] leading-tight">{fixture.venue}</span>
            )}
            {countdown && (
              <span className="text-primary/60 text-[10px] font-bold uppercase tracking-wide">{countdown}</span>
            )}
          </div>

          {/* Expand chevron */}
          <div className="flex items-center pr-3 pl-1 flex-shrink-0">
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
            </motion.div>
          </div>
        </div>

        {/* Mobile: competition strip */}
        <div className="sm:hidden flex items-center justify-between px-3 py-1.5 bg-black/20 border-t border-white/5">
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px] uppercase tracking-wider font-bold py-0 h-5">
            {fixture.competition}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(matchDate, "d MMM yyyy")}
            {fixture.time && <span>· {fixture.time}</span>}
          </div>
        </div>
      </button>

      {/* ── Expandable detail panel ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                {/* Venue */}
                {fixture.venue && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <span>{fixture.venue}</span>
                  </div>
                )}
                {/* Date + time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  <span>
                    {format(matchDate, "EEEE, MMMM d, yyyy")}
                    {fixture.time && ` · Kickoff ${fixture.time}`}
                  </span>
                </div>
                {/* Countdown */}
                {countdown && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 w-fit">
                    <Clock className="h-3 w-3" /> {countdown}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary rounded-lg px-3 py-2 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddCalendar(); }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-primary rounded-lg px-3 py-2 transition-colors"
                >
                  <CalendarPlus className="h-3.5 w-3.5" /> Add to Calendar
                </button>
                {fixture.ticketUrl && (
                  <a
                    href={fixture.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    <Ticket className="h-3.5 w-3.5" /> Buy Tickets
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Fixtures() {
  const { data: fixtures, isLoading } = useListFixtures();

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="DStv Premiership"
        title="Upcoming"
        highlight="Fixtures"
        description="All upcoming DStv Premiership and cup matches for Abafana Bes'thende."
      />

      <PageWrapper page="fixtures">
        {isLoading && (
          <div className="text-center text-muted-foreground py-20">Loading fixtures...</div>
        )}
        {!isLoading && (!fixtures || fixtures.length === 0) && (
          <div className="text-center text-muted-foreground py-20">No upcoming fixtures at this time.</div>
        )}

        <div className="space-y-2">
          {fixtures?.map((fixture, i) => (
            <FixtureCard key={fixture.id} fixture={fixture} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/results" className="text-primary hover:underline font-bold uppercase tracking-wider text-sm">
            View Past Results &rarr;
          </Link>
        </div>
      </PageWrapper>
    </div>
  );
}
