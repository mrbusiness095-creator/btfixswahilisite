import { useEffect, useRef, useState } from "react";
import { X, Send, Headphones } from "lucide-react";
import agentAvatar from "@/assets/agent-avatar.jpg";
import { REGISTER_URL } from "@/lib/profiles";

type Msg = { from: "bot" | "me"; text: string };

const GREETING =
  "Karibu BTFIXSWAHILI 😊\nMimi ni AI Customer Assistant. Naweza kukusaidia kuhusu usajili, activation, earnings, na withdrawal. Uliza swali lolote!";

const QUICK = ["Jinsi ya kujisajili", "Activation ni kiasi gani?", "Malipwaje?"];

function answer(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("jisajili") || t.includes("account") || t.includes("register") || t.includes("kujiunga"))
    return `Malibu 😊 Hatua za kujiunga:\nBofya link: ${REGISTER_URL}\n1. Chagua foreigner anayelipa vizuri\n2. Bofya "Start Chat"\n3. Bofya "Create Account"\n4. Jaza taarifa zako zote\n5. Activate account yako mara moja tu\nBaada ya activation, account yako itafunguka na utaweza kuanza kutumia platform.\n\nJe, umefanikiwa kutengeneza account na kuanza kupokea malipo yako? 😊`;
  if (t.includes("activation") || t.includes("kiasi") || t.includes("ada") || t.includes("gharama"))
    return "Activation ni ada ya mara moja tu inayofungua account yako kikamilifu. Hakuna ada ya kila mwezi wala malipo mengine ya siri — baada ya activation unaanza kupokea malipo kutoka kwa foreigners mara moja. 💜";
  if (t.includes("malipo") || t.includes("lipwa") || t.includes("withdraw") || t.includes("pesa") || t.includes("m-pesa") || t.includes("mpesa"))
    return "Malipo yote ya chats zako yanaingia moja kwa moja kwenye balance yako na unaona earnings zako in real-time. Unaweza kutoa pesa wakati wowote kupitia M-Pesa, MoMo au benki — withdrawal ni ya haraka na bila kikomo cha chini. 💰";
  if (t.includes("foreigner") || t.includes("chat") || t.includes("mgeni"))
    return "Foreigners wengi wako online kila siku. Chagua profile yenye 'Active now', bofya 'Start Chat' kisha fungua account yako — wao hulipa kwa muda wako wa kuchati nao. 🌍";
  if (t.includes("bonus"))
    return "Welcome Bonus ya TZS 6,000 inapewa kwa account mpya baada ya kusajili. Kumbuka bonus haitolewi (not withdrawable) — ni ya kukuhimiza kuanza. 🎁";
  return "Asante kwa swali lako! 🙏 Naweza kukusaidia zaidi kuhusu:\n• Jinsi ya kujisajili\n• Activation ni kiasi gani\n• Malipwaje / Withdrawal\nChagua moja ya buttons chini au andika swali lako.";
}

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((prev) => [...prev, { from: "me", text: trimmed }, { from: "bot", text: answer(trimmed) }]);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-40 flex h-[30rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div
            className="flex items-center gap-3 px-4 py-3 text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <div className="relative">
              <img
                src={agentAvatar}
                alt="Customer assistant"
                width={512}
                height={512}
                className="size-10 rounded-full border-2 border-white/40 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white bg-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold tracking-wide">● ONLINE ASSISTANCE</p>
              <p className="text-xs opacity-85">AI Customer Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full bg-white/20 p-1.5">
              <X className="size-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "me"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "w-fit max-w-[85%] whitespace-pre-line rounded-2xl bg-muted px-3 py-2 text-sm text-foreground"
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-border px-3 py-2.5">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 rounded-full border border-primary/40 bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Andika swali lako..."
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
        className="fixed bottom-5 right-4 z-40 flex items-center gap-2.5 rounded-full py-2 pl-2 pr-5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-brand)" }}
      >
        <img
          src={agentAvatar}
          alt="Customer service agent"
          width={512}
          height={512}
          className="size-9 rounded-full border-2 border-white/50 object-cover"
        />
        Customer Service
        <Headphones className="size-4 opacity-70" />
      </button>
    </>
  );
}
