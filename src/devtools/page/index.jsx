import { defineComponent, ref } from "vue";
import { NSpace, NButton, NConfigProvider } from "naive-ui";
import Table from "./table";
import ThemeIcon from "@devtools/icon/index";
import CleanIcon from "@devtools/icon/clean";
import { useTheme } from "@devtools/store/theme";
import Setting from "./setting";
import GlobalData from "./global";
import styl from "./index.module.scss";

export default defineComponent({
  setup() {
    const store = useTheme();
    const showSetting = ref(false);
    const showGlobal = ref(false);
    const isEdit = ref(false);
    const openModal = (bool) => {
      showSetting.value = true;
      isEdit.value = bool;
    };

    return () => {
      return (
        <NConfigProvider theme={store.theme}>
          <div class={styl.container}>
            <NSpace
              justify="space-between"
              style={{ marginBottom: "10px" }}
              wrap={false}
            >
              <div class={styl.btns}>
                <NButton
                  size="tiny"
                  type="primary"
                  ghost
                  onClick={() => openModal(false)}
                >
                  create
                </NButton>
                <NButton
                  size="tiny"
                  type="primary"
                  ghost
                  onClick={() => (showGlobal.value = true)}
                >
                  global
                </NButton>
              </div>
              <div class={styl.icons}>
                <CleanIcon />
                <ThemeIcon />
              </div>
            </NSpace>
            <Table openModal={() => openModal(true)} />
            <Setting visible={showSetting} isEdit={isEdit.value} />
            <GlobalData visible={showGlobal} />
          </div>
        </NConfigProvider>
      );
    };
  },
});
