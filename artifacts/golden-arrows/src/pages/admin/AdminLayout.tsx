import { Link, useLocation } from "wouter";
import { LayoutDashboard, Newspaper, Users, Image, MessageSquare, X, Menu, MonitorPlay, Calendar, TableProperties, Share2, LogOut, KeyRound, Shield, RefreshCw, RectangleHorizontal } from "lucide-react";
import { useState } from "react";
import { useListEnquiries } from "@workspace/api-client-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/squad", label: "Squad", icon: Users },
  { href: "/admin/fixtures", label: "Fixtures", icon: Calendar },
  { href: "/admin/league-table", label: "League Table", icon: TableProperties },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/social-posts", label: "Social Posts", icon: Share2 },
  { href: "/admin/slides", label: "Hero Slides", icon: MonitorPlay },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/teams", label: "Teams", icon: Shield },
  { href: "/admin/ads", label: "Ad Banners", icon: RectangleHorizontal },
  { href: "/admin/sync", label: "Live Sync", icon: RefreshCw },
  { href: "/admin/change-password", label: "Change Password", icon: KeyRound },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { data: enquiries } = useListEnquiries({ status: "unread" });
  const unreadCount = enquiries?.length ?? 0;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-white/5 flex flex-col transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="Golden Arrows FC"
              className="h-10 w-auto"
            />
            <div>
              <div className="font-display font-bold text-sm uppercase tracking-wider">Admin Panel</div>
              <div className="text-xs text-muted-foreground">Golden Arrows FC</div>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="ml-auto md:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => {
            const active = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            const badge = item.href === "/admin/enquiries" && unreadCount > 0 ? unreadCount : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                  active ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {badge && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${active ? "bg-black/20 text-black" : "bg-primary text-black"}`}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors block">
            &larr; Back to Website
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              window.location.reload();
            }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="h-3 w-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-card border-b border-white/5 flex items-center px-6 gap-4 md:hidden">
          <button onClick={() => setOpen(true)} className="text-muted-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-display font-bold uppercase tracking-wider text-sm">Admin Panel</span>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
