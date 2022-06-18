import { defineComponent } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    return () => {
      return (
        <NDrawer
          width="99%"
          placement="left"
          v-model:show={props.visible.value}
          on-esc={props.onClose}
        >
          <NDrawerContent title="setting" closable>
            <p>Settings</p>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
