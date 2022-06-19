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
    const isEdit = ref(false);
    const openModal = (bool) => {
      showSetting.value = true;
      isEdit.value = bool;
    };

    return () => {
      return (
        <NConfigProvider theme={store.theme}>
          <div class={styl.container}>
            <NSpace justify="space-between" style={{ marginBottom: "10px" }}>
              <NButton
                size="tiny"
                type="primary"
                ghost
                onClick={() => openModal(false)}
              >
                create
              </NButton>
              <ThemeIcon />
            </NSpace>
            <Table openModal={() => openModal(true)} />
            <Setting
              visible={showSetting}
              isEdit={isEdit}
              onClose={() => (showSetting.value = false)}
            />
          </div>
        </NConfigProvider>
      );
    };
  },
});
