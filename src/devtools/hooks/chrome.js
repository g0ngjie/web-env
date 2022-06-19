
// 环境变量变更
export function useNoticeEnv(globalKey, envs, bool) {
    chrome.runtime?.sendMessage({
        type: "__set_envs",
        to: "background",
        value: { globalKey, envs, bool }
    });

    // chrome.runtime.sendMessage({ 'cmd': 'to_content' }, function () {
    //     console.log('调用成功')
    // })
}
