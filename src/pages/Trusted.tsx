import { ShieldCheck, Sparkles, Users, Lock, Zap, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Trusted() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Identity Confidence',
      desc: 'Phone-confirmed accounts and active fraud monitoring keep deals safe.',
    },
    {
      icon: Lock,
      title: 'Secure Conversations',
      desc: 'In-app chat keeps personal details private until you choose to share.',
    },
    {
      icon: Users,
      title: 'Community Moderation',
      desc: 'Reported listings are reviewed quickly to maintain trust.',
    },
    {
      icon: Zap,
      title: 'Fast Discovery',
      desc: 'City-scoped search and instant alerts for new, relevant listings.',
    },
    {
      icon: Sparkles,
      title: 'Curated Quality',
      desc: 'Featured items are handpicked based on ratings and responsiveness.',
    },
    {
      icon: Globe2,
      title: 'Local First',
      desc: 'Built to prioritize nearby, real-world transactions.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border px-4 py-4 safe-top">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">City Connect</p>
            <h1 className="text-2xl font-bold text-foreground">Trusted Marketplace</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Browse Listings</Link>
            </Button>
            <Button asChild>
              <Link to="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <section className="marketplace-card p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))/0.45,transparent_35%),radial-gradient(circle_at_80%_0%,hsl(var(--accent))/0.4,transparent_30%),radial-gradient(circle_at_60%_70%,hsl(var(--primary))/0.25,transparent_35%)]" />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Why trust us</p>
              <h2 className="text-3xl lg:text-4xl font-black text-foreground leading-tight">
                Safe, local, and curated — built for confident transactions.
              </h2>
              <p className="text-muted-foreground text-sm lg:text-base">
                We combine identity checks, fast moderation, and privacy-first chat so you can focus on closing great deals in your city.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-secondary border border-border">Real people, real listings</span>
                <span className="px-3 py-1 rounded-full bg-secondary border border-border">Anti-scam monitoring</span>
                <span className="px-3 py-1 rounded-full bg-secondary border border-border">Zero listing fees</span>
              </div>
            </div>
            <div className="marketplace-card bg-primary/5 border-primary/20">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Safety snapshot</p>
                    <p className="text-lg font-bold text-foreground">98% positive trades</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-secondary/80 border border-border">
                    <p className="text-xl font-bold text-foreground">24/7</p>
                    <p className="text-[11px] text-muted-foreground">Moderation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/80 border border-border">
                    <p className="text-xl font-bold text-foreground">3m</p>
                    <p className="text-[11px] text-muted-foreground">Avg. response</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/80 border border-border">
                    <p className="text-xl font-bold text-foreground">4.8</p>
                    <p className="text-[11px] text-muted-foreground">User rating</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Our team actively flags suspicious activity and prioritizes verified contact methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((item) => (
            <div key={item.title} className="marketplace-card p-4 flex gap-3 items-start">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="marketplace-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Get started</p>
            <h3 className="text-xl font-bold text-foreground">Post a listing or browse today</h3>
            <p className="text-sm text-muted-foreground">
              Create your first listing in under two minutes or explore what’s trending nearby.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/post">Post a Listing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Browse Listings</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
