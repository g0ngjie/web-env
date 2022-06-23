import { EnvFieldType } from "./enum"

// packaging environment variables
export const packagingEnv = (envs) => {
    let target = {}
    envs.forEach(item => {
        const { type, key, value } = item
        switch (type) {
            case EnvFieldType.String:
                target[key] = value
                break;
            case EnvFieldType.Number:
                target[key] = +value
                break;
            case EnvFieldType.Boolean:
                target[key] = { 'true': true, 'false': false }[value]
                break;
        }
    })
    return target
}