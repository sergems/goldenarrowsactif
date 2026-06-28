import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Printer, Facebook, Instagram, Twitter, Youtube, CheckCircle, Loader2, MailOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEnquiry } from "@workspace/api-client-react";

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutation = useCreateEnquiry();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate(
      { data: form },
      {
        onSuccess: () => setSent(true),
        onError: () => setError("Something went wrong. Please try again."),
      }
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card py-3 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Reach out to Lamontville Golden Arrows FC — we'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-2xl uppercase mb-6" style={{ letterSpacing: "0.06em" }}>
              Send a <span className="text-primary">Message</span>
            </h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary/20 border border-secondary/40 rounded-xl p-10 text-center"
              >
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="font-display text-2xl text-primary mb-2" style={{ letterSpacing: "0.06em" }}>Message Sent!</div>
                <p className="text-muted-foreground mb-6">
                  Thanks for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" }); }}
                  className="text-sm font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wider">First Name</label>
                    <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" required className="bg-card border-white/10" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wider">Last Name</label>
                    <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" required className="bg-card border-white/10" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wider">Email Address</label>
                  <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required className="bg-card border-white/10" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wider">Subject</label>
                  <Input name="subject" value={form.subject} onChange={handleChange} placeholder="General Enquiry" required className="bg-card border-white/10" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wider">Message</label>
                  <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." rows={5} required className="bg-card border-white/10 resize-none" />
                </div>
                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
                )}
                <Button type="submit" disabled={mutation.isPending} className="w-full font-bold uppercase tracking-wider h-12">
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Sending…</span>
                  ) : "Send Message"}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Club Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="font-display text-2xl uppercase mb-2" style={{ letterSpacing: "0.06em" }}>
              Club <span className="text-primary">Information</span>
            </h2>

            {/* Physical */}
            <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Physical Address</h3>
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Moses Mabhida Stadium<br />
                  44 Isaiah Road<br />
                  Durban, 4001
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Tel: </span>
                  <a href="tel:+27313039848" className="text-foreground hover:text-primary transition-colors">+27 31 303 9848</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Printer className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Fax: </span>
                  <span className="text-foreground">+27 31 303 9849</span>
                </div>
              </div>
            </div>

            {/* Postal */}
            <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Postal Address</h3>
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <MailOpen className="h-4 w-4" />
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Moses Mabhida Stadium<br />
                  Private Bag X2010<br />
                  Greyville, 4023
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Email: </span>
                  <a href="mailto:lgarrowsfc@telkomsa.net" className="text-primary hover:underline">lgarrowsfc@telkomsa.net</a>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-display text-base uppercase mb-4 text-primary" style={{ letterSpacing: "0.1em" }}>Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                  { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                  { icon: <Twitter className="h-5 w-5" />, label: "X/Twitter" },
                  { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
                ].map(social => (
                  <a key={social.label} href="#" title={social.label}
                    className="h-12 w-12 rounded-xl bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-black hover:border-primary transition-colors">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
