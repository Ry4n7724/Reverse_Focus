chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId === 0) {
        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("index.html#blocker")
        });
    }
});
