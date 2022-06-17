
import { ref } from "vue";
import { defineStore } from "pinia";
import { darkTheme } from "naive-ui";
import { Theme } from "../common/enum";

function setBg(color) {
    document.documentElement.style.setProperty('--web-env-main-color', color)
}

export const useTheme = defineStore('theme', () => {
    const theme = ref(null)
    const isDark = ref(false)
    function setTheme(type) {
        const { Dark, Light } = Theme
        switch (type) {
            case Dark:
                isDark.value = true
                theme.value = darkTheme
                setBg('rgba(24, 24, 28, .9)');
                break;
            case Light:
                isDark.value = false
                setBg('#ffffff');
                theme.value = null
                break;
        }
    }
    return { theme, isDark, setTheme }
})