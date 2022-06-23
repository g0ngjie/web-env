import { defineComponent, ref, onMounted } from "vue";
import { NSwitch, NSpace, NEmpty } from "naive-ui";
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

    const railStyle = ({ focused, checked }) => {
      const style = {};
      if (checked) {
        style.background = "#2080f0";
        if (focused) {
          style.boxShadow = "0 0 0 2px #2080f040";
        }
      } else {
        style.background = "#d03050";
        if (focused) {
          style.boxShadow = "0 0 0 2px #d0305040";
        }
      }
      return style;
    };

    return () => {
      return (
        <div class={styl.container}>
          {list.value.length > 0 && <CleanIcon onClick={handleCleanFn} />}
          <NSpace vertical size="small">
            {list.value.map((env) => {
              return (
                <NSwitch
                  size="small"
                  v-model:value={env.switchOn}
                  rail-style={railStyle}
                  round={false}
                  onUpdate:value={() => handleSwitchFn(env)}
                >
                  {{
                    checked: () => (
                      <span
                        title={env.title}
                        style={{ maxWidth: "170px" }}
                        class={styl.label}
                      >
                        {env.title}
                      </span>
                    ),
                    unchecked: () => (
                      <span
                        title={env.title}
                        style={{ maxWidth: "170px" }}
                        class={styl.label}
                      >
                        {env.title}
                      </span>
                    ),
                  }}
                </NSwitch>
              );
            })}
          </NSpace>
          {list.value.length === 0 && (
            <NEmpty class={styl.empty}>There's nothing here.</NEmpty>
          )}
        </div>
      );
    };
  },
});
