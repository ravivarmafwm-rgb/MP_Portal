const INACTIVITY_MS = 30 * 60 * 1000;
let lastActivity = Date.now();

export function clearLegacyAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("mp_token");
  localStorage.removeItem("mp_user");
}

export function touchActivity(): void {
  lastActivity = Date.now();
}

export function isSessionExpired(): boolean {
  return Date.now() - lastActivity > INACTIVITY_MS;
}

export function initActivityTracking(onExpire: () => void): () => void {
  const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
  const handler = () => touchActivity();
  events.forEach((event) =>
    window.addEventListener(event, handler, { passive: true }),
  );

  const interval = window.setInterval(() => {
    if (isSessionExpired()) onExpire();
  }, 60_000);

  return () => {
    events.forEach((event) => window.removeEventListener(event, handler));
    clearInterval(interval);
  };
}
