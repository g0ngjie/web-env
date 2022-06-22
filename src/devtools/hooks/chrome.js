
// 环境变量变更
export function useNoticeEnv(globalKey, envs, bool) {
    chrome.runtime?.sendMessage({
        type: "__set_envs",
        to: "background",
        value: { globalKey, envs, bool }
    });
}

export function useNoticeRmEnv(globalKey, envs) {
    chrome.runtime?.sendMessage({
        type: "__remove_envs",
        to: "background",
        value: { globalKey, envs }
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