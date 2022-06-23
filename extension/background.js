console.log("[debug]background ready:")

function noticeContent(type, value) {
    const typeFor = { set: '__set_envs', rm: '__remove_envs' }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: typeFor[type],
            to: "content",
            value,
        });
    });
}

// 接收传来的信息
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "__set_envs" && msg.to === "background") {
        console.log("[debug]接收__set_envs background-msg:", msg)
        noticeContent('set', msg.value)
    }

    if (msg.type === "__remove_envs" && msg.to === "background") {
        console.log("[debug]接收__remove_envs background-msg:", msg)
        noticeContent('rm', msg.value)
    }
});
