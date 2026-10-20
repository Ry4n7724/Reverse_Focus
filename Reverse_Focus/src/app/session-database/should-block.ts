export interface BlockableSession {
  urls: string[];
  active: boolean;
}

const WEB_PROTOCOLS = ['http:', 'https:'];

function toHostname(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function hostMatches(host: string, allowed: string): boolean {
  return host === allowed || host.endsWith(`.${allowed}`);
}

/**
 * Decides whether a navigation should be redirected to the blocker page.
 * Only http(s) pages are ever blocked; extension, chrome:// and about: pages are left alone.
 * With several active sessions, a URL is allowed if any active session lists its host.
 */
export function shouldBlock(
  url: string,
  sessions: BlockableSession[],
  searchModeEnd: number | undefined,
  now: number,
): boolean {
  if (searchModeEnd && now < searchModeEnd) return false;

  const activeSessions = sessions.filter((s) => s.active);
  if (activeSessions.length === 0) return false;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (!WEB_PROTOCOLS.includes(parsed.protocol)) return false;

  const host = parsed.hostname.toLowerCase();
  const allowed = activeSessions
    .flatMap((s) => s.urls)
    .map(toHostname)
    .filter((h): h is string => h !== null);

  return !allowed.some((a) => hostMatches(host, a));
}
