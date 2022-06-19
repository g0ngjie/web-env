
import { ref, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { darkTheme, lightTheme } from "naive-ui";
import { Theme } from "../common/enum";

function setBg(color) {
    document.documentElement.style.setProperty('--web-env-main-color', color)
}

const __ENV_THEME_KEY__ = '__ENV_THEME_KEY__'

export const useTheme = defineStore('theme', () => {
    const theme = ref(lightTheme)
    const isDark = ref(false)

    // 同步主题
    const syncTheme = (theme) => chrome.storage?.local.set({ [__ENV_THEME_KEY__]: theme })

    // 初始化加载
    onBeforeMount(() => {
        chrome.storage?.local.get([__ENV_THEME_KEY__], (res) => {
            if (res[__ENV_THEME_KEY__] === Theme.Dark) {
                isDark.value = true
                setBg('rgba(24, 24, 28, .9)')
                theme.value = darkTheme
            }
        })
    })

    function setTheme(type) {
        const { Dark, Light } = Theme
        switch (type) {
            case Dark:
                syncTheme(Dark)
                isDark.value = true
                theme.value = darkTheme
                setBg('rgba(24, 24, 28, .9)');
                break;
            case Light:
                syncTheme(Light)
                isDark.value = false
                setBg('#ffffff');
                theme.value = lightTheme
                break;
        }
    }
    return { theme, isDark, setTheme }
})