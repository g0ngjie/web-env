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
  props: {
    openModal: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const message = computed(() => {
      const discrete = createDiscreteApi(["message"], {
        configProviderProps: { theme: useTheme().theme },
      });
      return discrete.message;
    });
    const createColumns = ({ delFn, editFn, switchFn }) => [
      {
        title: "switch",
        width: "70",
        render: (row, index) => (
          <NSwitch
            size="small"
            v-model:value={row.switchOn}
            round={false}
            onUpdate:value={(bool) => switchFn(index, bool)}
          />
        ),
      },
      { title: "title", minWidth: "100", key: "title" },
      { title: "globalKey", minWidth: "100", key: "globalKey" },
      { title: "description", minWidth: "150", key: "description" },
      {
        title: "options",
        width: "120",
        fixed: "right",
        render(_, index) {
          return (
            <>
              <NSpace>
                <NButton
                  ghost
                  size="tiny"
                  type="info"
                  onClick={() => editFn(index)}
                >
                  edit
                </NButton>
                <NButton
                  ghost
                  type="error"
                  size="tiny"
                  onClick={() => delFn(index)}
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
            switchFn: (index, bool) => store.editSwitch(index, bool),
            delFn: (index) => store.deleteRow(index),
            editFn: (index) => {
              store.editRow(index);
              props.openModal();
            },
          })}
          data={store.tableData}
        />
      );
    };
  },
});
