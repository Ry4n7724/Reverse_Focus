// Globals the app expects from the browser/extension but the test runtime lacks.

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(index: number) { return [...this.data.keys()][index] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, String(value)); }
}

Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });

(globalThis as any).chrome = {
  storage: {
    local: {
      get: (_keys: unknown, cb?: (r: object) => void) => cb?.({}),
      set: (_items: unknown, cb?: () => void) => cb?.(),
      remove: (_keys: unknown, cb?: () => void) => cb?.(),
    },
  },
  tabs: {
    getCurrent: (cb: (tab?: { id: number }) => void) => cb(undefined),
    remove: () => { },
  },
};

if (!globalThis.matchMedia) {
  (globalThis as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => { },
    removeEventListener: () => { },
    addListener: () => { },
    removeListener: () => { },
  });
}
