
// content devtools 使用缓存KEY
const __ENV_HOST_KEY__ = window.location.host
// 环境变量KEY
const __ENV_CONTENT_KEY__ = `__ENV_CONTENT_KEY__${__ENV_HOST_KEY__}`

// 获取当前启用环境变量
export function useCurrentEnv() {
    return new Promise((resolve) => {
        chrome.storage?.local.get([__ENV_CONTENT_KEY__], (res) => {
            resolve(res[__ENV_CONTENT_KEY__] || {});
        })
    })
}