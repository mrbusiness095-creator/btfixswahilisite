import { useState } from "react";
import { Headphones, X, Bot, Send } from "lucide-react";

type Msg = { from: "bot" | "me"; text: string };

const REPLIES = [
  "Karibu BTFIXSWAHILI! Unaweza kuanza kwa kufungua akaunti bure kisha kuchagua profile ya mgeni.",
  "Malipo yote yanaingia kwenye balance yako na unaweza kutoa kupitia M-Pesa, MoMo au benki.",
  "Activation ni ya mara moja tu — hakuna ada ya kila mwezi.",
];

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi 👋 I'm the BTFIXSWAHILI online assistant. How can I help you today?" },
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { from: "me", text },
      { from: "bot", text: REPLIES[prev.length % REPLIES.length]! },
    ]);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-40 flex h-[26rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div
            className="flex items-center gap-3 px-4 py-3 text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <div className="grid size-9 place-items-center rounded-full bg-white/20">
              <Bot className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Online Assistant</p>
              <p className="text-xs opacity-80">Typically replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "me"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "w-fit max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm text-foreground"
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Andika ujumbe..."
              className="min-w-0 flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Customer service"
        className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-brand)" }}
      >
        <Headphones className="size-5" />
        Customer Service
      </button>
    </>
  );
}
