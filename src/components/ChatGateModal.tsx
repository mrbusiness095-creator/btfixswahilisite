import { X, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { REGISTER_URL, formatTZS, type Profile } from "@/lib/profiles";

const BENEFITS = [
  "Earnings go directly to your account balance",
  "Withdraw to M-Pesa, MoMo, or bank anytime",
  "Track every earning in real-time",
  "One-time activation — no monthly fees",
];

export function ChatGateModal({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                loading="lazy"
                className="size-16 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-card bg-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <span aria-hidden>{profile.flag}</span>
                {profile.country}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <hr className="my-5 border-border" />

        <p className="text-sm text-muted-foreground">
          {profile.name} wants to connect with you
        </p>
        <h4 className="mt-1 text-2xl font-bold">Account Required to Chat</h4>

        <div className="mt-5 rounded-2xl bg-accent/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            You earn
          </p>
          <p className="mt-2 text-4xl font-extrabold text-primary">
            TZS {formatTZS(profile.earn)}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            They pay you • {profile.minutes} min session
          </p>
        </div>

        <ul className="mt-5 space-y-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <a
          href={REGISTER_URL}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-card)] transition-transform hover:scale-[1.01]"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Sparkles className="size-5" />
          Create Free Account
        </a>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Illustrative profile and earning information.
        </p>
      </div>
    </div>
  );
}
