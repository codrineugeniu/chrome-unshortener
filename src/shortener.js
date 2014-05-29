function onContextMenuClick(info, tab) {
    chrome.tabs.executeScript(null, {
        file: "src/context.js"
    })

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            data: info
        })
    })
}

/**
 * Create a context menu which will only show up for links.
 */
chrome.contextMenus.create({
    "id":       "chrome-ext-unshorten-link",
    "title":    "Unshorten link",
    "type":     "normal",
    "contexts": ["link"],
    "onclick":  onContextMenuClick
})