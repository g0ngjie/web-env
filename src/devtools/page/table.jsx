import { defineComponent, computed } from "vue";
import {
  NDataTable,
  NButton,
  NSwitch,
  NSpace,
  createDiscreteApi,
} from "naive-ui";
import { useData } from "@devtools/store/data";
import { useTheme } from "@devtools/store/theme";
import { SyncType } from "@devtools/common/enum";

export default defineComponent({
  props: {
    openModal: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const createColumns = ({ delFn, editFn, switchFn, syncFn }) => [
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
      {
        title: "title",
        minWidth: "100",
        key: "title",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "globalKey",
        minWidth: "100",
        key: "globalKey",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "description",
        minWidth: "150",
        key: "description",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "options",
        width: "160",
        fixed: "right",
        render(row, index) {
          return (
            <>
              <NSpace>
                <NButton
                  ghost
                  size="tiny"
                  type="primary"
                  onClick={() => syncFn(row)}
                >
                  sync
                </NButton>
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

    const message = computed(() => {
      const discrete = createDiscreteApi(["message"], {
        configProviderProps: { theme: useTheme().theme },
      });
      return discrete.message;
    });

    const handleSyncShare = (row) => {
      const type = store.syncRow(row);
      switch (type) {
        case SyncType.Insert:
          message.value.success(`${row.title} to sync successfully`);
          break;
        case SyncType.Update:
          message.value.success(`${row.title} to change successfully`);
          break;
      }
    };

    return () => {
      return (
        <NDataTable
          size="small"
          bordered={false}
          striped
          loading={!store.tableLoaded}
          single-line={false}
          scroll-x={500}
          columns={createColumns({
            switchFn: (index, bool) => store.editSwitch(index, bool),
            delFn: (index) => store.deleteRow(index),
            editFn: (index) => {
              store.editRow(index);
              props.openModal();
            },
            syncFn: (row) => handleSyncShare(row),
          })}
          data={store.tableData}
        />
      );
    };
  },
});
