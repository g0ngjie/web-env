
// 获取当前启用环境变量
export function useCurrentEnv() {
    return new Promise((resolve) => {
        window.addEventListener(
            "message",
            (event) => {
                const data = event.data;
                if (["__init_envs", "__init_dashboard_envs"].includes(data.type) && ["document", "dashboard"].includes(data.to)) {
                    resolve(data.value);
                }
            },
            false
        );
    })
}