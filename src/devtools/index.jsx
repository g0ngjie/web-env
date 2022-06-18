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
    const openModal = () => {
      showSetting.value = true;
    };

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
                create
              </NButton>
              <ThemeIcon />
            </NSpace>
            <Table openModal={openModal} />
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
