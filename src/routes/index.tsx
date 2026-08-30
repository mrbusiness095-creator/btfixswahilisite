import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Gift,
  Wallet,
  ArrowDownToLine,
  Rocket,
  Users,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  RefreshCw,
} from "lucide-react";
import { PROFILES, REGISTER_URL, formatTZS, type Profile } from "@/lib/profiles";
import { ChatGateModal } from "@/components/ChatGateModal";
import { SupportWidget } from "@/components/SupportWidget";

const TITLE = "BTFIXSWAHILI — Chat With Foreigners & Earn in TZS";
const DESCRIPTION =
  "Foreigners pay to chat with you. Choose a profile, chat, and withdraw your earnings to M-Pesa, MoMo or bank anytime. No experience needed.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://btfixswahili.site/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://btfixswahili.site/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "BTFIXSWAHILI",
          url: "https://btfixswahili.site/",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: Index,
});

const TRUST = [
  { icon: Star, title: "4.9 TrustScore", sub: "Rated by members" },
  { icon: ShieldCheck, title: "24/7 Moderated", sub: "Always protected" },
  { icon: Zap, title: "Instant Withdrawals", sub: "M-Pesa, MoMo, bank" },
  { icon: Globe, title: "Global Members", sub: "Worldwide reach" },
];

const STEPS = [
  { n: "01", title: "Register Free", text: "Create your account in under 60 seconds." },
  { n: "02", title: "Activate Once", text: "A single activation unlocks access to the service." },
  { n: "03", title: "Chat With Foreigners", text: "Choose a profile and connect." },
  { n: "04", title: "Withdraw Anytime", text: "Withdraw according to the applicable service terms." },
];

function Index() {
  const [seed, setSeed] = useState(0);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 10000);
    return () => clearInterval(t);
  }, []);

  const ordered = useMemo(() => {
    const list = [...PROFILES];
    const offset = seed % list.length;
    return [...list.slice(offset), ...list.slice(0, offset)];
  }, [seed]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="grid size-10 place-items-center rounded-xl text-lg font-black text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              B
            </div>
            <div>
              <p className="text-lg font-extrabold leading-tight tracking-tight">BTFIXSWAHILI</p>
              <p className="text-xs text-muted-foreground">Earnings Platform</p>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-success/15 px-3 py-1.5 text-xs font-bold text-success">
            <span className="size-2 rounded-full bg-success" />
            LIVE
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <section className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                <Gift className="size-4" /> Welcome Bonus
              </p>
              <p className="mt-2 text-2xl font-extrabold">
                TZS <span className="text-primary">6,000</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Bonus offer — not withdrawable</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Wallet className="size-4" /> Current Balance
              </p>
              <p className="mt-2 text-2xl font-extrabold">TZS 0.00</p>
              <p className="mt-1 text-xs text-muted-foreground">Available for withdrawal</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <ArrowDownToLine className="size-4" /> Withdraw
              </p>
              <a
                href={REGISTER_URL}
                className="mt-3 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-primary-foreground"
                style={{ background: "var(--gradient-brand)" }}
              >
                Withdraw Funds
              </a>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-card px-5 py-12 text-center shadow-[var(--shadow-card)]">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            🌍 Chat • Earn • Withdraw
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Foreigners <span className="text-primary">pay</span> to chat with you.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Choose a group, pick a foreigner — they pay for your time. No experience needed.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={REGISTER_URL}
              className="flex items-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-primary-foreground shadow-[var(--shadow-card)]"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Rocket className="size-5" /> Activate &amp; Start Earning
            </a>
            <a
              href="#profiles"
              className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 font-bold"
            >
              <Users className="size-5" /> Explore Profiles
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Illustrative profile and earning information.
          </p>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <t.icon className="size-5 text-primary" />
              <p className="mt-2 font-bold">{t.title}</p>
              <p className="text-sm text-muted-foreground">{t.sub}</p>
            </div>
          ))}
        </section>

        <section id="profiles" className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Available Foreigners</h2>
              <p className="text-sm text-muted-foreground">
                {PROFILES.length} profiles • Reorder live every 10 seconds
              </p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              <RefreshCw className="size-3.5 animate-spin" /> Refreshing
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar}
                    alt={`${p.name} profile photo`}
                    loading="lazy"
                    className="size-14 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{p.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.flag} {p.country} •{" "}
                      <span className={p.status === "Active now" ? "text-success" : ""}>
                        🟢 {p.status}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ⭐ {p.rating.toFixed(1)} • {p.minutes} min
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Wants</p>
                  <p className="text-sm font-semibold">{p.wants}</p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">You Earn</p>
                    <p className="font-extrabold text-primary">TZS {formatTZS(p.earn)}</p>
                  </div>
                  <button
                    onClick={() => setSelected(p)}
                    className="rounded-xl px-4 py-2.5 text-sm font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    Start Chat
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Illustrative profile and earning information.
          </p>
        </section>

        <section className="mt-12 rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">How It Works</h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Four simple steps to start earning
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border p-4">
                <p className="text-2xl font-black text-primary/40">{s.n}</p>
                <p className="mt-1 font-bold">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href={REGISTER_URL}
              className="flex items-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Rocket className="size-5" /> Activate &amp; Start Earning
            </a>
          </div>
        </section>
      </main>

      <SupportWidget />
      {selected && <ChatGateModal profile={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
