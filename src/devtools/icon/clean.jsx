import { defineComponent, computed } from "vue";
import { NIcon, createDiscreteApi } from "naive-ui";
import { useData } from "@devtools/store/data";
import { useTheme } from "@devtools/store/theme";
import styl from "./clean.module.scss";

export default defineComponent({
  setup() {
    const store = useData();

    const message = computed(() => {
      const discrete = createDiscreteApi(["message"], {
        configProviderProps: { theme: useTheme().theme },
      });
      return discrete.message;
    });
    const handleClick = () => {
      store.cleanAllEnv();
      message.value.success("Environment variables cleaned successfully!");
    };

    return () => {
      return (
        <>
          <NIcon size="17" class={styl.icon} onClick={handleClick}>
            <svg
              t="1655652303685"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5695"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="256"
              height="256"
            >
              <path
                d="M796.8 828.8a48.96 48.96 0 1 0 48.96 48.96 48.96 48.96 0 0 0-48.96-48.96z m146.56-113.92A48.96 48.96 0 1 0 992 763.52a48.96 48.96 0 0 0-48.96-48.64zM928 861.44a48.96 48.96 0 1 0 48.96 48.96A48.96 48.96 0 0 0 928 861.44z m-5.44-585.6L992 205.12 850.88 64l-70.72 70.72a66.56 66.56 0 0 0-94.08 0l235.2 235.2a66.56 66.56 0 0 0 0-94.08z m-853.12 128a32 32 0 0 0-32 50.24 1291.2 1291.2 0 0 0 75.2 112L288 551.68c19.84 0 24.64 21.44 8 36.8l-93.44 85.76a1281.6 1281.6 0 0 0 120 114.24l100.48-32c18.88-5.76 27.52 15.04 14.4 33.6l-39.68 55.36c25.92 18.56 53.44 36.16 82.24 53.12a89.28 89.28 0 0 0 114.56-20.48 1391.04 1391.04 0 0 0 256-485.44l-187.84-187.52s-305.6 224-594.56 198.4z"
                p-id="5696"
              ></path>
            </svg>
          </NIcon>
        </>
      );
    };
  },
});
