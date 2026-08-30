import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { registerUser, loadAccount } from "@/lib/account";
import { PROFILES } from "@/lib/profiles";

const TITLE = "Jisajili — BTFIXSWAHILI";
const DESCRIPTION =
  "Fungua akaunti yako ya BTFIXSWAHILI bure kwa dakika moja, activate mara moja na anza kuchati na wageni wanaolipa.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://btfixswahili.site/register" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    profile: search["profile"] ? Number(search["profile"]) : undefined,
  }),
  component: RegisterPage,
});

const COUNTRIES = [
  "🇹🇿 Tanzania",
  "🇰🇪 Kenya",
  "🇺🇬 Uganda",
  "🇧🇮 Burundi",
  "🇨🇩 Congo",
  "🇿🇲 Zambia",
  "🇲🇼 Malawi",
  "🌍 International",
];

const PERKS = [
  "Usajili ni bure — activation ya mara moja tu",
  "Malipo yako yanaingia moja kwa moja kwenye balance",
  "Withdraw kwa M-Pesa, MoMo au benki",
];

function RegisterPage() {
  const navigate = useNavigate();
  const { profile: profileId } = Route.useSearch();
  const chosen = PROFILES.find((p) => p.id === profileId);

  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    country: COUNTRIES[0]!,
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError("Password iwe na herufi 6 au zaidi.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Password hazifanani.");
      return;
    }
    registerUser(
      {
        name: form.name,
        username: form.username,
        phone: form.phone,
        email: form.email,
        country: form.country,
      },
      profileId ?? loadAccount().pendingProfileId,
    );
    navigate({
      to: "/payment",
      search: { profile: profileId ?? undefined },
    });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="text-sm font-semibold text-primary">
          ← Rudi mwanzo
        </Link>

        <div className="mt-4 grid overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)] lg:grid-cols-12">
          <aside
            className="p-8 text-primary-foreground lg:col-span-5"
            style={{ background: "var(--gradient-brand)" }}
          >
            <p className="text-xl font-black tracking-tight">BTFIXSWAHILI</p>
            <h2 className="mt-6 text-2xl font-bold">Fungua akaunti yako</h2>
            <p className="mt-3 text-sm opacity-85">
              Jaza taarifa zako, activate mara moja, kisha rudi kwenye chat uliyochagua na uanze
              kupata malipo.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {chosen && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/15 p-3">
                <img
                  src={chosen.avatar}
                  alt={chosen.name}
                  loading="lazy"
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold">{chosen.name}</p>
                  <p className="text-xs opacity-85">
                    {chosen.flag} {chosen.country} • anakusubiri
                  </p>
                </div>
              </div>
            )}
          </aside>

          <section className="p-6 md:p-8 lg:col-span-7">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-extrabold tracking-tight">Create Account</h1>
              <span className="text-xs text-muted-foreground">Hatua 1 kati ya 2</span>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <Field label="Jina kamili">
                <input
                  className={INPUT}
                  placeholder="John Alex"
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Username">
                <input
                  className={INPUT}
                  placeholder="user_01"
                  required
                  value={form.username}
                  onChange={(e) => set("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                />
              </Field>
              <Field label="Namba ya simu">
                <input
                  className={INPUT}
                  placeholder="06XXXXXXXX"
                  inputMode="tel"
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/[^0-9+]/g, ""))}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={INPUT}
                  placeholder="name@mail.com"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Nchi">
                  <select
                    className={INPUT}
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className={`${INPUT} pr-16`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary"
                  >
                    {showPass ? "Ficha" : "Onyesha"}
                  </button>
                </div>
              </Field>
              <Field label="Rudia password">
                <input
                  type="password"
                  className={INPUT}
                  placeholder="••••••••"
                  required
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                />
              </Field>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-primary-foreground shadow-[var(--shadow-card)]"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Jisajili &amp; Endelea Kulipia
                </button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="size-4" />
                  Taarifa zako zinahifadhiwa kwenye kifaa chako.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

const INPUT =
  "w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
