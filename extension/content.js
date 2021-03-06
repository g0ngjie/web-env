// console.log("web env content.js")

// 仪表盘
const __ENV_LOCAL_DASHBOARD__ = "__ENV_LOCAL_DASHBOARD__"
function getDashboardStatus() {
    return new Promise((resolve) => {
        chrome.storage.local.get([__ENV_LOCAL_DASHBOARD__], (res) => {
            resolve(res[__ENV_LOCAL_DASHBOARD__] || false);
        })
    })
}
// 当前仪表盘
let dashboardEl = null
function mountDashboard() {
    dashboardEl = document.createElement("env-dashboard")
    document.documentElement.appendChild(dashboardEl);
}
// 添加仪表盘
const dashboard = document.createElement("script");
dashboard.setAttribute("type", "text/javascript");
dashboard.setAttribute("src", chrome.runtime.getURL("dashboard/dashboard.umd.js"));
document.documentElement.appendChild(dashboard);
dashboard.addEventListener("load", async () => {
    const bool = await getDashboardStatus()
    if (bool) mountDashboard()
})

// 在页面上插入代码
const script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", chrome.runtime.getURL("document.js"));
document.documentElement.appendChild(script);

// content devtools 使用缓存KEY
const __ENV_HOST_KEY__ = window.location.host
// 环境变量KEY
const __ENV_CONTENT_KEY__ = `__ENV_CONTENT_KEY__${__ENV_HOST_KEY__}`

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
    // console.log('content获取通过background传来的vue的msg', msg)

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
        setStore(__ENV_CONTENT_KEY__, {})
        postMessage({
            type: "__remove_envs",
            to: "document",
            value: msg.value
        })
    }
    // popups 通知环境变量变更
    if (msg.type === "__popups_change_env" && msg.to === "content") {
        mergeEnvStore(msg.value)
        const isConfirm = window.confirm("The env has changed, is it refreshed?")
        if (isConfirm) window.location.reload()
    }
    // popups 通知环境变量全部清除
    if (msg.type === "__popups_clean_env" && msg.to === "content") {
        setStore(__ENV_CONTENT_KEY__, {})
        const isConfirm = window.confirm("The environment has been cleaned, is it refreshed?")
        if (isConfirm) window.location.reload()
    }
    // 仪表盘状态变更
    if (msg.type === "__popups_sync_dashboard" && msg.to === "content") {
        if (msg.value) {
            // 初始化环境变量
            getEnvStore().then(envs => {
                // 发送给document的消息
                window.postMessage({
                    type: "__init_dashboard_envs",
                    to: "dashboard",
                    value: envs,
                });
                mountDashboard()
            })
        } else {
            dashboardEl && dashboardEl.parentNode.removeChild(dashboardEl)
        }
    }
});
