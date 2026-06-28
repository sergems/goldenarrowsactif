import { useGetResult } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Video } from "lucide-react";
import { TeamCrest } from "@/components/TeamCrest";

function getOutcome(homeTeam: string, homeScore: number, awayScore: number) {
  const isHome = homeTeam.toLowerCase().includes("arrows") || homeTeam.toLowerCase().includes("golden");
  const ours = isHome ? homeScore : awayScore;
  const theirs = isHome ? awayScore : homeScore;
  if (ours > theirs) return { label: "WIN", color: "text-green-400", bg: "bg-green-500/10 border-green-500/40" };
  if (ours < theirs) return { label: "LOSS", color: "text-red-400", bg: "bg-red-500/10 border-red-500/40" };
  return { label: "DRAW", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/40" };
}

export default function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: result, isLoading } = useGetResult(Number(id));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!result) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Match not found.</div>;

  const outcome = getOutcome(result.homeTeam, result.homeScore, result.awayScore);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-white/5">
        <div className="container mx-auto px-4 max-w-4xl pt-8 pb-10 sm:py-16">
          <Link href="/results" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back to Results
          </Link>

          {/* Competition + date */}
          <div className="text-center mb-6">
            <div className="text-primary font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">{result.competition}</div>
            <div className="text-muted-foreground text-xs sm:text-sm">
              {format(new Date(result.date), "EEEE, MMMM d, yyyy")}
              {result.venue && <span className="hidden sm:inline"> &bull; {result.venue}</span>}
            </div>
            {result.venue && <div className="text-muted-foreground text-xs mt-0.5 sm:hidden">{result.venue}</div>}
          </div>

          {/* Match scoreline — mobile optimized */}
          <div className="flex items-center justify-center gap-3 sm:gap-10">
            {/* Home team */}
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <TeamCrest name={result.homeTeam} size="xl" />
              <span className="font-display font-bold text-sm sm:text-2xl text-center leading-tight px-1">{result.homeTeam}</span>
            </div>

            {/* Score block */}
            <div className="flex-shrink-0 text-center">
              <div className="bg-background border border-white/10 rounded-xl px-4 sm:px-8 py-3 sm:py-5">
                <div className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-primary tabular-nums">
                  {result.homeScore}&thinsp;–&thinsp;{result.awayScore}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">Full Time</div>
              </div>
              {/* Outcome pill */}
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${outcome.color} ${outcome.bg}`}>
                {outcome.label}
              </div>
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <TeamCrest name={result.awayTeam} size="xl" />
              <span className="font-display font-bold text-sm sm:text-2xl text-center leading-tight px-1">{result.awayTeam}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {result.scorers && result.scorers.length > 0 && (
              <div className="bg-card border border-white/5 rounded-xl p-5 sm:p-6">
                <h2 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight mb-4">
                  ⚽ Goalscorers
                </h2>
                <ul className="space-y-3">
                  {result.scorers.map((scorer, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{scorer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.matchReport && (
              <div className="bg-card border border-white/5 rounded-xl p-5 sm:p-6">
                <h2 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight mb-4">Match Report</h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{result.matchReport}</p>
              </div>
            )}

            {result.highlightUrl && (
              <div className="bg-card border border-white/5 rounded-xl p-5 sm:p-6">
                <h2 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Match Highlights
                </h2>
                <a
                  href={result.highlightUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-3 rounded uppercase tracking-wider hover:bg-primary/90 transition-colors text-sm"
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            )}

            {!result.matchReport && !result.highlightUrl && result.scorers?.length === 0 && (
              <div className="bg-card border border-white/5 rounded-xl p-6 text-center text-muted-foreground text-sm">
                Match report coming soon.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-white/5 rounded-xl p-5 sm:p-6">
              <h3 className="font-display font-bold text-base sm:text-lg uppercase tracking-tight mb-4 text-primary">Match Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Competition</dt>
                  <dd className="font-bold mt-1">{result.competition}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Date</dt>
                  <dd className="font-bold mt-1">{format(new Date(result.date), "PPP")}</dd>
                </div>
                {result.venue && (
                  <div>
                    <dt className="text-muted-foreground text-xs uppercase tracking-wider">Venue</dt>
                    <dd className="font-bold mt-1">{result.venue}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Result</dt>
                  <dd className={`font-bold mt-1 ${outcome.color}`}>{outcome.label}</dd>
                </div>
              </dl>
            </div>

            <Link
              href="/results"
              className="block text-center bg-card border border-white/5 hover:border-primary/30 rounded-xl p-4 text-sm font-bold uppercase tracking-wider text-primary transition-colors"
            >
              ← All Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
