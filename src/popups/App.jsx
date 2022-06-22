import { defineComponent, ref, onMounted } from "vue";
import { NSwitch } from "naive-ui";
import {
  useCurrentTab,
  useGetHost,
  useChromeLocalEnv,
} from "@popups/hooks/chrome";
import styl from "./app.module.scss";

// 本地数据
let __ENV_DATA_KEY__ = "__ENV_DATA_KEY__";

export default defineComponent({
  setup() {
    onMounted(async () => {
      const { url, highlighted } = await useCurrentTab();
      if (!url) return;
      const host = useGetHost(url);
      __ENV_DATA_KEY__ = `__ENV_DATA_KEY__${host}`;
      const localData = await useChromeLocalEnv(__ENV_DATA_KEY__);
      alert(JSON.stringify(localData));
    });
    const switchOh = ref(false);
    return () => {
      return (
        <div class={styl.container}>
          <NSwitch size="small" v-model:value={switchOh.value} round={false} />
        </div>
      );
    };
  },
});
