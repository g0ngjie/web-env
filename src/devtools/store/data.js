
import { ref, watch, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { EnvFieldType, SyncType } from "../common/enum";
import { useNoticeEnv, useNoticeRmEnv, usePageHost } from "../hooks/chrome";
import { uuid, typeIs } from "@alrale/common-lib";
import { deepOClone } from "@alrale/common-lib";

let __ENV_DATA_KEY__ = "__ENV_DATA_KEY__"
const __ENV_SYNC_DATA__ = "__ENV_SYNC_DATA__"

// 同步数据
function syncEnv(list) {
    const data = deepOClone(list)
    chrome.storage?.local.set({ [__ENV_DATA_KEY__]: data })
}

// 同步共享数据
function syncEnvShare(list) {
    const data = deepOClone(list)
    chrome.storage?.sync.set({ [__ENV_SYNC_DATA__]: data })
}

export const useData = defineStore('data', () => {
    const tableData = ref([])
    // 共享环境数据
    const syncTableData = ref([])

    // 初始化加载
    onBeforeMount(async () => {
        const getHost = await usePageHost()
        __ENV_DATA_KEY__ = `__ENV_DATA_KEY__${getHost}`
        chrome.storage?.local.get([__ENV_DATA_KEY__], (res) => {
            if (res[__ENV_DATA_KEY__] && typeIs(res[__ENV_DATA_KEY__]) === 'array') {
                tableData.value = res[__ENV_DATA_KEY__]
            }
        })
        chrome.storage?.sync.get([__ENV_SYNC_DATA__], (res) => {
            if (res[__ENV_SYNC_DATA__] && typeIs(res[__ENV_SYNC_DATA__]) === 'array') {
                syncTableData.value = res[__ENV_SYNC_DATA__]
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
    watch(() => [...syncTableData.value], () => syncEnvShare(syncTableData.value))

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
    const packagingEnv = (envs) => {
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

    // form submit
    const submit = (isEdit) => {
        const { title, description, globalKey, dynamicEnvs } = form.value
        if (isEdit) {
            const index = tableData.value.findIndex(item => item.id === form.value.id)
            // reset switchOn
            form.value.switchOn = false
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
        const current = tableData.value[index]
        const envs = packagingEnv(current.dynamicEnvs)
        useNoticeRmEnv(current.globalKey, envs)
        tableData.value.splice(index, 1)
    }

    // edit table row
    const editRow = (index) => {
        const target = tableData.value[index]
        form.value = deepOClone(target)
    }

    // edit switch
    const editSwitch = (index, bool) => {
        // 同步数据
        syncEnv(tableData.value)
        tableData.value[index].switchOn = bool
        const current = tableData.value[index]
        const envs = packagingEnv(current.dynamicEnvs)
        useNoticeEnv(current.globalKey, envs, bool)
    }

    // clean all env
    const cleanAllEnv = () => {
        for (let i = 0; i < tableData.value.length; i++) {
            const item = tableData.value[i];
            item.switchOn = false
            const envs = packagingEnv(item.dynamicEnvs)
            useNoticeRmEnv(item.globalKey, envs)
        }
        // 同步数据
        syncEnv(tableData.value)
    }

    // 同步数据到共享环境
    const syncRow = (row) => {
        // 数据克隆
        const data = deepOClone(row)
        data.switchOn = false
        // 判断是否存在
        const index = syncTableData.value.findIndex(item => item.id === data.id)
        // 如果存在则替换
        if (index > -1) {
            syncTableData.value[index] = data
            return SyncType.Update
        } else {
            syncTableData.value.push(data)
            return SyncType.Insert
        }
    }

    // 共享环境数据使用
    const useShareRow = (row) => {
        // 数据克隆
        const data = JSON.parse(JSON.stringify(row))
        // 判断是否存在
        const index = tableData.value.findIndex(item => item.id === data.id)
        // 如果存在则替换
        if (index > -1) {
            tableData.value[index] = data
            return SyncType.Update
        } else {
            tableData.value.push(data)
            return SyncType.Insert
        }
    }

    // 共享环境数据移除
    const useShareRmRow = (index) => {
        syncTableData.value.splice(index, 1)
    }

    return {
        tableData,
        syncTableData,
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
        cleanAllEnv,
        syncRow,
        useShareRow,
        useShareRmRow,
    }
})