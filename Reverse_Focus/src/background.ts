import { db } from "./app/session-database/session-db";

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return;

    const sessions = await db.sessionDB.toArray();

    for (const session of sessions) {
        if (
            session.active &&
            !session.urls.some(url => details.url.includes(url))
            && details.url !== "chrome://newtab/"
        ) {
            chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL("index.html#blocker")
            });
            return;
        }
    }
});