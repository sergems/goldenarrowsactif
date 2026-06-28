import gaLogo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";
import orlandoPirates from "@assets/south-africa_orlando-pirates_128x128.football-logos.cc_1782407237612.png";
import mamelodiSundowns from "@assets/south-africa_mamelodi-sundowns_128x128.football-logos.cc_1782407237613.png";
import kaizerChiefs from "@assets/south-africa_kaizer-chiefs_128x128.football-logos.cc_1782407237611.png";
import amazulu from "@assets/south-africa_amazulu-fc_128x128.football-logos.cc_1782407237611.png";
import sekhukhune from "@assets/south-africa_sekhukhune-united_128x128.football-logos.cc_1782407237612.png";
import goldenArrows from "@assets/south-africa_golden-arrows_128x128.football-logos.cc_1782407237610.png";
import polokwane from "@assets/south-africa_polokwane-city_128x128.football-logos.cc_1782407237608.png";
import durbanCity from "@assets/south-africa_durban-city_128x128.football-logos.cc_1782407237608.png";
import stellenbosch from "@assets/south-africa_stellenbosch_128x128.football-logos.cc_1782407237609.png";
import siwelele from "@assets/south-africa_siwelele_128x128.football-logos.cc_1782407237606.png";
import richardsBay from "@assets/south-africa_richards-bay_128x128.football-logos.cc_1782407237607.png";
import tsGalaxy from "@assets/south-africa_ts-galaxy_128x128.football-logos.cc_1782407237606.png";
import chippaUnited from "@assets/south-africa_chippa-united_128x128.football-logos.cc_1782407237610.png";
import marumoGallants from "@assets/south-africa_marumo-gallants_128x128.football-logos.cc_1782407237610.png";
import magesi from "@assets/south-africa_magesi_128x128.football-logos.cc_1782407237605.png";
import orbitCollege from "@assets/south-africa_orbit-college_128x128.football-logos.cc_1782407237604.png";

const TEAM_LOGOS: Record<string, string> = {
  "lamontville golden arrows": gaLogo,
  "lamontville golden arrows fc": gaLogo,
  "golden arrows": goldenArrows,
  "golden arrows fc": goldenArrows,

  "orlando pirates": orlandoPirates,
  "orlando pirates fc": orlandoPirates,
  "mamelodi sundowns": mamelodiSundowns,
  "mamelodi sundowns fc": mamelodiSundowns,
  "kaizer chiefs": kaizerChiefs,
  "kaizer chiefs fc": kaizerChiefs,
  "amazulu": amazulu,
  "amazulu fc": amazulu,
  "sekhukhune united": sekhukhune,
  "sekhukhune united fc": sekhukhune,
  "polokwane city": polokwane,
  "polokwane city fc": polokwane,
  "durban city": durbanCity,
  "durban city fc": durbanCity,
  "stellenbosch": stellenbosch,
  "stellenbosch fc": stellenbosch,
  "siwelele": siwelele,
  "siwelele fc": siwelele,
  "richards bay": richardsBay,
  "richards bay fc": richardsBay,
  "ts galaxy": tsGalaxy,
  "ts galaxy fc": tsGalaxy,
  "chippa united": chippaUnited,
  "chippa united fc": chippaUnited,
  "marumo gallants": marumoGallants,
  "marumo gallants fc": marumoGallants,
  "magesi": magesi,
  "magesi fc": magesi,
  "orbit college": orbitCollege,
  "orbit college fc": orbitCollege,
};

export function getTeamLogo(teamName: string): string | null {
  const lower = teamName.toLowerCase().trim();
  if (TEAM_LOGOS[lower]) return TEAM_LOGOS[lower];
  for (const [key, url] of Object.entries(TEAM_LOGOS)) {
    if (lower.includes(key) || key.includes(lower)) return url;
  }
  return null;
}

export function teamInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
