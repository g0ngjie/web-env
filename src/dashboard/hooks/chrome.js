
// 获取当前启用环境变量
export function useCurrentEnv() {
    return new Promise((resolve) => {
        window.addEventListener(
            "message",
            (event) => {
                const data = event.data;
                if (data.type === "__init_envs" && data.to === "document") {
                    resolve(data.value);
                }
            },
            false
        );
    })
}