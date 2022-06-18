console.log("web env content.js")

// 在页面上插入代码
const script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", chrome.runtime.getURL("document.js"));
document.documentElement.appendChild(script);

script.addEventListener("load", () => {
    // 初始化发送给document的消息
    // postMessage({
    //     type: "__set_envs",
    //     to: "document",
    //     value: result.globalSwitchOn,
    // });
});

// 接收background.js传来的信息，转发给document
chrome.runtime.onMessage.addListener((msg) => {
    console.log('content1获取vue传来的msg', msg)
    postMessage({
        type: "__set_envs",
        to: "document",
        value: msg.value
    });
});
