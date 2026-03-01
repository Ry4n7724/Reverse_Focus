import { db } from "./shared/session-db.js";

chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.frameId !== 0) return;

    const sessions = await db.sessionDB.toArray();

    for (const session of sessions) {
        if (
            session.active &&
            session.urls.some(url => details.url.includes(url))
        ) {
            await chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL("index.html#blocker")
            });
            return;
        }
    }
});