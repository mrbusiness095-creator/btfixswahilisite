import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { MIN_WITHDRAWAL, useAccount, withdraw } from "@/lib/account";
import { formatTZS } from "@/lib/profiles";

const TITLE = "Withdraw Earnings — BTFIXSWAHILI";
const DESCRIPTION =
  "Toa earnings zako kwa M-Pesa, MoMo au benki. Withdrawal inaanza kutoka TZS 50,000 kwenye balance yako.";

export const Route = createFileRoute("/withdraw")({
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
    links: [{ rel: "canonical", href: "https://btfixswahili.site/withdraw" }],
  }),
  component: WithdrawPage,
});

const METHODS = ["M-Pesa", "Airtel Money", "Halopesa", "Benki"];

function WithdrawPage() {
  const account = useAccount();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0]!);
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const balance = account.balance;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const value = Number(amount);
    if (!value || value <= 0) return setError("Weka kiasi sahihi.");
    if (balance < MIN_WITHDRAWAL)
      return setError(`Unahitaji angalau TZS ${formatTZS(MIN_WITHDRAWAL)} kwenye balance yako.`);
    if (value < MIN_WITHDRAWAL)
      return setError(`Kiasi cha chini cha withdrawal ni TZS ${formatTZS(MIN_WITHDRAWAL)}.`);
    if (value > balance) return setError("Kiasi kinazidi balance yako.");
    withdraw(value, method, destination);
    setAmount("");
    setSuccess(`Withdrawal ya TZS ${formatTZS(value)} imeombwa kwa ${method}.`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="flex items-center gap-3 px-4 py-4 text-primary-foreground"
        style={{ background: "var(--gradient-brand)" }}
      >
        <Link to="/" aria-label="Rudi" className="rounded-full bg-white/20 p-2">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-extrabold tracking-tight">Withdraw Earnings</h1>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-16 pt-6">
        <section className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Balance inayopatikana
          </p>
          <p className="mt-1 text-3xl font-extrabold text-primary">TZS {formatTZS(balance)}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Kiasi cha chini cha withdrawal: TZS {formatTZS(MIN_WITHDRAWAL)}
          </p>
        </section>

        <form onSubmit={onSubmit} className="mt-5 space-y-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              {success}
            </p>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">Njia ya kutoa</span>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={INPUT}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">
              Namba ya simu / akaunti
            </span>
            <input
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="06XXXXXXXX"
              className={INPUT}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted-foreground">Kiasi (TZS)</span>
            <input
              required
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder={String(MIN_WITHDRAWAL)}
              className={INPUT}
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Wallet className="size-5" /> Toa Pesa
          </button>
        </form>

        {account.withdrawals.length > 0 && (
          <section className="mt-5 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-bold">Historia ya withdrawals</h2>
            <ul className="mt-3 space-y-3">
              {account.withdrawals.map((w) => (
                <li key={w.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold">TZS {formatTZS(w.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {w.method} • {w.destination} • {new Date(w.at).toLocaleString("en-GB")}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    Inachakatwa
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

const INPUT =
  "w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";
