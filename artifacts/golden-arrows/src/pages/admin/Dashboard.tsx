import { useState } from "react";
import {
  useListNews, useListPlayers, useListGallery, useGetStatsSummary,
  useGetLeagueTable, useListEnquiries, useGetNextFixture,
  useCreateResult, getListResultsQueryKey,
  type Fixture,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Newspaper, Users, Image, Trophy, TrendingUp, MessageSquare, Swords, CheckCircle, Loader2, X } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Quick Result Widget ───────────────────────────────────────────────────────

function ScoreBadge({ home, away }: { home: number; away: number }) {
  const diff = home - away;
  const label = diff > 0 ? "WIN" : diff < 0 ? "LOSS" : "DRAW";
  const colors =
    diff > 0 ? "bg-green-500/20 text-green-400 border-green-500/30"
    : diff < 0 ? "bg-red-500/20 text-red-400 border-red-500/30"
    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return (
    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${colors}`}>
      {label}
    </span>
  );
}

function QuickResultWidget({ fixture }: { fixture: Fixture | undefined }) {
  const qc = useQueryClient();
  const createResult = useCreateResult();
  const today = format(new Date(), "yyyy-MM-dd");

  const [form, setForm] = useState({
    date: fixture?.date ?? today,
    homeTeam: fixture?.homeTeam ?? "Lamontville Golden Arrows",
    awayTeam: fixture?.awayTeam ?? "",
    homeScore: 0,
    awayScore: 0,
    competition: fixture?.competition ?? "DStv Premiership",
    venue: fixture?.venue ?? "",
    scorers: "",
    matchReport: "",
  });
  const [saved, setSaved] = useState<{ homeTeam: string; awayTeam: string; homeScore: number; awayScore: number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      scorers: form.scorers ? form.scorers.split(",").map(s => s.trim()).filter(Boolean) : [],
    };
    await createResult.mutateAsync({ data: payload });
    qc.invalidateQueries({ queryKey: getListResultsQueryKey() });
    setSaved({ homeTeam: form.homeTeam, awayTeam: form.awayTeam, homeScore: form.homeScore, awayScore: form.awayScore });
  }

  if (saved) {
    return (
      <div className="bg-card border border-primary/20 rounded-xl p-6 text-center">
        <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
        <div className="font-display font-bold text-xl uppercase mb-1" style={{ letterSpacing: "0.06em" }}>
          Result Saved!
        </div>
        <div className="flex items-center justify-center gap-4 my-4">
          <span className="font-bold text-sm text-white/80 text-right flex-1 truncate">{saved.homeTeam}</span>
          <div className="font-display font-black text-4xl text-primary px-4" style={{ letterSpacing: "0.1em" }}>
            {saved.homeScore}–{saved.awayScore}
          </div>
          <span className="font-bold text-sm text-white/80 text-left flex-1 truncate">{saved.awayTeam}</span>
        </div>
        <ScoreBadge home={saved.homeScore} away={saved.awayScore} />
        <div className="flex justify-center gap-3 mt-5">
          <Button variant="outline" size="sm" onClick={() => {
            setSaved(null);
            setForm({ date: today, homeTeam: "Lamontville Golden Arrows", awayTeam: "", homeScore: 0, awayScore: 0, competition: "DStv Premiership", venue: "", scorers: "", matchReport: "" });
          }}>
            Enter Another
          </Button>
          <Link href="/results">
            <Button size="sm" variant="outline">View Results →</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Swords className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-display font-bold uppercase tracking-tight text-base">Quick Result Entry</div>
            {fixture ? (
              <div className="text-xs text-muted-foreground mt-0.5">
                {fixture.homeTeam} vs {fixture.awayTeam} · {format(new Date(fixture.date), "MMM d")}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-0.5">Enter today's match score</div>
            )}
          </div>
        </div>
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
          {expanded ? "Collapse ▲" : "Open ▼"}
        </span>
      </div>

      {expanded && (
        <form onSubmit={submit} className="border-t border-white/5 p-6 space-y-4">
          {/* Score row — the hero of the form */}
          <div className="bg-background border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-4">
              {/* Home team */}
              <div className="flex-1 min-w-0">
                <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Home</label>
                <Input
                  name="homeTeam"
                  value={form.homeTeam}
                  onChange={handle}
                  required
                  className="bg-card border-white/10 font-bold text-center text-sm"
                />
              </div>
              {/* Scores */}
              <div className="flex items-end gap-2 flex-shrink-0">
                <div className="text-center">
                  <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Goals</label>
                  <Input
                    name="homeScore"
                    type="number"
                    min={0}
                    max={99}
                    value={form.homeScore}
                    onChange={handle}
                    className="bg-primary/10 border-primary/30 text-primary font-display font-black text-3xl text-center w-16 h-14 p-0"
                  />
                </div>
                <div className="font-display font-black text-2xl text-muted-foreground mb-3 px-1">–</div>
                <div className="text-center">
                  <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Goals</label>
                  <Input
                    name="awayScore"
                    type="number"
                    min={0}
                    max={99}
                    value={form.awayScore}
                    onChange={handle}
                    className="bg-white/5 border-white/10 font-display font-black text-3xl text-center w-16 h-14 p-0"
                  />
                </div>
              </div>
              {/* Away team */}
              <div className="flex-1 min-w-0">
                <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Away</label>
                <Input
                  name="awayTeam"
                  value={form.awayTeam}
                  onChange={handle}
                  required
                  placeholder="Opponent"
                  className="bg-card border-white/10 font-bold text-center text-sm"
                />
              </div>
            </div>

            {/* Live outcome badge */}
            {form.awayTeam && (
              <div className="flex justify-center mt-4">
                <ScoreBadge home={form.homeScore} away={form.awayScore} />
              </div>
            )}
          </div>

          {/* Secondary details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Date</label>
              <Input type="date" name="date" value={form.date} onChange={handle} required className="bg-card border-white/10" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">Competition</label>
              <Input name="competition" value={form.competition} onChange={handle} className="bg-card border-white/10" />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">
              Scorers <span className="font-normal normal-case">(comma-separated, optional)</span>
            </label>
            <Input
              name="scorers"
              value={form.scorers}
              onChange={handle}
              placeholder="e.g. Mthethwa 24', Dube 67'"
              className="bg-card border-white/10"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-bold uppercase tracking-wider">
              Match Report <span className="font-normal normal-case">(optional)</span>
            </label>
            <textarea
              name="matchReport"
              value={form.matchReport}
              onChange={handle}
              rows={3}
              placeholder="Brief match summary..."
              className="w-full rounded-md border border-white/10 bg-card px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => setExpanded(false)}>
              <X className="h-3.5 w-3.5 mr-1.5" /> Cancel
            </Button>
            <Button type="submit" disabled={createResult.isPending} size="sm">
              {createResult.isPending ? (
                <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</span>
              ) : (
                <span className="flex items-center gap-2"><Swords className="h-3.5 w-3.5" /> Save Result</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const qc = useQueryClient();
  const { data: news } = useListNews({ limit: 5 });
  const { data: players } = useListPlayers();
  const { data: gallery } = useListGallery({ limit: 100 });
  const { data: stats } = useGetStatsSummary();
  const { data: table } = useGetLeagueTable();
  const { data: enquiries } = useListEnquiries({ limit: 50 });
  const { data: unreadEnquiries } = useListEnquiries({ status: "unread" });
  const { data: nextFixture } = useGetNextFixture();
  const gaRow = table?.entries?.find(r => r.isGoldenArrows);
  const unreadCount = unreadEnquiries?.length ?? 0;

  const CARDS = [
    { label: "News Articles", value: news?.length ?? 0, icon: Newspaper, href: "/admin/news", color: "text-blue-400 bg-blue-400/10" },
    { label: "Players", value: players?.length ?? 0, icon: Users, href: "/admin/squad", color: "text-green-400 bg-green-400/10" },
    { label: "Gallery Items", value: gallery?.length ?? 0, icon: Image, href: "/admin/gallery", color: "text-purple-400 bg-purple-400/10" },
    { label: "League Position", value: gaRow ? `#${gaRow.position}` : "–", icon: Trophy, href: "/league-table", color: "text-primary bg-primary/10" },
    {
      label: "Enquiries",
      value: unreadCount > 0 ? `${unreadCount} new` : (enquiries?.length ?? 0),
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: unreadCount > 0 ? "text-primary bg-primary/20" : "text-white/60 bg-white/5",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of Lamontville Golden Arrows FC website.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {CARDS.map(card => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-card border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="font-display font-black text-3xl mb-1">{card.value}</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick result entry */}
      <div className="mb-6">
        <QuickResultWidget fixture={nextFixture} />
      </div>

      {/* Season Stats */}
      {stats && (
        <div className="bg-card border border-white/5 rounded-xl p-6 mb-6">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Season Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Played", value: stats.played },
              { label: "Won", value: stats.won },
              { label: "Goals Scored", value: stats.goalsScored },
              { label: "Points", value: stats.points },
            ].map(s => (
              <div key={s.label} className="text-center bg-background rounded-lg p-4 border border-white/5">
                <div className="font-display font-black text-2xl text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-card border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight">Recent News</h2>
            <Link href="/admin/news" className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">Manage →</Link>
          </div>
          <div className="space-y-3">
            {news?.map(article => (
              <div key={article.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{article.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(article.publishedAt), "MMM d, yyyy")} · {article.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-card border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight flex items-center gap-2">
              Recent Enquiries
              {unreadCount > 0 && (
                <span className="text-xs bg-primary text-black font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </h2>
            <Link href="/admin/enquiries" className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">View All →</Link>
          </div>
          <div className="space-y-3">
            {enquiries?.slice(0, 5).map(enq => (
              <div key={enq.id} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${enq.status === "unread" ? "bg-primary" : "bg-white/20"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${enq.status === "unread" ? "font-bold text-white" : "text-white/70"}`}>
                    {enq.firstName} {enq.lastName} — {enq.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">{format(new Date(enq.createdAt), "MMM d, yyyy · HH:mm")}</p>
                </div>
              </div>
            ))}
            {(!enquiries || enquiries.length === 0) && (
              <p className="text-sm text-muted-foreground py-4 text-center">No enquiries yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
