import { useListPlayers } from "@workspace/api-client-react";
import { PageHero } from "@/components/layout/PageHero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import playerPlaceholder from "@/assets/player-placeholder.png";

const COACHING_POSITIONS = ["Coach", "Assistant Coach"];

function isCoachingStaff(position: string) {
  return COACHING_POSITIONS.some(p => p.toLowerCase() === position.toLowerCase());
}

const FLAG_MAP: Record<string, string> = {
  "South Africa": "🇿🇦", "Nigeria": "🇳🇬", "Ghana": "🇬🇭",
  "Ivory Coast": "🇨🇮", "Côte d'Ivoire": "🇨🇮", "Zimbabwe": "🇿🇼",
  "Zambia": "🇿🇲", "Mozambique": "🇲🇿", "DR Congo": "🇨🇩",
  "Senegal": "🇸🇳", "Cameroon": "🇨🇲", "Mali": "🇲🇱",
  "Uganda": "🇺🇬", "Kenya": "🇰🇪", "Tanzania": "🇹🇿",
  "Malawi": "🇲🇼", "Swaziland": "🇸🇿", "Eswatini": "🇸🇿",
  "Lesotho": "🇱🇸", "Botswana": "🇧🇼", "Namibia": "🇳🇦",
  "Angola": "🇦🇴", "Ethiopia": "🇪🇹",
};

function PlayerCard({ player, index }: { player: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const flag = FLAG_MAP[player.nationality] ?? "🌍";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <Link href={`/squad/${player.id}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer">
          {/* Photo */}
          <motion.img
            src={player.photoUrl || playerPlaceholder}
            alt={player.name}
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 15%" }}
          />

          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          {/* Jersey number — floats up on hover */}
          <motion.div
            animate={{ y: hovered ? -8 : 0, opacity: hovered ? 0.5 : 0.15 }}
            transition={{ duration: 0.35 }}
            className="absolute top-3 right-3 font-display font-black text-6xl text-primary leading-none select-none pointer-events-none"
          >
            {player.number}
          </motion.div>

          {/* Hover overlay — slides up */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 flex flex-col justify-end p-4"
              >
                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4 mt-auto">
                  {player.appearances != null && (
                    <div className="text-center bg-white/5 border border-white/10 rounded-lg py-2">
                      <div className="font-display font-black text-xl text-primary">{player.appearances ?? "–"}</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider">Apps</div>
                    </div>
                  )}
                  {player.goals != null && (
                    <div className="text-center bg-white/5 border border-white/10 rounded-lg py-2">
                      <div className="font-display font-black text-xl text-primary">{player.goals ?? "–"}</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider">Goals</div>
                    </div>
                  )}
                  {player.assists != null && (
                    <div className="text-center bg-white/5 border border-white/10 rounded-lg py-2">
                      <div className="font-display font-black text-xl text-primary">{player.assists ?? "–"}</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider">Assists</div>
                    </div>
                  )}
                </div>

                {/* Nationality */}
                <div className="flex items-center gap-1.5 mb-2 text-white/60 text-xs">
                  <span>{flag}</span>
                  <span>{player.nationality}</span>
                </div>

                {/* Name + CTA */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-primary text-xs font-bold uppercase tracking-wider mb-0.5">{player.position}</div>
                    <h3 className="font-display font-bold text-xl uppercase text-white leading-tight">{player.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider flex-shrink-0 ml-2">
                    Profile <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Default bottom info (visible when not hovered) */}
          <AnimatePresence>
            {!hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-4"
              >
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-0.5">{player.position}</div>
                <h3 className="font-display font-bold text-lg uppercase text-white leading-tight">{player.name}</h3>
                <div className="text-xs text-white/40 mt-1 flex items-center gap-1">
                  <span>{flag}</span> {player.nationality}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Border glow on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-xl ring-2 ring-primary/60 pointer-events-none"
          />
        </div>
      </Link>
    </motion.div>
  );
}

function CoachCard({ coach, index }: { coach: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const flag = FLAG_MAP[coach.nationality] ?? "🌍";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/squad/${coach.id}`}>
        <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer">
          <motion.img
            src={coach.photoUrl || playerPlaceholder}
            alt={coach.name}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 15%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-xl ring-2 ring-primary/60 pointer-events-none"
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{coach.position}</div>
            <h3 className="text-xl font-display font-bold uppercase text-white">{coach.name}</h3>
            <div className="text-xs text-white/40 mt-1.5 flex items-center gap-1">
              <span>{flag}</span> {coach.nationality}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Squad() {
  const { data: players, isLoading } = useListPlayers();
  const [search, setSearch] = useState("");

  if (isLoading) return <div className="p-20 text-center text-muted-foreground">Loading squad...</div>;

  const tabs = ["Coaching Staff", "Goalkeepers", "Defenders", "Midfielders", "Forwards"];

  const getGroup = (tab: string) => {
    let group: typeof players = [];
    if (tab === "Coaching Staff") {
      group = players?.filter(p => isCoachingStaff(p.position)) ?? [];
    } else {
      const singular = tab.slice(0, -1);
      group = players?.filter(p =>
        !isCoachingStaff(p.position) &&
        (p.position.includes(singular) || (tab === "Forwards" && p.position.includes("Striker")))
      ) ?? [];
    }
    if (search) {
      group = group.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return group;
  };

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="2024/25 Season"
        title="First"
        highlight="Team"
        description="Meet the players and coaching staff representing Abafana Bes'thende. Hover a card to see stats."
      />

      <PageWrapper page="squad" noAds>
        {/* Search bar */}
        <div className="flex justify-end mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search players..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="Goalkeepers" className="w-full">
          <div className="mb-8 overflow-x-auto scrollbar-none -mx-4 px-4">
            <TabsList className="bg-card border border-white/10 h-auto p-1 gap-1 inline-flex min-w-max w-full sm:w-auto sm:mx-auto sm:flex sm:justify-center">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-3 sm:px-5 py-2.5 uppercase tracking-wider font-bold text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-black"
                >
                  {tab}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({getGroup(tab).length})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Coaching Staff tab */}
          <TabsContent value="Coaching Staff">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getGroup("Coaching Staff").map((coach, i) => (
                <CoachCard key={coach.id} coach={coach} index={i} />
              ))}
              {getGroup("Coaching Staff").length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                  {search ? `No staff matching "${search}"` : "No coaching staff listed yet."}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Player tabs */}
          {["Goalkeepers", "Defenders", "Midfielders", "Forwards"].map((pos) => (
            <TabsContent key={pos} value={pos}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getGroup(pos).map((player, i) => (
                  <PlayerCard key={player.id} player={player} index={i} />
                ))}
                {getGroup(pos).length === 0 && (
                  <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                    {search ? `No players matching "${search}"` : `No players listed for ${pos}.`}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </PageWrapper>
    </div>
  );
}
