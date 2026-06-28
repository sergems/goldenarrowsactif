import { useState } from "react";
import { getTeamLogo, teamInitials } from "@/lib/teamLogos";

interface TeamCrestProps {
  name: string;
  logoUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  bare?: boolean;
}

const SIZE_MAP = {
  xs: { outer: "h-7 w-7", img: "h-6 w-6", text: "text-[10px]" },
  sm: { outer: "h-9 w-9", img: "h-8 w-8", text: "text-xs" },
  md: { outer: "h-12 w-12", img: "h-10 w-10", text: "text-sm" },
  lg: { outer: "h-16 w-16", img: "h-14 w-14", text: "text-base" },
  xl: { outer: "h-20 w-20", img: "h-18 w-18", text: "text-lg" },
};

export function TeamCrest({ name, logoUrl, size = "md", className = "", bare = false }: TeamCrestProps) {
  const resolved = getTeamLogo(name) ?? logoUrl ?? null;
  const [failed, setFailed] = useState(false);
  const { outer, img, text } = SIZE_MAP[size];

  const isOurs =
    name.toLowerCase().includes("golden arrows") ||
    name.toLowerCase().includes("lamontville");

  if (resolved && !failed) {
    if (bare) {
      return (
        <img
          src={resolved}
          alt={name}
          className={`${outer} object-contain flex-shrink-0 ${className}`}
          onError={() => setFailed(true)}
        />
      );
    }
    return (
      <div
        className={`${outer} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/5 ${className}`}
      >
        <img
          src={resolved}
          alt={name}
          className={`${img} object-contain`}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${outer} rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold ${
        isOurs ? "bg-primary/10 text-primary" : "bg-white/10 text-muted-foreground"
      } ${text} ${className}`}
    >
      {teamInitials(name)}
    </div>
  );
}
