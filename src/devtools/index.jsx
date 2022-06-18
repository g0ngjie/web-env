import { defineComponent, ref } from "vue";
import { NSpace, NButton, NConfigProvider } from "naive-ui";
import Table from "./table";
import ThemeIcon from "./icon/index";
import { useTheme } from "./store/theme";
import Setting from "./setting";
import styl from "./index.module.scss";

export default defineComponent({
  setup() {
    const store = useTheme();
    const showSetting = ref(false);

    return () => {
      return (
        <NConfigProvider theme={store.theme}>
          <div class={styl.container}>
            <NSpace justify="space-between">
              <NButton
                size="tiny"
                type="primary"
                ghost
                onClick={() => (showSetting.value = true)}
              >
                add
              </NButton>
              <ThemeIcon />
            </NSpace>
            <Table />
            <Setting
              visible={showSetting}
              onClose={() => (showSetting.value = false)}
            />
          </div>
        </NConfigProvider>
      );
    };
  },
});
