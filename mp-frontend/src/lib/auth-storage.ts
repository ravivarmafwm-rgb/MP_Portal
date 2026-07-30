export interface StoredAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  role_slug: string;
  initials: string;
}

export function getStoredAuth(): {
  token: string | null;
  user: StoredAuthUser | null;
} {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem("mp_token");
    const raw = localStorage.getItem("mp_user");
    const user = raw ? (JSON.parse(raw) as StoredAuthUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function isStoredAuthenticated(): boolean {
  const { token, user } = getStoredAuth();
  return !!token && !!user;
}

export function clearStoredAuth(): void {
  localStorage.removeItem("mp_token");
  localStorage.removeItem("mp_user");
}

export function setStoredAuth(token: string, user: StoredAuthUser): void {
  localStorage.setItem("mp_token", token);
  localStorage.setItem("mp_user", JSON.stringify(user));
}

const INACTIVITY_MS = 30 * 60 * 1000;
let lastActivity = Date.now();

export function touchActivity(): void {
  lastActivity = Date.now();
}

export function isSessionExpired(): boolean {
  return Date.now() - lastActivity > INACTIVITY_MS;
}

export function initActivityTracking(onExpire: () => void): () => void {
  const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
  const handler = () => touchActivity();
  events.forEach((e) => window.addEventListener(e, handler, { passive: true }));

  const interval = window.setInterval(() => {
    if (isSessionExpired()) onExpire();
  }, 60_000);

  return () => {
    events.forEach((e) => window.removeEventListener(e, handler));
    clearInterval(interval);
  };
}
