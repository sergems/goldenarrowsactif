import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@assets/Lamontville_Golden_Arrows_logo_1780312879951.svg";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-4 mb-6">
              <img
                src={logo}
                alt="Lamontville Golden Arrows FC"
                className="h-20 w-auto"
              />
              <div>
                <div className="font-display text-xl uppercase tracking-wider text-foreground">Lamontville</div>
                <div className="font-display text-2xl uppercase tracking-wider text-primary">Golden Arrows FC</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Abafana Bes'thende</div>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm leading-relaxed">
              The pride of KwaZulu-Natal. Founded in Lamontville, Durban. Competing in the DStv Premiership with passion, spirit, and electric football.
            </p>
            <div className="flex gap-3">
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Youtube className="h-4 w-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base mb-6 uppercase tracking-widest text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/news", label: "Latest News" },
                { href: "/fixtures", label: "Fixtures & Results" },
                { href: "/squad", label: "First Team" },
                { href: "/league-table", label: "League Table" },
                { href: "/gallery", label: "Media Gallery" },
                { href: "/community", label: "Community" },
                { href: "/contact", label: "Contact Us" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-base mb-6 uppercase tracking-widest text-primary">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Subscribe for match updates, club news, and exclusive offers.
            </p>
            <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background border-white/10 text-sm"
              />
              <Button type="submit" className="w-full font-bold uppercase tracking-wider text-xs h-10">
                Subscribe
              </Button>
            </form>
            <div className="mt-6">
              <h4 className="font-display text-base mb-3 uppercase tracking-widest text-primary">Stadium</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Princess Magogo Stadium<br />
                KwaMashu, Durban<br />
                KwaZulu-Natal, South Africa
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-7 w-auto opacity-60" />
            <span>&copy; {new Date().getFullYear()} Lamontville Golden Arrows FC. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="h-9 w-9 rounded-lg bg-background border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-black hover:border-primary transition-all duration-200"
    >
      {icon}
    </a>
  );
}
