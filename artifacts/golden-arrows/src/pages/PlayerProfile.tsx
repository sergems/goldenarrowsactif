import { useGetPlayer } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import playerPlaceholder from "@/assets/player-placeholder.png";

function SocialIcon({ platform }: { platform: "instagram" | "facebook" | "twitter" }) {
  if (platform === "instagram") return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
  if (platform === "facebook") return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function ConnectWith({ name, instagram, facebook, twitter }: {
  name: string;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
}) {
  const socials = [
    { platform: "instagram" as const, url: instagram, label: "Instagram", color: "hover:text-[#E1306C]" },
    { platform: "facebook" as const, url: facebook, label: "Facebook", color: "hover:text-[#1877F2]" },
    { platform: "twitter" as const, url: twitter, label: "X / Twitter", color: "hover:text-white" },
  ].filter(s => s.url);

  if (socials.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-white/5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
        Connect with {name.split(" ")[0]}
      </p>
      <div className="flex items-center gap-3">
        {socials.map(s => (
          <a
            key={s.platform}
            href={s.url!}
            target="_blank"
            rel="noopener noreferrer"
            title={s.label}
            className={`text-muted-foreground transition-colors ${s.color}`}
          >
            <SocialIcon platform={s.platform} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: player, isLoading } = useGetPlayer(Number(id));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!player) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Player not found.</div>;

  const stats = [
    { label: "Appearances", value: player.appearances },
    { label: "Goals", value: player.goals },
    { label: "Assists", value: player.assists },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-card border-b border-white/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Link href="/squad" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back to Squad
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative flex-shrink-0">
              <div className="h-64 w-64 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/30 to-primary/10">
                <img
                  src={player.photoUrl || playerPlaceholder}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-xl bg-primary flex items-center justify-center font-display font-black text-3xl text-black">
                {player.number}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{player.position}</div>
              <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight mb-4">{player.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span>Nationality: <strong className="text-foreground">{player.nationality}</strong></span>
                {player.age && <span>Age: <strong className="text-foreground">{player.age}</strong></span>}
              </div>
              {player.bio && (
                <p className="text-muted-foreground max-w-2xl leading-relaxed">{player.bio}</p>
              )}
              <ConnectWith
                name={player.name}
                instagram={player.instagram}
                facebook={player.facebook}
                twitter={player.twitter}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-8">Season <span className="text-primary">Statistics</span></h2>
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {stats.map(stat => (
            <div key={stat.label} className="bg-card border border-white/5 rounded-xl p-6 text-center">
              <div className="font-display font-black text-5xl text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
