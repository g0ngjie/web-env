import { defineComponent, computed } from "vue";
import {
  NDrawer,
  NDrawerContent,
  NButton,
  NDataTable,
  NDescriptions,
  NDescriptionsItem,
  createDiscreteApi,
} from "naive-ui";
import { useData } from "./store/data";
import { useTheme } from "./store/theme";
import { SyncType } from "./common/enum";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useData();

    const createColumns = ({ useFn }) => [
      {
        type: "expand",
        renderExpand: (row) => {
          return (
            <NDescriptions column={3} size="small" label-placement="left">
              {row.dynamicEnvs.map((item) => (
                <>
                  <NDescriptionsItem label="key">{item.key}</NDescriptionsItem>
                  <NDescriptionsItem label="type">
                    {item.type}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="value">
                    {item.value}
                  </NDescriptionsItem>
                </>
              ))}
            </NDescriptions>
          );
        },
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
        width: "70",
        fixed: "right",
        render(row) {
          return (
            <>
              <NSpace>
                <NButton
                  ghost
                  size="tiny"
                  type="primary"
                  onClick={() => useFn(row)}
                >
                  use
                </NButton>
              </NSpace>
            </>
          );
        },
      },
    ];

    const message = computed(() => {
      const discrete = createDiscreteApi(["message"], {
        configProviderProps: { theme: useTheme().theme },
      });
      return discrete.message;
    });

    const useCurrent = (row) => {
      const type = store.useShareRow(row);
      switch (type) {
        case SyncType.Insert:
          message.value.success(`use ${row.title} success`);
          break;
        case SyncType.Update:
          message.value.success(`local data ${row.title} to change`);
          break;
      }
      props.visible.value = false;
    };

    return () => {
      return (
        <NDrawer
          width="99%"
          placement="left"
          v-model:show={props.visible.value}
          on-esc={() => (props.visible.value = false)}
        >
          <NDrawerContent title="materials" closable>
            <NDataTable
              size="small"
              bordered={false}
              striped
              single-line={false}
              scroll-x={500}
              columns={createColumns({
                useFn: (row) => useCurrent(row),
              })}
              rowKey={(row) => row.id}
              data={store.syncTableData}
            />
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
