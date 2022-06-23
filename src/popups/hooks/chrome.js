import { packagingEnv } from "@/common/lib";
import { typeIs } from "@alrale/common-lib";

// 获取当前标签页
export function useCurrentTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const url = tabs[0].url;
            const title = tabs[0].title;
            const highlighted = tabs[0].highlighted;
            resolve({
                tab: tabs[0],
                url, title, highlighted
            })
        })
    })
}

/**
 * 截取完整字符串中的host
 * @param {String} url 地址
 * @returns {String} host
 */
export const useGetHost = (url) => {
    url = url.match(/https?:\/\/([^/]+)\//i);
    let domain = '';
    if (url && url[1]) {
        domain = url[1];
    }
    return domain;
};

// 本地数据列表获取
export function useChromeLocalEnv(key) {
    return new Promise(resolve => {
        chrome.storage.local.get([key], (res) => {
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

// 通信: 开关当前环境变量
export function useNoticeEnv(env) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const { url } = tabs[0]
        // 非访问tab页
        if (!url) return
        const { globalKey, dynamicEnvs, switchOn: bool } = env
        const envs = packagingEnv(dynamicEnvs)
        // popups 通知devtools数据已经便更
        chrome.runtime.sendMessage({
            type: "__popups_change_env",
            to: "devtools",
        });
        // 通知content页面数据刷新
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "__popups_change_env",
            to: "content",
            value: { globalKey, envs, bool }
        })
    });
}