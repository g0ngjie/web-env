console.log("[debug]background ready:")

// 接收document传来的信息，转发给content
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "__set_envs" && msg.to === "background") {
        console.log("[debug]接收background-msg:", msg)

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "__set_envs",
                to: "content",
                value: msg.value,
            });
        });
    }
});
