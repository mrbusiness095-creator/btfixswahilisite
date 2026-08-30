import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Lock, ShieldAlert, Zap } from "lucide-react";
import { ACTIVATION_FEE, loadAccount, markPaid, useAccount } from "@/lib/account";
import { formatTZS } from "@/lib/profiles";

const TITLE = "Lipia Activation — BTFIXSWAHILI";
const DESCRIPTION =
  "Lipia ada ya activation ya mara moja kwa USSD Push, kisha rudi kwenye chat uliyochagua na uanze kupata malipo.";

export const Route = createFileRoute("/payment")({
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
    links: [{ rel: "canonical", href: "https://btfixswahili.site/payment" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    profile: search["profile"] ? Number(search["profile"]) : undefined,
  }),
  component: PaymentPage,
});

const OPERATORS = [
  {
    id: "mpesa",
    name: "M-Pesa",
    ussd: "*150*00#",
    steps: [
      "Bonyeza *150*00#",
      "Chagua Lipa kwa M-PESA",
      "Chagua Weka Namba ya Kampuni",
      "Weka LIPA NAMBA: 354136248",
      `Weka kiasi ${formatTZS(ACTIVATION_FEE)} TZS`,
      "Weka namba ya siri",
    ],
  },
  {
    id: "airtel",
    name: "Airtel Money",
    ussd: "*150*60#",
    steps: [
      "Bonyeza *150*60#",
      "Chagua Lipia Bili",
      "Chagua LIPA KWA SIMU (MITANDAO YOTE)",
      `Weka kiasi ${formatTZS(ACTIVATION_FEE)} TZS`,
      "Ingiza kumbukumbu ya malipo: 354136248",
    ],
  },
  {
    id: "halo",
    name: "Halopesa",
    ussd: "*150*88#",
    steps: [
      "Bonyeza *150*88#",
      "Chagua (5) Lipia Bidhaa",
      "Chagua (3) M-PESA",
      "Weka namba ya malipo: 354136248",
      `Weka kiasi ${formatTZS(ACTIVATION_FEE)} TZS`,
      "Ingiza namba ya siri",
    ],
  },
];

function PaymentPage() {
  const navigate = useNavigate();
  const account = useAccount();
  const { profile: searchProfile } = Route.useSearch();
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<"form" | "waiting" | "done">("form");
  const [openOp, setOpenOp] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const a = loadAccount();
    if (a.user?.phone) setPhone(a.user.phone);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const targetProfile = searchProfile ?? account.pendingProfileId ?? null;

  function goToChat() {
    if (targetProfile) navigate({ to: "/chat/$id", params: { id: String(targetProfile) } });
    else navigate({ to: "/" });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("waiting");
    timer.current = setTimeout(() => {
      markPaid();
      setPhase("done");
      timer.current = setTimeout(goToChat, 1800);
    }, 6000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="flex items-center justify-between px-5 py-4 text-primary-foreground"
        style={{ background: "var(--gradient-brand)" }}
      >
        <Link to="/" className="text-lg font-black tracking-tight">
          BTFIXSWAHILI
        </Link>
        <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wide">
          MALIPO SALAMA
        </span>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 pt-6">
        <div className="mb-5 flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
          <ShieldAlert className="size-6 shrink-0 text-destructive" />
          <div>
            <h2 className="text-xs font-bold tracking-widest text-destructive">LINDA PESA YAKO</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Lipia kupitia mfumo huu pekee. Malipo yanayofanyika nje ya mfumo huu ni batili.
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <div className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
              <Zap className="size-5" />
            </div>
            <div>
              <h3 className="font-bold">Activation ya mara moja</h3>
              <p className="text-xs text-muted-foreground">Lipia moja kwa moja kwa USSD Push</p>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-accent/60 px-4 py-3">
              <span className="text-sm text-muted-foreground">Kiasi cha kulipa</span>
              <span className="text-lg font-extrabold text-primary">
                TZS {formatTZS(ACTIVATION_FEE)}
              </span>
            </div>

            {phase === "done" ? (
              <div className="rounded-2xl border border-success/40 bg-success/10 p-6 text-center">
                <p className="text-lg font-bold text-success">Malipo yamekamilika ✅</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Akaunti yako imeactivate. Tunakupeleka kwenye chat yako...
                </p>
                <button onClick={goToChat} className="mt-4 font-bold text-primary">
                  Endelea kwenye chat →
                </button>
              </div>
            ) : phase === "waiting" ? (
              <div className="rounded-2xl border border-border p-6 text-center">
                <Loader2 className="mx-auto mb-3 size-9 animate-spin text-primary" />
                <p className="font-bold">Subiri uthibitisho...</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Push USSD imetumwa kwenye {phone || "simu yako"}. Ingiza namba yako ya siri
                  kuthibitisha malipo.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <label className="mb-1 block text-xs font-bold text-muted-foreground" htmlFor="tz-phone">
                  Namba ya simu
                </label>
                <div className="mb-4 flex items-center overflow-hidden rounded-xl border border-border bg-muted">
                  <span className="border-r border-border px-3 py-3 text-sm text-muted-foreground">
                    🇹🇿 +255
                  </span>
                  <input
                    id="tz-phone"
                    type="tel"
                    required
                    maxLength={12}
                    placeholder="06XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Lock className="size-4" /> LIPA SASA
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-bold">Njia nyingine za kulipia</h3>
            <p className="text-xs text-muted-foreground">Tumia LIPA NAMBA kama push haijafika</p>
          </div>
          {OPERATORS.map((op) => (
            <div key={op.id} className="border-b border-border last:border-0">
              <button
                type="button"
                onClick={() => setOpenOp((c) => (c === op.id ? null : op.id))}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span>
                  <span className="block text-sm font-bold">{op.name}</span>
                  <span className="block text-xs text-muted-foreground">{op.ussd}</span>
                </span>
                <span className="text-muted-foreground">{openOp === op.id ? "▲" : "▼"}</span>
              </button>
              {openOp === op.id && (
                <ol className="space-y-2 bg-muted px-5 py-4 text-sm">
                  {op.steps.map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
