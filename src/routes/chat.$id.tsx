import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Wallet } from "lucide-react";
import {
  CHATS_REQUIRED,
  MIN_WITHDRAWAL,
  recordChatMessage,
  useAccount,
} from "@/lib/account";
import { PROFILES, formatTZS } from "@/lib/profiles";

const TITLE = "Chat — BTFIXSWAHILI";
const DESCRIPTION =
  "Chati na mgeni uliyemchagua. Fikisha chat 10 kwenye session hii ili malipo yako yaingie kwenye balance yako.";

export const Route = createFileRoute("/chat/$id")({
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
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

type Msg = { from: "them" | "me"; text: string };

const REPLIES = [
  "That's really interesting! Tell me more 😊",
  "Your English is great, I love chatting with you.",
  "Haha, that made me smile. What else do you do for fun?",
  "I've always wanted to visit Tanzania. What's the best place?",
  "How is the weather there today?",
  "You're a great listener, thank you.",
  "Please teach me a Swahili word 🙏",
  "I appreciate your time, this is worth it.",
  "Let's keep talking, I'm enjoying this.",
  "Thanks for the lovely session! 💜",
];

function ChatPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const account = useAccount();
  const [hydrated, setHydrated] = useState(false);
  const profile = PROFILES.find((p) => String(p.id) === id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (profile) setMessages([{ from: "them", text: `Hi! I'm ${profile.name}. ${profile.wants} — shall we start? 😊` }]);
  }, [profile]);

  useEffect(() => {
    if (hydrated && !account.paid) {
      navigate({ to: "/register", search: { profile: Number(id) } });
    }
  }, [hydrated, account.paid, id, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold">Profile haipatikani</h1>
          <Link to="/" className="mt-3 inline-block font-bold text-primary">
            Rudi mwanzo
          </Link>
        </div>
      </main>
    );
  }

  const count = account.chats[id] ?? 0;
  const completed = count >= CHATS_REQUIRED;

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || completed) return;
    setInput("");
    const reply = REPLIES[Math.min(count, REPLIES.length - 1)]!;
    setMessages((m) => [...m, { from: "me", text: trimmed }, { from: "them", text: reply }]);
    recordChatMessage(profile!.id, profile!.earn);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header
        className="flex items-center gap-3 px-4 py-3 text-primary-foreground"
        style={{ background: "var(--gradient-brand)" }}
      >
        <Link to="/" aria-label="Rudi" className="rounded-full bg-white/20 p-2">
          <ArrowLeft className="size-5" />
        </Link>
        <img
          src={profile.avatar}
          alt={profile.name}
          loading="lazy"
          className="size-11 rounded-full border-2 border-white/40 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{profile.name}</p>
          <p className="truncate text-xs opacity-85">
            {profile.flag} {profile.country} • 🟢 {profile.status}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide opacity-80">Balance</p>
          <p className="text-sm font-extrabold">TZS {formatTZS(account.balance)}</p>
        </div>
      </header>

      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>
            Chat {Math.min(count, CHATS_REQUIRED)}/{CHATS_REQUIRED}
          </span>
          <span className="text-primary">Malipo: TZS {formatTZS(profile.earn)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(Math.min(count, CHATS_REQUIRED) / CHATS_REQUIRED) * 100}%`,
              background: "var(--gradient-brand)",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {completed
            ? `Session imekamilika — TZS ${formatTZS(profile.earn)} imeingia kwenye balance yako.`
            : `Tuma chat ${CHATS_REQUIRED - count} zaidi ili ulipwe kwa session hii.`}
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.from === "me"
                ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                : "w-fit max-w-[85%] rounded-2xl bg-card px-3.5 py-2.5 text-sm shadow-[var(--shadow-card)]"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      {completed ? (
        <div className="space-y-3 border-t border-border bg-card p-4">
          <p className="text-center text-sm font-semibold">
            Umefikisha chat {CHATS_REQUIRED} — umelipwa TZS {formatTZS(profile.earn)} 🎉
          </p>
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm font-bold"
            >
              Chagua mgeni mwingine
            </Link>
            <Link
              to="/withdraw"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Wallet className="size-4" /> Withdraw
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Withdrawal inaanza kutoka TZS {formatTZS(MIN_WITHDRAWAL)}.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border bg-card p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Andika ujumbe wako..."
            className="min-w-0 flex-1 rounded-full bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            aria-label="Tuma"
            className="grid size-11 shrink-0 place-items-center rounded-full text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
