import { defineComponent, computed } from "vue";
import {
  NDataTable,
  NButton,
  createDiscreteApi,
  NSwitch,
  NSpace,
} from "naive-ui";
import { useData } from "./store/data";
import { useTheme } from "./store/theme";

export default defineComponent({
  setup() {
    const message = computed(() => {
      const discrete = createDiscreteApi(["message"], {
        configProviderProps: { theme: useTheme().theme },
      });
      return discrete.message;
    });
    const createColumns = ({ play }) => [
      {
        title: "switch",
        width: "70",
        render: (row) => (
          <NSwitch
            size="small"
            v-model:value={row.switch}
            round={false}
            onClick={() => play(row)}
          />
        ),
      },
      { title: "globalKey", minWidth: "120", key: "globalKey" },
      { title: "title", minWidth: "200", key: "title" },
      { title: "description", minWidth: "200", key: "description" },
      {
        title: "options",
        width: "120",
        fixed: "right",
        render(row) {
          return (
            <>
              <NSpace>
                <NButton
                  ghost
                  size="tiny"
                  type="info"
                  onClick={() => play(row)}
                >
                  edit
                </NButton>
                <NButton
                  ghost
                  type="error"
                  size="tiny"
                  onClick={() => play(row)}
                >
                  delete
                </NButton>
              </NSpace>
            </>
          );
        },
      },
    ];

    const store = useData();

    return () => {
      return (
        <NDataTable
          size="small"
          bordered={false}
          striped
          single-line={false}
          scroll-x={500}
          columns={createColumns({
            play(row) {
              message.value.info(`Play ${row.title}`);
            },
          })}
          data={store.tableData}
        />
      );
    };
  },
});
