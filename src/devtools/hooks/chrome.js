import { typeIs } from "@alrale/common-lib";

// 通知: 环境变量变更
export function useNoticeEnv(globalKey, envs, bool) {
    chrome.runtime?.sendMessage({
        type: "__set_envs",
        to: "background",
        value: { globalKey, envs, bool }
    });
}

// 通知: 环境变量移除
export function useNoticeRmEnv(globalKey, envs) {
    chrome.runtime?.sendMessage({
        type: "__remove_envs",
        to: "background",
        value: { globalKey, envs }
    });
}

// 监听: popups变更本地环境
export function useListenerChange(fn) {
    chrome.runtime?.onMessage.addListener((msg, _, sendResponse) => {
        if (msg.type === "__popups_change_env" && msg.to === "devtools") {
            fn()
            sendResponse()
        }
    });
}

// 获取当前用户页面HOST
export function usePageHost() {
    return new Promise(resolve => {
        if (chrome.devtools) {
            chrome.devtools.inspectedWindow.eval('window.location.host', (host) => {
                resolve(host);
            });
        } else resolve('');
    })
}

// 主题
const __ENV_THEME_KEY__ = '__ENV_THEME_KEY__'
// 获取主题
export function useEnvTheme() {
    return new Promise(resolve => {
        chrome.storage?.sync.get([__ENV_THEME_KEY__], (res) => {
            resolve(res[__ENV_THEME_KEY__])
        })
    })
}

// 同步主题
export function useSyncEnvTheme(theme) {
    chrome.storage?.sync.set({ [__ENV_THEME_KEY__]: theme })
}

// 本地数据列表获取
export function useChromeLocalEnv(key) {
    return new Promise(resolve => {
        if (!chrome.storage) resolve([])
        chrome.storage?.local.get([key], (res) => {
            if (res[key] && typeIs(res[key]) === 'array') {
                resolve(res[key])
            } else resolve([])
        })
    })
}
// 本地数据列表同步
export function useChromeSyncLocalEnv(key, data) {
    chrome.storage?.local.set({ [key]: data })
}

// 共享数据
const __ENV_SYNC_DATA__ = "__ENV_SYNC_DATA__"
// 共享数据列表获取
export function useChromeShareEnv() {
    return new Promise(resolve => {
        chrome.storage?.sync.get([__ENV_SYNC_DATA__], (res) => {
            if (res[__ENV_SYNC_DATA__] && typeIs(res[__ENV_SYNC_DATA__]) === 'array') {
                resolve(res[__ENV_SYNC_DATA__])
            } else resolve([])
        })
    })
}
// 共享数据列表同步
export function useChromeSyncShareEnv(data) {
    chrome.storage?.sync.set({ [__ENV_SYNC_DATA__]: data })
}