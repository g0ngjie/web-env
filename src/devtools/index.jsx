import { defineComponent } from "vue";
import { NSpace, NButton, NConfigProvider } from "naive-ui";
import Table from "./table";
import ThemeIcon from "./icon/index";
import { useTheme } from "./store/theme";
import styl from "./index.module.scss";

export default defineComponent({
  setup() {
    const store = useTheme();

    return () => {
      return (
        <NConfigProvider theme={store.theme}>
          <div class={styl.container}>
            <NSpace justify="space-between">
              <NButton size="tiny" type="primary" ghost>
                add
              </NButton>
              <ThemeIcon />
            </NSpace>
            <Table />
          </div>
        </NConfigProvider>
      );
    };
  },
});
