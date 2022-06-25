import { defineComponent, ref, onMounted } from "vue";
import { NSwitch, NEmpty, NScrollbar } from "naive-ui";
import {
  useCurrentTab,
  useGetHost,
  useChromeLocalEnv,
  useChromeSyncLocalEnv,
  useNoticeEnv,
  useNoticeCleanAllEnv,
  useChromeLocalDashboardStatus,
  useNoticeUpdateDashboard,
} from "@popups/hooks/chrome";
import styl from "./app.module.scss";
import { deepOClone } from "@alrale/common-lib";
import CleanIcon from "./icon/clean";
import Dashboard from "./icon/dashboard";

// 本地数据
let __ENV_DATA_KEY__ = "__ENV_DATA_KEY__";

export default defineComponent({
  setup() {
    const list = ref([]);
    const dashboardStatus = ref(false);

    onMounted(async () => {
      const { url, highlighted } = await useCurrentTab();
      if (!url) return;
      const host = useGetHost(url);
      __ENV_DATA_KEY__ = `__ENV_DATA_KEY__${host}`;
      const localData = await useChromeLocalEnv(__ENV_DATA_KEY__);
      list.value = localData;
      // 仪表盘状态
      dashboardStatus.value = await useChromeLocalDashboardStatus();
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
      // 选中颜色 #13c2c2
      // 未选中颜色 #f5222d
      if (checked) {
        style.background = "#13c2c2";
        if (focused) {
          style.boxShadow = "0 0 0 2px #13c2c240";
        }
      } else {
        style.background = "#f5222d";
        if (focused) {
          style.boxShadow = "0 0 0 2px #f5222d40";
        }
      }
      return style;
    };

    // 变更仪表盘状态
    const handleUpdateDashboard = () => {
      const bool = !dashboardStatus.value;
      dashboardStatus.value = bool;
      useNoticeUpdateDashboard(bool);
    };

    return () => {
      return (
        <div class={styl.container}>
          {list.value.length > 0 && (
            <>
              <div class={[styl.row, styl.options]} onClick={handleCleanFn}>
                <CleanIcon />
                <span>Clear all environment variables</span>
              </div>
              <div
                class={[styl.row, styl.options]}
                onClick={handleUpdateDashboard}
              >
                <Dashboard />
                <span class={{ [styl.noUnderline]: !dashboardStatus.value }}>
                  Dashboard Status
                </span>
              </div>
              <NScrollbar>
                {list.value.map((env) => {
                  return (
                    <div class={styl.row}>
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
                    </div>
                  );
                })}
              </NScrollbar>
            </>
          )}
          {list.value.length === 0 && (
            <NEmpty class={styl.empty}>There's nothing here.</NEmpty>
          )}
        </div>
      );
    };
  },
});
