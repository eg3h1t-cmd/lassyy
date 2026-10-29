export function runOncePerSession(key: string, fn: () => void) {
  if (typeof window === "undefined") return;
  try {
    const storageKey = `lassyy:${key}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
    fn();
  } catch {
    // sessionStorage may be unavailable (private mode / blocked storage).
  }
}