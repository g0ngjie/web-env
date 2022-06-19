
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