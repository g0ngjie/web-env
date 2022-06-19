const targetWindow = window

const merge = Object.assign
const isObject = (target) => Object.prototype.toString.call(target) === '[object Object]'

// dynamic set window env
const setDynamicEnv = (index = 0, arr = [], envs, target = targetWindow) => {
    const key = arr[index]
    if (index < arr.length - 1) {
        if (target[key] === undefined) {
            target[key] = {}
        }
        setDynamicEnv(index + 1, arr, envs, target[key])
    } else {
        if (target[key] === undefined) {
            target[key] = envs
        } else {
            if (isObject(envs))
                target[key] = merge(target[key], envs)
            else target[key] = envs
        }
    }
}

// set window env
const setWindowEnv = (globalKey, envs = {}) => {
    if (globalKey) {
        const arr = globalKey.split('.')
        setDynamicEnv(0, arr, envs, targetWindow)
    } else {
        Object.keys(envs).forEach(key => {
            setDynamicEnv(0, [key], envs[key], targetWindow)
        })
    }
}

window.addEventListener(
    "message",
    (event) => {
        const data = event.data;
        if (data.type === "__set_envs" && data.to === "document") {
            console.log("[debug]document: data:", data)
            setWindowEnv(data.value.globalKey, data.value.envs)
        }
    },
    false
);