import { defineComponent } from "vue";
import {
  NDataTable,
  NButton,
  createDiscreteApi,
  NSwitch,
  NSpace,
} from "naive-ui";
import { useData } from "./store/data";

const { message } = createDiscreteApi(["message"]);
export default defineComponent({
  setup() {
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
              message.info(`Play ${row.title}`);
            },
          })}
          data={store.tableData}
        />
      );
    };
  },
});
