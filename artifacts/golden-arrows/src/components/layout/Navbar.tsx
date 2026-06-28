import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Menu, X, ChevronDown, Home, Newspaper, CalendarDays, Users, Camera,
  Trophy, BookOpen, BarChart3, ShoppingBag, Shirt, HardHat, Tag, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetNextFixture } from "@workspace/api-client-react";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

const THE_CLUB_LINKS = [
  { href: "/club/history", label: "History", icon: BookOpen, desc: "The Arrows story since 1943" },
  { href: "/club/records", label: "Records", icon: BarChart3, desc: "All-time stats & milestones" },
  { href: "/club/trophy", label: "Trophy Cabinet", icon: Trophy, desc: "Our honours & silverware" },
];

const SHOP_LINKS = [
  { href: "https://goldenarrowsfc.co.za/replicas/", label: "Replica Jerseys", icon: Shirt },
  { href: "https://goldenarrowsfc.co.za/tracksuits/", label: "Tracksuits", icon: HardHat },
  { href: "https://goldenarrowsfc.co.za/clothing/", label: "Clothing", icon: Tag },
  { href: "https://goldenarrowsfc.co.za/product/arrows-lifestyle-legends-jersey/", label: "Life Style", icon: Star },
  { href: "https://goldenarrowsfc.co.za/headwear/", label: "Headwear", icon: ShoppingBag },
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
      <a
        href="https://goldenarrowsfc.co.za/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-l transition-colors text-white/70 hover:text-white hover:bg-white/5"
      >
        Shop
      </a>
      <button
        onClick={() => setOpen(v => !v)}
        className="px-1 py-2 text-sm rounded-r transition-colors text-white/40 hover:text-white hover:bg-white/5"
        aria-label="Shop submenu"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-52 bg-background/50 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {SHOP_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors text-white/70 hover:text-primary hover:bg-white/5 group"
              >
                <Icon className="h-4 w-4 text-white/30 group-hover:text-primary transition-colors" />
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileShopAccordion({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center rounded-xl overflow-hidden">
        <a
          href="https://goldenarrowsfc.co.za/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider transition-colors text-white/70 hover:text-white hover:bg-white/5"
        >
          Shop
        </a>
        <button
          onClick={() => setOpen(v => !v)}
          className="px-4 py-4 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Shop submenu"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4 flex flex-col gap-0.5 pb-1"
          >
            {SHOP_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors text-white/60 hover:text-primary hover:bg-white/5"
              >
                <Icon className="h-4 w-4 text-white/30" />
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ClubMegaMenu({ location, onNavigate }: { location: string; onNavigate?: () => void }) {
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
        className={`relative flex items-center gap-1 px-3 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
          isActive ? "text-primary" : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 rounded bg-primary/10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <span className="relative">The Club</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 relative ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-72 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Mega menu header */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
              <img src={logo} alt="" className="h-7 w-7 object-contain opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                Lamontville Golden Arrows FC
              </span>
            </div>

            {/* Links with descriptions */}
            {THE_CLUB_LINKS.map(({ href, label, icon: Icon, desc }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => { setOpen(false); onNavigate?.(); }}
                  className={`flex items-start gap-4 px-5 py-4 transition-all group ${
                    active ? "bg-primary/10" : "hover:bg-white/4"
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 transition-colors ${
                    active ? "bg-primary/20" : "bg-white/5 group-hover:bg-primary/15"
                  }`}>
                    <Icon className={`h-4 w-4 transition-colors ${active ? "text-primary" : "text-white/40 group-hover:text-primary"}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-black uppercase tracking-wider ${active ? "text-primary" : "text-white/80 group-hover:text-white"}`}>
                      {label}
                    </div>
                    <div className="text-[11px] text-white/35 mt-0.5 group-hover:text-white/55 transition-colors">
                      {desc}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Footer CTA */}
            <div className="px-5 py-3 border-t border-white/5">
              <Link
                href="/technical-team"
                onClick={() => { setOpen(false); onNavigate?.(); }}
                className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-primary transition-colors"
              >
                → Coaching Staff
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileClubOpen, setMobileClubOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location === "/";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isHome && !scrolled && !open
            ? "bg-transparent border-transparent backdrop-blur-none"
            : "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-white/5"
        }`}
      >
        {/* ── Desktop header ── */}
        <div className="hidden md:flex items-center justify-center h-16 relative mx-auto max-w-6xl px-6">
          {/* Logo + Club name */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setOpen(false)}>
            <motion.img
              src={logo}
              alt="Lamontville Golden Arrows FC"
              className="h-11 w-auto"
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
            />
            <div className="hidden lg:block">
              <div className="font-display text-xs uppercase tracking-widest text-foreground/80 leading-tight">Lamontville</div>
              <div className="font-display text-base uppercase tracking-wider text-primary leading-tight">Golden Arrows</div>
            </div>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-5 flex-shrink-0" />

          {/* Nav */}
          <nav className="flex items-center gap-0.5">
            <ClubMegaMenu location={location} />
            <ShopDropdown />

            {NAV_LINKS.map(link => {
              const active = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                    active ? "text-primary" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side: match badge */}
          <div className="absolute right-6 flex items-center gap-2">
            {matchToday && (
              <Link
                href="/"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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
        </div>

        {/* ── Mobile header ── */}
        <div className="md:hidden flex items-center justify-center h-16 relative px-4">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setOpen(false)}>
            <motion.img
              src={logo}
              alt="Lamontville Golden Arrows FC"
              className="h-10 w-auto"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
            />
            <div>
              <div className="font-display text-[10px] uppercase tracking-widest text-foreground/70 leading-tight">Lamontville</div>
              <div className="font-display text-sm uppercase tracking-wider text-primary leading-tight">Golden Arrows</div>
            </div>
          </Link>

          <div className="absolute right-3 flex items-center gap-2">
            {matchToday && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${live ? "bg-red-600 text-white" : "bg-primary text-black"}`}>
                {live ? "● Live" : "● Match Day"}
              </span>
            )}
            <motion.button
              className="p-2 rounded text-white/70 hover:text-white transition-colors"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Accent line */}
        <motion.div
          className={`h-0.5 w-full ${
            live ? "bg-red-500" : matchToday ? "bg-primary" : "bg-gradient-to-r from-secondary via-primary to-secondary"
          }`}
          animate={{ scaleX: scrolled || !isHome ? 1 : 0.3, opacity: scrolled || !isHome ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "center" }}
        />

        {/* Mobile full menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden overflow-hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur border-b border-white/5 shadow-2xl z-50"
            >
              <nav className="container mx-auto px-4 py-3 flex flex-col gap-0.5 max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setMobileClubOpen(v => !v)}
                  className={`flex items-center justify-between px-4 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors w-full ${
                    location.startsWith("/club") ? "text-primary bg-primary/10" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  The Club
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileClubOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {mobileClubOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 flex flex-col gap-0.5 pb-1"
                    >
                      {THE_CLUB_LINKS.map(({ href, label, icon: Icon, desc }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors ${
                            location === href ? "text-primary bg-primary/10" : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0 text-white/30" />
                          <div>
                            <div>{label}</div>
                            <div className="text-[10px] font-normal text-white/30 normal-case tracking-normal">{desc}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <MobileShopAccordion onClose={() => setOpen(false)} />

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
            </motion.div>
          )}
        </AnimatePresence>
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
                  <motion.span
                    layoutId="bottom-pill"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.div whileTap={{ scale: 0.82 }}>
                  <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-white/40"}`} />
                </motion.div>
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
