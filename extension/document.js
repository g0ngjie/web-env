// 只有这里才可以设置环境变量
const targetWindow = window

const merge = Object.assign
const isObject = (target) => Object.prototype.toString.call(target) === '[object Object]'

// dynamic set window env
const setDynamicEnv = (index = 0, keys = [], envs, target, isRemove) => {
    const key = keys[index]
    // globalKey env.a.b.c...
    if (index < keys.length - 1) {
        if (target[key] === undefined && !isRemove) {
            target[key] = {}
        }
        setDynamicEnv(index + 1, keys, envs, target[key], isRemove)
    } else {
        if (target[key] === undefined && !isRemove) {
            target[key] = envs
        } else {
            if (isRemove) {
                delete target[key]
                return
            }
            // envs => { a: 1, b: 2}
            if (isObject(envs)) target[key] = merge(target[key], envs)
            else target[key] = envs // envs => any assignable value
        }
    }
}

// set window env
const setWindowEnv = (globalKey, envs = {}, isRemove) => {
    if (globalKey) {
        const keys = globalKey.split('.')
        setDynamicEnv(0, keys, envs, targetWindow, isRemove)
    } else {
        Object.keys(envs).forEach(key => {
            setDynamicEnv(0, [key], envs[key], targetWindow, isRemove)
        })
    }
}

window.addEventListener(
    "message",
    (event) => {
        const data = event.data;
        if (data.type === "__set_envs" && data.to === "document") {
            // console.log("[debug]__set_envs document: data:", data.value)
            const { globalKey, envs, bool } = data.value
            setWindowEnv(globalKey, envs, !bool)
        }
        if (data.type === "__remove_envs" && data.to === "document") {
            // console.log("[debug]__remove_envs document: data:", data.value)
            const { globalKey, envs } = data.value
            setWindowEnv(globalKey, envs, true)
        }
        if (data.type === "__init_envs" && data.to === "document") {
            // console.log("[debug]__init_envs document: data:", data.value)
            Object.keys(data.value || {}).forEach(globalKey => {
                setWindowEnv(globalKey, data.value[globalKey], false)
            })
        }
    },
    false
);