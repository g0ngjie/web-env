import { defineComponent, ref, onMounted } from "vue";
import { NSwitch, NSpace, NForm, NFormItem, NEllipsis, NEmpty } from "naive-ui";
import {
  useCurrentTab,
  useGetHost,
  useChromeLocalEnv,
  useChromeSyncLocalEnv,
  useNoticeEnv,
  useNoticeCleanAllEnv,
} from "@popups/hooks/chrome";
import styl from "./app.module.scss";
import { deepOClone } from "@alrale/common-lib";
import CleanIcon from "./clean";

// 本地数据
let __ENV_DATA_KEY__ = "__ENV_DATA_KEY__";

const listData = [
  {
    id: "",
    switchOn: false,
    title: "",
    description: "",
    globalKey: "",
    dynamicEnvs: [{ key: "", type: "string", value: "" }],
  },
];
export default defineComponent({
  setup() {
    const list = ref([]);

    onMounted(async () => {
      const { url, highlighted } = await useCurrentTab();
      console.log(highlighted, "highlighted");
      if (!url) return;
      const host = useGetHost(url);
      __ENV_DATA_KEY__ = `__ENV_DATA_KEY__${host}`;
      const localData = await useChromeLocalEnv(__ENV_DATA_KEY__);
      list.value = localData;
    });
    // TODO:
    // list.value = listData;

    const handleSwitchFn = (env) => {
      // 更新本地数据
      const data = deepOClone(list.value);
      useChromeSyncLocalEnv(__ENV_DATA_KEY__, data);
      useNoticeEnv(env);
    };

    // 清理当前页面环境变量
    const handleCleanFn = () => {
      for (let i = 0; i < list.value.length; i++) {
        const item = list.value[i];
        item.switchOn = false;
      }
      const data = deepOClone(list.value);
      useChromeSyncLocalEnv(__ENV_DATA_KEY__, data);
      useNoticeCleanAllEnv();
    };

    return () => {
      return (
        <div class={styl.container}>
          {list.value.length > 0 && <CleanIcon onClick={handleCleanFn} />}
          <NForm label-width="auto" size="small">
            <NSpace vertical size="small">
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
            </NSpace>
          </NForm>
          {list.value.length === 0 && (
            <NEmpty class={styl.empty}>There's nothing here.</NEmpty>
          )}
        </div>
      );
    };
  },
});
