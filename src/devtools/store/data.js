
import { ref } from "vue";
import { defineStore } from "pinia";
import { tableData as list } from "./mock";

export const useData = defineStore('data', () => {
    // TODO: mock data
    const tableData = ref(list)
    // form data
    const form = ref({ title: '', description: '', env: null })

    return { tableData, form }
})