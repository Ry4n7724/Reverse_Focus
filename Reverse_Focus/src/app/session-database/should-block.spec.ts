import { describe, expect, it } from 'vitest';
import { shouldBlock } from './should-block';

const now = 1_000;
const session = (urls: string[], active = true) => ({ urls, active });

describe('shouldBlock', () => {
  it('does not block when no session is active', () => {
    expect(shouldBlock('https://a.com', [session(['b.com'], false)], undefined, now)).toBe(false);
  });

  it('does not block during search mode', () => {
    expect(shouldBlock('https://a.com', [session(['b.com'])], now + 1, now)).toBe(false);
  });

  it('blocks again once search mode has expired', () => {
    expect(shouldBlock('https://a.com', [session(['b.com'])], now - 1, now)).toBe(true);
  });

  it('allows a URL listed by any active session', () => {
    const sessions = [session(['a.com']), session(['b.com'])];
    expect(shouldBlock('https://a.com/x', sessions, undefined, now)).toBe(false);
    expect(shouldBlock('https://b.com/x', sessions, undefined, now)).toBe(false);
    expect(shouldBlock('https://c.com/x', sessions, undefined, now)).toBe(true);
  });

  it('accepts full URLs and subdomains in the allowlist', () => {
    expect(shouldBlock('https://www.a.com/p', [session(['https://a.com/'])], undefined, now)).toBe(
      false,
    );
  });

  it('is not fooled by the allowed domain appearing elsewhere in the URL', () => {
    const s = [session(['youtube.com'])];
    expect(shouldBlock('https://evil.com/?q=youtube.com', s, undefined, now)).toBe(true);
    expect(shouldBlock('https://notyoutube.com', s, undefined, now)).toBe(true);
  });

  it('never blocks non-web pages', () => {
    const s = [session(['a.com'])];
    expect(shouldBlock('chrome://newtab/', s, undefined, now)).toBe(false);
    expect(shouldBlock('chrome-extension://abc/index.html#blocker', s, undefined, now)).toBe(false);
    expect(shouldBlock('about:blank', s, undefined, now)).toBe(false);
  });
});
