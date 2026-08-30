import { useEffect, useState } from "react";

export const STORAGE_KEY = "btfix.account.v1";
export const ACTIVATION_FEE = 14500;
export const CHATS_REQUIRED = 10;
export const MIN_WITHDRAWAL = 50000;
export const WELCOME_BONUS = 6000;

export type StoredUser = {
  name: string;
  username: string;
  phone: string;
  email: string;
  country: string;
  createdAt: string;
};

export type Withdrawal = {
  id: string;
  amount: number;
  method: string;
  destination: string;
  at: string;
};

export type Account = {
  user: StoredUser | null;
  paid: boolean;
  balance: number;
  bonus: number;
  /** profileId -> number of messages sent by the user */
  chats: Record<string, number>;
  /** profileIds that already paid out */
  paidChats: string[];
  withdrawals: Withdrawal[];
  /** profile the user picked before registering */
  pendingProfileId: number | null;
};

export const EMPTY_ACCOUNT: Account = {
  user: null,
  paid: false,
  balance: 0,
  bonus: WELCOME_BONUS,
  chats: {},
  paidChats: [],
  withdrawals: [],
  pendingProfileId: null,
};

const EVENT = "btfix-account-change";

export function loadAccount(): Account {
  if (typeof window === "undefined") return EMPTY_ACCOUNT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_ACCOUNT;
    return { ...EMPTY_ACCOUNT, ...(JSON.parse(raw) as Partial<Account>) };
  } catch {
    return EMPTY_ACCOUNT;
  }
}

export function saveAccount(next: Account): Account {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }
  return next;
}

export function updateAccount(fn: (a: Account) => Account): Account {
  return saveAccount(fn(loadAccount()));
}

/** Reactive read of the locally stored account. */
export function useAccount(): Account {
  const [account, setAccount] = useState<Account>(EMPTY_ACCOUNT);

  useEffect(() => {
    const sync = () => setAccount(loadAccount());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return account;
}

export function registerUser(user: Omit<StoredUser, "createdAt">, profileId: number | null) {
  return updateAccount((a) => ({
    ...a,
    user: { ...user, createdAt: new Date().toISOString() },
    pendingProfileId: profileId ?? a.pendingProfileId,
  }));
}

export function markPaid() {
  return updateAccount((a) => ({ ...a, paid: true }));
}

/**
 * Records one message in a chat. Once CHATS_REQUIRED messages are reached the
 * session earning is credited to the balance (only once per profile).
 */
export function recordChatMessage(profileId: number, earn: number) {
  return updateAccount((a) => {
    const key = String(profileId);
    const count = Math.min((a.chats[key] ?? 0) + 1, CHATS_REQUIRED);
    const done = count >= CHATS_REQUIRED && !a.paidChats.includes(key);
    return {
      ...a,
      chats: { ...a.chats, [key]: count },
      paidChats: done ? [...a.paidChats, key] : a.paidChats,
      balance: done ? a.balance + earn : a.balance,
    };
  });
}

export function withdraw(amount: number, method: string, destination: string) {
  return updateAccount((a) => ({
    ...a,
    balance: Math.max(0, a.balance - amount),
    withdrawals: [
      {
        id: `WD${Date.now().toString().slice(-8)}`,
        amount,
        method,
        destination,
        at: new Date().toISOString(),
      },
      ...a.withdrawals,
    ],
  }));
}
