import { db } from './app/session-database/session-db';
import { shouldBlock } from './app/session-database/should-block';

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;

  const { searchModeEnd } = (await chrome.storage.local.get('searchModeEnd')) as {
    searchModeEnd?: number;
  };
  const sessions = await db.sessionDB.toArray();

  if (!shouldBlock(details.url, sessions, searchModeEnd, Date.now())) return;

  await chrome.storage.local.set({ blockedUrl: details.url });
  await chrome.tabs.update(details.tabId, {
    url: chrome.runtime.getURL('index.html#blocker'),
  });
});
