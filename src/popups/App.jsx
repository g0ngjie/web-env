import { defineComponent, ref, onMounted } from "vue";
import { NSwitch, NSpace, NForm, NFormItem, NEllipsis } from "naive-ui";
import {
  useCurrentTab,
  useGetHost,
  useChromeLocalEnv,
  useNoticeEnv,
} from "@popups/hooks/chrome";
import styl from "./app.module.scss";

// 本地数据
let __ENV_DATA_KEY__ = "__ENV_DATA_KEY__";

export default defineComponent({
  setup() {
    const list = ref([]);
    onMounted(async () => {
      const { url, highlighted } = await useCurrentTab();
      if (!url) return;
      const host = useGetHost(url);
      __ENV_DATA_KEY__ = `__ENV_DATA_KEY__${host}`;
      const localData = await useChromeLocalEnv(__ENV_DATA_KEY__);
      list.value = localData;
    });

    const handleSwitchFn = (env) => {
      useNoticeEnv(env);
    };
    return () => {
      return (
        <div class={styl.container}>
          <NSpace vertical size="small">
            <NForm label-width="auto" size="small">
              {list.value.map((env) => {
                return (
                  <NEllipsis style={{ maxWidth: "170px" }}>
                    <NFormItem label={env.title}>
                      <NSwitch
                        size="small"
                        v-model:value={env.switchOn}
                        round={false}
                        onUpdate:value={() => handleSwitchFn(env)}
                      />
                    </NFormItem>
                  </NEllipsis>
                );
              })}
            </NForm>
          </NSpace>
        </div>
      );
    };
  },
});
