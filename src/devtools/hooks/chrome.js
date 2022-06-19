

export function useNotice(globalKey, envs) {
    chrome.runtime?.sendMessage({
        type: "__set_envs",
        to: "background",
        value: { globalKey, envs }
    });

    // chrome.runtime.sendMessage({ 'cmd': 'to_content' }, function () {
    //     console.log('调用成功')
    // })
}
