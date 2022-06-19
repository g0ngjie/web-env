console.log("web env content.js")

// 在页面上插入代码
const script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", chrome.runtime.getURL("document.js"));
document.documentElement.appendChild(script);

const __ENV_DATA_KEY__ = window.location.host

script.addEventListener("load", () => {
    // 初始化发送给document的消息
    chrome.storage.local.get([__ENV_DATA_KEY__], (res) => {
        if (res[__ENV_DATA_KEY__]) {
            window.postMessage({
                type: "__init_envs",
                to: "document",
                value: res[__ENV_DATA_KEY__],
            });
        }
    })
});

function setStore(k, v) {
    chrome.storage.local.set({ [k]: v });
}

function syncEnv(env) {
    const host = window.location.host
    setStore(host, env);
}

// 接收background.js传来的信息，转发给document
chrome.runtime.onMessage.addListener((msg) => {
    console.log('content1获取vue传来的msg', msg)
    syncEnv(msg.value);
    postMessage({
        type: "__set_envs",
        to: "document",
        value: msg.value
    });
});
