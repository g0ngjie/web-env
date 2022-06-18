import { defineComponent } from "vue";
import {
  NDataTable,
  NButton,
  createDiscreteApi,
  NSwitch,
  NSpace,
} from "naive-ui";
import { tableData } from "./hooks/index";

const { message } = createDiscreteApi(["message"]);
export default defineComponent({
  setup() {
    const createColumns = ({ play }) => [
      {
        title: "switch",
        width: "100",
        render: (row) => (
          <NSwitch
            size="small"
            v-model:value={row.switch}
            round={false}
            onClick={() => play(row)}
          />
        ),
      },
      { title: "title", key: "title" },
      { title: "description", key: "description" },
      {
        title: "options",
        width: "150",
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
          data={tableData}
        />
      );
    };
  },
});
