import { useListStaff } from "@workspace/api-client-react";
import { motion } from "framer-motion";

function SocialIcon({ platform }: { platform: "instagram" | "facebook" | "twitter" }) {
  if (platform === "instagram") return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
  if (platform === "facebook") return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function TechnicalTeam() {
  const { data: staff, isLoading } = useListStaff();

  return (
    <div className="min-h-screen">
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Technical <span className="text-primary">Team</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            The dedicated coaching and support staff behind Abafana Bes'thende's success.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {isLoading && <div className="text-center text-muted-foreground py-20">Loading staff...</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff?.map((member, i) => {
            const socials = [
              { platform: "instagram" as const, url: member.instagram, label: "Instagram", color: "hover:text-[#E1306C]" },
              { platform: "facebook" as const, url: member.facebook, label: "Facebook", color: "hover:text-[#1877F2]" },
              { platform: "twitter" as const, url: member.twitter, label: "X / Twitter", color: "hover:text-white" },
            ].filter(s => s.url);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center font-display font-bold text-2xl text-primary">
                        {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{member.role}</div>
                  <h3 className="font-display font-bold text-xl mb-2">{member.name}</h3>
                  {member.nationality && (
                    <div className="text-xs text-muted-foreground mb-3">{member.nationality}</div>
                  )}
                  {member.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>
                  )}
                  {socials.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Connect with {member.name.split(" ")[0]}
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
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
