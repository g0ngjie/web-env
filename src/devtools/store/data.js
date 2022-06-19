
import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { EnvFieldType } from "../common/enum";
import { useNotice } from "../hooks/chrome";
import { uuid } from "@alrale/common-lib";

export const useData = defineStore('data', () => {
    const tableData = ref([])
    // form data
    const form = ref({ title: '', description: '', globalKey: '', dynamicEnvs: [{ key: '', type: EnvFieldType.String, value: '' }] })
    // form env waring msg
    const envWarning = ref('')

    watch(() => [...tableData.value], () => {
        console.log("[debug]tableData.value:", tableData.value)
    })

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
            tableData.value[index] = { title, description, globalKey, dynamicEnvs, envs }
        } else {
            tableData.value.push({
                id: uuid(),
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
        form.value = { title: '', description: '', globalKey: '', dynamicEnvs: [{ key: '', type: EnvFieldType.String, value: '' }] }
        envWarning.value = ''
    }

    // delete table row
    const deleteRow = (index) => {
        tableData.value.splice(index, 1)
    }

    // edit table row
    const editRow = (index) => {
        const { id, title, description, globalKey, dynamicEnvs } = tableData.value[index]
        form.value = { id, title, description, globalKey, dynamicEnvs }
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
    }
})