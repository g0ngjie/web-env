console.log("web env content.js")

// 在页面上插入代码
const script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", chrome.runtime.getURL("document.js"));
document.documentElement.appendChild(script);

const __ENV_CONTENT_KEY__ = '__ENV_CONTENT_KEY__'

script.addEventListener("load", async () => {
    // 初始化环境变量
    const getEnvs = await getEnvStore()
    // 发送给document的消息
    window.postMessage({
        type: "__init_envs",
        to: "document",
        value: getEnvs,
    });
});

function setStore(k, v) {
    chrome.storage.local.set({ [k]: v });
}

function getEnvStore() {
    return new Promise((resolve) => {
        chrome.storage.local.get([__ENV_CONTENT_KEY__], (res) => {
            resolve(res[__ENV_CONTENT_KEY__] || {});
        })
    })
}

async function mergeEnvStore(data) {
    const { globalKey, envs, bool: enable } = data
    const getEnvs = await getEnvStore()
    if (enable) {
        const newEnvs = { ...getEnvs, [globalKey]: envs }
        setStore(__ENV_CONTENT_KEY__, newEnvs)
    } else {
        const newEnvs = { ...getEnvs }
        delete newEnvs[globalKey]
        setStore(__ENV_CONTENT_KEY__, newEnvs)
    }
}

// 接收background.js传来的信息，转发给document
chrome.runtime.onMessage.addListener((msg) => {
    console.log('content获取通过background传来的vue的msg', msg)

    if (msg.type === "__set_envs" && msg.to === "content") {
        // 同步数据
        mergeEnvStore(msg.value)
        postMessage({
            type: "__set_envs",
            to: "document",
            value: msg.value
        });
    }
    if (msg.type === "__remove_envs" && msg.to === "content") {
        // 同步数据
        mergeEnvStore({ ...msg.value, bool: false })
        postMessage({
            type: "__remove_envs",
            to: "document",
            value: msg.value
        })
    }
});
