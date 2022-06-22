
import { ref, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { darkTheme, lightTheme } from "naive-ui";
import { Theme } from "../common/enum";
import { useEnvTheme, useSyncEnvTheme } from "../hooks/chrome";

function setBg(color) {
    document.documentElement.style.setProperty('--web-env-main-color', color)
}

export const useTheme = defineStore('theme', () => {
    const theme = ref(lightTheme)
    const isDark = ref(false)

    // 初始化加载
    onBeforeMount(async () => {
        const getTheme = await useEnvTheme()
        if (getTheme === Theme.Dark) {
            isDark.value = true
            setBg('rgba(24, 24, 28, .9)')
            theme.value = darkTheme
        }
    })

    function setTheme(type) {
        const { Dark, Light } = Theme
        switch (type) {
            case Dark:
                // 同步主题
                useSyncEnvTheme(Dark)
                isDark.value = true
                theme.value = darkTheme
                setBg('rgba(24, 24, 28, .9)');
                break;
            case Light:
                // 同步主题
                useSyncEnvTheme(Light)
                isDark.value = false
                setBg('#ffffff');
                theme.value = lightTheme
                break;
        }
    }
    return { theme, isDark, setTheme }
})