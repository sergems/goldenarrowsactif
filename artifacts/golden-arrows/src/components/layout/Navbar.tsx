import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Home, Newspaper, CalendarDays, Users, Camera } from "lucide-react";
import { useGetNextFixture } from "@workspace/api-client-react";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const THE_CLUB_LINKS = [
  { href: "/club/history", label: "History" },
  { href: "/club/records", label: "Records" },
  { href: "/club/trophy", label: "Trophy Cabinet" },
];

const SHOP_LINKS = [
  { href: "https://goldenarrowsfc.co.za/replicas/", label: "Replica Jerseys" },
  { href: "https://goldenarrowsfc.co.za/tracksuits/", label: "Tracksuits" },
  { href: "https://goldenarrowsfc.co.za/clothing/", label: "Clothing" },
  { href: "https://goldenarrowsfc.co.za/product/arrows-lifestyle-legends-jersey/", label: "Life Style" },
  { href: "https://goldenarrowsfc.co.za/headwear/", label: "Headwear" },
];

const NAV_LINKS = [
  { href: "/squad", label: "Squad" },
  { href: "/fan-zone", label: "Fan Zone" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/league-table", label: "Table" },
  { href: "/news", label: "News" },
];

const BOTTOM_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/squad", label: "Squad", icon: Users },
  { href: "/fan-zone", label: "Fan Zone", icon: Camera },
];

function isSameDay(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isMatchLive(dateStr: string, timeStr?: string | null) {
  const now = new Date();
  const kickoff = new Date(`${dateStr}T${timeStr || "15:00:00"}`);
  const elapsed = (now.getTime() - kickoff.getTime()) / (1000 * 60);
  return elapsed >= 0 && elapsed <= 105;
}

function ShopDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center">
      {/* "Shop" = direct link to main store */}
      <a
        href="https://goldenarrowsfc.co.za/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-l transition-colors text-white/70 hover:text-white hover:bg-white/5"
      >
        Shop
      </a>
      {/* Chevron = submenu toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="px-1 py-2 text-sm rounded-r transition-colors text-white/40 hover:text-white hover:bg-white/5"
        aria-label="Shop submenu"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-background border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {SHOP_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors text-white/70 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileShopAccordion({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center rounded-xl overflow-hidden">
        {/* "Shop" = direct link */}
        <a
          href="https://goldenarrowsfc.co.za/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider transition-colors text-white/70 hover:text-white hover:bg-white/5"
        >
          Shop
        </a>
        {/* Chevron = expand submenu */}
        <button
          onClick={() => setOpen(v => !v)}
          className="px-4 py-4 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Shop submenu"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="pl-4 flex flex-col gap-0.5 pb-1">
          {SHOP_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-4 py-3.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function ClubDropdown({ location, onNavigate }: { location: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = location.startsWith("/club");

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
          isActive ? "text-primary" : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        The Club
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {THE_CLUB_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className={`block px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                location === link.href
                  ? "text-primary bg-primary/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileClubOpen, setMobileClubOpen] = useState(false);
  const [location] = useLocation();
  const { data: nextFixture } = useGetNextFixture();

  const matchToday = nextFixture ? isSameDay(nextFixture.date) : false;
  const live = matchToday && nextFixture
    ? isMatchLive(nextFixture.date, nextFixture.time)
    : false;

  useEffect(() => {
    setOpen(false);
    setMobileClubOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-white/5">
        {/* ── Desktop header ── */}
        <div className="hidden md:flex items-center justify-center h-16 relative mx-auto max-w-6xl px-6">
          {/* Logo + Club name — part of centered group */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setOpen(false)}>
            <img src={logo} alt="Lamontville Golden Arrows FC" className="h-11 w-auto" />
            <div className="hidden lg:block">
              <div className="font-display text-xs uppercase tracking-widest text-foreground/80 leading-tight">Lamontville</div>
              <div className="font-display text-base uppercase tracking-wider text-primary leading-tight">Golden Arrows</div>
            </div>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-5 flex-shrink-0" />

          {/* Nav — part of centered group */}
          <nav className="flex items-center gap-0.5">
            <ClubDropdown location={location} />
            <ShopDropdown />
            {NAV_LINKS.map(link => {
              const active = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                    active ? "text-primary" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Match day / Live badge — absolutely right */}
          {matchToday && (
            <Link
              href="/"
              className={`absolute right-6 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                live ? "bg-red-600 text-white" : "bg-primary text-black"
              }`}
            >
              {live ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  Live
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                  </span>
                  Match Day
                </>
              )}
            </Link>
          )}
        </div>

        {/* ── Mobile header ── */}
        <div className="md:hidden flex items-center justify-center h-16 relative px-4">
          {/* Logo centered */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setOpen(false)}>
            <img src={logo} alt="Lamontville Golden Arrows FC" className="h-10 w-auto" />
            <div>
              <div className="font-display text-[10px] uppercase tracking-widest text-foreground/70 leading-tight">Lamontville</div>
              <div className="font-display text-sm uppercase tracking-wider text-primary leading-tight">Golden Arrows</div>
            </div>
          </Link>

          {/* Match day badge + hamburger — absolutely right */}
          <div className="absolute right-3 flex items-center gap-2">
            {matchToday && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${live ? "bg-red-600 text-white" : "bg-primary text-black"}`}>
                {live ? "● Live" : "● Match Day"}
              </span>
            )}
            <button
              className="p-2 rounded text-white/70 hover:text-white transition-colors"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Accent line */}
        <div
          className={`h-0.5 w-full ${
            live ? "bg-red-500" : matchToday ? "bg-primary" : "bg-gradient-to-r from-secondary via-primary to-secondary"
          }`}
        />

        {/* Mobile full menu */}
        {open && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur border-b border-white/5 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-0.5">
              <button
                onClick={() => setMobileClubOpen(v => !v)}
                className={`flex items-center justify-between px-4 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors w-full ${
                  location.startsWith("/club") ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                The Club
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileClubOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileClubOpen && (
                <div className="pl-4 flex flex-col gap-0.5 pb-1">
                  {THE_CLUB_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors ${
                        location === link.href ? "text-primary bg-primary/10" : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <a
                href="https://goldenarrowsfc.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="px-4 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors text-white/70 hover:text-white hover:bg-white/5"
              >
                Shop
              </a>

              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors ${
                    location === link.href ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/5 mt-2 pt-2 pb-1">
                <Link href="/admin" onClick={() => setOpen(false)} className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors block">
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-t border-white/10 safe-area-inset-bottom">
        <div className="flex items-stretch">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors relative"
                onClick={() => setOpen(false)}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-white/40"}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-primary" : "text-white/40"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
