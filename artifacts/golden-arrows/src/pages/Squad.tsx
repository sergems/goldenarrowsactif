import { useListPlayers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import playerPlaceholder from "@/assets/player-placeholder.png";

const COACHING_POSITIONS = ["Coach", "Assistant Coach"];

function isCoachingStaff(position: string) {
  return COACHING_POSITIONS.some(p => p.toLowerCase() === position.toLowerCase());
}

export default function Squad() {
  const { data: players, isLoading } = useListPlayers();

  if (isLoading) return <div className="p-20 text-center text-muted-foreground">Loading squad...</div>;

  const tabs = ["Coaching Staff", "Goalkeepers", "Defenders", "Midfielders", "Forwards"];

  const getGroup = (tab: string) => {
    if (tab === "Coaching Staff") return players?.filter(p => isCoachingStaff(p.position)) ?? [];
    const singular = tab.slice(0, -1); // "Goalkeeper", "Defender" etc.
    return players?.filter(p => !isCoachingStaff(p.position) && (p.position.includes(singular) || (tab === "Forwards" && p.position.includes("Striker")))) ?? [];
  };

  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">First <span className="text-primary">Team</span></h1>
          <p className="text-muted-foreground text-xs mt-0.5">Meet the players and coaching staff representing Abafana Bes'thende in the current season.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Coaching Staff tab */}
          <TabsContent value="Coaching Staff">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getGroup("Coaching Staff").map((coach, i) => (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/squad/${coach.id}`}>
                    <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer">
                      <img
                        src={coach.photoUrl || playerPlaceholder}
                        alt={coach.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{coach.position}</div>
                        <h3 className="text-xl font-display font-bold uppercase">{coach.name}</h3>
                        <div className="text-xs text-muted-foreground mt-2">{coach.nationality}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {getGroup("Coaching Staff").length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                  No coaching staff listed yet.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Player tabs */}
          {["Goalkeepers", "Defenders", "Midfielders", "Forwards"].map((pos) => (
            <TabsContent key={pos} value={pos}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getGroup(pos).map((player, i) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/squad/${player.id}`}>
                      <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-white/10 cursor-pointer">
                        <img
                          src={player.photoUrl || playerPlaceholder}
                          alt={player.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="text-6xl font-display font-black text-white/20 absolute -top-8 right-4 transition-all group-hover:text-primary/30 group-hover:-top-10">{player.number}</div>
                          <div className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{player.position}</div>
                          <h3 className="text-xl font-display font-bold uppercase">{player.name}</h3>
                          <div className="text-xs text-muted-foreground mt-2">{player.nationality}</div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {getGroup(pos).length === 0 && (
                  <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                    No players listed for this position.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
