
import { ref, watch, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { EnvFieldType } from "../common/enum";
import { useNotice } from "../hooks/chrome";
import { uuid, typeIs } from "@alrale/common-lib";

const __ENV_DATA_KEY__ = "__ENV_DATA_KEY__"

// ref 对象转换成数组
function deepRefToList(ref) {
    return ref.map(env => {
        const target = {}
        Object.keys(env).map(key => {
            if (typeIs(env[key]) !== 'array') {
                target[key] = env[key]
            } else {
                const envs = deepRefToList(env[key])
                target[key] = envs
            }
        })
        return target
    })
}

// 同步数据
function syncEnv(list) {
    const data = deepRefToList(list)
    chrome.storage?.local.set({ [__ENV_DATA_KEY__]: data })
}

export const useData = defineStore('data', () => {
    const tableData = ref([])

    // 初始化加载
    onBeforeMount(() => {
        chrome.storage?.local.get([__ENV_DATA_KEY__], (res) => {
            if (res[__ENV_DATA_KEY__] && typeIs(res[__ENV_DATA_KEY__]) === 'array') {
                tableData.value = res[__ENV_DATA_KEY__]
            }
        })
    })

    // form data
    const form = ref({
        id: '', switchOn: false, title: '',
        description: '', globalKey: '',
        dynamicEnvs: [{ key: '', type: EnvFieldType.String, value: '' }]
    })
    // form env waring msg
    const envWarning = ref('')

    // 同步数据
    watch(() => [...tableData.value], () => syncEnv(tableData.value))

    const addEnv = () => {
        const bool = validateEnv()
        if (bool) form.value.dynamicEnvs.push({ key: '', type: EnvFieldType.String, value: '' })
    }
    const removeEnv = (index) => {
        form.value.dynamicEnvs.splice(index, 1)
    }
    // validate dynamicEnvs
    const validateEnv = () => {
        let bool = true
        const { dynamicEnvs } = form.value
        const len = dynamicEnvs.length
        if (
            dynamicEnvs[len - 1].key === '' ||
            dynamicEnvs[len - 1].value === ''
        ) {
            envWarning.value = 'Please fill in the complete environment variables'
            bool = false
        } else envWarning.value = ''
        return bool
    }
    // packaging environment variables
    const packagingEnv = () => {
        const { dynamicEnvs } = form.value
        let target
        dynamicEnvs.forEach(item => {
            const { type, key, value } = item
            switch (type) {
                case EnvFieldType.String:
                    target = { [key]: value }
                    break;
                case EnvFieldType.Number:
                    target = { [key]: +value }
                    break;
                case EnvFieldType.Boolean:
                    target = { [key]: { 'true': true, 'false': false }[value] }
                    break;
            }
        })
        return target
    }

    // form submit
    const submit = (isEdit) => {
        const { title, description, globalKey, dynamicEnvs } = form.value
        const envs = packagingEnv()
        if (isEdit) {
            const index = tableData.value.findIndex(item => item.id === form.value.id)
            tableData.value[index] = form.value
        } else {
            tableData.value.push({
                id: uuid(),
                switchOn: false,
                title,
                description,
                globalKey,
                dynamicEnvs,
            })
        }
        useNotice(globalKey, envs)
        formReset()
    }

    // form reset
    const formReset = () => {
        form.value = {
            id: '', switchOn: false, title: '',
            description: '', globalKey: '',
            dynamicEnvs: [{ key: '', type: EnvFieldType.String, value: '' }]
        }
        envWarning.value = ''
    }

    // delete table row
    const deleteRow = (index) => {
        tableData.value.splice(index, 1)
    }

    // edit table row
    const editRow = (index) => form.value = tableData.value[index]

    // edit switch
    const editSwitch = (index, bool) => {
        // 同步数据
        syncEnv(tableData.value)
        tableData.value[index].switchOn = bool
    }

    return {
        tableData,
        form,
        addEnv,
        removeEnv,
        envWarning,
        validateEnv,
        submit,
        formReset,
        deleteRow,
        editRow,
        editSwitch,
    }
})